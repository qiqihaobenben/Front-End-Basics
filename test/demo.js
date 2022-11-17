"use strict";

let uid = Symbol.for("uid")
console.log(Symbol.keyFor(uid)) // "uid"
let desc = String(uid)

let uid2 = Symbol.for("uid") // 返回已有的 Symbol(uid)
console.log(Symbol.keyFor(uid2)) // "uid"

let uid3 = Symbol("uid")
console.log(Symbol.keyFor(uid3)) // undefined
/**
 * Symbol 全局注册表中不存在 uid3 这个 Symbol，也就是不存在与之有关的键，所以最终返回 undefined
 */



