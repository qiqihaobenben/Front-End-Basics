# 理解 ES6 中的 Class

## 从编译结果看 ES6 的 class

```js
class Parent {
  constructor(name) {
    this.name = name || 'Parent'
    this.age = 32
  }
  sayName() {
    console.log(this.name)
  }
  saySth(str) {
    console.log(str)
  }
  static staticMethod(str) {
    console.log(str)
  }
}

const p = new Parent('Parenttt')
p.sayName()
p.saySth('HelloP')
Parent.staticMethod('Sttttatic')
```

使用 Babel 官网的编译器, 设定编译目标为 `es2015-strict`。

```js
'use strict'

require('core-js/modules/es6.function.name')

// 检测调用方式
function _classCallCheck(instance, Constructor) {
  // 函数在被new关键字调用时内部的 this 会指向当前的实例对象, 在这个检测方法里我们主要是判断这个 class 是否是以new关键字调用, 否则我们就认为这个类被错误的当成函数调用了(即const p = Parent())
  if (!(instance instanceof Constructor)) {
    throw new TypeError('Cannot call a class as a function')
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i]
    descriptor.enumerable = descriptor.enumerable || false
    descriptor.configurable = true
    if ('value' in descriptor) descriptor.writable = true
    Object.defineProperty(target, descriptor.key, descriptor)
  }
}
// 对修饰符进行了一些修改 然后再使用原生的方法, 将这个属性添加到类上, 你会发现实例方法是被添加到原型上的, 而静态方法则是被添加到类上(构造函数就是类)
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  return Constructor
}

// 首先会发现的是, Parent类实际上还是一个函数(IIFE Immediately Invoked Function Expression， 内部返回的那个Parent函数), 我们在_createClass中对它进行了一些操作后将其返回, 而后这个函数就是可以实例化的了
var Parent =
  /*#__PURE__*/
  (function () {
    function Parent(name) {
      _classCallCheck(this, Parent)

      this.name = name || 'Parent'
      this.age = 32
    }

    _createClass(
      Parent,
      [
        {
          key: 'sayName',
          value: function sayName() {
            console.log(this.name)
          },
        },
        {
          key: 'saySth',
          value: function saySth(str) {
            console.log(str)
          },
        },
      ],
      [
        {
          key: 'staticMethod',
          value: function staticMethod(str) {
            console.log(str)
          },
        },
      ]
    )

    return Parent
  })()

var p = new Parent('Parenttt')
p.sayName()
p.saySth('HelloP')
Parent.staticMethod('Sttttatic')
```

以上的语法解释了：
1. 内部所有方法都是不可枚举的, 因为其修饰符enumerable被置为 false, 除非你去改动编译结果。
2. 静态方法与实例方法的调用方式不同。
3. 原型对象的构造函数属性直接指向类本身Parent.prototype.constructor === Parent。

ES6 的 class 实际上是基于原型的语法糖，原理如下：

1. 类仍然是函数, 只不过类本身就是构造函数
2. 方法被添加到原型对象(实例方法)或类本身(静态方法)
3. 调用前会经过检测, 所以不能以函数方式调用


## 从编译结果看继承

```js
class Parent {
    name =  ""
    age =  0
  constructor(name) {
    this.name = name || 'Parent'
    this.age = 32
  }
  sayName() {
    console.log(this.name)
  }
  saySth(str) {
    console.log(str)
  }
  static staticMethod(str) {
    console.log(str)
  }
}

class Child extends Parent {
  constructor(name) {
    super(name);
    this.name = name || "Child";
    this.age = 0;
  }

  ownMethod() {
    console.log("Own Method");
  }
}
```

编译结果：

