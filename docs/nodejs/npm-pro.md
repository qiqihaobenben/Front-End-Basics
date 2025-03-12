# npm 进阶

## npx

npx 的原理很简单，就是运行的时候，会到 node_modules/.bin 路径和环境变量$PATH 里面，检查命令是否存在。

### npx 的作用

#### 1. 用来运行项目内部安装的模块

npx 想要解决的主要问题，就是调用项目内部安装的模块。比如，项目内部安装了测试工具 Mocha。

```bash
$ npm install --save-dev mocha

# 或者
$ npm install -D mocha
```

一般来说，调用 Mocha ，只能在项目脚本和 package.json 的 scripts 字段里面， 如果想在命令行下调用，必须像下面这样。

```bash
$ ./node_modules/.bin/mocha --version
```

npx 就是想解决这个问题，让项目内部安装的模块用起来更方便，只要像下面这样调用就行了。

```bash
$ npx mocha --version
```

#### 2. 用来运行远程模块

除了调用项目内部模块，npx 还能直接运行远程模块，避免全局安装的模块。比如，create-react-app 这个模块是全局安装，npx 可以运行它，而且不进行全局安装。

```bash
$ npx create-react-app my-react-app
```

npx 还可以执行 GitHub 上面的模块源码。

```bash
$ npx github:piuccio/cowsay hello

# 执行 Gist 代码
$ npx https://gist.github.com/zkat/4bc19503fe9e9309e2bfaa2c58074d32
```

**注意，远程代码必须是一个模块，即必须包含 package.json 和入口脚本。**

## npm create

### **`npm create` 命令详解**

`npm create` 是 npm 提供的一个快捷命令，用于快速初始化项目模板或执行脚手架工具。其核心原理是通过动态安装并执行以 `create-` 为前缀的 npm 包，从而实现项目结构的生成和依赖的预配置。以下是该命令的详细解析：

---

#### **一、命令原理与工作流程**

1. **别名与底层逻辑**
   • `npm create` 是 `npm init` 的别名，与 `npm init` 完全等价。
   • 执行 `npm create <initializer>` 时，实际会动态查找并安装名为 `create-<initializer>` 的包（例如 `npm create vite` → `create-vite`），然后运行该包中定义的 `bin` 文件。

2. **依赖 `npm exec` 执行**
   • 底层通过 `npm exec` 调用目标包的命令行接口（CLI），例如 `npm create vue@latest` 转换为 `npm exec create-vue@latest`。

3. **版本控制与包解析**
   • 支持指定版本号（如 `@latest`），若未指定则默认使用最新版本。
   • 若本地已存在同名包，优先使用本地缓存；否则从 npm 仓库下载并临时安装。

---

#### **二、核心功能与参数传递**

1. **基本语法**

   ```bash
   npm create <initializer> [项目名称] [选项]
   ```

   • **示例**：

   ```bash
   npm create vite@latest my-app -- --template react-ts
   ```

   此命令会安装 `create-vite@latest`，生成名为 `my-app` 的项目，并通过 `--template` 参数指定模板。

2. **参数传递规则**
   • **双横线 `--` 分隔符**：
   在 npm 7+ 中，需用 `--` 分隔 `npm create` 的选项和目标包的参数。例如：

   ```bash
   npm create vite my-app -- --template vue
   ```

   `--template vue` 是传递给 `create-vite` 的参数。

   • **版本兼容性**：
   npm 6.x 无需 `--`，参数直接拼接（如 `npm create vite my-app --template vue`）。

---

#### **三、典型应用场景**

1. **快速创建项目模板**
   • **常见框架示例**：
   ◦ Vue：`npm create vue@latest`
   ◦ React：`npm create vite@latest -- --template react`
   ◦ Svelte：`npm create svelte@latest`
   • **流程**：

   1. 下载并执行 `create-*` 包。
   2. 通过命令行交互（如选择模板、语言、工具链）生成项目文件。
   3. 自动安装基础依赖并生成配置文件（如 `package.json`、`tsconfig.json`）。

