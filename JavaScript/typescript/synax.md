# 语法

### ES6的数据类型

* Boolean
* Number
* String
* undefined
* null
* Symbol
* Array
* Function
* Object

### ES6的数据类型

* Boolean
* Number
* String
* undefined
* null
* Symbol
* Array
* Function
* Object
* **void**
* **any**
* **never**
* **元组**
* **枚举**
* **高级类型**

### 类型注解

作用： 相当于强类型语言中的类型声明

语法：(变量/函数):type


```
// 原始值
const isDone: boolean = false;
const amount: number = 6;
const address: string = 'beijing';
const greeting: string = `Hello World`;

// 数组
const list: number[] = [1, 2, 3];
const list: Array<number> = [1, 2, 3];

// 元组
const name: [string, string] = ['Sean', 'Sun'];

// 枚举
enum Color {
    Red,
    Green,
    Blue
};
const c: Color = Color.Green;

// 任意值：可以调用任意方法
let anyTypes: any = 4;
anyTypes = 'any';
anyTypes = false;

// 空值
function doSomething (): void {
    return undefined;
}

// 类型断言
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;
```

### TypeScript 中的 Interface 可以看做是一个集合，这个集合是对对象、类等内部结构的约定

```
// 定义接口 Coords
// 该接口包含 number 类型的 x，string 类型的 y
// 其中 y 是可选类型，即是否包含该属性无所谓
interface Coords {
	x: number;
	y?: string;
};

// 定义函数 where
// 该函数接受一个 Coords 类型的参数 l
function where (l: Coords) {
	// doSomething
}

const a = { x: 100 };
const b = { x: 100, y1: 'abc' };
// a 拥有 number 类型的 x，可以传递给 where
where(a);
// b 拥有 number 类型的 x 和 string 类型的 y1，可以传递给 where
where(b);

// 下面这种调用方式将会报错，虽然它和 where(b) 看起来是一致的
// 区别在于这里传递的是一个对象字面量
// 对象字面量会被特殊对待并经过额外的属性检查
// 如果对象字面量中存在目标类型中未声明的属性，则抛出错误
where({ x: 100, y1: 'abc' });

// 最好的解决方式是为接口添加索引签名
// 添加如下所示的索引签名后，对象字面量可以有任意数量的属性
// 只要属性不是 x 和 y，其他属性可以是 any 类型
interface Coords {
	x: number;
	y?: string;
    [propName: string]: any
};
```

### 接口还常用于约束函数的行为

```
// CheckType 包含一个调用签名
// 该调用签名声明了 getType 函数需要接收一个 any 类型的参数，并最终返回一个 string 类型的结果
interface CheckType {
    (data: any): string;
};
const getType: CheckType = (data: any) : string => {
    return Object.prototype.toString.call(data);
}
getType('abc');
// => '[object String]'
```

### Interface 也可以用于约束类的行为

```
interface ClockConstructor {
    new (hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
    tick();
}
function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    return new ctor(hour, minute);
}
class DigitalClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("beep beep");
    }
}
class AnalogClock implements ClockInterface {
    constructor(h: number, m: number) { }
    tick() {
        console.log("tick tock");
    }
}
let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);
```

### 除了 ES6 增加的 Class 用法，TypeScript 还增加了 C++、Java 中常见的 public / protected / private 限定符，限定变量或函数的使用范围。

TypeScript 使用的是结构性类型系统，只要两种类型的成员类型相同，则认为这两种类型是兼容和一致的，但比较包含 private 和 protected 成员的类型时，只有他们是来自同一处的统一类型成员时才会被认为是兼容的  

```
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}
class Rhino extends Animal {
    constructor() { super("Rhino"); }
}
class Employee {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}

let animal = new Animal("Goat");
let rhino = new Rhino();
let employee = new Employee("Bob");

animal = rhino;
// Error: Animal and Employee are not compatible
animal = employee;
```

### function