```js
function _typeof(o) {
  '@babel/helpers - typeof'
  return (
    (_typeof =
      'function' == typeof Symbol && 'symbol' == typeof Symbol.iterator
        ? function (o) {
            return typeof o
          }
        : function (o) {
            return o && 'function' == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? 'symbol' : typeof o
          }),
    _typeof(o)
  )
}
// t: this，o: Child，e: [name]
// 在子类构造函数中调用父类构造函数，确保正确的 this 绑定和原型链初始化。
function _callSuper(t, o, e) {
  // o = _getPrototypeOf(o)) 获取 Child.__proto__，即 Parent
  // 如果环境中可用Reflect, 就使用Reflect.construct语法创建构造函数,否则就老老实实的使用apply
  // Reflect.construct(target, args)其实就等同于new target(...args), 相当于一种不使用 new 来调用构造函数的方式，第三个参数：指定 new.target 为子类构造函数
  return (o = _getPrototypeOf(o)), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e))
}
// 检查父类构造函数返回值
function _possibleConstructorReturn(t, e) {
  // 如果父类返回对象，则使用该对象
  if (e && ('object' == _typeof(e) || 'function' == typeof e)) return e
  if (void 0 !== e) throw new TypeError('Derived constructors may only return object or undefined')
  // 否则返回子类的 this
  return _assertThisInitialized(t)
}
function _assertThisInitialized(e) {
  if (void 0 === e) throw new ReferenceError("this hasn't been initialised - super() hasn't been called")
  return e
}
function _isNativeReflectConstruct() {
  try {
    var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}))
  } catch (t) {}
  return (_isNativeReflectConstruct = function _isNativeReflectConstruct() {
    return !!t
  })()
}
function _getPrototypeOf(t) {
  return (
    (_getPrototypeOf = Object.setPrototypeOf
      ? Object.getPrototypeOf.bind()
      : function (t) {
          return t.__proto__ || Object.getPrototypeOf(t)
        }),
    _getPrototypeOf(t)
  )
}

// 继承：建立子类和父类之间的原型链继承关系，实现静态方法和原型方法的继承。
function _inherits(t, e) {
  // 边界情况处理, 父类必须是函数类型(因为类本身就是函数嘛), 并且不能为null
  if ('function' != typeof e && null !== e) throw new TypeError('Super expression must either be null or a function')
    // 建立原型链：创建新的原型对象，其 [[Prototype]]（ES5 时称为 __proto__） 指向父类的 prototype，并且设置正确的 constructor 属性指向子类
  ;(t.prototype = Object.create(e && e.prototype, { constructor: { value: t, writable: !0, configurable: !0 } })),

  // 冻结原型对象，防止意外修改子类的 prototype
  Object.defineProperty(t, 'prototype', { writable: !1 }),
    e && _setPrototypeOf(t, e) // 设置静态继承：如果父类不为 null, 使用增强的 _setPrototypeOf() 方法, 将子类本身 [[Prototype]] 指向父类，实现静态方法继承
}
function _setPrototypeOf(t, e) {
  return (
    (_setPrototypeOf = Object.setPrototypeOf
      ? Object.setPrototypeOf.bind()
      : function (t, e) {
          return (t.__proto__ = e), t
        }),
    _setPrototypeOf(t, e)
  )
}
function _classCallCheck(a, n) {
  if (!(a instanceof n)) throw new TypeError('Cannot call a class as a function')
}
function _defineProperties(e, r) {
  for (var t = 0; t < r.length; t++) {
    var o = r[t]
    ;(o.enumerable = o.enumerable || !1), (o.configurable = !0), 'value' in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o)
  }
}
function _createClass(e, r, t) {
  return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, 'prototype', { writable: !1 }), e
}
function _defineProperty(e, r, t) {
  return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : (e[r] = t), e
}
function _toPropertyKey(t) {
  var i = _toPrimitive(t, 'string')
  return 'symbol' == _typeof(i) ? i : i + ''
}
function _toPrimitive(t, r) {
  if ('object' != _typeof(t) || !t) return t
  var e = t[Symbol.toPrimitive]
  if (void 0 !== e) {
    var i = e.call(t, r || 'default')
    if ('object' != _typeof(i)) return i
    throw new TypeError('@@toPrimitive must return a primitive value.')
  }
  return ('string' === r ? String : Number)(t)
}
var Parent = /*#__PURE__*/ (function () {
  function Parent(name) {
    _classCallCheck(this, Parent)
    _defineProperty(this, 'name', '')
    _defineProperty(this, 'age', 0)
    this.name = name || 'Parent'
    this.age = 32
  }
  return _createClass(
    Parent,
    [
      {
        key: 'sayName',
        value: function sayName() {
          console.log(this.name)
        },
      },
      {
        key: 'saySth',
        value: function saySth(str) {
          console.log(str)
        },
      },
    ],
    [
      {
        key: 'staticMethod',
        value: function staticMethod(str) {
          console.log(str)
        },
      },
    ]
  )
})()
var Child = /*#__PURE__*/ (function (_Parent2) {
  function Child(name) {
    var _this
    _classCallCheck(this, Child)
    _this = _callSuper(this, Child, [name])
    _this.name = name || 'Child'
    _this.age = 0
    return _this
  }
  // 建立子类和父类之间的原型链继承关系，实现静态方法和原型方法的继承。
  _inherits(Child, _Parent2)
  return _createClass(Child, [
    {
      key: 'ownMethod',
      value: function ownMethod() {
        console.log('Own Method')
      },
    },
  ])
})(Parent)
```

