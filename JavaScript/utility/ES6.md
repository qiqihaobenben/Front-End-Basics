## ES6 备忘录

### 1. 由块级作用域引出的一场变革

1、块级作用域又称词法作用域，存在于：

* 函数内部（函数作用域）
* 块中（字符 { 和 } 之间的区域）

<b style="color: #c03546">注意：ES6允许块级作用域任意嵌套</b>

```
{{{{{{let text = 'Hello World!'}}}}}}
```

#### 1.1 块级声明

块级声明是用于声明在指定块的作用域之外无法访问的变量。

#### 1.2 let声明：用来声明一个块级作用域变量

1. 声明的变量具有块级作用域的特性

```
// 例子一
function getValue (condition) {
    if (condition) {
        let value = 'blue';
        return value;
    }
    console.log(value)
    // 报错 value is not defined
}
getValue()  

// 例子二
{{{{{
  {let value = 'red';}
  console.log(value)
  // 报错 value is not defined
}}}}}
```

2. 在同一个作用域内不能使用let声明同名的变量

```
// 不管是var,const或者let,新的let声明之前同名的变量，都会报错
var count = 30;
let count = 40; 
// 报错 Identifier 'count' has already been declared

// 函数形参和函数内部的let声明变量重名，报错
function test(value) {
    let value = 3;
}
test() 
// 报错 Identifier 'value' has already been declared

// 在不同的作用域声明的变量重名是没问题的
let count = 30;
if(true) {
  let count = 40; 
  // 不同的作用域，不会报错
}

{{{{{
    {let count = 30;}
    let count = 40;
    // 不同作用域，不会报错
}}}}}

```

3. 声明没有预解析，不存在变量提升，有“临时死区”(TDZ)

从块的开始到变量声明这段的区域被称为临时死区，ES6明确规定，如果区块中存在let和const命令，则这个区块对这些命令声明的变量从一开始就形成封闭作用域，只要在声明之前就使用这些变量（赋值，引用等等），就会报错。

```
if(true) {
    console.log(typeof value);
    // 报错 value is not defined

    let value = 'blue';
}
```

<b style="color: #c03546">注意：TDZ是区域是“块开始”到“变量声明”，下面的例子不报错</b>

```
// typeof 说是相对安全，确实是，永远拿不到想要的结果
console.log(typeof value);
if(true) {
    let value = 'red';
}
```

#### 1.3 const声明：声明常量（如PI），值一旦被设定后不可更改
1. 常量声明的值是不可变的

<b style="color: #c03546">注意：const声明的对象不允许修改绑定，但可以修改该对象的属性值。</b>

```
const number = 6;
number = 5;
// 报错 Assignment to constant variable

const obj = {number: 1};
obj.number = 2; // 不报错

obj = {number: 3};
// 报错 Assignment to constant variable
```

2. 因为常量声明后值就不可更改了，所以声明时必须赋值

```
// 有效的常量
const count = 30;

// 报错 Missing initializer in const declaration
const name;
```

3. 声明的常量具有块级作用域的特性

```
if(true) {
    const number = 5;
}
console.log(number)
// 报错 number is not defined
```

4. 在同一个作用域内不能使用const声明同名的变量

```
var message = 'Hello';
let age = 25;

// 这两条语句都会报错
const message = 'Good';
const age = 30;
```






