# React scheduler 协调器

## 总览

1. Fiber 架构支持 Time Slice 的实现
2. Time Slice 分割出的一个个短宏任务需要 Scheduler（调度器）来具体调度执行
3. 为了更灵活地控制宏任务的执行时机和任务调用的优先级，React 实现了一套基于 Lane 模型的优先级算法
4. 基于 Lane 模型优先级算法实现了 **Batched Updates（批量更新）**、**任务打断/恢复机制**等低级特性，这些特性不适合开发者直接控制，一般由 React 统一管理
5. 基于低级特性，React 实现了“面向开发者”的高级特性（并发特性），例如 Concurrent Suspense、useTransition 等

## Scheduler 与 React 的优先级对应

### React 的优先级

React 的优先级 lane 有 31 个，以下展示的是 10 进制，运算的时候是参与二进制运算的。

例如：`var SyncDefaultLanes = InputContinuousHydrationLane | InputContinuousLane | DefaultHydrationLane | DefaultLane`

```js
var TotalLanes = 31
var NoLanes =
  /*                        */
  0
var NoLane =
  /*                          */
  0
var SyncLane =
  /*                        */
  1
var InputContinuousHydrationLane =
  /*    */
  2
var InputContinuousLane =
  /*            */
  4
var DefaultHydrationLane =
  /*            */
  8
var DefaultLane =
  /*                    */
  16
var TransitionHydrationLane =
  /*                */
  32
var TransitionLanes =
  /*                       */
  4194240
var TransitionLane1 =
  /*                        */
  64
var TransitionLane2 =
  /*                        */
  128
var TransitionLane3 =
  /*                        */
  256
var TransitionLane4 =
  /*                        */
  512
var TransitionLane5 =
  /*                        */
  1024
var TransitionLane6 =
  /*                        */
  2048
var TransitionLane7 =
  /*                        */
  4096
var TransitionLane8 =
  /*                        */
  8192
var TransitionLane9 =
  /*                        */
  16384
var TransitionLane10 =
  /*                       */
  32768
var TransitionLane11 =
  /*                       */
  65536
var TransitionLane12 =
  /*                       */
  131072
var TransitionLane13 =
  /*                       */
  262144
var TransitionLane14 =
  /*                       */
  524288
var TransitionLane15 =
  /*                       */
  1048576
var TransitionLane16 =
  /*                       */
  2097152
var RetryLanes =
  /*                            */
  130023424
var RetryLane1 =
  /*                             */
  4194304
var RetryLane2 =
  /*                             */
  8388608
var RetryLane3 =
  /*                             */
  16777216
var RetryLane4 =
  /*                             */
  33554432
var RetryLane5 =
  /*                             */
  67108864
var SomeRetryLane = RetryLane1
var SelectiveHydrationLane =
  /*          */
  134217728
var NonIdleLanes =
  /*                                 */
  268435455
var IdleHydrationLane =
  /*               */
  268435456
var IdleLane =
  /*                       */
  536870912
var OffscreenLane =
  /*                   */
  1073741824
```

### React 事件优先级

React 中不同交互对应的事件回调中产生的 update 会拥有不同的优先级，由于优先级与“事件”相关，所以被称为 EventPriority（事件优先级）

- DiscreteEventPriority ：离散事件优先级，指的是那些需要立即响应的用户交互，如点击和键盘事件。这些事件通常关联着 UI 的直接反馈，因此用户期望它们有即时的响应。对应 React 优先级中的 `SyncLane`，具体值为 1
- ContinuousEventPriority ：连续事件优先级，指的是那些需要连续响应的交互，如滚动和鼠标移动事件。这些事件虽然也很重要，但相对于 discrete 事件，它们可以稍微延迟处理（例如在几个帧之内）。对应 React 优先级中的 `InputContinuousLane`，具体值为 4，二进制为 “100”
- DefaultEventPriority ：默认事件优先级，指的是那些不需要立即响应的事件，如数据请求和渲染，计时器周期性触发更新。这些事件可以稍微延迟处理，以便更好地响应用户交互。对应 React 优先级中的 `DefaultLane`，具体值为 16，二进制为 “10000”
- IdleEventPriority ：空闲事件优先级，指的是那些完全不急的任务，比如离屏渲染或者是非必须的维护任务。这些任务只有在主线程完全空闲时才会被处理。对应 React 优先级中的 `IdleLane`，具体值为 536870912，二进制为“100000000000000000000000000000”
- currentUpdatePriority ：表示当前没有任何更新正在进行，或者说没有为当前更新分配具体的优先级。对应 React 优先级中的 `NoLane`，具体值为 0

