# Nginx 实践操作

## 静态资源服务器

### 静态网站

Nginx 可以作为静态资源服务器，当只有静态资源的时候，就可以使用 Nginx 来做服务器，例如，如果一个网站只是静态页面的话，就可以通过类似以下的配置来实现部署一个静态的网站。

```nginx
server {
  listen       80;
  server_name  docs.chenfangxu.com;

  location / {
      root   /usr/local/app;
      index  index.html;
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
