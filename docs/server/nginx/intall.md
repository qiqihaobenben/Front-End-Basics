# Nginx 安装

Nginx 安装方式分为两种：

- 通过 yum、apt-get 等包管理工具安装
  包管理工具是使用别人编译好的二进制包，同时解决了依赖关系，简单方便，便于升级维护，缺点是对于少见的，古老的 Linux 发行版，很难找到合适的包。
- 通过源码编译安装
  使用源代码，根据机器自身的硬件、内核、环境进行编译，生成二进制文件，编译过程可以进行参数设定。优点是不管什么机器，只要有完整的编译环境（基本上所有的 Linux 发行版都有自己的一套完整的编译环境），就可以生成适合自己机器的二进制包，同时因为是针对本机软硬件环境编译的，生成的二进制程序运行起来理论上性能更好，更节省资源。缺点是对新手来说编译过程比较麻烦，同时升级比较麻烦。

  总起来看，包管理工具安装后程序运行的性能可能会比编译安装差一点点，或者它自带的 Nginx 模块会比较少，但是没有太大的缺点。编译安装可能将来升级版本会比较麻烦，但是熟悉了 Linux 安装环境，添加模块会比较方便。

## 直接安装（以 CentOS 的 yum 为例）

[linux_packages - Installation on Linux](https://nginx.org/en/linux_packages.html)

yum 安装是将 yum 源中的 rpm 包下载到本地，安装这个 rpm 包，这个 rpm 包就是别人编译好的二进制包。 yum 安装的优点是方便快捷，特别是不用考虑包依赖，缺点是安装过程，人为无法干预，不能按需安装，源里面有什么就安装什么，不能自定义软件部署的路径，后期的维护成本会增加，并且安装的版本一般也比较低。

可以按照 Nginx 官方给出的安装步骤来 [RHEL-CentOS install](https://nginx.org/en/linux_packages.html#RHEL-CentOS)

也可以直接执行：

```sh
sudo yum install nginx
```

安装完成后，可以使用 `nginx -v` 来看具体的 Nginx 版本信息。

### 相关文件夹

通过这种方式安装后，可以使用 `rpm -ql nginx` 来查看 Nginx 安装后的相关目录。

```sh
# 配置文件
/etc/logrotate.d/nginx

# cgi 配置相关
/etc/nginx/fastcgi.conf
/etc/nginx/fastcgi.conf.default
/etc/nginx/fastcgi_params
/etc/nginx/fastcgi_params.default

# 编码转换映射转化文件
/etc/nginx/koi-utf
/etc/nginx/koi-win

# 设置http 协议的 Content-Type 与扩展名对应关系
/etc/nginx/mime.types
/etc/nginx/mime.types.default

# Nginx 主配置文件
/etc/nginx/nginx.conf
/etc/nginx/nginx.conf.default

# cgi配置相关
/etc/nginx/scgi_params
/etc/nginx/scgi_params.default
/etc/nginx/uwsgi_params
/etc/nginx/uwsgi_params.default

# 编码转换映射转化文件
/etc/nginx/win-utf

/usr/bin/nginx-upgrade
# 用于配制出系统守护进程管理器管理方式
/usr/lib/systemd/system/nginx.service
# Nginx 模块目录
/usr/lib64/nginx/modules
# Nginx 服务启动管理的终端命令
/usr/sbin/nginx

# Nginx的手册和帮助文件
/usr/share/doc/nginx-1.16.1
/usr/share/doc/nginx-1.16.1/CHANGES
/usr/share/doc/nginx-1.16.1/README
/usr/share/doc/nginx-1.16.1/README.dynamic
/usr/share/doc/nginx-1.16.1/UPGRADE-NOTES-1.6-to-1.10
/usr/share/licenses/nginx-1.16.1
/usr/share/licenses/nginx-1.16.1/LICENSE
/usr/share/man/man3/nginx.3pm.gz
/usr/share/man/man8/nginx-upgrade.8.gz
/usr/share/man/man8/nginx.8.gz
/usr/share/nginx/html/404.html
/usr/share/nginx/html/50x.html
/usr/share/nginx/html/en-US
/usr/share/nginx/html/icons
/usr/share/nginx/html/icons/poweredby.png
/usr/share/nginx/html/img
/usr/share/nginx/html/index.html
/usr/share/nginx/html/nginx-logo.png
/usr/share/nginx/html/poweredby.png
/usr/share/vim/vimfiles/ftdetect/nginx.vim
/usr/share/vim/vimfiles/ftplugin/nginx.vim
/usr/share/vim/vimfiles/indent/nginx.vim
/usr/share/vim/vimfiles/syntax/nginx.vim
/var/lib/nginx
/var/lib/nginx/tmp

# Ngxin 的日志目录
/var/log/nginx
```

- 上面的目录中位于 `/etc` 目录下的主要是配置文件；
- `/etc/nginx/conf.d/` 文件夹，一般是进行子配置的配置项存放处（即我们自定义的配置），`/etc/nginx/nginx.conf` 主配置文件会默认把这个文件夹中所有子配置项都引入；
- `/usr/share/nginx/html/` 文件夹，通常静态文件都放在这个文件夹（Nginx 运行起来，什么都不配置时访问的就是这里的 html 页面）

## 源码编译安装

Nginx 的二进制文件会把模块直接编译进去，如果想安装第三方的模块，必须通过编译安装的方式。

### 下载 Nginx

打开 [Nginx 下载](https://nginx.org/en/download.html) 页面，可以看到 Nginx 的三个版本：Mainline version（开发版本）、Stable version（稳定版本）、Legacy versions（过期版本）。复制 nginx-1.20.1 的下载链接： https://nginx.org/download/nginx-1.20.1.tar.gz

```
# cd /usr/local/src

# 下载
wget https://nginx.org/download/nginx-1.20.1.tar.gz

# 解压
tar -xzf nginx-1.20.1.tar.gz
```

### 相关目录

在 nginx-1.20.1 文件夹下有如下目录

```
auto #目录
CHANGES #文件：Nginx的变更日志
CHANGES.ru #文件：俄罗斯版本的Nginx的变更日志
conf #目录：示例文件，为了方便运维配置，可以直接拷贝到安装目录
configure #脚本文件：是一个用来生成中间文件，执行编译前的必备动作
contrib #目录：提供了 pl 脚本和vim 的工具，Nginx 语法在 vim 中语法高亮。
html #目录：index.html 欢迎页和50x.html 错误页
LICENSE
man # Nginx 的帮助文件
README
src # Nginx 的源代码
```

#### auto 目录

```
cc
define
endianness
feature
have
have_headers
headers
include
init
install
lib
make
module
modules
nohave
options
os
sources
stubs
summary
threads
types
unix
```

有四个子目录：cc 用于编译，lib 库，os 对操作系统的判断，types 目录。

其他所有文件都是为了辅助 configure 脚本执行的时候去判定 Nginx 支持哪些模块，当前的系统有什么特性可以供 Nginx 使用。

### configure

#### 常用的编译选项

先查看一下 configure 支持的参数： `./configure --help`。打印出来的信息可以分为几类：

1. 目录相关

- `--prefix=PATH`：指定 Nginx 的安装目录。默认为 `/usr/local/nginx`
- `--modules-path=PATH`：指定动态模块的目录
- `--conf-path=PATH`：设置 nginx.conf 配置文件的路径。不过 Nginx 允许使用不同的配置文件启动，通过命令行中的 `-c` 选项。默认为 `${prefix}/conf/nginx.conf`

2. 模块相关

Nginx 大部分常用模块，以 `--without` 开头的在编译时都默认安装，`--with` 开头的默认不安装。

- `--with-http_ssl_module`：使用 https 协议模块。默认情况下，该模块没有被构建。使用这个模块的前提是 openssl 与 openssl-devel 已安装。
- `--with-http_stub_status_module`：用来监控 Nginx 的当前状态。
- `--with-http_realip_module`：通过这个模块允许我们改变客户端请求头中客户端 IP 地址值（例如 X-Real-IP 或 X-Forwarded-For），意义在于能够使得后台服务器记录原始客户端的 IP 地址。
- `--add-module=PATH`：添加第三方外部模块，如 nginx-sticky-module-ng 或缓存模块。每次添加新的模块都要重新编译（Tengine 可以在新加入 module 时无需重新编译）

3. 编译相关

- `--with-pcre`：设置 PCRE 库的源码路径，如果已通过 yum 方式安装，使用 `--with-pcre` 自动找到库文件。perl 正则表达式使用在 `location` 指令和 `ngx_http_rewrite_module` 模块中。
- `--with-pcre=DIR`：需要从 PCRE 网站下载 PCRE 库的源码并解压。
- `--with-zlib=DIR`：执行 zlib 的源码解压目录。在默认就启用的网络传输压缩模块 `ngx_http_gzip_module`时需要使用 zlib。

4. 其他

- `--user=USER`：设置 Nginx 工作进程的用户。不过安装完成后，可以随时在 nginx.conf 配置文件更改 user 指令。默认的用户名是 nobody。
- `--group=GROUP`：同上类似。

#### 安装前的配置检查

运行 `./configure` 进行安装前的配置检查，发现有报错。检查中发现一些依赖库没有找到，这时候需要先安装 Nginx 的一些依赖库。根据报错缺啥安装啥。一般不超过一下几种：

```
# 以下依赖按需安装

yum -y install pcre pcre-devel #安装使nginx支持rewrite
yum -y install gcc gcc-c++
yum -y install zlib zlib-devel
yum -y install openssl openssl-devel
```

解决报错后，进行编译并安装的操作：

```
  ./configure  --prefix=/usr/local/nginx  --with-http_ssl_module --with-http_v2_module --with-http_realip_module --with-http_addition_module --with-http_sub_module --with-http_dav_module --with-http_flv_module --with-http_mp4_module --with-http_gunzip_module --with-http_gzip_static_module --with-http_auth_request_module --with-http_random_index_module --with-http_secure_link_module --with-http_degradation_module --with-http_slice_module --with-http_stub_status_module --with-mail --with-mail_ssl_module --with-stream --with-stream_ssl_module --with-stream_realip_module --with-stream_ssl_preread_module --with-threads
```

**这里要特别注意一下以后需要用到的功能模块是否存在，不然以后添加新的包会比较麻烦。之前提到的 auto 目录中有一个 options 文件，这个文件里面保存的就是 Nginx 编译过程中的所有选项配置。其中就有默认安装的模块。**

### 中间文件

在 nginx-1.20.1 文件夹下，执行 `./configure` 后会生成中间文件 objs。objs 的目录如下：

```
autoconf.err
Makefile
ngx_auto_config.h
ngx_auto_headers.h
ngx_modules.c #决定了编译时有哪些模块会被编译进Nginx
src
```

### 编译

在 nginx-1.20.1 文件夹下，执行 `make` ，进行编译。

此时中间文件 objs 的目录如下：

```
autoconf.err
Makefile
nginx
nginx.8
ngx_auto_config.h
ngx_auto_headers.h
ngx_modules.c
ngx_modules.o
src
```

最终运行的 Nginx 二进制文件就在 objs 中。C 语言编译时生成的所有中间文件，都会放在 src 目录。

### 安装

在 nginx-1.20.1 文件夹下，执行 `make install`。

根据上面的 prefix 指定路径 `/usr/lcoal/nginx` 去查看安装好的目录：

```
conf #决定Nginx功能的配置文件目录
html
logs
sbin #Nginx的二进制执行文件
```

查看 nginx 安装后所在的目录，可以看到已经安装到 `/usr/local/nginx` 目录了：

```
whereis nginx #查看nginx的相关目录
```

## 两种安装方式区别

1. 生产环境，yum 和源码安装的区别根本不是性能和 rpm 库里面版本过低的问题（性能问题完全可以通过配置来避免加载不需要的模块来解决），大部分生产环境要求服务器的环境配置要一致，几千台服务器，如果 yum 安装，机房和机房之间，国家和国家之间，yum 的库不能保持一致维护成本就会很高（现在是不是可以用 docker 来解决），如果用源码安装，一个脚本几条命令就能保证环境和版本一致。所以一般建议：大型的软件包、软件服务，采用源码编译，小型的软件环境，库文件，可以使用 yum。

2. 对于初学者，建议采用 yum 安装，只需要 `yum install <软件名>` ，系统就自动根据 yum 源配置文件中的镜像位置去下载安装包，并可以自动分析所需要的软件依赖关系，自动安装所需要的依赖软件包，简单方便，不用考虑依赖关系。但是有些软件并不能通过 yum 安装，所以对于进阶用户，还是建议源码安装的方式，下载源码包，然后解压编译安装，过程中可以指定配置参数，更加灵活方便，兼容性更强。并且建议初学者慢慢尝试源码安装，这一点很有必要，这样能知道自己在做什么，安装过程中，肯定会遇到很多很多问题，遇到问题，解决问题，就慢慢的进阶了，如果一直用 yum 安装，偶然碰到了一点问题，就很难解决。

3. 能解决问题的都是好方法，最重要的是我们知道了两种安装方式的优缺点，在具体场景下就能找到合适的解决办法。在实际工作中，两种方式结合起来使用，效果更加。

## Nginx 模块

[官方模块文档链接](https://nginx.org/en/docs/)

Nginx 的模块使用的前提是编译进了 Nginx，了解一个模块可以从以下三个方面入手：

- 模块提供哪些配置项
- 模块合适被使用
- 模块提供哪些变量

上面说的三个方面，如果是官方模块可以直接在官方文档中找到相关的信息，如果是第三方模块，在文档不全的情况下也可以通过查看模块源码的方式来找到相关信息，例如上面编译安装步骤中，在 `/usr/local/src/nginx-1.20.1/` 的 `objs` 目录中的 `ngx_modules.c`，可以看到编译进 Nginx 的所有模块；然后在 `/usr/local/src/nginx-1.20.1/` 的 `src` 目录下能找到相应的模块源码，像是 `ngx_http_gzip_filter_module` 的源码就在 `/usr/local/src/nginx-1.20.1/src/http/modules/ngx_http_gzip_filter_module.c`。

### Nginx 模块分类

- 核心模块：nginx 最基本最核心的服务，如进程管理、权限控制、日志记录；
- 标准 HTTP 模块：Nginx 服务器的标准 HTTP 功能；
- 可选 HTTP 模块：处理特殊的 HTTP 请求；
- 邮件服务模块：邮件服务；
- 第三方模块：作为扩展，完成特殊功能

### 模块清单

#### 核心模块

- ngx_core
- ngx_errlog
- ngx_conf
- ngx_events
- ngx_http
- ngx_mail
- ngx_stream
- ngx_regex

#### 标准 HTTP 模块

- ngx_http
- ngx_http_core: 配置端口、URI 分析，服务器响应错误处理，别名控制（alias）等
- ngx_http_log: 自定义 access 日志
- ngx_http_upstream: 定义一组服务器，可以接收来自 proxy、fastcgi、memcache 的重定向，主要用作负载均衡
- ngx_http_status
- ngx_http_autoindex: 自动生成目录列表
- ngx_http_index: 处理以 `/` 结尾的请求，如果没有找到 index 页，则看是否开启了 random_index，如果开启了，就用它，否则用 autoindex
- ngx_http_auth_basic: 基于 http 的身份认证（auth_basic）
- ngx_http_access: 基于 IP 地址的访问控制（deny、allow）
- ngx_http_limit_conn: 限制来自客户端的连接的响应和处理速率
- ngx_http_geo: 根据客户端 IP 地址创建变量
- ngx_http_map: 创建任意的键值对变量
- ngx_http_split_clients
- ngx_http_referer: 过滤 HTTP 头中 Referer 为空的对象
- ngx_http_rewrite: 通过正则表达式重定向请求
- ngx_http_proxy
- ngx_http_fastcgi: 支持 fastcgi
- ngx_http_uwsgi
- ngx_http_memcached
- ngx_http_empty_gif: 从内存创建一个 1x1 的透明 gif 图片，可以快速调用
- ngx_http_browser: 解析 http 请求头部的 User-Agent 值
- ngx_http_charset: 指定网页编码
- ngx_http_headers_filter: 设置 http 响应头
- ngx_http_upstream_ip_hash
- ngx_http_upstream_least_conn
- ngx_http_upstream_keepalive
- ngx_http_write_filter
- ngx_http_header_filter
- ngx_http_chunked_filter
- ngx_http_range_header
- ngx_http_gzip_filter
- ngx_http_postpone_filter
- ngx_http_ssi_filter
- ngx_http_charset_filter
- ngx_http_userid_filter
- ngx_http_copy_filter
- ngx_http_range_body_filter
- ngx_http_not_modified_filter

#### 可选 HTTP 模块

- ngx_http_addition: 在请求的响应页面开始或者结尾添加文本信息
- ngx_http_degradation: 在低内存的情况下允许服务器放回 444 或者 204 错误
- ngx_http_perl
- ngx_http_flv: 支持将 Flash 多媒体信息按照流文件传输，可以根据客户端指定的开始位置返回 Flash
- ngx_http_geoip: 支持解析基于 GeoIP 数据库的客户端请求
- ngx_http_perftools
- ngx_http_gzip: 压缩请求的响应
- ngx_http_gzip_static: 搜索并使用预压缩的以 `.gz` 为后缀的文件代替一般文件响应客户端请求
- ngx_http_image_filter: 支持改变 png、jpeg、gif 图片的尺寸和旋转方向
- ngx_http_mp4: 支持 .mp4、.m4v、.m4a 等多媒体信息按照流文件传输，常与 ngx_http_flv 一起使用
- ngx_http_random_index: 当收到 `/` 结尾的请求时，在指定目录下随机选择一个文件作为 index
- ngx_http_secure_link: 支持对请求链接的有效性检查
- ngx_http_ssl: 支持 https
- ngx_http_stub_status
- ngx_http_sub_module: 使用指定的字符串替换响应中的信息
- ngx_http_dav: 支持 HTTP 和 WebDAV 协议中的 PUT、DELETE、MKCOL、COPY、MOVE 方法
- ngx_http_xslt: 将 XML 响应信息使用 XSLT 进行转换

#### 邮件服务

- ngx_mail_core
- ngx_mail_pop3
- ngx_mail_imap
- ngx_mail_smtp
- ngx_mail_auth_http
- ngx_mail_proxy
- ngx_mail_ssl

#### 第三方模块

- echo-nginx-module: 支持在 Nginx 配置文件中使用 `echo`、`sleep`、`time`、`exec` 等类 Shell 命令
- memc-nginx-module
- rds-json-nginx-module: 使 Nginx 支持 json 数据的处理
- lua-nginx-module

## 推荐阅读

- [Nginx 源码安装和 yum 安装对比](https://blog.csdn.net/qq_34556414/article/details/104777892)
- [nginx 服务器安装及配置文件详解](https://segmentfault.com/a/1190000002797601)