上面的 `Reflect.construct(o, e || [], _getPrototypeOf(t).constructor)` 着重讲解一下。

讲代码简化为：`const instance = Reflect.construct(Parent, [], Child);`

实际执行流程：

1. 创建一个新对象 obj，其原型为 newTarget.prototype（即 Child.prototype）
2. 设置 Parent 内部的 new.target 为 Child
3. 使用 obj 作为 this 调用 Parent 构造函数
4. 如果 Parent 返回一个对象，则使用该对象作为结果
5. 否则返回 obj

```js
// 伪代码，展示 Reflect.construct 的内部逻辑
function simulateReflectConstruct(target, args, newTarget) {
  // 1. 创建对象，原型为 newTarget.prototype
  const obj = Object.create(newTarget.prototype);

  // 2. 特殊处理：设置 target 内部的 new.target = newTarget
  // 这是无法用 JavaScript 直接模拟的，但可以这样理解：
  const originalNewTarget = new.target; // 在 Reflect.construct 内部可用
  // 设置 target 函数执行时的 new.target 为 newTarget

  // 3. 以 obj 为 this 调用 target
  const result = target.apply(obj, args);

  // 4. 如果 target 返回了对象，使用该对象
  if (result && (typeof result === 'object' || typeof result === 'function')) {
    return result;
  }

  // 5. 否则返回 obj
  return obj;
}
```

## ES6 类继承为什么在子类中需要先调用 super()？

### 1. **根本原因：谁创建 this 对象？**

在 ES5 的继承模式中，**子类负责创建 `this` 对象**：
```javascript
function Child() {
  // this 是 new Child() 自动创建的
  Parent.call(this);  // 然后初始化父类属性
  this.childProp = '...';
}
```

在 ES6 的继承模式中，**父类负责创建 `this` 对象**：
```javascript
class Child extends Parent {
  constructor() {
    super();  // 父类创建并返回 this
    this.childProp = '...';  // 然后子类再添加属性
  }
}
```

### 2. **ES6 的继承机制详解**

```javascript
class Parent {
  constructor(name) {
    console.log('Parent creating this');
    this.name = name;
  }
}

class Child extends Parent {
  constructor(name, age) {
    // 如果这里不使用 super，会怎样？
    this.age = age;  // ❌ ReferenceError: Must call super constructor...
  }
}

// 实际上，new Child() 的执行流程：
// 1. 创建子类实例时，this 还没有被创建！
// 2. 必须由父类构造函数来创建和初始化 this
// 3. 然后子类才能使用和扩展 this
```

### 3. **为什么必须由父类创建 this？**

#### **原因 1：支持继承内置类**

ES6 允许继承内置类，如 `Array`、`Error`、`Map` 等，这些类的 `this` 需要特殊处理：

```javascript
class MyArray extends Array {
  constructor(...args) {
    // Array 构造函数负责创建具有 Array 内部槽位（internal slots）的 this
    // 这些槽位无法在子类中手动创建
    super(...args);
  }

  // 现在可以正常工作：
  getFirst() {
    return this[0];
  }
}

const myArr = new MyArray(1, 2, 3);
console.log(myArr.length);  // 3，正确继承了 Array 的行为
```

**对比 ES5 的问题**：
```javascript
// ES5 无法正确继承 Array
function MyArray() {
  Array.apply(this, arguments);  // 这不会创建真正的 Array 实例
}

MyArray.prototype = Object.create(Array.prototype);

const myArr = new MyArray(1, 2, 3);
console.log(myArr.length);  // 0 ❌ 长度属性不正确
```

#### **原因 2：确保正确的 new.target**

```javascript
class Parent {
  constructor() {
    console.log(new.target);  // 指向实际调用的子类
    console.log(this instanceof Parent);  // true
    console.log(this instanceof Child);   // true
  }
}

class Child extends Parent {
  constructor() {
    super();  // 调用父类时，new.target 指向 Child
  }
}

// 父类需要知道是哪个子类在实例化
// 这样可以在父类中实现抽象类模式
```

#### **原因 3：支持构造函数返回对象**

```javascript
class Parent {
  constructor() {
    // 父类可以决定返回什么对象
    return { custom: 'object' };
  }
}

class Child extends Parent {
  constructor() {
    super();  // 返回 { custom: 'object' }
    // this 实际上被替换为父类返回的对象
    console.log(this);  // { custom: 'object' }
  }
}
```

### 4. **详细执行流程**

