# Java 的更新

## Java 语法的更新

### Integer[]::new

`Integer[] array = list.toArray(Integer[]::new);` 这行代码是 **将 List 集合转换为 Integer 类型数组** 的现代写法。它的核心作用是通过类型安全且高效的方式完成集合到数组的转换。以下是详细说明和示例：

---

#### **一、代码解析**

- **`list.toArray(...)`**
  `List` 接口的方法，用于将集合转换为数组。

- **`Integer[]::new`**
  Java 8 的方法引用语法，等价于 Lambda 表达式 `size -> new Integer[size]`，表示根据集合大小动态创建对应长度的数组。

---

#### **二、与传统写法的对比**

##### 1. **传统方式**

```java
// 方式1：传入空数组（自动分配大小）
Integer[] array1 = list.toArray(new Integer[0]);

// 方式2：传入预定义数组（可能浪费空间）
Integer[] tempArray = new Integer[list.size()];
Integer[] array2 = list.toArray(tempArray);
```

##### 2. **现代写法（推荐）**

```java
// 直接通过方法引用创建数组
Integer[] array = list.toArray(Integer[]::new);
```

**优势**：
✅ 代码更简洁
✅ 避免预分配数组长度可能导致的浪费
✅ 明确指定目标数组类型（类型安全）

---

#### **三、具体示例**

##### 场景：将 `List<Integer>` 转换为 `Integer[]`

```java
import java.util.Arrays;
import java.util.List;

public class ListToArrayDemo {
    public static void main(String[] args) {
        List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);

        // 转换为 Integer 数组
        Integer[] array = list.toArray(Integer[]::new);

        // 验证结果
        System.out.println("数组类型: " + array.getClass()); // 输出 Integer[]
        System.out.println("数组内容: " + Arrays.toString(array)); // 输出 [1, 2, 3, 4, 5]
    }
}
```

---

#### **四、底层原理**

1. **动态数组创建**
   `Integer[]::new` 会根据集合的 `size()` 值生成一个长度精确匹配的新数组。

2. **数据拷贝过程**
   ```java
   // 伪代码逻辑
   public <T> T[] toArray(IntFunction<T[]> generator) {
       T[] arr = generator.apply(size); // 创建新数组（长度=集合大小）
       for (int i=0; i<size; i++) {
           arr[i] = elementData[i];     // 逐元素拷贝
       }
       return arr;
   }
   ```

---

#### **五、注意事项**

1. **类型一致性**
   如果集合包含非 `Integer` 元素，会抛出 `ArrayStoreException`：

   ```java
   List<Object> mixedList = Arrays.asList(1, "2");
   Integer[] arr = mixedList.toArray(Integer[]::new); // 抛出异常
   ```

2. **空集合处理**
   如果集合为空，生成的数组长度也会为 0：

   ```java
   List<Integer> emptyList = List.of();
   Integer[] arr = emptyList.toArray(Integer[]::new);
   System.out.println(arr.length); // 输出 0
   ```

3. **性能对比**
   | **方式** | **特点** |
   |------------------------|---------------------------------|
   | `toArray(new T[0])` | 推荐写法，JVM 会优化数组分配 |
   | `toArray(new T[size])` | 需手动计算 size，可能浪费空间 |
   | `toArray(T[]::new)` | 代码最简洁，现代写法（Java 8+） |

---

#### **六、扩展应用**

##### 1. **转换其他类型数组**

```java
List<String> strList = List.of("Java", "Python");
String[] strArray = strList.toArray(String[]::new);
```

##### 2. **自定义对象数组**

```java
class User {
    String name;
    User(String name) { this.name = name; }
}

List<User> users = List.of(new User("Alice"), new User("Bob"));
User[] userArray = users.toArray(User[]::new);
```

---

#### **总结**

- **`list.toArray(Integer[]::new)` 是类型安全的集合转数组写法**
- **优势**：代码简洁、自动适配长度、避免空间浪费
- **适用场景**：需要将集合转换为特定类型数组时优先使用

Java 在近年来（尤其是 Java 8 及后续版本）引入了许多现代化的语法特性，它们往往能显著简化代码、提升可读性。以下是一些类似 `Integer[]::new` 的现代 Java 语法场景，按用途分类整理：

---

### **一、Lambda 表达式与函数式接口**

#### 1. **Lambda 表达式**

- **作用**：简化匿名内部类的写法
- **传统写法**：
  ```java
  new Thread(new Runnable() {
      @Override
      public void run() {
          System.out.println("传统写法");
      }
  }).start();
  ```
- **现代写法**：
  ```java
  new Thread(() -> System.out.println("Lambda 写法")).start();
  ```

#### 2. **方法引用（Method Reference）**

- **作用**：进一步简化 Lambda 表达式
- **示例**：
  ```java
  List<String> list = Arrays.asList("A", "B", "C");
  list.forEach(System.out::println); // 等价于 s -> System.out.println(s)
  ```

---

### **二、Stream API（Java 8+）**

#### 1. **集合处理流水线**

