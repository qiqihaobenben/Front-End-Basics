# 理解 ES6 中的 Class

类声明和经典原型继承的等价

super 的全解，为什么只有用了 super 才能拿到实例

https://juejin.cn/post/6887065420994609160

// TODO

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

function _classCallCheck(instance, Constructor) {
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

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps)
  if (staticProps) _defineProperties(Constructor, staticProps)
  return Constructor
}

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
