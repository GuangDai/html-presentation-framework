# AGENTS.md — 学术算法可视化与 16:9 HTML-to-PPT 演示框架开发规范

本文档总结了 **Aurora (ICLR 2026) 多模态时间序列预测演示框架** 在多轮迭代、算法还原与视觉打磨过程中的全部核心工程经验与设计准则。任何后续接手本项目的 AI Agent 或开发者在修改内容、增删页面、调整图形或重构样式前，**必须首先完整阅读并严格遵循本规范**。

---

## 1. 工程架构与四层解耦原则 (Architecture & Decoupling)

本项目采用严格的**四层职责分离架构**，严禁将大段文本、数学公式、SVG 矢量图形与 DOM 渲染逻辑混写在单一文件中：

```text
aurora_html_framework/
├── index.html                        # 语义化 HTML5 容器入口（引入 KaTeX v0.16.11 与 MathJax v3.2.2）
├── AGENTS.md                         # AI Agent 与开发者全局工程规范与视觉校验指南（本文件）
├── README.md                         # 项目快速上手与目录说明
├── css/
│   ├── variables.css                 # 第一层：全局设计令牌（色板、字号、圆角、阴影变量）
│   ├── layout.css                    # 第二层：1920×1080 舞台、三种标准幻灯片布局与紧凑多行数学排版样式
│   └── animations.css                # 第三层：基于 data-anim-speed 属性的无耦合阶梯动画
├── js/
│   ├── slide-content.js              # 第四层 A（纯数据）：声明式幻灯片内容与多行 TeX 公式数组（零 SVG 代码）
│   ├── visuals-library.js            # 第四层 B（纯图形）：独立 SVG 矢量流程图注册表（window.AuroraVisuals）
│   └── presentation-engine.js        # 第四层 C（纯引擎）：DOM 组装、动态等高对齐、KaTeX/MathJax 渲染与交互
├── rendered_slides_16x9/             # 2x Retina (3840×2160) 16:9 渲染幻灯片 PNG
├── Aurora_Presentation_16x9.pdf      # 16:9 高清演示文稿 PDF
└── Aurora_Presentation_16x9.pptx     # 16:9 标准宽屏 PowerPoint 演示文稿
```

### 修改路由守则：
1. **修改标题、副标题、要点、步骤说明或数学公式**：仅编辑 `js/slide-content.js`。
2. **修改或新增抽象几何流程图 / 算法架构图**：仅编辑 `js/visuals-library.js`，并在 `js/slide-content.js` 中通过 `visualKey`（如 `'arch.encoderMultiStream'` 或 `'stream2d.periodFold'`）引用。
3. **调整字号、间距、卡片高度或网格比例**：仅编辑 `css/layout.css` 或 `css/variables.css`。
4. **调整动态等高计算、翻页快捷键或公式引擎调度**：仅编辑 `js/presentation-engine.js`。

---

## 2. 学术编辑与内容表达规范 (Editorial & Content Standards)

### 2.1 面向零前置背景听众的自包含性 (Self-Containment)
- 演示文稿的目标受众是**从未读过原论文、未看过公式推导稿、也未读过源代码**的听众。
- **严禁出现孤立的推导编号或代码变量黑话**：禁止出现诸如 `式 (3.88)`、`式 (3.198)`、`见 3.0.1 节`、`手推稿第 X 页` 或未解释的底层代码变量名。

### 2.2 标题与副标题规范 (Header Typography)
- **主标题 (`.slide-title`)**：必须**简单、直观、直击核心**，一眼让人明白本页讲解的核心模块或核心问题（如 `二维内生周期图像构建与视觉编码`），不加冗余前缀。
- **副标题 (`.slide-subtitle`)**：采用客观、中立、直观、正式的学术化语言，用 **1～2 句话**准确概括当前章节在整体算法中的作用。
- **零重复导航标识**：幻灯片右上角已配备全局导航栏（`.slide-agenda-rail`），**左上角严禁重复放置章节编号徽章（Badge）或“所属位置”胶囊**。

### 2.3 彻底杜绝“AI 标记”与元提示语 (Zero Meta-UI Clutter)
- **严禁在幻灯片画面上出现任何面向 AI 或操作者的元提示文字**：
  - 禁止出现 `点击任意卡片可直接跳转至精讲`、`点击图中模块跳转 P5`、`送入下方解码器 ⬇`、`所属位置：第 2 页上层...`、`上方剖析...下方展示...` 等提示性废话。
  - 禁止在总架构图底部堆砌冗长的图例说明条，禁止在底部数学映射链右侧堆砌冗余文字解释。
  - 禁止在正式学术架构图中使用 `❄️`、`🔥`、`📍` 等非学术表情符号。

---

## 3. 算法架构图设计准则 (Multi-Stream Topology Fidelity)

