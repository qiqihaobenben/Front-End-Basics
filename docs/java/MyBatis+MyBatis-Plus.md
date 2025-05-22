# MyBatis 与 MyBatis-Plus 概念解析

## mapper、entiry、service、mapper 的 xml 概念及相互关系

### 一、核心概念和关系

#### 1. **Entity（实体类）**

- **是什么**：对应数据库中的一张表，类的每个属性对应表的一个字段。
- **作用**：用来存储从数据库查出来的一行数据，或准备存入数据库的数据。
- **示例**：比如数据库有个`user`表，有`id`、`name`、`age`字段，那么`User`实体类也会有这三个属性。

```java
// User.java（实体类）
public class User {
    private Long id;
    private String name;
    private Integer age;
    // getter和setter方法
}
```

---

#### 2. **Mapper（数据操作接口）**

- **是什么**：定义操作数据库的方法（比如增删改查），但**不写具体实现**。
- **作用**：告诉程序“你可以调用这些方法操作数据库”，具体 SQL 在 XML 或注解中实现。
- **MyBatis vs MyBatis-Plus**：
  - **MyBatis**：需要手动写所有方法。
  - **MyBatis-Plus**：继承`BaseMapper`，自动获得基本方法（如`selectById`、`insert`）。

```java
// MyBatis写法（传统）
public interface UserMapper {
    User selectById(Long id);
    void insert(User user);
}

// MyBatis-Plus写法（更简洁）
public interface UserMapper extends BaseMapper<User> {
    // 无需手动写基本方法！
}
```

---

#### 3. **Mapper XML（SQL 映射文件）**

- **是什么**：XML 文件，存放具体的 SQL 语句。
- **作用**：将 Mapper 接口中的方法和 SQL 绑定，告诉 MyBatis“调用这个方法时，执行这个 SQL”。
- **MyBatis-Plus**：如果使用 MyBatis-Plus 的 BaseMapper，简单操作可以不用写 XML！

```xml
<!-- UserMapper.xml（MyBatis需要这个文件） -->
<mapper namespace="com.example.mapper.UserMapper">
    <select id="selectById" resultType="User">
        SELECT * FROM user WHERE id = #{id}
    </select>
    <insert id="insert">
        INSERT INTO user (name, age) VALUES (#{name}, #{age})
    </insert>
</mapper>
```

---

#### 4. **Service（业务层）**

- **是什么**：处理业务逻辑（比如计算、校验、调用多个 Mapper 操作）。
- **作用**：Controller 层调用 Service，Service 调用 Mapper，实现“业务逻辑”和“数据库操作”分离。
- **通常结构**：
  - `UserService`接口：定义业务方法。
  - `UserServiceImpl`实现类：具体实现。

```java
// UserService.java（接口）
public interface UserService {
    User getUserById(Long id);
    void saveUser(User user);
}

// UserServiceImpl.java（实现类）
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public User getUserById(Long id) {
        return userMapper.selectById(id);
    }

    @Override
    public void saveUser(User user) {
        userMapper.insert(user);
    }
}
```

---

### 二、实际例子：用户管理系统

#### 场景

- 数据库表：`user`（字段：id, name, age）
- 功能：根据 ID 查询用户、新增用户。

---

#### 代码实现

##### 1. Entity（实体类）

```java
public class User {
    private Long id;
    private String name;
    private Integer age;
    // 省略getter和setter
}
```

---

##### 2. Mapper 接口

- **MyBatis-Plus 写法（推荐）**：

```java
public interface UserMapper extends BaseMapper<User> {
    // 不用写方法！BaseMapper已提供selectById、insert等方法
}
```

- **传统 MyBatis 写法**：

```java
public interface UserMapper {
    User selectById(Long id);
    void insert(User user);
}
```

---

##### 3. Mapper XML（仅 MyBatis 需要）

```xml
<!-- 传统MyBatis需要写这个文件 -->
<mapper namespace="com.example.mapper.UserMapper">
    <select id="selectById" resultType="User">
        SELECT * FROM user WHERE id = #{id}
    </select>
    <insert id="insert">
        INSERT INTO user (name, age) VALUES (#{name}, #{age})
    </insert>
</mapper>
```

