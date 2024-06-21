# docker-compose.yml 配置

`docker-compose` 是一个用于定义和运行多容器 Docker 应用的工具。它使用 YAML 文件来配置应用的服务、网络和卷等。接下来，我将详细介绍 `docker-compose.yml` 文件中的常用配置项，并提供相应的示例。

### 基本配置项

1. **version**: 定义 `docker-compose` 文件的版本。
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

```yaml
services:
  web:
    container_name: my_nginx
```

#### 4. ports

定义主机与容器之间的端口映射。

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
