# Maven

Maven 是一个 Java 项目管理和构建工具，它可以定义项目结构、项目依赖，并使用统一的方式进行自动化构建，是 Java 项目不可缺少的工具。

## 为什么需要 Maven

在不使用 Maven 之前，先来看看一个 Java 项目需要的东西。

首先，我们需要确定引入哪些依赖包。例如，如果我们需要用到 commons logging，我们就必须把 commons logging 的 jar 包放入 classpath。如果我们还需要 log4j，就需要把 log4j 相关的 jar 包都放到 classpath 中。这些就是**依赖包的管理**。

其次，我们要确定**项目的目录结构**。例如，src 目录存放 Java 源码，resources 目录存放配置文件，bin 目录存放编译生成的.class 文件。

此外，我们还需要**配置环境**，例如 JDK 的版本，编译打包的流程，当前代码的版本号。

最后，除了使用 Eclipse 这样的 IDE 进行编译外，我们还必须能通过**命令行工具进行编译**，才能够让项目在一个独立的服务器上编译、测试、部署。

这些工作难度不大，但是非常琐碎且耗时。如果每一个项目都自己搞一套配置，肯定会一团糟。我们需要的是一个标准化的 Java 项目管理和构建工具。

Maven 就是是专门为 Java 项目打造的管理和构建工具，它的主要功能有：

- 提供了一套标准化的项目结构；
- 提供了一套标准化的构建流程（编译，测试，打包，发布……）；
- 提供了一套依赖管理机制。

## Maven 的主要功能

主要功能如下：

- 项目结构标准化：Maven 为 Java 项目提供了一套标准化的目录结构，例如 `src/main/java` 用于存放 Java 源码，`src/main/resources` 用于存放配置文件，`src/test/java` 用于存放测试代码，`src/test/resources` 用于存放测试配置文件。
- 构建流程标准化：Maven 提供了一套标准化的构建流程，包括编译、测试、打包、发布等步骤。通过配置 `pom.xml` 文件，可以自定义构建流程。
- 依赖管理：Maven 提供了一套依赖管理机制，可以方便地管理项目依赖。通过在 `pom.xml` 文件中声明依赖，Maven 会自动下载并管理这些依赖。
- 插件机制：Maven 提供了丰富的插件机制，可以方便地扩展构建功能。例如，可以使用 `maven-compiler-plugin` 插件来配置编译选项，使用 `maven-surefire-plugin` 插件来配置测试选项。
- 仓库管理：Maven 提供了仓库管理机制，可以方便地管理项目依赖。Maven 会从中央仓库、本地仓库和远程仓库中下载依赖。

### Maven 的项目目录

一个使用 Maven 管理的普通的 Java 项目，它的目录结构默认如下：

```
a-maven-project
├── pom.xml
├── src
│ ├── main
│ │ ├── java
│ │ └── resources
│ └── test
│ | ├── java
│ | └── resources
└── target
```

项目的根目录 a-maven-project 是项目名，它有一个项目描述文件 pom.xml，存放 Java 源码的目录是 src/main/java，存放资源文件的目录是 src/main/resources，存放测试源码的目录是 src/test/java，存放测试资源的目录是 src/test/resources，最后，所有编译、打包生成的文件都放在 target 目录里。这些就是一个 Maven 项目的标准目录结构。

所有的目录结构都是约定好的标准结构，我们千万不要随意修改目录结构。使用标准结构不需要做任何配置，Maven 就可以正常使用。

## 依赖管理

设想一下手动安装依赖的过程，例如安装 Unit，JavaMail，MySQL 驱动等等，方法是通过搜索引擎搜索到项目的官网，然后手动下载 zip 包，解压，放入 classpath。如果依赖包还有依赖，还得重复这些步骤，这个过程非常繁琐。

