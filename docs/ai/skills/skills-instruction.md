# Agent Skills 介绍

## 背景

当前的AI智能体就像是一位拥有超强算力却患有‘短期失忆症’的超级员工：虽然它能迅速掌握复杂的单次指令，却无法将过往的交互经验沉淀为长期的工作记忆（现在最长上下文是百万 Tokens）。每一次新的对话窗口的开启都等同于‘恢复出厂设置’，迫使你不得不反复进行基础的背景同步与流程教学，导致大量精力被消耗在低效的重复沟通之中。

## 什么是 Agent Skills

### Agent Skills 概念

Skills 是 Claude 的可复用能力包，用于将领域知识、最佳实践、工作流程和执行逻辑封装固化为可复用的‘技能组件’（指令、脚本、资源），让 AI 能够按需调用能力，无需重复训练。它将“如何做一件事”封装成 Claude 可长期记住和调用的能力模块

Claude Skills 是一种基于文件系统的、可复用的知识包，运行在 Claude 的沙盒虚拟机（VM）环境中，用于向 Agent 注入流程化、确定性的内部知识（SOP）的标准化方案。

```
Skills = 可复用的、结构化的 Prompt + 执行规则 + 资源
```

用一个更生动的比喻：

- 传统方式：每次都要向AI详细解释"如何做"
- Agent Skills：给AI一本"操作手册"，需要时自动调用

### Agent Skills 技术原理

Agent Skills最核心的创新是三层渐进式加载机制，也称为渐进式披露（Progressive Disclosure）

#### 第一层：元数据（始终加载）（～100 tokens）

智能体启动时，只加载所有技能的元数据（名称+描述），即SKILL.md 中 YAML 的元信息，总是会放到上下文中

```
---
name: data-analysis-expert
description: 专业数据分析技能，支持CSV/Excel处理和可视化
---
```

Agent 的系统提示词（System Prompt）和 Skill 的元信息始终会在上下文中，这样 Agent 根据对话动态决策使用哪个技能，以及根据技能描述动态加载所需要的资源（第二层和第三层）。

#### 第二层：核心指令（触发时加载）

当 Claude 发现某个 Skill 与当前任务相关时，Claude 才会使用 Bash 工具阅读 `SKILL.md` 文件的主体内容，加载完整的SKILL.md指令文档，即SKILL.md 中 Markdown 部分的技能描述，要小于 5K

```
---

name: report-automation

description: 根据输入生成日报/周报/月报，并按模板输出 Markdown。

---



##  指令

1. 提取岗位、报告类型、姓名、日期和工作内容

2. 选择对应模板

3. 生成结构化 Markdown 报告
```

#### 第三层：执行阶段

按需动态访问引用的脚本和资源文件

这种三层加载设计让智能体可以同时"掌握"数十甚至上百个技能，而不会因为上下文过载而失效。

### 为什么有了 Prompts、MCP 还需要 Agent Skills？

很多人会困惑：Skills、Prompts、MCP有什么区别？


| 类型          | 定位             | 特点           | 生命周期   |
| :------------ | :--------------- | :------------- | :--------- |
| Prompts       | 对话级指令       | 单次任务，不可复用，不可组合，模型对于同一个 Prompt 理解不同输出结果不稳定       | 临时       |
| MCP           | 工具连接协议     | 外部系统对接   | 持久化     |
| Agent Skills  | 领域知识包       | 本地化可复用能力     | 持久化     |

整体的软件架构逻辑：

```
应用层：Prompts（单次对话） + Agent Skills（本地化可复用能力、领域知识、工作流、最佳实践）
    ↓
传输层：MCP（外部系统对接、标准化接口、工具调用）
    ↓
基础设施层：数据库、API、文件系统（数据源）
```

Skills主要是 Markdown 文件和一些脚本文件，优势在于渐进式加载，不需要服务器资源，适用性好；MCP 主要是客户端和服务端的架构，启动时加载所有工具定义，集成外部功能，Tokens 消耗更高，使用起来更复杂。

