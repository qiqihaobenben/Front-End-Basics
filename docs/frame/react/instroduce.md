# React 简介

## React 的内核

React 的受欢迎的原因在于，它能够重新激发，更新甚至转变人们思考和构建用户界面的方式。

React 给于开发者强大的思维模型并帮助开发者以声明式和组件驱动的方式构建用户界面。

React 持续保持“重新思考已建立的最佳实践”的精神，其主要目标是为开发人员提供一种富有表现力的思维模型和一种高性能的技术来构建 UI 应用。

React 思维模型强大是因为它利用了计算机科学和软件工程技术的深层领域，简单来说就是使用了函数式和面向对象编程的概念，并重点将组件作为构建的主要单元。

## React 定义

React 是一个**声明式的、基于组件的库**，用于构建在各种平台（Web 或 Native）甚至是未来的虚拟现实平台（VR）的用户界面。

## React 主旨

React 的主旨是推动简化复杂的任务并把不必要的复杂性从开发人员身上抽离出来。React 试图将性能做得恰到好处，从而让研发人员腾出时间思考应用的其他方面。主要方式之一就是鼓励开发人员使用声明式编程而不是命令式编程。开发人员要声明组件在不同状态下的行为和外观，而 React 的内部机制处理管理更新、更新 UI 等的复杂性。

## Virtual DOM

驱动声明式编程的主要技术之一就是虚拟 DOM，这种虚拟 DOM 是模仿或镜像存在于浏览器中的文档对象模型的数据结构或数据结构的集合。

React 实现虚拟 DOM 并不意味着 Web API 不好，或者不如 React 好（最终 React 也还是使用 JavaScript 通过 DOM 跟 Web 文档进行交互），而是因为大型 Web 应用中直接操作 DOM 的确有一些痛点，通常这些痛点出现在变更检测方面。当数据变化时，我们希望通过更新 UI 来反映它，但很难以一种有效且易于理解的方式做到这点，这正是 React 致力于解决的问题。

为什么加一层虚拟 DOM，因为当访问、修改或创建 DOM 元素时，浏览器常常要在一个结构化的树上执行查询来找到指定的元素，这只是访问一个元素，而且查询通常只是更新的第一部分，后面的通常还有更改部分，这部分不得不重新进行布局和其他操作，所有这些操作往往计算量都很大，造成很大的性能问题。虚拟 DOM 也无法绕过这个问题，但它可以帮助优化对 DOM 的更新。

虚拟 DOM 使用快速比对算法对 DOM 进行高效更新。

除了可以对 DOM 操作提供通用的优化，提高 Web 应用的性能外（不过 React 只是设计的“够快”而已），虚拟 DOM 更为重要的是提供了健壮的 API、简单的思维模型和诸如跨浏览器兼容性等其他特性，而不是对性能的极端关注。

### 虚拟 DOM 工作原理

虚拟 DOM，也称为 VDOM，是实现“根据自变量变化计算出 UI 变化”的一种主流技术。其工作原理可以概括为两个步骤：

1. 根据视图状态生成“VDOM 描述的 UI”
2. 对比变化前后“VDOM 描述的 UI”，计算出 UI 中发生变化的部分

#### Vue 中虚拟 DOM 的工作原理

1. Vue 使用模板语法描述 UI，模板语法编译为 render 函数，render 函数执行后返回“VNode 描述的 UI”，这一步骤在 Vue 中被称为 render
2. 将变化前后“VNode 描述的 UI”进行比较，计算出 UI 中变化的部分，这一步骤在 Vue 中被称为 patch。

#### React 中虚拟 DOM 的工作原理

1. React 使用 JSX 描述 UI，JSX 编译为 createElement 方法，createElement 方法执行后返回“React Element 描述的 UI”
2. 将“React Element 描述的 UI”与变化前的“FiberNode 描述的 UI”进行比较，计算出 UI 中变化的部分，同时生成/更新本次“FiberNode 描述的 UI”

## React 元素

React 元素是 React 中轻量、无状态、不可变的基础类型。

React 元素有两种类型：

- ReactComponentElement：对应着一个 React 的函数组件或类组件
- ReactDOMElement：DOM 元素的虚拟表示

React 元素之于 React 如同 DOM 元素之于 DOM，所以 React 元素是构成 UI 的基础类型。

在创建普通 HTML 标记时，会使用各种各样的元素类型（div、span 等）来包含和组织信息，那么在 React 中，可以使用 React 元素来组成和构建 UI，它会将想要渲染的 React 组件或常规 DOM 元素告诉 React。

### React 渲染过程

React 使用 React 元素来创建虚拟 DOM，ReactDOM 管理和使用虚拟 DOM 来协调和更新实际 DOM。

#### 稍微更详细一点的

- 使用 React.createElement 或 JSX 编写 React 元素，实际上所有的 JSX 代码最后都会转换成 React.createElement(...)， Babel 帮助我们完成了这个转换的过程。

