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

- Client：docker 客户端信息
- Server：docker 服务端信息
- Containers：容器数量
- Images：镜像数量
- Server Version：docker 版本
- Docker Root Dir：docker 根目录
- Registry Mirrors：当前使用的镜像源

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

## Dcoker 仓库

Docker Hub 官网：https://hub.docker.com/

### docker login

需要先在 Docker Hub 中注册一个账号才能在 Linux 登录

```bash
# 通过命令行方式输入账号密码
docker login

# 通过参数输入账号密码，这种方式不安全，密码会出现在 shell 的历史记录或日志文件中
docker login -u poloyy -p ***

# 通过 STDIN 输入密码，先将密码存储在 pwd.txt 文件中，可以解决上一个栗子的不安全问题
cat pwd.txt | docker login -u poloyy --password-stdin
```

### docker logout

```bash
docker logout
# Removing login credentials for https://index.docker.io/v1/
```

### docker pull

从镜像仓库中拉取或更新镜像

语法格式：`docker pull [OPTIONS] NAME[:TAG|@DIGEST]`

TAG：标签，不写的话默认是 latest 最新版

#### options 说明

- -a, --all-tags ： 拉取所有 tagged 镜像
- --disable-content-trust ： 忽略镜像的校验,默认开启
- -q, --quiet ： 概要输出
- --platform string ： 若服务支持多平台，这里可以设置平台

#### 示例

```bash
# 从 Docker Hub下载java最新版镜像
docker pull java

# 从 Docker Hub下载 REPOSITORY 为 java 的所有镜像
docker pull -a java

# 等价写法
docker pull tomcat:8
docker pull docker.io/library/tomcat:8
```

### docker push

将本地的镜像上传到镜像仓库，要先登录到镜像仓库

上传本地镜像的前置操作：

- 注册 Docker Hub 账号
- Linux 登录 Docker Hub 账号
- 给镜像设置 TAG

语法格式：`docker push [OPTIONS] NAME[:TAG]`

#### options 说明

- --disable-content-trust ： 忽略镜像的校验,默认开启

### docker search

从 Docker Hub 上查找镜像

语法格式 `docker search [OPTIONS] NAME`

#### options 说明

- -f, --filter ： 根据提供的 filter 过滤输出
- --limit N ： 搜索结果条数最大为 N（默认 25）
- --no-trunc ： 显示完整的镜像 description
- --format ： 使用 Go 模板进行美观打印

```bash
# 搜索 star 数量>1000 的 node 相关镜像并打印详细描述
docker search --filter stars=1000 --no-trunc node

# 搜索自动构建的 node 相关镜像，能看到 AUTOMATED 都是 OK
docker search --filter is-automated=true node

# 搜索 star 数量>100 且是官方版本的 node 镜像
docker search --filter stars=100 --filter is-official=true node
```

## 本地镜像管理

### docker images

列出本地所有的镜像

语法： `docker images [OPTIONS] [REPOSITORY[:TAG]]`

#### options 说明

- -a, --all 列出本地所有的镜像（含中间镜像层，默认情况下，过滤掉中间映像层）
- --digests 显示镜像的摘要信息
- -f, --filter filter 显示满足条件（filter）的镜像
- --format string 使用模板格式化输出
- --no-trunc 显示完整的镜像信息
- -q, --quiet 只显示镜像 ID

```
docker images

REPOSITORY            TAG                 IMAGE ID            CREATED           SIZE
hello-world           latest              bf756fb1ae65        4 months ago     13.3kB
mysql                 5.7                 b84d68d0a7db        6 days ago       448MB

# 解释
#REPOSITORY            # 镜像的仓库源
#TAG                # 镜像的标签(版本)        ---lastest 表示最新版本
#IMAGE ID            # 镜像的id
#CREATED            # 镜像的创建时间
#SIZE                # 镜像的大小
```

```bash
# 指定镜像名
docker images hello-world

# 指定镜像名和 tag
docker images hello-world:latest
```

### docker rmi

删除一个或多个镜像

语法格式：`docker rmi [OPTIONS] IMAGE [IMAGE...]`

#### options 说明

