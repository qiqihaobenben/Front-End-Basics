# Spring Boot 相关

## 使用 Spring Initializr 创建的 Spring Boot 项目结构

Spring Initializr 创建的项目结构是典型的 Maven 项目结构：

- 应用的源码放到了 `src/main/java` 目录下。
- 应用的非 Java 源码的资源文件放到了 `src/main/resources` 目录下。
- 应用的测试代码放到了 `src/test/java` 目录下。
- 应用的测试资源文件放到了 `src/test/resources` 目录下。

### 项目结构

- mvnw 和 mvnw.cmd ： 是 Maven 包装器（wrapper）脚本，用于在未安装 Maven 的机器上运行 Maven。
- pom.xml ： 是 Maven 的配置文件，用于管理项目的依赖、插件、构建等。
- src/test/resources
  - application.properties ： 是 Spring Boot 的配置文件，用于配置应用的属性。
  - static ： 是静态资源文件夹，可以存放任意为浏览器提供服务的静态内容（图片、css、js 等），该初始文件夹为空
  - templates ： 是模板文件夹，可以存放任意为浏览器提供服务的模板内容（html、freemarker、thymeleaf 等），该初始文件夹为空

## Spring 框架的组件扫描和自动装配，与 Spring Boot 的自动配置区别

## 1. 组件扫描（Component Scanning）

- **是什么？** Spring 框架的核心功能之一，用于**自动发现**并注册应用程序上下文中的 Bean 定义（`BeanDefinition`）。
- **解决的问题：** 避免在 XML 配置文件或 Java 配置类中手动、显式地声明每一个 Bean（如`@Bean`方法或``标签）。
- **如何工作？**
  - 你使用注解（通常是`@ComponentScan`或其变体`@SpringBootApplication`中包含的`@ComponentScan`）指定一个或多个基础包（base packages）。
  - Spring 容器（`ApplicationContext`）启动时，会扫描这些基础包及其子包下的所有类。
  - 查找带有特定**构造型注解（Stereotype Annotations）** 的类，如：
    - `@Component` (通用组件)
    - `@Service` (服务层)
    - `@Repository` (数据访问层)
    - `@Controller` / `@RestController` (Web 控制层)
    - `@Configuration` (配置类本身也会被扫描并处理)
  - 为找到的每个符合条件的类创建一个`BeanDefinition`，并将其注册到 Spring 的 Bean 工厂（`BeanFactory`）中。这些 Bean 默认的 bean 名称是类名首字母小写。
- **底层原理关键点：**
  - **`ClassPathScanningCandidateComponentProvider`:** 这是执行扫描的核心类。
  - **资源模式解析：** 根据基础包路径，解析成类路径资源模式（如`classpath*:com/example/**/*.class`）。
  - **元数据读取：** 使用`MetadataReaderFactory`（通常是`CachingMetadataReaderFactory`）和`MetadataReader`（通常是`SimpleMetadataReader`，基于 ASM 字节码库）来读取类的元数据（注解、接口等），**避免加载类本身**，提高效率和避免早期类加载问题。
  - **`TypeFilter`:** 使用`AnnotationTypeFilter`（检查`@Component`等注解）和其他可能的过滤器来决定一个类是否应被视为候选组件。
  - **注册：** 扫描到的候选类通过`BeanDefinitionRegistry`（通常是`GenericApplicationContext`或`AnnotationConfigApplicationContext`内部实现）注册为`BeanDefinition`（通常是`ScannedGenericBeanDefinition`）。
- **触发时机：** 在 Spring 应用上下文**刷新（refresh）** 的早期阶段，特别是`ConfigurationClassPostProcessor`处理`@Configuration`类时，会处理`@ComponentScan`注解。

## 📌 2. 自动装配（Autowiring）

- **是什么？** Spring 框架的核心依赖注入（DI）功能，用于**自动满足**一个 Bean 对其他 Bean 的依赖关系。
- **解决的问题：** 避免手动编写代码（如在 XML 中使用``或在Java配置中显式调用`getBean()`）来查找和设置 Bean 之间的依赖。
- **如何工作？** 你可以在字段、构造方法、Setter 方法或普通方法参数上使用`@Autowired`注解（或`@Inject`/`@Resource`）。Spring 容器在创建 Bean 并填充其属性时：
  - 根据类型（`byType`）或名称（`byName`，需结合`@Qualifier`）在容器中查找匹配的候选 Bean。
  - 如果找到一个匹配项，则将其注入（赋值）到目标位置。
  - 如果找到多个匹配项（相同类型的多个 Bean），需要`@Qualifier`指定名称或使用`@Primary`标记首选 Bean，否则会报`NoUniqueBeanDefinitionException`。
  - 如果找不到匹配项且依赖是必需的（`@Autowired(required=true)`，默认），则报`NoSuchBeanDefinitionException`。
