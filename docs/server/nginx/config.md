# Nginx 基础配置和语法

## 全局变量

Nginx 有一些常用的全局变量，可以在配置的任何位置使用他们。列举一些比较常见的：

| 变量               | 描述                                                                       |
| ------------------ | -------------------------------------------------------------------------- |
| `$host`            | 请求信息中的 Host，如果请求中没有 Host 行，则等于请求匹配的服务器名        |
| `$request_method`  | 客户端请求类型，如 GET、POST                                               |
| `$request_uri`     | 完整的原始请求 URI（带参数）                                               |
| `$remote_addr`     | 客户端的 IP 地址                                                           |
| `$remote_port`     | 客户端的端口                                                               |
| `$args`            | 请求中的参数                                                               |
| `$args_PARAMETER`  | GET 请求中变量名 PARAMETER 参数的值，`/test?name=abc`，`$args_name` 为 abc |
| `$is_args`         | 如果请求有参数则为 ?,否则为字符串                                          |
| `$scheme`          | 请求模式，http 或 https                                                    |
| `$content-length`  | 请求头中的 Content-Length 字段                                             |
| `$content-type`    | 请求头中的 Content-Type 字段                                               |
| `$http_user_agent` | 客户端 agent 信息                                                          |
| `$http_cookie`     | 客户端 cookie 信息                                                         |
| `$server_protocol` | 请求使用的协议，如 HTTP/1.1                                                |
| `$server_addr`     | 服务器地址                                                                 |
| `$server_name`     | 服务器名称                                                                 |
| `$server_port`     | 服务器端口                                                                 |
| `$status`          | 响应状态                                                                   |

## Nginx 配置文件的基本结构

拿我们之前编译安装的 Nginx 主配置文件 `/usr/local/nginx/conf/nginx.conf` 来看，`nginx.conf`的结构图大体如下：

```sh
main        # Nginx 的全局配置，对全局生效
├── events  # 配置影响 nginx 服务器或与用户的网络连接
├── http    # 配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置，可以嵌套多个 server
│   ├── upstream # 配置后端服务器具体地址，负载均衡配置不可或缺的部分
│   ├── server   # 配置虚拟主机的相关参数，如域名、IP、端口等，一个 http 块中可以有多个 server 块
│   ├── server
│   │   ├── location  # 配置请求的路由，以及各种页面的处理情况
│   │   ├── location  # server 块可以包含多个 location 块，location 指令用于匹配 uri
│   │   └── ...
│   └── ...
└── ...
```

## Nginx 配置文件的语法规则

Nginx 是由一些模块组成，一般在配置文件中使用一些具体的指令来控制。指令被分为简单指令和块级指令。

### 简单指令

简单指令是由名字和参数组成，中间用空格分开，并以分号结尾。

```nginx
#简单指令
root /data/www;
```

### 块级指令

块级指令跟简单指令有类似的结构，但是末尾不是分号而是用 `{}` 大括号包裹的额外指令集。如果一个块级指令的大括号中有其他指令，则它被叫做一个上下文（比如: events、http、server 和 location）。

在配置文件中，没有放在任何上下文中的指令都处在主上下文中。`events` 和 `http` 的指令是放在主上下文中，`server` 放在 `http` 中，`location` 放在 `server` 中。

```nginx
#块级指令
http {
  server {
    listen 80;
    server_name doc.chenfangxu.com;
    access_log logs/doc.chenfangxu.access.log;
    root html;

    location ~ \.php$ {
      fastcgi_pass 127.0.0.1:1025;
    }
  }
}
```

### 语法规则

- 配置文件由指令与指令块构成
- 每条指令以分号（`;`）结尾，指令与参数间以空格符号分隔
- 指令块以大括号（`{}`）将多条指令组织在一起
- `include` 语句允许组合多个配置文件以提升可维护性
- 通过 `#` 符号添加注释，提高可维护性
- 通过 `$` 符号使用变量
- 部分指令的参数支持正则表达式，例如常用的 location 指令

## location 指令规则

location 指令用于匹配 uri，可以使用合法的字符串或者正则表达式

语法：

```nginx
location [ = | ~ | ~* | ^~ | 空] uri {
  ……
}
```

指令后面：

