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
  - `proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;` 多个 Nginx 反向代理的情况下，例如 CND，后端的 Web 服务器可以通过 X-Forwarded-For 获取用户真实 IP
  - `proxy_set_header Host $host;` 允许重新定义或者添加发往后端服务器的 host
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
    rewrite ^/apis/(.*)$ /$1break;

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

rewrite 就是集合正则表达式和标志位实现 url 重写和重定向。rewrite 只能放在 server、location 上下文和 if 判断中，并且只能对域名后边的除去传参外的字符串起作用。如果想对域名或参数字符串起作用，可以使用全局变量匹配，也可以使用 proxy_pass 反向代理。

例如 `http://microloan-sms-platform.yxapp.xyz/proxy/sms/task/querydeleted?page=1&pagesize=10` 只能对 /proxy/sms/task/querydeleted 进行重写。

rewrite 规则后边，通常会带有 flag 标志位：

- last：表示完成 rewrite
- break：停止执行当前虚拟机的后续 rewrite 指令集
- redirect：返回 302 临时重定向，地址栏会显示跳转后的地址
- permanent：返回 301 永久重定向，地址栏会显示跳转后的地址

last 和 break 的区别：

- last 一般写在 server 和 if 中，而 break 一般使用在 location 中
- last 不终止重写后的 url 匹配，即新的 url 会再从 server 走一遍匹配流程，而 break 终止重写后的匹配
- break 和 last 都能阻止继续执行后面的 rewrite 指令。

## 负载均衡

### 概念

一般情况下，客户端发送多个请求到服务器，服务器处理请求，其中一部分可能要操作一些资源比如数据库、静态资源等，服务器处理完毕后，再讲结果返回给客户端。这种模式对于早期的系统来说，功能要求不复杂，且并发请求想对较少的情况下还能胜任，成本也低。

随着信息数量不断增长，访问量和数据量飞速增长，以及系统业务复杂度持续增加，并发量特别大时，服务器容易崩。请求爆发式增长的情况下，单个机器性能再强劲也无法满足要求了，这个时候集群的概念产生了，单个服务器解决不了的问题，可以使用多个服务器，然后将请求分发到各个服务器上。

将负载分发到不同的服务器，这就是**负载均衡**，核心是分摊压力，Nginx 实现负载均衡，一般来说指的是将请求转发给服务器集群。

### 配置负载均衡

upstream 是 Nginx 的 HTTP Upstream 模块，这个模块通过一个简单的调度算法来实现客户端 IP 到后端服务器的负载均衡。

Nginx 的负载均衡目前支持 4 种调度算法：

- 轮询（默认）：每个请求按时间顺序逐一分配到不同的后端服务器，如果后端某台服务器宕机会被自动剔除，使用户访问不受影响。 Weight 指定轮询权值，Weight 越大，分配到的访问几率越高，主要用于后端每个服务器性能不均的情况。
- ip_hash：每个请求按访问 IP 的 hash 结果分配，这样来自同一个 IP 的访客固定访问一个后端服务器，有效解决了动态网页存在的 session 共享的问题。
- fair：更加智能的负载均衡算法，可以依据页面大小和加载时间长短智能地进行负载均衡，也就是根据后端服务器的响应时间来分配请求，响应时间短的优先分配。Nginx 本身是不支持 fair 的，如果需要使用这种调度算法，必须下载 Nginx 的 upstream-fair 模块。
- url_hash：按访问 url 的 hash 结果来分配请求，使每个 url 定向到同一个后端服务器，可以进一步提高后端缓存服务器的效率。Nginx 本身是不支持 url_hash 的，如果需要使用这种调度算法，必须安装 Nginx 的 hash 软件包。

upstream 可以设定每个后端服务器在负载均衡调度中的状态，支持状态参数：

- down：表示当前的 server 暂时不参与负载均衡
- backup：预留的备份机器。当其他所有的非 backup 机器出现故障或者忙的时候，才会请求 backup 机器，因此这台机器的压力最轻
- max_fails：允许请求失败的次数，默认为 1.当超过最大次数时，返回 proxy_next_upstream 模块定义的错误
- fail_timeout：在经历了 max_fails 次失败后，暂定服务的时间。max_fails 可以和 fail_timeout 一起使用。

**注意：当负载均衡调度算法为 ip_hash 时，后端服务器在负载均衡调度中的状态不能是 weight 和 backup**

```nginx
http {
  upstream myserver {
    ip_hash;
    server 127.0.0.1:8080;
    server 127.0.0.1:8081 down;
    server 127.0.0.1:8082 weight=10; # weight 不写默认为 1
    server 127.0.0.1:8083 max_fails=3 fail_timeout=20s;
  }

  server {
    location / {
      proxy_pass http://myserver;
    }
  }
}
```

## 配置动静分离

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

## 推荐阅读

- [漫话：如何给女朋友解释什么是反向代理？](https://mp.weixin.qq.com/s/T7vd5heXXUjnbV-1wHg8xg)
- [Nginx 代理服务](https://segmentfault.com/a/1190000015921504)
