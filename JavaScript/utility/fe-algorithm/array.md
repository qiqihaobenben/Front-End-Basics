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

如果省略数组直接量中的某个值，省略的元素是empty，访问的话会返回undefined。
```
var count = [1,,3];     // 数组打印出来是(3) [1, empty, 3], count[1] === undefined是true。
var undefs = [,,];      // 数组直接量语法允许有可选的结尾的逗号，顾[,,]只有两个元素而非三个，undefs.length 是2
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

（1）`Array.of()` 返回由所有参数组成的数组，如果没有参数就返回一个新数组 <b style="color:#17E6CA;">ES6新增</b>

**参数：**

elementN 任意个参数，将按顺序成为返回数组中的元素。

**注意：**

of() 可以解决上述构造器因参数个数不同，导致的行为有差异的问题(参数只有一个数值时，构造函数会把它当成数组的长度)。


```
let A = Array.of(1,2,3);

let B = new Array(3);   // (3) [empty × 3]
let C = Array.of(3);    // [3]
```

**返回值：** 新的 Array 实例。

（2）`Array.from()`从一个类数组或可迭代对象中创建一个新的数组 <b style="color:#17E6CA;">ES6新增</b>

**参数：**
* 第一个参数：想要转换成数组的类数组或可迭代对象
* 第二个参数（可选）：回调函数，类似数组的map方法，对每个元素进行处理，将处理后的值放入返回的数组。
* 第三个参数（可选）：绑定回调函数的this对象

```
// 有length属性的类数组
Array.from({length：5},(v,i) => i)     //[0, 1, 2, 3, 4]

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

<b style="color:#FF7614;">知识点</b>

```
//数组合并去重
function combine(){
    let arr = [].concat.apply([], arguments);  //没有去重复的新数组，之后用Set数据结构的特性来去重
    return Array.from(new Set(arr));
}

var m = [1, 2, 2], n = [2,3,3];
console.log(combine(m,n));
```

### 数组方法


![数组方法](../images/array.png)

### <p style="color: #3f87a6;">1、会改变原数组的方法</p>

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

> 8. copyWithin() 方法浅复制数组的一部分到同一数组中的另一个位置，并返回它，而不修改其大小。 <b style="color:#17E6CA;">ES6新增</b>

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

> 9. fill() 方法用一个固定值填充一个数组中从起始索引到终止索引内的全部元素。 <b style="color:#17E6CA;">ES6新增</b>

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

### <p style="color: #3f87a6;">2、不改变原数组的方法</p>

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

**返回值：**

<b style="color:#FF7614;">知识点</b>

```
// 扁平化简单的二维数组
const arr = [11, [22, 33], [44, 55], 66];
const flatArr = arr.join().split(','); // ["11", "22", "33", "44", "55", "66"]
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


<b style="color:#FF7614;">知识点</b>

```
// 扁平化简单的二维数组
const arr = [11, [22, 33], [44, 55], 66];
const flatArr = arr.toString().split(','); // ["11", "22", "33", "44", "55", "66"]
```

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

<b style="color:#FF7614;">知识点</b>

```
// concat 和扩展运算符可以快速扁平化数组
const arr = [11, [22, 33], [44, 55], 66];
const flatArr = [].concat(...arr); // [11, 22, 33, 44, 55, 66]
```


<br>

> 5. isArray() 用于确定传递的值是否是一个 Array。

**参数：**

obj 需要检测的值。

```
// 下面的函数调用都返回 true
Array.isArray([]);
Array.isArray([1]);
Array.isArray(new Array());
// 这里注意：Array.prototype 也是一个数组,一个属性值不是索引的数组。[constructor: ƒ, concat: ƒ, find: ƒ, findIndex: ƒ, pop: ƒ, …]
Array.isArray(Array.prototype);

