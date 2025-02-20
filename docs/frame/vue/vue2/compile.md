# 【六】Vue2 源码 — 编译详解

之前我们分析过模板到真实 DOM 渲染的过程，中间有一个环节是把模板编译成 `render` 函数，这个过程我们把它称作编译。

虽然我们可以直接为组件编写 `render` 函数，但是编写 `template` 模板更加直观，也更符合我们的开发习惯。

Vue.js 提供了 2 个版本，一个是 Runtime + Compiler，一个是 Runtime only。前者是包含编译代码的，可以把编译过程放在运行时做，后者是不包含编译代码的，需要借助 webpack 的 `vue-loader` 事先把模板编译成 `render` 函数。

## 编译入口

当我们使用 Runtime + Compiler 的 Vue.js，它的入口是 `src/platforms/web/entry-runtime-with-compiler.js`，看一下它对 `$mount` 函数的定义：

```js
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function(
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  /* istanbul ignore if */
  if (el === document.body || el === document.documentElement) {
    process.env.NODE_ENV !== 'production' &&
      warn(
        `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
      )
    return this
  }

  const options = this.$options
  // resolve template/el and convert to render function
  if (!options.render) {
    let template = options.template
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
          /* istanbul ignore if */
          if (process.env.NODE_ENV !== 'production' && !template) {
            warn(
              `Template element not found or is empty: ${options.template}`,
              this
            )
          }
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } else {
        if (process.env.NODE_ENV !== 'production') {
          warn('invalid template option:' + template, this)
        }
        return this
      }
    } else if (el) {
      template = getOuterHTML(el)
    }
    if (template) {
      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile')
      }

      const { render, staticRenderFns } = compileToFunctions(
        template,
        {
          outputSourceRange: process.env.NODE_ENV !== 'production',
          shouldDecodeNewlines,
          shouldDecodeNewlinesForHref,
          delimiters: options.delimiters,
          comments: options.comments,
        },
        this
      )
      options.render = render
      options.staticRenderFns = staticRenderFns

      /* istanbul ignore if */
      if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
        mark('compile end')
        measure(`vue ${this._name} compile`, 'compile', 'compile end')
      }
    }
  }
  return mount.call(this, el, hydrating)
}
```

这段函数逻辑之前分析过，编译的入口就是在这里：

```js
const { render, staticRenderFns } = compileToFunctions(
  template,
  {
    outputSourceRange: process.env.NODE_ENV !== 'production',
    shouldDecodeNewlines,
    shouldDecodeNewlinesForHref,
    delimiters: options.delimiters,
    comments: options.comments,
  },
  this
)
options.render = render
options.staticRenderFns = staticRenderFns
```

`compileToFunctions` 方法就是把模板 `template` 编译生成 `render` 以及 `staticRenderFns`，它定义在 `src/platforms/web/compiler/index.js` 中：

```js
import { baseOptions } from './options'
import { createCompiler } from 'compiler/index'

const { compile, compileToFunctions } = createCompiler(baseOptions)

