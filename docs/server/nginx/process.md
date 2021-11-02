# Nginx 执行流程

## Nginx 启动

### Nginx 启动、退出时的回调方法

- init_module 在 master 进程中调用
- init_process 在 worker 进程中调用
- exit_process 在 worker 进程退出时调用
- exit_master 在 master 进程退出时调用

### Nginx 的启动流程

1. 根据命令行得到配置文件路径
2. 如果处于升级中则监听环境变量里传递的监听句柄
3. 调用所有核心模块的 create_conf 方法生成存放配置项的描述体
4. 针对所有核心模块解析 nginx.conf 配置文件
5. 调用所有核心模块的 init_conf 方法
6. 创建目录、打开文件、初始化共享内存等进程间通信方式
7. 打开由各 Nginx 模块从配置文件中读取到的监听端口
8. 调用所有模块的 init_module 方法（检测 Nginx 的运行方式，单进程还是 master 多进程）
9. 一般会以 master 多进程方式运行 Nginx，进入 master 模式
10. 启动 master 进程
11. 根据 worker_process 启动 worker 进程，调用所有模块的 init_process 方法
12. 启动 cache manager 进程
13. 启动 cache loader 子进程，关闭父进程启动时监听的端口

## HTTP 请求处理的 11 个阶段

HTTP 请求处理的阶段为：POST_READ、SERVER_REWRITE、FIND_CONFIG、REWRITE、POST_REWRITE、PREACCESS、ACCESS、POST_ACCESS、PRECONTENT、CONTENT、LOG

### 1、postread 阶段

这个阶段中，获取真实客户端地址的 realip 模块会生效。

#### realip 模块

默认不会编译进 Nginx，需要通过 `--with-http_realip_module` 启用功能，作用是修改客户端的地址。

因为模块覆盖了 `$remote_addr` ，为了能得到原来的 ip 信息，模块创建了两个变量：

- realip_remote_addr
- realip_remote_port

模块有三个指令：

- set_real_ip_from：决定什么 ip 地址才是可信的，能替换 `$remote_addr` 变量
- real_ip_header：从哪个头字段中获取替换的 ip
- real_ip_recursive：环回地址，如果 X-Forwarded-For 中的最后一个 ip 是本地 ip，就获取上一个 ip。

#### 网络中存在许多反向代理的情况下，如何拿到真实的用户 IP 地址？

例如用户的地址是：122.3.3.2，经过许多反向代理后，`$remote_addr` 可能就变成了 `8.8.8.8`

- HTTP 头部 X-Forwarded-For 用于传递 IP，它可以设置多个 IP，用逗号分割。
- HTTP 头部 X-Real-IP 用于传递用户 IP，它只能设置一个 IP

根据 relip 模块的指令，relip 模块可以通过这些 HTTP 头部字段覆写入 binary_remote_addr、remote_addr 变量，使变量的值成为真实的用户 IP。并且只有拿到真实用户的 IP 后做连接限制（如 preaccess 阶段生效的 limit_conn 模块）才有意义。

### 2、server_rewrite 和 rewrite 阶段

server_rewrite 和 rewrite 这两个阶段中，rewrite 模块都会生效。

#### return 指令

return 指令生效后，后面的指令都不会再执行。

return 指令后面可以是 `code [text]`、`code URL`、`URL`。要特别注意一下使用上下文，没有 http，只能用在 `server,location,if` 上下文中。

##### code 返回状态码

- Nginx 自定义

  - 444 关闭连接，此状态码不会返回到客户端

- HTTP 1.0 标准

  - 301 http1.0 永久重定向，客户端再次访问时会直接访问新地址
  - 302 临时重定向，禁止被缓存

- HTTP 1.1 标准

  - 303 临时重定向，允许改变方法，禁止被缓存
  - 307 临时重定向，不允许改变方法，禁止被缓存
  - 308 永久重定向，不允许改变方法

  如果是 `return URL;` ，此时状态码默认是 302。

#### server 与 location 块下的 return 指令关系?

```nginx
server {
  server_name return.example.com;
  listen 8080;

  root html/;

  reutrn 403;

  location / {
    return 404 "find nothing!";
  }
}
```

