# HTTP 缓存

作为网站性能优化的方式之一，浏览器请求过某些文件后，可以将一些不怎么变化的静态文件缓存起来，这样做可以节省 HTTP 请求，既能降低服务器的带宽消耗，也能够提高用户的访问速度。

## 强缓存

强缓存是指浏览器在请求资源时，直接从本地缓存中获取资源，而无需向服务器发送请求。

### Expires

服务器通过设置 Expires 响应头来指定资源的过期时间，浏览器会根据这个过期时间来判断是直接从本地缓存中加载资源，还是重新向服务器请求资源。

它是 HTTP/1.0 版本的响应头字段，已逐渐被弃用。

```js
const expirationTime = new Date(Date.now() + 3600000) // 当前时间加上1小时的毫秒数
res.set('Expires', expirationTime.toUTCString())
```

#### 存在的问题

Expires 使用的是服务器时间，如果服务器时间和客户端时间不一致，可能会导致缓存失效。

### Cache-Control

Cache-Control 是 HTTP/1.1 引入的响应头字段，用于控制缓存策略，提供了丰富的缓存控制选项，常用的指令有：max-age、no-store、no-cache 等，max-age 对应一个以秒为单位的时间值，表示资源在本地缓存中有效的时间，它比 Expires 更精确，更强大。

#### Cache-Control 指令

- max-age： 指定资源在缓存中的最大有效期，以秒为单位。例如：Cache-Control: max-age=3600 表示资源在缓存中有效期为 3600 秒（1 小时）。
- s-maxage=<seconds> ：仅适用于共享缓存（如 CDN），优先级高于 max-age。
- public： 表示响应可以被任意缓存（包括客户端和代理服务器）缓存。例如：Cache-Control: public。
- private： 默认值，表示响应只能被客户端缓存，不允许被代理服务器缓存。例如：Cache-Control: private。
- immutable ：指示资源不会随时间改变，可以永远缓存。
- no-cache： 强制缓存重新验证，即使缓存中有副本，也要向服务器检查缓存的有效性。。例如：Cache-Control: no-cache。
- no-store： 表示禁止缓存存储任何关于请求和响应的内容。每次都需要向服务器发送请求获取最新的资源。例如：Cache-Control: no-store。
- must-revalidate： 指示缓存必须在过期之后重新验证资源的有效性。如果验证失败，则必须向服务器重新获取资源。例如：Cache-Control: must-revalidate。
- proxy-revalidate ：与 must-revalidate 类似，但仅适用于共享缓存。
- no-transform： 告知中间缓存服务器不要修改响应的内容，保持原样传递给客户端。例如：Cache-Control: no-transform。

有缓存效果的指令：public，private，max-age，s-maxage，immutable。
没有缓存效果或限制缓存的指令：no-cache，no-store，must-revalidate，proxy-revalidate，no-transform。

Cache-Control 的值是可以组合使用的。通过组合不同的指令，可以更精确地控制缓存行为。以下是一些常见的组合用法和示例：

```js
// 设置资源的 Cache-Control 指令为 public，有效期为1小时
app.use(express.static('public', { maxAge: 3600, public: true }))

app.get('/example', (req, res) => {
  // 返回示例文本，并设置 Cache-Control 指令为 no-cache
  res.set('Cache-Control', 'no-cache')
  res.send('Hello, World!')
})
```

在上述代码中，我们通过 Express 的静态文件中间件设置了静态资源的 Cache-Control 指令为 max-age=3600, public，表示资源在缓存中的有效期为 1 小时，并且允许被公共缓存（包括客户端和代理服务器）缓存。而对于 /example 路径的请求，我们设置了 Cache-Control: no-cache，告诉浏览器不要直接使用缓存，需要向服务器发送请求进行验证。

### 强缓存触发条件

浏览器请求资源得到强缓存响应头时，浏览器会将该资源缓存到本地，当浏览器下一次访问该资源时，同时满足以下 3 个条件，浏览器会直接使用本地资源，不发起 HTTP 请求。

1. 两次请求的 URL 完全相同（包括 host、pathname、query）
2. 请求的动作是 GET
3. 请求头不带有 Cache-Control 是 no-cache、no-store、max-age=0 ，pragma 是 no-cache 这两个信息。

> 在 HTTP/1.0 中，Pragma: no-cache 的作用是确保每次请求都会向服务器请求最新的数据，即使有缓存也会被忽略。尽管 Pragma: no-cache 在过去被广泛使用，但随着 HTTP/1.1 的普及和引入了更为强大的缓存控制机制 Cache-Control，Pragma: no-cache 已经逐渐被弃用。

### 强缓存失效场景

1. 用户清空缓存
2. 强制刷新：进行强制刷新操作会忽略缓存，并向服务器重新请求资源。
3. 通过地址栏访问

根据浏览器的标准，通过地址栏访问、以及强制刷新网页的时候，HTTP 请求头自动会带上 Cache-Control: no-cache 和 Pragma: no-cache 的信息。只要有这两个请求头之一，浏览器就会忽略响应头中的 Cache-Control 字段。