aven 解决了依赖管理问题。例如，我们的项目依赖 abc 这个 jar 包，而 abc 又依赖 xyz 这个 jar 包。当我们声明了 abc 的依赖时，Maven 自动把 abc 和 xyz 都加入了我们的项目依赖，不需要我们自己去研究 abc 是否需要依赖 xyz。

因此，Maven 其中一个作用就是解决依赖管理。我们声明了自己的项目需要 abc，Maven 会自动导入 abc 的 jar 包，再判断出 abc 需要 xyz，又会自动导入 xyz 的 jar 包，这样，最终我们的项目会依赖 abc 和 xyz 两个 jar 包。

Maven 的依赖管理主要通过 `pom.xml` 文件来实现。在 `pom.xml` 文件中，可以声明项目的依赖，Maven 会自动下载并管理这些依赖。

一个复杂依赖示例：

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
        <version>1.4.2.RELEASE</version>
    </dependency>
</dependencies>
```

当我们声明一个 spring-boot-starter-web 依赖时，Maven 会自动解析并判断最终需要大概二三十个其他依赖,如果我们自己去手动管理这些依赖是非常费时费力的，而且出错的概率很大。

```
spring-boot-starter-web
  spring-boot-starter
    spring-boot
    sprint-boot-autoconfigure
    spring-boot-starter-logging
      logback-classic
        logback-core
        slf4j-api
      jcl-over-slf4j
        slf4j-api
      jul-to-slf4j
        slf4j-api
      log4j-over-slf4j
        slf4j-api
    spring-core
    snakeyaml
  spring-boot-starter-tomcat
    tomcat-embed-core
    tomcat-embed-el
    tomcat-embed-websocket
      tomcat-embed-core
  jackson-databind
  ...
```

### 唯一 ID 确定依赖

对于某个依赖，Maven 只需要 3 个变量即可唯一确定某个 jar 包：

- groupId：属于组织的名称，类似 Java 的包名；
- artifactId：该 jar 包自身的名称，类似 Java 的类名；
- version：该 jar 包的版本。

通过上述 3 个变量，即可唯一确定某个 jar 包。Maven 通过对 jar 包进行 PGP 签名确保任何一个 jar 包一经发布就无法修改。修改已发布 jar 包的唯一方法是发布一个新版本。

因此，某个 jar 包一旦被 Maven 下载过，即可永久地安全缓存在本地。

**注：只有以-SNAPSHOT 结尾的版本号会被 Maven 视为开发版本，开发版本每次都会重复下载，这种 SNAPSHOT 版本只能用于内部私有的 Maven repo，公开发布的版本不允许出现 SNAPSHOT。**

### 依赖范围

在 `pom.xml` 文件中声明依赖时，可以指定依赖的范围。依赖范围决定了依赖在项目中的使用范围。

Maven 支持以下几种依赖范围：

- `compile`：默认范围，编译、测试和运行时都会使用该 jar 包。
- `provided`：编译和测试时使用，运行时由容器（JDK 或某个服务器）提供。
- `runtime`：测试和运行时使用，编译时不使用。
- `test`：测试时使用，编译和运行时不使用。
- `system`：类似于 `provided`，但需要显式指定依赖的路径。
- `import`：仅在 `<dependencyManagement>` 中使用，用于导入其他 `pom.xml` 文件中的依赖管理配置。

其中，默认的 compile 是最常用的，Maven 会把这种类型的依赖直接放入 classpath。

test 依赖表示仅在测试时使用，正常运行时并不需要。最常用的 test 依赖就是 JUnit：

```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter-api</artifactId>
    <version>5.3.2</version>
    <scope>test</scope>
</dependency>
```

runtime 依赖表示编译时不需要，但运行时需要。最典型的 runtime 依赖是 JDBC 驱动，例如 MySQL 驱动：

```xml
<dependency>
    <groupId>mysql</groupId>
    <artifactId>mysql-connector-java</artifactId>
    <version>5.1.48</version>
    <scope>runtime</scope>
