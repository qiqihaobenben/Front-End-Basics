## 数组

> 数组是值的有序集合，每个值叫做一个元素，而每个元素在数组中有一个位置，以数字表示，称为索引。

* JavaScript数组的索引是基于零的32位数值，第一个元素索引为0，数组最大能容纳4294967295个元素。
* JavaScript数组是动态的，根据需要它们会增长或缩减，并且在创建数组时无需声明一个固定的大小或者在数组大小变化时无需重新分配空间。
* JavaScript数组可能是稀疏的，数组元素的索引不一定要连续的，它们之间可以由空缺。
* 每个JavaScript数组都有一个length属性，针对非稀疏数组，该属性就是数组元素的个数。针对稀疏数组，length比所有元素的索引都要大。

### 创建数组

#### 1、最简单的方法是使用数组直接量(字面量)创建数组。

```
var empty = [];     //没有元素的数组
var arr = [1.1, true, "a",];    //3个不同类型的元素和结尾的逗号
```

数组直接量中的值也不一定必须是常量，它们可以是任意的表达式：
```
var number = 1;
var list = [number, number+1, number+2];
```

如果省略数组直接量中的某个值，省略的元素将被赋予undefined。
```
var count = [1,,3];     // 数组打印出来是(3) [1, empty, 3], count[1] === undefined是true。
var undefs = [,,];      // 数组直接量语法允许有可选的结尾的逗号，顾】[,,]只有两个元素而非三个
```

#### 2、构造函数Array()创建数组

调用时没有参数，等同于[]，创建一个没有任何元素的空数组
```
var arr = new Array();
```

调用时有一个数值参数，它指定长度
```
var arr = new Array(10)     // (10) [empty × 10]
```

显式指定两个或者多个数组元素或者数组元素的一个非数值元素
```
var arr = new Array(1,2,3,"one");
```

#### 3、ES6的一些方法

（1）`Array.of()` 返回由所有参数组成的数组，如果没有参数就返回一个新数组
可以解决上述构造器因参数个数不同，导致的行为有差异的问题(参数只有一个数值时，构造函数会把它当成数组的长度)。
```
let A = Array.of(1,2,3);

let B = new Array(3);   // (3) [empty × 3]
let C = Array.of(3);    // [3]
```

（2）`Array.from()`从一个类数组或可迭代对象中创建一个新的数组
**参数：**
* 第一个参数：想要转换成数组的类数组或可迭代对象
* 第二个参数（可选）：回调函数，类似数组的map方法，对每个元素进行处理，将处理后的值放入返回的数组。
* 第三个参数（可选）：绑定回调函数的this对象

```
// 有length属性的类数组
Array.from({length：5}，(v,i) => i)     //[0, 1, 2, 3, 4]

// 部署了Iterator接口的数据结构 比如:字符串、Set、NodeList对象
Array.from('hello')    // ['h','e','l','l','o']
Array.from(new Set(['a','b']))   // ['a','b']

// 传入一个数组生成的是一个新的数组，引用不同，修改新数组不会改变原数组
let arr1 = [1,2,3]
let arr2 = Array.from(arr);
arr2[1] = 4;
console.log(arr1,arr2)
//[1, 2, 3] [1, 4, 3]
```

### 数组方法

#### <p style="color: #3f87a6;">1、会改变原数组值的方法</p>

> 1. push() 方法在数组的尾部添加一个或多个元素，并**返回数组的长度**

参数: item1, item2, ..., itemX ,要添加到数组末尾的元素
```
let arr = [1,2,3];
let length = arr.push('末尾1','末尾2');     // 返回数组长度
console.log(arr,length)
// [1, 2, 3, "末尾1", "末尾2"] 5
```
<br>

> 2. pop() 方法删除数组的最后一个元素，减小数组长度并**返回它删除的值**。

