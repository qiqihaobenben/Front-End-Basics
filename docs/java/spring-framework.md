# Spring Framework

Spring 框架有两个最核心概念： IoC 和 AOP。

## IoC

Inverse of Control 的简写，译为“控制反转”，指把创建对象过程交给 Spring 进行管理。

## AOP

Aspect Oriented Programming 的简写，译为“面向切面编程”。AOP 用来封装多个类的公共行为，将那些与业务无关，却为业务模块所共同调用的逻辑封装起来，减少系统的重复代码，降低模块间的耦合度。另外，AOP 还解决一些系统层面上的问题，比如日志、事务、权限等。

## 模块

### 1、Spring Core Container （核心容器）

spring core 提供了 IOC,DI,Bean 配置装载创建的核心实现。核心概念： Beans、BeanFactory、BeanDefinitions、ApplicationContext。

- spring-core ：IOC 和 DI 的基本实现
- spring-beans：BeanFactory 和 Bean 的装配管理(BeanFactory)
- spring-context：Spring context 上下文，即 IOC 容器(AppliactionContext)
- spring-expression：spring 表达式语言

### 2、Spring AOP

- spring-aop：面向切面编程的应用模块，整合 ASM，CGLib，JDK Proxy
- spring-aspects：集成 AspectJ，AOP 应用框架
- spring-instrument：动态 Class Loading 模块

### 3、Spring Data Access

- spring-jdbc：spring 对 JDBC 的封装，用于简化 jdbc 操作
- spring-orm：java 对象与数据库数据的映射框架
- spring-oxm：对象与 xml 文件的映射框架
- spring-jms： Spring 对 Java Message Service(java 消息服务)的封装，用于服务之间相互通信
- spring-tx：spring jdbc 事务管理

### 4、Spring Web

- spring-web：最基础的 web 支持，建立于 spring-context 之上，通过 servlet 或 listener 来初始化 IOC 容器
- spring-webmvc：实现 web mvc
- spring-websocket：与前端的全双工通信协议
- spring-webflux：Spring 5.0 提供的，用于取代传统 java servlet，非阻塞式 Reactive Web 框架，异步，非阻塞，事件驱动的服务

### 5、Spring Message

Spring-messaging：spring 4.0 提供的，为 Spring 集成一些基础的报文传送服务

### 6、Spring test

spring-test：集成测试支持，主要是对 junit 的封装

## 注解

在 Spring 框架中，注解（Annotation）是开发的核心工具之一，它们简化了配置并提高了代码的可读性。

---

### 一、核心注解（Bean 定义与装配）

1. **`@Component`**

   - **作用**：通用的组件注解，标记一个类为 Spring 组件（Bean），使其被自动扫描并注册到容器中。
   - **示例**：
     ```java
     @Component
     public class UserService {
         // 业务逻辑
     }
     ```

2. **`@Repository`**

   - **作用**：标记数据访问层（DAO）的组件，是 `@Component` 的特化版本，支持异常转换（如将 SQL 异常转为 Spring 的 `DataAccessException`）。
   - **示例**：
     ```java
      @Repository
      public class UserRepositoryImpl implements UserRepository {
          @Override
          public User findById(Long id) {
              // 数据库操作实现
              return jdbcTemplate.queryForObject("...", User.class);
          }
      }
     ```

3. **`@Service`**

   - **作用**：标记业务逻辑层（Service）的组件，通常包含业务逻辑，是 `@Component` 的特化版本。
   - **示例**：
     ```java
      @Service
      public class UserServiceImpl implements UserService {
          @Override
          public User findById(Long id) {
              // 业务逻辑实现
              return userRepository.findById(id);
          }
      }
     ```

4. **`@Controller`**

   - **作用**：标记 Web 控制层（Controller）的组件，处理 HTTP 请求。
   - **示例**：
     ```java
     @Controller
     public class UserController {
         @GetMapping("/users")
         public String listUsers() {
             return "users";
         }
     }
     ```

5. **`@Autowired`**

   - **作用**：自动注入依赖，支持构造器注入、字段注入、方法注入。
   - **示例**（构造器注入）：

     ```java
     @Service
     public class OrderService {
         private final UserRepository userRepository;

         @Autowired
         public OrderService(UserRepository userRepository) {
             this.userRepository = userRepository;
         }
     }
     ```

#### @Autowired 的运行原理

@Autowired 是 Spring 框架中的一个核心注解，用于实现依赖注入（Dependency Injection）。其运行原理如下：

1. **Bean 扫描**：

   - Spring 容器启动时，会扫描带有@Component、@Service、@Controller 等注解的类，将它们注册为 Bean

2. **依赖检测**：

   - Spring 接着会查找所有标记了@Autowired 注解的字段、方法或构造函数

3. **类型匹配**：

   - 对于每个@Autowired 注解的字段，Spring 会在容器中查找与该字段类型匹配的 Bean
   - 首先根据类型查找（byType），如果找到多个匹配项，则根据名称（byName）进一步匹配

4. **依赖注入**：
   - 找到匹配的 Bean 后，Spring 会将其注入到对应的字段中
   - 这个过程发生在 Bean 初始化阶段，早于用户代码执行

#### @Autowired(required = false)的含义

`@Autowired(required = false)`表示该依赖是可选的，具体来说：

1. **默认情况下**：

   - `@Autowired`的`required`属性默认为`true`
   - 如果 Spring 找不到匹配的 Bean，会抛出异常，导致应用启动失败

2. **当设置 required=false 时**：

   - 如果 Spring 找不到匹配的 Bean，不会抛出异常
   - 相应的字段将保持为`null`
   - 应用需要在使用该字段前检查其是否为`null`

3. **使用场景**：
   - 当某个功能是可选的，不是应用运行的必要条件时
   - 当依赖的可用性取决于环境或配置时（如本例中的条件化配置）
   - 当需要根据依赖是否存在来采取不同的行动时

---

### 二、配置相关注解

6. **`@Configuration`**

   - **作用**：标记类为配置类，替代 XML 配置文件。
   - **示例**：
     ```java
     @Configuration
     public class AppConfig {
         @Bean
         public DataSource dataSource() {
            // 创建并配置数据源
             return new HikariDataSource();
         }
     }
     ```

