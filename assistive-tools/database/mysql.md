# Mysql 必知必会

## 术语

不同的人可能会使用相同的数据库术语表示不同的事物，会造成一些混乱，下面是一张重要的数据库术语清单。

### 数据库（database）
**数据库是保存有组织的数据的容器（通常是一个文件或一组文件）。**

> 易混点：人们经常用“数据库”这个词代表他们使用的数据库软件。数据库软件是 DBMS(数据库管理系统)，例如 MySQL 就是一种 DBMS ，而数据库是通过 DBMS 创建和操纵的容器。我们通常不直接访问数据库，而是通过使用 DBMS 来访问数据库。

### 表（table）
**表是某种特定类型数据的结构化清单。**

数据库中的每个表都有一个名字，用来标识自己，称之为“表名”。此名字是唯一的，在相同的数据库中不能使用重复的表名，但是在不同的数据库中可以使用。

### 模式（schema）
**模式是关于数据库和表的布局及特性的信息。**

### 列（column）
**列是表中的一个字段。所有的表都是由一个或多个列组成的。**

### 数据类型（datatype）
**数据类型是所容许的数据的类型。每个表列都有相应的数据类型，它限制（或容许）该列中存储的数据类型。**

### 行（row）
**行是表中的一个记录。**

有人会把行（row）称之为数据库记录（record），这两个数据是可以互相代替的，但是从技术上说，行才是正确的术语。

### 主键（primary key）
**主键是一列（或一组列），其值能够唯一区分表中每个行。**

表中的任何列只要满足以下条件，都可以作为主键：
* 任意两行都不具有相同的主键值；
* 每个行都必须具有一个主键值（主键列不允许 NULL 值）

此外还有几个主键的最佳实践：
* 不更新主键列中的值；
* 不重用主键列的值；
* 不在主键列中使用可能会更改的值。（例如，如果使用一个名字作为主键以标识某个供应商，当该供应商合并和更改其名字时，就得必须更改这个主键。）

### 子句（clause）

SQL 语句由子句构成，有些子句是必需的，而有的是可选的。一个子句通常由一个关键字和所提供的数据组成。例如 SELECT 语句的 FROM 子句。

### 操作符（operator）

用来联结或改变 WHERE 子句中的子句的关键字。也称为 **逻辑操作符（logical operator）**

### SQL（Structured Query Language）
**SQL 是结构化查询语言（Structured Query Language）的缩写，是一种专门用来与数据库通信的语言。**

SQL 的优点：
* SQL 不是某个特定数据库供应商专有的语言。即 SQL 不是一种专利语言，而且存在一个标准委员会。几乎所有重要的 DBMS 都支持 SQL。
* SQL 简单易学。它的语句全都是由描述性很强的英语单词组成，而且这些单词的书目不多。
* SQL 尽管看上去很简单，但它实际上是一种强有力的语言，灵活使用其语言元素，可以进行非常复杂和高级的数据库操作。

## MySQL 安装

推荐几个 MySQL 安装和连接的经验文章

