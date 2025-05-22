# Java 的基本概念

## JVM、JRE 和 JDK

### JVM (Java Virtual Machine) - Java 虚拟机

#### **JVM 是什么？**

- **JVM 是运行 Java 程序的虚拟环境**。它是 Java 程序能够在不同操作系统上运行的原因。JVM 负责将编译过的 Java 字节码（.class 文件）转换成机器代码，并执行这些代码。

#### **特性：**

1. **跨平台**：JVM 是 Java 实现“一次编写，到处运行”的关键。无论在 Windows、Linux 还是 macOS 上，只要有相应的 JVM，Java 程序都可以运行。
2. **内存管理**：JVM 自动管理内存分配和垃圾回收，使得开发者无需手动释放内存。
3. **安全性**：JVM 提供一个安全的运行环境，通过字节码验证、权限控制等机制，保护系统免受恶意代码的侵害。

#### **通俗的比喻：**

- 把 JVM 想象成一台虚拟的咖啡机，它知道如何读取和理解咖啡豆（Java 字节码），并将其转换为咖啡粉（机器代码），然后冲泡出一杯杯可口的咖啡（运行程序）。不论是在公寓、咖啡厅还是在公司里（不同的操作系统），JVM 都能制作出原味的咖啡。

#### **包含的内容：**

- 类加载器（Class Loader）
- 字节码验证器（Bytecode Verifier）
- 执行引擎（Execution Engine）
- 垃圾回收器（Garbage Collector）
- JIT 编译器（Just-In-Time Compiler）

JVM 是运行 Java 字节码的虚拟机，JVM 本身不直接提供 API 给应用程序使用，它是一个执行环境。但它实现了如下规范：

- JVM 规范（定义类文件格式、指令集等）
- 内存管理接口
- 线程同步原语（如 monitorenter、monitorexit 指令）

### JRE (Java Runtime Environment) - Java 运行环境

#### **JRE 是什么？**

- **JRE 是一个用于运行 Java 程序的环境**。它包含 JVM 以及 Java 标准库和其他支持文件。

#### **特性：**

1. **包含 JVM**：JRE 内部包含了 JVM，因此它可以执行 Java 字节码。
2. **标准类库**：JRE 包含了运行 Java 程序所需的标准类库，如集合框架、IO 库等。
3. **运行时环境**：它提供了 Java 程序运行所需的所有文件和资源，但不包括开发工具（如编译器）。

#### **通俗的比喻：**

- 想象 JRE 是一个咖啡工作台，不仅包含了虚拟的咖啡机（JVM），还包含了制作咖啡所需的各种工具和材料，例如牛奶，焦糖，咖啡杯（Java 类库）。用户在这个工作台上就可以运行咖啡机，做出各种口味的咖啡。

#### **包含的内容：**

JRE 包含基础的 Java API，主要包括：

核心包（由 JVM 实现的 API）：

- java.lang：语言基础类（String, Object, Thread 等）
- java.util：实用工具类（集合框架、日期时间等）
- java.io：输入输出
- java.net：网络操作
- java.math：数学操作
- java.text：文本处理
- java.sql：数据库访问
- java.awt：抽象窗口工具包
- javax.swing：Swing 图形界面
- java.security：安全框架
- java.beans：JavaBeans 组件模型

扩展 API：

- `javax.*`：标准扩展，如 javax.xml、javax.crypto 等

### JDK (Java Development Kit) - Java 开发工具包

#### **JDK 是什么？**

- **JDK 是用于开发 Java 应用程序的完整开发工具包**。它不仅包含 JRE，还提供了一系列开发工具，如编译器、调试器等。

#### **特性：**

1. **包含 JRE**：JDK 包含了运行 Java 程序所需的 JRE，因此可以运行和测试 Java 程序。
2. **开发工具**：JDK 提供了编译 Java 源代码的工具（`javac`）、打包工具（`jar`）、调试工具（`jdb`）等。
3. **附加工具和库**：JDK 还附带了一些高级的开发工具和库，用于开发和调试更复杂的 Java 应用程序。

#### **通俗的比喻：**

