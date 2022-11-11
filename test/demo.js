"use strict";

let firstName = Symbol("first name");

let lastName = Symbol("last name");

// 用于对象字面量的可计算属性名
let person = {
  [firstName]: "tom"
}
// 对象单个属性设置
person[lastName] = "zaka"

// 将属性设置为只读
Object.defineProperty(person, firstName, {writable: false})

// 重写 Symbol 属性
Object.defineProperties(person, {
  [lastName]: {
    value: "nio",
    writable: false
  }
})
// person[lastName] = "aaa" // 严格模式，会报错