如果说MCP为智能体提供了"手"来操作外部工具，那么Skills就提供了"操作手册"或"SOP"，教导智能体如何正确使用这些内部知识和能力。两者是互补的关系，Agent 可以通过 Skills 获取知识，通过 MCP 拓展功能。

当然，现在 Rule、MCP、Skill 边界也越来越模糊。

- [Claude Skills｜将 Agent 变为领域专家](https://mp.weixin.qq.com/s/bwFGcomH6BfkBzhFMiiH1g)
    - 里面有详细介绍，Claude Skills 和 MCP 的关系是什么?

## Agent Skills 实践

Skill 即技能，一般放在 skills 文件夹内，一个技能一个文件夹，一个技能通常包括 SKILL.md 文件，相关的文档和可运行的脚本等。

一个完整的Skill通常包含：

```
my-skill/
├── SKILL.md           # 核心指令文档（必需）
├── scripts/           # 可执行脚本
│   ├── process.py
│   └── validate.sh
├── reference/         # 参考文档
│   └── api-docs.md
└── assets/            # 资源文件
    ├── templates/
    └── examples/
```

### SKILL.md 指令文档

SKILL.md 是Skill的核心指令文档，用于描述技能的名称、描述、执行流程等。

一个 SKILL.md 文件通常包括一个 YAML 头和 Markdown 格式的技能描述，技能描述中可以提及 Skill 中的其他资和脚本等，Agent 会按需加载。

```
---
name: github-actions-debugger
description: 帮助调试失败的GitHub Actions工作流
---

# GitHub Actions调试专家

## 使用时机
当用户遇到CI/CD失败、构建错误或部署问题时使用

## 工作流程
1. 使用`list_workflow_runs`工具查看最近的运行状态
2. 使用`summarize_job_log_failures`获取失败摘要
3. 分析日志，定位问题根源
4. 提供修复建议和代码示例

## 常见问题检查清单
- [ ] 环境变量和密钥配置
- [ ] 依赖版本兼容性
- [ ] 权限设置
- [ ] 超时配置
```

### Agent Skills 适用场景分析

#### 场景1：发现自己总是重复相同的指令

案例：每次让AI写技术文档，都要说明：

- 使用Markdown格式
- 包含目录
- 代码块要标注语言
- 添加实例和图表

Skills解决方案：创建technical-writing技能包，将这些规范固化。

#### 场景2：需要遵循特定的领域知识或规范

案例：公司的品牌设计规范（颜色、字体、布局）

Skills解决方案：

```
---
name: brand-guideline
description: 公司品牌视觉规范
---

## 品牌色彩
- 主色：#FF6B6B（活力红）
- 辅色：#4ECDC4（清新蓝）
- 文字色：#2C3E50（深灰）

## 字体规范
- 标题：思源黑体 Bold
- 正文：思源宋体 Regular
- 代码：Fira Code

## 应用原则
所有输出的视觉内容必须遵循以上规范...
```

#### 场景3：复杂多步骤工作流

案例：竞品分析报告制作

- 收集竞品数据
- 数据清洗和分析
- 生成可视化图表
- 撰写分析报告
- 制作PPT演示

Skills解决方案：组合多个技能模块

```
# 智能体自动调用技能链
$web-scraper → $data-analyzer → $chart-generator → $report-writer → $pptx-creator
```

### 最佳实践

- 单一职责：每个技能专注一个明确的能力领域
- 保持精简：不仅要写给 AI 看，还要省着写，5K 或者 500 行
    - 上下文是公共品 (Public Good)：你的 Skill 会与系统提示词、对话历史和其他 Skill 共享上下文窗口。
    - 默认假设 Claude 很聪明：不要解释显而易见的概念（如“什么是 PDF”）。只提供它不知道的特定上下文。
    - 每个 Token 都要接受质问：“Claude 真的需要这句话吗？”、“删掉这段会影响效果吗？”。
- 清晰的触发条件：明确说明何时应该使用这个技能
例如：
```
## 使用时机
- 用户提到"生成API文档"
- 用户上传了包含接口定义的代码文件
- 用户询问"如何记录API"
```
- 提供具体示例：包含完整的输入输出示例

```
## 示例

### 输入
```python
@app.route('/users/<int:user_id>', methods=['GET'])
def get_user(user_id):
    """获取用户信息"""
    user = User.query.get(user_id)
    return jsonify(user.to_dict())

### 输出
 GET /users/{user_id}

获取指定ID的用户信息

**参数**：
- `user_id` (integer): 用户唯一标识

**返回**：
- 200: 用户对象
- 404: 用户不存在
```

- 脚本健壮性：在脚本中添加健壮的错误处理逻辑

```
# scripts/process.py
import sys

try:
    # 核心逻辑
    result = process_data()
    print(result)
except FileNotFoundError:
    print("错误：找不到输入文件", file=sys.stderr)
    sys.exit(1)
except Exception as e:
    print(f"处理失败：{str(e)}", file=sys.stderr)
    sys.exit(1)
```

- 自由度控制
    - 低自由度 (Low Freedom)：适用于数据库迁移等高风险操作。做法：提供精确的脚本、严格的步骤，不留发挥空间。
    - 中自由度 (Medium Freedom)：适用于有首选模式但允许微调的任务。做法：提供伪代码或带参数的脚本。
    - 高自由度 (High Freedom)：适用于代码审查或创意写作。做法：提供大致方向，相信 Claude 的判断。

- 结构与文件组织：渐进式披露 (Progressive Disclosure)：不要一次性把所有东西都塞进上下文，而是像“洋葱”一样一层层剥开。
    - 文件系统架构：Claude 像操作 Linux 文件系统一样操作 Skill。它只在需要时通过 read 工具读取特定文件。
    - 三种组织模式：
        - a.概览 + 引用：SKILL.md 只是目录，详情在 REFERENCE.md。
        - b.领域隔离：销售看 sales/，财务看 finance/，互不干扰。
        - c.按需加载：只有用户提到特定功能（如 "红线修订"）时，才去读对应的高级文档。
            - 避免深层嵌套：引用层级不要超过 1 层（SKILL.md -> ref.md，不要再 -> sub_ref.md），否则 Claude 可能偷懒只读部分内容
            - 路径规范：永远使用正斜杠 /（Unix 风格），严禁使用 Windows 的反斜杠 \。

- 命名与元数据规范
    - Name (名称)：
        - 推荐使用 动名词形式 (Gerund form)：如 processing-pdfs, analyzing-spreadsheets。
        - 规则：仅限小写字母、数字、连字符。
        - 避免：helper, utils 这种毫无意义的名字。
    - Description (描述)：
        - 至关重要：这是 Claude 在 100+ 个 Skill 中决定是否调用你的唯一依据。
        - 第三人称写法：不要用 "I can..." 或 "You use..."，直接写 "Processes Excel files..."。
        - 包含触发词：明确写出 Skill 做什么以及何时使用。

- 代码与执行 (Executable Skills)：对于复杂任务，代码脚本 > 纯文本指令
    - Plan-Validate-Execute 模式：
        - 对于批量或高风险操作（如修改 50 个表单字段），不要直接执行。
        - 流程：分析 -> 生成计划文件 (changes.json) -> 运行脚本验证计划 -> 执行 -> 确认。
    - 错误处理：脚本必须显式抛出具体错误（如 "Field 'date' not found"），而不是把报错扔给 Claude 去猜。
    - 避免魔术数字：所有配置项必须有文档说明，不要让 Claude 猜参数。
    - MCP 工具调用：必须使用全限定名 ServerName:tool_name（例如 GitHub:create_issue），防止工具冲突。
