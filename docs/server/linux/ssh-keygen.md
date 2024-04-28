# SSH 免密登录

要配置 macOS 从 SSH 免密登录 CentOS 服务器，你需要在 macOS 上生成 SSH 密钥对，并将公钥上传到 CentOS 服务器。这样设置后，用户就不需要每次连接时输入密码。下面是具体步骤：

### 步骤 1: 在 macOS 上生成 SSH 密钥对

1. 打开 macOS 上的终端。
2. 输入以下命令生成 SSH 密钥对：
   ```bash
   ssh-keygen -t rsa -b 4096
   ```
3. 按照提示操作，可以为密钥设置密码（可选），并确认保存路径（默认是 `~/.ssh/id_rsa`）。
4. 生成的密钥对包括私钥文件 `id_rsa` 和公钥文件 `id_rsa.pub`。

#### ssh-keygen 基本选项

- `-t type`
  指定生成密钥的类型。常见的类型有 `rsa`, `dsa`, `ecdsa`, `ed25519` 等。例如：`ssh-keygen -t rsa`。

- `-b bits`
  指定密钥的长度。对于 RSA 密钥，推荐的最小长度是 2048 位，通常使用 4096 位以增强安全性。例如：`ssh-keygen -t rsa -b 4096`。

- `-C comment`
  为密钥对添加一个注释，通常用于标识密钥的用途或持有者的信息。例如：`ssh-keygen -t rsa -C "your_email@example.com"`。

- `-f filename`
  指定生成密钥存储的文件名。如果不使用这个选项，默认会存储在 `~/.ssh/id_rsa`（私钥）和 `~/.ssh/id_rsa.pub`（公钥）。

#### 高级选项

- `-N passphrase`
  为生成的密钥设置一个短语密码。如果设置了密码，每次使用密钥时都需要输入此密码。例如：`ssh-keygen -t rsa -N "your_password"`。

- `-e`
  用于读取一个私钥或公钥文件，然后将其输出为指定的格式。常用于将 SSH 密钥转换为其他格式。

- `-p`
  用于修改密钥文件的密码。这个选项不会改变密钥本身，只改变保护密钥的密码。

- `-q`
  安静模式，不输出任何信息。

- `-m format`
  指定密钥导出格式，用于密钥的导出或转换。支持的格式包括 `PEM`（默认的 RSA 和 DSA）、`PKCS8`（推荐的私钥存储格式）等。

- `-o`
  保存私钥时使用新的（更安全的）格式。这是 OpenSSH 7.8 及以上版本的默认行为。

#### 示例

生成一个类型为 RSA，长度为 4096 位的密钥，带有邮箱地址作为注释：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

修改现有密钥的密码：

```bash
ssh-keygen -p -f ~/.ssh/id_rsa
```

转换密钥格式为 PKCS8：

```bash
ssh-keygen -p -m PKCS8 -f keyfile
```

s

### 步骤 2: 将 SSH 公钥上传到 CentOS 服务器

1. 使用 `ssh-copy-id` 命令将你的公钥添加到 CentOS 服务器的 `~/.ssh/authorized_keys` 文件中。假设你的 CentOS 服务器用户为 `abc`，服务器 IP 为 `server_ip`，则命令为：
   ```bash
   ssh-copy-id -i ~/.ssh/id_rsa.pub abc@server_ip
   ```
2. 如果没有 `ssh-copy-id` 可用，你可以手动上传公钥：
   - 首先，在 macOS 终端查看并复制公钥内容：
     ```bash
     cat ~/.ssh/id_rsa.pub
     ```
   - 然后，登录到 CentOS 服务器：
     ```bash
     ssh abc@server_ip
     ```
   - 创建 `.ssh` 目录并修改权限（如果尚未创建）：
     ```bash
     mkdir -p ~/.ssh
     chmod 700 ~/.ssh
     ```
   - 添加公钥到 `authorized_keys` 文件并设置正确的权限：
     ```bash
     echo "粘贴你的公钥内容" >> ~/.ssh/authorized_keys
     chmod 600 ~/.ssh/authorized_keys
     ```
   - 退出 SSH：
     ```bash
     exit
     ```

### 步骤 3: 从 macOS 使用 SSH 免密登录 CentOS 服务器

- 完成上述步骤后，尝试从你的 macOS 终端通过 SSH 连接到 CentOS 服务器，应该不再需要密码：
  ```bash
  ssh abc@server_ip
  ```

### 注意事项

- 确保 CentOS 服务器的 SSH 配置（位于 `/etc/ssh/sshd_config`）允许公钥认证：
  - `PubkeyAuthentication yes`
  - 如果更改了配置文件，需要重启 SSH 服务：
    ```bash
    sudo systemctl restart sshd
    ```
- 保护好你的私钥文件，不要泄露给其他人。

#### 建议：

`/etc/ssh/sshd_config` 修改：

```
PermitRootLogin no
PasswordAuthentication yes
```

PermitRootLogin 应该设置为 no（出于安全考虑，不建议允许 root 用户通过 SSH 登录）。
PasswordAuthentication 可以设置为 yes，如果你希望通过密码进行认证。
