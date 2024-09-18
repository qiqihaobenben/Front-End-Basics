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

- 把 JVM 想象成一台虚拟的咖啡机，它知道如何读取和理解咖啡豆（Java 字节码），并将其转换为一杯杯可口的咖啡（机器代码）。不论是在公寓、咖啡厅还是在公司里（不同的操作系统），JVM 都能制作出原味的咖啡。

### JRE (Java Runtime Environment) - Java 运行环境

#### **JRE 是什么？**

- **JRE 是一个用于运行 Java 程序的环境**。它包含 JVM 以及 Java 标准库和其他支持文件。

#### **特性：**

1. **包含 JVM**：JRE 内部包含了 JVM，因此它可以执行 Java 字节码。
2. **标准类库**：JRE 包含了运行 Java 程序所需的标准类库，如集合框架、IO 库等。
3. **运行时环境**：它提供了 Java 程序运行所需的所有文件和资源，但不包括开发工具（如编译器）。

#### **通俗的比喻：**

- 想象 JRE 是一个咖啡工作台，不仅包含了虚拟的咖啡机（JVM），还包含了制作咖啡所需的各种工具和材料，例如牛奶，焦糖，咖啡杯（Java 类库）。用户在这个工作台上就可以运行咖啡机，做出各种口味的咖啡。

### JDK (Java Development Kit) - Java 开发工具包

#### **JDK 是什么？**

- **JDK 是用于开发 Java 应用程序的完整开发工具包**。它不仅包含 JRE，还提供了一系列开发工具，如编译器、调试器等。

#### **特性：**

1. **包含 JRE**：JDK 包含了运行 Java 程序所需的 JRE，因此可以运行和测试 Java 程序。
2. **开发工具**：JDK 提供了编译 Java 源代码的工具（`javac`）、打包工具（`jar`）、调试工具（`jdb`）等。
3. **附加工具和库**：JDK 还附带了一些高级的开发工具和库，用于开发和调试更复杂的 Java 应用程序。

#### **通俗的比喻：**

- JDK 就像是一个完整的咖啡工作室，里面不仅有虚拟的咖啡机（JVM）和咖啡工作台（JRE），还有烘焙咖啡豆的所有工具（开发工具）。它提供了你需要的所有工具，让你可以从头开始制作自己的咖啡豆（开发 Java 程序），再用它们来制作咖啡。

### 总结

- **JVM** 是用于运行 Java 字节码的虚拟机。
- **JRE** 包含 JVM 和运行 Java 程序所需的类库，是用于执行 Java 程序的环境。
- **JDK** 是开发 Java 程序的工具包，包含 JRE 以及编译、调试等开发工具。

换句话说，JVM 是运行 Java 程序的“引擎”，JRE 是包含 JVM 和标准类库的“运行环境”，而 JDK 则是开发 Java 程序的“工具箱”。

## Java File（.java）、Kotlin File（.kt）、Groovy File（.groovy）

Java、Kotlin 和 Groovy 都是可以运行在 JVM（Java 虚拟机）上的编程语言。它们有各自的文件类型和特性。我们可以用不同风格的编写“咖啡食谱”来比喻它们，来帮助理解。

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

自 1996 年发布 JDK1.0；此后命名为 JDK1.1、JDK1.2、JDK1.3、JDK1.4、采用 1.X 的命名方式，即 JDK 在 Java1.0 到 Java9 对应每一个版本号 ：JDK1.0、JDK1.2 … JDK1.8、JDK1.9。Java10 以后我们可以理解为 JDK 对应名称为：JDk10、JDK11、JDK12 … JDK17

在程序员眼中，Java（或者说 Java SE）和 JDK 是一样的，都是指代 Java 的开发工具包。

- [Java 版本和 JDK 版本](https://cloud.tencent.com/developer/article/2128820)
- [JDK 的版本号解惑](https://cloud.tencent.com/developer/article/1873446)

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
