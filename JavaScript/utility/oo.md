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

### 包装对象

当使用原始类型的值（string、number、boolean），在调用对应属性和方法的时候，内部会自动转成对应的对象。隐式创建的这个对象，就成为包装对象。  
基本类型都有自己对应的包装对象 : String  Number  Boolean  

> **包装对象的特点**  
隐式创建对象后，可以调用对应的属性和方法  
使用后，立马销毁，所以不能给原始类型的值添加属性和方法

其过程举例：str.substring - > new String(1234) - >  找到String的substring  -> 将new String销毁


## 面向对象

### 编码思想

两种编程方式：  
(1)、面向过程  
(2)、面向对象  

两者的区别：  
面向过程：关注实现过程和每一步的实现细节。  
面向对象：关注特征和功能。

### 面向对象编程

通俗点，用对象的思想写代码就是面向对象编程。

#### 基本特征

1、抽象：抓住核心问题（简单理解为抽出像的部分；将相同或表现与问题相关特征的内容提取出来。）  
其核心：抽出、抽离，将相同的部分（可能会维护、会迭代、会扩展）的代码抽离出来形成一类

2、封装：就是将类的属性包装起来，不让外界轻易知道它内部的具体实现；只提供对外接口以供调用

3、继承：从已有对象上继承出新的对象  

4、多态：一个对象的不同形态  

#### 面向对象的好处

1、代码的层次结构更清晰  
2、更容易复用  
3、更容易维护  
4、更容易扩展  

#### 面向对象相关的属性和概念

> `__proto__`   
属性原型链,实例对象与原型之间的连接，叫做原型链。  

**对象身上只有 `__proto__` 构造函数身上有prototype也有 `__proto__`**

> constructor  
返回创建实例对象的构造函数的引用,每个原型都会自动添加constructor属性,for..in..遍历原型是找不到这个属性的。

```
var a = new A();
console.log(a.constructor == A) //true
```

> hasOwnProperty  
可以用来判断某属性是不是这个构造函数的内部属性（不包括继承的）

语法： `obj.hasOwnProperty(prop)`  返回Boolean

```
function A (){
    this.b = 1;
}
var a = new A();
console.log(a.hasOwnProperty('b'));  //打印true 
console.log(a.hasOwnProperty('toString')); //toString是继承属性 打印 false
console.log(a.hasOwnProperty('hasOwnProperty')); //同上，打印false
```

> instanceof  
二元运算符,用来检测一个对象在其原型链中是否存在一个构造函数的 prototype 属性。

语法： `object instanceof constructor` 即检测 constructor.prototype 是否存在于参数 object 的原型链上。  
```
// 定义构造函数
function C(){} 
function D(){} 

var o = new C();
o instanceof C; // true，因为 Object.getPrototypeOf(o) === C.prototype
o instanceof D; // false，因为 D.prototype不在o的原型链上
o instanceof Object; // true,因为Object.prototype.isPrototypeOf(o)返回true
C.prototype instanceof Object // true,同上
```

> toString  
返回一个表示该对象的字符串

**作用：**  
1、进行数字之间的进制转换  
```
例如：var num = 255;
alert( num.toString(16) ); //结果就是'ff'
```
2、利用toString做类型的判断  
```
例如：var arr = [];
alert( Object.prototype.toString.call(arr) == '[object Array]' ); 	弹出true
Object.prototype.toString.call()	得到是类似于'[object Array]'  '[object Object]'
```

### 面向对象的写法历程

#### 1、原始模式

假如我们有一个对象是狗的原型，这个原型有“名字”和“颜色”两个属性。
```
var Dog = {
    name: '',
    color: ''
}
```
根据这个原型对象，我们要生成一个实例对象如下  
```
var hashiqi = {}; //创建空对象，之后根据原型对象的相应属性赋值
hashiqi.name = 'hashiqi';
hashiqi.color = 'blackandwhite';
```

**缺点：**  
1、如果要生成多个实例对象，要重复写多次。  
2、实例和原型之间没有联系。


#### 2、工厂模式

上面原始模式有一个缺点是要很麻烦的写很多重复的代码，我们可以写一个函数来解决代码重复的问题。  

```
function Dog(name, color) {
    var obj = {};
    obj.name = name;
    obj.color = color;
    return obj;
}

var hashiqi = Dog('hashiqi', 'blackandwhite');
var jinmao = Dog('jinmao', 'yellow');
```

这种方式只是解决了代码重复的问题，但是生成的实例跟原型还是没有联系，而且`hashiqi`和`jinmao`也没有联系，不能反映出他们是同一个原型对象的实例。

#### 3、构造函数模式

用来创建对象的函数，叫做构造函数，其实就是一个普通函数，但是默认函数名首字母大写，对构造函数使用new运算符，就能生成实例，并且this变量会绑定在实例对象上。  
```
function Dog(name, color) {
    this.name = name;
    this.color = color;
}

var hashiqi = new Dog('hashiqi', 'blackandwhite');
var jinmao = new Dog('jinmao', 'yellow');
console.log(hashiqi.name); //hashiqi
console.log(jinmao.name); //jinmao
```

hasiqi 和 jinmao有一个共同的构造函数 `hashiqi.constructor === jinmao.constructor` 是true

有以下几种方法可以验证原型对象与实例对象的关系：  
```
hashiqi instanceof Dog; // true

Object.getPrototypeOf(hashiqi) === Dog.prototype // true

Dog.prototype.isPrototypeOf(hashiqi) // true
```