7. **`@Bean`**

   - **作用**：在配置类中定义 Bean，方法返回的对象由 Spring 容器管理。
   - **示例**：
     ```java
     @Configuration
     public class AppConfig {
         @Bean
         public RestTemplate restTemplate() {
             return new RestTemplate();
         }
     }
     ```

8. **`@ComponentScan`**
   - **作用**：自动扫描指定包下的组件（`@Component`, `@Service` 等）。
   - **示例**：
     ```java
     @Configuration
     @ComponentScan("com.example")
     public class AppConfig {}
     ```

---

### 三、Web 开发相关注解

9. **`@RestController`**

   - **作用**：结合 `@Controller` 和 `@ResponseBody`，用于返回 JSON/XML 数据的 RESTful 控制器。
   - **示例**：
     ```java
     @RestController
     public class UserController {
         @GetMapping("/api/users")
         public List<User> getUsers() {
             return userService.findAll();
         }
     }
     ```

10. **`@RequestMapping`**

    - **作用**：映射 HTTP 请求到控制器方法，可指定路径、HTTP 方法等。
    - **示例**：
      ```java
      @RestController
      @RequestMapping("/api")
      public class UserController {
          @RequestMapping(value = "/users", method = RequestMethod.GET)
          public List<User> getUsers() { /* ... */ }
      }
      ```

11. **`@GetMapping`, `@PostMapping` 等**

    - **作用**：简化的 `@RequestMapping` 特化注解，如 `@GetMapping("/path")` 等价于 `@RequestMapping(value="/path", method=GET)`。
    - **示例**：
      ```java
      @GetMapping("/users/{id}")
      public User getUserById(@PathVariable Long id) {
          return userService.findById(id);
      }
      ```

12. **`@PathVariable` 和 `@RequestParam`**
    - **作用**：
      - `@PathVariable`：绑定 URL 路径中的变量到方法参数。
      - `@RequestParam`：绑定请求参数到方法参数。
    - **示例**：
      ```java
      @GetMapping("/users/{id}")
      public User getUser(@PathVariable Long id, @RequestParam String name) {
          // 根据 id 和 name 查询用户
      }
      ```

---

### 四、依赖注入与条件注解

13. **`@Qualifier`**

    - **作用**：解决多个同类型 Bean 的歧义性，指定注入的 Bean 名称。
    - **示例**：
      ```java
      @Autowired
      @Qualifier("mysqlDataSource")
      private DataSource dataSource;
      ```

14. **`@Primary`**

    - **作用**：标记首选的 Bean，当存在多个同类型 Bean 时优先注入。
    - **示例**：
      ```java
      @Bean
      @Primary
      public DataSource primaryDataSource() {
          return new HikariDataSource();
      }
      ```

15. **`@Conditional`**
    - **作用**：基于条件决定是否注册 Bean（常用于自定义条件逻辑）。
    - **示例**：
      ```java
      @Bean
      @Conditional(OnProductionEnvCondition.class)
      public DataSource productionDataSource() {
          return new ProductionDataSource();
      }
      ```

---

### 五、AOP 与事务管理

16. **`@Aspect`**

    - **作用**：定义切面类，用于实现横切关注点（如日志、事务）。
    - **示例**：
      ```java
      @Aspect
      @Component
      public class LoggingAspect {
          @Before("execution(* com.example.service.*.*(..))")
          public void logMethodCall(JoinPoint joinPoint) {
              // 记录方法调用日志
          }
      }
      ```

17. **`@Transactional`**

    - **作用**：声明方法或类需要事务管理。
    - **示例**：

      ```java
      @Service
      public class OrderService {
          @Transactional
          public Order createOrder(Order order) {
              // 创建订单，此方法内的所有操作在一个事务中
              saveOrder(order);
              updateInventory(order);
              return order;
          }

          @Transactional(readOnly = true)
          public List<Order> getRecentOrders() {
              // 只读事务，适合查询操作
              return orderRepository.findRecent();
          }
      }
      ```

---

### 六、Spring Boot 相关

18. **`@SpringBootApplication`**

    - **作用**：组合注解，包含 `@Configuration`、`@ComponentScan` 和 `@EnableAutoConfiguration`，标记 Spring Boot 主类。
    - **示例**：
      ```java
      @SpringBootApplication
      public class MyApp {
          public static void main(String[] args) {
              SpringApplication.run(MyApp.class, args);
          }
      }
      ```

19. **`@Value`**
    - **作用**：注入外部属性（如 `application.properties`）的值。
    - **示例**：
      ```java
      @Service
      public class EmailService {
          @Value("${email.server.url}")
          private String emailServerUrl;
      }
      ```

---

### 七、其他重要注解

20. **`@Profile`**

    - **作用**：指定 Bean 在特定环境下生效（如 `dev`、`prod`）。
    - **示例**：
      ```java
      @Bean
      @Profile("dev")
      public DataSource devDataSource() {
          return new EmbeddedDatabaseBuilder().build();
      }
      ```

21. **`@Async`**
    - **作用**：标记方法为异步执行。
    - **示例**：
      ```java
      @Async
      public void sendAsyncEmail(String email) {
          // 异步发送邮件
      }
      ```

---

### 八、总结

以上是 Spring 5 中必须掌握的核心注解，涵盖以下场景：

- **Bean 定义与装配**：`@Component`, `@Autowired`
- **配置管理**：`@Configuration`, `@Bean`
- **Web 开发**：`@RestController`, `@GetMapping`
- **依赖注入优化**：`@Qualifier`, `@Primary`
- **AOP 与事务**：`@Aspect`, `@Transactional`
- **条件与配置**：`@Conditional`, `@Profile`

## 运行步骤和原理

### `new AnnotationConfigApplicationContext`的运行逻辑

`AnnotationConfigApplicationContext`是 Spring 框架中用于基于注解配置的应用上下文实现。当我们调用`new AnnotationConfigApplicationContext(AppConfig.class)`时，Spring 容器执行了一系列复杂的初始化步骤。下面将以通俗易懂的方式解释这个过程。

