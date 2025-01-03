# Java 基础

## Java 试用

### 基本操作

1. 下载 JDK 并安装，配置环境变量

2. 创建一个 Hello.java 文件

- 一个 Java 源码文件只能定义一个 public 类型的 class，Java 文件中类名必须跟文件名相同，类名以大写字母开头，大小写敏感
  - 因为 Java 是面向对象的编程语言，一个程序的基本单位就是 class
- 一个类中有且只有一个主方法（main）。Java 规定，某个类定义的 public static void main(String[] args)是 Java 程序的固定入口方法，因此，Java 程序总是从 main 方法开始执行。
- Java 源码的缩进不是必须的，但是用缩进后，格式好看，很容易看出代码块的开始和结束，缩进一般是 4 个空格或者一个 tab。

```java
// 定义一个公有的类，类名必须跟文件名相同，类名以大写字母开头，大小写敏感
// class 用来定义一个类，public 表示这个类是公开的，public、class 都是 Java 的关键字，必须小写
public class Hello {
  // 定义一个 main 方法（也叫主方法），是程序的入口
  // 一个程序中有且只有一个主方法
  public static void main(String[] args) {
    // 在控制台输出一串文字，双引号中的内容就是要输出的文字内容
    // System.out.println 是 Java 提供的内置功能，println 是 printline 的 缩写，如果没有参数，会输出一行空行。
    // 方法体中的语句必须用; (英文分号)结尾，在Java程序中，JVM默认总是顺序执行以分号;结束的语句。
    System.out.println("Hello, World!");
  }
}
```

3. 编译并运行

- 编译命令：javac Hello.java
- 运行命令：java Hello

Java 源码本质上是一个文本文件，我们需要先用 javac 把 Hello.java 编译成字节码文件 Hello.class，然后，用 java 命令执行这个字节码文件。

因此，可执行文件 javac 是编译器，而可执行文件 java 就是虚拟机。