---

##### 4. Service 层

```java
// 接口
public interface UserService {
    User getUserById(Long id);
    void saveUser(User user);
}

// 实现类
@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserMapper userMapper;

    @Override
    public User getUserById(Long id) {
        // 业务逻辑（比如记录日志、权限校验）
        return userMapper.selectById(id);
    }

    @Override
    public void saveUser(User user) {
        if (user.getAge() < 0) {
            throw new RuntimeException("年龄不能为负数！");
        }
        userMapper.insert(user);
    }
}
```

---

##### 5. Controller 层（调用 Service）

```java
@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/user/{id}")
    public User getUser(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PostMapping("/user")
    public void saveUser(@RequestBody User user) {
        userService.saveUser(user);
    }
}
```

---

### 三、执行流程

1. **请求进入 Controller**：比如访问`/user/1`。
2. **Controller 调用 Service**：`userService.getUserById(1)`。
3. **Service 调用 Mapper**：`userMapper.selectById(1)`。
4. **Mapper 执行 SQL**：
   - 如果是 MyBatis：根据 XML 中的 SQL 查询数据库。
   - 如果是 MyBatis-Plus：自动生成 SQL`SELECT * FROM user WHERE id=1`。
5. **返回结果**：最终用户收到 JSON 格式的 User 数据。

---

### 四、MyBatis 和 MyBatis-Plus 的关键区别

| 功能               | MyBatis         | MyBatis-Plus                            |
| ------------------ | --------------- | --------------------------------------- |
| **基本 CRUD 方法** | 需要手动写      | 继承`BaseMapper`，自动获得全部方法      |
| **SQL 编写**       | 需写 XML 或注解 | 简单操作不用写 SQL，复杂 SQL 仍可用 XML |
| **条件查询**       | 手动拼接 SQL    | 用`QueryWrapper`链式构造条件            |
| **代码量**         | 较多            | 更少，开发更快                          |

---

### 五、总结

- **Entity**：数据的载体，对应数据库表。
- **Mapper**：定义操作数据库的方法，MyBatis-Plus 更省力。
- **Mapper XML**：存放 SQL（MyBatis 需要，MyBatis-Plus 可选）。
- **Service**：处理业务逻辑，协调多个 Mapper 操作。

## MyBatis 的 XML

MyBatis 的 XML 文件是**核心配置文件**，它定义了如何执行 SQL、如何处理参数和结果。用通俗的话说：**它就像一本说明书，告诉 MyBatis “调用哪个方法时，执行哪条 SQL，怎么把数据塞到对象里”**。

---

### **一、XML 文件里有什么？**

一个典型的 MyBatis XML 文件包含以下部分（按顺序）：

#### **1. 基本结构**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="xxx.xxx.mapper.UserMapper">
    <!-- 在这里写具体的 SQL 操作 -->
</mapper>
```

- **`namespace`**：必须和你的 Mapper 接口的全限定名（包名+类名）一致。
  比如：`com.example.mapper.UserMapper` 接口对应 `namespace="com.example.mapper.UserMapper"`。

---

#### **2. SQL 操作标签**

对应增删改查的 SQL 语句，常用标签：
| 标签 | 作用 | 示例 |
|--------------|------------------------|--------------------------|
| `<select>` | 查询操作 | `SELECT * FROM user` |
| `<insert>` | 插入操作 | `INSERT INTO user(...)` |
| `<update>` | 更新操作 | `UPDATE user SET ...` |
| `<delete>` | 删除操作 | `DELETE FROM user` |

---

#### **3. 参数和结果的映射**

- **`parameterType`**（可选）：定义方法的参数类型（比如实体类、基本类型）。
- **`resultType`** 或 **`resultMap`**：定义 SQL 返回的结果如何映射到 Java 对象。
  - `resultType`：直接指定一个 Java 类型（如 `User`）。
  - `resultMap`：复杂映射时使用（比如字段名和属性名不一致）。

---

### **二、XML 文件的详细用法**

#### **1. 简单查询示例**

假设有一个 `UserMapper` 接口，定义了一个方法：

```java
public interface UserMapper {
    User getUserById(Long id);
}
```

对应的 XML：

```xml
<mapper namespace="com.example.mapper.UserMapper">
    <select id="getUserById" resultType="User" parameterType="Long">
        SELECT * FROM user WHERE id = #{id}
    </select>