#### 基本流程概述

当执行`new AnnotationConfigApplicationContext(AppConfig.class)`时，Spring 容器会经历以下几个主要阶段：

1. 容器初始化
2. 注册配置类
3. 刷新容器
4. Bean 定义扫描和注册
5. Bean 实例化和初始化

#### 详细执行流程

#### 1. 容器初始化

```java
public AnnotationConfigApplicationContext(Class<?>... componentClasses) {
    this();  // 调用无参构造函数
    register(componentClasses);  // 注册配置类
    refresh();  // 刷新容器
}
```

首先，调用无参构造函数初始化基础设施：

```java
public AnnotationConfigApplicationContext() {
    this.reader = new AnnotatedBeanDefinitionReader(this);
    this.scanner = new ClassPathBeanDefinitionScanner(this);
}
```

这里创建了两个关键组件：

- `AnnotatedBeanDefinitionReader`：读取并解析带有注解的类
- `ClassPathBeanDefinitionScanner`：扫描类路径，查找并注册 Bean 定义

#### 2. 注册配置类

接下来，调用`register(componentClasses)`注册传入的配置类（如 AppConfig.class）：

```java
public void register(Class<?>... componentClasses) {
    for (Class<?> componentClass : componentClasses) {
        registerBean(componentClass);
    }
}
```

这一步会：

- 将 AppConfig 类本身注册为一个 Bean 定义
- 处理 AppConfig 上的注解，如`@Configuration`
- 准备后续对 AppConfig 的解析

#### 3. 刷新容器 - 核心过程

然后执行`refresh()`方法，这是整个过程中最复杂的部分：

```java
public void refresh() throws BeansException, IllegalStateException {
    synchronized (this.startupShutdownMonitor) {
        // 1. 准备刷新上下文
        prepareRefresh();

        // 2. 告诉子类刷新内部bean工厂
        ConfigurableListableBeanFactory beanFactory = obtainFreshBeanFactory();

        // 3. 准备bean工厂在上下文中使用
        prepareBeanFactory(beanFactory);

        // 4. 允许子类在标准初始化后修改bean工厂
        postProcessBeanFactory(beanFactory);

        // 5. 调用BeanFactoryPostProcessor（非常重要）
        invokeBeanFactoryPostProcessors(beanFactory);

        // 6. 注册Bean的后处理器
        registerBeanPostProcessors(beanFactory);

        // 7. 初始化消息源
        initMessageSource();

        // 8. 初始化事件多播器
        initApplicationEventMulticaster();

        // 9. 初始化特定上下文的其他特殊Bean
        onRefresh();

        // 10. 注册监听器
        registerListeners();

        // 11. 完成Bean工厂初始化（实例化所有非懒加载单例Bean）
        finishBeanFactoryInitialization(beanFactory);

        // 12. 最后一步：发布相应的事件
        finishRefresh();
    }
}
```

### 4. 关键阶段详解

#### 配置类处理（步骤 5 中发生）

在`invokeBeanFactoryPostProcessors`步骤中，`ConfigurationClassPostProcessor`会被调用，它负责：

```java
// 简化的逻辑
public void processConfigBeanDefinitions(BeanDefinitionRegistry registry) {
    // 找出所有的@Configuration类
    List<BeanDefinitionHolder> configCandidates = findConfigurationClass(registry);

    // 创建解析器并进行解析
    ConfigurationClassParser parser = new ConfigurationClassParser();
    parser.parse(configCandidates);

    // 处理配置类中的@Bean方法等
    // ...
}
```

这个过程中会：

1. 识别 AppConfig 是一个`@Configuration`类
2. 处理其上的`@ComponentScan`注解（如果有）
3. 解析`@Import`注解（如果有）
4. 处理`@Bean`方法

#### 组件扫描（基于@ComponentScan）

如果 AppConfig 类上有`@ComponentScan`注解：

```java
@Configuration
@ComponentScan("com.itranswarp.learnjava")
public class AppConfig {
    // ...
}
```

那么在上面的过程中，会执行类似这样的扫描：

```java
// 简化的扫描逻辑
public Set<BeanDefinition> doScan(String... basePackages) {
    Set<BeanDefinition> beanDefinitions = new LinkedHashSet<>();
    for (String basePackage : basePackages) {
        // 在给定的包路径中寻找候选组件
        Set<BeanDefinition> candidates = findCandidateComponents(basePackage);
        // 处理扫描到的每个组件...
        beanDefinitions.addAll(candidates);
    }
    return beanDefinitions;
}
```

这会查找带有`@Component`、`@Service`、`@Repository`、`@Controller`等注解的类。

#### 处理@Bean 方法

对于 AppConfig 中的每个`@Bean`方法：

```java
@Bean
ZoneId createZoneId() {
    return ZoneId.systemDefault();
}
```

Spring 会创建一个`BeanDefinition`：

```java
// 简化的逻辑
for (Method method : getBeanMethods(configClass)) {
    BeanDefinition beanDef = new RootBeanDefinition();
    beanDef.setFactoryBeanName(configClassName);
    beanDef.setFactoryMethodName(method.getName());
    registry.registerBeanDefinition(beanName, beanDef);
}
```

#### 处理@Conditional 和@Profile 注解

在注册 Bean 定义的过程中，会检查`@Conditional`和`@Profile`：

```java
// 简化的@Profile逻辑
public boolean matches(ConditionContext context, AnnotatedTypeMetadata metadata) {
    // 获取@Profile注解的值
    String[] profiles = metadata.getAnnotationAttributes(Profile.class.getName()).get("value");

    // 获取当前激活的profiles
    String[] activeProfiles = context.getEnvironment().getActiveProfiles();

    // 检查是否匹配
    for (String profile : profiles) {
        if (profileMatches(profile, activeProfiles)) {
            return true;
        }
    }
    return false;
}
```

根据条件结果，决定是否实际注册这个 Bean 定义。

### 5. Bean 实例化（步骤 11 中发生）

在`finishBeanFactoryInitialization`步骤中，所有非懒加载的单例 Bean 会被实例化：