参数：无
```
//组合使用push()和pop()能够用JavaScript数组实现先进后出的栈
let stack = [];
stack.push(1,2) // 返回长度2，这时stack的值是[1,2]
stack.pop()     // 返回删除的值2，这时stack的值是[1]
```
<br>

> 3. unshift() 方法在数组的头部添加一个或多个元素，并将已存在的元素移动到更高索引的位置来获得足够的空间，最后**返回数组新的长度**。

参数: item1, item2, ..., itemX ,要添加到数组开头的元素
```
let arr = [3,4,5];
let length = arr.unshift(1,2);  // 返回长度是5
console.log(arr, length)
//[1, 2, 3, 4, 5] 5
```
*注意：* 当调用unshift()添加多个参数时，参数时一次性插入的，而非一次一个地插入。就像是上例添加1和2，他们插入到数组中的顺序跟参数列表中的顺序一致，而不是[2,1,3,4,5]。

<br>

> 4. shift() 方法删除数组的第一个元素并将其返回，然后把所有随后的元素下移一个位置来填补数组头部的空缺，返回值是**删除的元素**

参数: 无。
```
let arr = [1,2,3];
let item = arr.shift(); // 返回删除的值1
console.log(arr, item)
// [2, 3] 1
```
<br>

> 5. splice() 方法是在数组中插入或删除元素的通用方法

**语法**
`array.splice(start[, deleteCount[, item1[, item2[, ...]]]])`

**参数：**
start​
指定修改的开始位置（从0计数）。如果超出了数组的长度，则从数组末尾开始添加内容；如果是负值，则表示从数组末位开始的第几位（从-1计数）；若只使用start参数而不使用deleteCount、item，如：array.splice(start) ，表示删除[start，end]的元素。

deleteCount 可选
整数，表示要移除的数组元素的个数。如果 deleteCount 是 0，则不移除元素。这种情况下，至少应添加一个新元素。如果 deleteCount 大于start 之后的元素的总数，则从 start 后面的元素都将被删除（含第 start 位）。
如果deleteCount被省略，则其相当于(arr.length - start)。

item1, item2, ... 可选
要添加进数组的元素,从start 位置开始。如果不指定，则 splice() 将只删除数组元素。

**返回值:**
由被删除的元素组成的一个数组。如果只删除了一个元素，则返回只包含一个元素的数组。如果没有删除元素，则返回空数组。
```
// start不超过数组长度
let arr = [1,2,3,4,5];
arr.splice(2)   // arr是[1,2]，返回值是[3,4,5]
arr.splice(1,1) // arr是[1]，返回值是[2]
arr.splice(0,3) // arr是[]，返回值是[1],因为此时数组从第0位开始不够3位，所以是删除从0开始到最后的所有元素。

// start大于数组长度
let arr = [1,2,3,4,5];
arr.splice(5)   // arr是[1,2,3,4,5]，返回值是[]
arr.splice(5,3,6) // arr是[1,2,3,4,5,6]，返回值是[]
arr.splice(5,3,7) // arr是[1,2,3,4,5,7] 返回值是[6]

// start是负数
let arr = [1,2,3,4,5];
arr.splice(-3,2); // arr是[1,2,5], 返回值是[3,4]

// 插入数组时，是插入数组本身，而不是数组元素
let arr = [1,4,5];
arr.splice(1,0,[2,3])   // arr是[1,[2,3],4,5]，返回值是[]
```
<br>

> 6. sort() 方法将数组中的元素排序并**返回排序后的数组**

参数：compareFunction
可选。用来指定按某种顺序进行排列的函数。如果省略，元素按照转换为的字符串的各个字符的Unicode位点进行排序。
如果指明了 compareFunction ，那么数组会按照调用该函数的返回值排序。即 a 和 b 是两个将要被比较的元素：
* 如果 compareFunction(a, b) 小于 0 ，那么 a 会被排列到 b 之前；
* 如果 compareFunction(a, b) 等于 0 ， a 和 b 的相对位置不变。备注： ECMAScript 标准并不保证这一行为，而且也不是所有浏览器都会遵守（例如 Mozilla 在 2003 年之前的版本）；
* 如果 compareFunction(a, b) 大于 0 ， b 会被排列到 a 之前。
* compareFunction(a, b) 必须总是对相同的输入返回相同的比较结果，否则排序的结果将是不确定的。

