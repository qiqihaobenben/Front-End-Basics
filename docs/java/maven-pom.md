# Maven pom.xml 基础

POM 是 Project Object Model 的缩写，即项目对象模型，是 Maven 项目的核心配置文件。它定义了项目的元数据、依赖关系、构建配置等信息。

## pom 常用的配置

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                      http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <!-- The Basics -->
  <groupId>...</groupId>
  <artifactId>...</artifactId>
  <version>...</version>
  <packaging>...</packaging>
  <dependencies>...</dependencies>
  <parent>...</parent>
  <dependencyManagement>...</dependencyManagement>
  <modules>...</modules>
  <properties>...</properties>

  <!-- Build Settings -->
  <build>...</build>
  <reporting>...</reporting>

  <!-- More Project Information -->
  <name>...</name>
  <description>...</description>
  <url>...</url>
  <inceptionYear>...</inceptionYear>
  <licenses>...</licenses>
  <organization>...</organization>
  <developers>...</developers>
  <contributors>...</contributors>

  <!-- Environment Settings -->
  <issueManagement>...</issueManagement>
  <ciManagement>...</ciManagement>
  <mailingLists>...</mailingLists>
  <scm>...</scm>
  <prerequisites>...</prerequisites>
  <repositories>...</repositories>
  <pluginRepositories>...</pluginRepositories>
  <distributionManagement>...</distributionManagement>
  <profiles>...</profiles>
</project>
```

## 基本配置

- `project` ： pom.xml 中的根节点
- `modelVersion` : 指定 pom.xml 符合哪个版本，Maven 2 和 3 只能为 4.0.0

### maven 坐标

在 maven 中，根据 groupId、artifactId、version 组合成 groupId:artifactId:version 来唯一识别一个 jar 包。

- `groupId`: 项目组或组织的标识，标识的约定是，它以创建这个项目的组织名称的逆向域名(reverse domain name)开头。一般对应着 java 的包结构。例如 `com.example`。
- `artifactId`: 项目的唯一标识，例如 `my-project`、`tomcat`。不要在 artifactId 中包含点号(.)。
- `version`: 项目的版本号，例如 `1.0.0`。
- `packaging`: 项目的打包方式，描述了项目打包后的输出，默认是 `jar`，例如 `jar`、`war`、`pom`、`maven-plugin`, `ejb`, `ear`, `rar`, `par` 等。

#### version 详解

maven 有自己的版本规范，一般是如下定义 major version、minor version、incremental version-qualifier ，比如 1.2.3-beta-01。

- 要说明的是，maven 自己判断版本的算法是 major、minor、incremental 部分用数字比较，qualifier 部分用字符串比较，所以要小心 alpha-2 和 alpha-15 的比较关系，最好用 alpha-02 的格式。

maven 在版本管理时候可以使用几个特殊的字符串 SNAPSHOT、LATEST、RELEASE。比如 1.0-SNAPSHOT。各个部分的含义和处理逻辑如下说明：

- SNAPSHOT - 这个版本一般用于开发过程中，表示不稳定的版本。
- LATEST - 指某个特定构件的最新发布，这个发布可能是一个发布版，也可能是一个 snapshot 版，具体看哪个时间最后。
- RELEASE ：指最新的一个发布版。

#### 示例

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                      http://maven.apache.org/xsd/maven-4.0.0.xsd">
  <modelVersion>4.0.0</modelVersion>

  <groupId>com.example</groupId>
  <artifactId>my-project</artifactId>
  <version>1.0</version>
  <packaging>war</packaging>
</project>
```

## 依赖配置

- `dependencies`: 定义项目的依赖关系。
- `dependencyManagement`: 定义依赖的版本，子模块可以继承这些版本。

### dependencies

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                      https://maven.apache.org/xsd/maven-4.0.0.xsd">
  ...
  <dependencies>
    <dependency>
     <groupId>org.apache.maven</groupId>
      <artifactId>maven-embedder</artifactId>
      <version>2.0</version>
      <type>jar</type>
      <scope>test</scope>
      <optional>true</optional>
      <exclusions>
        <exclusion>
          <groupId>org.apache.maven</groupId>
          <artifactId>maven-core</artifactId>
        </exclusion>
      </exclusions>
    </dependency>
    ...
  </dependencies>
  ...
