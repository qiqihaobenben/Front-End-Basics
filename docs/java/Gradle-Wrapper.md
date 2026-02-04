# Gradle Wrapper 完全指南

是的！Gradle 不仅有类似功能，而且 **Gradle Wrapper 比 Maven Wrapper 更成熟、更常用**！

事实上，**Gradle 官方强烈推荐使用 Wrapper**，几乎所有 Gradle 项目都默认带 Wrapper。

---

## 1. Gradle Wrapper 是什么？

与 Maven Wrapper 完全相同的理念：项目自带特定版本的 Gradle。

### 核心优势

| 特性         | Gradle Wrapper        | Maven Wrapper      |
| ------------ | --------------------- | ------------------ |
| 官方推荐程度 | ⭐⭐⭐⭐⭐ 强烈推荐   | ⭐⭐⭐ 可选        |
| 默认生成     | ✅ 所有新项目默认生成 | ❌ 需要手动添加    |
| 成熟度       | 从 Gradle 1.0 就有    | 较新（Maven 3.7+） |
| 使用率       | 接近 100%             | 约 30-40%          |

---

## 2. Gradle Wrapper 文件结构

```
my-project/
├── gradlew              ← Unix/Linux/Mac 脚本
├── gradlew.bat          ← Windows 脚本
├── gradle/
│   └── wrapper/
│       ├── gradle-wrapper.jar         ← 下载器（约 60KB）
│       └── gradle-wrapper.properties  ← 配置文件
├── build.gradle / build.gradle.kts
├── settings.gradle / settings.gradle.kts
└── src/
```

### 文件详解

**1. `gradle-wrapper.properties`** (最重要)

```properties
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

**2. `gradlew` 和 `gradlew.bat`**

- 功能与 Maven Wrapper 的 `mvnw` 相同
- 自动下载并运行指定版本的 Gradle

---

## 3. 跨平台使用

### Mac / Linux

```bash
# 赋予执行权限（通常已经有）
chmod +x gradlew

# 使用（与 mvnw 完全一致）
./gradlew build
./gradlew test
./gradlew clean
./gradlew bootRun  # Spring Boot
```

### Windows

```cmd
REM 命令提示符
gradlew.bat build
gradlew.bat test

REM PowerShell
.\gradlew.bat build
.\gradlew build  # 也可以

REM Git Bash
./gradlew build
```

### 与 mvnw 的对比

| 操作               | Maven Wrapper              | Gradle Wrapper        |
| ------------------ | -------------------------- | --------------------- |
| Mac/Linux          | `./mvnw clean install`     | `./gradlew build`     |
| Windows CMD        | `mvnw.cmd clean install`   | `gradlew.bat build`   |
| Windows PowerShell | `.\mvnw.cmd clean install` | `.\gradlew.bat build` |
| Git Bash           | `./mvnw clean install`     | `./gradlew build`     |

---

## 4. 生成 Gradle Wrapper

### 方式 1：使用 Gradle 命令生成（最常用）

**前提**：需要已安装 Gradle

```bash
# 在项目根目录执行
gradle wrapper

# 或指定 Gradle 版本
gradle wrapper --gradle-version 8.5

# 指定发行版类型
gradle wrapper --gradle-version 8.5 --distribution-type all  # 包含源码和文档
gradle wrapper --gradle-version 8.5 --distribution-type bin  # 只包含二进制（默认）
```

**生成后的文件**：

```
✅ gradlew
✅ gradlew.bat
✅ gradle/wrapper/gradle-wrapper.jar
✅ gradle/wrapper/gradle-wrapper.properties
```

### 方式 2：新建项目时自动生成

**Gradle Init（官方推荐）**：

```bash
# 创建新项目，自动包含 Wrapper
gradle init

# 选择项目类型
Select type of project to generate:
  1: basic
  2: application
  3: library
  4: Gradle plugin
Enter selection (default: basic) [1..4] 2