```js
function getEventPriority(domEventName) {
  switch (domEventName) {
    case 'cancel':
    case 'click':
    case 'close':
    case 'contextmenu':
    case 'copy':
    case 'cut':
    case 'auxclick':
    case 'dblclick':
    case 'dragend':
    case 'dragstart':
    case 'drop':
    case 'focusin':
    case 'focusout':
    case 'input':
    case 'invalid':
    case 'keydown':
    case 'keypress':
    case 'keyup':
    case 'mousedown':
    case 'mouseup':
    case 'paste':
    case 'pause':
    case 'play':
    case 'pointercancel':
    case 'pointerdown':
    case 'pointerup':
    case 'ratechange':
    case 'reset':
    case 'resize':
    case 'seeked':
    case 'submit':
    case 'touchcancel':
    case 'touchend':
    case 'touchstart':
    case 'volumechange':
    case 'change':
    case 'selectionchange':
    case 'textInput':
    case 'compositionstart':
    case 'compositionend':
    case 'compositionupdate':
    case 'beforeblur':
    case 'afterblur':
    case 'beforeinput':
    case 'blur':
    case 'fullscreenchange':
    case 'focus':
    case 'hashchange':
    case 'popstate':
    case 'select':
    case 'selectstart':
      return DiscreteEventPriority

    case 'drag':
    case 'dragenter':
    case 'dragexit':
    case 'dragleave':
    case 'dragover':
    case 'mousemove':
    case 'mouseout':
    case 'mouseover':
    case 'pointermove':
    case 'pointerout':
    case 'pointerover':
    case 'scroll':
    case 'toggle':
    case 'touchmove':
    case 'wheel':
    case 'mouseenter':
    case 'mouseleave':
    case 'pointerenter':
    case 'pointerleave':
      return ContinuousEventPriority

    case 'message': {
      // Scheduler 优先级转换为 React 事件优先级
      var schedulerPriority = getCurrentPriorityLevel()

      switch (schedulerPriority) {
        case ImmediatePriority:
          return DiscreteEventPriority

        case UserBlockingPriority:
          return ContinuousEventPriority

        case NormalPriority:
        case LowPriority:
          return DefaultEventPriority

        case IdlePriority:
          return IdleEventPriority

        default:
          return DefaultEventPriority
      }
    }

    default:
      return DefaultEventPriority
  }
}
```

### Scheduler 优先级

Scheduler 预置了五种优先级，从上到下，优先级依次降低：

- ImmediatePriority （最高优先级，同步执行）具体值为 1
- UserBlockingPriority （用户阻塞优先级）具体值为 2
- NormalPriority （正常优先级）具体值为 3
- LowPriority （低优先级）具体值为 4
- IdlePriority （空闲优先级）具体值为 5

### React 优先级到 Scheduler 优先级的转换

#### lane 转换为 EventPriority

```js
function lanesToEventPriority(lanes) {
  var lane = getHighestPriorityLane(lanes)
  // DiscreteEventPriority = SyncLane，如果 lane 比 SyncLane 优先级高，则返回 DiscreteEventPriority
  if (!isHigherEventPriority(DiscreteEventPriority, lane)) {
    return DiscreteEventPriority
  }
  // ContinuousEventPriority = InputContinuousLane，如果 lane 比 InputContinuousLane 优先级高，则返回 ContinuousEventPriority
  if (!isHigherEventPriority(ContinuousEventPriority, lane)) {
    return ContinuousEventPriority
  }
  // (lanes & NonIdleLanes) !== NoLanes，NonIdleLanes = 268435455（即1111111111111111111111111111），简单说就是 lanes 中包含非空闲优先级的 lane，则返回 DefaultEventPriority
  if (includesNonIdleWork(lane)) {
    return DefaultEventPriority
  }

  return IdleEventPriority
}
```

#### EventPriority 转换为 SchedulerPriority