</project>
```

- groupId, artifactId, version - 和基本配置中的 groupId、artifactId、version 意义相同。
- type: 依赖的类型，对应的是基本配置中的 packaging 的类型，如果不使用 type 标签，默认是 jar。
- scope: 依赖的范围，例如 compile、provided、runtime、test、system、import。
- systemPath： 仅当依赖范围是 system 时才使用。否则，如果设置此元素，构建将失败。该路径必须是绝对路径，因此建议使用 propertie 来指定特定的路径，如$ {java.home} / lib。由于假定先前安装了系统范围依赖关系，maven 将不会检查项目的仓库，而是检查库文件是否存在。如果没有，maven 将会失败，并建议您手动下载安装。
- optional: 是否是可选依赖，让其他项目知道，当使用此项目时，不需要这种依赖性也能正常工作。默认是 false。
- exclusions: 包含一个或多个排除元素，每个排除元素都包含一个表示要排除的依赖关系的 groupId 和 artifactId。与可选项不同，排除主动从依赖关系树中删除自己。

#### scope 详解

此元素指的是生效的类路径（编译和运行时，测试等）以及如何限制依赖关系的传递性。有 5 种可用的限定范围：

- compile - 如果没有指定 scope 标签，maven 默认为这个范围。编译依赖关系在所有 classpath 中都可用。此外，这些依赖关系被传播到依赖项目。
  provided - 与 compile 类似，但是表示 jdk 或容器在运行时提供它。它只适用于编译和测试 classpath，不可传递。
  runtime - 此范围表示编译不需要依赖关系，而是用于执行。它是在运行时和测试 classpath，但不是编译 classpath。
  test - 此范围表示正常使用应用程序不需要依赖关系，仅适用于测试编译和执行阶段。它不是传递的。
  system - 此范围与 provided 类似，除了必须提供明确包含它的 jar。该 artifact 始终可用，并且不是在仓库中查找

### dependencyManagement

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                      https://maven.apache.org/xsd/maven-4.0.0.xsd">
  ...
  <dependencyManagement>
    <dependencies>
      <dependency>
        <groupId>org.apache.maven</groupId>
        <artifactId>maven-core</artifactId>
        <version>3.6.3</version>
      </dependency>
      ...
    </dependencies>
  </dependencyManagement>
  ...
</project>
```

- 通过 dependencyManagement 可以统一管理依赖的版本，子模块可以继承这些版本。

## 父项目

- `parent`: 定义项目的父项目，子项目可以继承父项目的配置。

```xml
<project xmlns="http://maven.apache.org/POM/4.0.0"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
                      https://maven.apache.org/xsd/maven-4.0.0.xsd">
  ...
  <parent>
    <groupId>com.example</groupId>
    <artifactId>parent-project</artifactId>
    <version>1.0</version>
  </parent>
  ...
</project>
```

- 通过 parent 可以统一管理子项目的配置，例如编译器版本、插件等。

在 Maven 的 `pom.xml` 中，`parent` 标签的核心作用是**实现项目配置的继承**，通过父模块统一管理子模块的公共配置（如依赖版本、插件、属性等），避免重复代码，提升项目可维护性。以下是详细解释和实际示例：

### **一、parent 的核心作用**

1. **统一项目坐标**：
   父模块定义 `groupId`、`artifactId`、`version`（项目三要素），子模块无需重复声明，直接继承。
   （注：子模块可通过 `groupId`、`artifactId`、`version` 覆盖父模块，但通常不建议）

2. **集中管理依赖版本**：
   父模块通过 `<dependencyManagement>` 声明依赖的版本和可选配置，子模块引用依赖时可省略版本号（自动继承），避免不同子模块使用冲突的依赖版本。

3. **统一插件配置**：
   父模块通过 `<build>` 定义公共插件（如编译插件、打包插件）的配置，子模块无需重复配置，直接复用。

4. **共享属性定义**：
   父模块通过 `<properties>` 定义公共属性（如 Java 版本、依赖版本变量），子模块可直接引用这些属性，提升灵活性。

### **二、实际示例：父模块与子模块的继承关系**

#### **场景说明**

假设我们有一个 Java 项目包含 3 个子模块：`web-module`（Web 层）、`service-module`（业务层）、`dao-module`（数据访问层）。所有子模块需要共享以下配置：

- 统一的 `groupId`（`com.example`）和 `version`（`1.0.0`）。
- 统一的 Spring Boot 依赖版本（如 `3.2.0`）。
- 统一的 Java 编译版本（`17`）。

#### **步骤 1：创建父模块（parent-project）**

