# Nginx 实操-代理相关

## 正向代理（Forward Proxy）

一般的访问流程是客户端直接向目标服务器发送请求并获取内容。使用正向代理后，客户端改为向代理服务器发送请求，并指定目标服务器（原始服务器），然后由代理服务器和原始服务器通信，转发请求并把获取的内容返回给客服端。正向代理隐藏了真实的客户端，为客户端代理收发请求，使真实客户端对目标服务器不可见。例如 VPN。

### 正向代理配置

```nginx
server {
  resolver 8.8.8.8; # 谷歌的域名解析地址
  resolver_timeout 5s; // 设置超时时间

  location / {
    # 当客户端请求我的时候，我会把请求转发给它
    proxy_pass http://$host$request_uri;
  }
}
```

## 反向代理（Reverse Proxy）

与一般访问流程相比，使用反向代理后，直接收到请求的服务器是代理服务器，然后代理服务器将请求转发给内部网络上真正进行处理的服务器，最后代理服务器把得到的结果返回给客户端。反向代理隐藏了真实的服务器，为服务器代理收发请求，使真实服务器对客户端不可见。一般在处理跨域请求的时候常用。现在基本上所有的大型网站都设置了反向代理。

简单来说，一般给客户端做代理的都是正向代理，给服务器做代理的都是反向代理。

### 反向代理指令

- proxy_pass：设置要代理的 URL，URL 具体要求看下面的详解，proxy_pass 在处理 content 阶段生效，优先级在 content 阶段中时最高的。
  - URL 必须以 http:// 或者 https:// 开头，接下来是域名、IP、unix socket 地址或者 upstream 负载均衡器的名字，域名或者 IP 后可以加端口，最后是可选的 URI。
  - URL 中是否携带 URI，会导致发向上游请求的 URI 不同：
    - 举例说明 http://upstream1 就是不携带 URI，http://upstream1/abc 就是携带 URI
    - 不携带 URI，则将客户端请求中的 URL 直接转发给上游。location 后使用正则表达式、@ 名字时，应采用这种方式
    - 携带 URI，则对用户请求中的 URL 做如下操作：将 location 参数中匹配上的一段替换为该 URI
  - 该 URL 中可以携带变量
  - 更复杂的 URL 替换，可以在 location 内的配置添加 rewrite break 语句
- proxy_redirect：用于修改后端服务器返回的响应头中的 Location 和 Refresh
- proxy_method: 代理的请求方式，可以修改
- proxy_http_version: 代理的 http 版本，可以修改，如果要开启 keepalive ，最低版本就需要 1.1
- proxy_set_header：在将客户端请求发送给后端服务器之前，更改来自客户端的请求头信息
  - `proxy_set_hedaer X-Real-IP $remote_addr;` 获取用户的真实 IP 地址
  - `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;` 多个 Nginx 反向代理的情况下，例如 CND，后端的 Web 服务器可以通过 X-Forwarded-For 获取用户真实 IP
  - `proxy_set_header Host $host;` 允许重新定义或者添加发往后端服务器的 host
