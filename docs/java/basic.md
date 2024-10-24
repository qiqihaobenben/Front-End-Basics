# Java 基础

## Java 试用

### 基本操作

1. 下载 JDK 并安装，配置环境变量

2. 创建一个 Hello.java 文件

- 一个 Java 源码文件只能定义一个 public 类型的 class，Java 文件中类名必须跟文件名相同，类名以大写字母开头
- 一个程序中有且只有一个主方法（main）。Java 规定，某个类定义的 public static void main(String[] args)是 Java 程序的固定入口方法，因此，Java 程序总是从 main 方法开始执行。
- Java 源码的缩进不是必须的，但是用缩进后，格式好看，很容易看出代码块的开始和结束，缩进一般是 4 个空格或者一个 tab。

```java
// 定义一个公有的类，类名必须跟文件名相同，类名以大写字母开头，大小写敏感
// class用来定义一个类，public表示这个类是公开的，public、class都是Java的关键字，必须小写
public class Hello {
  // 定义一个 main 方法（也叫主方法），是程序的入口
  // 一个程序中有且只有一个主方法
  public static void main(String[] args) {
    // 在控制台输出一串文字，双引号中的内容就是要输出的文字内容
    System.out.println("Hello, World!");
  }
}
```

3. 编译并运行

- 编译命令：javac Hello.java
- 运行命令：java Hello

Java 源码本质上是一个文本文件，我们需要先用 javac 把 Hello.java 编译成字节码文件 Hello.class，然后，用 java 命令执行这个字节码文件。

因此，可执行文件 javac 是编译器，而可执行文件 java 就是虚拟机。

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

#### 整型

整型也叫整数型，表示整数数据类型

- 小整型 byte
- 短整型 short
- 整型 int
- 长整型 long

#### 浮点型

表示小数数据类型

- 单精度浮点型 float
- 双精度浮点型 double

#### 字符型 char

表示单个字符类型。字符型就是平时使用的各种字符、字母、数字，以及各种标点符号。

Java 中表示字符串的时候，需要通过一对单引号将其括起来。

#### 布尔类型 boolean

表示真或假（true/false）

#### 空类型 null

也叫 NULL 类型（null），他是 Java 中一种比较特殊的常量值，通常用于引用数据类型的初始化。

### 引用数据类型

#### 字符串型 String

表示多个字符集合类型。字符串就是多个字符的集合，多个字符组成的串。

在 Java 中表示字符串的时候，需要通过一对双引号将其括起来。

#### 数组 Array

#### 类 class

#### 接口 interface

#### Lambda Lambda

### 单双引号的区别

字符串与单个字符的区别——单个字符使用单引号，而字符串使用双引号，即使双引号中只有一个字符，其表示的也是一个字符串，只不过字符串中的有效字符只有一个而已。

## Java 变量

Java 中，在我们想要使用变量之前，需要先定义一个变量，也就是需要向内存申请一块存储空间，目的是存储某些值，这些值在未来程序运行的某个时间节点可能会发生变化。

在定义变量的时候，需要指定申请的是什么类型的变量，即告诉 Java 要申请多少字节的存储空间来存储什么值。

### 变量的命名规范

### 使用变量的注意事项

#### 变量的作用域：语句块内有效

#### 变量的初始化：变量必须初始化后再使用

### 变量类型转换

#### 隐式类型转换（自动类型转换）：小转大（不丢精度）

#### 显示类型转换（需要进行强制类型转换）：大转小（可能丢精度）

## Java 运算符

- 算术运算符：`+`、`-`、`*`、`/`、`%`
- 关系运算符：`>`, `<`, `>=`, `<=`, `==`, `!=`
- 逻辑运算符：`&&`、`||`、`!`
- 赋值运算符：`=`、`+=`、`-=`、`*=`、`/=`、`%=`
- 位运算符：`&`、`|`、`^`、`~`、`<<`、`>>`
- 条件运算符：`? :`
- instanceof 运算符：`instanceof`

### 运算符优先级

https://i.bjpowernode.com/article/368.html

## Java 数组

### 定义

```java
// 第一种方法
int[] arr = new int[5];
// 第二种方法
int[] arr = {1, 2, 3, 4, 5};

```

### 初始化

### 特性

## 方法（函数）

### 概念和定义

### 使用方法的好处

### 名词解析

### 注意事项

### 方法的重载

## 面向对象

### 类和对象的概念

- 类是对象的抽象
- 对象是类的实例

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

### 修饰符

#### 访问修饰符

- public
- private
- protected

#### 非访问修饰符

- static
- final
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

