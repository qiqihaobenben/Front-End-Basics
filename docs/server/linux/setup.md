# 服务器配置基础

这篇文章我已经打算写很久了。虽然解释如何设置自托管应用很简单，但建立在薄弱基础上的托管毫无意义。每次开头都要讲服务器设置，这对我来说简直是头疼，所以我也写这篇文章作为自己设置托管应用服务器的参考。我会从基础开始，比如使用 SSH 进行正确登录、非 root 用户设置以及为每个应用创建用户。我还会涉及到 NGINX 的设置，一些让服务器管理更轻松的生活质量工具，日志管理和基本网络安全。

- SSH
- Users
- Logs
- Backups
- Basic Network Safety
- NGINX
- Quality of Life Tools
- DNS
- Docker

## SSH

首先，是登录。您需要一种安全访问设备的方法。不要碰用户名和密码。您应该使用 SSH（安全外壳）并确保 SSH 是唯一的登录方式。为此，您需要一个 SSH 密钥和一个新的用户账户。在新配置的 VPS 上，您将以 root 身份登录，并希望保护 root 账户。首先，在 VPS 或远程机器上创建一个新的普通用户，并将其添加到“sudo”组中，使用以下命令：

```
sudo adduser newuser

sudo usermod -aG sudo newuser
```

现在请在您的本地机器上运行：

```
ssh-keygen -t ed25519 -C "your_email@example.com"
```

请按照指示操作，程序会询问您希望保存文件的位置以及是否需要设置密码。请确保您设置一个字符串密码。要将公钥复制到您的服务器，请在本地机器上运行以下命令：

```
ssh-copy-id -i ~/.ssh/id_ed25519.pub newuser@your_server_ip
```

请记住，newuser@your-server-ip 是用户名，您要将公钥复制到的远程设备。当您被提示输入密码时，输入的是远程设备上账户的密码，而不是您刚刚为 SSH 密钥设置的密码。验证通过后，公钥将被复制，您现在可以通过 SSH 登录。要关闭用户名和密码登录，请输入：

```
sudo nano /etc/ssh/sshd_config
```

找到这些值，并按照您在这里看到的样子设置它们。

```
Port 2222     # Change default port (use a number between 1024 and 65535)
PermitRootLogin no                 # Disable root login
PasswordAuthentication no          # Disable password authentication
PubkeyAuthentication yes           # Enable public key authentication
AuthorizedKeysFile .ssh/authorized_keys # Specify authorized_keys file location
AllowUsers newuser                 # Only allow specific users to login
```

此操作禁止除 SSH 之外的所有登录方式，除了您复制公钥的用户。阻止以 Root 身份登录，仅允许您指定的用户登录。按 CTL+S 保存，按 CTL+x 退出文件编辑器。重启 SSH：

```
sudo service ssh restart
```

这可能会让你退出会话。如果真的发生了，这是一个测试其他登录方法是否被拒绝的好时机，以便继续操作。此外，虽然不言而喻，但你仍需妥善保管私钥，一旦丢失，你将无法再远程登录。你还可以进一步锁定你的登录方式：

```
Protocol 2                 # Use only SSH protocol version 2
MaxAuthTries 3             # Limit authentication attempts
ClientAliveInterval 300    # Client alive interval in seconds
ClientAliveCountMax 2      # Maximum client alive count
```

现在，让我们更深入地探讨用户，看看我们如何利用他们来提高组织性和安全性。

## Users

用户在 Linux 服务器管理中至关重要。在服务器管理中有一个名为“最小权限原则”的概念，这基本上意味着您希望为应用程序或进程提供完成其工作所需的最小权限。root 拥有无限权限，没有任何应用程序真正需要这些权限。为运行的应用程序创建用户可以完成几件事情。如果运行的应用程序被入侵，它可以限制潜在的损害。当运行多个应用程序时，它增加了隔离性，有助于审计，以便您知道哪个应用程序正在使用哪些系统资源。