父模块的 `pom.xml` 定义公共配置：

```xml
<!-- parent-project/pom.xml -->
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <!-- 父模块自身的坐标 -->
    <modelVersion>4.0.0</modelVersion>
    <groupId>com.example</groupId>
    <artifactId>parent-project</artifactId>
    <version>1.0.0</version>
    <packaging>pom</packaging>  <!-- 父模块必须用 pom 打包 -->

    <!-- 声明这是一个父模块（供子模块继承） -->
    <name>Parent Project</name>
    <description>公共父模块，管理子模块配置</description>

    <!-- 公共属性 -->
    <properties>
        <java.version>17</java.version>
        <spring-boot.version>3.2.0</spring-boot.version>
    </properties>

    <!-- 依赖管理（统一版本） -->
    <dependencyManagement>
        <dependencies>
            <!-- Spring Boot Starter Web -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-web</artifactId>
                <version>${spring-boot.version}</version>
            </dependency>

            <!-- Spring Boot Starter JDBC -->
            <dependency>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-starter-jdbc</artifactId>
                <version>${spring-boot.version}</version>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <!-- 插件管理（统一插件配置） -->
    <build>
        <pluginManagement>
            <plugins>
                <!-- 编译插件：统一 Java 版本 -->
                <plugin>
                    <groupId>org.apache.maven.plugins</groupId>
                    <artifactId>maven-compiler-plugin</artifactId>
                    <version>3.11.0</version>
                    <configuration>
                        <source>${java.version}</source>
                        <target>${java.version}</target>
                    </configuration>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>
</project>
```

#### **步骤 2：创建子模块（如 web-module）**

子模块通过 `parent` 标签继承父模块的配置，仅需声明自身特有的 `artifactId`，其他配置（`groupId`、`version`、依赖版本、插件）自动继承：

```xml
<!-- web-module/pom.xml -->
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">

    <!-- 继承父模块 -->
    <parent>
        <groupId>com.example</groupId>
        <artifactId>parent-project</artifactId>
        <version>1.0.0</version>
        <!-- 父模块的相对路径（默认是 ../pom.xml，若父模块在同级目录需调整） -->
        <relativePath>../parent-project/pom.xml</relativePath>
    </parent>

    <!-- 子模块自身的坐标（仅需声明 artifactId） -->
    <modelVersion>4.0.0</modelVersion>
    <artifactId>web-module</artifactId>
    <name>Web Module</name>
    <description>Web 层模块</description>

    <!-- 引用父模块管理的依赖（无需写版本号） -->
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>
</project>
```

### **三、关键细节说明**

#### 1. 父模块的 `packaging` 必须是 `pom`

父模块不包含实际代码，仅用于配置管理，因此 `packaging` 必须为 `pom`（默认值）。

#### 2. 子模块如何定位父模块？

通过 `<relativePath>` 标签指定父模块 `pom.xml` 的相对路径（默认是 `../pom.xml`，即父模块在当前模块的上一级目录）。若父模块存在于本地 Maven 仓库或远程仓库（如公共父模块），可省略 `<relativePath>`，Maven 会自动从仓库查找。

#### 3. 依赖管理的优先级

子模块引用依赖时，若未声明版本号，会使用父模块 `<dependencyManagement>` 中定义的版本；若子模块显式声明了版本号，则覆盖父模块的版本。

#### 4. 常见的“官方父模块”示例

Spring Boot 项目中，`spring-boot-starter-parent` 是典型的父模块，它帮我们管理了大量依赖的版本（如 Spring、Hibernate、Tomcat 等），并定义了默认的插件配置（如 `maven-jar-plugin`）。

```xml
<!-- Spring Boot 项目的父模块 -->
<parent>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-parent</artifactId>
    <version>3.2.0</version>
    <relativePath/> <!-- 从 Maven 仓库查找 -->
</parent>
```

### **四、为什么需要 parent？**

- **减少重复配置**：避免每个子模块重复声明 `groupId`、`version`、依赖版本等。
- **统一管理**：父模块修改依赖版本后，所有子模块自动生效，避免版本冲突。
- **提升可维护性**：公共配置集中在父模块，修改时只需调整一处。

### **五、总结**

`parent` 是 Maven 实现**配置继承**的核心机制，通过父模块统一管理子模块的公共配置（坐标、依赖、插件、属性），大幅减少重复代码，是大型项目或多模块项目的必备设计。实际开发中，无论是自定义父模块还是使用官方父模块（如 `spring-boot-starter-parent`），都是提升项目质量的关键实践。

