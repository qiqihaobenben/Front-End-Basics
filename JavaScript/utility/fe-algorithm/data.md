# 数据结构

> 数据结构是计算机为了高效地利用资源而组织数据的一种方式。数据结构和算法是解决一切编程问题的基础。

## 1、数组类型

几乎所有的语言都原生支持数组类型，因为数组是最简单的内存数据结构。

### 1.JavaScript的数组

这个会单独拿出来放到JavaScript基础的数组中去介绍。

### 2.JavaScript数组与其他语言不同

1. 在`JavaScript`中，数组是一个可以修改的对象。如果添加元素，它就会动态增长。在`C`和`Java`等其他语言里，我们要先决定数组的大小，想添加元素就要创建一个全新的数组，不能简单地往其中添加所需的元素。  

2. 与`C`和`Java`等其他语言不同，JavaScript数组不是强类型的，因此它可以存储任意类型的数据。  

## 2、栈

### 1.栈数据结构

> 栈是一种遵从后进先出(LIFO)原则的有序集合，新添加的或待删除的元素都保存在栈的同一端，称为栈顶，另一端叫栈底。

也就是说，在栈里，新元素都靠近栈顶，旧元素都靠近栈底。  

基于以上，栈也被用在编程语言的编译器和内存中保存变量、方法调用等。  

### 2.栈操作

> 其中包含创建栈，向栈添加元素，从栈移除元素，查看栈顶元素，检查栈是否为空，清空和打印栈元素

```
// Stack 类
// 先创建一个类来表示栈
class Stack {
    constructor () {

        // 需要一种数据结构来保存栈里的元素，这里选择数组
        this.items = [];

        // 缓存栈的size
        this.size = 0;
    }

    /* 声明栈需要的一些方法 */

    // 重置栈的size
    resetSize () {
        return this.items.length;
    }

    // 打印栈数据
    print () {
        console.log(this.items.toString())
    }

    //添加一个或几个新元素到栈顶，该方法只添加元素到栈顶，也就是栈的末尾,返回当前栈元素数量
    push (){
        this.items.push.apply(this.items, arguments)
        this.size = this.resetSize();
        return this.size;
    }

    // 移除栈顶的元素，同时返回被移除的元素，栈遵循LIFO原则，因此移除的是最后添加进去的元素
    pop () {
        this.size--;
        return this.items.pop();
    }

    // 返回栈顶的元素，不对栈做任何修改
    peek () {
        return this.items[this.size - 1];
    }

    // 判断栈是否为空，如果栈里没有任何元素就返回true，否则返回false
    isEmpty () {
        return this.size == 0;
    }

    // 移除栈里的所有元素
    clear () {
        this.items.length = 0;
        this.size = this.resetSize();
    }

    // 返回栈里的元素个数
    getSize () {
        return this.size;
    }
}

// 使用Stack类
let stack = new Stack();
console.log(stack.isEmpty())   // 打印 true
stack.push(1,2,3);
stack.print()  // 打印 1,2,3
console.log(stack.isEmpty())   // 打印 false
console.log(stack.getSize())   // 打印 3
console.log(stack.pop())   // 打印 3
stack.print()  // 打印 1,2
stack.clear()
stack.print()  // 打印为空
console.log(stack.isEmpty())   // 打印 true
stack.push(5,6)
console.log(stack.peek())  // 打印 6

```

#### 以上Stack类存在的问题

