# MySQL 学习考察题目

以下是基于本目录下的资料设计的 30 道 MySQL 学习考察题目，涵盖字段类型、SQL 操作、优化和概念性知识点，结合了您创建的数据库表结构（customers/products/employees/sales）。

---

### **一、字段类型与设计（8 题）**

1. 在`products`表中，`price`字段应选择什么数值类型最合适？为什么不能使用 FLOAT？
2. 若要在`customers`表中存储用户的出生日期（精确到日期），应选用 DATE 还是 DATETIME？说明理由。
3. 如何修改`employees`表的`hire_date`字段，使其能自动记录数据插入的时间？
4. `sales`表的`quantity`字段若设计为 TINYINT 类型会有什么风险？应如何优化？
5. 如何为`products`表的`description`字段选择文本类型？TEXT 和 VARCHAR(1000)有何区别？
6. ENUM('ACTIVE','INACTIVE')和 SET 类型在存储状态字段时有何本质区别？
7. 为什么在`customers`表的`email`字段上使用 VARCHAR(255)而不是 CHAR(255)？
8. TIMESTAMP 和 DATETIME 在存储'2038-01-19 03:14:07'时会有什么不同现象？

---

### **二、SQL 基础操作（12 题）**

9. 查询`customers`表中所有来自"Detroit"且名字以"C"开头的客户：

10. 更新`products`表中价格低于 50 的所有产品，价格增加 10%：

11. 计算每个员工的销售总额（需连接`employees`和`sales`表）：
    ```sql
    SELECT e.employee_id, e.first_name, SUM(s.quantity * p.price) AS total_sales
    FROM employees e
    JOIN sales s ON e.employee_id = s.employee_id
    JOIN products p ON s.product_id = p.product_id
    GROUP BY e.employee_id;
    ```
12. 删除`customers`表中没有购买记录（在`sales`表无关联数据）的客户：
    ```sql
    DELETE FROM customers
    WHERE customer_id NOT IN (SELECT DISTINCT customer_id FROM sales);
    ```
13. 查询价格最高的 3 个产品及其类别（使用排序和 LIMIT）：
    ```sql
    SELECT name, category, price
    FROM products
    ORDER BY price DESC
    LIMIT 3;
    ```
14. 统计每个城市的客户数量，并按数量降序排列：
    ```sql
    SELECT city, COUNT(*) AS customer_count
    FROM customers
    GROUP BY city
    ORDER BY customer_count DESC;
    ```
15. 将新员工`('Alice', 'Smith', '2023-10-01')`插入`employees`表：
    ```sql
    INSERT INTO employees (first_name, last_name, hire_date)
    VALUES ('Alice', 'Smith', '2023-10-01');
    ```
16. 使用左连接查询所有产品及其销售数量（包括未销售的产品）：
    ```sql
    SELECT p.name, COALESCE(SUM(s.quantity), 0) AS total_quantity
    FROM products p
    LEFT JOIN sales s ON p.product_id = s.product_id
    GROUP BY p.product_id;
    ```
17. 在`sales`表中查询 2023 年 Q2（4 月-6 月）的销售记录：
    ```sql
    SELECT * FROM sales
    WHERE sale_date BETWEEN '2023-04-01' AND '2023-06-30';
    ```
18. 为`products`表添加索引加速按`category`的查询：
    ```sql
    CREATE INDEX idx_category ON products(category);
    ```
19. 计算每位客户的平均购买金额（需连接 customers/sales/products 表）：
    ```sql
    SELECT c.customer_id, c.name, AVG(s.quantity * p.price) AS avg_spent
    FROM customers c
    JOIN sales s ON c.customer_id = s.customer_id
    JOIN products p ON s.product_id = p.product_id
    GROUP BY c.customer_id;
    ```
20. 使用 UNION 合并`customers`和`employees`表中的所有姓氏（last_name）：
    ```sql
    SELECT last_name FROM employees
    UNION
    SELECT SUBSTRING_INDEX(name, ' ', -1) AS last_name FROM customers;
    ```

