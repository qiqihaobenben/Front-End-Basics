# Nginx 基础配置和语法

## 全局变量

Nginx 有一些常用的全局变量，可以在配置的任何位置使用他们。列举一些比较常见的：

| 变量               | 描述                                                                       |
| ------------------ | -------------------------------------------------------------------------- |
| **HTTP 相关的变量** ||
| `$host`            | 请求行中的 Host，如果有 Host 请求头，则用其值替换掉请求行中的主机名，如果请求中没有 Host 行和 Host 请求头，则等于请求匹配的 server 名称（处理请求 server 的 server_name 指令的值），值为小写，不包含端口        |
|`$uri`|请求中的当前 URI（不同于 URL ，不包括 `?` 后面的请求参数，参数位于 `$args`），不同于浏览器传递 `$request_uri` 的值，它可以通过内部重定向，或者使用 index 指令进行修改，不包括协议和主机名，例如 /abc/ef.html |
| `$document_uri`     | 当前请求在 root 指令中指定的值，与 `$uri` 完全相同，历史问题存在                                               |
| `$request_uri`     | 完整的原始请求 URL（包括 URI 和完整的参数），它无法修改，请查看 `$uri` 更改或重写 URL                                               |
| `$scheme`          | 请求模式，http 或 https                                                    |
| `$request`  |原始的 url 请求，含有方法与协议版本，例如 GET /?a=1&b=22 HTTP/1.1                                                |
| `$request_method`  | 客户端请求类型，如 GET、POST                                               |
| `$request_length`  | 所有请求内容的大小，包括请求行、头部、包体等                                               |
| `$request_body`     | 请求中的包体，这个变量当且仅当使用反向代理，且设定用内存暂存包体时才有效                                               |
| `$request_body_file`     |临时存放请求包体的文件，如果包体非常小则不会存文件，可以通过 client_body_in_file_only 强制所有包体存入文件，且可决定是否删除                                                |
| `$remote_user`     | 由 HTTP Basic Authentication 协议传入的用户名                                                               |
| `$args`            | 请求中的参数，这个变量可以被修改                                                               |
| `$arg_PARAMETER`  | GET 请求中变量名 PARAMETER 参数的值，`/test?name=abc`，`$arg_name` 为 abc |
| `$is_args`         | 如果请求有参数则为 "?"，否则为空字符串""                                          |
| `$query_string`         | 与 `$args` 相同                                          |
| `$content_length`  | 请求头中标识包体长度的 Content-Length 字段                                             |
| `$content_type`    | 请求头中标识包体类型的 Content-Type 字段                                               |
| `$http_HEADER` | HTTP 请求头中的内容，HEADER 为 HTTP 请求中的内容转为小写，- 改为 _ （破折号变为下划线），例如 `$http_user_agent`                                                          |
| `$http_user_agent` | 客户端 agent 信息                                                          |
| `$http_cookie`     | 客户端 cookie 信息                                                         |
| `$cookie_COOKIE`         |跟 `$arg_PARAMETER` 类似，获取某个 cookie 值                                          |
| **TCP 连接相关的变量** ||
| `$binary_remote_addr`     | 客户端地址的整型格式，对于 IPv4是4字节，对于 IPv6是16字节                                                           |
| `$remote_addr`     | 客户端的 IP 地址                                                           |
| `$remote_port`     | 客户端的端口                                                               |
| `$connection`     | 递增的连接序号                                                               |
| `$connection_requests`     | 当前连接上执行过的请求数，对 keepalive 连接有意义                                                               |
| `$proxy_protocol_addr`     | 若使用了 proxy_protocol 协议则返回协议中的地址（原始用户的地址），否则返回空                                                               |
| `$proxy_protocol_port`     | 若使用了 proxy_protocol 协议则返回协议中的端口（原始用户的端口），否则返回空                                                               |
| `$server_addr`     | 服务器端地址                                                               |
| `$server_port`     | 服务器端端口                                                               |
| `$server_protocol`     | 服务器端协议，例如 HTTP/1.1                                                               |
| `$server_protocol`     | 服务器端协议，例如 HTTP/1.1                                                               |
| `$TCP_INFO`     | tcp 内核层参数，包括 `$tcpinfo_rtt`、`$tcpinfo_rttvar`、`$tcpinfo_snd_cwnd`、`$tcpinfo_rcv_space`                                                               |
| **Nginx 处理请求过程中产生的变量** ||
| `$request_time`          | 请求处理到现在的耗时，单位为秒，精确到毫秒                                                                   |
| `$server_name`          | 匹配上请求的 server_name 值                                                                   |
| `$https`          | 如果开启了 TLS/SSL，则返回 on，否则返回空                                                                   |
| `$request_completion`          | 若请求处理完则返回 OK，否则返回空                                                                   |
| `$request_id`          | 以 16 进制输出的请求标识 id，该 id 共含有 16 个字节，是随机生成的                                                                   |
| `$request_filename`          | 待访问文件的完整路径                                                                   |
| `$document_root`          | 由 URI 和 root/alias 规则生成的文件夹路径                                                                   |
| `$realpath_root`          | 将 document_root 中的软链接等换成真实路径                                                                   |
| `$limit_rate`          | 返回客户端响应时的速度上线，单位为每秒字节数。可以通过 `set` 指令修改对请求产生效果                                                                   |
| **发送 HTTP 响应时相关的变量** ||
| `$sent_http_HEADER` | HTTP 响应头中的内容，HEADER 为 HTTP 响应中的内容转为小写，- 改为 _ （破折号变为下划线），例如 `$sent_http_cache_control` 、 `sent_http_content_type` 等                                                         |
| `$status`          | HTTP 响应状态                                                                   |
| `$body_bytes_sent`          | 传送页面的字节数，即响应中 body 包体的长度                                                                   |
| `$bytes_sent`          | 全部 http 响应的长度                                                                   |
| `$sent_trailer_名字`          | 把响应结尾内容里的值返回                                                                   |
| **Nginx 系统变量** ||
| `$time_local`          | 以本地时间标准输出的当前时间                                                                   |
| `$time_iso8601`          | 使用 ISO 8601 标准输出的当前时间                                                                   |
| `$nginx_version`          | 当前运行的 Nginx 版本号                                                                   |
| `$pid`          | 所属 worker 进程的 id                                                                   |
| `$pipe`          | 使用了管道则返回 p，否则返回 `.`                                                                   |
| `$hostname`          | 所在服务器的主机名，与 hostname 命令输出一致                                                                   |
| `$msec`          | 1970年1月1日到现在的时间，单位为秒，小数点后精确到毫秒                                                                   |


