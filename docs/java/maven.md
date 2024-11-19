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

### 依赖管理

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

#### 唯一 ID 确定依赖

对于某个依赖，Maven 只需要 3 个变量即可唯一确定某个 jar 包：

- groupId：属于组织的名称，类似 Java 的包名；
- artifactId：该 jar 包自身的名称，类似 Java 的类名；
- version：该 jar 包的版本。

通过上述 3 个变量，即可唯一确定某个 jar 包。Maven 通过对 jar 包进行 PGP 签名确保任何一个 jar 包一经发布就无法修改。修改已发布 jar 包的唯一方法是发布一个新版本。

因此，某个 jar 包一旦被 Maven 下载过，即可永久地安全缓存在本地。

**注：只有以-SNAPSHOT 结尾的版本号会被 Maven 视为开发版本，开发版本每次都会重复下载，这种 SNAPSHOT 版本只能用于内部私有的 Maven repo，公开发布的版本不允许出现 SNAPSHOT。**

#### 依赖范围

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

#### 依赖排除

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

##### 解释

- **`<dependency>`**：定义一个项目依赖。
- **`<groupId>`**：依赖的组织标识符。
- **`<artifactId>`**：依赖的项目名称。
- **`<version>`**：依赖的版本号。
- **`<exclusions>`**：用于排除特定传递性依赖的容器元素。
- **`<exclusion>`**：指定要排除的单个依赖。
  - **`<groupId>`**：要排除的依赖的组织标识符。
  - **`<artifactId>`**：要排除的依赖的项目名称。

##### 使用场景

- **避免冲突**：多个依赖可能引入不同版本的同一库，导致版本冲突。
- **减少体积**：排除不必要的库，减小应用体积，提高性能。
- **安全性**：移除已知存在漏洞的传递性依赖。

### 构建流程标准化

Maven 不但有标准化的项目结构，而且还有一套标准化的构建流程，可以自动化实现编译，打包，发布，等等。

#### Lifecycle、Phase 和 Goal

Maven 的生命周期（lifecycle）是由一系列阶段（phase）组成的，每个阶段又包含了一个或多个目标（goal）。Maven 的构建过程就是按照生命周期、阶段和目标的顺序依次执行的。

- lifecycle 它包含一个或多个 phase，相当于 Java 的 package；
- phase 它包含一个或多个 goal，相当于 Java 的 class；
- goal 它其实才是真正干活的，相当于 class 的 method。

##### Goal

执行一个 phase 会触发一个或多个 goal，goal 的命名总是 abc:xyz 这种形式。

| 执行的 Phase | 对应执行的 Goal  |
| :----------- | :--------------- |
| compile      | compiler:compile |
| test         | surefire:test    |

大多数情况，我们只要指定 phase，就默认执行这些 phase 默认绑定的 goal，只有少数情况，我们可以直接指定运行一个 goal，例如，启动 Tomcat 服务器：

```
mvn tomcat:run
```

所以通常情况，我们总是执行 phase 默认绑定的 goal，因此不必指定 goal。

#### 以内置的生命周期`default`为例，它包含以下阶段：

在 Maven 的构建生命周期中，`default` 生命周期是最核心的部分，涵盖了从验证到部署的完整过程。每个阶段都有特定的目标（goal），这些目标由 Maven 插件执行。以下是 `default` 生命周期中每个阶段的详细说明：

##### 1. `validate`

- **作用**：验证项目的配置信息是否正确，并确保所有必要的信息可用。
- **常用 goal**：没有特定的默认 goal，通常根据具体插件和配置执行自定义的验证。

##### 2. `initialize`

- **作用**：初始化构建状态。例如，设置属性或环境变量。
- **常用 goal**：没有特定的默认 goal，通常用于插件的初始化步骤。

##### 3. `generate-sources`

- **作用**：生成源代码。
- **常用 goal**：通常由代码生成插件执行，如 `antlr:generate`。

##### 4. `process-sources`

- **作用**：处理生成的源代码，可能包括代码格式化或其他处理。
- **常用 goal**：没有特定的默认 goal，通常由代码处理插件执行。

##### 5. `generate-resources`

- **作用**：生成资源文件。
- **常用 goal**：没有特定的默认 goal，通常由资源生成插件执行。

##### 6. `process-resources`

- **作用**：复制和处理资源文件到目标目录。
- **常用 goal**：`resources:resources`，将资源文件复制到 `target` 目录。

##### 7. `compile`

