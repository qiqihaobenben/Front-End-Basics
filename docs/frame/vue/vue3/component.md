# Vue3 源码 — 组件详解

组件是一个抽象的概念，它是对一棵 DOM 树的抽象，从表现上看，组件的模板（template 包裹的内容）决定了组件生成的 DOM 标签，在 Vue.js 内部，一个组件想要真正的渲染生成 DOM，需要经历 **创建 vnode** - **渲染 vnode** - **生成 DOM** 这几个步骤。

> vnode 就是一个可以描述组件信息的 JavaScript 对象

## 初始化应用程序

首先看一下 Vue3 的应用初始化：

```js
import { createApp } from 'vue'
import App from './app'
const app = createApp(App)
app.mount('#app')
```

Vue3 和 Vue2 类似，都是把根组件挂载到 id 为 app 的 DOM 节点上，不过 Vue3 导入了一个 createApp 作为入口函数。

```ts
export const createApp = ((...args) => {
  // 创建 app 对象
  const app = ensureRenderer().createApp(...args)

  if (__DEV__) {
    injectNativeTagCheck(app)
    injectCompilerOptionsCheck(app)
  }

  const { mount } = app
  // 重写 mount 方法
  app.mount = (containerOrSelector: Element | ShadowRoot | string): any => {
    const container = normalizeContainer(containerOrSelector)
    if (!container) return

    const component = app._component
    if (!isFunction(component) && !component.render && !component.template) {
      // __UNSAFE__
      // Reason: potential execution of JS expressions in in-DOM template.
      // The user must make sure the in-DOM template is trusted. If it's
      // rendered by the server, the template should not contain any user data.
      component.template = container.innerHTML
      // 2.x compat check
      if (__COMPAT__ && __DEV__) {
        for (let i = 0; i < container.attributes.length; i++) {
          const attr = container.attributes[i]
          if (attr.name !== 'v-cloak' && /^(v-|:|@)/.test(attr.name)) {
            compatUtils.warnDeprecation(
              DeprecationTypes.GLOBAL_MOUNT_CONTAINER,
              null
            )
            break
          }
        }
      }
    }

    // clear content before mounting
    container.innerHTML = ''
    const proxy = mount(container, false, container instanceof SVGElement)
    if (container instanceof Element) {
      container.removeAttribute('v-cloak')
      container.setAttribute('data-v-app', '')
    }
    return proxy
  }
  // 导出 app
  return app
}) as CreateAppFunction<Element>
```

### 创建 app 对象

```ts
const app = ensureRenderer().createApp(...args)
```
