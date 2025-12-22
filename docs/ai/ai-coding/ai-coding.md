# AI-Coding

## 好的使用方式：计划先行，代码后行

- **规划与脚手架搭建**。整个过程始于高层次的战略规划，通常在一个 Markdown 文件中进行。由 AI 协助创建一份开发路线图，将宏大的目标分解为更小的、可执行的任务，或者 mermaid 图来可视化整个开发流程。
- **详尽的任务定义**。对于每一个子任务，应该编写一份极其详尽、自包含的提示（prompt），精确地定义 AI 需要完成的工作、遵循的约束和预期的输出。
- **受控的执行过程**。开发者会一次只将一个任务指令交给 AI，并明确要求其在“完成后汇报”，而不是让其连续不断地工作。
- **人在环路中的审查**。AI 完成任务后，开发者会仔细审查生成的代码。如果发现问题（例如，AI 未能复用一个已存在的工具函数），开发者会进行迭代修正，直到代码质量达标，然后再进行下一个任务。

## SDLC （软件开发生命周期）的代理团队

- 市场调研：OpenAI/Google DeepResearch 等
- UI 原型阶段：UX Pilot、v0.dev (by Vercel) 等
- 需求阶段：结合 Atlassian Jira、Confluence 等
- 代码生成：Claude Code、CodeX、Cursor、Windsurf、AutoDev、GitHub Copilot 等
- 代码质量：CodeRabbit、Qodo Merge、CodeAnt.ai、Greptile 等
- 质量环节：Functionize、Testsigma、Appvance 等
- 运维：Datadog/NewRelic 等

## 速度 or 技术债

在 2024 年期间，包含五行以上重复邻近代码的代码块出现频率增加了 8 倍，代码重复的普遍程度比两年前高出 10 倍。

AI 会 “不加选择地放大”：如果你在犯错，它会帮助你更快、更大规模地犯错。 也因此极大地拉大了高质量代码库与低质量代码库之间的开发速度差距。

AI 智能体所承诺的“10 倍生产力”是真实存在的，但它附带着以技术债形式出现的高额且不断复利的“隐藏利息”。如果放任不管，这笔债务将最终压垮整个工程组织。在 2025 年及以后能够取得成功的领导者，将是那些能够清醒地认识到这一悖论，并主动构建相应的文化、流程和分层工具链来驯服这头智能体“野兽”的人。 只有这样，才能将其原始的、强大的力量，转化为可持续的、架构优良的商业价值。

## 相关文章

