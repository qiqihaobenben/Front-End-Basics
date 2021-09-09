# Nginx 介绍

传统的 Web 服务器（例如 Apache），每个客户端连接作为一个单独的进程或者线程处理，需要在切换任务时将 CPU 切换到新的任务并创建一个新的运行时上下文（消耗额外的内存和 CPU 时间），当并发请求增加时，服务器响应会变慢，从而对性能产生负面影响。

Nginx 是开源、高性能、高可靠的 HTTP 和反向代理服务器，而且支持热部署，几乎可以做到 7 x 24 小时不间断运行，即使运行几个月也不需要重新启动，还能在不间断服务的情况下对软件版本进行更新。性能是 Nginx 最重要的考量，其占用内存小，采用事件驱动的异步非阻塞处理方式，并发能力强，最重要的是，Nginx 是免费的并可以商业化，配置使用也比较简单。

Nginx 2002 开始开发，2004 年 10 月 4 号发布第一个版本 0.1.0，2005 年重构 http 反向代理，2009 年发布的 0.7.52 开始支持 Windows 系统，并且从 2009 年后，Nginx 发布版本中 bugfix 的数量显著减少，说明趋于稳定。2011 年，1.0 版本发布，支持上游 keepalive http 长链接，同年 Nginx Plus 商业公司成立。2013 年支持 websocket TFO 等协议，2015 年支持 thread pool，提供 stream 四层反向代理，支持 reuseport 特性，支持 httpv2 协议。2016 年支持动态模块，2018 年支持 TLSv1.3。

Nginx 新的发布版本分为 Mainline version 和 Stable version，Mainline version 是不稳定的单数版本，Stable version 是稳定的双数版本。

Nginx 和 Node.js 的很多里面类似：HTTP 服务器、事件驱动、异步非阻塞等。不过 Nginx 更擅长底层服务器端资源的处理（静态资源处理转发、反向代理、负载均衡等），Node.js 更擅长上层具体业务逻辑的处理。

## Nginx 特点

- 高并发，高性能：主流服务器 32 核 64G 的服务器能达到数千万的并发链接
- 可扩展性好：模块化设计
- 高可靠性
- 热部署：可以在不停止服务的情况下升级 Nginx
- BSD 许可证：可以商业化

## Nginx 使用场景

1. 静态资源服务

- 静态 HTTP 服务器
- 通过本地文件系统提供服务

2. 反向代理服务（依赖 Nginx 的强大性能）

- 缓存加速
- 负载均衡

3. 负载均衡

- OpenResty

## Nginx 组成

1. Nginx 二进制可执行文件：由各模块源码编译出的一个文件
2. Nginx.conf 配置文件：控制 Nginx 的行为
3. access.log 访问日志：记录每一条 http 请求信息
4. error.log 错误日志：定位问题

以车作为比喻：Nginx 二进制可执行文件相当于车的整体框架和控制系统，Nginx.conf 配置文件相当于驾驶员，access.log 相当于 GPS 定位，error.log 相当于黑匣子。

## Nginx 发行版选择

- 开源免费的 Nginx 与商业版 Nginx Plus
  - 开源版：nginx.org
  - 商业版：nginx.com
- 阿里巴巴的 Tengine：修改了 nginx 源码，虽然可以使用 nginx 的官方和第三方模块，但是不能跟随 nginx 升级
- 免费的 OpenResty 与商业版的 OpenResty（章亦春）lua 语言同步开发的方式，在保持 Nginx 高性能的同时，提高开发效率。
  - 开源版：http://openresty.org
  - 商业版：https://openresty.com

如果没有太多的业务诉求，使用开源版的 Nginx 足够，如果需要开发 API 服务器或者 Web 防火墙，可以使用开源版的 OpenResty。
