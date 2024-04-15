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

const hide = (target, prefix = '_') =>
  new Proxy(target, {
    has: (obj, prop) => !prop.startsWith(prefix) && prop in obj,
    ownKeys: (obj) => Reflect.ownKeys(obj).filter((prop) => typeof prop !== 'string' || !prop.startsWith(prefix)),
    get: (obj, prop, rec) => {
      console.log(prop, rec)
      return prop in rec ? obj[prop] : undefined
    },
  })

let userData = hide({
  firstName: 'Tom',
  mediumHandle: '@tbarrasso',
  _favoriteRapper: 'Drake',
})

userData._favoriteRapper // undefined
'_favoriteRapper' in userData