2. **自定义模板发布**
   • **开发规范**：
   发布一个名为 `create-<your-tool>` 的包，并在 `package.json` 中定义 `bin` 入口文件（如 `index.js`）。
   • **用户使用**：
   ```bash
   npm create your-tool@latest
   ```
   用户执行后，会触发模板文件的复制、变量替换等操作。

---

#### **四、高级配置与注意事项**

1. **配置镜像源**
   通过 `.npmrc` 设置镜像加速下载：

   ```ini
   registry=https://registry.npmmirror.com
   ```

   避免因网络问题导致安装失败。

2. **覆盖默认行为**
   • **跳过提问**：使用 `--yes` 或 `-y` 参数以默认配置快速初始化：

   ```bash
   npm create vite@latest my-app --yes
   ```

   • **指定包管理器**：某些工具（如 `create-vue`）会根据 `npm_config_user_agent` 自动检测包管理器（pnpm/yarn/npm）。

3. **版本锁定与依赖管理**
   • 在 `package.json` 中通过 `dependencies` 和 `devDependencies` 精确控制依赖版本。
   • 定期运行 `npm update` 更新依赖树。

---

#### **五、对比传统工具的优势**

| **维度**     | **`npm create`**                   | **传统工具（如 Yeoman）**        |
| ------------ | ---------------------------------- | -------------------------------- |
| **安装方式** | 临时安装，无全局污染               | 需全局安装且长期占用空间         |
| **灵活性**   | 通过参数动态指定模板和版本         | 需手动维护生成器插件             |
| **生态集成** | 直接复用 npm 包生态                | 依赖独立插件生态                 |
| **维护成本** | 由包作者维护，用户无需关注底层配置 | 需自行处理生成器更新和兼容性问题 |

---

#### **六、总结**

`npm create` 通过动态加载脚手架包和标准化参数传递，实现了轻量化、高灵活性的项目初始化。其核心优势在于：

1. **简化流程**：无需全局安装工具，一键生成标准化项目结构。
2. **依赖隔离**：临时安装机制避免全局包污染。
3. **版本控制**：支持精确指定模板版本，确保项目一致性。

对于需要快速启动项目或发布自定义模板的开发者，`npm create` 是现代化前端工程的首选工具。

## npm exec

好的，用户的问题是询问 npm exec 的作用以及它是否可以替代 npx。我需要结合提供的搜索结果来解答这个问题。首先，我需要回顾一下之前用户提供的搜索内容，看看有哪些相关的信息。

根据搜索结果，网页 1 提到 npx 是 npm 的一个包执行器，允许用户在不全局安装的情况下运行包。网页 3 解释了 npx 的工作原理，包括临时安装包并执行。网页 5 则详细说明了 npm exec 和 npx 的关系，指出 npm exec 和 npm x 是等价的，而 npx 在 npm v7.0.0 后被重写为使用 npm exec。此外，网页 6 的对比表中也提到 npx 实际上是基于 npm exec 实现的，用于临时执行包。

接下来，我需要确认 npm exec 的功能是否与 npx 相同。根据网页 5 的内容，npm exec 和 npx 在功能上是等价的，npx 现在只是 npm exec 的一个别名。因此，npm exec 完全可以实现 npx 的目的，包括临时安装和运行包，检查本地和全局安装的包，以及处理不同版本的情况。

然后，需要分析 npm exec 的具体工作流程。根据网页 3 和网页 5 的信息，npm exec 会先查找本地 node_modules 中的包，如果没有找到则下载远程包，执行后删除。这解释了为什么它可以替代 npx，因为 npx 的行为也是类似的。

另外，用户可能关心如何使用 npm exec 替代 npx 的命令。比如，用户常用的 npx create-react-app，换成 npm exec 的话应该是 npm exec create-react-app，或者使用别名 npm x create-react-app。网页 5 中的例子也验证了这一点，比如 npm create vite 会被转换为 npm exec create-vite。

还需要注意版本兼容性问题。网页 5 提到 npx 在 npm v7.0.0 之后被重写为使用 npm exec，因此对于较新的 npm 版本，两者功能是一致的。但旧版本可能仍有差异，需要用户检查自己的 npm 版本。