export { compile, compileToFunctions }
```

可以看到 `compileToFunctions` 方法实际上是 `createCompiler` 方法的返回值，`createCompiler` 方法接收一个编译配置参数，接下来我们看一下 `createCompiler` 方法的定义，在 `src/compiler/index.js` 中：

```js
// `createCompilerCreator` allows creating compilers that use alternative
// parser/optimizer/codegen, e.g the SSR optimizing compiler.
// Here we just export a default compiler using the default parts.
export const createCompiler = createCompilerCreator(function baseCompile(
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns,
  }
})
```

`createCompiler` 方法实际上是通过调用 `createCompilerCreator` 方法返回的，该方法传入的参数是一个函数，真正的编译过程都在这个 `baseCompile` 函数里执行，`createCompilerCreator` 定义在 `src/compiler/create-compiler.js` 中：

```js
export function createCompilerCreator(baseCompile: Function): Function {
  return function createCompiler(baseOptions: CompilerOptions) {
    function compile(
      template: string,
      options?: CompilerOptions
    ): CompiledResult {
      const finalOptions = Object.create(baseOptions)
      const errors = []
      const tips = []

      let warn = (msg, range, tip) => {
        ;(tip ? tips : errors).push(msg)
      }

      if (options) {
        if (
          process.env.NODE_ENV !== 'production' &&
          options.outputSourceRange
        ) {
          // $flow-disable-line
          const leadingSpaceLength = template.match(/^\s*/)[0].length

          warn = (msg, range, tip) => {
            const data: WarningMessage = { msg }
            if (range) {
              if (range.start != null) {
                data.start = range.start + leadingSpaceLength
              }
              if (range.end != null) {
                data.end = range.end + leadingSpaceLength
              }
            }
            ;(tip ? tips : errors).push(data)
          }
        }
        // merge custom modules
        if (options.modules) {
          finalOptions.modules = (baseOptions.modules || []).concat(
            options.modules
          )
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives || null),
            options.directives
          )
        }
        // copy other options
        for (const key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key]
          }
        }
      }

      finalOptions.warn = warn

      const compiled = baseCompile(template.trim(), finalOptions)
      if (process.env.NODE_ENV !== 'production') {
        detectErrors(compiled.ast, warn)
      }
      compiled.errors = errors
      compiled.tips = tips
      return compiled
    }

    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile),
    }
  }
}
```

可以看到该方法返回了一个 `createCompiler` 的函数，`createCompiler` 接收一个 `baseOptions` 的参数，返回的是一个对象，包括 `compile`方法属性和 `compileToFunctions` 属性。这个 `compileToFunctions` 对应的就是 `$mount` 函数调用的 `compileToFunctions` 方法，它是调用 `createCompileToFunctionFn` 方法的返回值，`createCompileToFunctionFn` 定义在 `src/compiler/to-function.js` 中：

```js
export function createCompileToFunctionFn(compile: Function): Function {
  const cache = Object.create(null)

  return function compileToFunctions(
    template: string,
    options?: CompilerOptions,
    vm?: Component
  ): CompiledFunctionResult {
    options = extend({}, options)
    const warn = options.warn || baseWarn
    delete options.warn

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      // detect possible CSP restriction
      try {
        new Function('return 1')
      } catch (e) {
        if (e.toString().match(/unsafe-eval|CSP/)) {
          warn(
            'It seems you are using the standalone build of Vue.js in an ' +
              'environment with Content Security Policy that prohibits unsafe-eval. ' +
              'The template compiler cannot work in this environment. Consider ' +
              'relaxing the policy to allow unsafe-eval or pre-compiling your ' +
              'templates into render functions.'
          )
        }
      }
    }

    // check cache
    const key = options.delimiters
      ? String(options.delimiters) + template
      : template
    if (cache[key]) {
      return cache[key]
    }

    // compile
    const compiled = compile(template, options)

    // check compilation errors/tips
    if (process.env.NODE_ENV !== 'production') {
      if (compiled.errors && compiled.errors.length) {
        if (options.outputSourceRange) {
          compiled.errors.forEach((e) => {
            warn(
              `Error compiling template:\n\n${e.msg}\n\n` +
                generateCodeFrame(template, e.start, e.end),
              vm
            )
          })
        } else {
          warn(
            `Error compiling template:\n\n${template}\n\n` +
              compiled.errors.map((e) => `- ${e}`).join('\n') +
              '\n',
            vm
          )
        }
      }
      if (compiled.tips && compiled.tips.length) {
        if (options.outputSourceRange) {
          compiled.tips.forEach((e) => tip(e.msg, vm))
        } else {
          compiled.tips.forEach((msg) => tip(msg, vm))
        }
      }
    }

    // turn code into functions
    const res = {}
    const fnGenErrors = []
    res.render = createFunction(compiled.render, fnGenErrors)
    res.staticRenderFns = compiled.staticRenderFns.map((code) => {
      return createFunction(code, fnGenErrors)
    })

    // check function generation errors.
    // this should only happen if there is a bug in the compiler itself.
    // mostly for codegen development use
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production') {
      if ((!compiled.errors || !compiled.errors.length) && fnGenErrors.length) {
        warn(
          `Failed to generate render function:\n\n` +
            fnGenErrors
              .map(({ err, code }) => `${err.toString()} in\n\n${code}\n`)
              .join('\n'),
          vm
        )
      }
    }

    return (cache[key] = res)
  }
}
```

至此，我们总算找到了 `compileToFunctions` 的最终定义，它接收 3 个参数：编译模板 `template`，编译配置 `options` 和 Vue 实例 `vm`。核心的编译过程就一行代码：

```js
// compile
const compiled = compile(template, options)
```

`compile` 函数在执行 `createCompileToFunctionFn` 的时候作为参数传入，它是 `createCompiler` 函数中定义的 `compile` 函数：

```js
/** src/compiler/create-compiler.js */

