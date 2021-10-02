# Nginx 实操-反向代理和负载均衡

## 反向代理

### 概念

#### 正向代理（Forward Proxy）

一般的访问流程是客户端直接向目标服务器发送请求并获取内容。使用正向代理后，客户端改为向代理服务器发送请求，并指定目标服务器（原始服务器），然后由代理服务器和原始服务器通信，转发请求并把获取的内容返回给客服端。正向代理隐藏了真实的客户端，为客户端代理收发请求，使真实客户端对目标服务器不可见。例如 VPN。

#### 反向代理（Reverse Proxy）

与一般访问流程相比，使用反向代理后，直接收到请求的服务器是代理服务器，然后代理服务器将请求转发给内部网络上真正进行处理的服务器，最后代理服务器把得到的结果返回给客户端。反向代理隐藏了真实的服务器，为服务器代理收发请求，使真实服务器对客户端不可见。一般在处理跨域请求的时候常用。现在基本上所有的大型网站都设置了反向代理。

简单来说，一般给客户端做代理的都是正向代理，给服务器做代理的都是反向代理。

### 反向代理指令

- proxy_pass：设置要代理的 uri，可以对应 `upstream` 负载均衡器，可以是 `http://ip:port`，可以是 Unix 域套接字路径，也可以是正则表达式。
- proxy_redirect：用于修改后端服务器返回的响应头中的 Location 和 Refresh
- proxy_set_header：在将客户端请求发送给后端服务器之前，更改来自客户端的请求头信息
  - `proxy_set_hedaer X-Real-IP $remote_addr;` 获取用户的真实 IP 地址
  - `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;` 多个 Nginx 反向代理的情况下，例如 CND，后端的Web服务器可以通过 X-Forwarded-For 获取用户真实 IP
  - `proxy_set_header Host $host;` 允许重新定义或者添加发往后端服务器的host
- proxy_connect_timeout：配置 Nginx 与后端服务器尝试建立连接的超时时间
- proxy_read_timeout: 配置 Nginx 向后端服务器组发出 read 请求后的超时时间
- proxy_send_timeout：配置 Nginx 向后端服务器组发出 write 请求后的超时时间
- client_max_body_size：客户端允许请求的最大单个文件字节数
- client_body_buffer_size：缓冲区代理缓冲客户端请求的最大字节数
- proxy_buffering：是否打开后端响应内容的缓冲区
- proxy_buffer_size：后端服务器的响应头的缓冲区大小
- proxy_buffers：缓冲区，一般设置的比较大，以应付大网页
- proxy_busy_buffers_size：不是独立的空间，是 proxy_buffers 和 proxy_buffer_size 的一部分
- proxy_temp_file_write_size：缓存区临时文件大小

### 反向代理配置


```nginx
location / {
  proxy_pass http://127.0.0.1:8080;

  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

  proxy_connect_timeout 30;
  proxy_send_timeout 60;
  proxy_read_timeout 60;

  proxy_buffering on;
  proxy_buffer_size 32k;
  proxy_buffers 4 128k;
  proxy_busy_buffers_size 256k;
  proxy_max_temp_file_size 256k;
}
```

### 反向代理的作用

- 解决跨域
- 负载均衡
- 复用 DNS 查询
- 加密和SSL加速
- 缓存静态资源
- 安全
- 外网发布

## 解决跨域

### 跨域

在浏览器上当前访问的网站向另一个网站发送请求获取数据的过程就是 **跨域请求**

跨域是浏览器的同源策略决定的，是一个重要的浏览器安全策略，用于限制一个 origin 的文档或者它加载的脚本与另一个源的资源进行交互，它能够帮助阻隔恶意文档，减少可能被攻击的媒介，可以使用 CORS 配置解除这个限制，另外也可以使用上面说的反向代理来解决。

#### 简单请求

如果同时满足下面两个条件，就属于简单请求：

1. 请求方法是 `HEAD`、`GET`、`POST` 三种之一；
2. HTTP请求头字段不超过这几个：`Accept`、`Accept-Language`、`Content-Language`、`Last-Event-ID`。`Content-Type` 只限于三个值 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`；

对于简单请求，浏览器会在请求头中增加 `Origin` 字段后直接发出，`Origin` 字段用来说明本次请求来自哪个源（协议+域名+端口）。

如果服务器发现 `Origin` 指定的源不在许可范围内，服务器会返回一个正常的 HTTP 响应，浏览器发现响应头中没有包含 `Access-Control-Allow-Origin` 字段，就抛出一个错误给 XHR 的 `error` 事件；

如果服务器发现 `Origin` 指定的域名在许可范围内，服务器返回的响应头中会多出几个 `Access-Control-` 开头的头信息字段。

#### 非简单请求

凡是不同时满足简单请求的两个条件的，都属于非简单请求。

非简单请求是那种对服务器有特殊要求的请求，比如请求方法是 `PUT` 或 `DELETE`，或 `Content-Type` 值为 `application/json`。浏览器会在正式通信之前，发送一次 HTTP 预检 `OPTIONS` 请求，先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些 HTTP 请求方法和头信息字段。只有得到肯定答复，浏览器才会发出正式的 `XHR` 请求，否则报错。


## 负载均衡


## 推荐阅读

- [漫话：如何给女朋友解释什么是反向代理？](https://mp.weixin.qq.com/s/T7vd5heXXUjnbV-1wHg8xg)
- [Nginx 代理服务](https://segmentfault.com/a/1190000015921504)