### Nginx 如何设置变量

Nginx 的配置文件使用的是一门微型的编程语言。既然是编程语言，一般也就少不了 “变量” 这种东西，但是在 Nginx 配置中，变量只能存放一种类型的值，那就是字符串。

可以用 `set` 配置指令动态指定变量的值，Nginx 变量名前面有一个 `$` 符号，并且所有的Nginx 变量在 Nginx配置文件中引用时都必须带上 `$` 前缀

```nginx
set $limit_rate 1K; #限制对客户端的响应传输速率。
```

在引用变量时，需要注意引用的变量名之后紧跟着字符时（比如后跟字母、数以及下划线），就需要使用特别的语法来消除歧义：

```nginx
server {
  listen 80;
  server_name test.com;

  set $temp hello;

  location / {
    default_type text/html;
    return 200 "$temp world";
  }

  location /close {
    default_type text/html;
    return 200 "${hello}world"; # 紧跟字符时的用法
  }
}
```

另外需要注意的是，如果想输出 `$` 符号本身，可以这样做：

```nginx
geo $dollar {
  default "$";
}

server {
  listen 80;
  server_name test.com;

  location {
    set $temp "hello ";
    default_type text/html;
    return 200 "${temp}world：$dollar";
  }
}
```

上面用到了标准模块 ngx_geo 提供的配置指令 geo 来为变量 `${dollar}` 赋予字符串 "$"，这样，这里返回的就是 "hello world：$"

### Nginx 变量的实现原理

Nginx 的变量对应的模块可以分为：变量的提供模块和变量的使用模块

- Nginx 启动时，提供变量的模块可以在 preconfiguration 中定义新的变量，包括定义好**变量名**和**解析出变量的方法**
- HTTP头部读取完毕后，使用变量的模块，比如 http 的 access 日志，解析 nginx.conf 时定义变量使用方式，处理请求时，会通过变量名去对应的解析出变量的方法中求得变量值

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