> 扩展：[轻松看懂 Java 字节码](https://juejin.cn/post/6844903588716609543)

> 扩展：在 JAVA_HOME 的 bin 目录下找到很多可执行文件

- java : 这个可执行程序其实就是 JVM，运行 Java 程序，就是启动 JVM，然后让 JVM 执行指定的编译后的代码；
- javac : 这是 Java 的编译器，它用于把 Java 源码文件（以.java 后缀结尾）编译为 Java 字节码文件（以.class 后缀结尾）；
- jar : 用于把一组.class 文件打包成一个.jar 文件，便于发布；
- javadoc : 用于从 Java 源码中自动提取注释并生成文档；
  - 所有的 Java 文档注释都以`/**`开头，`*/`结尾，而不是`/*`或`//`，并且如果有多行，每行通常以星号开头
  - 文档注释覆盖范围包括：类、接口、方法、构造器、成员字段，如果写在其他位置，比如函数内部，被视为无效的文档注释
  - 每个 Java 文档注释都要和其后对应的类/方法/字段/包保持同样的缩进
  - Java 文档注释的内容，支持采用 HTML 语法规则书写，同时也支持一些额外的辅助标签
- jab : Java 调试器，用于开发阶段的运行调试。

### main 方法的参数

Java 程序的入口是 `main` 方法，而 `main` 方法可以接受一个命令行参数，它是一个 `String[]` 数组。

命令行参数由 JVM 接收用户输入并传给 main 方法，输入会按照空格分割，如果本身参数中就有空格，就用双引号包裹：

```java
public class Main {
    public static void main(String[] args) {
        for (String arg : args) {
            System.out.println(arg);
        }
    }
}
```

可以利用接收到的命令行参数，根据不同的参数执行不同的代码。

```java
public class Main {
    public static void main(String[] args) {
        for (String arg : args) {
            if ("-version".equals(arg)) {
                System.out.println("v 1.0");
                break;
            }
        }
    }
}
```

上面这个程序必须在命令行执行，先编译它 `javac Main.java`，然后，执行的时候，给它传递一个-version 参数 `java Main -version`，输出 v 1.0。这样，程序就可以根据传入的命令行参数，作出不同的响应。

### 使用 IDE 编写代码

#### IDE 是集成开发环境：Integrated Development Environment 的缩写。

使用 IDE 的好处在于，可以把编写代码、组织项目、编译、运行、调试等放到一个环境中运行，能极大地提高开发效率。

IDE 提升开发效率主要靠以下几点：

编辑器的自动提示，可以大大提高敲代码的速度；
代码修改后可以自动重新编译，并直接运行；
可以方便地进行断点调试。

#### 例如使用 IntelliJ IDEA 编写 Hello.java

1. 创建 project，可以指定 JDK 版本
2. 在 project 目录上创建 module，也可以指定 JDK 版本
3. 在 module 目录上新建 `.java` 源代码（Java Class），设置类名并确认后，进入代码编辑页面，代码中会默认生成一个根据刚才类名创建的类，类的语句块中默认没有内容。
4. 在类中编写代码，输入 `psvm` 自动生成主方法代码，输入 `sout` 自动生成输出语句
5. 通过页面中的三角形按钮（所有）可以编译并运行当前的代码

## Java 数据类型

### 基本数据类型

基本数据类型是 CPU 可以直接进行运算的类型。

> 前置知识

计算机内存的最小存储单元是字节（byte），一个字节就是一个 8 位二进制数，即 8 个 bit。它的二进制表示范围从 00000000~11111111，换算成十进制是 0~255，换算成十六进制是 00~ff。

内存单元从 0 开始编号，称为内存地址。每个内存单元可以看作一间房间，内存地址就是门牌号。

一个字节是 1byte，1024 字节是 1K，1024K 是 1M，1024M 是 1G，1024G 是 1T。

不同的数据类型占用的字节数不一样，如下图:

![](./images/byte.png)

byte 恰好就是一个字节，而 long 和 double 需要 8 个字节。

> 扩展知识

- 一个二进制的位叫做一个 `bit`。网络带宽中的单位，都是 `bit`。例如 100Mbps 的网络带宽，表示 100 兆比特每秒，注意是比特（bit），不是字节（byte）。
- 八个 bit 组成一个 byte，byte 是计算机中基本的衡量存储的单位，硬盘等存储的单位，都是 byte。所以 100Mbps 的网络带宽，下载速度是 100/8=12.5MB/s。

#### 整型

整型也叫整数型，表示整数数据类型。

对于整型类型，Java 只定义了带符号的整型，因此，最高位的 bit 表示符号位（0 表示正数，1 表示负数）。各种整型能表示的最大范围如下：

- 小整型 byte -128 ~ 127
- 短整型 short -32768 ~ 32767
- 整型 int -2147483648 ~ 2147483647
- 长整型 long -9223372036854775808 ~ 9223372036854775807

```java
// 定义整型
public class Main {
    public static void main(String[] args) {
        int i = 2147483647;
        int i2 = -2147483648;
        int i3 = 2_000_000_000; // 加下划线更容易识别
        int i4 = 0xff0000; // 十六进制表示的16711680
        int i5 = 0b1000000000; // 二进制表示的512

        long n1 = 9000000000000000000L; // long型的结尾需要加L
        long n2 = 900; // 没有加L，此处900为int，但int类型可以赋值给long
        int i6 = 900L; // 错误：不能把long型赋值给int
    }
}
```

##### 各种进制

- 二进制 `0b` 开头，例如 `int binaryNum = 0b1010;`
- 八进制 `0` 开头，例如 `int octalNum = 012;`
- 十六进制 `0x` 开头，例如 `int hexNum = 0xA;`

#### 浮点型

浮点类型的数就是小数，因为小数用科学计数法表示的时候，小数点是可以“浮动”的，如 1234.5 可以表示成 12.345x102，也可以表示成 1.2345x103，所以称为浮点数。

- 单精度浮点型 float ： 对于 float 类型，需要加上 f 后缀。
- 双精度浮点型 double

浮点数可表示的范围非常大，float 类型可最大表示 3.4x1038，而 double 类型可最大表示 1.79x10308。

```java
float f1 = 3.14f;
float f2 = 3.14e38f; // 科学计数法表示的3.14x10^38
float f3 = 1.0; // 错误：不带f结尾的是double类型，不能赋值给float

double d = 1.79e308;
double d2 = -1.79e308;
double d3 = 4.9e-324; // 科学计数法表示的4.9x10^-324
```

> 扩展：浮点数可表示的范围非常大是为什么？

在 Java 中，`float` 和 `double` 类型能够表示非常大的数字范围，这主要得益于 **浮点数的表示方式** 和 **指数扩展机制**。

---

##### **1. 浮点数的表示方式**

Java 的 `float` 和 `double` 类型都是基于 **IEEE 754 标准** 的 **浮点数表示法**。这种表示法将浮点数分为三个部分：**符号位**、**指数部分** 和 **尾数部分**。

###### **浮点数公式**

浮点数的值可以用以下公式表示：

```
值 = 符号位 × 尾数 × 2^(指数)
```

- **符号位（S）**：1 位，决定正负号（0 表示正数，1 表示负数）。
- **尾数（M，也叫有效数或小数部分）**：表示数字的精确部分。
- **指数（E）**：指数部分，用来扩展数字的范围，通过指数的大小控制数字的数量级。

---

##### **2. float 和 double 的位数分配**

| 类型   | 总位数 | 符号位 | 指数位 | 尾数位 |
| ------ | ------ | ------ | ------ | ------ |
| float  | 32 位  | 1 位   | 8 位   | 23 位  |
| double | 64 位  | 1 位   | 11 位  | 52 位  |

###### **位数的含义**

1. **符号位（1 位）**：
   - 决定数字是正数还是负数。
2. **指数位（E 位）**：
   - 决定指数部分的大小，可以表示的指数范围越大，浮点数的范围越大。
3. **尾数位（M 位）**：
   - 决定数字的精度，表示了有效数字的部分。

---

##### **3. 为什么范围很大？**

###### **（1）指数位决定了范围**

指数位是决定浮点数范围的关键，因为它控制了数字的数量级。

- **float 的指数位有 8 位**：

  - 8 位指数可以表示的值范围是 **-126 到 +127**（用偏移量编码法，实际存储的是 `E + 127`）。
  - 因此，`float` 的最大值是：`2^127 × 最大有效尾数`。

- **double 的指数位有 11 位**：
  - 11 位指数可以表示的值范围是 **-1022 到 +1023**（用偏移量编码法，实际存储的是 `E + 1023`）。
  - 因此，`double` 的最大值是：`2^1023 × 最大有效尾数`。

**对比：指数位越多，范围越大**

- `float` 的指数范围：`-126 到 127`，表示的值范围大约是 `10^-38 到 10^38`。
- `double` 的指数范围：`-1022 到 1023`，表示的值范围大约是 `10^-308 到 10^308`。

###### **（2）尾数（精度）的作用**

尾数部分（23 位或 52 位）决定了数字的精确程度，但它对表示范围没有直接影响。

- 尾数越多，数字的精度越高，但**范围主要由指数控制**。
- 比如：
  - 一个 `float` 可以精确到 6~7 位十进制数字。
  - 一个 `double` 可以精确到 15~16 位十进制数字。

因此，虽然 `double` 的尾数更多，但它的范围主要还是由 11 位的指数决定的。

---

##### **4. 实现原理：指数编码和尾数的作用**

###### **（1）指数的编码方式**

浮点数使用 **偏移量编码**（Bias Encoding）来存储指数部分，这样可以表示正指数和负指数。

- 对于 `float` 的指数位：

  - 偏移量是 `127`，实际指数值 = 存储的指数值 - 127。
  - 所以存储的指数值范围是 `0~255`，实际指数范围是 `-126~+127`。

- 对于 `double` 的指数位：
  - 偏移量是 `1023`，实际指数值 = 存储的指数值 - 1023。
  - 所以存储的指数值范围是 `0~2047`，实际指数范围是 `-1022~+1023`。

###### **（2）尾数的作用**

尾数（有效数部分）存储的是一个 **归一化的二进制小数**，范围是 `[1.0, 2.0)`。比如：

- `1.101` 表示的小数是 `1 + 0.5 + 0.125 = 1.625`。
- 尾数部分不影响范围，只影响精度。

###### **（3）举例说明**

举个例子，`float` 的最大值 `3.4 × 10^38` 在内存中的表示：

- 符号位：`0`（正数）。
- 指数位：`254`（存储值），实际指数是 `127`。
- 尾数位：`1.11111111111111111111111`（23 位有效数字，接近 2）。

---

##### **5. 为什么 double 的范围更大？**

1. **指数位更多**：

   - `float` 的指数只有 8 位，而 `double` 的指数有 11 位。
   - 每多 1 位指数，指数范围大约扩展 **2 倍**。
   - 所以 `double` 的范围远大于 `float`。

2. **精度更高**：
   - 虽然精度不直接影响范围，但 `double` 的 52 位尾数可以更精确地表示更大的数字。

---

##### **6. 通俗总结**

浮点数的范围主要由 **指数位的数量** 决定。指数位越多，能够表示的数量级越大：

1. **float**：

   - 8 位指数，指数范围是 `-126 到 +127`，因此可以表示大约 `10^-38 到 10^38` 的数字。

2. **double**：
   - 11 位指数，指数范围是 `-1022 到 +1023`，因此可以表示大约 `10^-308 到 10^308` 的数字。

**为什么范围特别大？**

- 浮点数可以通过指数位实现数字的“压缩表达”，比如一个巨大的数字 `1,000,000,000,000` 可以写成 `1.0 × 10^12`，只需要存储有效部分 `1.0` 和指数部分 `12`。

---

##### **7. 总结对比表**

| 类型   | 指数位 | 指数范围       | 最大值        | 最小值（正数） |
| ------ | ------ | -------------- | ------------- | -------------- |
| float  | 8 位   | -126 到 +127   | 3.4 × 10^38   | 1.4 × 10^-45   |
| double | 11 位  | -1022 到 +1023 | 1.79 × 10^308 | 4.9 × 10^-324  |

#### 字符型 char

character 的缩写。表示单个字符类型。字符型就是平时使用的各种字符、字母、数字，以及各种标点符号。

字符类型 char 表示一个字符（两个 byte）。Java 的 char 类型除了可表示标准的 ASCII 外，还可以表示一个 Unicode 字符：

```java
// 字符类型
public class Main {
    public static void main(String[] args) {
        char en = 'A';
        char zh = '中';
        System.out.println(en);
        System.out.println(zh);

//      因为Java在内存中总是使用Unicode表示字符，所以，一个英文字符和一个中文字符都用一个char类型表示，它们都占用两个字节。要显示一个字符的Unicode编码，只需将char类型直接赋值给int类型即可：

        int enUnicode = en;
        System.out.println(enUnicode); // 字母“A”的Unicodde编码是63
        System.out.println((int) zh); // 汉字“中”的Unicode编码是20013

//      还可以直接用转义字符\\u+Unicode编码来表示一个字符
        char enU = '\u0041';
        char zhU = '\u4e2d';
        System.out.println(enU); // 'A'，因为十六进制0041 = 十进制65
        System.out.println(zhU); // '中'，因为十六进制4e2d = 十进制20013
    }
}
```

**注意 char 类型使用单引号'，且仅有一个字符，要和双引号"的字符串类型区分开。**

#### 布尔类型 boolean

表示真或假（true/false），布尔类型 boolean 只有 true 和 false 两个值

```java
boolean b1 = true;
boolean b2 = false;
boolean isGreater = 5 > 3; // 计算结果为true
int age = 12;
boolean isAdult = age >= 18; // 计算结果为false
```

Java 语言对布尔类型的存储并没有做规定，因为理论上存储布尔类型只需要 1 bit，但是通常 JVM 内部会把 boolean 表示为 4 字节整数。

#### 空类型 null

也叫 NULL 类型（null），他是 Java 中一种比较特殊的常量值，通常用于引用数据类型的初始化。

### 引用数据类型

除了上述基本类型的变量，剩下的都是引用类型。例如，引用类型最常用的就是 String 字符串

引用类型的变量类似于 C 语言的指针，它内部存储一个“地址”，指向某个对象在内存的位置

#### 字符串型 String

表示多个字符集合类型。字符串就是多个字符的集合，多个字符组成的串。

在 Java 中表示字符串的时候，需要通过一对双引号将其括起来。

```java
String s = ""; // 空字符串，包含0个字符
String s1 = "A"; // 包含一个字符
String s2 = "ABC"; // 包含3个字符
String s3 = "中文 ABC"; // 包含6个字符，其中有一个空格
```

如果字符串本身恰好包含一个 `"` 字符怎么表示？例如，`"abc"xyz"` ，编译器就无法判断中间的引号究竟是字符串的一部分还是表示字符串结束。这个时候，我们需要借助转义字符 `\` ：

```java
String s = "abc\"xyz"; // 包含7个字符: a, b, c, ", x, y, z
```

因为 `\` 是转义字符，所以，两个 `\\` 表示一个 `\` 字符：

```java
String s = "abc\\xyz"; // 包含7个字符: a, b, c, \, x, y, z
```

常见的转义字符包括：

- `\"` 表示字符`"`
- `\'` 表示字符`'`
- `\\`表示字符`\`
- `\n` 表示换行符
- `\r` 表示回车符
- `\t` 表示 Tab
- `\u`#### 表示一个 Unicode 编码的字符，十六进制

```java
String s = "ABC\n\u4e2d\u6587"; // 包含6个字符: A, B, C, 换行符, 中, 文
```

**Java 的编译器对字符串做了特殊照顾，可以使用+连接任意字符串和其他数据类型，这样极大地方便了字符串的处理。**

**如果用+连接字符串和其他数据类型，会将其他数据类型先自动转型为字符串，再连接。**

```java
// 字符串连接
public class Main {
    public static void main(String[] args) {
        int age = 25;
        String s = "age is " + age;
        System.out.println(s); // age is 25
    }
}
```

如果我们要表示多行字符串，使用+号连接会非常不方便：

```java
String s = "first line \n"
         + "second line \n"
         + "end";
```

从 Java 13 开始，字符串可以用 3 引号 `"""..."""` 表示多行字符串（Text Blocks）了。

```java
// 多行字符串
public class Main {
    public static void main(String[] args) {
        String s = """
                   SELECT * FROM
                     users
                   WHERE id > 100
                   ORDER BY name DESC
                   """;
        System.out.println(s);
    }
}
```

上述多行字符串实际上是 5 行，在最后一个 DESC 后面还有一个\n。如果我们不想在字符串末尾加一个\n，就需要这么写：

```
String s = """
           SELECT * FROM
             users
           WHERE id > 100
           ORDER BY name DESC""";
```

还需要注意到，多行字符串前面共同的空格会被去掉，即：

```
String s = """
...........SELECT * FROM
...........  users
...........WHERE id > 100
...........ORDER BY name DESC
...........""";
```

用`.`标注的空格都会被去掉。

如果多行字符串的排版不规则，那么，去掉的空格就会变成这样：

```
String s = """
.........  SELECT * FROM
.........    users
.........WHERE id > 100
.........  ORDER BY name DESC
.........  """;
```

即总是以最短的行首空格为基准。

##### 不可变特性

Java 的字符串除了是一个引用类型外，还有个重要特点，就是字符串不可变。考察以下代码：

```java
// 字符串不可变
public class Main {
    public static void main(String[] args) {
        String s = "hello";
        System.out.println(s); // 显示 hello
        s = "world";
        System.out.println(s); // 显示 world
    }
}
```

观察执行结果，难道字符串 s 变了吗？其实变的不是字符串，而是变量`s`的“指向”。

- 执行`String s = "hello";`时，JVM 虚拟机先创建字符串`"hello"`，然后，把字符串变量`s`指向它。
- 紧接着，执行`s = "world";`时，JVM 虚拟机先创建字符串`"world"`，然后，把字符串变量`s`指向它。
- 原来的字符串`"hello"`还在，只是我们无法通过变量`s`访问它而已。因此，字符串的不可变是指字符串内容不可变。至于变量，可以一会指向字符串`"hello"`，一会指向字符串`"world"`。

理解了引用类型的“指向”后，就可以解释为什么最后打印出来的是 `"hello"`了。

```java
// 字符串不可变
public class Main {
    public static void main(String[] args) {
        String s = "hello";
        String t = s;
        s = "world";
        System.out.println(t); // t是"hello"还是"world"?
    }
}
```

##### 空值 null

引用类型的变量可以指向一个空值 null，它表示不存在，即该变量不指向任何对象。例如：

```java
String s1 = null; // s1是null
String s2 = s1; // s2也是null
String s3 = ""; // s3指向空字符串，不是null
```

注意要区分空值`null`和空字符串`""`，空字符串是一个有效的字符串对象，它不等于`null`。

#### 数组 Array

定义一个数组类型的变量，使用数组类型“类型[]”，例如，`int[]`。

和单个基本类型变量不同，数组变量初始化必须使用特定方式。

- 指定长度，元素使用默认值，`int[] ns = new int[5]`表示创建一个可容纳 5 个 int 元素的数组。
- 也可以在定义数组时直接指定初始化的元素，这样就不必写出数组大小，而是由编译器自动推算数组大小。`int[] ns = new int[] { 68, 79, 91, 85, 62 };`，还可以进一步简写为：`int[] ns = { 68, 79, 91, 85, 62 };`

##### Java 的数组有几个特点：

- 数组所有元素初始化为默认值，整型都是 0，浮点型是 0.0，布尔型是 false；
- 数组是同一数据类型的集合，数组一旦创建后，大小就不可变；（数组实质是一块地址连续的内存，就像一沓页码连续的白纸）
- 可以通过索引访问数组元素，但索引超出范围将报错。数组索引从 0 开始，例如，5 个元素的数组，索引范围是 0~4。
- 可以修改数组中的某一个元素，使用赋值语句，例如，`ns[1] = 79;`。
- 可以用`数组变量.length` 获取数组大小
- 数组元素可以是值类型（如 int）或引用类型（如 String），但数组本身是引用类型；

##### 数组是引用类型，在使用索引访问数组元素时，如果索引超出范围，运行时将报错

```java
// 数组
public class Main {
    public static void main(String[] args) {
        // 5位同学的成绩:
        int[] ns = new int[5];
        int n = 5;
        System.out.println(ns[n]); // 索引n不能超出范围
    }
}
```

##### 字符串数组

如果数组元素不是基本类型，而是一个引用类型，那么，修改数组元素会有哪些不同？

字符串是引用类型，因此我们先定义一个字符串数组：

```java
// 对于String[]类型的数组变量names，它实际上包含3个元素，但每个元素都指向某个字符串对象：
String[] names = {
    "ABC", "XYZ", "zoo"
};
```

对 names[1]进行赋值，例如`names[1] = "cat";`，注意原来 names[1]指向的字符串"XYZ"并没有改变，仅仅是将 names[1]的引用从指向"XYZ"改成了指向"cat"，其结果是字符串"XYZ"再也无法通过 names[1]访问到了。

#### 类 class

#### 接口 interface

#### Lambda Lambda

### 基本数据类型和引用数据类型的比较

#### 相同点

- 都可以用来创建变量，可以赋值和使用其值
- 它们创建的变量本身都是一个内存地址

#### 不同点

- 基本数据类型变量，是直接在这个变量的内存地址存储变量的值，而引用数据类型存储的是变量所指向的对象的地址，还得需要通过“二级跳”，才能找到对象在内存中的实际地址。
- 引用数据类型是 Java 的一种内部类型，是对所有自定义类型和数组引用的统称，并非特指某种类型

### 单双引号的区别

字符串与单个字符的区别——单个字符使用单引号，而字符串使用双引号，即使双引号中只有一个字符，其表示的也是一个字符串，只不过字符串中的有效字符只有一个而已。

## Java 变量

Java 中，在我们想要使用变量之前，需要先定义一个变量，也就是需要向内存申请一块存储空间，目的是存储某些值，这些值在未来程序运行的某个时间节点可能会发生变化。

在定义变量的时候，需要指定申请的是什么类型的变量，即告诉 Java 要申请多少字节的存储空间来存储什么值。

### 变量的命名规范

- 只能由大小写字母、数字、下划线 `_` 和 `$` 符组成
- 不能由数字开头
- 不能使用 Java 的关键字，如 `class`、`interface`、`int` 等
- 变量名区分大小写
- 推荐命名方式为见名知意，动宾结合，如 openDoor（小驼峰法，常用于变量和方法名），StudentScore（大驼峰法，常用于类名）。
- 切忌中英混合，如 openDoor（可取）/ openMen（不可取）

> #### 扩展

- 表达式（expression）Java 中最基本的功能单位，例如 `int abc`、`1 + 2` 都是表达式。
- 语句（statement） 可以类比于平时说话时的一句话，它由表达式组成，以 `;` 分号结束。例如 `int a = 1;`、`System.out.println(a);` 都是语句。
- 代码块 一对大括号括起来的就是一个代码块

### 使用变量的注意事项

#### 变量的作用域：语句块内有效

在 Java 中，多行语句用`{ ... }`括起来。很多控制语句，例如条件判断和循环，都以`{ ... }`作为它们自身的范围

只要正确地嵌套这些`{ ... }`，编译器就能识别出语句块的开始和结束。而在语句块中定义的变量，它有一个作用域，就是从定义处开始，到语句块结束。超出了作用域引用这些变量，编译器会报错。举个例子：

```java
{
    ...
    int i = 0; // 变量i从这里开始定义
    ...
    {
        ...
        int x = 1; // 变量x从这里开始定义
        ...
        {
            ...
            String s = "hello"; // 变量s从这里开始定义
            ...
        } // 变量s作用域到此结束
        ...
        // 注意，这是一个新的变量s，它和上面的变量同名，
        // 但是因为作用域不同，它们是两个不同的变量:
        String s = "hi";
        ...
    } // 变量x和s作用域到此结束
    ...
} // 变量i作用域到此结束
```

定义变量时，要遵循作用域最小化原则，尽量将变量定义在尽可能小的作用域，并且，不要重复使用变量名。

#### 变量的初始化：变量必须初始化后再使用

### 变量类型转换

#### 隐式类型转换（自动类型转换）：小转大（不丢精度）

- 不会出现问题的类型转换，编程语言可以做自动类型转换，比如低精度的数字向高精度的数字转换。
- 自动类型转换可以发生在算数运算，也可以发生在赋值。

##### 数值精度顺序

double > float > long > int > short > byte

##### char 可以转换为 int

- char 可以转换为 int
- 虽然同样是两个 byte，但是因为 char 是无符号的，值域超出了 short 可以表示的范围，所以不可以自动转为 short。

##### 两个整数类型

在运算过程中，如果参与运算的两个数类型不一致，那么计算结果为较大类型的整型。例如，short 和 int 计算，结果总是 int，原因是 short 首先自动被转型为 int：

```java
// 类型自动提升与强制转型
public class Main {
    public static void main(String[] args) {
        short s = 1234;
        int i = 123456;
        int x = s + i; // s自动转型为int
        short y = s + i; // 编译错误!
    }
}
```

##### 整数与浮点数

如果参与运算的两个数其中一个是整型，一个是浮点型，那么整型可以自动提升到浮点型：

```java
// 类型提升
public class Main {
    public static void main(String[] args) {
        int n = 5;
        double d = 1.2 + 24.0 / n; // 6.0
        System.out.println(d);
    }
}
```

需要特别注意，在一个复杂的四则运算中，两个整数的运算不会出现自动提升的情况。例如：

```java
double d = 1.2 + 24 / 5; // 结果不是 6.0 而是 5.2
```

计算结果为 5.2，原因是编译器计算 24 / 5 这个子表达式时，按两个整数进行运算，结果仍为整数 4。

要修复这个计算结果，可以将 24 / 5 改为 24.0 / 5。由于 24.0 是浮点数，因此，计算除法时自动将 5 提升为浮点数。

#### 显示类型转换（需要进行强制类型转换）：大转小（可能丢精度）

- 可能出现问题的类型转换，需要使用强制类型转换（就是程序员要手动进行转换），比如高精度数值向低精度数值转换
- 强制类型转换也是操作符
- 语法：**是用小括号括起来的目标类型放在被转换的值前面**，例如 `short s = (short) i;`
- 强制转换会造成数据精度丢失

##### 整数类型转换

也可以将结果强制转型，即将大范围的整数转型为小范围的整数。强制转型使用(类型)，例如，将 int 强制转型为 short：

```java
int i = 12345;
short s = (short) i; // 12345
```

要注意，超出范围的强制转型会得到错误的结果，原因是转型时，int 的两个高位字节直接被扔掉，仅保留了低位的两个字节：

```java
// 强制转型
public class Main {
    public static void main(String[] args) {
        int i1 = 1234567;
        short s1 = (short) i1; // -10617
        System.out.println(s1);
        int i2 = 12345678;
        short s2 = (short) i2; // 24910
        System.out.println(s2);
    }
}
```

##### 浮点数类型转换为整数类型

可以将浮点数强制转型为整数。在转型时，浮点数的小数部分会被丢掉。如果转型后超过了整型能表示的最大范围，将返回整型的最大值。例如：

```java
int n1 = (int) 12.3; // 12
int n2 = (int) 12.7; // 12
int n3 = (int) -12.7; // -12
int n4 = (int) (12.7 + 0.5); // 13
int n5 = (int) 1.2e20; // 2147483647
```

如果要进行四舍五入，可以对浮点数加上 0.5 再强制转型：

```java
// 四舍五入
public class Main {
    public static void main(String[] args) {
        double d = 2.6;
        int n = (int) (d + 0.5);
        System.out.println(n);
    }
}

```

### 变量作用域

#### 局部变量

在方法内部定义的变量称为局部变量，局部变量作用域从变量声明处开始到对应的块结束。方法参数也是局部变量。

使用局部变量时，应该尽可能把局部变量的作用域缩小，尽可能延后声明局部变量

#### 注意

- 代码块其实就是局部变量的作用域，代码块里可以使用外层代码块的变量，但是不能再外层代码块中使用内层代码块的变量
- 内层代码库不可以重复定义外层代码块的变量，同一个代码块中的变量也不可以重名

## Java 常量

定义变量的时候，如果加上 final 修饰符，这个变量就变成了常量：

```java
final double PI = 3.14; // PI是一个常量
double r = 5.0;
double area = PI * r * r;
PI = 300; // compile error!
```

常量在定义时进行初始化后就不可再次赋值，再次赋值会导致编译错误。

常量的作用是用有意义的变量名来避免魔术数字（Magic number），例如，不要在代码中到处写 3.14，而是定义一个常量。如果将来需要提高计算精度，我们只需要在常量的定义处修改，例如，改成 3.1416，而不必在所有地方替换 3.14。

**为了和变量区分开来，根据习惯，常量名通常全部大写。**

## Java 运算符

运算符对一个或者多个值进行运算，并得出一个运算结果。

**注意，除赋值运算符外，运算符本身不会更改变量的值。**

- 算术运算符：`+`、`-`、`*`、`/`、`%`
- 关系运算符：`>`, `<`, `>=`, `<=`, `==`, `!=`
- 逻辑运算符：`&&`、`||`、`!`
- 赋值运算符：`=`、`+=`、`-=`、`*=`、`/=`、`%=`
- 位运算符：`&`、`|`、`^`、`~`、`<<`、`>>`
- 条件运算符：`? :`
- instanceof 运算符：`instanceof`

### 运算符优先级

通常优先级由高到底的顺序依次是：增量和减量运算 → 算术运算符 → 比较运算 → 逻辑运算 → 赋值运算

在 Java 的计算表达式中，运算优先级从高到低依次是：

- `()`
- `!` `~` `++` `--`
- `*` `/` `%`
- `+` `-`
- `<` `>` `>=` `<=`
- `==` `!=`
- ` <<`` >> ` `>>>`
- `^`
- `&` `&&` `|` `||`
- `?:`
- `+=` `-=` `*=` `/=`

记不住也没关系，只需要加括号就可以保证运算的优先级正确。

https://i.bjpowernode.com/article/368.html

### 整数运算

#### 整数运算规则

Java 的整数运算遵循四则运算规则，可以使用任意嵌套的小括号。四则运算规则和初等数学一致。

##### int 除以 int 还是 int，不会变成浮点数

整数的数值表示不但是精确的，而且整数运算永远是精确的，即使是除法也是精确的，因为两个整数相除只能得到结果的整数部分：

```java
int x = 12345 / 67; // 184
int y = 12345 % 67; // 12345÷67的余数是17
```

如果要得到一个包含小数的结果，需要将其中一个整数变成浮点数

**特别注意：整数的除法对于除数为 0 时运行时将报错，但编译不会报错。**

#### 整数运算溢出

特别注意，整数由于存在范围限制，如果计算结果超出了范围，就会产生溢出，而溢出不会出错，却会得到一个奇怪的结果：

```java
// 运算溢出
public class Main {
    public static void main(String[] args) {
        int x = 2147483640;
        int y = 15;
        int sum = x + y;
        System.out.println(sum); // -2147483641，其实就是截取了最后的 4 个字节
    }
}
```

要解决上面的问题，可以把 int 换成 long 类型，由于 long 可表示的整型范围更大，所以结果就不会溢出：

```java
long x = 2147483640;
long y = 15;
long sum = x + y;
System.out.println(sum); // 2147483655
```

#### 自增/自减

注意：`++`写在前面和后面计算结果是不同的，`++n`表示先加 1 再引用 n，`n++`表示先引用 n 再加 1。不建议把++运算混入到常规运算中，容易自己把自己搞懵了。

#### 位运算

位运算是按位进行与、或、非和异或的运算。

与运算的规则是，必须两个数同时为 1，结果才为 1：

```java
n = 0 & 0; // 0
n = 0 & 1; // 0
n = 1 & 0; // 0
n = 1 & 1; // 1
```

或运算的规则是，只要任意一个为 1，结果就为 1：

```java
n = 0 | 0; // 0
n = 0 | 1; // 1
n = 1 | 0; // 1
n = 1 | 1; // 1
```

非运算的规则是，0 和 1 互换：

```java
n = ~0; // 1
n = ~1; // 0
```

异或运算的规则是，如果两个数不同，结果为 1，否则为 0：

```java
n = 0 ^ 0; // 0
n = 0 ^ 1; // 1
n = 1 ^ 0; // 1
n = 1 ^ 1; // 0
```

**注意：按位运算符和位移运算符不会改变原本的变量的值**

##### 位运算的实际应用场景

- 掩码：例如一个 int 类型使用按位运算符 & 实现掩码，可以表示 31 种状态
- 高效除以 2：按位运算符的有符号右移运算符 `>>` 可以高效地除以 2，因为二进制表示的数除以 2 就是右移一位

### 浮点数运算

#### 浮点数误差

浮点数运算和整数运算相比，只能进行加减乘除这些数值计算，不能做位运算和移位运算。

在计算机中，浮点数虽然表示的范围大，但是，浮点数有个非常重要的特点，就是浮点数常常无法精确表示。

浮点数 0.1 在计算机中就无法精确表示，因为十进制的 0.1 换算成二进制是一个无限循环小数，很显然，无论使用 float 还是 double，都只能存储一个 0.1 的近似值。但是，0.5 这个浮点数又可以精确地表示。

因为浮点数常常无法精确表示，因此，浮点数运算会产生误差：

```java
// 浮点数运算误差
public class Main {
    public static void main(String[] args) {
        double x = 1.0 / 10;
        double y = 1 - 9.0 / 10;
        // 观察x和y是否相等:
        System.out.println(x);
        System.out.println(y);
    }
}
```

**由于浮点数存在运算误差，所以比较两个浮点数是否相等常常会出现错误的结果。正确的比较方法是判断两个浮点数之差的绝对值是否小于一个很小的数：**

```java
// 错误
public class Main {
    public static void main(String[] args) {
        double x = 1 - 9.0 / 10;
        if (x == 0.1) {
            System.out.println("x is 0.1");
        } else {
            System.out.println("x is NOT 0.1");
        }
    }
}

// 正确的方法是利用差值小于某个临界值来判断
public class Main {
    public static void main(String[] args) {
        double x = 1 - 9.0 / 10;
        if (Math.abs(x - 0.1) < 0.00001) {
            System.out.println("x is 0.1");
        } else {
            System.out.println("x is NOT 0.1");
        }
    }
}
```

#### 浮点数溢出

整数运算在除数为 0 时会报错，而浮点数运算在除数为 0 时，不会报错，但会返回几个特殊值：

- NaN 表示 Not a Number
- Infinity 表示无穷大
- -Infinity 表示负无穷大

```java
double d1 = 0.0 / 0; // NaN
double d2 = 1.0 / 0; // Infinity
double d3 = -1.0 / 0; // -Infinity
```

这三种特殊值在实际运算中很少碰到，我们只需要了解即可。

### 布尔运算

布尔运算是一种关系运算，包括以下几类：

- 比较运算符：`>`，`>=`，`<`，`<=`，`==`，`!=`
- 与运算 `&&`
- 或运算 `||`
- 非运算 `!`

```java
boolean isGreater = 5 > 3; // true
int age = 12;
boolean isZero = age == 0; // false
boolean isNonZero = !isZero; // true
boolean isAdult = age >= 18; // false
boolean isTeenager = age >6 && age <18; // true
```

关系运算符的优先级从高到低依次是：

- `!`
- `>`，`>=`，`<`，`<=`
- `==`，`!=`
- `&&`
- `||`

## 流程控制

### 输入输出

#### 输入

一个从控制台读取一个字符串和一个整数的例子：

```java
// 通过import语句导入java.util.Scanner，import是导入某个类的语句，必须放到Java源代码的开头
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        // System.out代表标准输出流，而System.in代表标准输入流。
        // 创建Scanner对象并传入System.in。直接使用System.in读取用户输入虽然是可以的，但需要更复杂的代码，而通过Scanner就可以简化后续的代码。
        Scanner scanner = new Scanner(System.in); // 创建Scanner对象
        System.out.print("Input your name: "); // 打印提示
        // 有了Scanner对象后
        // 要读取用户输入的字符串，使用scanner.nextLine()
        // 要读取用户输入的整数，使用scanner.nextInt()
        // 此外还有 nextDouble() 等等。
        String name = scanner.nextLine(); // 读取一行输入并获取字符串
        System.out.print("Input your age: "); // 打印提示
        int age = scanner.nextInt(); // 读取一行输入并获取整数
        System.out.printf("Hi, %s, you are %d\n", name, age); // 格式化输出
    }
}
```

#### 输出

##### System.out 的常用方法

1. **`println()`**

   - 全称：print line
   - 功能：打印内容并换行
   - 示例：`System.out.println("Hello World");`

2. **`print()`**

   - 全称：print
   - 功能：打印内容但不换行
   - 示例：`System.out.print("Hello");`

3. **`printf()`**

   - 全称：print formatted
   - 功能：按指定格式打印
   - 示例：`System.out.printf("名字：%s, 年龄：%d", name, age);`

4. **`format()`**
   - 功能：类似 printf，但返回格式化字符串而非直接打印
   - 示例：`String message = String.format("总数：%d", total);`

##### 详细解释 printf

格式说明符

| 格式符 | 含义                   | 示例                          |
| ------ | ---------------------- | ----------------------------- |
| `%s`   | 字符串                 | `"Hello %s", name`            |
| `%d`   | 整数                   | `"年龄：%d", age`             |
| `%f`   | 浮点数                 | `"价格：%.2f", price`         |
| `%x`   | 格式化输出十六进制整数 |                               |
| `%b`   | 布尔值                 | `"是否可用：%b", isAvailable` |
| `%n`   | 平台无关换行           | `"结束%n"`                    |

**注意，由于%表示占位符，因此，连续两个%%表示一个%字符本身。**

##### 示例代码 1

```java
public class FormattedPrintDemo {
    public static void main(String[] args) {
        String name = "张三";
        int age = 30;
        double salary = 5000.75;

        // 不同的格式化输出
        System.out.printf("姓名：%s%n", name);
        System.out.printf("年龄：%d%n", age);
        System.out.printf("工资：%.2f%n", salary);

        // 复合格式化
        System.out.printf("员工信息：姓名=%s, 年龄=%d, 工资=%.2f%n", name, age, salary);
    }
}
```

##### 实例代码 2

占位符本身还可以有更详细的格式化参数。下面的例子把一个整数格式化成十六进制，并用 0 补足 8 位（默认用空位补足）：

```java
// 格式化输出
public class Main {
    public static void main(String[] args) {
        int n = 12345000;
        System.out.printf("n=%d, hex=%08x", n, n); // 注意，两个%占位符必须传入两个数
    }
}
```

##### 小贴士和最佳实践

1. 使用 `%n` 代替 `\n`，因为 `%n` 是跨平台的换行符
2. 注意格式说明符要匹配实际数据类型
3. 对于复杂的格式化，考虑使用 `String.format()`

### 判断

#### 浮点数在计算机中常常无法精确表示，并且计算可能出现误差，因此，判断浮点数相等用==判断不靠谱，正确的方法是利用差值小于某个临界值来判断。

#### 判断引用类型相等

在 Java 中，判断值类型的变量是否相等，可以使用==运算符。但是，判断引用类型的变量是否相等，==表示“引用是否相等”，或者说，是否指向同一个对象。例如，下面的两个 String 类型，它们的内容是相同的，但是，分别指向不同的对象，用==判断，结果为 false。

```java
public class Main {
    public static void main(String[] args) {
        String s1 = "hello";
        String s2 = "HELLO".toLowerCase();
        System.out.println(s1);
        System.out.println(s2);
        if (s1 == s2) {
            System.out.println("s1 == s2");
        } else {
            System.out.println("s1 != s2");
        }
    }
}
```

要判断引用类型的变量内容是否相等，必须使用`equals()`方法：

```java
// 条件判断
public class Main {
    public static void main(String[] args) {
        String s1 = "hello";
        String s2 = "HELLO".toLowerCase();
        System.out.println(s1);
        System.out.println(s2);
        if (s1.equals(s2)) {
            System.out.println("s1 equals s2");
        } else {
            System.out.println("s1 not equals s2");
        }
    }
}
```

注意：执行语句 `s1.equals(s2)` 时，如果变量 s1 为 `null`，会报 `NullPointerException`,要避免 `NullPointerException` 错误，可以利用短路运算符 `&&`，或者把一定不是 `null` 的对象`"hello"`放到前面：例如：`if ("hello".equals(s)) { ... }`。

```java
// 错误
public class Main {
    public static void main(String[] args) {
        String s1 = null;
        if (s1.equals("hello")) {
            System.out.println("hello");
        }
    }
}