```java
// 简化的逻辑
public void preInstantiateSingletons() {
    // 获取所有Bean定义的名称
    List<String> beanNames = new ArrayList<>(this.beanDefinitionNames);

    // 遍历每个bean名称
    for (String beanName : beanNames) {
        // 获取bean定义
        RootBeanDefinition bd = getMergedLocalBeanDefinition(beanName);

        // 如果是单例、非抽象、非懒加载
        if (!bd.isAbstract() && bd.isSingleton() && !bd.isLazyInit()) {
            // 创建bean实例
            getBean(beanName);
        }
    }
}
```

`getBean`过程中会：

1. 检查是否已存在实例
2. 如果没有，创建新实例
3. 处理依赖注入（解析@Autowired 等）
4. 调用初始化方法

#### 依赖注入过程

当处理`@Autowired`字段时：

```java
@Component
public class UserService {
    @Autowired
    private MailService mailService;
}
```

Spring 会执行类似这样的逻辑：

```java
// 简化的依赖注入逻辑
for (Field field : findAutowiredFields(bean.getClass())) {
    Object dependency = resolveDependency(field.getType(), beanName);
    ReflectionUtils.makeAccessible(field);
    field.set(bean, dependency);
}
```

如果是`@Autowired(required=false)`且找不到匹配的 Bean，则不会注入值（保持为 null）。

### 总结：全过程流程图

```
1. 创建容器
   |
   v
2. 注册配置类 AppConfig
   |
   v
3. 开始刷新容器
   |
   v
4. 处理 @Configuration 类
   |
   v
5. 处理 @ComponentScan (扫描组件)
   |
   v
6. 处理 @Bean 方法 (创建Bean定义)
   |
   v
7. 应用 @Conditional/@Profile 条件
   |
   v
8. 初始化Bean工厂
   |
   v
9. 实例化单例Bean
   |  \
   |   \---> 处理 @Autowired 依赖注入
   v
10. 完成容器初始化
```

这就是从`new AnnotationConfigApplicationContext(AppConfig.class)`到完整 Spring 容器启动的核心流程。整个过程设计精妙，每个步骤都有明确的职责，共同构成了 Spring 强大的 IoC 容器系统。

## applicationContext.xml 详解

在 Spring Framework 中，`applicationContext.xml` 是核心配置文件，用于定义 Bean 及其依赖关系、组件扫描、外部属性配置等。以下是对其关键配置的详细讲解及示例：

---

### **1. 基础结构**

根元素是 `<beans>`，包含命名空间和子元素 `<bean>`：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xsi:schemaLocation="
           http://www.springframework.org/schema/beans
           http://www.springframework.org/schema/beans/spring-beans.xsd
           http://www.springframework.org/schema/context
           http://www.springframework.org/schema/context/spring-context.xsd">

    <!-- 配置内容 -->
</beans>
```

---

### **2. Bean 的定义与依赖注入**

- **定义 Bean**：通过 `<bean>` 标签，指定 `id` 和 `class`。
- **依赖注入**：通过构造器（`<constructor-arg>`）或 Setter 方法（`<property>`）。

**示例**：

```xml
<!-- 定义 UserRepository -->
<bean id="userRepository" class="com.example.UserRepositoryImpl" />

<!-- 定义 UserService，注入 UserRepository -->
<bean id="userService" class="com.example.UserService">
    <!-- 构造器注入 -->
    <constructor-arg ref="userRepository" />

    <!-- Setter 注入 -->
    <property name="userRepository" ref="userRepository" />
</bean>
```

---

### **3. 组件扫描（自动注册 Bean）**

通过 `<context:component-scan>` 自动扫描并注册带有 `@Component`、`@Service` 等注解的类。

**示例**：

```xml
<context:component-scan base-package="com.example" />
```

- **作用**：自动发现 `com.example` 包下的 `@Component`、`@Service`、`@Repository` 等组件。

---

### **4. 外部属性配置**

使用 `<context:property-placeholder>` 加载外部 `.properties` 文件。

**示例**：

```xml
<!-- 加载 jdbc.properties -->
<context:property-placeholder location="classpath:jdbc.properties" />

<!-- 配置数据源 -->
<bean id="dataSource" class="org.apache.commons.dbcp2.BasicDataSource">
    <property name="driverClassName" value="${jdbc.driver}" />
    <property name="url" value="${jdbc.url}" />
    <property name="username" value="${jdbc.username}" />
    <property name="password" value="${jdbc.password}" />
</bean>
```

---

### **5. AOP 配置**

使用 `<aop:config>` 定义切面、切入点和通知。

**示例**：

```xml
<!-- 启用 AspectJ 自动代理 -->
<aop:aspectj-autoproxy />

<!-- 定义日志切面 -->
<bean id="loggingAspect" class="com.example.aop.LoggingAspect" />

<aop:config>
    <aop:aspect ref="loggingAspect">
        <!-- 定义切入点 -->
        <aop:pointcut id="serviceMethods"
            expression="execution(* com.example.service.*.*(..))" />
        <!-- 前置通知 -->
        <aop:before pointcut-ref="serviceMethods" method="logBefore" />
    </aop:aspect>
</aop:config>
```

---

### **6. 事务管理**

配置事务管理器和启用注解驱动的事务。

**示例**：

```xml
<!-- 配置事务管理器 -->
<bean id="transactionManager"
    class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
    <property name="dataSource" ref="dataSource" />
</bean>

<!-- 启用注解驱动的事务 -->
<tx:annotation-driven transaction-manager="transactionManager" />
```

---

### **7. MVC 配置**

启用注解驱动的 MVC 和视图解析器。

**示例**：

```xml
<!-- 启用 MVC 注解（如 @RequestMapping） -->
<mvc:annotation-driven />

<!-- 配置视图解析器 -->
<bean class="org.springframework.web.servlet.view.InternalResourceViewResolver">
    <property name="prefix" value="/WEB-INF/views/" />
    <property name="suffix" value=".jsp" />
</bean>
```

---

### **8. Bean 的作用域与生命周期**

- **作用域**：通过 `scope` 指定（如 `singleton`、`prototype`）。
- **生命周期方法**：通过 `init-method` 和 `destroy-method` 指定。

**示例**：

```xml
<bean id="exampleBean" class="com.example.ExampleBean"
    scope="prototype"
    init-method="init"
    destroy-method="destroy" />
