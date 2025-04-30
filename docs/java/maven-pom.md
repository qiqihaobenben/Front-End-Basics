# Maven pom.xml 基础

POM 是 Project Object Model 的缩写，即项目对象模型，是 Maven 项目的核心配置文件。它定义了项目的元数据、依赖关系、构建配置等信息。

## pom 常用的配置

```
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

## 模块

- `modules`: 定义项目的模块，可以编译多个模块。

## 构建配置

- `build`: 定义项目的构建配置，例如编译器版本、插件等。
- `reporting`: 定义项目的报告配置，例如代码覆盖率报告。

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

```

```