* [在Mac下安装MySQL](http://www.scienjus.com/install-mysql-on-mac/)
* [mac版mysql安装后显示mysql: command not found咋整？](https://www.jianshu.com/p/289d8ad3defa)


## MySQL 应用

### mysql 命令行
* 命令输入在 mysql> 之后；
* 命令用 ; 或 \g 结束，换句话说，仅按 Enter 不执行命令；
* 输入 help 或 \h 获得帮助，也可以输入更多的文本获得特定命令的帮助（如，输入 help select 获得试用 SELECT 语句的帮助）；
* 输入 quit 或 exit 退出命令行。

### 连接数据库
连接数据库需要以下信息：
* 主机名（计算机名）——如果连接到本地 MySQL 服务器，为 localhost ;
* 端口（如果使用默认端口 3306 之外的端口）；
* 一个合法的用户名；
* 用户口令（如果需要）

例如下面的指令：
```
mysql -u root -h localhost -P 3306 -p
```

### 数据库的登录和成员管理

#### 访问控制
MySQL 服务器的安全基础是：用户应该对他们需要的数据具有适当的访问权，既不能多也不能少。

需要给用户提供他们所需的访问权，且仅提供他们所需的访问权。这就是所谓的**访问控制**。访问控制的目的不仅仅是防止用户的恶意企图，访问控制也有助于避免很常见的无意识错误的结果，如错打 MySQL 语句，在不合适的数据库中操作或其他一些用户错误。

#### 管理用户

##### 查询已有用户
MySQL 用户账号和信息存储在名为 mysql 的 MySQL数据库中。一般只有在需要获得所有用户账号列表时才会直接访问。
```sql
# 输入
USE mysql;
SELECT user FROM user;

# 输出
+------------------+
| user             |
+------------------+
| test             |
| root             |
+------------------+
```

##### 创建用户账号

> 1、使用 CREATE USER 语句（推荐）
```sql
# 输入
CREATE USER chenfangxu IDENTIFIED BY '123456';
SELECT user FROM user;

#输出
+------------------+
| user             |
+------------------+
| chenfangxu       |
| test             |
| root             |
+------------------+
```

> 2、GRANT 语句也可以创建用户账号。（MySQL 8.0以上的新版本已经将创建账户和赋予权限分开了，所以不能再用这种方法创建用户了）
```sql
# mysql8.0以下
GRANT SELECT ON *.* TO chenfangxu@'%' IDENTIFIED BY '123456';
```

> 3、使用 INSERT 直接插入行到 user 表来增加用户（不建议）

##### 设置访问权限

在创建用户账号后，必须接着分配访问权限。新创建的用户账号没有访问权限。他们能登录 MySQL ，但不能看到数据，不能执行任何数据库操作。

<br>

> **查看赋予用户账号的权限** `SHOW GRANTS FOR`

```sql
# 输入
SHOW GRANTS FOR chenfangxu;

# 输出
+----------------------------------------+
| Grants for chenfangxu@%                |
+----------------------------------------+
| GRANT USAGE ON *.* TO `chenfangxu`@`%` |
+----------------------------------------+
```

权限 `USAGE ON *.*` ,USAGE表示根本没有权限，这句话就是说在任意数据库和任意表上对任何东西没有权限。

`chenfangxu@%` 因为用户定义为 `user@host`, MySQL的权限用用户名和主机名结合定义，如果不指定主机名，则使用默认的主机名`%`（即授予用户访问权限而不管主机名）。

<br>

> **添加（更新）用户权限** `GRANT privileges ON databasename.tablename TO 'username'@'host';`
```sql
# 输入
GRANT SELECT ON performance_schema.* TO chenfangxu@'%';
SHOW GRANTS FOR chenfangxu;

# 输出
+------------------------------------------------------------+
| Grants for chenfangxu@%                                    |
+------------------------------------------------------------+
| GRANT USAGE ON *.* TO `chenfangxu`@`%`                     |
| GRANT SELECT ON `performance_schema`.* TO `chenfangxu`@`%` |
+------------------------------------------------------------+
```
<br>

> **撤销用户的权限** `REVOKE privileges ON databasename.tablename FROM 'username'@'host';`
```sql
# 输入
REVOKE SELECT ON performance_schema.* FROM chenfangxu@'%';
SHOW GRANTS FOR chenfangxu;

#输出
+----------------------------------------+
| Grants for chenfangxu@%                |
+----------------------------------------+
| GRANT USAGE ON *.* TO `chenfangxu`@`%` |
+----------------------------------------+
```

<br>

#### 重命名

> 重命名：`RENAME USER 'username' TO 'newusername';`
```sql
# 输入
RENAME USER test TO test1;
SELECT user FROM user;

# 输出
+------------------+
| user             |
+------------------+
| test1            |
| root             |
+------------------+
```
<br>

#### 更改用户密码(mysql 8.0.11后)
> 更改用户密码：`SET PASSWORD FOR 'username'@'host' = 'newpassword';`
```sql
SET PASSWORD FOR chenfangxu@'%' = '654321';

# 更改root密码
ALTER USER 'root'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'yourpasswd';
```

<br>

#### 删除用户
> 删除用户：`DROP USER 'username'@'host';`

```sql
# 输入
DROP USER chenfangxu@'%';
SELECT user FROM user;

#输出
+------------------+
| user             |
+------------------+
| test             |
| root             |
+------------------+
```

MySQL 5 以前， DROP USER 只能用来删除用户账号，不能删除相关的权限。因此，如果使用旧版的 MySQL 需要先用 REVOKE 删除与账号相关的权限，然后再用 DROP USER 删除账号。

---
<br>

### 操作数据库

```sql
# 创建数据库，如创建 learnsql 数据库
CREATE DATABASE learnsql;

# 选择数据库，如选择 learnsql 数据库
USE learnsql;

# 显示数据库列表
SHOW DATABASES;

# 显示数据库内的表的列表
SHOW TABLES;

# 显示表中每一列的详细信息
SHOW COLUMNS FROM customers;
```

#### DESCRIBE 语句

MySQL 中 DESCRIBE 可以作为 SHOW COLUMNS FROM 的快捷方式。
```sql
# 以下两种命令结果相同
SHOW COLUMNS FROM customers;
DESCRIBE customers;
```

----
<br>

### 检索数据

```sql
# 检索单个列，例如从 products 表中检索一个名为 prod_name 的列。
SELECT prod_name FROM products;

# 检索多个列。注意，列名之间要用逗号分隔，最后一个列名后不要加逗号，会报错。
SELECT prod_id, prod_name, prod_price FROM products;

# 检索所有列。
SELECT * FROM products;

# 只检索出不同的行， DESTINCT 关键字可以让指令只返回不同的值。如果指令，products 表中可能一共有14行，现在只返回不同（唯一）的 vend_id 行，可能就只返回4行了。
SELECT DISTINCT vend_id FROM products;

# 限制结果， LIMIT 5 表示只返回不多于5行。
SELECT prod_name FROM products LIMIT 5;

# LIMIT 5, 5 表示返回从行5开始的5行。
SELECT prod_name FROM products LIMIT 5, 5;
# 或者使用 LIMIT 5 OFFSET 5， 跟上面结果相同。
SELECT prod_name FROM products LIMIT 5 OFFSET 5;

# 注意，返回行数是从 0 开始的。所以，LIMIT 1, 1 将检索出第二行，而不是第一行。
SELECT prod_name FROM products LIMIT 1,1;
```

----
<br>

## 排序检索数据 ( ORDER BY )

不使用排序时，其实检索出的数据并不是以纯粹的随机顺序显示的，数据一般将以它在底层表中出现的顺序显示。这可以是数据最初添加到表中的顺序，但是，如果数据后来进行过更新或者删除，则此顺序将会受到 MySQL 重用回收存储空间的影响。因此，如果不明确控制的话，不能（也不应该）依赖该排序顺序。

**关系数据库设计理论认为：如果不明确规定排序顺序，则不应该假定检索出的数据的顺序有意义。**

ORDER BY 子句，可以给 SELECT 语句检索出来的数据进行排序。 ORDER BY 子句取一个或多个列的名字。据此对输出进行排序。

```sql
# 没有排序
SELECT prod_name FROM products;

# 对 prod_name 列以字母顺序排序数据
SELECT prod_name FROM products ORDER BY prod_name;

# 按多个列排序：如下会先按照 prod_price 排序，
# 只有出现相同的 prod_price 时，才会再按照 prod_name 排序。
SELECT prod_id, prod_price, prod_name FROM products ORDER BY prod_price, prod_name;

# 指定排序方向，默认是升序，例如按照 prod_price 降序排序（最贵的排在最前面）
SELECT prod_id, prod_price, prod_name FROM products ORDER BY prod_price DESC;
# 多个列排序，例如按照 prod_price 降序，最贵的在最前面，然后在对产品名排序
SELECT prod_id, prod_price, prod_name FROM products ORDER BY prod_price DESC, prod_name;

# ORDER BY 和 LIMIT 搭配，可以找出一个列中最高或最低的值。
SELECT prod_price FROM products ORDER BY prod_price DESC LIMIT 1;
```

### 注意：
* ORDER BY 子句中使用的列不一定非得是检索的列，用非检索的列排序也是完全合法的。
* 如果想在多个列上进行降序排序，必须对每个列指定 DESC 关键字。
* ASC 是升序排序，升序是默认的，不指定 DESC ，那就是按照 ASC 升序排序。
* ORDER BY 子句必须位于 FROM 子句之后，如果使用 LIMIT ，它必须位于 ORDER BY 之后。

---
<br>

## 过滤数据 （ WHERE ）

数据库包含大量的数据，但是我们很少需要检索表中所有的行。只检索所需数据需要指定过滤条件，在 SELECT 语句中，数据根据 WHERE 子句中指定的搜索条件进行过滤。

```sql
# 检索 pro_price 为 2.50 的行
SELECT prod_name FROM products WHERE prod_price = 2.50;

# 执行筛选匹配时默认不区分大小写，所以 fuses 可以检索出 Fuses
SELECT prod_name, prod_price FROM products WHERE prod_name = 'fuses';
# 输出
+-----------+------------+
| prod_name | prod_price |
+-----------+------------+
| Fuses     |       3.42 |
+-----------+------------+

# 检索出 vend_id 不等于 1003 的行
SELECT vend_id, prod_name FROM products WHERE vend_id <> 1003;

# 检索 prod_price 在 5 到 10 之间的所有行
SELECT prod_name, prod_price FROM products WHERE prod_price BETWEEN 5 AND 10;

# 检查具有 NULL 值的列，用 IS NULL 子句
SELECT cust_id FROM customers WHERE cust_email IS NULL;
```

### WHERE 子句操作符

| 操作符 | 说明 |
|:---:|:---:|
| = | 等于 |
| <> | 不等于 |
| != | 不等于 |
| < | 小于 |
| <= | 小于等于 |
| > | 大于 |
| >= | 大于等于 |
| BETWEEN | 在指定的两个值之间 |

### 注意：
* WHERE 语句的位置：在同时使用 ORDER BY 和 WHERE 子句时，应该让 ORDER BY 位于 WHERE 之后，否则将会产生错误。
* WHERE 子句中使用的条件，如果将值与串类型（例如字符串），需要加引号，用来与数值列进行比较的值不用引号。
* NULL 无值(no value)，它与字段 0 、空字符串或仅仅包含空格不同。

---
<br>

## 数据过滤（ AND、 OR、 IN ）

MySQL 允许组合多个 WHERE 子句。这些子句分为两种方式使用：以 AND 子句的方式或 OR 子句的方式使用。

```sql
### AND 操作符
# 检索出 vend_id 等于 1003 并且 prod_price 小于等于 10 的行
SELECT prod_price, prod_name FROM products WHERE vend_id = 1003 AND prod_price <= 10;


#### OR 操作符
# 检索出 vend_id 等于 1002 或 vend_id 等于 1003 的所有行
SELECT prod_name, prod_price FROM products WHERE vend_id = 1002 OR vend_id = 1003;


# AND 和 OR 合用，AND 优先级高。
# 下面检索出的结果是 vend_id 是 1003 并且 prod_price 大于等于 10 的和所有 vend_id 是 1002 的行。
SELECT vend_id, prod_name, prod_price FROM products WHERE vend_id = 1002 OR vend_id = 1003 AND prod_price >= 10;
# 输出结果
+---------+----------------+------------+
| vend_id | prod_name      | prod_price |
+---------+----------------+------------+
|    1002 | Fuses          |       3.42 |
|    1002 | Oil can        |       8.99 |
|    1003 | Detonator      |      13.00 |
|    1003 | Bird seed      |      10.00 |
|    1003 | Safe           |      50.00 |
|    1003 | TNT (5 sticks) |      10.00 |
+---------+----------------+------------+

# 如果想检索出 vend_id 是 1003 并且 prod_price 大于等于 10 的和 vend_id 是 1002  并且 prod_price 大于等于 10 的行，需要加括号。
SELECT vend_id, prod_name, prod_price FROM products WHERE (vend_id = 1002 OR vend_id = 1003) AND prod_price >= 10;


### IN 操作符，指定条件范围，范围中的每个条件都可以进行匹配。IN 取值是全部括在圆括号中的由逗号分隔的列表。
SELECT vend_id, prod_name, prod_price FROM products WHERE vend_id IN (1002, 1003);


### NOT 操作符，否定它之后的任何条件
SELECT vend_id, prod_name, prod_price FROM products WHERE vend_id NOT IN (1002, 1003);
```

### 注意
* WHERE 可包含任意数目的 AND 和 OR 操作符，并且允许两者结合以进行复杂和高效的过滤。不过 SQL 语言在处理 OR 操作符前，会优先处理 AND 操作符。
* 任何时候使用具有 AND 和 OR 操作符的 WHERE 子句， 都推荐使用圆括号明确地分组，不要过分依赖默认计算次序。
* IN 和 OR 具有相同的功能，但是 IN 操作符有以下优点
  - 过滤的字段太多的时候，IN 操作符的语法更清楚且更直观
  - IN 操作符一般比 OR 操作符执行的更快
  - IN 最大的优点是可以包含其他 SELECT 语句，能更动态地建立 WHERE 子句。
* MySQL 支持使用 NOT 对 IN、BETWEEN 和 EXISTS 子句取反。

---
<br>

## 补充

### 一些注意点

#### 1、多条 SQL 语句必须以分号（;）分隔。

#### 2、SQL 语句不区分大小写，因此，例如 SELECT 和 select 是相同的，即使写成 SelEct 都是没有问题的。大家约定俗成的把 SQL 关键词大写，其他的列和表名用小写，这样做使代码更易于阅读和调试。

#### 3、在处理 SQL 语句时，其中所有空格都会被忽略。

### 其他指令

### 查看当前 MySQL 版本或者当前在哪个数据库中。

```sql
# 登录之前，查看版本
mysql -V

# 登录之后使用MySQL的函数（大小写均可）查看版本
mysql> SELECT VERSION();

# 登录之后，使用 status 或者 \s 查看版本和当前使用的数据库
mysql> status
mysql> \s
```

### 查看当前 MySQL 的密码策略

```sql
mysql> SHOW VARIABLES LIKE 'validate_password%';
+--------------------------------------+--------+
| Variable_name                        | Value  |
+--------------------------------------+--------+
| validate_password.check_user_name    | ON     |
| validate_password.dictionary_file    |        |
| validate_password.length             | 8      |
| validate_password.mixed_case_count   | 1      |
| validate_password.number_count       | 1      |
| validate_password.policy             | MEDIUM |
| validate_password.special_char_count | 1      |
+--------------------------------------+--------+
```
要注意 `validate_password_policy：密码强度检查等级`

|级别|描述|
|--|--|
|0/LOW|只检查长度。|
|1/MEDIUM|检查长度、数字、大小写、特殊字符。|
|2/STRONG|检查长度、数字、大小写、特殊字符字典文件|


* [详见mysql密码策略设置](https://raydoom.github.io/work/mysql/2018/09/13/mysql-validate-password/)

* [MySQL8.0 SHOW VARIABLES 为 empty set 可看此文](http://blog.itpub.net/20893244/viewspace-2565368/)

### 其他的 SHOW 命令列表

```sql
# 用于显示广泛的服务器状态信息
SHOW STATUS;

# 显示创建特定数据库的MySQL语句，例如展示 learnsql 数据库的创建语句
SHOW CREATE DATABASE learnsql;

# 显示创建特定表的MySQL语句，例如展示 customers 表的创建语句
SHOW CREATE TABLE customers;

# 显示服务器的错误信息
SHOW ERRORS;

# 显示服务器的警告信息
SHOW WARNINGS;

# 显示所有允许的 SHOW 语句
HELP SHOW;
```

