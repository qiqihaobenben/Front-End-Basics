# Linux 新服务器初始安全加固

## 基础访问控制

### 加固 SSH 登录方式

#### 1.创建替代 root 的超级管理员账户

```bash
# 创建一个新用户（以用户名`sysadmin`为例）
sudo useradd -m -c "System Administrator" sysadmin
# 为该用户设置一个强密码，例如 AE=^ghzLq@2Yh%
sudo passwd sysadmin
# 将该用户添加到具有sudo权限的组（Ubuntu/Debian是sudo组，CentOS/RHEL是wheel组）
sudo usermod -aG sudo sysadmin  # 对于Ubuntu/Debian
# 或者 sudo usermod -aG wheel sysadmin  # 对于CentOS/RHEL
```

创建用户的命令可以参考： [创建用户](https://github.com/qiqihaobenben/Front-End-Basics/blob/develop/docs/server/linux/setup.md#users)

完成后，你可以先新开一个终端窗口，使用 sysadmin 用户登录并执行一次 sudo 命令（例如 sudo whoami）来验证权限是否正确。

#### 2. 禁止 root 用户通过 SSH 登录

让攻击者无法直接以 root 身份进行暴力破解。编辑 SSH 配置文件 /etc/ssh/sshd_config，找到并修改如下行：

```bash
PermitRootLogin no
```

#### 3. 更改默认 SSH 端口

将默认的 22 端口改为一个不常用的高端口（如 20245），可以显著减少被自动化扫描工具发现的概率

```bash
Port 20245
```

重要提示：修改端口后，在通过防火墙放行新端口之前，务必确保已正确配置，以免失去连接。

#### 4. 强制使用密钥认证，禁用密码登录

生成密钥对的命令可以参考： [SSH 免密登录](https://github.com/qiqihaobenben/Front-End-Basics/blob/develop/docs/server/linux/ssh-keygen.md)

使用 SSH 密钥对（公钥和私钥）进行认证比密码安全得多。在本地机器上生成密钥对（如果还没有的话）：

```bash
ssh-keygen -t rsa -b 4096 -C "sysadmin@example.com"
```

完成后，将公钥添加到远程服务器：

```bash
ssh-copy-id sysadmin@remote_server
```

如果不支持 ssh-copy-id 命令，可以直接将公钥（`myserver_key.pub`）上传到服务器的对应用户（如 sysadmin）的 `~/.ssh/authorized_keys` 文件中。然后，在 SSH 配置文件中设置：

```bash
PasswordAuthentication no
PubkeyAuthentication yes
```

这实现了仅允许密钥登录，彻底杜绝密码爆破。

#### 5. 应用配置并重启 SSH 服务

```bash
sudo systemctl restart sshd
```

如果使用的是 Ubuntu/Debian，则使用：

```bash
sudo service ssh restart
```

重启前，请务必确保你已经用新用户和新端口成功建立了另一个 SSH 连接并进行过 sudo 权限测试，以防配置错误导致连接断开无法重连。

## 系统加固与防护

### 1. 立即全面更新系统：新安装的系统往往存在已知漏洞，第一步就是更新所有软件包

```bash
# 对于Ubuntu/Debian:
sudo apt update && sudo apt upgrade -y
# 对于CentOS/RHEL:
sudo yum update -y
# 或者使用 dnf (较新的CentOS/RHEL):
sudo dnf update -y
```

### 2. 配置防火墙：使用防火墙（如 UFW 或 firewalld）严格控制进出网络的流量 46。例如，使用 UFW 时：

```bash
sudo ufw enable # 启用防火墙
sudo ufw allow 20245/tcp # 只允许新的SSH端口
# 待需要时，再开放Web服务端口（如80, 443）
# sudo ufw allow 80/tcp
# sudo ufw allow 443/tcp
```

### 3. 关闭非必要服务与端口：检查并关闭任何不需要运行的服务

```bash
sudo systemctl stop <service_name>   # 停止服务
sudo systemctl disable <service_name> # 禁止开机自启
```

## 持续安全维护

### 安装入侵防护工具：考虑安装 Fail2ban 这类工具，它能监控日志，当发现恶意登录尝试（如多次密码错误）时，会自动临时封禁对应 IP 地址，有效对抗暴力破解。

### 建立定期备份机制：定期备份关键数据和系统配置是最后的安全防线，能在发生意外时快速恢复