简而言之，用户是帮助您组织系统并解决系统出现问题时的一大助力。要添加新用户，请运行：

```
sudo useradd -rms /usr/sbin/nologin -c "a comment" youruser
```
- -c：加上备注文字，备注文字保存在passwd的备注栏中。此处为：a comment
- -d：指定用户登入时的主目录，替换系统默认值/home/<用户名>
- -D：变更预设值。
- -e：指定账号的失效日期，日期格式为MM/DD/YY，例如06/30/12。缺省表示永久有效。
- -f：指定在密码过期后多少天即关闭该账号。如果为0账号立即被停用；如果为-1则账号一直可用。默认为-1.
- -g：指定用户所属的群组。值可以是组名也可以是GID。用户组必须已经存在的，默认值为100，即uers。
- -G：指定用户所属的附加群组。
- -m：自动建立用户的登入目录。
- -M：不要自动建立用户的登入目录。
- -n：取消建立以用户名称为名的群组。
- -r：建立系统账号。
- -s：指定用户登入后所使用的shell。默认值为/bin/bash。此处为 /usr/sbin/nologin

这个命令创建一个用户并为应用程序数据分配一个家目录，但该用户不允许登录。-c 标志是可选的，但了解用户用途会更好，比如“运行 Nextcloud”等。使用以下命令将应用程序文件克隆到 /opt 目录中：

```
sudo mkdir /opt/myapp
```

更改 /opt 目录的所属用户：

```
sudo chown appuser:appuser /opt/myapp
```

好的，现在您的登录已经完成了，您应该对如何使用用户有了相当的了解。接下来是日志。

## Logs

日志对于系统管理至关重要。它们记录系统健康状况，帮助排查问题和检测威胁。因此，您需要设置合适的日志轮转，以避免占用过多系统空间，同时使日志更易于阅读和管理。要设置合适的日志轮转，您需要编辑位于 /etc 的 logrotate.conf 文件。单个应用程序的配置通常存储在 /etc/logrotate.d/ 中，因此 NGINX 的示例配置可能如下所示：

```
/var/log/nginx/*.log {
    weekly
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        [ -f /var/run/nginx.pid ] && kill -USR1 `cat /var/run/nginx.pid`
    endscript
}
```

这个配置每周轮换日志，保留 52 周的历史日志，压缩旧日志，创建新日志并设置正确的权限，然后向 NGINX 发送信号以在轮换后重新打开日志文件。您可以通过以下方式测试它：

```
sudo logrotate -d /etc/logrotate.conf
```

这会展示它将执行的操作，而无需实际轮转日志。设置好这一切后，您就可以开始进行更高级的操作，比如根据日志条目触发警报。现在这对单个服务器来说很好，但如果您管理多个服务器，那么考虑使用像 Grafana Loki、Graylog 和 Fluentd 这样的工具是个不错的选择。这里不会详细介绍，但如果您想提升日志管理能力，这些工具是个不错的起点。

## Backups

备份，更重要的是，测试你的备份，在服务器管理中极为重要。记住：未经测试的备份不算备份。未经验证的备份实际上毫无用处。

备份主要有三种类型：完全备份、差异备份和增量备份。完全备份是对磁盘上所有数据的完整复制。它需要最多的资源，但恢复起来最简单。差异备份备份自上次完全备份以来所有的更改，这是一种在备份空间和恢复速度上的折中策略。增量备份备份自上次备份以来发生更改的数据，这是最快的备份选项，但恢复起来可能最复杂。

我这样想。对于像照片、文档或经常编辑的项目文件和文件夹，我会使用增量备份。对于备份整个服务器或磁盘，我会使用完整备份。对于备份像 /etc、/opt 和日志文件夹这样的完整文件夹，我会使用差异备份。

