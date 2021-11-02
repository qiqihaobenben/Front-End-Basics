# Nginx 实操-常用配置

## 适配 PC 与 移动环境

现在很多网站都同时存在 PC 站和 H5 站，因此根据用户的浏览环境自动切换站点是很常见的需求。Nginx 可以通过内置变量 `$http_user_agent`，获取到请求客户端的 userAgent，从而知道用户处于移动端还是 PC 端，进而控制重定向到 PC 站 还是 H5 站，例如 PC 端站点为 `example.com`，H5 端站点为 `h5.example.com`，就可以在 PC 端配置 Nginx ：

```nginx
server {
  listen 80;
  server_name example.com;
  location / {
    root /usr/local/app/pc; #pc 的 html 路径
    #获取 userAgent
    if ($http_user_agent ~* '(Android|webOS|iPhone|iPad|BlackBerry)') {
      rewrite ^.+ http://h5.example.com;
    }
    index index.html;
  }
}
```

## 图片处理

在前端开发中，经常需要不同尺寸的图片。现在的云存储基本对图片都提供有处理服务（一般是通过在图片链接上加参数）。用 Nginx 可以通过几十行配置，搭建出一个属于自己的本地图片处理服务，完全能够满足日常对图片的裁剪、缩放、旋转、图片品质等处理需求。需要用到 [`ngx_http_image_filter_module`](http://nginx.org/en/docs/http/ngx_http_image_filter_module.html) 模块，这个模块是非基本模块，需要安装。此外还可以通过 proxy_cache 配置 Nginx 缓存，避免每次请求都重新处理图片，减少 Nginx 服务器处理压力，还可以通过和 [`nginx-upload-module`](http://www.nginxguts.com/nginx-upload-module/) 一起使用加入图片上传的功能。

图片缩放功能示例：

```nginx
# example.com/img/ 路径会进行图片处理
location ~* /image/(.+)$ {
  alias /home/www/static/image/$1; # 图片服务端存储地址
  set $width -; # 图片宽度默认值
  set $height -; # 图片高度默认值
  if($arg_width != "") {
    set $width $arg_width;
  }
  if($arg_height != "") {
    set $height $arg_height;
  }

  image_filter resize $width $height; # 设置图片宽高
  image_filter_buffer 10M; # 设置 Nginx 读取图片的最大 buffer
  image_filter_interlace on; # 是否开启图片图像隔行扫描
  error_page 500 = 500.png; # 图片处理错误提示图，例如缩放参数不是数字
}
```

## 页面内容修改

Nginx 可以通过向页面底部或者顶部插入额外的 css 和 js 文件，从而实现修改页面内容。这个功能需要额外模块支持，例如 [`nginx-http-footer-filter`](https://github.com/alibaba/nginx-http-footer-filter) 或者 [`ngx_http_addition_module`](http://nginx.org/en/docs/http/ngx_http_addition_module.html)。工作中，经常需要切换各种测试环境，而通过 switchhosts 等工具切换后，有时还需要清理浏览器 dns 缓存。可以通过页面内容修改 + Nginx 反向代理来实现轻松快捷的环境切换。这里首先在本地编写一段 js 代码（switchhost.js）里面的逻辑是：在页面插入 hosts 切换菜单以及点击具体某个环境时，将该 host 的 ip 和 hostname 存储在 cookie 中，最后刷新页面；接着编写一段 css 代码（switchhost.css）用来设置该 hosts 切换菜单的样式。最后 Nginx 脚本配置：

```nginx
server {
  listen 80;
  listen 443 ssl;
  server_name example.com;
  set $root /home/www/example;
  charset utf-8;
  ssl_certificate /usr/local/nginx/conf/ssl/example.com.crt;
  ssl_certificate_key /usr/local/nginx/conf/ssl/exmaple.com.key;

  # 设置默认 host，一般默认为线上 host，这里是随便写的
  set $switch_host '8,8,8,8';
  # 设置默认 hostname，一般默认为线上 'online'
  set $switch_hostname '';
  # 从 cookie 中获取环境 ip
  if ($http_cookie ~* "switch_host=(.+?)(?=;|$)") {
    set $switch_host $1;
  }

  # 从 cookie 中获取环境名称
  if ($http_cookie ~* "switch_hostname=(.+?)(?=;|$)") {
    set $switch_hostname $1;
  }

  location / {
    index index.html;
    proxy_set_header Host $host;
    # 把 html 页面的 gzip 压缩去掉，不然 sub_filter 无法替换内容
    proxy_set_header Accept-Encoding;
    # 反向代理到实际服务器 ip
    proxy_pass http://$switch_host:80;
    # 全部替换
    sub_filter_once off;
    # ngx_http_addition_module 模块替换内容
    # 这里在头部插入一段 css，内容是 hosts 切换菜单的 css 样式
    sub_filter '</head>' '</head><link rel="stylesheet" type="text/css" media="screen" href="/local/switchhost.css" />';

    # 这里使用另一个模块 nginx-http-footer-filter，其实上面的模块就行，只是为了展示用法
    # 最后插入一段 js，内容是 hosts 切换菜单的 js 逻辑
    set $injected '<script src="/local/switchhost.js"></script>';
    footer '$injected';
  }

  # 对于 /local/ 请求，优先匹配本地文件
  # 所以上面的 /local/switchhost.css，/local/switchhost.js 会从本地获取
  location ^~ /local/ {
    root $root;
  }
}
```

这个功能其实为 Nginx 在前端开发中的应用提供了无限可能。例如，可以通过区分本地、测试和线上环境，为本地、测试环境页面增加很多开发辅助功能：给本地页面增加一个常驻二维码便于手机端扫码调试；本地调试线上页面时，在 js 文件底部加入 sourceMappingURL，便于本地 debug 等等。

## 请求限制

对于大流量恶意的访问，会造成带宽的浪费，给服务器增加压力。可以通过 Nginx 对于同一 IP 的连接数以及并发数进行限制。合理的控制还可以用来防止 DDos 和 CC 攻击。

关于请求限制主要使用 Nginx 默认集成的 2 个模块：

- ngx_http_limit_conn_module 连接频率限制模块
- ngx_http_limit_req_module 请求频率限制模块

涉及到的配置主要是:

- limit_req_zone 限制请求数
- limit_conn_zone 限制并发连接数

## 图片防盗链

### 简单有效的防盗链手段：referer 模块

使用场景例如某网站通过 url 引用了你的页面，当用户在浏览器上点击 url 时，http 请求的头部中会通过 referer 头部将该网站当前页面的 url 带上，告诉服务器本次请求是由这个页面发起的。通过 referer 模块，用 invalid_referer 变量根据配置判断 referer 头部是否合法。从而拒绝第三方网站访问我们站点的资源。referer 模块默认编译进 Nginx。

#### valid_referers 指令

语法 `valid_referers none | blocked | server_names | string...`

- none 允许缺失 referer 头部的请求访问
- block 允许 referer 头部没有对应的值的请求访问
- server_names 若 referer 中站点域名与 server_name 中本机域名某个匹配，则允许该请求访问。
- string 域名及 URL 如果是字符串，域名可在前缀或者后缀中含有 `*` 通配符，若 referer 头部的值匹配字符串后，则允许请求访问；域名如果是正则表达式，若 referer 头部的值匹配正则表达式后，则允许请求访问

**valid_referers 指令后面可以同时携带多个参数，表示多个 referer 头部都生效。模块还会提供出一个 `$invalid_referer` 变量，允许访问时变量值为空，不允许访问时变量值为 1。**

```nginx
server {
  listen 80;
  server_name *.text.com;

  # 图片防盗链
  location ~* \.(gif|jpg|jpeg|png|bmp|swf)$ {
    valid_referers none blocked server_names ~\.google\. ~\.baidu\. *.qq.com; # 允许没有 referer 头或者值为空，或者google、baidu、qq.com。
    if ($invalid_referer) {
      return 403;
    }
  }
}
```

### secure_link 模块防盗链

通过验证 URL 中哈希值的方式防盗链，该模块默认未编译进 Nginx。

实现的功能过程是由某服务器（也可以是 Nginx）生成加密后的安全链接 url，返回给客户端。客户端使用安全 url 访问 Nginx，由 Nginx 的 `$secure_link` 变量判断判断是否验证通过。

实现的原理是：

- 哈希算法是不可逆的
- 客户端只能拿到执行过哈希算法的 URL
- 仅生成 URL 的服务器、验证 URL 是否安全的 Nginx 这二者，才保存执行哈希算法前的原始字符串
- 原始字符串通常由以下部分有序组成：
  - 资源位置，例如 HTTP 中指定资源的 URI，防止攻击者拿到一个安全 URI 后可以访问任意资源
  - 用户信息，例如用户 IP 地址，限制其他用户盗用安全 URI
  - 时间戳，使安全 URI 及时过期
  - 密钥，仅服务器端拥有，增加攻击者猜测出原始字符串的难度

模块提供了两个变量：

- `$secure_link` 值为空字符串，表示验证不通过，值为 0，表示 URL 过期，值为 1，表示验证通过
- `$secure_link_expires` 时间戳的值

#### secure_link 指令

有两个参数，第一个参数是哈希值，第二个参数是时间戳

- 首先使用命令行生成安全链接
  - 生成 MD5 `echo -n '时间戳URL客户端IP密钥' | openssl md5 -binary | openssl base64 | tr +/ -_ | tr -d =` 例如 `echo -n '2147483647/test1.txt116.62.160.193 secret' | openssl md5 -binary | openssl base64 | tr +/ -_ | tr -d =`
  - 原请求 `/test1.txt?md5=md5生成值&expires=时间戳（如 2147483647）`
- Nginx 配置
  - `secure_link $arg_md5,$arg_expires;`
  - `secure_link_md5 "$secure_link_expires$uri$remote_addr secret";`

#### secure_link_secret 指令

采用仅对 URI 进行哈希的简单办法。就是将请求 URL 分为三个部分：/prefix/hash/link，Hash 生成方式是对 "link 密钥" 做 md5 哈希求值，在 Nginx 中使用 secure_link_secret secret; 配置密钥。

- 命令行生成安全连接
  - 原请求 `link`
  - 生成的安全请求 `/prefix/md5/link`
  - 生成 md5 `echo -n 'linksecret' | openssl -md5 -hex` 例如 `echo -n 'test1.txtsecret2' | openssl md5 -hex`
- Nginx 配置
  - `secure_link_secret secret2`;

## 单页面项目 history 路由配置

```nginx
server {
  listen 80;
  server_name test.com;

  location / {
    root /usr/local/app/dist; # 前端打包后的文件夹
    index index.html index.htm;
    try_files $uri $uri/ /index.html @rewrites; # 默认目录下的 index.html，如果都不存在则重定向

    expires -1; # 首页一般没有强制缓存
    add_header Cache-Control no-cache;
  }

  location @rewrites { // 重定向设置
    rewrite ^(.+)$ /index.html break;
  }
}
```

## 请求过滤

### 过滤指定 user_agent

Nginx 可以禁止指定的浏览器和爬虫框架访问：

```nginx
# 禁止 user_agent 为 baidu、360和sohu，~* 表示不区分大小写匹配
if ($http_user_agent ~* 'baidu|360|sohu') {
  return 404;
}

# 禁止 Scrapy 等工具的抓取
if ($http_user_agent ~* (Scrapy|Curl|HttpClient)) {
  return 403;
}
```

### 根据请求类型过滤

```nginx
# 非指定请求就返回 403
if ($request_method !~ ^(GET|POST|HEAD)$) {
  return 403;
}
```

### 根据状态码过滤

```nginx
error_page 502 503 /50x.html；
location = /50x.html {
  root /usr/share/nginx/html;
}
```

这样实际上是一个内部跳转，当访问出现 502、503 的时候就能返回 50x.html 中的内容，这里需要注意是否可以找到 50x.html 页面，所以加了个 location 保证找到自定义的 50x 页面。

### 根据 URL 名称过滤

```nginx
if ($host = 'ab.com') {
  # 其中，$1 是取自 regex 部分 () 里的内容，匹配成功后跳转到的 URL
  rewrite ^/(.*)$ http://www.ab.com/$1 permanent;
}

location /test {
  # /test 全部重定向到首页
  rewrite ^(.*)$ /index.html redirect;
}
```

## 泛域名路径分离

这是一个非常实用的技能，我们可能需要配置一些二级或者三级域名，希望通过 Nginx 自动指向对应目录，比如：

1. test1.com 自动指向 /usr/local/html/test1 服务器地址；
2. test2.com 自动指向 /usr/local/html/test2 服务器地址；

```nginx
server {
  listren 80;
  server_name ~^(\w+)\.com$;

  root /usr/local/html/$1;
}
```
