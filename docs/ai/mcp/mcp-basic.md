# MCP 基础

MCP（Model Context Protocol）

## MCP 解决的问题

传统上（Function Call），AI 应用需要为每个数据源编写自定义集成代码。

MCP 提供了一个统一的标准协议（基于 JSON-RPC 2.0），让 AI 应用可以通过标准化方式访问不同的数据和工具。

## Function Call vs MCP

Function Call，标杆开源项目是 Langchain Tools，它提供了"All In One"的工具箱，号称大模型的瑞士军刀。传统 Function Call 存在先天性的不足：线性指令执行机制带来的性能瓶颈与异构接口标准带来的兼容性瓶颈。

而 MCP 的设计思路则不同，它遵循微内核架构的设计理念：定义架构和协议标准。号称工具调用的 USB-C 标准。

- [MCP + 数据库，一种比 RAG 检索效果更好的新方式！](https://mp.weixin.qq.com/s/56U9p2_mLCDxo_aVqfRkzQ)
  - 其中有 MCP 和 Function Call 的对比
- [Cursor + MCP：双剑合璧，解锁极致编程效率](https://mp.weixin.qq.com/s/wF4wrhnGpb1kDbIpoOU8MA)
  - 其中写了“为什么规范了这样的协议？”
  - MCP 与 Function Calling 的区别

## 原理

### 核心架构

1. MCP Host （如 Claude Desktop、Cursor IDE、Cline）可以看做是一个 AI Agent。调用 LLM 执行意图识别，制定任务计划。然后通过 MCP Client 调用 MCP Server 完成任务流中的一个一个子任务。同时负责管理与用户的会话。

2. MCP Server，轻量级程序，每个程序都通过标准化的模型上下文协议 （MCP） 提供特定功能（Tools/Resources/Prompts 等）。并且通过类似 OAS 标准的 Schema 标注，让大模型能很好地理解工具的功能范围及使用方法。MCP Server 需要有安全控制机制，以保障接口/资源不被越权访问。

3. MCP Client 即通信中间件。MCP Client 是 MCP Host 内部的组件，一个 MCP Host 可能有一个或多个 MCP Client，负责与一个或多个 MCP Server 建立连接，并处理 JSON-RPC/SSE 等协议交互。

### MCP 通信的两层架构

- 数据层（Data Layer）：定义了以 JSON-RPC 为基础的消息格式和语义，并划定了 MCP 的原语 和 生命周期逻辑。
- 传输层（Transport Layer）：定义了连接建立和消息传输的底层机制。

#### 数据层（Data Layer）

##### MCP 原语（Primitive）

通常我们作为开发者，更多的是进行 MCP Server 的开发，所以有必要了解 MCP Server 的原语（即 MCP 能暴露的服务种类）。

MCP Server 中有三大原语：

- Tools ：AI 应用可以调用的可执行函数，用于执行具体操作（如文件操作、API 调用、数据库查询）
- Resources ：为 AI 应用提供上下文信息的数据源（如文件内容、数据库记录、API 响应）
- Prompts ：帮助构建与语言模型交互的可复用模板（如系统提示词、Few-shot 示例）

除了常见的 Server 侧的原语，MCP Client 也有几种原语暴露给 Server，为 Server 提供一些和客户端用户交互的能力，如：

- Sampling ： Server 可以向 Client 发起 LLM 调用请求，使得 Server 无需直接接入或付费调用 LLM
- Roots 　：Client 向 Server 声明可访问的文件系统范围
- Elicitation ： Server 向 Client 发起请求用户填写结构化信息，使得用户可以直接为 Server 提供详细信息

##### 生命周期

MCP 的通信生命周期有以下几个流程，这里简要讲解一下：

- 初始化（Initialization）：Client 和 Server 进行握手和协议协商，完成初始化，并进行能力协商（capability negotiation），双方交换自己支持的原语和能力，建立通信能力边界。
- 运行（Operation）：双方基于已确定的能力边界进行 JSON-RPC 通信，可以基于场景选择不同的传输模式。
- 终止（Shutdown）：基于不同的传输模式来断开连接。

#### 传输层（Transport Layer）

对于 Client 和 Server 的数据传输，官方提供了几种标准传输模式（当然，如果业务有需求也可以自定义传输模式，只要符合官方提供的 JSON-RPC 标准）：

- 本地：stdio
- 远程：
  - Streamable HTTP
  - HTTP + SSE（现已不推荐使用）

在 stdio 传输模式下，Host 直接以子进程形式启动 MCP Server，通过标准输入（stdin）发送 JSON‑RPC 请求，从标准输出（stdout）接收响应，无需网络层。适用于那些需要操纵用户本地机器的场景，比如连接用户本地的数据库、访问本地文件或者为用户本地创建文件等操作。

目前，Streamable HTTP 是标准指定的远程 MCP 实现方式，它是为了解决 HTTP + SSE 的弊端而提出的。

在 HTTP + SSE 传输模式下，Client 和 Server 建立长连接，Server 可以通过 SSE（Server‑Sent Events）向 Client 推送消息。虽说整个流程非常简单，但是 HTTP + SSE 问题在于，这种传输模式依赖长连接，是 stateful 的，这非常不利于扩展。另外，其实很多场景没有必要做 stateful，比如某些场景下 MCP Server 就是被调用一次就结束，那维持长连接就会显得非常鸡肋，完全是在浪费资源。所以可以 stateful、可以 stateless 的 Streamable HTTP 就被提出了。

Streamable HTTP 同时支持 stateful + stateless，可以直接用普通 HTTP（POST / GET）做无状态请求，请求响应后立即断开，适合无状态场景。也能按需升级为 SSE（流式），在确实需要实时推送时再开启长连接。这适应更多云端和弹性部署场景，所以它将逐步取代原来的 HTTP + SSE。

- [MCP 在蚂蚁前端的落地之旅-](https://mp.weixin.qq.com/s/CdCvCzfycme6rw4OKa_1aA)
  - “Client 可以通过不同的 Transport 协议来连接到不同的服务”这一部分详细讲解了一下三种传输方式

### 交互流程

#### 初始化阶段：

MCP Host 启动时基于配置与 MCP Server 建立连接，获取并缓存工具/资源的元数据描述（如接口定义 JSON Schema）。

#### 任务处理阶段：

MCP Host 调用大模型做意图识别和任务规划。大模型结合用户 prompt 及上下文信息、可用工具列表动态规划任务流程并适配 Tool Call 参数。该阶段采用 ReAct 循环机制，当参数不完整或输出结果置信度低于阈值时启动用户协同修正流程。

### 技术关键点

#### 统一语义空间

MCP Server 通过 Schema（类 OAS3 标准） 明确定义工具的能力范围及接口字段（包含类型、校验规则及自然语言描述等）。

```
填写 Schema 示例
```

大模型基于用户意图动态规划工具调用指令流。并根据上下文信息、工具的 Input Schema 生成调用参数。实现自然语言与工具调用的语义对齐。

#### 双向通用协议

通过双向通讯机制 MCP Host 不仅可以通过 RPC 调用工具集，还可以实时感知工具和资源的变更。目前支持 STDIO、HTTP + SSE、Streamable HTTP 通讯协议。覆盖了本地进程间通讯和远端通讯的场景。

##### 如何进行通讯？

客户端和服务器之间的通信遵循特定的生命周期。首先是初始化阶段，客户端发送请求，服务器响应，并发送确认通知。初始化完成后，双方可以自由交换消息和通知。

为了实现这种通信，MCP 提供了多种传输方案，来处理客户端和服务器之间的实际数据流：

- 标准 I/O，适用于本地服务器 - 客户端将服务器作为子进程启动，并通过 stdin/stdout 进行通信
- HTTP + SSE(Server-Sent Events)，适用于远程服务器 - 保持请求间的有状态连接
- Streamable HTTP（推荐） - 一种较新的传输机制，可灵活支持有状态和无状态连接

#### 微内核架构

得益于 MCP 微内核架构，任何支持 MCP 的 AI 应用（MCP Host）均可直接配置并使用应用市场的 MCP Server（官方、三方），无需预编码适配。类似于 USB 设备插入即用。

```
Cursor MCP Server 配置文件示例
```

### MCP Servers 市场

- [官方 MCP 实现和收集的集合](https://github.com/modelcontextprotocol/servers)
- [Find Awesome MCP Servers and Clients](https://mcp.so/)
- [发现全球 MCP Servers](https://mcpmarket.cn/)

## 相关文章

- [MCP 协议深度解读：技术创新正以前所未有的速度突破](https://mp.weixin.qq.com/s/fpUbnxLhX5EgX8cX0rew3g)
  - 简述了技术背景、MCP Timeline、以及实际开发验证。简述了 Multi-Agent 架构和大模型应用开发的痛点和解决
- [最近爆火的 MCP 究竟有多大魅力？MCP 开发初体验](https://mp.weixin.qq.com/s/O3wM98PwbPM5Itc_bcpFjw)
  - MCP 的 Java 实操
- [MCP - 了解 MCP 基础知识并构建论文管理聊天机器人](https://mp.weixin.qq.com/s/pZDXcrJ1XpJkA-T7aAD4xQ)
  - Python 的实操
- [MCP 开发入门：从基础概念到 Server/Client 实战](https://mp.weixin.qq.com/s/4MIag5S0xsF5mB4V0k1UAQ)
  - Python 的 Server 和 Client 的代码实操
- [Node.js 中构建可用的 MCP 服务器：从入门到实战](https://mp.weixin.qq.com/s/ohHHXl4VNIkbPpFPAnqQhQ)
  - 包含完整的 NodeJS 代码实操
- [MCP 开发实战-如何使用 MCP 真正加速 UE 项目开发](https://mp.weixin.qq.com/s/0o3rb1fl2XXBIDZHAbiRoA)
  - TypeScript 代码实操，C++ 代码编辑器和 UE 插件的原理分析
- [使用 MCP 绝对不容忽视的一个问题！安全问题](https://mp.weixin.qq.com/s/HlORuqa1wI-VFTRzQci9CA)
  - MCP 存在的安全问题
- [MCP 在蚂蚁前端的落地之旅-](https://mp.weixin.qq.com/s/CdCvCzfycme6rw4OKa_1aA)
  - 有关于安全、鉴权，多进程、分布式、Serverless 的介绍
