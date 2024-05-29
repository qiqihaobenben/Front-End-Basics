# 服务器磁盘清理

当服务器磁盘满了时，需要有条不紊地排查并清理不必要的文件和数据。以下是逐步的排查和清理步骤以及每一步的具体指令：

### 1. 检查磁盘使用情况

首先，检查哪些目录和文件占用了大量空间。

#### 检查磁盘使用情况

```bash
df -h
```

这个命令会显示所有文件系统的使用情况。

#### 查找占用空间最大的目录

```bash
du -h --max-depth=1 / | sort -h
```

从根目录开始，查找哪个一级目录占用最多空间。可以逐层深入，例如：

```bash
du -h --max-depth=1 /var | sort -h
```

### 2. 清理日志文件

日志文件可能会占用大量空间，特别是在 `/var/log` 目录下。

#### 查看日志目录

```bash
cd /var/log
ls -lh
```

#### 清理日志文件

清空大日志文件而不删除文件：

```bash
> large_log_file.log
```

或者删除旧的日志文件：

```bash
rm -f old_log_file.log
```

### 3. 清理缓存

#### 清理 APT 缓存（适用于 Debian/Ubuntu）

```bash
sudo apt-get clean
```

#### 清理 Yum 缓存（适用于 CentOS/RHEL）

```bash
sudo yum clean all
```

### 4. 删除无用的文件和目录

#### 查找和删除大文件

查找大于 100MB 的文件：

```bash
find / -type f -size +100M
```

根据需要删除无用的大文件：

```bash
rm -f /path/to/large/file
```

### 5. 清理 Docker 占用的空间

#### 删除停止的容器

```bash
docker container prune
```

#### 删除无用的镜像

```bash
docker image prune -a
```

#### 删除无用的数据卷

```bash
docker volume prune
```

#### 删除无用的网络

```bash
docker network prune
```

#### 删除所有未使用的 Docker 资源

```bash
docker system prune -a
```

### 6. 清理临时文件

#### 清理系统临时文件

```bash
sudo rm -rf /tmp/*
sudo rm -rf /var/tmp/*
```

### 7. 检查和清理用户目录

用户目录下也可能有大量无用文件，如下载的安装包、临时文件等。

#### 查找并删除大文件

```bash
find /home -type f -size +100M
```

根据需要删除无用的大文件：

```bash
rm -f /home/user/large_file
```

### 8. 卸载不再需要的软件包

卸载不再需要的软件包可以释放一些空间。

#### 列出已安装的软件包

```bash
dpkg-query -l | less  # 适用于 Debian/Ubuntu
rpm -qa | less        # 适用于 CentOS/RHEL
```

#### 卸载软件包

```bash
sudo apt-get remove package_name  # 适用于 Debian/Ubuntu
sudo yum remove package_name      # 适用于 CentOS/RHEL
```

### 总结

通过以上步骤，可以有效地排查并清理服务器上不必要的数据和文件，释放磁盘空间。每一步操作前请确认文件和数据是否不再需要，以避免误删除重要内容。