现在说说存储问题吧？如果你遵循 3-2-1 规则，那就没问题了。三份数据副本，两种存储类型，以及一份异地备份。我觉得如果这听起来太多，那么“异地”存储是最重要的，绝对不能省略。在发生灾难性崩溃的情况下，拥有你的备份硬盘是无价的。异地/离线备份还可以让你免受勒索软件的侵害。所以请记住这一点。市面上有大量的备份软件。这里有一些探索更多专业备份工具的资源。这里有一些文件同步、传输和云存储解决方案。我使用的是 sync-thing、Borg 备份和传统的 FTP 的组合。

记住，备份、日志和服务器监控是一个根据您的需求不断发展的过程。您所实施的特定策略应针对您的需求和数据的紧迫性量身定制。

## Basic Network Safety

下一步确保服务器安全是锁定那些不需要暴露给互联网的端口，并禁止那些不应该尝试登录的行为。UFW 和 Fail2Ban 是广泛使用的两个工具。它们简单易用，UFW 允许您设置端口的流量规则，而 Fail2Ban 会在 IP 地址尝试访问不应访问的端口或连续失败登录后，根据预设规则禁止该 IP 地址。UFW（不复杂防火墙）通常预安装在许多 VPS 服务上，Fail2Ban 也是如此。如果您在一台新机器上并且不确定，请运行：

```
sudo apt install ufw

sudo apt install fail2ban
```

### UFW

我们稍后再处理 Fail2Ban，现在让我们先专注于 UFW 的设置。首先，运行一些默认策略，使用以下命令：

```
sudo ufw default deny incoming

sudo ufw allow outgoing
```

这是最佳实践，因为它遵循了之前我提到的“最小权限”理念。这减少了您机器的攻击面，并让您能够精确控制您所暴露的内容。简而言之，这种配置在安全性和功能之间取得了平衡。您的服务器在需要时可以连接到互联网，但外部实体只能以您明确允许的方式连接到您的服务器。现在，让我们允许一些内容进入。

```
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
```

如果你要运行一个 Web 服务器，你需要开启端口 80 和端口 443。80 端口是 HTTP，443 端口是 HTTPS。默认情况下，端口 22 是 SSH，如果你更改了端口，你需要指定端口而不是使用“allow ssh”命令。以下是一些其他有用的命令：

```
#List rules with numbers:
sudo ufw status numbered
#Delete by number:
sudo ufw delete NUMBER
#Delete by rule specification:
sudo ufw delete allow 80
#You can allow connections from specific IP addresses:
sudo ufw allow from 192.168.1.100
#You can also only allow an IP to connect to a specfic port with:
sudo ufw allow from 192.168.1.100 to any port 22
#If you neeed to allow a range of ports:
sudo ufw allow 6000:6007/tcp
#To further protect from brut force attacks you can rate limit specific ports with:
sudo ufw limit ssh
#This would limit port 22 to 6 connections in 30 seconds from a single IP. To see the status of the firewall you can use:

#Adding this goves you more info
sudo ufw status verbose
#and to reset incase you need to start over:
sudo ufw reset
#and to enable and disable:
sudo ufw enable
sudo ufw disable

#finaly to enable logging and adjusting the log level:
sudo ufw logging on
sudo ufw logging medium # levels are low, medium, high, full
```

继续前进，Fail2Ban。

### Fail2Ban

主配置文件位于 /etc/fail2ban/jail.conf，但建议创建一个本地配置文件：

```
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

sudo nano /etc/fail2ban/jail.local
```

在 jail.local 部分的[DEFAULT]节中，有一些基本的设置，具体如下：

```
bantime = 10m
findtime = 10m
maxretry = 5
```

禁用时间是指 IP 被禁止的时间长度。查找时间是指 Fail2Ban 查找重复失败的时间范围，最大重试次数是指 IP 被禁止前的失败次数。您可以根据需要调整这些参数。您还可以设置自定义监狱，Fail2Ban 还支持 SSH 等常用服务的监狱。您还可以采取更多步骤，但我认为这已经涵盖了基础知识。

## NGINX