### 3.1 忠实还原多路并行与分支拓扑
- **严禁为了套用固定网格（如生硬的五列格子）而扭曲算法的真实多路数据流**。
- **Aurora Encoder（上层三路并行）**：
  - 上路：外生领域文本流（`Text -> Tokenizer -> TextEncoder (BERT) -> TextDistiller -> 蒸馏文本质心`）
  - 中路：一维时间序列主干（`Time Series -> 1D Tokenizer -> 模态引导多头自注意力 MG-MSA`）
  - 下路：由一维序列经 FFT 自动折叠派生的二维内生周期图像流（`2D Period Image -> 2D Tokenizer -> VisionEncoder (ViT) -> VisionDistiller -> 蒸馏视觉质心`）
  - 引导与汇聚：`TextGuider`（自上而下）与 `VisionGuider`（自下而上）向中路注入双线性相关性矩阵 $\mathrm{Corr}$，三路最终在右侧 `Modality Fuser` 交叉对齐并残差相加输出 $X^{\text{fuse}}$。
- **Aurora Decoder（下层双路并行 -> 流匹配生成）**：
  - 解码上路：拼接视觉与文本质心，通过 `PrototypeRetriever` 从 `Prototype Bank`（周期基 + 趋势基）检索合成先验原型起点 $\tilde{\mathcal{P}}$。
  - 解码下路：将 $X^{\text{fuse}}$ 送入 `Causal-Transformer` 与含旋转位置编码的 `Cross-Transformer (RoPE)`，解码未来各分块的引导条件 $X^{\text{cond}}$。
  - 生成终端：`Time & Noise`、先验原型 $\tilde{\mathcal{P}}$ 与引导条件 $X^{\text{cond}}$ 汇入 `Flow-Matching Net (AdaLN)` 预测最优传输速度场 $v_\theta$，经欧拉 ODE 积分与 RevIN 逆归一化生成最终预测分布 $\hat{Y}$。

### 3.2 SVG 连线防重叠与画布填充率铁律
- 所有跨模块连线（`<line>` / `<path>`）必须提前计算起止矩形的包围盒坐标，**严禁让折线穿过任何其他模块的矩形框或文字标签**。
- **高画布填充率与零文字溢出**：第一页（`contrast.*`）采用 `viewBox="0 0 520 175"` 宽幅画布，第三至七页 SVG 去除外围多余留白，确保图形饱满填充 `.contrast-visual` 与 `.pipe-visual-frame`；同时内部矩形框宽度必须预留充足余量，确保任何文本或公式绝不超出框线。

---

## 4. 数学公式多行拆分与字号绝对统一规范 (Multi-Line Math & Uniformity)

### 4.1 多公式与长公式强制换行拆分 (Multi-Line Formula Splitting)
- 在 `js/slide-content.js` 中，每个步骤的 `chainLatex` 均采用**字符串数组**（`chainLatex: ['公式第 1 行', '公式第 2 行']`）：
  - 若当前步骤包含两个或多个子公式（如均值/标准差计算与归一化、双路编码器前向、双路蒸馏输出、速度场回归与流状态插值），**必须分行列出**，每行一个公式。
  - 若单个公式较长（如交叉注意力打分、多模态融合、因果解码），**必须拆分为中间变量定义与最终映射两行**，严禁将冗长公式挤在同一行。

### 4.2 紧凑公式框、放大映射小标题与放大维度演进
- **紧凑公式框 (`.chain-tier-math`)**：采用紧凑内边距与柔和底色包裹多行公式，避免出现大面积空白白框。
- **放大数学映射小标题 (`.chain-op-label`)**：步骤操作小标题字号放大至 `15px`（7 列紧凑页 `13px`），配醒目序号徽章（`.chain-step-idx`）。
- **放大底部维度演进 (`.dim-badge`)**：去除右侧冗余文字备注，让维度变化胶囊（如 $\mathbb{R}^{N \times P} \to \mathbb{R}^{N \times D}$）在卡片底部居中铺满并放大至 `14px`（原生 TeX 1.02x 缩放）。

### 4.3 100% TeX 渲染与字号绝对一致原则
- 正文行内数学变量使用 `$...$` 包裹，SVG 图内数学符号调用 `svgTex()` 生成 `<foreignObject>` + `.latex-formula`。
- 统一使用 `\textstyle` 12pt Computer Modern 编译，**禁止对 `.offline-tex-svg` 设置固定 `height: ...em`**，确保所有公式具有完全相同的物理字号。

---

## 5. 同行卡片各区域动态等高对齐 (Dynamic Region Height Equalization)

不同步骤的说明文字（如 `.pipe-step-caption` 或 `.contrast-points`）字数可能存在差异（例如有的步骤为 2 行，有的步骤为 3 行）。若任由其自然高度展示，会导致相邻卡片的图形框底边与说明框顶边参差不齐。

### 动态等高计算机制 (`AuroraPresentationEngine.equalizeAllSlidesRegions`)：
1. 在 DOM 渲染与公式排版完成后（以及窗口缩放时），引擎遍历每一页幻灯片。
2. 对同一行内的所有同类区域组（`.pipe-card-top`、`.pipe-step-caption`、`.chain-tier-op`、`.chain-tier-math`、`.chain-tier-dim`、`.contrast-card-head`、`.contrast-points`）：
   - 先将高度重置为 `auto` 以测量自然内容高度 `offsetHeight`；
   - 计算该组的最大高度 `maxH = Math.max(...nodes.map(el => el.offsetHeight))`；
   - 将该组所有元素的高度统一设为 `${maxH}px`。
3. 自动化视觉批评家（`build_and_render.py` 第 5 项检查）强制校验同行所有区域的渲染高度差 `maxH - minH <= 2px`。
