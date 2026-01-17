# Maven 到 Gradle 的迁移指南

好的！我会从 Maven 用户的视角系统讲解 Gradle。

## 核心概念对比

| Maven        | Gradle                              | 说明             |
| ------------ | ----------------------------------- | ---------------- |
| `pom.xml`    | `build.gradle` / `build.gradle.kts` | 构建配置文件     |
| Goal (目标)  | Task (任务)                         | 可执行的构建单元 |
| Phase (阶段) | 没有严格对应                        | Gradle 更灵活    |
| `mvn` 命令   | `gradle` / `./gradlew` 命令         | 构建工具         |

## 1. 依赖管理

### 1.1 声明依赖

**Maven (`pom.xml`)**:

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <version>3.2.0</version>
        <scope>compile</scope>
    </dependency>
</dependencies>
```

**Gradle (`build.gradle`)**:

```groovy
dependencies {
    implementation 'org.springframework.boot:spring-boot-starter-web:3.2.0'
    testImplementation 'junit:junit:4.13.2'
    compileOnly 'org.projectlombok:lombok:1.18.30'
    runtimeOnly 'mysql:mysql-connector-java:8.0.33'
}
```

**Gradle Kotlin DSL (`build.gradle.kts`)**:

```kotlin
dependencies {
    implementation("org.springframework.boot:spring-boot-starter-web:3.2.0")
    testImplementation("junit:junit:4.13.2")
    compileOnly("org.projectlombok:lombok:1.18.30")
    runtimeOnly("mysql:mysql-connector-java:8.0.33")
}
```

### 1.2 依赖配置（Scope）对比

| Maven Scope | Gradle Configuration | 说明                                |
| ----------- | -------------------- | ----------------------------------- |
| `compile`   | `implementation`     | 编译和运行时依赖                    |
| `provided`  | `compileOnly`        | 仅编译时，运行时由容器提供          |
| `runtime`   | `runtimeOnly`        | 仅运行时                            |
| `test`      | `testImplementation` | 测试编译和运行                      |
| -           | `api`                | 类似 implementation，但传递给消费者 |

**重要区别**：

- `implementation`：依赖不会传递到消费者的编译类路径（更好的封装）
- `api`：依赖会传递（类似 Maven 的 compile）

### 1.3 仓库配置

**Maven**:

```xml
<repositories>
    <repository>
        <id>central</id>
        <url>https://repo.maven.apache.org/maven2</url>
    </repository>
</repositories>
```

**Gradle**:

```groovy
repositories {
    mavenCentral()
    mavenLocal()  // ~/.m2/repository
    google()
    maven {
        url 'https://custom-repo.example.com/maven'
    }
}
```

### 1.4 下载依赖

**Maven**:

```bash
mvn dependency:resolve
```

**Gradle**:

```bash
# Gradle 会在首次构建时自动下载
gradle build

# 或者仅下载依赖（不常用）
gradle dependencies --write-locks
```

**关键差异**：Gradle 采用**惰性下载**，在真正需要时才下载依赖。

## 2. 构建生命周期

### 2.1 Maven 的固定生命周期

```
validate → compile → test → package → verify → install → deploy
```

### 2.2 Gradle 的任务图（Task Graph）

Gradle 没有固定生命周期，而是基于**任务依赖关系**：

```groovy
// build.gradle
tasks.named('test') {
    dependsOn 'compileJava'  // test 依赖 compileJava
}
```

**内置任务关系**（Java 插件）：

```
compileJava → classes → jar → assemble → build
                                ↓
                              test → check
```

### 2.3 常用任务对比

| Maven 命令         | Gradle 任务                  | 说明               |
| ------------------ | ---------------------------- | ------------------ |
| `mvn compile`      | `gradle compileJava`         | 编译主代码         |
| `mvn test-compile` | `gradle compileTestJava`     | 编译测试代码       |
| `mvn test`         | `gradle test`                | 运行测试           |
| `mvn package`      | `gradle assemble`            | 打包（不运行测试） |
| `mvn verify`       | `gradle check`               | 运行测试和检查     |
| `mvn install`      | `gradle publishToMavenLocal` | 安装到本地仓库     |
| `mvn deploy`       | `gradle publish`             | 发布到远程仓库     |
| `mvn clean`        | `gradle clean`               | 清理构建目录       |

## 3. 完整构建示例

### 3.1 基本 Java 项目

**build.gradle**:

```groovy
plugins {
    id 'java'
}

group = 'com.example'
version = '1.0.0'

java {
    sourceCompatibility = JavaVersion.VERSION_17
    targetCompatibility = JavaVersion.VERSION_17
}

repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.apache.commons:commons-lang3:3.12.0'
    testImplementation 'junit:junit:4.13.2'
}

test {
    useJUnit()  // 或 useJUnitPlatform() for JUnit 5
}
```

### 3.2 执行构建

```bash
# 完整构建（编译 + 测试 + 打包）
gradle build

# 仅编译
gradle compileJava

# 仅运行测试
gradle test

# 跳过测试打包
gradle assemble

# 清理后构建
gradle clean build

# 查看所有任务
gradle tasks

# 查看任务依赖关系
gradle build --dry-run
```

## 4. 测试

### 4.1 测试配置

**Gradle**:

```groovy
test {
    useJUnitPlatform()  // JUnit 5

    // 测试日志
    testLogging {
        events "passed", "skipped", "failed"
        exceptionFormat "full"
    }

    // 并行测试
    maxParallelForks = Runtime.runtime.availableProcessors().intdiv(2) ?: 1

    // JVM 参数
    jvmArgs '-Xmx1024m'

    // 系统属性
    systemProperty 'file.encoding', 'UTF-8'
}
```

### 4.2 跳过测试

**Maven**:

```bash
mvn package -DskipTests
# 或
mvn package -Dmaven.test.skip=true
```

**Gradle**:

```bash
gradle build -x test
# 或在 build.gradle 中
tasks.named('test') {
    enabled = false
}
```

### 4.3 测试报告

```bash
gradle test

