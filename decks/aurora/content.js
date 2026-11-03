/**
 * ============================================================================
 * AURORA PRESENTATION FRAMEWORK — DECLARATIVE SLIDE CONTENT DATA
 * ============================================================================
 * File: decks/aurora/content.js
 * Global Export: window.AuroraContent
 *
 * DESIGN PRINCIPLES:
 * 1. Content-View Separation: Contains ONLY structured text, TeX expressions,
 *    and `visualKey` references into `window.AuroraVisuals`.
 * 2. Multi-Line Formula Splitting: Whenever a step has multiple equations or a
 *    long composite equation, `chainLatex` is an array of formula lines so each
 *    sub-formula is rendered on its own line at a uniform TeX font size.
 * ============================================================================
 */

window.AuroraContent = {
  deckMeta: {
    documentTitle: 'AURORA — 通用生成式多模态时间序列预测框架 (16:9 Presentation)',
    homeSlide: 1, // 从 0 开始计数
    homeButtonLabel: '⊞ 多路总览 (P2)',
    homeButtonTitle: '返回第 2 页多路总览图 (快捷键: M)',
    tocSubtitle: '点击任意章节直达对应精讲页面 · 按 M 键随时返回第 2 页多路总架构',
    title: 'AURORA',
    subtitle: '通用生成式多模态时间序列预测框架 (ICLR 2026)',
    defaultAnimSpeed: 'normal'
  },

  slides: [
    /* ========================================================================
     * SLIDE 01: PROBLEM & CONTRIBUTION CONTRAST
     * ======================================================================== */
    {
      id: 'slide-01',
      slideNumber: 1,
      navTitle: '背景与贡献',
      layout: 'contrast-slide',
      title: '多模态生成式时间序列预测：背景与核心贡献',
      subtitle: '剖析传统单模态确定性时间序列预测面临的固有局限，阐述本文在多模态表征提取、跨模态引导对齐与概率生成范式上的核心突破。',

      connectors: ['⬇ 频域周期折叠 + 三路协同编码', '⬇ 质心自适应蒸馏 + 双路相关性引导', '⬇ 先验基波原型检索 + 直线流匹配生成'],

      challengesSection: {
        headerTag: '现有单模态确定性预测的局限',
        cards: [
          {
            code: '局限 01',
            title: '一维单模态视角受限，缺失跨周期与文本语境',
            visualKey: 'contrast.blindness',
            points: [
              '仅将历史观测视为扁平一维波形，多重潜伏周期混叠导致跨周期同相位关联难以显式对齐。',
              '极端气象、节假日与宏观事件等关键外部驱动力存在于文本中，纯数值模型无法感知此类语境。'
            ]
          },
          {
            code: '局限 02',
            title: '预训练特征高度冗余，直接拼接干扰时序主干',
            visualKey: 'contrast.redundancy',
            points: [
              '冻结的预训练视觉（ViT）与语言（BERT）模型输出数百个词元，包含大量无关语法与背景噪声。',
              '异构模态特征空间与一维时间序列存在显著分布差异，简单拼接易导致跨模态注意力权重发散。'
            ]
          },
          {
            code: '局限 03',
            title: '点预测抹平多峰分布，纯噪声生成路径易发散',
            visualKey: 'contrast.noiseStart',
            points: [
              '传统均方误差（MSE）确定性回归仅能输出条件期望均值，无法刻画未来演化的多峰概率分布。',
              '常规生成式模型从纯高斯白噪声 $\\mathcal{N}(0, I)$ 出发，缺乏物理波形先验锚定，传输轨迹弯曲漫长。'
            ]
          }
        ]
      },

      contributionsSection: {
        headerTag: 'Aurora 多模态生成式预测的核心贡献',
        cards: [
          {
            code: '核心贡献 01',
            title: '内生一维与二维双视角及外生文本三路协同编码',
            visualKey: 'contrast.auroraFoundation',
            jumpToSlide: 1,
            points: [
              '无需外部配图：利用快速傅里叶变换自动识别主导周期 $P$，将一维序列折叠为二维周期图像。',
              '构建外生领域文本、一维局部时序与二维内生周期图像三路并行编码架构，全面捕获多源先验。'
            ]
          },
          {
            code: '核心贡献 02',
            title: '模态质心自适应蒸馏与双路引导多头自注意力',
            visualKey: 'contrast.distillGuide',
            jumpToSlide: 4,
            points: [
              '设计可学习质心蒸馏器（Distiller），将冗长视觉与文本特征提纯为 $K$ 个紧凑的核心领域质心。',
              '通过双路引导器生成跨模态相关性矩阵 $\\mathrm{Corr}$，动态调制一维时序主干的多头自注意力权重。'
            ]
          },
          {
            code: '核心贡献 03',
            title: '多尺度先验原型检索与原型引导直线流匹配生成',
            visualKey: 'contrast.pgfmStraight',
            jumpToSlide: 6,
            points: [
              '以精炼多模态特征检索可学习原型库，合成兼具周期与趋势形态的先验波形 $\\tilde{\\mathcal{P}}$ 作为生成起点。',
              '在未来条件 $X^{\\text{cond}}$ 制导下预测最优传输直线速度场 $v_\\theta$，经少量几步欧拉积分生成预测分布 $\\hat{Y}$。'
            ]
          }
        ]
      }
    },

    /* ========================================================================
     * SLIDE 02: OVERALL MULTI-STREAM ARCHITECTURE
     * ======================================================================== */
    {
      id: 'slide-02',
      slideNumber: 2,
      navTitle: '多路总架构',
      layout: 'architecture-slide',
      title: 'Aurora 算法整体多路架构',
      subtitle: '编码器并行处理外生文本、一维历史序列与内生二维周期图像并融合为统一表征；解码器结合多尺度先验原型检索与未来条件解码，通过流匹配生成预测分布。',

      encoderBand: {
        bandTag: 'Aurora Encoder · 三路并行编码与跨模态双路引导融合',
        visualKey: 'arch.encoderMultiStream'
      },

      decoderBand: {
        bandTag: 'Aurora Decoder · 先验原型检索、未来条件解码与流匹配生成',
        visualKey: 'arch.decoderMultiStream'
      }
    },

    /* ========================================================================
     * SLIDE 03: 1D TIME SERIES PROCESSING (5 STEPS)
     * ======================================================================== */
    {
      id: 'slide-03',
      slideNumber: 3,
      navTitle: '1D 时序支路',
      layout: 'pipeline-slide',
      title: '一维时间序列分块与动态重采样嵌入',
      subtitle: '通过可逆实例归一化消除多变量量纲差异，利用首部左补零分块与嵌入核线性插值重采样，将任意采样周期的一维序列映射为局部时序特征。',
      cols: 5,

      steps: [
        {
          stepCode: '步骤 01',
          title: '可逆实例归一化',
          theme: 'teal',
          visualKey: 'stream1d.revin',
          caption: '逐通道减去历史均值 $\\mu$ 并除以标准差 $\\sigma$，消除非平稳偏移与物理量纲差异；统计量缓存用于预测末端逆还原。',
          chainOp: '零均值单位方差标准化',
          chainLatex: [
            '\\mu = \\mathrm{Mean}(x_{1:T}),\\; \\sigma = \\mathrm{Std}(x_{1:T})',
            '\\tilde{x}_t = (x_t - \\mu) / (\\sigma + \\epsilon)'
          ],
          chainDim: '\\mathbb{R}^{T} \\to \\mathbb{R}^{T}'
        },
        {
          stepCode: '步骤 02',
          title: '序列首部左补零对齐',
          theme: 'blue',
          visualKey: 'stream1d.leftPad',
          caption: '当序列长度 $T$ 无法被分块长度 $P$ 整除时，在序列最左侧填充 $r$ 个零值，保证最新历史时刻完整落在末尾分块中。',
          chainOp: '首部余数补零扩展',
          chainLatex: [
            'r = (P - (T \\bmod P)) \\bmod P',
            '\\tilde{x}_{\\text{pad}} = [\\mathbf{0}_{r},\\; \\tilde{x}_{1:T}]'
          ],
          chainDim: '\\mathbb{R}^{T} \\to \\mathbb{R}^{N P}'
        },
        {
          stepCode: '步骤 03',
          title: '非重叠等长窗口分块',
          theme: 'blue',
          visualKey: 'stream1d.patching',
          caption: '将补齐后的序列按固定块长 $P$ 切分为 $N$ 个连续局部时间块，每一行代表一个局部时间窗口内的短时波形形态。',
          chainOp: '一维序列重塑为块矩阵',
          chainLatex: [
            'N = (T + r) / P',
            'X_{p} = \\mathrm{Reshape}(\\tilde{x}_{\\text{pad}},\\; N,\\; P)'
          ],
          chainDim: '\\mathbb{R}^{N P} \\to \\mathbb{R}^{N \\times P}'
        },
        {
          stepCode: '步骤 04',
          title: '嵌入权重线性插值',
          theme: 'indigo',
          visualKey: 'stream1d.resample',
          caption: '沿块长维度对预训练嵌入矩阵 $W_0$ 执行线性插值重采样，使模型无需重新训练即可适配不同采样率与窗口长度 $P$。',
          chainOp: '嵌入核动态线性插值',
          chainLatex: [
            '\\alpha(p) = (p / P) \\cdot P_0',
            'W_{\\text{time}} = \\mathrm{Interp}_{1\\text{D}}(W_0,\\; P_0 \\to P)'
          ],
          chainDim: '\\mathbb{R}^{P_0 \\times D} \\to \\mathbb{R}^{P \\times D}'
        },
        {
          stepCode: '步骤 05',
          title: '线性映射生成时序特征',
          theme: 'purple',
          visualKey: 'stream1d.embedding',
          caption: '将切分好的时序块矩阵 $X_p$ 与重采样后的嵌入权重 $W_{\\text{time}}$ 相乘，投影至 $D$ 维隐空间生成初始时序特征 $X^{\\text{time}}$。',
          chainOp: '矩阵乘法特征投影',
          chainLatex: [
            'X_{p} \\in \\mathbb{R}^{N \\times P},\\; W_{\\text{time}} \\in \\mathbb{R}^{P \\times D}',
            'X^{\\text{time}} = X_{p}\\, W_{\\text{time}}'
          ],
          chainDim: '\\mathbb{R}^{N \\times P} \\to \\mathbb{R}^{N \\times D}'
        }
      ]
    },

    /* ========================================================================
     * SLIDE 04: 2D ENDOGENOUS PERIOD IMAGE (7 STEPS)
     * ======================================================================== */
    {
      id: 'slide-04',
      slideNumber: 4,
      navTitle: '2D 周期图像',
      layout: 'pipeline-slide',
      title: '二维内生周期图像构建与视觉编码',
      subtitle: '利用快速傅里叶变换自动识别序列主导周期并按周期折叠为二维矩阵，经双线性插值与三通道扩展后输入预训练视觉编码器提取跨周期纹理特征。',
      cols: 7,

      steps: [
        {
          stepCode: '步骤 01',
          title: '频域提取主导周期',
          theme: 'purple',
          visualKey: 'stream2d.dft',
          caption: '去除直流分量后经 FFT 提取幅值最大的非零主频 $f^*$，取整得到主导周期长度 $P$。',
          chainOp: '频谱峰值识周期',
          chainLatex: [
            'f^* = \\arg\\max |\\mathrm{FFT}(\\tilde{x})|',
            'P = \\lfloor T / f^* \\rfloor'
          ],
          chainDim: '\\mathbb{R}^{T} \\to P \\in \\mathbb{Z}^{+}'
        },
        {
          stepCode: '步骤 02',
          title: '二维周期矩阵折叠',
          theme: 'purple',
          visualKey: 'stream2d.periodFold',
          caption: '左补零后按周期长度 $P$ 逐行折回为 $K_p$ 行矩阵，使不同周期的同相位点在纵轴对齐。',
          chainOp: '按周期换行重排',
          chainLatex: [
            'K_p = \\lceil T / P \\rceil',
            'G = \\mathrm{Fold}_{2\\text{D}}(\\tilde{x}_{\\text{pad}}, K_p, P)'
          ],
          chainDim: '\\mathbb{R}^{K_p P} \\to \\mathbb{R}^{K_p \\times P}'
        },
        {
          stepCode: '步骤 03',
          title: '双线性插值放缩',
          theme: 'indigo',
          visualKey: 'stream2d.resize',
          caption: '通过二维双线性插值将任意尺寸的周期网格 $G$ 统一缩放为 $H \\times W$ 标准正方形网格。',
          chainOp: '二维双线性插值',
          chainLatex: [
            'G \\in \\mathbb{R}^{K_p \\times P}',
            'I_1 = \\mathrm{Resize}(G, H, W)'
          ],
          chainDim: '\\mathbb{R}^{K_p \\times P} \\to \\mathbb{R}^{H \\times W}'
        },
        {
          stepCode: '步骤 04',
          title: '三通道复制扩展',
          theme: 'blue',
          visualKey: 'stream2d.repeat',
          caption: '将单通道周期灰度矩阵 $I_1$ 沿通道维复制 $3$ 份，构造三通道图像 $I_3$ 以对接预训练视觉模型。',
          chainOp: '通道维复制叠加',
          chainLatex: [
            'I_1 \\in \\mathbb{R}^{H \\times W \\times 1}',
            'I_3 = \\mathrm{Repeat}(I_1,\\; 3)'
          ],
          chainDim: '\\mathbb{R}^{H \\times W} \\to \\mathbb{R}^{H \\times W \\times 3}'
        },
        {
          stepCode: '步骤 05',
          title: '二维网格切块展平',
          theme: 'rose',
          visualKey: 'stream2d.patchFlatten',
          caption: '按 $S \\times S$ 像素网格切分为 $N_v$ 个局部图像块，并将每个二维块展平为特征向量。',
          chainOp: '网格分块与展平',
          chainLatex: [
            'N_v = (H / S) \\cdot (W / S)',
            'U_v = \\mathrm{Patch}(I_3,\\; S^2)'
          ],
          chainDim: '\\mathbb{R}^{H \\times W \\times 3} \\to \\mathbb{R}^{N_v \\times 3S^2}'
        },
        {
          stepCode: '步骤 06',
          title: '线性投影与位置编码',
          theme: 'amber',
          visualKey: 'stream2d.posEmbed',
          caption: '通过线性层映射至 $D$ 维并叠加二维可学习空间位置编码 $E_{\\text{pos}}^{2\\text{D}}$，保留相位坐标感知。',
          chainOp: '投影与空间坐标注入',
          chainLatex: [
            'U_v W_v \\in \\mathbb{R}^{N_v \\times D}',
            'Z_v^{(0)} = U_v W_v + E_{\\text{pos}}^{2\\text{D}}'
          ],
          chainDim: '\\mathbb{R}^{N_v \\times 3S^2} \\to \\mathbb{R}^{N_v \\times D}'
        },
        {
          stepCode: '步骤 07',
          title: '冻结 ViT 视觉编码',
          theme: 'purple',
          visualKey: 'stream2d.vitEncode',
          caption: '输入冻结参数的预训练 Vision Transformer，提取全局跨周期演进纹理特征 $H^{\\text{vis}}$。',
          chainOp: '预训练视觉主干编码',
          chainLatex: [
            'Z_v^{(0)} \\in \\mathbb{R}^{N_v \\times D}',
            'H^{\\text{vis}} = \\mathrm{ViT}(Z_v^{(0)})'
          ],
          chainDim: '\\mathbb{R}^{N_v \\times D} \\to \\mathbb{R}^{N_v \\times D}'
        }
      ]
    },

    /* ========================================================================
     * SLIDE 05: MODALITY ADAPTIVE DISTILLATION (4 STEPS)
     * ======================================================================== */
    {
      id: 'slide-05',
      slideNumber: 5,
      navTitle: '模态特征蒸馏',
      layout: 'pipeline-slide',
      title: '多模态特征提取与质心自适应蒸馏',
      subtitle: '基于冻结的预训练语言与视觉模型提取初始语义和周期特征，通过可学习质心交叉注意力过滤冗余背景噪声，浓缩固定数量的领域核心特征。',
      cols: 4,

      steps: [
        {
          stepCode: '步骤 01',
          title: '领域文本分词与位置嵌入',
          theme: 'emerald',
          visualKey: 'distill.textTokenize',
          caption: '将传感器物理属性、节假日或气象事件描述切分为 $N_t$ 个子词词元，映射为词向量并叠加序列位置编码 $E_{\\text{pos}}^{\\text{text}}$。',
          chainOp: '子词切分与词向量嵌入',
          chainLatex: [
            'U_t = \\mathrm{Tokenizer}(\\text{Text})',
            'Z_t^{(0)} = U_t W_e + E_{\\text{pos}}^{\\text{text}}'
          ],
          chainDim: '\\text{Text} \\to \\mathbb{R}^{N_t \\times D}'
        },
        {
          stepCode: '步骤 02',
          title: '双路冻结预训练主干编码',
          theme: 'teal',
          visualKey: 'distill.pretrainedEncode',
          caption: '上路通过冻结的 BERT 提取上下文语义特征 $H^{\\text{text}}$，下路通过冻结的 ViT 提取二维周期纹理特征 $H^{\\text{vis}}$。',
          chainOp: '冻结预训练主干前向提取',
          chainLatex: [
            'H^{\\text{text}} = \\mathrm{BERT}(Z_t^{(0)})',
            'H^{\\text{vis}} = \\mathrm{ViT}(Z_v^{(0)})'
          ],
          chainDim: '\\mathbb{R}^{N_t \\times D},\\; \\mathbb{R}^{N_v \\times D}'
        },
        {
          stepCode: '步骤 03',
          title: '可学习质心交叉注意力聚合',
          theme: 'indigo',
          visualKey: 'distill.centroids',
          caption: '引入 $K$ 个可学习质心向量 $C_0$ 作为 Query，以原始长序列 $H$ 作为 Key 与 Value 计算交叉注意力，自动吸附关键趋势与周期特征。',
          chainOp: '质心查询交叉注意力打分',
          chainLatex: [
            'Q_c = C_0 W_Q,\\quad K_m = H^m W_K',
            'A_{\\text{dist}}^m = \\mathrm{Softmax}(Q_c K_m^\\top / \\sqrt{d_k})'
          ],
          chainDim: '\\mathbb{R}^{K \\times N_{\\text{raw}}} \\; (K \\ll N_{\\text{raw}})'
        },
        {
          stepCode: '步骤 04',
          title: '漏斗提纯输出紧凑先验质心',
          theme: 'purple',
          visualKey: 'distill.funnel',
          caption: '经残差连接与前馈网络输出高度浓缩的 $K$ 个文本质心 $\\tilde{X}^{\\text{text}}$ 与 $K$ 个视觉质心 $\\tilde{X}^{\\text{image}}$，大幅降低后续跨模态交互开销。',
          chainOp: '瓶颈压缩输出精炼先验',
          chainLatex: [
            '\\tilde{X}^{\\text{text}} = \\mathrm{Distill}(C_0,\\; H^{\\text{text}})',
            '\\tilde{X}^{\\text{image}} = \\mathrm{Distill}(C_0,\\; H^{\\text{vis}})'
          ],
          chainDim: '\\mathbb{R}^{N_{\\text{raw}} \\times D} \\to \\mathbb{R}^{K \\times D}'
        }
      ]
    },

    /* ========================================================================
     * SLIDE 06: GUIDERS + MG-MSA + MODALITY FUSER (4 STEPS)
     * ======================================================================== */
    {
      id: 'slide-06',
      slideNumber: 6,
      navTitle: '双路引导融合',
      layout: 'pipeline-slide',
      title: '双路引导多头自注意力与跨模态融合',
      subtitle: '利用文本与视觉引导器计算跨模态双线性相关性矩阵以调制一维时序自注意力权重，并通过跨模态交叉注意力与残差连接输出三路融合表征。',
      cols: 4,

      steps: [
        {
          stepCode: '步骤 01',
          title: '双路引导器跨模态关联打分',
          theme: 'amber',
          visualKey: 'align.guiders',
          caption: 'TextGuider 与 VisionGuider 分别通过可学习双线性映射矩阵 $W_{\\text{text}}$、$W_{\\text{vis}}$ 计算每个一维时序块与文本、视觉质心的关联响应。',
          chainOp: '双线性跨模态关联度计算',
          chainLatex: [
            'S_{\\text{text}} = \\sigma\\big(X^{\\text{time}} W_{\\text{text}} (\\tilde{X}^{\\text{text}})^\\top\\big)',
            'S_{\\text{vis}} = \\sigma\\big(X^{\\text{time}} W_{\\text{vis}} (\\tilde{X}^{\\text{image}})^\\top\\big)'
          ],
          chainDim: '\\mathbb{R}^{N \\times D} \\to \\mathbb{R}^{N \\times K}'
        },
        {
          stepCode: '步骤 02',
          title: '合成时间块相关性引导矩阵',
          theme: 'indigo',
          visualKey: 'align.bilinear',
          caption: '若两个时间块对同一文本事件或同一周期相位质心均有高响应，则在相关性矩阵 $\\mathrm{Corr}$ 中赋予高权重，显式建立跨时间步先验连接。',
          chainOp: '双路相关性矩阵加权合成',
          chainLatex: [
            'C_m = \\mathrm{Softmax}(S_m S_m^\\top)',
            '\\mathrm{Corr} = \\alpha\\, C_{\\text{text}} + (1 - \\alpha)\\, C_{\\text{vis}}'
          ],
          chainDim: '\\mathbb{R}^{N \\times K} \\to \\mathbb{R}^{N \\times N}'
        },
        {
          stepCode: '步骤 03',
          title: '相关性调制多头自注意力',
          theme: 'blue',
          visualKey: 'align.mgmsa',
          caption: '将多模态相关矩阵 $\\mathrm{Corr}$ 与中路标准点积注意力分数逐元素哈达玛积（$\\odot$）调制，经 $K$ 层堆叠演化输出引导后时序特征 $\\tilde{X}^{\\text{time}}$。',
          chainOp: '相关性调制多头自注意力',
          chainLatex: [
            'A_{\\text{MG}} = \\mathrm{Softmax}\\big((Q K^\\top / \\sqrt{d_k}) \\odot \\mathrm{Corr}\\big)',
            '\\tilde{X}^{\\text{time}} = \\mathrm{FFN}\\big(\\mathrm{LN}(X^{\\text{time}} + A_{\\text{MG}} V)\\big)'
          ],
          chainDim: '\\mathbb{R}^{N \\times D} \\to \\mathbb{R}^{N \\times D}'
        },
        {
          stepCode: '步骤 04',
          title: '三路跨模态交叉注意力汇聚',
          theme: 'teal',
          visualKey: 'align.fuser',
          caption: '在 Modality Fuser 中以 $\\tilde{X}^{\\text{time}}$ 为 Query，分别与文本质心 $\\tilde{X}^{\\text{text}}$、视觉质心 $\\tilde{X}^{\\text{image}}$ 执行交叉注意力对齐并残差相加，输出 $X^{\\text{fuse}}$。',
          chainOp: '三路交叉注意力残差融合',
          chainLatex: [
            'F_{\\text{mm}} = \\mathrm{MCA}(\\tilde{X}^{\\text{time}}, \\tilde{X}^{\\text{text}}) + \\mathrm{MCA}(\\tilde{X}^{\\text{time}}, \\tilde{X}^{\\text{image}})',
            'X^{\\text{fuse}} = \\mathrm{LN}(\\tilde{X}^{\\text{time}} + F_{\\text{mm}})'
          ],
          chainDim: '\\mathbb{R}^{N \\times D} \\to \\mathbb{R}^{N \\times D}'
        }
      ]
    },

    /* ========================================================================
     * SLIDE 07: DECODER DUAL STREAM & FLOW MATCHING GENERATION (4 STEPS)
     * ======================================================================== */
    {
      id: 'slide-07',
      slideNumber: 7,
      navTitle: '原型流匹配生成',
      layout: 'pipeline-slide',
      title: '先验原型检索、条件解码与流匹配生成',
      subtitle: '结合因果与旋转位置编码跨注意力解码未来步控制条件，同时从多尺度周期与趋势原型库中检索初始波形锚点，经条件流匹配常微分方程积分生成最终预测。',
      cols: 4,

      steps: [
        {
          stepCode: '步骤 01',
          title: '因果与旋转位置编码条件解码',
          theme: 'blue',
          visualKey: 'decoder.condition',
          caption: '将编码融合表征 $X^{\\text{fuse}}$ 送入带下三角掩码的 Causal-Transformer 与引入旋转位置编码（RoPE）的 Cross-Transformer，外推得到未来 $N_p$ 个分块的控制条件 $X^{\\text{cond}}$。',
          chainOp: '因果掩码与 RoPE 跨注意力解码',
          chainLatex: [
            'H_{\\text{causal}} = \\mathrm{CausalAttn}(X^{\\text{fuse}})',
            'X^{\\text{cond}} = \\mathrm{RoPE\\text{-}Attn}\\big(H_{\\text{causal}},\\; [\\tilde{X}^{\\text{image}}; \\tilde{X}^{\\text{text}}]\\big)'
          ],
          chainDim: '\\mathbb{R}^{N \\times D} \\to \\mathbb{R}^{N_p \\times D}'
        },
        {
          stepCode: '步骤 02',
          title: '多尺度先验原型库软检索',
          theme: 'purple',
          visualKey: 'decoder.prototype',
          caption: '以蒸馏后的视觉与文本质心构造查询向量 $Q_{\\text{mm}}$，与可学习原型库 $B_{\\text{bank}}$（涵盖正弦周期基与多项式趋势基）计算相似度，加权合成初始先验原型 $\\tilde{\\mathcal{P}}$。',
          chainOp: '多尺度周期与趋势原型检索',
          chainLatex: [
            '\\alpha_{\\text{proto}} = \\mathrm{Softmax}(Q_{\\text{mm}} B_{\\text{bank}}^\\top / \\sqrt{D})',
            '\\tilde{\\mathcal{P}} = \\alpha_{\\text{proto}}\\, B_{\\text{bank}}'
          ],
          chainDim: 'B_{\\text{bank}} \\in \\mathbb{R}^{M_b \\times D} \\to \\tilde{\\mathcal{P}} \\in \\mathbb{R}^{N_p \\times D}'
        },
        {
          stepCode: '步骤 03',
          title: '原型锚定条件流匹配速度场学习',
          theme: 'rose',
          visualKey: 'decoder.flowMatching',
          caption: '以叠加高斯微扰 $\\epsilon$ 的先验原型 $Z_0 = \\tilde{\\mathcal{P}} + \\sigma_0 \\epsilon$ 为流起点，在流时间步 $\\tau \\in [0,1]$ 上通过 AdaLN 注入条件 $X^{\\text{cond}}$，训练网络预测指向真实分布 $Z_1$ 的直线速度向量 $v_\\theta$。',
          chainOp: '最优传输直线速度场回归',
          chainLatex: [
            'Z_\\tau = (1 - \\tau)(\\tilde{\\mathcal{P}} + \\sigma_0 \\epsilon) + \\tau Z_1',
            '\\mathcal{L}_{\\text{FM}} = \\mathbb{E}\\big\\| v_\\theta(Z_\\tau, \\tau \\mid X^{\\text{cond}}) - (Z_1 - Z_0) \\big\\|_2^2'
          ],
          chainDim: 'v_\\theta \\in \\mathbb{R}^{N_p \\times D}'
        },
        {
          stepCode: '步骤 04',
          title: '前向欧拉积分与逆归一化还原',
          theme: 'emerald',
          visualKey: 'decoder.eulerOde',
          caption: '推理时从 $\\tau = 0$ 的先验起点 $Z_0$ 出发，沿预测速度场 $v_\\theta$ 执行常微分方程（ODE）欧拉数值积分到达 $\\tau = 1$，经线性投影与 RevIN 逆归一化输出最终预测分布 $\\hat{Y}$。',
          chainOp: '多步欧拉积分与物理量纲还原',
          chainLatex: [
            'Z_{\\tau+\\Delta\\tau} = Z_\\tau + \\Delta\\tau\\, v_\\theta(Z_\\tau, \\tau \\mid X^{\\text{cond}})',
            '\\hat{Y} = \\mathrm{RevIN}^{-1}(Z_1 W_{\\text{out}})'
          ],
          chainDim: '\\mathbb{R}^{N_p \\times D} \\to \\hat{Y} \\in \\mathbb{R}^{H_f}'
        }
      ]
    }
  ]
};