`return 403;` 是在 server_rewrite 阶段，`return 404 "find nothing!";` 是在 rewrite 阶段，server_rewrite 阶段先处理，return 指令生效后，后面的指令都不会再执行，并且 return 指令是动作类指令，不会发生继承合并，所以上面的配置会返回 403。

#### return 与 error_page 指令的关系?

```nginx
server {
  server_name return.example.com;
  listen 8080;

  root html/;

  error_page 404 /403.html;

  location / {
    return 404 "find nothing!\n";
  }
}
```

上面的配置会返回状态码 404，返回的内容是 find nothing!，error_page 不会生效。

#### rewrite 指令

使用反向代理解决跨域时，用到了 rewrite 指令。rewrite 模块提供出来的指令还包括 set、if、break、return。

rewrite 是脚本类型的指令。语法是 `rewrite regex replacement [flag];`，当 replacement 以 http://或者 https://或者$schema 开头，则直接返回 302 重定向。

rewrite 利用正则表达式和标志位实现 uri 重写和重定向，正则表达式可以用小括号进行变量提取。rewrite 只能放在 server、location 上下文和 if 判断中，并且只能对域名后边的除去传参外的字符串起作用。如果想对域名或参数字符串起作用，可以使用全局变量匹配，也可以使用 proxy_pass 反向代理。

例如 `http://microloan-sms-platform.yxapp.xyz/proxy/sms/task/querydeleted?page=1&pagesize=10` 只能对 /proxy/sms/task/querydeleted 进行重写。

rewrite 规则后边，通常会带有 flag 标志位：

- last：表示持续，用 replacement 这个 URI 进行新的 location 匹配
- break：停止当前脚本指令的执行，等价与独立的 break 指令
- redirect：返回 302 临时重定向，地址栏会显示跳转后的地址
- permanent：返回 301 永久重定向，地址栏会显示跳转后的地址

last 和 break 的区别：

- last 一般写在 server 和 if 中，而 break 一般使用在 location 中
- last 不终止重写后的 uri 匹配，即新的 uri 会再从 server 走一遍匹配流程，而 break 终止重写后的匹配
- break 和 last 都能阻止继续执行当前上下文后面的 rewrite 指令。

#### rewrite 和 return 的关系?

不带 flag 的 rewrite，会跟 return 顺序执行，并以 return 结果为准。如果带了 last 会跳过后面的 return 执行，如果带了 break ，会阻止后面的 return 执行。

### 3、find_config 阶段

