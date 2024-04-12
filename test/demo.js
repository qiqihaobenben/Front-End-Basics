// function TestClass() {
//   this.number = 123
//   this.string = 'abc'
//   this.boolean = true
//   this.symbol = Symbol('test')
//   this.undefined = undefined
//   this.null = null
//   this.object = { name: 'pp' }
//   this.array = [1, 2, 3]
//   this.getSet = {
//     _value: 0,
//     get value() {
//       return this._value
//     },
//     set value(v) {
//       this._value = v
//     },
//   }
// }
// let testObject = new TestClass()
const fs = require('fs')

setTimeout(() => {
  // 新的事件循环的起点

  console.log('1')

  sleep(10000)

  console.log('sleep 10s')
}, 0)

/// 将会在 poll 阶段执行

fs.readFile('./index.html', { encoding: 'utf-8' }, (err, data) => {
  if (err) throw err

  console.log('read file success')
})

console.log('2')

/// 函数实现，参数 n 单位 毫秒 ；

function sleep(n) {
  var start = new Date().getTime()

  while (true) {
    if (new Date().getTime() - start > n) {
      // 使用  break  实现；

      break
    }
  }
}

// 循环 1 -10
for (var i = 1; i <= 10; i++) {
  console.log(i)
}