- DiscreteEventPriority 对应 ImmediatePriority
- ContinuousEventPriority 对应 UserBlockingPriority
- DefaultEventPriority 对应 NormalPriority
- IdleEventPriority 对应 IdlePriority

#### Scheduler 优先级到 React 优先级的转换

```js
var schedulerPriority = getCurrentPriorityLevel()

switch (schedulerPriority) {
  case ImmediatePriority:
    return DiscreteEventPriority

  case UserBlockingPriority:
    return ContinuousEventPriority

  case NormalPriority:
  case LowPriority:
    return DefaultEventPriority

  case IdlePriority:
    return IdleEventPriority

  default:
    return DefaultEventPriority
}
```

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

### React 产生的“更新”结构是 update

```js
function createUpdate(eventTime, lane) {
  var update = {
    eventTime: eventTime,
    lane: lane,
    tag: UpdateState,
    payload: null,
    callback: null,
    next: null,
  }
  return update
}
```

### 初始化更新相关信息

上面的流程中，交互使得初始化更新相关信息，主要包括以下三类信息：

- lane 优先级信息，会在 requestUpdateLane 中初始化
- "更新" 对应的数据结构 Update
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

这个过程，需要首先确定 workInProgressRootRenderLanes ，即“参与本次 render 阶段的 lanes”;然后执行一些调度策略，最后执行“同步更新流程（React 调度）”或“并发更新流程（Scheduler 调度）”

#### ensureRootIsScheduled