- createElement 函数对 key 和 ref 等特殊的 props 进行处理，并获取 defaultProps 对默认 props 进行赋值，并且对传入的子节点进行处理，最终构造成一个 ReactElement 对象（所谓的虚拟 DOM）。

- ReactDOM.render 将创建好的虚拟 DOM 渲染到指定容器上，其中采用了批处理、事务等机制并且对特定浏览器进行了性能优化，最终转换为真实 DOM。

## 组件

组件是指封装的功能单元，是 React 中最基本的单元，它们利用数据（属性和状态）将 UI 渲染输出。

React 组件应该具有良好的封装性、复用性和组合性。

可以使用函数和 JavaScript 类创建 React 组件，组件有助于将功能、标签、样式和其他 UI 相关的资料打包和组织在一起。组件可以是独立可复用的，这样能够让人独立的思考每个部分。

React 组件就像是 React 元素，但是 React 组件拥有更多特性，React 中的组件是帮助将 React 元素、生命周期函数和业务逻辑代码组织到一起的类。组件可以嵌套组件。

它们可以被创建为扩展自 `React.Component` 基类的类或是函数。

由 `React.Component` 创建组件是通过声明一个继承自 `React.Component` 抽象基类的 JavaScript 类来实现的，这个继承类通常需要至少定义一个 render 方法，这个 render 方法会返回单个 React 元素或是一个 React 元素的数组。

### 如何拆分组件

- 确保组件以合理的方式组织到一起，组件应该围绕相关联的功能进行组织
- 如果发现有一个界面元素重复出现多次，那么这个界面元素通常可以成为一个组件

## JSX

JSX 是对 ECMAScript 的一种类 XML 的语法扩展，但它没有定义任何语意，其专门提供给预处理器使用。

简单说，JSX 是 JavaScript 的扩展，其类似 XML 并且仅用于代码转换工具。

JSX 通过让使用者书写 XML 风格的代码来替代使用 React.createElement 从而起到帮助作用。

## React 状态

### 什么是状态

状态：程序在特定瞬间可访问的所有信息

### 可变状态和不可变状态

- 不可变的：一个不可变的数据结构，随着时间的推移可以支持多个版本，但不能直接覆盖；不可变的数据结构通常是持久的。
- 可变的：一个可变的数据结构，随着时间的推移只支持一个版本，可变的数据结构在其变化时可以被覆盖并且不支持其他版本。可变的数据结构通常是临时的。

可变和不可变可以类比为“保存”和“另存为”

### React 中的状态

一般情况下，与 React 组件中的状态进行通信和交互的方法归结为两类：

- state 状态：可以在组件中改变的数据
- props 属性：组件接收并且不应该被组件改变的数据

## 双向数据绑定

数据双向绑定是一种编程模式，用于简化应用程序开发。这种模式允许我们将用户界面(UI)的元素自动与应用程序的数据模型同步。简单来说，当数据模型改变时，UI 也会自动更新；反过来，当用户在 UI 中进行操作（例如填写表单）时，数据模型也会随之更新。这样，开发者就不需要手动编写额外的代码来同步 UI 和数据模型。

### 在 Vue 中的实现

Vue 通过使用**响应式数据绑定**和**指令**（如`v-model`）来实现数据的双向绑定。Vue 的响应式系统会自动追踪数据对象的属性变化，当这些属性被读取时会收集依赖，当属性变化时会通知变化。

- **响应式系统：** Vue 使用`Object.defineProperty`（在 Vue 2 中）或 Proxy（在 Vue 3 中）来使数据对象变为响应式。这意味着当你修改数据时，Vue 能够自动检测到这些变化并更新 DOM。
- **`v-model`指令：** 在表单元素上使用`v-model`可以轻松实现数据的双向绑定。当表单元素的值发生变化时，绑定的数据模型也会更新；反之亦然。

### 在 React 中的实现

React 采用了不同的方法，称为**单向数据流**，但也可以实现类似双向绑定的效果。React 通过状态（state）和受控组件来管理数据。

- **状态（State）：** React 组件中的状态是组件的数据源。当状态更新时，组件会重新渲染，以反映最新的状态。
- **受控组件：** 在 React 中，表单元素（如`<input>`、`<textarea>`和`<select>`）通常作为受控组件来使用。这意味着 React 组件来管理这些表单元素的状态。例如，你可以使用`setState`方法来更新状态，这会导致组件重新渲染并显示新的值。
- **实现双向绑定的效果：** 虽然 React 默认采用单向数据流，但你可以通过将状态更新逻辑与用户输入事件（如`onChange`）结合使用，来模拟双向绑定的效果。

总结来说，Vue 通过其响应式系统和`v-model`指令提供了内建的双向绑定功能，而 React 通过状态管理和受控组件来实现类似的效果，但本质上采用的是单向数据流的模式。两者各有优势，Vue 的双向绑定简化了数据同步的处理，而 React 的单向数据流则使得数据流向更加清晰，有利于大型应用的状态管理。

