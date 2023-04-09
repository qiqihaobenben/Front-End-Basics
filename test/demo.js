function TestClass() {
  this.number = 123
  this.string = 'abc'
  this.boolean = true
  this.symbol = Symbol('test')
  this.undefined = undefined
  this.null = null
  this.object = { name: 'pp' }
  this.array = [1, 2, 3]
  this.getSet = {
    _value: 0,
    get value() {
      return this._value
    },
    set value(v) {
      this._value = v
    },
  }
}
let testObject = new TestClass()