</mapper>
```

- **`id`**：必须和接口方法名一致（这里是 `getUserById`）。
- **`resultType`**：返回的 Java 类型（如果实体类在配置中设置了别名，可以直接写 `User`）。
- **`#{id}`**：占位符，对应方法的参数 `Long id`。

---

#### **2. 插入数据示例**

接口方法：

```java
void insertUser(User user);
```

XML：

```xml
<insert id="insertUser" parameterType="User">
    INSERT INTO user (name, age)
    VALUES (#{name}, #{age})
</insert>
```

- `#{name}` 会从 `User` 对象的 `name` 属性中取值。

---

#### **3. 动态 SQL（重点！）**

MyBatis 最强大的功能之一，可以根据条件动态生成 SQL。常用标签：

##### **`<if>` 标签**

```xml
<select id="findUser" resultType="User" parameterType="User">
    SELECT * FROM user
    WHERE 1=1
    <if test="name != null">
        AND name = #{name}
    </if>
    <if test="age != null">
        AND age = #{age}
    </if>
</select>
```

- 如果传入的 `User` 对象有 `name`，则拼接 `AND name = ?`；同理处理 `age`。

---

##### **`<foreach>` 标签**

批量插入示例：

```xml
<insert id="batchInsert" parameterType="java.util.List">
    INSERT INTO user (name, age)
    VALUES
    <foreach item="user" collection="list" separator=",">
        (#{user.name}, #{user.age})
    </foreach>
</insert>
```

- `collection="list"`：表示参数是一个 `List` 集合。
- `item="user"`：遍历时的每个元素叫 `user`。
- `separator=","`：每个元素之间用逗号分隔。

---

##### **`<where>` 和 `<set>` 标签**

- **`<where>`**：自动处理 `WHERE` 后的条件，避免多余的 `AND` 或 `OR`。

```xml
<select id="findUser" resultType="User">
    SELECT * FROM user
    <where>
        <if test="name != null">name = #{name}</if>
        <if test="age != null">AND age = #{age}</if>
    </where>
</select>
```

- **`<set>`**：用于更新时自动处理 `SET` 后的字段。

```xml
<update id="updateUser" parameterType="User">
    UPDATE user
    <set>
        <if test="name != null">name = #{name},</if>
        <if test="age != null">age = #{age},</if>
    </set>
    WHERE id = #{id}
</update>
```

---

#### **4. 结果映射（`resultMap`）**

当数据库字段名和 Java 属性名不一致时，可以用 `resultMap` 手动映射。

**示例**：
数据库字段是 `user_name`，Java 属性是 `name`。

```xml
<resultMap id="userResultMap" type="User">
    <result column="user_name" property="name"/>
    <result column="user_age" property="age"/>
</resultMap>

<select id="getUserById" resultMap="userResultMap">
    SELECT user_name, user_age FROM user WHERE id = #{id}
</select>
```

- `column`：数据库字段名。
- `property`：Java 属性名。

---

### **三、XML 文件的位置和配置**

1. **存放位置**：一般放在 `resources/mapper` 目录下，文件名通常为 `UserMapper.xml`。
2. **配置扫描路径**：在 `application.properties` 或 `mybatis-config.xml` 中指定：

```properties
# application.properties
mybatis.mapper-locations=classpath:mapper/*.xml
```

---

### **四、完整例子：用户查询+插入**

#### **1. 实体类（User.java）**

```java
public class User {
    private Long id;
    private String name;
    private Integer age;
    // getter和setter
}
```

#### **2. Mapper 接口（UserMapper.java）**

```java
public interface UserMapper {
    User getUserById(Long id);
    void insertUser(User user);
    List<User> findUserByNameOrAge(@Param("name") String name, @Param("age") Integer age);
}
```

#### **3. XML 文件（UserMapper.xml）**