function compile(template: string, options?: CompilerOptions): CompiledResult {
  const finalOptions = Object.create(baseOptions)
  const errors = []
  const tips = []

  let warn = (msg, range, tip) => {
    ;(tip ? tips : errors).push(msg)
  }

  if (options) {
    if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
      // $flow-disable-line
      const leadingSpaceLength = template.match(/^\s*/)[0].length

      warn = (msg, range, tip) => {
        const data: WarningMessage = { msg }
        if (range) {
          if (range.start != null) {
            data.start = range.start + leadingSpaceLength
          }
          if (range.end != null) {
            data.end = range.end + leadingSpaceLength
          }
        }
        ;(tip ? tips : errors).push(data)
      }
    }
    // merge custom modules
    if (options.modules) {
      finalOptions.modules = (baseOptions.modules || []).concat(options.modules)
    }
    // merge custom directives
    if (options.directives) {
      finalOptions.directives = extend(
        Object.create(baseOptions.directives || null),
        options.directives
      )
    }
    // copy other options
    for (const key in options) {
      if (key !== 'modules' && key !== 'directives') {
        finalOptions[key] = options[key]
      }
    }
  }

  finalOptions.warn = warn

  const compiled = baseCompile(template.trim(), finalOptions)
  if (process.env.NODE_ENV !== 'production') {
    detectErrors(compiled.ast, warn)
  }
  compiled.errors = errors
  compiled.tips = tips
  return compiled
}
```

`compile` 函数执行的逻辑是先处理配置参数，真正执行编译过程就一行代码：

```js
const compiled = baseCompile(template.trim(), finalOptions)
```

`baseCompile` 在执行 `createCompilerCreator` 方法时作为参数传入，如下：

```js
/** src/compiler/index.js */

export const createCompiler = createCompilerCreator(function baseCompile(
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options)
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options)
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns,
  }
})
```

所以编译的入口我们终于找到了，它主要就是执行了如下几个逻辑：

- 解析模板字符串生成 AST

```js
const ast = parse(template.trim(), options)
```

- 优化语法树

```js
if (options.optimize !== false) {
  optimize(ast, options)
}
```

- 生成代码

```js
const code = generate(ast, options)
```

编译入口逻辑之所以这么绕，是因为 Vue.js 在不同的平台下都会有编译的过程，因此编译过程中依赖的配置 `baseOptions` 会有所不同。而编译过程会多次执行，但同一个平台下每一次的编译过程配置又是相同的，为了不让这些配置在每次编译过程都通过参数传入，Vue.js 利用了函数柯里化的技巧很好的实现了 `baseOptions` 的参数保留。同样，Vue.js 也是利用函数柯里化的技巧把基础的编译过程函数抽出来，通过 `createCompilerCreator(baseCompile)` 的方式把真正编译的过程和其他逻辑，如对编译配置处理、缓存处理等剥离开，这样的设计还是非常巧妙的。

## parse

编译过程首先就是对模板做解析，生成 AST，它是一种抽象语法树，是对源代码抽象语法结构的树状表现形式。在很多编译技术中，如 babel 编译 ES6 的代码都会先生成 AST。

这个过程是比较复杂的，它会用到大量正则表达式对字符串解析。为了直观的演示 `parse` 的过程，我们先来看一个例子：

```html
<ul :class="bindCls" class="list" v-if="isShow">
  <li v-for="(item,index) in data" @click="clickItem(index)">
    {{item}}:{{index}}
  </li>
