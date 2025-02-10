# Vue2 和 Vue3 响应系统

## 概述

Vue 2 和 Vue 3 在实现响应性的目标相同即在数据变化时自动更新视图，但他们的实现方式不一样，它们使用了不同的技术栈和方法。Vue 2 使用的是 **Object.defineProperty** 来实现响应式数据的代理，Vue 3 使用的是 **Proxy** 来实现响应式数据的代理。下面先简单聊聊 **Object.defineProperty** 和 **Proxy**

## Object.defineProperty 和 proxy

`Object.defineProperty` 和 `Proxy` 是 JavaScript 中控制对象的属性访问与修改的两种方式，它们的作用相似，但使用方式和功能上有很大的差异。

### 1\. `Object.defineProperty`

`Object.defineProperty` 是一种直接通过 API 设置对象属性的方法，可以让你精确地控制对象的某个属性的行为。

#### 特点：

- 可以用来定义对象的属性，包括数据属性和访问器属性。
- 可以控制属性的特性，比如可写性、可枚举性、可配置性等。
- 当你需要对某个属性进行 getter、setter 或者其他更细粒度的控制时，它非常有用。

#### 示例：

    let obj = {};
    Object.defineProperty(obj, 'name', {
      value: 'Alice',
      writable: true,   // 是否可写
      enumerable: true, // 是否可枚举
      configurable: true, // 是否可配置
    });

    console.log(obj.name); // 输出 "Alice"

    // 设置 getter 和 setter
    Object.defineProperty(obj, 'age', {
      get() {
        return this._age;
      },
      set(value) {
        this._age = value;
      },
    });

    obj.age = 25;
    console.log(obj.age); // 输出 25

#### 解释：

- `value`：设置属性的初始值。
- `writable`：控制属性值是否可被修改。
- `enumerable`：控制属性是否会出现在 `for...in` 循环中。
- `configurable`：控制属性是否可以被删除或修改属性描述符。
- `get` 和 `set` 用来控制属性的读取和设置

### 2\. `Proxy`

`Proxy` 是 ES6 引入的一种新特性，它可以用来创建一个代理对象，该对象会拦截对原始对象的操作。通过 `Proxy`，你可以定义对象的各种操作，如读取、设置、删除属性、函数调用等。

#### 特点：

- `Proxy` 允许你定义多种不同类型的操作拦截器。
- 可以拦截 `get`、`set`、`has`、`deleteProperty` 等多个操作。
- 更加灵活和强大，能够拦截并自定义几乎所有操作。

#### 示例：

    let person = {
      name: 'Alice',
      age: 25,
    };

    let proxy = new Proxy(person, {
      get(target, prop) {
        if (prop in target) {
          return target[prop];
        } else {
          return `Property ${prop} does not exist`;
        }
      },
      set(target, prop, value) {
        if (prop === 'age' && value < 0) {
          throw new Error('Age cannot be negative');
        } else {
          target[prop] = value;
          return true; // 需要返回 true 表示操作成功
        }
      },
    });

    console.log(proxy.name); // 输出 "Alice"
    console.log(proxy.age); // 输出 25
    console.log(proxy.gender); // 输出 "Property gender does not exist"

    // 尝试设置无效的值
    try {
      proxy.age = -5; // 抛出错误 "Age cannot be negative"
    } catch (e) {
      console.log(e.message); // 输出 "Age cannot be negative"
    }

    proxy.age = 30; // 更新 age
    console.log(proxy.age); // 输出 30

#### 解释：

- `get`：拦截对属性的读取。
- `set`：拦截对属性的修改。
- `target`：被代理的对象。
- `prop`：属性名。
- `value`：属性值。
- `return true`：设置操作必须返回 `true` 表示操作成功。

### 3.`Object.defineProperty` vs `Proxy`

| 特性           | `Object.defineProperty`                            | `Proxy`                                                       |
| -------------- | -------------------------------------------------- | ------------------------------------------------------------- |
| **拦截操作**   | 仅限于获取或修改单一属性（getter/setter）          | 可拦截所有的操作（读取、写入、删除、函数调用等）              |
| **性能**       | 更高效，适合对单一属性进行精细化控制               | 灵活但可能稍慢，特别是涉及到复杂的拦截时                      |
| **使用场景**   | 适合对个别属性进行控制（比如绑定、监听属性变化等） | 适合全局性地拦截对象的行为（如数据代理、验证等）              |
| **易用性**     | 使用时需要更细粒度的描述符设置                     | 使用起来更简洁，能够拦截多种操作                              |
| **支持的特性** | 可以定义 getter、setter、属性描述符等              | 支持 `get`、`set`、`has`、`deleteProperty`、`apply`等多种操作 |
| **适用范围**   | 只能对现有对象的属性进行描述符定义                 | 可以全局拦截对象的操作，包括新增、删除、修改属性等            |

选择何时使用：

- 如果你只需要对单个属性进行精确控制（例如，设置 getter 和 setter），`Object.defineProperty` 是更合适的选择。
- 如果你需要对整个对象进行操作拦截（例如，监控对象的所有操作，或者修改对象的行为），`Proxy` 是更灵活和强大的选择。

总结来说，`Object.defineProperty` 用于对个别属性的行为进行细粒度控制，而 `Proxy` 提供了更强大的功能，可以对整个对象或多种操作进行拦截。

## Vue 2 的响应性原理

Vue 2 使用的是 **Object.defineProperty** 来实现响应式数据的代理。具体过程如下：

### 1\. 数据劫持（数据代理）