```
var stringArray = ["Blue", "Humpback", "Beluga"];
var numericStringArray = ["80", "9", "700"];
function compareNumbers(a, b){
  return a - b;
}
console.log('stringArray:' + stringArray.join());
console.log('Sorted:' + stringArray.sort());

console.log('numberArray:' + numberArray.join());
// 没有使用比较函数时，数字并不会按照我们设想的那样排序
console.log('Sorted without a compare function:'+ numberArray.sort());
console.log('Sorted with compareNumbers:'+ numberArray.sort(compareNumbers));

//打印如下
// stringArray: Blue,Humpback,Beluga
// Sorted: Beluga,Blue,Humpback

// numberArray: 40,1,5,200
// Sorted without a compare function: 1,200,40,5
// Sorted with compareNumbers: 1,5,40,200
```
<br>

> 7. reverse() 方法将数组中的元素颠倒顺序，返回逆序的数组。

参数: 无
```
let arr = [1,2,3];
arr.reverse()   // arr是[3,2,1]，返回值是[3,2,1]
```
<br>

> 8. copyWithin() 方法浅复制数组的一部分到同一数组中的另一个位置，并返回它，而不修改其大小。

**语法：**
`arr.copyWithin(target[, start[, end]])`

**参数：**
`target`

0 为基底的索引，复制序列到该位置。如果是负数，target 将从末尾开始计算。

如果 target 大于等于 arr.length，将会不发生拷贝。如果 target 在 start 之后，复制的序列将被修改以符合 arr.length。

`start`

0 为基底的索引，开始复制元素的起始位置。如果是负数，start 将从末尾开始计算。

如果 start 被忽略，copyWithin 将会从0开始复制。

`end`

0 为基底的索引，开始复制元素的结束位置。copyWithin 将会拷贝到该位置，但不包括 end 这个位置的元素。如果是负数， end 将从末尾开始计算。

如果 end 被忽略，copyWithin 将会复制到 arr.length。

**返回值：** 改变了的数组。

```
[1, 2, 3, 4, 5].copyWithin(-2);
// [1, 2, 3, 1, 2]

[1, 2, 3, 4, 5].copyWithin(0, 3);
// [4, 5, 3, 4, 5]

[1, 2, 3, 4, 5].copyWithin(0, 3, 4);
// [4, 2, 3, 4, 5]

[1, 2, 3, 4, 5].copyWithin(-2, -3, -1);
// [1, 2, 3, 3, 4]


// copyWithin 函数是设计为通用的，其不要求其 this 值必须是一个数组对象。
[].copyWithin.call({length: 5, 3: 1}, 0, 3);
// {0: 1, 3: 1, length: 5}
```
<br>

> 9. fill() 方法用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。

**语法:**
`arr.fill(value[, start[, end]])`

**参数：**

value
用来填充数组元素的值。

start 可选
起始索引，默认值为0。

end 可选
终止索引，默认值为 this.length

如果 start 是个负数, 则开始索引会被自动计算成为 length+start, 其中 length 是 this 对象的 length 属性值. 如果 end 是个负数, 则结束索引会被自动计算成为 length+end。

**返回值：**修改后的数组
```
[1, 2, 3].fill(4);               // [4, 4, 4]
[1, 2, 3].fill(4, 1);            // [1, 4, 4]
[1, 2, 3].fill(4, 1, 2);         // [1, 4, 3]
[1, 2, 3].fill(4, 1, 1);         // [1, 2, 3]
[1, 2, 3].fill(4, 3, 3);         // [1, 2, 3]
[1, 2, 3].fill(4, -3, -2);       // [4, 2, 3]
[1, 2, 3].fill(4, NaN, NaN);     // [1, 2, 3]
[1, 2, 3].fill(4, 3, 5);         // [1, 2, 3]
Array(3).fill(4);                // [4, 4, 4]

//fill 方法故意被设计成通用方法, 该方法不要求 this 是数组对象.
[].fill.call({ length: 3 }, 4);  // {0: 4, 1: 4, 2: 4, length: 3}
```