- -f 强制删除
- --no-prune 不移除该镜像的过程镜像，默认移除

```bash
# 删除镜像，且不带 tag
docker rmi hello-world

# 删除镜像，且带 tag
docker rmi -f tomcat:latest

# 根据镜像 id 删除镜像
docker rmi -f fd484f19954f

# 删除所有镜像
docker rmi -f $(docker images -aq)

# 删除多个镜像
docker rmi -f tomcat mysql
```

### docker tag

给本地镜像打一个标记（tag），可将其归入某一仓库，有点像 Git 里面给不同时段写的代码打不同的 tag 一样

语法格式：`docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]`

```bash
# 打了新的 TAG 虽然会多了一条记录，但是从 IMAGE ID 可以得知他们是同一个镜像，类比：在 git 中，同一个代码项目，可以有多个不同的 tag
docker tag abc/poloyy:latest abc/poloyy:new

# 也能更改镜像的名字
docker tag abc/poloyy:new efd/poloyy:new2
```

### docker import

从 tar 归档文件中创建镜像

语法格式：`docker import [OPTIONS] file|URL|- [REPOSITORY[:TAG]]`

ptions 说明

- -m 提交时的说明文字
- -c 将 Dockerfile 指令应用于创建的映像

```bash
docker import test.tar poloyy/tomcat
```

## 容器操作

### docker create

创建一个新的容器但不启动它。

这类似于 docker run -d，但容器从未启动过。 然后，您可以使用 `docker start <container_id>` 命令在任何位置启动容器。

语法格式：`docker create [OPTIONS] IMAGE [COMMAND] [ARG...]`

#### options 说明

- --name 指定容器的名字

`docker create --name tomcat7 tomcat:7`

- -e 或 --env 设置环境变量

`docker create -e "MY_VAR=value" ubuntu:latest`

- -v 或 --volume 挂载卷

`docker create -v /host/path:/container/path ubuntu:latest`

- -p 或 --publish 指定端口映射

`docker create -p 8080:80 ubuntu:latest`

- --restart 设置重启策略

`docker create --restart always ubuntu:latest`

- --network 指定网络

`docker create --network my_network ubuntu:latest`

- --cpus 和 --memory 指定 CPU 和内存限制

`docker create --cpus="1.5" --memory="512m" ubuntu:latest`

- -w 或 --workdir 设置容器工作目录

`docker create -w /app ubuntu:latest`

- 指定运行的命令：如果你想指定容器启动时的默认命令，可以直接在命令的末尾添加。

`docker create ubuntu:latest echo "Hello World"`

### docker start/stop/restart

- docker start：启动一个或多个已经被停止的容器
- docker stop：停止一个或多个运行中的容器
- docker restart：重启一个或多个容器

#### 语法

```
docker start [OPTIONS] CONTAINER [CONTAINER...]
docker stop [OPTIONS] CONTAINER [CONTAINER...]
docker restart [OPTIONS] CONTAINER [CONTAINER...]
```

#### stop/restart 命令的 options

- -t, --time 杀死容器之前等待停止的秒数（默认为 10）

#### 示例

假设有一个容器 name 是 tomcat3 ，id 是 7759aec97ebf

```bash
#根据容器 ID 启动、关闭、重启
docker start 59aec7797ebf
docker stop 59aec7797ebf
docker restart 59aec7797ebf

#根据容器名字启动、关闭、重启
docker start myTomcat3
docker stop myTomcat3
docker restart myTomcat3
```

启动、关闭、重启所有容器

```bash
docker start $(docker ps -a -q)

docker stop $(docker ps -a -q)

docker restart $(docker ps -a -q)
```

### docker ps 列出容器

```
docker ps [OPTIONS]
```

#### options 说明

- -a, --all 显示全部容器（默认只显示运行中的容器）
- -f, --filter filter 根据提供的 filter 过滤输出
- -n, --last int 列出最近创建的 n 个容器（默认-1，代表全部）
- -l, --latest 显示最近创建的容器（包括所有状态的容器）
- -s, --size 显示总的文件大小
- --no-trunc 显示完整的镜像 ID
- -q, --quiet 静默模式，只显示容器 ID

#### 实际例子

