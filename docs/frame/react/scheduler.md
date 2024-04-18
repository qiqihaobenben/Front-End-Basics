# React scheduler 协调器

## 总览

1. Fiber 架构支持 Time Slice 的实现
2. Time Slice 分割出的一个个短宏任务需要 Scheduler（调度器）来具体调度执行
3. 为了更灵活地控制宏任务的执行时机和任务调用的优先级，React 实现了一套基于 Lane 模型的优先级算法
4. 基于 Lane 模型优先级算法实现了 **Batched Updates（批量更新）**、**任务打断/恢复机制**等低级特性，这些特性不适合开发者直接控制，一般由 React 统一管理
5. 基于低级特性，React 实现了“面向开发者”的高级特性（并发特性），例如 Concurrent Suspense、useTransition 等

## Scheduler 的实现原理

### Scheduler 预置了五种优先级

从上到下，优先级依次降低：

- ImmediatePriority（最高优先级，同步执行）
- UserBlockingPriority（用户阻塞优先级）
- NormalPriority（正常优先级）
- LowPriority（低优先级）
- IdlePriority（空闲优先级）

### Scheduler 的工作流程

## Lane 模型的实现原理

### Lane 模型的工作流程

#### 总流程

“各种交互”会引发更新，初始化更新相关信息（会从 FiberNode 冒泡到 FiberRootNode），然后会调度 FiberRootNode，根据调度策略（同步执行或异步执行）进入 render 阶段，render 阶段完成后进入 commit 阶段，commit 阶段完成后继续调度 FiberRootNode。

#### 具体流程

- 同步流程

  “各种交互”会引发更新，初始化更新相关信息（会从 FiberNode 冒泡到 FiberRootNode），然后会调度 FiberRootNode，进入 render 阶段同步执行，render 阶段完成后进入 commit 阶段同步执行，commit 阶段完成后继续调度 FiberRootNode。

- 并发流程

  “各种交互”会引发更新，初始化更新相关信息（会从 FiberNode 冒泡到 FiberRootNode），然后会调度 FiberRootNode，进入 render 阶段并发执行，并发执行过程可能发生中断，中断发生则重新调度 FiberRootNode（即小循环和大循环），render 阶段完成后进入 commit 阶段，commit 阶段完成后继续调度 FiberRootNode。

- render 阶段更新流程

  render 阶段进行过程中触发新的交互，产生更新

- commit 阶段更新流程

  commit 阶段进行过程中触发新的交互，产生更新

### 初始化更新相关信息

上面的流程中，交互使得初始化更新相关信息，主要包括以下三类信息：

- lane 优先级信息，会在 requestUpdateLane 中初始化
- "更新"对应的数据结构 Update
- 交互发生的时间，会在 markRootUpdated 中初始化

#### updateContainer

ReactDOM 的 render 方法会调用 updateContainer

```js
function updateContainer(element, container, parentComponent, callback) {
  // 省略

  var current$1 = container.current
  var eventTime = requestEventTime()
  // current$1 为 HostRootFiber
  var lane = requestUpdateLane(current$1)

  {
    markRenderScheduled(lane)
  }

  // 省略

  var update = createUpdate(eventTime, lane)

  update.payload = {
    element: element,
  }
  callback = callback === undefined ? null : callback

  if (callback !== null) {
    {
      if (typeof callback !== 'function') {
        error('render(...): Expected the last optional `callback` argument to be a ' + 'function. Instead received: %s.', callback)
      }
    }

    update.callback = callback
  }

  enqueueUpdate(current$1, update)
  var root = scheduleUpdateOnFiber(current$1, lane, eventTime)

  if (root !== null) {
    entangleTransitions(root, current$1, lane)
  }

  return lane
}
```

#### requestUpdateLane

updateContainer 会调用 requestUpdateLane 初始化 lane

