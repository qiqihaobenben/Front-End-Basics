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

- 任意两行都不具有相同的主键值；
- 每个行都必须具有一个主键值（主键列不允许 NULL 值）

此外还有几个主键的最佳实践：

- 不更新主键列中的值；
- 不重用主键列的值；
- 不在主键列中使用可能会更改的值。（例如，如果使用一个名字作为主键以标识某个供应商，当该供应商合并和更改其名字时，就得必须更改这个主键。）

### 外键（foreign key）

外键为某个表中的一列，它包含另一个表的主键值，定义了两个表之间的关系。

### 子句（clause）

SQL 语句由子句构成，有些子句是必需的，而有的是可选的。一个子句通常由一个关键字和所提供的数据组成。例如 SELECT 语句的 FROM 子句。

### 操作符（operator）

用来联结或改变 WHERE 子句中的子句的关键字。也称为 **逻辑操作符（logical operator）**

### 通配符（wildcard）

用来匹配值的一部分的特殊字符。

### 搜索模式（search pattern）

由字面量、通配符或两者组合构成的搜索条件

### 拼接（concatenate）

将值联结到一起构成单个值

### 别名（alias）

是一个字段或值的替换名。别名用 AS 关键字赋予。别名有时也称为导出列（derived column），不管称为什么，它们所代表的都是相同的东西。

### 聚集函数（aggregate function）

运行在行组上，计算和返回单个值的函数。

### 查询（query）

任何 SQL 语句都是查询。但此术语一般指 SELECT 语句。

### 相关子查询（correlated subquery）

涉及外部查询的子查询。

### 可伸缩性（scale）

能够适应不断增加的工作量而不失败。设计良好的数据库或应用程序称之为可伸缩性好（scale well）

### 变量（variable）

内存中一个特定的位置，用来临时存储数据。所有 MySQL 变量都必须以 `@` 开始。

### SQL（Structured Query Language）

**SQL 是结构化查询语言（Structured Query Language）的缩写，是一种专门用来与数据库通信的语言。**

SQL 的优点：

- SQL 不是某个特定数据库供应商专有的语言。即 SQL 不是一种专利语言，而且存在一个标准委员会。几乎所有重要的 DBMS 都支持 SQL。
- SQL 简单易学。它的语句全都是由描述性很强的英语单词组成，而且这些单词的书目不多。
- SQL 尽管看上去很简单，但它实际上是一种强有力的语言，灵活使用其语言元素，可以进行非常复杂和高级的数据库操作。

## MySQL 安装

推荐几个 MySQL 安装和连接的经验文章