- proxy_connect_timeout：配置 Nginx 与后端服务器尝试建立连接的超时时间，即握手时间，超时后，会向客户端生成 http 响应，响应码为 502
- proxy_send_timeout：配置 Nginx 向后端服务器组发出 write 请求后的超时时间
- client_max_body_size：客户端允许请求的最大单个文件字节数，仅对请求头部中含有 Content-Length 有效超出最大长度后，返回 413 错误
- client_body_buffer_size：缓冲区代理缓冲客户端请求的最大字节数，分配规则是：若接收头部时已经接收了完全的包体，则不分配；若剩余待接收包体的长度小于 client_body_buffer_size，则仅分配所需大小；其他情况下，就分配 client_body_buffer_size 大小内存接收包体（默认为 8k 或 16k）。关闭包体缓存时，该内存上内容及时发送给上游；打开包体缓存时，该段大小内存用完时，写入临时文件，释放内存
- client_body_temp_path: 客户端包体的临时文件存放路径，默认为 client_body_temp 文件夹，开启 Nginx 后悔自动创建
- client_body_timeout: 读取包体时最大的间隔时间，读取包体时超时，则返回 408 错误
- proxy_request_buffering: 接收客户端请求包体的方式：设置为 on，收完再转发，适用的场景是客户端网速较慢、上游服务并发处理能力低、高吞吐量场景等；设置为 off，边收边发，适用的场景是更及时的响应、降低 Nginx 读写磁盘的消耗，不过一旦开始发送内容，proxy_next_upstream 功能会失效。
- proxy_buffering：是否打开上有服务响应内容的缓冲区，默认打开，即接收完整的响应包体后再进行后续的 Nginx 响应
- proxy_buffer_size：接收上游服务器的响应头的缓冲区大小，超过大小后会在 error.log 中记录 upstream sent too big header。
- proxy_buffers：缓冲区，一般设置的比较大，以应付大网页
- proxy_temp_file_write_size：缓存区临时文件每次的写入大小
- proxy_busy_buffers_size：不是独立的空间，是 proxy_buffers 和 proxy_buffer_size 的一部分，及时转发包体
- proxy_read_timeout: 配置 Nginx 向后端服务器组发出 read 请求后的超时时间

其他更多的指令查看 [ngx_http_proxy_module](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)

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
- 加密和 SSL 加速
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
2. HTTP 请求头字段不超过这几个：`Accept`、`Accept-Language`、`Content-Language`、`Last-Event-ID`。`Content-Type` 只限于三个值 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain`；

对于简单请求，浏览器会在请求头中增加 `Origin` 字段后直接发出，`Origin` 字段用来说明本次请求来自哪个源（协议+域名+端口）。

如果服务器发现 `Origin` 指定的源不在许可范围内，服务器会返回一个正常的 HTTP 响应，浏览器发现响应头中没有包含 `Access-Control-Allow-Origin` 字段，就抛出一个错误给 XHR 的 `error` 事件；

如果服务器发现 `Origin` 指定的域名在许可范围内，服务器返回的响应头中会多出几个 `Access-Control-` 开头的头信息字段。

#### 非简单请求

凡是不同时满足简单请求的两个条件的，都属于非简单请求。

非简单请求是那种对服务器有特殊要求的请求，比如请求方法是 `PUT` 或 `DELETE`，或 `Content-Type` 值为 `application/json`。浏览器会在正式通信之前，发送一次 HTTP 预检 `OPTIONS` 请求，先询问服务器，当前网页所在的域名是否在服务器的许可名单之中，以及可以使用哪些 HTTP 请求方法和头信息字段。只有得到肯定答复，浏览器才会发出正式的 `XHR` 请求，否则报错。

### 使用反向代理解决跨域

假如，前端服务地址为 `fe.chenfangxu.com` 的页面请求 `be.chenfangxu.com` 的后端服务导致跨域，可以这样配置：

```nginx
server {
  listen 8080;
  server_name fe.chenfangxu.com;

  location / {
    root /home/chenfangxu/fe;
    index index.html index.htm;
  }

  # 请求跨域，约定代理后端服务请求 path 以 /apis/ 开头
  location ^~/apis/ {
    proxy_pass be.chenfangxu.com;
    # 重写请求，将正则匹配中的第一个分组的 path 拼接到真正的请求后面，并用 break 停止后续匹配
    rewrite ^/apis/(.*)$ /$1 break;

    # 两个域名之间 cookie 的传递与回写
    proxy_cookie_domain be.chenfangxu.com fe.chenfangxu.com;
  }
}
```

这样就将 `fe.chenfangxu.com/apis/xxx` 的请求全都代理到了 `be.chenfangxu.com`，浏览器页面看起来仍然访问的前端服务器，绕过了浏览器的同源策略，从而解决跨域。

### 配置 header 解决跨域

当浏览器在访问跨域的服务器时，Nginx 可以给出另一个解决跨域的方案，就是在跨域的服务器上直接设置相关的 header，从而前端就可以无感的开发，不用把实际上访问后端的地址改成前端服务的地址，这样可适性更高。

还是`fe.chenfangxu.com` 的页面请求 `be.chenfangxu.com` 的后端服务导致跨域，可以这样配置 `be.chenfangxu.com`：

```nginx
server {
  listen 80;
  server_name be.chenfangxu.com;

  add_header 'Access-Control-Allow-Origin'$http_origin; # 全局变量获得当前请求origin，带cookie的请求不支持通配符(*)
  add_header 'Access-Control-Allow-Credentials''true'; # 为 true 可带上 cookie
  add_header 'Access-Control-Allow-Methods''GET, POST, OPTIONS'; # 允许请求方法
  add_header 'Access-Control-Allow-Headers'$http_access_control_request_headers; # 允许请求的 header，可以为通配符(*)

  if($request_method = 'OPTIONS') {
    add_header 'Access-Control-Max-Age' 1728000; # OPTIONS 请求的有效期，在有效期内不用发出另一条预检请求
    add_header 'Content-Type''text/plain; charset=utf-8';
    add_header 'Content-Length' 0;

    return 204; # 200 也可以
  }

  location / {
    root /home/chenfangxu/fe;
    index index.html index.htm;
  }
}
```

### rewrite 配置

使用反向代理解决跨域时，用到了 rewrite 指令。

rewrite 就是集合正则表达式和标志位实现 uri 重写和重定向。rewrite 只能放在 server、location 上下文和 if 判断中，并且只能对域名后边的除去传参外的字符串起作用。如果想对域名或参数字符串起作用，可以使用全局变量匹配，也可以使用 proxy_pass 反向代理。

例如 `http://microloan-sms-platform.yxapp.xyz/proxy/sms/task/querydeleted?page=1&pagesize=10` 只能对 /proxy/sms/task/querydeleted 进行重写。