#### <p style="color: #3f87a6;">2、不改变原数组值的方法</p>

> 1. slice() 方法返回一个从开始到结束（不包括结束）选择的数组的一部分**浅拷贝**到一个新数组对象。且原始数组不会被修改。

**参数：**

begin 可选

从该索引处开始提取原数组中的元素（从0开始）。

**如果该参数为负数，则表示从原数组中的倒数第几个元素开始提取**，slice(-2)表示提取原数组中的倒数第二个元素到最后一个元素（包含最后一个元素）。

如果省略 begin，则 slice 从索引 0 开始。

end 可选

在该索引处结束提取原数组元素（从0开始）。

slice会提取原数组中索引从 begin 到 end 的所有元素（**包含begin，但不包含end**）。
slice(1,4) 提取原数组中的第二个元素开始直到第四个元素的所有元素 （索引为 1, 2, 3的元素）。

**如果该参数为负数， 则它表示在原数组中的倒数第几个元素结束抽取**。 slice(-2,-1)表示抽取了原数组中的倒数第二个元素到最后一个元素（不包含最后一个元素，也就是只有倒数第二个元素）。

如果 end 被省略，则slice 会一直提取到原数组末尾。

**如果 end 大于数组长度，slice 也会一直提取到原数组末尾**。

**返回值：** 一个含有提取元素的新数组

```
let arr = [1,2,3,4,5];
let arr1 = arr.slice(1,3); // arr是[1,2,3,4,5]， arr1是[2,3]
let arr2 = arr.slice(-2,-1);  // arr是[1,2,3,4,5], arr2是[4]
// 开始位置在结束位置后面，得到的数组是空
let arr3 = arr.slice(-2, -3); // arr是[1,2,3,4,5], arr3是[]
let arr4 = arr.slice(2, 1); // arr是[1,2,3,4,5], arr4是[]

//如果元素是个对象引用 （不是实际的对象），slice 会拷贝这个对象引用到新的数组里。两个对象引用都引用了同一个对象。如果被引用的对象发生改变，则新的和原来的数组中的这个元素也会发生改变。
let arr = [{name: 'xiaoming'}];
let arr1 = arr.slice(); // arr是[{name: xiaoming}]，arr1是[{name: 'xiaoming'}]
arr1[0].name = 'xiaogang'; // arr是[{name: 'xiaogang'}]，arr1是[{name: 'xiaogang'}]

// 对于字符串、数字及布尔值来说（不是 String、Number 或者 Boolean 对象），slice 会拷贝这些值到新的数组里。在别的数组里修改这些字符串或数字或是布尔值，将不会影响另一个数组。
let arr = [1,2,3];
let arr1 = arr.slice(); // arr是[1,2,3]，arr1是[1,2,3]
arr1[1] = "two"; // arr是[1,2,3]，arr1是[1,"tow",3]

// 当然，如果向两个数组任一中添加了新元素（简单或者引用类型），则另一个不会受到影响。
```
<br>

> 2. join() 方法将数组（或一个类数组对象）中所有元素都转化为字符串并连接在一起，返回最后生成的字符串。

**参数：**

separator （可选）
指定一个字符串来分隔数组的每个元素。
如果有(separator)，将分隔符转换为字符串。
如果省略()，数组元素用逗号分隔。默认为 ","。
如果separator是空字符串("")，则所有元素之间都没有任何字符。

