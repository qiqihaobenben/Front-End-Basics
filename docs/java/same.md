# Java 一些相关概念深入搭配理解

## Java 中的重载、覆写和多态

### 一、重载（Overloading）

**重载**指的是在**同一个类中**，方法的名字相同，但**参数列表不同**（参数的类型、数量、或顺序不同）。

#### 特点：

1. **方法名相同**，但**方法参数不同**（类型、个数或顺序）。
2. **返回值可以相同也可以不同**。
3. 重载和**方法的修饰符（如 `public`、`static`）无关**。

#### 重载的意义：

重载可以实现类似功能的方法使用相同的名字，让代码更简洁易读。例如，`println` 方法就是重载的一个经典例子，可以打印字符串、数字、布尔值等。

#### 举例代码：

```java
class OverloadingExample {
    // 重载方法：加法运算
    public int add(int a, int b) { // 两个整数相加
        return a + b;
    }

    public double add(double a, double b) { // 两个小数相加
        return a + b;
    }

    public String add(String a, String b) { // 拼接两个字符串
        return a + b;
    }

    public static void main(String[] args) {
        OverloadingExample example = new OverloadingExample();

        // 调用不同的add方法
        System.out.println(example.add(3, 4));         // 输出 7
        System.out.println(example.add(3.5, 4.5));     // 输出 8.0
        System.out.println(example.add("Hello, ", "World!")); // 输出 Hello, World!
    }
}
```

**总结：** 重载是同一个类中方法名相同，但参数不同，编译器根据传入参数的类型和数量，选择调用哪个方法。

---

### 二、覆写（Overriding）

**覆写**指的是在**子类中修改父类的方法实现**，从而改变父类的行为。

#### 特点：

1. **方法名、参数列表、返回值必须和父类方法一致**。
2. 子类方法的**访问权限不能比父类更严格**（如，父类是 `public`，子类也必须是 `public`）。
3. 子类可以用自己的逻辑替换掉父类的方法逻辑。
4. 被覆写的方法不能是 `private` 或 `static`。

#### 覆写的意义：

覆写是实现**多态**的核心，它允许子类根据自己的需要来定制父类的行为。

#### 举例代码：

```java
// 父类
class Animal {
    public void sound() {
        System.out.println("动物发出某种声音");
    }
}

// 子类
class Dog extends Animal {
    @Override
    public void sound() { // 覆写父类的方法
        System.out.println("狗叫：汪汪汪");
    }
}

class Cat extends Animal {
    @Override
    public void sound() { // 覆写父类的方法
        System.out.println("猫叫：喵喵喵");
    }
}

public class OverridingExample {
    public static void main(String[] args) {
        Animal myDog = new Dog(); // 父类引用指向子类对象
        Animal myCat = new Cat();

        myDog.sound(); // 输出 狗叫：汪汪汪
        myCat.sound(); // 输出 猫叫：喵喵喵
    }
}
```

**总结：** 覆写是子类修改父类方法的实现。通过覆写，你可以在子类中提供特定的实现逻辑。

---

### 三、多态（Polymorphism）

**多态**指的是**同一个对象的不同表现形式**，是基于**继承**和**方法覆写**实现的。

#### 多态的实现：

1. **父类引用指向子类对象**。
2. 调用方法时，编译期看父类有没有这个方法，运行时根据实际对象类型调用对应的方法（即子类覆写的方法）。

#### 多态的意义：

多态让代码更加灵活、可扩展。例如，一个方法可以接受父类类型的参数，而不需要关心具体是哪个子类对象。

#### 举例代码：

```java
class Animal {
    public void sound() {
        System.out.println("动物发出某种声音");
    }
}

class Dog extends Animal {
    @Override
    public void sound() {
        System.out.println("狗叫：汪汪汪");
    }
}

class Cat extends Animal {
    @Override
    public void sound() {
        System.out.println("猫叫：喵喵喵");
    }
}

public class PolymorphismExample {
    public static void makeSound(Animal animal) { // 参数是父类类型
        animal.sound(); // 调用方法，实际执行的是子类覆写的方法
    }

    public static void main(String[] args) {
        Animal dog = new Dog(); // 父类引用指向子类对象
        Animal cat = new Cat();

        makeSound(dog); // 输出 狗叫：汪汪汪
        makeSound(cat); // 输出 猫叫：喵喵喵
    }
}
```

#### 核心点：

- **编译时**：调用的方法是根据引用的类型（父类）来检查的。
- **运行时**：真正执行的是**对象实际类型**（子类）的方法。

**总结：** 多态通过父类引用灵活调用子类的方法，能让程序更具扩展性。

---

### 四、重载、覆写、多态的区别总结

| 特性         | 重载（Overloading）                      | 覆写（Overriding）                         | 多态（Polymorphism）                     |
| ------------ | ---------------------------------------- | ------------------------------------------ | ---------------------------------------- |
| **定义**     | 同类中方法名相同，参数列表不同           | 子类中修改父类方法                         | 父类引用指向子类对象，运行时调用子类方法 |
| **发生位置** | 同一个类                                 | 子类和父类之间                             | 子类和父类之间                           |
| **方法签名** | 参数列表必须不同                         | 参数列表必须相同                           | 基于覆写实现                             |
| **返回值**   | 可以不同                                 | 必须相同（或子类返回值是父类返回值的子类） | 不影响多态                               |
| **修饰符**   | 没有限制                                 | 子类权限不能更严格                         | 不影响多态                               |
| **作用**     | 功能类似的方法用相同名字，增强代码可读性 | 修改父类行为，提供子类特定实现             | 提高代码灵活性和扩展性                   |