---

### **三、优化与高级概念（10 题）**

21. **概念**：什么是覆盖索引（Covering Index）？举例说明其优势。
22. **场景**：当`SELECT * FROM sales WHERE employee_id = 100 AND sale_date > '2023-01-01'`执行缓慢时，如何通过索引优化？
23. **概念**：解释 ACID 原则中"原子性（Atomicity）"在 MySQL 事务中的体现。
24. **操作**：如何用 EXPLAIN 分析第 11 题查询的性能瓶颈？
25. **概念**：内连接（INNER JOIN） vs 左连接（LEFT JOIN）在结果集上有何本质区别？
26. **优化**：为什么在 WHERE 子句中使用`WHERE YEAR(sale_date) = 2023`会导致索引失效？应如何改写？
27. **概念**：什么是幻读（Phantom Read）？如何通过事务隔离级别避免？
28. **操作**：如何为`sales`表的`(customer_id, product_id)`创建复合索引？说明字段顺序选择依据。
29. **优化**：当`products`表数据量达到百万级时，如何优化`LIKE '%gadget%'`查询？
30. **概念**：简述乐观锁（Optimistic Lock）的实现原理及适用场景（参考 optimisim.md）。

---

### **答案解析要求**

- 操作题需写出完整 SQL 语句
- 概念题需用简洁语言说明核心点
- 优化题需解释原理及具体操作步骤

---

<br />
<br />
<br />
<br />
<br />
<br />
<br />

---

---

以下是针对 30 道 MySQL 学习题目的详细答案解析，涵盖字段类型、SQL 操作和优化概念，结合您创建的数据库表结构（customers/products/employees/sales）。

---

### 一、字段类型与设计（8 题）

1. **在`products`表中，`price`字段应选择什么数值类型最合适？为什么不能使用 FLOAT？**
   **答案**：

   - 最佳选择：`DECIMAL(10,2)`
   - 原因：
     - FLOAT 是浮点数类型，存在精度损失（如 0.1+0.2≠0.3）
     - DECIMAL 是定点数类型，精确存储金额等敏感数据
     - 示例：价格 99.99 用 DECIMAL 精确存储，FLOAT 可能存为 99.989999

2. **若要在`customers`表中存储用户的出生日期（精确到日期），应选用 DATE 还是 DATETIME？说明理由。**
   **答案**：

   - 选用`DATE`类型
   - 理由：
     - DATE 仅存储日期（YYYY-MM-DD），占 3 字节
     - DATETIME 存储日期+时间（YYYY-MM-DD HH:MM:SS），占 8 字节
     - 出生日期无需时间精度，DATE 更节省空间

3. **如何修改`employees`表的`hire_date`字段，使其能自动记录数据插入的时间？**
   **答案**：

   ```sql
   ALTER TABLE employees
   MODIFY hire_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
   ```

   - 原理：
     - `TIMESTAMP`支持自动时间戳
     - `DEFAULT CURRENT_TIMESTAMP`在插入时自动填充当前时间

4. **`sales`表的`quantity`字段若设计为 TINYINT 类型会有什么风险？应如何优化？**
   **答案**：

   - 风险：
     - TINYINT 范围：-128~127（有符号）或 0~255（无符号）
     - 单笔销售数量超过 255 会导致数据截断/错误
   - 优化：
     ```sql
     ALTER TABLE sales
     MODIFY quantity SMALLINT UNSIGNED;  -- 范围0~65535
     ```

5. **如何为`products`表的`description`字段选择文本类型？TEXT 和 VARCHAR(1000)有何区别？**
   **答案**：

   - 选择建议：
     - 长度 ≤65535 字符：用`VARCHAR(65535)`
     - 长度>65535 字符：用`TEXT`
   - 区别：
     | 特性 | VARCHAR(1000) | TEXT |
     |---------------|---------------------|--------------------|
     | 最大长度 | 定义长度（1000） | 65535 字符 |
     | 存储位置 | 表存储空间 | 溢出页 |
     | 排序性能 | 更快 | 较慢（需磁盘临时表）|
     | 默认值 | 支持 | 不支持 |