Select implementation language:
  1: Java
  2: Kotlin
  3: Groovy
  4: Scala
Enter selection (default: Java) [1..4] 1

# 会自动生成 gradlew 和相关文件 ✅
```

### 方式 3：使用 Spring Initializr（Spring Boot）

访问 https://start.spring.io/

- 选择 "Gradle - Groovy" 或 "Gradle - Kotlin"
- 下载后**自动包含 Gradle Wrapper** ✅

### 方式 4：手动创建（无需安装 Gradle）

**步骤 1：创建目录**

```bash
mkdir -p gradle/wrapper
```

**步骤 2：下载 wrapper jar**

```bash
# 从 Gradle 官方仓库下载（选择版本，如 8.5）
curl -L -o gradle/wrapper/gradle-wrapper.jar \
  https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradle/wrapper/gradle-wrapper.jar
```

**步骤 3：创建 properties 文件**

`gradle/wrapper/gradle-wrapper.properties`:

```properties
distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
```

**步骤 4：下载脚本**

```bash
# gradlew
curl -L -o gradlew \
  https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradlew

# gradlew.bat
curl -L -o gradlew.bat \
  https://raw.githubusercontent.com/gradle/gradle/v8.5.0/gradlew.bat

# 赋予权限
chmod +x gradlew
```

---

## 5. 后期添加 Wrapper

### 场景 1：老项目没有 Wrapper

```bash
# 确保已安装 Gradle
gradle -v

# 生成 Wrapper
cd /path/to/your-project
gradle wrapper --gradle-version 8.5

# 提交到 Git
git add gradlew* gradle/
git commit -m "Add Gradle Wrapper"
git push
```

### 场景 2：从 Maven 迁移到 Gradle

```bash
# 1. 初始化 Gradle（会生成基础文件）
gradle init

# 2. 选择 "Convert from Maven"
Select type of project to generate:
  ...
  Convert a Maven build to Gradle

# 3. 自动转换 pom.xml 并生成 Wrapper ✅
```

---

## 6. 首次运行详解

```bash
./gradlew build
```

### 执行流程

**第 1 步：检查本地缓存**

```bash
ls ~/.gradle/wrapper/dists/gradle-8.5-bin/
```

**第 2 步：如果没有，下载 Gradle**

```
Downloading https://services.gradle.org/distributions/gradle-8.5-bin.zip
...........10%...........20%...........30%...........40%...........50%
Unzipping ~/.gradle/wrapper/dists/gradle-8.5-bin/xxxxx/gradle-8.5-bin.zip to ~/.gradle/wrapper/dists/gradle-8.5-bin/xxxxx
```

**第 3 步：使用下载的 Gradle 执行**

```bash
~/.gradle/wrapper/dists/gradle-8.5-bin/xxxxx/gradle-8.5/bin/gradle build
```

**第 4 步：后续直接使用缓存**

```bash
./gradlew build  # 秒启动
```

### 缓存位置

```
~/.gradle/wrapper/dists/
└── gradle-8.5-bin/
    └── 2s4a7b1c8...xyz123/
        └── gradle-8.5/
            ├── bin/
            │   ├── gradle       (Unix)
            │   └── gradle.bat   (Windows)
            ├── lib/
            └── ...
```

---

## 7. 常见问题与解决

### 问题 1：权限错误（与 mvnw 相同）

```bash
-bash: ./gradlew: Permission denied
```

**解决**：

```bash
chmod +x gradlew
./gradlew build
```

### 问题 2：网络下载失败

```
Could not download gradle-8.5-bin.zip
```

**解决 1：使用腾讯云镜像（国内推荐）**

修改 `gradle/wrapper/gradle-wrapper.properties`：

```properties
# 原始地址
# distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-bin.zip

# 改为腾讯云镜像
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-8.5-bin.zip
```

**其他国内镜像**：

```properties
# 阿里云
distributionUrl=https\://mirrors.aliyun.com/macports/distfiles/gradle/gradle-8.5-bin.zip