```xml
<mapper namespace="com.example.mapper.UserMapper">
    <!-- 根据ID查询 -->
    <select id="getUserById" resultType="User">
        SELECT * FROM user WHERE id = #{id}
    </select>

    <!-- 插入用户 -->
    <insert id="insertUser" parameterType="User">
        INSERT INTO user (name, age)
        VALUES (#{name}, #{age})
    </insert>

    <!-- 动态条件查询 -->
    <select id="findUserByNameOrAge" resultType="User">
        SELECT * FROM user
        <where>
            <if test="name != null">
                name LIKE CONCAT('%', #{name}, '%')
            </if>
            <if test="age != null">
                AND age = #{age}
            </if>
        </where>
    </select>
</mapper>
```

#### **4. Service 调用**

```java
@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;

    public User getUserById(Long id) {
        return userMapper.getUserById(id);
    }

    public void addUser(User user) {
        userMapper.insertUser(user);
    }

    public List<User> searchUsers(String name, Integer age) {
        return userMapper.findUserByNameOrAge(name, age);
    }
}
```

---

### **五、常见问题**

#### **1. 参数传递**

- 单个参数：直接写 `#{参数名}`。
- 多个参数：用 `@Param` 注解指定名称：

```java
User login(@Param("username") String name, @Param("pwd") String password);
```

```xml
<select id="login" resultType="User">
    SELECT * FROM user
    WHERE name = #{username} AND password = #{pwd}
</select>
```

---

#### **2. 模糊查询**

使用 `CONCAT` 函数或 `bind` 标签：

```xml
<select id="searchByName" resultType="User">
    SELECT * FROM user
    WHERE name LIKE CONCAT('%', #{name}, '%')
</select>
```

---

#### **3. 主键回填**

插入后获取自增主键：

```xml
<insert id="insertUser" useGeneratedKeys="true" keyProperty="id">
    INSERT INTO user (name, age) VALUES (#{name}, #{age})
</insert>
```

- `useGeneratedKeys`：启用自增主键。
- `keyProperty`：主键值会回填到参数对象的 `id` 属性中。

---

### **六、总结**

- **XML 是 MyBatis 的核心**：定义 SQL、参数映射、结果映射、动态条件。
- **动态 SQL 是亮点**：用 `<if>`、`<foreach>`、`<where>` 灵活拼接 SQL。
- **注意匹配关系**：`namespace` 对应接口名，`id` 对应方法名，`parameterType` 和 `resultType` 别写错。

**最后提示**：如果觉得 XML 麻烦，可以用 MyBatis 的注解方式（如 `@Select`）或直接使用 MyBatis-Plus（自动生成基本 SQL）！

## MyBatis 的注解

MyBatis 的注解是另一种配置方式，它直接在 Mapper 接口上写 SQL 语句。MyBatis 的注解方式允许你直接在 Mapper 接口的方法上编写 SQL，省去了 XML 文件的配置。这种方式适合简单 SQL，但如果 SQL 很复杂（比如动态条件较多），可能还是 XML 更清晰。

### **一、核心注解列表**

以下是常用的 MyBatis 注解：

| 注解                   | 作用                               | 示例                                |
| ---------------------- | ---------------------------------- | ----------------------------------- |
| `@Select`              | 定义查询 SQL                       | `@Select("SELECT * FROM user")`     |
| `@Insert`              | 定义插入 SQL                       | `@Insert("INSERT INTO user (...)")` |
| `@Update`              | 定义更新 SQL                       | `@Update("UPDATE user SET ...")`    |
| `@Delete`              | 定义删除 SQL                       | `@Delete("DELETE FROM user")`       |
| `@Options`             | 配置选项（如主键回填）             | `@Options(useGeneratedKeys = true)` |
| `@Param`               | 指定参数名（用于多参数绑定）       | `@Param("username") String name`    |
| `@Results` + `@Result` | 结果映射（字段名和属性名不一致时） | 见下文示例                          |
| `@SelectProvider`      | 动态生成 SQL（用于复杂条件查询）   | 见下文动态 SQL 部分                 |

---

### **二、基础用法示例**

