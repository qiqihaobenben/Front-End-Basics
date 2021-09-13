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

使用 yum 安装的 Nginx，可以直接使用 nginx 命令。但是编译安装的 Nginx 必须到安装后的目录下执行，例如当前我们安装的路径 `/usr/local/nginx/sbin` ，在这个目录下运行 `./nginx` 加上需要的参数和指令才可以，否则会报错：`-bash: nginx: command not found`。

通过编译安装的 Nginx，可以通过配置环境变量的方式，达到用 nginx 执行命令的目的。步骤如下：