// 下面的函数调用都返回 false
Array.isArray();
Array.isArray({});
Array.isArray(null);
Array.isArray(undefined);
Array.isArray(17);
Array.isArray('Array');
Array.isArray(true);
Array.isArray(false);
Array.isArray({ __proto__: Array.prototype });
```

**返回值：** 如果对象是 Array，则为true; 否则为false。

<b style="color:#FF7614;">知识点</b>

```
//判断数组的历程
// step one: 使用constructor
var a = [1];
console.log(a.constructor === Array) // true
// 但是原型的contructor属性是可以被改写的，例如在原型继承的时候，我们都是要把继承过来的prototype的constructor改写成我们当前的
var a = [1];
a.__proto__.constructor = '1';
console.log(a.constructor === Array) // false

// step tow : 使用instanceof
var a = [1];
console.log(a instanceof Array) // true
//但是instanceof不能检测iframes的数组
var iframe = document.createElement('iframe');
document.body.appendChild(iframe);
xArray = window.frames[window.frames.length-1].Array;
var arr = new xArray(1,2,3); // [1,2,3]

arr instanceof Array; // false

// step three :万无一失的Object.prototype.toString.call
Array.isArray = function(arg) {
  return Object.prototype.toString.call(arg) === '[object Array]';
};

// step four : Array.isArray()

var iframe = document.createElement('iframe');
document.body.appendChild(iframe);
xArray = window.frames[window.frames.length-1].Array;
var arr = new xArray(1,2,3); // [1,2,3]

Array.isArray(arr);  // true,可以检测iframes的数组

```


### <p style="color: #3f87a6;">3、数组遍历、映射、过滤、检测、简化等方法</p>

介绍方法之前，先对这些数组方法做一个概述：

* 首先，大多数方法的第一个参数接收一个函数，并且对数组的每个元素（或一些元素）调用一次该函数。如果是稀疏数组，对不存在的元素不调用该函数。大多数情况下，调用提供的函数使用三个参数：数组元素、元素的索引和数组本身。通常，只需要第一个参数值，可以忽略后两个参数。

* 大多数方法，第二个参数是可选的。如果有第二个参数，则调用的第一个函数参数被看做是第二个参数的方法，即当执行第一个函数参数时用作this的值(参考对象)。

* 方法的返回值很重要，不同的方法处理返回值的方式也不一样。

**下面这些方法运行时的规则：**
1. 对于空数组是不会执行回调函数的
2. 对于已在迭代过程中删除的元素，或者空元素会跳过回调函数
3. 遍历次数在第一次循环前就会确定，再添加到数组中的元素不会被遍历。
4. 如果已经存在的值被改变，则传递给 callback 的值是遍历到他们那一刻的值。
5. 已删除的项不会被遍历到。如果已访问的元素在迭代时被删除了(例如使用 shift()) ，之后的元素将被跳过

<br>

> 1. forEach() 方法从头到尾遍历数组，为每个元素调用指定的函数。

**参数：**

callback 为数组中每个元素执行的函数，该函数接收三个参数：

currentValue(当前值) 数组中正在处理的当前元素。

index(索引) 数组中正在处理的当前元素的索引。

array forEach()方法正在操作的数组。

<br>
thisArg （可选） 当执行回调函数时用作this的值(参考对象)。默认值为undefined


**注意：**
1. forEach无法中途退出循环，只能用return退出本次回调，进行下一次回调，如果要提前终止，可以把forEach方法放在try块中，并能抛出一个异常，但这种方法是不推荐的。
2. 它与之后会说到的几个方法不同，总是返回 undefined值,即使你return了一个值。

```
// 1、 空元素不遍历,undefined和null是会遍历的。
let numberArr = [1,2,,3];
numberArr.forEach(function (value,index,array) {
  console.log(value,index,array)
})
//打印信息如下，可见空元素是不会遍历的
//1 0 [1, 2, empty, 3]
//3 2 1 [1, 2, empty, 3]
//3 3 3 [1, 2, empty, 3]

let nullArr = [1,2,null,3];
nullArr.forEach(function (value,index,array) {
  console.log(value,index,array)
})
//打印信息如下，null是会遍历的
//1 0 (4) [1, 2, null, 3]
//2 1 (4) [1, 2, null, 3]
//null 2 (4) [1, 2, null, 3]
//3 3 (4) [1, 2, null, 3]