---

## Java 的抽象类和接口

在 Java 中，抽象类（Abstract Class）和接口（Interface）都是实现多态和代码复用的核心机制，但它们的用途和设计思想有显著区别。以下是详细的对比分析和实际场景示例：

---

### **一、相似点**

1. **无法直接实例化**
   两者都不能直接创建对象（如 `new AbstractClass()` 或 `new Interface()` 是非法的）。
2. **可定义抽象方法**
   都可以声明抽象方法（未实现的方法），子类/实现类必须实现这些方法。
3. **支持多态**
   都可以作为父类型引用指向子类对象，实现运行时多态。

---

### **二、核心区别**

| 特性     | 抽象类（Abstract Class）           | 接口（Interface）                         |
| -------- | ---------------------------------- | ----------------------------------------- |
| 继承方式 | 单继承（一个类只能继承一个抽象类） | 多实现（一个类可实现多个接口）            |
| 成员变量 | 可以包含实例变量和常量             | 只能包含 `public static final` 常量       |
| 构造方法 | 可以有构造方法                     | 不能有构造方法                            |
| 方法实现 | 可以包含具体方法（非抽象方法）     | Java 8 前只能有抽象方法，之后支持默认方法 |
| 设计目的 | 表示“是什么”（is-a 关系）          | 表示“能做什么”（has-a 能力）              |

---

### **三、使用场景**

#### **1. 抽象类的典型场景**

**场景：共享代码逻辑和状态**
当多个相关类需要共享公共代码、字段或非公共方法时，抽象类更适合。例如：

```java
// 抽象类：表示一种“图形”的通用逻辑
public abstract class Shape {
    private String color;

    public Shape(String color) {
        this.color = color;
    }

    // 抽象方法：子类必须实现
    public abstract double area();

    // 具体方法：子类共享的代码
    public String getColor() {
        return color;
    }
}

// 子类：圆形
public class Circle extends Shape {
    private double radius;

    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }

    @Override
    public double area() {
        return Math.PI * radius * radius;
    }
}

// 子类：矩形
public class Rectangle extends Shape {
    private double width, height;

    public Rectangle(String color, double width, double height) {
        super(color);
        this.width = width;
        this.height = height;
    }

    @Override
    public double area() {
        return width * height;
    }
}
```

**关键点**：

- 抽象类 `Shape` 提供了共享字段 `color` 和方法 `getColor()`，子类无需重复实现。
- 构造方法初始化公共状态，确保子类必须通过 `super()` 调用父类构造方法。

---

#### **2. 接口的典型场景**

**场景：定义行为契约**
当需要为不同类定义一组能力（跨继承树）时，接口更灵活。例如：

```java
// 接口：定义“可飞行”能力
public interface Flyable {
    void fly();
}

// 接口：定义“可鸣叫”能力
public interface Honkable {
    void honk();
}

// 类：飞机实现“飞行”
public class Airplane implements Flyable {
    @Override
    public void fly() {
        System.out.println("Airplane flies with engines.");
    }
}

// 类：鸭子同时实现“飞行”和“鸣叫”
public class Duck implements Flyable, Honkable {
    @Override
    public void fly() {
        System.out.println("Duck flaps wings to fly.");
    }

    @Override
    public void honk() {
        System.out.println("Duck quacks.");
    }
}
```

**关键点**：

- `Duck` 可以同时实现多个接口，实现多重行为组合。
- 接口的默认方法（Java 8+）可提供默认实现，减少重复代码：

```java
public interface Flyable {
    void fly();

    // 默认方法：无需子类实现
    default void emergencyLand() {
        System.out.println("Emergency landing initiated.");
    }
}
```

---

### **四、实际开发中的选择原则**

1. **选择抽象类的情况**

   - 多个类需要共享代码或状态。
   - 需要定义非 `public` 方法或字段。
   - 需要构造方法初始化逻辑。
   - 典型的模板方法模式（定义算法骨架）。

2. **选择接口的情况**
   - 定义跨继承树的能力（如 `Comparable`、`Serializable`）。
   - 需要多重继承行为。
   - 定义 API 契约（如 JDBC 的 `Connection` 接口）。
   - 结合 Lambda 表达式（函数式接口，如 `Runnable`）。

---

### **五、经典示例对比**

#### **Java 集合框架中的抽象类 vs 接口**

- **接口 `List`**
  定义列表的行为契约（如 `add()`, `get()`），所有列表类必须遵守。
- **抽象类 `AbstractList`**
  提供 `List` 接口的通用实现（如基于索引的操作），`ArrayList` 和 `LinkedList` 继承它以复用代码。

```java
// 接口定义行为
public interface List<E> {
    boolean add(E e);
    E get(int index);
    // ...
}

// 抽象类提供部分实现
public abstract class AbstractList<E> implements List<E> {
    public boolean add(E e) {
        add(size(), e); // 调用抽象方法
        return true;
    }

    // 抽象方法：子类必须实现
    public abstract void add(int index, E element);
}

// 具体类：复用 AbstractList 的逻辑
public class ArrayList<E> extends AbstractList<E> {
    @Override
    public void add(int index, E element) {
        // 具体实现...
    }
}
```

---

### **六、总结**

- **抽象类**：用于构建类的层次结构，强调代码复用和“是什么”。
- **接口**：用于定义跨类的能力，强调多态和“能做什么”。
- **Java 8+**：接口通过默认方法缩小了与抽象类的差距，但设计意图不同。

根据具体需求灵活选择两者，甚至结合使用（如接口定义行为，抽象类提供部分实现）。
