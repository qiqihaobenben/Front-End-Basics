# Spring

## 概念

### 广义的 Spring：Spring 技术栈

广义上的 Spring 泛指以 Spring Framework 为核心的 Spring 技术栈。

经过十多年的发展，Spring 已经不再是一个单纯的应用框架，而是逐渐发展成为一个由多个不同子项目（模块）组成的成熟技术，例如 Spring Framework、Spring MVC、SpringBoot、Spring Cloud、Spring Data、Spring Security 等，其中 Spring Framework 是其他子项目的基础。

### 狭义的 Spring：Spring Framework

狭义的 Spring 特指 Spring Framework，通常我们将它称为 Spring 框架。

Spring 框架是一个分层的、面向切面的 Java 应用程序的一站式轻量级解决方案，它是 Spring 技术栈的核心和基础，是为了解决企业级应用开发的复杂性而创建的。

## Spring Framework

Spring 框架有两个最核心概念： IoC 和 AOP。

### IoC

Inverse of Control 的简写，译为“控制反转”，指把创建对象过程交给 Spring 进行管理。

### AOP

Aspect Oriented Programming 的简写，译为“面向切面编程”。AOP 用来封装多个类的公共行为，将那些与业务无关，却为业务模块所共同调用的逻辑封装起来，减少系统的重复代码，降低模块间的耦合度。另外，AOP 还解决一些系统层面上的问题，比如日志、事务、权限等。

### 模块

#### 1、Spring Core Container （核心容器）

spring core 提供了 IOC,DI,Bean 配置装载创建的核心实现。核心概念： Beans、BeanFactory、BeanDefinitions、ApplicationContext。

- spring-core ：IOC 和 DI 的基本实现
- spring-beans：BeanFactory 和 Bean 的装配管理(BeanFactory)
- spring-context：Spring context 上下文，即 IOC 容器(AppliactionContext)
- spring-expression：spring 表达式语言

#### 2、Spring AOP

- spring-aop：面向切面编程的应用模块，整合 ASM，CGLib，JDK Proxy
- spring-aspects：集成 AspectJ，AOP 应用框架
- spring-instrument：动态 Class Loading 模块

#### 3、Spring Data Access

- spring-jdbc：spring 对 JDBC 的封装，用于简化 jdbc 操作
- spring-orm：java 对象与数据库数据的映射框架
- spring-oxm：对象与 xml 文件的映射框架
- spring-jms： Spring 对 Java Message Service(java 消息服务)的封装，用于服务之间相互通信
- spring-tx：spring jdbc 事务管理

#### 4、Spring Web

- spring-web：最基础的 web 支持，建立于 spring-context 之上，通过 servlet 或 listener 来初始化 IOC 容器
- spring-webmvc：实现 web mvc
- spring-websocket：与前端的全双工通信协议
- spring-webflux：Spring 5.0 提供的，用于取代传统 java servlet，非阻塞式 Reactive Web 框架，异步，非阻塞，事件驱动的服务

#### 5、Spring Message

Spring-messaging：spring 4.0 提供的，为 Spring 集成一些基础的报文传送服务

#### 6、Spring test

spring-test：集成测试支持，主要是对 junit 的封装
