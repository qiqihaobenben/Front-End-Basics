# React 的状态更新

## 触发状态更新的方法

React 中有以下触发状态更新的方法：

- ReactDOM.render，对应的 FiberNode 的 tag 是`HostRoot`
- this.setState，对应的 FiberNode 的 tag 是`ClassComponent`
- this.forceUpdate，对应的 FiberNode 的 tag 是`ClassComponent`
- useState dispacher，对应的 FiberNode 的 tag 是`FunctionComponent`
- useReducer dispacher，对应的 FiberNode 的 tag 是`FunctionComponent`

虽然这些方法的执行场景不同，但是都可以接入同样的更新流程，原因在于，它们使用同一种数据结构代表“更新”，这种数据结构就是 `Update`。

## update 的数据结构

三种不同的 tag： HostRoot、ClassComponent、FunctionComponent ，存在两种不同数据结构的 Update。

### HostRoot 与 ClassComponent 共用一种 Update 结构

```
update = {
  eventTime,
  lane,

  // 区分触发更新的场景
  // UpdateState 代表“默认情况，通过 ReactDOM.render 或 this.setState 触发更新”
  // ReplaceState 代表“在 ClassComponent 生命周期函数中直接改变 this.state”
  // ForceUpdate 代表“通过 this.forceUpdate 触发更新”
  // CaptureUpdate 代表“发生错误的情况下在 ClassComponent 或 HostRoot 中触发的更新”（比如通过 getDerivedStateFromError 方法）
  tag: UpdateState | ReplaceState | ForceUpdate | CaptureUpdate,

  // 承载变更的内容
  // 例如：ReactDOM.createRoot(rootEle).render(<App />) 时，payload 为{element}，element 为 HostRoot 对应的 JSX，即<App />对应的 JSX
  // 例如：this.setState({num: 1}) 时，payload 为 {num: 1}
  // 例如：this.setState({num: (num) => num + 1}) 时，payload 为 {num: (num) => num + 1}
  payload: null,

  // UI 渲染后触发的回调函数
  callback: null,

  next: null,
};
```

### FunctionComponent 单独使用一种 Update 结构

```
update = {
  lane,
  // 例如：updateNum(1) 时，action:1
  // 例如：updateNum((num) => num + 1) 时，action:(num) => num + 1
  action,
  // 优化策略相关字段
  hasEagerState: false,
  eagerState: null,
  next: null,
}
```

### 产生 update

开发者可以在多种场景中触发更新：

- 回调函数中，如 onClick 回调；
- 生命周期函数中，如 UNSAFE_componentWillReceiveProps 方法内；
- render 函数中。

#### 按照场景划分，共有三类 update

- 非 React 工作流程内产生的 update，比如交互触发的更新
- RenderPhaseUpdate，render 阶段产生的 update，如 UNSAFE_componentWillReceiveProps 方法内触发的更新
- InterleavedUpdate，除 render 阶段外，在 React 工作流程其他阶段产生的 update。

#### 优先级低和优先级不足的区别

在基于 lane 模型的 React 中，对于 updateLane（update 的优先级）与 renderLanes（workInProgressRootRenderLanes）：

- 优先级不足是指 updatelane 不包含在 renderLanes 的集合中

```js
//  判断 updateLane 是否包含在 renderLanes 中
isSubsetOfLanes(renderLanes, updateLane)
function isSubsetOfLanes(set, subset) {
  return (set & subset) === subset
}
```

- 优先级第是两个 lane 之间数字大小的直观比较

## updateQueue

update 是计算 state 的的最小单位，updateQueue 是保存“参与 state 计算的相关数据”的数据结构。

```
updateQueue = {
  // 代表参与计算的初始 state，每一次 update 基于该 state 计算 state
  baseState: null,
  // 本次更新前该 fiberNode 中已保存的 update，以链表形式存在，链表头为firstBaseUpdate，链表尾为 lastBaseUpdate
  firstBaseUpdate: null,
  lastBaseUpdate: null,
  shared: {
    // 触发更新后，产生的 update 会保存在 shared.pending 中形成单向环状链表。计算 state 时，该环状链表会被拆分并拼接在 lastBaseUpdate 后面
    pending: null,
    interleaved: null,
    lanes: NoLanes,
  },
  effects: null,
}
```

### state 计算流程

1. 将 baseUpdate 与 shared.pending 拼接成新链表
2. 遍历拼接后的新链表，根据 workInProgressRootRenderLanes 选定的优先级，基于“符合优先级条件的 update” 计算 state
3. 如果 update 没有被跳过
   - 以 updateReducer 函数为例，其中 newBaseQueueLast 为 null ，代表计算过程中没有 update 被跳过
   - 则“上一次 render 阶段计算出的 memoizedState”等于“下一次 render 阶段计算更新基于的 baseState”，即 memoizedState 与 baseState 一致。
4. 如果 update 被跳过
   - 以 updateReducer 函数为例，其中 newBaseQueueLast 不为 null，未参与计算的 update 会保存在 workInProgressHook 的 baseQueue 中（注意，baseQueue 是从跳过的那个 update 开始，后面链表中所有的 update），并将 beginWork 中“消费的 lane”重置，然后把每一个 update 的 lane 赋值为 NoLane。无论下次 renderLane 优先级如何， 该 update 都会在下次更新中参与计算。
   - 计算的 state 为中间 state，此时 memoizedState 与 baseState 不一致
5. 不管有没有中断此次 render 阶段，所有的 update 都会保存在 currentHook 的 baseQueue 中，防止在中断后恢复时丢失。

