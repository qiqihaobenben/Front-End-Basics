# Maven Wrapper (mvnw) 完全指南

## 1. mvnw 是什么？

**Maven Wrapper** 是一个脚本，让项目可以**自带特定版本的 Maven**，无需开发者手动安装 Maven。

### 类比理解

```bash
# 传统方式：要求每个人都安装相同版本的 Maven
mvn clean install  # 需要提前 brew install maven / apt install maven

# Wrapper 方式：项目自带 Maven
./mvnw clean install  # 自动下载并使用项目指定的 Maven 版本
```

### 核心优势

| 传统 Maven       | Maven Wrapper        |
| ---------------- | -------------------- |
| 每个人需手动安装 | 项目自带，自动下载   |
| 版本可能不一致   | 强制统一版本         |
| CI/CD 需预装     | 开箱即用             |
| 新人上手麻烦     | `git clone` 后直接用 |

---

## 2. mvnw 文件结构

典型的 Maven Wrapper 项目结构：

```
my-project/
├── mvnw              ← Unix/Linux/Mac 脚本
├── mvnw.cmd          ← Windows 脚本
├── .mvn/
│   └── wrapper/
│       ├── maven-wrapper.jar          ← 核心 jar（下载器）
│       └── maven-wrapper.properties   ← 配置文件
├── pom.xml
└── src/
```

### 各文件作用

**1. `mvnw` (Shell 脚本)**

```bash
#!/bin/sh
# Unix/Linux/Mac 使用
# 检查 Java，下载 Maven，执行命令
```

**2. `mvnw.cmd` (批处理脚本)**

```batch
@REM Windows 使用
@REM 功能与 mvnw 相同
```

**3. `maven-wrapper.jar`**

- 负责下载 Maven 的小程序（约 50KB）
- 首次运行时下载完整的 Maven 到 `~/.m2/wrapper/dists/`

**4. `maven-wrapper.properties`**

```properties
distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip
wrapperUrl=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar
```

---

## 3. 跨平台使用

### Mac / Linux / Unix

```bash
# 赋予执行权限（首次需要）
chmod +x mvnw

# 使用
./mvnw clean install
./mvnw spring-boot:run
./mvnw test

# 不需要 ./ 的方式（添加到 PATH）
export PATH="$PATH:$(pwd)"
mvnw clean install
```

### Windows

**方式 1：命令提示符 (CMD)**

```cmd
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

**方式 2：PowerShell**

```powershell
.\mvnw.cmd clean install
# 或直接
.\mvnw clean install  # PowerShell 会自动识别
```

**方式 3：Git Bash (推荐)**

```bash
./mvnw clean install  # 与 Mac/Linux 一致
```

### 跨平台脚本示例

**build.sh / build.bat**

```bash
# build.sh (Mac/Linux)
#!/bin/bash
./mvnw clean package
```

```batch
REM build.bat (Windows)
@echo off
mvnw.cmd clean package
```

---

## 4. 生成 Maven Wrapper

### 方式 1：使用 Maven 命令生成（最常用）

**前提**：需要已安装 Maven

```bash
# 在项目根目录执行
mvn wrapper:wrapper

# 或指定 Maven 版本
mvn wrapper:wrapper -Dmaven=3.9.6

# 指定 Wrapper 版本
mvn wrapper:wrapper -Dtype=only-script -Dwrapper=3.2.0
```

**执行后会生成**：

```
✅ mvnw
✅ mvnw.cmd
✅ .mvn/wrapper/maven-wrapper.jar
✅ .mvn/wrapper/maven-wrapper.properties
```

### 方式 2：手动下载（无需安装 Maven）

**步骤 1：创建目录结构**

```bash
mkdir -p .mvn/wrapper
```

**步骤 2：下载 wrapper jar**

```bash
# 访问 https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/
# 下载最新版本，例如 3.2.0
curl -o .mvn/wrapper/maven-wrapper.jar \
  https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper.jar
```

**步骤 3：创建 properties 文件**

`.mvn/wrapper/maven-wrapper.properties`:

```properties
distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip
wrapperUrl=https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar
```

**步骤 4：下载脚本文件**

从官方仓库下载：

```bash
# mvnw
curl -o mvnw \
  https://raw.githubusercontent.com/apache/maven-wrapper/master/maven-wrapper-distribution/src/resources/mvnw