- [在 Mac 下安装 MySQL](http://www.scienjus.com/install-mysql-on-mac/)
- [mac 版 mysql 安装后显示 mysql: command not found 咋整？](https://www.jianshu.com/p/289d8ad3defa)

## MySQL 应用

### mysql 命令行

- 命令输入在 mysql> 之后；
- 命令用 ; 或 \g 结束，换句话说，仅按 Enter 不执行命令；
- 输入 help 或 \h 获得帮助，也可以输入更多的文本获得特定命令的帮助（如，输入 help select 获得试用 SELECT 语句的帮助）；
- 输入 quit 或 exit 退出命令行。

### 连接数据库

连接数据库需要以下信息：

- 主机名（计算机名）——如果连接到本地 MySQL 服务器，为 localhost ;
- 端口（如果使用默认端口 3306 之外的端口）；
- 一个合法的用户名；
- 用户口令（如果需要）

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

MySQL 用户账号和信息存储在名为 mysql 的 MySQL 数据库中。一般只有在需要获得所有用户账号列表时才会直接访问。

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

CREATE USER '用户名'@'主机' IDENTIFIED BY '密码';

- 主机：指定该用户可以从哪些主机访问 MySQL（通常是本地或远程）。常见值：
  - 'localhost'：只允许从本地访问。
  - '%'：默认值，允许从任何主机访问。

```sql
# 输入

CREATE USER 'chenfangxu'@'localhost' IDENTIFIED BY '123456';
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

> 2、GRANT 语句也可以创建用户账号。（MySQL 8.0 以上的新版本已经将创建账户和赋予权限分开了，所以不能再用这种方法创建用户了）

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

权限 `USAGE ON *.*` ,USAGE 表示根本没有权限，这句话就是说在任意数据库和任意表上对任何东西没有权限。

`chenfangxu@%` 因为用户定义为 `user@host`, MySQL 的权限用用户名和主机名结合定义，如果不指定主机名，则使用默认的主机名`%`（即授予用户访问权限而不管主机名）。

如果查看 host 为 localhost 的用户权限可以是：SHOW GRANTS FOR chenfangxu@localhost;

<br>

> **添加（更新）用户权限** `GRANT privileges ON databasename.tablename TO 'username'@'host';`

```sql
# 输入
GRANT SELECT ON performance_schema.* TO chenfangxu@'%';
SHOW GRANTS FOR chenfangxu@%;

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

#### 更改用户密码(mysql 8.0.11 后)

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

---

<br>

## 下面用到的数据库文件可在 [mysql_scripts](https://github.com/qiqihaobenben/Front-End-Basics/tree/master/assistive-tools/database/mysql_scripts) 找到。

---

<br>

## 创建和操作表

### 创建表

利用 CREATE TABLE 创建表，必须紧跟着给出新表的名字，然后是表列的名字和定义，用逗号分隔。

#### NULL 值

NULL 值就是没有值或缺值。允许 NULL 值的列也允许在插入行时不给出该列的值。 NOT NULL 即不允许 NULL 值的列不接受该列没有值的行，在插入或更新行时，该列必须有值。NULL 是默认设置，如果不指定 NOT NULL，则认为指定的是 NULL。

#### 主键

主键必须是唯一的，即表中的每个行必须具有唯一的主键值，如果主键使用单个列，则它的值必须唯一。如果使用多个列，则这些列的组合值必须唯一。

使用类似 PRIMARY KEY (id) 的语句来定义。为创建由多个列组成的主键，应该以逗号分隔的列表给出各列名，例如 orderitems 表的创建用到的 PRIMARY KEY (order_num, order_item)

主键可以在创建表时定义，或者在创建表之后定义。

主键为唯一标识表中每个行的列，主键中只能使用不允许 NULL 值的列。

#### AUTO_INCREMENT

每次执行一个 INSERT 操作时， MySQL 自动对该列增量。

每个表只能允许一个 AUTO_INCREMENT 列，而且它必须被索引（比如通过使用它成为主键）

在执行 INSERT 时可以给 AUTO_INCREMENT 指定一个值，只要它是至今为止唯一的就行，该值将被用来替代自动生成的值。后续的增量将开始使用该手工插入的值。

last_insert_id() 这个函数能返回最后一个 AUTO_INCREMENT 值

#### 指定默认值

列定义中的 DEFAULT 关键字指定。 MySQL 跟大多数 DBMS 一样， 不允许使用函数作为默认值，它只支持常量。

#### 引擎类型

大多数时候， CREATE TABLE 语句全都以 ENGINE=InnoDB 语句结束。MySQL 具有多种引擎，这些打包的多个引擎都隐藏在 MySQL 的服务器内，全都能执行 CREATE TABLE 和 SELECT 等命令。这些引擎具有各自不同的功能和特性，为不同的任务选择正确的引擎能获得良好的功能和灵活性。

**InnoDB** 是一个可靠的事务处理引擎，它不支持全文本搜索。

**MyISAM** 是一个性能极高的引擎，它支持全文本搜索，但不支持事务处理

**MEMORY** 在功能等同于 MyISAM，但由于数据存储在内存（不是磁盘）中，速度很快（特别适合用于临时表）

```sql
########################
# 看一下 customers 表的创建
########################
CREATE TABLE `customers`
(
  cust_id      int       NOT NULL AUTO_INCREMENT,
  cust_name    char(50)  NOT NULL ,
  cust_address char(50)  CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL ,
  cust_city    char(50)  NULL ,
  cust_state   char(5)   NULL ,
  cust_zip     char(10)  NULL ,
  cust_country char(50)  NULL ,
  cust_contact char(50)  NULL ,
  cust_email   char(255) NULL ,
  PRIMARY KEY (cust_id)
) ENGINE = InnoDB AUTO_INCREMENT = 1 DEFAULT CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;
```

- 表名被反引号（`）包围，这是为了防止表名与 MySQL 的保留关键字冲突。
- CHARACTER SET utf8mb4 表明该列使用 utf8mb4 字符集，此字符集能支持包括表情符号在内的各种字符
- COLLATE utf8mb4_general_ci 表明该列使用 utf8mb4_general_ci 排序规则，此排序规则能支持包括表情符号在内的各种字符
- NULL 和 NULL DEFAULT NULL 表示该列允许为空值，并且默认值为 NULL。
- ENGINE = InnoDB：指定该表使用 InnoDB 存储引擎，InnoDB 支持事务、外键约束等功能，是 MySQL 中常用的存储引擎。
- AUTO_INCREMENT = 1：将自增计数器的初始值设为 1。
- DEFAULT CHARACTER SET = utf8mb4：指定表的字符集为 utf8mb4，一般也使用 DEFAULT CHARSET = utf8mb4 来指定。
- COLLATE = utf8mb4_general_ci：指定表的排序规则为不区分大小写的 utf8mb4_general_ci。
- ROW_FORMAT = Dynamic：指定行的存储格式为 Dynamic，这种格式适合存储变长数据。

### 更新表

为了更新表定义，可使用 ALTER TABLE 语句。

```sql
### vendors 表中增加 vend_phone 列
ALTER TABLE vendors ADD vend_phone CHAR(20);

### 删除刚刚增加的 vend_phone 列
ALTER TABLE vendors DROP COLUMN vend_phone;

### ALTER TABLE 常见的用途就是定义外键
ALTER TABLE products ADD CONSTRAINT fk_products_vendors FOREIGN KEY (vend_id) REFERENCES vendors (vend_id)
```

### 删除表

```sql
DROP TABLE customers2;
```

在创建新的 book 表之前，先检查该表是否已经存在。若存在，就把它删除。IF EXISTS 这个关键字起到了避免因表不存在而产生错误的作用。

```sql
DROP TABLE IF EXISTS `book`;
```

### 重命名表

```sql
### 重命名一个表
RENAME TABLE customers2 TO customers;

### 重命名多个表
RENAME TABLE backup_customers TO customers,backup_vendors TO vendors;
```

### 注意

- 创建新表时，指定的表名必须不存在，否则将出错。如果仅想在一个表不存在时创建它，应该在表名后面给出 IF NOT EXISTS。
- 使用 ALTER TABLE 要极为小心，应该在进行改动之前做一个完整的备份（模式和数据的备份）

---

<br>

## 插入数据

### 插入完整的行

```sql
### 如下的语句中，对每个列必须提供一个值，如果某个列没有值，应该使用 NULL 值（假设表允许对该列指定空值）。每个列必须按照顺序给出，自动增量的值也不能忽略，而且如果不想赋值，就需要指定为 NULL 。
INSERT INTO customers VALUES( NULL, 'Pep E. LaPew', '100 Main Street', 'Los Angeles', 'CA', '90046', 'USA', NULL, NULL);
```

上面的语法应该避免使用，因为不安全，建议用下面的语句,可以不按照次序填充，只要保证 VALUES 中的次序跟前面给出的列名次序一致就行。

```sql
INSERT INTO customers(cust_name, cust_contact, cust_email, cust_address, cust_city, cust_state, cust_zip, cust_country) VALUES('Pep E. LaPew', NULL, NULL, '100 Main Street', 'Los ANGELES', 'CA', '90046', 'USA');
```

### 插入多个行

```sql
### 可以使用多条 INSERT 语句，甚至一次提交它们，每条语句用一个分号结束。
INSERT INTO customers(cust_name,cust_address,cust_city,cust_state,cust_zip,cust_country) VALUES('Pep E. LaPew','100 Main Street','Los Angeles','CA','90046','USA');INSERT INTO customers(cust_name,cust_address,cust_city,cust_state,cust_zip,cust_country) VALUES('M. Martian','42 Galaxy Way','New York','NY','11213','USA');

### 或者每条 INSERT 语句中的列名（和次序）相同，可以如下组合语句
INSERT INTO customers(cust_name,cust_address,cust_city,cust_state,cust_zip,cust_country) VALUES('Pep E. LaPew','100 Main Street','Los Angeles','CA','90046','USA'), ('M. Martian','42 Galaxy Way','New York','NY','11213','USA');
```

### 注意

- 在 INSERT 操作中可以省略某些列，省略的列必须满足：该列定义为允许 NULL 值（无值或者空值），或在表定义中给出默认值，这表示如果不给出值，将使用默认值，否则插入时省略会报错。
- 可以使用 INSERT LOW PRIORITY INTO 来降低插入语句的优先级。

---

<br>

## 更新数据

```sql
### 更新id是10009客户名字的邮箱。
UPDATE customers SET cust_name = 'The Fudds', cust_email = 'elmer@fudd.com' WHERE cust_id = 10009;

### 为了删除某个列的值，可设置它为 NULL（假定表定义为允许 NULL 值）
UPDATE customers SET cust_email = NULL WHERE cust_id = 10009;
```

### 注意

- 使用 UPDATE 时，一定不能省略 WHERE 子句，否则就会更新表中的所有行。
- UPDATE 操作如果报错，则整个 UPDATE 操作被取消，错误发生前更新的所有行被恢复到它们原来的值，如果想发生错误的时候也继续进行更新，可以使用 IGNORE 关键字 `UPDATE IGNORE customers`

---

<br>

## 删除数据

```sql
### 删除10011这一行
DELETE FROM customers WHERE cust_id = 10011;

```

### 注意

- 使用 DELETE 时，一定不能省略 WHERE 子句，否则就会删除表中的所有行。即使删除所有行， DELETE 也不会删除表本身。
- 如果想从表中删除所有行，不要使用 DELETE。可以使用 TRUNCATE TABLE 语句，速度更快（TRUNCATE 实际是删除原来的表并重新创建一个表，而不是逐行删除表中的数据）。

---

<br>

## 检索数据

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

---

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

- ORDER BY 子句中使用的列不一定非得是检索的列，用非检索的列排序也是完全合法的。
- 如果想在多个列上进行降序排序，必须对每个列指定 DESC 关键字。
- ASC 是升序排序，升序是默认的，不指定 DESC ，那就是按照 ASC 升序排序。
- ORDER BY 子句必须位于 FROM 子句之后，如果使用 LIMIT ，它必须位于 ORDER BY 之后。

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

| 操作符  |        说明        |
| :-----: | :----------------: |
|    =    |        等于        |
|   <>    |       不等于       |
|   !=    |       不等于       |
|    <    |        小于        |
|   <=    |      小于等于      |
|    >    |        大于        |
|   >=    |      大于等于      |
| BETWEEN | 在指定的两个值之间 |

### 注意：

- WHERE 语句的位置：在同时使用 ORDER BY 和 WHERE 子句时，应该让 ORDER BY 位于 WHERE 之后，否则将会产生错误。
- WHERE 子句中使用的条件，如果将值与串类型（例如字符串）比较，需要加引号，用来与数值列进行比较的值不用引号。
- NULL 无值(no value)，它与字段 0 、空字符串或仅仅包含空格不同。

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

- WHERE 可包含任意数目的 AND 和 OR 操作符，并且允许两者结合以进行复杂和高效的过滤。不过 SQL 语言在处理 OR 操作符前，会优先处理 AND 操作符。
- 任何时候使用具有 AND 和 OR 操作符的 WHERE 子句， 都推荐使用圆括号明确地分组，不要过分依赖默认计算次序。
- IN 和 OR 具有相同的功能，但是 IN 操作符有以下优点
  - 过滤的字段太多的时候，IN 操作符的语法更清楚且更直观
  - IN 操作符一般比 OR 操作符执行的更快
  - IN 最大的优点是可以包含其他 SELECT 语句，能更动态地建立 WHERE 子句。
- MySQL 支持使用 NOT 对 IN、BETWEEN 和 EXISTS 子句取反。

---

<br>

## 用通配符过滤

### 百分号（%）通配符

`%` 表示任何字符出现任意次数，可以使 0 次，1 次，n 次

```sql
### 找出所有以 jet 开头的产品
SELECT prod_id, prod_name FROM products WHERE prod_name LIKE 'jet%';
+---------+--------------+
| prod_id | prod_name    |
+---------+--------------+
| JP1000  | JetPack 1000 |
| JP2000  | JetPack 2000 |
+---------+--------------+

### 通配符可在搜索模式中任意位置使用，并且可以使用多个通配符。
SELECT prod_id, prod_name FROM products WHERE prod_name LIKE '%anvil%';
+---------+--------------+
| prod_id | prod_name    |
+---------+--------------+
| ANV01   | .5 ton anvil |
| ANV02   | 1 ton anvil  |
| ANV03   | 2 ton anvil  |
+---------+--------------+

```

### 下划线通配符

下划线 \_ 只能匹配单个字符，只能匹配一个，不能多也不能少。

```sql
### 对比一下下面两个通配符结果
SELECT prod_id, prod_name FROM products WHERE prod_name LIKE '_ ton anvil';
+---------+-------------+
| prod_id | prod_name   |
+---------+-------------+
| ANV02   | 1 ton anvil |
| ANV03   | 2 ton anvil |
+---------+-------------+


SELECT prod_id, prod_name FROM products WHERE prod_name LIKE '% ton anvil';
+---------+--------------+
| prod_id | prod_name    |
+---------+--------------+
| ANV01   | .5 ton anvil |
| ANV02   | 1 ton anvil  |
| ANV03   | 2 ton anvil  |
+---------+--------------+

### 下划线通配符比百分号通配符少了一个 .5 的数据
```

### 注意

- 注意尾部空格，例如'%anvil' 是匹配不到 'anvil ',因为后面有个空格不容易发现，解决方法就是后面再附加一个 % ，或者用函数去掉首尾空格。
- % 是不能匹配出 NULL 的。
- 通配符搜索的处理一般要比其他搜索花时间更长，所以不要过度使用通配符，如果其他操作符能达到同样的目的，优先使用其他操作符。在确实需要使用通配符时，除非绝对有必要，否则不要把他们用在搜索模式的开始处。

---

<br>

## 用正则表达式进行搜索

```sql
### 基本字符匹配，下面的语句检索列 prod_name 包含文本 1000 的所有行。
SELECT prod_name FROM products WHERE prod_name REGEXP '1000' ORDER BY prod_name;

### 区分大小写需要用到 BINARY 关键字
SELECT prod_name FROM products WHERE prod_name REGEXP BINARY 'S';

### 使用 | 进行 OR 匹配，可以有两个以上的 OR 条件，例如： '1000|2000|3000'
SELECT prod_name FROM products WHERE prod_name REGEXP '1000|2000';
+--------------+
| prod_name    |
+--------------+
| JetPack 1000 |
| JetPack 2000 |
+--------------+

### 匹配几个字符之一
SELECT prod_name FROM products WHERE prod_name REGEXP '[1,2,3] Ton' ORDER BY prod_name;
+-------------+
| prod_name   |
+-------------+
| 1 ton anvil |
| 2 ton anvil |
+-------------+
### 注意区别 1|2|3 Ton，这表示匹配出 1，2和3 Ton，其实[123]是[1|2|3]的缩写
SELECT prod_name FROM products WHERE prod_name REGEXP '1|2|3 Ton' ORDER BY prod_name;
+---------------+
| prod_name     |
+---------------+
| 1 ton anvil   |
| 2 ton anvil   |
| JetPack 1000  |
| JetPack 2000  |
| TNT (1 stick) |
+---------------+

### 匹配特殊字符， \\ 来转义特殊字符
SELECT vend_name FROM vendors WHERE vend_name REGEXP '\\.' ORDER BY vend_name;
+--------------+
| vend_name    |
+--------------+
| Furball Inc. |
+--------------+


### 匹配出连在一起的4个数字
SELECT prod_name FROM products WHERE prod_name REGEXP '[:digit:]{4}' ORDER BY prod_name;
+--------------+
| prod_name    |
+--------------+
| JetPack 1000 |
| JetPack 2000 |
+--------------+
```

### 列举元字符转义和定位元字符

| 元字符                     | 说明       |
| -------------------------- | ---------- |
| \\f                        | 换页       |
| \\n                        | 换行       |
| \\r                        | 回车       |
| \\t                        | 制表       |
| \\v                        | 纵向制表   |
| \\\                        | 反斜杠     |
| ^                          | 文本的开始 |
| \$                         | 文本的结束 |
| [[:<:]](8 版本之后改为 \b) | 词的开始   |
| [[:>:]](8 版本之后改为 \b) | 词的结束   |

多数正则表达式实现使用单个反斜杠转义特殊字符，以便能使用这些字符本身。但 MySQL 要求两个反斜杠（MySQL 自己解释一个，正则表达式库解释另一个）。

### 列举字符类

| 类         | 说明                                             |
| ---------- | ------------------------------------------------ |
| [:alnum:]  | 任意字符和数字（同 [a-zA-Z0-9]）                 |
| [:alpha:]  | 任意字符（同 [a-zA-Z]）                          |
| [:blank:]  | 空格和制表 （同 [\\t]）                          |
| [:cntrl:]  | ASCII 控制字符 （ASCII 0 到 31 和 127）          |
| [:digit:]  | 任意数字 （同 [0-9]）                            |
| [:xdigit:] | 任意十六进制数字（同 [a-fA-F0-9]）               |
| [:lower:]  | 任意小写字母 （同 [a-z]）                        |
| [:upper:]  | 任意大写字母（同 [A-Z]）                         |
| [:print:]  | 任意可打印字符                                   |
| [:graph:]  | 与[:print:]相同，但不包含空格                    |
| [:punct:]  | 既不在[:alnum:]又不在[:cntrl:]中的任意字符       |
| [:space:]  | 包括空格在内的任意空白字符(同 [\\f\\n\\r\\t\\v]) |

### 简单的正则表达式测试

在不使用数据库表的情况下用 SELECT 来测试正则表达式。 REGEXP 检查总是返回 0（没有匹配）或 1（匹配）。

```sql
SELECT 'hello' REGEXP 'hello\\b';
+---------------------------+
| 'hello' REGEXP 'hello\\b' |
+---------------------------+
|                         1 |
+---------------------------+
```

---

<br>

## 计算字段

```sql

### 将查出来的名字和国家拼接出来展示，使用了 Concat、Trim函数，和 AS 关键字
SELECT Concat( Trim(vend_name), '(', Trim(vend_country), ')') AS vend_name FROM vendors ORDER BY vend_name;
+------------------------+
| vend_name              |
+------------------------+
| ACME(USA)              |
| Anvils R Us(USA)       |
| Furball Inc.(USA)      |
| Jet Set(England)       |
| Jouets Et Ours(France) |
| LT Supplies(USA)       |
+------------------------+


### 将20005订单中的所有物品查出来，通过数量和单价算出总价
SELECT prod_id, quantity, item_price, quantity*item_price AS expanded_price FROM orderitems WHERE order_num = 20005;
+---------+----------+------------+----------------+
| prod_id | quantity | item_price | expanded_price |
+---------+----------+------------+----------------+
| ANV01   |       10 |       5.99 |          59.90 |
| ANV02   |        3 |       9.99 |          29.97 |
| TNT2    |        5 |      10.00 |          50.00 |
| FB      |        1 |      10.00 |          10.00 |
+---------+----------+------------+----------------+
```

### 测试计算

SELECT 提供了测试和实验函数与计算的一个很好的方法，就是省略 FROM 子句

```sql
SELECT 3*2;
+-----+
| 3*2 |
+-----+
|   6 |
+-----+

SELECT Now();
+---------------------+
| Now()               |
+---------------------+
| 2019-11-21 22:51:13 |
+---------------------+
```

---

<br>

## 使用数据处理函数

函数没有 SQL 的可移植性强，几乎每种主要的 DBMS 的实现都支持其他实现不支持的函数，有时差异还很大。为了代码的可移植性，很多人不赞成使用特殊实现的功能，虽然这样做很有好处，但是对于应用程序的性能可能出现影响。如果决定使用函数，应该保证做好代码注释。

### 文本处理函数

| 函 数       | 说 明               |
| ----------- | ------------------- |
| Left()      | 返回串左边的字符    |
| Length()    | 返回串的长度        |
| Locate()    | 找出串的一个子串    |
| Lower()     | 将串转换为小写      |
| LTrim()     | 去掉串左边的空格    |
| Right()     | 返回串右边的字符    |
| RTrim()     | 去掉串右边的空格    |
| Soundex()   | 返回串的 SOUNDEX 值 |
| SubString() | 返回子串的字符      |
| Upper()     | 将串转换为大写      |

SOUNDEX 是一个将任何文本串转换为描述其语音表示的字母数字模式的算法。SOUNDEX 考虑了类似的发音字节和音节，使得能对串进行发音比较而不是字母比较。

```sql
### 例如用 Y. Lie 把 Y Lee 搜出来，因为它们发音类似
SELECT cust_name, cust_contact FROM customers WHERE Soundex(cust_contact) = Soundex('Y. Lie');
+-------------+--------------+
| cust_name   | cust_contact |
+-------------+--------------+
| Coyote Inc. | Y Lee        |
+-------------+--------------+
```

### 日期和时间处理函数

| 函 数         | 说 明                          |
| ------------- | ------------------------------ |
| AddDate()     | 增加一个日期（天、周等）       |
| AddTime()     | 增加一个时间（时、分等）       |
| CurDate()     | 返回当前日期                   |
| CurTime()     | 返回当前时间                   |
| Date()        | 返回日期时间的日期部分         |
| DateDiff()    | 计算两个日期之差               |
| Date_Add()    | 高度灵活的日期运算函数         |
| Date_Format() | 返回一个格式化的日期或时间串   |
| Year()        | 返回一个日期的年份部分         |
| Month()       | 返回一个日期的月份部分         |
| Day()         | 返回一个日期的天数部分         |
| DayOfWeek()   | 对于一个日期，返回对应的星期几 |
| Hour()        | 返回一个时间的小时部分         |
| Minute()      | 返回一个时间的分钟部分         |
| Second()      | 返回一个时间的秒部分           |
| Now()         | 返回当前日期和时间             |

```sql
### 检索出日期为 2005-09-01 这天的订单记录
SELECT cust_id, order_num FROM orders WHERE order_date = '2005-09-01';


### 上面的检索有个问题，如果 order_date 存储的带有时间，例如 2005-09-01 11:30:05 ，就检索不到了，解决办法是让仅将给出的日期与列中的日期部分进行比较
SELECT cust_id, order_num FROM orders WHERE Date(order_date) = '2005-09-01';

### 如果想检索出2005年9月的所有订单

### 方法一，得记住每个月有多少天，甚至要知道是不是闰年的2月
SELECT cust_id, order_num FROM orders WHERE Date(order_date) BETWEEN '2005-09-01' AND '2005-09-30';

### 方法二, 使用 Year() 和 Month() 函数
SELECT cust_id, order_num FROM orders WHERE Year(order_date) = 2005 AND Month(order_date) = 9;

```

#### 注意

- 使用日期过滤，日期必须为 yyyy-mm-dd ,这样能排除一些歧义，年份也应该使用 4 位数字，更加可靠。

### 数值处理函数

| 函 数  | 说 明              |
| ------ | ------------------ |
| Abs()  | 返回一个数的绝对值 |
| Sin()  | 返回一个角度的正弦 |
| Cos()  | 返回一个角度的余弦 |
| Tan()  | 返回一个角度的正切 |
| Exp()  | 返回一个数的指数值 |
| Mod()  | 返回除操作的余数   |
| Pi()   | 返回圆周率         |
| Rand() | 返回一个随机数     |
| Sqrt() | 返回一个数的平方根 |

---

<br>

## 汇总数据

| 函 数   | 说 明            |
| ------- | ---------------- |
| AVG()   | 返回某列的平均值 |
| COUNT() | 返回某列的行数   |
| MAX()   | 返回某列的最大值 |
| MIN()   | 返回某列的最小值 |
| SUM()   | 返回某列值之和   |

```sql
### 计算出 products 表中所有产品的平均价格
SELECT AVG(prod_price) AS avg_price FROM products;
+-----------+
| avg_price |
+-----------+
| 16.133571 |
+-----------+

### 查看 customers 表中所有客户的总数
SELECT COUNT(*) AS num_cust FROM customers;
+----------+
| num_cust |
+----------+
|        5 |
+----------+
### 只对具有电子邮件地址的客户计数
SELECT COUNT(cust_email) AS num_cust FROM customers;
+----------+
| num_cust |
+----------+
|        3 |
+----------+

### 计算出订单号为 20005 的物品总数
SELECT SUM(quantity) AS items_ordered FROM orderitems WHERE order_num = 20005;
+---------------+
| items_ordered |
+---------------+
|            19 |
+---------------+

### 多个聚集函数组合
SELECT COUNT(*) AS num_items, MIN(prod_price) AS price_min, MAX(prod_price) AS price_max, AVG(prod_price) AS price_avg FROM products;
+-----------+-----------+-----------+-----------+
| num_items | price_min | price_max | price_avg |
+-----------+-----------+-----------+-----------+
|        14 |      2.50 |     55.00 | 16.133571 |
+-----------+-----------+-----------+-----------+
```

### 参数 ALL 和 DISTINCT

使用 DISTINCT 参数时，只会计算包含不同的值的行，如果指定参数为 ALL 或者不指定参数，默认参数为 ALL ，会计算所有的行。

```sql
### 看一下产品表里有多少家供应商，因为有可能一家供应商提供很多产品。
### 全部的行
SELECT COUNT(vend_id) AS vend_count FROM products;
+------------+
| vend_count |
+------------+
|         14 |
+------------+
### 去重后就知道有 4 家供应商
SELECT COUNT(DISTINCT vend_id) AS vend_count FROM products;
+------------+
| vend_count |
+------------+
|          4 |
+------------+
```

### 注意

- AVG() 只能用来确定 **单个** 特定数值列的平均值，而且列名必须作为函数参数传入，想获取多个列的平均值，必须使用多个 AVG() 函数。
- AVG() 函数忽略列值为 NULL 的行。
- COUNT(\*) 对表中行的数目进行计数， 不管列中是空值（NULL）还是非空值。
- 使用 COUNT(column) 对特定列中具有值的行进行计数，会忽略 NULL 值。
- MAX() 函数会忽略值为 NULL 的行（MIN()也是）。它一般是用来找出最大的数值和日期值，但是也可以对非数值的数据使用，例如返回文本列中的最大值，MAX() 会返回最后一行（MIN
  () 会返回第一行）。
- SUM() 函数会忽略值为 NULL 的行
- 在表示某个聚集函数的结果时，不应该使用表中实际的列明，最好是指定别名，这样便于理解和使用。

---

<br>

## 分组数据

### 数据分组

```sql
SELECT vend_id, prod_price FROM products GROUP BY vend_id, prod_price;
```

- GROUP BY 子句后面可以加多个列。
- SELECT 子句中的列名必须为分组列或列函数（聚集计算语句除外），例如 按照 vend_id, prod_price 分组，SELECT 后面检索的列必须是 vend_id, prod_price。
- 列函数对于 GROUP BY 子句定义的每个组各返回一个结果，例如取最大值时，就是每个组的最大值。
- 如果分组列中有 NULL 值，则 NULL 将作为一个分组返回，如果列中有多行 NULL 值，它们将分为一组。
- GROUP BY 子句必须在 WHERE 子句之后， ORDER BY 子句之前。

### 过滤分组

```sql
### 列出至少有两个订单的所有顾客
SELECT cust_id, COUNT(*) AS orders FROM orders GROUP BY cust_id HAVING COUNT(*) >= 2;

### 列出具有2个（含）以上、价格为10（含）以上的产品的供应商
SELECT vend_id, COUNT(*) AS num_prods FROM products WHERE prod_price >= 10 GROUP BY vend_id HAVING COUNT(*) >= 2;

### 列出总计订单价格大于等于50的订单，并按照总价排序
SELECT order_num, SUM(quantity*item_price) AS ordertotal FROM orderitems GROUP BY order_num HAVING SUM(quantity*item_price) >= 50 ORDER BY ordertotal;
+-----------+------------+
| order_num | ordertotal |
+-----------+------------+
|     20006 |      55.00 |
|     20008 |     125.00 |
|     20005 |     149.87 |
|     20007 |    1000.00 |
+-----------+------------+
```

- HAVING 跟 WHERE 类似，但是 WHERE 在数据分组前进行过滤，HAVING 在数据分组后进行过滤。

### SELECT 子句顺序

SELECT > FROM > WHERE > GROUP BY > HAVING > ORDER BY > LIMIT

---

<br>

## 使用子查询

假设要列出订购物品 TNT2 的所有客户。我们可以拆分出下面三步。

1. 检索包含物品 TNT2 的所有订单的编号。
2. 检索具有前一步骤列出的订单编号的所有客户的 ID。
3. 检索前一步骤返回的所有客户 ID 的客户信息。

```sql
SELECT cust_name, cust_contact FROM customers
WHERE cust_id IN (SELECT cust_id FROM orders
WHERE order_num IN (SELECT order_num FROM orderitems WHERE prod_id = 'TNT2'));
+----------------+--------------+
| cust_name      | cust_contact |
+----------------+--------------+
| Coyote Inc.    | Y Lee        |
| Yosemite Place | Y Sam        |
+----------------+--------------+
```

假设需要显示 customers 表中每个客户的订单总数，我们可以查分出下面两步。

1. 从 customers 表中检索客户列表。
2. 对于检索出的每个客户，统计其在 orders 表中的订单数目。

```sql
SELECT cust_name, cust_contact,
(SELECT COUNT(*) FROM orders WHERE orders.cust_id = customers.cust_id) AS orders
FROM customers ORDER BY cust_name;
+----------------+--------------+--------+
| cust_name      | cust_contact | orders |
+----------------+--------------+--------+
| Coyote Inc.    | Y Lee        |      2 |
| E Fudd         | E Fudd       |      1 |
| Mouse House    | Jerry Mouse  |      0 |
| Wascals        | Jim Jones    |      1 |
| Yosemite Place | Y Sam        |      1 |
+----------------+--------------+--------+
```

---

<br>

## 联结表

```sql
### 等值联结（equi join），它基于两个表之间的相等测试。这种联结也称为 内部联结。
SELECT vend_name, prod_name, prod_price FROM vendors, products WHERE vendors.vend_id = products.vend_id ORDER BY vend_name, prod_name;


### 内部联结的语法
SELECT vend_name, prod_name, prod_price FROM vendors INNER JOIN products ON vendors.vend_id = products.vend_id ORDER BY vend_name, prod_name;


### 上面提到用子查询，返回订购产品 TNT 的客户列表，现在改成联结表的方式，可以跟子查询的方式对比一下。
SELECT cust_name, cust_contact FROM customers, orders, orderitems WHERE customers.cust_id = orders.cust_id AND orders.order_num = orderitems.order_num AND prod_id = 'TNT2';
```

### 注意

- 应该保证所有的联结都有 WHERE 子句，否则 MySQL 将返回比想要的数据多得多的数据。

---

<br>

## 创建高级联结

### 表别名和自联结

```sql
### 使用表别名，返回订购产品 TNT 的客户列表
SELECT cust_name, cust_contact FROM customers AS c, orders AS o, orderitems AS oi WHERE c.cust_id = o.cust_id AND o.order_num = oi.order_num AND prod_id = 'TNT2';

### 使用自联结，查找商品 ID 为 DTNTR 的供应商供应的所有产品
SELECT p1.prod_id, p1.prod_name FROM products AS p1, products AS p2 WHERE p1.vend_id = p2.vend_id AND p2.prod_id = 'DTNTR';
```

### 外部联结

外部联结包含了那些在相关表中没有关联行的行，外部联结的两种基本形式：左外部联结(LEFT OUTER JOIN 即 LEFT JOIN)和右外部联结。它们之间唯一差别是所关联的表的顺序不同。更具体可以看一下 [JOIN 详解](https://segmentfault.com/a/1190000015572505)。

```sql
### 列出每个客户下的订单，包括那些至今未下订单的客户
SELECT customers.cust_id, orders.order_num FROM customers LEFT JOIN orders ON customers.cust_id = orders.cust_id;
+---------+-----------+
| cust_id | order_num |
+---------+-----------+
|   10001 |     20005 |
|   10001 |     20009 |
|   10002 |      NULL |
|   10003 |     20006 |
|   10004 |     20007 |
|   10005 |     20008 |
+---------+-----------+

#### 对每个用户下的订单计数，包括那些至今没下订单的客户
SELECT c.cust_name, c.cust_id, COUNT(o.order_num) AS order_count FROM customers AS c LEFT JOIN orders AS o ON c.cust_id = o.cust_id GROUP BY c.cust_id;
+----------------+---------+-------------+
| cust_name      | cust_id | order_count |
+----------------+---------+-------------+
| Coyote Inc.    |   10001 |           2 |
| Mouse House    |   10002 |           0 |
| Wascals        |   10003 |           1 |
| Yosemite Place |   10004 |           1 |
| E Fudd         |   10005 |           1 |
+----------------+---------+-------------+
```

---

<br>

### 组合查询

MySQL 允许执行多个查询（多条 SELECT 语句），并将结果作为单个查询结果集返回。这些组合查询称为并（union） 或 复合查询（compound query）。

有两种基本情况，其中需要使用组合查询：

- 在单个查询中从不同的表返回类似结构的数据；
- 对单个表执行多个查询，按单个查询返回数据。

```sql
### 查询价格小于等于5的所有物品并且查出供应商 1001 和 1002 生产的所有物品（不考虑价格）

### 先用 WHERE 多个子句来实现。
SELECT vend_id, prod_id, prod_price FROM products WHERE prod_price <= 5 OR vend_id IN (1001,1002);

### 使用组合查询实现，会自动去除重复的行
SELECT vend_id, prod_id, prod_price FROM products WHERE prod_price <= 5 UNION SELECT vend_id, prod_id, prod_price FROM products WHERE vend_id IN (1001, 1002);

### 使用组合查询查所有符合条件的列
SELECT vend_id, prod_id, prod_price FROM products WHERE prod_price <= 5 UNION ALL SELECT vend_id, prod_id, prod_price FROM products WHERE vend_id IN (1001, 1002);

### 组合查询排序
SELECT vend_id, prod_id, prod_price FROM products WHERE prod_price <= 5 UNION SELECT vend_id, prod_id, prod_price FROM products WHERE vend_id IN (1001, 1002) ORDER BY vend_id, prod_id;
```

### 注意

- UNION 必须由两条或两条以上的 SELECT 语句组成，语句之间用关键字 UNION 分隔。
- UNION 中的每个查询必须包含相同的列，表达式或聚集函数（不过各个列不需要以相同的次序列出）。
- 对组合查询结果排序时，只能使用一条 ORDER BY 子句，它必须出现在最后一条 SELECT 语句之后。

---

<br>

## 数据库索引

### **什么是数据库索引？**

通俗地说，**索引（Index）** 就像一本书的目录。当我们想找到一本书中特定的内容时，可以直接根据目录定位到具体的页码，而不需要从第一页开始逐页翻找。同样，在数据库中，索引是一种加速查询的结构，可以快速找到某些特定数据，而不需要扫描整个表。

### **为什么需要索引？**

假设有一个学生表（`students`），包含 10 万条学生信息。如果你想查找某个学生的名字，数据库默认会逐行扫描整个表（称为全表扫描，效率较低）。但如果你为 `name` 字段创建了索引，那么数据库可以直接通过索引快速找到对应的记录，而不需要遍历整个表。

### **索引的具体作用**

1. **加速查询**：让查询速度更快。
2. **加速排序**：索引可以帮助数据库快速对数据进行排序。
3. **提高多表查询效率**：在关联查询时，索引可以显著提高连接性能。

虽然索引能提升查询效率，但它也有 **缺点**：

- 索引会占用额外的存储空间。
- 索引会稍微降低数据的插入、删除和更新速度（因为需要维护索引结构）。

### **索引的分类**

以下是常见的几种索引类型，通俗解释和使用示例：

#### **1. 普通索引（Basic Index）**

- **通俗解释**：这是最常见的索引类型，用于加速查询操作。
- **示例**：假设有一张学生表 `students`，我们经常根据 `name` 查询学生信息。

```sql
-- 创建普通索引
CREATE INDEX idx_name ON students(name);

-- 查询某个学生的信息
SELECT * FROM students WHERE name = 'Alice';
```

**查询过程：**

- 如果没有索引，数据库会扫描整个表来查找 `name = 'Alice'` 的记录。
- 如果有索引，数据库会直接通过索引找到对应的记录。

#### **2. 唯一索引（Unique Index）**

- **通俗解释**：唯一索引除了加速查询，还能保证某个字段的值不能重复。
- **示例**：学生的学号（`student_id`）是唯一的，我们可以为它创建唯一索引。

```sql
-- 创建唯一索引
CREATE UNIQUE INDEX idx_student_id ON students(student_id);

-- 查询某个学号的学生信息
SELECT * FROM students WHERE student_id = '2023001';
```

**特点：**

- 如果你尝试插入重复的 `student_id`，数据库会报错，提示违反唯一约束。

#### **3. 主键索引（Primary Key Index）**

- **通俗解释**：主键是一种特殊的唯一索引，它不仅唯一，还不能为 `NULL`。
- **示例**：
  在设计学生表时，我们通常会将 `student_id` 设置为主键，确保每个学生都有唯一的学号。

```sql
-- 创建表时定义主键索引
CREATE TABLE students (
  student_id INT PRIMARY KEY, -- 主键会自动创建索引
  name VARCHAR(50),
  age INT
);

-- 查询某个学号的学生信息
SELECT * FROM students WHERE student_id = 12345;
```

**特点：**

- 主键自动创建索引。
- 每个表只能有一个主键。

#### **4. 复合索引（Composite Index）**

- **通俗解释**：复合索引是针对多个字段一起创建的索引，用于加速多条件查询。
- **示例**：假设我们经常根据学生的 `name` 和 `age` 两个条件查询信息。

```sql
-- 创建复合索引
CREATE INDEX idx_name_age ON students(name, age);

-- 查询某个名字和年龄的学生信息
SELECT * FROM students WHERE name = 'Alice' AND age = 20;
```

**注意：**

- 复合索引的字段顺序很重要，比如 `name` 在前，`age` 在后。
- 索引可以加速以下查询：
  ```sql
  SELECT * FROM students WHERE name = 'Alice';
  SELECT * FROM students WHERE name = 'Alice' AND age = 20;
  ```
  但对于只查询 `age` 的条件，如 `WHERE age = 20`，复合索引不起作用。

#### **5. 全文索引（Full-Text Index）**

- **通俗解释**：用于加速文本字段的模糊查询，比如搜索文章内容中的某个关键词。
- **示例**：假设我们有一张文章表 `articles`，需要根据内容中的关键词查找文章。

```sql
-- 创建全文索引
CREATE FULLTEXT INDEX idx_content ON articles(content);

-- 搜索包含 "database" 的文章
SELECT * FROM articles WHERE MATCH(content) AGAINST('database');
```

**特点：**

- 全文索引适用于大量文本数据的搜索。
- 比普通的 `LIKE '%keyword%'` 查询更高效。

#### **6. 聚集索引（Clustered Index）**

- **通俗解释**：聚集索引将数据的物理存储顺序与索引顺序保持一致。大多数数据库（如 MySQL 的 InnoDB 引擎）默认使用主键作为聚集索引。
- **特点**：
  - 一个表只能有一个聚集索引。
  - 查询主键或范围数据时性能非常高。

### **索引的使用示例**

假设有一个学生表 `students`，表结构如下：

| student_id | name    | age | grade |
| ---------- | ------- | --- | ----- |
| 1          | Alice   | 20  | A     |
| 2          | Bob     | 22  | B     |
| 3          | Charlie | 21  | A     |

#### 查询示例

1. **没有索引的查询：**

   ```sql
   SELECT * FROM students WHERE name = 'Alice';
   ```

   - 数据库会扫描整个表（全表扫描），逐行比较 `name` 是否等于 `'Alice'`。
   - 如果表有 10 万行，查询会很慢。

2. **有索引的查询：**
   ```sql
   CREATE INDEX idx_name ON students(name);
   SELECT * FROM students WHERE name = 'Alice';
   ```
   - 数据库会通过索引直接定位到 `name = 'Alice'` 的记录，显著提升查询速度。

### **索引可能带来的问题**

1. **插入/更新性能下降**：
   - 每次插入、更新或删除数据时，索引也需要同步更新，可能会导致性能下降。
2. **占用存储空间**：
   - 索引需要额外的磁盘空间，尤其是创建了多个索引时，存储开销会增加。
3. **错误使用复合索引**：
   - 如果复合索引的字段顺序不符合查询条件顺序，索引可能不起作用。

### **总结**

1. **索引是数据库优化的利器**，可以显著提升查询性能。
2. **常见类型**：
   - 普通索引：加速查询。
   - 唯一索引：加速查询并保证唯一性。
   - 复合索引：适合多条件查询。
   - 全文索引：适合文本搜索。
3. **使用注意事项**：
   - 不要对每个字段都创建索引，应该根据实际查询场景添加。
   - 索引会影响写入性能，所以需要平衡增删改与查询的性能需求。

---

<br>

## 全文本搜索

并非所有引擎都支持全文本搜索，例如 MyISAM 支持全文本搜索，InnoDB 不支持。

在创建表时启用全文本搜索， CREATE TABLE 语句接受 FULLTEXT 子句，它可以对后面的一个或多个表建立索引，MySQL 自动维护该索引，在增加、更新或删除行时，索引随之自动更新。FULLTEXT 也可以在表创建之后再指定。

```sql
### 看一下 productnotes 表的创建描述
CREATE TABLE `productnotes` (
  `note_id` int(11) NOT NULL AUTO_INCREMENT,
  `prod_id` char(10) NOT NULL,
  `note_date` datetime NOT NULL,
  `note_text` text,
  PRIMARY KEY (`note_id`),
  FULLTEXT KEY `note_text` (`note_text`)
) ENGINE=MyISAM AUTO_INCREMENT=115 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci

```

创建索引后就可以用 Match() 和 Against() 执行全文本搜索，其中 Match() 指定被搜索的列， Against() 指定要使用的搜索表达式。

```sql
### 搜索出 node_text 中包含 rabbit 的。

### 先用 LIKE 实现
SELECT note_text FROM productnotes WHERE note_text LIKE '%rabbit%';
+-----------------------------------------------+
| Quantity varies, …… for use as rabbit bait. |
| Customer complaint: rabbit has …… |
+-----------------------------------------------+

### 使用文本搜索实现，可以看到 rabbit 排在第三个词的文本比排在第20个词的文本排序高。
SELECT note_text FROM productnotes WHERE Match(note_text) Against('rabbit');
+-----------------------------------------------+
| Customer complaint: rabbit has …… |
| Quantity varies, …… for use as rabbit bait. |
+-----------------------------------------------+

### 可以使用下面的语句查看排序的等级
SELECT note_text, Match(note_text) Against('rabbit') AS rank1 FROM productnotes;
### 除了查出来的两个有数据，其他的等级都是0
| Customer complaint: rabbit has …… | 的等级是 1.6408053636550903
| Quantity varies, …… for use as rabbit bait. | 的等级是 1.5905543565750122


### 使用查询扩展 WITH QUERY EXPANSION ，找出所有提到 anvils 的注释，还要找出与当前搜索有关的所有其他行，即使它们不包含 anvils
SELECT note_text FROM productnotes WHERE Match(note_text) Against('anvils' WITH QUERY EXPANSION);
### 会返回7行，但是只有第一行有 anvils ,第二行虽然与 anvils 无关，但因为它包含了第一行的两个词，所以也被检索出来。

```

### 注意

- 传递给 Match() 的值必须与 FULLTEXT() 定义中的相同。如果指定多个列，必须列出他们，而且次序正确。
- 经过比较可以发现，文本搜索是默认带有排序的，LIKE 搜索出来的结果是随意的，按照查询的先后输出。
- 文本搜索的等级根据行中词的数目，唯一词的数目，整个索引中词的总数，以及包含该词的行的书目计算出来。
- 在索引全文本数据时，短词被忽略且从索引中排除。短词的定义时那些具有 3 个或 3 个一下字符的词（如果需要，这个数目可以改）
- 许多词出现的频率很高，搜索他们没用，MySQL 规定了一条 50% 规则，如果一个词出现 50%以上的行中，则将它作为一个非用词忽略。50%规则不用于 IN BOOLEAN MODE。
- 如果表中的行数少于 3 行，则全文本搜索不返回结果
- 忽略词中的单引号。例如，don't 索引为 dont
- 不具有词分隔符（包括日语和汉语）的语言不能恰当地返回全文本搜索结果

### 布尔文本查询

IN BOOLEAN MODE，即使没有 FULLTEXT 索引，也可以使用

```sql
### 匹配包含 heavy 但不包含任意以 rope 开始的词的行
SELECT note_text FROM productnotes WHERE Match(note_text) Against('heavy -rope*' IN BOOLEAN MODE);

### 匹配词 safe 和 combination, 降低后者的等级。
SELECT note_text FROM productnotes WHERE Match(note_text) Against('+safe +(<combination)' IN BOOLEAN MODE);
```

全文本布尔操作符

| 布尔操作符 | 说 明                                                                      |
| ---------- | -------------------------------------------------------------------------- |
| +          | 包含，词必须存在                                                           |
| -          | 排除，词必须不出现                                                         |
| >          | 包含，而且增加等级值                                                       |
| <          | 包含，且减少等级值                                                         |
| ()         | 把词组成子表达式（允许这些子表达式作为一个组被包含、排除、 排列等）        |
| ~          | 取消一个词的排序值                                                         |
| \*         | 词尾的通配符                                                               |
| ""         | 定义一个短语（与单个词的列表不一样，它匹配整个短语以便包含或排除这个短语） |

---

<br>

## 使用视图

视图仅仅是用来查看存储在别处的数据的一种设施，本身不包含数据，返回的数据都是从其他表中检索出来的，视图能更改数据格式和表示，最常见的应用就是重用 SQL 语句，简化复杂的 SQL 操作。

### 操作视图

CREATE VIEW 创建视图

SHOW CREATE VIEW viewname 查看创建视图的语句

DROP VIEW viewname 删除视图

更新视图时，可以先 DROP 然后再 CREATE 或者使用 CREATE OR REPLACE VIEW

```sql
### 之前有用联表查询 prod_id 是 TNT2的购买用户信息，但是如果还想看 prod_id 是其他值的时，还得重新查一遍，这样的场景就能用到视图了。

### 创建一个包含 cust_name, cust_contact, prod_id 的视图
CREATE VIEW productcustomers AS SELECT cust_name, cust_contact, prod_id FROM customers, orders, orderitems WHERE customers.cust_id = orders.cust_id AND orderitems.order_num = orders.order_num;

### 现在就能看到 productcustomers 视图能查询的信息了
select * from productcustomers;
+----------------+--------------+---------+
| cust_name      | cust_contact | prod_id |
+----------------+--------------+---------+
| Coyote Inc.    | Y Lee        | ANV01   |
| Coyote Inc.    | Y Lee        | ANV02   |
| Coyote Inc.    | Y Lee        | TNT2    |
| Coyote Inc.    | Y Lee        | FB      |
| Coyote Inc.    | Y Lee        | FB      |
| Coyote Inc.    | Y Lee        | OL1     |
| Coyote Inc.    | Y Lee        | SLING   |
| Coyote Inc.    | Y Lee        | ANV03   |
| Wascals        | Jim Jones    | JP2000  |
| Yosemite Place | Y Sam        | TNT2    |
| E Fudd         | E Fudd       | FC      |
+----------------+--------------+---------+

### 如果想再查询出 prod_id 为 TNT2 的客户信息就很简单了
SELECT cust_name, cust_contact FROM productcustomers WHERE prod_id = 'TNT2';
+----------------+--------------+
| cust_name      | cust_contact |
+----------------+--------------+
| Coyote Inc.    | Y Lee        |
| Yosemite Place | Y Sam        |
+----------------+--------------+
```

### 注意

- 视图必须唯一命名（不能跟别的视图和表重名）
- 对于可以创建的视图数量没有限制。
- 视图可以嵌套，即可以利用从其他视图中检索数据的查询来构造一个新的视图。
- ORDER BY 可以用在视图中，但如果从该视图检索数据的 SELECT 中也含有 ORDER BY ，那么视图中的 ORDER BY 会被覆盖。
- 视图不能索引，也不能有关联的触发器或默认值。
- 视图可以和表一起使用。
- 视图一般用于检索（SELECT）而不用于更新（INSERT, UPDATE, DELETE），因为更新一个视图相当于更新其基表，如果不能正确地确定被更新的基数据，则不允许更新。

---

<br>

## 使用存储过程

使用存储过程主要有三个好处，简单，安全，高性能。

MySQL 称存储过程的执行为调用，因此 MySQL 执行存储过程的语句为 CALL。CALL 接受存储过程的名字以及需要传递给它的任意参数。

### 简单例子

```sql
### 创建名为 productpricing 的存储过程 如果存储过程接受参数，它们将在 productpricing () 这个括号中列举出来。
DELIMITER //

CREATE PROCEDURE productpricing()
BEGIN
SELECT Avg(prod_price) AS priceaverage FROM products;
END//


### 调用存储过程，仿佛在调用函数
CALL productpricing;
+--------------+
| priceaverage |
+--------------+
|    16.133571 |
+--------------+


### 删除存储过程
DROP PROCEDURE productpricing;

### 检查存储过程
SHOW CREATE PROCEDURE productpricing;
```

### 有参数的例子

```sql
### 创建存储过程
DELIMITER //
CREATE PROCEDURE productpricing (
  OUT pl DECIMAL(8,2),
  OUT ph DECIMAL(8,2),
  OUT pa DECIMAL(8,2)
)
BEGIN
  SELECT Min(prod_price) INTO pl FROM products;
  SELECT Max(prod_price) INTO ph FROM products;
  SELECT Avg(prod_price) INTO pa FROM products;
END //


### 调用存储过程
CALL productpricing(@pricelow,@pricehigh,@priceaverage);

### 查看3个变量
SELECT @pricelow,@pricehigh,@priceaverage;
+-----------+------------+---------------+
| @pricelow | @pricehigh | @priceaverage |
+-----------+------------+---------------+
|      2.50 |      55.00 |         16.13 |
+-----------+------------+---------------+
```

### 建立智能存储过程

需要获取订单合计，并且对某些顾客的合计增加营业税。

```sql
### 存储过程全过程
DELIMITER //

-- Name: ordertotal
-- Parameters: onumber = order number
--             taxable = 0 if not taxable, 1 if taxable
--             ototal = order total variable

CREATE PROCEDURE ordertotal (
  IN onumber INT,
  IN taxable BOOLEAN,
  OUT ototal DECIMAL(8,2)
 ) COMMENT 'Obtain order total, optionally adding tax'
 BEGIN

  -- Declare variable for total
  DECLARE total DECIMAL(8,2);
  -- Declare tax percentage
  DECLARE taxrate INT DEFAULT 6;

  -- Get the order total
  SELECT Sum(item_price*quantity) FROM orderitems WHERE order_num = onumber INTO total;

  -- Is this taxable
  IF taxable THEN
  -- Yes, so add taxrate to the total
    SELECT total+(total/100*taxrate) INTO total;
  END IF;

  -- And finally, save to out variable
  SELECT total INTO ototal;

 END //


 ### 调用，看一下 order number 是 20005 订单关于加不加营业税的区别
 ### 不加营业税
 CALL ordertotal(20005, 0, @total);
 SELECT @total;
+--------+
| @total |
+--------+
| 149.87 |
+--------+

### 加营业税
CALL ordertotal(20005, 1, @total);
SELECT @total;
+--------+
| @total |
+--------+
| 158.86 |
+--------+
```

上面代码中做些必要的解释

- 添加了两个 IN 类型参数，其中 taxable 为布尔值。
- `--` 添加注释，在存储过程复杂是，注释很有必要。
- `DECLARE` 定义局部变量，需要指定变量名和数据类型，支持可选的默认值
- `COMMENT` 关键字，不是必需的，如果添加了，在 SHOW PROCEDURE STATUS 的结果中显示。

### 注意

- 如果在 mysql 命令行中创建存储过程的话，需要临时更改命令行实用程序的语句分隔符，因为创建存储过程会使用 ; 作为语句分隔符，这会导致语法报错。除了 \ 符号外，任何字符都可以用作语句分隔符。 可以使用 DELIMITER // 作为新的语句结束分隔符，但是创建完存储过程后，要记得用 DELIMITER ; 恢复为原来的语句分隔符。
- 存储过程在创建之后，被保存在服务器上以供使用，直至被删除。
- 如果删除不存在的存储过程时，会报错，可以使用 DROP PROCEDURE IF EXISTS ,只有当过程存在时才删除。
- MySQL 支持 IN（传递给存储过程）、OUT（从存储过程传出）、INOUT（对存储过程传入和传出）三种类型的参数。SELECT 检索出来的值通过 INTO 保存到相应的变量。特别注意，参数的数据类型不能是一个集合，所以例子中才用了三个参数输出 3 个数。
- 如果存储过程要求 3 个参数，就必须正好传递 3 个参数。
- `SHOW PROCEDURE STATUS` 可以列出所有存储过程，也可以使用 LIKE 指定一个过滤模式： `SHOW PROCEDURE STATUS LIKE 'ordertotal';`

---

<br>

## 使用游标

游标（cursor）是一个存储在 MySQL 服务器上的数据库查询，它不是一条 SELECT 语句，而是被该语句检索出来的结果集。

```sql

DELIMITER //

CREATE PROCEDURE processorders()
  BEGIN
    DECLARE done BOOLEAN DEFAULT 0;
    DECLARE o INT;
    DECLARE t DECIMAL(8,2);
    DECLARE ordernumbers CURSOR
    FOR
    SELECT order_num FROM orders;
    DECLARE CONTINUE HANDLER FOR SQLSTATE '02000' SET done = 1;
    CREATE TABLE IF NOT EXISTS ordertotals(order_num INT, total DECIMAL(8,2));
    OPEN ordernumbers;
    REPEAT
    FETCH ordernumbers INTO o;
    CALL ordertotal(o,1,t);
    INSERT INTO ordertotals(order_num,total) VALUES(o,t);
    UNTIL done END REPEAT;
    CLOSE ordernumbers;
  END//

DELIMITER ;

SELECT * FROM ordertotals;
+-----------+---------+
| order_num | total   |
+-----------+---------+
|     20005 |  158.86 |
|     20009 |   40.78 |
|     20006 |   58.30 |
|     20007 | 1060.00 |
|     20008 |  132.50 |
|     20008 |  132.50 |
+-----------+---------+
```

`DECLARE` 命名游标，并定义相应的 SELECT 语句，根据需要带 WHERE 和其他子句。

`OPEN ordernumbers;` 打开 ordernumbers 游标，在处理 OPEN 语句时执行查询，存储检索出的数据以供浏览和滚动。

`CLOSE ordernumbers;` 关闭 ordernumbers 游标，CLOSE 释放游标使用的所有内部内存和资源，因此在每个游标不再需要时都应该关闭，如果没有明确关闭游标，MySQL 将会在到达 END 语句时自动关闭它。在一个游标关闭后，如果没有重新打开，就不能使用它。但是，使用声明过的游标不需要再次声明，用 OPEN 语句打开就行。

`FETCH` 指定检索什么数据，检索出来的数据存储在什么地方。它还向前移动游标中的内部行指针，使下一条 FETCH 语句检索下一行。

`CONTINUE HANDLER` 是在条件出现时被执行的代码。上面 `SQLSTATE '02000'` 出现时 `SET done = 1`。`SQLSTATE '02000'`是一个未找到条件，上面指的是 REPEAT 由于没有更多的行供循环而不能继续时，出现这个条件。

### 注意：

- 跟其他的 DBMS 不同的是，MySQL 游标只能用于存储过程（和函数）
- 在使用游标前，必须声明（定义）游标。声明的过程实际上没有检索数据，它只是定义要使用的 SELECT 语句。
- 声明之后，如果要使用游标，必须打开游标。这个过程是用前面定义的 SELECT 语句把数据实际检索出来。
- 在结束游标使用时，必须关闭游标。

---

<br>

## 使用触发器

触发器是 MySQL 响应以下任意语句而自动执行的一条 MySQL 语句，（或位于 BEGIN 和 END 语句之间的一组语句）:

- DELETE;
- INSERT;
- UPDATE;

### 创建触发器遵循以下几点

- 唯一的触发器名；
- 触发器关联的表；
- 触发器应该响应的活动（DELETE、INSERT 和 UPDATE）；
- 触发器何时执行（处理之前或之后）

`CREATE TRIGGER` 新建触发器

`DROP TRIGGER` 删除触发器

### INSERT 触发器

- 在 INSERT 触发器代码内，可以引用一个名为 NEW 的虚拟表，访问被插入的行；
- 在 BEFORE INSERT 触发器中，NEW 中的值可以被更新（允许更改被插入的值）
- 对于 AUTO_INCREMENT 列， NEW 在 INSERT 执行之前包含 0，在 INSERT 执行之后包含新的自动生成值。

```sql
### 创建一个名为 neworder 的触发器，在插入一个新订单到 orders 表时，返回新的订单号放到变量@number中。
CREATE TRIGGER neworder AFTER INSERT ON orders FOR EACH ROW SELECT NEW.order_num;

INSERT INTO orders(order_date, cust_id) VALUES(Now(), 10001);
SELECT @number;
+---------+
| @number |
+---------+
|   20010 |
+---------+

```

### DELETE 触发器

- 在 DELETE 触发器代码内，可以引用一个名为 OLD 的虚拟表，访问被删除的行；
- OLD 中的值是只读的，不能更新。

### UPDATE 触发器

- 在 UPDATE 触发器代码内，可以引用一个名为 OLD 的虚拟表，访问以前（UPDATE 语句前）的值，引用一个名为 NEW 的虚拟表访问新更新的值；
- 在 BEFORE UPDATE 触发器中，NEW 中的值可以被更新（允许更改将要用于 UPDATE 语句中的值）
- OLD 中的值是只读的，不能更新。

```sql
### 创建一个名为 neworder 的触发器，在插入一个新订单到 orders 表时，返回新的订单号放到变量@number中。
CREATE TRIGGER neworder AFTER INSERT ON orders FOR EACH ROW SELECT NEW.order_num;

INSERT INTO orders(order_date, cust_id) VALUES(Now(), 10001);
SELECT @number;
+---------+
| @number |
+---------+
|   20010 |
+---------+

```

### 注意

- 只有表才支持触发器，视图不支持（临时表也不支持）。
- 触发器按每个表每个事件每次地定义，每个表每个事件每次只允许一个触发器。因此，每个表最多支持 6 个触发器（每条 INSERT、UPDATE 和 DELETE 的之前和之后）
- 单一触发器不能与多个事件或多个表关联，所以，如果需要一个对 INSERT 和 UPDATE 操作执行的触发器，就应该定义两个触发器。
- 如果 BEFORE 触发器失败，MySQL 将不执行请求的操作。如果 BEFORE 触发器或语句本身失败， MySQL 将不执行 AFTER 触发器（如果有的话）。
- MySQL 的 TRIGGER 和 FUNCTION 中不能出现 SELECT \* FROM table 形式的查询，因为其会返回一个结果集，而这在 MySQL 的 TRIGGER 和 FUNCTION 中是不可接受的，但是在存储过程中可以。在 TRIGGER 和 FUNCTION 中可以使用 SELECT ... INTO ... 形式的查询。
- 使用 TRIGGER 的时候没有 INTO 的时候会报这样一种错误 `not allowed to return a result set from a trigger`
- MySQL 触发器中不支持 CALL 语句，这表示不能从触发器内调用存储过程。所需的存储过程代码需要复制到触发器内。

---

<br>

## 管理事务处理

事务处理（transaction processing）可以用来维护数据库的完整性，它保证成批的 MySQL 操作要么完全执行，要么完全不执行。

事务处理是一种机制，用来管理必须成批执行的 MySQL 操作，以保证数据库不包含不完整的操作结果。使用事务处理，可以保证一组操作不会中途停止，它们要么整体执行，要么完全不执行（除非明确指示）如果没有错误发生，整租语句提交给（写到）数据库表。如果发生错误，则进行回退（撤销）以恢复数据库到某个已知且安全的状态。

- 事务（transaction）指一组 SQL 语句，语句 `START TRANSACTION`
- 回退（rollback） 指撤销指定的 SQL 语句的过程，语句 `ROLLBACK TO onename`
- 提交（commit） 指将未存储的 SQL 语句结果写入数据库表，语句 `COMMIT`
  - 一般的 MySQL 语句都是直接针对数据库表执行和编写的，提交（写或保存）操作是自动进行的，这就是所谓的隐含提交（implicit commit）
  - 在事务处理中，提交不会隐含地进行，为了进行明确的提交，使用 COMMIT 语句
- 保留点（savepoint） 指事务处理中设置的临时占位符（place-holder）,你可以对它发布回退（与回退整个事务处理不同）。为了支持回退部分事务处理，必须能在事务处理块中合适的位置放置保留点，这样，如果需要回退，可以回退到某个占位符，即某个保留点。语句： `SAVEPOINT onename`

假设一个场景：系统添加订单的过程

1. 检查数据库中是否存在相应的客户（从 customers 表查询），如果不存在，添加 TA。
2. 检索客户的 ID
3. 添加一行到 orders 表，把它与客户 ID 关联
4. 检索 orders 表中赋予的新订单的 ID
5. 对于订购的每个物品在 orderitems 表中添加一行，通过检索出来的 ID 把它与 orders 表关联（以及通过产品 ID 与 products 表关联）

现在假如由于某种数据库故障（如超出磁盘空间、安全限制、表锁等）阻止了这个过程的完成，如果发生在添加客户之后，orders 表添加之前还好，但是如果故障发生在 orders 行添加之后，orderitems 行添加之前，那么数据库中就会有一个空订单，如果发生在添加 orderitems 行中出现的故障，那数据库就可能有不完整的订单，而且这个不完整的订单还不会被发现。

所以我们要把过程改一下：

1. 检查数据库中是否存在相应的客户（从 customers 表查询），如果不存在，添加 TA。
2. **提交**客户信息
3. 检索客户的 ID
4. 添加一行到 orders 表
5. 如果在添加行到 orders 表时出现故障，**回退**
6. 检索 orders 表中赋予的新订单 ID
7. 对于订购的每项商品，添加新行到 orderitems 表
8. 如果在添加新行到 orderitems 表时出现故障，**回退**所有添加的 orderitems 行和 orders 行
9. 提交订单信息

```sql

```

### 注意

- 当 COMMIT 和 ROLLBACK 语句执行后，事务会自动关闭（将来的更改会隐含提交）
- 每个保留点都要取一个唯一的名字，以便回退时，MySQL 知道要回退到何处。保留点尽量越多越好，这样就可以更灵活的回退。保留点在事务处理完成（执行一条 ROLLBACK 或 COMMIT）后自动释放。也可以使用 RELEASE SAVEPOINT 明确地释放保留点。

---

<br>

## 数据库维护

### 备份数据

#### mysqldump

mysqldump 是一个逻辑备份工具，复制原始的数据库对象定义和表数据产生一组可执行的 SQL 语句。在日常工作中，我们会使用 mysqldump 命令创建 SQL 格式的转存储文件来备份数据库，或者把数据导出后做数据迁移，主备搭建等操作。

```sql
# --user、-u 指定连接的用户名，--password、-p 连接数据库密码，--port、-P 连接数据库端口号


# --all-databases 会导出包括系统数据库在内的所有数据库
mysqldump -uroot -proot --all-databases > /tmp/all.sql
mysqldump -uroot -p --all-databases > /tmp/all.sql # 需要回车后输入密码

# --add-drop-database 在导出的备份文件中，在 CREATE DATABASE 语句前加上 DROP DATABASE 语句

# --add-drop-table 在导出的备份文件中，在 CREATE TABLE 语句前加上 DROP TABLE 语句

# --databases 导出database1、database2两个数据库的所有数据
mysqldump --user root --password=root --databases database1 database2 > /tmp/user.sql

# --tables 导出database1中的table1、table2表
mysqldump -uroot -proot --databases database1 --tables table1 table2  > /tmp/database1.sql

# --routines、-R 导出目标数据库里的触发器和函数
mysqldump  -uroot -proot --host=localhost --all-databases --routines

# --where、-w 只导出符合WHERE条件的记录。如果条件包含命令解释符专用空格或字符，一定要将条件引用起来，单引号和双引号都可以
mysqldump -uroot -proot --databases database1 --tables table1 --where='id=1'  > /tmp/table1.sql

# --no-data、-d 不导出任何数据，只导出数据库表结构
mysqldump -uroot -proot --no-data --databases database1 >/tmp/database1.sql

# --no-create-info、-t 只导出数据，导出的sql中不包含drop table,create table
mysqldump -uroot -proot --no-create-info --databases database1 --tables table1 --where="id='a'"  >/tmp/table1.sql

# --host、-h 需要导出的主机信息，跨服务器导出导入数据
mysqldump --host=h1 -uroot -proot --databases database1 |mysql --host=h2 -uroot -proot database2

```

#### 注意

- 导出指定表只能针对一个数据库进行导出，且导出的内容中和导出数据库也不一样，导出指定表的导出文本中没有创建数据库的判断语句，只有删除表-创建表-导入数据

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
mysql> SELECT DATABASE();
mysql> status;
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

| 级别     | 描述                                     |
| -------- | ---------------------------------------- |
| 0/LOW    | 只检查长度。                             |
| 1/MEDIUM | 检查长度、数字、大小写、特殊字符。       |
| 2/STRONG | 检查长度、数字、大小写、特殊字符字典文件 |

- [详见 mysql 密码策略设置](https://raydoom.github.io/work/mysql/2018/09/13/mysql-validate-password/)

- [MySQL8.0 SHOW VARIABLES 为 empty set 可看此文](http://blog.itpub.net/20893244/viewspace-2565368/)

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
