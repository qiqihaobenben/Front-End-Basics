/*
 * @Author: chenfangxu
 * @Date: Sat Oct 29 2022 16:21:12
 * @Description:
 * @LastEditors: chenfangxu
 * @LastEditTime: 2022-11-06 15:06:42
 * @FilePath: /front/test/demo.js
 */
// 在 /Users/cfangxu/project/front 文件夹下
// 执行 node test/task.js
const path = require('path')
console.log(path.join('/fangxu/project/', '/front/test/task.js'))
// 输出 /fangxu/project/front/test/task.js
console.log(path.join('fangxu/project/', 'front/test/task.js'))
// 输出 fangxu/project/front/test/task.js
console.log(path.join())
// 输出 .
console.log(path.join('./'))
// 输出 ./
console.log(path.join('/fangxu/project', './', 'front'))
// 输出 /fangxu/project/front
console.log(path.join('/fangxu/project', './', 'front', './')) // 注意跟上一个的区别，最后多了分隔符
// 输出 /fangxu/project/front/
console.log(path.join('../'))
// 输出 ../
console.log(path.join('/fangxu/project', '../', 'front'))
// 输出 /fangxu/front
console.log(path.join('/fangxu/project', '../', 'front', '../')) // 注意跟上一个的区别，最后多了分隔符
// 输出 /fangxu/

