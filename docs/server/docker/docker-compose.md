# docker-compose

## docker-compose.yml 配置

`docker-compose` 是一个用于定义和运行多容器 Docker 应用的工具。它使用 YAML 文件来配置应用的服务、网络和卷等。接下来，我将详细介绍 `docker-compose.yml` 文件中的常用配置项，并提供相应的示例。

### 基本配置项

1. **version**: 定义 `docker-compose` 文件的版本。新的 docker-compose 不需要显示指定
2. **services**: 定义应用中所有的服务。
3. **networks**: 定义网络配置。
4. **volumes**: 定义数据卷，用于数据持久化。

### 服务级别的配置项

#### 1. image

指定要使用的 Docker 镜像，可以是官方镜像或自定义镜像。

```yaml
services:
  web:
    image: nginx:latest
```

#### 2. build

定义如何构建 Docker 镜像。可以指定构建上下文和 Dockerfile 的路径。

```yaml
services:
  web:
    build:
      context: ./app
      dockerfile: Dockerfile
```

#### 3. container_name

为容器指定一个自定义名称。

指定容器名称，但是指定后不能够横向扩展，往往不会用到

```yaml
services:
  web:
    container_name: my_nginx
```

#### 4. ports

定义主机与容器之间的端口映射。

在 trafik 代理下往往不需要指定。

```yaml
services:
  web:
    ports:
      - '8080:80'
```

#### 5. environment

设置环境变量。

```yaml
services:
  web:
    environment:
      - NODE_ENV=production
      - API_KEY=abcdef
```

#### 6. volumes

定义数据卷的挂载。

```yaml
services:
  web:
    volumes:
      - ./data:/var/www/html
```

#### 7. networks

指定服务所属的网络。

```yaml
services:
  web:
    networks:
      - frontend
```

#### 8. depends_on

定义服务之间的依赖关系，确保某些服务在其他服务启动之前启动。

```yaml
services:
  web:
    depends_on:
      - db
```

#### 9. restart

设置容器的重启策略（no, on-failure, always, unless-stopped）。

```yaml
services:
  web:
    restart: always
```

#### 10. command

覆盖镜像的默认命令。

```yaml
services:
  web:
    command: ['npm', 'start']
```

#### 11. entrypoint

覆盖镜像的默认入口点。

```yaml
services:
  web:
    entrypoint: /usr/local/bin/start.sh
```

#### 12. expose

只暴露容器内部的端口，不映射到主机上。

```yaml
services:
  web:
    expose:
      - '3000'
```

#### 13. env_file

从文件中读取环境变量。

```yaml
services:
  web:
    env_file:
      - .env
```

#### 14. labels

用于为容器、服务或网络等资源添加元数据。这些标签可以帮助标识和管理容器，支持多种用途，包括监控、调试和自动化管理。例如可以筛选容器，在结合 traefik 或者 k8s 使用时，用以控制流量

```yaml
labels:
  - com.example.description:"Accounting webapp"
  - com.example.department:"Finance"
  - com.example.label-with-empty-value:""

labels:
  - "com.example.environment=production"
  - "com.example.department=marketing"
```

com.example.environment=production：表示这个服务运行在生产环境中。

com.example.department=marketing：表示这个服务属于营销部门。

这些标签可以用于：

- 识别和管理：通过标签可以快速识别容器的用途、所属部门或环境。
- 自动化工具：许多自动化工具和平台（如 Kubernetes、监控系统）可以读取标签，以便执行特定操作。
- 文档化：为其他开发人员和运维人员提供关于容器的额外信息。

### 网络和卷的配置项

#### networks

定义网络配置，如驱动类型、子网和 IP 范围。

```yaml
networks:
  frontend:
    driver: bridge
```

#### volumes

定义数据卷的配置。

```yaml
volumes:
  data-volume:
    driver: local
```

### 完整的 `docker-compose.yml` 示例

以下是一个实际的 `docker-compose.yml` 文件示例，展示了如何组合以上配置项来定义一个简单的应用。

```yaml
version: '3.9'

services:
  web:
    image: nginx:latest
    container_name: nginx_server
    ports:
      - '8080:80'
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    networks:
      - frontend
    depends_on:
      - db
    environment:
      - NGINX_PORT=80
    restart: always

  db:
    image: mysql:5.7
    container_name: mysql_database
    environment:
      - MYSQL_ROOT_PASSWORD=example
      - MYSQL_DATABASE=mydb
    volumes:
      - db-data:/var/lib/mysql
    networks:
      - backend
    restart: always

networks:
  frontend:
    driver: bridge
  backend:
    driver: bridge

volumes:
  db-data:
    driver: local
```

### 解释

- **version**: 指定 `docker-compose` 文件使用的版本。
- **services**: 定义了两个服务：`web` 和 `db`。
  - **web** 服务：使用 `nginx` 镜像，暴露端口 8080 映射到容器的 80 端口，挂载本地的 `nginx.conf` 配置文件到容器的 `/etc/nginx/nginx.conf`，使用 `frontend` 网络，并依赖于 `db` 服务。
  - **db** 服务：使用 `mysql` 镜像，设置环境变量以初始化数据库，挂载数据卷 `db-data`，使用 `backend` 网络。
- **networks**: 定义了两个网络：`frontend` 和 `backend`，都使用桥接网络驱动。
- **volumes**: 定义了一个本地驱动的数据卷 `db-data`，用于持久化 MySQL 数据。

通过这些配置，`docker-compose` 能够轻松地管理多容器应用的启动、停止和整体操作。

## docker-compose 命令

```
# 启动
$ docker-compose up --build xxx -d

# 查看日志
$ docker-compose logs

# 停止
$ docker-compose stop

# 删除
$ docker-compose rm
```

使用 docker-compose up 启动容器，它会自动查找当前目录下的 docker-compose.yaml 文件作为配置文件

## 扩展

### version 字段的历史进程

在 Docker Compose 的历史上，`version` 字段曾经是 `docker-compose.yml` 文件中一个重要的部分，用于指定 Compose 文件的格式版本。随着 Docker Compose 的发展，`version` 字段的角色和重要性也发生了变化。

#### `version` 字段的历史进程

1. **早期版本（1.x 和 2.x）**：

   - 在这些版本中，`version` 字段用于指示 `docker-compose.yml` 文件的格式版本，不同的格式版本支持不同的功能和语法。
   - 例如，`version: '2'` 引入了更复杂的网络和卷配置，而 `version: '2.1'` 等后续版本则逐步增加了更细化的控制能力。

2. **3.x 版本**：

   - `version: '3'` 及其子版本（如 `3.1`、`3.2` 等）主要为了支持 Docker Swarm 模式，提供了更丰富的集群管理功能。
   - 这些版本继续发展，增加了对增强的资源限制、部署策略等功能的支持。

3. **Compose V2（当前版本）**：
   - 随着 Docker Compose V2 的推出，`version` 字段的使用变得更加灵活。Compose V2 通过检测 Compose 文件的内容和 Docker 引擎版本来自动确定支持的功能，而不是依赖显式的 `version` 字段。
   - 在最新的 Docker Compose 中，`version` 字段变得可选，默认情况下不需要显式指定。Docker Compose 会根据 Docker 引擎的功能自动适配。

#### 现代实践

- **无需指定 `version`**：在现代 Docker Compose 实践中，`version` 字段通常可以忽略，尤其是在使用最新的 Docker Compose CLI 时。
- **向后兼容**：如果你的项目需要向后兼容，或者在一个较老的 Docker 环境中运行，仍然可以指定 `version`，以确保兼容性。