最后，总结两者的关系，指出 npm exec 是更底层的命令，而 npx 是其简化版，适用于不同的使用习惯。同时，提醒用户在使用时需要注意参数传递的语法差异，比如是否需要使用--来分隔参数。

这样综合多个搜索结果的信息，就能全面回答用户的问题，说明 npm exec 的作用及其与 npx 的关系，确保用户理解如何正确使用这两个命令。

`npm exec` 是 npm 提供的用于执行 Node.js 包的命令行工具，其核心功能与 `npx` 高度重叠，但两者在实现细节和使用场景上有细微差异。以下是详细解析：

---

### **一、`npm exec` 的核心作用**

1. **执行本地或远程包的命令**
   `npm exec` 会先检查本地 `node_modules` 中是否存在目标包：
   • **若存在**：直接执行包中 `package.json` 的 `bin` 字段对应的可执行文件；
   • **若不存在**：临时从 npm 仓库下载包，执行后自动删除，避免长期占用磁盘空间。

2. **支持跨版本与参数传递**
   • 可指定包版本（如 `npm exec create-react-app@5`）；
   • 通过 `--` 分隔参数（例如 `npm exec create-vite my-app -- --template react-ts`）。

3. **替代全局安装**
   无需全局安装工具即可运行一次性命令（如脚手架 `create-react-app`），减少全局环境污染。

---

### **二、`npm exec` 与 `npx` 的关系**

#### **1. 功能等价性**

• `npx` 本质上是 `npm exec` 的别名。从 npm v7.0.0 开始，`npx` 底层完全依赖 `npm exec` 实现，两者功能完全一致。
• **示例等价命令**：

```bash
npx create-react-app my-app
npm exec create-react-app my-app
npm x create-react-app my-app  # npm x 是 npm exec 的别名
```

#### **2. 实现差异**

• **历史背景**：早期 `npx` 是独立工具，后来被集成到 npm 中并重构为 `npm exec`；
• **参数解析**：`npx` 对旧版参数格式有兼容性支持，而 `npm exec` 更严格（需用 `--` 分隔参数）。

---

### **三、`npm exec` 的典型使用场景**

1. **运行脚手架工具**
   ```bash
   npm exec create-next-app my-app  # 创建 Next.js 项目
   npm exec @vue/cli create vue-project  # 创建 Vue 项目
   ```
2. **执行本地工具**
   若项目中已安装 `eslint`，可直接运行：
   ```bash
   npm exec eslint src/
   ```
3. **测试不同版本包**
   ```bash
   npm exec webpack@4 build  # 临时使用 webpack 4.x 版本
   ```

---

### **四、`npm exec` 能否替代 `npx`？**

• **完全替代**：在 npm v7+ 中，`npm exec` 是 `npx` 的底层实现，所有 `npx` 功能均可通过 `npm exec` 实现；
• **语法差异**：`npx` 更简洁（无需 `--` 分隔参数），适合习惯旧版命令的用户；
• **推荐策略**：
• **新项目**：统一使用 `npm exec` 或 `npm x`，保持命令一致性；
• **旧脚本兼容**：保留 `npx` 语法以兼容历史脚本。

---

### **五、注意事项**

1. **版本兼容性**
   npm v5.2.0 之前需单独安装 `npx`，v7.0.0 后建议优先使用 `npm exec`；
2. **镜像加速**
   若下载慢，可在 `.npmrc` 中配置镜像源：
   ```ini
   registry=https://registry.npmmirror.com
   ```
3. **安全性**
   临时执行的远程包可能包含风险代码，需谨慎确认来源。

---

### **总结**

`npm exec` 是现代化 npm 生态中执行包命令的标准方式，与 `npx` 功能等价但更底层。开发者可根据习惯选择语法，但需注意版本差异和参数分隔规则。对于临时任务或脚手架场景，两者均可高效替代全局安装，保持开发环境整洁。

[npm 包管理性能优化实践](https://juejin.cn/post/7288160332433178684)
