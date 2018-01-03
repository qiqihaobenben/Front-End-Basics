# JavaScript的面向对象

## JavaScript的对象

对象是JavaScript的一种数据类型。对象可以看成是属性的无序集合，每个属性都是一个键值对，属性名是字符串，因此可以把对象看成是从字符串到值的映射。这种数据结构在其他语言中称之为“散列(hash)”、“字典(dictionary)”、“关联数组(associative array)”等。  

原型式继承：对象不仅仅是字符串到值的映射，除了可以保持自有的属性，JavaScript对象还可以从一个称之为原型的对象继承属性，对象的方法通常是继承的属性，这是JavaScript的核心特征。  

JavaScript对象是动态的—可以新增属性也可以删除属性，但是他们常用来模拟静态以及静态类型语言中的“结构体”  

### 创建对象

#### 1、对象直接量

创建对象最简单的方式就是在JavaScript代码中使用对象直接量。
```
var book = {
            "main title": 'guide',  //属性名字里有空格，必须加引号
            "sub-title": 'JS',  //属性名字里有连字符，必须加引号
            for: 'development',  //for是关键字，不过从ES5开始，作为属性名关键字和保留字可以不加引号
            author: {
                firstname: 'David',  //这里的属性名就都没有引号
                surname: 'Flanagan'
            }
        }
```

**注意：** 从ES5开始，对象直接量中的最后一个属性后的逗号将被忽略。  

`扩展：` [JavaScript中的关键字和保留字
](http://blog.mingsixue.com/it/JS-keyword-reserved.html)

#### 2、通过new创建对象

`new` 运算符创建并初始化一个新对象。关键字new后跟一个函数调用。这里的函数称做构造函数(constructor)，构造函数用以初始化一个新创建的对象。JavaScript中的数据类型都包含内置的构造函数。

`var o = new Object();` //创建一个空对象，和{}一样。  
`var arr = new Array();` //创建一个空数组，和[]一样。  

>  **扩展 1：new**  

`new` 是一个一元运算符，专门运算函数的。new后面调用的函数叫做构造函数，构造函数new的过程叫做实例化。  
当new去调用一个函数 : 这个时候函数中的this就指向创建出来的对象,而且函数的的返回值直接就是this(隐式返回)  
有一个默认惯例就是构造函数的名字首字母大写。

*注意：*  
当return的时候，如果是后面为简单类型，那么返回值还是这个对象；  
如果return为对象类型，那么返回的就是return后面的这个对象。  

>  **扩展 2：基本类型和对象类型（复杂类型）的区别**  

**赋值：**  
基本类型 : 赋值的时候只是值的复制  
对象类型 : 赋值不仅是值的复制，而且也是引用的传递（可以理解为内存地址）可以理解为赋址。  

**比较相等**  
基本类型 : 值相同就可以  
对象类型 : 值和引用都相同才行  

> **扩展 3：原型 prototype**  

每一个JavaScript对象(null除外)都和另一个对象相关联，这个对象就是原型，每一个对象都从原型继承属性。

#### 3、Object.create()

`Object.create()` 这个方法是ES5定义的，它创建一个新对象，其中第一个参数是这个对象的原型。第二个参数是可选参数，用以对对象属性进行进一步描述。

可以通过传入参数 `null` 创建一个没有原型的新对象，不过这个新对象不会继承任何东西，甚至不包括基础方法。  
`var o = Object.create(null);` //o不会继承任何属性和方法,空空的。  

如果想创建一个普通的空对象，需要传入`Object.prototype`  
`var o = Object.create(Object.prototype);` //o相当于{}

### 对象属性的获取和设置

可以通过点(.)或方括号([])运算符来获取和设置属性的值。
```
var author = book.author;
var title = book["main title"];
```

在JavaScript中能用 `.` 连接的都可以用 `[]`连接。有很多 `.` 运算符不能用的时候，就需要用`[]`代替。  
1、在属性名可变的情况下用`[]`  
```
function getAttr (obj, attr) {
    console.log(obj[attr])
}
```

2、属性名有空格或者连字符等时用`[]`  
`var title = book["main title"];`  

### 删除属性

delete运算符可以删除对象的属性。  
delete只是断开属性和宿主对象的联系，而不会去操作属性中的属性，如果删除的属性是个对象，那么这个对象的引用还是存在的。  
```
var a = {b:{c:1}};
var b = a.b;
console.log(b.c); // 1
console.log(a.b); // {c:1}
delete a.b;
console.log(b.c); // 1
console.log(a.b); //undefined
```

**delete只能删除自有属性，不能删除继承属性。**

#### 返回值

> 返回值为true

当delete表达式删除成功或没有任何副作用(比如删除不存在的属性)，或者delete后不是一个属性访问表达式，delete会返回 `true` ；  
```
var a = {b:{c:1}};
console.log(delete a.b);
console.log(delete a.b);
console.log(delete a.toString);
console.log(delete 1);

以上都会打印true
```

> 返回值为false

delete不能删除那些可配置性为false的属性，例如某些内置对象的属性是不可配置的，通过变量声明和函数声明创建的全局对象的属性。  
```
var a = {};
Object.defineProperty(a,'b',{
    value:1,
    configurable: false //设置为不可配置
})
console.log(delete a.b)
console.log(delete Object.prototype)
var x = 1;
console.log(delete this.x);
console.log(delete x)

以上打印都为false
```

### 检测属性

#### in 运算符

in 运算符的左侧是属性名(字符串),右侧是对象。如果对象的自有属性或继承属性中包含这个属性则返回true。
```
var a = {b:1};
console.log('a' in window); // true 声明的全局变量'a'是window的属性
console.log('b' in a); // true 'b'是a的属性
console.log('toString' in a); // true a继承了toString属性
console.log('c' in a); // false 'c'不是a的属性
```

跟in运算符类似的，还可以用"!=="判断一个属性是否是undefined，但是有一种场景只能使用in运算符，in可以区分不存在的属性和存在但值为undefined的属性。
```
var a = {b:undefined};
console.log(a.b !== undefined);
console.log(a.c !== undefined);
console.log('b' in a);
console.log('c' in a);
```

#### hasOwnProperty

对象的`hasOwnProperty()`方法用来检测给定的名字是否是对象的自有属性。**对于继承属性它将返回false**  
```
var a = {b:1};
console.log(a.hasOwnProperty('b')); //true
console.log(a.hasOwnProperty('c')); //false
console.log(a.hasOwnProperty('toString')); //false toString是继承属性
```

#### propertyIsEnumerable

对象的`propertyIsEnumerable()`方法只有检测到是自身属性(不包括继承的属性)且这个属性的可枚举性为true时它才返回true。
```
var a = {b:1};
console.log(a.propertyIsEnumerable('b'));
console.log(a.propertyIsEnumerable('toString'));
```

## 面向对象

### 编码思想

两种编程方式：  
(1)、面向过程  
(2)、面向对象  

两者的区别：  
面向过程：关注实现过程和每一步的实现细节。  
面向对象： 关注特征和功能。

### 面向对象编程

通俗点，用对象的思想写代码就是面向对象编程。