# mvnw.cmd
curl -o mvnw.cmd \
  https://raw.githubusercontent.com/apache/maven-wrapper/master/maven-wrapper-distribution/src/resources/mvnw.cmd

# 赋予执行权限
chmod +x mvnw
```

### 方式 3：从其他项目复制

```bash
# 从已有的项目复制全部文件
cp -r /path/to/other-project/mvnw* .
cp -r /path/to/other-project/.mvn .

# 确保权限正确
chmod +x mvnw
```

### 方式 4：使用 Spring Initializr（Spring Boot 项目）

访问 https://start.spring.io/

- 配置项目
- 下载生成的 zip
- **自动包含 Maven Wrapper** ✅

---

## 5. 后期添加 Wrapper 到现有项目

### 场景：接手老项目，没有 mvnw

**步骤 1：检查是否已有 Maven**

```bash
mvn -version
```

**步骤 2：生成 Wrapper**

```bash
cd /path/to/your-project
mvn wrapper:wrapper
```

**步骤 3：提交到 Git**

```bash
git add mvnw mvnw.cmd .mvn/
git commit -m "Add Maven Wrapper"
git push
```

**步骤 4：通知团队**

```bash
# 其他开发者拉取后
git pull

# 直接使用，无需安装 Maven
./mvnw clean install
```

---

## 6. 首次运行发生什么？

### 执行过程详解

```bash
./mvnw clean install
```

**第 1 步：检查本地是否有缓存**

```bash
ls ~/.m2/wrapper/dists/apache-maven-3.9.6-bin/
```

**第 2 步：如果没有，自动下载**

```
Downloading from central: https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip
Downloaded: ~/.m2/wrapper/dists/apache-maven-3.9.6-bin/xxx/apache-maven-3.9.6-bin.zip (9 MB)
Unzipping to ~/.m2/wrapper/dists/apache-maven-3.9.6-bin/xxx/
```

**第 3 步：使用下载的 Maven 执行命令**

```bash
~/.m2/wrapper/dists/apache-maven-3.9.6-bin/xxx/apache-maven-3.9.6/bin/mvn clean install
```

**第 4 步：后续运行直接使用缓存**

```bash
./mvnw clean install  # 秒启动，直接用缓存的 Maven
```

### 缓存位置

```
~/.m2/wrapper/dists/
└── apache-maven-3.9.6-bin/
    └── 5a6cabe...abc123/
        └── apache-maven-3.9.6/
            ├── bin/
            │   └── mvn
            ├── lib/
            └── conf/
```

---

## 7. 常见问题与解决

### 问题 1：权限错误（Mac/Linux）

```bash
-bash: ./mvnw: Permission denied
```

**解决**：

```bash
chmod +x mvnw
./mvnw clean install
```

### 问题 2：网络下载失败

```
Error downloading Maven distribution
```

**解决 1：使用国内镜像**

修改 `.mvn/wrapper/maven-wrapper.properties`：

```properties
# 原始地址
# distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.6/apache-maven-3.9.6-bin.zip

# 改为阿里云镜像
distributionUrl=https://mirrors.aliyun.com/apache/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip
```

**解决 2：手动下载**

```bash
# 1. 手动下载 Maven
curl -o apache-maven-3.9.6-bin.zip \
  https://mirrors.aliyun.com/apache/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip

# 2. 解压到 wrapper 目录
mkdir -p ~/.m2/wrapper/dists/apache-maven-3.9.6-bin/xxx/
unzip apache-maven-3.9.6-bin.zip -d ~/.m2/wrapper/dists/apache-maven-3.9.6-bin/xxx/

# 3. 再次运行 mvnw
./mvnw clean install
```

### 问题 3：Windows 换行符问题

```
'\r': command not found
```

**原因**：在 Windows 上创建的文件用了 CRLF 换行符

**解决**：

```bash
# Mac/Linux 上转换
dos2unix mvnw