- **作用**：编译项目的源代码。
- **常用 goal**：`compiler:compile`，将 `.java` 源文件编译为 `.class` 文件。

##### 8. `process-classes`

- **作用**：处理编译后的类文件。
- **常用 goal**：没有特定的默认 goal，通常用于字节码增强等。

##### 9. `generate-test-sources`

- **作用**：生成测试源代码。
- **常用 goal**：通常由测试代码生成插件执行。

##### 10. `process-test-sources`

- **作用**：处理测试源代码。
- **常用 goal**：没有特定的默认 goal，通常由测试代码处理插件执行。

##### 11. `generate-test-resources`

- **作用**：生成测试资源文件。
- **常用 goal**：没有特定的默认 goal，通常由测试资源生成插件执行。

##### 12. `process-test-resources`

- **作用**：复制和处理测试资源文件到测试目标目录。
- **常用 goal**：`resources:testResources`，将测试资源文件复制到 `target` 目录。

##### 13. `test-compile`

- **作用**：编译测试源代码。
- **常用 goal**：`compiler:testCompile`，编译测试 `.java` 文件。

##### 14. `process-test-classes`

- **作用**：处理编译后的测试类文件。
- **常用 goal**：没有特定的默认 goal，通常用于测试字节码增强等。

##### 15. `test`

- **作用**：运行测试。
- **常用 goal**：`surefire:test`，执行单元测试。

##### 16. `prepare-package`

- **作用**：为打包准备额外的步骤。
- **常用 goal**：没有特定的默认 goal，通常用于预处理。

##### 17. `package`

- **作用**：将编译好的代码打包成可分发的格式（如 JAR 或 WAR）。
- **常用 goal**：`jar:jar`，`war:war`。

##### 18. `pre-integration-test`

- **作用**：执行集成测试前的必要步骤。
- **常用 goal**：通常用于启动需要的环境或服务。

##### 19. `integration-test`

- **作用**：运行集成测试。
- **常用 goal**：可能使用 `failsafe:integration-test`。

##### 20. `post-integration-test`

- **作用**：集成测试后进行清理。
- **常用 goal**：通常用于停止服务或清理环境。

##### 21. `verify`

- **作用**：运行任何检查，验证打包结果。
- **常用 goal**：可能使用 `verifier:verify`。

##### 22. `install`

- **作用**：将包安装到本地 Maven 仓库。
- **常用 goal**：`install:install`。

##### 23. `deploy`

- **作用**：将包部署到远程仓库，以供共享。
- **常用 goal**：`deploy:deploy`。

这些阶段和相应的 goals 组成了 Maven 的构建生命周期，可以根据需要在 `pom.xml` 中配置和扩展，以满足项目的特定需求。每个阶段的执行可以由插件定义和扩展，从而实现自定义的构建过程。

如果我们运行 `mvn package`，Maven 就会执行 `default` 生命周期，它会从开始一直运行到 `package` 这个 phase 为止。

```
validate
initialize
...
prepare-package
package
```

如果我们运行 `mvn compile`，Maven 也会执行 `default` 生命周期，但这次他只会运行到 `compile` 这个 phase 为止。

```
validate
initialize
...
process-resources
compile
```

#### Maven 另一个常用的生命周期是 `clean`，它会执行 3 个 phase

Maven 的 `clean` 生命周期主要用于清理项目的构建输出，即删除生成的文件和目录。这一生命周期包括三个阶段（phase），它们依次执行，确保清理操作的完整性和有效性。以下是 `clean` 生命周期中的三个阶段的详细介绍：

##### 1. `pre-clean`

- **作用**：在清理之前执行的步骤。主要用于执行一些准备工作或设置清理前的条件。
- **常用 goal**：通常没有特定的默认 goal，用户可以根据需要自定义一些准备步骤。

##### 2. `clean`

- **作用**：执行实际的清理操作。这是 `clean` 生命周期的核心阶段，负责删除项目构建过程中生成的文件和目录，通常是 `target` 目录。
- **常用 goal**：`maven-clean-plugin:clean`，它删除默认构建目录中的所有文件和子目录，确保项目构建环境的干净整洁。

##### 3. `post-clean`

- **作用**：在清理之后执行的步骤。用于进行后续的处理或记录日志。
- **常用 goal**：通常没有特定的默认 goal，用户可以根据需要添加一些后处理步骤。

##### 使用示例

在命令行中运行 `clean` 生命周期的命令：

```bash
mvn clean
```