### 构造方法

#### 构造方法特点

### 继承（复习一下 JavaScript 的继承）

#### 继承的特点

#### 父类、子类、局部变量名重复、冲突时的访问规则

#### 继承中的权限

## 抽象（abstract）

在 Java 中，`abstract` 是一个修饰符，用 `abstract` 修饰的类叫抽象类，用 `abstract` 修饰的方法叫作抽象方法。

### abstract 注意事项

## 接口（interface）

接口（interface）是一种公共的规范，是一种引用数据类型。

### 接口的定义

### 接口中的成员

#### 接口中的常量

#### 接口中的抽象方法

#### 接口中的默认方法

#### 接口中的静态方法

#### 接口中的私有方法

### 接口的实现

#### 实现接口的格式

## 多态

### 格式

### 多态调用成员方法

### 多态调用成员属性

### 对象的上下转型

## 内部类

Java 中的内部类是一种特殊的类，它定义在另一个类的内部，即在一个类中定义另一个类，这个在类中定义的类就叫做内部类

内部类可以访问外部类的所有成员变量和方法，即使它们是私有的（private）、静态的（static）。

外部类是指定义在另一个类外部的类。一个外部类可以有多个内部类，而一个内部类也可以嵌套其他内部类

### 格式

### 内部类的访问特点

### 内部类的分类

根据内部类在类中定义的位置不同

- 成员内部类 ： 在类的成员位置
  - 静态成员内部类 ： 使用 static 修饰符
  - 非静态成员内部类 ： 没有使用 static 修饰符
- 局部内部类 ： 在类的局部位置（在成员方法中）
- 匿名内部类

#### 静态成员内部类和非晶态成员内部类的区别

还有其他的 https://blog.csdn.net/liuxiao723846/article/details/108006609

非静态内部类在编译完成之后会隐含地保存着一个引用，该引用是指向创建它的外部类的对象，但是静态内部类却没有。

静态内部类没有这个引用就意味着：

- 它的创建是不需要依赖于外部类的对象
- 它不能使用任何外部类的非 static 成员变量和方法（因为在没有外部类的对象的情况下，可以创建静态内部类的对象，如果允许访问外部类的非 static 成员就会产生矛盾，因为外部类的非 static 成员必须依附于具体的对象）
- 静态内部类内允许有 static 属性、方法；

#### 局部内部类

局部内部类就像是方法里面的一个局部变量一样，是不能有 public、protected、private 以及 static 修饰符的。

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

- 空指针异常（NullPointerException）: 当程序试图在没有引用的对象上调用方法，或者试图访问或修改一个不存在的对象时，抛出此异常。

- 类型转换异常（ClassCastException）: 当一个类型的对象转换成不兼容的类型时，抛出此异常。

- 数组负下标异常（ArrayIndexOutOfBoundsException）: 当程序试图访问一个数组中不存在的索引时，抛出该异常。

- 数学异常（ArithmeticException）: 数学运算异常时抛出此异常。

- 算术异常（IllegalArgumentException）: 当传递给方法的参数不合法时，抛出此异常。

- 违反安全原则异常（SecurityException）: 当一个程序违反安全原则时，抛出此异常。

- 文件未找到异常（FileNotFoundException）: 当程序尝试访问不存在的文件时，抛出此异常。

- 栈溢出异常（StackOverflowError）: 当程序堆栈溢出时，抛出此异常。

- 字符串解析异常（NumberFormatException）: 当程序试图将字符串转换成不支持的数字格式时，抛出此异常。

- 运行时异常（RuntimeException）: 所有可能在 Java 程序运行时发生的异常的基类.

## 集合

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

在 Java 的反射应用中，最常见的就是对 Class 类的相关操作，Class 类常用的反射接口。

- String getName(): 返回类的完整名称，包括包名。

- Class getSuperclass(): 返回当前类的直接父类。

- Class getDeclaringClass(): 返回声明当前类的 Class 对象。

- Class[] getInterfaces(): 返回当前类实现的接口 Class 对象数组。

- int getModifiers(): 返回类的修饰符（public、private、protected 等）。

- Field[] getFields(): 返回类的公共属性。

- Method[] getMethods(): 返回类的公共方法。

- Constructor[] getConstructors(): 返回类的构造方法。

- Field[] getDeclaredFields(): 返回类的所有属性（包括私有属性）。

- Method[] getDeclaredMethods(): 返回类的所有方法（包括私有方法）。

- Constructor[] getDeclaredConstructors(): 返回类的所有构造方法（包括私有构造方法）。

- Object newInstance(): 创建实例。