```

---

### **9. 整合其他框架（如 MyBatis）**

配置 `SqlSessionFactoryBean` 和 Mapper 扫描。

**示例**：

```xml
<!-- 配置 SqlSessionFactory -->
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <property name="dataSource" ref="dataSource" />
    <property name="mapperLocations" value="classpath:mappers/*.xml" />
</bean>

<!-- 扫描 Mapper 接口 -->
<bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
    <property name="basePackage" value="com.example.mapper" />
</bean>
```

---

### **总结**

- **Bean 定义与注入**：手动或自动注册依赖。
- **组件扫描**：减少手动配置。
- **外部化配置**：灵活管理环境相关属性。
- **AOP 与事务**：实现横切关注点和声明式事务。
- **MVC 配置**：简化 Web 层开发。
- **整合第三方库**：如 MyBatis、Hibernate。

掌握这些配置，能够灵活应对大多数 Spring 应用的场景。随着 Spring Boot 的普及，许多配置已自动化，但理解 XML 配置仍是维护传统项目的关键。

### applicationContext.xml 配置示例

#### 数据库基于注解方式的声明式事务管理

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns="http://www.springframework.org/schema/beans"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx.xsd">

    <!-- 开启注解扫描 -->
    <context:component-scan base-package="com.sunxiaping"></context:component-scan>

    <!-- 导入数据库连接信息 -->
    <context:property-placeholder location="db.properties"></context:property-placeholder>

    <!-- 配置数据库连接池 -->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="driverClassName" value="${jdbc.driverClass}"></property>
        <property name="url" value="${jdbc.url}"></property>
        <property name="username" value="${jdbc.username}"></property>
        <property name="password" value="${jdbc.password}"></property>
    </bean>

    <!-- 配置jdbcTemplate -->
    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <property name="dataSource" ref="dataSource"></property>
    </bean>

    <!-- 配置事务管理器 -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <!-- 注入数据源 -->
        <property name="dataSource" ref="dataSource"></property>
    </bean>

    <!-- 开启事务注解 -->
    <tx:annotation-driven transaction-manager="transactionManager"/>
</beans>

```

#### 数据库基于 xml 方式的声明式事务管理

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:context="http://www.springframework.org/schema/context"
       xmlns:aop="http://www.springframework.org/schema/aop"
       xmlns="http://www.springframework.org/schema/beans"
       xmlns:tx="http://www.springframework.org/schema/tx"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        http://www.springframework.org/schema/beans/spring-beans.xsd
        http://www.springframework.org/schema/context
        http://www.springframework.org/schema/context/spring-context.xsd
        http://www.springframework.org/schema/aop
        http://www.springframework.org/schema/aop/spring-aop.xsd
        http://www.springframework.org/schema/tx
        http://www.springframework.org/schema/tx/spring-tx.xsd">

    <!-- 开启注解扫描 -->
    <context:component-scan base-package="com.sunxiaping"></context:component-scan>

    <!-- 导入数据库连接信息 -->
    <context:property-placeholder location="db.properties"></context:property-placeholder>

    <!-- 配置数据库连接池 -->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">
        <property name="driverClassName" value="${jdbc.driverClass}"></property>
        <property name="url" value="${jdbc.url}"></property>
        <property name="username" value="${jdbc.username}"></property>
        <property name="password" value="${jdbc.password}"></property>
    </bean>

    <!-- 配置jdbcTemplate -->
    <bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">
        <property name="dataSource" ref="dataSource"></property>
    </bean>

    <!-- 配置事务管理器 -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <!-- 注入数据源 -->
        <property name="dataSource" ref="dataSource"></property>
    </bean>

    <!-- 配置通知 -->
    <tx:advice id="txAdvice">
        <!-- 配置事务参数 -->
        <tx:attributes>
            <!-- 指定那种规则的方法上面添加事务 -->
            <tx:method name="add*"/>
            <tx:method name="update*"/>
            <tx:method name="delete*"/>
        </tx:attributes>
    </tx:advice>

    <!-- 配置切入点和切面 -->
    <aop:config>
        <!-- 配置切入点 -->
        <aop:pointcut id="pointcut" expression="execution(* com.sunxiaping.service.impl.AccountServiceImpl.*(..))"/>
        <!-- 配置切面 -->
        <aop:advisor advice-ref="txAdvice" pointcut-ref="pointcut"></aop:advisor>
    </aop:config>

</beans>

```

## AOP 实战

### 1. 什么是 AOP？

AOP（Aspect-Oriented Programming）是一种编程范式，通过预编译方式和运行期动态代理实现程序功能的统一维护的一种技术。

### 2. 为什么需要 AOP？

- 横切关注点：如日志、事务、安全等，这些关注点在业务逻辑中分散，但需要统一管理。
- 代码冗余：重复的代码，如日志记录、异常处理等。
- 可维护性：通过切面分离关注点，提高代码可维护性。

### 3. AOP 术语

- 切面（Aspect）：一个类，包含通知（Advice）和切入点（Pointcut）。
- 通知（Advice）：也叫做增强，在切面中定义的方法，包含前置通知、后置通知、环绕通知、异常通知和最终通知。
- 切入点（Pointcut）：一个表达式，用于匹配方法。
- 代理（Proxy）：通过 JDK 动态代理或 CGLIB 生成的一个对象，用于实现切面的功能。
- Target Object：目标对象，即真正执行业务的核心逻辑对象；
- AOP Proxy：AOP 代理，是客户端持有的增强后的对象引用。

### 4. AOP 示例

```java

package com.sunxiaping;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.*;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

/**
 * 增强的类
 */
@Component
@Aspect //生成代理对象
@Order(1) //在多个增强类对同一个方法进行增强，设置增强类的优先级，@Order中的value属性值越小优先级越高
public class UserAspect {
    /**
     * 切入点表达式
     */
    @Pointcut("execution(* com.sunxiaping.User.add(..))")
    public void pointcut() {
    }