**Nginx 是由一些模块组成，一般在配置文件中使用一些具体的指令来控制。** 指令被分为简单指令（简称指令）和块级指令（简称指令块）。

### 简单指令

简单指令是由名字和参数组成，中间用空格分开，并以分号结尾。

```nginx
#简单指令
root /data/www;
```

### 块级指令

块级指令跟简单指令有类似的结构，但是末尾不是分号而是用大括号（ `{}` ）包裹的额外指令集。如果一个块级指令的大括号中有其他指令，则它被叫做一个上下文（比如: events、http、server 和 location）。

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
- `^~`：前缀匹配，用于不含正则表达式的 uri 前，表示如果该符号后面的字符是最佳匹配。采用该规则，不再进行后续的查找。跟 `=` 的区别是，不需要 uri 一模一样，只需要开头和 uri 匹配即可。
- `~`：正则匹配，表示用该符号后面的正则 uri 去匹配路径，区分大小写
- `~*`：正则匹配，表示用该符号后面的正则 uri 去匹配路径，不区分大小写。
- `空`：普通匹配（最长字符匹配），匹配以 uri 开头的字符串，只能是普通字符串。例如，`location /` 是通用匹配，任何请求都会匹配到。另外普通匹配与 location 顺序无关，是按照匹配的长短来确定匹配结果。

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

### 源码编译安装到 `/usr/local/nginx` 的 Nginx 典型配置

```nginx
#user  nobody;  # 定义 Nginx 运行的用户和用户组，默认由 nobody 账号运行，可以不进行设置
worker_processes  1;  # Nginx 进程数，一般设置为同 CPU 核数一样

# Nginx 的错误日志存放目录，后面可以跟日志类型
# 全局错误日志定义类型包括：[ debug | info | notice | warn | error | crit ]
#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid; # Nginx 服务启动的 pid 存储位置


events {
    # 参考事件模型，use [ kqueue | rtsig | epoll | /dev/poll | select | poll ];
    # epoll模型是Linux 2.6以上版本内核中的高性能网络I/O模型，如果跑在FreeBSD上面，就用kqueue模型。
    #use epoll;
    worker_connections  1024; # 每个进程允许最大并发数
}


http {  # 配置使用最频繁的部分，代理，缓存，日志定义等绝大多数功能和第三方模块的配置都在这里设置
    # include 是个主模块指令，可以将配置文件拆分并引用，减少主配置文件的复杂度
    include       mime.types; # 文件扩展名与类型映射表
    default_type  application/octet-stream; # 默认文件类型

    # 设置日志格式
    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main; # Nginx 访问日志存放位置

    sendfile        on; # 开启高效传输模式
    #tcp_nopush     on; # 减少网络报文段的数量，防止网络阻塞
    #autoindex on;  # 开启目录列表访问，适合下载服务器

    #keepalive_timeout  0;
    keepalive_timeout  65;  # 保持连接的时间，也叫超时时间，单位秒，默认为0

    #gzip  on;

    include	/usr/local/nginx/conf/conf.d/*.conf; # 加载子配置项

    server {  # 配置虚拟主机的相关参数，如域名、IP、端口等
        listen       80;  # 配置监听的端口
        server_name  localhost; # 配置的域名，可以由多个，用空格隔开

        #charset koi8-r;  # 默认编码

        #access_log  logs/host.access.log  main;  # 定义本虚拟机的访问日志

        location / {
            root   html;  # 网站根目录
            index  index.html index.htm;  # 默认首页文件
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;  # 默认50x对应的访问页面
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

### yum 安装的 Nginx 典型配置

```nginx
user  nginx;                        # 运行用户
worker_processes  1;                # Nginx 进程数，一般设置为同 CPU 核数一样
error_log  /var/log/nginx/error.log warn;   # Nginx 的错误日志存放目录
pid        /var/run/nginx.pid;      # Nginx 服务启动时的 pid 存放位置

events {
    use epoll;     # 使用epoll的I/O模型(如果你不知道Nginx该使用哪种轮询方法，会自动选择一个最适合你操作系统的)
    worker_connections 1024;   # 每个进程允许最大并发数
}