rewrite 规则后边，通常会带有 flag 标志位：

- last：表示完成 rewrite
- break：停止执行当前虚拟机的后续 rewrite 指令集
- redirect：返回 302 临时重定向，地址栏会显示跳转后的地址
- permanent：返回 301 永久重定向，地址栏会显示跳转后的地址

last 和 break 的区别：

- last 一般写在 server 和 if 中，而 break 一般使用在 location 中
- last 不终止重写后的 url 匹配，即新的 url 会再从 server 走一遍匹配流程，而 break 终止重写后的匹配
- break 和 last 都能阻止继续执行后面的 rewrite 指令，但是 break 不能阻止后面的其他指令生效。

## 负载均衡

### 概念

一般情况下，客户端发送多个请求到服务器，服务器处理请求，其中一部分可能要操作一些资源比如数据库、静态资源等，服务器处理完毕后，再讲结果返回给客户端。这种模式对于早期的系统来说，功能要求不复杂，且并发请求想对较少的情况下还能胜任，成本也低。

随着信息数量不断增长，访问量和数据量飞速增长，以及系统业务复杂度持续增加，并发量特别大时，服务器容易崩。请求爆发式增长的情况下，单个机器性能再强劲也无法满足要求了，这个时候集群的概念产生了，单个服务器解决不了的问题，可以使用多个服务器，然后将请求分发到各个服务器上。

将负载分发到不同的服务器，这就是**负载均衡**，核心是分摊压力，Nginx 实现负载均衡，一般来说指的是将请求转发给服务器集群。

### 配置负载均衡

upstream 是 Nginx 的 HTTP Upstream 模块，这个模块通过一个简单的调度算法来实现客户端 IP 到后端服务器的负载均衡。

Nginx 的负载均衡目前支持 4 种调度算法：