# 华为云
distributionUrl=https\://repo.huaweicloud.com/gradle/gradle-8.5-bin.zip
```

**解决 2：手动下载**

```bash
# 1. 手动下载
curl -o gradle-8.5-bin.zip \
  https://mirrors.cloud.tencent.com/gradle/gradle-8.5-bin.zip

# 2. 解压到 wrapper 目录
mkdir -p ~/.gradle/wrapper/dists/gradle-8.5-bin/xxxxx/
unzip gradle-8.5-bin.zip -d ~/.gradle/wrapper/dists/gradle-8.5-bin/xxxxx/

# 3. 再次运行
./gradlew build
```

### 问题 3：验证失败

```
Could not verify gradle-8.5-bin.zip
```

**原因**：使用了镜像地址，但开启了 URL 验证

**解决**：修改 properties

```properties
# 关闭验证（使用镜像时）
validateDistributionUrl=false
```

### 问题 4：Gradle 版本太老

```
Gradle version 4.0 is required. Current version is 3.5
```

**解决**：更新 Wrapper 版本（见下一节）

---

## 8. 升级 Gradle 版本

### 方法 1：使用 Wrapper 自身更新（推荐）

```bash
# 升级到最新版本
./gradlew wrapper --gradle-version 8.5

# 升级到最新稳定版
./gradlew wrapper --gradle-version latest

# 升级到包含源码的版本
./gradlew wrapper --gradle-version 8.5 --distribution-type all
```

### 方法 2：手动修改 properties

```properties
# 编辑 gradle/wrapper/gradle-wrapper.properties
distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-bin.zip

# 删除旧缓存
rm -rf ~/.gradle/wrapper/dists/gradle-8.4-bin/

# 运行时自动下载新版本
./gradlew build
```

### 方法 3：使用项目中的 gradlew 更新自己

```bash
# 神奇的自举（bootstrap）
./gradlew wrapper --gradle-version=8.5
```

**原理**：

1. 使用当前版本的 Gradle 运行 `wrapper` 任务
2. 生成新版本的 Wrapper 文件
3. 下次运行 `./gradlew` 就用新版本了

---

## 9. Gradle Wrapper 高级配置

### 1. 使用本地 Gradle 发行版（离线场景）

**场景**：无法访问互联网的内网环境

**gradle/wrapper/gradle-wrapper.properties**:

```properties
# 使用本地文件（file:/// 协议）
distributionUrl=file\:///Users/username/downloads/gradle-8.5-bin.zip

# 或网络共享路径（Windows）
distributionUrl=file\:///Z:/gradle/gradle-8.5-bin.zip
```

### 2. 配置代理

**方式 1：系统环境变量**

```bash
# Mac/Linux
export GRADLE_OPTS="-Dhttps.proxyHost=proxy.company.com -Dhttps.proxyPort=8080"
./gradlew build

# Windows
set GRADLE_OPTS=-Dhttps.proxyHost=proxy.company.com -Dhttps.proxyPort=8080
gradlew.bat build
```

**方式 2：gradle.properties**

创建 `~/.gradle/gradle.properties`:

```properties
systemProp.https.proxyHost=proxy.company.com
systemProp.https.proxyPort=8080
systemProp.https.proxyUser=username
systemProp.https.proxyPassword=password
```

### 3. 配置下载超时

**gradle/wrapper/gradle-wrapper.properties**:

```properties
# 默认 10 秒，可以增加到 60 秒
networkTimeout=60000
```

### 4. 指定 Gradle 分发类型

```bash
# bin：仅二进制（默认，约 100MB）
./gradlew wrapper --gradle-version 8.5 --distribution-type bin

# all：包含源码和文档（约 200MB，IDE 开发推荐）
./gradlew wrapper --gradle-version 8.5 --distribution-type all
```

**对应的 properties**:

```properties
# bin 版本
distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-bin.zip