6. **ENUM('ACTIVE','INACTIVE')和 SET 类型在存储状态字段时有何本质区别？**
   **答案**：

   - `ENUM`：单选类型
     - 存储 1 个值（如'ACTIVE'）
     - 内部用整数（1 或 2）存储，占 1-2 字节
   - `SET`：多选类型
     - 存储多个值（如'ACTIVE,INACTIVE'）
     - 用位图存储，占 1-8 字节
   - 状态字段推荐用 ENUM（单状态）

7. **为什么在`customers`表的`email`字段上使用 VARCHAR(255)而不是 CHAR(255)？**
   **答案**：

   - 存储效率：
     - VARCHAR(255) 仅存储实际长度+1 字节（如"a@b.com"占 9 字节）
     - CHAR(255) 始终占 255 字符（浪费空间）
   - 性能：
     - VARCHAR 在变长数据中减少 I/O 操作
   - 最大长度：
     - 255 是 MySQL 单字段最大索引键长度（UTF8=767 字节）

8. **TIMESTAMP 和 DATETIME 在存储'2038-01-19 03:14:07'时会有什么不同现象？**
   **答案**：
   - `TIMESTAMP`：
     - 存储 UTC 时间（4 字节）
     - 最大时间'2038-01-19 03:14:07'（32 位溢出）
     - 存储该时间会报错或重置为 0
   - `DATETIME`：
     - 存储原始时间（8 字节）
     - 范围'1000-01-01'~'9999-12-31'
     - 可正常存储该时间

---

### 二、SQL 基础操作（12 题）

9. **查询`customers`表中所有来自"Detroit"且名字以"C"开头的客户：**
   **答案**：

   ```sql
   SELECT * FROM customers
   WHERE city = 'Detroit' AND name LIKE 'C%';
   ```

   - 说明：`LIKE 'C%'` 匹配以 C 开头的名字（区分大小写）

10. **更新`products`表中价格低于 50 的所有产品，价格增加 10%：**
    **答案**：

    ```sql
    UPDATE products
    SET price = price * 1.1
    WHERE price < 50;
    ```

    - 注意：确保启用事务避免误操作

11. **计算每个员工的销售总额（需连接`employees`和`sales`表）：**
    **答案**：

    ```sql
    SELECT e.employee_id, e.first_name,
           SUM(s.quantity * p.price) AS total_sales
    FROM employees e
    JOIN sales s ON e.employee_id = s.employee_id
    JOIN products p ON s.product_id = p.product_id
    GROUP BY e.employee_id;
    ```

    - 关键点：
      - 三表连接（employees → sales → products）
      - 聚合函数 SUM 计算总销售额

12. **删除`customers`表中没有购买记录（在`sales`表无关联数据）的客户：**
    **答案**：

    ```sql
    DELETE FROM customers
    WHERE customer_id NOT IN (
        SELECT DISTINCT customer_id
        FROM sales
    );
    ```

    - 优化方案：
      ```sql
      DELETE c FROM customers c
      LEFT JOIN sales s ON c.customer_id = s.customer_id
      WHERE s.sale_id IS NULL;
      ```

13. **查询价格最高的 3 个产品及其类别（使用排序和 LIMIT）：**
    **答案**：

    ```sql
    SELECT name, category, price
    FROM products
    ORDER BY price DESC
    LIMIT 3;
    ```

    - 性能：在 price 字段加索引可加速排序

14. **统计每个城市的客户数量，并按数量降序排列：**
    **答案**：

    ```sql
    SELECT city, COUNT(*) AS customer_count
    FROM customers
    GROUP BY city
    ORDER BY customer_count DESC;
    ```

    - 说明：`COUNT(*)`统计所有行，`COUNT(column)`忽略 NULL

