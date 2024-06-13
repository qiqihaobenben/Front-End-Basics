# dockerfile 详解

## 什么是 dockerfile?

- Dockerfile 是 Docker 中用于定义镜像自动化构建流程的配置文件，Docker 通过读取 Dockerfile 中的指令自动生成镜像。
- 在 Dockerfile 中，包含了构建镜像过程中需要执行的命令和其他操作

### docker build

`docker build` 命令用于从 Dockerfile 构建 Docker 镜像。它提供了许多参数来控制构建过程。这些参数允许指定上下文、给镜像打标签、设定构建的选项等。

#### 常用参数

1. **`-t, --tag`**: 为构建的镜像命名并打标签。

   - 格式：`<name>:<tag>`，其中 `<tag>` 默认为 `latest`。
   - 示例：`docker build -t myapp:1.0 .`

2. **`-f, --file`**: 指定 Dockerfile 的路径。

   - 示例：`docker build -f Dockerfile.dev .`

3. **`--build-arg`**: 传递构建时的变量，这些变量在 Dockerfile 中可以通过 `ARG` 指令引用。

   - 示例：`docker build --build-arg VERSION=1.0 .`

4. **`--no-cache`**: 不使用缓存来构建镜像，强制每一层都重新构建。

   - 示例：`docker build --no-cache -t myapp:1.0 .`

5. **`--rm`**: 构建成功后移除中间容器。默认是启用的，但可以使用 `--rm=false` 禁用。

   - 示例：`docker build --rm -t myapp:1.0 .`

6. **`--pull`**: 总是尝试从注册表拉取最新版本的基础镜像。

   - 示例：`docker build --pull -t myapp:1.0 .`

7. **`--target`**: 设置多阶段构建的目标构建阶段。

   - 示例：`docker build --target build-env -t myapp:build .`

8. **`-q, --quiet`**: 安静模式，只输出镜像 ID。

   - 示例：`docker build -q -t myapp:1.0 .`

9. **`-m, --memory`**: 设置构建过程中的内存限制。

   - 示例：`docker build -m 2g -t myapp:1.0 .`

10. **`--platform`**: 指定构建镜像的平台。

    - 示例：`docker build --platform linux/amd64 -t myapp:1.0 .`

11. **`--network`**: 设置构建过程使用的网络模式。

    - 示例：`docker build --network host -t myapp:1.0 .`

12. **`--build-context`**: 指定额外的构建上下文，用于 `COPY --from=<context>` 语法。

    - 示例：`docker build --build-context base=dir:/path/to/context -t myapp:1.0 .`

13. **`--secret`**: 传递构建时的机密信息，比如 SSH 密钥。
    - 示例：`docker build --secret id=mysecret,src=/path/to/secret .`

#### 基本示例

```bash
# 构建 Docker 镜像，使用当前目录作为上下文，默认名称为 "latest"
docker build -t myapp .

# 使用指定的 Dockerfile 构建镜像
docker build -t myapp:2.0 -f Dockerfile.production .

# 构建镜像并传递构建参数
docker build --build-arg VERSION=2.0 -t myapp:2.0 .

# 构建时不使用缓存
docker build --no-cache -t myapp:2.0 .

# 构建指定阶段的镜像
docker build --target build-env -t myapp:build .

# 指定构建平台
docker build --platform linux/amd64 -t myapp:1.0 .
```

#### 多阶段构建示例

```dockerfile
# 构建阶段
FROM golang:1.18 AS build-env
WORKDIR /app
COPY . .
RUN go build -o myapp

# 运行阶段
FROM alpine:latest
WORKDIR /app
COPY --from=build-env /app/myapp /app/
CMD ["./myapp"]
```

对应的构建命令：

```bash
# 构建最终的镜像（运行阶段）
docker build -t myapp:final .

# 构建中间阶段的镜像（仅构建阶段）
docker build --target build-env -t myapp:build .
```

#### 注意事项

1. **缓存问题**: Docker 在构建时会缓存每一层，如果不希望使用缓存，可以使用 `--no-cache` 参数。但要小心，因为重新构建每一层可能会大大增加构建时间。

