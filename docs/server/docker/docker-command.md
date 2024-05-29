# Docker 命令

## 基础操作

### 1. 查看 Docker 版本

```bash
# 简单输出版本号
docker -v
docker --version

# 详细输出版本信息
docker version
```

### 2. 查看 Docker 信息

```bash
docker info
```

### 把用户加入 Docker 用户组

Docker 需要用户具有 sudo 权限，为了避免每次命令都输入 `sudo`，可以把用户加入 Docker 用户组，使其具有 Docker 权限。

```bash
sudo usermod -aG docker $USER
```

### 3. 启动 Docker

Docker 是服务器——客户端架构，命令行操作 Docker 时，需要先启动 Docker 服务。

```bash
sudo systemctl start docker
```

### 4. 停止 Docker

```bash
sudo systemctl stop docker
```

### 5. 重启 Docker

```bash
sudo systemctl restart docker
```