- JDK 就像是一个完整的咖啡工作室，里面不仅有虚拟的咖啡机（JVM）和咖啡工作台（JRE），还有烘焙咖啡豆的所有工具（开发工具）。它提供了你需要的所有工具，让你可以从头开始制作自己的咖啡豆（开发 Java 程序），再用它们来制作咖啡。

#### **包含的内容：**

JDK 除了包含 JRE 的所有内容外，还包括：

开发工具 API：

- `com.sun.tools.*`：编译器 API
- `com.sun.jdi.*`：调试接口
- `tools.jar`：包含 javac, javadoc 等工具的 API

JDK 特有包：

- `jdk.*`：JDK 特有的实用工具
- `sun.*`：Sun/Oracle 实现特有（非标准）API

### 总结

- **JVM** 是用于运行 Java 字节码的虚拟机。
- **JRE** 包含 JVM 和运行 Java 程序所需的类库，是用于执行 Java 程序的环境。
- **JDK** 是开发 Java 程序的工具包，包含 JRE 以及编译、调试等开发工具。

换句话说，JVM 是运行 Java 程序的“引擎”，JRE 是包含 JVM 和标准类库的“运行环境”，而 JDK 则是开发 Java 程序的“工具箱”。

## Java File（.java）、Kotlin File（.kt）、Groovy File（.groovy）

Java、Kotlin 和 Groovy 都是可以运行在 JVM（Java 虚拟机）上的编程语言。它们有各自的文件类型和特性。我们可以用不同风格编写“咖啡食谱”来比喻它们，帮助理解。

### Java File (.java)

#### **Java 是什么？**

- **Java 是一种强类型、面向对象的编程语言**。它是最早也是最广泛使用的 JVM 语言之一，具有稳定、安全、跨平台的特点。

#### **特性：**

1. **静态类型**：Java 是静态类型语言，这意味着你在编译时必须声明变量的类型。例如，`int num = 5;` 这里的 `num` 是整数类型。
2. **面向对象**：Java 强调面向对象编程的原则，如继承、封装、多态等。
3. **广泛使用**：Java 拥有丰富的生态系统，被大量企业应用于开发大型系统和服务器端应用。
4. **显式声明**：Java 代码通常比较详细和冗长，因为它要求显式地定义类型和控制流程。

#### **通俗的比喻：**

- 把 Java 文件 (.java) 想象成一本详细的“咖啡食谱”书。每一步都写得非常清楚，从选豆、磨豆到冲泡的每个细节都有详细的说明，确保任何人都能按照步骤做出一杯标准的咖啡。

#### **示例代码：**

```java
public class CoffeeMaker {
    public static void main(String[] args) {
        System.out.println("Making a cup of coffee!");
    }
}
```

### Kotlin File (.kt)

#### **Kotlin 是什么？**

- **Kotlin 是一种现代化的、静态类型的编程语言**，它简化了 Java 的一些复杂性，同时保持与 Java 的高度兼容性。Kotlin 由 JetBrains 开发，并由 Google 官方推荐用于 Android 开发。

#### **特性：**

1. **简洁**：Kotlin 代码更简洁，比 Java 更少的样板代码（boilerplate）。它提供了许多语法糖，使得代码更具可读性。
2. **空安全**：Kotlin 在设计时特别关注空指针异常问题，提供了原生的空安全（null safety）机制。
3. **函数式编程**：Kotlin 支持函数式编程特性，如高阶函数、Lambda 表达式等，使得开发更灵活。
4. **互操作性**：Kotlin 可以无缝调用 Java 代码，且 Java 也能调用 Kotlin 代码，使得它很适合与现有的 Java 项目一起使用。

#### **通俗的比喻：**

- 把 Kotlin 文件 (.kt) 想象成一个简洁的“咖啡食谱”笔记。它省略了很多冗长的步骤，只保留了最关键的部分，让你更快、更轻松地做出美味的咖啡。

**示例代码：**

```kotlin
fun main() {
    println("Making a cup of coffee!")
}
```

### Groovy File (.groovy)

#### **Groovy 是什么？**