### spring-boot-starter-parent 父依赖详解

以下是关于该 Maven 配置的详细解析：

---

### **一、配置含义与作用**

这段 XML 是 Maven 的 **父 POM（Project Object Model）声明**，用于继承 Spring Boot 的预定义配置。其核心作用是：

1. **统一版本管理**：自动管理 Spring Boot 相关依赖的版本
2. **默认配置继承**：预置编译、打包、测试等插件配置
3. **简化依赖声明**：无需手动指定常见依赖的版本号

---

### **二、核心配置解析**

| **标签**          | **作用**                                                                     |
| ----------------- | ---------------------------------------------------------------------------- |
| `<groupId>`       | 父项目的组织标识（`org.springframework.boot` 表示 Spring 官方维护）          |
| `<artifactId>`    | 父项目的唯一标识（`spring-boot-starter-parent` 是 Spring Boot 的基准父 POM） |
| `<version>`       | 指定 Spring Boot 版本（此处为 3.4.5）                                        |
| `<relativePath/>` | **关键配置**：强制 Maven 跳过本地文件查找，直接从仓库下载父 POM              |

---

### **三、`spring-boot-starter-parent` 包含的主要配置**

#### 1. **预定义属性（Properties）**

```xml
<properties>
    <java.version>17</java.version>          <!-- 默认 JDK 版本 -->
    <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
    <spring-boot.version>3.4.5</spring-boot.version>
</properties>
```

#### 2. **依赖管理（Dependency Management）**

- 管理 200+ 个 Spring Boot 相关依赖的版本
- 子模块声明依赖时无需指定版本号：
  ```xml
  <dependency>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-starter-web</artifactId>
      <!-- 无需写 <version> -->
  </dependency>
  ```

#### 3. **插件配置（Plugins）**

- **打包插件**：生成可执行 JAR/WAR
  ```xml
  <plugin>
      <groupId>org.springframework.boot</groupId>
      <artifactId>spring-boot-maven-plugin</artifactId>
  </plugin>
  ```
- **资源过滤**：处理 `application.properties` 中的占位符
- **测试配置**：预置 JUnit、Mockito 等测试框架

#### 4. **资源过滤规则**

- 自动处理 `src/main/resources` 下的配置文件
- 支持 Maven 属性替换（如 `${project.version}`）

---

### **四、`<relativePath/>` 的作用原理**

- **默认行为**：Maven 会先在本地项目的 `../pom.xml` 路径中查找父 POM
- **设置 `<relativePath/>`**：
  ✅ 强制跳过本地文件查找
  ✅ **直接访问 Maven 仓库**（本地仓库 → 远程仓库）
  ✅ 避免因本地多模块项目结构导致的路径错误

---

### **五、Maven 如何找到父 POM**

1. **本地仓库查找**

   - 路径：`~/.m2/repository/org/springframework/boot/spring-boot-starter-parent/3.4.5/`
   - 文件：`spring-boot-starter-parent-3.4.5.pom`

