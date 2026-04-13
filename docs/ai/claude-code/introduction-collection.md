# Claude Code 讲解文章集合

### 揭秘 Claude Code 前沿技巧与 Qoder CLI 日常开发实战

链接：https://yuanbao.tencent.com/chat/naQivTmsDa/7a8a1120-bcf1-4a19-a897-9840091d2ec1

这篇文章围绕 Claude Code 的前沿能力与 Qoder CLI 的实践，从技术原理、架构设计到实际应用场景展开，核心内容可分为四大模块：

一、Claude Code 核心能力剖析

Claude Code 定义了 AI Coding 领域的多项关键技术，核心是通过模块化配置实现 Agent 能力的可扩展与可控：

1. 基础概念与技术细节

• Command：本质是“预置提示词的快捷方式”，通过 Markdown 文件（含 name/description 等 FrontMatter）定义，存储于用户级（~/.claude/commands，全项目生效）或项目级（${project}/.claude/commands，当前项目生效）。例如 git-commit Command 可自动化分支管理、提交信息格式化。

• Subagent：主 Agent 调用的“专业工具人”，拥有独立上下文、系统提示词与工具权限，解决长任务拆分（突破单一上下文限制）、并行处理（多 Subagent 同时工作）、专业领域定制（如 RESTful API 审查 Subagent）三大问题。通过 Task 工具唤起，支持显式（指定 Subagent 名称）、隐式（主 Agent 自动选择）、串联（按顺序调用多个 Subagent）三种方式。

• Skills：将专业知识打包为可复用组件，核心是 SKILL.md 文件，采用“渐进式披露”——仅当任务匹配时才加载详细指令，节省 Token。例如 pdf Skill 可处理 PDF 合并、表单填写，通过脚本（如 check_fillable_fields.py）减少模型代码生成成本。

• Hooks：接入 Agent 推理循环的“确定性钩子”，可在用户输入前（如改写 prompt）、工具调用前后（如自动格式化代码）、会话生命周期（如审计、通知）等 8 个关键事件点执行脚本，实现“非模型依赖的强制操作”（如安全校验、工程规范落地）。

2. 技术对比与架构设计

• Command/Subagent/Skills 差异：

| 特性     | Command      | Subagent        | Skills              |
| -------- | ------------ | --------------- | ------------------- |
| 定位     | 即时单步指令 | 专业 Agent 人格 | 可复用功能组件      |
| 上下文   | 主对话上下文 | 独立隔离上下文  | 动态加载到主/子对话 |
| 调用方式 | 用户显式触发 | 主 Agent 委派   | 模型自主/手工加载   |

• 高度可扩展架构：通过三级配置（企业级 /etc/claude、用户级 ~/.claude/、项目级 ${project}/.claude/）实现规则叠加，用 CLAUDE.md（项目级记忆文件）、Hooks、Commands 等文本配置替代硬编码，让 Agent 行为“可文档化、可管控”。

二、Claude 前沿工具调用技术

针对大模型上下文有限与工具调用低效问题，Anthropic 提出三项优化：

1. Tool Search Tool：按需动态加载工具（类似 Skills 的动态加载），避免预加载大量工具占用上下文。
2. Programmatic Tool Calling：工具调用结果先经代码清洗（如网页爬取去 CSS、统计数据聚合），再将处理后的结果传给模型，减少上下文膨胀。
3. Tool Use Examples：在工具描述中添加 input_examples 字段（如 create_ticket 的参数示例），指导模型生成更准确的调用参数。

三、Agent 本质与效率思考

Claude Code 的核心价值是回归 Agent 本质——通过“规划（主子 Agent 架构）、记忆（CLAUDE.md/compact 压缩）、工具调用（持续优化）”三大核心能力，将 Agent 从“花哨功能”拉回“可复用、可工程化”的本质。同时，通过 Headless Mode（无界面自动化）、Agent SDK（深度集成）加速迭代，并用“自己开发自己”（Dogfooding）重新定义“AI 迭代 AI”的生产关系。