**缺点：**  
构造函数解决了代码重复和实例与原型之间的联系，但是存在一个浪费内存的问题。比如远行对象有一些不变的属性和通用的方法，这样没生成一个实例，都必须为重复的东西多占一些内存。


> 扩展

我们可以尝试实现new运算符的逻辑如下：
```
function New(func) {
    var obj = {};

    //判断构造函数是否存在原型，如果有实例的__proto__属性就指向构造函数的prototype
    if(func.prototype !== undefined) {
        obj.__proto__ = func.prototype;
    }

    // 模拟出构造函数内部this指向实例的过程，注意，我们会拿到构造函数的返回值
    var res = func.apply(obj, Array.from(arguments).slice(1));

    // 正常构造函数是不需要显式声明返回值的，默认的返回值是生成的实例，但是一旦在构造函数中return 一个不是对象或者函数，就会改变构造函数的默认的返回值，其他的类型是不变的
    if(typeof res === 'object' && res !== null || typeof res === 'function') {
        return res;
    }

    return obj;
}

var taidi = New(Dog, 'taidi', 'gray');
```

**注意：**  
正常的构造函数是不需要自己写return 的，如果写了，当return的时候，如果是后面为简单类型，那么返回值还是构造函数生成的实例。如果return为对象类型或者函数，那么返回的就是return后面的这个对象或者函数。


#### 4、prototype模式

每一个构造函数都有 `prototype` 属性，这个属性指向的是一个对象，这个对象的所有属性和方法，都会被构造函数的实例继承。  
基于这个属性，我们就可以有选择性的将一些通用的属性和方法定义到 `prototype` 上，每一个通过 `new` 生成的实例，都会有一个 `__proto__` 属性指向构造函数的原型即 `prototype` ，这样我们定义到构造函数原型对象的属性和方法，就会被每一个实例访问到，从而变成公用的属性和方法。  

```
function Dog(name, color) {
    this.name = name;
    this.color = color;
}
Dog.prototype.say = function () {
    console.log("汪汪");
}

var hashiqi = new Dog('hashiqi', 'blackandwhite');
var jinmao = new Dog('jinmao', 'yellow');

hashiqi.say(); // 汪汪
jinmao.say(); // 汪汪
console.log(hashiqi.say === jinmao.say); // true
```

**注意：当实例对象和原型对象有相同的属性或者方法时，会优先访问实例对象的属性或方法。**  

### 面向对象的继承  

#### 1、构造函数内部的属性和方法继承

使用call或apply方法，将父对象的构造函数绑定在子对象上。  
```
//父类
function Animal() {
    this.species = '动物';
}

//子类
function Dog(name, color) {
    Animal.call(this);
    this.name = name;
    this.color = color;
}

var hashiqi = new Dog('hashiqi', 'blackandwhite');
console.log(hashiqi.species); //动物
```

#### 2、prototype相关的继承

> 子类的prototype指向父类生成实例

```
function Animal() {};
Animal.prototype.species = '动物';
function Dog(name, color) {
    this.name = name;
    this.color = color;
}
Dog.prototype = new Animal();
//只要是prototype被完全覆盖，都得重写constructor。
Dog.prototype.constructor = Dog;
var hashiqi = new Dog('hashiqi', 'blackandwhite');
```

**缺点：** 每一次继承都得生成一个父类实例，比较占内存。

> 利用空对象作为中介

```
function Animal() {}
Animal.prototype.species = '动物';
function Dog(name, color) {
    this.name = name;
    this.color = color;
}
//Middle生成的是空实例(除了__proto__)，几乎不占内存
function Middle() {}
Middle.prototype = Animal.prototype;
Dog.prototype = new Middle();
Dog.prototype.constructor = Dog;
var hashiqi = new Dog('hashiqi', 'blackandwhite');
console.log(hashiqi.species);
```
几个月前在 `CSDN` 面试的时候，我说了这种继承方式，面试官就纠结这样修改子类的prototype不会影响父类么？是真的不会影响的，因为子类的prototype是指向Middle构造函数生成的实例，如果真的有心要改，得`Dog.prototype.__proto__`这么着来改。

> Object.create()

```
function Animal() {}
Animal.prototype.species = '动物';
function Dog(name, color) {
    this.name = name;
    this.color = color;
}
Dog.prototype = Object.create(Animal.prototype,{
    constructor: {
        value: Dog
    }
})

var hashiqi = new Dog('hashiqi','blackandwhite');
console.log(hashiqi.species); //动物
```

#### 3、拷贝继承

>浅拷贝

```
function Animal() {}
Animal.prototype.species = '动物';
function Dog(name, color) {
    this.name = name;
    this.color = color;
}
function extend(child, parent) {
    var c = child.prototype;
    var p = parent.prototype;
    for(key in p) {
        c[key] = p[key]
    }
}
extend(Dog, Animal);
var hashiqi = new Dog('hashiqi', 'blackandwhite');
console.log(hashiqi.species) // 动物
```

> 深拷贝  

```
function deepCopy(parent, child) {
    var child = child || {};
    for(key in parent) {
        if(typeof parent[key] === 'object') {
            child[key] = parent[key].constructor === Array?[]:{};
            deepCopy(parent[key],child[key])
        } else {
            child[key] = parent[key];
        }
    }
    return child;
}
```