//2、已删除的项不会被遍历到。如果已访问的元素在迭代时被删除了,之后的元素将被跳过
let numberArr = [1,2,3];
numberArr.forEach(function (value,index,array) {
  if(index === 0) {
    delete numberArr[2]; //删除第三项
    //或者numberArr.pop()
  }
  console.log(value,index,array)
})
//打印信息如下：
// 1 0 (3) [1, 2, empty]
// 2 1 (3) [1, 2, empty]


let numberArr1 = [1,2,3,4];
numberArr1.forEach(function (value,index,array) {
  if(index === 1) {
    numberArr1.shift() //遍历到第二项的时候，删除第一项
  }
  console.log(value,index,array)
})
// 打印信息如下,遍历到第二项的时候，删除第一项，会跳过第三项
// 1 0 (4) [1, 2, 3, 4]
// 2 1 (3) [2, 3, 4]
// 4 2 (3) [2, 3, 4]

// 3、forEach 遍历的范围在第一次调用 callback 前就会确定。调用forEach 后添加到数组中的项不会被 callback 访问到。如果已经存在的值被改变，则传递给 callback 的值是 forEach 遍历到他们那一刻的值。
let arr = [1,2,3];
arr.forEach(function (value,index,array) {
  if(index === 0) {
    arr.push('新增的不会被遍历到')
    arr[2] = 4;
  }
  console.log(value,index,array)
})
// 1 0 (4) [1, 2, 4, "新增的不会被遍历到"]
// 2 1 (4) [1, 2, 4, "新增的不会被遍历到"]
// 4 2 (4) [1, 2, 4, "新增的不会被遍历到"]

// 4、使用thisArg参数 和 箭头函数使用thisArg
let arr = [1,2,3];
let obj = {arr: 'thisArg'}
arr.forEach(function () {
  console.log(this.arr)
},obj)
// 打印三次 'thisArg'

let arr = [1,2,3];
let obj = {arr: 'thisArg'}
arr.forEach(() => {
  console.log(this.arr)
},obj)
// 打印三次 undefined

// 5、forEach无法中途退出循环，只能用return退出本次回调，进行下一次回调
let arr = [1,2,3];
let result = arr.forEach((value) => {
  if(value == 2) {
    return value;
  }
  console.log(value)
})
console.log(result) // undefined ，即使中间return vlaue，也还是undefined
//打印value的值如下，说明return 并不能终止循环
// 1
// 3

```

**返回值：** undefined


<br>

> 2. map() 方法创建一个新数组，其结果是该数组中的每个元素都调用一个callback函数后返回的结果。

**参数：**(之前说过，大多说方法都会是这样一些参数)

callback 生成新数组元素的函数，使用三个参数：这个函数跟forEach()的函数不同的是，传递给map()的函数应该有返回值。

currentValue callback 的第一个参数，数组中正在处理的当前元素。

index callback 的第二个参数，数组中正在处理的当前元素的索引。

array callback 的第三个参数，map 方法被调用的数组。

<br>
thisArg 可选的。执行 callback 函数时 使用的this 值。

**注意：** map() 返回的是新数组，它不修改调用的数组。如果是稀疏数组，返回的也是相同方式的稀疏数组：它具有相同的长度，相同索引的缺失元素(因为空值不会调用函数)

```
let number = [1,2,3];
let doubles = number.map(function (value) {
  return value * 2;
})
console.log(number, doubles)
// [1,2,3] [2,4,6]