这里有很多可以使用的网络服务器。比如 Apache、Caddy、nginx、IIS 等等。我使用的是 Nginx。这是我熟悉的，而且它真的非常出色。Nginx（发音为 engine-x）是一款网络服务器、反向代理和负载均衡器。作为网络服务器，它擅长提供静态内容，并且可以以较低的资源消耗处理大量的并发连接。作为反向代理，它可以位于您的应用服务器之前，将流量转发到它们那里，同时增强应用程序的安全性。其负载均衡功能可以有效地在服务器之间平衡流量，提高可靠性和可扩展性。

当通过 apt 安装时，nginx 的默认位置是/etc/nginx/，nginx.conf 主要用于全局服务器配置，并包含来自/etc/nginx/sites-enabled 文件夹的文件。这种模块化结构使得管理多个网站变得容易。需要关注的两个文件夹是 sites-enabled 文件夹和 sites-available 文件夹。你可以把 sites available 看作是一个测试网站配置的预演场所，而 sites enabled 则是用于在线网站和应用程序。常见的做法是在 sites available 中设置和测试你的配置，然后当你准备上线并获得 SSL 证书时，将文件链接到 sites-enabled 文件夹。你可以使用以下命令来完成：

```
ln -s /etc/nginx/sites-available/yoursitefile /etc/nginx/sites-enabled
```

然后重新加载 nginx，并使用以下命令再次检查 nginx 状态：

```
sudo systemctl reload nginx

sudo systemctl status nginx
```

您的网站现在应该已经上线了。

以下，我将向您展示一些 Nginx 网站配置的样板。请确保根据您的应用程序或网站的需求进行调整，这些只是起点。对于静态网站，这是一个不错的起点。

基础静态网站配置：
```
erver {
    listen 80;
    listen [::]:80;
    server_name example.com www.example.com;
    root /var/www/example.com/html;
    index index.html index.htm;
    location / {
        try_files $uri $uri/ =404;
    }
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Logging
    access_log /var/log/nginx/example.com.access.log;
    error_log /var/log/nginx/example.com.error.log warn;

    # SSL configuration (uncomment after running Certbot)
    # listen 443 ssl http2;
    # listen [::]:443 ssl http2;
    # ssl_protocols TLSv1.2 TLSv1.3;
    # ssl_prefer_server_ciphers on;
    # ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;

    # Certbot will add its own SSL certificate paths
    # ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
}
```

代理服务器配置：
```
server {
    listen 80;
    listen [::]:80;
    server_name app.example.com;
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Logging
    access_log /var/log/nginx/app.example.com.access.log;
    error_log /var/log/nginx/app.example.com.error.log warn;

    # SSL configuration (uncomment after running Certbot)
    # listen 443 ssl http2;
    # listen [::]:443 ssl http2;
    # ssl_protocols TLSv1.2 TLSv1.3;
    # ssl_prefer_server_ciphers on;
    # ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;

    # Certbot will add its own SSL certificate paths
    # ssl_certificate /etc/letsencrypt/live/app.example.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;
}
```

WebSocket 升级配置：
```
server {
    listen 80;
    listen [::]:80;
    server_name ws.example.com;
    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # WebSocket timeout settings
    proxy_read_timeout 300s;
    proxy_send_timeout 300s;
    # Logging
    access_log /var/log/nginx/ws.example.com.access.log;
    error_log /var/log/nginx/ws.example.com.error.log warn;

    # SSL configuration (uncomment after running Certbot)
    # listen 443 ssl http2;
    # listen [::]:443 ssl http2;
    # ssl_protocols TLSv1.2 TLSv1.3;
    # ssl_prefer_server_ciphers on;
    # ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;

    # Certbot will add its own SSL certificate paths
    # ssl_certificate /etc/letsencrypt/live/ws.example.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/ws.example.com/privkey.pem;
}
```