在 Vue 2 中，Vue 会通过 `Object.defineProperty()` 为数据对象的每个属性添加 getter 和 setter。通过这些 getter 和 setter，Vue 观察到属性的变化并触发视图更新。具体过程是：

- **Getter** ：当访问某个属性时，会触发该属性的 getter，Vue 会记录并收集这个属性的依赖。

- **Setter** ：当修改某个属性的值时，会触发 setter，Vue 会通知依赖这个属性的组件或视图进行更新。

### 2\. 依赖收集

Vue 2 在每个 getter 中都会进行 **依赖收集** ，将当前的 watcher（观察者）加入到该属性的依赖队列中。当属性值发生变化时，会触发 setter，然后 Vue 会通知所有依赖该属性的 watcher，进而更新视图。

### 3\. 核心实现

    // Vue 2 响应性实现的简化版
    let obj = { name: 'Alice' };

    Object.defineProperty(obj, 'name', {
      get() {
        console.log('获取 name');
        return this._name;
      },
      set(newValue) {
        console.log('设置 name');
        this._name = newValue;
        // 触发视图更新
        updateView();
      }
    });

- 每个属性都被 `Object.defineProperty` 进行拦截，能够触发 getter 和 setter 操作。
- 通过这个机制，Vue 2 可以在数据变化时自动更新 DOM。

局限性：

- **性能问题** ：在对象中有大量属性时，逐一使用 `Object.defineProperty` 会影响性能。
- **无法代理新增和删除的属性** ：Vue 2 无法对已经定义的对象新增属性或删除属性进行响应式处理。

## Vue 3 的响应性原理

Vue 3 引入了全新的响应性机制，基于 **Proxy** ，大大优化了 Vue 2 的响应式实现。Vue 3 使用 `Proxy` 对对象进行代理，能够更加灵活地拦截对对象的各种操作，如读取、修改、删除属性等。

### 1\. 使用 Proxy 进行代理

`Proxy` 可以通过设置 handler（拦截器）来拦截对象的操作，不需要逐个属性地定义 getter 和 setter。Vue 3 利用了 `Proxy` 的能力，拦截对象上的所有操作，并动态地处理这些操作。

### 2\. 依赖收集与更新

Vue 3 通过 **依赖追踪** 来进行视图更新。当你访问对象的属性时，Vue 3 会使用 `Proxy` 拦截器中的 `get` 操作收集依赖。当属性的值发生变化时，Vue 3 会通过 `set` 操作触发视图更新。

### 3\. 核心实现

    // Vue 3 响应性实现的简化版
    const handler = {
      get(target, prop) {
        console.log(`访问属性: ${prop}`);
        // 依赖收集
        track(target, prop);
        return target[prop];
      },
      set(target, prop, value) {
        console.log(`修改属性: ${prop} 为 ${value}`);
        target[prop] = value;
        // 触发视图更新
        trigger(target, prop);
        return true;
      }
    };

    const obj = new Proxy({}, handler);

    obj.name = 'Alice';
    console.log(obj.name);

- `get`：访问属性时会触发 `get` 方法，用于依赖收集。

- `set`：修改属性时会触发 `set` 方法，用于通知视图更新。

- `track` 和 `trigger` 是 Vue 3 内部的依赖收集和视图更新机制。

### 4\. Vue 3 响应性系统的优势

- **性能提升** ：Vue 3 通过 `Proxy` 可以一次性代理整个对象的所有操作，而不需要为每个属性分别设置 getter 和 setter，性能更好。

- **支持新增和删除属性** ：通过 `Proxy`，Vue 3 可以自动处理对象的新增和删除操作，确保新的属性能够被响应式地处理。

- **更加简洁和灵活** ：由于 `Proxy` 的设计，Vue 3 不再需要使用 `Object.defineProperty` 的繁琐方法，可以更高效地处理对象的各种操作。

### 5\. 代理处理

Vue 3 通过 `Proxy` 拦截对象的多个操作，可以代理对象的属性读取、设置、删除、函数调用等多种操作。

## 总结：Vue 2 与 Vue 3 的响应性比较

| 特性              | Vue 2 (`Object.defineProperty`)                              | Vue 3 (`Proxy`)                                   |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------- |
| **实现方式**      | 使用 `Object.defineProperty` 为每个属性添加 getter 和 setter | 使用 `Proxy` 代理整个对象，拦截所有操作           |
| **性能**          | 对每个属性逐个拦截，性能较差，尤其在有大量属性时             | 通过代理拦截整个对象，性能更高                    |
| **新增/删除属性** | 需要手动处理，无法响应新增或删除的属性                       | 自动处理新增和删除的属性                          |
| **依赖收集**      | 依赖收集基于 getter                                          | 依赖收集通过 `Proxy`的 `get`方法实现              |
| **支持的操作**    | 仅支持 `get`和 `set`操作                                     | 支持 `get`、`set`、`delete`、`has`、`apply`等操作 |
| **使用场景**      | 适用于简单的对象或数组                                       | 适用于更复杂的数据结构，尤其是动态数据            |

选择时的考虑

- **Vue 2** ：适合传统的单页面应用，尤其是那些数据结构相对简单或不需要动态增删属性的应用。
- **Vue 3** ：使用 Proxy 后，适合需要更高性能和更灵活的数据绑定、动态操作对象的应用。

总的来说，Vue 3 的响应性系统在性能和灵活性上都优于 Vue 2，得益于 `Proxy` 的强大能力，可以更高效地处理对象的各种操作。