#### **1. 简单查询**

直接在方法上写 `@Select` 注解：

```java
public interface UserMapper {
    @Select("SELECT * FROM user WHERE id = #{id}")
    User getUserById(Long id);
}
```

- `#{id}` 对应方法参数 `Long id`。

---

#### **2. 插入数据**

使用 `@Insert` 并配置主键回填：

```java
@Insert("INSERT INTO user (name, age) VALUES (#{name}, #{age})")
@Options(useGeneratedKeys = true, keyProperty = "id")  // 自增主键回填到 User 的 id 属性
void insertUser(User user);
```

---

#### **3. 参数绑定**

如果方法有多个参数，用 `@Param` 指定名称：

```java
@Select("SELECT * FROM user WHERE name = #{name} AND age = #{age}")
User findByNameAndAge(
    @Param("name") String name,
    @Param("age") Integer age
);
```

---

### **三、结果映射（字段名 ≠ 属性名）**

如果数据库字段名和 Java 属性名不一致（比如字段 `user_name`，属性 `name`），可以用 `@Results` 和 `@Result` 手动映射：

```java
@Select("SELECT user_name, user_age FROM user WHERE id = #{id}")
@Results({
    @Result(column = "user_name", property = "name"),  // 字段 -> 属性
    @Result(column = "user_age", property = "age")
})
User getUserById(Long id);
```

---

### **四、动态 SQL 处理**

注解方式也可以实现动态 SQL，但需要借助 `@SelectProvider`、`@InsertProvider` 等注解，结合一个 SQL 生成类。

#### **1. 定义 SQL 生成类**

```java
public class UserSqlProvider {
    // 生成动态查询 SQL
    public String findUserByNameOrAge(Map<String, Object> params) {
        String name = (String) params.get("name");
        Integer age = (Integer) params.get("age");

        StringBuilder sql = new StringBuilder("SELECT * FROM user WHERE 1=1");
        if (name != null) {
            sql.append(" AND name LIKE CONCAT('%', #{name}, '%')");
        }
        if (age != null) {
            sql.append(" AND age = #{age}");
        }
        return sql.toString();
    }
}
```

#### **2. 在 Mapper 接口中引用**

```java
public interface UserMapper {
    @SelectProvider(type = UserSqlProvider.class, method = "findUserByNameOrAge")
    List<User> findUserByNameOrAge(
        @Param("name") String name,
        @Param("age") Integer age
    );
}
```

---

### **五、注解 vs XML 的优缺点**

| **场景**                 | **注解**                           | **XML**                       |
| ------------------------ | ---------------------------------- | ----------------------------- |
| **简单 SQL**             | 直接在接口上写，方便快捷           | 需要额外维护 XML 文件         |
| **复杂 SQL（动态条件）** | 需要配合 Provider 类，代码较分散   | 用 `<if>`、`<foreach>` 更直观 |
| **结果映射**             | 用 `@Results` 略显繁琐             | 用 `resultMap` 结构清晰       |
| **可读性**               | SQL 混在 Java 代码中，可能影响阅读 | SQL 单独存放，结构分明        |
| **维护性**               | 修改 SQL 需要重新编译 Java 代码    | 修改 XML 无需重新编译         |

---

### **六、完整例子：注解方式实现 CRUD**

#### **1. 实体类（User.java）**

```java
public class User {
    private Long id;
    private String name;
    private Integer age;
    // getter和setter
}
```

#### **2. Mapper 接口（UserMapper.java）**

```java
public interface UserMapper {
    // 查询
    @Select("SELECT * FROM user WHERE id = #{id}")
    User getUserById(Long id);

    // 插入（主键回填）
    @Insert("INSERT INTO user (name, age) VALUES (#{name}, #{age})")
    @Options(useGeneratedKeys = true, keyProperty = "id")
    void insertUser(User user);

    // 动态查询（使用 Provider）
    @SelectProvider(type = UserSqlProvider.class, method = "findUserByNameOrAge")
    List<User> findUserByNameOrAge(
        @Param("name") String name,
        @Param("age") Integer age
    );

    // 更新
    @Update("UPDATE user SET name = #{name}, age = #{age} WHERE id = #{id}")
    void updateUser(User user);

    // 删除
    @Delete("DELETE FROM user WHERE id = #{id}")
    void deleteUser(Long id);
}
```

