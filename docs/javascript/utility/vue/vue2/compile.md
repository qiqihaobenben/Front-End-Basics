# Vue.js 源码 — 编译详解

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