# all 版本（推荐 IDE 开发）
distributionUrl=https\://services.gradle.org/distributions/gradle-8.5-all.zip
```

**区别**：

- `bin`：只包含运行时需要的文件
- `all`：包含源码和文档，IDE 可以查看 Gradle API 源码和 Javadoc

---

## 10. CI/CD 中使用

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

      - name: Grant execute permission for gradlew
        run: chmod +x gradlew

      - name: Build with Gradle Wrapper
        run: ./gradlew build # ⬅️ 直接使用

      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: jar-files
          path: build/libs/*.jar
```

### GitLab CI

```yaml
image: openjdk:17-jdk

build:
  script:
    - chmod +x gradlew
    - ./gradlew build
  artifacts:
    paths:
      - build/libs/*.jar
```

### Jenkins

```groovy
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'chmod +x gradlew'
                sh './gradlew clean build'
            }
        }

        stage('Test') {
            steps {
                sh './gradlew test'
            }
        }
    }
}
```

### Docker

**Dockerfile**:

```dockerfile
FROM openjdk:17-jdk-slim

WORKDIR /app

# 复制 Gradle Wrapper 文件
COPY gradlew .
COPY gradle gradle/

# 复制项目文件
COPY build.gradle settings.gradle ./
COPY src src/

# 赋予执行权限
RUN chmod +x gradlew

# 构建项目（会自动下载 Gradle）
RUN ./gradlew build --no-daemon

# 运行
CMD ["java", "-jar", "build/libs/app.jar"]
```

---

## 11. Gradle Wrapper vs Maven Wrapper 详细对比

| 特性         | Gradle Wrapper                            | Maven Wrapper              |
| ------------ | ----------------------------------------- | -------------------------- |
| **官方支持** | ✅ 内置，强烈推荐                         | ✅ 官方支持（3.7+）        |
| **默认生成** | ✅ 是                                     | ❌ 否                      |
| **使用率**   | ~95%                                      | ~30-40%                    |
| **生成命令** | `gradle wrapper`                          | `mvn wrapper:wrapper`      |
| **脚本名称** | `gradlew` / `gradlew.bat`                 | `mvnw` / `mvnw.cmd`        |
| **配置文件** | `gradle-wrapper.properties`               | `maven-wrapper.properties` |
| **缓存位置** | `~/.gradle/wrapper/dists/`                | `~/.m2/wrapper/dists/`     |
| **自我更新** | ✅ `./gradlew wrapper --gradle-version X` | ⚠️ 需要已有 Maven          |
| **分发类型** | `bin` / `all`                             | 只有 `bin`                 |
| **国内镜像** | ✅ 多个（腾讯云、阿里云）                 | ✅ 阿里云                  |
| **成熟度**   | ⭐⭐⭐⭐⭐ 从 2012 年就有                 | ⭐⭐⭐ 2019 年引入         |

---

## 12. 最佳实践

### ✅ 推荐做法

**1. 始终使用 Gradle Wrapper**

```bash
# ❌ 不推荐
gradle build

# ✅ 推荐
./gradlew build
```

**2. 提交所有 Wrapper 文件到 Git**

```gitignore
# .gitignore
.gradle/
build/

# ✅ 不要忽略这些文件
# gradlew
# gradlew.bat
# gradle/wrapper/gradle-wrapper.jar
# gradle/wrapper/gradle-wrapper.properties
```

**确保提交**：

```bash
git add gradlew gradlew.bat gradle/
git commit -m "Add Gradle Wrapper"
```

**3. 使用 `all` 分发类型（团队开发）**

```bash
./gradlew wrapper --gradle-version 8.5 --distribution-type all
```

**好处**：

- IDE 可以查看 Gradle 源码
- 更好的代码提示
- 更容易调试构建脚本

**4. 在 README 中说明**

````markdown
## 构建项目

