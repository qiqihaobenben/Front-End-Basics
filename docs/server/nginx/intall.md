# Nginx 安装

Nginx 安装方式分为两种：

- 通过 yum、apt-get 等包管理工具安装
  包管理工具是使用别人编译好的二进制包，同时解决了依赖关系，简单方便，便于升级维护，缺点是对于少见的，古老的 Linux 发行版，很难找到合适的包。
- 通过源码编译安装
  使用源代码，根据机器自身的硬件、内核、环境进行编译，生成二进制文件，编译过程可以进行参数设定。优点是不管什么机器，只要有完整的编译环境（基本上所有的 Linux 发行版都有自己的一套完整的编译环境），就可以生成适合自己机器的二进制包，同时因为是针对本机软硬件环境编译的，生成的二进制程序运行起来理论上性能更好，更节省资源。缺点是对新手来说编译过程比较麻烦，同时升级比较麻烦。

  总起来看，包管理工具安装后程序运行的性能可能会比编译安装差一点点，或者它自带的 Nginx 模块会比较少，但是没有太大的缺点。编译安装可能将来升级版本会比较麻烦，但是熟悉了 Linux 安装环境，添加模块会比较方便。

## 直接安装（以 CentOS 的 yum 为例）

[linux_packages - Installation on Linux](https://nginx.org/en/linux_packages.html)

yum 安装是将 yum 源中的 rpm 包下载到本地，安装这个 rpm 包，这个 rpm 包就是别人编译好的二进制包。

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