基本配置用于提供简单的静态网站服务。它指定了域名，监听 IPv4 和 IPv6 的 80 端口，设置了网站的根目录，使用 try_files 配置错误处理，添加了一些基本的头部信息以防止常见的网络漏洞，设置了访问和错误日志记录，并包含了一个注释掉的 SSL 配置部分。大部分的 SSL 配置将由 certbot 处理，但在 certbot 运行后，其中的一些 SSL 安全设置可以被取消注释。

代理转发配置与基本配置类似，但不是直接服务文件，而是将请求代理到本地应用程序（在本例中，运行在端口 3000 上）。

第三种配置文件适用于需要网站连接的应用程序，它与代理转发配置类似，但进行了一些修改以允许使用 WebSocket。

好的，关于 Web 服务器的任何讨论如果不提及 SSL 就不够完整。对于普通用户来说，certbot 简直就是神器。它是免费的，速度快，而且绝对靠谱。我使用的是 certbot 的 Python 版本。你可以通过以下方式安装它：

```
sudo apt install certbot python3-certbot-nginx
```

一旦安装完成，您只需在终端中运行“certbot”，它将检测您的 sites-enabled 文件夹中的配置，并询问您想做什么（续订、重新发行等）。按照说明操作，certbot 的操作非常直观。

现在，certbot 在获取新证书时会自动为您设置自动续订，所以这是一个可以坐等完成的任务。但为了确保它已经生效，您可以运行：

```
sudo systemctl status certbot.timer
```

如果这个服务运行正常，使用 systemd 的情况下，你应该可以正常使用。

## Quality Of Life Tools

关于使系统管理变得更容易的工具这一话题，我将介绍一些我在服务器上使用的工具，我认为这些工具可以让管理变得更加便捷。不会对任何工具进行深入探讨。所有这些工具都是可选的，且不分先后顺序。其中很多我都是在“terminal trove”网站上找到的，这是一个非常适合终端爱好者浏览的网站。

第一个工具，Btop，这是我的个人必备清单之一。Btop 是一款资源监控终端工具，它可以实时显示您盒子的 CPU、RAM、磁盘、网络和运行进程的使用统计信息。它用 C++编写，可以通过大多数包管理器进行安装。

对于拥有大量外部连接的服务器，例如一个洋葱路由器，Neoss 这样的工具非常有用。Neoss 旨在替代常规的 ss 命令进行基本操作。它提供了正在使用的 TCP 和 UDP 套接字及其相应统计信息。与 SS 原始输出相比，它的主要优势在于其清晰简单的 TUI（终端用户界面），允许您对连接到您的机器的内容进行排序、刷新和导航。它通过 NPM 安装，这意味着您需要安装 JavaScript。

GoAccess 是一款基于终端的 Web 服务器日志分析工具。它非常适合在终端中快速查看日志，同时也能生成实时 HTML、JSON 和 CSV 报告。GoAccess 可以通过大多数包管理器安装，适用于所有平台。

下一个是 MC，或称“午夜指挥官”，它是一款功能强大的基于文本的文件管理器，具有双面板显示和大量用于操作文件和目录的功能。它还支持跨平台，可以通过大多数包管理器进行安装。

在服务器文件管理方面，NCDU 也是其中之一。它是我必装清单中的一员。这是一个磁盘使用分析器，旨在查找占用空间的“大块头”。它运行速度快，使用非常简单。它可以在大多数系统和包管理器上安装。Windows 系统需要安装 Linux 子系统才能使用它。

希望您能从中找到一些有用的信息。最后一个我想提到的主题是 DNS，这是一个有点复杂的主题，所以我就不深入探讨了，但如果您是自托管的话，了解一些 DNS 的基础知识是有帮助的。因为配置不当，它可能无法正常工作。

## DNS

DNS，即域名系统，是我们所熟知的互联网运作的核心部分。无论你喜欢与否，它都是我们必须与之共存的。如果你想要在更广泛的互联网上被访问，就必须使用它。（我并不喜欢它现在的样子，但这里不是打开这个罐头的地方。）简单来说，可以把 DNS 想象成一本电话簿。它允许你每次搜索互联网时输入“duckduckgo.com”而不是“52.250.42.157”。它将人类易于记忆的信息转换为计算机实际需要的信息，以便访问“duckduckgo.com”。

