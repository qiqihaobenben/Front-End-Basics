(window.webpackJsonp=window.webpackJsonp||[]).push([[261],{730:function(t,n,_){"use strict";_.r(n);var e=_(25),i=Object(e.a)({},(function(){var t=this,n=t._self._c;return n("ContentSlotsDistributor",{attrs:{"slot-key":t.$parent.slotKey}},[n("h1",{attrs:{id:"nginx-安装"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#nginx-安装"}},[t._v("#")]),t._v(" Nginx 安装")]),t._v(" "),n("p",[t._v("Nginx 安装方式分为两种：")]),t._v(" "),n("ol",[n("li",[t._v("通过 yum、apt-get 等包管理工具安装")])]),t._v(" "),n("p",[t._v("包管理工具是使用别人编译好的二进制包，同时解决了依赖关系，简单方便，便于升级维护，缺点是对于少见的，古老的 Linux 发行版，很难找到合适的包。")]),t._v(" "),n("ol",{attrs:{start:"2"}},[n("li",[t._v("通过源码编译安装")])]),t._v(" "),n("p",[t._v("使用源代码，根据机器自身的硬件、内核、环境进行编译，生成二进制文件，编译过程可以进行参数设定。优点是不管什么机器，只要有完整的编译环境（基本上所有的 Linux 发行版都有自己的一套完整的编译环境），就可以生成适合自己机器的二进制包，同时因为是针对本机软硬件环境编译的，生成的二进制程序运行起来理论上性能更好，更节省资源。缺点是对新手来说编译过程比较麻烦，同时升级比较麻烦。")]),t._v(" "),n("p",[t._v("总起来看，包管理工具安装后程序运行的性能可能会比编译安装差一点点，或者它自带的 Nginx 模块会比较少，但是没有太大的缺点。编译安装可能将来升级版本会比较麻烦，但是熟悉了 Linux 安装环境，添加模块会比较方便。")]),t._v(" "),n("h2",{attrs:{id:"直接安装-以-centos-的-yum-为例"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#直接安装-以-centos-的-yum-为例"}},[t._v("#")]),t._v(" 直接安装（以 CentOS 的 yum 为例）")]),t._v(" "),n("p",[n("a",{attrs:{href:"https://nginx.org/en/linux_packages.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("linux_packages - Installation on Linux"),n("OutboundLink")],1)]),t._v(" "),n("p",[t._v("yum 安装是将 yum 源中的 rpm 包下载到本地，安装这个 rpm 包，这个 rpm 包就是别人编译好的二进制包。 yum 安装的优点是方便快捷，特别是不用考虑包依赖，缺点是安装过程，人为无法干预，不能按需安装，源里面有什么就安装什么，不能自定义软件部署的路径，后期的维护成本会增加，并且安装的版本一般也比较低。")]),t._v(" "),n("p",[t._v("可以按照 Nginx 官方给出的安装步骤来 "),n("a",{attrs:{href:"https://nginx.org/en/linux_packages.html#RHEL-CentOS",target:"_blank",rel:"noopener noreferrer"}},[t._v("RHEL-CentOS install"),n("OutboundLink")],1)]),t._v(" "),n("p",[t._v("也可以直接执行：")]),t._v(" "),n("div",{staticClass:"language-sh extra-class"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[n("span",{pre:!0,attrs:{class:"token function"}},[t._v("sudo")]),t._v(" yum "),n("span",{pre:!0,attrs:{class:"token function"}},[t._v("install")]),t._v(" nginx\n")])])]),n("p",[t._v("安装完成后，可以使用 "),n("code",[t._v("nginx -v")]),t._v(" 来看具体的 Nginx 版本信息。")]),t._v(" "),n("h3",{attrs:{id:"相关文件夹"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#相关文件夹"}},[t._v("#")]),t._v(" 相关文件夹")]),t._v(" "),n("p",[t._v("通过这种方式安装后，可以使用 "),n("code",[t._v("rpm -ql nginx")]),t._v(" 来查看 Nginx 安装后的相关目录。")]),t._v(" "),n("div",{staticClass:"language-sh extra-class"},[n("pre",{pre:!0,attrs:{class:"language-sh"}},[n("code",[n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 配置文件")]),t._v("\n/etc/logrotate.d/nginx\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# fastcgi 配置相关")]),t._v("\n/etc/nginx/fastcgi.conf\n/etc/nginx/fastcgi.conf.default\n/etc/nginx/fastcgi_params\n/etc/nginx/fastcgi_params.default\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 编码转换映射转化文件")]),t._v("\n/etc/nginx/koi-utf\n/etc/nginx/koi-win\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 设置http 协议的 Content-Type 与扩展名对应关系")]),t._v("\n/etc/nginx/mime.types\n/etc/nginx/mime.types.default\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Nginx 主配置文件")]),t._v("\n/etc/nginx/nginx.conf\n/etc/nginx/nginx.conf.default\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# cgi配置相关")]),t._v("\n/etc/nginx/scgi_params\n/etc/nginx/scgi_params.default\n/etc/nginx/uwsgi_params\n/etc/nginx/uwsgi_params.default\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 编码转换映射转化文件")]),t._v("\n/etc/nginx/win-utf\n\n/usr/bin/nginx-upgrade\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# 用于配制出系统守护进程管理器管理方式")]),t._v("\n/usr/lib/systemd/system/nginx.service\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Nginx 模块目录")]),t._v("\n/usr/lib64/nginx/modules\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Nginx 服务启动管理的终端命令")]),t._v("\n/usr/sbin/nginx\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Nginx的手册和帮助文件")]),t._v("\n/usr/share/doc/nginx-1.16.1\n/usr/share/doc/nginx-1.16.1/CHANGES\n/usr/share/doc/nginx-1.16.1/README\n/usr/share/doc/nginx-1.16.1/README.dynamic\n/usr/share/doc/nginx-1.16.1/UPGRADE-NOTES-1.6-to-1.10\n/usr/share/licenses/nginx-1.16.1\n/usr/share/licenses/nginx-1.16.1/LICENSE\n/usr/share/man/man3/nginx.3pm.gz\n/usr/share/man/man8/nginx-upgrade.8.gz\n/usr/share/man/man8/nginx.8.gz\n/usr/share/nginx/html/404.html\n/usr/share/nginx/html/50x.html\n/usr/share/nginx/html/en-US\n/usr/share/nginx/html/icons\n/usr/share/nginx/html/icons/poweredby.png\n/usr/share/nginx/html/img\n/usr/share/nginx/html/index.html\n/usr/share/nginx/html/nginx-logo.png\n/usr/share/nginx/html/poweredby.png\n/usr/share/vim/vimfiles/ftdetect/nginx.vim\n/usr/share/vim/vimfiles/ftplugin/nginx.vim\n/usr/share/vim/vimfiles/indent/nginx.vim\n/usr/share/vim/vimfiles/syntax/nginx.vim\n/var/lib/nginx\n/var/lib/nginx/tmp\n\n"),n("span",{pre:!0,attrs:{class:"token comment"}},[t._v("# Ngxin 的日志目录")]),t._v("\n/var/log/nginx\n")])])]),n("ul",[n("li",[t._v("上面的目录中位于 "),n("code",[t._v("/etc")]),t._v(" 目录下的主要是配置文件；")]),t._v(" "),n("li",[n("code",[t._v("/etc/nginx/conf.d/")]),t._v(" 文件夹，一般是进行子配置的配置项存放处（即我们自定义的配置），"),n("code",[t._v("/etc/nginx/nginx.conf")]),t._v(" 主配置文件会默认把这个文件夹中所有子配置项都引入；")]),t._v(" "),n("li",[n("code",[t._v("/usr/share/nginx/html/")]),t._v(" 文件夹，通常静态文件都放在这个文件夹（Nginx 运行起来，什么都不配置时访问的就是这里的 html 页面）")])]),t._v(" "),n("h2",{attrs:{id:"源码编译安装"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#源码编译安装"}},[t._v("#")]),t._v(" 源码编译安装")]),t._v(" "),n("p",[t._v("Nginx 的二进制文件会把模块直接编译进去，如果想安装第三方的模块，必须通过编译安装的方式。")]),t._v(" "),n("h3",{attrs:{id:"下载-nginx"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#下载-nginx"}},[t._v("#")]),t._v(" 下载 Nginx")]),t._v(" "),n("p",[t._v("打开 "),n("a",{attrs:{href:"https://nginx.org/en/download.html",target:"_blank",rel:"noopener noreferrer"}},[t._v("Nginx 下载"),n("OutboundLink")],1),t._v(" 页面，可以看到 Nginx 的三个版本：Mainline version（开发版本）、Stable version（稳定版本）、Legacy versions（过期版本）。复制 nginx-1.20.1 的下载链接： https://nginx.org/download/nginx-1.20.1.tar.gz")]),t._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("# cd /usr/local/src\n\n# 下载\nwget https://nginx.org/download/nginx-1.20.1.tar.gz\n\n# 解压\ntar -xzf nginx-1.20.1.tar.gz\n")])])]),n("h3",{attrs:{id:"相关目录"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#相关目录"}},[t._v("#")]),t._v(" 相关目录")]),t._v(" "),n("p",[t._v("在 nginx-1.20.1 文件夹下有如下目录")]),t._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("auto #目录\nCHANGES #文件：Nginx的变更日志\nCHANGES.ru #文件：俄罗斯版本的Nginx的变更日志\nconf #目录：示例文件，为了方便运维配置，可以直接拷贝到安装目录\nconfigure #脚本文件：是一个用来生成中间文件，执行编译前的必备动作\ncontrib #目录：提供了 pl 脚本和vim 的工具，Nginx 语法在 vim 中语法高亮。\nhtml #目录：index.html 欢迎页和50x.html 错误页\nLICENSE\nman # Nginx 的帮助文件\nREADME\nsrc # Nginx 的源代码\n")])])]),n("h4",{attrs:{id:"auto-目录"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#auto-目录"}},[t._v("#")]),t._v(" auto 目录")]),t._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("cc\ndefine\nendianness\nfeature\nhave\nhave_headers\nheaders\ninclude\ninit\ninstall\nlib\nmake\nmodule\nmodules\nnohave\noptions\nos\nsources\nstubs\nsummary\nthreads\ntypes\nunix\n")])])]),n("p",[t._v("有四个子目录：cc 用于编译，lib 是工具库库，os 是对操作系统的判断，types 目录。")]),t._v(" "),n("p",[t._v("其他所有文件都是为了辅助 configure 脚本执行的时候去判定 Nginx 支持哪些模块，当前的系统有什么特性可以供 Nginx 使用。")]),t._v(" "),n("h3",{attrs:{id:"configure"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#configure"}},[t._v("#")]),t._v(" configure")]),t._v(" "),n("h4",{attrs:{id:"常用的编译选项"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#常用的编译选项"}},[t._v("#")]),t._v(" 常用的编译选项")]),t._v(" "),n("p",[t._v("先查看一下 configure 支持的参数： "),n("code",[t._v("./configure --help")]),t._v("。打印出来的信息可以分为几类：")]),t._v(" "),n("ol",[n("li",[t._v("目录相关")])]),t._v(" "),n("ul",[n("li",[n("code",[t._v("--prefix=PATH")]),t._v("：指定 Nginx 的安装目录。默认为 "),n("code",[t._v("/usr/local/nginx")])]),t._v(" "),n("li",[n("code",[t._v("--modules-path=PATH")]),t._v("：指定动态模块的目录")]),t._v(" "),n("li",[n("code",[t._v("--conf-path=PATH")]),t._v("：设置 nginx.conf 配置文件的路径。不过 Nginx 允许使用不同的配置文件启动，通过命令行中的 "),n("code",[t._v("-c")]),t._v(" 选项。默认为 "),n("code",[t._v("${prefix}/conf/nginx.conf")])])]),t._v(" "),n("ol",{attrs:{start:"2"}},[n("li",[t._v("模块相关")])]),t._v(" "),n("p",[t._v("Nginx 大部分常用模块，以 "),n("code",[t._v("--without")]),t._v(" 开头的在编译时都默认安装，"),n("code",[t._v("--with")]),t._v(" 开头的默认不安装。")]),t._v(" "),n("ul",[n("li",[n("code",[t._v("--with-http_ssl_module")]),t._v("：使用 https 协议模块。默认情况下，该模块没有被构建。使用这个模块的前提是 openssl 与 openssl-devel 已安装。")]),t._v(" "),n("li",[n("code",[t._v("--with-http_stub_status_module")]),t._v("：用来监控 Nginx 的当前状态。")]),t._v(" "),n("li",[n("code",[t._v("--with-http_realip_module")]),t._v("：通过这个模块允许我们改变客户端请求头中客户端 IP 地址值（例如 X-Real-IP 或 X-Forwarded-For），意义在于能够使得后端服务器能获取到原始客户端的 IP 地址。")]),t._v(" "),n("li",[n("code",[t._v("--add-module=PATH")]),t._v("：添加第三方外部模块，如 nginx-sticky-module-ng 或缓存模块。每次添加新的模块都要重新编译（Tengine 可以在新加入 module 时无需重新编译）")])]),t._v(" "),n("ol",{attrs:{start:"3"}},[n("li",[t._v("编译相关")])]),t._v(" "),n("ul",[n("li",[n("code",[t._v("--with-pcre")]),t._v("：设置 PCRE 库的源码路径，如果已通过 yum 方式安装，使用 "),n("code",[t._v("--with-pcre")]),t._v(" 自动找到库文件。perl 正则表达式使用在 "),n("code",[t._v("location")]),t._v(" 指令和 "),n("code",[t._v("ngx_http_rewrite_module")]),t._v(" 模块中。")]),t._v(" "),n("li",[n("code",[t._v("--with-pcre=DIR")]),t._v("：需要从 PCRE 网站下载 PCRE 库的源码并解压。")]),t._v(" "),n("li",[n("code",[t._v("--with-zlib=DIR")]),t._v("：执行 zlib 的源码解压目录。在默认就启用的网络传输压缩模块 "),n("code",[t._v("ngx_http_gzip_module")]),t._v("时需要使用 zlib。")])]),t._v(" "),n("ol",{attrs:{start:"4"}},[n("li",[t._v("其他")])]),t._v(" "),n("ul",[n("li",[n("code",[t._v("--user=USER")]),t._v("：设置 Nginx 工作进程的用户。不过安装完成后，可以随时在 nginx.conf 配置文件更改 user 指令。默认的用户名是 nobody。")]),t._v(" "),n("li",[n("code",[t._v("--group=GROUP")]),t._v("：同上类似。")])]),t._v(" "),n("h4",{attrs:{id:"安装前的配置检查"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#安装前的配置检查"}},[t._v("#")]),t._v(" 安装前的配置检查")]),t._v(" "),n("p",[t._v("运行 "),n("code",[t._v("./configure")]),t._v(" 进行安装前的配置检查，看是否有报错。检查中如果发现一些依赖库没有找到，这时候需要先安装 Nginx 的一些依赖库。根据报错缺啥安装啥。一般不超过以下几种：")]),t._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("# 以下依赖按需安装\n\nyum -y install pcre pcre-devel #安装使nginx支持rewrite\nyum -y install gcc gcc-c++\nyum -y install zlib zlib-devel\nyum -y install openssl openssl-devel\n")])])]),n("p",[t._v("解决报错后，进行编译并安装的操作：")]),t._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("  ./configure  --prefix=/usr/local/nginx  --with-http_ssl_module --with-http_v2_module --with-http_realip_module --with-http_addition_module --with-http_sub_module --with-http_dav_module --with-http_flv_module --with-http_mp4_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_auth_request_module --with-http_random_index_module --with-http_secure_link_module --with-http_degradation_module --with-http_slice_module --with-http_stub_status_module --with-mail --with-mail_ssl_module --with-stream --with-stream_ssl_module --with-stream_realip_module --with-stream_ssl_preread_module --with-threads\n")])])]),n("p",[n("strong",[t._v("这里要特别注意一下以后需要用到的功能模块是否存在，不然以后添加新的包会比较麻烦。之前提到的 auto 目录中有一个 options 文件，这个文件里面保存的就是 Nginx 编译过程中的所有选项配置。其中就有默认安装的模块。")])]),t._v(" "),n("h3",{attrs:{id:"中间文件"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#中间文件"}},[t._v("#")]),t._v(" 中间文件")]),t._v(" "),n("p",[t._v("在 nginx-1.20.1 文件夹下，执行 "),n("code",[t._v("./configure ……")]),t._v(" 后会生成中间文件 objs。objs 的目录如下：")]),t._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("autoconf.err\nMakefile\nngx_auto_config.h\nngx_auto_headers.h\nngx_modules.c #决定了编译时有哪些模块会被编译进Nginx\nsrc\n")])])]),n("h3",{attrs:{id:"编译"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#编译"}},[t._v("#")]),t._v(" 编译")]),t._v(" "),n("p",[t._v("在 nginx-1.20.1 文件夹下，执行 "),n("code",[t._v("make")]),t._v(" ，进行编译。")]),t._v(" "),n("p",[t._v("此时中间文件 objs 的目录如下：")]),t._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("autoconf.err\nMakefile\nnginx\nnginx.8\nngx_auto_config.h\nngx_auto_headers.h\nngx_modules.c\nngx_modules.o\nsrc\n")])])]),n("p",[t._v("最终运行的 Nginx 二进制文件就在 objs 中。C 语言编译时生成的所有中间文件，都会放在 src 目录。")]),t._v(" "),n("h3",{attrs:{id:"安装"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#安装"}},[t._v("#")]),t._v(" 安装")]),t._v(" "),n("p",[t._v("在 nginx-1.20.1 文件夹下，执行 "),n("code",[t._v("make install")]),t._v("。")]),t._v(" "),n("p",[t._v("根据上面的 prefix 指定路径 "),n("code",[t._v("/usr/lcoal/nginx")]),t._v(" 去查看安装好的目录：")]),t._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("conf #决定Nginx功能的配置文件目录\nhtml\nlogs\nsbin #Nginx的二进制执行文件\n")])])]),n("p",[t._v("查看 nginx 安装后所在的目录，可以看到已经安装到 "),n("code",[t._v("/usr/local/nginx")]),t._v(" 目录了：")]),t._v(" "),n("div",{staticClass:"language- extra-class"},[n("pre",{pre:!0,attrs:{class:"language-text"}},[n("code",[t._v("whereis nginx #查看nginx的相关目录\n")])])]),n("h2",{attrs:{id:"两种安装方式区别"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#两种安装方式区别"}},[t._v("#")]),t._v(" 两种安装方式区别")]),t._v(" "),n("ol",[n("li",[n("p",[t._v("生产环境，yum 和源码安装的区别根本上不是性能和 rpm 库里面版本过低的问题（性能问题完全可以通过配置来避免加载不需要的模块来解决），大部分生产环境要求服务器的环境配置要一致，几千台服务器，如果 yum 安装，机房和机房之间，国家和国家之间，yum 的库不能保持一致维护成本就会很高（现在是不是可以用 docker 来解决？），如果用源码安装，一个脚本几条命令就能保证环境和版本一致。所以一般建议：大型的软件包、软件服务，采用源码编译，小型的软件环境，库文件，可以使用 yum。")])]),t._v(" "),n("li",[n("p",[t._v("对于初学者，建议采用 yum 安装，只需要 "),n("code",[t._v("yum install <软件名>")]),t._v(" ，系统就自动根据 yum 源配置文件中的镜像位置去下载安装包，并可以自动分析所需要的软件依赖关系，自动安装所需要的依赖软件包，简单方便，不用考虑依赖关系。但是有些软件并不能通过 yum 安装，所以对于进阶用户，还是建议源码安装的方式，下载源码包，然后解压编译安装，过程中可以指定配置参数，更加灵活方便，兼容性更强。并且建议初学者慢慢尝试源码安装，这一点很有必要，这样能知道自己在做什么，安装过程中，肯定会遇到很多很多问题，遇到问题，解决问题，就慢慢的进阶了，如果一直用 yum 安装，偶然碰到了一点问题，就很难解决。")])]),t._v(" "),n("li",[n("p",[t._v("能解决问题的都是好方法，最重要的是我们知道了两种安装方式的优缺点，在具体场景下就能找到合适的解决办法。在实际工作中，两种方式结合起来使用，效果更加。")])])]),t._v(" "),n("h2",{attrs:{id:"nginx-模块"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#nginx-模块"}},[t._v("#")]),t._v(" Nginx 模块")]),t._v(" "),n("p",[n("a",{attrs:{href:"https://nginx.org/en/docs/",target:"_blank",rel:"noopener noreferrer"}},[t._v("官方模块文档链接"),n("OutboundLink")],1)]),t._v(" "),n("p",[t._v("Nginx 的模块使用的前提是编译进了 Nginx，了解一个模块可以从以下三个方面入手：")]),t._v(" "),n("ul",[n("li",[t._v("模块提供哪些配置项")]),t._v(" "),n("li",[t._v("模块何时被使用")]),t._v(" "),n("li",[t._v("模块提供哪些变量")])]),t._v(" "),n("p",[t._v("上面说的三个方面，如果是官方模块可以直接在官方文档中找到相关的信息，如果是第三方模块，在文档不全的情况下也可以通过查看模块源码的方式来找到相关信息，例如上面编译安装步骤中，在 "),n("code",[t._v("/usr/local/src/nginx-1.20.1/")]),t._v(" 的 "),n("code",[t._v("objs")]),t._v(" 目录中的 "),n("code",[t._v("ngx_modules.c")]),t._v("，可以看到编译进 Nginx 的所有模块；然后在 "),n("code",[t._v("/usr/local/src/nginx-1.20.1/")]),t._v(" 的 "),n("code",[t._v("src")]),t._v(" 目录下能找到相应的模块源码，像是 "),n("code",[t._v("ngx_http_gzip_filter_module")]),t._v(" 的源码就在 "),n("code",[t._v("/usr/local/src/nginx-1.20.1/src/http/modules/ngx_http_gzip_filter_module.c")]),t._v("。")]),t._v(" "),n("h3",{attrs:{id:"nginx-模块分类"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#nginx-模块分类"}},[t._v("#")]),t._v(" Nginx 模块分类")]),t._v(" "),n("ul",[n("li",[t._v("核心模块：nginx 最基本最核心的服务，如进程管理、权限控制、日志记录；")]),t._v(" "),n("li",[t._v("标准 HTTP 模块：Nginx 服务器的标准 HTTP 功能；")]),t._v(" "),n("li",[t._v("可选 HTTP 模块：处理特殊的 HTTP 请求；")]),t._v(" "),n("li",[t._v("邮件服务模块：邮件服务；")]),t._v(" "),n("li",[t._v("第三方模块：作为扩展，完成特殊功能")])]),t._v(" "),n("h3",{attrs:{id:"模块清单"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#模块清单"}},[t._v("#")]),t._v(" 模块清单")]),t._v(" "),n("h4",{attrs:{id:"核心模块"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#核心模块"}},[t._v("#")]),t._v(" 核心模块")]),t._v(" "),n("ul",[n("li",[t._v("ngx_core")]),t._v(" "),n("li",[t._v("ngx_errlog")]),t._v(" "),n("li",[t._v("ngx_conf")]),t._v(" "),n("li",[t._v("ngx_events")]),t._v(" "),n("li",[t._v("ngx_http")]),t._v(" "),n("li",[t._v("ngx_mail")]),t._v(" "),n("li",[t._v("ngx_stream")]),t._v(" "),n("li",[t._v("ngx_regex")])]),t._v(" "),n("h4",{attrs:{id:"标准-http-模块"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#标准-http-模块"}},[t._v("#")]),t._v(" 标准 HTTP 模块")]),t._v(" "),n("ul",[n("li",[t._v("ngx_http")]),t._v(" "),n("li",[t._v("ngx_http_core: 配置端口、URI 分析，服务器响应错误处理，别名控制（alias）等")]),t._v(" "),n("li",[t._v("ngx_http_log: 自定义 access 日志")]),t._v(" "),n("li",[t._v("ngx_http_upstream: 定义一组服务器，可以接收来自 proxy、fastcgi、memcache 的重定向，主要用作负载均衡")]),t._v(" "),n("li",[t._v("ngx_http_status")]),t._v(" "),n("li",[t._v("ngx_http_autoindex: 自动生成目录列表")]),t._v(" "),n("li",[t._v("ngx_http_index: 处理以 "),n("code",[t._v("/")]),t._v(" 结尾的请求，如果没有找到 index 页，则看是否开启了 random_index，如果开启了，就用它，否则用 autoindex")]),t._v(" "),n("li",[t._v("ngx_http_auth_basic: 基于 http 的身份认证（auth_basic）")]),t._v(" "),n("li",[t._v("ngx_http_access: 基于 IP 地址的访问控制（deny、allow）")]),t._v(" "),n("li",[t._v("ngx_http_limit_conn: 限制来自客户端的连接的响应和处理速率")]),t._v(" "),n("li",[t._v("ngx_http_geo: 根据客户端 IP 地址创建变量")]),t._v(" "),n("li",[t._v("ngx_http_map: 创建任意的键值对变量")]),t._v(" "),n("li",[t._v("ngx_http_split_clients")]),t._v(" "),n("li",[t._v("ngx_http_referer: 过滤 HTTP 头中 Referer 为空的对象")]),t._v(" "),n("li",[t._v("ngx_http_rewrite: 通过正则表达式重定向请求")]),t._v(" "),n("li",[t._v("ngx_http_proxy")]),t._v(" "),n("li",[t._v("ngx_http_fastcgi: 支持 fastcgi")]),t._v(" "),n("li",[t._v("ngx_http_uwsgi")]),t._v(" "),n("li",[t._v("ngx_http_memcached")]),t._v(" "),n("li",[t._v("ngx_http_empty_gif: 从内存创建一个 1x1 的透明 gif 图片，可以快速调用")]),t._v(" "),n("li",[t._v("ngx_http_browser: 解析 http 请求头部的 User-Agent 值")]),t._v(" "),n("li",[t._v("ngx_http_charset: 指定网页编码")]),t._v(" "),n("li",[t._v("ngx_http_headers_filter: 设置 http 响应头")]),t._v(" "),n("li",[t._v("ngx_http_upstream_ip_hash")]),t._v(" "),n("li",[t._v("ngx_http_upstream_least_conn")]),t._v(" "),n("li",[t._v("ngx_http_upstream_keepalive")]),t._v(" "),n("li",[t._v("ngx_http_write_filter")]),t._v(" "),n("li",[t._v("ngx_http_header_filter")]),t._v(" "),n("li",[t._v("ngx_http_chunked_filter")]),t._v(" "),n("li",[t._v("ngx_http_range_header")]),t._v(" "),n("li",[t._v("ngx_http_gzip_filter")]),t._v(" "),n("li",[t._v("ngx_http_postpone_filter")]),t._v(" "),n("li",[t._v("ngx_http_ssi_filter")]),t._v(" "),n("li",[t._v("ngx_http_charset_filter")]),t._v(" "),n("li",[t._v("ngx_http_userid_filter")]),t._v(" "),n("li",[t._v("ngx_http_copy_filter")]),t._v(" "),n("li",[t._v("ngx_http_range_body_filter")]),t._v(" "),n("li",[t._v("ngx_http_not_modified_filter")])]),t._v(" "),n("h4",{attrs:{id:"可选-http-模块"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#可选-http-模块"}},[t._v("#")]),t._v(" 可选 HTTP 模块")]),t._v(" "),n("ul",[n("li",[t._v("ngx_http_addition: 在请求的响应页面开始或者结尾添加文本信息")]),t._v(" "),n("li",[t._v("ngx_http_degradation: 在低内存的情况下允许服务器放回 444 或者 204 错误")]),t._v(" "),n("li",[t._v("ngx_http_perl")]),t._v(" "),n("li",[t._v("ngx_http_flv: 支持将 Flash 多媒体信息按照流文件传输，可以根据客户端指定的开始位置返回 Flash")]),t._v(" "),n("li",[t._v("ngx_http_geoip: 支持解析基于 GeoIP 数据库的客户端请求")]),t._v(" "),n("li",[t._v("ngx_http_perftools")]),t._v(" "),n("li",[t._v("ngx_http_gzip: 压缩请求的响应")]),t._v(" "),n("li",[t._v("ngx_http_gzip_static: 搜索并使用预压缩的以 "),n("code",[t._v(".gz")]),t._v(" 为后缀的文件代替一般文件响应客户端请求")]),t._v(" "),n("li",[t._v("ngx_http_image_filter: 支持改变 png、jpeg、gif 图片的尺寸和旋转方向")]),t._v(" "),n("li",[t._v("ngx_http_mp4: 支持 .mp4、.m4v、.m4a 等多媒体信息按照流文件传输，常与 ngx_http_flv 一起使用")]),t._v(" "),n("li",[t._v("ngx_http_random_index: 当收到 "),n("code",[t._v("/")]),t._v(" 结尾的请求时，在指定目录下随机选择一个文件作为 index")]),t._v(" "),n("li",[t._v("ngx_http_secure_link: 支持对请求链接的有效性检查")]),t._v(" "),n("li",[t._v("ngx_http_ssl: 支持 https")]),t._v(" "),n("li",[t._v("ngx_http_stub_status")]),t._v(" "),n("li",[t._v("ngx_http_sub_module: 使用指定的字符串替换响应中的信息")]),t._v(" "),n("li",[t._v("ngx_http_dav: 支持 HTTP 和 WebDAV 协议中的 PUT、DELETE、MKCOL、COPY、MOVE 方法")]),t._v(" "),n("li",[t._v("ngx_http_xslt: 将 XML 响应信息使用 XSLT 进行转换")])]),t._v(" "),n("h4",{attrs:{id:"邮件服务"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#邮件服务"}},[t._v("#")]),t._v(" 邮件服务")]),t._v(" "),n("ul",[n("li",[t._v("ngx_mail_core")]),t._v(" "),n("li",[t._v("ngx_mail_pop3")]),t._v(" "),n("li",[t._v("ngx_mail_imap")]),t._v(" "),n("li",[t._v("ngx_mail_smtp")]),t._v(" "),n("li",[t._v("ngx_mail_auth_http")]),t._v(" "),n("li",[t._v("ngx_mail_proxy")]),t._v(" "),n("li",[t._v("ngx_mail_ssl")])]),t._v(" "),n("h4",{attrs:{id:"第三方模块"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#第三方模块"}},[t._v("#")]),t._v(" 第三方模块")]),t._v(" "),n("ul",[n("li",[t._v("echo-nginx-module: 支持在 Nginx 配置文件中使用 "),n("code",[t._v("echo")]),t._v("、"),n("code",[t._v("sleep")]),t._v("、"),n("code",[t._v("time")]),t._v("、"),n("code",[t._v("exec")]),t._v(" 等类 Shell 命令")]),t._v(" "),n("li",[t._v("memc-nginx-module")]),t._v(" "),n("li",[t._v("rds-json-nginx-module: 使 Nginx 支持 json 数据的处理")]),t._v(" "),n("li",[t._v("lua-nginx-module")])]),t._v(" "),n("h2",{attrs:{id:"推荐阅读"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#推荐阅读"}},[t._v("#")]),t._v(" 推荐阅读")]),t._v(" "),n("ul",[n("li",[n("a",{attrs:{href:"https://blog.csdn.net/qq_34556414/article/details/104777892",target:"_blank",rel:"noopener noreferrer"}},[t._v("Nginx 源码安装和 yum 安装对比"),n("OutboundLink")],1)]),t._v(" "),n("li",[n("a",{attrs:{href:"https://segmentfault.com/a/1190000002797601",target:"_blank",rel:"noopener noreferrer"}},[t._v("nginx 服务器安装及配置文件详解"),n("OutboundLink")],1)])])])}),[],!1,null,null,null);n.default=i.exports}}]);