```bash
# 不带options
docker ps

# 显示全部容器，和总文件大小
docker ps -a -s

# 显示最近创建的容器
docker ps -l
docker ps -a -l

# 显示最近创建的 2 个容器
docker ps -n 2

# 显示完整的镜像ID
docker ps --no-trunc

# 只显示镜像ID
docker ps -q
```

#### 列表字段介绍

- CONTAINER ID：容器 ID
- IMAGE：使用的镜像
- COMMAND：启动容器时后，容器运行的命令
- CREATED：容器的创建时间
- STATUS：容器状态
- PORTS：实际运行端口，若有指定运行端口则会显示指定的端口和默认运行端口，以及连接类型（ tcp / udp ）
- NAMES：容器名字
- SIZE：容器全部文件的总大小，也会显示容器大小

#### 容器状态介绍

- created：已创建
- restarting：重启中
- running：运行中
- removing：迁移中
- paused：暂停
- exited：停止
- dead：死亡

### docker run

创建一个新的容器并运行一个命令

语法格式：`docker run [OPTIONS] IMAGE [COMMAND] [ARG...]`

COMMAND ：需要在容器内执行的命令

其实跟 docker create 一样的语法格式和几乎一样的参数，只不过可以运行容器甚至进入容器内部。因为它在后台会先调用 docker create，然后再执行 docker start

#### docker run 执行流程

- 首先在指定镜像上创建一个可写的容器层（docker create）
- 然后使用指定的命令（COMMAND）启动它（docker start）
- docker run 相当于执行了两个 API：/containers/create、/containers/(id)/start

```bash
#根据 tag 7 的 tomcat 镜像，创建一个 tomcat7 容器
docker create --name tomcat7 tomcat:7
```

#### options 说明

- -i 以交互模式运行容器，通常与 -t 同时使用
- -t 启动容器后，为容器分配一个伪输入终端（pseudo-TTY），通常与 -i 同时使用
- -v，--volume 目录映射，容器目录挂载到宿主机目录，格式： <host 目录>:<容器目录>
- -d 或 --detach 守护进程，后台运行该容器
- -p 指定端口映射，格式：主机(宿主)端口:容器端口
- -P 随机端口映射，容器内部端口随机映射到主机的端口
- -u 以什么用户身份创建容器
- --name "nginx-lb" 容器名字
- -m, --memory bytes 设置容器使用内存最大值
- -h, --hostname string 指定容器的 host name
- --dns 8.8.8.8 指定容器 dns 服务器
- -e username="ritchie" 设置环境变量
- --restart Docker 重启后，容器是否自动重启
- --privileged 容器内是否使用真正的 root 权限

```bash
# 使用镜像 tomcat:7，容器命名为 tomcat7
docker run --name tomcat7 tomcat:7

# 使用镜像 tomcat:7，容器命名为 tomcat7，在后台运行
docker run -d --name tomcat7 tomcat:7

# 使用镜像 tomcat:7，容器命名为 tomcat7，在后台运行，将容器的 8080 端口映射到主机的随机端口
docker run -d -P --name tomcat7 tomcat:7

# 使用镜像 tomcat:7，容器命名为 tomcat7，在后台运行，将容器的 8080 端口映射到主机的 8081 端口
docker run -d -p 8081:8080 --name tomcat7 tomcat:7

# 使用镜像 tomcat:7，容器命名为 tomcat7，在后台运行，将容器的 8080 端口映射到主机的 8081 端口，主机的目录 /usr/local/tomcat/webapps 映射到容器的 /usr/local/tomcat/webapps
docker run -d -p 8081:8080 -i --name tomcat7 -v /usr/local/tomcat/webapps:/usr/local/tomcat/webapps tomcat:7

# 使用镜像 tomcat:7，容器命名为 tomcat7，在后台运行，将容器的 8080 端口映射到主机的 11.20.72.43:8888 端口，主机的目录 usr/local/webapps 映射到容器的 usr/local/webapps，启动容器后，在容器内执行 bash 命令
docker run -d -p 111.20.72.43:8888:8080 -v /usr/local/webapps:/usr/local/webapps -it --name tomcat77 tomcat:7 bash
# 注意：这里不加 -it 的话，容器是无法再启动的，加上才能启动容器并执行 bash 命令

# 容器 8080 端口映射到主机的 1111 端口，-it 以交互模式启动一个容器，在容器内执行 bash 命令
docker run -it -p 1111:8080 tomcat:7 bash
# 注意：如果这里加了 -d  参数，则不会进入容器的 CLI 界面；如果不加 bash 命令，则会执行 tomcat 容器本身自动会执行的命令（ catalina.sh run ），也会进不了 CLI 界面，因为会打印一堆运行日志

# 以 root 权限创建容器，当进入容器之后，拥有 root 权限去执行命令
docker run -d --name jenkin2 --privileged=true jenkins/jenkins
# 虽然是拥有了 root 权限，但并不一定是 root 用户身份，所以最好加 -uroot 指定 root 用户身份

# 该容器在 Docker 重启后会自动启动无需手动启动
docker run -d --name jenkins2 --restart always jenkins/jenkins

# 退出容器
exit         #容器直接退出
ctrl P + ctrl Q  #容器不停止退出     ---注意：这个很有用的操作
```