#### **3. SQL 生成类（UserSqlProvider.java）**

```java
public class UserSqlProvider {
    public String findUserByNameOrAge(Map<String, Object> params) {
        String name = (String) params.get("name");
        Integer age = (Integer) params.get("age");
        StringBuilder sql = new StringBuilder("SELECT * FROM user WHERE 1=1");
        if (name != null) {
            sql.append(" AND name LIKE CONCAT('%', #{name}, '%')");
        }
        if (age != null) {
            sql.append(" AND age = #{age}");
        }
        return sql.toString();
    }
}
```

#### **4. Service 调用**

```java
@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;

    public User getUser(Long id) {
        return userMapper.getUserById(id);
    }

    public void addUser(User user) {
        userMapper.insertUser(user);
    }

    public List<User> searchUsers(String name, Integer age) {
        return userMapper.findUserByNameOrAge(name, age);
    }
}
```

---

### **七、适用场景建议**

1. **适合注解**：

   - 简单的 CRUD 操作。
   - SQL 短且固定，无需动态拼接。
   - 项目规模小，不想维护 XML 文件。

2. **适合 XML**：
   - 动态 SQL 较多（如复杂查询条件）。
   - SQL 较长，需要更好的可读性。
   - 需要集中管理所有 SQL。

---

### **八、总结**

- **注解优势**：代码简洁，适合简单 SQL，减少文件切换。
- **注解缺点**：复杂 SQL 难以维护，动态 SQL 需要额外类。
- **推荐策略**：
  - 简单操作用注解，复杂操作用 XML。
  - 如果追求极致简洁，可以考虑 MyBatis-Plus（连注解都不用写，直接继承 `BaseMapper`）。

## MyBatis 和 MyBatis-Plus 的分页

MyBatis 和 MyBatis-Plus 的分页实现方式不同，MyBatis 需要手动编写分页逻辑，而 MyBatis-Plus 通过内置插件简化了分页操作。下面用通俗易懂的方式解释，并给出实际例子。

---

### **一、分页的核心概念**

分页的核心是：**按页码和每页大小，从数据库分段获取数据**。比如：

- 页码（pageNum）：第几页（从 1 开始）
- 每页大小（pageSize）：每页显示多少条数据
- 总记录数（total）：数据库中符合条件的总数据量
- 总页数（pages）：`总记录数 / 每页大小`（向上取整）

---

### **二、MyBatis 原生分页实现**

#### **1. 手动分页（物理分页）**

直接在 SQL 中使用数据库的分页语法（如 MySQL 的 `LIMIT`）：

```sql
SELECT * FROM user LIMIT #{start}, #{pageSize}
```

- `start = (pageNum - 1) * pageSize`：计算起始位置。

##### **实现步骤**：

1. **Mapper 接口**：定义带分页参数的方法。
2. **XML 文件**：编写包含 `LIMIT` 的 SQL。
3. **Service 层**：计算 `start`，调用 Mapper 并返回分页结果。

##### **示例代码**：

###### (1) Mapper 接口

```java
public interface UserMapper {
    List<User> selectByPage(@Param("start") int start, @Param("pageSize") int pageSize);
    int selectTotal();
}
```

###### (2) XML 文件

```xml
<!-- 分页查询 -->
<select id="selectByPage" resultType="User">
    SELECT * FROM user LIMIT #{start}, #{pageSize}
</select>

<!-- 查询总记录数 -->
<select id="selectTotal" resultType="int">
    SELECT COUNT(*) FROM user
</select>
```

###### (3) Service 层

```java
@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;

    public Map<String, Object> getUsersByPage(int pageNum, int pageSize) {
        int start = (pageNum - 1) * pageSize;
        List<User> users = userMapper.selectByPage(start, pageSize);
        int total = userMapper.selectTotal();
        int pages = (int) Math.ceil((double) total / pageSize);

        Map<String, Object> result = new HashMap<>();
        result.put("users", users);
        result.put("total", total);
        result.put("pages", pages);
        return result;
    }
}
```