### React 中的计算状态

update 拥有优先级代表不是所有 update 都能参与计算（由于优先级不足）。

update 之间的依赖代表互相依赖的 update 必须同时参与计算。

为了同时满足这两个相悖的条件，React 存在“计算不完全的中间状态”与“计算完全的最终状态”。

## `ReactDOM.createRoot(rootEle).render(<App />)` 流程

- ReactDOM.createRoot
  - 首先会调用 createContainer 创建 FiberRootNode
  - 然后会调用 listenToAllSupportedEvents 初始化事件委托
  - 最后返回 `new ReactDOMRoot(root)` 实例
- ReactDOMRoot 实例调用 render 方法，然后会调用 UpdateContainer ，UpdateContainer 中会调用以下方法：
  - 调用 requestEventTime 获取当前时间
  - 调用 requestUpdateLane 获取此次更新优先级
  - 调用 createUpdate 创建 update
  - 调用 enqueueUpdate 将 update 加入到 HostRootFiber 的 updateQueue
  - 最后调用 scheduleUpdateOnFiber 开始调度

### update 数据结构

`ReactDOMRoot.render(<App />)` 执行后会开启首屏渲染流程，此时的 update 数据结构如下：

```js
const update = {
  payload: { element: <App /> },
  tag: UpdateState,
  next: null,
  // 省略其他字段
}
```

接下来进入 schedule 阶段，调度完成后进入 render 阶段，在 HostRoot 的 beginWork 中计算 state，其中 updateQueue 的结构如下：

```js
const updateQueue = {
  baseState: { element: null },
  shared: {
    // 上述 update
    pending: update,
    // 省略其他字段
  },
  // 省略其他字段
}
```

ClassComponent 通过 this.setState 触发的更新也遵循上述流程。

### useState 流程

例如：

```js
const [num, updateNum] = useState(0)
```

当 updateNum 方法执行后，会调用源码内的 dispatchSetState 方法，dispatchSetState 方法会调用以下方法：

- 调用 requestUpdateLane 获取此次更新优先级
- 创建 update
- 判断如果是 render 阶段触发的更新，调用 enqueueRenderPhaseUpdate，后面的流程不再执行
- 调用 enqueueUpdate(fiber, queue, update, lane) 向链表中插入 update
- 性能优化策略 eagerState
- 调用 requestEventTime 获取当前时间
- 调用 scheduleUpdateOnFiber 开始调度

## 状态更新的性能优化

### 性能优化的两个方向

- 编写“符合性能优化策略的组件”，命中策略
  - eagerState 策略
  - bailout 策略
- 调用性能优化 API，命中策略。
  - shouldComponentUpdate
  - PureComponent
  - React.memo
  - UseMemo、useCallback

上面这些性能优化的 API 的出现是由于“React 无法像 Vue 一样在编译时做出优化，因此这部分工作放在运行时交由开发者完成”。事实上，React 内部有完整的运行时性能优化策略，开发者调用性能优化 API 的本质就是命中上述 eagerState 和 bailout 策略。

### eagerState 策略

eagerState 策略的逻辑很简单：如果某个状态更新前后没有变化，则可以跳过后续更新流程。

命中该策略的更新不会进入 schedule 阶段，也不会进入 render 阶段。

例如，useState 触发的更新，会发生在 dispatchSetState 方法中：

```js
// 判断 current、workInProgress 的 lanes 是否为 NoLanes，即判断当前 fiberNode 是否存在更新
if (fiber.lanes === NoLanes && (alternate === null || alternate.lanes === NoLanes)) {
  // 如果不存在，则尝试使用上次计算时使用的 reducer 计算 eagerState
  var lastRenderedReducer = queue.lastRenderedReducer

  if (lastRenderedReducer !== null) {
    var prevDispatcher

    {
      prevDispatcher = ReactCurrentDispatcher$1.current
      ReactCurrentDispatcher$1.current = InvalidNestedHooksDispatcherOnUpdateInDEV
    }

    try {
      var currentState = queue.lastRenderedState
      var eagerState = lastRenderedReducer(currentState, action)
      update.hasEagerState = true
      update.eagerState = eagerState
      if (objectIs(eagerState, currentState)) {
        // state 不变时，直接返回，不会调用 scheduleUpdateOnFiber 进入 schedule 阶段
        return
      }
      // 即使不为 true，由于这是“当前 fiberNode 中第一个待执行更新”，在它之前不会有其他 update 影响它的计算结果，因此可以将 eagerState 保存下来。在 beginWork 中计算 state 时，对于该 update，会直接使用 eagerState，不需要在基于 update.action 计算。
    } catch (error) {
    } finally {
      {
        ReactCurrentDispatcher$1.current = prevDispatcher
      }
    }
  }
}

var eventTime = requestEventTime()
var root = scheduleUpdateOnFiber(fiber, lane, eventTime)
```

### bailout 策略

进入 beginWork 后，有两次与“是否命中 bailout 策略”相关的判断。

#### 第一次发生在刚进入 beginWork 时，需要同时满足以下条件后命中 bailout 策略

- oldProps === newProps 只有当服 fiberNode 命中 bailout 策略，复用子 fiberNode，在子 fiberNode 的 beginWork 中，oldProps 才会与 newProps 全等。
- legacy Context（旧的 Context API）没有变化
- fiberNode.type 没有变化（函数组件中，fiberNode.type 是函数组件的执行结果）
- 当前 fiberNode 没有更新发生。

没有更新发生意味着没有 state 变化。
