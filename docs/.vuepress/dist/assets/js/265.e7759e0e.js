(window.webpackJsonp=window.webpackJsonp||[]).push([[265],{739:function(t,s,e){"use strict";e.r(s);var a=e(25),n=Object(a.a)({},(function(){var t=this,s=t._self._c;return s("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[s("h1",{attrs:{id:"nginx-实操-常用配置"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#nginx-实操-常用配置"}},[t._v("#")]),t._v(" Nginx 实操-常用配置")]),t._v(" "),s("h2",{attrs:{id:"适配-pc-与-移动环境"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#适配-pc-与-移动环境"}},[t._v("#")]),t._v(" 适配 PC 与 移动环境")]),t._v(" "),s("p",[t._v("现在很多网站都同时存在 PC 站和 H5 站，因此根据用户的浏览环境自动切换站点是很常见的需求。Nginx 可以通过内置变量 "),s("code",[t._v("$http_user_agent")]),t._v("，获取到请求客户端的 userAgent，从而知道用户处于移动端还是 PC 端，进而控制重定向到 PC 站 还是 H5 站，例如 PC 端站点为 "),s("code",[t._v("example.com")]),t._v("，H5 端站点为 "),s("code",[t._v("h5.example.com")]),t._v("，就可以在 PC 端配置 Nginx ：")]),t._v(" "),s("div",{staticClass:"language-nginx extra-class"},[s("pre",{pre:!0,attrs:{class:"language-nginx"}},[s("code",[s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("server")])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("listen")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("80")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("server_name")]),t._v(" example.com")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("location")]),t._v(" /")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("root")]),t._v(" /usr/local/app/pc")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("#pc 的 html 路径")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("#获取 userAgent")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" ("),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$http_user_agent")]),t._v(" ~* "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'(Android|webOS|iPhone|iPad|BlackBerry)'")]),t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("rewrite")]),t._v(" ^.+ http://h5.example.com")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("index")]),t._v(" index.html")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h2",{attrs:{id:"图片处理"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#图片处理"}},[t._v("#")]),t._v(" 图片处理")]),t._v(" "),s("p",[t._v("在前端开发中，经常需要不同尺寸的图片。现在的云存储基本对图片都提供有处理服务（一般是通过在图片链接上加参数）。用 Nginx 可以通过几十行配置，搭建出一个属于自己的本地图片处理服务，完全能够满足日常对图片的裁剪、缩放、旋转、图片品质等处理需求。需要用到 "),s("a",{attrs:{href:"http://nginx.org/en/docs/http/ngx_http_image_filter_module.html",target:"_blank",rel:"noopener noreferrer"}},[s("code",[t._v("ngx_http_image_filter_module")]),s("OutboundLink")],1),t._v(" 模块，这个模块是非基本模块，需要安装。此外还可以通过 proxy_cache 配置 Nginx 缓存，避免每次请求都重新处理图片，减少 Nginx 服务器处理压力，还可以通过和 "),s("a",{attrs:{href:"http://www.nginxguts.com/nginx-upload-module/",target:"_blank",rel:"noopener noreferrer"}},[s("code",[t._v("nginx-upload-module")]),s("OutboundLink")],1),t._v(" 一起使用加入图片上传的功能。")]),t._v(" "),s("p",[t._v("图片缩放功能示例：")]),t._v(" "),s("div",{staticClass:"language-nginx extra-class"},[s("pre",{pre:!0,attrs:{class:"language-nginx"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# example.com/img/ 路径会进行图片处理")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("location")]),t._v(" ~* /image/(.+)$")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("alias")]),t._v(" /home/www/static/image/"),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$1")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 图片服务端存储地址")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$width")]),t._v(" -")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 图片宽度默认值")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$height")]),t._v(" -")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 图片高度默认值")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if($arg_width")]),t._v(" != "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('""')]),t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$width")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$arg_width")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if($arg_height")]),t._v(" != "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('""')]),t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$height")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$arg_height")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("image_filter")]),t._v(" resize "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$width")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$height")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 设置图片宽高")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("image_filter_buffer")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("10M")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 设置 Nginx 读取图片的最大 buffer")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("image_filter_interlace")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("on")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 是否开启图片图像隔行扫描")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("error_page")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("500")]),t._v(" = 500.png")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 图片处理错误提示图，例如缩放参数不是数字")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h2",{attrs:{id:"页面内容修改"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#页面内容修改"}},[t._v("#")]),t._v(" 页面内容修改")]),t._v(" "),s("p",[t._v("Nginx 可以通过向页面底部或者顶部插入额外的 css 和 js 文件，从而实现修改页面内容。这个功能需要额外模块支持，例如 "),s("a",{attrs:{href:"https://github.com/alibaba/nginx-http-footer-filter",target:"_blank",rel:"noopener noreferrer"}},[s("code",[t._v("nginx-http-footer-filter")]),s("OutboundLink")],1),t._v(" 或者 "),s("a",{attrs:{href:"http://nginx.org/en/docs/http/ngx_http_addition_module.html",target:"_blank",rel:"noopener noreferrer"}},[s("code",[t._v("ngx_http_addition_module")]),s("OutboundLink")],1),t._v("。工作中，经常需要切换各种测试环境，而通过 switchhosts 等工具切换后，有时还需要清理浏览器 dns 缓存。可以通过页面内容修改 + Nginx 反向代理来实现轻松快捷的环境切换。这里首先在本地编写一段 js 代码（switchhost.js）里面的逻辑是：在页面插入 hosts 切换菜单以及点击具体某个环境时，将该 host 的 ip 和 hostname 存储在 cookie 中，最后刷新页面；接着编写一段 css 代码（switchhost.css）用来设置该 hosts 切换菜单的样式。最后 Nginx 脚本配置：")]),t._v(" "),s("div",{staticClass:"language-nginx extra-class"},[s("pre",{pre:!0,attrs:{class:"language-nginx"}},[s("code",[s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("server")])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("listen")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("80")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("listen")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("443")]),t._v(" ssl")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("server_name")]),t._v(" example.com")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$root")]),t._v(" /home/www/example")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("charset")]),t._v(" utf-8")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("ssl_certificate")]),t._v(" /usr/local/nginx/conf/ssl/example.com.crt")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("ssl_certificate_key")]),t._v(" /usr/local/nginx/conf/ssl/exmaple.com.key")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 设置默认 host，一般默认为线上 host，这里是随便写的")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$switch_host")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'8,8,8,8'")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 设置默认 hostname，一般默认为线上 'online'")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$switch_hostname")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("''")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 从 cookie 中获取环境 ip")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" ("),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$http_cookie")]),t._v(" ~* "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"switch_host=(.+?)(?=;|$)"')]),t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$switch_host")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$1")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 从 cookie 中获取环境名称")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" ("),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$http_cookie")]),t._v(" ~* "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('"switch_hostname=(.+?)(?=;|$)"')]),t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$switch_hostname")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$1")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("location")]),t._v(" /")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("index")]),t._v(" index.html")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("proxy_set_header")]),t._v(" Host "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$host")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 把 html 页面的 gzip 压缩去掉，不然 sub_filter 无法替换内容")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("proxy_set_header")]),t._v(" Accept-Encoding")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 反向代理到实际服务器 ip")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("proxy_pass")]),t._v(" http://"),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$switch_host:80")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 全部替换")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("sub_filter_once")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token boolean"}},[t._v("off")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# ngx_http_addition_module 模块替换内容")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 这里在头部插入一段 css，内容是 hosts 切换菜单的 css 样式")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("sub_filter")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'</head>'")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v('\'</head><link rel="stylesheet" type="text/css" media="screen" href="/local/switchhost.css" />\'')])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 这里使用另一个模块 nginx-http-footer-filter，其实上面的模块就行，只是为了展示用法")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 最后插入一段 js，内容是 hosts 切换菜单的 js 逻辑")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("set")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$injected")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'<script src=\"/local/switchhost.js\"><\/script>'")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("footer")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'"),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$injected")]),t._v("'")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 对于 /local/ 请求，优先匹配本地文件")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 所以上面的 /local/switchhost.css，/local/switchhost.js 会从本地获取")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("location")]),t._v(" ^~ /local/")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("root")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$root")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("这个功能其实为 Nginx 在前端开发中的应用提供了无限可能。例如，可以通过区分本地、测试和线上环境，为本地、测试环境页面增加很多开发辅助功能：给本地页面增加一个常驻二维码便于手机端扫码调试；本地调试线上页面时，在 js 文件底部加入 sourceMappingURL，便于本地 debug 等等。")]),t._v(" "),s("h2",{attrs:{id:"请求限制"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#请求限制"}},[t._v("#")]),t._v(" 请求限制")]),t._v(" "),s("p",[t._v("对于大流量恶意的访问，会造成带宽的浪费，给服务器增加压力。可以通过 Nginx 对于同一 IP 的连接数以及并发数进行限制。合理的控制还可以用来防止 DDos 和 CC 攻击。")]),t._v(" "),s("p",[t._v("关于请求限制主要使用 Nginx 默认集成的 2 个模块：")]),t._v(" "),s("ul",[s("li",[t._v("ngx_http_limit_conn_module 连接频率限制模块")]),t._v(" "),s("li",[t._v("ngx_http_limit_req_module 请求频率限制模块")])]),t._v(" "),s("p",[t._v("涉及到的配置主要是:")]),t._v(" "),s("ul",[s("li",[t._v("limit_req_zone 限制请求数")]),t._v(" "),s("li",[t._v("limit_conn_zone 限制并发连接数")])]),t._v(" "),s("h2",{attrs:{id:"图片防盗链"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#图片防盗链"}},[t._v("#")]),t._v(" 图片防盗链")]),t._v(" "),s("h3",{attrs:{id:"简单有效的防盗链手段-referer-模块"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#简单有效的防盗链手段-referer-模块"}},[t._v("#")]),t._v(" 简单有效的防盗链手段：referer 模块")]),t._v(" "),s("p",[t._v("使用场景例如某网站通过 url 引用了你的页面，当用户在浏览器上点击 url 时，http 请求的头部中会通过 referer 头部将该网站当前页面的 url 带上，告诉服务器本次请求是由这个页面发起的。通过 referer 模块，用 invalid_referer 变量根据配置判断 referer 头部是否合法。从而拒绝第三方网站访问我们站点的资源。referer 模块默认编译进 Nginx。")]),t._v(" "),s("h4",{attrs:{id:"valid-referers-指令"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#valid-referers-指令"}},[t._v("#")]),t._v(" valid_referers 指令")]),t._v(" "),s("p",[t._v("语法 "),s("code",[t._v("valid_referers none | blocked | server_names | string...")])]),t._v(" "),s("ul",[s("li",[t._v("none 允许缺失 referer 头部的请求访问")]),t._v(" "),s("li",[t._v("block 允许 referer 头部没有对应的值的请求访问")]),t._v(" "),s("li",[t._v("server_names 若 referer 中站点域名与 server_name 中本机域名某个匹配，则允许该请求访问。")]),t._v(" "),s("li",[t._v("string 域名及 URL 如果是字符串，域名可在前缀或者后缀中含有 "),s("code",[t._v("*")]),t._v(" 通配符，若 referer 头部的值匹配字符串后，则允许请求访问；域名如果是正则表达式，若 referer 头部的值匹配正则表达式后，则允许请求访问")])]),t._v(" "),s("p",[s("strong",[t._v("valid_referers 指令后面可以同时携带多个参数，表示多个 referer 头部都生效。模块还会提供出一个 "),s("code",[t._v("$invalid_referer")]),t._v(" 变量，允许访问时变量值为空，不允许访问时变量值为 1。")])]),t._v(" "),s("div",{staticClass:"language-nginx extra-class"},[s("pre",{pre:!0,attrs:{class:"language-nginx"}},[s("code",[s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("server")])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("listen")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("80")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("server_name")]),t._v(" *.text.com")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 图片防盗链")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("location")]),t._v(" ~* \\.(gif|jpg|jpeg|png|bmp|swf)$")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("valid_referers")]),t._v(" none blocked server_names ~\\.google\\. ~\\.baidu\\. *.qq.com")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 允许没有 referer 头或者值为空，或者google、baidu、qq.com。")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" ("),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$invalid_referer")]),t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n      "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("403")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h3",{attrs:{id:"secure-link-模块防盗链"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#secure-link-模块防盗链"}},[t._v("#")]),t._v(" secure_link 模块防盗链")]),t._v(" "),s("p",[t._v("通过验证 URL 中哈希值的方式防盗链，该模块默认未编译进 Nginx。")]),t._v(" "),s("p",[t._v("实现的功能过程是由某服务器（也可以是 Nginx）生成加密后的安全链接 url，返回给客户端。客户端使用安全 url 访问 Nginx，由 Nginx 的 "),s("code",[t._v("$secure_link")]),t._v(" 变量判断判断是否验证通过。")]),t._v(" "),s("p",[t._v("实现的原理是：")]),t._v(" "),s("ul",[s("li",[t._v("哈希算法是不可逆的")]),t._v(" "),s("li",[t._v("客户端只能拿到执行过哈希算法的 URL")]),t._v(" "),s("li",[t._v("仅生成 URL 的服务器、验证 URL 是否安全的 Nginx 这二者，才保存执行哈希算法前的原始字符串")]),t._v(" "),s("li",[t._v("原始字符串通常由以下部分有序组成：\n"),s("ul",[s("li",[t._v("资源位置，例如 HTTP 中指定资源的 URI，防止攻击者拿到一个安全 URI 后可以访问任意资源")]),t._v(" "),s("li",[t._v("用户信息，例如用户 IP 地址，限制其他用户盗用安全 URI")]),t._v(" "),s("li",[t._v("时间戳，使安全 URI 及时过期")]),t._v(" "),s("li",[t._v("密钥，仅服务器端拥有，增加攻击者猜测出原始字符串的难度")])])])]),t._v(" "),s("p",[t._v("模块提供了两个变量：")]),t._v(" "),s("ul",[s("li",[s("code",[t._v("$secure_link")]),t._v(" 值为空字符串，表示验证不通过，值为 0，表示 URL 过期，值为 1，表示验证通过")]),t._v(" "),s("li",[s("code",[t._v("$secure_link_expires")]),t._v(" 时间戳的值")])]),t._v(" "),s("h4",{attrs:{id:"secure-link-指令"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#secure-link-指令"}},[t._v("#")]),t._v(" secure_link 指令")]),t._v(" "),s("p",[t._v("有两个参数，第一个参数是哈希值，第二个参数是时间戳")]),t._v(" "),s("ul",[s("li",[t._v("首先使用命令行生成安全链接\n"),s("ul",[s("li",[t._v("生成 MD5 "),s("code",[t._v("echo -n '时间戳URL客户端IP密钥' | openssl md5 -binary | openssl base64 | tr +/ -_ | tr -d =")]),t._v(" 例如 "),s("code",[t._v("echo -n '2147483647/test1.txt116.62.160.193 secret' | openssl md5 -binary | openssl base64 | tr +/ -_ | tr -d =")])]),t._v(" "),s("li",[t._v("原请求 "),s("code",[t._v("/test1.txt?md5=md5生成值&expires=时间戳（如 2147483647）")])])])]),t._v(" "),s("li",[t._v("Nginx 配置\n"),s("ul",[s("li",[s("code",[t._v("secure_link $arg_md5,$arg_expires;")])]),t._v(" "),s("li",[s("code",[t._v('secure_link_md5 "$secure_link_expires$uri$remote_addr secret";')])])])])]),t._v(" "),s("h4",{attrs:{id:"secure-link-secret-指令"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#secure-link-secret-指令"}},[t._v("#")]),t._v(" secure_link_secret 指令")]),t._v(" "),s("p",[t._v('采用仅对 URI 进行哈希的简单办法。就是将请求 URL 分为三个部分：/prefix/hash/link，Hash 生成方式是对 "link 密钥" 做 md5 哈希求值，在 Nginx 中使用 secure_link_secret secret; 配置密钥。')]),t._v(" "),s("ul",[s("li",[t._v("命令行生成安全连接\n"),s("ul",[s("li",[t._v("原请求 "),s("code",[t._v("link")])]),t._v(" "),s("li",[t._v("生成的安全请求 "),s("code",[t._v("/prefix/md5/link")])]),t._v(" "),s("li",[t._v("生成 md5 "),s("code",[t._v("echo -n 'linksecret' | openssl -md5 -hex")]),t._v(" 例如 "),s("code",[t._v("echo -n 'test1.txtsecret2' | openssl md5 -hex")])])])]),t._v(" "),s("li",[t._v("Nginx 配置\n"),s("ul",[s("li",[s("code",[t._v("secure_link_secret secret2")]),t._v(";")])])])]),t._v(" "),s("h2",{attrs:{id:"单页面项目-history-路由配置"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#单页面项目-history-路由配置"}},[t._v("#")]),t._v(" 单页面项目 history 路由配置")]),t._v(" "),s("div",{staticClass:"language-nginx extra-class"},[s("pre",{pre:!0,attrs:{class:"language-nginx"}},[s("code",[s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("server")])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("listen")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("80")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("server_name")]),t._v(" test.com")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("location")]),t._v(" /")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("root")]),t._v(" /usr/local/app/dist")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 前端打包后的文件夹")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("index")]),t._v(" index.html index.htm")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("try_files")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$uri")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$uri")]),t._v("/ /index.html @rewrites")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 默认目录下的 index.html，如果都不存在则重定向")]),t._v("\n\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("expires")]),t._v(" -1")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 首页一般没有强制缓存")]),t._v("\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("add_header")]),t._v(" Cache-Control no-cache")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("location")]),t._v(" @rewrites")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v(" // 重定向设置\n    "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("rewrite")]),t._v(" ^(.+)$ /index.html break")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h2",{attrs:{id:"请求过滤"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#请求过滤"}},[t._v("#")]),t._v(" 请求过滤")]),t._v(" "),s("h3",{attrs:{id:"过滤指定-user-agent"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#过滤指定-user-agent"}},[t._v("#")]),t._v(" 过滤指定 user_agent")]),t._v(" "),s("p",[t._v("Nginx 可以禁止指定的浏览器和爬虫框架访问：")]),t._v(" "),s("div",{staticClass:"language-nginx extra-class"},[s("pre",{pre:!0,attrs:{class:"language-nginx"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 禁止 user_agent 为 baidu、360和sohu，~* 表示不区分大小写匹配")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" ("),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$http_user_agent")]),t._v(" ~* "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'baidu|360|sohu'")]),t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("404")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 禁止 Scrapy 等工具的抓取")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" ("),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$http_user_agent")]),t._v(" ~* (Scrapy|Curl|HttpClient))")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("403")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h3",{attrs:{id:"根据请求类型过滤"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#根据请求类型过滤"}},[t._v("#")]),t._v(" 根据请求类型过滤")]),t._v(" "),s("div",{staticClass:"language-nginx extra-class"},[s("pre",{pre:!0,attrs:{class:"language-nginx"}},[s("code",[s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 非指定请求就返回 403")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" ("),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$request_method")]),t._v(" !~ ^(GET|POST|HEAD)$)")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("return")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("403")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h3",{attrs:{id:"根据状态码过滤"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#根据状态码过滤"}},[t._v("#")]),t._v(" 根据状态码过滤")]),t._v(" "),s("div",{staticClass:"language-nginx extra-class"},[s("pre",{pre:!0,attrs:{class:"language-nginx"}},[s("code",[s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("error_page")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("502")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("503")]),t._v(" /50x.html；\nlocation = /50x.html")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("root")]),t._v(" /usr/share/nginx/html")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("p",[t._v("这样实际上是一个内部跳转，当访问出现 502、503 的时候就能返回 50x.html 中的内容，这里需要注意是否可以找到 50x.html 页面，所以加了个 location 保证找到自定义的 50x 页面。")]),t._v(" "),s("h3",{attrs:{id:"根据-url-名称过滤"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#根据-url-名称过滤"}},[t._v("#")]),t._v(" 根据 URL 名称过滤")]),t._v(" "),s("div",{staticClass:"language-nginx extra-class"},[s("pre",{pre:!0,attrs:{class:"language-nginx"}},[s("code",[s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("if")]),t._v(" ("),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$host")]),t._v(" = "),s("span",{pre:!0,attrs:{class:"token string"}},[t._v("'ab.com'")]),t._v(")")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 其中，$1 是取自 regex 部分 () 里的内容，匹配成功后跳转到的 URL")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("rewrite")]),t._v(" ^/(.*)$ http://www.ab.com/"),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$1")]),t._v(" permanent")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n\n"),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("location")]),t._v(" /test")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# /test 全部重定向到首页")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("rewrite")]),t._v(" ^(.*)$ /index.html redirect")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])]),s("h2",{attrs:{id:"泛域名路径分离"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#泛域名路径分离"}},[t._v("#")]),t._v(" 泛域名路径分离")]),t._v(" "),s("p",[t._v("这是一个非常实用的技能，我们可能需要配置一些二级或者三级域名，希望通过 Nginx 自动指向对应目录，比如：")]),t._v(" "),s("ol",[s("li",[t._v("test1.com 自动指向 /usr/local/html/test1 服务器地址；")]),t._v(" "),s("li",[t._v("test2.com 自动指向 /usr/local/html/test2 服务器地址；")])]),t._v(" "),s("div",{staticClass:"language-nginx extra-class"},[s("pre",{pre:!0,attrs:{class:"language-nginx"}},[s("code",[s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("server")])]),t._v(" "),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("{")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("listren")]),t._v(" "),s("span",{pre:!0,attrs:{class:"token number"}},[t._v("80")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("server_name")]),t._v(" ~^(\\w+)\\.com$")]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\n  "),s("span",{pre:!0,attrs:{class:"token directive"}},[s("span",{pre:!0,attrs:{class:"token keyword"}},[t._v("root")]),t._v(" /usr/local/html/"),s("span",{pre:!0,attrs:{class:"token variable"}},[t._v("$1")])]),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n"),s("span",{pre:!0,attrs:{class:"token punctuation"}},[t._v("}")]),t._v("\n")])])])])}),[],!1,null,null,null);s.default=n.exports}}]);