### 强缓存引发的问题

通常，在开发 Web 应用时，服务器都会带有强缓存策略。一般的网站，静态资源的内容还会被放到 CDN（内容分发网络）中，以提升访问速度。CDN 网关会给资源文件添加很长时间的强缓存策略甚至是永久的缓存。所以我们**更新 Web 应用时，如果有部分静态资源文件，比如图片、JS、CSS 的内容改变，但是文件名没有改变，应用更新后，会发现 html 内容更新了，而页面中的图片、脚本还是旧的，但是用浏览器地址栏访问这些文件，看到的又是新的**。产生这种“奇怪”的现象，就是**因为我们浏览器的强缓存策略，在不是通过地址栏访问资源的情况下，需要强制刷新才能更新资源**。

我们无法强迫用户去强制刷新浏览器，所以一般来说，Web 应用更新时应该主动变更修改过的资源文件的 URL。要改变 URL，我们可以修改文件名，或者在 URL 上增加随着发布版本改变的 query 字段，以避免强缓存被触发。这个步骤在现在的 Web 开发中，一般交给工程化脚本去完成。

## 协商缓存

协商缓存是以 HTTP 内容协商的方式来实现缓存，具体是指浏览器在本地缓存失效后，向服务器发送请求，服务器通过比较资源的最后修改时间（Last-Modified）和实体标签（ETag）来决定是否需要返回最新的资源或告知浏览器直接使用缓存的资源。

强缓存的使用条件比较严格，对浏览器地址栏访问的资源无效。协商缓存弥补了这个问题，可以缓存地址栏访问的文件

### Last-Modified

1. 浏览器发起 HTTP 请求，服务器可以返回 Last-Modified 响应头，这个响应头的值是一个时间戳。
2. 如果服务器这么做了，那么浏览器会缓存这个资源
3. 在之后请求该资源的时候，会带有 if-modified-since 请求头，它的值是上一次 Last-Modified 响应头中的时间戳。
4. 服务器收到带有 if-modified-since 请求头的请求，根据请求头中的时间戳，对文件进行判断
5. 如果文件内容在该时间戳之后到当前时间里没有被修改，那么服务器返回一个 304 响应，该响应表示只有 HEAD 没有 BODY。浏览器如果收到 304 响应，就会以缓存的内容作为 BODY。

```js
const stats = fs.statSync(filePath)
const timeStamp = req.headers['if-modified-since']
let status = 200
if (timeStamp && Number(timeStamp) === stats.mtimeMs) {
  // 如果timeStamp和stats.mtimeMS相等，说明文件内容没有修改
  status = 304
}
res.writeHead(status, {
  'Cache-Control': 'max-age=86400', // 强缓存一天
  'Last-Modified': stats.mtimeMs, // 协商缓存响应头
})
```

### ETag

ETag（实体标签）是服务器响应请求时发送给客户端的一个标识符，代表当前资源的版本。当资源更新时，ETag 也会更新。

它的机制和 Last-Modified 大同小异，只是把 Last-Modified 的时间戳换成 Etag 签名，相应地把 If-Modified-Since 字段换成 If-None-Match 字段。Etag 的值可以用资源文件的 MD5 或 sha 签名。

```js
const fs = require('fs')
const crypto = require('crypto')
const http = require('http')

// 生成 ETag，通常使用文件内容的哈希值
function generateETag(content) {
  return crypto.createHash('md5').update(content).digest('hex')
}

http
  .createServer((req, res) => {
    const filePath = './path/to/your/file' // 文件路径
    const fileContent = fs.readFileSync(filePath)
    const etag = generateETag(fileContent)

    // 检查请求头中的 If-None-Match 值是否与当前 ETag 相等
    const clientETag = req.headers['if-none-match']
    if (clientETag && clientETag === etag) {
      // ETag 相等，返回 304，不需要发送文件内容
      res.writeHead(304, {
        'Cache-Control': 'max-age=86400', // 强缓存一天
      })
      res.end()
    } else {
      // ETag 不同，发送新的文件内容
      res.writeHead(200, {
        'Cache-Control': 'max-age=86400', // 强缓存一天
        ETag: etag, // 发送新的 ETag
      })
      res.end(fileContent)
    }
  })
  .listen(3000)
```

### 协商缓存为什么有两种？

因为，有时候我们的网站是分布式部署在多台服务器上，一个资源文件可能在每台服务器上都有副本，相应地资源文件被修改的时候，新的文件要同步到各个服务器上，导致各个文件副本的修改时间不一定相同。那么当用户一次访问请求的服务器和另一次访问请求的服务器不同时，就有可能因为两个文件副本的修改时间不同而使得 Last-Modified 形式的协商缓存失效。

如果这种情况采用 Etag 形式的协商缓存，根据文件内容而不是修改时间来判断缓存，就不会有这个问题了。

### 协商缓存失效场景

浏览器的强制刷新也可以清除协商缓存，因为当浏览器强制刷新的时候，请求头不会带上 if-modified-since 或 if-none-match 信息。
