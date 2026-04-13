# Agent 集合

- [基于 MCP 的 AI Agent 应用开发实践](https://mp.weixin.qq.com/s/hpnE0JTFpF2V9PMuo0hVnw)
- [Agent 框架协议“三部曲”：MCP、A2A、AG-UI](https://mp.weixin.qq.com/s/WYQWJJ8w-29-j5FcQndGng)
- [彻底爆了！一文吃透 AIGC、Agent、MCP 的概念和关系](https://mp.weixin.qq.com/s/9YzK-zr2g19vBQnTovbEKw)
- [AI 编码不是梦：手把手教你指挥 Agent 开发需求](https://mp.weixin.qq.com/s/hlZFvFaAjVUGCObfVo6TFA)
- [如何让 AI 帮你做前端自动化测试？我们这样落地了](https://mp.weixin.qq.com/s/AbtEBQRCUn3PnlgBeOG2gw)
- [AI Agent 的工程化被低估了](https://mp.weixin.qq.com/s/hCB4vOQGb09BpRVqknDCBg)
- [万字长文深入浅出教你优雅开发复杂 AI Agent](https://mp.weixin.qq.com/s/eon4MCCErRWLT7GxSoR70g)
- [浅谈 Agent、MCP、OpenAI Responses API](https://mp.weixin.qq.com/s/K9y1JsD46bSsLqA2su3D8A)
- [什么是 AI 智能体？](https://mp.weixin.qq.com/s/_uYDUvvfyeKaEwcAZPu67g)
- [智能体 Agent 与工作流构建实战指南：从选型决策到高效实施](https://mp.weixin.qq.com/s/g93CF_akhd7F-RmpuVoliw)
- [MCP 技术浪潮中的 Agent 应用开发新范式](https://mp.weixin.qq.com/s/BPfVDSaCNFqe39NmtMHc3g)
- [从扣子，看 AI Agent 产品开发范式演进](https://mp.weixin.qq.com/s/9D5v6zg1nzlF7aucqeJo8g)
- [AG-UI：Agent 用户交互协议](https://mp.weixin.qq.com/s/JI6WmfqSuklAvRB7V1JMdA)
- [Agent 工程能力思考记录](https://mp.weixin.qq.com/s/ZM7uHow57_KU8QlRuF_rIA)
- [万字长文深入浅出教你优雅开发复杂 AI Agent](https://mp.weixin.qq.com/s/eon4MCCErRWLT7GxSoR70g)
- [从需求到研发全自动：如何基于 Multi-Agent 架构打造 AI 前端工程师](https://mp.weixin.qq.com/s/Huf3rfXM0hDqRe87VXiftg)
- [从单智能体到多智能体协作：Agentic System 的演进与 LangGraph4j 实战（推荐）](https://mp.weixin.qq.com/s/bzG37fcq8uLp3nyw_m5xTg)

## Agent 架构

### [技术教科书：顶级开发团队设计的 Harness 工程项目源码什么样](https://mp.weixin.qq.com/s/MKWckXraK1irNvMgCIJXZw)

- Claude Code 的详细解读，之后设计架构时，可以重点参考
- 它提供了一个关于如何构建高可靠性、高性能 AI Agent 的完整工程范式，即“Harness Engineering”（驾驭工程）。
- Part 1: 项目全景与技术选型
  - 1.1 规模一览
  - 1.2 技术栈选型分析
  - 1.3 目录结构与模块划分
  - 1.4 与同类工具的技术对比
  - 1.5 设计洞察
- Part 2: 启动流程 — 极致的性能工程
  - 2.1 四层启动链
  - 2.2 延迟加载策略
  - 2.3 设计洞察
- Part 3: 工具系统 — 可扩展的能力基座
  - 3.1 Tool 接口设计
  - 3.2 buildTool 工厂与 Fail-Closed 默认值
  - 3.3 工具注册与条件加载
  - 3.4 工具池组装
  - 3.5 StreamingToolExecutor — 流式并行执行
  - 3.6 核心工具概览
  - 3.7 设计洞察
- Part 4: 查询引擎 — Agent Loop 的核心
  - 4.1 异步生成器（async generator）驱动的主循环
  - 4.2 循环状态管理
  - 4.3 四级上下文压缩管道
  - 4.4 max_output_tokens 恢复机制
  - 4.5 模型降级与容错
  - 4.6 QueryEngine 类
  - 4.7 查询配置快照
  - 4.8 task_budget — API 侧 Token 预算
  - 4.9 设计洞察
- Part 5: 多 Agent 编排与任务系统
  - 5.1 七种任务类型
  - 5.2 AgentTool — 子 Agent 生成
  - 5.3 Coordinator 模式
  - 5.4 Agent Swarms 与 Team 管理
  - 5.5 DreamTask — 后台分析
  - 5.6 设计洞察
- Part 6: TUI 与用户体验工程
  - 6.1 内置 Ink 渲染引擎
  - 6.2 REPL.tsx — 875KB 的超大组件
  - 6.3 设计系统
  - 6.4 键绑定系统
  - 6.5 Vim 模式
  - 6.6 桥接系统 — IDE 集成
  - 6.7 其他 UX 子系统
  - 6.8 设计洞察
- Part 7: Harness Engineering — 从该项目看 2026 年最热工程范式
  - 7.1 什么是 Harness Engineering？
  - 7.2 六大支柱在 该项目中的完整落地
  - 7.3 该项目是 Harness 成熟度的标杆
  - 7.4 性能工程：毫秒级的偏执
  - 7.5 状态管理：34 行代码的哲学
  - 7.6 给开发者的 10 条 Takeaway
- Part 8: 隐藏彩蛋 — 藏在 50 万行代码里的浪漫
  - 8.1 🐾 Buddy 伴侣精灵 — “你的 AI 有一只宠物”
  - 8.2 🌙 AutoDream — “AI 也需要睡觉”
  - 8.3 📊 /thinkback — “你和 AI 的年度回顾”
  - 8.4 💬 /btw — “顺便问一句”
  - 8.5 🛡️ preventSleep — “别睡，我还在干活”
  - 8.6 🎨 /stickers 和 /good-agent — 小彩蛋们
  - 8.7 设计洞察

### [Agent/Skills/Teams 架构演进过程及技术选型之道](https://mp.weixin.qq.com/s/Z8JYgxUdHSLo4ywgyt4ljg)

- Agent 架构的演化史本质：因为我们在基础大模型无法完美内化“领域知识”和高效复用“长期记忆”的背景下，不断尝试“外挂”出这些能力的。本质上就是大家对大模型如何更好的注入领域知识和记忆管理这两方面的需求，不断促进了 Agent 架构的演化。
- Agent 架构的演化逐渐分化出了四条最主要的路径：“Single Agent → Multi-Agent → Agent Skills → Agent Teams”。
- Single Agent：知识注入与上下文窗口博弈
  - 优势：最原生的架构、开发链路最短、运行效率极高，适合快速构建 Demo 或处理知识依赖较少的场景。
  - 劣势：极度依赖上下文窗口的质量与长度。一旦涉及大量领域知识的注入，极易引发上下文爆炸，导致模型注意力分散，稳定性大幅下降。
- Multi-Agent：架构隔离与通信带宽的权衡
  - 优势：降低单体复杂度、可独立调优
  - 劣势：路由准确率压力、“局部最优”导致的上下文割裂（例如：重复执行、结论冲突）
- Agent Skills：可复用与渐进式的能力披露
  - 优势：低成本的知识注入、全局上下文一致性、规避 Context 爆炸。
- Agent Teams：“协同共创”的探索式形态
  - 其主要的核心逻辑和上文中 Multi-Agent 架构里的“独立（Independent）”或者“去中心化（Decentralized）”比较像，但又不完全一样，主要面向解决的是复杂未知问题。
  - 并行探索、上下文共享、动态协同、目标一致
- 如何科学地构建 Agent 系统
  - 模型越强效果越好，但并非 Agent 越多效果就越好
  - 尽量降低沟通成本和通信带宽
  - 单 Agent 的 45%阈值法则：实验数据表明，当单个 Agent 的任务成功率达到 45%以上时，单纯增加 Agent 数量带来的收益边际递减，甚至为负。
  - 场景决定架构：没有万能钥匙
  - Agent 架构的复杂度必须与问题的复杂度相匹配。
- Agent 架构选型之道
  - 理想的 Agent 建设路径，应当遵循 “奥卡姆剃刀” 原则：如无必要，勿增实体。把 Agent 架构选型的优先级路径列出来，基本上来看就是下面的排序：
  - P0：能用 Single Agent 解决的，绝不上复杂架构。
  - P1：遇到知识瓶颈，优先引入 Agent Skills 机制，通过动态渐进式加载 Skills 来扩展能力边界。
  - P2：仅在上述方案失效，且对效果上限有极致追求时，再谨慎启动 Multi-Agent 架构，并做好长期调优的准备。
  - P3：针对高度不确定的探索性任务，灵活叠加 Agent Teams 的并行协作能力。

## Agent 优化

### 上下文工程

#### [避免 Context 的过度工程化才是关键](https://mp.weixin.qq.com/s/dG3e8D3IqGsRxOvhit1Dow)

- 这篇文章深入探讨了 AI Agent 开发中如何有效管理上下文，避免过度工程化，核心观点来自 Manus 和 Cursor 两家领先团队的经验分享。上下文工程的关键在于平衡信息密度与模型效率，通过外部化存储、动态发现和分层工具管理，避免过度工程化，让 Agent 更专注于核心决策而非上下文负担。
- 核心问题：上下文爆炸与“上下文腐烂”
- 关键策略：上下文卸载与动态发现
- Manus 的结构化缩减系统，分阶段处理：紧凑化、摘要化
- Cursor 的“万物皆文件化”思路：将工具输出、终端会话、聊天记录等全部转化为文件，上下文窗口仅保留文件引用。
- 工具管理的优化：避免过载
- 核心设计哲学
  - Cursor：强调“少即是多”，减少初始上下文，让模型主动探索。
  - Manus：主张“少构建，多理解”，通过简化架构提升系统稳定性和智能程度。
  - 共同趋势：从“塞入更多信息”转向为 Agent 创建易于探索的外部环境，信任模型的自主动手能力。

### 工具管理

#### [避免 Context 的过度工程化才是关键](https://mp.weixin.qq.com/s/dG3e8D3IqGsRxOvhit1Dow)

- 其中也提到了工具管理的优化：避免过载
- 问题：工具描述过多会导致上下文混淆和 Token 浪费。
- 解决方案：
  - Cursor：将工具说明书文件化，模型按需检索（如通过语义搜索）。
  - Manus：分层行动空间：
    - L1 原子函数（如文件读写、Shell 命令）保持固定，确保缓存稳定。
    - L2 沙盒工具：通过 Shell 命令动态调用，避免定义塞入上下文。
    - L3 代码层：复杂任务用 Python 脚本处理，仅返回摘要结果。