http {   # 配置使用最频繁的部分，代理、缓存、日志定义等绝大多数功能和第三方模块的配置都在这里设置
    # 设置日志模式
    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    access_log  /var/log/nginx/access.log  main;   # Nginx访问日志存放位置

    sendfile            on;   # 开启高效传输模式
    tcp_nopush          on;   # 减少网络报文段的数量
    tcp_nodelay         on;
    keepalive_timeout   65;   # 保持连接的时间，也叫超时时间，单位秒
    types_hash_max_size 2048;

    include             /etc/nginx/mime.types;      # 文件扩展名与类型映射表
    default_type        application/octet-stream;   # 默认文件类型

    include /etc/nginx/conf.d/*.conf;   # 加载子配置项

    server {
    	listen       80;       # 配置监听的端口
    	server_name  localhost;    # 配置的域名

    	location / {
    		root   /usr/share/nginx/html;  # 网站根目录
    		index  index.html index.htm;   # 默认首页文件
    		deny 172.168.22.11;   # 禁止访问的ip地址，可以为all
    		allow 172.168.33.44；# 允许访问的ip地址，可以为all
    	}

    	error_page 500 502 503 504 /50x.html;  # 默认50x对应的访问页面
    	error_page 400 404 error.html;   # 同上
    }
}
```

## 配置中常用指令详细说明

### 指令介绍

指令是有 Context 的，不同的指令可以应用的 Context 可能也不同。

- 值指令，主要是存储配置项的值，值指令可以合并，继承规则是向上覆盖，即子配置不存在时，直接使用父配置，子配置存在时，直接覆盖父配置。例如 `root`、`access_log`、`gzip` 等指令
- 动作类指令，主要是指定行为，此类指令不可以合并，例如 `rewrite`、`proxy_pass` 等指令，这些指令生效阶段一般是 `server_rewrite 阶段`、`rewrite 阶段`、`content 阶段`。

### main 全局配置

- `worker_processes 1;`

定义在配置文件顶级 main 部分，worker 角色的工作进程个数。master 进程是接受并分配请求给 worker 处理。这个数值可以简单设置为 CPU 的核数 `grep ^processor /proc/cpuinfo | wc -l`，也是 auto 值。如果开启了 ssl 和 gzip，更应该设置成与逻辑 CPU 数量一样甚至为 2 倍，可以减少 I/O 操作。如果 Nginx 服务器还有其它服务，可以考虑适当减少。

- `worker_cpu_affinity 0001 0010 0100 1000;`

定义在 main 部分。在高并发情况下，通过设置 cpu 粘性来降低由于多 CPU 核切换造成的寄存器等现场重建带来的性能损耗。如 worker_cpu_affinity 0001 0010 0100 1000; （四核）。

- `use epoll;`
  写在 events 部分。在 Linux 操作系统下，nginx 默认使用 epoll 事件模型，得益于此，nginx 在 Linux 操作系统下效率相当高。同时 Nginx 在 OpenBSD 或 FreeBSD 操作系统上采用类似于 epoll 的高效事件模型 kqueue。在操作系统不支持这些高效模型时才使用 select。

### http 配置

- `sendfile on;`

  开启高效传输模式，sendfile 指令指定 nginx 是否调用 sendfile 函数来输出文件，减少用户空间到内核空间的上下文切换。对于普通应用设为 on，如果用来进行下载等应用磁盘 IO 重负载应用，可设置为 off，以平衡磁盘与网络 I/O 处理速度，降低系统的负载。注意：如果图片显示不正常把这个改成 off。

- `client_max_body_size 10m;`

  允许客户端请求的最大单文件字节数。如果有上传较大文件，请设置它的限制值。

### server 虚拟主机

http 服务上支持若干虚拟主机。每个虚拟主机对应一个 server 配置项，配置项里面包含该虚拟主机相关的配置。在提供 mail 服务的代理时，也可以建立若干 server，每个 server 通过监听地址或端口来区分。

- `listen 80;`

  监听端口和地址，默认 80，小于 1024 的要以 root 启动，可以只指定端口或者指定地址和端口，例如`listen *:80;`、`listen 127.0.0.1:80`

- `server_name localhost;`

  服务器名，可以设置多个，第一个名字将成为主服务器名称（主域名），服务器名称可以使用 `*` 代替名称的第一部分或者最后一部分；也可以通过正则匹配（加 `~` 前缀），还可以使用正则表达式进行捕获。

  ```nginx
  server {
    server_name example.com *.example.com www.example.*;
  }
  ```

#### server_name 扩展

1、`server_name` 第一个名字作为主域名可以配合 `server_name_in_redirect`，可以让多个子域名有重定向时，重定向到主域名下。

2、 `serve_name` 可以使用正则表达式的小括号 `()` 创建变量，并且可以使用尖括号 `?<>` 来命名变量。

  ```nginx
  # 使用正则，并且创建变量
  server {
    server_name ~^(www\.)?(.+)$;

    location / {
        root /sites/$2;
    }
  }

  # 创建命名变量
  server {
    server_name ~^(www\.)?(?<domain>.+)$;

    location / {
        root /sites/$domain;
    }
  }
  ```

3、 `.example.com` 可以匹配到 example.com *.example.com

4、 `_` 匹配所有域名

5、 在某个 server 块下的 server_name 使用 `""` 匹配没有传递 Host 头部的请求

#### 多个 server 块的匹配顺序

1. 优先精确匹配，跟 server 块在 nginx.conf 中的顺序无关
2. 其次优先匹配 `*` 在前的泛域名
3. 其次优先匹配 `*` 在后的泛域名
4. 其次匹配到正则表达式，匹配顺序是按 nginx.conf 文件中的出现顺序匹配正则表达式域名
5. 最后会匹配到 default server，default server 又分为两种情况，第一种是匹配第一个 server 块，另一种情况是如果 `listen` 指令后面有 `default` 时，所在的 server 块就是 default server。




### localtion

#### 访问控制 allow/deny

Nginx 的访问控制模块默认就会安装，而且写法简单，可以分别有多个 allow/deny ，允许或禁止某个 ip 或 ip 段访问，依次满足任何一个规则就停止往下匹配。

```nginx
location /nginx-status {
stub_status on;
access_log off;
#  auth_basic   "NginxStatus";
#  auth_basic_user_file   /usr/local/nginx-1.6/htpasswd;

allow 192.168.10.100;
allow 172.29.73.0/24;
deny all;
}
```

我们也常用 httpd-devel 工具的 htpasswd 来为访问的路径设置登录密码：（_此处笔者没有验证_）

```nginx
# htpasswd -c htpasswd admin
New passwd:
Re-type new password:
Adding password for user admin

# htpasswd htpasswd admin    //修改admin密码
# htpasswd htpasswd sean    //多添加一个认证用户
```

这样就生成了默认使用 CRYPT 加密的密码文件。打开上面 nginx-status 的两行注释，重启 Nginx 生效。

#### 列出目录 autoindex

Nginx 默认是不允许列出整个目录的。如果需要此功能，打开 nginx.conf 文件，在 location、server 或 http 部分加入 `autoindex on;`，另外两个参数最好也加进去：

- `autoindex_exact_size off;`

  默认为 on，显示出文件的确切大小，单位是 bytes。改为 off 后，显示出文件的大概大小，单位是 KB、MB 或者 GB。

- `autoindex_localtime on;`

  默认为 off，显示的文件时间为 GMT 时间。改为 on 后，显示的文件时间为文件的服务器时间。

```nginx
location /images {
  root   /var/www/nginx-default/images;
  autoindex on;
  autoindex_exact_size off;
  autoindex_localtime on;
}
```

## Nginx 中的配置单位

### 时间单位

- ms：毫秒（milliseconds）
- s：秒（seconds）
- m：分钟（minutes）
- h：小时（hours）
- d：天（days）
- w：周（weeks）
- M：月（months，30 days）
- y：年（years，365 days）

```nginx
expires 3m;
```

### 空间单位

默认为字节（bytes）

- k/K：kilobytes
- m/M：megabytes
- g/G：gigabytes

```nginx
client_max_body_size 10m;
```

## 参考文档

- [Nginx Location 匹配规则](https://lmjben.github.io/blog/operation-nginx-match.html#nginx-location-%E5%8C%B9%E9%85%8D%E8%A7%84%E5%88%99)