```
let num = [1,2,3];
let str1 = num.join(); // 1,2,3
let str2 = num.join(', ') // 1, 2, 3
let str3 = num.join('') // 123

//所有的数组元素被转换成字符串，再用一个分隔符将这些字符串连接起来。如果元素是undefined 或者null， 则会转化成空字符串。
let num = [1,null,3];
let str1 = num.join(); // 1,,3

//如果数组中的元素是数组，会将里面的数组也调用join()
let num = [[1,2],3];
let str1 = num.join('-'); // 1,2-3

// 如果数组中的元素是对象，对象会被转为[object Object]字符串
let num = [{num: 1},2,3];
let str1 = num.join('-'); // [object Object]-2-3
```

<br>

> 2. toString() 方法将数组的每个元素转化为字符串(如有必要将调用元素的toString()方法)并且输出用逗号分割的字符串列表。返回一个字符串表示数组中的元素

**参数：** 无

```
[1,2,3].toString(); // 1,2,3
[1,[2,'c']].toString(); //1,2,c
// 以上与不使用任何参数调用join()方法返回的字符串是一样的。

// 以下的这个例子要跟下面的toLocaleString对照看
[{a:1},1,new Date()].toString() //"[object Object],1,Sat Jul 07 2018 18:43:45 GMT+0800 (中国标准时间)"
```
**注意：** 当数组和字符串操作的时候，js 会调用这个方法将数组自动转换成字符串
```
[1,2,3]+'abc'  //1,2,3abc
```

**返回值：** 返回一个字符串表示数组中的元素

<br>

> 3. toLocaleString() 数组中的元素将使用各自的 toLocaleString 方法转成字符串，这些字符串将使用一个特定语言环境的字符串（例如一个逗号 ","）隔开。

**参数：(还有待考证,我试了一下没用，看了一下ECMA的官网，确实是标注有两个可选参数的)**

locales （可选） 带有BCP 47语言标记的字符串或字符串数组

options （可选） 一个可配置属性的对象

```
//数组中的元素将会使用各自的 toLocaleString 方法：
// Object: Object.prototype.toLocaleString()
// Number: Number.prototype.toLocaleString()
// Date: Date.prototype.toLocaleString()

let prices = ['￥7', 500, 8123, 12];

// 不带参数
prices.toLocaleString(); // "￥7,500,8,123,12"

//带参数
prices.toLocaleString('ja-JP', { style: 'currency', currency: 'JPY' }); // "￥7,500,8,123,12"
//MDN上的举例中说是 "￥7,￥500,￥8,123,￥12"，在浏览器和Node中验证了返回的都是 "￥7,500,8,123,12" 啊！

// 以下的这个例子要跟上面的toString对照看
[{a:1},1,new Date()].toLocaleString() //"[object Object],1,2018/7/7 下午6:45:00"
```

**返回值：** 表示数组元素的字符串。

<br>

> 4. concat() 方法用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。

它的元素包括调用concat()的原始数组的元素和concat()的每个参数，但是要注意，concat()不会递归扁平化数组的数组，concat()也不会修改调用的数组。

**参数：**

valueN （可选） 将(多个)数组和/或值连接成新数组。

```
[1,2,3].concat([4,5,6],[7,8,9]) // [1, 2, 3, 4, 5, 6, 7, 8, 9]

['a','b','c'].concat(1,[2,3],[[4,5]]) // ["a", "b", "c", 1, 2, 3, [4,5]]

// concat方法不会改变this或任何作为参数提供的数组，而是返回一个浅拷贝,所以原始数组和新数组都引用相同的对象。 如果引用的对象被修改，新数组和原始数组都会变。
let obj = {a: 1};
let arr1 = [2,obj];
let arr2 = [1].concat(arr1);
console.log(arr1,arr2) //[2,{a:1}],[1,2,{a:1}]

//记录下上面的打印结果之后修改obj
obj.a = 2;
console.log(arr1,arr2) ////[2,{a:2}],[1,2,{a:2}]

// 说了是浅拷贝，而且原数组也不改变，那我们就可以用它来实现数组的浅拷贝功能
let num1 = [1,2,3];
//第一种
let num2 = num1.concat();
//第二种
let num2 = [].concat(num1);
num2[0] = 'a';
console.log(num1,num2); // [1, 2, 3] ["a", 2, 3]
```