```

**返回值：** 一个新数组，每个元素都是回调函数的结果。

<b style="color:#FF7614;">知识点</b>
不要用 map 代替 forEach,map 会创建一个新的数组，占用内存。如果你不用 map 的返回值，那你就应当使用 forEach

<br>

> 3. filter() 方法返回的数组元素是调用的数组的一个子集。传入的函数时用来逻辑判定的，该函数返回 true 或 false,如果返回值为true或能转化为true的值，那么传递给判断函数的元素就是这个子集的成员，它将被添加倒一个作为返回值的数组中。

**参数：**

callback 用来测试数组的每个元素的函数。调用时使用参数 (element, index, array)。返回true表示保留该元素（通过测试），false则不保留。它接受三个参数：

element 当前在数组中处理的元素

index（可选） 正在处理元素在数组中的索引

array（可选）调用了filter筛选器的数组

<br>
thisArg（可选）可选。执行 callback 时的用于 this 的值。

**注意：**
1. callback 只会在已经赋值的索引上被调用，对于那些已经被删除或者从未被赋值的索引不会被调用。也就是说filter()会跳过稀疏数组中缺少的元素，它的返回数组总是稠密的，可以用这个方法压缩稀疏数组的空缺。
2. filter 不会改变原数组，它返回过滤后的新数组。

```
let number = [1,2,3,4,5,6];
let small = number.filter((value) => {
  return value < 4;
})
console.log(number,small)
// 打印 [1, 2, 3, 4, 5, 6]  [1, 2, 3]


//压缩稀疏数组的空缺
let arr = [1,2,3,,5];
let arr1 = arr.filter(() => true);
console.log(arr,arr1)
// 打印 [1, 2, 3, empty, 5]  [1, 2, 3, 5]

```

**返回值：** 一个新的通过测试的元素的集合的数组，如果没有通过测试则返回空数组。

<br>

> 4. every() 方法测试数组的所有元素是否都通过了指定函数的测试。当且仅当针对数组中的所有元素调用判定函数都返回true，它才返回true。

**参数：**

callback  用来测试每个元素的函数。

thisArg  执行 callback 时使用的 this 值。

**注意：**

1. every 方法为数组中的每个元素执行一次 callback 函数，callback 只会为那些已经被赋值的索引调用。不会为那些被删除或从来没被赋值的索引调用。every 方法在callback第一次返回false后就返回false，然后终止遍历。但如果callback一直返回true，它将会遍历整个数组，最终返回true。
2. 空数组上调用every方法，返回 true，因为空数组没有元素，所以空数组中所有元素都符合给定的条件
3. every 不会改变原数组

```
let arr = [12,34,5,23,44];
let num = 0;
let result = arr.every(function (element, index, array) {
  num++;
  return element > 10;
})
console.log(result,num) // 打印 false 3
// 可见发现5这个小于10的元素后，遍历立即终止，num为3

let arr = [12,34,,23,44];
let num = 0;
let result = arr.every(function (element, index, array) {
  num++;
  return element > 10;
})
console.log(result,num) // 打印 true 4
// 不会遍历没有赋值的索引位置，所以num为4

let result = [].every(function (element, index, array) {
  return element > 10;
})

console.log(result) // 打印 true


```

**返回值：** 一个布尔值，当所有的元素都符合条件才返回true，否则返回false

<br>

> 5. some() 方法测试数组中的某些元素是否通过由提供的函数实现的测试。当数组中至少有一个元素调用判定函数返回true，它就返回true，当且仅当数组中的所有元素调用判定函数都返回false，它才返回false。

**参数：**

callback 用来测试每个元素的函数

thisArg 可选 执行 callback 时使用的 this 值。

**注意：**

1. some 为数组中的每一个元素执行一次 callback 函数，直到找到一个使得 callback 返回一个“真值”，这时，some 将会立即返回 true。否则，some 返回 false。callback 只会在那些”有值“的索引上被调用，不会在那些被删除或从来未被赋值的索引上调用。
2. some 被调用时不会改变数组。
3. 空数组调用some，返回false

```
// 一个简单的例子说明
function isBiggerThan10(element, index, array) {
  return element > 10;
}

[2, 5, 8, 1, 4].some(isBiggerThan10);  // false
[12, 5, 8, 1, 4].some(isBiggerThan10); // true

// 实现一个跟includes方法类似的功能
let arr = [1,2,3];
function include(value) {
  return arr.some((element) => {
    return element === value;
  })
}
include(2) // true
include(4) // false