---

#### **2. 缺点**

- **繁琐**：每次分页都要计算 `start`，写两条 SQL（查数据 + 查总数）。
- **SQL 依赖数据库**：不同数据库的分页语法不同（如 Oracle 用 `ROWNUM`）。

---

### **三、MyBatis-Plus 分页实现**

MyBatis-Plus 提供了**分页插件**，只需简单配置，就能自动处理分页逻辑。

#### **1. 配置分页插件**

在 Spring Boot 启动类或配置类中添加：

```java
@Configuration
public class MyBatisPlusConfig {
    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor()); // 分页插件
        return interceptor;
    }
}
```

#### **2. 使用分页方法**

直接使用 `Page` 对象和 `selectPage` 方法：

##### **示例代码**：

###### (1) Mapper 接口

```java
public interface UserMapper extends BaseMapper<User> {
    // 继承 BaseMapper，无需额外方法！
}
```

###### (2) Service 层

```java
@Service
public class UserService {
    @Autowired
    private UserMapper userMapper;

    public Page<User> getUsersByPage(int pageNum, int pageSize) {
        Page<User> page = new Page<>(pageNum, pageSize);
        return userMapper.selectPage(page, null); // 第二个参数是查询条件（Wrapper）
    }
}
```

###### (3) Controller 调用

```java
@RestController
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/users")
    public Page<User> getUsers(@RequestParam int pageNum, @RequestParam int pageSize) {
        return userService.getUsersByPage(pageNum, pageSize);
    }
}
```

#### **3. 结果分析**

返回的 `Page<User>` 对象包含：

- `records`：当前页的数据列表。
- `total`：总记录数。
- `size`：每页大小。
- `current`：当前页码。
- `pages`：总页数。

---

### **四、对比总结**

| **功能**       | **MyBatis**                           | **MyBatis-Plus**                              |
| -------------- | ------------------------------------- | --------------------------------------------- |
| **分页实现**   | 手动编写 SQL（LIMIT） + 计算分页参数  | 内置分页插件，自动生成分页 SQL                |
| **代码量**     | 较多（需写两条 SQL，手动计算）        | 极少（继承 BaseMapper，调用 selectPage 方法） |
| **数据库兼容** | 需针对不同数据库调整 SQL              | 自动识别数据库类型，生成对应分页语句          |
| **返回结果**   | 需手动封装分页信息（total、pages 等） | 返回 `Page` 对象，包含所有分页信息            |

---

### **五、完整示例（MyBatis-Plus）**

#### **1. 实体类**

```java
@Data // 使用 Lombok 自动生成 getter/setter
public class User {
    private Long id;
    private String name;
    private Integer age;
}
```

#### **2. Controller 测试**

访问 URL：

```
http://localhost:8080/users?pageNum=1&pageSize=2
```

返回结果：

```json
{
  "records": [
    { "id": 1, "name": "张三", "age": 20 },
    { "id": 2, "name": "李四", "age": 25 }
  ],
  "total": 100,
  "size": 2,
  "current": 1,
  "pages": 50
}
```

---

### **六、高级用法（MyBatis-Plus 带条件分页）**

如果想在分页时添加查询条件（如按名字搜索）：

```java
public Page<User> searchUsers(String keyword, int pageNum, int pageSize) {
    Page<User> page = new Page<>(pageNum, pageSize);
    QueryWrapper<User> wrapper = new QueryWrapper<>();
    wrapper.like("name", keyword); // WHERE name LIKE '%keyword%'
    return userMapper.selectPage(page, wrapper);
}
```

访问 URL：

```
http://localhost:8080/users/search?keyword=张&pageNum=1&pageSize=5
```

---

### **七、总结**

- **MyBatis 分页**：手动编写 SQL，适合对 SQL 有特殊定制需求的场景。
- **MyBatis-Plus 分页**：配置插件 + 调用 `selectPage`，代码简洁，适合快速开发。
- **选择建议**：优先使用 MyBatis-Plus，除非有特殊分页需求。