2. **远程仓库下载**
   - 若本地不存在，则从 `pom.xml` 中配置的仓库（如 Maven Central）下载
   - Spring Boot 官方 POM 发布在 [Maven Central](https://repo1.maven.org/maven2/org/springframework/boot/spring-boot-starter-parent/3.4.5/)

---

### **六、验证配置生效的方法**

1. **查看生效的父 POM**
   ```bash
   mvn help:effective-pom
   ```
2. **检查依赖版本**
   ```bash
   mvn dependency:tree
   ```

## 模块

- `modules`: 定义项目的模块，可以编译多个模块。

## 构建配置

- `build`: 定义项目的构建配置，例如编译器版本、插件等。
- `reporting`: 定义项目的报告配置，例如代码覆盖率报告。

### build

在 Maven 项目中，`pom.xml`的`<build>`部分用于配置项目的构建过程。

---

#### **1. 核心作用**

`<build>`标签控制 Maven 构建的细节，例如：

- **源代码目录**（默认`src/main/java`）
- **资源文件目录**（默认`src/main/resources`）
- **插件配置**（如编译、打包、测试等）
- **构建的输出目录**（默认`target/classes`）

---

#### **2. 默认约定**

Maven 遵循“约定优于配置”原则。如果没有自定义`<build>`，它会按默认路径和插件工作。例如：

- 代码编译到`target/classes`
- 打包生成`target/*.jar`
- 使用`maven-compiler-plugin`编译 Java 代码

---

#### **3. 常用配置项**

##### **a. 修改默认路径**

```xml
<build>
    <sourceDirectory>src/java</sourceDirectory>  <!-- 修改源码目录 -->
    <resources>
        <resource>
            <directory>src/config</directory>    <!-- 添加额外资源目录 -->
            <excludes>
                <exclude>*.tmp</exclude>          <!-- 排除临时文件 -->
            </excludes>
        </resource>
    </resources>
</build>
```

##### **b. 配置插件**

最常见的场景：**指定 Java 版本**。

```xml
<plugins>
    <plugin>
        <groupId>org.apache.maven.plugins</groupId>
        <artifactId>maven-compiler-plugin</artifactId>
        <version>3.8.1</version>
        <configuration>
            <source>1.8</source>  <!-- 使用Java 8编译 -->
            <target>1.8</target>
        </configuration>
    </plugin>
</plugins>
```

##### **c. 资源过滤**

在资源文件中使用 Maven 属性（如`${project.version}`）：

```xml
<resources>
    <resource>
        <directory>src/main/resources</directory>
        <filtering>true</filtering>  <!-- 开启过滤 -->
    </resource>
</resources>
```

---

#### **4. 构建生命周期**

Maven 构建分为多个阶段（如`compile`, `test`, `package`）。每个阶段会触发绑定的插件目标（goal）。例如：

- `mvn compile` → 执行`maven-compiler-plugin`的`compile`目标
- `mvn package` → 执行打包插件（如`maven-jar-plugin`）

---

#### **5. 高级示例：生成可执行 JAR**

配置`maven-assembly-plugin`将所有依赖打包成一个 JAR：

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-assembly-plugin</artifactId>
    <version>3.3.0</version>
    <configuration>
        <archive>
            <manifest>
                <mainClass>com.example.Main</mainClass>  <!-- 指定主类 -->
            </manifest>
        </archive>
        <descriptorRefs>
            <descriptorRef>jar-with-dependencies</descriptorRef>  <!-- 包含依赖 -->
        </descriptorRefs>
    </configuration>
    <executions>
        <execution>
            <phase>package</phase>  <!-- 绑定到package阶段 -->
            <goals>
                <goal>single</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

执行`mvn package`后，会生成一个包含所有依赖的可执行 JAR。

---

#### **6. 总结**

- **为什么需要`<build>`？** → 定制化构建流程，突破默认约定。
- **常见用途** → 改路径、配插件、过滤资源、打包特殊需求。
- **插件是关键** → 通过插件扩展构建能力（如代码检查、生成文档、部署等）。

通过合理配置`<build>`，你可以让 Maven 灵活适应各种项目需求！

## 项目信息

- `name`: 项目的名称。
- `description`: 项目的描述。
- `url`: 项目的主页。
- `inceptionYear`: 项目的起始年份。
- `licenses`: 项目的许可证。
- `organization`: 项目的组织信息。
- `developers`: 项目的开发者信息。
- `contributors`: 项目的贡献者信息。

## 环境设置

- `issueManagement`: 项目的 issue 管理信息。
- `ciManagement`: 项目的持续集成管理信息。
- `mailingLists`: 项目的邮件列表信息。
- `scm`: 项目的源码管理信息。
- `prerequisites`: 项目的先决条件。
- `repositories`: 项目的仓库信息。
- `pluginRepositories`: 项目的插件仓库信息。
- `distributionManagement`: 项目的分发管理信息。
- `profiles`: 项目的配置文件信息。

## 总结

Maven 的 pom.xml 文件是 Maven 项目的核心配置文件，通过它可以定义项目的元数据、依赖关系、构建配置等信息。通过合理的配置，可以提高项目的可维护性和可扩展性。

## 参考资料

- [Maven 官方文档](https://maven.apache.org/guides/introduction/introduction-to-the-pom.html)
- [Maven 中文文档](https://maven.apache.org/guides/introduction/introduction-to-the-pom.html)

## 问题

1. 如何在 pom.xml 中定义项目的依赖关系？
2. 如何在 pom.xml 中定义项目的构建配置

## 模块管理

Maven 支持模块化管理，可以把一个大项目拆成几个模块：

- 可以通过继承在 parent 的 pom.xml 统一定义重复配置；
- 可以通过<modules>编译多个模块。

```xml
<modules>
    <module>module1</module>
    <module>module2</module>
</modules>
```