// 正确
public class Main {
    public static void main(String[] args) {
        String s1 = null;
        if (s1 != null && s1.equals("hello")) {
            System.out.println("hello");
        }
    }
}
```

#### switch 判断

##### switch 特点

- switch 语句可以做多重选择，然后执行匹配的 case 语句后续代码；
- switch 的计算结果必须是整型、字符串或枚举类型；
- 注意千万不要漏写 break，建议打开 fall-through 警告；
- 总是写上 default，建议打开 missing default 警告；
- 从 Java 14 开始，switch 语句正式升级为表达式，不再需要 break，并且允许使用 yield 返回值。

##### switch 新表达式

使用 switch 时，如果遗漏了 break，就会造成严重的逻辑错误，而且不易在源代码中发现错误。从 Java 12 开始，switch 语句升级为更简洁的表达式语法，使用类似模式匹配（Pattern Matching）的方法，保证只有一种路径会被执行，并且不需要 break 语句：

```java
public class Main {
    public static void main(String[] args) {
        String fruit = "apple";
        switch (fruit) {
        case "apple" -> System.out.println("Selected apple");
        case "pear" -> System.out.println("Selected pear");
        case "mango" -> {
            System.out.println("Selected mango");
            System.out.println("Good choice!");
        }
        default -> System.out.println("No fruit selected");
        }
    }
}
```

注意新语法使用->，如果有多条语句，需要用{}括起来。不要写 break 语句，因为新语法只会执行匹配的语句，没有穿透效应。

使用新的 switch 语法，不但不需要 break，还可以直接返回值：

```java
// 旧语法
int opt;
switch (fruit) {
case "apple":
    opt = 1;
    break;
case "pear":
case "mango":
    opt = 2;
    break;
default:
    opt = 0;
    break;
}

// 新语法
public class Main {
    public static void main(String[] args) {
        String fruit = "apple";
        int opt = switch (fruit) {
            case "apple" -> 1;
            case "pear", "mango" -> 2; // 多个判断用逗号分隔
            default -> 0;
        }; // 注意赋值语句要以;结束
        System.out.println("opt = " + opt);
    }
}
```

大多数时候，在 switch 表达式内部，我们会返回简单的值。

但是，如果需要复杂的语句，我们也可以写很多语句，放到{...}里，然后，用 `yield` 返回一个值作为 switch 语句的返回值

```java
public class Main {
    public static void main(String[] args) {
        String fruit = "orange";
        int opt = switch (fruit) {
            case "apple" -> 1;
            case "pear", "mango" -> 2;
            default -> {
                int code = fruit.hashCode();
                yield code; // switch语句返回值
            }
        };
        System.out.println("opt = " + opt);
    }
}
```

### 循环

for 循环的功能非常强大，它使用计数器实现循环。for 循环会先初始化计数器，然后，在每次循环前检测循环条件，在每次循环后更新计数器。计数器变量通常命名为 i。

**注意 for 循环的初始化计数器总是会被执行，并且 for 循环也可能循环 0 次。**

#### for each 循环

很多时候，我们实际上真正想要访问的是数组每个元素的值。Java 还提供了另一种 for each 循环，它可以更简单地遍历数组。

和 for 循环相比，for each 循环的变量 n 不再是计数器，而是直接对应到数组的每个元素。for each 循环的写法也更简洁。但是，for each 循环无法指定遍历顺序，也无法获取数组的索引。

除了数组外，for each 循环能够遍历所有“可迭代”的数据类型，包括 List、Map 等。

```java
public class Main {
    public static void main(String[] args) {
        int[] ns = { 1, 4, 9, 16, 25 };
        for (int n : ns) {
            System.out.println(n);
        }
    }
}
```

#### break ：跳出当前循环

在循环过程中，可以使用 break 语句跳出当前循环。break 语句通常都是配合 if 语句使用。要特别注意，break 语句总是跳出自己所在的那一层循环

```java
public class Main {
    public static void main(String[] args) {
        int sum = 0;
        //使用for循环计算从1到100时，我们并没有在for()中设置循环退出的检测条件。
        for (int i=1; ; i++) {
            sum = sum + i;
            // 在循环内部，我们用if判断，如果i==100，就通过break退出循环。
            if (i == 100) {
                break;
            }
        }
        System.out.println(sum);
    }
}
```

#### continue ：跳过本次循环，继续当前循环

break 会跳出当前循环，也就是整个循环都不会执行了。而 continue 则是提前结束本次循环，直接继续执行下次循环。

在多层嵌套的循环中，continue 语句同样是结束本次自己所在的循环。

## 方法（函数）

### 概念和定义

### 使用方法的好处

### 名词解析

### 注意事项

### 方法的重载

## 面向对象

### 类和对象的概念

面向对象编程，是一种通过对象的方式，把现实世界映射到计算机模型的一种编程方法。

- 类是对象的抽象
- 对象是类的实例

**一个 Java 源文件可以包含多个类的定义，但只能定义一个 public 类，且 public 类名必须与文件名一致。如果要定义多个 public 类，必须拆到多个 Java 源文件中。**

### 对象的使用步骤

以 IDEA 编辑器为例

#### 1. 创建包

在创建类的时候可以先创建包，然后在包里创建自定义类。实际上，包就是项目目录中的子目录。

创建方法：在项目的 src 目录上单击右键->选择 new（新建）->选择 Packages（包）->输入包名->确认

定义包名的时候，通常使用域名逆序的排列来定义，这样能保证唯一性。（例如：com.example.xxx）

#### 2. 创建自定义类

包创建成功后，在项目目录下会出现一个新的目录，这个目录就是刚才创建的包。在包目录上单击右键->选择 new（新建）->选择 Java Class（Java 类）->输入类名->确认

在 IDEA 的包中创建类时，IDEA 会默认添加一行代码，指定当前的包名。

```java
package com.example.PersonDemo;
```

#### 3. 在使用类之前，需要实现导入这个类所在的包。语法是：`import 包名.类名;`

注意：当前使用的类和当前类处于同一个包下的时候，不需要 import，如果不在同一个包内，就需要使用 import 导入包。

另外，IDEA 会在实例化（new）对象的时候自动生成 import 语句。

#### 4. 实例化对象：`类名 对象名 = new 类名();`，之后通过对象名调用类实例属性及方法：`对象名.属性名 或 对象名.方法名`

### 类的变量和方法

- 实例（成员）变量
  - 公有实例属性
  - 私有实例属性
  - 受保护的实例属性
- 静态变量
- 局部变量
- 实例（成员）方法
  - 公有实例方法
  - 私有实例方法
  - 受保护的实例方法
- 静态方法

#### 注意事项

- 使用 new 创建了一个类的实例后，类中定义的每种变量都会被赋以其类型的初始值
- 在方法内部，可以使用一个隐含的变量 this，它始终指向当前实例。因此，通过 this.field 就可以访问当前实例的字段。**如果没有命名冲突，可以省略 this。**
- 可变参数用类型...定义，可变参数相当于数组类型，不过还是有区别的，如果把可变参数改写为数组类型，例如 String[]类型，调用方需要自己先构造 String[]，比较麻烦。并且可变参数可以保证无法传入 null，因为传入 0 个参数时，接收到的实际值是一个空数组而不是 null。

```java
class Group {
    private String[] names;