**返回值：** 新的 Array 实例


<br>

> 5. indexof() 方法返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1。

**参数：**

searchElement 要查找的元素

fromIndex （可选）开始查找的位置。
如果该索引值大于或等于数组长度，意味着不会在数组里查找，返回-1。

如果该索引值是负值，代表相对数组末尾的偏移量，即-1表示从最后一个元素开始查找，-2表示从倒数第二个元素开始查找，**注意的是，这并不改变其查找顺序，查找顺序仍然是从前向后查询数组。**

如果该索引值是负值，其绝对值大于数组长度，则整个数组都将会被查询。其默认值为0。

**注意：** indexOf 使用严格相等（即 ===）比较 searchElement 和数组中的元素。而且indexOf()不能识别 `NaN`

```
let array = [2, 5, 9];
array.indexOf(2)     // 0
array.indexOf(7)     // -1
array.indexOf(9, 2)  // 2
array.indexOf(9, 3)  // -1
array.indexOf(2, -1) // -1
array.indexOf(2, -3) // 0
array.indexOf(2, -4) // 0
```

**返回值：** 首个被找到的元素在数组中的索引位置; 若没有找到则返回 -1

<br>

> 6. lastIndexOf() 跟indexOf()查找方向相反，方法返回指定元素在数组中的最后一个的索引，如果不存在则返回 -1。从数组的后面向前查找，从 fromIndex 处开始


**参数：**

searchElement 要查找的元素

fromIndex （可选）开始查找的位置。默认为数组的长度减 1，即整个数组都被查找。
如果该值大于或等于数组的长度，则整个数组会被查找。
如果为负值，将其视为从数组末尾向前的偏移。即使该值为负，数组仍然会被从后向前查找。
如果该值为负时，其绝对值大于数组长度，则方法返回 -1，即数组不会被查找。

**注意：** lastIndexOf 使用严格相等（即 ===）比较 searchElement 和数组中的元素。而且lastIndexOf()不能识别 `NaN`

```
let array = [2,5,9,2];
array.lastIndexOf(9) // 2
array.lastIndexOf('9') // -1 严格相等
array.lastIndexOf(7) // -1
array.lastIndexOf(2,4) // 3
array.lastIndexOf(2,3) // 3
array.lastIndexOf(2,2) // 0
array.lastIndexOf(2,-1) // 3
array.lastIndexOf(2,-2) // 0
array.lastIndexOf(2,-4) // 0
array.lastIndexOf(2,-5) // -1
```

**返回值：** 数组中最后一个元素的索引，如未找到返回-1


<br>

> 7. includes() 方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回false。

**includes解决了两个indexOf的问题:**

indexOf方法不能识别NaN

indexOf方法检查是否包含某个值不够语义化，需要判断是否不等于-1，表达不够直观

**参数：**

searchElement 需要查找的元素值。

fromIndex （可选） 从该索引处开始查找 searchElement。默认为 0。如果为负值，则按升序从 array.length + fromIndex 的索引开始搜索。负值绝对值超过长数组度，从0开始搜索。

如果fromIndex 大于等于数组长度 ，则返回 false 。该数组不会被搜索。

```
[1, 2, 3].includes(2);     // true
[1, 2, 3].includes(4);     // false
[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true
[1, 2, 3].includes(3, -4); // true
[1, 2, NaN].includes(NaN); // true
```

**返回值：** 一个布尔值，根据情况，如果包含则返回 true，否则返回false。


#### <p style="color: #3f87a6;">3、数组遍历</p>


### 扩展几个概念

#### 1、数组的索引和对象key有什么关系？

#### 2、稀疏数组