- **Groovy 是一种动态的、面向对象的编程语言**，它与 Java 高度兼容，并增强了 Java 语言的功能。Groovy 常用于脚本编写、快速原型开发和构建自动化工具中。

#### **特性：**

1. **动态类型**：Groovy 支持动态类型，这使得它在运行时可以决定变量的类型，代码编写时更加灵活。
2. **脚本友好**：Groovy 允许以脚本方式编写代码，不需要像 Java 那样编写完整的类和方法定义。
3. **内置集合和正则表达式支持**：Groovy 对集合处理和正则表达式提供了更简单的语法。
4. **DSL 支持**：Groovy 很适合创建领域特定语言（DSLs），这在构建工具（如 Gradle）和配置文件中很有用。

#### **通俗的比喻：**

- 把 Groovy 文件 (.groovy) 想象成一个“咖啡食谱”草稿本。你可以随意涂鸦，快速尝试不同的配方，不需要太多的结构化的步骤，让你可以更自由地创新。

#### **示例代码：**

```groovy
println "Making a cup of coffee!"
```

### 总结与对比

| 特性         | Java (.java)           | Kotlin (.kt)             | Groovy (.groovy)           |
| ------------ | ---------------------- | ------------------------ | -------------------------- |
| 类型系统     | 静态类型，强类型       | 静态类型（支持类型推断） | 动态类型                   |
| 语法简洁性   | 详细、冗长             | 简洁、现代               | 灵活、简洁                 |
| 空安全       | 手动检查               | 内置空安全机制           | 需要手动处理               |
| 脚本支持     | 需要完整的类和方法定义 | 支持脚本方式编写         | 天然支持脚本编写           |
| 函数式编程   | 基本支持               | 强支持                   | 支持                       |
| 互操作性     | 与其他 JVM 语言兼容    | 高度兼容 Java            | 高度兼容 Java              |
| 常见应用场景 | 企业级应用、大型系统   | Android 开发、现代应用   | 构建工具、脚本、自动化任务 |

Java 提供了稳定的基础，Kotlin 带来了现代化的简洁性和高效性，而 Groovy 则提供了灵活的脚本和快速开发能力。

## Java 的版本解释

### 前置知识

- Java 第一代平台： 1995 年，Sun 公司首推 Oak，因 Oak 商标已被占用后改名为 Java。1996 年 1 月，Sun 公司发布了 Java 的第一个开发工具包（JDK 1.0），也就是最初版本 Java1.0

- Java 第二代平台：1999 年 6 月，Sun 公司发布了第二代 Java 平台（简称为 Java2），它有 3 个版本：

  - J2ME（Java2 Micro Edition，Java2 平台的微型版），应用于移动、无线及有限资源的环境；
  - J2SE（Java2 Standard Edition，Java 2 平台的标准版），应用于桌面环境；
  - J2EE（Java2 Enterprise Edition，Java 2 平台的企业版），应用于基于 Java 的应用服务器。

- J2SE 改名：2004 年 9 月 30 日，J2SE 1.5 发布，为了表示该版本的重要性，J2SE 1.5 更名为 Java SE 5.0（内部版本号 1.5.0），代号为“Tiger”，Tiger 包含了从 1996 年发布 1.0 版本以来的最重大的更新。

- 第二代平台改名：2005 年 6 月，在 Java One 大会上，Sun 公司发布了 Java SE 6。此时，Java 的各种版本已经更名，已取消其中的数字 2，如 J2EE 更名为 JavaEE，J2SE 更名为 JavaSE，J2ME 更名为 JavaME。

自 1996 年发布 Java1.0；直到 2004 年 9 月版本号提升为 5.0，这一新版本为 Java SE5.0（或 J2SE1.5），在 2005 年 6 月 Sun 公司终结了已经有 8 年历史的 J2SE、J2EE、J2ME 的命名方式启用了今天的 Java SE、Java EE、Java ME 命名方式，而此后的版本为 Java SE6、Java SE7、Java SE8、Java SE9、Java SE10、Java SE11、Java SE12… Java SE17 等。

### Java 和 JDK 的关系

