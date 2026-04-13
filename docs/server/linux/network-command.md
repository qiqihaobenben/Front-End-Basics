# 网络命令行工具

以下是“从链路到应用” **常用的网络测试命令** 。

注意：以下的分层是按照

## 1. 基础连通性（ICMP / 路由）

> ICMP 是 Internet Control Message Protocol 的缩写，意为互联网控制消息协议。它是一种**网络层**协议，用于在计算机之间传递控制消息。

#### **ping** — 测试目标是否可达、往返时延（Round-Trip Time, RTT）、丢包率

- Linux/macOS: `ping -c 5 8.8.8.8`（发送 5 个包）
- Windows: `ping -n 5 8.8.8.8`

  **看什么**：响应时间、丢包。若 IP 可达但域名不可达，说明可能是 DNS 问题。

  注意：很多主机/防火墙会丢弃 ICMP，所以 ping 不通不一定等同主机不可达。

#### **traceroute / tracert / mtr（My Traceroute）** — 路径追踪，查看到目标经过哪些跳（路由器），诊断哪一跳延迟或丢包（不常用）

- Linux/macOS: `traceroute example.com` 或更常用的 `mtr -rw example.com`（实时显示）
- Windows: `tracert example.com`

  **看什么**：哪一跳延迟骤升或丢包；若在某跳就停了，可能该跳丢弃 ICMP/TTL（Time To Live，生存时间）过期响应，但后续仍可达（需结合 ping/应用层测试）。

## 2. 端口与传输层（TCP/UDP）测试

#### **telnet**（测试 TCP 端口是否可建立连接）

- 示例：`telnet smtp.example.com 25` 或 `telnet 192.0.2.1 80`

  **看什么**：能否建立 TCP 三次握手；如果连不上可能是端口没有放通，也可能是该端口的服务没启动（就需要下面的端口检测工具了），若能连上但应用无响应，可能应用层问题。
  Windows 常自带 telnet（需启用），Linux 也常见。

#### **nc** — 万能端口读写工具（可用作客户端或服务器）

nc 是一个功能强大的网络工具，可以用于测试、调试和传输数据。它支持 TCP、UDP 和 UNIX 域套接字，可以用于端口扫描、数据传输、文件传输等。

- -l 监听模式，用于创建一个服务器
- -p 指定端口号
- -u 使用 UDP 协议
- -t 使用 TCP 协议
- -s 指定源 IP 地址
- -b 指定绑定的 IP 地址
- -n 不进行 DNS 解析
- -v 显示详细信息

##### 示例

```
# 连接到服务器：-v 显示详细信息
nc -v hostname 12345

# 建服务器（临时接收）：
nc -l 8080（某些发行版是 -l -p 8080）

# 连接到服务器：
nc hostname 8080
nc 127.0.0.1 8080
```

