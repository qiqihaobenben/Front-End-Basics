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

#### 1、会改变原数组值的方法

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

**返回值**
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

**返回值：**改变了的数组。

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


### 扩展几个概念

#### 1、数组的索引和对象key有什么关系？

#### 2、稀疏数组