    public void setNames(String... names) {
        this.names = names;
    }
}
```

- 基本类型参数的传递，是调用方值的复制。双方各自的后续修改，互不影响。
- 引用类型参数的传递，调用方的变量，和接收方的参数变量，指向的是同一个对象。双方任意一方对这个对象的修改，都会影响对方

### 修饰符

#### 访问修饰符

Java 内建的访问权限包括 `public`、`protected`、`private` 和 `package` 权限；

- public
  - 定义为 public 的 class、interface 可以被其他任何类访问
  - 定义为 public 的 field、method 可以被其他类访问，前提是首先有访问 class 的权限
  - 如果不确定是否需要 public，就不声明为 public，即尽可能少地暴露对外的字段和方法。
  - **一个`.java` 文件只能包含一个 `public` 类，但可以包含多个非 public 类。如果有 `public` 类，文件名必须和 `public` 类的名字相同。**
- private
  - 定义为 private 的 field、method 无法被其他类访问，即使是继承它的子类也不行
  - 实际上，确切地说，private 访问权限被限定在 class 的内部，而且与方法声明顺序无关。推荐把 private 方法放到后面，因为 public 方法定义了类对外提供的功能，阅读代码的时候，应该先关注 public 方法
  - 由于 Java 支持嵌套类，如果一个类内部还定义了嵌套类，那么，嵌套类拥有访问 private 的权限
- protected
  - protected 作用于继承关系。定义为 protected 的字段和方法可以被子类访问，以及子类的子类

扩展：package 包作用域是指一个类允许访问同一个 `package` 的没有 `public`、`private` 修饰的 `class`，以及没有 `public`、`protected`、`private` 修饰的字段和方法。

#### 非访问修饰符

- static 静态字段/方法
- final 最终
- abstract
- synchronized
- volatile

#### final 修饰符

final 修饰符是一种 Java 关键字，表示最终的，用于修饰类、变量和方法，用来限定其不能被继承、修改或删除。可以用来保护代码和数据的安全性。

final 修饰符在以下几种场景中可以具体使用：

1. 类：当声明一个类为 final 时，它就成为一个不可变类，不能被其它类继承。
2. 方法：当声明一个方法为 final 时，它就不能被子类重写。
3. 变量：当声明一个变量为 final 时，它就成为一个常量，不能被修改。

##### 使用语法

```
[modifier] final class ClassName
[modifier] final [type] variableName
[modifier] final returnType methodName(parameters)
```

##### 注意事项

- 使用 final 修饰符的时候需要注意以下几点：
- 不要试图修改一个 final 变量，因为它是一个常量，只能被初始化一次。
- 当使用 final 修饰符修饰一个方法时，该方法就不能被子类重写。
- 不要尝试继承一个 final 类，因为它不能被继承。
- 尽量不要把一个类声明为 final，因为这样会限制类的扩展性。
- 使用 final 修饰的引用类型的变量不能被重新赋值（仅仅保证变量的地址不变），但可以改变引用类型所引用对象的内容。

##### 代码示例

final 修饰的类不能被继承，如果一个类不希望任何其他类继承自它，那么可以把这个类本身标记为 final。用 final 修饰的类不能被继承：

```java
final class Person {
    protected String name;
}

// compile error: 不允许继承自Person
class Student extends Person {
}
```

final 修饰的方法不能被 Override，继承可以允许子类覆写父类的方法。如果一个父类不允许子类对它的某个方法进行覆写，可以把该方法标记为 final。用 final 修饰的方法不能被 Override：

```java
class Person {
    protected String name;
    public final String hello() {
        return "Hello, " + name;
    }
}

class Student extends Person {
    // compile error: 不允许覆写
    @Override
    public String hello() {
    }
}
```

对于一个类的实例字段，同样可以用 final 修饰。用 final 修饰的字段在初始化后不能被修改。

```java
class Person {
    public final String name = "Unamed";
}
// 对final字段重新赋值会报错
Person p = new Person();
p.name = "New Name"; // compile error!

// 可以在构造方法中初始化final字段,这种方法更为常用，因为可以保证实例一旦创建，其final字段就不可修改。
class Person {
    public final String name;
    public Person(String name) {
        this.name = name;
    }
}
```

##### 静态字段/方法

实例字段在每个实例中都有自己的一个独立“空间”，但是静态字段只有一个共享“空间”，所有实例都会共享该字段

对于静态字段，无论修改哪个实例的静态字段，效果都是一样的：所有实例的静态字段都被修改了，原因是静态字段并不属于实例

虽然实例可以访问静态字段，但是它们指向的其实都是 Person class 的静态字段。所以，所有实例共享一个静态字段。

因此，不推荐用实例变量.静态字段去访问静态字段，因为在 Java 程序中，实例对象并没有静态字段。在代码中，实例对象能访问静态字段只是因为编译器可以根据实例类型自动转换为类名.静态字段来访问静态对象。

推荐用类名来访问静态字段。可以把静态字段理解为描述 class 本身的字段。

有静态字段，就有静态方法。用 static 修饰的方法称为静态方法。

调用实例方法必须通过一个实例变量，而调用静态方法则不需要实例变量，通过类名就可以调用。静态方法类似其它编程语言的函数。

因为静态方法属于 class 而不属于实例，因此，静态方法内部，无法访问 this 变量，也无法访问实例字段，它只能访问静态字段和静态方法。

通过实例也可以调用静态方法，但这只是编译器自动帮我们把实例改写成类名而已。

通常情况下，通过实例访问静态字段和静态方法，会得到一个编译警告。

静态方法常用于工具类和辅助方法。例如：Arrays.sort()、Math.random()

静态方法也经常用于辅助方法。注意到 Java 程序的入口 main()也是静态方法。

### 构造方法

创建实例的时候，实际上是通过构造方法来初始化实例的。

#### 构造方法特点

- 构造方法的名称就是类名。
- 构造方法的参数没有限制，在方法内部，也可以编写任意语句。
- 和普通方法相比，构造方法没有返回值（也没有 void）
- 调用构造方法，必须用 new 操作符。
- 如果一个类没有定义构造方法，编译器会自动为我们生成一个默认构造方法，它没有参数，也没有执行语句，类似这样：

```java
class Person {
    public Person() {
    }
}
```

- 要特别注意的是，如果我们自定义了一个构造方法，那么，编译器就不再自动创建默认构造方法。因此，如果既要能使用带参数的构造方法，又想保留不带参数的构造方法，那么必须显示地定义一个无参数的构造方法。
- 可以定义多个构造方法，在通过 new 操作符调用的时候，编译器通过构造方法的参数数量、位置和类型自动区分
- 一个构造方法可以调用其他构造方法，这样做的目的是便于代码复用。调用其他构造方法的语法是 `this(…)`
- 没有在构造方法中初始化字段时，引用类型的字段默认是 null，数值类型的字段用默认值，int 类型默认值是 0，布尔类型默认值是 false

#### Java 创建对象实例的时候，初始化顺序

```java
class Person {
    private String name = "Unamed";
    private int age = 10;

    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }
}
```

1. 如果类中有字段初始化，先初始化字段，例如，int age = 10;表示字段初始化为 10，double salary;表示字段默认初始化为 0，String s;表示引用类型字段默认初始化为 null；
2. 执行构造方法的代码进行初始化。

### 重载

在一个类中，我们可以定义多个方法。如果有一系列方法，它们的功能都是类似的，只有参数有所不同，那么，可以把这一组方法名做成同名方法。

这种方法名相同，但各自的参数不同（个数、类型、顺序），称为方法重载（Overload）。

#### 注意

- 方法重载的返回值类型通常都是相同的。
- 方法重载的目的是，功能类似的方法使用同一名字，更容易记住，因此，调用起来更简单。
- 方法重载（Overload）是同名不同参，方法重写（Override）是同名同参

### 继承

#### 继承的特点

- 继承是面向对象编程的一种强大的代码复用方式。
- 子类自动获得了父类的所有字段，严禁定义与父类重名的字段！
- 在 Java 中，没有明确写 `extends` 的类，编译器会自动加上 `extends Object`。所以，任何类，除了 `Object`，都会继承自某个类。
- Java 只允许一个 class 继承自一个类，因此，一个类有且仅有一个父类。只有 Object 特殊，它没有父类。
- `super` 关键字表示父类（超类）。子类引用父类的字段时，可以用 `super.fieldName`。如果这个字段只有父类中定义，例如 `name` 字段，那么使用 `super.name`，或者 `this.name`，或者 `name`，效果都是一样的。编译器会自动定位到父类的 `name` 字段。
- 在某些时候，就必须使用 `super`，因为在 Java 继承中，任何 class 的构造方法，第一行语句必须是调用父类的构造方法。如果没有明确地调用父类的构造方法，编译器会帮我们自动加一句 `super()`;如果此时父类并没有无参数的构造方法，就会编译失败，解决方法是调用父类存在的某个构造方法。因此，如果父类没有默认的构造方法，子类就必须显式调用 `super()` 并给出参数以便让编译器定位到父类的一个合适的构造方法。
- 子类不会继承任何父类的构造方法。子类默认的构造方法是编译器自动生成的，不是继承的。
- 正常情况下，只要某个 class 没有 `final` 修饰符，那么任何类都可以从该 class 继承。
- 从 Java 15 开始，允许使用 `sealed` 修饰 class，并通过 `permits` 明确写出能够从该 class 继承的子类名称。`sealed` 类在 Java 15 中目前是预览状态，要启用它，必须使用参数`--enable-preview` 和 `--source 15`。

```java
// Shape类就是一个sealed类，它只允许指定的3个类继承它
public sealed class Shape permits Rect, Circle, Triangle {
    ...
}
// Rect出现在Shape的permits列表中，运行正常
public final class Rect extends Shape {...}
// Ellipse会报错
public final class Ellipse extends Shape {...}
// Compile error: class is not allowed to extend sealed class: Shape
```

- 把一个子类类型安全地变为父类类型的赋值，被称为向上转型（upcasting），向上转型实际上是把一个子类型安全地变为更加抽象的父类型
- 和向上转型相反，如果把一个父类类型强制转型为子类类型，就是向下转型（downcasting），向下转型很可能会失败。失败的时候，Java 虚拟机会报 ClassCastException。为了避免向下转型出错，Java 提供了 instanceof 操作符，可以先判断一个实例究竟是不是某种类型。`instanceof` 实际上判断一个变量所指向的实例是否是指定类型，或者这个类型的子类。如果一个引用变量为 `null`，那么对任何 `instanceof` 的判断都为 `false`。利用 instanceof，在向下转型前可以先判断：

```java
Person p = new Student();
if (p instanceof Student) {
    // 只有判断成功才会向下转型:
    Student s = (Student) p; // 一定会成功
}

// 从Java 14开始，判断instanceof后，可以直接转型为指定变量，避免再次强制转型。
Object obj = "hello";
if (obj instanceof String) {
    String s = (String) obj;
    System.out.println(s.toUpperCase());
}
// 以下这种使用instanceof的写法更加简洁，可以改写为
Object obj = "hello";
if (obj instanceof String s) {
    // 可以直接使用变量s:
    System.out.println(s.toUpperCase());
}
```

#### 父类、子类、局部变量名重复、冲突时的访问规则

#### 继承中的权限

- 继承中，子类无法访问父类的 `private` 字段或者 `private` 方法。
- 为了让子类可以访问父类的字段，我们需要把 `private` 改为 `protected`。用 `protected` 修饰的字段可以被子类访问。`protected` 关键字可以把字段和方法的访问权限控制在继承树内部，一个 `protected` 字段和方法可以被其子类，以及子类的子类所访问

## 抽象（abstract）

在 Java 中，`abstract` 是一个修饰符，用 `abstract` 修饰的类叫抽象类，用 `abstract` 修饰的方法叫作抽象方法。

### 抽象方法的实际应用

在多态的应用中，设想一个场景，从 Person 类派生的 Student 和 Teacher 都可以覆写 run()方法。

```java
class Person {
    public void run() { … }
}

class Student extends Person {
    @Override
    public void run() { … }
}

class Teacher extends Person {
    @Override
    public void run() { … }
}
```

如果父类 Person 的 run() 方法没有实际意义，能否去掉方法的执行语句？答案是不行，会导致编译错误，因为定义方法的时候，必须实现方法的语句。

```java
class Person {
    public void run(); // Compile Error!
}
```

能不能去掉父类的 run()方法？答案还是不行，因为去掉父类的 run()方法，就失去了多态的特性。例如，runTwice()就无法编译：

```java
public void runTwice(Person p) {
    p.run(); // Person没有run()方法，会导致编译错误
    p.run();
}
```

如果父类的方法本身不需要实现任何功能，仅仅是为了定义方法，目的是让子类去覆写它，那么，可以把父类的方法声明为抽象方法：

```java
class Person {
    public abstract void run();
}
```

把一个方法声明为 `abstract`，表示它是一个抽象方法，本身没有实现任何方法语句。因为这个抽象方法本身是无法执行的，所以，`Person` 类也无法被实例化。编译器会告诉我们，无法编译 `Person` 类，因为它包含抽象方法。

必须把 `Person` 类本身也声明为 `abstract`，才能正确编译它：

```java
abstract class Person {
    public abstract void run();
}
```

### abstract 注意事项

- 如果一个 `class` 定义了方法，但没有具体执行代码，这个方法就是抽象方法，抽象方法用 `abstract` 修饰。因为无法执行抽象方法，因此这个类也必须申明为抽象类（abstract class），即定义了抽象方法的 class 必须被定义为抽象类。
- 使用 `abstract` 修饰的类就是抽象类。我们无法实例化一个抽象类,`Person p = new Person(); // 编译错误`
- 无法实例化的抽象类有什么用？因为抽象类本身被设计成只能用于被继承，因此，抽象类可以强迫子类实现其定义的抽象方法，否则编译会报错。因此，抽象方法实际上相当于定义了“规范”。
- 从抽象类继承的子类必须实现抽象方法，如果不实现抽象方法，则该子类仍是一个抽象类

### 面向抽象编程

当我们定义了抽象类 Person，以及具体的 Student、Teacher 子类的时候，我们可以通过抽象类 Person 类型去引用具体的子类的实例：

```java
Person s = new Student();
Person t = new Teacher();
```

这种引用抽象类的好处在于，我们对其进行方法调用，并不关心 Person 类型变量的具体子类型：

```java
// 不关心Person变量的具体子类型:
s.run();
t.run();
```

同样的代码，如果引用的是一个新的子类，我们仍然不关心具体类型：

```java
// 同样不关心新的子类是如何实现run()方法的：
Person e = new Employee();
e.run();
```

**这种尽量引用高层类型，避免引用实际子类型的方式，称之为面向抽象编程。**

#### 面向抽象编程的本质就是：

- 上层代码只定义规范（例如：abstract class Person）；
- 不需要子类就可以实现业务逻辑（正常编译）；
- 具体的业务逻辑由不同的子类实现，调用者并不关心。

## 接口（interface）

接口（interface）是一种公共的规范，是一种引用数据类型。

在抽象类中，抽象方法本质上是定义接口规范：即规定高层次类的接口，从而保证所有子类都有相同的接口实现，这样，多态就能发挥出威力。

如果一个抽象类没有字段，所有方法全部都是抽象方法,就可以把该抽象类改写为接口：interface。

```java
abstract class Person {
    public abstract void run();
    public abstract String getName();
}

// 在Java中，使用interface可以声明一个接口
interface Person {
    void run();
    String getName();
}

//当一个具体的 class 去实现一个 interface 时，需要使用 implements 关键字。
class Student implements Person {
    private String name;

    public Student(String name) {
        this.name = name;
    }

    @Override
    public void run() {
        System.out.println(this.name + " run");
    }

    @Override
    public String getName() {
        return this.name;
    }
}
```

### 接口的定义

Java 的接口特指 interface 的定义，表示一个接口类型和一组方法签名，而编程接口泛指接口规范，如方法签名，数据格式，网络协议等。

所谓 interface，就是比抽象类还要抽象的纯抽象接口，因为它连字段都不能有。因为接口定义的所有方法默认都是 public abstract 的，所以这两个修饰符不需要写出来（写不写效果都一样）。

**注意：在 Java 中，一个类只能继承自另一个类，不能从多个类继承。但是，一个类可以实现多个 interface**

```java
class Student implements Person, Hello { // 实现了两个interface
    ...
}
```

### 接口继承

一个 interface 可以继承自另一个 interface。interface 继承自 interface 使用 extends，它相当于扩展了接口的方法。

```java
interface Hello {
    void hello();
}

interface Person extends Hello {
    void run();
    String getName();
}
```

合理设计 interface 和 abstract class 的继承关系，可以充分复用代码。一般来说，公共逻辑适合放在 abstract class 中，具体逻辑放到各个子类，而接口层次代表抽象程度。

接口也是数据类型，适用于向上转型和向下转型；

### 接口中的成员

#### 接口中的常量

因为 interface 是一个纯抽象类，所以它不能定义实例字段。但是，interface 是可以有静态字段的，并且静态字段必须为 final 类型。

```java
public interface Person {
    public static final int MALE = 1;
    public static final int FEMALE = 2;
}
```

实际上，因为 interface 的字段只能是 public static final 类型，所以我们可以把这些修饰符都去掉，上述代码可以简写为：

```java
public interface Person {
    // 编译器会自动加上public static final:
    int MALE = 1;
    int FEMALE = 2;
}
```

#### 接口中的抽象方法

#### 接口中的默认方法

default 方法（JDK>=1.8）

在接口中，可以定义 default 方法。实现类可以不必覆写 default 方法。

default 方法的目的是，当我们需要给接口新增一个方法时，必然会涉及到修改全部子类。但是，如果新增的是 default 方法，那么子类就不必全部修改，只需要在需要覆写的地方去覆写新增方法。

default 方法和抽象类的普通方法是有所不同的。因为 interface 没有字段，default 方法无法访问字段，而抽象类的普通方法可以访问实例字段。

例如，把 Person 接口的 run()方法改为 default 方法：

```java
// interface
public class Main {
    public static void main(String[] args) {
        Person p = new Student("Xiao Ming");
        p.run();
    }
}

interface Person {
    String getName();
    default void run() {
        System.out.println(getName() + " run");
    }
}

class Student implements Person {
    private String name;

    public Student(String name) {
        this.name = name;
    }

    public String getName() {
        return this.name;
    }
}
```