### docker exec

在正在运行的容器中运行命令

语法格式：`docker exec [OPTIONS] CONTAINER COMMAND [ARG...]`

#### options 说明

- -d 在后台运行命令
- -i 即使没有附加也保持 STDIN 打开，和 -t 配合
- -t 进入容器的 CLI 模式
- -e 设置环境变量
- --env-file 读入环境变量文件
- -w 需要执行命令的目录
- -u 指定访问容器的用户名

```bash
# 执行 tomcat 容器的 startup.sh 脚本
docker exec -it tomcat7 startup.sh

# 进入容器的 CLI 模式（最常用）
docker exec -it tomcat7 bash

# 执行普通命令
docker exec -it tomcat7 pwd

# 指定工作目录执行命令
docker exec -it -w /usr tomcat7 pwd

# 以 root 用户身份进入容器（重点），好处就是，你在容器里敲命令就是 root 权限的，不存在权限不足的问题
docker exec -it -u root jenkins1 bash
```

### docker attach

进入容器正在执行的终端。和 docker exec 的区别是：

- docker exec 进入当前容器后开启一个新的终端，可以在里面操作。（常用）
- docker attach 进入容器正在执行某个命令的终端，不能在里面操作

```bash
docker run -d --name topdemo ubuntu /usr/bin/top -b
docker attach topdemo
```

### docker pause/unpause

- docker pause：暂停一个或多个容器中的所有进程
- docker unpause：恢复一个或多个容器中的所有进程

```bash
# 暂停 tomcat 容器的服务
docker pause tomcat7

# 恢复 tomcat 容器的服务
docker unpause tomcat7
```

### docker kill

杀死一个或多个正在运行的容器

#### 重点

- docker kill 子命令可杀死一个或多个容器
- 向容器内部的主进程发送 SIGKILL 信号（默认），或使用 --signal 选项指定的信号

#### options 说明

- -s 发送什么信号到容器，默认 KILL

```bash
# 根据容器名字杀掉容器
docker kill tomcat7

# 根据容器ID杀掉容器
docker kill 65d4a94f7a39
```

### docker rm

删除一个或多个容器

#### options 说明

- -f 通过 SIGKILL 信号删除一个正在运行的容器
- -l 移除容器间的网络，而非容器本身
- -v 删除与容器映射的目录

#### 示例

```bash
# 强制删除容器
docker rm -f tomcat7

# 删除所有已停止的容器
docker rm $(docker ps -aq --filter "status=exited")

# 删除所有的容器
docker rm -f $(docker ps -aq)       #删除所有的容器
docker ps -a -q|xargs docker rm     #删除所有的容器
```

### docker top

显示容器正在运行的进程

```bash
# 列出所有运行的进程
docker top nginx

# 列出指定名称的正在运行的进程
docker top nginx | grep redis
```

### docker logs

提取容器的日志

#### options 说明

- --details 显示提供给日志的其他详细信息
- -f, --follow 跟踪日志输出
- --tail 仅列出最新 N 条容器日志
- -t, --timestamps 显示时间戳-

