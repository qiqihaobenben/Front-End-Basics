# Monorepo 架构

单一仓库（Monorepo）架构，可以理解为：利用单一仓库来管理多个 packages 的一种策略或手段；与其相对的是多仓库（Multirepo 或 Polyrepo）架构

Monorepo 目录中除了会有公共的 `package.json` 依赖以外，在每个 sub-package 子包下面，也会有其特有的 `package.json` 依赖。

兄弟模块之间可以通过模块 `package.json` 定义的 name 相互引用，保证模块之间的独立性

## Monorepo 的核心思想

> **统一管理、去重复、模块化、共享依赖、版本联动**

### Monorepo 一般包含：

```
/packages
  ├── app-admin
  ├── app-web
  ├── ui-library
  └── utils
```

### Monorepo 的优势

| 优势           | 描述                                |
| -------------- | ----------------------------------- |
| 统一管理依赖   | 共享 node_modules, 避免重复安装     |
| 更好的协作     | 所有团队成员可以直接看到所有代码    |
| 原子化更改     | 一次提交可以改变多个包 & 测试统一跑 |
| 内部包无需发布 | 直接本地 link，提高迭代速度         |
| 简化构建与发布 | 自动化 pipeline 管理版本和发布      |

### 可能存在的挑战

| 挑战       | 解决方案                               |
| ---------- | -------------------------------------- |
| 仓库体积大 | 分布式 node_modules、增量构建          |
| 构建速度慢 | Turborepo / Nx / Rollup / ESBuild 缓存 |
| 权限复杂   | CODEOWNERS, 分支策略                   |

## Monorepo 的发展历史

| 时间     | 阶段 & 技术代表                               |
| -------- | --------------------------------------------- |
| 2010s 初 | Google，Facebook 自研 monorepo 工具理念       |
| 2015     | Yarn Workspace 发布，NodeJS Monorepo 时代开始 |
| 2016     | Lerna 发布，解决包联动版本和发布              |
| 2019     | pnpm workspace 出现，提供硬链接依赖管理       |
| 2021     | Turborepo、Nx 等并行任务和缓存构建工具出现    |

## 主流 Monorepo 方案对比

| 工具                | 依赖管理      | 任务编排        | 版本发布 | 特色                    |
| ------------------- | ------------- | --------------- | -------- | ----------------------- |
| Lerna               | ❌ 内部已弱化 | ⚠️ 单线程       | ✔️       | 老牌发布工具            |
| Yarn Workspaces     | ✔             | ⚠️ 弱           | ❌       | 快速简单，社区广        |
| **pnpm Workspaces** | **✔（最优）** | ❌              | ❌       | 依赖复用效率最高        |
| Turborepo           | ❌            | **✔ 并行+缓存** | ❌       | Vercel 推广，有显著加速 |
| Nx                  | ❌            | ✔               | ❌       | 配置复杂但功能强大      |

**最佳实践通常：pnpm + Turbo（or Nx） + Lerna（可选发布）**

## pnpm Monorepo 的原理

### pnpm 的核心机制：**基于硬链接的 node_modules**

普通 npm / yarn workspace 安装方式：

```
每个包有自己的 node_modules，重复占用磁盘
```

pnpm 安装方式：

```
全局 store（~/.pnpm-store 或其他的路径）存所有依赖
项目 node_modules 只放 hard-link => 节省空间、安装快
```

结构示例：

```
node_modules
  react -> 硬链接到 ~/.pnpm-store/react@18.2.0/index.js
```

### workspace 机制

当本地包之间依赖时：

```json
{
  "dependencies": {
    "@my/utils": "workspace:*"
  }
}
```

pnpm 会自动进行软连接 link，而不是走 npm registry。

---

### pnpm Monorepo 使用教程

#### 初始化工程

```sh
mkdir my-monorepo
cd my-monorepo
pnpm init
```

#### 创建 `pnpm-workspace.yaml`

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

#### 新建多个包

```
apps/web
apps/admin
packages/ui
packages/utils
```

#### 在子包中初始化

```sh
cd packages/utils
pnpm init
```

#### 在工程根目录安装依赖

```sh
pnpm install
```

#### 包之间互相依赖

`apps/web/package.json`：

```json
{
  "dependencies": {
    "@my/utils": "workspace:*"
  }
}
```

然后执行：

```sh
pnpm install
```

pnpm 会自动链接 `packages/utils` 到 `apps/web`

或者直接执行

```sh
pnpm add @my/utils --filter "apps/web"
```

#### 在工作空间安装依赖

```sh
# 工作空间根目录安装依赖
pnpm add -D prettier --workspace-root
pnpm add -D prettier -w

# 给特定包添加依赖
pnpm add lodash --filter app-web
```

#### 列出所有工作空间包

```sh
pnpm list
pnpm list -r
```

#### 运行脚本

根目录 `package.json`：

```json
{
  "scripts": {
    "dev": "pnpm -w run dev"
  }
}
```

子包：

```json
{
  "scripts": {
    "dev": "vite"
  }
}
```

运行：

```sh
pnpm run dev --filter web
```

#### filter 示例

```sh
# 强制从 workspace 根目录执行脚本，无视当前路径
pnpm -w run build --filter 'apps/*'
pnpm -w install --filter utils
```

#### 发布（可选）

配合 Lerna 管理版本：

```sh
# pnpm dlx 是 pnpm 中用于 临时执行一个 npm 包 的命令（类似 npx）
pnpm dlx lerna version
pnpm dlx lerna publish
```

## 文章

- [vue3 + pnpm 打造一个 monorepo 项目](https://www.cnblogs.com/burc/p/18568326)