```js
function requestUpdateLane(fiber) {
  var mode = fiber.mode

  if ((mode & ConcurrentMode) === NoMode) {
    // 如果当前应用未开启并发模式，则返回 SyncLane，对应“同步优先级”
    return SyncLane
  } else if ((executionContext & RenderContext) !== NoContext && workInProgressRootRenderLanes !== NoLanes) {
    // 是否是 render 阶段更新
    // executionContext 用来标记“React 内部的不同运行阶段”
    // - NoContext：0 无上下文
    // - BatchedContext：1 代表当前处在“批量更新”上下文
    // - RenderContext：2 代表当前处在“render 阶段”上下文
    // - CommitContext：4 代表当前处在“commit 阶段”上下文

    // workInProgressRootRenderLanes 代表“当前应用 render 阶段需要处理的 lanes”，选出一批优先级的流程中，选出的 lanes 就保存在 workInProgressRootRenderLanes 中
    // 从 workInProgressRootRenderLanes 中选择“最高优先级的 lane”作为本次更新的优先级
    return pickArbitraryLane(workInProgressRootRenderLanes)
  }

  var isTransition = requestCurrentTransition() !== NoTransition
  //  是否与 transition 相关
  if (isTransition) {
    if (currentEventTransitionLane === NoLane) {
      currentEventTransitionLane = claimNextTransitionLane()
    }

    return currentEventTransitionLane
  }

  var updateLane = getCurrentUpdatePriority() // 返回 currentUpdatePriority
  // 是否有“手动设置的优先级”，例如 Scheduler 提供的 runWithPriority 方法可以设置回调函数上下文的优先级
  if (updateLane !== NoLane) {
    return updateLane
  }
  // 如果以上情况都没有命中，则默认是“事件中产生的更新”。React 通过 window.event.type 获取当前事件类型，然后根据事件类型返回对应的优先级，具体会走到 getEventPriority 方法
  // var DiscreteEventPriority = SyncLane
  // var ContinuousEventPriority = InputContinuousLane
  // var DefaultEventPriority = DefaultLane
  // var IdleEventPriority = IdleLane
  // var currentUpdatePriority = NoLane
  // 例如：click、input、change 等事件，就是 DiscreteEventPriority，scroll、mousemove 等事件，就是 ContinuousEventPriority
  var eventLane = getCurrentEventPriority()
  return eventLane
}
```

#### markUpdateLaneFromFiberToRoot

由于参与调度的是 FiberRootNode，而产生 update 的是某一个 FiberNode（例如初始化时就是 HostFiberNode），因此需要从“产生 update 的 FiberNode”向上遍历直到 FiberRootNode，执行该逻辑的方法是 markUpdateLaneFromFiberToRoot

markUpdateLaneFromFiberToRoot 是在 scheduleUpdateOnFiber 方法中调用的。

```js
function markUpdateLaneFromFiberToRoot(sourceFiber, lane) {
  // 选定的 lane 附加在 源 FiberNode 上，例如应用初始化的时候 sourceFiber 为 HostRootFiber
  sourceFiber.lanes = mergeLanes(sourceFiber.lanes, lane)
  var alternate = sourceFiber.alternate

  if (alternate !== null) {
    alternate.lanes = mergeLanes(alternate.lanes, lane)
  }

  {
    if (alternate === null && (sourceFiber.flags & (Placement | Hydrating)) !== NoFlags) {
      warnAboutUpdateOnNotYetMountedFiberInDEV(sourceFiber)
    }
  } // Walk the parent path to the root and update the child lanes.

  var node = sourceFiber
  var parent = sourceFiber.return

  while (parent !== null) {
    // 选定的 lane 附加在每一级父 fiberNode 的 childLanes 上
    parent.childLanes = mergeLanes(parent.childLanes, lane)
    alternate = parent.alternate

    if (alternate !== null) {
      alternate.childLanes = mergeLanes(alternate.childLanes, lane)
    } else {
      {
        if ((parent.flags & (Placement | Hydrating)) !== NoFlags) {
          warnAboutUpdateOnNotYetMountedFiberInDEV(sourceFiber)
        }
      }
    }

    node = parent
    parent = parent.return
  }

  // 向上遍历的流程会进行到 HostRootFiber，最终返回 HostRootFiber.stateNode，即 FiberRootNode。
  if (node.tag === HostRoot) {
    var root = node.stateNode
    return root
  } else {
    return null
  }
}
```