</ul>
```

经过 `parse` 过程后，生成的 AST 如下：

```js
ast = {
  'type': 1,
  'tag': 'ul',
  'attrsList': [],
  'attrsMap': {
    ':class': 'bindCls',
    'class': 'list',
    'v-if': 'isShow'
  },
  'if': 'isShow',
  'ifConditions': [{
    'exp': 'isShow',
    'block': // ul ast element
  }],
  'parent': undefined,
  'plain': false,
  'staticClass': 'list',
  'classBinding': 'bindCls',
  'children': [{
    'type': 1,
    'tag': 'li',
    'attrsList': [{
      'name': '@click',
      'value': 'clickItem(index)'
    }],
    'attrsMap': {
      '@click': 'clickItem(index)',
      'v-for': '(item,index) in data'
     },
    'parent': // ul ast element
    'plain': false,
    'events': {
      'click': {
        'value': 'clickItem(index)'
      }
    },
    'hasBindings': true,
    'for': 'data',
    'alias': 'item',
    'iterator1': 'index',
    'children': [
      'type': 2,
      'expression': '_s(item)+":"+_s(index)'
      'text': '{{item}}:{{index}}',
      'tokens': [
        {'@binding':'item'},
        ':',
        {'@binding':'index'}
      ]
    ]
  }]
}
```

可以看到，生成的 AST 是一个树状结构，每一个节点都是一个 `ast element`，除了它自身的一些属性，还维护了它的父子关系，如 `parent` 指向它的父节点， `children` 指向它的所有子节点。先对 AST 有一些直观的印象，那么接下来我们来分析一下这个 AST 是如何得到的。

### parse 整体流程

首先来看一下 `parse` 的定义，在 `src/compiler/parser/index.js` 中：

```js
/**
 * Convert HTML string to AST.
 */
export function parse(
  template: string,
  options: CompilerOptions
): ASTElement | void {
  getFnsAndConfigFromOptions(options)

  parseHTML(template, {
    // options ...
    start(tag, attrs, unary) {
      let element = createASTElement(tag, attrs)
      processElement(element)
      treeManagement()
    },

    end() {
      treeManagement()
      closeElement()
    },

    chars(text: string) {
      handleText()
      createChildrenASTOfText()
    },
    comment(text: string) {
      createChildrenASTOfComment()
    },
  })
  return astRootElement
}
```

`parse` 函数的代码很长，先把它拆成伪代码的形式，方便对整体流程现有一个大致的了解。接下来我们就来分解分析每段伪代码的作用。

#### 从 options 中获取方法和配置

对应伪代码：

```js
getFnsAndConfigFromOptions(options)
```

`parse` 函数的输入是 `template` 和 `options`，输出是 AST 的根节点。`template` 就是我们的模板字符串，而 `options` 实际上是和平台相关的一些配置，它定义在 `src/platforms/web/compiler/options.js` 中：

```js
import {
  isPreTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace,
} from '../util/index'

import modules from './modules/index'
import directives from './directives/index'
import { genStaticKeys } from 'shared/util'
import { isUnaryTag, canBeLeftOpenTag } from './util'