## 受控组件和非受控组件

在 React 中，组件的数据管理是通过状态（state）和属性（props）来实现的。受控组件和非受控组件这两个概念，主要用来描述表单元素（如输入框、选择框等）数据是如何被管理的。

### 受控组件

受控组件意味着表单的数据是由 React 组件的状态（state）来管理的。你需要为表单元素编写事件处理函数来管理用户的输入，这样组件的状态就可以作为数据的“真实来源”来控制表单的值。

**优点**：由于表单数据是由 React 的状态管理的，这意味着你的数据存储在 state 中总是最新的，你可以轻松地将其与其他 UI 元素或组件状态同步。

**例子**：

```jsx
class ControlledComponent extends React.Component {
  constructor(props) {
    super(props)
    this.state = { value: '' }
  }

  handleChange = (event) => {
    this.setState({ value: event.target.value })
  }

  render() {
    return <input type="text" value={this.state.value} onChange={this.handleChange} />
  }
}
```

在这个例子中，`<input>`元素的值被 React 的 state 所控制。每次键入字符都会触发`handleChange`方法，从而更新 React 的状态，然后状态的更新会反过来设置输入字段的值。

### 非受控组件

非受控组件则是另一种方式，它不像受控组件那样由 React 的 state 控制数据，而是直接使用 DOM 本身作为数据的来源。这意味着你使用`ref`来从 DOM 节点中获取表单数据。

**优点**：不需要为每个状态更新编写事件处理函数，可以使代码更简洁，在某些情况下也能提高性能。

**例子**：

```jsx
class UncontrolledComponent extends React.Component {
  constructor(props) {
    super(props)
    this.inputRef = React.createRef()
  }

  handleSubmit = (event) => {
    alert('A name was submitted: ' + this.inputRef.current.value)
    event.preventDefault()
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <input type="text" ref={this.inputRef} />
        <button type="submit">Submit</button>
      </form>
    )
  }
}
```

在这个非受控组件的例子中，我们使用`ref`来访问输入框的 DOM 节点，并在表单提交时获取其值。这里，React 不负责输入框的值的更新；这完全是通过 DOM 来管理的。

### 总结

受控组件和非受控组件的主要区别在于数据的管理方式：

- **受控组件**：使用 React 的 state 来管理数据，使 React 成为数据的“唯一真实来源”。
- **非受控组件**：利用 DOM 本身来存储数据，通过`ref`来直接操作 DOM 节点获取数据。

选择哪种方式主要取决于个人偏好以及具体的应用场景。受控组件提供了更多的控制能力和灵活性，适合于需要高度动态交互的表单；非受控组件则在某些情况下可以减少代码量，使得组件更简洁。

## 生命周期

生命周期方法是附属于 React 类组件的特殊方法，其在组件生命周期的特定时间点被执行。生命周期是一种思考组件的方式，拥有生命周期的组件隐喻着它有“声明”——至少有起始、中间和结束。

声明周期方法可以分为两个主要的组：

- 将执行（Will）：在一些事情发生前被调用
- 已完成（Did）：在一些事情发生后被调用

还有一些初始化、更新、错误处理相关

### 生命周期顺序

以父子组件为例

#### 初始化

- ChildComponent: defaultProps 静态方法
- ParentComponent: defaultProps 静态方法

#### 挂载

- ParentComponent: state （执行 constructor）
- ParentComponent: componentWillMount()
- ParentComponent: render （执行 render 函数）
- ChildComponent: state （执行 constructor）
- ChildComponent: componentWillMount()
- ChildComponent: render （执行 render 函数）
- ChildComponent : componentDidMount()
- ParentComponent: componentDidMount()

#### 更新

- ParentComponent: render （执行 render 函数）
- ChildComponent: componentWillReceiveProps()
- ChildComponent: shouldComponentUpdate()
- ChildComponent: componentWillUpdate()
- ChildComponent: render （执行 render 函数）
- ChildComponent: componentDidUpdate()

#### 卸载

- ChildComponent: componentWillUnmount()
- ParentComponent: componentWillUnmount()

## redux

- [实现 Redux](https://yingchenit.github.io/react/redux/#redux%E7%9A%84%E5%BA%94%E7%94%A8%E5%9C%BA%E6%99%AF)
- [深入了解 redux 的中间件机制](https://yingchenit.github.io/react/redux-middleware/)

### react-redux

- [React-Redux 源码剖析](https://soyn.github.io/2019-1-26-ReactRedux%E6%BA%90%E7%A0%81%E8%A7%A3%E8%AF%BB/)
- [带着问题看 React-Redux 源码](https://zhuanlan.zhihu.com/p/80655889)
- [React-Redux 原理](https://xiaoxiaosaohuo.github.io/react-books/redux/react-redux.html)