- **底层原理关键点：**
  - **`AutowiredAnnotationBeanPostProcessor`:** 这是实现`@Autowired`和`@Value`功能的核心`BeanPostProcessor`。
  - **后处理阶段：** 在 Bean 实例化之后、初始化（`init-method`/`@PostConstruct`）之前，`BeanPostProcessor.postProcessProperties()`方法会被调用。
  - **依赖解析：** 该方法会检查 Bean 实例的字段、方法和构造器上的`@Autowired`等注解。
  - **依赖查找：** 对于每个需要注入的点，使用`DefaultListableBeanFactory.findAutowireCandidates()`等方法在容器中查找匹配的候选 Bean。
  - **依赖注入：**
    - **字段注入：** 通过反射`Field.set(Object obj, Object value)`直接设置字段值。
    - **方法注入：** 通过反射`Method.invoke(Object obj, Object... args)`调用 Setter 方法或任意配置方法。
    - **构造器注入：** 在 Bean**实例化**阶段就通过解析构造器参数完成（由`ConstructorResolver`处理）。
  - **`DependencyDescriptor`:** 封装了需要注入的依赖信息（类型、注解、是否必需等）。
- **触发时机：** 发生在 Spring 容器创建单个 Bean 的生命周期中的**依赖注入阶段**（在实例化之后，初始化之前）。

## 📌 3. Spring Boot 自动配置（Auto-configuration）

- **是什么？** Spring Boot 的核心魔法，用于**基于类路径、已存在的 Bean 定义和其他条件，自动配置**Spring 应用程序上下文。
- **解决的问题：** 极大地简化了 Spring 应用的配置，消除了大量样板配置代码（如手动配置 DataSource、TransactionManager、MVC 视图解析器等）。实现"约定优于配置"。
- **如何工作？**
  - Spring Boot 在启动时（通过`SpringApplication.run()`）会加载`META-INF/spring.factories`文件（特别是`org.springframework.boot.autoconfigure.EnableAutoConfiguration`键）中列出的**自动配置类**（`XXXAutoConfiguration`）。
  - 这些自动配置类是标准的`@Configuration`类。
  - 类内部使用`@Bean`方法定义需要配置的组件（如`DataSource`, `EntityManagerFactory`, `RestTemplate`等）。
  - **关键：** 这些`@Bean`方法上通常带有**条件化注解（`@Conditional...`）**，例如：
    - `@ConditionalOnClass`：当类路径中存在指定的类时才生效。
    - `@ConditionalOnMissingBean`：当容器中**不存在**指定类型或名称的 Bean 时才生效（允许用户自定义覆盖）。
    - `@ConditionalOnProperty`：当指定的配置属性存在且具有特定值时才生效。
    - `@ConditionalOnWebApplication` / `@ConditionalOnNotWebApplication`：根据是否是 Web 应用决定。
  - Spring Boot 会评估所有这些条件。只有所有条件都满足的自动配置类及其`@Bean`方法才会被应用。
- **底层原理关键点：**
  - **`AutoConfigurationImportSelector`:** 核心类，实现了`DeferredImportSelector`接口。在`ConfigurationClassPostProcessor`处理`@Configuration`类时被调用。
  - **加载配置：** 使用`SpringFactoriesLoader.loadFactoryNames()`从所有 jar 包的`META-INF/spring.factories`加载`EnableAutoConfiguration`键对应的全限定类名列表。
  - **过滤和排序：** 应用`AutoConfigurationImportFilter`（基于`spring-autoconfigure-metadata.properties`或`@AutoConfigureBefore`/`@AutoConfigureAfter`）过滤掉不满足条件的候选配置类，并进行排序。
  - **条件评估：** **`ConditionEvaluator`** 是核心！它负责解析和处理自动配置类及其`@Bean`方法上的各种`@Conditional`注解。
    - `OnClassCondition`：使用`ClassLoader.loadClass()`或`ClassUtils.isPresent()`检查类路径是否存在。
    - `OnBeanCondition`：检查`BeanFactory`中是否已存在/不存在指定的 Bean（通过`BeanFactory.getBeanNamesForType()`, `BeanFactory.getBeanProvider()`等方法）。
    - `OnPropertyCondition`：检查`Environment`中的属性。
  - **注册：** 满足条件的自动配置类被当作普通的`@Configuration`类处理，由`ConfigurationClassPostProcessor`解析，其中的`@Bean`方法定义的 Bean 最终会被注册到容器中。