- **作用**：链式操作处理集合数据
- **示例**：
  ```java
  List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
  List<Integer> squares = numbers.stream()
      .filter(n -> n % 2 == 0)    // 过滤偶数
      .map(n -> n * n)            // 平方计算
      .collect(Collectors.toList()); // 输出 [4, 16]
  ```

#### 2. **并行流加速处理**

- **作用**：多线程并行处理大数据集
- **示例**：
  ```java
  long count = numbers.parallelStream()
      .filter(n -> n > 2)
      .count();
  ```

---

### **三、Optional 类（Java 8+）**

#### 1. **安全处理 null**

- **作用**：避免 `NullPointerException`
- **传统写法**：
  ```java
  if (user != null && user.getName() != null) {
      System.out.println(user.getName());
  }
  ```
- **现代写法**：
  ```java
  Optional.ofNullable(user)
      .map(User::getName)
      .ifPresent(System.out::println);
  ```

---

### **四、新的日期时间 API（Java 8+）**

#### 1. **替代 `Date` 和 `Calendar`**

- **示例**：
  ```java
  LocalDate today = LocalDate.now();
  LocalDate nextWeek = today.plusDays(7);
  DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
  String formattedDate = nextWeek.format(formatter);
  ```

---

### **五、Record 类（Java 16+）**

#### 1. **简化不可变数据类**

- **传统 POJO**：

  ```java
  public class User {
      private final String name;
      private final int age;

      public User(String name, int age) { /* ... */ }
      // 需要手动编写 getter、equals、hashCode、toString
  }
  ```

- **Record 写法**：
  ```java
  public record User(String name, int age) { }
  // 自动生成所有方法
  ```

---

### **六、文本块（Text Blocks, Java 15+）**

#### 1. **多行字符串处理**

- **传统写法**：
  ```java
  String json = "{\n" +
                "  \"name\": \"Alice\",\n" +
                "  \"age\": 25\n" +
                "}";
  ```
- **现代写法**：
  ```java
  String json = """
      {
        "name": "Alice",
        "age": 25
      }
      """;
  ```

---

### **七、模式匹配（Java 17+）**

#### 1. `instanceof` 模式匹配

- **传统写法**：
  ```java
  if (obj instanceof String) {
      String s = (String) obj;
      System.out.println(s.length());
  }
  ```
- **现代写法**：
  ```java
  if (obj instanceof String s) { // 直接绑定变量
      System.out.println(s.length());
  }
  ```

#### 2. `switch` 表达式增强

- **传统 `switch`**：
  ```java
  int num;
  switch (day) {
      case MONDAY: num = 1; break;
      case TUESDAY: num = 2; break;
      default: num = 0;
  }
  ```
- **现代 `switch` 表达式**：
  ```java
  int num = switch (day) {
      case MONDAY -> 1;
      case TUESDAY -> 2;
      default -> 0;
  };
  ```

---

### **八、`var` 局部变量类型推断（Java 10+）**

#### 1. **简化变量声明**

- **传统写法**：
  ```java
  Map<String, List<Integer>> complexMap = new HashMap<>();
  ```
- **现代写法**：
  ```java
  var complexMap = new HashMap<String, List<Integer>>();
  ```

---

### **九、密封类（Sealed Classes, Java 17+）**

#### 1. **限制类的继承关系**

- **定义**：
  ```java
  public sealed class Shape permits Circle, Square { }
  public final class Circle extends Shape { }
  public final class Square extends Shape { }
  ```
- **作用**：明确控制哪些类可以继承父类。

---

### **十、其他实用语法**

#### 1. **集合工厂方法（Java 9+）**

```java
List<String> list = List.of("A", "B", "C"); // 不可变集合
Set<Integer> set = Set.of(1, 2, 3);
Map<String, Integer> map = Map.of("a", 1, "b", 2);
```

#### 2. **接口私有方法（Java 9+）**

```java
public interface Calculator {
    default void log() {
        doLog("Operation called");
    }

    private void doLog(String message) { // 接口私有方法
        System.out.println(message);
    }
}
```

---

### **总结：如何高效学习这些语法**

| **场景**   | **推荐语法**                | **优势**                   |
| ---------- | --------------------------- | -------------------------- |
| 集合遍历   | `forEach` + Lambda          | 代码简洁，支持并行         |
| 空值处理   | `Optional`                  | 显式处理 null，避免 NPE    |
| 日期操作   | `LocalDate`/`LocalDateTime` | 线程安全，API 丰富         |
| 数据类     | `Record`                    | 自动生成方法，减少样板代码 |
| 多行字符串 | 文本块（`"""..."""`）       | 保留格式，易读易维护       |
| 类型推断   | `var`                       | 减少冗余类型声明           |

**学习建议**：

1. **逐步替换旧代码**：在现有项目中尝试用新语法重构部分代码
2. **IDE 辅助**：使用 IntelliJ IDEA 或 Eclipse 的语法提示功能
3. **版本兼容性**：注意不同 Java 版本支持的特性（如 Java 8 不支持 Record）
4. **官方文档**：参考 [OpenJDK 特性列表](https://openjdk.org/projects/jdk/) 了解每个版本的新功能
