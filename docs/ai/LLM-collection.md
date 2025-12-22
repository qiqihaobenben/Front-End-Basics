# 大型语言模型概览和相关汇总

## 模型

- [V3→R1→V3.2 ｜一文看懂 DeepSeek 技术演进](https://mp.weixin.qq.com/s/ej_Oadgo77E9wXN6RqHelg)
  - 大模型训练的两个阶段：
    - 预训练，产出 base model；
    - 后训练，通常包含 SFT（监督微调，用人工标注数据训练）和 RL（强化学习，用奖励信号优化）
  - 简述了 推理模型 VS 普通模型，专用模型 VS 混合模型
  - DeepSeek 的路径：
    - V3：base model，架构 MoE + MLA，采用的是标准流程：预训练 → SFT → RL
    - R1：专用推理模型（在 V3 基础上 post-training，架构 RLVR + GRPO），R1 和 V3 架构完全一样，区别在训练方法，R1 用的是 RLVR（Reinforcement Learning with Verifiable Rewards，可验证奖励的强化学习）
    - V3.1：混合模型，V3.1 基于 DeepSeek V3.1-Base，后者在 V3 基础上额外训练了 840B tokens
    - R1-0528：专用推理模型，是 R1 的小版本升级，架构和 V3/R1 完全一样，改进来自 post-training pipeline 的优化，性能追上了当时的 OpenAI o3 和 Gemini 2.5 Pro。
    - V3.2-Exp：混合模型，DeepSeek Sparse Attention，DeepSeek 稀疏注意力，不用固定窗口，让模型学习应该关注哪些 token，复杂度从 O(L²) 降到 O(L×k)。
    - DeepSeekMath V2：数学专用模型，基于 V3.2-Exp-Base，它验证了两个关键技术：Self-Verification（自验证）和 Self-Refinement（自改进）
    - V3.2：混合模型，架构和 V3.2-Exp 完全一样：MoE + MLA + DSA，训练方式 RLVR + LLM-as-a-judge 混合，GRPO 做了稳定性改进。
  - 简述了 MoE 和 MLA
    - MoE 是 Mixture of Experts（专家混合），让模型参数大但计算量小
    - MLA 是 Multi-Head Latent Attention （多头潜在注意力），通过压缩 KV Cache 省显存

## 实用

- [2025 岁末 AI 模型选型指南](https://mp.weixin.qq.com/s/GJnGofgy1tpDpFjBHItpFw)
  - 主要探讨了在 2025 年末为 AI 应用选择大语言模型时的关键考量和实用建议
  - 核心观点：模型选型对 AI 应用至关重要，直接影响效果和成本。没有“最好”的模型，只有最“适合”特定业务场景的模型。
  - 成本考量：
    - 价格差异敏感：即使单价微小（如每百万 token 差 0.05 美元），也可能带来显著的成本比例变化（如 25%）。
    - 模型梯队：主流厂商通常提供“小中大杯”模型，大杯：适合直接面向用户、要求高的场景（如 Chatbot、AI Agent），中小杯：适合离线任务、工作流处理，性价比更高。
    - 输入/输出价格比：不同模型的输入和输出价格倍数不同（OpenAI/Google 约 8 倍，Anthropic 5 倍，Kimi 3 倍，X.ai 2.5 倍）。需根据任务的输入输出 token 比例选择有优势的模型。
    - 缓存命中率：利用好缓存（价格通常为 1 折）能极大降低成本，需建立内部监控和优化机制。
    - Thinking Token：对于支持“思考”模型的厂商（如 OpenAI GPT-5），需注意思考 Token 按输出计费。若提示词已包含思考链，选用 Non-Thinking 模型可能更省钱。
  - 性能与限制：吞吐量 和 Rate Limit（速率限制）
  - 策略与最佳实践：
    - 紧跟厂商升级：新版模型通常更便宜、能力更强（如 GPT-4.1 比 GPT-4o 便宜且性能可能更优），应及时跟进。
    - 定期评估：结合业务场景（任务类型、输入输出比、推理需求）定期审视模型选择。
    - 参考工具批判性使用：像 OpenRouter 这样的排行榜可参考趋势，但需注意其数据可能受免费额度、特定用户群体（如编程类应用主导）影响，与真实企业级用量有差距。