2. **Dockerfile 最佳实践**:

   - 尽量减少镜像层数，合并类似的命令（如多个 `RUN` 指令）。
   - 使用多阶段构建来减小最终镜像的大小。
   - 定期更新基础镜像以获得最新的安全修复。

3. **命名与标记**: 尽量为镜像添加有意义的标签（`<tag>`），便于版本管理和部署。

4. **构建上下文**: Docker 会将指定目录（上下文，默认为 `.` 当前目录）中的所有内容发送到 Docker 守护进程，这可能包括不需要的文件。使用 `.dockerignore` 文件来排除不必要的文件。

5. **安全性**: 在构建时传递机密信息（如密码、密钥）要特别小心，可以使用 `--secret` 或 `--build-arg` 来处理，但最好是避免在 Dockerfile 中直接包含这些信息。

#### docker build 原理示例

[查看文章中间镜像的构建过程](https://www.cnblogs.com/poloyy/p/15451933.html)

### 使用 Dockerfile 构建镜像的步骤

- 编写一个 dockerfile 文件
- docker build 构建成为一个镜像
- docker run 运行镜像
- docker push 发布镜像（DockerHub 、阿里云仓库）

### Dockerfile 规范

- 每个保留关键字（指令）都是必须是大写字母
- 执行从上到下顺序
- #表示注释
- 每一个指令都会创建提交一个新的镜像层，并提交

### 为什么要用 Dockerfile

- Dockerfile 是面向开发的，以后要发布项目，做镜像，就需要编写 dockerfile 文件
- DockerFile 构建镜像文件，定义了一切的步骤，源代码
- Dockerfile 的体积小，容易进行快速迁移部署
- 环境构建流程记录在 Dockerfile 中，能够直观的看到镜像构建的顺序和逻辑-

## Dockerfile 的基本结构

Dockerfile 一般分为四部分：基础镜像信息、维护者信息、镜像操作指令和容器启动时执行指令，`#`为 Dockerfile 中的注释。

## Dockerfile 文件说明

Docker 从上到下运行 Dockerfile 的指令。为了指定基本映像，**第一条指令必须是 FROM**。一个声明以＃字符开头则被视为注释。可以在 Docker 文件中使用 RUN，CMD，FROM，EXPOSE，ENV 等指令。

## 常用的指令

### **FROM：** 指明当前的镜像基于哪个镜像构建，必须为第一个命令

```
格式：
FROM [--platform=<platform>] <image> [AS <name>]
FROM [--platform=<platform>] <image>[:<tag>] [AS <name>]
FROM [--platform=<platform>] <image>[@<digest>] [AS <name>]
示例：
FROM mysql:5.6
注：
tag或digest是可选的，如果不使用这两个值时，会使用latest版本的基础镜像
```

**dockerfile 必须以 FROM 开头，不过 ARG 命令可以在 FROM 前面**

#### 一个 dockerfile 可以有多个 FROM

- 可以有多个 FROM 来创建多个镜像，或区分构建阶段，将一个构建阶段作为另一个构建阶段的依赖项
- AS <name> 就是命名当前构建阶段
- 在后续构建阶段，可以给 FROM、COPY 指令用上，通过 --from=<name> 引用前面构建的镜像

```bash
# 第一构建阶段:将仅用于生成 requirements.txt 文件
FROM tiangolo/uvicorn-gunicorn:python3.9 as requirements-stage

# 将当前工作目录设置为 /tmp
WORKDIR /tmp

# 生成 requirements.txt
RUN touch requirements.txt

# 第二构建阶段，在这往后的任何内容都将保留在最终容器映像中
FROM python:3.9

# 将当前工作目录设置为 /code
WORKDIR /code

# 复制 requirements.txt;这个文件只存在于前一个 Docker 阶段，这就是使用 --from-requirements-stage 复制它的原因
COPY --from=requirements-stage /tmp/requirements.txt /code/requirements.txt

# 运行命令
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# 复制
COPY ./app /code/app
```

#### ARG 和 FROM 交互

FROM 指令支持由出现在第一个 FROM 之前的任何 ARG 指令声明的变量

```
ARG  CODE_VERSION=latest
FROM base:${CODE_VERSION}
CMD  /code/run-app

FROM extras:${CODE_VERSION}
CMD  /code/run-extras
```

注意:

- 在 FROM 之前声明的 ARG 在构建阶段之外，因此不能在 FROM 之后的任何指令中使用
- 要使用在第一个 FROM 之前声明的 ARG 的默认值，要在构建阶段内声明一次没有值的 ARG 指令

```
ARG VERSION=latest
FROM busybox:$VERSION
ARG VERSION
RUN echo $VERSION > image_version
```

### **MAINTAINER：** 维护者信息（已弃用）

```
格式：
MAINTAINER <name>
示例：
MAINTAINER Jasper Xu
MAINTAINER sorex@163.com
MAINTAINER Jasper Xu <sorex@163.com>
```

### **USER：** 指定运行容器时的用户名或 UID，后续的 RUN 也会使用指定用户

- 使用 USER 指定用户时，可以使用用户名、UID 或 GID，或是两者的组合
- 使用 USER 指定用户后，Dockerfile 中后续的命令 RUN、CMD、ENTRYPOINT 都将使用该用户

```
格式：
USER user
USER user:group
USER uid
USER uid:gid
USER user:gid
USER uid:group

示例：
USER www
```

#### 也可以使用 docker run -u 指定用户

- 替代默认设置的用户
- 可以使用 uid 来指定用户

`docker run -i -t -u 1001 busybox sh`

### **ARG：** 定义创建镜像过程中使用的变量

```
格式：
ARG <name> [=<default value>]

示例：
ARG site
ARG build_user=www
```

#### ARG 详解

- 在执行 docker build 时，可以通过 --build-arg <参数名>=<值> 来为声明的变量赋值
- 当镜像编译成功后，ARG 指定的变量将不再存在（ENV 指定的变量将在镜像中保留）
- Docker 内置了一些镜像创建变量，用户可以直接使用而无须声明，包括（不区分大小写）HTTP_PROXY、HTTPS_PROXY、FTP_PROXY、NO_PROXY
- 不要通过 ARG 保存密码之类的信息，因为 docker history 还是可以看到所有值的

#### ARG 指令有生效范围

##### 如果在 FROM 指令之前指定，那么只能用于 FROM 指令中

```bash
ARG DOCKER_USERNAME=library

FROM ${DOCKER_USERNAME}/alpine

RUN set -x ; echo ${DOCKER_USERNAME} # 无法输出 ${DOCKER_USERNAME} 变量的值
```

使用上述 Dockerfile 会发现无法输出 ${DOCKER_USERNAME} 变量的值，要想正常输出，必须在 FROM 之后再次指定 ARG

```Dockerfile
# 只在 FROM 中生效
ARG DOCKER_USERNAME=library

FROM ${DOCKER_USERNAME}/alpine

# 要想在 FROM 之后使用，必须再次指定
ARG DOCKER_USERNAME=library

RUN set -x ; echo ${DOCKER_USERNAME}
```

##### 多阶段构建的时候，ARG 定义的变量，每个 FROM 都能用

```Dockerfile
# 这个变量在每个 FROM 中都生效
ARG DOCKER_USERNAME=library

FROM ${DOCKER_USERNAME}/alpine

RUN set -x ; echo 1

FROM ${DOCKER_USERNAME}/alpine

RUN set -x ; echo 2
```

### **ENV：** 设置环境变量

```
两种格式
ENV<key><value> #<key>之后的所有内容均被视为其<value>组成部分，因此，一次只能设置一个变量

ENV <key>=<value>...#可以设置多个变量，每个变量为一个<key>=<value>键值对，，如果<key>中包含空格，可以使用\来进行转义，也可以通过""来进行标示；另外，反斜线也可以用于续行

示例：
ENV myName John Doe
ENV myCat=fluffy
```

#### 使用环境变量

##### 通过 ENV 指令可以声明环境变量，可以在以下指令中使用环境变量

```
ADD
COPY
ENV
EXPOSE
FROM
LABEL
STOPSIGNAL
USER
VOLUME
WORKDIR
ONBUILD
```

##### 使用环境变量的方式有两种

```
$variable_name
${variable_name}
```

${variable_name} 语法还支持以下指定的一些标准 bash 修饰符：

- ${variable:-word}：表示如果设置了 variable，那么结果就是那个值；如果未设置变量，则结果将是 word
- ${variable:+word}：表示如果设置了 variable，则结果为 word，否则为空字符串
- 在所有情况下， word 可以是任何字符串，包括额外的环境变量

#### ARG 和 ENV 的区别

- ARG 定义的变量只会存在于镜像构建过程，启动容器后并不保留这些变量
- ENV 定义的变量在启动容器后仍然保留

#### 注意

- 当容器从生成的镜像运行时，使用 ENV 设置的环境变量将持续存在
- 可以使用 docker inspect 查看值，并使用 docker run --env <key>=<value> 更改它们

### **LABEL：** 用户为镜像添加元数据

可以为生成的镜像添加元数据标签信息，这些信息可以用来辅助过滤出特定镜像

```
格式：
LABEL <key>=<value> <key>=<value>...

示例：
LABEL version="1.0" description="这是一个web服务器"
```

```dockerfile
# key 加了双引号 "
LABEL "com.example.vendor"="ACME Incorporated"

# key 没有双引号 "
LABEL com.example.label-with-value="foo"
LABEL version="1.0"

# 换行
LABEL description="This text illustrates \
that label-values can span multiple lines."

# 一行添加多个 key=value
LABEL multi.label1="value1" multi.label2="value2" other="value3"
# 等价写法
LABEL multi.label1="value1" \
      multi.label2="value2" \
      other="value3"
```

注:使用 LABEL 指定元数据时，一条 LABEL 可以指定一条或多条元数据，指定多条元数据时，不同元数据直接通过空格分割。推荐将所有的元数据通过一条 LABEL 指令指定，以免生成过多的中间镜像

#### 通过 docker inspect 查看添加的元数据

```bash
docker image inspect --format='' myimage
{
  "com.example.vendor": "ACME Incorporated",
  "com.example.label-with-value": "foo",
  "version": "1.0",
  "description": "This text illustrates that label-values can span multiple lines.",
  "multi.label1": "value1",
  "multi.label2": "value2",
  "other": "value3"
}
```

### **EXPOSE：** 通知 Docker 容器在运行时监听指定的网络端口

```
格式：
EXPOSE <port>[<port>...]
EXPOSE 端口号
EXPOSE 端口号/协议

示例：
EXPOSE 80 443
EXPOSE 8080
EXPOSE 11211/tcp 11211/udp
```

#### EXPOSE 原理

- EXPOSE 并不会让容器的端口访问到主机，要使其可访问，需要在 docker run 运行时通过 -p 来映射这些端口，或通过 -P 参数来自动映射 EXPOSE 导出的所有端口
- 个人理解：EXPOSE 暴露的端口更像是指明了该容器提供的服务需要用到的端口
- EXPOSE 并不会直接将端口自动和宿主机某个端口建立映射关系
- 如果 docker run，指定了自动映射 -P，那么会将所有暴露的端口随机映射到宿主机的高阶端口（比较大的端口号）
- 如果 docker run，指定了 --net=host 宿主机网络模式，容器中 EXPOSE 指令暴露的端口会直接使用宿主机对应的端口，不存在映射关系
- 如果 EXPOSE 暴露的端口确定要和某个宿主机端口建立映射关系，还是要用到 docker run -p 参数
- EXPOSE 显式地标明镜像开放端口，一定程度上提供了操作的便利，也提高了 Dockerfile 的可读性和可维护性

### **WORDDIR：** 工作目录，类似于 cd 命令

- 切换到镜像中的指定路径，设置工作目录
- 为了避免出错，推荐 WORKDIR 指令中只使用绝对路径，如果镜像中对应的路径不存在，会自动创建此目录
- 一般用 WORKDIR 来替代 RUN cd <path> && <do something> 切换目录进行操作的指令
- 通过 WORKDIR 设置工作目录后，Dockerfile 中其后的命令 RUN、CMD、ENTRYPOINT、ADD、COPY 等命令都会在该目录下执行。
- 在使用 docker run 运行容器时，可以通过-w 参数覆盖构建时所设置的工作目录
- 如果不指定 WORKDIR 指令，默认情况下容器启动时的工作目录是 /（根目录）。

```
格式：
WORKDIR /path/to/workdir

示例：
WORKDIR /a (这时工作目录为a)
WORKDIR b  (这时工作目录为/a/b)
```

```dockerfile
# 将宿主机的 test.txt 文件复制到 镜像的 /tmp/test.txt
WORKDIR /tmp
COPY test.txt .

# WORKDIR 指令可以在 Dockerfile 中多次使用，如果提供了相对路径，它将相对于前一个 WORKDIR 指令的路径
WORKDIR /a
WORKDIR b
WORKDIR c
RUN pwd
# pwd 的输出将会是 /a/b/c
```

### **ADD：** 将本地文件添加到容器中

tar 类型文件会自动解压(网络压缩资源不会被解压),可以访问网络资源，类似 wget

```
格式：
ADD <src> ... <dest>
ADD ["<src>",... "<dest>"] 用于支持包含空格的路径
示例：
ADD hom* /mydir/	#添加所有已"hom"开头的文件
ADD hom?.txt /mydir/      # ? 替代一个单字符,例如："home.txt"
ADD test relativeDir/     # 添加 "test" 到 `WORKDIR`/relativeDir/
ADD test /absoluteDir/    # 添加 "test" 到 /absoluteDir/
```

### **COPY：** 复制内容到镜像

功能类似 ADD，但是不会自动解压文件，也不能访问网络资源

- 格式： `COPY [--chown=<user>:<group>] <src>... <dest>`
  - `--chown=<user>:<group>` : 可选参数，用于设置复制后文件的所有者（用户和组）。例如，--chown=user:group。
- 复制本地主机的 `<src>`下内容到镜像中的 `<dest>`，目标路径不存在时，会自动创建。
  - `<src>`：是相对于构建上下文的路径，不能使用相对于 Dockerfile 的相对路径（因为 Dockerfile 可能不在上下文中）
  - `<dest>`：可以是镜像内绝对路径，或者相对于工作目录（WORKDIR）的相对路径
- 路径：支持正则表达式， `COPY test* /tmp`

#### COPY 作用详解

- COPY 指令从 `<src>` 复制文件、目录或远程文件 URL，并将它们添加到路径 `<dest>`
- 可以指定多个 `<src>` 资源，但如果它们是文件或目录，则它们的路径被解析为相对于构建上下文的路径
- 每个 `<src>` 可能包含通配符，匹配将使用 Go 的 filepath.Match 规则完成

#### 示例

```dockerfile
# * 通配符，把所有 hom 开头的文件复制到镜像文件系统的 /mydir/ 目录下
COPY hom* /mydir/

# ? 匹配 0 或 1 个字符，比如会把 home.txt 文件复制到 /mydir/ 目录下
COPY hom?.txt /mydir/

# 使用相对路径的栗子
COPY test.txt relativeDir/
# 等价于
COPY test.txt <WORKDIR>/relativeDir/

# 使用绝对路径，将 test.txt 添加到 /absoluteDir/ 目录下
COPY test.txt /absoluteDir/
```

#### --from=<name> 示例

将从 from 指定的构建阶段中寻找源文件 `<src>`

```dockerfile
# 第一构建阶段:将仅用于生成 requirements.txt 文件
FROM tiangolo/uvicorn-gunicorn:python3.9 as requirements-stage

# 将当前工作目录设置为 /tmp
WORKDIR /tmp

# 生成 requirements.txt
RUN touch requirements.txt

# 第二构建阶段，在这往后的任何内容都将保留在最终容器映像中
FROM python:3.9

# 将当前工作目录设置为 /code
WORKDIR /code

# 从第一个阶段复制 requirements.txt;这个文件只存在于前一个 Docker 阶段，这就是使用 --from-requirements-stage 复制它的原因
COPY --from=requirements-stage /tmp/requirements.txt /code/requirements.txt

# 运行命令
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
```

#### COPY `<src>` 详解

#### `<src>` 路径必须在构建的上下文中

- COPY 指令只能访问构建上下文中的文件和目录。确保构建上下文包含所需的所有文件。
- 使用 .dockerignore 文件排除不需要的文件，可以减少构建上下文的大小和构建时间。

```dockerfile
# test.txt 是相对路径，相对于构建上下文
COPY test.txt /mkdir/

# 以下错误写法，文件均不在上下文目录中，并不会被找到
# 这个找的就是构建上下文的上级目录的 test.txt
COPY ../test.txt /mkdir/
# 这个找的是本机根目录下的 test.txt
COPY /test.txt /mkdir/

# 不能添加  ../something 、 /something ，因为 docker 构建的第一步是将上下文目录（和子目录）发送到 docker 守护进程
```

##### `<src>` 是目录

- 则复制目录的全部内容，包括文件系统元数据
- 不会复制目录本身，只会复制其内容，并保持目录结构。

```dockerfile
COPY dir /mydir/
```

##### `<src>` 是任何其他类型的文件

- 则将其与其元数据一起单独复制
- `<dest>` 以斜杠 / 结尾，它将被视为一个目录，并且 `<src>` 的内容将写入 `<dest>`/base(`<src>`)

##### 指定了多个 `<src>` 资源，或者由于使用了通配符

则 `<dest>` 必须是一个目录，并且必须以斜杠 / 结尾

```dockerfile
COPY test1.txt test2.txt /mydir/
```

#### COPY `<dest>` 详解

##### `<dest>` 不以斜杠结尾

它将被视为常规文件，并且 `<src>` 的内容将写入 `<dest>`

```dockerfile
COPY test.txt /mytext
```

##### 如果 `<dest>` 是一个已存在的目录，COPY 指令会将 `<src>` 文件或目录复制到 `<dest>` 目录中。

##### `<dest>` 不存在

路径中所有缺失的目录都会自动创建

```dockerfile
COPY test.txt /dir/test/my/
```

#### ADD 和 COPY 的区别和使用场景

- ADD 支持添加远程 url 和自动提取压缩格式的文件，COPY 只允许从本机中复制文件
  - ADD 从远程 url 获取文件和复制的效果并不理想，因为该文件会增加 Docker Image 最终的大小，相反，应该使用 curl huo wget 来获取远程文件，然后在不需要它时进行删除
- COPY 支持从其他构建阶段中复制源文件（--from）
- 根据官方 Dockerfile 最佳实践，除非真的需要从远程 url 添加文件或自动提取压缩文件才用 ADD，其他情况一律使用 COPY

### **VOLUME：** 用户指定持久化目录

用于定义匿名的数据卷（volume）。数据卷是 Docker 中的持久存储解决方案，允许你将数据从容器中分离出来并存储在宿主系统中或 Docker 管理的存储中。这样可以确保数据的持久性，即使容器被删除或重新创建，数据仍然存在。

```
格式：
VOLUME ["/path/to/dir"]

示例:
# 必须时双引号
VOLUME ["/data"]
VALUME ["/var/www", "/var/log/apache2"]
```

```dockerfile
# 使用官方的 nginx 镜像作为基础镜像
FROM nginx:latest

# 定义一个数据卷
VOLUME ["/var/log/nginx"]

# 将本地的 nginx 配置文件复制到容器中
COPY nginx.conf /etc/nginx/nginx.conf
```

在这个例子中，`VOLUME ["/var/log/nginx"]` 指令告诉 Docker 将 `/var/log/nginx` 目录映射到宿主系统的某个存储位置。这意味着：

- 当 Nginx 写入日志到 /var/log/nginx 时，日志实际上存储在宿主系统上。
- 即使删除或重新创建容器，日志数据仍然保持不变。

#### 一个卷可以存在于一个或多个容器的指定目录，改目录可以绕过联合文件系统，并具有以下功能:

1. 可以容器间共享和重用
2. 容器并不一定要和其它容器共享卷
3. 修改卷后会立即生效
4. 对卷的修改不会对镜像产生影响
5. 卷会一直存在，直到没有任何容器在使用它

#### 注意

1. 默认权限:

   - VOLUME 指定的卷在容器中默认具有读写权限。
   - 如果需要只读权限，可以在启动容器时使用 docker run 的 --mount 或 -v 选项进行配置。

2. 匿名卷 vs 命名卷:

   - 使用 VOLUME 创建的是匿名卷，Docker 会自动生成一个随机名称。
   - 如果希望明确控制卷的名称和位置，建议使用 docker run 的 -v 或 --mount 选项手动挂载命名卷。（比如像 docker run -v <主机目录>:<容器目录> 是可以指定主机目录的）

3. 卷的数据管理:

   - 卷的数据不会随着容器的删除而删除。要清理卷数据，需要手动删除。
   - 可以使用 docker volume ls 列出所有卷，docker volume rm 删除特定卷，docker volume prune 删除所有未使用的卷。

4. 卷与 COPY / ADD 的交互:

- 如果 COPY 或 ADD 指令的目标路径是一个 VOLUME 定义的路径，文件会被复制到卷中。
- 但需要注意，**创建卷时，如果路径已经存在数据，卷的内容会覆盖路径上的已有数据。**

5. 卷的挂载位置:

- 在启动容器时，卷的挂载位置可以指定为宿主系统上的绝对路径或 Docker 管理的默认位置。
- 例如：docker run -v /host/data:/container/data 会将宿主系统的 /host/data 目录挂载到容器的 /container/data 目录。

6. 保持数据安全和一致性:

- 在处理敏感数据时，确保卷的权限设置正确，防止未经授权的访问。
- 使用卷时，确保容器中访问和修改卷数据的进程正确处理文件系统的并发和锁定问题，以避免数据一致性问题。

7. 性能问题:

- 在高 I/O 场景下，卷的性能可能成为瓶颈。可以考虑将数据存储在性能更高的存储介质上，比如 SSD。

### **RUN：** 构建镜像时执行的命令

RUN 用于在镜像容器中执行命令，其有以下两种命令执行方式：shell 执行和 exec 执行

```
shell执行
  命令在 shell 中运行
  Linux 上默认为 /bin/sh -c
  Windows 上 cmd /S /C
格式：RUN <command>

exec执行
必须双引号，不能是单引号
格式：RUN ["executable", "param1", "param2"]

示例：
RUN /bin/bash -c 'source $HOME/.bashrc; echo $HOME'
RUN ["/bin/bash", "-c", "echo hello"]
```

注：RUN 指令创建的中间镜像会被缓存，并会在下次构建中使用，如果不想使用这些缓存镜像，可以再构建时指定--no-cache 参数，如：`docker build --no-cache .`

#### RUN 指令的原理

- RUN 指令将在当前镜像上加新的一层，并执行任何命令和提交结果，生成的提交镜像将用于 Dockfile 中的后续步骤
- 分层 RUN 指令和生成提交符合 Docker 核心概念，提交成本低，并且可以通过 docker history 中的任意步骤创建容器，像 git 代码控制一样

### **CMD：** 指定容器默认执行的命令，构建容器后调用，也就是在容器启动时才进行调用

```
格式：
CMD["excutable","param1","param2"](执行可执行文件，优先)
CMD["param1","param2"]（设置了ENTRYPOINT，则直接调用ENTRYPOINT添加参数）
CMD command param1 param2 (执行shell内部命令)

示例：
CMD echo "This is a test."
CMD ["/user/bin/wc", "--help"]
```

#### 注意

- 一个 Dockerfile 只有一个 CMD 指令，若有多个，只有最后一个 CMD 指令生效
- CMD 主要目的：为容器提供默认执行的命令，这个默认值可以包含可执行文件，也可以不包含可执行文件，如果不包含可执行文件，意味着必须指定 ENTRYPOINT 指令（第二种写法）
- exec 模式下不能单独使用环境变量，必须要跟命令一起用

```
# 错误写法，不会使用 HOME 环境变量
CMD [ "echo", "$HOME" ]

# 正确写法，需要将 echo 和使用环境变量放一起
CMD [ "sh", "-c", "echo $HOME" ]
```

#### RUN 和 CMD 的区别

- RUN 可以在构建阶段运行很多个命令，而且每运行一个命令都会单独提交结果
- CMD 在构建阶段不执行任何操作，而是指定镜像默认执行的命令

### **ENTRYPOINT：** 指定镜像的默认入口命令，该入口命令会在启动容器时作为根命令执行

- ENTRYPOINT 指定镜像的默认入口命令，该入口命令会在启动容器时作为根命令执行，所有其他传入值作为该命令的参数
- ENTRYPOINT 的值可以通过 docker run --entrypoint 来覆盖掉
- Dockerfile 中只允许有一个 ENTRYPOINT 命令，多指定时会覆盖前面的设置，而只执行最后的 ENTRYPOINT 指令

```
格式：
ENTRYPOINT ["executable","param1","param2"](可执行文件，优先)
ENTRYPOINT command param1 param2 (shell 内部命令)

示例:
FROM ubuntu
ENTRYPOINT["top","-b"]
CMD['-c']
```

#### CMD 和 ENTRYPOINT 区别

- CMD 指定这个容器启动的时候要运行的命令，不可以追加命令
- ENTRYPOINT 指定这个容器启动的时候要运行的命令，可以追加命令

#### ENTRYPOINT 和 CMD 联合使用

- 当指定了 ENTRYPOINT 后，CMD 的含义就发生了改变，不再是直接的运行其命令，而是将 CMD 的内容作为参数传给 ENTRYPOINT 指令
- 换句话说实际执行时，会变成 `<ENTRYPOINT> "<CMD>"`

#### ENTRYPOINT 应用场景

- 启动容器就是启动主进程，但启动主进程前，可能需要一些准备工作，比如 mysql 可能需要一些数据库配置、初始化的工作，这些工作要在最终的 mysql 服务器运行之前解决
- 还可能希望避免使用 root 用户去启动服务，从而提高安全性，而在启动服务前还需要以 root 身份执行一些必要的准备工作，最后切换到服务用户身份启动服务
- 这些准备工作是和容器 CMD 无关的，无论 CMD 是什么，都需要事先进行一个预处理的工作，这种情况下，可以写一个脚本，然后放入 ENTRYPOINT 中去执行，而这个脚本会将接到的参数（也就是 <CMD>）作为命令，在脚本最后执行

### **ONBUILD：** 用于设置镜像触发器

- ONBUILD 是一个特殊的指令，它后面跟的是其它指令，比如 RUN, COPY 等，而这些指令，在当前镜像构建时并不会被执行
- 只有当以当前镜像为基础镜像，去构建下一级镜像的时候才会被执行
- Dockerfile 中的其它指令都是为了定制当前镜像而准备的，唯有 ONBUILD 是为了帮助别人定制自己而准备的

```
格式：
ONBUILD [INSTRUCTION]

示例：
ONBUILD ADD . /app/src
ONBULD RUN /usr/local/bin/python-build --dir /app/src
```

小例子：

```
# This my first nginx Dockerfile
# Version 1.0

# Base images 基础镜像
FROM centos

#MAINTAINER 维护者信息
MAINTAINER gh

#ENV 设置环境变量
ENV PATH /usr/local/nginx/sbin:$PATH

#ADD  文件放在当前目录下，拷过去会自动解压
ADD nginx-1.8.0.tar.gz /usr/local/
ADD epel-release-latest-7.noarch.rpm /usr/local/

#RUN 执行以下命令
RUN rpm -ivh /usr/local/epel-release-latest-7.noarch.rpm

RUN yum install -y wget lftp gcc gcc-c++ make openssl-devel pcre-devel pcre && yum clean all

RUN useradd -s /sbin/nologin -M www


#WORKDIR 相当于cd
WORKDIR /usr/local/nginx-1.8.0


RUN ./configure --prefix=/usr/local/nginx --user=www --group=www --with-http_ssl_module --with-pcre && make && make install


RUN echo "daemon off;" >> /etc/nginx.conf


#EXPOSE 映射端口
EXPOSE 80


#CMD 运行以下命令
CMD ["nginx"]

```