如果你在 VPS 上托管，你真正需要知道的就是在你确定要使用的域名之后，如何将 A 记录指向服务器的 IP 地址。几乎所有的 VPS 主机都能为你提供静态 IP，所以这基本上是一个设置好后就可以不用再管的事情。

在家举办活动会带来一些挑战。其中最突出的问题之一（也是我经常听到的一个有效问题）就是没有静态 IP 地址。如今，随着在线设备数量的增加，需要分配 IP 地址，我们不得不进行很多调整，除非你向你的 ISP 付费，否则大多数 IP 地址都是动态分配的。但是，有一个解决方案。这个解决方案叫做动态 DNS，或者 DDNS。它允许在 IP 地址每次更改时自动更新 DNS 服务器。设置动态 DNS 有很多种方法。你可以自己托管服务或者使用托管服务。这里有一个链接 https://dynamic.domains/dynamic-dns/providers-list/default.aspx，你可以查看一些托管服务和项目。

总的来说，它的工作原理是这样的。你可以选择一个提供商或者自己搭建。你获得一个域名，然后在你的家用路由器或服务器上安装客户端，客户端会定期检查 IP 地址是否发生变化，如果发生变化，它会更新该域名的 DNS 记录。

## Docker

这里不打算介绍如何安装 Docker。最好是还是遵循官方安装指南。但我想谈谈一些其他的事情。首先，Docker 在测试新应用方面非常有用。但我的使用也就到此为止了。我个人并不太喜欢使用 Docker，能直接运行应用的地方就尽量直接运行。以下是一些需要考虑的优缺点。

### Docker 优点

一致性非常重要，它可以使开发、测试和部署过程中的事物更加稳定。如果你的系统可以运行 Docker，你就可以运行大多数 Docker 应用。它有助于隔离，减少应用程序之间的冲突。在某些情况下，它还可以提高效率，因为它比传统的虚拟机消耗的资源更少。它有助于扩展，因为启动更多容器相对容易，而微服务架构非常有用，因为它可以将应用程序分解成更小的、可管理的服务，从而允许独立扩展这些服务。最后，社区规模庞大，因此文档质量良好，社区支持也总是很有帮助，而且还有大量的现成 Docker 镜像可供部署。

### Docker 缺点

我首先从“overhead”说起。虽然它比传统的虚拟机好，但相比直接在主机上运行，它消耗更多的资源，I/O 操作也可能更慢。由于 Docker 共享系统内核，因此被攻击的应用程序可能会影响整个系统。持久化数据是可行的，但会增加复杂性，可能导致新用户数据丢失，同时也使得备份变得更加复杂。使用 Docker 时，网络配置也可能更加复杂，使其不那么直接。值得注意的是，如果您使用 UFW 或 firewalld 作为防火墙，Docker 会绕过这些规则。Docker 仅兼容 iptables。此外，虽然管理良好的 Docker 容器可以帮助管理服务器资源，但管理不当的容器也可能对资源造成损害。容器可能会变得过大，影响磁盘大小，配置不当也可能消耗过多服务器资源。此外，在监控和调试应用程序时，尤其是在多个容器之间，它还会增加额外的复杂性。

最后，这是你的系统。但我想列举一下使用 Docker 的优缺点。接下来。

## 总结

好的，服务器设置和工具的基础知识就讲到这里了。我写了一个脚本 https://git.sovbit.dev/Enki/sovran-scripts，可以帮你完成大部分这些工作。我写这个脚本是为了让我的服务器设置更快。你可以在这里获取它，它包含了我必须有的所有东西，并进行了一些基本配置。根据你的需求进行修改，并且一如既往地，在外出时保持安全

#### [原文：server-setup-basics](https://becomesovran.com/blog/server-setup-basics.html)
