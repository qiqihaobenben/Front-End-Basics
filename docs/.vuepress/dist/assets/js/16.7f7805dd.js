(window.webpackJsonp=window.webpackJsonp||[]).push([[16],{439:function(t,a,e){t.exports=e.p+"assets/img/1.f5a50305.png"},440:function(t,a,e){t.exports=e.p+"assets/img/2.c90d80b6.png"},441:function(t,a,e){t.exports=e.p+"assets/img/3.36c5a804.png"},597:function(t,a,e){"use strict";e.r(a);var r=e(45),s=Object(r.a)({},(function(){var t=this,a=t.$createElement,r=t._self._c||a;return r("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[r("h1",{attrs:{id:"http-简介"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#http-简介"}},[t._v("#")]),t._v(" HTTP 简介")]),t._v(" "),r("h3",{attrs:{id:"概念"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#概念"}},[t._v("#")]),t._v(" 概念")]),t._v(" "),r("p",[t._v("http 是一种无状态的协议，只有请求才会响应，然后断开，也没有记忆。\n互联网中的设备要完成通信必须基于双方都能识别的规则，如通信的语音，格式，硬件和操作系统等等，这些规则的集合统称为 TCP/IP 协议族。")]),t._v(" "),r("ul",[r("li",[r("p",[t._v("URL（Uniform Resource Locator，统一资源定位符）是 URI（统一资源标识符）的子集，URI 可以标识网络中的任意资源，有了 URI 才能在海量的网络资源中找到我们需要的那部分。")])]),t._v(" "),r("li",[r("p",[t._v("DNS（Domain Name System， 域名系统），因为 IP 地址的记忆实在是反人类，而域名机器识别不了，所以有了 DNS 将二者自由转换。")])]),t._v(" "),r("li",[r("p",[t._v("ARP 是一种用以解析地址的协议，根据通信方的 IP 地址就，可以反查出对应的 MAC 地址。除了路由器外，信息要到达目标服务器地址可能还要经过代理服务器，网关等设备")])])]),t._v(" "),r("h3",{attrs:{id:"http-报文详解"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#http-报文详解"}},[t._v("#")]),t._v(" HTTP 报文详解")]),t._v(" "),r("p",[t._v("用于 HTTP 协议交互的信息被称为 HTTP 报文。")]),t._v(" "),r("h4",{attrs:{id:"cache-control-操作缓存的指令。主要有以下几种用法"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#cache-control-操作缓存的指令。主要有以下几种用法"}},[t._v("#")]),t._v(" Cache-Control： 操作缓存的指令。主要有以下几种用法")]),t._v(" "),r("p",[r("code",[t._v("Cache-Control: no-cache")]),t._v("\n表示客户端不接受缓存的响应，必须请求最新的资源。\n"),r("code",[t._v("Cache-Control: no-store")]),t._v("\n表示客户端不能缓存请求或者响应的任意一部分。\n"),r("code",[t._v("Cache-Control: max-age=604800（单位 ：秒）")]),t._v("\nmax-age 数值代表资源保存为缓存的最长时间。当指定 max-age 值为 0 或者缓存超过最大时间，那么缓存服务器通常需要将请求转发给 源服务器。")]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"connection-由于-http1-1-后-客户端和服务端建立连接后可以多次通信-连接的是否中断可以依靠以下指令控制。"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#connection-由于-http1-1-后-客户端和服务端建立连接后可以多次通信-连接的是否中断可以依靠以下指令控制。"}},[t._v("#")]),t._v(" Connection： 由于 HTTP1.1 后，客户端和服务端建立连接后可以多次通信，连接的是否中断可以依靠以下指令控制。")]),t._v(" "),r("p",[r("code",[t._v("Connection: close")]),t._v("\n表示想断开当前连接。\n"),r("code",[t._v("Connection: Keep-Alive")]),t._v("\n表示想保持当前连接。")]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"date-表明创建-http-报文的日期和时间"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#date-表明创建-http-报文的日期和时间"}},[t._v("#")]),t._v(" Date： 表明创建 HTTP 报文的日期和时间")]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"upgrade-用于检测-http-协议及其他协议是否可使用更高-的版本进行通信-其参数值可以用来指定一个完全不同的通信协议。"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#upgrade-用于检测-http-协议及其他协议是否可使用更高-的版本进行通信-其参数值可以用来指定一个完全不同的通信协议。"}},[t._v("#")]),t._v(" Upgrade： 用于检测 HTTP 协议及其他协议是否可使用更高 的版本进行通信，其参数值可以用来指定一个完全不同的通信协议。")]),t._v(" "),r("p",[t._v("比如"),r("code",[t._v("Upgrade: websocket")])]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"via-为了追踪客户端与服务器之间的请求和响应报文的传输路径。之前说过-一个请求的过程除了经过路由器外-还可能经过代理-网关等设备-这些设备的路径将被记录。"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#via-为了追踪客户端与服务器之间的请求和响应报文的传输路径。之前说过-一个请求的过程除了经过路由器外-还可能经过代理-网关等设备-这些设备的路径将被记录。"}},[t._v("#")]),t._v(" Via: 为了追踪客户端与服务器之间的请求和响应报文的传输路径。之前说过，一个请求的过程除了经过路由器外，还可能经过代理，网关等设备，这些设备的路径将被记录。")]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"warning-一些警告信息。"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#warning-一些警告信息。"}},[t._v("#")]),t._v(" Warning: 一些警告信息。")]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"accept-用户代理能够处理的媒体类型和优先级。"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#accept-用户代理能够处理的媒体类型和优先级。"}},[t._v("#")]),t._v(" Accept: 用户代理能够处理的媒体类型和优先级。")]),t._v(" "),r("p",[r("code",[t._v("Accept: text/html,image/jpeg")]),t._v("\n客户端可以处理的媒体类型，包括文本和 jpeg 格式的图片")]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"accept-charset-用户代理支持的字符集-及字符集的相对优先顺序。"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#accept-charset-用户代理支持的字符集-及字符集的相对优先顺序。"}},[t._v("#")]),t._v(" Accept-Charset: 用户代理支持的字符集 及字符集的相对优先顺序。")]),t._v(" "),r("p",[r("code",[t._v("Accept-Charset: iso-8859-5, unicode-1-1;q=0.8")]),t._v("\n权重 q 值来表示相对优先级。")]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"accept-encoding-用户代理支持的内容编码及内容编码的优先级顺序。"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#accept-encoding-用户代理支持的内容编码及内容编码的优先级顺序。"}},[t._v("#")]),t._v(" Accept-Encoding: 用户代理支持的内容编码及内容编码的优先级顺序。")]),t._v(" "),r("p",[r("code",[t._v("Accept-Encoding: gzip, deflate,compress")])]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"accept-language-用户代理能够处理的自然语言集-指中文或英文等-及优先级。"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#accept-language-用户代理能够处理的自然语言集-指中文或英文等-及优先级。"}},[t._v("#")]),t._v(" Accept-Language: 用户代理能够处理的自然语言集（指中文或英文等）及优先级。")]),t._v(" "),r("p",[r("code",[t._v("Accept-Language: zh-cn")])]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"authorization-用户代理的认证信息。"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#authorization-用户代理的认证信息。"}},[t._v("#")]),t._v(" Authorization: 用户代理的认证信息。")]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"host-请求的资源所处的互联网主机名和端口号。"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#host-请求的资源所处的互联网主机名和端口号。"}},[t._v("#")]),t._v(" Host: 请求的资源所处的互联网主机名和端口号。")]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"range-range-bytes-5001-10000-请求获取从第-5001-字节至第-10000-字节的资源"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#range-range-bytes-5001-10000-请求获取从第-5001-字节至第-10000-字节的资源"}},[t._v("#")]),t._v(" Range: Range: bytes=5001-10000 请求获取从第 5001 字节至第 10000 字节的资源")]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"referer-请求的-uri-是哪个页面发起的。"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#referer-请求的-uri-是哪个页面发起的。"}},[t._v("#")]),t._v(" Referer: 请求的 URI 是哪个页面发起的。")]),t._v(" "),r("p",[r("code",[t._v("Referer: http://www.xxx.com/index.html")])]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"user-agent-创建请求的浏览器或用户代理名称等信息"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#user-agent-创建请求的浏览器或用户代理名称等信息"}},[t._v("#")]),t._v(" User-Agent: 创建请求的浏览器或用户代理名称等信息")]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"age-源服务器在多久前创建了响应。字段值的单位为秒。-age-600"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#age-源服务器在多久前创建了响应。字段值的单位为秒。-age-600"}},[t._v("#")]),t._v(" Age: 源服务器在多久前创建了响应。字段值的单位为秒。 "),r("code",[t._v("Age: 600")])]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"expires-资源失效的日期。"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#expires-资源失效的日期。"}},[t._v("#")]),t._v(" Expires: 资源失效的日期。")]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"last-modified-说明资源最终修改的时间。"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#last-modified-说明资源最终修改的时间。"}},[t._v("#")]),t._v(" Last-Modified: 说明资源最终修改的时间。")]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"allow-支持-request-uri-指定资源的所有-http-方法。allow-get-head"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#allow-支持-request-uri-指定资源的所有-http-方法。allow-get-head"}},[t._v("#")]),t._v(" Allow： 支持 Request-URI 指定资源的所有 HTTP 方法。"),r("code",[t._v("Allow: GET, HEAD")])]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"content-type-实体主体内对象的媒体类型。"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#content-type-实体主体内对象的媒体类型。"}},[t._v("#")]),t._v(" Content-Type: 实体主体内对象的媒体类型。")]),t._v(" "),r("p",[r("code",[t._v("Content-Type: text/html; charset=UTF-8")])]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"content-encoding-服务器对实体的主体部分选用的内容编码方式。"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#content-encoding-服务器对实体的主体部分选用的内容编码方式。"}},[t._v("#")]),t._v(" Content-Encoding: 服务器对实体的主体部分选用的内容编码方式。")]),t._v(" "),r("p",[r("code",[t._v("Content-Encoding: gzip")])]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"content-language-实体主体使用的自然语言-指中文或英文等语言"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#content-language-实体主体使用的自然语言-指中文或英文等语言"}},[t._v("#")]),t._v(" Content-Language: 实体主体使用的自然语言（指中文或英文等语言）")]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"content-length-表明了实体主体部分的大小-单位是字节"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#content-length-表明了实体主体部分的大小-单位是字节"}},[t._v("#")]),t._v(" Content-Length: 表明了实体主体部分的大小（单位是字节）")]),t._v(" "),r("p",[r("code",[t._v("Content-Length: 15000")]),t._v("\n当我们获取下载进度信息时，常常使用使用这个信息。")]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"set-cookie"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#set-cookie"}},[t._v("#")]),t._v(" Set-Cookie")]),t._v(" "),r("p",[t._v("和 cookie 相关的信息。")]),t._v(" "),r("p",[r("img",{attrs:{src:e(439),alt:"cookie相关的信息"}})]),t._v(" "),r("p",[t._v("安全相关的 2 个属性\n"),r("img",{attrs:{src:e(440),alt:"安全相关的2个属性"}})]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"cookie-如果想-http-状态管理时-请求的首部加入"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#cookie-如果想-http-状态管理时-请求的首部加入"}},[t._v("#")]),t._v(" Cookie: 如果想 HTTP 状态管理时，请求的首部加入")]),t._v(" "),r("p",[r("code",[t._v("Cookie: status=enable")]),t._v("\nHTTP 是无状态的，其状态管理要依赖于 Cookie。")]),t._v(" "),r("hr"),t._v(" "),r("h4",{attrs:{id:"状态码"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#状态码"}},[t._v("#")]),t._v(" 状态码")]),t._v(" "),r("p",[r("img",{attrs:{src:e(441),alt:"状态码"}})]),t._v(" "),r("h3",{attrs:{id:"基础概念-是什么-为什么会流行-什么是请求方法-状态码都有哪些含义-优缺点"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#基础概念-是什么-为什么会流行-什么是请求方法-状态码都有哪些含义-优缺点"}},[t._v("#")]),t._v(" 基础概念，是什么，为什么会流行，什么是请求方法，状态码都有哪些含义 优缺点")]),t._v(" "),r("h3",{attrs:{id:"报文详解-状态码详解-实体数据怎么处理-大文件是怎么处理-是怎么连接的-重定向和跳转-cookie-缓存控制-代理和缓存代理"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#报文详解-状态码详解-实体数据怎么处理-大文件是怎么处理-是怎么连接的-重定向和跳转-cookie-缓存控制-代理和缓存代理"}},[t._v("#")]),t._v(" 报文详解，状态码详解，实体数据怎么处理，大文件是怎么处理，是怎么连接的，重定向和跳转，cookie，缓存控制，代理和缓存代理")]),t._v(" "),r("h3",{attrs:{id:"安全相关"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#安全相关"}},[t._v("#")]),t._v(" 安全相关")]),t._v(" "),r("h3",{attrs:{id:"http2-和-http3"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#http2-和-http3"}},[t._v("#")]),t._v(" HTTP2 和 HTTP3")]),t._v(" "),r("h3",{attrs:{id:"nginx-和-openresty"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#nginx-和-openresty"}},[t._v("#")]),t._v(" nginx 和 openresty")]),t._v(" "),r("h3",{attrs:{id:"waf"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#waf"}},[t._v("#")]),t._v(" WAF")]),t._v(" "),r("h3",{attrs:{id:"cdn"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#cdn"}},[t._v("#")]),t._v(" CDN")]),t._v(" "),r("h3",{attrs:{id:"websocket"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#websocket"}},[t._v("#")]),t._v(" websocket")]),t._v(" "),r("h3",{attrs:{id:"http-性能优化"}},[r("a",{staticClass:"header-anchor",attrs:{href:"#http-性能优化"}},[t._v("#")]),t._v(" HTTP 性能优化")])])}),[],!1,null,null,null);a.default=s.exports}}]);