export const baseOptions: CompilerOptions = {
  expectHTML: true,
  modules,
  directives,
  isPreTag,
  isUnaryTag,
  mustUseProp,
  canBeLeftOpenTag,
  isReservedTag,
  getTagNamespace,
  staticKeys: genStaticKeys(modules),
}
```

这些属性和方法之所以放到 `platforms` 目录下是因为它们在不同的平台（web 和 weex）的实现是不同的。

我们用伪代码 `getFnsAndConfigFromOptions` 表示了这一过程，它的实际代码如下：

```js
platformIsPreTag = options.isPreTag || no
platformMustUseProp = options.mustUseProp || no
platformGetTagNamespace = options.getTagNamespace || no
const isReservedTag = options.isReservedTag || no
maybeComponent = (el: ASTElement) => !!el.component || !isReservedTag(el.tag)

transforms = pluckModuleFunction(options.modules, 'transformNode')
preTransforms = pluckModuleFunction(options.modules, 'preTransformNode')
postTransforms = pluckModuleFunction(options.modules, 'postTransformNode')

delimiters = options.delimiters
```

这些方法和配置都是后续解析的时候需要的。

#### 解析 HTML 模板

对应伪代码：

```js
parseHTML(template, options)
```

对于 `template` 模板的解析主要是通过 `parseHTML` 函数，它定义在 `src/compiler/parser/html-parser.js` 中：

```js
export function parseHTML(html, options) {
  let lastTag
  while (html) {
    if (!lastTag || !isPlainTextElement(lastTag)) {
      let textEnd = html.indexOf('<')
      if (textEnd === 0) {
        if (matchComment) {
          advance(commentLength)
          continue
        }
        if (matchDoctype) {
          advance(doctypeLength)
          continue
        }
        if (matchEndTag) {
          advance(endTagLength)
          parseEndTag()
          continue
        }
        if (matchStartTag) {
          parseStartTag()
          handleStartTag()
          continue
        }
      }
      handleText()
      advance(textLength)
    } else {
      handlePlainTextElement()
      parseEndTag()
    }
  }
}
```

由于 `parseHTML` 的逻辑也非常复杂，因此也用了伪代码的方式表达，整体来说它的逻辑就是循环解析 `template`，用正则做各种匹配，对于不同情况分别进行不同的处理，直到整个 template 被解析完毕。在匹配的过程中会利用 `advance` 函数不断前进整个模板字符串，直到字符串末尾。

```js
function advance(n) {
  index += n
  html = html.substring(n)
}
```

为了更加直观地说明 `advance` 的作用，可以通过一幅图表示，最开始 index 是 0 ：

[](./images/advance1.png)

然后调用 `advance` 函数：

```js
advance(4)
```

得到结果：

[](./images/advance2.png)

匹配的过程中主要利用了正则表达式，如下：

```js
// Regular Expressions for parsing tags and attributes
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const doctype = /^<!DOCTYPE [^>]+>/i
// #7298: escape - to avoid being passed as HTML comment when inlined in page
const comment = /^<!\--/
const conditionalComment = /^<!\[/
```

通过这些正则表达式，我们可以匹配注释节点、文档类型节点、开始闭合标签等。

- 注释节点、文档类型节点

对于注释节点和文档类型节点的匹配，如果匹配到，我们仅仅做的是前进即可。

```js
// Comment:
if (comment.test(html)) {
  const commentEnd = html.indexOf('-->')

  if (commentEnd >= 0) {
    if (options.shouldKeepComment) {
      options.comment(
        html.substring(4, commentEnd),
        index,
        index + commentEnd + 3
      )
    }
    advance(commentEnd + 3)
    continue
  }
}

// http://en.wikipedia.org/wiki/Conditional_comment#Downlevel-revealed_conditional_comment
if (conditionalComment.test(html)) {
  const conditionalEnd = html.indexOf(']>')

  if (conditionalEnd >= 0) {
    advance(conditionalEnd + 2)
    continue
  }
}

// Doctype:
const doctypeMatch = html.match(doctype)
if (doctypeMatch) {
  advance(doctypeMatch[0].length)
  continue
}
```

对于注释和条件注释节点，前进至它们的末位位置；对于文档类型节点，则前进它自身长度。

- 开始标签

```js
// Start tag:
const startTagMatch = parseStartTag()
if (startTagMatch) {
  handleStartTag(startTagMatch)
  if (shouldIgnoreFirstNewline(startTagMatch.tagName, html)) {
    advance(1)
  }
  continue
}
```

首先通过 `parseStartTag` 解析开始标签：

```js
function parseStartTag() {
  const start = html.match(startTagOpen)
  if (start) {
    const match = {
      tagName: start[1],
      attrs: [],
      start: index,
    }
    advance(start[0].length)
    let end, attr
    while (
      !(end = html.match(startTagClose)) &&
      (attr = html.match(dynamicArgAttribute) || html.match(attribute))
    ) {
      attr.start = index
      advance(attr[0].length)
      attr.end = index
      match.attrs.push(attr)
    }
    if (end) {
      match.unarySlash = end[1]
      advance(end[0].length)
      match.end = index
      return match
    }
  }
}
```

对于开始标签，除了标签名之外，还有一些标签相关的属性。函数先通过正则表达式 `startTagOpen` 匹配到开始标签，然后定义了 `match` 对象，接着循环去匹配开始标签中的属性并添加到 `match.attrs` 中，直到匹配的开始标签的闭合符结束。如果匹配到闭合符，则获取一元斜线符，前进到闭合符尾，并把当前索引赋值给 `match.end`。

`parseStartTag` 对开始标签解析拿到 `match` 后，紧接着会执行 `handleStartTag` 对 `match` 做处理：

```js
function handleStartTag(match) {
  const tagName = match.tagName
  const unarySlash = match.unarySlash

  if (expectHTML) {
    if (lastTag === 'p' && isNonPhrasingTag(tagName)) {
      parseEndTag(lastTag)
    }
    if (canBeLeftOpenTag(tagName) && lastTag === tagName) {
      parseEndTag(tagName)
    }
  }

  const unary = isUnaryTag(tagName) || !!unarySlash

  const l = match.attrs.length
  const attrs = new Array(l)
  for (let i = 0; i < l; i++) {
    const args = match.attrs[i]
    const value = args[3] || args[4] || args[5] || ''
    const shouldDecodeNewlines =
      tagName === 'a' && args[1] === 'href'
        ? options.shouldDecodeNewlinesForHref
        : options.shouldDecodeNewlines
    attrs[i] = {
      name: args[1],
      value: decodeAttr(value, shouldDecodeNewlines),
    }
    if (process.env.NODE_ENV !== 'production' && options.outputSourceRange) {
      attrs[i].start = args.start + args[0].match(/^\s*/).length
      attrs[i].end = args.end
    }
  }

  if (!unary) {
    stack.push({
      tag: tagName,
      lowerCasedTag: tagName.toLowerCase(),
      attrs: attrs,
      start: match.start,
      end: match.end,
    })
    lastTag = tagName
  }

  if (options.start) {
    options.start(tagName, attrs, unary, match.start, match.end)
  }
}
```

`handleStartTag` 的核心逻辑很简单，先判断开始标签是否是一元标签，类似 `<img> 、 <br/>` 这样，接着对 `match.attrs` 遍历并做了一些处理，最后判断如果非一元标签，则往`stack` 里 push 一个对象，并且把 `tagName` 赋值给 `lastTag`。

最后调用了 `options.start` 回调函数，并传入一些参数。

- 闭合标签

```js
// End tag:
const endTagMatch = html.match(endTag)
if (endTagMatch) {
  const curIndex = index
  advance(endTagMatch[0].length)
  parseEndTag(endTagMatch[1], curIndex, index)
  continue
}
```

先通过正则 `endTag` 匹配到闭合标签，然后前进到闭合标签末尾，然后执行 `parseEndTag` 方法对闭合标签做解析。

```js
function parseEndTag(tagName, start, end) {
  let pos, lowerCasedTagName
  if (start == null) start = index
  if (end == null) end = index

  // Find the closest opened tag of the same type
  if (tagName) {
    lowerCasedTagName = tagName.toLowerCase()
    for (pos = stack.length - 1; pos >= 0; pos--) {
      if (stack[pos].lowerCasedTag === lowerCasedTagName) {
        break
      }
    }
  } else {
    // If no tag name is provided, clean shop
    pos = 0
  }

  if (pos >= 0) {
    // Close all the open elements, up the stack
    for (let i = stack.length - 1; i >= pos; i--) {
      if (
        process.env.NODE_ENV !== 'production' &&
        (i > pos || !tagName) &&
        options.warn
      ) {
        options.warn(`tag <${stack[i].tag}> has no matching end tag.`, {
          start: stack[i].start,
          end: stack[i].end,
        })
      }
      if (options.end) {
        options.end(stack[i].tag, start, end)
      }
    }

    // Remove the open elements from the stack
    stack.length = pos
    lastTag = pos && stack[pos - 1].tag
  } else if (lowerCasedTagName === 'br') {
    if (options.start) {
      options.start(tagName, [], true, start, end)
    }
  } else if (lowerCasedTagName === 'p') {
    if (options.start) {
      options.start(tagName, [], false, start, end)
    }
    if (options.end) {
      options.end(tagName, start, end)
    }
  }
}
```

`parseEndTag` 的核心逻辑很简单，在介绍之前我们回顾一下在执行 `handleStartTag` 的时候，对于非一元标签（有 endTag），我们都把它构成一个对象压入到 `stack` 中，如图所示：

[](./images/stack.png)

那么对于闭合标签的解析，就是倒序 `stack` 找到第一个和当前 `endTag` 匹配的元素。如果是正常的标签匹配，那么 `stack` 的最后一个元素应该和当前的 `endTag` 匹配，但是考虑到如下错误情况：

```html
<div><span></div>
```

这个时候当 `endTag` 为 `</div>` 的时候，从 `stack` 尾部找到的标签是 `<span>`，就不能匹配，因此这种情况会报警告。匹配后把栈到 `pos` 位置的都弹出，并从 `stack` 尾部拿到 `lastTag`。

最后调用了 `options.end` 回到函数，并传入一些参数。

- 文本

```js
let text, rest, next
if (textEnd >= 0) {
  rest = html.slice(textEnd)
  while (
    !endTag.test(rest) &&
    !startTagOpen.test(rest) &&
    !comment.test(rest) &&
    !conditionalComment.test(rest)
  ) {
    // < in plain text, be forgiving and treat it as text
    next = rest.indexOf('<', 1)
    if (next < 0) break
    textEnd += next
    rest = html.slice(textEnd)
  }
  text = html.substring(0, textEnd)
}

if (textEnd < 0) {
  text = html
}

if (text) {
  advance(text.length)
}

if (options.chars && text) {
  options.chars(text, index - text.length, index)
}
```

接下来判断 `textEnd` 是否是大于等于 0 的，满足则说明从当前位置到 `textEnd` 位置都是文本，并且如果 `<` 是纯文本中的字符，就继续找到真正的文本结束的位置，然后前进到结束的位置。

再继续判断 `textEnd` 小于 0 的情况，则说明整个 `template` 解析完毕了，把剩余的 `html` 都复制给了 `text`。

最后调用了 `options.chars` 回到函数，并传入 `text` 参数。

因此，在循环解析整个 `template` 的过程中，会根据不同的情况，去执行不同的回调函数。