    /**
     * 前置通知
     */
    @Before(value = "pointcut()")
    public void beforeAdd() {
        System.out.println("before add ...");
    }

    /**
     * 后置通知
     */
    @AfterReturning(value = "pointcut()", returning = "obj")
    public void afterReturningAdd(Object obj) {
        System.out.println("afterReturning add ..." + obj);
    }


    /**
     * 环绕通知
     */
    @Around(value = "pointcut()")
    public void aroundAdd(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
        System.out.println("环绕之前");
        proceedingJoinPoint.proceed();
        System.out.println("环绕之后");
    }

    /**
     * 异常通知
     */
    @AfterThrowing(value = "pointcut()", throwing = "ex")
    public void afterThrowingAdd(Exception ex) {
        System.out.println("afterThrowing add ..." + ex);
    }

    /**
     * 最终通知
     */
    @After(value = "pointcut()")
    public void afterAdd() {
        System.out.println("after add ...");
    }
}

```

---

#### **1. 代码解析**

##### **（1）类定义部分**

```java
@Component
@Aspect
@Order(1)
public class UserAspect { ... }
```

- **`@Component`**：
  将该类标记为 Spring 管理的 Bean，确保 Spring 能扫描到切面。
- **`@Aspect`**：
  声明这是一个切面类，Spring 会识别其中的通知（Advice）和切入点（Pointcut）。
- **`@Order(1)`**：
  定义切面的优先级。当多个切面作用于同一方法时，数值越小优先级越高（例如 `@Order(1)` 的切面会比 `@Order(2)` 的先执行）。

---

##### **（2）切入点定义**

```java
@Pointcut("execution(* com.sunxiaping.User.add(..))")
public void pointcut() {}
```

- **作用**：
  定义一个可重用的切入点表达式，名为 `pointcut()`。后续通知方法可以直接引用 `pointcut()`。
- **表达式详解**：
  `execution(* com.sunxiaping.User.add(..))` 表示匹配 `User` 类的 `add` 方法，任意参数列表和返回类型。

---

##### **（3）通知类型**

**① 前置通知（`@Before`）**

```java
@Before(value = "pointcut()")
public void beforeAdd() {
    System.out.println("before add ...");
}
```

- **执行时机**：
  目标方法执行前触发。
- **用途**：
  日志记录、权限校验、参数预处理等。

---

**② 后置通知（`@AfterReturning`）**

```java
@AfterReturning(value = "pointcut()", returning = "obj")
public void afterReturningAdd(Object obj) {
    System.out.println("afterReturning add ..." + obj);
}
```

- **执行时机**：
  目标方法 **正常执行完成** 后触发（无异常抛出）。
- **`returning = "obj"`**：
  获取目标方法的返回值，通过参数 `Object obj` 接收。

---

**③ 环绕通知（`@Around`）**

```java
@Around(value = "pointcut()")
public void aroundAdd(ProceedingJoinPoint proceedingJoinPoint) throws Throwable {
    System.out.println("环绕之前");
    proceedingJoinPoint.proceed(); // 执行目标方法
    System.out.println("环绕之后");
}
```

- **执行时机**：
  完全控制目标方法的执行，可以在方法执行前后插入逻辑，甚至可以阻止方法执行。
- **`ProceedingJoinPoint`**：
  必须调用 `proceed()` 方法让目标方法继续执行，否则目标方法不会执行。
- **功能最强大**：
  可以修改参数、返回值，或处理异常。

---

**④ 异常通知（`@AfterThrowing`）**

```java
@AfterThrowing(value = "pointcut()", throwing = "ex")
public void afterThrowingAdd(Exception ex) {
    System.out.println("afterThrowing add ..." + ex);
}
```

- **执行时机**：
  目标方法 **抛出异常** 后触发。
- **`throwing = "ex"`**：
  捕获抛出的异常，通过参数 `Exception ex` 接收。

---

**⑤ 最终通知（`@After`）**

```java
@After(value = "pointcut()")
public void afterAdd() {
    System.out.println("after add ...");
}
```

- **执行时机**：
  目标方法执行结束后触发（无论是否抛出异常），类似 `finally` 块。
- **用途**：
  资源清理（如关闭文件、释放锁）。

---

#### **2. 通知执行顺序**

当所有通知同时作用时，执行顺序如下（假设无异常）：

1. **`@Around` 前半部分** → 2. **`@Before`** → 3. **目标方法** → 4. **`@Around` 后半部分** → 5. **`@AfterReturning`** → 6. **`@After`**

若目标方法抛出异常，执行顺序为：

1. **`@Around` 前半部分** → 2. **`@Before`** → 3. **目标方法抛出异常** → 4. **`@AfterThrowing`** → 5. **`@After`**

---

### **`execution` 表达式详解**

#### **语法结构**

```
execution([权限修饰符] [返回类型] [类全路径].[方法名]([参数列表]) [throws 异常])
```

- **权限修饰符**：`public`、`protected`、`private`、`*`（任意）。
- **返回类型**：具体类型（如 `int`、`String`）或 `*`（任意）。
- **类全路径**：类的完整包路径，支持通配符（如 `com.example.*`）。
- **方法名**：具体方法名或通配符（如 `add*` 匹配 `addUser`、`addOrder`）。
- **参数列表**：
  - `()`：无参数
  - `(int)`：一个 int 参数
  - `(..)`：任意参数（0 个或多个）
  - `(String, *)`：第一个参数为 String，第二个任意类型

---

#### **示例**

##### **示例 1：匹配所有 public 方法**

```java
execution(public * com.example.service.*.*(..))
```

- **解释**：
  匹配 `com.example.service` 包下所有类的 public 方法，返回类型和参数任意。

---

##### **示例 2：匹配特定返回类型的方法**

```java
execution(String com.example.dao.UserDao.get*(..))
```

- **解释**：
  匹配 `UserDao` 类中返回类型为 `String` 且方法名以 `get` 开头的方法，参数任意。

---

##### **示例 3：匹配无参数方法**

```java
execution(* com.example.utils.StringUtil.isEmpty())
// 上下效果相同
execution(* * com.example.utils.StringUtil.isEmpty())
```

- **解释**：
  匹配 `StringUtil` 类的 `isEmpty` 方法，无参数，返回类型任意。

---

##### **示例 4：匹配包下所有类的所有方法**

```java
execution(* com.example..*.*(..))
```

- **解释**：
  匹配 `com.example` 包及其子包下所有类的所有方法。

---

##### **示例 5：匹配特定异常抛出的方法**

```java
execution(* com.example.service.OrderService.*(..) throws IOException)
```

- **解释**：
  匹配 `OrderService` 类中所有声明抛出 `IOException` 的方法。

---

### **其他切入点指示符**

- **`within`**：匹配类或包下的所有方法。
  ```java
  within(com.example.service.*) // 匹配 service 包下所有类的方法
  ```
- **`@annotation`**：匹配带有指定注解的方法。
  ```java
  @annotation(com.example.anno.Log) // 匹配被 @Log 注解标记的方法
  ```
- **`args`**：匹配参数类型符合条件的方法。
  ```java
  args(java.lang.String, *) // 匹配第一个参数为 String，第二个参数任意的所有方法
  ```

#### 复杂切入点指示符

```java
@Pointcut("execution(* com.example.service.*.*(..)) && @annotation(com.example.anno.Log)")
public void pointcut() {}
```

---

### **5. AOP 实现原理**

- **JDK 动态代理**：基于接口生成代理类（要求目标类实现接口）。
- **CGLIB 动态代理**：通过继承目标类生成子类代理（适用于无接口的类）。
- **Spring AOP 默认策略**：
  - 如果目标类实现了接口 → 使用 JDK 动态代理。
  - 如果目标类未实现接口 → 使用 CGLIB。

---

### **总结**

- **AOP 核心**：通过动态代理实现横切关注点的模块化管理。
- **关键注解**：`@Aspect`、`@Pointcut`、`@Before`/`@After`/`@Around` 等。
- **切入点表达式**：灵活使用 `execution` 语法匹配目标方法。
- **适用场景**：日志、事务、权限校验、性能监控等与业务逻辑解耦的功能。

## @Controller、@Service、@Repository、@Component 这四个注释都可以生成 Bean 实例，他们有什么相同点和不同点？

@Controller、@Service、@Repository 是 @Component 的特化注解，它们都继承了 @Component 注解，并提供了额外的语义和功能。

---

### **相同点**

1. **Bean 自动注册**：
   四个注解均会被 Spring 的组件扫描机制（`<context:component-scan>` 或 `@ComponentScan`）自动识别，并将类实例化为 Bean，纳入 Spring 容器管理。
2. **依赖注入支持**：
   标记这些注解的类可以通过 `@Autowired` 或构造函数注入其他 Bean。
3. **语义化注解**：
   均属于 Spring 的“模式注解”（Stereotype Annotations），用于分层架构中标识不同角色的组件。

---

### **不同点**

| 注解          | 定位层次   | 核心作用                                                                | 特殊行为                                                           |
| ------------- | ---------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `@Component`  | 通用组件层 | 标记任何需要 Spring 管理的组件（不属于其他三层时使用）。                | 无特殊行为，仅注册为 Bean。                                        |
| `@Controller` | Web 层     | 处理 HTTP 请求，返回视图或 REST 数据（结合 `@RequestMapping` 使用）。   | Spring MVC 会为 `@Controller` 类生成代理，支持请求映射和视图解析。 |
| `@Service`    | 业务逻辑层 | 封装业务逻辑，协调多个数据访问操作（如调用多个 `@Repository`）。        | 无特殊行为，但通常用于声明式事务（结合 `@Transactional`）。        |
| `@Repository` | 数据访问层 | 封装数据库操作（如 CRUD），通常与 ORM 框架（如 JPA、MyBatis）结合使用。 | **自动转换数据访问异常**为 Spring 的 `DataAccessException` 体系。  |

---

### **使用场景**

#### 1. `@Component`

- **场景**：
  任何不属于 `@Controller`、`@Service`、`@Repository` 的通用组件，例如工具类、配置类、第三方库适配类。
- **示例**：
  一个自定义的密码加密工具类。
  ```java
  @Component
  public class PasswordEncoder {
      public String encode(String rawPassword) {
          // 加密逻辑
          return encryptedPassword;
      }
  }
  ```

#### 2. `@Controller`

- **场景**：
  Web 层的请求处理，如 MVC 控制器或 RESTful API 端点。
- **示例**：
  处理用户登录请求的控制器。

  ```java
  @Controller
  public class UserController {
      @Autowired
      private UserService userService;

      @PostMapping("/login")
      public String login(@RequestParam String username, @RequestParam String password) {
          boolean isValid = userService.validateUser(username, password);
          return isValid ? "dashboard" : "login-error";
      }
  }
  ```

#### 3. `@Service`

- **场景**：
  业务逻辑的封装，例如订单处理、用户权限验证等需要事务管理的操作。
- **示例**：
  用户服务类，协调用户数据和权限验证。

  ```java
  @Service
  public class UserService {
      @Autowired
      private UserRepository userRepository;

      @Transactional
      public boolean validateUser(String username, String password) {
          User user = userRepository.findByUsername(username);
          return user != null && user.getPassword().equals(password);
      }
  }
  ```

#### 4. `@Repository`

- **场景**：
  数据库访问操作，如通过 JPA 或 MyBatis 操作数据表。
- **示例**：
  JPA 实现的用户数据访问类。
  ```java
  @Repository
  public interface UserRepository extends JpaRepository<User, Long> {
      User findByUsername(String username);
  }
  ```

---

### **为什么需要区分这些注解？**

1. **代码可读性**：
   通过注解明确类的职责（如 `@Controller` 表示处理 HTTP 请求），提高代码可维护性。
2. **框架支持**：
   - `@Repository` 自动转换原生异常（如 JDBC 的 `SQLException`）为 Spring 的 `DataAccessException`。
   - `@Controller` 支持 Spring MVC 的请求映射和视图解析。
3. **AOP 与事务管理**：
   结合 `@Transactional`，可以在 `@Service` 层统一管理事务边界。

---

### 再展开讲讲

#### **@Component 的主要作用与功能**

- **作用**：
  `@Component` 是 Spring 的核心注解，用于标记类为 Spring 容器管理的组件。它的主要目的是通过**组件扫描**自动检测并注册 Bean 到 Spring 应用上下文中。

- **功能**：
  1. **自动扫描与注册**：被 `@Component` 注解的类会被 Spring 的组件扫描机制识别并实例化为 Bean。
  2. **依赖注入支持**：通过 `@Autowired` 等注解，实现 Bean 的自动装配。
  3. **通用性**：适用于任何需要 Spring 管理的组件，没有特定层次或角色限制。

---

#### **@Controller 的作用、功能与区别**

- **作用**：
  专用于 **Web 层（表现层）**，标识类为 Spring MVC 的控制器，处理 HTTP 请求和响应。

- **功能**：

  1. **路由映射**：结合 `@RequestMapping`、`@GetMapping` 等注解定义请求路径与方法的映射。
  2. **视图解析**：支持返回视图名称（如 JSP、Thymeleaf 模板）或 RESTful 数据（配合 `@ResponseBody`）。
  3. **参数绑定**：自动将请求参数、路径变量绑定到方法参数（如 `@RequestParam`, `@PathVariable`）。

- **与 @Component 的区别**：
  - `@Controller` 是 `@Component` 的特化，专为 Web 层设计。
  - 在 Spring MVC 中，`@Controller` 会被 `DispatcherServlet` 特殊处理，用于生成请求映射的处理器链。
  - 语义上更清晰，表明类的职责是处理用户交互和请求。

---

#### **@Service 的作用、功能与区别**

- **作用**：
  专用于 **业务逻辑层（服务层）**，标识类为业务逻辑的封装，通常包含复杂业务规则和事务管理。

- **功能**：

  1. **事务管理**：结合 `@Transactional` 注解实现声明式事务（如数据库操作的原子性）。
  2. **业务逻辑封装**：协调多个数据访问层（DAO）操作，提供高层次的业务接口。

- **与 @Component 的区别**：
  - `@Service` 是 `@Component` 的特化，语义上明确类的角色是服务层组件。
  - 功能上无本质差异（Spring 未对 `@Service` 添加额外逻辑），但代码可读性和架构分层更清晰。

---

#### **@Repository 的作用、功能与区别**

- **作用**：
  专用于 **数据访问层（持久层）**，标识类为数据访问对象（DAO），负责数据库操作。

- **功能**：

  1. **异常转换**：自动将底层数据库异常（如 JDBC 的 `SQLException`）转换为 Spring 的 `DataAccessException`，实现与具体数据库技术的解耦。
  2. **持久化支持**：与 JPA、Hibernate 等 ORM 框架集成，简化数据访问代码。

- **与 @Component 的区别**：
  - `@Repository` 是 `@Component` 的特化，专为数据访问层设计。
  - 唯一具有**额外功能**的注解（异常转换），通过 Spring 的 `PersistenceExceptionTranslationPostProcessor` 实现。
  - 语义上表明类负责数据访问，与 ORM 框架或 SQL 操作相关。

## Spring 数据库

### 1. JDBC 和 JPA 的区别

- 不同标准：jdbc 是数据库的统一接口标准；jpa 是 orm 框架的统一接口标准。
- 用法区别：jdbc 更注重数据库，orm 则更注重于 java 代码，但是实际上 jpa 实现的框架底层还是用 jdbc 去和数据库打交道。

### 2. JDBC（Java DataBase Connectivity）

是 java 连接数据库操作的原生接口。JDBC 对 Java 程序员而言是 API，为数据库访问提供标准的接口。由各个数据库厂商及第三方中间件厂商依照 JDBC 规范为数据库的连接提供的标准方法。

- 优点：运行速度最快，所有操作数据库的技术底层都是 jdbc 写的
- 缺点：重复代码多，耦合性高，开发效率低，更换数据库比较繁琐

### 3. ORM（Object-Relational Mapping）

对象关系映射。简单的说：ORM 就是建立实体类和数据库表之间的关系，从而达到操作实体类就相当于操作数据库表的目的。

- 优点：减少重复性代码。
- 常见的 orm 框架有：
  - Hibernate
  - spring data jpa
  - open jpa

#### Hibernate

Hibernate 是一个开源的对象关系映射框架，它对 JDBC 进行了非常轻量级的对象封装，它将 POJO 与数据库表建立映射关系，是一个全自动的 orm 框架，hibernate 可以自动生成 SQL 语句，自动执行，使得 Java 程序员可以使用面向对象的思维来操纵数据库。是一种 JPA 实现。

### 4. JPA（Java Persistence API）

Java 对象持久化的 API。是 SUN 公司推出的一套基于 ORM 的规范，通过注解或者 XML 描述【对象-关系表】之间的映射关系，并将实体对象持久化到数据库中。JPA 规范本质上就是一种 ORM 规范，注意不是 ORM 框架——因为 JPA 并未提供 ORM 实现，它只是制订了一些规范，提供了一些编程的 API 接口，但具体实现则由服务厂商来提供实现。JPA 是为了让面向对象设置的，为了不写 sql 语句而设置的。

- 优点：数据库移植快，一级二级缓存，查询，提高性能（ehcache 框架实现缓存）
- 缺点：查询所有的时候，find 性能无法控制，无法干预 sql 语句的生成，对 sql 语句要求高的话

### 5. 多个数据访问框架区别

- Hibernate：是 JPA 的一种实现，是一个框架
- Spring Data JPA：对 JPA 规范的再次抽象，底层使用 Hibernate 实现
- Spring Data JDBC： jdbcTemplate 模板数据库简化对数据库的操作，相比传统 JDBC 而言省去了，数据库驱动，连接等无关配置，只需要写 sql，设置参数
- Mybatis：是一个持久化框架，但不完全是一个 orm 框架，不是依照的 jpa 规范，它需要写 sql 语句，半 ORM。

### 图解

[图解 Java JDBC 和 JPA 的区别](https://zhuanlan.zhihu.com/p/504680805)

## [Spring 5 详细示例](https://www.cnblogs.com/xuweiweiwoaini/p/13660065.html)
