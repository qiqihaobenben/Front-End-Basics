# Nginx 常用技巧

## 适配 PC 与 移动环境

现在很多网站都同时存在 PC 站和 H5 站，因此根据用户的浏览环境自动切换站点是很常见的需求。Nginx 可以通过内置变量 `$http_user_agent`，获取到请求客户端的 userAgent，从而知道用户处于移动端还是 PC 端，进而控制重定向到 PC站 还是 H5 站，例如 PC 端站点为 `example.com`，H5 端站点为 `h5.example.com`，就可以在 PC 端配置 Nginx ：

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
  image_filter_interlace on; 是否开启图片图像隔行扫描
  error_page 500 = 500.png; # 图片处理错误提示图，例如缩放参数不是数字
}
```

## 页面内容修改

Nginx 可以通过向页面底部或者顶部插入而外的 css 和 js 文件，从而实现修改页面内容。这个功能需要额外模块支持，例如 [`nginx-http-footer-filter`](https://github.com/alibaba/nginx-http-footer-filter) 或者 [`ngx_http_addition_module`](http://nginx.org/en/docs/http/ngx_http_addition_module.html)。工作中，经常需要切换各种测试环境，而通过 switchhosts 等工具切换后，有时还需要清理浏览器 dns 缓存。可以通过页面内容修改 + Nginx 反向代理来实现轻松快捷的环境切换。这里首先在本地编写一段 js 代码（switchhost.js）里面的逻辑是：在页面插入 hosts 切换菜单以及点击具体某个环境时，将该 host 的 ip 和 hostname 存储在 cookie 中，最后刷新页面；接着编写一段 css 代码（switchhost.css）用来设置该 hosts 切换菜单的样式。最后 Nginx 脚本配置：

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

```nginx
server {
  listen 80;
  server_name *.text.com;

  # 图片防盗链
  location ~* \.(gif|jpg|jpeg|png|bmp|swf)$ {
    valid_referers none blocked server_names ~\.google\. ~\.baidu\. *.qq.com; # 只允许本机 IP 外链引用，将百度和谷歌也加入白名单有利于 SEO
    if ($invalid_referer) {
      return 403;
    }
  }
}
```

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
