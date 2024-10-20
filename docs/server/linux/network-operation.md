# Linux 网络操作命令

Linux 系统查看自己的公网 ip

```
curl ipinfo.io/json
```

Linux 系统查看自己的内网 ip

```
ifconfig
```

### netstat

`netstat -tunlp` 用于显示 tcp，udp 的端口和进程等相关情况。

- -t (tcp) 仅显示 tcp 相关选项
- -u (udp)仅显示 udp 相关选项
- -n 拒绝显示别名，能显示数字的全部转化为数字
- -l 仅列出在 Listen(监听)的服务状态
- -p 显示建立相关链接的程序名

#### 示例

```
netstat -tunlp | grep 端口号

# netstat -tunlp | grep 8000
tcp        0      0 0.0.0.0:8000            0.0.0.0:*               LISTEN      26993/nodejs
```

[Linux netstat 命令详解](https://www.cnblogs.com/ggjucheng/archive/2012/01/08/2316661.html)

### nc

[nc 命令详解](https://wangchujiang.com/linux-command/c/nc.html)