15. **将新员工`('Alice', 'Smith', '2023-10-01')`插入`employees`表：**
    **答案**：

    ```sql
    INSERT INTO employees
    (first_name, last_name, hire_date)
    VALUES ('Alice', 'Smith', '2023-10-01');
    ```

    - 注意：若 hire_date 是 TIMESTAMP，可省略值（自动填充）

16. **使用左连接查询所有产品及其销售数量（包括未销售的产品）：**
    **答案**：

    ```sql
    SELECT p.name, COALESCE(SUM(s.quantity), 0) AS total_quantity
    FROM products p
    LEFT JOIN sales s ON p.product_id = s.product_id
    GROUP BY p.product_id;
    ```

    - 关键函数：`COALESCE`将 NULL 转为 0

17. **在`sales`表中查询 2023 年 Q2（4 月-6 月）的销售记录：**
    **答案**：

    ```sql
    SELECT * FROM sales
    WHERE sale_date BETWEEN '2023-04-01' AND '2023-06-30';
    ```

    - 替代方案：
      ```sql
      WHERE YEAR(sale_date)=2023 AND MONTH(sale_date) BETWEEN 4 AND 6
      ```

18. **为`products`表添加索引加速按`category`的查询：**
    **答案**：

    ```sql
    CREATE INDEX idx_category ON products(category);
    ```

    - 效果：加速`WHERE category='Electronics'`类查询

19. **计算每位客户的平均购买金额：**
    **答案**：

    ```sql
    SELECT c.customer_id, c.name,
           AVG(s.quantity * p.price) AS avg_spent
    FROM customers c
    JOIN sales s ON c.customer_id = s.customer_id
    JOIN products p ON s.product_id = p.product_id
    GROUP BY c.customer_id;
    ```

    - 说明：`AVG()`自动忽略 NULL 值

20. **使用 UNION 合并`customers`和`employees`表中的所有姓氏：**
    **答案**：
    ```sql
    -- 假设customers.name格式 "FirstName LastName"
    SELECT SUBSTRING_INDEX(name, ' ', -1) AS last_name
    FROM customers
    UNION
    SELECT last_name FROM employees;
    ```
    - 函数说明：`SUBSTRING_INDEX(name, ' ', -1)` 提取最后一个空格后的字符串

---

### 三、优化与高级概念（10 题）

21. **什么是覆盖索引（Covering Index）？举例说明其优势。**
    **答案**：

    - 定义：索引包含查询所需的所有字段
    - 示例：索引`(category, price)` 覆盖查询
      ```sql
      SELECT category, price FROM products WHERE category='Electronics'
      ```
    - 优势：
      - 无需回表查询数据文件
      - 减少 I/O 操作，提升查询速度

22. **当`SELECT * FROM sales WHERE employee_id=100 AND sale_date>'2023-01-01'`执行缓慢时，如何通过索引优化？**
    **答案**：

    ```sql
    CREATE INDEX idx_employee_date ON sales(employee_id, sale_date);
    ```

    - 原理：
      - 复合索引顺序匹配 WHERE 条件
      - 索引最左前缀原则生效
    - 验证：用 EXPLAIN 查看"Using index"

23. **解释 ACID 原则中"原子性（Atomicity）"在 MySQL 事务中的体现。**
    **答案**：

    - 定义：事务的所有操作要么全部提交，要么全部回滚
    - MySQL 实现：
      ```sql
      START TRANSACTION;
      UPDATE account SET balance=balance-100 WHERE id=1;
      UPDATE account SET balance=balance+100 WHERE id=2;
      COMMIT; -- 或 ROLLBACK;
      ```
    - 关键：InnoDB 的 undo log 保证回滚能力