#### 接口中的静态方法

#### 接口中的私有方法

### 接口的实现

#### 实现接口的格式

## 包

如果写了一个 Arrays 类，恰好 JDK 也自带了一个 Arrays 类，如何解决类名冲突？

在 Java 中，我们使用 package 来解决名字冲突。

Java 定义了一种名字空间，称之为包：package。一个类总是属于某个包，类名（比如 Person）只是一个简写，真正的完整类名是包名.类名。

```
例如我写的的Arrays类存放在包my下面，因此，完整类名是my.Arrays；
JDK的Arrays类存放在包java.util下面，因此，完整类名是java.util.Arrays。
```

在定义 class 的时候，我们需要在第一行声明这个 class 属于哪个包。

```java
package my; // 申明包名my

public class Arrays {
}
```

在 Java 虚拟机执行的时候，JVM 只看完整类名，因此，只要包名不同，类就不同。

包可以是多层结构，用.隔开。例如：java.util。

### 包作用域

位于同一个包的类，可以访问包作用域的字段和方法。不用 public、protected、private 修饰的字段和方法就是包作用域。

把方法定义为 package 权限有助于测试，因为测试类和被测试类只要位于同一个 package，测试代码就可以访问被测试类的 package 权限方法。

### 包的导入

在一个 class 中，我们总会引用其他的 class。有三种方法：

#### 第一种，直接写出完整类名

```java
// Person.java
package ming;

public class Person {
    public void run() {
        // 写完整类名: mr.jun.Arrays，很显然，每次写完整类名比较痛苦。
        mr.jun.Arrays arrays = new mr.jun.Arrays();
    }
}
```

#### 第二种写法是用 import 语句，然后写简单类名

在写 import 的时候，可以使用 `*`，表示把这个包下面的所有 class 都导入进来（但不包括子包的 class），一般不推荐这种写法，因为在导入了多个包后，很难看出某个类属于哪个包。

```java
// Person.java
package ming;

// 导入完整类名:
import mr.jun.Arrays;

// 导入mr.jun包的所有class:
// import mr.jun.*;

public class Person {
    public void run() {
        // 写简单类名: Arrays
        Arrays arrays = new Arrays();
    }
}
```

#### 还有一种 import static 的语法，它可以导入一个类的静态字段和静态方法

import static 很少使用。

```java
package main;

// 导入System类的所有静态字段和静态方法:
import static java.lang.System.*;

public class Main {
    public static void main(String[] args) {
        // 相当于调用System.out.println(…)
        out.println("Hello, world!");
    }
}
```

### 包寻找的过程

Java 编译器最终编译出的.class 文件只使用完整类名，因此，在代码中，当编译器遇到一个 class 名称时：

- 如果是完整类名，就直接根据完整类名查找这个 class；
- 如果是简单类名，按下面的顺序依次查找：
  - 查找当前 package 是否存在这个 class；
  - 查找 import 的包是否包含这个 class；
  - 查找 java.lang 包是否包含这个 class。

如果按照上面的规则还无法确定类名，则编译报错。

例如：

```java
// Main.java
package test;

import java.text.Format;

public class Main {
    public static void main(String[] args) {
        java.util.List list; // ok，使用完整类名 -> java.util.List
        Format format = null; // ok，使用import的类 -> java.text.Format
        String s = "hi"; // ok，使用java.lang包的String -> java.lang.String
        System.out.println(s); // ok，使用java.lang包的System -> java.lang.System
        MessageFormat mf = null; // 编译错误：无法找到MessageFormat: MessageFormat cannot be resolved to a type
    }
}
```

因此，编译为 `.class` 的时候，编译器会自动帮我们做两个 import 动作：

- 默认自动 `import` 当前 `package` 的其他 `class`；
- 默认自动 `import java.lang.*`。

自动导入的是 `java.lang` 包，但类似 `java.lang.reflect` 这些包仍需要手动导入。

如果有两个 `class` 名称相同，例如，`mr.jun.Arrays` 和 `java.util.Arrays`，那么只能 import 其中一个，另一个必须写完整类名。

### 包命名最佳实践

#### 为了避免名字冲突，我们需要确定唯一的包名。推荐的做法是使用倒置的域名来确保唯一性。例如：

- org.apache
- org.apache.commons.log
- com.liaoxuefeng.sample

子包就可以根据功能自行命名。

#### 要注意不要和 java.lang 包的类重名，即自己的类不要使用这些名字：

- String
- System
- Runtime

...

#### 要注意也不要和 JDK 常用类重名

- java.util.List
- java.text.Format
- java.math.BigInteger

...

### 注意

- package 必须是文件的第一条有效语句（所以只有注释可以放在它前面）
- 包没有父子关系。java.util 和 java.util.zip 是不同的包，两者没有任何继承关系。
- 没有定义包名的 class，它使用的是默认包，非常容易引起名字冲突，因此，不推荐不写包名的做法。
- 需要按照包结构把 Java 文件组织起来，即所有 Java 文件对应的目录层次要和包的层次一致。

## 多态

多态是指，针对某个类型的方法调用，其真正执行的方法取决于运行时期实际类型的方法。

一个实例的实际类型为 `Student`，引用类型为 `Person` 的变量，调用其 `run()` 方法，调用的是 `Person` 还是 `Student` 的 `run()` 方法？

实际上调用的方法是 `Student` 的 `run()` 方法。因此可得出结论：

Java 的实例方法调用是基于运行时的实际类型的动态调用，而非变量的声明类型。

这个非常重要的特性在面向对象编程中称之为多态。它的英文拼写非常复杂：Polymorphic。

多态的特性就是，运行期才能动态决定调用的子类方法。对某个类型调用某个方法，执行的实际方法可能是某个子类的覆写方法。这种不确定性的方法调用，允许添加更多类型的子类实现功能扩展，却不需要修改基于父类的代码。

### 覆写（Override）

在继承关系中，子类如果定义了一个与父类方法参数和返回值完全相同的方法，被称为覆写（Override）。

方法重载（Overload）是同名不同参，返回值类型通常都是相同的，Overload 方法是一个新方法，方法重写（Override）是同名同参，返回值类型也相同，Override 方法是一个覆盖方法。

**注意：方法名相同，方法参数相同，但方法返回值不同，也是不同的方法。在 Java 程序中，出现这种情况，编译器会报错。**

加上 `@Override` 可以让编译器帮助检查是否进行了正确的覆写。希望进行覆写，但是不小心写错了方法签名，编译器会报错。但是 `@Override` 不是必需的。

### 格式

#### 调用 super

在子类的覆写方法中，如果要调用父类的被覆写的方法，可以通过 super 来调用。

```java
class Person {
    protected String name;
    public String hello() {
        return "Hello, " + name;
    }
}

class Student extends Person {
    @Override
    public String hello() {
        // 调用父类的hello()方法:
        return super.hello() + "!";
    }
}
```

#### final 修饰的方法不能被 Override

继承可以允许子类覆写父类的方法。如果一个父类不允许子类对它的某个方法进行覆写，可以把该方法标记为 final。用 final 修饰的方法不能被 Override：

```java
class Person {
    protected String name;
    public final String hello() {
        return "Hello, " + name;
    }
}

class Student extends Person {
    // compile error: 不允许覆写
    @Override
    public String hello() {
    }
}
```

### 多态调用成员方法

### 多态调用成员属性

### 对象的上下转型

## 内部类

Java 中的内部类是一种特殊的类，它定义在另一个类的内部，即在一个类中定义另一个类，这个在类中定义的类就叫做内部类（Nested Class）

内部类可以访问外部类的所有成员变量和方法，即使它们是私有的（private）、静态的（static）。

外部类是指定义在另一个类外部的类。一个外部类可以有多个内部类，而一个内部类也可以嵌套其他内部类

### 格式

#### 命名内部类 Inner Class

```java
// inner class
public class Main {
    public static void main(String[] args) {
        Outer outer = new Outer("Nested"); // 实例化一个Outer
        Outer.Inner inner = outer.new Inner(); // 实例化一个Inner
        inner.hello();
    }
}

class Outer {
    private String name;

    Outer(String name) {
        this.name = name;
    }

    class Inner {
        void hello() {
            System.out.println("Hello, " + Outer.this.name);
        }
    }
}
```

要实例化一个 Inner，我们必须首先创建一个 Outer 的实例，然后，调用 Outer 实例的 new 来创建 Inner 实例：`Outer.Inner inner = outer.new Inner();`

这是因为 Inner Class 除了有一个 this 指向它自己，还隐含地持有一个 Outer Class 实例，可以用 Outer.this 访问这个实例。所以，实例化一个 Inner Class 不能脱离 Outer 实例。

观察 Java 编译器编译后的.class 文件可以发现，Outer 类被编译为 Outer.class，而 Inner 类被编译为 Outer\$Inner.class。

#### 匿名内部类 Anonymous Class

还有一种定义 Inner Class 的方法，它不需要在 Outer Class 中明确地定义这个 Class，而是在方法内部，通过匿名类（Anonymous Class）来定义。示例代码如下：

```java
// Anonymous Class
public class Main {
    public static void main(String[] args) {
        Outer outer = new Outer("Nested");
        outer.asyncHello();
    }
}

class Outer {
    private String name;

    Outer(String name) {
        this.name = name;
    }

    void asyncHello() {
        Runnable r = new Runnable() {
            @Override
            public void run() {
                System.out.println("Hello, " + Outer.this.name);
            }
        };
        new Thread(r).start();
    }
}
```

观察 asyncHello()方法，我们在方法内部实例化了一个 Runnable。Runnable 本身是接口，接口是不能实例化的，所以这里实际上是定义了一个实现了 Runnable 接口的匿名类，并且通过 new 实例化该匿名类，然后转型为 Runnable。在定义匿名类的时候就必须实例化它，定义匿名类的写法如下：

```java
Runnable r = new Runnable() {
    // 实现必要的抽象方法...
};
```

匿名类和 Inner Class 一样，可以访问 Outer Class 的 private 字段和方法。之所以我们要定义匿名类，是因为在这里我们通常不关心类名，比直接定义 Inner Class 可以少写很多代码。

观察 Java 编译器编译后的.class 文件可以发现，Outer 类被编译为 Outer.class，而匿名类被编译为 Outer$1.class。如果有多个匿名类，Java 编译器会将每个匿名类依次命名为 Outer$1、Outer$2、Outer$3……

#### 静态内部类 Static Nested Class

最后一种内部类和 Inner Class 类似，但是使用 static 修饰，称为静态内部类（Static Nested Class）

```java
// Static Nested Class
public class Main {
    public static void main(String[] args) {
        Outer.StaticNested sn = new Outer.StaticNested();
        sn.hello();
    }
}

class Outer {
    private static String NAME = "OUTER";

    private String name;

    Outer(String name) {
        this.name = name;
    }

    static class StaticNested {
        void hello() {
            System.out.println("Hello, " + Outer.NAME);
        }
    }
}
```

用 static 修饰的内部类和 Inner Class 有很大的不同，它不再依附于 Outer 的实例，而是一个完全独立的类，因此无法引用 Outer.this，但它可以访问 Outer 的 private 静态字段和静态方法。如果把 StaticNested 移到 Outer 之外，就失去了访问 private 的权限。

### 内部类的访问特点

Inner Class 和普通 Class 相比，除了能引用 Outer 实例外，还有一个额外的“特权”，就是可以修改 Outer Class 的 private 字段，因为 Inner Class 的作用域在 Outer Class 内部，所以能访问 Outer Class 的 private 字段和方法。

### 内部类的分类

根据内部类在类中定义的位置不同

- 成员内部类 ： 在类的成员位置
  - 静态成员内部类 ： 使用 static 修饰符
  - 非静态成员内部类 ： 没有使用 static 修饰符
- 局部内部类 ： 在类的局部位置（在成员方法中）
- 匿名内部类

#### 静态成员内部类和非静态成员内部类的区别

还有其他的 https://blog.csdn.net/liuxiao723846/article/details/108006609

非静态内部类在编译完成之后会隐含地保存着一个引用，该引用是指向创建它的外部类的对象，但是静态内部类却没有。

静态内部类没有这个引用就意味着：

- 它的创建是不需要依赖于外部类的对象
- 它不能使用任何外部类的非 static 成员变量和方法（因为在没有外部类的对象的情况下，可以创建静态内部类的对象，如果允许访问外部类的非 static 成员就会产生矛盾，因为外部类的非 static 成员必须依附于具体的对象）
- 静态内部类内允许有 static 属性、方法；

#### 局部内部类

局部内部类就像是方法里面的一个局部变量一样，是不能有 public、protected、private 以及 static 修饰符的。

## classpath

到底什么是 classpath？

classpath 是 JVM 用到的一个环境变量，它用来指示 JVM 如何搜索 class。

因为 Java 是编译型语言，源码文件是 `.java`，而编译后的 `.class` 文件才是真正可以被 JVM 执行的字节码。因此，JVM 需要知道，如果要加载一个 abc.xyz.Hello 的类，应该去哪搜索对应的 Hello.class 文件。

classpath 就是一组目录的集合，它设置的搜索路径与操作系统相关。例如，

- 在 Windows 系统上，用;分隔，带空格的目录用""括起来，可能长这样：`C:\work\project1\bin;C:\shared;"D:\My Documents\project1\bin"`
- 在 Linux 系统上，用:分隔，可能长这样：`/usr/shared:/usr/local/bin:/home/fangxu/bin`

现在我们假设 classpath 是`.;C:\work\project1\bin;C:\shared`，当 JVM 在加载`abc.xyz.Hello`这个类时，会依次查找：

- `<当前目录>\abc\xyz\Hello.class`
- `C:\work\project1\bin\abc\xyz\Hello.class`
- `C:\shared\abc\xyz\Hello.class`

注意到 `.` 代表当前目录。如果 JVM 在某个路径下找到了对应的 class 文件，就不再往后继续搜索。如果所有路径下都没有找到，就报错。

### classpath 的设定方法有两种：

- 在系统环境变量中设置 classpath 环境变量，不推荐；
- 在启动 JVM 时设置 classpath 变量，推荐。

强烈不推荐在系统环境变量中设置 classpath，那样会污染整个系统环境。在启动 JVM 时设置 classpath 才是推荐的做法。实际上就是给 java 命令传入 `-classpath` 参数：

- `java -classpath .;C:\work\project1\bin;C:\shared abc.xyz.Hello`,
- 使用-cp 的简写 `java -cp .;C:\work\project1\bin;C:\shared abc.xyz.Hello`

没有设置系统环境变量，也没有传入-cp 参数，那么 JVM 默认的 classpath 为.，即当前目录

在 IDE 中运行 Java 程序，IDE 自动传入的 `-cp` 参数是当前工程的 `bin` 目录和引入的 `jar` 包。

通常，我们在自己编写的 class 中，会引用 Java 核心库的 class，例如，String、ArrayList 等。这些 class 应该上哪去找？

有很多“如何设置 classpath”的文章会告诉你把 JVM 自带的 rt.jar 放入 classpath，但事实上，根本不需要告诉 JVM 如何去 Java 核心库查找 class，JVM 怎么可能笨到连自己的核心库在哪都不知道！

更好的做法是，不要设置 classpath！默认的当前目录.对于绝大多数情况都够用了。

**注意：不要把任何 Java 核心库添加到 classpath 中！JVM 根本不依赖 classpath 加载核心库！**

## jar 包

如果有很多.class 文件，散落在各层目录中，肯定不便于管理。如果能把目录打一个包，变成一个文件，就方便多了。

jar 包就是用来干这个事的，它可以把 package 组织的目录层级，以及各个目录下的所有文件（包括.class 文件和其他文件）都打成一个 jar 文件，这样一来，无论是备份，还是发给客户，就简单多了。

jar 包实际上就是一个 zip 格式的压缩文件，而 jar 包相当于目录。如果我们要执行一个 jar 包的 class，就可以把 jar 包放到 classpath 中：`java -cp ./hello.jar abc.xyz.Hello`，这样 JVM 会自动在 hello.jar 文件里去搜索某个类。

### 如何创建 jar 包？

因为 jar 包就是 zip 包，所以，直接在资源管理器中，找到正确的目录，点击右键，在弹出的快捷菜单中选择“发送到”，“压缩(zipped)文件夹”，就制作了一个 zip 文件。然后，把后缀从.zip 改为.jar，一个 jar 包就创建成功。

这里需要特别注意的是，jar 包里的第一层目录，不能是 bin，而应该是 hong、ming、mr。

上面的 hello.zip 包含有 bin 目录，说明打包打得有问题，JVM 仍然无法从 jar 包中查找正确的 class，原因是 hong.Person 必须按 `hong/Person.class` 存放，而不是 `bin/hong/Person.class`。

jar 包还可以包含一个特殊的 `/META-INF/MANIFEST.MF` 文件，`MANIFEST.MF` 是纯文本，可以指定 Main-Class 和其它信息。JVM 会自动读取这个 MANIFEST.MF 文件，如果存在 Main-Class，我们就不必在命令行指定启动的类名，而是用更方便的命令：`java -jar hello.jar`

