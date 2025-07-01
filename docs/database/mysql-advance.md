# MySQL 高级特性

## 视图、存储过程、游标、触发器和事务通俗讲解

### **一、视图（View）**

**通俗解释**：
视图是一个**虚拟表**，它不存储实际数据，而是基于 SQL 查询的结果。你可以把它想象成一个“快捷方式”，每次查询视图时，实际上是执行背后的 SQL 语句。

**示例**：
假设你经常需要查询“订单金额大于 1000 的客户信息”，可以创建视图：

```sql
CREATE VIEW high_value_orders AS
SELECT customers.customer_id, customers.name, orders.order_amount
FROM customers
JOIN orders ON customers.customer_id = orders.customer_id
WHERE orders.order_amount > 1000;
```

**使用视图**：

```sql
SELECT * FROM high_value_orders;
```

**优点**：

- 简化复杂查询，避免重复编写 SQL。
- 保护数据：只暴露需要的字段，隐藏敏感信息（如密码）。

### **二、存储过程（Stored Procedure）**

**通俗解释**：
存储过程是一组预先编译好的 SQL 语句，存储在数据库中，可以像函数一样调用。它类似于程序中的“子程序”，可以接收参数并返回结果。

**示例**：
创建一个计算订单总额的存储过程：

```sql
DELIMITER //

CREATE PROCEDURE CalculateOrderTotal(IN order_id INT, OUT total DECIMAL(10,2))
BEGIN
  SELECT SUM(quantity * price) INTO total
  FROM order_items
  WHERE order_id = order_id;
END //

DELIMITER ;
```

**调用存储过程**：

```sql
CALL CalculateOrderTotal(123, @total);
SELECT @total; -- 输出订单总额
```

**优点**：

- 减少网络开销：一次性执行多条 SQL。
- 提高安全性：通过权限控制，用户只能调用存储过程，无法直接访问表。

### **三、游标（Cursor）**

**通俗解释**：
游标是一种**逐行处理数据**的机制。当查询返回多行结果时，游标可以像指针一样，依次指向每一行数据，让你可以对每行单独处理。

**示例**：
遍历所有客户，为每个客户生成一条问候语：

```sql
DELIMITER //

CREATE PROCEDURE GreetCustomers()
BEGIN
  DECLARE done INT DEFAULT 0;
  DECLARE customer_name VARCHAR(100);

  -- 声明游标
  DECLARE customer_cursor CURSOR FOR
  SELECT name FROM customers;

  -- 异常处理：当没有更多数据时，设置 done=1
  DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

  OPEN customer_cursor;

  customer_loop: LOOP
    FETCH customer_cursor INTO customer_name;
    IF done THEN
      LEAVE customer_loop;
    END IF;

    -- 打印问候语（实际应用中可替换为其他操作）
    SELECT CONCAT('Hello, ', customer_name, '!') AS greeting;
  END LOOP;

  CLOSE customer_cursor;
END //

DELIMITER ;
```

**注意**：
游标逐行处理效率较低，尽量用 SQL 批量操作替代（如 `UPDATE`、`INSERT`）。

### **四、触发器（Trigger）**

**通俗解释**：
触发器是一种**自动执行的特殊程序**，当数据库发生特定事件（如插入、更新、删除）时，会自动触发执行。

**示例**：
每当插入新订单时，自动更新客户的订单数量：

```sql
DELIMITER //

CREATE TRIGGER update_customer_orders
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
  UPDATE customers
  SET order_count = order_count + 1
  WHERE customer_id = NEW.customer_id;
END //

DELIMITER ;
```

**触发时机**：

- `AFTER INSERT`：插入数据后触发。
- `BEFORE UPDATE`：更新数据前触发（可用于数据校验）。

**优点**：

- 自动维护数据一致性（如更新统计字段）。
- 记录审计日志（如记录谁修改了数据）。

### **五、事务（Transaction）**

**通俗解释**：
事务是一组**不可分割的 SQL 操作**，要么全部成功，要么全部失败。就像银行转账，从 A 账户扣钱和给 B 账户加钱必须同时成功，否则就回滚到初始状态。

**示例**：

```sql
START TRANSACTION; -- 开始事务

UPDATE accounts SET balance = balance - 100 WHERE account_id = 1; -- A 账户扣款
UPDATE accounts SET balance = balance + 100 WHERE account_id = 2; -- B 账户加钱

-- 检查是否有错误，有则回滚，无则提交
IF (SELECT balance FROM accounts WHERE account_id = 1) < 0 THEN
  ROLLBACK; -- 回滚事务，撤销所有操作
ELSE
  COMMIT; -- 提交事务，永久保存操作
END IF;
```

**四大特性（ACID）**：

- **原子性（Atomicity）**：事务中的操作要么全做，要么全不做。
- **一致性（Consistency）**：事务执行前后，数据库状态保持一致（如总金额不变）。
- **隔离性（Isolation）**：多个事务相互隔离，互不干扰。
- **持久性（Durability）**：一旦提交，数据永久保存。

### **六、总结对比**

| **概念** | **作用**             | **类比**       | **适用场景**               |
| -------- | -------------------- | -------------- | -------------------------- |
| 视图     | 简化查询，虚拟表     | 快捷方式       | 频繁查询复杂数据           |
| 存储过程 | 预编译 SQL 集合      | 程序中的函数   | 复杂业务逻辑，多次复用     |
| 游标     | 逐行处理数据         | 数组遍历的指针 | 必须逐行处理的场景         |
| 触发器   | 自动响应数据库事件   | 自动任务       | 数据自动维护、审计日志     |
| 事务     | 保证一组操作的原子性 | 银行转账       | 涉及多表修改，要求数据一致 |

---

<br>

## 使用视图详解

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

## 使用存储过程详解

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

## 使用游标详解

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

## 使用触发器详解

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
CREATE TRIGGER neworder AFTER INSERT ON orders FOR EACH ROW SELECT NEW.order_num INTO @number;

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
CREATE TRIGGER neworder AFTER INSERT ON orders FOR EACH ROW SELECT NEW.order_num INTO @number;

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

## 管理事务处理详解

事务处理（transaction processing）可以用来维护数据库的完整性，它保证成批的 MySQL 操作要么完全执行，要么完全不执行。

事务处理是一种机制，用来管理必须成批执行的 MySQL 操作，以保证数据库不包含不完整的操作结果。使用事务处理，可以保证一组操作不会中途停止，它们要么整体执行，要么完全不执行（除非明确指示）如果没有错误发生，整组语句提交给（写到）数据库表。如果发生错误，则进行回退（撤销）以恢复数据库到某个已知且安全的状态。

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