```bash
# Unix/Linux/Mac
./gradlew build

# Windows
gradlew.bat build
```
````

项目使用 Gradle Wrapper，无需手动安装 Gradle。

````

**5. 定期更新 Gradle 版本**
```bash
# 每隔几个月检查更新
./gradlew wrapper --gradle-version latest

# 提交更新
git add gradle/
git commit -m "Update Gradle to 8.5"
````

### ❌ 避免的做法

**1. 不提交 gradle-wrapper.jar**

```gitignore
# ❌ 错误
*.jar
```

**正确写法**：

```gitignore
*.jar
!gradle/wrapper/gradle-wrapper.jar
```

**2. 混用 gradle 和 gradlew**

```bash
# ❌ 团队成员 A
gradle build  # 用的本地安装的 Gradle 7.0

# ❌ 团队成员 B
gradle build  # 用的本地安装的 Gradle 8.5

# ✅ 统一使用
./gradlew build  # 所有人都用项目指定的版本
```

**3. 不设置执行权限就提交**

```bash
# ❌ 错误流程
git add gradlew
git commit -m "Add wrapper"

# ✅ 正确流程
chmod +x gradlew
git add gradlew
git commit -m "Add executable Gradle wrapper"
```

---

## 13. 故障排查

### 检查 Wrapper 状态

```bash
# 查看当前 Gradle 版本
./gradlew --version

# 查看详细信息
./gradlew --version --debug

# 查看所有属性
./gradlew properties
```

### 清理缓存

```bash
# 清理项目缓存
./gradlew clean

# 清理 Gradle 缓存
rm -rf ~/.gradle/caches/

# 清理 Wrapper 缓存（强制重新下载）
rm -rf ~/.gradle/wrapper/dists/gradle-8.5-bin/
./gradlew build  # 会重新下载
```

### 验证 Wrapper 完整性

```bash
# 检查 wrapper jar 是否存在
ls -lh gradle/wrapper/gradle-wrapper.jar

# 检查权限
ls -l gradlew  # 应该显示 -rwxr-xr-x

# 运行 wrapper 任务重新生成
./gradlew wrapper
```

---

## 14. 快速参考

### 常用命令对比

| Maven                  | Gradle                          |
| ---------------------- | ------------------------------- |
| `./mvnw clean`         | `./gradlew clean`               |
| `./mvnw compile`       | `./gradlew compileJava`         |
| `./mvnw test`          | `./gradlew test`                |
| `./mvnw package`       | `./gradlew assemble`            |
| `./mvnw install`       | `./gradlew publishToMavenLocal` |
| `./mvnw clean install` | `./gradlew clean build`         |

### Wrapper 管理命令

```bash
# 生成 Wrapper
gradle wrapper

# 指定版本
gradle wrapper --gradle-version 8.5

# 更新到最新版
./gradlew wrapper --gradle-version latest

# 包含源码和文档
./gradlew wrapper --gradle-version 8.5 --distribution-type all

# 查看 Wrapper 版本
./gradlew --version

# 验证 Wrapper
./gradlew wrapper --gradle-version 8.5 --validate
```

---

## 总结

### Gradle Wrapper 的优势

1. **官方力推**：Gradle 团队强烈推荐，几乎是行业标准
2. **自动生成**：所有新项目默认带 Wrapper
3. **自我更新**：可以用 Wrapper 自己更新自己
4. **成熟稳定**：从 Gradle 诞生就有，经过 10+ 年打磨
5. **IDE 支持好**：IntelliJ IDEA、Android Studio 完美支持

### Maven Wrapper vs Gradle Wrapper

- **Maven Wrapper**：后来者，需要手动添加，使用率较低
- **Gradle Wrapper**：原生功能，默认配置，使用率极高

**一句话总结**：

- Maven 项目：**建议添加** Maven Wrapper
- Gradle 项目：**必然已有** Gradle Wrapper

有任何具体问题吗？比如迁移项目、CI/CD 配置等？
