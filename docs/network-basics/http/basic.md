# 重新认识 HTTP

## 历史脉络

20 世纪 70 年代，研究人员发明了 TCP/IP 协议，并在 80 年代中期进入了 UNIX 系统的内核。

1989 年 3 月，互联网的黎明期。为了能让全世界的研究者们共享知识，CERN(欧洲核子研究组织)的蒂姆·伯纳斯·李( Tim Berners Lee )博士提出了一个设想：借助多文档之间相互关联形成的超文本( HyperText )，连成可相互参阅的 WWW (World Wide Web，万维网)。

![WWW](./images/www.png)

## 什么是 HTTP

HTTP( HyperText Transfer Protocol) 超文本传输协议，也表示 **与 HTTP 协议相关的所有应用层技术的综合**。

### HTTP 详细描述

#### 协议

HTTP 是一个协议，协议有以下特点：

1. 协议的“协”字表明：协议必须要有两个或多个参与者。
2. 协议的“议”字表明：协议是对参与者的一种行为约定和规范。

HTTP 是一个用在计算机世界里的协议，它使用计算机能够理解的语言建立了一种计算机之间交流通信的规范，以及相关的各种控制和错误处理方式。

#### 传输

传输有以下几点：

1. HTTP 协议是一个“双向协议”
2. 假设数据在 A 和 B 之间传输，但并没有限制只有 A 和 B 这两个角色，允许中间有“中转”和“接力”

HTTP 是一个在计算机世界里专门用来在两点之间传输数据的约定和规范。

#### 超文本

超越普通文本的文本，它是文字、图片、音频和视频等的混合体，最关键的是含有“超链接”，能够从一个“超文本”跳转到另一个“超文本”，形成复杂的非线性、网状的结构关系。

#### 总结

HTTP 是一个在计算机世界里专门在两点之间传输文字、图片、音频、视频等超文本数据的约定和规范。


## HTTP的发展

### HTTP/0.9

1990 年，HTTP 问世后，当时并没有作为一个正式的标准，因为是 HTTP/1.0 之前存在的版本，所以被称为 HTTP/0.9。

作为最开始的“原型”，HTTP/0.9 结构简单，采用纯文本格式，而且文档时只读的，所以请求方式只有 GET ,响应请求之后立即关闭链接。虽然功能简单，但是验证了设想的可行性，也方便以后的扩展。

### HTTP/1.0

1992 年 JPEG 图像格式出现，1993 年 NCSA（美国国家超级计算应用中心）开发出第一个可以图文混排的浏览器 Mosaic ，1995 年 MP3 音乐格式出现，同年，Apache 开发出来，简化了 HTTP 服务器的搭建工作。

这些新事物推动着 HTTP 的发展，1996 年 5月，HTTP/1.0 正式发布，标准为 RFC1945.

HTTP/1.0 新增了以下特性：

1. 增加了 HEAD、POST 等新方法；
2. 增加了响应状态码，标记可能的错误原因；
3. 引入了协议版本号概念；
4. 引入了 HTTP Header（头部）的概念，让 HTTP 处理请求和响应更加灵活；
5. 传输的数据不再仅限于文本。

### HTTP/1.1

1995 年开始的浏览器大战过去后，HTTP/1.0 在实践中进一步发展，1997年1月公布了 HTTP/1.1 ，标准为 RFC2068，之后在 1999 年发布了一次修订，标准为 RFC2616。形成了现在主流的 HTTP 协议版本。

HTTP/1.1新增了以下特性：

1. 增加了 PUT、DELETE 等新的方法；
2. 增加了缓存管理和控制；
3. 明确了连接管理，允许持久连接；
4. 允许响应数据分块（chunked），利于传输大文件；
5. 强制要求 Host 头，让互联网主机托管成为可能。

2014年又做了一次修订，把庞大复杂的 HTTP/1.1 文档拆分成了六份文档，RFC编号为 7230-7235，除了优化了一些细节外，没有实质性的改动。

### HTTP/2.0

互联网经过了十多年的发展，HTTP/1.1 的不足慢慢暴露出来，负责互联网技术标准的 IETF（ Internet Engineering Task Force, 互联网工程任务组）创立 httpbis 工作组，目标是推进下一代 HTTP —— HTTP/2.0 在 2014 年 11 月实现标准化。最终，以 SPDY（ Google 推出的新协议） 为基础的 HTTP/2.0 在 2015 年发布，标准为 RFC7540。

HTTP/2.0 考虑了现在互联网带宽、移动、不安全的现状，改善性能的同时，高度兼容 HTTP/1.1，新增了以下特性：

1. 二进制协议，不再是纯文本；
2. 可发起多个请求，废弃了 1.1 里的管道；
3. 使用专用算法压缩头部，减少数据传输量；
4. 允许服务器主动向客户端推送数据；
5. 增强了安全性，“事实上”要求加密通信。

### HTTP/3.0

在 HTTP/2.0 还处于草案时，QUIC（ Google 推出的新协议）被发明出来。在 2018 年 IETF 将 “HTTP over QUIC” 更名为 “HTTP/3.0”，HTTP/3.0 正式进入标准化指定阶段。



## 拓展

### HTTP 不是什么。

上面我们清楚了 HTTP 是什么，也可以从反面看 HTTP 不是什么。

1. HTTP 不是互联网，互联网（Internet）是由全球很多个网络互相连接形成的国际网络，上面存在着各种各样的资源，也对应着各种各样的协议，除了超文本资源使用的 HTTP ，普通文件使用 FTP，电子邮件使用 SMTP 和 POP3等。
2. HTTP 不是编程语言，编程语言是人与计算机沟通交流使用的语言，而 HTTP 是计算机与计算机沟通交流的语言。
3. HTTP 不是一个鼓励的协议，HTTP 通常跑在 TCP/IP 协议栈上，依靠 IP协议实现寻址和路由、TCP洗衣实现可靠数据传输、DNS 协议实现域名查找、SSL/TLS协议实现安全通信。此外，还有一些协议依赖于 HTTP ，例如 WebSocket、HTTPDNS等。

### Web Server 和 Web Service

Web Server 是服务器，承载应用。

Web Service 是一种 W3C 定义的应用服务开发规范：使用 client-server 主从架构，通常使用 WSDL 定义服务接口，使用 HTTP 协议传输 XML 或 SOAP 消息。它**是一个基于 Web（HTTP） 的服务架构技术**，本质上，就是通过网络调用其他网站的资源。Web Service 架构的基本思想就是，尽量把非核心功能交给其他人开发，自己专注开发核心功能。

### 小趣闻

第一个网页浏览器是蒂姆·伯纳斯·李ß发明的，名字叫 WorldWideWeb 。第一个 Web 服务器也是由蒂姆·伯纳斯·李设计并参与开发的，名字叫 CERN httpd。

## 参考资料

1. [Web service是什么？](http://www.ruanyifeng.com/blog/2009/08/what_is_web_service.html)