在大型项目中，不可能手动编写 MANIFEST.MF 文件，再手动创建 jar 包。Java 社区提供了大量的开源构建工具，例如 Maven，可以非常方便地创建 jar 包。

## 模块

jar 只是用于存放 class 的容器，它并不关心 class 之间的依赖。

从 Java 9 开始引入的模块，主要是为了解决“依赖”这个问题。如果 a.jar 必须依赖另一个 b.jar 才能运行，那我们应该给 a.jar 加点说明啥的，让程序在编译和运行的时候能自动定位到 b.jar，这种自带“依赖关系”的 class 容器就是模块。

为了表明 Java 模块化的决心，从 Java 9 开始，原有的 Java 标准库已经由一个单一巨大的 rt.jar 分拆成了几十个模块，这些模块以.jmod 扩展名标识，可以在\$JAVA_HOME/jmods 目录下找到它们：

```
java.base.jmod
java.compiler.jmod
java.datatransfer.jmod
java.desktop.jmod
...
```

这些.jmod 文件每一个都是一个模块，模块名就是文件名。例如：模块 java.base 对应的文件就是 java.base.jmod。模块之间的依赖关系已经被写入到模块内的 module-info.class 文件了。所有的模块都直接或间接地依赖 java.base 模块，只有 java.base 模块不依赖任何模块，它可以被看作是“根模块”，好比所有的类都是从 Object 直接或间接继承而来。

把一堆 class 封装为 jar 仅仅是一个打包的过程，而把一堆 class 封装为模块则不但需要打包，还需要写入依赖关系，并且还可以包含二进制代码（通常是 JNI 扩展）。此外，模块支持多版本，即在同一个模块中可以为不同的 JVM 提供不同的版本。

## 常用类

### 包装类

#### 包装类对应表

Byte、Short、Integer、Long、Float、Double、Boolean、Character

它们的具体含义如下所示：

- Byte：表示一个字节，取值范围为-128~127。
- Short：表示一个短整型，取值范围为-32768~32767。
- Integer：表示一个整型，取值范围为-2147483648~2147483647。
- Long：表示一个长整型，取值范围为-9223372036854775808~9223372036854775807。
- Float：表示单精度浮点数，取值范围为 1.4e-45~3.4028235e38。
- Double：表示双精度浮点数，取值范围为 4.9e-324~1.7976931348623157e308。
- Boolean：表示布尔值，取值范围为 true 和 false。
- Character：表示字符，取值范围为 0~65535。

#### 拆箱

拆箱是指将包装类对象转换为基本类型数据的操作。此操作可以通过调用基本类型的值来实现，如 intValue(),doubleValue() 等。

#### 装箱

装箱是指将基本类型数据转换为包装类对象的操作，它可以通过调用包装类的静态方法 valueOf()来实现。

### String 类

无论是常量还是变量，只要是字符串，在 Java 中就都是字符串对象。

#### 字符串类的特点

#### String 对象的特点

#### StringBuilder

##### String 和 StringBuilder 的相互转换

### Object 类

Object 类是一个特殊的类，

### 时间类型

Java 中的日期类型可以分为两类：旧的日期类型和新的日期类型。

- 旧的日期类型

旧的日期类型包括 Date 和 Calendar，它们可以用于表示日期和时间。

- 新的日期类型

另一类新的日期类型是 Java 8 推出的新特性，称为新的日期和时间 API。它提供了一种更为简单的方式来处理日期和时间，允许开发人员更轻松地实现日期和时间的计算。新的日期和时间 API 包括 LocalDate、LocalTime 和 LocalDateTime 等类。

Java 中的日期类主要有以下几个：

- Date 类：转化后精度损失较多，不推荐使用。
- Calendar 类：比较繁琐，但提供了丰富的日期操作方法。
- SimpleDateFormat 类：可以将日期与字符串互相转化，常用于日期的格式化操作。
- LocalDate、LocalTime、LocalDateTime、ZonedDateTime 类：Java 8 新增，使用简单，提供了丰富的日期操作方法，并且支持时区。

其中，LocalDate 表示日期，LocalTime 表示时间，LocalDateTime 表示日期和时间，ZonedDateTime 则表示带时区的日期和时间。这些类都封装了日期和时间的操作方法，并且支持创建、比较、格式化、解析等各种操作。同时，它们也遵循了不可变性的原则，保证了操作安全和线程安全。

#### Date

Java 中的 Date 类是用于表示日期和时间的类。 Date 类封装了当前时间，以及毫秒数，以便能够进行计算和转换，主要包含以下几个方法：

- long getTime()：返回自 1970 年 1 月 1 日 00:00:00 GMT 以来此 Date 对象表示的毫秒数。
- void setTime(long time)：设置此 Date 对象表示时间点，以表示自 1970 年 1 月 1 日 00:00:00 GMT 以来的毫秒数。
- boolean before(Date when)：当此 Date 对象表示的时间在 when 之前时，返回 true，否则返回 false。
- boolean after(Date when)：当此 Date 对象表示的时间在 when 之后时，返回 true，否则返回 false。
- boolean equals(Object obj)：当此 Date 对象表示的时间和 obj 表示的时间相同时，返回 true，否则返回 false。

#### Calendar

- Calendar getInstance()：静态方法，用于获取由当前日期和时间初始化的 Calendar 对象。
- void set(int field, int value)：将给定的时间字段（如年、月、日等）设置为给定值。
- void add(int field, int amount)：将给定的时间字段（如年、月、日等）的值按照给定的量进行加减运算。
- int get(int field)：获取指定时间字段的值。
- Date getTime()：返回以 Date 类型表示的 Calendar 对象当前表示的日期和时间
- before(Object when)和 after(Object when)：用于比较所代表的日期是否在指定日期之前或之后。参数为 Object 类型，实际上通常传入的是 Date 类型对象。

#### SimpleDateFormat

- SimpleDateFormat(String pattern)：构造一个新的 SimpleDateFormat 对象并使用指定的日期格式模式。
- String format(Date date)：将给定的日期对象格式化为字符串。
- Date parse(String source)：将给定的字符串解析为日期对象。
- void setLenient(boolean lenient)：指定解析日期时是否允许使用宽松的解析规则，默认为 true，即启用宽松的解析规则。

#### LocalDate

Java 8 中引入了 LocalDate 类，它是一个表示日期（年、月、日）的不可变类。

- now()：静态方法，用于获取当前系统日期。
- of(int year, int month, int dayOfMonth)：静态方法，用于创建指定日期的 LocalDate 对象。
- getYear()、getMonthValue()和 getDayOfMonth()：获取日期的年、月、日。
- plusDays()、plusMonths()和 plusYears()：将日期加上指定的天数、月数、年数。
- minusDays()、minusMonths()和 minusYears()：将日期减去指定的天数、月数、年数。
- isBefore()和 isAfter()：用于比较当前日期是否在指定日期之前或之后。
- format()：将日期格式化为指定格式的字符串。

#### 关于 Java 中的日期类使用，总结了一些经验：

优先使用 Java 8 的新日期/时间 API：java.time 包，它是早期的 java.util 包的替代品，更简单易用。

尽量避免使用过时的 java.util.Date 和 SimpleDateFormat 类，因为它们可能会导致严重的 bug，并且不支持时区。

使用 ISO 8601 格式（yyyy-MM-dd）来表示日期，以确保正确性。

尽可能地尝试使用线程安全的类，例如 java.time.LocalDateTime 和 java.time.LocalDate。

如果需要，可以使用 java.util.Calendar 类来表示日期，但需要谨慎处理，因为它不是线程安全的。

使用预定义格式解析和格式化日期字符串：在使用 SimpleDateFormat 进行格式化和解析日期时，通常需要自己定义日期格式。这种方式容易出错且容易导致代码的可读性下降。Java 8 中新增了 DateTimeFormatter 类，该类提供了预定义的日期格式以及自定义的格式化和解析。使用 DateTimeFormatter 类进行日期格式化和解析可以减少犯错的机会。

使用 Calendar 时要注意月份的索引从 0 开始：在使用 Calendar 类获取月份时，月份的索引从 0 开始，即 0 表示 1 月，1 表示 2 月，以此类推。这可能会导致混淆和错误，因此建议使用 LocalDate 代替。

使用 Period 和 Duration 进行日期和时间的计算：Period 和 Duration 类分别用于计算日期和时间之间的差异。这些类提供了易于使用且灵活的 API，可用于计算日期之间的差异（例如年、月和天）以及时间之间的差异（例如小时，分钟和秒）。

#### 为什么 Java 8 的新日期/时间 API 比早期的 java.util 包更好？

Java 8 的新日期/时间 API 比早期的 java.util 包更好，因为它提供了更加简便、可读性更好的 API，并且支持时区，更加安全可靠。此外，它提供了用于计算、比较、格式化日期/时间的许多方法，以及用于将日期/时间转换为字符串的格式化方法，使得操作日期/时间变得更加容易。

## 异常

Java 内置了一套异常处理机制，总是使用异常来表示错误，通过 `try ... catch` 捕获异常。

异常是一种 class，因此它本身带有类型信息。异常可以在任何地方抛出，但只需要在上层捕获。

### 异常 class 的继承关系

- Object
  - Throwable
    - Error 严重的错误
      - OutOfMemoryError 内存耗尽
      - NoClassDefFoundError 无法加载某个 Class
      - StackOverflowError 栈溢出
    - Exception 程序运行时的错误
      - RuntimeException
        - NullPointerException
        - IndexOutOfBoundsException
        - SecurityException
        - IllegalArgumentException
          - NumberFormatException
      - IOException
        - UnsupportedCharsetException
        - FileNotFoundException
        - SocketException
      - ParseException
      - GeneralSecurityException
      - SQLException
      - TimeoutException

从继承关系可知：Throwable 是异常体系的根，它继承自 Object。Throwable 有两个体系：Error 和 Exception，Error 表示严重的错误，程序对此一般无能为力。而 Exception 则是程序运行时的错误，它可以被捕获并处理。

Exception 又分为两大类：

1. RuntimeException 以及它的子类（包括 NullPointerException、IllegalArgumentException）；
2. 非 RuntimeException（包括 IOException、ReflectiveOperationException 等等）

某些异常是应用程序逻辑处理的一部分，应该捕获并处理。例如：

- NumberFormatException：数值类型的格式错误
- FileNotFoundException：未找到文件
- SocketException：读取网络失败

还有一些异常是程序逻辑编写不对造成的，应该修复程序本身。例如：

- NullPointerException：空指针异常，俗称 NPE，对某个 null 的对象调用方法或字段就会产生 NullPointerException，这个异常通常是由 JVM 抛出的
- IndexOutOfBoundsException：数组索引越界

#### Java 规定异常处理的方式

- 必须捕获的异常，包括 Exception 及其子类，但不包括 RuntimeException 及其子类，这种类型的异常称为 Checked Exception。
  - 只要是方法声明的 Checked Exception，不在调用层捕获，也必须在更高的调用层捕获。所有未捕获的异常，最终也必须在 main()方法中捕获，不会出现漏写 try 的情况。这是由编译器保证的。main()方法也是最后捕获 Exception 的机会。
- 不需要捕获的异常，或者说无需强制捕获，包括 Error 及其子类，RuntimeException 及其子类。

### 常见的异常种类

- 空指针异常（NullPointerException）: 当程序试图在没有引用的对象上调用方法，或者试图访问或修改一个不存在的对象时，抛出此异常。

- 类型转换异常（ClassCastException）: 当一个类型的对象转换成不兼容的类型时，抛出此异常。

- 数组负下标异常（ArrayIndexOutOfBoundsException）: 当程序试图访问一个数组中不存在的索引时，抛出该异常。

- 数学异常（ArithmeticException）: 数学运算异常时抛出此异常。

- 参数异常（IllegalArgumentException）: 当传递给方法的参数不合法时，抛出此异常。

- 违反安全原则异常（SecurityException）: 当一个程序违反安全原则时，抛出此异常。

- 文件未找到异常（FileNotFoundException）: 当程序尝试访问不存在的文件时，抛出此异常。

- 栈溢出异常（StackOverflowError）: 当程序堆栈溢出时，抛出此异常。

- 字符串解析异常（NumberFormatException）: 当程序试图将字符串转换成不支持的数字格式时，抛出此异常。

- 运行时异常（RuntimeException）: 所有可能在 Java 程序运行时发生的异常的基类.

### 抛出异常

先看个示例，查看 Integer.java 源码可知，抛出异常的方法代码如下：

```java
public static int parseInt(String s, int radix) throws NumberFormatException {
    if (s == null) {
        throw new NumberFormatException("null");
    }
    ...
}
```

如何抛出异常？参考 Integer.parseInt()方法，抛出异常分两步：

- 创建某个 Exception 的实例；
- 用 throw 语句抛出。

```java
void process2(String s) {
    if (s==null) {
        NullPointerException e = new NullPointerException();
        throw e;
        // 实际上，绝大部分抛出异常的代码都会合并写成一行：
        // throw new NullPointerException();
    }
}
```

如果一个方法捕获了某个异常后，又在 catch 子句中抛出新的异常，就相当于把抛出的异常类型“转换”了，并且新的异常丢失了原始异常信息

为了能追踪到完整的异常栈，在构造异常的时候，把原始的 Exception 实例传进去，新的 Exception 就可以持有原始 Exception 信息。

```
try {
    ...
} catch (NullPointerException e) {
    throw new IllegalArgumentException(e);
}
```

**在代码中获取原始异常可以使用 Throwable.getCause()方法。如果返回 null，说明已经是“根异常”了。**

### 捕获之后的一些操作

#### 多 catch 语句

可以使用多个 catch 语句，每个 catch 分别捕获对应的 Exception 及其子类。JVM 在捕获到异常后，会从上到下匹配 catch 语句，匹配到某个 catch 后，执行 catch 代码块，然后不再继续匹配。

**简单地说就是：多个 catch 语句只有一个能被执行。**

**存在多个 catch 的时候，catch 的顺序非常重要：子类必须写在前面。**

#### finally 语句

finally 语句块保证有无错误都会执行。

注意 finally 有几个特点：

- finally 语句不是必须的，可写可不写；
- finally 总是最后执行。

如果没有发生异常，就正常执行 `try { ... }`语句块，然后执行 `finally`。如果发生了异常，就中断执行 `try { ... }`语句块，然后跳转执行匹配的 `catch` 语句块，最后执行 `finally`。

可见，finally 是用来保证一些代码必须执行的。

**注意：在 catch 中抛出异常，不会影响 finally 的执行。JVM 会先执行 finally，然后抛出异常。**

某些情况下，可以没有 catch，只使用 try ... finally 结构。因为方法声明了可能抛出的异常，所以可以不写 catch。

```java
void process(String file) throws IOException {
    try {
        ...
    } finally {
        System.out.println("END");
    }
}
```

##### finally 的异常屏蔽

如果在执行 finally 语句时抛出异常，那么，catch 语句的异常还能否继续抛出？答案是不能继续抛出。

finally 抛出异常后，原来在 catch 中准备抛出的异常就“消失”了，因为只能抛出一个异常。没有被抛出的异常称为“被屏蔽”的异常（Suppressed Exception）。

在极少数的情况下，我们需要获知所有的异常。如何保存所有的异常信息？方法是先用 origin 变量保存原始异常，然后调用 `Throwable.addSuppressed()`，把原始异常添加进来，最后在 finally 抛出。

通过 `Throwable.getSuppressed()` 可以获取所有的 Suppressed Exception。

绝大多数情况下，在 finally 中不要抛出异常。因此，我们通常不需要关心 Suppressed Exception。如果在 finally 中抛出异常，应该原始异常加入到原有异常中。调用方可通过 Throwable.getSuppressed()获取所有添加的 Suppressed Exception。

#### 捕获多种异常

如果某些异常的处理逻辑相同，但是异常本身不存在继承关系，为了避免编写多条 catch 子句，可以用`|`合并到一起

```java
public static void main(String[] args) {
    try {
        process1();
        process2();
        process3();
    } catch (IOException | NumberFormatException e) {
        // IOException或NumberFormatException
        System.out.println("Bad input");
    } catch (Exception e) {
        System.out.println("Unknown error");
    }
}
```

#### e.printStackTrace()

所有异常都可以调用 printStackTrace()方法打印异常栈，这是一个简单有用的快速打印异常的方法。

#### 处理 NullPointerException

如果遇到 NullPointerException，我们应该如何处理？首先，必须明确，NullPointerException 是一种代码逻辑错误，遇到 NullPointerException，遵循原则是早暴露，早修复，严禁使用 catch 来隐藏这种编码错误。

可以启用 Java 14 的增强异常信息来查看 NullPointerException 的详细错误信息。这种增强的 NullPointerException 详细信息是 Java 14 新增的功能，但默认是关闭的，我们可以给 JVM 添加一个-XX:+ShowCodeDetailsInExceptionMessages 参数启用它：`java -XX:+ShowCodeDetailsInExceptionMessages Main.java`

### 自定义异常

在一个大型项目中，可以自定义新的异常类型，但是，保持一个合理的异常继承体系是非常重要的。

