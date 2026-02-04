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


## Agent 优化

### 上下文工程

- [避免 Context 的过度工程化才是关键](https://mp.weixin.qq.com/s/dG3e8D3IqGsRxOvhit1Dow)
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

- [避免 Context 的过度工程化才是关键](https://mp.weixin.qq.com/s/dG3e8D3IqGsRxOvhit1Dow)
  - 其中也提到了工具管理的优化：避免过载
  - 问题：工具描述过多会导致上下文混淆和 Token 浪费。
  - 解决方案：
    - Cursor：将工具说明书文件化，模型按需检索（如通过语义搜索）。
    - Manus：分层行动空间：
      - L1 原子函数（如文件读写、Shell 命令）保持固定，确保缓存稳定。
      - L2 沙盒工具：通过 Shell 命令动态调用，避免定义塞入上下文。
      - L3 代码层：复杂任务用 Python 脚本处理，仅返回摘要结果。