24. **如何用 EXPLAIN 分析第 11 题查询的性能瓶颈？**
    **答案**：

    ```sql
    EXPLAIN SELECT e.employee_id, ... [第11题完整SQL]
    ```

    - 分析重点：
      | 列 | 优化点 |
      |-------------|------------------------|
      | type | 避免 ALL（全表扫描） |
      | key | 检查索引使用情况 |
      | rows | 估算扫描行数 |
      | Extra | 避免 Using filesort |

25. **内连接（INNER JOIN） vs 左连接（LEFT JOIN）在结果集上有何本质区别？**
    **答案**：
    | 连接类型 | 结果集规则 | 示例场景 |
    |--------------|------------------------------|----------------------------|
    | INNER JOIN | 仅返回两表匹配的行 | 查询有销售记录的员工 |
    | LEFT JOIN | 返回左表所有行+右表匹配行 | 查询所有员工（含无销售记录） |

    - 经典图解：
      ```
      INNER JOIN → [A∩B]
      LEFT JOIN  → [A] + [A∩B]
      ```

26. **为什么在 WHERE 子句中使用`WHERE YEAR(sale_date)=2023`会导致索引失效？应如何改写？**
    **答案**：

    - 失效原因：对列使用函数使索引失效
    - 优化改写：
      ```sql
      WHERE sale_date BETWEEN '2023-01-01' AND '2023-12-31'
      ```
    - 原理：BETWEEN 允许使用索引范围扫描

27. **什么是幻读（Phantom Read）？如何通过事务隔离级别避免？**
    **答案**：

    - 定义：事务中两次查询同一范围，出现新行（其他事务插入）
    - 解决方案：
      ```sql
      SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
      ```
    - InnoDB 机制：
      - REPEATABLE READ 级别下使用 Next-Key Locks 防止幻读

28. **如何为`sales`表的`(customer_id, product_id)`创建复合索引？说明字段顺序选择依据。**
    **答案**：

    ```sql
    CREATE INDEX idx_cust_prod ON sales(customer_id, product_id);
    ```

    - 顺序依据：
      1. 高区分度列在前（customer_id 通常比 product_id 值更多样）
      2. 匹配查询顺序（如 WHERE customer_id=1 AND product_id=5）
    - 验证：通过 EXPLAIN 和查询模式分析

29. **当`products`表数据量达到百万级时，如何优化`LIKE '%gadget%'`查询？**
    **答案**：

    - 方案 1：使用全文索引
      ```sql
      ALTER TABLE products ADD FULLTEXT(description);
      SELECT * FROM products WHERE MATCH(description) AGAINST('gadget');
      ```
    - 方案 2：前缀查询优化
      ```sql
      WHERE description LIKE 'gadget%'  -- 可用索引
      ```
    - 避免：`%gadget`和`%gadget%`无法使用索引

30. **简述乐观锁（Optimistic Lock）的实现原理及适用场景。**
    **答案**：
    - 原理：
      1. 读取数据时记录版本号（如 version=1）
      2. 更新时检查版本号：
         ```sql
         UPDATE products
         SET stock=stock-10, version=version+1
         WHERE product_id=100 AND version=1;
         ```
      3. 若影响行数=0，说明版本冲突需重试
    - 适用场景：
      - 读多写少（如商品库存）
      - 冲突概率低的并发环境

---

### 总结说明

1. **字段类型选择**：根据数据特性和存储需求选择类型（如 DECIMAL 精确计算，DATE 节省空间）
2. **SQL 操作核心**：
   - 多表连接时明确 JOIN 类型（INNER/LEFT）
   - 聚合查询配合 GROUP BY 和聚合函数
   - 利用索引优化 WHERE 和 ORDER BY
3. **高级优化**：
   - 索引设计遵循最左前缀原则
   - 避免索引失效操作（如函数处理列）
   - 事务控制保证数据一致性
4. **锁机制**：
   - 乐观锁适合低冲突场景
   - 悲观锁（SELECT FOR UPDATE）适合高冲突场景