- Java SE，现在提到的 Java 指代的就是 Java SE

  Java 平台标准版 (Java SE) API 定义了用于通用计算的核心 Java 平台。这些 API 称为 java

- JDK

  Java 开发工具包 (JDK) API 特定于 JDK，不一定在 Java SE 平台的所有实现中都可用。这些 API 称为 jdk。

自 1996 年发布 JDK1.0；此后命名为 JDK1.1、JDK1.2、JDK1.3、JDK1.4、采用 1.X 的命名方式，即 JDK 在 Java1.0 到 Java9 对应每一个版本号 ：JDK1.0、JDK1.2 … JDK1.8、JDK1.9。Java10 以后我们可以理解为 JDK 对应名称为：JDK10、JDK11、JDK12 … JDK17

在程序员眼中，Java（或者说 Java SE）和 JDK 是一样的，都是指代 Java 的开发工具包。

- [Java 版本和 JDK 版本](https://cloud.tencent.com/developer/article/2128820)
- [JDK 的版本号解惑](https://cloud.tencent.com/developer/article/1873446)

## JDK 的常用命令

### javac

javac 命令是 Java 编译器的命令行工具，用于将 Java 源代码编译成字节码。以下是一些常用参数及其示例：

1. `-d` - 指定编译后类文件的存放目录
   `javac -d classes src/Main.java`

2. `-cp/-classpath` - 指定查找用户类文件和注解处理器的位置
   `javac -cp lib/dependency.jar:classes src/Main.java`

3. `-sourcepath` - 指定查找输入源文件的位置
   `javac -sourcepath src src/com/example/Main.java`

4. `-source` - 指定使用的 Java 版本
   `javac -source 11 Main.java`

5. `-target` - 指定生成的类文件兼容的 JVM 版本
   `javac -target 11 Main.java`

6. `-encoding` - 指定源文件编码
   `javac -encoding UTF-8 Main.java`

7. `-g` - 生成所有调试信息
   `javac -g Main.java`

8. `-verbose` - 输出有关编译的详细信息
   `javac -verbose Main.java`

9. `-Xlint` - 启用警告
   `javac -Xlint:all Main.java`

10. `-Werror` - 将警告视为错误
    `javac -Werror Main.java`

11. `-deprecation` - 显示使用已过时 API 的源位置
    `javac -deprecation Main.java`

12. `-nowarn` - 禁用警告
    `javac -nowarn Main.java`

### java

java 是 jvm 的入口，jvm 是 java 的运行环境。

java 命令是用于启动 Java 应用程序的命令行工具，以下是一些常用参数及示例：

1. `-cp/-classpath` - 指定查找类文件的路径
   `java -cp classes:lib/dependency.jar com.example.Main`

2. `-D` - 设置系统属性
   `java -Dapp.env=production com.example.Main`

3. `-Xms` - 设置初始堆大小
   `java -Xms512m com.example.Main`

4. `-Xmx` - 设置最大堆大小
   `java -Xmx2g com.example.Main`

5. `-jar` - 运行 JAR 文件
   `java -jar app.jar`

6. `-verbose` - 启用详细输出
   `java -verbose:gc com.example.Main`

7. `-ea/-enableassertions` - 启用断言
   `java -ea com.example.Main`

8. `-javaagent` - 加载 Java 编程语言代理
   `java -javaagent:agent.jar com.example.Main`

9. `--module-path/-p` - 指定模块路径(Java 9+)
   `java --module-path mods -m myapp/com.example.Main`

10. `-XX:+UseG1GC` - 使用 G1 垃圾收集器
    `java -XX:+UseG1GC com.example.Main`

11. `-XX:+HeapDumpOnOutOfMemoryError` - 内存溢出时生成堆转储
    `java -XX:+HeapDumpOnOutOfMemoryError com.example.Main`

12. `-version` - 显示版本信息
    `java -version`

### 类路径（Classpath）的核心概念

​​ 类路径是 JVM 查找资源的路径。

1. JVM 会在类路径中查找：

- 编译后的 .class 文件（如 com/example/App.class）
- 资源文件（如 config/applicationContext.xml）
- 第三方库（JAR 文件中的类）

2. 路径分隔符 ​​

- Windows 使用 ; 分隔不同路径。
- Linux/Mac 使用 : 分隔。

## 疑问：运行 java 命令时，为什么需要 JRE？

### Java 编译和运行机制

您的理解有一部分是对的，但也有一些概念需要澄清：

#### 编译过程

1. **编译器作用**：

   - `javac` 命令（编译器）将 `.java` 源文件编译成 `.class` 字节码文件
   - 编译器只是将源代码转换为字节码，并不会将 JDK 或 JRE 的代码编译到您的程序中

2. **字节码内容**：
   - 编译后的 `.class` 文件只包含您的程序逻辑
   - 它包含对 JDK/JRE 中类的引用（如 `java.lang.String`），但不包含这些类的实现

#### 运行过程

1. **`java` 命令**：

   - `java` 命令启动 JVM (Java 虚拟机)
   - JVM 加载并执行您的 `.class` 文件
   - JVM **必须**能够访问标准库（JRE 的一部分）才能运行程序

2. **运行时类加载**：
   - 当您的程序引用 `String`、`System` 等类时
   - JVM 会从 JRE 的库中加载这些类
   - 这些标准库类**不在**您的 `.class` 文件中

### JRE 的必要性

**运行 Java 程序必须有 JRE**，因为：

1. **标准库依赖**：

   - 几乎所有 Java 程序都使用标准库（如 `String`、`ArrayList`、`System` 等）
   - 这些类的实现在 JRE 中，不在您的编译代码中

2. **动态链接**：

   - Java 使用动态链接机制，运行时才解析对标准库的引用
   - 类似于 C/C++ 中的动态链接库（.dll/.so）

3. **JVM 本身**：
   - `java` 命令本身是 JRE 的一部分
   - 没有 JRE，就没有 JVM 来执行字节码

### 一个简单的比喻

把这个过程想象成烹饪：

- 您的源代码（`.java` 文件）是食谱
- 编译器（`javac`）将食谱转换成厨师能理解的指令（`.class` 文件）
- 这些指令包含"使用锅"、"使用刀"等步骤，但没有包含实际的锅和刀
- JVM（`java` 命令）是厨师，它需要厨房（JRE）里的工具（标准库）才能执行这些指令

### JDK vs JRE 在运行时的角色

1. **运行时只需要 JRE**：

   - 编译好的 Java 程序只需要 JRE 即可运行
   - JDK 中的开发工具（如 `javac`、`javadoc` 等）在运行时不需要

2. **为什么有时看起来不需要 JRE**：
   - 如果您的计算机上安装了 JDK，它已经包含了 JRE
   - 许多 Java 应用程序会捆绑自己的 JRE（如嵌入式 JRE）
   - 某些工具可以创建"自包含"的 Java 应用（如 jlink、GraalVM native-image），但这些实际上是将部分 JRE 与应用打包在一起

### 实际例子

让我们看一个简单的例子来说明这个过程：

```java
// HelloWorld.java
public class HelloWorld {
    public static void main(String[] args) {
        String message = "Hello, World!";
        System.out.println(message);
    }
}
```

当您编译这个程序时：

```
javac HelloWorld.java
```

编译器会生成 `HelloWorld.class` 文件。这个文件包含：

- 您定义的 `main` 方法的字节码
- 对 `java.lang.String` 和 `java.lang.System` 的引用
- 但**不包含** `String` 类或 `System` 类的实现

当您运行这个程序时：

```
java HelloWorld
```

以下过程发生：

1. JVM 启动并加载 `HelloWorld.class`
2. JVM 发现对 `String` 和 `System` 的引用
3. JVM 从 JRE 的标准库（通常在 `rt.jar` 或模块系统中）加载这些类
4. 然后才能执行您的程序

### 验证实验

您可以做一个简单的实验来验证这一点：

1. 编译一个 Java 程序
2. 尝试在没有 JRE 的环境中运行它
3. 您会得到错误消息，因为 JVM 找不到必要的运行时库

### 总结

1. **编译后的 Java 程序**：

   - 只包含您的代码逻辑
   - 包含对标准库的引用，但不包含标准库本身

2. **运行 Java 程序**：

   - 必须有 JRE，因为它提供了 JVM 和标准库
   - JDK 在运行时不是必需的

3. **`java` 命令**：
   - 是 JRE 的一部分，启动 JVM
   - 不是独立于 JRE 的组件

所以，编译不会将 JDK/JRE 的代码编译到您的程序中，运行时仍然需要 JRE。这是 Java "一次编写，到处运行"理念的核心：字节码是可移植的，但需要在目标平台上有适当的 JRE 来执行。

## Java 的不同版本共存切换

```bash
# 配置JDK路径
export JAVA_8_HOME=/Library/Java/JavaVirtualMachines/jdk-1.8.jdk/Contents/Home
export JAVA_17_HOME=/Library/Java/JavaVirtualMachines/jdk-17.jdk/Contents/Home
# 设置默认JDK版本
export JAVA_HOME=$JAVA_17_HOME
# 更新 PATH 变量（避免重复添加）
export PATH=$JAVA_HOME/bin:$(echo $PATH | sed "s|:[^:]*\/java[^:]*\/bin||g")

# 为不同 JDK 版本创建 alias
alias jdk8='export JAVA_HOME=$JAVA_8_HOME; export PATH=$JAVA_HOME/bin:$(echo $PATH | sed "s|:[^:]*\/java[^:]*\/bin||g"); java -version'
alias jdk17='export JAVA_HOME=$JAVA_17_HOME; export PATH=$JAVA_HOME/bin:$(echo $PATH | sed "s|:[^:]*\/java[^:]*\/bin||g"); java -version'

# Java 8 仍使用 CLASSPATH（可选）
alias jdk8_with_classpath='export JAVA_HOME=$JAVA_8_HOME; export CLASSPATH=$JAVA_HOME/lib/tools.jar:$JAVA_HOME/lib/dt.jar:.; export PATH=$JAVA_HOME/bin:$(echo $PATH | sed "s|:[^:]*\/java[^:]*\/bin||g"); java -version'

# 查看当前 Java 版本的快捷命令
alias javaversion='echo "JAVA_HOME: $JAVA_HOME"; java -version'
```

- 将上述配置添加到 ~/.bashrc 或 ~/.zshrc（取决于您使用的 shell）
- 应用更改：source ~/.bashrc 或打开新终端

## IDEA

[IDEA 激活教程](https://ziby0nwxdov.feishu.cn/wiki/OyLBwBd9oiVFTykXrHvcEB91nyb)
激活大法： https://www.yuque.com/ziyou-urpsp/iqd2l9/zto1s0iv7ot18qhz
特别提示：复制上面的链接一定要用电脑浏览器打开！
重要：1、一定要解压到桌面再运行工具（请勿与其它工具一起使用）请打开链接仔细查看教程。
2、虚拟产品具有可复制性，如果不是激活工具本身的原因请不要以以下借口退宽，如：看错了，买错了，这个不是我想要的等等原因
【好·评】后赠送：
各类编程语言教程合集
涵盖 Python、Php、Script 等各类编程语言最新教程

请添加客服 v 有任何问题可以及时联系：lkjhgfdsa06730

### idea 中给 java 程序传启动参数的说明

- VM 参数
- 环境变量参数
- 程序参数

```java
public class MyTest {
    public static void main(String[] args) {
        //获取vm options传递的参数
        String param1 = System.getProperty("vm.param1");
        System.out.println(param1);
        //获取环境变量,包括系统上设置的环境变量和在idea的Run Config界面上设置的环境变量
        String param2 = System.getenv().get("env.param2");
        System.out.println(param2);
        //程序参数会直接传递到main方法的形参里，多个参数用空格隔开
        for (String arg : args) {
            System.out.println(arg);
        }
        System.out.println(System.getenv().get("JAVA_HOME"));
    }
}

```

#### 一、VM 参数（JVM 参数）

##### 传递方式

- 定义：JVM 启动时通过命令行指定的参数，用于配置 JVM 或设置系统属性。

- 格式：以 `-` 开头（如 `-Xmx512m`）或 `-Dkey=value`（设置系统属性）。

- 示例命令：

  ```bash
  java -Xmx512m -Dapp.name=MyApp -Duser.timezone=Asia/Shanghai MainClass arg1 arg2
  ```

##### 代码中获取方式

- 系统属性（通过 `-Dkey=value` 设置）：

  ```java
  String appName = System.getProperty("app.name");        // 输出 "MyApp"
  String timezone = System.getProperty("user.timezone");  // 输出 "Asia/Shanghai"
  ```

- 纯 JVM 参数（如 `-Xmx`）：

  这些参数由 JVM 内部处理，无法直接在代码中获取，仅影响 JVM 行为（如内存分配）。

#### 二、环境变量参数

##### 传递方式

- 定义：操作系统或启动脚本中定义的环境变量，全局作用于所有程序。

- 设置方式：

  - Linux/Mac：

    ```bash
    export DB_URL=jdbc:mysql://localhost:3306/test
    java MainClass
    ```

  - Windows：

    ```cmd
    set DB_URL=jdbc:mysql://localhost:3306/test
    java MainClass
    ```

##### 代码中获取方式

- 通过 `System.getenv()` 获取：

  ```java
  String dbUrl = System.getenv("DB_URL");  // 输出 "jdbc:mysql://localhost:3306/test"
  ```

---

#### 三、程序参数（命令行参数）

##### 传递方式

- 定义：在命令行中跟在主类名后的参数，直接传递给 `main` 方法。

- 示例命令：

  ```bash
  java MainClass arg1 arg2
  ```

##### 代码中获取方式

- 通过 `main` 方法的 `String[] args` 获取：

  ```java
  public static void main(String[] args) {
      String arg1 = args[0];  // 输出 "arg1"
      String arg2 = args[1];  // 输出 "arg2"
  }
  ```

---

#### 四、三者的区别与使用场景

| 参数类型     | 传递方式                         | 代码获取 API                | 典型用途                                       |
| ------------ | -------------------------------- | --------------------------- | ---------------------------------------------- |
| VM 参数      | 以 `-` 或 `-D` 开头的命令行参数  | `System.getProperty("key")` | 配置 JVM 内存、日志路径、系统级参数            |
| 环境变量参数 | 操作系统或启动脚本设置的环境变量 | `System.getenv("VAR_NAME")` | 数据库连接、外部服务 URL、环境标识（dev/prod） |
| 程序参数     | 命令行中主类名后的参数           | `main` 方法的 `args` 数组   | 动态输入文件名、操作模式（如 `--debug`）       |

#### 五、关键注意事项

1. 作用域差异：

   - VM 参数（系统属性）仅在当前 JVM 进程内生效。

   - 环境变量是全局的，同一机器上所有程序共享。

2. 覆盖优先级：

   - 系统属性（`-Dkey=value`）优先于环境变量。例如：

     ```bash
     export app.name=EnvApp
     java -Dapp.name=VMApp MainClass  # 代码中获取的 app.name 是 "VMApp"
     ```

3. 安全性：
   - 敏感信息（如密码）不建议通过程序参数传递（可能被 `ps` 命令暴露），推荐使用环境变量或配置文件。

#### 六、完整示例

启动命令

```bash
java -Xmx256m -Dapp.mode=production MainClass input.txt --verbose
```

代码示例

```java
public class MainClass {
    public static void main(String[] args) {
        // 获取程序参数（命令行参数）
        String fileName = args[0];        // "input.txt"
        String flag = args[1];            // "--verbose"

        // 获取系统属性（VM 参数）
        String appMode = System.getProperty("app.mode");  // "production"

        // 获取环境变量
        String javaHome = System.getenv("JAVA_HOME");      // 如 "/usr/lib/jvm/java-11"
    }
}
```

---

#### 总结

- VM 参数：通过 `-D` 设置系统属性，用 `System.getProperty()` 获取。

- 环境变量：通过操作系统设置，用 `System.getenv()` 获取。

- 程序参数：通过 `main` 方法的 `args` 数组传递。

具体参考：https://www.cnblogs.com/chengxuxiaoyuan/p/18249559
