# RAG 相关

- [基于 LangChain ReAct Agents 构建 RAG 问答系统](https://mp.weixin.qq.com/s/vle1WbeJOkavSq943LAyIw)
- [如何为大语言模型准备嵌入向量](https://mp.weixin.qq.com/s/5OCCp92xV4YZtuIjppKz9w)
- [从“数据拼凑”到“精准断案”：深度剖析 RAG 系统中信息完整性的关键作用](https://mp.weixin.qq.com/s/bfZpRITpbLoD_C3yGXQObA)
- [迈向通用人工智能 AGI：从 RAG 到 DeepSearch，智能体百花齐放](https://mp.weixin.qq.com/s/sSvgkiOQrf-Yzw7M_g7EBA)

## 概念

RAG （Retrieval-Augmented Generation）是检索增强生成，将外部知识库中的信息与大模型结合，生成更加准确、可靠的回答。

### 微调和 RAG 的区别

#### 传统模型微调

这是一种计算密集型的工作流，需要一个精心准备的指令数据集。其核心是将新的训练数据融入模型，改变其内部权重和参数，从而使模型习得特定领域的知识和响应风格。

#### 检索增强生成（RAG）

这是一种更具战略性和实用性的方法，它不会改变模型的原始权重。当用户发起查询时，RAG 系统首先从外部知识库（即用户上传的文档）中检索出最相关的文本片段，然后将这些片段作为上下文与用户的原始问题一起传递给 LLM。LLM 基于这些提供的上下文生成答案，而不是仅仅依赖其预训练的知识 。这种方法能够有效降低模型“幻觉”的风险，并确保答案的准确性和时效性 。

## RAG 的流程

1. 文档上传和解析：系统从用户上传的各种格式（如 PDF、Word、PPT、Markdown、纯文本等）的文档中提取出原始文本内容。
2. 文本分割和切块：原始文本通常很长，需要被分割成较小的、可管理的文本块（或称“块”）。这可以确保每个文本块都能完整地被 LLM 的上下文窗口处理。
3. 向量嵌入创建：一个专门的嵌入模型（如 SentenceTransformerEmbeddings）被用来将每个文本块转换为一个高维度的数值向量。这些向量编码了文本块的语义信息。
4. 向量数据库存储：转换后的向量被存储在向量数据库（如 Qdrant、Chroma、Weaviate、Milvus）中。这个数据库经过优化，能够高效地根据语义相似性检索向量。
5. 检索：当用户输入查询时，系统会将其也转换为一个向量。然后，它在向量数据库中搜索与此查询向量最相似的文档块。
6. 生成答案：将检索到的文档块被作为额外上下文，与用户的原始问题一起传递给大模型，生成答案。

### 内容提取引擎

文档提取是指自动识别和提取各种文件格式中的文本和数据的过程，包括：

- PDF（基于文本和扫描的）
- 包含文本的图像
- 手写文档
- 以及更多

文档提取对于将非结构化文档内容转换为可被语言模型有效使用的结构化数据至关重要。

#### Apache Tika

Apache Tika 是一个内容分析工具包，可用于检测和提取来自一千多种不同文件类型（如 PPT、XLS、PDF）的元数据和文本内容。所有这些文件类型都可以通过单个接口进行解析，使 Tika 对搜索引擎索引、内容分析、翻译等非常有用。

#### Docling

Docling 是一个文档处理库，旨在将各种文件格式（包括 PDF、Word 文档、电子表格、HTML 和图像）转换为结构化数据，如 JSON 或 Markdown。借助内置的布局检测、表格解析和语言感知处理支持，Docling 通过统一且可扩展的接口简化了为 AI 应用（如搜索、摘要和检索增强生成）准备文档的过程。

#### Mistral OCR

Mistral OCR 是一个光学字符识别库，号称“世界上最好的 OCR 模型”，旨在从各种基于图像的文件格式（包括扫描的 PDF、图像和手写文档）中提取文本，并转换为 JSON 或纯文本等结构化数据。凭借对多语言文本识别、布局分析和手写解读的高级支持，Mistral OCR 简化了数字化和处理文档的过程，适用于搜索、摘要和数据提取等 AI 应用。

#### Datalab Marker API

Marker 专注于将 PDF 等文档高保真地转换为 Markdown 和 HTML，特别适合技术文档，因为它能很好地处理代码块和数学公式。

#### Document Intelligence

通常指代一些云服务商提供的企业级文档处理服务，例如 Azure Document Intelligence（原 Form Recognizer）。它不仅能进行 OCR，更能理解文档结构、提取关键信息（如发票上的金额、日期）、识别表格并输出结构化数据。

#### 总结

- 追求高精度、多语言 OCR ：Mistral OCR 是目前一个非常强劲的选择，特别适合学术论文和技术文档。
- 需要快速提取各种格式文档的原始文本和元数据：老牌的 Apache Tika 依然可靠。
- 追求技术文档（代码、公式）的高保真转换：可以关注 Marker。
- 处理企业级文档，需要提取结构化键值对和表格：云服务的 Document Intelligence 可能更合适。

### 文本处理框架（Chunking）

在构建知识库时，大模型要先把文档拆分成合适的片段（chunk），再存入向量数据库。

对于中文文档来说，常见的提取/切分方式有：

- 按段落切分（推荐）：中文文章一般以自然段为逻辑单位（换行符），保留段落层级比按固定长度切分更好理解。
- 按句子切分：可以用中文分句器（比如 jieba 的 sent_tokenize）来切分句子，适合问答类内容。
- 滑动窗口切分：固定 token 长度，中文建议 500-800 汉字（约 500-1000 tokens），并设置 10%-20% （约 100-200 tokens）的重叠，保证上下文连续性。适合长 PDF、技术手册。
- 混合策略：段落为主，必要时对超长段落再做窗口切分。

对于中文，推荐：

- 使用 **语义感知的分块（段落+标题）**，保留上下文。
- 再配合 **窗口切分**，避免长文丢信息。

工具上，常用的是：

- LangChain 的 RecursiveCharacterTextSplitter（支持中文）
- LlamaIndex（提供多种切分模式）
- Open WebUI 内置 RAG 方案也允许自定义 chunk size、overlap。

#### LangChain 的 `RecursiveCharacterTextSplitter`

这是 LangChain 框架中一个非常常用且强大的文本分割器。它的设计目标是通用且灵活，能够处理各种类型的文档和语言（包括中文）。

##### 核心工作原理

1. 递归切割：它定义了一个分隔符优先级列表（例如：["\n\n", "\n", "。", "！", "？", "...", " ", ""]）。
2. 优先级尝试：它首先尝试用最高优先级的 separator（如 "\n\n"）将文本分割成较大的块。
3. 逐级细化：如果某个块仍然大于设定的 chunk_size，它会用下一个优先级的分隔符（如 "\n"）继续分割这个块。
4. 循环此过程，直到所有文本块都小于目标大小。

##### 特点：

- 优点：非常灵活，通过调整 separators 列表可以很好地适配中文和其他语言的文本结构。
- 缺点：可能不会 100% 保留原始文档的复杂层次结构（如节、小节）。

#### LlamaIndex 的多种切分模式

LlamaIndex 是一个专门为构建 RAG 应用而设计的高性能框架。它提供了比 LangChain 更丰富、更语义化的节点（Node，即文本块）构建方式。

##### 核心工作模式

LlamaIndex 不仅仅是一个简单的“分割器”，它提供了多种构建节点的策略：

- SimpleNodeParser：类似于 LangChain 的 RecursiveCharacterTextSplitter，基于大小和重叠进行简单分块。
- 语义分割器（SemanticSplitterNodeParser）：高级功能。它使用嵌入模型（Embedding Model）来计算句子的语义相似度，尝试在语义边界（如主题转换处）进行分割，而不仅仅是字符边界。这能产生质量更高的块。
- 基于标题的分割器（HierarchicalNodeParser）：高级功能。它会解析文档的标题结构（如 H1, H2, H3），并根据这个层次结构来创建节点。这对于技术手册、论文等结构清晰的文档非常有效。
- 句子窗口分割器（SentenceWindowNodeParser）：将每个句子作为一个独立的节点，但在检索时返回句子周围的上下文窗口。适用于需要极高精度的任务。

##### 特点：

- 优点：提供了研究级的、更智能的分块策略，能产生更高质量的检索结果。
- 缺点：概念更复杂（Document, Node, Index 等），学习曲线稍陡。

### 中文嵌入模型（Embedding Model）

向量化效果直接决定检索质量。中文用英文模型往往效果差，所以要选中文优化过的 embedding。

几种主流选择：

- OpenAI

  - text-embedding-3-large / text-embedding-3-small 多语言支持不错，但中文精度不如专门的中文模型。

- 国内/开源中文模型
  - BAAI/bge-large-zh（北京智源，中文表现非常好，业界常用，支持 HuggingFace）
  - BAAI/bge-m3（多语言，但对中文也很优秀，还支持稠密+稀疏检索混合）
  - moka-ai/m3e-base（专门针对中文优化）
  - GanymedeNil/text2vec-large-chinese（老牌中文向量模型）

推荐排序（2025）：

- BGE-m3 （中文+多语言都好，用途广）
- BGE-large-zh （专注中文最佳）
- OpenAI text-embedding-3-large （如果你用 OpenAI 模型为主，配合最好）

### 向量数据库（Vector Database）

Chroma、Weaviate、Milvus、Qdrant

## 实践

### Open WebUI

Open WebUI 本身支持知识库（RAG），使用步骤大致如下：

#### 安装 Open WebUI

一般是 docker run 或直接 Python 启动。

#### 选择向量数据库

Open WebUI 支持 Chroma、Weaviate、Milvus、Qdrant 等。

小规模 → Chroma 足够；大规模 → Qdrant/Milvus。

#### 设置内容提取参数

在 WebUI 的 Knowledge Base 页面上传 PDF/MD/Doc。

Open WebUI 支持多种文档提取引擎，以适应不同的需求和文档类型。每种提取方法都有其自身的优势，适用于不同的场景。

Open WebUI 也支持多种文本分割器（chunk splitter），包括：

- 字符：按 **固定的字符长度** 来切分文本，例如每 500 个字符一块，不管语义、句子完整性。
- Token（tiktoken）：使用 OpenAI 的 **tiktoken** 分词器（或兼容的 tokenizer）来切分，按 token 数量 控制 chunk 大小。（一个 token 大概对应英文 0.75 个词，中文 1-2 个汉字或标点符号）
- Markdown（标题）：按 **Markdown 标题层级（#、##、### ...）** 来切分，把标题下的内容作为一个整体 chunk。

Open WebUI 也支持滑动窗口，调整 chunk size（推荐 500–1000 tokens，overlap 100–200）。

中文文件推荐 “段落切分 + 滑动窗口”。

#### 配置 Embedding 模型

在 open-webui/config.json 或管理界面里，可以指定 Embedding 服务：

- 如果用 OpenAI：填上 API Key，选 text-embedding-3-large。
- 如果用 Ollama，可以用 Ollama 获取 bge-m3 模型，然后填入 Ollama 的地址和模型名称。
- 如果没有外网，可以使用 huggingface 下载本地模型，然后导入到 Open WebUI 中。

在 Open WebUI 里把 embedding endpoint 指向这个服务。

#### 问答调用

当你提问时，Open WebUI 会：

- 把问题做 embedding
- 去向量库检索相关片段

把结果拼接进 prompt，交给大模型回答。