- [下一场革命：Vibe Engineering ｜ OpenAI 内部分享](https://mp.weixin.qq.com/s/dnyG27ReM4UJF6M11n7uoQ)
  - 软件工程的核心价值从“编码能力”转向了更高层的架构设计、质量验证与判断力、设计与品味和清晰定义需求的能力。
  - 高普及率与效率提升：OpenAI 内部技术人员对 Codex 的采用率超过 92%，所有代码合并请求（PR）都由 Codex 审核。使用 Codex 的工程师，其被合并的 PR 数量比不使用的多 70%，显著提升了生产效率。
  - 工作重心转移：从“编写”到“验证”：瓶颈不再是写代码，而是证明代码的有效性、安全性和可维护性。AI 将大量时间花在运行测试、修改测试以确保质量上。新的进度衡量标准变成了置信度，而非代码行数。
  - 工作模式变革：工程师成为“管理者/导演”：
    - 工程师的角色转变为向 AI 分配任务、审核其产出。
    - Codex 能自主创建“子代理”并行工作（如研究、设计架构），并制定执行计划，工程师负责整体把控和决策。
    - 演示中展示了“Best of N”​ 功能，AI 并行生成多个方案供工程师选择，体现了 “AI 负责发散，人类负责收敛”​ 的新工作流。
    - Vibe Coding 是让模型随便写代码然后祈祷测试能过；Vibe Engineering 强调工程师始终保持最终责任，但利用 AI 代理进行规划、架构、调试等全流程辅助。

## 介绍

- [腾讯研究院：2025 AI Coding 非共识报告！](https://mp.weixin.qq.com/s/Z0-ndh1sE0W3ebsVCs_ArQ)
- [聊聊 AI Coding](https://mp.weixin.qq.com/s/9dNw5xAAajwrwXkRgveuiw)
- [关于 AI 编程的一些浅思](https://mp.weixin.qq.com/s/YWp3zvZSnFnG2svND_YQ5A)
- [面向六个月后的 AI Code，也许影响的不只是前端](https://mp.weixin.qq.com/s/zqHvwZImxoGDLGdGGi87vw)
- [AI 驱动研发效率在中后台的实践](https://mp.weixin.qq.com/s/bg32-w2e308XBPXyXpE6sQ)
- [AI 编码陷阱防不胜防？看看 Cursor 设计负责人 Ryo Lu 是怎么说的](https://mp.weixin.qq.com/s/6rLQXaAtL8Liy7LKyjT6lw)
- [淘天自营前端开发的 AI 增效实践总结](https://mp.weixin.qq.com/s/y_SuHyMOR58Ws1KBEP26_w)
- [留给初中阶程序员的时间不多了](https://mp.weixin.qq.com/s/19xbEZpir5dX9PUD3sfdrQ)
- [淘宝交易前端 AI 生码技术的创新实践](https://mp.weixin.qq.com/s/RBIlsqdkN7CNDuGWxhoxGQ)
- [前端仔如何在公司搭建 AI Review 系统](https://mp.weixin.qq.com/s/OhvAR8pGf0VgpCg_JOhurg)

## Cursor

- [与 Cursor 结对编程的四个月，我大彻大悟了！](https://mp.weixin.qq.com/s/ekNxpuq5wG8AN3GyF359hA)
- [这款堪称编程界的“自动驾驶”利器，集开发、调试、提 PR、联调、部署于一体](https://mp.weixin.qq.com/s/eN6ROBtrXASuTVu32VLXVQ)
- [前端开发又幸福了，Cursor + Figma MCP 快速还原设计稿](https://mp.weixin.qq.com/s/oqVLaWKpUCk6T3uR6QiM0Q)
- [AI 编程神器 Cursor 十大使用技巧：让代码更听你的话](https://mp.weixin.qq.com/s/X7cI-yScBrqUvMXd_S1PWQ)
- [Cursor MCP 推荐](https://mp.weixin.qq.com/s/mShTSOispTM0JQftcRgkrQ)
- [Cursor 在前端需求开发工作流中的应用](https://mp.weixin.qq.com/s/M5IlrUFsVoeIV6OJeiJ_ag)
- [利用 Cursor 提升易览采集源接入效率](https://mp.weixin.qq.com/s/Vd2snQbZv7kuar7TflfEbA)
- [用 Cursor 打造工程化 AI 编程体系](https://mp.weixin.qq.com/s/lMDc3HrEc4x1zA2EEPj06Q)
- [Cursor 内部工作原理](https://mp.weixin.qq.com/s/-mD3mkF-E2GyERU-8wuNUQ)
- [Cursor 编辑代码功能是如何实现的？](https://mp.weixin.qq.com/s/qbRl_Yz4o3ByDTAXQr75QQ)
- [利用 Cursor 提升广告监控业务场景开发效率的实践思路](https://mp.weixin.qq.com/s/oV-KqygICbfEGUnhem6KMQ)
- [Cursor V1.0 新特性快速入门](https://mp.weixin.qq.com/s/tIA04fFUWD-vhmn7rJF7rQ)
- [Cursor 原理之窥探提示词](https://mp.weixin.qq.com/s/RB0uhk9g42mOOPKB70j-gA)

需要弄清楚几个问题？

- rules 现在的存在的地方和写法
- MCP 现在存放的地方和写法

## Claude Code

- [你不应该错过 Claude Code 的 Sub Agents](https://mp.weixin.qq.com/s/HYbvxObjTJMUc3dSCvHGmA)
- [国外大佬是如何使用 Claude Code 的？（附最佳技巧）](https://mp.weixin.qq.com/s/6SvrzgDAi_krx4OtmkaVUA)
- [一周 Claude Code 深度使用技巧报告](https://mp.weixin.qq.com/s/6ctjht6rT07qY4m1bnxcKg)
- [Cursor or Claude Code ？— 这道题怎么选](https://mp.weixin.qq.com/s/s9v1do9YlMBN_xECkIl4tw)
- [AI 时代的终端革命：Claude Code 完全指南](https://mp.weixin.qq.com/s/23-HkZOylhVA7DzkYKYL5w)

## 实践

- [如何用 AI Coding 和 Claude Code 提升开发效率？看我的全流程复盘](https://mp.weixin.qq.com/s/6j-MqSrJz5YlKAe2LZW6pg)