一个常见的做法是自定义一个 BaseException 作为“根异常”，然后，派生出各种业务类型的异常。

BaseException 需要从一个适合的 Exception 派生，通常建议从 RuntimeException 派生：

```java
public class BaseException extends RuntimeException {
}
```

其他业务类型的异常就可以从 BaseException 派生：

```java
public class UserNotFoundException extends BaseException {
}

public class LoginFailedException extends BaseException {
}
```

自定义的 BaseException 应该提供多个构造方法

```java
public class BaseException extends RuntimeException {
    public BaseException() {
        super();
    }

    public BaseException(String message, Throwable cause) {
        super(message, cause);
    }

    public BaseException(String message) {
        super(message);
    }

    public BaseException(Throwable cause) {
        super(cause);
    }
}
```

上述构造方法实际上都是原样照抄 RuntimeException。这样，抛出异常的时候，就可以选择合适的构造方法。通过 IDE 可以根据父类快速生成子类的构造方法。

### 使用断言

断言（Assertion）是一种调试程序的方式。在 Java 中，使用 assert 关键字来实现断言。

例如：语句`assert x >= 0;`即为断言，断言条件 x >= 0 预期为 true。如果计算结果为 false，则断言失败，抛出 AssertionError。

使用 assert 语句时，还可以添加一个可选的断言消息：`assert x >= 0 : "x must >= 0";`，这样，断言失败的时候，AssertionError 会带上消息 x must >= 0，更加便于调试。

**Java 断言的特点是：断言失败时会抛出 AssertionError，导致程序结束退出。因此，断言不能用于可恢复的程序错误，只应该用于开发和测试阶段。**

JVM 默认关闭断言指令，即遇到 assert 语句就自动忽略了，不执行。

要执行 assert 语句，必须给 Java 虚拟机传递-enableassertions（可简写为-ea）参数启用断言。所以，上述程序必须在命令行下运行才有效果：`java -ea Main.java`

## 集合

Java 标准库自带的 `java.util` 包提供了集合类：`Collection`，它是除 Map 外所有其他集合类的根接口。Java 的 java.util 包主要提供了以下三种类型的集合：

- List：一种有序列表的集合，例如，按索引排列的 Student 的 List；
- Set：一种保证没有重复元素的集合，例如，所有无重复名称的 Student 的 Set；
- Map：一种通过键值（key-value）查找的映射表集合，例如，根据 Student 的 name 查找对应 Student 的 Map。

Java 集合的设计有几个特点：

- 一是实现了接口和实现类相分离，例如，有序表的接口是 List，具体的实现类有 ArrayList，LinkedList 等
- 二是支持泛型，我们可以限制在一个集合中只能放入同一种数据类型的元素，例如：`List<String> list = new ArrayList<>(); // 只能放入String类型`
- 最后，Java 访问集合总是通过统一的方式——迭代器（Iterator）来实现，它最明显的好处在于无需知道集合内部元素是按什么方式存储的。

### 单列集合 Collection

#### List

Java 的 List 类型集合是指位于 java.util 包下的 List 接口，主要分类有两种，分别是 ArrayList 和 LinkedList 两个类

值可以重复

- ArrayList
- LinkedList

##### ArrayList

ArrayList 是基于数组实现的 List 集合，底层其实就是使用了一个数组进行的元素存储。

当我们不断往 ArrayList 里面添加元素的时候，内部会有一个判断机制，判断数组的容量是否达到了一定阈值，如果达到了就会发生一个数组拷贝操作，将旧的数组的内容拷贝到新的数组里面去，这部分的操作会比较消耗性能，所以说它的插入和删除操作效率比较低。但是采用数组进行存储，底层会有数组的索引下标存在，因此当我们需要根据索引下标去检索数据的时候，其效率会非常高。

##### LinkedList

LinkedList 是基于双向链表实现的，当我们插入对象的时候，内部会创建一个新的节点对象，然后放入到一条链表的尾部，由于没有牵扯到类似于 ArrayList 那样的数组拷贝操作，所以它的插入和删除操作效率比较高。但是由于没有类似于数组的索引下标的存在，所以在进行数据检索的时候，效率会稍微弱一些。

##### List 是否真的可以无限量添加元素？

不行，List 实际上有一个容量限制，即 List 的容量是受内存限制的，当内存的容量不够时，List 就不能无限量添加元素了。

#### Set

值不可重复

Set 集合是 Java 中的一种特殊的集合，它不允许集合中出现重复元素。Set 集合中的元素是无序的，不可重复的，没有索引。

Set 集合本身的定义是一个接口类型，但是其下可以使用 HashSet、TreeSet 等实现，其中 HashSet 提供了最快的查找和插入速度，而 TreeSet 则提供了有序的元素组织。

- HashSet
- LinkedHashSet
- TreeSet

#### HashSet

HashSet 是 Java 中的一种 Set 接口实现，它不允许集合中有重复的元素。它使用哈希表实现，允许插入和检索操作的时间复杂度为 O(1)。

它的实现是基于哈希函数的，因此元素的存储次序与插入次序无关，而且比较两个元素时，不需要使用 equals()方法，只需要调用 hashCode()方法就可以判断两个元素是否相等。

它的一个优势是，它可以检测集合中的重复元素，因此不会出现重复的元素。另外，它也可以快速检索元素，因为它使用哈希函数来存储元素，因此可以快速检索元素。

#### TreeSet

TreeSet 是 java.util 包中的一个集合类，它继承自 AbstractSet，是基于 TreeMap 实现的，TreeSet 中的元素是按照元素的自然顺序排序的，或者根据构造函数传入的 Comparator 进行排序的。

TreeSet 不允许集合中存在重复元素，它提供了多种操作集合元素的方法，如添加、删除、查找等，还提供了多种不同的迭代器，可以用 Iterator 或 ListIterator 迭代 TreeSet 中的元素。

### 双列集合 Map

双列集合，就是常说的键值对集合，在存储的时候都是一个键对应一个值，键是不可以重复的，值是可以重复的。所以在 Map 集合中，键是具备唯一性的。

哈希表是一种以键值对方式进行存储的数据结构，在 Java 体系中，所有的哈希表都会基于统一的 Map 接口去实现。

Java 中的 Map 接口位于 java.util 包路径下。

- HashMap
- HashTable
- LinkedHashMap
- TreeMap

#### HashMap

HashMap 是一种常用的哈希表实现，它使用哈希算法存储键值对，允许使用 null 值和 null 键，提供快速的查找和插入操作。HashMap 是非线程安全的，不支持顺序遍历。

#### HashTable

HashTable 是一种古老的哈希表实现，它使用哈希算法存储键值对，不允许使用 null 值和 null 键，提供快速的查找和插入操作。HashTable 是线程安全的，不支持顺序遍历。

#### LinkedHashMap

LinkedHashMap 是一种哈希表实现，它使用哈希算法存储键值对，允许使用 null 值和 null 键，提供快速的查找和插入操作。LinkedHashMap 支持顺序遍历，但不是线程安全的。

#### TreeMap

TreeMap 是一种基于红黑树实现的有序哈希表，它使用键的自然顺序或者比较器来排序键值对，提供快速的查找和插入操作。TreeMap 是非线程安全的，支持顺序遍历。

根据实际情况，可以根据以下几点来选择不同的哈希表实现：

- 是否需要线程安全性：如果需要，则可以选择 HashTable；如果不需要，则可以选择 HashMap 或者 LinkedHashMap 等。

- 是否需要排序：如果需要，则可以选择 TreeMap 或者 LinkedHashMap；如果不需要，则可以选择 HashMap 或者 HashTable。

- 是否允许 null 值和 null 键：如果允许，则可以选择 HashMap 或者 LinkedHashMap；如果不允许，则可以选择 HashTable 或者 TreeMap。

### 有了数组，为什么还要有集合的出现？

- 数组只能存储单一类型的数据，而集合可以存储多种类型的数据；

- 数组的长度是固定的，而集合的长度是可变的；

- 数组的存储操作比较复杂，而集合的存储操作比较简单；

- 数组不支持一些高级的操作，比如排序、查找等，而集合支持；

## IO

io 可以理解为是 input 和 output 的两个缩写，分别代表了数据的 ”输入“和”输出“ 。io 流则是描述了将数据从内存和数据源之间拷贝的一个过程。

输入：数据从数据源加载到内存。

输出：数据从内存写回到数据源。

### 字节流

字节流（Byte Stream）是 Java 中的一种流，它是处理二进制数据的最基本的流，可以处理任何类型的数据，例如字符串、图像等。 字节流的特点是把数据看成一个个字节，它们是无类型的，可以处理任何类型的数据。

#### 常见的字节流

- InputStream：字节输入流，这个是字节流的抽象类，提供了某些字节流操作的基本实现，比如读取、关闭流等。

- OutputStream：字节输出流，同样也是字节流抽象类，提供字节流操作的基本实现，比如写入、关闭流等。

FileInputStream：允许应用程序以字节的方式从文件中读取数据。

FileOutputStream：允许应用程序以字节的方式向文件写入数据。

ByteArrayInputStream：允许应用程序从一个字节数组中读取数据。

ByteArrayOutputStream：允许应用程序以字节的方式向字节数组中写入数据。

DataInputStream：允许应用程序从输入流中读取基本的 Java 数据类型。

DataOutputStream：允许应用程序以字节的方式向输出流中写入基本的 Java 数据类型。

BufferedInputStream：允许应用程序从输入流中读取数据，同时将数据存储在缓冲区中，以提高读取效率。

BufferedOutputStream：允许应用程序以字节的方式向输出流中写入数据，同时将数据存储在缓冲区中，以提高写入效率。

### 字符流

#### Java 中常见的关闭 IO 流操作有哪些？

使用 try-with-resources 方法关闭资源：try-with-resources 语句可以优雅地关闭 IO 流，它可以在 try 语句块结束时自动关闭资源，而不需要手动关闭；

使用 close()方法关闭资源：close()方法是用来关闭输入流或输出流的方法，它处理的是一次性的资源关闭，其具体的实现是将资源的引用设置为 null；

使用 flush()方法清空缓冲区：flush()方法是用来清空输出缓冲区的方法，它会将缓冲区中的内容刷新到输出流中，使得缓冲区清空，这样就可以避免程序出现异常。

### 字符流

Java 中的字符流也称为字符输入/输出流，是把字符数据读入程序或者将字符数据写出程序的流。字符流以字符为单位读取数据，而不是以字节为单位，因此可以更有效地处理文本文件。字符流基于字符集，因此可以以更高效的编码方式来处理文本，从而提高性能。 Java 中提供了两个基本的字符流类：Reader 和 Writer，它们分别用于读取和写入数据。比如，FileReader 用于从文件中读取数据，而 FileWriter 用于将数据写入文件中。

#### 常见的字符流

- InputStreamReader：从字节流转换为字符流。
- BufferedReader：字符输入流，使用缓冲区。
- CharArrayReader：从字符数组中读取数据。
- StringReader：从字符串中读取数据。
- FileReader：从文件中读取数据。
- OutputStreamWriter：将字符流转换为字节流。
- BufferedWriter：字符输出流，使用缓冲区。
- CharArrayWriter：向字符数组中写入数据。
- StringWriter：向字符串中写入数据。
- FileWriter：将数据写入文件中。

## 反射

class（包括 interface）的本质是数据类型（Type）。所以无继承关系的 class 数据类型无法赋值。

而 class 是由 JVM 在执行过程中动态加载的。JVM 在第一次读取到一种 class 类型时，将其加载进内存。

每加载一种 class，JVM 就为其创建一个 Class 类型的实例，并关联起来。注意：这里的 Class 类型是一个名叫 Class 的 class。它长这样：

```java
public final class Class {
    private Class() {}
}
```

以 String 类为例，当 JVM 加载 String 类时，它首先读取 String.class 文件到内存，然后，为 String 类创建一个 Class 实例并关联起来：

```java
Class cls = new Class(String);
```

这个 Class 实例是 JVM 内部创建的，如果我们查看 JDK 源码，可以发现 Class 类的构造方法是 private，只有 JVM 能创建 Class 实例，我们自己的 Java 程序是无法创建 Class 实例的。

所以，JVM 持有的每个 Class 实例都指向一个数据类型（class 或 interface）

**由于 JVM 为每个加载的 class 创建了对应的 Class 实例，并在实例中保存了该 class 的所有信息，包括类名、包名、父类、实现的接口、所有方法、字段等，因此，如果获取了某个 Class 实例，我们就可以通过这个 Class 实例获取到该实例对应的 class 的所有信息。**

**这种通过 Class 实例获取 class 信息的方法称为反射（Reflection）**

### 如何获取一个 `class` 的 `Class` 实例？

有三种方法

#### 1、直接通过一个 class 的静态变量 class 获取

```java
Class cls = String.class;
```

#### 2、如果有一个实例，可以通过该实例提供的 getClass()方法获取

```java
String s = "Hello";
Class cls = s.getClass();
```

#### 3、如果知道一个 class 的完整类名，可以通过静态方法 `Class.forName()` 获取

```java
Class cls = Class.forName("java.lang.String");
```

对任意的一个 Object 实例，只要我们获取了它的 Class，就可以获取它的一切信息或者对他进行操作。例如获取到了一个 Class 实例，我们就可以通过该 Class 实例来创建对应类型的实例：

```java
/ 获取String的Class实例:
Class cls = String.class;
// 创建一个String实例:
String s = (String) cls.newInstance();
```

### class 的动态加载

JVM 在执行 Java 程序的时候，并不是一次性把所有用到的 class 全部加载到内存，而是第一次需要用到 class 时才加载。

### 常用的反射接口。

#### 通过 Class 实例获取字段信息

- Field getField(name)：根据字段名获取类的某个 public field（包括父类）
- Field getDeclaredField(name)：根据字段名获取当前类的某个 field（包括 private field 但是不包括父类的 field）
- Field[] getFields()：获取类的所有 public field（包括父类）
- Field[] getDeclaredFields()：获取当前类的所有 field（包括 private field 但是不包括父类的 field）

##### 一个 Field 对象包含了一个字段的所有信息：

- getName()：返回字段名称，例如，"name"；
- getType()：返回字段类型，也是一个 Class 实例，例如，String.class；
- getModifiers()：返回字段的修饰符，它是一个 int，不同的 bit 表示不同的含义。

以 String 类的 value 字段为例，它的定义是：

```java
public final class String {
    private final byte[] value;
}

Field f = String.class.getDeclaredField("value");
f.getName(); // "value"
f.getType(); // class [B 表示byte[]类型
int m = f.getModifiers();
Modifier.isFinal(m); // true
Modifier.isPublic(m); // false
Modifier.isProtected(m); // false
Modifier.isPrivate(m); // true
Modifier.isStatic(m); // false
```

##### 获取字段值

利用反射拿到字段的一个 Field 实例只是第一步，我们还可以拿到一个实例对应的该字段的值，`Field.get(Object)` 获取指定实例的指定字段的值。

```java
// reflection
// 先获取Class实例，再获取Field实例，然后，用Field.get(Object)获取指定实例的指定字段的值。
import java.lang.reflect.Field;
public class Main {

    public static void main(String[] args) throws Exception {
        Object p = new Person("Xiao Ming");
        Class c = p.getClass();
        Field f = c.getDeclaredField("name");
        Object value = f.get(p);
        System.out.println(value); // "Xiao Ming"
    }
}

class Person {
    private String name;

    public Person(String name) {
        this.name = name;
    }
}
```

运行代码，如果不出意外，会得到一个 IllegalAccessException，这是因为 name 被定义为一个 private 字段，正常情况下，Main 类无法访问 Person 类的 private 字段。要修复错误，可以将 private 改为 public，或者，在调用 Object value = f.get(p);前，先写一句：`f.setAccessible(true);`

调用 Field.setAccessible(true)的意思是，别管这个字段是不是 public，一律允许访问。

可以试着加上上述语句，再运行代码，就可以打印出 private 字段的值。

有童鞋会问：如果使用反射可以获取 private 字段的值，那么类的封装还有什么意义？

答案是正常情况下，我们总是通过 p.name 来访问 Person 的 name 字段，编译器会根据 public、protected 和 private 决定是否允许访问字段，这样就达到了数据封装的目的。

而反射是一种非常规的用法，使用反射，首先代码非常繁琐，其次，它更多地是给工具或者底层框架来使用，目的是在不知道目标实例任何信息的情况下，获取特定字段的值。

此外，setAccessible(true)可能会失败。如果 JVM 运行期存在 SecurityManager，那么它会根据规则进行检查，有可能阻止 setAccessible(true)。例如，某个 SecurityManager 可能不允许对 java 和 javax 开头的 package 的类调用 setAccessible(true)，这样可以保证 JVM 核心库的安全。

##### 设置字段值

通过 Field 实例既然可以获取到指定实例的字段值，自然也可以设置字段的值。

设置字段值是通过 `Field.set(Object, Object)` 实现的，其中第一个 Object 参数是指定的实例，第二个 Object 参数是待修改的值。

例如：`f.set(p, "Xiao Hong");`