let result = [].some(function (element, index, array) {
  return element > 10;
})

console.log(result) // 打印 false
```

**返回值：** 只要数组中的任意一个元素在回调函数中返回的是真值，就返回true，否则为false

<br>

> 5. reduce() 和 reduceRight() 这两个方法使用指定的函数将数组元素进行组合，生成单个值。这在函数式编程中是常见的操作，也可以成为“注入”和“折叠”。reduceRight() 和 reduce() 工作原理是一样的，不同的是reduceRight() 按照数组索引从高到低（从右到左）处理数组，而不是从高到低。

**参数：**

callback 执行数组中每个值的函数，包含四个参数：

1. accumulator 累加器累加回调的返回值; 它是上一次调用回调时返回的累积值，或initialValue（如下所示）。
2. currentValue数组中正在处理的元素。
3. currentIndex可选 数组中正在处理的当前元素的索引。 如果提供了initialValue，则索引号为0，否则为索引为1。
4. array可选 调用reduce的数组

initialValue可选 用作第一个调用 callback的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用 reduce 将报错。

**注意：**

1. reduce为数组中的每一个元素依次执行callback函数，不包括数组中被删除或从未被赋值的元素，回调函数第一次执行时，accumulator 和currentValue的取值有两种情况：调用reduce时提供initialValue，accumulator取值为initialValue，currentValue取数组中的第一个值；没有提供 initialValue，accumulator取数组中的第一个值，currentValue取数组中的第二个值。即：如果没有提供initialValue，reduce 会从索引1的地方开始执行 callback 方法，跳过第一个索引。如果提供initialValue，从索引0开始。

2. 如果数组为空且没有提供initialValue，会抛出TypeError 。如果数组仅有一个元素（无论位置如何）并且没有提供initialValue， 或者有提供initialValue但是数组为空，那么此唯一值将被返回**并且callback不会被执行**。

```
let arr = [1,2,3,4,5];
let sum = arr.reduce((x,y) => x + y,0);
console.log(sum) // 15

// 看一下initialValue传和不传的区别
let arr = [1,2,3,4,5];
arr.reduce(function (accumulator,currentValue,currentIndex,arr) {
  console.log(currentIndex)
  return accumulator + currentValue;
})
// 1,2,3,4,5 没传入initialValue，索引是从1开始
arr.reduce(function (accumulator,currentValue,currentIndex,arr) {
  console.log(currentIndex)
  return accumulator + currentValue;
},10)
// 0,1,2,3,4,5 传入initialValue，索引从0开始

