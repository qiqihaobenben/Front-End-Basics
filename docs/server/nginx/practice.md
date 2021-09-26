# Nginx 实践操作

## 静态资源服务器

### 静态网站

Nginx 可以作为静态资源服务器，当只有静态资源的时候，就可以使用 Nginx 来做服务器，例如，如果一个网站只是静态页面的话，就可以通过类似以下的配置来实现部署一个静态的网站。

```nginx
http {
  log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

  server {
    listen       80;
    server_name  docs.chenfangxu.com;

    access_log logs/docs.chenfangxu.com.access.log main;

    location / {
        root   /usr/local/app;
        index  index.html;
    }
  }
}
```

这样如果访问 [http://docs.chenfangxu.com](http://docs.chenfangxu.com) 就会默认访问到 `usr/local/app` 目录下面的 `index.html`。

### 静态目录服务

```nginx
server {
  listen 80;
  server_name static.chenfangxu.com;
  charset utf-8;  # 防止中文文件名乱码

  location / {
    alias /home/chenfangxu/static/;  # 静态资源目录

    autoindex on; # 允许展示静态资源目录
    autoindex_exact_size off; # off：显示文件大概大小，单位 KB、MB、GB；on：（默认）显示文件的确切大小，单位是 byte
    autoindex_localtime on;  # off：（默认）显示的文件时间为 GMT 时间；on：显示的文件时间为服务器时间
  }
}
```

访问 [http://static.chenfangxu.com](http://static.chenfangxu.com)，就可以看到一个简单的目录。

### gzip 压缩

使用 gzip 不仅需要 Nginx 配置，浏览器端也需要配合，需要在请求消息头中包含 Accept-Encoding: gzip（IE5 之后所有的浏览器都支持了，是现代浏览器的默认设置）。一般在请求 html 和 css 等静态资源的时候，支持的浏览器在 request 请求静态资源的时候，会加上 Accept-Encoding: gzip 这个 header，表示自己支持 gzip 的压缩方式，Nginx 在拿到这个请求的时候，如果有相应配置，就会返回经过 gzip 压缩过的文件给浏览器，并在 response 相应的时候加上 content-encoding: gzip 来告诉浏览器自己采用的压缩方式（因为浏览器在传给服务器的时候一般还告诉服务器自己支持好几种压缩方式），浏览器拿到压缩的文件后，根据自己的解压方式进行解析。

这个配置可以插入到 http 上下文里，也可以插入到需要使用的虚拟主机的 server 或者下面的 location 上下文中。

```nginx
server {
  listen 80;
  server_name docs.chenfangxu.com;

  access_log logs/docs.chenfangxu.com.access.log main;

  gzip on;  #默认 off，是否开启gzip
  gzip_types text/plain text/css application/json application/x-javascript text/xml application/xml application/xml+rss text/javascript;

  gzip_static on;
  gzip_proxied any;
  gzip_vary on;
  gzip_comp_level 6;
  gzip_buffers 16 8k;
  gzip_min_length 1k;
  gzip_http_version 1.1;

  location / {
    root /home/www/docs.chenfangxu.com/dist;
    index index.html;
  }
}

```

- gzip_typs：要采用 gzip 压缩的 MIME 文件类型，其中 `text/html` 被系统强制启用。
- gzip_static：默认为 off，该模块启用后，Nginx 首先检查请求的静态文件是否有 gz 结尾的文件，如果有，直接返回该 `.gz` 文件内容。
- gzip_proxied：默认为 off，Nginx 作为反向代理时启用，用于设置启用或禁用从代理服务器收到相应内容 gzip 压缩。
- gzip_vary：用于在相应消息头中添加 `Vary: Accept-Encoding`，使代理服务器根据请求头中的 `Accept-Encoding`识别是否启用 gzip 压缩。
- gzip_comp_level：gzip 压缩比，压缩级别是 1-9，1 压缩级别最低，9 压缩级别最高，级别越高压缩率越高，压缩时间也越长，建议 4 - 6。
- gzip_buffers：获取多少内存用于缓存压缩结果， 16 8k 表示以 `8k * 16` 为单位获得。
- gzip_min_length：允许压缩的页面最小字节数，页面字节数从 header 头中的 `Content-Length` 中获取。默认值是 0，不管页面多大都压缩。建议设置成大于 1k 的字节数，小于 1k，可能会越压越大。
- gzip_http_version：默认 1.1，启用 gzip 所需的 HTTP 最低版本。

可以通过网页 GZIP 压缩检测，看一下 `docs.chenfangxu.com` 的相关数据。

![](./images/nginx1.png)

#### 前端项目 gzip 压缩

当前端项目使用 Webpack 等打包工具进行打包时，一般都有配置可以开启 gzip 压缩，打包出来的文件会有经过 `gzip` 压缩之后的 `.gz` 文件。

为什么在 Nginx 已经有了 gzip 压缩，打包工具还需要整个 gzip 呢？

因为如果全都是使用 Nginx 来压缩文件，会耗费服务器的计算资源，如果 `gzip_comp_level` 配置的比较高，就更增加了服务器的开销，相应也会增加客户端的请求时间，得不偿失。

如果压缩在前端打包的时候就做了，把打包之后的高压缩等级文件作为静态资源放在服务器上，Nginx 会优先查找这些压缩之后的文件返回给客户端，相当于把压缩文件的动作从 Nginx 提前到了打包的时候完成， 节约了服务器资源，所以一般推荐在生产环境使用打包工具配置 gizp 压缩。