#### 调用方法

- Method getMethod(name, Class...)：获取类的某个 public Method（包括父类）
- Method getDeclaredMethod(name, Class...)：获取当前类的某个 Method（包括 private method 但是不包括父类的 method）
- Method[] getMethods()：获取类的所有 public Method（包括父类）
- Method[] getDeclaredMethods()：获取当前类的所有 Method（包括 private method 但是不包括父类的 method）

一个 Method 对象包含一个方法的所有信息：

- getName()：返回方法名称，例如："getScore"；
- getReturnType()：返回方法返回值类型，也是一个 Class 实例，例如：String.class；
- getParameterTypes()：返回方法的参数类型，是一个 Class 数组，例如：`{String.class, int.class}`；
- getModifiers()：返回方法的修饰符，它是一个 int，不同的 bit 表示不同的含义。

##### 调用实例方法

当我们获取到一个 Method 对象时，就可以对它进行调用。

对 Method 实例调用 invoke 就相当于调用该方法，invoke 的第一个参数是对象实例，即在哪个实例上调用该方法，后面的可变参数要与方法参数一致，否则将报错。

```java
// 用反射来调用substring方法
// reflection
import java.lang.reflect.Method;

public class Main {
    public static void main(String[] args) throws Exception {
        // String对象:
        String s = "Hello world";
        // 获取String substring(int)方法，参数为int:
        Method m = String.class.getMethod("substring", int.class);
        // 在s对象上调用该方法并获取结果:
        String r = (String) m.invoke(s, 6);
        // 打印调用结果:
        System.out.println(r); // "world"
    }
}
```

##### 调用静态方法

如果获取到的 Method 表示一个静态方法，调用静态方法时，由于无需指定实例对象，所以 invoke 方法传入的第一个参数永远为 null。

```java
// 以 Integer.parseInt(String) 为例
// reflection
import java.lang.reflect.Method;

public class Main {
    public static void main(String[] args) throws Exception {
        // 获取Integer.parseInt(String)方法，参数为String:
        Method m = Integer.class.getMethod("parseInt", String.class);
        // 调用该静态方法并获取结果:
        Integer n = (Integer) m.invoke(null, "12345");
        // 打印调用结果:
        System.out.println(n);
    }
}
```

##### 调用非 public 方法

和 Field 类似，对于非 public 方法，我们虽然可以通过 Class.getDeclaredMethod()获取该方法实例，但直接对其调用将得到一个 IllegalAccessException。为了调用非 public 方法，我们通过 Method.setAccessible(true)允许其调用

```java
// reflection
import java.lang.reflect.Method;

public class Main {
    public static void main(String[] args) throws Exception {
        Person p = new Person();
        Method m = p.getClass().getDeclaredMethod("setName", String.class);
        m.setAccessible(true);
        m.invoke(p, "Bob");
        System.out.println(p.name);
    }
}

class Person {
    String name;
    private void setName(String name) {
        this.name = name;
    }
}
```

#### 调用构造方法

通常使用 new 操作符创建新的实例：`Person p = new Person();`，如果通过反射来创建新的实例，可以调用 Class 提供的 newInstance()方法：

```java
Person p = Person.class.newInstance();
```

调用 Class.newInstance()的局限是，它只能调用该类的 public 无参数构造方法。如果构造方法带有参数，或者不是 public，就无法直接通过 Class.newInstance()来调用。

为了调用任意的构造方法，Java 的反射 API 提供了 Constructor 对象，通过 `getConstructor()` 获取，它包含一个构造方法的所有信息，可以创建一个实例。Constructor 对象和 Method 非常类似，不同之处仅在于它是一个构造方法，并且，调用结果总是返回实例

```java
import java.lang.reflect.Constructor;

public class Main {
    public static void main(String[] args) throws Exception {
        // 获取构造方法Integer(int):
        Constructor cons1 = Integer.class.getConstructor(int.class);
        // 调用构造方法:
        Integer n1 = (Integer) cons1.newInstance(123);
        System.out.println(n1);

        // 获取构造方法Integer(String)
        Constructor cons2 = Integer.class.getConstructor(String.class);
        Integer n2 = (Integer) cons2.newInstance("456");
        System.out.println(n2);
    }
}
```

通过 Class 实例获取 Constructor 的方法如下：

- getConstructor(Class...)：获取某个 public 的 Constructor；
- getDeclaredConstructor(Class...)：获取某个 Constructor；
- getConstructors()：获取所有 public 的 Constructor；
- getDeclaredConstructors()：获取所有 Constructor。

**注意 Constructor 总是当前类定义的构造方法，和父类无关，因此不存在多态的问题。**

**调用非 public 的 Constructor 时，必须首先通过 setAccessible(true)设置允许访问。setAccessible(true)可能会失败。**

#### 获取继承关系

##### 获取父类的 Class

Class getSuperclass(): 返回当前类的直接父类。

```java
// reflection
public class Main {
    public static void main(String[] args) throws Exception {
        Class i = Integer.class;
        Class n = i.getSuperclass();
        System.out.println(n);
        Class o = n.getSuperclass();
        System.out.println(o);
        System.out.println(o.getSuperclass());
    }
}
// 输出
// class java.lang.Number
// class java.lang.Object
// null
```

可以看到，Integer 的父类类型是 Number，Number 的父类是 Object，Object 的父类是 null。除 Object 外，其他任何非 interface 的 Class 都必定存在一个父类类型。

##### 获取 interface

由于一个类可能实现一个或多个接口，通过 Class 我们就可以查询到实现的接口类型。

Class[] getInterfaces(): 返回当前类实现的接口 Class 对象数组。

```java
public class Main {
    public static void main(String[] args) throws Exception {
        Class s = Integer.class;
        Class[] is = s.getInterfaces();
        for (Class i : is) {
            System.out.println(i);
        }
    }
}
```

**要特别注意：getInterfaces()只返回当前类直接实现的接口类型，并不包括其父类实现的接口类型**

如果一个类没有实现任何 interface，那么 getInterfaces()返回空数组。

##### 继承关系

当我们判断一个实例是否是某个类型时，正常情况下，使用 instanceof 操作符：

```java
Object n = Integer.valueOf(123);
boolean isDouble = n instanceof Double; // false
boolean isInteger = n instanceof Integer; // true
boolean isNumber = n instanceof Number; // true
boolean isSerializable = n instanceof java.io.Serializable; // true
```

如果是两个 Class 实例，要判断一个向上转型是否成立，可以调用 isAssignableFrom()：

```java
// Integer i = ?
Integer.class.isAssignableFrom(Integer.class); // true，因为Integer可以赋值给Integer
// Number n = ?
Number.class.isAssignableFrom(Integer.class); // true，因为Integer可以赋值给Number
// Object o = ?
Object.class.isAssignableFrom(Integer.class); // true，因为Integer可以赋值给Object
// Integer i = ?
Integer.class.isAssignableFrom(Number.class); // false，因为Number不能赋值给Integer
```

## 注解

什么是注解（Annotation）？注解是放在 Java 源码的类、方法、字段、参数前的一种特殊“注释”

注释会被编译器直接忽略，注解则可以被编译器打包进入 class 文件，因此，注解是一种用作标注的“元数据”。

### 注解的分类

Java 的注解可以分为三类：

#### 第一类是由编译器使用的注解

例如：

- @Override：让编译器检查该方法是否正确地实现了覆写；
- @SuppressWarnings：告诉编译器忽略此处代码产生的警告。

这类注解不会被编译进入.class 文件，它们在编译后就被编译器扔掉了。

#### 第二类是由工具处理.class 文件使用的注解

比如有些工具会在加载 class 的时候，对 class 做动态修改，实现一些特殊的功能。这类注解会被编译进入.class 文件，但加载结束后并不会存在于内存中。这类注解只被一些底层库使用，一般我们不必自己处理。

#### 第三类是在程序运行期能够读取的注解，它们在加载后一直存在于 JVM 中，这也是最常用的注解。

例如，一个配置了 @PostConstruct 的方法会在调用构造方法后自动被调用（这是 Java 代码读取该注解实现的功能，JVM 并不会识别该注解）。

### 注解的使用

从 JVM 的角度看，注解本身对代码逻辑没有任何影响，如何使用注解完全由工具决定。

定义一个注解时，还可以定义配置参数。配置参数可以包括：

- 所有基本类型；
- String；
- 枚举类型；
- 基本类型、String、Class 以及枚举的数组。

因为配置参数必须是常量，所以，上述限制保证了注解在定义时就已经确定了每个参数的值。

注解的配置参数可以有默认值，缺少某个配置参数时将使用默认值。

此外，大部分注解会有一个名为 value 的配置参数，对此参数赋值，可以只写常量，相当于省略了 value 参数。

如果只写注解，相当于全部使用默认值。

```java
// @Check就是一个注解
public class Hello {
    // 第一个@Check(min=0, max=100, value=55)明确定义了三个参数
    @Check(min=0, max=100, value=55)
    public int n;

    // 第二个@Check(value=99)只定义了一个value参数，实际上和@Check(99)是完全一样的
    @Check(value=99)
    public int p;

    // 最后一个@Check表示所有参数都使用默认值
    @Check(99) // 跟 @Check(value=99) 一样
    public int x;

    @Check
    public int y;
}
```

### 定义注解

Java 语言使用@interface 语法来定义注解（Annotation），它的格式如下：

```java
public @interface Report {
    int type() default 0;
    String level() default "info";
    String value() default "";
}
```

注解的参数类似无参数方法，可以用 default 设定一个默认值（强烈推荐）。最常用的参数应当命名为 value。

#### 元注解

有一些注解可以修饰其他注解，这些注解就称为元注解（meta annotation）。Java 标准库已经定义了一些元注解，我们只需要使用元注解，通常不需要自己去编写元注解。

- `@Target`

最常用的元注解是@Target。使用@Target 可以定义 Annotation 能够被应用于源码的哪些位置：

- 类或接口：ElementType.TYPE；
- 字段：ElementType.FIELD；
- 方法：ElementType.METHOD；
- 构造方法：ElementType.CONSTRUCTOR；
- 方法参数：ElementType.PARAMETER。

实际上 `@Target` 定义的 `value` 是 `ElementType[]` 数组，只有一个元素时，可以省略数组的写法。

```java
//定义注解@Report可用在方法上，我们必须添加一个@Target(ElementType.METHOD)
@Target(ElementType.METHOD)
public @interface Report {
    int type() default 0;
    String level() default "info";
    String value() default "";
}

// 定义注解@Report可用在方法或字段上，可以把@Target注解参数变为数组{ ElementType.METHOD, ElementType.FIELD }
@Target({
    ElementType.METHOD,
    ElementType.FIELD
})
public @interface Report {
    ...
}
```

- `@Retention`

另一个重要的元注解 `@Retention` 定义了 Annotation 的生命周期：

- 仅编译期：RetentionPolicy.SOURCE；
- 仅 class 文件：RetentionPolicy.CLASS；
- 运行期：RetentionPolicy.RUNTIME。

如果 `@Retention` 不存在，则该 Annotation 默认为 `CLASS`。因为通常我们自定义的 Annotation 都是 `RUNTIME`，所以，务必要加上 `@Retention(RetentionPolicy.RUNTIME)` 这个元注解：

```java
@Retention(RetentionPolicy.RUNTIME)
public @interface Report {
    int type() default 0;
    String level() default "info";
    String value() default "";
}
```

- `@Repeatable`

使用 `@Repeatable` 这个元注解可以定义 Annotation 是否可重复。这个注解应用不是特别广泛。

```java
@Repeatable(Reports.class)
@Target(ElementType.TYPE)
public @interface Report {
    int type() default 0;
    String level() default "info";
    String value() default "";
}

@Target(ElementType.TYPE)
public @interface Reports {
    Report[] value();
}

// 经过@Repeatable修饰后，在某个类型声明处，就可以添加多个@Report注解：
@Report(type=1, level="debug")
@Report(type=2, level="warning")
public class Hello {
}
```

- `@Inherited`

使用 `@Inherited` 定义子类是否可继承父类定义的 Annotation。`@Inherited` 仅针对 `@Target(ElementType.TYPE)` 类型的 annotation 有效，并且仅针对 class 的继承，对 interface 的继承无效

#### 如何定义 Annotation

总结一下定义 `Annotation` 的步骤：

第一步，用 `@interface` 定义注解：

```java
public @interface Report {
}
```

第二步，添加参数、默认值：

```java
public @interface Report {
    int type() default 0;
    String level() default "info";
    String value() default "";
}
```

把最常用的参数定义为 `value()`，推荐所有参数都尽量设置默认值。

第三步，用元注解配置注解：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface Report {
    int type() default 0;
    String level() default "info";
    String value() default "";
}
```

其中，必须设置@Target 和@Retention，@Retention 一般设置为 RUNTIME，因为我们自定义的注解通常要求在运行期读取。一般情况下，不必写@Inherited 和@Repeatable。

### 处理注解

Java 的注解本身对代码逻辑没有任何影响。根据@Retention 的配置：

- SOURCE 类型的注解在编译期就被丢掉了；
- CLASS 类型的注解仅保存在 class 文件中，它们不会被加载进 JVM；
- RUNTIME 类型的注解会被加载进 JVM，并且在运行期可以被程序读取。

如何使用注解完全由工具决定。SOURCE 类型的注解主要由编译器使用，因此我们一般只使用，不编写。CLASS 类型的注解主要由底层工具库使用，涉及到 class 的加载，一般我们很少用到。只有 RUNTIME 类型的注解不但要使用，还经常需要编写。

因为注解定义后也是一种 class，所有的注解都继承自 java.lang.annotation.Annotation，因此，读取注解，需要使用反射 API。

#### 反射 API 读取 Annotation 的方法

##### 判断某个注解是否存在于 Class、Field、Method 或 Constructor：

- Class.isAnnotationPresent(Class)
- Field.isAnnotationPresent(Class)
- Method.isAnnotationPresent(Class)
- Constructor.isAnnotationPresent(Class)

```java
// 判断@Report是否存在于Person类:
Person.class.isAnnotationPresent(Report.class);
```

##### 使用反射 API 读取 Annotation：

- Class.getAnnotation(Class)
- Field.getAnnotation(Class)
- Method.getAnnotation(Class)
- Constructor.getAnnotation(Class)

```java
// 获取Person定义的@Report注解:
Report report = Person.class.getAnnotation(Report.class);
int type = report.type();
String level = report.level();
```

读取方法、字段和构造方法的 Annotation 和 Class 类似。但要读取方法参数的 Annotation 就比较麻烦一点，因为方法参数本身可以看成一个数组，而每个参数又可以定义多个注解，所以，一次获取方法参数的所有注解就必须用一个二维数组来表示。例如，对于以下方法定义的注解：

```java
public void hello(@NotNull @Range(max=5) String name, @NotNull String prefix) {
}

// 要读取方法参数的注解，我们先用反射获取Method实例，然后读取方法参数的所有注解：
// 获取Method实例:
Method m = ...
// 获取所有参数的Annotation:
Annotation[][] annos = m.getParameterAnnotations();
// 第一个参数（索引为0）的所有Annotation:
Annotation[] annosOfName = annos[0];
for (Annotation anno : annosOfName) {
    if (anno instanceof Range r) { // @Range注解
        r.max();
    }
    if (anno instanceof NotNull n) { // @NotNull注解
        //
    }
}
```

#### 使用注解

注解如何使用，完全由程序自己决定。例如，JUnit 是一个测试框架，它会自动运行所有标记为@Test 的方法。

我们来看一个 `@Range` 注解，我们希望用它来定义一个 String 字段的规则：字段长度满足 `@Range` 的参数定义：

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Range {
    int min() default 0;
    int max() default 255;
}

// 在某个JavaBean中，我们可以使用该注解：
public class Person {
    @Range(min=1, max=20)
    public String name;

    @Range(max=10)
    public String city;
}
```

但是，定义了注解，本身对程序逻辑没有任何影响。我们必须自己编写代码来使用注解。这里，我们编写一个 Person 实例的检查方法，它可以检查 Person 实例的 String 字段长度是否满足 `@Range` 的定义：

```java
void check(Person person) throws IllegalArgumentException, ReflectiveOperationException {
    // 遍历所有Field:
    for (Field field : person.getClass().getFields()) {
        // 获取Field定义的@Range:
        Range range = field.getAnnotation(Range.class);
        // 如果@Range存在:
        if (range != null) {
            // 获取Field的值:
            Object value = field.get(person);
            // 如果值是String:
            // 判断中的语法是 Java 16 引入的一个新特性，叫做"模式匹配的 instanceof"（Pattern Matching for instanceof）
            if (value instanceof String s) {
                // 判断值是否满足@Range的min/max:
                if (s.length() < range.min() || s.length() > range.max()) {
                    throw new IllegalArgumentException("Invalid field: " + field.getName());
                }
            }
        }
    }
}
```

这样一来，我们通过@Range 注解，配合 check()方法，就可以完成 Person 实例的检查。

**注意检查逻辑完全是我们自己编写的，JVM 不会自动给注解添加任何额外的逻辑。**
