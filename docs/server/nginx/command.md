# Nginx 操作命令

## 启动 Nginx 准备工作

安装 Nginx 之后，如果系统开启了防火墙，需要在防火墙中加入需要开放的端口。

```
#可以先查看防火墙的开启状态，如果显示 running 则是正在运行
systemctl status firewalld

#关闭防火墙，不用配置端口，但是不安全
systemctl  stop firewalld

#开启防火墙
systemctl start firewalld

#添加开启端口，--permanent表示永久打开，不加是临时打开重启之后失效
firewall-cmd --permanent --zone=public --add-port=8080/tcp
#重启防火墙，永久打开端口需要reload一下
firewall-cmd --reload
#查看防火墙，添加的端口也可以看到
firewall-cmd --list-all
```

## 启动 Nginx

### 配置 Nginx 全局可用

使用 yum 安装的 Nginx，可以直接使用 nginx 命令。但是编译安装的 Nginx 必须到安装后的目录下执行，例如当前我们安装的路径 `/usr/local/nginx/sbin` ，在这个目录下运行 `./nginx` 加上需要的参数和指令才可以，否则会报错：`-bash: nginx: command not found`。

通过编译安装的 Nginx，可以通过配置环境变量的方式，达到用 nginx 执行命令的目的。步骤如下：

```sh
#编辑 /etc/profile
vi /etc/profile

#在最后一行添加配置，:wq 保存
export PATH=$PATH:/usr/local/nginx/sbin

#使配置立即生效
source /etc/profile
```

### 端口 80 占用

报错信息：`nginx: [emerg] bind() to 0.0.0.0:80 failed (98: Address already in use)`

#### 场景一：有 Nginx 在运行

1. 查找 Nginx 的主进程的进程 ID，然后使用 kill 关闭

第一种方法，使用 ps，可以看到 Nginx 主进程 ID 是 1124

```sh
#查看所有正在运行的 Nginx 进程
ps -ax | grep nginx | grep -v grep
#结果为：
#1124 ?        Ss     0:00 nginx: master process /usr/sbin/nginx
#1126 ?        S      0:00 nginx: worker process
```

第二种方法，因为 nginx 的主进程 ID 是写死在 nginx.pid 文件中的，该文件通常放在 `/usr/local/nginx/logs`或者 `/var/run` 目录下。

```sh
cat /var/run/nginx.pid
#结果为：1124
```

使用 kill 命令，后面跟要发送的信号和要关闭的 Nginx 进程 ID，信号会被发送给 Nginx 进程。通过上面的操作，我们看到了 Nginx 进程 ID 为 1124，发送 `QUIT` 信号使 Nginx 优雅退出：

```sh
kill -s QUIT 1124
```

2. 使用 nginx 命令关闭

```sh
#等待当前子进程处理完正在执行的请求后，结束 Nginx 进程
nginx -s quit
```

#### 场景二：服务占用（包括场景一）

不用管占用的服务是不是 Nginx，通过命令查看本机网络地址和端口等一些信息，找到被占用的 80 端口的 tcp 连接，直接 kill 掉进程。

```sh
netstat -ntpl

kill 进程PID
```

### 配置 Nginx 开机自启

#### 利用 systemctl 命令

如果是用 yum install 命令安装的 Nginx，yum 命令会自动创建 nginx.service 文件，直接用以下命令就可以设置开机自启

```sh
systemctl enable nginx #设置开机启动 Nginx
systemctl disable nginx #关闭开机启动 Nginx
```

如果是源码编译安装的 Nginx，需要在系统服务目录里创建 nginx.service 文件。

```sh
#创建并打开 nginx.service 文件
vim /lib/systemd/system/nginx.service

#内容如下
[Unit]
Description=nginx
After=network.target

[Service]
Type=forking
ExecStart=/usr/local/nginx/sbin/nginx
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s quit
PrivateTmp=true

[Install]
WantedBy=multi-user.target

# :wq 保存
systemctl daemon-reload #使文件生效
```

这样就可以通过以下命令操作 nginx 了：

```sh
systemctl start nginx # 启动nginx服务
systemctl restart nginx # 重新启动服务
systemctl reload nginx # 重新加载 Nginx，用于修改配置后
systemctl enable nginx # 设置开机启动
systemctl is-enabled nginx #查询服务是否开机启动
systemctl disable nginx # 停止开机自启动
systemctl status nginx # 查看服务当前状态
```

还有一种通过开机启动命令脚本实现开机自启，[点击查看](https://mp.weixin.qq.com/s/LmtHTOVOvdcnMBuxv7a9_A)

## Nginx 常用命令

如果 Nginx 已经开启，就可以通过使用 `-s` 参数的可执行命令控制。

```sh
nginx -s stop #快速关闭
nginx -s quit #优雅关闭，等待工作进程处理完成后关闭
nginx -s reload #向主进程发送信号，重新加载配置文件，热重启
nginx -s reopen #重启 Nginx，重新开始记录日志文件，配合定时任务，用于日志切割

nginx -T #查看当前 Nginx 最终的配置
nginx -t -c <配置路径> #检查配置是否有问题，如果已经在配置目录，则不需要 -c，此命令也可以间接查看nginx的配置文件路径

nginx -v #查看 Nginx 的版本信息
nginx -V #查看 Nginx 的编译信息
```

另外 `nginx -h` 或者 `nginx -?`，可以列出所有的命令。

## 使用 kill 关闭 Nginx

Nginx 信号控制：

- TERM,INT：快速关闭
- QUIT：优雅关闭
- HUP：平滑重启，重新加载配置文件
- USR1：重新打开日志文件，在切割日志时用途较大，跟 nginx -s reopen 类似
- USR2：平滑升级可执行程序
- WINCH：从容关闭工作进程

```sh
#首先找到 Nginx 的 master 对应的进程ID
ps -ax | grep nginx | grep -v grep
#结果为：
#1124 ?        Ss     0:00 nginx: master process /usr/sbin/nginx
#1126 ?        S      0:00 nginx: worker process

kill -TERM 1124 #快速停止
kill -QUIT 1124 #优雅停止

#强制停止所有nginx进程
pkill -9 nginx
```

## 热部署 Nginx，进行版本升级

把之前的 `/usr/local/nginx/sbin/nginx` 二进制文件备份，然后把新编译好的 `objs/nginx` 二进制文件替换原来的。

然后执行：`kill -USR2 1124`，会平滑的将请求过渡到新的 Nginx 进程，会看到新开启了一个 Nginx master 进程，不过旧的 Nginx master 也在运行，不过已经已经不再监听 80 和 443 端口。

然后执行：`kill -WINCH 1124`，优雅的关闭所有旧的 Nginx worker 进程。

最后，虽然所有旧的 Nginx worker 进程都关闭了，但是旧的 Nginx master 进程还存在，这是为了便于回退。