```js
function ensureRootIsScheduled(root, currentTime) {
  var existingCallbackNode = root.callbackNode

  markStarvedLanesAsExpired(root, currentTime)

  // 选定 workInProgressRootRenderLanes
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
  // 如果当前调度的回调与新调度的回调具有相同的优先级，则不需要重新调度，还是使用之前的调度任务继续执行
  if (existingCallbackPriority === newCallbackPriority && !(ReactCurrentActQueue$1.current !== null && existingCallbackNode !== fakeActCallbackNode)) {
    return
  }
  // 如果前后两次调度的优先级不同，新调度的优先级高于之前的调度优先级，则取消之前的调度任务，重新调度
  if (existingCallbackNode != null) {
    cancelCallback$1(existingCallbackNode)
  }
  var newCallbackNode
  if (newCallbackPriority === SyncLane) {
    // 如果本次调度的 workInProgressRootRenderLanes 中优先级最高的 lane 为 SyncLane，则会进入“同步调度”的逻辑
    if (root.tag === LegacyRoot) {
      // 省略 LegacyRoot 的同步调度逻辑
    } else {
      // scheduleSyncCallback 的具体逻辑会向数组 SyncQueue 中保存回调函数，然后调用 scheduleMicrotask
      scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root))
    }

    {
      if (ReactCurrentActQueue$1.current !== null) {
        ReactCurrentActQueue$1.current.push(flushSyncCallbacks)
      } else {
        // scheduleMicrotask 用于在微任务中执行 flushSyncCallbacks
        // flushSyncCallbacks 会遍历 SyncQueue 并执行回调函数，即执行 performSyncWorkOnRoot
        scheduleMicrotask(flushSyncCallbacks)
      }
    }

    newCallbackNode = null
  } else {
    // 如果本次调度的 workInProgressRootRenderLanes 中优先级最高的 lane 不是 SyncLane，则会进入“并发调度”的逻辑
    var schedulerPriorityLevel
    // 需要根据 lanesToEventPriority 转换，将“最高优先级的lane”调整为“Scheduler 使用的优先级”，并使用 Scheduler 提供的 scheduleCallback 方法调度会掉函数
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

#### getNextLanes

```js
function getNextLanes(root, wipLanes) {
  var pendingLanes = root.pendingLanes

  if (pendingLanes === NoLanes) {
    // 没有“未完成的 lane”
    return NoLanes
  }

  var nextLanes = NoLanes
  // 由于请求导致 Suspense 挂起，标记的 lanes
  var suspendedLanes = root.suspendedLanes
  // Suspense 请求完毕后，解锁之前挂起的流程，标记的 lanes
  var pingedLanes = root.pingedLanes
  // 非空闲的 lanes
  var nonIdlePendingLanes = pendingLanes & NonIdleLanes

  if (nonIdlePendingLanes !== NoLanes) {
    // 非空闲的 lanes 中，排除挂起的 lanes
    var nonIdleUnblockedLanes = nonIdlePendingLanes & ~suspendedLanes

    if (nonIdleUnblockedLanes !== NoLanes) {
      // 获取非空闲的 lanes 中，优先级最高的 lanes
      nextLanes = getHighestPriorityLanes(nonIdleUnblockedLanes)
    } else {
      var nonIdlePingedLanes = nonIdlePendingLanes & pingedLanes

      if (nonIdlePingedLanes !== NoLanes) {
        // 获取被解锁的 lanes 中，优先级最高的 lanes
        nextLanes = getHighestPriorityLanes(nonIdlePingedLanes)
      }
    }
  } else {
    // 省略获取空闲 lanes 中优先级最高的 lanes
  }

  if (nextLanes === NoLanes) {
    return NoLanes
  }
  if (wipLanes !== NoLanes && wipLanes !== nextLanes && (wipLanes & suspendedLanes) === NoLanes) {
    // 省略 Suspense 挂起相关情况
  }

  if ((nextLanes & InputContinuousLane) !== NoLanes) {
    // 将 InputContinuousLane 与 DefaultLane 纠缠在一起
    nextLanes |= pendingLanes & DefaultLane
  }

  var entangledLanes = root.entangledLanes

  if (entangledLanes !== NoLanes) {
    // 省略处理其他纠缠的 lane
  }

  return nextLanes
}
```

以上代码主要包括三部分逻辑：

- 选择 root.pendingLanes 中的高优先级 lane（或 lanes）组成基础 lanes
- 处理 Suspense 相关情况
- 处理“纠缠的 lane”相关情况，纠缠到基础 lanes 中

所以，workInProgressRootRenderLanes 为两类 lanes 的并集：

```
workInProgressRootRenderLanes = 基础 lanes | 额外情况附加的 lanes
```

选定了 workInProgressRootRenderLanes 后，就可以执行调度策略了。

#### 同步调度策略

scheduleSyncCallback(performSyncWorkOnRoot.bind(null, root))

```js
function scheduleSyncCallback(callback) {
  if (syncQueue === null) {
    syncQueue = [callback]
  } else {
    syncQueue.push(callback)
  }
}
```

在“同步调度”逻辑中， scheduleMicrotask 会在微任务中遍历 SyncQueue 并同步执行所有回调函数，即 performSyncWorkOnRoot.bind(null, root)，然后会调用 renderRootSync 执行同步的 render 阶段和 commit 阶段。

不过，虽然是“同步调度”的更新，即使后续 render 阶段和 commit 阶段是同步执行，但由于是在“微任务中批量处理同步更新”，使得触发后无法立即获取更新的值。例如 this.setState 后立即获取 state 的值，是无法立即获取到更新的值的。

performSyncWorkOnRoot 会调用 renderRootSync， renderRootSync 会调用 workLoopSync，由此开启的 render 阶段不会被打断

```js
function workLoopSync() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress)
  }
}
```

#### 并发更新策略

scheduleCallback$1(schedulerPriorityLevel, performConcurrentWorkOnRoot.bind(null, root))，scheduleCallback$1 是 Scheduler.unstable_scheduleCallback。

所以并发更新是需要 Scheduler 协调器进行调度的。

回调函数 performConcurrentWorkOnRoot 方法会根据“当前是否需要开启 Time Slice” 来决定“render 阶段是否可中断”

```js
var shouldTimeSlice = !includesBlockingLane(root, lanes) && !includesExpiredLane(root, lanes) && !didTimeout
var exitStatus = shouldTimeSlice ? renderRootConcurrent(root, lanes) : renderRootSync(root, lanes)
```

未开启 Time Slice 时，执行 renderRootSync 的 workLoopSync，开启时，执行 renderRootConcurrent 的 workLoopConcurrent

```js
function workLoopConcurrent() {
  while (workInProgress !== null && !shouldYield()) {
    performUnitOfWork(workInProgress)
  }
}
```

#### React 产生的 update（更新）的饥饿问题

每次产生更新，调用 ensureRootIsScheduled 确定调度方案时，会在最前面调用 markStarvedLanesAsExpired ，会判断 lane 是否过期，会根据“交互发生的时间”为“更新对应的 lane” 设置过期时间。

```js
function markStarvedLanesAsExpired(root, currentTime) {
  var pendingLanes = root.pendingLanes
  var suspendedLanes = root.suspendedLanes
  var pingedLanes = root.pingedLanes
  var expirationTimes = root.expirationTimes

  var lanes = pendingLanes
  // 遍历 root.pendingLanes
  while (lanes > 0) {
    var index = pickArbitraryLaneIndex(lanes)
    var lane = 1 << index
    var expirationTime = expirationTimes[index]

    if (expirationTime === NoTimestamp) {
      // 为未设置过期时间的 lane 设置过期时间
      if ((lane & suspendedLanes) === NoLanes || (lane & pingedLanes) !== NoLanes) {
        // 为 pendingLanes 中“非挂起的 lane” 或“解除挂起的 lane” 设置过期时间
        // 具体的过期时间保存在 root.expirationTimes 中，作为一个长度为 31 的数组，可以保存 31 个 lane 的过期时间
        expirationTimes[index] = computeExpirationTime(lane, currentTime)
      }
    } else if (expirationTime <= currentTime) {
      // 如果过期时间小于当前时间，将 lane 记录在 root.expiredLanes 中
      root.expiredLanes |= lane
    }

    lanes &= ~lane
  }
}
```

### root.pendingLanes 工作流程

root.pendingLanes 代表“当前 FiberRootNode”下，未执行的更新，对应的 lane 的集合。

与 root.pendingLanes 相关的工作流程可以理解为“本次更新对应的 lane 的产生、消费、重置流程”，完整流程如下：

- 各种交互，首先调用 requestUpdateLane 获取合适的 lane，然后生成 update，将 lane 设置为 update 的 lane，然后调用 enqueueUpdate 将 update 加入到 FiberNode 的更新队列中
- schedule 阶段
  - scheduleUpdateOnFiber 调用 markUpdateLaneFromFiberToRoot，将 update 的 lane 冒泡到 FiberRootNode，即更新 fiberNode.lanes 与 childLanes
  - scheduleUpdateOnFiber 调用 markRootUpdated，将本次 update 的 lane 附加到 root.pendingLanes 中，即更新 root.pendingLanes
- render 阶段
  - beginWork 重置 fiberNode.lanes，调用 createFiberFromXXX 的时候，初始化 fiberNode.lanes
  - completeWork 在 bubbleProperties 中，更新 fiberNode.childLanes
- commit 阶段
  - markRootFinished 重置 root.pendingLanes，即 root.pendingLanes = NoLanes

## Scheduler 的实现原理

React 如果是并发更新（或者说是非同步更新），会使用 Scheduler 进行调度。

### Scheduler 调度的是任务, task 数据结构

```js
var newTask = {
  id: taskIdCounter++,
  callback: callback,
  priorityLevel: priorityLevel,
  startTime: startTime,
  expirationTime: expirationTime,
  sortIndex: -1,
}
```

### Scheduler 的工作流程

#### 完整流程

- 在 ensureRootIsScheduled 中，判断如果本地更新不是同步模式，就进入并发模型，调用 newCallbackNode = scheduleCallback(schedulerPriorityLevel, performConcurrentWorkOnRoot.bind(null, root))，进行任务调度，创建 task，并把 performConcurrentWorkOnRoot.bind(null, root) 设置为 task 的 callback
- 根据“是否传递 delay 参数”，执行 scheduleCallback 方法生成的 task 会进入 timerQueue 或者 taskQueue，其中：
  - timerQueue 中的 task 以 currentTime + delay 为排序依据
  - taskQueue 中的 task 以 expirationTime 为排序依据
- 如果 taskQueue 为空，timerQueue 不为空，会不断的调用 setTimeout，直到 taskQueue 不为空
- 如果 taskQueue 不为空，会调用 requestHostCallback，将 scheduledHostCallback 设置为 flushWork，并执行 schedulePerformWorkUntilDeadline。
  - schedulePerformWorkUntilDeadline 是用来创建下一次宏任务的，根据环境不同，依次判断采用 setImmediate、MessageChannel、setTimeout。
- schedulePerformWorkUntilDeadline 创建的宏任务会调用 performWorkUntilDeadline，performWorkUntilDeadline 会调用 scheduledHostCallback，即 flushWork
- flushWork 会调用 workLoop 逐个执行 task 的 callback，还会调用 advanceTimers 刷新 timerQueue，然后返回是否还有待调度的任务
- 如果还有待调度的任务，继续调用 schedulePerformWorkUntilDeadline 创建下一次宏任务

### taskQueue 与 timerQueue 优先级队列的选择

采用小顶堆数据结构实现的优先级队列。

- timerQueue 中的 task 以 currentTime + delay 为排序依据
- taskQueue 中的 task 以 expirationTime 为排序依据

#### 小顶堆的特点

- 是一颗完全二叉树（除最后一层外，其他层的节点个数都是满的，且最后一层节点靠左排列）
- 堆中每一个节点值都小于等于其子节点的每一个值。

### 宏任务的选择

#### 放弃的方案——requestIdleCallback

requestIdleCallback （简称 rIC），rIC 是一个实验性质的 API，会在每一帧的空闲时期执行

以下缺点使得 Scheduler 放弃了 rIC

- 浏览器兼容性
- 执行频率不稳定，受很多因素的影响
  - 每一帧的空闲时期执行，但是每一帧的空闲时期是不固定的
  - 当切换浏览器标签页时，浏览器会降低当前标签页的帧率，导致 rIC 的执行频率降低
- 应用场景局限
  rIC 的设计初衷是“能够在事件循环中执行低优先级工作，减少对动画、用户输入等高优先级事件的影响”，这就意味着 rIC 的应用场景局限在低优先级的工作中，这与 Scheduler 中“多种优先级的调度策略”不符

  #### 放弃的方案——requestAnimationFrame

  requestAnimationFrame （简称 rAF），rAF 定义的回调函数会在浏览器下次 Paint 前执行，一般用于更新动画。

  由于 rAF 的执行取决于“每一帧 Paint 前的时机”，即“它的执行与帧相关”，执行频率不高，因此 Scheduler 放弃了 rAF

  #### 选择的方案——setImmediate、MessageChannel、setTimeout

  Scheduler 的调度应该在一帧的时间内可以执行多次，并且执行时机越早越好。

  在支持 setImmediate 的环境中（Node.js，旧版本的 IE），Scheduler 会优先使用 setImmediate 调度宏任务

  特点：

  - 不同于 MessageChannel，它不会阻止 Node.js 进程退出
  - 相比于 MessageChannel，执行时机更早

  在支持 MessageChannel 的环境中（浏览器、Worker），使用 MessageChannel 调度宏任务

  其余的情况则使用 setTimeout 调度宏任务

## 两个饥饿问题，影响是否开启 Time Slice

```js
// 是否开启 Time Slice
var shouldTimeSlice = !includesBlockingLane(root, lanes) && !includesExpiredLane(root, lanes) && !didTimeout
```

shouldTimeSlice 由三个条件决定：

- 是否包含阻塞的 lane，如果不包含，则可以开启 Time Slice
- 是否包含过期的 lane，如果不包含，则可以开启 Time Slice
- Scheduler 调度的任务是否超时，如果没有超时，则可以开启 Time Slice

### 是否包含阻塞的 lane

```js
function includesBlockingLane(root, lanes) {
  // 以下的几个 lane 被认为是同步执行的 lane
  var SyncDefaultLanes = InputContinuousHydrationLane | InputContinuousLane | DefaultHydrationLane | DefaultLane
  return (lanes & SyncDefaultLanes) !== NoLanes
}
```

### 是否包含过期的 lane

存在与 root.expiredLanes 中的 lane 为过期的 lane

### Scheduler 调度的任务是否超时

Scheduler 生成调度任务的时候，会根据 schedulerPriority 的不同，设置不同的 expirationTime，expirationTime 为任务的过期时间。

在 Scheduler 的 workLoop 方法中，会根据当前时间和任务的过期时间，判断任务是否超时

```js
var didUserCallbackTimeout = currentTask.expirationTime <= currentTime
// 此处的 callback 即为 performConcurrentWorkOnRoot.bind(null, root)
var continuationCallback = callback(didUserCallbackTimeout)
```