// 应用到二维数组展开
let arr = [[0, 1], [2, 3], [4, 5]].reduce(
  (a, b) => a.concat(b)
);
console.log(arr)
// [0, 1, 2, 3, 4, 5]
```

**返回值：** 函数累计处理的结果


<br>

> 6. indexof() 方法返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1。

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

> 7. lastIndexOf() 跟indexOf()查找方向相反，方法返回指定元素在数组中的最后一个的索引，如果不存在则返回 -1。从数组的后面向前查找，从 fromIndex 处开始


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

> 8. includes() 方法用来判断一个数组是否包含一个指定的值，根据情况，如果包含则返回 true，否则返回false。 <b style="color:#17E6CA;">ES7新增</b>

**参数：**

searchElement 需要查找的元素值。

fromIndex （可选） 从该索引处开始查找 searchElement。默认为 0。如果为负值，则按升序从 array.length + fromIndex 的索引开始搜索。负值绝对值超过长数组度，从0开始搜索。

如果fromIndex 大于等于数组长度 ，则返回 false 。该数组不会被搜索。

**注意：**

includes解决了两个indexOf的问题:

1. indexOf方法不能识别NaN
2. indexOf方法检查是否包含某个值不够语义化，需要判断是否不等于-1，表达不够直观

```
[1, 2, 3].includes(2);     // true
[1, 2, 3].includes(4);     // false
[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true
[1, 2, 3].includes(3, -4); // true
[1, 2, NaN].includes(NaN); // true
```

**返回值：** 一个布尔值，根据情况，如果包含则返回 true，否则返回false。


<br>

> 9. find() 和 findIndex() find 方法返回数组中满足提供的测试函数的第一个元素的值。否则返回 undefined。findIndex 方法返回数组中满足提供的测试函数的第一个元素的索引。否则返回-1。<b style="color:#17E6CA;">ES6新增</b>

**参数：** 这两个方法跟其他的方法类似

callback 在数组每一项上执行的函数，接收 3 个参数：
1. element 当前遍历到的元素。
2. index 当前遍历到的索引。
3. array 数组本身。

thisArg 可选，指定 callback 的 this 参数。

**注意：**

1. 这两个方法对数组中的每一项元素执行一次 callback 函数，直至有一个 callback 返回 true，在稀疏数组中，即使对于数组中不存在的条目的索引也会调用回调函数。这意味着对于稀疏数组来说，该方法的效率要低于那些只遍历有值的索引的方法。
2. 当找到一个callback判断为true的元素，find方法会立即返回这个元素的值，否则返回 undefined。findIndex会立即返回该元素的索引。如果回调从不返回真值，或者数组的length为0，则findIndex返回-1。
3. 这两个方法都不会修改所调用的数组

```

```

**返回值：**
1. find 方法，当某个元素通过 callback 的测试时，返回数组中的一个值，否则返回 undefined。
2. findIndex方法，返回数组中满足提供的测试函数的第一个元素的索引。否则返回-1。

<b style="color:#FF7614;">知识点</b>
不要用 find() 代替 some(),通常混用是这种场景，find 返回第一个符合条件的值，直接拿这个值做 if 判断是否存在，但是这个符合条件的值恰好是 0 怎么办？
find 是找到数组中的值后对其进一步处理，一般用于对象数组的情况；some 才是检查存在性；两者不可混用。


<br>

> 10. keys() 方法返回一个新的Array迭代器，它包含数组中每个索引的键。 <b style="color:#17E6CA;">ES6新增</b>


> 11. values() 方法返回一个新的Array迭代器，它包含数组中每个索引的值。 <b style="color:#17E6CA;">ES6新增</b>

> 12. @@iterator 属性和 values() 属性的初始值均为同一个函数对象。数组的 iterator 方法，默认情况下与 values() 返回值相同,调用语法是 `arr[Symbol.iterator]()`  <b style="color:#17E6CA;">ES6新增</b>

> 13. entries() 方法返回一个新的Array迭代器，该对象包含数组中每个索引的键/值对。 <b style="color:#17E6CA;">ES6新增</b>

**参数：** 都是无。

**返回值：** 都是一个新的 Array 迭代器对象。

```
for (let key of ['a', 'b'].keys()) {
  console.log(key);
}
// 0
// 1

for (let value of ['a', 'b'].values()) {
  console.log(value);
}
// 'a'
// 'b'

for (let value of ['a', 'b'][Symbol.iterator]()) {
  console.log(value);
}
// 'a'
// 'b'

for (let [key, value] of ['a', 'b'].entries()) {
  console.log(key, value);
}
// 0 "a"
// 1 "b"
```


### 扩展几个概念

#### 1、数组的索引和对象key有什么关系？

数组是对象的特殊形式，使用方括号访问数组元素和使用方括号访问对象属性一样。JavaScript将指定的数字索引值转换成字符串——索引1变成"1"——然后将其作为属性名来使用。数组的特别之处在于，当使用小于2^32的非负整数作为属性名时数组会自动维护其length属性。
```
// 索引到属性名的转化
let arr = [1,2,3];
console.log(arr[1]) // 2
console.log(arr["1"]) // 2
```
<br>

所有的数组都是对象，可以为其创建任意名字的属性，不过，只有在小于2^32的非负整数才是索引，数组才会根据需要更新length。事实上数组的索引仅仅是对象属性名的一种特殊类型，这意味着JavaScript数组没有“越界”错误的概念。当查询任何对象中不存在的属性时，不会报错，只会得到undefined
```
let arr = [];
arr["a"] = 1;
console.log(arr,arr.length) // arr是[a:1] length是0
```
<br>

对于使用负数或非整数的情况，数值会转换为字符串，字符串作为属性名来用，当时只能当做常规的对象属性，而非数组的索引。
```
let arr = [];
arr[-1.23] = 0;
console.log(arr,arr.length) // arr是[-1.23: 0] length是0
```
<br>

使用非负整数的字符串或者一个跟整数相等的浮点数时，它就当做数组的索引而非对象属性。

```
let arr = [];
arr["100"] = 'a';
console.log(arr,arr.length) // arr 是[empty × 100, "a"]，length 是101

let arr1 = [];
arr1[1.0000] = 'b';
console.log(arr1,arr1.length) // arr 是[empty, "b"]，length 是2
```

#### 2、稀疏数组

> 稀疏数组就是包含从0开始的不连续索引的数组。通常数组的length属性值代表数组中元素的个数。如果数组是稀疏的，length属性值大于元素的个数

足够稀疏的数组通常在实现上比稠密的数组更慢，更耗内存，在这样的数组中查找元素所用的时间就变得跟常规对象的查找时间一样长了，失去了性能的优势。

**注意：** 在数组直接量中省略值时不会创建稀疏数组。省略的元素在数组中是存在的，其值为undefined。这和数组元素根本不存在是有一些微妙的区别的。不过也有例外，在省略数组直接量中的某些值时（例如：[1,,3]），这时所得到的数组也是稀疏数组，省略掉的值是不存在的。

```
let a1 = [,,]; // 数组直接量，该数组是[empty × 2]
0 in a1 // false: a1在索引0处没有元素

let a2 = [,2,3];
0 in a2 // false: // false: a2在索引0处没有元素

let a3 = new Array(3); //[empty × 3],该数组根本没有元素
0 in a3 // false: a2在索引0处没有元素

let a4 = [undefined];
0 in a4 // true: a4在索引0处有一个值为undefined的元素
```

#### 3、类数组对象

> 拥有一个数值length属性和对应非负整数属性的对象看做一种类型的数组

数组跟类数组相比有以下不同：
1. 当有新元素添加到数组中时，自动更新length属性
2. 设置length为一个较小值将截断数组
3. 从Array.prototype中继承了一些方法
4. 其类属性为'Array'

JavaScript 数组有很多方法特意定义通用，因此他们不仅应用在真正的数组而且在类数组对象上都能正确工作，JavaScript权威指南一书说的是：ES5中所有的方法都是通用的，ES3中除了toString()和toLocaleString()意外所有方法也是通用的。不过concat是一个特例，虽然可以用在类数组对象上，但它没有将那个对象扩充进返回的数组中。

类数组对象显然没有继承自Array.prototype，所以它们不能直接调用数组方法，不过可以间接地使用Function.call方法调用。

```
// 类数组应用通用方法
let arrayLike = {0: 'name', 1: 'age', 2: 'address', length: 3 }
Array.prototype.join.call(arrayLike,'*') // "name*age*address"

// 还记得当初获取的DOM元素怎么转化成数组么？
functon toArray (DOM) {
  return Array.prototype.slice.call(DOM);
}

//对的，这样也可以的
let htmlCollection = document.getElementsByTagName('h2');
let arr1 = Array.prototype.map.call(htmlCollection,function (ele,index){return ele});
console.log(Array.isArray(arr1)) // true

// 还有这样
let arrayLike = {0: 'name', 1: 'age', 2: 'address', length: 3 }
let arr2  = Array.prototype.concat.apply([],arrayLike);
console.log(arr) //["name", "age", "address"]

// ES6现在这样
let arrayLike = {0: 'name', 1: 'age', 2: 'address', length: 3 }
let arr3 = Array.from(arrayLike);
console.log(arr3) // ["name", "age", "address"]
```