# 报告位置
# build/reports/tests/test/index.html
```

## 5. 打包

### 5.1 基本 JAR 打包

**Gradle 自动配置**（通过 `java` 插件）:

```bash
gradle jar
# 输出：build/libs/project-name-1.0.0.jar
```

### 5.2 可执行 JAR（Fat JAR）

**方式一：使用 Shadow 插件**

**build.gradle**:

```groovy
plugins {
    id 'java'
    id 'com.github.johnrengelman.shadow' version '8.1.1'
}

shadowJar {
    archiveBaseName.set('my-app')
    archiveVersion.set('1.0.0')
    archiveClassifier.set('')  // 不添加 -all 后缀

    manifest {
        attributes 'Main-Class': 'com.example.Main'
    }
}
```

```bash
gradle shadowJar
# 输出：build/libs/my-app-1.0.0.jar
```

**方式二：使用 Spring Boot 插件**

```groovy
plugins {
    id 'org.springframework.boot' version '3.2.0'
    id 'java'
}

bootJar {
    archiveBaseName.set('my-app')
    archiveVersion.set('1.0.0')
}
```

```bash
gradle bootJar
```

### 5.3 WAR 打包

```groovy
plugins {
    id 'war'
}

war {
    archiveBaseName.set('my-webapp')
}
```

```bash
gradle war
# 输出：build/libs/my-webapp-1.0.0.war
```

## 6. Gradle Wrapper（推荐使用）

### 6.1 为什么用 Wrapper？

类似 Maven Wrapper (`mvnw`)，确保所有开发者使用相同的 Gradle 版本。

### 6.2 生成 Wrapper

```bash
gradle wrapper --gradle-version 8.5
```

生成文件：

```
gradlew          # Unix/Linux/Mac 脚本
gradlew.bat      # Windows 脚本
gradle/wrapper/
  gradle-wrapper.jar
  gradle-wrapper.properties
```

### 6.3 使用 Wrapper

```bash
./gradlew build     # Unix/Linux/Mac
gradlew.bat build   # Windows

# 之后所有命令都用 ./gradlew 替代 gradle
./gradlew test
./gradlew clean build
```

## 7. 多模块项目

### 7.1 项目结构

```
my-project/
├── settings.gradle
├── build.gradle
├── module-a/
│   └── build.gradle
└── module-b/
    └── build.gradle
```

### 7.2 配置

**settings.gradle** (定义模块):

```groovy
rootProject.name = 'my-project'
include 'module-a', 'module-b'
```

**根 build.gradle** (共同配置):

```groovy
subprojects {
    apply plugin: 'java'

    repositories {
        mavenCentral()
    }

    dependencies {
        testImplementation 'junit:junit:4.13.2'
    }
}
```

**module-b/build.gradle** (模块间依赖):

```groovy
dependencies {
    implementation project(':module-a')  // 依赖 module-a
}
```

### 7.3 构建多模块

```bash
# 构建所有模块
./gradlew build

# 构建特定模块
./gradlew :module-a:build

# 从根目录构建特定模块的特定任务
./gradlew :module-b:test
```

## 8. 实用技巧

### 8.1 查看依赖树

**Maven**:

```bash
mvn dependency:tree
```

**Gradle**:

```bash
gradle dependencies

# 仅查看运行时依赖
gradle dependencies --configuration runtimeClasspath

# 仅查看编译时依赖
gradle dependencies --configuration compileClasspath
```

### 8.2 查看项目属性

```bash
gradle properties
```

### 8.3 增量构建和缓存

Gradle 的优势：

```bash
# Gradle 会自动跳过未改变的任务
gradle build  # 第一次：完整构建
# 修改一个文件
gradle build  # 第二次：只重新编译改变的部分

# 使用构建缓存（跨项目共享）
gradle build --build-cache
```

### 8.4 并行构建

```bash
# 并行执行独立任务
gradle build --parallel

# 在 gradle.properties 中永久启用
org.gradle.parallel=true
```

### 8.5 离线模式

```bash
gradle build --offline
```

## 9. 完整示例对比

### Maven 工作流:

```bash
mvn clean           # 清理
mvn compile         # 编译
mvn test            # 测试
mvn package         # 打包
mvn install         # 安装到本地仓库
```

### Gradle 工作流:

```bash
./gradlew clean              # 清理
./gradlew compileJava        # 编译
./gradlew test               # 测试
./gradlew assemble           # 打包（不测试）
./gradlew build              # 完整构建（测试+打包）
./gradlew publishToMavenLocal # 安装到本地 Maven 仓库
```

## 10. Gradle 的优势

1. **性能**：增量构建、构建缓存、并行执行
2. **灵活性**：编程式配置（Groovy/Kotlin），不是声明式 XML
3. **可扩展性**：容易编写自定义任务和插件
4. **多语言**：原生支持 Java、Groovy、Kotlin、Scala 等

## 快速上手建议

1. 使用 **Gradle Wrapper** (`./gradlew`)
2. 从 **`gradle tasks`** 开始了解可用任务
3. 使用 **`gradle build`** 作为日常构建命令
4. 查看 **`build/`** 目录了解输出结构
5. 参考官方文档：https://docs.gradle.org

有具体的场景或问题吗？我可以更深入地讲解！