- `=`：精确匹配，用于不含正则表达式的 uri 前，如果匹配成功，不再进行后续的查找
- `^~`：前缀匹配，用于不含正则表达式的 uri 前，表示如果该符号后面的字符是最佳匹配。采用该规则，不再进行后续的查找。跟 `=` 的区别是，不需要 uri 一模一样，只需要开头前缀和 uri 匹配即可。
- `~`：正则匹配，表示用该符号后面的正则 uri 去匹配路径，区分大小写
- `~*`：正则匹配，表示用该符号后面的正则 uri 去匹配路径，不匹配大小写。如有多个 location 的正则能匹配的话，则使用正则表达式最长的那个
- `空`：普通匹配（最长字符匹配），匹配以 uri 开头的字符串，只能是普通字符串。例如，`location /` 是通用匹配，如果没有其他匹配，任何请求都会匹配到。另外普通匹配与 location 顺序无关，是按照匹配的长短来确定匹配结果。若完全匹配，就不再进行后续查找

### 优先级

`location =` > `location 完整路径`（还会去匹配正则） > `location ^~ 路径` > `location ~,~* 正则顺序` > `location 部分起始路径` > `location /`

即：精确匹配 > 最长字符串匹配，完全匹配（还会去匹配正则） > 前缀匹配 > 正则匹配 > 普通匹配(最长字符串匹配，部分匹配) > 通用匹配

#### 注意：

- 在所有匹配成功的 uri 中，选取匹配度最长的 uri 字符地址。正则除外，正则匹配是按照先后顺序确定匹配结果
- 正则匹配成功之后停止匹配，普通匹配成功后还会接着匹配正则。举个例子：

```nginx
# `location 完整路径` 虽然比 `location ^~ 路径` 优先级高，但还是会去匹配正则，如果正则匹配成功，采用正则匹配结果。如果没有匹配到 `location 完整路径`，`location ^~ 路径` 就比 `location ~,~* 正则顺序` 优先级高了
location ~ /ab {
  rewrite ^ http://baidu.com/s?word=A;
}
location /abc {
  rewrite ^ http://baidu.com/s?word=B;
}
location ^~ /ab {
  rewrite ^ http://baidu.com/s?word=C;
}

#访问 http://docs.chenfangxu.com/ab 会跳到百度搜索关键词 C
#访问 http://docs.chenfangxu.com/abcd 会跳到百度搜索关键词 A
```

- 如果 uri 包含正则表达式，则必须有 `~` 或 `~*` 标志，否则正则代码只能作为普通字符使用，例如 `location = /demo$` ，其中的 `$` 并不代表正则模式结束，而是一个实实在在的 `$` 字符，是 url 的一部分。
- 针对 `~` 和 `~*` 匹配标识符，可以在前面加上 `!` 来取反：`!~`：表示正则不匹配，区分大小写， `!~*`：表示正则不匹配，不区分大小写

### 根据优先级来模拟 Nginx location 的匹配过程

1. Nginx 首先根据 url 检查最长匹配前缀字符串，即会判断 `=`、`^~`、`空` 修饰符定义的内容

- 如果匹配到最长匹配前缀字符串（即最长的 uri）
  - 如果最长匹配前缀字符串被 `=` 修饰符匹配，则**立即响应**
  - 如果没有被 `=` 修饰符匹配，则执行第 2 步判断。
- 如果没有匹配到最长匹配前缀字符串

2. Nginx 继续检查最长匹配前缀字符串，即判断 `^~`、`空` 修饰符定义的内容

- 如果最长匹配前缀字符串被 `^~` 修饰符匹配，则**立即响应**
- 如果被 `空` 修饰符匹配，则**将改匹配保存起来**（不管是普通匹配的完全匹配还是部分匹配），并执行第 3 不判断。

3. Nginx 找到 nginx.conf 中定义的所有正则匹配（`~`和`~*`），并按顺序进行匹配。

- 如果有任何正则表达式匹配成功，则**立即响应**
- 如果没有任何正则匹配成功，则响应第 2 步中**存储的 `空` 修饰符匹配结果**。

## 典型配置

```nginx
#user  nobody;  # 运行用户，可以不进行设置
worker_processes  1;  # Nginx 进程树，一般设置为和 CPU 核数一样

# Nginx 的错误日志存放目录
#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid; # Nginx 服务启动的 pid 存储位置


events {
    worker_connections  1024; # 每个进程允许最大并发数
}


http {  # 配置使用最频繁的部分，代理，缓存，日志定义等绝大多数功能和第三方模块的配置都在这里设置
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    include	/usr/local/nginx/conf/conf.d/*.conf;

    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

}
```

## 反向代理配置

## 跨域 CORS 配置

## 开启 gzip 压缩

## 负载均衡配置

## 动静分离配置

## 配置高可用集群（双机热备）

## 适配 PC 或移动设备

## 配置 HTTPS

## 参考文档

- [Nginx Location 匹配规则](https://lmjben.github.io/blog/operation-nginx-match.html#nginx-location-%E5%8C%B9%E9%85%8D%E8%A7%84%E5%88%99)
