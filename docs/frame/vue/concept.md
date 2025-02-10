# Vue 基础概念

## 库

React 和 Vue 核心都是构建 UI 的库，由两部分组成：

- 基于状态的声明式渲染
- 组件化的层次结构

### **1. 基于状态的声明式渲染**

#### **什么是声明式渲染？**

声明式渲染是指你只需要描述“UI 应该是什么样子”，而不需要关心“如何实现”。换句话说，你只需要定义 UI 的状态，框架会自动根据状态更新 UI。

#### **状态（State）是什么？**

状态是驱动 UI 变化的数据。例如：

- 一个按钮的禁用状态（`disabled: true`）。
- 一个列表的数据（`items: [...]`）。
- 用户的输入值（`inputValue: "..."`）。

#### **React 和 Vue 中的声明式渲染**

- **React**：使用 JSX 描述 UI，状态通过 `useState` 或 `this.state` 管理。
- **Vue**：使用模板语法描述 UI，状态通过 `data` 或 `ref` 管理。

#### **代码示例**

##### **React 示例**

```jsx
import React, { useState } from 'react'

function App() {
  const [count, setCount] = useState(0) // 定义状态

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  )
}

export default App
```

##### **Vue 示例**

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0) // 定义状态

    const increment = () => {
      count.value++
    }

    return {
      count,
      increment,
    }
  },
}
</script>
```

**关键点**：

- 你只需要定义状态（如 `count`）和 UI 的结构，框架会自动将状态渲染到 UI 中。
- 当状态变化时，UI 会自动更新。

---

### **2. 组件化的层次结构**

#### **什么是组件化？**

组件化是将 UI 拆分为独立的、可复用的部分（组件），每个组件负责渲染自己的 UI 和处理自己的逻辑。

#### **组件化的好处**

- **复用性**：可以在多个地方复用同一个组件。
- **可维护性**：将复杂的 UI 拆分为多个小组件，便于理解和维护。
- **独立性**：每个组件可以独立开发、测试和更新。

#### **React 和 Vue 中的组件化**

- **React**：组件是一个函数或类，返回 JSX。
- **Vue**：组件是一个对象，包含模板、逻辑和样式。

#### **代码示例**

##### **React 组件**

```jsx
// Button.jsx
function Button({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}

export default Button;

// App.jsx
import Button from "./Button";

function App() {
  return (
    <div>
      <Button label="Click Me" onClick={() => alert("Button clicked!")} />
    </div>
  );
}

export default App;
```

##### **Vue 组件**

```vue
<!-- Button.vue -->
<template>
  <button @click="onClick">{{ label }}</button>
</template>

<script>
export default {
  props: ['label', 'onClick'],
}
</script>

<!-- App.vue -->
<template>
  <div>
    <Button label="Click Me" :onClick="handleClick" />
  </div>
</template>

<script>
import Button from './Button.vue'

export default {
  components: {
    Button,
  },
  methods: {
    handleClick() {
      alert('Button clicked!')
    },
  },
}
</script>
```

**关键点**：

- 组件可以接收外部传入的数据（如 `label` 和 `onClick`），称为 **props**。
- 组件可以嵌套，形成层次结构。

---

### **3. 如何理解这两个核心概念？**

#### **基于状态的声明式渲染**

- 将 UI 视为状态的函数：`UI = f(state)`。
- 你只需要关注状态的变化，UI 会自动更新。
- 这种方式比传统的命令式渲染（手动操作 DOM）更高效、更易维护。

#### **组件化的层次结构**

- 将 UI 拆分为多个小组件，每个组件负责自己的部分。
- 组件可以嵌套，形成树形结构。
- 通过 props 和事件实现组件之间的通信。

---

### **5. 总结**

- **基于状态的声明式渲染**：关注状态的变化，UI 自动更新。
- **组件化的层次结构**：将 UI 拆分为独立的、可复用的组件。

通过理解这两个核心概念，你可以更好地掌握 React 和 Vue 的设计思想，并在实际开发中灵活运用。如果你有更多问题，欢迎继续提问！ 😊

## 框架

不过，Vue 还是构建用户界面的渐进式框架。

框架可以理解为包含库本身以及其他一些构建支持、数据流方案等附加功能。

如果只是简单的使用 Vue 开发一个小功能，可以直接引入 Vue.js 源码的 CDN 文件。

如果要开发较大型的应用，可以使用 Vue 的脚手架工具初始化项目。

随着应用复杂度的提升，状态管理的难度也相应提升，因此需要额外的状态管理方案来应对，例如 Pinia 和 Vuex。

当应用进一步扩展，从简单的页面升级为 SPA，需要增加客户端路由方案，例如 Vue-Router 等。

后续如果还需要提高客户端首屏的渲染速度，满足 SEO 的需要，就得使用 SSR 渲染。

所以，Vue 的“渐进式”是指“可以按照需求渐进地引入附加功能”，而不是像 AngularJS 一样开箱即用，内置多种功能的前端框架。
