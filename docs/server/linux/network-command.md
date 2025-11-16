# 网络命令行工具

以下 **常用的网络测试命令** 按“从链路到应用”分层讲清楚：每个命令的用途、典型用法示例、能测什么、以及如何读输出（并给出 Linux / macOS 与 Windows 的常用互对应命令）。

## 1) 基础连通性（ICMP / 路由）

> ICMP 是 Internet Control Message Protocol 的缩写，意为互联网控制消息协议。它是一种网络层协议，用于在计算机之间传递控制消息。

#### **ping** — 测试目标是否可达、往返时延（RTT）、丢包率

- Linux/macOS: `ping -c 5 8.8.8.8`（发送 5 个包）
- Windows: `ping -n 5 8.8.8.8`

  **看什么**：响应时间、丢包。若 IP 可达但域名不可达，说明可能是 DNS 问题。

  注意：很多主机/防火墙会丢弃 ICMP，所以 ping 不通不一定等同主机不可达。

#### **traceroute / tracert / mtr（My Traceroute）** — 路径追踪，查看到目标经过哪些跳（路由器），诊断哪一跳延迟或丢包

- Linux/macOS: `traceroute example.com` 或更常用的 `mtr -rw example.com`（实时显示）
- Windows: `tracert example.com`

  **看什么**：哪一跳延迟骤升或丢包；若在某跳就停了，可能该跳丢弃 ICMP/TTL 过期响应，但后续仍可达（需结合 ping/应用层测试）。

## 2) 端口与传输层（TCP/UDP）测试

#### **telnet**（测试 TCP 端口是否可建立连接）

- 示例：`telnet smtp.example.com 25` 或 `telnet 192.0.2.1 80`

  **看什么**：能否建立 TCP 三次握手；若能连上但应用无响应，可能应用层问题。
  Windows 常自带 telnet（需启用），Linux 也常见。

#### **nc / netcat** — 万能端口读写工具（可用作客户端或服务器）

- 连接：`nc -v hostname 12345`
- 建服务器（临时接收）：`nc -l 8080`（某些发行版是 `-l -p 8080`）

  **用途**：测试 TCP/UDP（`-u`）端口连通性、端到端数据交换、简单端口转发。

参考：[nc 命令使用小结](https://wsgzao.github.io/post/nc/)

#### **nmap** — 端口扫描、服务/版本探测、防火墙检测

- 扫描常用端口：`nmap -Pn -p 22,80,443 host`
- 全端口扫描并尝试检测服务：`nmap -sV -p- host`

  **看什么**：哪些端口开放、服务类型及版本、是否存在防火墙阻断（filtered）。

  注意：扫描别人的网络前请获授权。

#### **ss / netstat** — 查看本机的监听端口和连接

- Linux: `ss -tuln`（列出 listening TCP/UDP，本地端口号）或 `ss -s`（统计）
- 旧命令 `netstat -tulpen`（某些系统已淘汰）

  **看什么**：本机哪些服务在监听、哪些远端已建立连接。

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