- [nc 命令详解](https://wangchujiang.com/linux-command/c/nc.html)

- [nc 命令使用小结](https://wsgzao.github.io/post/nc/)

#### **nmap** — 端口扫描、服务/版本探测、防火墙检测

- 扫描常用端口：`nmap -Pn -p 22,80,443 host`
- 全端口扫描并尝试检测服务：`nmap -sV -p- host`

  **看什么**：哪些端口开放、服务类型及版本、是否存在防火墙阻断（filtered）。

  注意：扫描别人的网络前请获授权。

#### **ss / netstat** — 查看本机的监听端口和连接

- Linux: `ss -tuln`（列出 listening TCP/UDP，本地端口号）或 `ss -s`（统计）
- 旧命令 `netstat -tulpen`（某些系统已淘汰），见下文

  **看什么**：本机哪些服务在监听、哪些远端已建立连接。

##### ss （Socket Statistics）

ss(Socket Statistics) 是 Linux 网络诊断的现代工具，用于替代传统的 netstat 命令。

```
查看所有连接
ss                  # 显示所有连接（简略）
ss -a               # 显示所有 socket
ss -a -n            # 不解析服务名（显示端口号）
ss -a -n -p         # 显示进程信息

按协议筛选
ss -t              # TCP
ss -u              # UDP
ss -w              # RAW
ss -x              # UNIX

按状态筛选
ss -t state LISTEN          # 监听中的TCP
ss -t state ESTABLISHED     # 已建立的连接
ss -t state TIME-WAIT       # TIME-WAIT状态
ss -t state all             # 所有状态

常用组合命令
# 监听中的TCP端口（类似 netstat -tlnp）
ss -tlnp

# 已建立的TCP连接
ss -tnp state established

# 查看指定端口的连接
ss -tna sport = :80
ss -tna dport = :443

# 按本地端口筛选
ss -tn src :22
ss -tn dst :3306
```

##### netstat

Linux 中 `netstat -tunlp` 用于显示 tcp，udp 的端口和进程等相关情况。

- -t (tcp) 仅显示 tcp 相关选项
- -u (udp)仅显示 udp 相关选项
- -n 拒绝显示别名，能显示数字的全部转化为数字
- -l 仅列出在 Listen(监听)的服务状态
- -p 显示建立相关链接的程序名

Linux 中用

macOS 中 `netstat -anv` 用于显示 tcp，udp 的端口和进程等相关情况。

- -a 显示所有连接和监听端口
- -n 拒绝显示别名，能显示数字的全部转化为数字
- -v 显示详细信息

##### 示例

Linux 示例

```
netstat -tunlp | grep 端口号

# netstat -tunlp | grep 8000
tcp        0      0 0.0.0.0:8000            0.0.0.0:*               LISTEN      26993/nodejs
```

macOS 示例

```
netstat -anv

Proto Recv-Q Send-Q  Local Address          Foreign Address        (state)
tcp4       0      0  127.0.0.1.8081         *.*                    LISTEN
          ^              ^
          |              |
      Receive/Send     本地地址:端口
      Queue大小

端口所在的列
Local Address（本地地址）：格式为 IP地址.端口号
Foreign Address（远程地址）：格式为 IP地址.端口号

端口号提取方法
# 查看所有监听端口
netstat -an | grep LISTEN

# 查看指定端口（如8081）
netstat -an | grep 8081

# 查看所有TCP监听（更详细）
netstat -anv | grep -i listen

# 查看8081端口是否被监听
netstat -an | grep -E '\.8081.*LISTEN'

# 查看所有监听端口及其进程（需要root）
sudo netstat -anvp tcp | grep LISTEN

# 提取端口号的单行命令
netstat -an | grep LISTEN | awk '{split($4, a, "."); print a[length(a)]}' | sort -n
```

[Linux netstat 命令详解](https://www.cnblogs.com/ggjucheng/archive/2012/01/08/2316661.html)

##### macOS 推荐 lsof（ List Open Files） 可检测端口是否被占用

- 列出打开的文件

- 在 Unix/Linux 中，"一切皆文件"，包括网络连接

```

lsof -i -P -n                     # 查看所有网络连接
lsof -iTCP -sTCP:LISTEN -P -n     # 类似 netstat -tlnp

-iTCP
只显示TCP协议相关的连接
等价于 -i tcp
如果要查看UDP：-iUDP 或 -i udp
查看所有：-i（TCP+UDP）

-sTCP:LISTEN
关键参数！ 只显示处于LISTEN状态的TCP连接
-sTCP: 指定TCP状态过滤器
LISTEN 表示监听状态（服务端等待连接）
其他状态：ESTABLISHED、CLOSE_WAIT、TIME_WAIT等

-n - No hostname resolution
不进行主机名解析
显示IP地址而不是域名
示例：127.0.0.1 而不是 localhost
优点：更快，避免DNS查询延迟

-P - No port name resolution
不进行端口名解析
显示端口号而不是服务名
示例：8081 而不是 http-alt
优点：避免查看/etc/services的延迟，显示实际端口号



lsof -i :8080
# 相当于：lsof -iTCP:8080 -iUDP:8080
# -iTCP:8080：查看TCP协议的8080端口 -iUDP:8080：查看UDP协议的8080端口
# 输出
COMMAND   PID USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
nodejs    1124 root  11u  IPv4 0x1234567890abcdef      0t0  TCP *:8080 (LISTEN)
# 如果 PID 是 1124，则说明 8080 端口被 nodejs 进程占用

lsof -ti :8080
# -t 只输出 PID
1124


# 杀死占用 8080 端口的进程
kill -9 $(lsof -t -i :8080)
```

## 3) 带宽与吞吐量

**iperf / iperf3** — 测试可用带宽（客户端/服务端）

- 先在一端启动服务：`iperf3 -s`，客户端连接：`iperf3 -c server_ip`
- 支持 TCP/UDP、并发流、双向测量。
  **看什么**：实际吞吐、丢包（UDP）、抖动；适合链路性能评估。

## 4) 抓包与协议分析（最强工具）

**tcpdump** — 命令行抓包

- 抓指定接口、端口：`sudo tcpdump -i eth0 port 443 -w capture.pcap`
- 只看文本输出：`sudo tcpdump -i eth0 host 10.0.0.5 and tcp`
  **看什么**：三次握手、重传、RST、TCP 窗口、实际流量内容（未加密），适合定位传输层问题。抓包文件可用 Wireshark 分析。
  注意权限与抓包大小（`-c` 限制包数），敏感数据和保密合规。

**tshark** — tcpdump 的文本/脚本化版（Wireshark CLI）。

## 5) 应用层测试（HTTP / HTTPS / SMTP 等）

**curl / wget** — HTTP(S) 请求与响应头/内容检查

- 检查重定向与响应头：`curl -I https://example.com`
- 详细调试（显示 TLS、请求/响应）：`curl -v https://example.com`
  **看什么**：HTTP 状态码（200/301/403/500）、重定向、响应头、服务器指纹。
  可用于 API 请求、模拟浏览器行为并检查返回体。

**openssl s_client** — 检查 TLS 握手证书细节、支持的协议/密码套件

- 例：`openssl s_client -connect example.com:443 -servername example.com`
- 可配合 `-showcerts` 查看证书链。
  **看什么**：证书是否有效（到期、链不完整）、TLS 版本、是否存在 SNI 问题、是否支持某些加密套件。

**SMTP/POP/IMAP 测试**（用 telnet / openssl）

- SMTP 明文：`telnet mail.example.com 25`，然后发 `EHLO` 等命令。
- STARTTLS：`openssl s_client -starttls smtp -connect mail.example.com:25`
  **看什么**：能否连接邮件服务器、是否支持 STARTTLS、SMTP 响应码。

## 6) DNS 诊断（非常常用）

**dig**（首选） — 细粒度 DNS 查询与追踪

- 查询 A 记录：`dig example.com A`
- 指定 DNS 服务器：`dig @8.8.8.8 example.com`
- 追踪整个解析链：`dig +trace example.com`
- 查询特定类型：`dig example.com MX` 或 `dig example.com TXT`
  **看什么**：DNS 解析结果、TTL、权威服务器、是否有缓存/解析差异。

**nslookup** — 交互式 DNS 查询（Windows 通常可用）

- `nslookup` 进入交互，`server 8.8.8.8`，`set type=MX`，`example.com`。

**host** — 简洁查询：`host -t mx example.com`。

排查思路小建议：

- DNS 解析慢/不一致：先 `dig +trace`、再 `dig @localDNS`、`dig @8.8.8.8` 对比。
- 域名解析正确但 HTTP 连接失败：`ping/traceroute` -> `telnet/nc` -> `curl -v` -> `tcpdump`。

## 7) ARP / 局域网诊断

**arp / ip neigh** — 查看 ARP 缓存（IP 到 MAC 映射）

- Linux: `ip neigh` 或 `arp -n`
  **看什么**：是否存在重复 MAC、ARP 表未填、网段内主机是否正确响应。

**ethtool** — 网卡层面（速率、双工、错误）

- `sudo ethtool eth0`，查看链路速率/协商/错误统计。

## 8) 报文级高级工具与安全

**wireshark**（GUI）— 可视化协议分析器，解码上百种协议，定位应用层问题最佳。
**ncat / socat** — 高级端口转发、TLS 代理、双向管道。

## 9) 常见诊断流程（一个实用顺序）

1. **能否解析域名？** `dig example.com` / `nslookup`
2. **能否到达 IP？** `ping IP`
3. **路径有没有问题？** `traceroute` / `mtr`
4. **端口是否开放？** `nc -vz host port` 或 `telnet host port` 或 `nmap host -p port`
5. **协议/应用层是否正确响应？** `curl -v`、`openssl s_client`、SMTP/FTP/HTTP 交互
6. **抓包定位细节**：`tcpdump -i eth0 host x.y.z.w and port 443 -w out.pcap`，然后用 Wireshark 分析
7. **带宽/性能**：`iperf3` 测试吞吐，`mtr` 看哪跳丢包/延迟。

## 10) Windows 与 Linux 常用对照

- Ping: `ping`（两者类似）
- Traceroute: Linux `traceroute` / Windows `tracert`
- 查看监听端口: Windows `netstat -ano`，Linux `ss -tuln` 或 `netstat -tulpen`
- 抓包: Windows `Wireshark`（或 Windump），Linux `tcpdump` + Wireshark。

## 11) 权限、安全与合规提醒

- 抓包会获得可能敏感的数据（明文账号等），仅在授权环境/合规下进行。
- 端口扫描/网络扫描可能被视为入侵行为，扫描第三方网络前必须取得授权。
- 使用 sudo/root 权限小心，抓包/修改网络配置可能影响生产流量。

---

### 简明速查表（可复制粘贴）

```
# DNS
dig example.com
dig @8.8.8.8 example.com MX
dig +trace example.com

# 连通性
ping -c 5 8.8.8.8
traceroute example.com
mtr -rw example.com

# 端口/服务
nc -vz host 443
telnet host 25
nmap -Pn -p 1-65535 host

# 应用层
curl -I -v https://example.com
openssl s_client -connect example.com:443 -servername example.com

# 抓包
sudo tcpdump -i eth0 host 1.2.3.4 and port 443 -w out.pcap

# 带宽
iperf3 -s   # server
iperf3 -c server_ip

# 本机查看
ss -tuln
ip addr
ip route
ip neigh
```