```bash
# 给日志加时间戳
docker logs -t nginx1

# 打印最新 5 条日志
docker logs --tail 5 nginx1

# 跟踪打印日志，日志刷新时，就能实时看到最新的日志了
docker logs -f nginx1
```

### docker port

列出指定的容器的端口映射

语法格式: `docker port CONTAINER [PRIVATE_PORT[/PROTO]]`

- PRIVATE_PORT 指定查询的端口
- PROTO 协议类型（tcp、udp）

```bash
# 列出容器所有端口的映射
 docker port gitlab

# 列出容器指定端口的映射
docker port gitlab 80

# 列出容器指定端口和协议的映射
docker port gitlab 80/tcp
```

### docker export

将容器的文件系统导出为 tar 文件

语法规则： `docker export [OPTIONS] CONTAINER`

#### options 说明

-o 将输入内容写到文件

```bash
docker export -o test.tar jenkins1
```

### docker cp

在容器和主机之间复制文件/文件夹

语法格式

```
docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH|-
docker cp [OPTIONS] SRC_PATH|- CONTAINER:DEST_PATH
```

#### 重点

- 容器 container 可以是正在运行或已停止的容器
- SRC_PATH 或 DEST_PATH 可以是文件或目录
- 该命令会假定容器路径相对于容器的 /（根）目录
- 而主机路径则是相对于执行 docker cp 命令的当前目录-

#### SRC_PATH 和 DEST_PATH 的讲解

SRC_PATH 指定一个文件

- 若 DEST_PATH 不存在
- 创建 DEST_PATH 所需的文件夹，文件正常保存到 DEST_PATH 中

- 若 DEST_PATH 不存在，并以 / 结尾
- 错误：目标目录必须存在

- 若 DEST_PATH 存在并且是一个文件
- 目标被源文件的内容覆盖

- 若 DEST_PATH 存在并且是目录
- 使用 SRC_PATH 中的基本名称将文件复制到此目录中

SRC_PATH 指定目录

- 若 DEST_PATH 不存在
- 将 DEST_PATH 创建为目录，并将源目录的内容复制到该目录中

- 若 DEST_PATH 存在并且是一个文件
- 错误：无法将目录复制到文件

- 若 DEST_PATH 存在并且是目录
- SRC_PATH 不以 /. 结尾，源目录复制到此目录
- SRC_PATH 以 /. 结尾，源目录的内容被复制到该目录中

#### 从容器复制文件到主机

```bash
# 主机已存在的目录
docker cp tomcat7:usr/local/tomcat/README.md ./

# 不存在的目录
docker cp tomcat7:usr/local/tomcat/README.md test/ # 会报错

# 已存在的文件
docker cp tomcat7:usr/local/tomcat/README.md test.txt # 被覆盖
```

#### 从主机复制文件到容器

```bash
docker cp test.txt tomcat7:/
```

#### 从主机复制目录到容器

```bash
# 目标目录不存在
docker cp test tomcat7:test/
```

#### 从容器复制目录到主机

```bash
docker cp tomcat7:/usr/local/tomcat/webapps.list /usr/local/
```

### docker diff

检查容器文件系统上文件或目录的更改情况

#### 结果字段说明

- A 添加了文件或目录
- D 删除了文件或目录
- C 修改了文件或目录

```bash
# 根据容器名字
docker diff gitlab

# 根据容器 ID
docker diff 78b4a7917f0d
```

### docker commit

用于将一个运行中的容器的当前状态保存为一个新的 Docker **镜像**。这在你想要基于现有容器创建新的镜像时非常有用，尤其是当你在容器中进行了手动更改而想要保存这些更改时。

语法格式：`docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]`

#### options 说明

- -a 提交镜像的作者
- -c，--change 更改 Dockerfile 指令来创建镜像
- -m 提交时的说明文字
- -p commit 时，将容器暂停

```bash
# 不带参数的例子
docker commit jenkins1 jenkins/poloyy

# 带参数的例子
docker commit -a fangxu -m "test" jenkins1 jenkins/poloyy
```

## 资料

- [Docker 命令大全](https://www.cnblogs.com/poloyy/p/13922325.html)
