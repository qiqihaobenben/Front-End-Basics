# 文件路径相关

## 文件路径

NodeJS 中的文件路径大概有:

- `__dirname` ：总是返回被执行的 js 文件所在文件夹的绝对路径（CommonJS 模块系统，ESModule 需要使用 import.meta.url 转换）
- `__filename` ：总是返回被执行的 js 文件的绝对路径（也是针对 CommonJS 模块系统）
- `process.cwd()` ：总是返回运行 node 命令时所在的文件夹的绝对路径
- `./` 或者 `../` ：相对路径，这样的路径分为两种情况：
  1. 引入模块，例如在 `require()` 中使用时，跟 `__dirname` 的效果相同，不会因为启动脚本的目录不一样而改变
  2. 在其他情况下跟 `process.cwd()` 效果相同，是相对于启动脚本时所在目录的路径

### 示例

假如文件结构如下：

```
front/
    -lib/
        -common.js
    -test
        -task.js
```

task.js 中的代码如下：

```js
const path = require('path')

console.log(__dirname)
console.log(__filename)
console.log(process.cwd())
console.log(path.resolve('./'))
```

#### 在 `test` 目录下执行 `node task.js`

```
得到的输出是：

/Users/cfangxu/project/front/test
/Users/cfangxu/project/front/test/task.js
/Users/cfangxu/project/front/test
/Users/cfangxu/project/front/test
```

#### 在 `front` 目录下执行 `node front/task.js`

```
得到的输出是：

/Users/cfangxu/project/front/test
/Users/cfangxu/project/front/test/task.js
/Users/cfangxu/project/front
/Users/cfangxu/project/front
```

### 总结

只有在引入模块，例如 `require()` 时才使用相对路径（`./`,`../`）的写法，其他地方一律使用绝对路径，如下：

```js
// 当前目录下
path.dirname(__filename) + '/task.js'

// 相邻目录下
path.resolve(__dirname, '../lib/common.js')
```

## path 模块

path 用于处理文件和目录的路径，这个模块中提供了一些便于开发者开发的工具函数，来协助我们进行复杂的路径判断，提高开发效率。

### path.normalize

规范化路径，处理不规范的路径

```js
const path = require('path')
console.log(path.normalize('/fangxu/project//front//test/..'))
// 输出：/fangxu/project/front
```

### path.parse

解析路径返回一个对象：

- root ：代表根目录
- dir ：代表文件所在的文件夹
- base ：代表当前的文件
- name ：代表文件名
- ext ：代表文件的后缀名

```js
const path = require('path')
console.log(path.parse('/fangxu/project/front/test/task.js'))
/**
 {
  root: '/',
  dir: '/fangxu/project/front/test',
  base: 'task.js',
  ext: '.js',
  name: 'task'
}
*/
```

### path.basename

返回类似 `path.parse` 的 base 字段，但是它还能接收第二个参数 ext（可选参数），当输入第二个参数的时候，打印结果不出现后缀名。

```js
const path = require('path')
console.log(path.basename('/fangxu/project/front/test/task.js'))
// 输出 task.js
console.log(path.basename('/fangxu/project/front/test/task.js', '.js'))
// 输出 task
```

### path.extname

返回后缀名，不过要注意 **没有后缀名** 或者 **整个传参字符串都是后缀名** 时，返回空字符串。

```js
const path = require('path')
console.log(path.extname('task.js'))
// 输出 .js
console.log(path.extname('task.test.js'))
// 输出 .js
console.log(path.extname('task'))
// 输出 ""
console.log(path.extname('.js'))
// 输出 ""
```

### path.dirname

返回文件目录的完整地址

```js
const path = require('path')
console.log(path.dirname('/fangxu/project/front/test/task.js'))
// 输出 /fangxu/project/front/test
```

### path.join

接收多个参数,利用特定分隔符作为定界符将所有的 path 参数连接在一起,生成新的规范化路径

传入的参数是字符串的路径片段，可以是一个，也可以是多个，如果传入的参数中有不是字符串的，会直接报错。

