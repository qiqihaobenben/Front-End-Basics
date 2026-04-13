# UI 设计

## 网站工具

- 【免费】[Stitch](https://stitch.withgoogle.com/) - Google 的 AI 设计工具
- 【收费】[UXPilot](https://uxpilot.ai/zh-CN/plans) - 免费一共 45 积分
- 【收费】[Anima](https://dev.animaapp.com/) - 每月 5 次试用
- 【收费】[Locofy.ai](https://www.locofy.ai/dashboard) - 1000 Token
- 【收费】[lovable.dev](https://lovable.dev/dashboard) - 每天 5 次试用
- 【收费】[v0 by Vercel](https://v0.app/) - 每月 5 次试用
- 【收费】[Banani](https://app.banani.co/) - 每月 20 次试用，每天最多 5 次试用

## Design to Code（D2C）

### 一、Figma 原生方向（设计稿 → 代码）

### **Figma Dev Mode + MCP Server**

Figma 已建立起 UI/UX 设计领域的行业标准，几乎所有设计师都在使用它，而 Figma MCP Server 在 2026 年初加入了 Model Context Protocol 支持，允许 AI 编码 Agent 直接从 IDE 拉取实时设计数据，无需手动导出。这条路线的核心优势是：一次配置，每个项目都能受益，能生成带真实组件结构、可放入真实 repo 的代码。

### **Anima**：[https://dev.animaapp.com/](https://dev.animaapp.com/)

Anima App 是一款旨在桥接设计（Design）与代码（Code）的自动化工具，它允许设计师在 Figma、Adobe XD 和 Sketch 等设计软件中直接创建高保真原型，并将其转化为可用的前端代码（HTML, CSS, React, Vue 等）

Anima 能将 Figma 设计直接转换为生产可用的 React/HTML/Tailwind 代码，同时还能创建可测试的应用，而不仅仅是静态标记。Anima 生成的 React 组件结构清晰，prop types 规范，是追求 React 输出质量的团队的首选之一。

### **Locofy.ai**：[https://www.locofy.ai/dashboard](https://www.locofy.ai/dashboard)

Locofy.ai 是一款基于人工智能（AI）的前端开发工具，旨在通过自动化方式将 UI 设计稿（如 Figma、Adobe XD、Sketch）快速转化为响应式的前端代码。

Locofy 将 D2C 自动化推进得更深，支持可复用组件、逻辑以及设计系统映射，并支持 React、Next.js、Vue、Gatsby、React Native 等多框架，还可选择 JS 或 TS 输出。在需要像素级精确输出时，Locofy 是付费方案中的强力选择。

### **Builder.io Visual Copilot**：[https://builder.io/app/projects](https://builder.io/app/projects)

Builder.io Visual Copilot 是一款由 Builder.io 推出的革命性 Figma-to-Code（设计转代码）插件。它利用 AI 技术，将 Figma 设计稿即时转换为高质量、可维护的前端代码（如 React、Vue、Angular、Tailwind CSS 等），旨在将设计与开发流程无缝衔接，极大地提高了前端开发效率。

Builder.io Visual Copilot 的核心亮点是：它能将导入的 Figma 组件映射到你现有的 React 组件上，生成的代码直接融入现有代码库，而不是创建平行的组件结构。Shopify 内部设计团队曾用它将一个落地页的开发周期从三周缩短到八天，转化率还提升了 22%。

---

## 二、AI 生成方向（Prompt/截图 → 代码）

### **v0 by Vercel**: [https://v0.app/](https://v0.app/)

v0 用于生成漂亮的 React 组件，基于 shadcn/ui 和 Tailwind CSS，适合单个组件和页面级别的生成。v0 现在已进化为全栈开发平台，支持 Git 分支、PR 工作流、GitHub repo 沙箱运行时，以及企业级安全配置，非工程师也能通过正规 Git 流程交付生产代码。

### **Lovable**: [https://lovable.dev/dashboard](https://lovable.dev/dashboard)

Lovable 适合直接从描述生成完整应用，跳过设计阶段，通过对话迭代，生成的原型足够用于用户测试。结合 Supabase 可获得带数据库和鉴权的完整应用。

### **Banani**: [https://app.banani.co/](https://app.banani.co/)

Banani 是一个高保真 AI UI 生成工具，支持共享画布，能将文字或截图转换为可编辑的多页面原型，并支持 HTML+CSS 代码导出。它还支持从截图生成可编辑的 Figma 文件，再转换为代码，是一条独特的"截图 → 设计 → 代码"路径。

### **Google Stitch**: [https://stitch.withgoogle.com/](https://stitch.withgoogle.com/)

Google Stitch 由 Gemini 模型驱动，支持文本、图片、线框图多种输入混合使用，适合早期探索和创意阶段的快速出图。

---

## 三、国内代表产品

### **字节跳动 Semi Design D2C**：[https://semi.design/zh-CN/start/getting-started](https://semi.design/zh-CN/start/getting-started)

字节跳动的 Semi Design 在组件库之上构建了完整的 D2C 工具链，致力于用先进工具连接设计师与开发者，其 D2C 演进已形成体系化方法论。

---

**总结一张选型地图：**

| 场景                            | 推荐工具                   |
| ------------------------------- | -------------------------- |
| 有精细 Figma 稿 → React 代码    | Figma MCP + Anima / Locofy |
| 从截图/描述快速出 UI 组件       | v0                         |
| 从零构建完整可运行应用          | Lovable / Bolt.new         |
| 企业级设计系统集成              | Builder.io / Supernova     |
| 多框架输出（含 Flutter/移动端） | Locofy                     |
| 多输入混合探索阶段              | Banani / Google Stitch     |
