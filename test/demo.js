/*
 * @Author: chenfangxu
 * @Date: Sat Oct 29 2022 16:21:12
 * @Description:
 * @LastEditors: chenfangxu
 * @LastEditTime: Sat Oct 29 2022 21:07:34
 * @FilePath: /front/test/demo.js
 */
// 执行 node test/task.js
const path = require("path")
console.log(path.relative("/fangxu/project/","/front/test/task.js"))
// 输出 ../../front/test/task.js
console.log(path.relative("fangxu/project/","front/test/task.js"))
// 输出 ../../front/test/task.js
console.log(path.relative("/fangxu/project/","fangxu/front/test/task.js")) // 一个是绝对路径，一个不是，是的那个会加上 process.cwd()
// 输出 ../../../../../../fangxu/front/test/task.js
// 相当于 console.log(path.relative("/Users/cfangxu/project/front/fangxu/project/","fangxu/front/test/task.js"))
console.log(path.relative("fangxu/project/","/fangxu/front/test/task.js")) // 一个是绝对路径，一个不是，是的那个会加上 process.cwd()
// 输出 ../../Users/cfangxu/project/front/fangxu/front/test/task.js
// 相当于 console.log(path.relative("fangxu/project/","/Users/cfangxu/project/front/fangxu/front/test/task.js"))
console.log(path.relative("fangxu/project/", "fangxu/project/"))
// 输出 ""
console.log(path.relative("/fangxu/project/", "/fangxu/project/"))
// 输出 ""
console.log(path.relative("/fangxu/project/", ""))
// 输出 ../../Users/cfangxu/project/front