返回的是一个拼接好的路径，但是根据平台的不同，它会对路径进行不同的规范化，例如 `Unix` 系统是 `/`，Window 系统是 `\`。

如果返回的路径字符串长度为零，会返回一个 `.`，代表当前的文件夹。

```js
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
```

### path.resolve

返回当前路径的**绝对路径**，相当于是 shell 下面的 `cd` 操作，从左到右运行一遍 `cd xxx` 命令，最终获取的绝对路径/文件名就是返回的结果了。

但是 resolve 操作和 cd 操作还是有区别的，resolve 的路径可以没有，而且最后进入的可以是文件。

```js
// 执行 node test/task.js
const path = require('path')
console.log(path.resolve('/fangxu/project/', '/front/test/task.js'))
// 输出最后的绝对路径 /front/test/task.js
console.log(path.resolve('fangxu/project/', 'front/test/task.js'))
// 输出 process.cwd() + 后面的参数 /Users/cfangxu/project/front/fangxu/project/front/test/task.js
console.log(path.resolve())
// 输出 process.cwd() /Users/cfangxu/project/front
console.log(path.resolve('./'))
// 输出 process.cwd() /Users/cfangxu/project/front
console.log(path.resolve('/fangxu/project', './', 'front'))
// 第一个参数是绝对路径，输出 /fangxu/project/front
console.log(path.resolve('/fangxu/project', './', 'front', './')) // 最后的 ./ 没有作用
// 第一个参数是绝对路径，输出 /fangxu/project/front
console.log(path.resolve('../'))
// 输出 process.cwd() 的上一级的绝对路径 /Users/cfangxu/project
console.log(path.resolve('/fangxu/project', '../', 'front'))
// 输出 /fangxu/front
console.log(path.resolve('/fangxu/project', '../', 'front', '../'))
// 输出 /fangxu
```

### path.relative

语法是 `path.relative(from, to)` ，从 from 路径，到 to 路径的相对路径。

#### 注意

- 如果 from、to 指向同个路径，那么，返回空字符串
- 如果 from、to 中任一为空，那么，返回当前工作路径

```js
// 在 /Users/cfangxu/project/front 文件夹下
// 执行 node test/task.js
const path = require('path')
console.log(path.relative('/fangxu/project/', '/front/test/task.js'))
// 输出 ../../front/test/task.js
console.log(path.relative('fangxu/project/', 'front/test/task.js'))
// 输出 ../../front/test/task.js
console.log(path.relative('/fangxu/project/', 'fangxu/front/test/task.js')) // 一个是绝对路径，一个不是，不是的那个会加上 process.cwd()
// 输出 ../../Users/cfangxu/project/front/fangxu/front/test/task.js
// 相当于 console.log(path.relative("/fangxu/project/","/Users/cfangxu/project/front/fangxu/front/test/task.js"))
console.log(path.relative('fangxu/project/', '/fangxu/front/test/task.js')) // 一个是绝对路径，一个不是，不是的那个会加上 process.cwd()
// 输出 ../../../../../../fangxu/front/test/task.js
// 相当于 console.log(path.relative("/Users/cfangxu/project/front/fangxu/project/","/fangxu/front/test/task.js"))
console.log(path.relative('fangxu/project/', 'fangxu/project/'))
// 输出 ""
console.log(path.relative('/fangxu/project/', '/fangxu/project/'))
// 输出 ""
console.log(path.relative('/fangxu/project/', ''))
// 一个是绝对路径，一个不是，不是的那个会加上 process.cwd()
// 输出 ../../Users/cfangxu/project/front
// 相当于 console.log(path.relative("/fangxu/project/","/Users/cfangxu/project/front"))
```

## 推荐阅读

- [浅析 NodeJs 的几种文件路径](https://github.com/imsobear/blog/issues/48)
- [浅析 path 常用工具函数源码](http://zoo.zhengcaiyun.cn/blog/article/path-tool)
