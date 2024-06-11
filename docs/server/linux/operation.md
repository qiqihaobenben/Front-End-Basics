# Linux 服务器运维

## 性能

### 查看使用内存最多的 10 个进程

```bash

ps aux | sort -nrk 4 | head -10

```

### 查看使用 CPU 最多的 10 个进程

```bash

ps aux | sort -nrk 3 | head -10

```

## 用户相关

### 用户权限操作

```sh
# 创建一个文件夹，查看当前用户拥有的文件夹权限
mkdir demo && ls -l demo
# drwxrwxr-x 2 root root 4096 Jan 14 11:48 demo

sudo useradd ceshi # 创建一个新用户
sudo passwd ceshi # 设置用户密码
su ceshi # 切换 ceshi 用户登录
cd demo # 进入 demo 文件夹
touch index.js # 创建 index.js 文件，提示无权限

# chown chmod chgrp
sudo chown -R ceshi:ceshi ./demo # demo 文件夹的所有者改成 ceshi
su ceshi # 切换 ceshi 用户
touch index.js # 创建 index.js 文件成功
```