- 轮询（默认）：正式的名称叫做**加权 Round-Robin 负载均衡算法**，是所有算法的基础，以加权轮询的方式访问 server 指令指定的上游服务，集成在 Nginx 的 upstream 框架中，每个请求按时间顺序逐一分配到不同的后端服务器，如果后端某台服务器宕机会被自动剔除，使用户访问不受影响。 Weight 指定轮询权值，Weight 越大，分配到的访问几率越高，主要用于后端每个服务器性能不均的情况。
- ip_hash：每个请求按访问 IP 的 hash 结果分配，这样来自同一个 IP 的访客固定访问一个后端服务器，有效解决了动态网页存在的 session 共享的问题。基于客户端 IP 地址的 Hash 算法实现负载均衡，是依靠 ngx_http_upstream_id_hash 模块，以客户端的 IP 地址作为 hash 算法的关键字，映射到特定的上有服务器中，对于 IPv4 地址使用前 3 个字节作为关键字，对于 IPv6 则使用完整地址，并且可以基于 realip 模块修改用于执行算法的 IP 地址。
- hash：基于任意关键字实现 hash 算法的负载均衡，依靠默认包含的 ngx_http_upstream_hash_module 模块，通过指定关键字作为 hash key，基于 hash 算法映射到特定的上游服务器中，关键字可以含有变量、字符串。可以开启一致性 hash 算法来解决扩容后的缓存失效问题。
- fair：更加智能的负载均衡算法，可以依据页面大小和加载时间长短智能地进行负载均衡，也就是根据后端服务器的响应时间来分配请求，响应时间短的优先分配。Nginx 本身是不支持 fair 的，如果需要使用这种调度算法，必须下载 Nginx 的 upstream-fair 模块。
- url_hash：按访问 url 的 hash 结果来分配请求，使每个 url 定向到同一个后端服务器，可以进一步提高后端缓存服务器的效率。Nginx 本身是不支持 url_hash 的，如果需要使用这种调度算法，必须安装 Nginx 的 hash 软件包。
- 最少连接算法：优先选择连接最少的上有服务器，依赖 ngx_http_upstream_least_conn 模块，从所有上游服务器中，找出当前并发连接数最少的一个，将请求转发到它。如果出现多个最少连接服务器的连接数都是一样的，使用 round-robin 算法。

upstream 指定一组上有服务器地址，其中，地址可以是域名、IP 地址、或者 unix socket 地址。可以在域名或者 IP 地址后加端口，如果不加端口，那么默认使用 80 端口，此外也可以设定每个后端服务器在负载均衡调度中的状态，支持状态参数：

- down：表示当前的 server 已经下线，暂时不参与负载均衡
- backup：预留的备份机器。当其他所有的非 backup 机器出现故障或者忙的时候，才会请求 backup 机器，因此这台机器的压力最轻
- max_fails：在 fail_timeout 时间段内，允许请求失败的次数，默认为 1.当超过最大次数时，返回 proxy_next_upstream 模块定义的错误，并且会在 fail_timeout 秒内这台 server 不允许再次被选择
- fail_timeout：在经历了 max_fails 次失败后，暂停服务的时间。max_fails 可以和 fail_timeout 一起使用，指定一段时间内，最大的失败次数 max_fails。

**注意：当负载均衡调度算法为 ip_hash 时，后端服务器在负载均衡调度中的状态不能是 weight 和 backup**

我们还可以对上游服务使用 keepalive 长链接，使用到的模块是 ngx_http_upstream_keepalive_module，默认是编译进 Nginx 的。功能是通过复用连接，降低 Nginx 与上游服务器建立、关闭连接的小号，提升吞吐量的同时降低时延。

```nginx
http {
  upstream myserver {
    ip_hash
    #hash user_$arg_username # 任意关键字的 hash 算法，此处就是获取url上的query 是 username 字段拼成的关键字
    server 127.0.0.1:8080;
    server 127.0.0.1:8081 down;
    server 127.0.0.1:8082 weight=10; # weight 不写默认为 1
    server 127.0.0.1:8083 max_fails=3 fail_timeout=20s;
    keepalive 32; # 最多保持 32 个请求
  }

  server {
    set_real_ip_from 116.62.160.192;
    real_ip_recursive on;
    real_ip_header X-Forwarded-For;
    location / {
      proxy_pass http://myserver;
      proxy_http_version 1.1; # http 1.1 版本开始才支持长链接，防止用户发送的http版本太低
      proxy_set_header Connection ""; # 防止用户设置 Connection "close
    }
  }
}
```

