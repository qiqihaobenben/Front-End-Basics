# Nginx 进阶

## Nginx 请求处理流程

Nginx 的请求处理流程大体是这样的：接收到 WEB、EMAIL、TCP 流量后，因为 Nginx 采用的非阻塞的事件驱动处理引擎，所以会有传输层状态机处理 TCP 流量，HTTP 状态机处理 WEB 流量，MAIL 状态机处理 EMAIL 流量，然后进行静态资源访问，如果是反向代理还能加入磁盘缓存，当分配的内存不足以完全缓存文件内容时，例如 sendfile 等大文件时，会退化成阻塞的磁盘调用，所以还会使用线程池处理磁盘阻塞调用，对于每一个处理完成的请求，会记录 Access 访问日志和 Error 错误日志，Nginx 作为负载均衡使用时，可以把请求通过协议机传输到后面的服务器。

## Nginx 架构

Nginx 可以分为单进程和多进程模式，单进程一般作为调试开发使用，在生产环境一般用多进程。

Nginx 多进程模式，有一个主进程和其他子进程（包括 Worker 进程 和 cache 相关进程：Cache manager、Cache loader）。主进程的主要工作是加载和执行配置文件，并且驻留子进程。子进程用来作为实际的请求处理。Nginx 采取基于事件的模型和 OS 依赖的机制，在多个子进程之间高效的分配请求。子进程的个数会直接写在配置文件中，并且对于给定的配置可以是固定的，也可以根据可用的 CPU 核数自动进行调整。缓存相关的内容是各进程共享的，反向代理时，Cache manager 进程管理上游的缓存，Cache loader 进程载入上游的缓存。

## Nginx 进程管理：信号

Nginx 的多进程通信是使用的共享内存方式，Nginx 的进程管理使用的是信号。

### Master 进程

#### 监控 Worker 进程

Master 进程会监控 Worker 进程有没有发来的 CHLD 信号，Linux 系统规定，当子进程终止时，会向父进程发送 CHLD 信号。当 Worker 进程因为某些原因报错终止时，会向 Master 进程发送 CHLD 信号，Master 进程接收到信号后，会拉起一个新的 Worker 进程。

#### 管理 Worker 进程

Master 进程会接收到一些信号来管理 Worker 进程。

既可以使用 Nginx 命令行，也可以使用 kill 指令的方式接收的信号有以下几种：

- TERM,INT 立刻停止 Nginx 进程，对应 `nginx -s stop`
- QUIT 优雅停止，对应 `nginx -s quit`
- HUP 重新载入配置文件，对应 `nginx -s reload`
- USR1 重新打开日志文件，做日志切割，对应 `nginx -s reopen`

以上几种信号用 Nginx 命令行可以起到同样的作用是因为，Nginx 在启动时，一般会默认在 Nginx 安装目录的 logs 文件夹下 nginx.pid 中记录 Nginx 的 Master 进程 pid，在执行 nginx -s 命令时，这个命令行工具会向 nginx.pid 记录的 pid 发送相应的信号。

只能使用 kill 指令的方式接收的信号：

- USR2
- WINCH

### Worker 进程

Worker 进程也可以接收一些信号，只能使用 kill + 进程 id 的方式：

- TERM,INT
- QUIT
- USR1
- WINCH

通常我们不直接对 Worker 进程发送信号，因为规范的方式是通过 Master 进程来管理 Worker 进程

## Nginx reload 流程

1. 向 Master 进程发送 HUP 信号（reload 命令）
2. Master 进程校验配置语法是否正确
3. Master 进程打开新的监听端口（如果有新端口的话，因为子进程的端口会继承父进程的端口）
4. Master 进程用新配置启动新的 Worker 子进程
5. Master 进程向老 Worker 子进程发送 QUIT 信号
6. 老 Worker 子进程关闭监听句柄，处理完当前连接后结束进程（为了避免老 Worker 子进程长时间存在，可以设置 worker_shutdown_timeout 超时时间）

## Nginx 热升级流程

1. 将旧 Nginx 文件换成新 Nginx 文件（注意备份）
2. 向 master 进程发送 USR2 信号
3. master 进程修改 pid 文件名，加后缀 .oldbin
4. master 进程用新 Nginx 文件启动新 master 进程
5. 向老 master 进程发送 QUIT 信号，关闭老 master 进程
6. 回滚：向老 master 发送 HUP，向新 master 发送 QUIT

## worker 进程优雅关闭（quit）

1. 设置定时器 worker_shutdown_timeout
2. 关闭监听句柄
3. 关闭空闲连接
4. 在循环中等待全部连接关闭（时间可能会较长，当超过 worker_shutdown_timeout 设置的时间，worker 进程会把剩下的连接直接关闭）
5. 退出进程

## 共享内存

跨 worker 进程通信的关键是共享内存，官方 Nginx 模块使用了共享内存的有以下几个：

- ngx_http_lua_api
- rbtree 数据结构
  - ngx_stream_limit_conn_module
  - ngx_http_limit_conn_module
  - ngx_stream_limit_req_module
  - http cache 相关
    - ngx_http_file_cache
    - ngx_http_proxy_module
    - ngx_http_scgi_module
    - ngx_http_uwsgi_module
    - ngx_http_fastcgi_module
  - ssl 相关
    - ngx_http_ssl_module
    - ngx_mail_ssl_module
    - ngx_stream_ssl_module
- 单链表数据结构
  - ngx_http_upstream_zone_module
  - ngx_stream_upstream_zone_module
