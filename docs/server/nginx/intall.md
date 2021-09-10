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

### 下载 Nginx

打开 [Nginx 下载](https://nginx.org/en/download.html) 页面，可以看到 Nginx 的三个版本：Mainline version（开发版本）、Stable version（稳定版本）、Legacy versions（过期版本）。复制 nginx-1.20.1 的下载链接： https://nginx.org/download/nginx-1.20.1.tar.gz

```
# 下载
wget https://nginx.org/download/nginx-1.20.1.tar.gz

# 解压
tar -xzf nginx-1.20.1.tar.gz
```

### 相关目录

### Configure

### 中间文件

### 编译

### 安装

## 最后说说两种安装方式

1. 生产环境，yum 和源码安装的区别根本不是性能和 rpm 库里面版本过低的问题（性能问题完全可以通过配置来避免加载不需要的模块来解决），大部分生产环境要求服务器的环境配置要一致，几千台服务器，如果 yum 安装，机房和机房之间，国家和国家之间，yum 的库不能保持一致维护成本就会很高（现在是不是可以用 docker 来解决），如果用源码安装，一个脚本几条命令就能保证环境和版本一致。所以一般建议：大型的软件包、软件服务，采用源码编译，小型的软件环境，库文件，可以使用 yum。

2. 对于初学者，建议采用 yum 安装，只需要 `yum install <软件名>` ，系统就自动根据 yum 源配置文件中的镜像位置去下载安装包，并可以自动分析所需要的软件依赖关系，自动安装所需要的依赖软件包，简单方便，不用考虑依赖关系。但是有些软件并不能通过 yum 安装，所以对于进阶用户，还是建议源码安装的方式，下载源码包，然后解压编译安装，过程中可以指定配置参数，更加灵活方便，兼容性更强。并且建议初学者慢慢尝试源码安装，这一点很有必要，这样能知道自己在做什么，安装过程中，肯定会遇到很多很多问题，遇到问题，解决问题，就慢慢的进阶了，如果一直用 yum 安装，偶然碰到了一点问题，就很难解决。

3. 能解决问题的都是好方法，最重要的是我们知道了两种安装方式的优缺点，在具体场景下就能找到合适的解决办法。在实际工作中，两种方式结合起来使用，效果更加。

## 推荐阅读

- [Nginx 源码安装和 yum 安装对比](https://blog.csdn.net/qq_34556414/article/details/104777892)