ES6的类声明，不能像其他语言(Java、C++、C#)一样直接在类里面声明变量，只能在类的构造函数constructor里声明。 
所以这就导致items是公共的了，这是现在ES6的不足的地方，不能够声明声明私有属性或方法(虽然已经有提案了)。  

在这种情况下，我们希望Stack类的用户只能访问暴露给类的方法。否则，就有可能从栈的中间移除元素，毕竟我们用的是数组来存储的，比如直接用实例调用`stack.items.splice(2,3)`，有以下集中方法能相对解决这个问题。

> 1、用ES5的构造函数，在构造函数中声明变量items

```
function Stack () {
    let items = [];
    this.push = function (element) {
        //一次添加一个
        return items.push(element)
    }

    ...其他方法
}

```
用这个方法又有个问题就是，所有方法都是在构造函数中定义的，在创建很多个实例的时候会比基于原型的类更占内存。  

> 2、用ES6的限定作用域Symbol实现

ES6新增的Symbol是不可变的，可以用作对象的属性。

```
let _items = Symbol();

class Stack {
    constructor () {
        this[_items] = [];
    }

    ...其他方法
}
```

这个方法创建了一个假的私有属性，正常情况下在类的实例中是拿不到Symbol属性，但是ES6有一个叫做`getOwnPropertySymbols`方法能够取到类里面声明的所有Symbol属性，然后也可以通过下面的代码破坏Stack类。  
```
let objectSymbols = Object.getOwnPropertySymbols(stack);
stack.print()   // 打印 5,6
console.log(objectSymbols.length)   // 打印 1
console.log(objectSymbols)  // 打印 [Symbol()]
console.log(objectSymbols[0])   // 打印 Symbol()
stack[objectSymbols[0]].push(1)
stack.print()   // 打印 5,6,1 被改动了……
```

> 用ES6的weakMap实现

```
const items = new WeakMap();

class Stack {
    constructor () {
        items.set(this, [])
    }
    push (element) {
        let s = items.get(this);
        s.push(element);
    }
    ...其他方法
}
```

现在items在Stack类里是真正的私有属性了，但如果Stack不再commonjs模块，或者webpack打包中，还得需要一个闭包，因为items是在Stack类以外声明的，谁都可以动它。  
```
let Stack = (function () {
    const items = new WeakMap();

    class Stack {
        constructor () {
            items.set(this, [])
        }
        push (element) {
            let s = items.get(this);
            s.push(element);
        }
        ...其他方法
    }
    return Stack;
})()
```

## 3、队列

### 1、队列的数据结构

> 队列是遵循FIFO（先进先出）原则的一组有序的项。
队列在尾部添加新元素，并从顶部移除元素。最新添加的元素必须排在队列的末尾。

### 2、队列操作

> 其中包含创建队列，向队列中添加元素，从队列中移除元素，查看队列头元素，检查队列是否为空，打印队列元素。

```
// 直接用WeakMap来构造私有变量

const items = new WeakMap();
export default class Queue {
    constructor () {
        items.set(this, [])
    }
    enqueue (element) {
        let s = items.get(this);
        s.push(element);
    }
    dequeue () {
        let s = items.get(this);
        return s.shift();
    }
    front () {
        let s = items.get(this);
        return s[0]
    }
    isEmpty () {
        let s = items.get(this);
        return s.length == 0;
    }
    size () {
        let s = items.get(this);
        return s.length;
    }
    print () {
        let s = items.get(this);
        console.log(s.toString())
    }
}

// 使用Queue类
let queue = new Queue();
console.log(queue.isEmpty()) //true
queue.enqueue('fangxu')
queue.enqueue('wenqi')
queue.enqueue('benben')
queue.print() //'fangxu', 'wenqi', 'benben'
console.log(queue.size()) //3
console.log(queue.isEmpty()) // fasle
queue.dequeue()
queue.dequeue()
queue.print() //'benben'
```

### 3、优先队列

> 优先队列就是元素的的添加和移除是基于优先级的。例如机场登机的顺序，虽然也是排队，但是头等舱比经济舱先登机。

实现一个优先队列，有两种方式：  
1、设置优先级，然后在正确的位置添加元素；
2、用正常入列的方式操作添加元素，然后按照优先级移除她们。

```
const items = new WeakMap();
// 整合元素和其对应优先级的类
class QueueElement {
    constructor (element, priority) {
        this.element = element;
        this.priority = priority;
    }
}
export default class Queue {
    constructor() {
        items.set(this, [])
    }
    //更改了一下enqueue方法
    enqueue(element, priority) {
        let s = items.get(this);
        let queueElement = new QueueElement(element, priority);
        let added = false;
        for(var i = 0; i < s.length; i++) {
            if (queueElement.priority < s[i].priority) {
                s.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }
        if(!added) {
            s.push(queueElement);
        }
    }
    dequeue() {
        let s = items.get(this);
        return s.shift();
    }
    front() {
        let s = items.get(this);
        return s[0]
    }
    isEmpty() {
        let s = items.get(this);
        return s.length == 0;
    }
    size() {
        let s = items.get(this);
        return s.length;
    }
    print() {
        let s = items.get(this);
        s.forEach((item, index) => {
            console.log(`${item.element}-${item.priority}`)
        })
    }
}

// 使用Priorityqueue类
let queue = new Priorityqueue();
console.log(queue.isEmpty()) //true
queue.enqueue('fangxu',2)
queue.enqueue('wenqi',1)
queue.enqueue('benben',1)
queue.print() //'wenqi-1', 'benben-1','fangxu-2'
console.log(queue.size()) //3
console.log(queue.isEmpty()) // fasle
queue.dequeue()
queue.dequeue()
queue.print() //'fangxu-2'
```

上述实现的优先队列是最小优先队列，因为优先级值较小的元素被放置在队列最前面。最大优先队列则相反，把优先级的值较大的元素放置在队列最前面。

### 4、循环队列

> 循环队列是又一个修改版的队列，有一个很经典的例子就是击鼓传花（多人围成一个圆圈，把花尽快传递给下一个人。某一时刻传花停止，这个时候花在谁手里，谁就退出这个游戏，然后重复这个过程，直到只剩一个人）

```
import Queue from './queue'

function hotPotato(nameList, time) {
    let queue = new Queue();
    nameList.forEach((item, index) => {
        queue.enqueue(item)
    })
    let eliminated = '';
    while(queue.size() > 1) {
        for(let i = 0; i < time; i++) {
            queue.enqueue(queue.dequeue())
        }
        eliminated = queue.dequeue();
        console.log(`${eliminated}在击鼓传花的游戏中被淘汰。`)
    }
    return queue.dequeue();
}

// 使用hotPotato方法
// 以下都是团队里的成员
let names = ['zheming', 'sijie', 'chengyin', 'guangyu', 'yueying', 'xiaolujie', 'miaomiao', 'wenwu'];
// 为了避免他们说我不公平，这里用了一个随机取1-7的次数
let time = Math.ceil(7 * Math.random());
let winner = hotPotato(names, time);
console.log(`击鼓传花的胜者是${winner}`)

// 打印其中某一次的结果
guangyu在击鼓传花的游戏中被淘汰。
wenwu在击鼓传花的游戏中被淘汰。
yueying在击鼓传花的游戏中被淘汰。
sijie在击鼓传花的游戏中被淘汰。
zheming在击鼓传花的游戏中被淘汰。
chengyin在击鼓传花的游戏中被淘汰。
miaomiao在击鼓传花的游戏中被淘汰。
击鼓传花的胜者是xiaolujie
```

## 4、链表

> 要存储多个元素，数组（或者可以称为列表）可能是最常用的数据结构，正如之前提到的，大多数语言实现的数组有一个缺点，就是数组大小是固定的，从数组的起点或中间插入或者移除项的成本很高，因为需要移动元素（尽管JavaScript的Array类方法可以帮助我们做这些事，但背后的情况同样是这样）。  
`链表` 存储有序的元素集合，但不同于数组，链表中的元素在内存中并不是连续放置的。每个元素由一个存储元素本身的节点和一个指向下一个元素的引用（也成指针或链接）组成。

#### 链表和数组的区别

链表的优点：相对于传统数组，链表添加和移除元素的时候不需要移动其他元素。  
链表的缺点：链表需要使用指针，这是需要注意的地方。还有就是相对于数组可以直接访问任何位置的任何元素而言，想访问链表中间的一个元素，就需要从起点（表头）开始迭代列表直到找到所需的元素。

现实中链表的例子，就比如说运煤的火车，一列火车是由一系列车皮组成的，每节车皮都相互连接，可以很容易的分离一节车皮，改变它的位置，添加或移除它。这样车皮就是列表的元素，车皮间的链接就是指针。

### 1、链表操作

```
// 需要一个Node辅助类
class Node {
    constructor(element) {
        this.element = element;
        this.next = null;
    }
}

class LinkedList {
    constructor() {
        this.length = 0;
        this.head = null;
    }

    // 向链表尾部追加元素
    // 有两种场景，列表为空，添加的是第一个元素，或者列表不为空，向其追加元素
    append(element) {
        let current,
            node = new Node(element);
        if(this.head === null) {
            this.head = node;
        }else {
            current = this.head;
            while(current.next) {
                current = current.next;
            }
            current.next = node;
        }
        this.length++;
    }

    // 从链表中移除元素
    // 有两种场景，第一种是移除第一个元素，第二种是移除第一个以外的任一元素。
    removeAt(position) {
        // 处理位置，首先检查是否越界
        if(position > -1 && position < this.length) {
            let previous,
                index = 0,
                current = this.head;
            if(position === 0) {
                this.head = current.next;
            }else {
                while(index++ < position) {
                    previous = current;
                    current = current.next;
                }
                previous.next = current.next;
            }
            this.length--;
            return current.element;
        }else {
            return null;
        }
    }

    // 在任意位置插入元素
    insert(element, position) {
        if(position >= 0 && position <= this.length) {
            let previous,
                current = this.head,
                index = 0,
                node = new Node(element);
            if(position === 0) {
                node.next = current;
                this.head = node;
            }else {
                while(index++ < position) {
                    previous = current;
                    current = current.next;
                }
                node.next = current;
                previous.next = node;
            }
            this.length++;
            return true;
        }else {
            return false;
        }
    }

    // 返回元素在列表中的索引。如果列表中没有该元素则返回-1
    indexOf(element) {
        let current = this.head,
            index = -1;
        while(current) {
            index++;
            if(current.element === element) {
                return index;
            }
            current = current.next;
        }
        return -1;
    }

    // 从列表中移除一项
    remove(element) {
        let index = this.indexOf(element);
        return this.removeAt(index);
    }

    // 判断链表是否为空
    isEmpty() {
        return this.length === 0;
    }

    // 显示链表的大小，返回链表中包含的元素个数
    size() {
        return this.length;
    }

    // 获取链表的头
    getHead() {
        return this.head;
    }

    // 把链表对象转换成字符串
    toString() {
        let string = '',
            current = this.head;
        while(current) {
            string += current.element + (current.next? 'n' : '');
            current = current.next;
        }
        return string;
    }
}

export default LinkedList



// 具体使用
import LinkedList from 'linkedList'
let linkedList = new LinkedList();

console.log(linkedList.size()) // 0
console.log(linkedList.getHead()) // null
console.log(linkedList.isEmpty()) // true
linkedList.append('fangxu')
linkedList.append('zheming')
linkedList.append('wenwu')
console.log(linkedList.size()) // 3
console.log(linkedList.getHead()) // {element: 'fangxu', next: Node}
console.log(linkedList.isEmpty()) // false
console.log(linkedList.toString()) // fangxunzhemingnwenwu
linkedList.insert('yueying', 0)
linkedList.insert('chengyin', 4)
console.log(linkedList.size()) // 5
console.log(linkedList.getHead()) // {element: 'yueying', next: Node}
console.log(linkedList.toString()) // yueyingnfangxunzhemingnwenwunchengyin
console.log(linkedList.indexOf('fangxu')) // 1
console.log(linkedList.removeAt(2)) // zheming
console.log(linkedList.size()) // 4
console.log(linkedList.toString()) // yueyingnfangxunwenwunchengyin
console.log(linkedList.remove('fangxu')) // fangxu
console.log(linkedList.size()) // 3
console.log(linkedList.toString()) // yueyingnwenwunchengyin


```


> 注意

1、列表中的最后一个节点的下一个元素始终是null。


### 2、双向链表

双向链表和普通链表的区别是，普通链表一个节点只有链向下一个节点的链接，在双向链表中，链接是双向的：一个链向下一个元素，另一个链向前一个元素

```
// 双向链表需要增加以下属性

class Node {
    constructor(element) {
        this.element = element;
        this.next = null;
        this.prev = null; // 新增指向其哪一个元素的链接
    }
}

class DoublyLinkedList {
    constructor() {
        this.length = 0;
        this.head = null;
        this.tail = null; // 链表类增加链表反向的头,也就是正向链表的尾巴
    }

    ...
}
```

**注意：** 因为双向链表中有向前和向后两个指针，所以在插入和删除指定位置的元素等操作时，需要有比普通链表多的操作。

### 3、循环链表

循环链表可以像普通链表一样只有单向引用，也可以像双向链表一样有双向引用。循环链表和链表之间唯一的区别在于，最后一个元素指向下一个元素的指针（tail.next）不是null，而是指向第一个元素head。  
双向循环链表有指向head的tail.next,也有指向tail的head.prev。


## 5、集合

> 集合是由一组无序且唯一（即不能重复）的项组成。可以把集合想象成一个既没有重复元素，也没有顺序概念的数组。

### 1、创建集合

ES6新增了Set类，我们可以基于ES6的Set开发我们的集合类

先熟悉一下ES6原生的Set类怎么用
```
let set = new Set();
set.add(1)
console.log(set.values()) // 输出@Iterator
console.log(set.has(1)) // 输出true
console.log(set.size) // 输出1

// 首先创建两个集合
let setA = new Set();
setA.add(1)
setA.add(2)
setA.add(3)

let setB = new Set();
setA.add(2)
setA.add(3)
setA.add(4)
```

### 2、集合的操作

1. **并集：** 对于给定的两个集合，返回一个包含两个集合中所有元素的新集合。

2. **交集：** 对于给定的两个集合，返回一个包含两个集合中共有元素的新集合。

3. **差集：** 对于给定的两个集合，返回一个包含所有存在于第一个集合且不存在于第二个集合的元素的新集合

4. **子集：** 验证一个给定的集合是否是另一集合的的子集。

> 并集，集合A和集合B的并集，表示为 `A∪B` ，该集合定义是： `A∪B = {x|x ∈ A∨x ∈ B}` 意思是x元素存在于A中，或者x存在于B中

```
// A、B两个集合并集代码实现如下
let unionAB = new Set();
for(let x of setA) {
    unionAB.add(x)
}
for (let x of setB) {
    unionAB.add(x)
}
```

> 交集 集合A和集合B的交集，表示为 `A∩B` ，该集合定义是： `A∩B = {x|x ∈ A∧x ∈ B}` 意思是x元素存在于A中，，且x存在于B中

```
// 模拟交集需要创建一个辅助函数

function intersection(A, B) {
    let intersectionSet = new Set();
    for (let x of A) {
        if (B.has(x)) {
            intersectionSet.add(x)
        }
    }
    return intersectionSet
}
let intersectionAB = intersection(setA, setB);
```

> 差集 集合A和集合B的差集，表示为 `A-B` ，该集合定义是： `A-B = {x|x ∈ A∧x ∉ B}` 意思是x元素存在于A中，，且x不存在于B中

```
function difference(A, B) {
    let differenceSet = new Set();
    for (let x of A) {
        if (!B.has(x)) {
            differenceSet.add(x)
        }
    }
    return differenceSet
}
let differenceAB = difference(setA, setB);
```

> 子集 集合A是集合B的子集，表示为 `A⊆B` ，该集合定义是： `∀x {x ∈ A→x ∈ B}` 意思是集合A中的每一个x（元素），也需要存在于B中

```
// 这个返回值就不是新集合了,而是一个布尔值
function subSet(A, B) {
    if (A.size > B.size) {
        return false;
    }else {
        for(let x of A) {
            if(!B.has(x)) {
                return false;
            }
        }
        return true;
    }
}
let isSub = subSet(setA, setB);
```