</dependency>
```

provided 依赖表示编译时需要，但运行时不需要。最典型的 provided 依赖是 Servlet API，编译的时候需要，但是运行时，Servlet 服务器内置了相关的 jar，所以运行期不需要：

```xml
<dependency>
    <groupId>jakarta.servlet</groupId>
    <artifactId>jakarta.servlet-api</artifactId>
    <version>4.0.0</version>
    <scope>provided</scope>
</dependency>
```

### 依赖排除

在 `pom.xml` 文件中，使用 Maven 来管理项目依赖时，可能会遇到某些库引入了你不需要的传递性依赖。为了避免引入这些不必要的依赖，可以在声明依赖时使用 `<exclusions>` 元素来排除特定的依赖。

#### 如何配置 `exclusions`

以下是一个完整的示例，展示如何在 `pom.xml` 中排除某个传递性依赖：

```xml
<dependency>
    <groupId>com.example</groupId>
    <artifactId>example-library</artifactId>
    <version>1.0.0</version>
    <exclusions>
        <exclusion>
            <groupId>com.unwanted</groupId>
            <artifactId>unwanted-library</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```

#### 解释

- **`<dependency>`**：定义一个项目依赖。
- **`<groupId>`**：依赖的组织标识符。
- **`<artifactId>`**：依赖的项目名称。
- **`<version>`**：依赖的版本号。
- **`<exclusions>`**：用于排除特定传递性依赖的容器元素。
- **`<exclusion>`**：指定要排除的单个依赖。
  - **`<groupId>`**：要排除的依赖的组织标识符。
  - **`<artifactId>`**：要排除的依赖的项目名称。

#### 使用场景

- **避免冲突**：多个依赖可能引入不同版本的同一库，导致版本冲突。
- **减少体积**：排除不必要的库，减小应用体积，提高性能。
- **安全性**：移除已知存在漏洞的传递性依赖。

## Maven 的基本命令

Maven 是一个强大的项目管理和构建工具，提供了多种命令来管理项目的生命周期、依赖和构建过程。以下是一些常用的 Maven 命令及其用途：

### 常用 Maven 命令

1. **`mvn clean`**

   - 清理项目，删除 `target` 目录及其所有内容，通常用于清除旧的构建结果。

2. **`mvn compile`**

   - 编译项目的源代码，将 `.java` 文件编译为 `.class` 文件。

3. **`mvn test`**

   - 运行项目中的测试用例。Maven 会使用测试框架（如 JUnit 或 TestNG）执行测试。

4. **`mvn package`**

   - 编译项目并打包为 JAR 或 WAR 文件，存放在 `target` 目录下。

5. **`mvn install`**

   - 将项目的构建输出（JAR、WAR 等）安装到本地仓库中，以便其他项目使用。

6. **`mvn deploy`**

   - 将项目打包并发布到远程仓库，通常用于项目发布阶段。

7. **`mvn validate`**

   - 验证项目是否正确并且所有必要信息可用。

8. **`mvn site`**

   - 生成项目站点文档，包括项目报告、代码覆盖率、依赖关系等。

9. **`mvn dependency:resolve`**

   - 解析项目的所有依赖并下载到本地仓库。

10. **`mvn dependency:tree`**

    - 显示项目依赖树，帮助分析依赖关系和冲突。

11. **`mvn clean install`**
    - 先清理项目再编译、测试、打包并安装到本地仓库。这是一个常用的组合命令。

### 使用说明

- **命令行执行**：在项目的根目录下使用命令行执行这些命令，例如：

  ```bash
  mvn clean package
  ```

- **组合使用**：Maven 命令可以组合使用，以完成多个构建步骤。

- **插件支持**：许多命令是通过 Maven 插件实现的，用户可以自定义或扩展这些功能。

## 常见的关键问题

### Maven 如何知道从何处下载所需的依赖？也就是相关的 jar 包？

Maven 维护了一个中央仓库（repo1.maven.org），所有第三方库将自身的 jar 以及相关信息上传至中央仓库，Maven 就可以从中央仓库把所需依赖下载到本地。

Maven 并不会每次都从中央仓库下载 jar 包。一个 jar 包一旦被下载过，就会被 Maven 自动缓存在本地目录（用户主目录的.m2 目录），所以，除了第一次编译时因为下载需要时间会比较慢，后续过程因为有本地缓存，并不会重复下载相同的 jar 包。

#### Maven 镜像

除了可以从 Maven 的中央仓库下载外，还可以从 Maven 的镜像仓库下载。如果访问 Maven 的中央仓库非常慢，我们可以选择一个速度较快的 Maven 的镜像仓库。Maven 镜像仓库定期从中央仓库同步。

中国区用户可以使用阿里云提供的 Maven 镜像仓库。使用 Maven 镜像仓库需要一个配置，在用户主目录下进入.m2 目录，创建一个 settings.xml 配置文件，内容如下：

```xml
<settings>
    <mirrors>
        <mirror>
            <id>aliyun</id>
            <name>aliyun</name>
            <mirrorOf>central</mirrorOf>
            <!-- 国内推荐阿里云的Maven镜像 -->
            <url>https://maven.aliyun.com/repository/central</url>
        </mirror>
    </mirrors>