此阶段主要是 location 匹配，可以查看 [location 配置](./config.html#location-指令规则)

### 4、preaccess 阶段

#### limit_conn 模块

模块的功能是限制每个客户端的并发连接数，默认编译进 Nginx，生效范围：

- 全部 worker 进程（基于共享内存）
- 进入 preaccess 阶段前不生效
- 并发连接数限制的有效性取决于 key 的设计：一般使用客户端的 ip，所以就需要依赖 postread 阶段的 realip 模块取到真实的 ip

#### limit_conn_zone 指令

定义共享内存（包括大小），以及 key 关键字。

语法 `limit_conn_zone key zone=name:size;` 只能在 http 上下文中使用

#### limit_conn 指令

限制并发连接数。

语法 `limit_conn zone number;` 可以用在 http,server,location 上下文中。

#### limit_conn_log_level 指令

限制发生时的日志级别，可选的值是 info|notice|warn|error，默认是 error。

#### limit_conn_status 指令

限制发生时向客户端返回的错误码，默认是 503。

```nginx
limit_conn_zone $binary_remote_addr zone=addr:10m;
server {
  server_name limit.example.com;
  root html/
  error_log logs/error.log info;

  location / {
    limit_conn_status 500; #超限后的状态码
    limit_conn_log_level warn;
    limit_conn addr 1;
    limit_rate 50; #限制速度
  }
}
```

#### limit_req 模块

功能是限制每个客户端的每秒处理请求数，默认编译进 Nginx，生效算法是 leaky bucket 算法（漏桶接水把不同的流量转换成均匀的流量），生效范围也是全部 worker 进程（基于共享内存），进入 preaccess 阶段前不生效。

#### limit_req_zone 指令

定义共享内存（包括大小），以及 key 关键字和限制速率，语法 `limit_req_zone key zone=name:size rate=rate;`，只能在 http 上下文中使用。rate 的单位为 r/s（每秒请求）或者 r/m（每分钟请求）。

#### limit_req 指令

限制并发连接数，语法 `limit_req zone=name [burst=number] [nodelay];`，burst 默认为 0（即漏桶的容量），nodelay，对 burst 中的请求不再采用延时处理的做法，而是立即处理。

#### limit_req_log_level 指令

限制发生时的日志级别

#### limit_req_status 指令

限制发生时向客户端返回的错误码，默认为 503。

#### limit_req 与 limit_conn 配置同时生效时，哪个有效？

limit_req 生效时间在 limit_conn 之前，所以只会看到 limit_req 的配置结果。

### 5、access 阶段

#### access 模块

限制某些 IP 地址的访问，默认编译进 Nginx，生效范围是：进入 access 之前不生效。

#### allow 指令

允许哪些地址访问，语法 `allow address|CIDR|unix:|all;`，可以用在 http,server,location,limit_except 上下文中

#### deny 指令

禁止哪些地址访问，语法 `deny address|CIDR|unix:|all;`，可以用在 http,server,location,limit_except 上下文中

```nginx
location / {
  deny 192.168.1.1;
  allow 192.168.1.0/24;
  allow 2001:0db8::/32;
  deny all;
}
```

#### auth_basic 模块

基于 HTTP Basic Authutication 协议进行用户名密码的认证，模块默认编译进 Nginx。

#### auth_basic 指令

可以设置 string|off，默认为 off

#### auth_basic_user_file

用户名和密码配置在哪个文件中。

生成密码文件可以使用生成工具 htpassed，安装依赖包 httpd-tools，然后执行 `htpasswd -c file -b user pass`

#### auth_request 模块（第三方模块）

原理是收到请求后，先把请求 hold，然后生成子请求，通过反向代理技术把请求传递给上游服务。向上游的服务转发请求，若上游服务返回的响应码是 2xx，则继续执行，若上游服务返回的是 401 或 403，则将响应返回给客户端。默认没有编译进 Nginx。

#### auth_request 指令

语法 `auth_request uri | off;`，默认为 off。

#### auth_request_set 指令

语法 `auth_request_set $variable value;` 可以根据上游返回的变量来设置新的变量。

#### satisfy 指令

限制所有 access 阶段模块，例如 access 模块、auth_basic 模块、auth_request 模块等，语法 `satisfy all | any;`，如果是 all 就表示必须所有配置的 access 模块都通过才能使 access 阶段放行，any 只要有一个 access 模块的配置通过就能在 access 阶段放行。

### precontent 阶段

#### try_files 指令

指令来自 try_files 模块，可以用在 server,location 上下文中，语法是：

- `try_files file... uri;`
- `try_files file... =code`

try_files 的作用是依次试图访问多个 url 对应的文件（由 root 或者 alias 指令指定），当文件存在时直接返回文件内容，如果所有文件都不存在，则按最后一个 uri 结果或者状态码 code 返回。

#### mirror 模块

处理请求时，生成子请求访问其他服务（copy 一份流量），对子请求的返回值不做处理。模块默认编译进 Nginx。

#### mirror 指令

可以设置 uri | off ，默认为 off。

#### mirror_request_body

指定是否需要把请求中的 body 转发给上游服务，默认为 on。

### content 阶段

#### root 指令

将 url 映射为文件路径，以返回静态文件内容。默认值为 `root html`，可以用在 http,server,location,if in location 上下文中。

**root 会将完整 url 映射进文件路径中。**

```nginx
location /root {
  root html;
}
```

访问：example.com/root/1.txt 文件路径为：html/root/1.txt

#### alias 指令

将 url 映射为文件路径，以返回静态文件内容。没有默认值，只能用在 location 上下文中。

**alias 只会将 location 匹配后的 url 映射到文件路径**

```nginx
location /alias {
  alias html;
}
```

访问：example.com/alias/1.txt 文件路径为：html/1.txt

#### root 或 alias 配置中，访问目录时 URL 最后没有带 `/`?

static 模块实现了 root/alias 功能时，发现访问目标是目录，但 URL 末尾未加 `/` 时，会返回 301 重定向，自动加上 `/`。

关于重定向后的跳转问题，可以根据 absolute_redirect、port_in_redirect、server_name_in_redirect 来进行配置。

#### content 阶段生成待访问文件的三个相关变量

- request_filename 待访问文件的完整路径，包括文件名和扩展名
- document_root 由 URI 和 root/alias 规则生成的文件夹路径
- realpath_root 将 document_root 中的软链接等换成真实路径

```nginx
location /RealPath/ {
  alias html/realpath/ # 这是一个软链接指向的是 first 文件夹
}
```

访问 /RealPath/1.txt 时

- request_filename 为 html/realpath/1.txt
- document_root 为 html/realpath
- realpath_root 为软链接指向的真实路径 html/first

#### 静态文件返回时的 content-tpe 相关

- types 指令，语法 `types {...};`，对文件扩展名和文件类型的映射
- default_type 指令，语法 `default_type mime-type;` 默认为 text/plain

#### index 模块

指定访问时返回 index 文件内容，语法 `index file...;` 默认是 `index index.html;`。index 是优先于 auto_index 处理的。

#### auto_index 模块

当 URL 以 `/` 结尾时，尝试以 html/xml/json/jsonp 等格式返回 root/alias 中指向目录的文件。默认编译进了 Nginx。

### log 阶段

log 模块就是把 HTTP 请求相关信息记录到日志中，并且 ngx_http_log_module 无法禁用。

#### log_format 指令

语法 `log_format name [escape=default|json|none] string ...;` 默认是 `log_format combined "...";`

默认的 combined 日志格式：`log_format combined '$remote_addr - $remote_user [$time_local]' '"$request" $status $body_bytes_sent' '"$http_referer""$http_user_agent"';`

#### access_log 指令

语法：`access_log off;` 或 `access_log path [format [buffer=size] [gzip[=level]] [flush=time] [if=condition]]`

默认值为 `access_log logs/access.log combined;`

- path 路径可以包含变量：不打开 cache 时每记录一条日志都需要打开、关闭日志文件，可以通过 open_log_file_cache 对日志文件名包含变量时进行优化
- if 通过变量值控制请求日志是否记录
- 日志缓存
  - 功能 批量将内存中的日志写入磁盘
  - 写入磁盘的条件
    - 所有待写入磁盘的日志大小超出缓存大小，即 buffer 的大小
    - 达到 flush 指定的过期时间
    - worker 进程执行 reopen 命令，或者正在关闭
- 日志压缩
  - 功能 批量压缩内存中的日志，在写入磁盘
  - buffer 大小默认为 64KB
  - 压缩级别默认为 1（1 最快压缩率最低，9 最慢压缩率最高）

## HTTP 过滤相关的模块处理过程

Nginx 的过滤模块就是对 HTTP 请求进行加工处理的。

- 接收 HTTP 头部后
- 会先经过 preaccess 阶段的处理

  - 首先是 limit_req 模块
  - 其次是 limit_conn 模块

- 然后经过 access 阶段，access 相关模块会进行处理
- 然后经过 content 阶段，access pass 后的内容，会先经过 concat 模块处理，然后是 static 模块处理
- static 模块处理后的内容，就进入了响应阶段，会经过 header 过滤模块，先经过 image_filter 模块，然后经过 gzip 模块，此时会发送 HTTP 头部
- 然后就进入到响应 body 的处理中，同样的 image_filter 先处理，然后 gzip 后处理，处理完成后就可以发送 HTTP 响应包体了。
- 响应的包体会通过以下模块加工响应内容
  - copy_filter 复制包体内容，必须在 gzip 之前
  - postpone_filter 处理子请求
  - header_filter 构造响应头部，例如会添加 server，Nginx 版本号等等
  - write_filter 发送响应