随着遍历流程层层向上，每个祖先 fiberNode 的 childLanes 中都会附加“源 fiberNode 通过 requestUpdateLane 方法选定的 lane”，这一过程可以称作 “lane 冒泡”。

lane 冒泡的意义是服务于“render 阶段一项重要的优化策略”，简单来说，在 beginWork 中，如果 renderLanes 不包含 workInProgress.childLanes，代表“该 fiberNode 的子孙 fiberNode 中不存在本次 render 阶段选定的 lanes”，可以跳过子孙 fiberNode 的 render 流程。

#### markRootUpdated

markRootUpdated 是在 scheduleUpdateOnFiber 方法中调用的。

markRootUpdated 会在 FiberRootNode.pendingLanes 中附加上“本次更新对应的 lane”，并且会在 FiberRootNode.eventTimes 中记录“交互发生的时间”

### 调度 FiberRootNode

这个过程，需要首先确定 workInProgressRootRenderLanes，即“参与本次 render 阶段的 lanes”;然后执行一些调度策略，最后执行“同步更新流程（React 调度）”或“并发更新流程（Scheduler 调度）”

#### ensureRootIsScheduled

```js
function ensureRootIsScheduled(root, currentTime) {
  var existingCallbackNode = root.callbackNode

  markStarvedLanesAsExpired(root, currentTime)

  var nextLanes = getNextLanes(root, root === workInProgressRoot ? workInProgressRootRenderLanes : NoLanes)

  if (nextLanes === NoLanes) {
    if (existingCallbackNode !== null) {
      cancelCallback$1(existingCallbackNode)
    }

    root.callbackNode = null
    root.callbackPriority = NoLane
    return
  }

  var newCallbackPriority = getHighestPriorityLane(nextLanes)

  var existingCallbackPriority = root.callbackPriority

  if (existingCallbackPriority === newCallbackPriority && !(ReactCurrentActQueue$1.current !== null && existingCallbackNode !== fakeActCallbackNode)) {
    return
  }

  if (existingCallbackNode != null) {
    cancelCallback$1(existingCallbackNode)
  }
  var newCallbackNode

  if (newCallbackPriority === SyncLane) {
    if (root.tag === LegacyRoot) {
      if (ReactCurrentActQueue$1.isBatchingLegacy !== null) {
        ReactCurrentActQueue$1.didScheduleLegacyUpdate = true
      }
      scheduleLegacySyncCallback(performSyncWorkOnRoot.bind(null, root))
    } else {
      scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root))
    }

    {
      if (ReactCurrentActQueue$1.current !== null) {
        ReactCurrentActQueue$1.current.push(flushSyncCallbacks)
      } else {
        scheduleMicrotask(flushSyncCallbacks)
      }
    }

    newCallbackNode = null
  } else {
    var schedulerPriorityLevel

    switch (lanesToEventPriority(nextLanes)) {
      case DiscreteEventPriority:
        schedulerPriorityLevel = ImmediatePriority
        break

      case ContinuousEventPriority:
        schedulerPriorityLevel = UserBlockingPriority
        break

      case DefaultEventPriority:
        schedulerPriorityLevel = NormalPriority
        break

      case IdleEventPriority:
        schedulerPriorityLevel = IdlePriority
        break

      default:
        schedulerPriorityLevel = NormalPriority
        break
    }
    newCallbackNode = scheduleCallback$1(schedulerPriorityLevel, performConcurrentWorkOnRoot.bind(null, root))
  }

  root.callbackPriority = newCallbackPriority
  root.callbackNode = newCallbackNode
}
```

## Scheduler 与 React 的优先级对应

### React 的优先级

### React 事件优先级

### Scheduler 优先级