这条命令会依次执行上述三个阶段，确保项目的构建目录被清理干净，以便进行新的构建。

##### 扩展

- **自定义清理操作**：虽然 `maven-clean-plugin` 已经提供了基础的清理功能，但用户可以通过插件配置在 `pom.xml` 中添加自定义的清理操作。例如，删除特定的日志文件或临时文件。

- **与其他生命周期结合使用**：`clean` 生命周期常与 `default` 生命周期结合使用，例如 `mvn clean install`，以确保在每次构建之前都进行清理操作。

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

### `mvn` 命令的本质

我们使用 mvn 这个命令时，后面的参数是 phase，Maven 自动根据生命周期运行到指定的 phase。

例如，运行 mvn clean package，Maven 先执行 clean 生命周期并运行到 clean 这个 phase，然后执行 default 生命周期并运行到 package 这个 phase，实际执行的 phase 如下：

```
pre-clean
clean （注意这个clean是phase）
validate （开始执行default生命周期的第一个phase）
initialize
...
prepare-package
package
```

在实际开发过程中，经常使用的命令有：

- mvn clean：清理所有生成的 class 和 jar；
- mvn clean compile：先清理，再执行到 compile；
- mvn clean test：先清理，再执行到 test，因为执行 test 前必须执行 compile，所以这里不必指定 compile；
- mvn clean package：先清理，再执行到 package。

大多数 phase 在执行过程中，因为我们通常没有在 pom.xml 中配置相关的设置，所以这些 phase 什么事情都不做。

经常用到的 phase 其实只有几个：

- clean：清理
- compile：编译
- test：运行测试
- package：打包

### 使用插件

前面介绍了 Maven 的 lifecycle，phase 和 goal：使用 Maven 构建项目就是执行 lifecycle，执行到指定的 phase 为止。每个 phase 会执行自己默认的一个或多个 goal。goal 是最小任务单元。

以`compile`这个 phase 为例，如果执行：

```
mvn compile
```

Maven 将执行 compile 这个 phase，这个 phase 会调用 compiler 插件执行关联的 compiler:compile 这个 goal。

实际上，执行每个 phase，都是通过某个插件（plugin）来执行的，Maven 本身其实并不知道如何执行 compile，它只是负责找到对应的 compiler 插件，然后执行默认的 compiler:compile 这个 goal 来完成编译。

所以，使用 Maven，实际上就是配置好需要使用的插件，然后通过 phase 调用它们。

Maven 已经内置了一些常用的标准插件，例如 maven-jar-plugin：

| 插件名称 | 对应执行的 phase |
| :------- | :--------------- |
| clean    | clean            |
| compiler | compile          |
| surefire | test             |
| jar      | package          |

如果标准插件无法满足需求，我们还可以使用自定义插件。使用自定义插件的时候，需要声明。例如，使用 maven-shade-plugin 可以创建一个可执行的 jar，要使用这个插件，需要在 pom.xml 中声明它：

```
<project>
    ...
	<build>
		<plugins>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-shade-plugin</artifactId>
                <version>3.2.1</version>
				<executions>
					<execution>
						<phase>package</phase>
						<goals>
							<goal>shade</goal>
						</goals>
						<configuration>
                            ...插件配置...
						</configuration>
					</execution>
				</executions>
			</plugin>
		</plugins>
	</build>
</project>
```

自定义插件往往需要一些配置，例如，maven-shade-plugin 需要指定 Java 程序的入口，它的配置是：

```
<configuration>
    <transformers>
        <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
            <mainClass>com.itranswarp.learnjava.Main</mainClass>
        </transformer>
    </transformers>
</configuration>
```

注意，Maven 自带的标准插件例如 compiler 是无需声明的，只有引入其它的插件才需要声明。

下面列举了一些常用的插件：

- maven-shade-plugin：打包所有依赖包并生成可执行 jar，[插件的实践介绍](https://www.cnblogs.com/wanghengbin/p/17927038.html)；
- cobertura-maven-plugin：生成单元测试覆盖率报告；
- findbugs-maven-plugin：对 Java 源码进行静态分析以找出潜在问题。

#### 总结

Maven 通过自定义插件可以执行项目构建时需要的额外功能，使用自定义插件必须在 pom.xml 中声明插件及配置；

插件会在某个 phase 被执行时执行；

插件的配置和用法需参考插件的官方文档。

## 常见的关键问题 🌟

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

### 下载依赖的几种方式以及如何使用？

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

### 如何搜索第三方组件？

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