```javascript
class Parent {
  constructor(name) {
    console.log('2. Parent constructor called');
    this.name = name;
    this.parentOnly = 'parent';
  }
}

class Child extends Parent {
  constructor(name, age) {
    console.log('1. Child constructor starts');

    // 在调用 super() 之前，this 是未初始化的
    // console.log(this);  // ❌ ReferenceError

    super(name);  // 3. 父类创建并初始化 this

    console.log('4. After super()');
    console.log(this);  // 现在可以访问 this

    this.age = age;
    this.childOnly = 'child';
  }
}

const child = new Child('Alice', 10);
```

**编译成 ES5 后的代码**：
```javascript
var Child = (function(Parent) {
  function Child(name, age) {
    var _this;

    console.log('1. Child constructor starts');

    // 关键：调用父类构造函数来获取 this
    _this = _callSuper(this, Child, [name]);

    console.log('4. After super()');
    console.log(_this);

    _this.age = age;
    _this.childOnly = 'child';

    return _this;
  }

  _inherits(Child, Parent);
  return Child;
})(Parent);
```

### 5. **如果不先调用 super() 会发生什么？**

```javascript
class Child extends Parent {
  constructor() {
    // 场景 1：不使用 this，但也没调用 super()
    // 结果：不报错，因为构造函数默认返回 undefined？
    // 实际上：❌ 错误！会抛出 ReferenceError
  }
}

class Child extends Parent {
  constructor() {
    this.prop = 'value';  // ❌ ReferenceError
    super();
  }
}

class Child extends Parent {
  constructor() {
    super();
    this.prop = 'value';  // ✅ 正确
  }
}
```

### 6. **规范中的具体规定**

根据 ECMAScript 规范：
1. 当创建派生类（子类）的实例时：
   - 如果构造函数中没有显式返回对象，则**必须**调用 `super()`
   - `super()` 负责创建实例并设置内部插槽
   - 在 `super()` 之前访问 `this` 会抛出引用错误

2. 如果构造函数中显式返回对象：
   ```javascript
   class Child extends Parent {
     constructor() {
       return { custom: true };  // 可以不调用 super()
     }
   }
   // 但如果返回的不是对象，还是需要调用 super()
   ```

### 7. **与 ES5 继承的对比**

| 特性 | ES5 继承 | ES6 继承 |
|------|----------|----------|
| **谁创建 this** | 子类创建 this | 父类创建 this |
| **继承内置类** | 困难，需要复杂hack | 原生支持 |
| **new.target** | 不支持 | 支持 |
| **super() 位置** | 无要求 | 必须先调用（除非返回对象） |
| **抽象类模式** | 手动实现 | 原生支持 |

### 8. **特殊情况：可以不调用 super()**

```javascript
class Child extends Parent {
  constructor() {
    // 只有一种情况可以不调用 super()：
    return { custom: 'object' };
    // 返回非原始值对象，则 this 不会被使用
  }
}

class Child extends Parent {
  constructor() {
    // 如果没有显式返回对象，则必须调用 super()
    super();
    // 或者：
    // return 42;  // ❌ 返回原始值，仍然需要 super()
    // return {};  // ✅ 返回对象，可以不调用 super()
  }
}
```

### 9. **设计哲学和好处**

#### **好处 1：统一性**
所有继承都遵循同样的规则，无论是继承普通类还是内置类。

#### **好处 2：安全性**
防止在父类初始化之前访问或修改属性。

#### **好处 3：支持高级特性**
```javascript
// 1. 抽象类
class AbstractClass {
  constructor() {
    if (new.target === AbstractClass) {
      throw new Error('Cannot instantiate abstract class');
    }
  }
}

// 2. Mixin 模式
const Serializable = Base => class extends Base {
  serialize() {
    return JSON.stringify(this);
  }
};

// 3. 代理模式
class LoggingArray extends Array {
  constructor(...args) {
    console.log('Creating array with:', args);
    super(...args);
  }
}
```

#### **好处 4：更好的性能优化**
引擎可以优化原型链查找和内存布局。

### 10. **总结：为什么必须先调用 super()**

1. **父类负责创建 this**：这是 ES6 继承的核心设计，与 ES5 相反
2. **支持内置类继承**：内置类需要特殊的内部插槽，只能由父类创建
3. **确保 new.target 正确**：父类需要知道是哪个子类在实例化
4. **支持构造函数返回对象**：允许父类控制实例创建
5. **语言一致性**：所有类都遵循同样的规则
6. **安全性**：防止在父类初始化之前使用实例
7. **为高级特性铺路**：支持 Mixin、装饰器、代理等模式

**核心原则**：在 ES6 中，子类实例的生命周期从父类开始，而不是从子类开始。这是与 ES5 最根本的区别，也是为什么必须在构造函数中先调用 `super()` 的原因。

## 原型链

![原型链](./images/proto.awebp)