# 或用 sed
sed -i 's/\r$//' mvnw
```

### 问题 4：Git 没有提交 wrapper jar

```
Error: Could not find or load main class org.apache.maven.wrapper.MavenWrapperMain
```

**原因**：`.gitignore` 忽略了 jar 文件

**解决**：

```bash
# 检查 .gitignore
cat .gitignore | grep jar

# 确保不忽略 wrapper jar
# .gitignore 应该这样写：
*.jar
!.mvn/wrapper/maven-wrapper.jar  # ⬅️ 重要！
```

---

## 8. CI/CD 中使用

### GitHub Actions

```yaml
name: Build

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Set up JDK 17
        uses: actions/setup-java@v3
        with:
          java-version: '17'
          distribution: 'temurin'

      - name: Build with Maven Wrapper
        run: ./mvnw clean package # ⬅️ 直接用 mvnw
```

### GitLab CI

```yaml
build:
  image: openjdk:17-jdk
  script:
    - chmod +x mvnw # 确保权限
    - ./mvnw clean package
```

### Jenkins

```groovy
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh './mvnw clean package'
            }
        }
    }
}
```

---

## 9. 最佳实践

### ✅ 推荐做法

1. **所有新项目都加上 Maven Wrapper**

   ```bash
   mvn wrapper:wrapper
   git add mvnw* .mvn/
   git commit -m "Add Maven Wrapper"
   ```

2. **提交到 Git（包括 jar）**

   ```gitignore
   # .gitignore
   *.jar
   !.mvn/wrapper/maven-wrapper.jar  # 必须保留
   ```

3. **README 中说明使用方式**

   ```markdown
   ## 构建项目

   Mac/Linux:
   ./mvnw clean install

   Windows:
   mvnw.cmd clean install
   ```

4. **统一团队使用 mvnw**

   ```bash
   # 不要用
   mvn clean install

   # 统一用
   ./mvnw clean install
   ```

### ❌ 避免的做法

1. **不提交 wrapper jar 到 Git**

   - 会导致其他人无法使用

2. **混用 mvn 和 mvnw**

   - 容易导致版本不一致

3. **忘记赋予执行权限**
   ```bash
   # 提交前检查
   git ls-files --stage mvnw
   # 应该看到 100755（可执行）
   ```

---

## 10. 升级 Maven 版本

### 更新 Wrapper 到新版本 Maven

```bash
# 方式 1：重新生成
./mvnw wrapper:wrapper -Dmaven=3.9.8

# 方式 2：手动修改 properties
# 编辑 .mvn/wrapper/maven-wrapper.properties
distributionUrl=https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/3.9.8/apache-maven-3.9.8-bin.zip

# 删除旧缓存
rm -rf ~/.m2/wrapper/dists/apache-maven-3.9.6-bin/

# 运行时会下载新版本
./mvnw clean install
```

---

## 11. 快速参考

### 命令对比

| 传统 Maven    | Maven Wrapper (Mac/Linux) | Maven Wrapper (Windows) |
| ------------- | ------------------------- | ----------------------- |
| `mvn clean`   | `./mvnw clean`            | `mvnw.cmd clean`        |
| `mvn install` | `./mvnw install`          | `mvnw.cmd install`      |
| `mvn test`    | `./mvnw test`             | `mvnw.cmd test`         |
| `mvn package` | `./mvnw package`          | `mvnw.cmd package`      |

### 生成 Wrapper 速查

```bash
# 最简单（使用默认最新版本）
mvn wrapper:wrapper

# 指定 Maven 版本
mvn wrapper:wrapper -Dmaven=3.9.6

# 指定 Wrapper 版本
mvn wrapper:wrapper -Dwrapper=3.2.0

# 只更新脚本（不更新 jar）
mvn wrapper:wrapper -Dtype=only-script
```

---

## 总结

Maven Wrapper 的核心价值：

- ✅ **版本统一**：团队所有人使用相同 Maven 版本
- ✅ **零配置**：新成员 `git clone` 后直接 `./mvnw` 即用
- ✅ **CI/CD 友好**：不需要预装 Maven
- ✅ **跨平台**：自动适配 Mac/Linux/Windows

**一句话**：Maven Wrapper 让 Maven 项目像 Node.js 项目一样开箱即用！

有具体场景的问题吗？