- **触发时机：** 在 Spring 应用上下文刷新的**配置类解析阶段**，由`ConfigurationClassPostProcessor`驱动。具体是在处理用户定义的`@Configuration`类（特别是标注了`@EnableAutoConfiguration`或`@SpringBootApplication`的类）之后，处理自动配置类。

## 🧩 总结与核心区别

| 特性             | 组件扫描 (Component Scanning)                 | 自动装配 (Autowiring)                      | Spring Boot 自动配置 (Auto-configuration)               |
| :--------------- | :-------------------------------------------- | :----------------------------------------- | :------------------------------------------------------ |
| **核心目标**     | **发现**应用自身的组件 Bean                   | **注入**Bean 之间的**依赖**                | **配置**整个应用（添加第三方或框架 Bean）               |
| **作用域**       | 应用自身定义的 Bean                           | 任何 Spring 容器管理的 Bean 之间的依赖关系 | 主要添加和配置**库/框架/基础设施**相关的 Bean           |
| **主要机制**     | 扫描类路径，查找特定注解的类并注册            | 解析`@Autowired`等注解，查找并注入依赖     | 加载条件化的`@Configuration`类，按需注册 Bean           |
| **关键注解**     | `@ComponentScan`, `@Component`等构造型注解    | `@Autowired`, `@Qualifier`, `@Primary`     | `@EnableAutoConfiguration`, `@ConditionalOnXxx`         |
| **核心处理器**   | `ClassPathScanningCandidateComponentProvider` | `AutowiredAnnotationBeanPostProcessor`     | `AutoConfigurationImportSelector`, `ConditionEvaluator` |
| **触发阶段**     | 应用上下文刷新早期（配置类解析阶段）          | Bean 实例化后、初始化前（Bean 生命周期内） | 配置类解析阶段（在用户配置之后）                        |
| **与 Boot 关系** | Spring 框架核心功能，Boot 默认启用扫描        | Spring 框架核心功能，Boot 重度依赖         | **Spring Boot 特有**的核心特性                          |

### 📌 关键区别图示

```
          +----------------------------------+
          |       Spring Boot 启动过程        |
          +----------------------------------+
                         |
                         v
          +----------------------------------+
          | 加载 META-INF/spring.factories    |
          | (获取自动配置类列表)               |
          +----------------------------------+
                         |
                         v
          +----------------------------------+
          | 处理用户 @Configuration 类        | <--- (包含 @ComponentScan)
          |  -> 触发 [组件扫描]                |      |
          |      |                            |      |
          |      v                           |      |
          |  注册用户定义的Bean (Service, Repo)|      |
          +----------------------------------+      |
                         |                           |
                         v                           v
          +----------------------------------+  +-------------------------+
          | 处理 @EnableAutoConfiguration    |  | 扫描到的用户Bean定义      |
          |  -> 触发 [自动配置]               |  | (等待后续依赖注入)         |
          |      |                          |  +-------------------------+
          |      v                          |               |
          |  评估条件(@ConditionalOnXxx)     |               |
          |      |                          |               |
          |      v (条件满足)                 |               |
          |  注册自动配置的Bean (DataSource等) |               |
          +----------------------------------+               |
                         |                                    |
                         v                                    v
          +---------------------------------------------------------+
          |            Bean 工厂包含所有Bean定义                     |
          | (用户组件 + 自动配置的Bean)                               |
          +---------------------------------------------------------+
                         |
                         v
          +---------------------------------------------------------+
          |         创建Bean实例 & [自动装配] 阶段                    |
          |  - AutowiredAnnotationBeanPostProcessor 工作             |
          |  - 解析@Autowired, 查找依赖Bean (可能是用户Bean或自动配置的Bean)|
          |  - 通过反射注入依赖                                     |
          +---------------------------------------------------------+
                         |
                         v
          +---------------------------------------------------------+
          |               初始化Bean & 应用就绪                       |
          +---------------------------------------------------------+
```

### 📌 总结一下

1.  **组件扫描**：找到**你的**`@Component`, `@Service`等类，把它们变成 Spring 容器认识的 Bean 定义。**（发现你的代码）**
2.  **自动装配**：当 Spring 创建上面的 Bean 实例时，看到里面有`@Autowired`，就自动把容器里**匹配的其他 Bean**找出来，设置进去。**（连接你的 Bean）**
3.  **Spring Boot 自动配置**：Spring Boot**自己带了一堆**`XXXAutoConfiguration`类，这些类看着你项目的环境（有没有某个 jar 包？你有没有自己配 DataSource？你有没有配某个属性？），如果条件满足，就**自动帮你配好**一堆常用的 Bean（如 DataSource, MVC 组件等）。**（智能配置基础设施）**