</settings>
```

#### 下载依赖的几种方式以及如何使用

- 中央仓库
- 远程仓库
- 本地仓库
- 本地文件

#### 1. 中央仓库（Central Repository）

Maven 的中央仓库是一个公开的仓库，存放了大量的开源库。默认情况下，Maven 会从中央仓库下载项目依赖。

**使用方式**：

- 在 `pom.xml` 中声明依赖时，无需额外配置，Maven 会自动从中央仓库下载。

```xml
<dependency>
    <groupId>org.apache.commons</groupId>
    <artifactId>commons-lang3</artifactId>
    <version>3.12.0</version>
</dependency>
```

#### 2. 远程仓库（Remote Repository）

远程仓库可以是你自己的私有仓库或其他第三方仓库。如果依赖不在中央仓库中，可以配置远程仓库。

**配置方式**：

- 在 `pom.xml` 或 `settings.xml` 中添加仓库配置。

```xml
<repositories>
    <repository>
        <id>my-private-repo</id>
        <url>http://repo.mycompany.com/maven2</url>
    </repository>
</repositories>
```

#### 3. 本地仓库（Local Repository）

本地仓库是存储在你设备上的一个目录，Maven 会首先在本地仓库中查找依赖。如果找不到，再从远程仓库下载。

**位置**：

- 默认路径为 `~/.m2/repository`。可以在 `settings.xml` 中通过 `<localRepository>` 标签自定义本地仓库路径。

**使用方式**：

- 正常使用，无需特殊配置，Maven 会自动管理。

#### 4. 本地包（Local JAR）

有时，某些依赖可能没有在任何仓库中发布，需要手动安装到本地仓库。

**使用方式**：

- 使用 `mvn install:install-file` 命令手动安装。

```bash
mvn install:install-file -Dfile=/path/to/your.jar -DgroupId=com.example -DartifactId=your-artifact -Dversion=1.0.0 -Dpackaging=jar
```

#### 选择合适的方式

- **中央仓库**：优先使用，简单直接。
- **远程仓库**：当依赖不在中央仓库中，或需要使用私有库时使用。
- **本地仓库**：自动管理，用户无需干预。
- **本地包**：适用于没有发布在仓库中的内部库或临时使用的库。

### 如何搜索第三方组件

如果我们要引用一个第三方组件，比如 okhttp，如何确切地获得它的 groupId、artifactId 和 version？方法是通过 [search.maven.org](https://search.maven.org/) 搜索关键字，找到对应的组件后，直接复制信息。

### 什么是 jar 包？

在 Java 中，`JAR` 包（Java ARchive）是一种用于分发、部署和使用 Java 应用程序或库的压缩文件格式。它类似于 ZIP 文件，但专门用于 Java 环境。JAR 包通常包含 Java 类文件、资源（如图像、配置文件）和一个特殊的清单文件（`MANIFEST.MF`），用于指定包的元数据和配置信息。

#### JAR 包的特点

1. **压缩格式**：JAR 包使用 ZIP 压缩格式，减少了文件大小，便于分发和传输。

2. **跨平台**：因为 Java 本身是跨平台的，JAR 包可以在任何支持 Java 的平台上运行。

3. **包含多种资源**：除了类文件外，JAR 包还可以包含图片、音频、文本等资源文件。

4. **可执行 JAR**：通过配置清单文件，JAR 可以被设定为可执行文件，允许直接通过 Java 命令运行整个应用程序。

#### 使用 JAR 包

- **创建 JAR 包**：使用 Java 提供的 `jar` 工具可以创建 JAR 包。例如：

  ```bash
  jar cf myapp.jar -C bin/ .
  ```

  上述命令将把 `bin` 目录下的所有文件打包成 `myapp.jar`。

- **运行 JAR 包**：如果 JAR 包是可执行的，可以直接运行：

  ```bash
  java -jar myapp.jar
  ```

- **查看 JAR 包内容**：可以使用 `jar` 工具查看 JAR 包的内容：
  ```bash
  jar tf myapp.jar
  ```

`jar` 命令是 Java 开发工具包（JDK）中的一个实用工具，用于创建、管理和解压 JAR 文件（Java ARchive）。JAR 文件是用于打包多个文件（如类文件和资源）以便分发的压缩文件格式。以下是 `jar` 命令的详细介绍：

#### jar 命令基本语法

```bash
jar [options] [jar-file] [manifest-file] [entry-point] [-C dir] files
```

##### 常用选项

- **`c`**：创建一个新的 JAR 文件。
- **`x`**：从现有 JAR 文件中解压文件。
- **`t`**：列出 JAR 文件的内容。
- **`u`**：更新现有的 JAR 文件。
- **`f`**：指定 JAR 文件名（该选项通常与 `c`、`x`、`t`、`u` 结合使用）。
- **`v`**：生成详细输出，显示详细信息。
- **`m`**：包含清单文件。
- **`e`**：指定 JAR 文件的入口点（用于执行 JAR 文件时）。
- **`C`**：切换目录并添加文件。

##### 常用命令示例

1. **创建 JAR 文件**

   将当前目录 (`.`) 下的所有文件打包成 `myapp.jar`：

   ```bash
   jar cf myapp.jar .
   ```

2. **创建带清单文件的 JAR 文件**

   使用自定义清单文件 `manifest.mf` 打包：

   ```bash
   jar cmf manifest.mf myapp.jar .
   ```

3. **查看 JAR 文件内容**

   列出 `myapp.jar` 的内容：

   ```bash
   jar tf myapp.jar
   ```

4. **解压 JAR 文件**

   将 `myapp.jar` 解压到当前目录：

   ```bash
   jar xf myapp.jar
   ```

5. **更新 JAR 文件**

   更新 `myapp.jar` 中的文件：

   ```bash
   jar uf myapp.jar updatedFile.class
   ```

6. **指定入口点创建可执行 JAR**

   创建一个可执行的 JAR 文件，入口点为 `com.example.Main`：

   ```bash
   jar cfe myapp.jar com.example.Main -C classes .
   ```

##### 注意事项

- **清单文件**：清单文件 (`MANIFEST.MF`) 包含关于 JAR 文件的信息，如版本号、入口点等。可以通过 `m` 选项指定自定义清单文件。

- **路径问题**：使用 `-C` 选项可以在打包时切换目录，这有助于保持包结构。

- **入口点**：使用 `e` 选项可以指定可执行 JAR 的入口点类，这样可以直接运行 JAR 文件。