最后再说一下 upstream_zone 模块，使用共享内存使负载均衡策略对所有 worker 进程生效，它会分配出共享内存，将其他 upstream 模块定义的负载均衡策略数据、运行时每个上游服务的状态数据存放在共享内存上，以对所有 Nginx worker 进程生效。

### upstream 模块提供的变量（不含 cache）

- `$upstream_addr` 上游服务器的 IP 地址，格式为可读的字符串，例如 127.0.0.1:8012
- `$upstream_connect_time` 与上游服务建立连接消耗的时间，单位为秒，精确到毫秒
- `$upstream_header_time` 接收上有服务发回响应中 http 头部所消耗的时间，单位为秒，精确到毫秒
- `$upstream_response_time` 接收完整的上游服务响应所消耗的时间，单位为秒，精确到毫秒
- `$upstream_http_名称` 从上游服务返回的响应的头部的值
- `$upstream_bytes_received` 从上游服务接收到的响应长度，单位为字节
- `$upstream_response_length` 从上游服务返回的响应包体长度，单位为字节
- `$upstream_status` 上游服务返回的 HTTP 响应中的状态码。如果未连接上，该变量值为 502
- `$upstream_cookie_名称` 从上游服务发回的响应头 Set-Cookie 中取出的 cookie 值
- `$upstream_trailer_名称` 从上游服务的响应尾部取到的值

## 配置动静分离

为了加快网站的解析速度，可以把动态页面和静态页面由不同的服务器解析，加快解析速度，降低原来单个服务器的压力。

动态和静态的请求分开，方式主要有两种，一种是纯粹把静态文件独立成单独的域名，放在独立的服务器上，例如 CDN ，是目前主流推崇的方案。另外一种方案就是动态和静态文件混合在一起发布，通过 Nginx 配置来分开。

一般来说，都需要将动态资源和静态资源分开，由于 Nginx 的高并发和静态资源缓存等特性，经常把静态资源部署在 Nginx 上。如果请求的是静态资源，直接到静态资源目录获取资源，如果是动态资源的请求，则利用反向代理的原理，把请求转发给对应后台应用去处理，从而实现动静分离。

通过 location 指定不同的后缀名实现不同的请求转发，通过 expires 参数设置，可以使浏览器进行缓存，减少与服务器之间的请求和流量。

```nginx
# 所有静态请求都由 nginx 处理，存放目录为 html
location ~ \.(gif|jpg|jpeg|png|bmp|swf|css|js)$ {
    root    /home/chenfangxu/html;
    expires     10h; # 设置过期时间为10小时
}

# 所有动态请求都转发给 tomcat 处理
location ~ \.(jsp|do)$ {
    proxy_pass  127.0.0.1:8888;
}
```

## 设置读写分离

```nginx
server {
  listen 80;
  server_name localhost;

  location / {
    proxy_pass http://192.128.18.10
    if($request_method = "PUT") {
      proxy_pass http://192.128.18.11;
    }
  }
}
```

## 代理缓存

Nginx 的 http_proxy 模块，提供类似 Squid 的缓存功能，使用 `proxy_cache_path` 配置。

Nginx 可以对访问过的内容在 Nginx 代理服务器本地建立副本，这样在一段时间内再次访问该数据，就不需要通过 Nginx 代理服务器再次向后端服务器发出请求，减小数据传输延迟，提高访问速度。

```nginx
proxy_cache_path usr/local/cache levels=1:2 keys_zone=my_cache:10m;

server {
  listen       80;
  server_name  test.com;

  location / {
      proxy_cache my_cache;
      proxy_pass http://127.0.0.1:8888;
      proxy_set_header Host $host;
  }
}
```

上面的配置表示： Nginx 提供一块 10M 的内存用于缓存，名字为 my_cache，levels 等级为 1:2，缓存存放的路径未 `usr/local/cache`。

## 推荐阅读

- [漫话：如何给女朋友解释什么是反向代理？](https://mp.weixin.qq.com/s/T7vd5heXXUjnbV-1wHg8xg)
- [Nginx 代理服务](https://segmentfault.com/a/1190000015921504)
