/**
 * ============================================================================
 * AURORA PRESENTATION FRAMEWORK — DECLARATIVE SLIDE CONTENT DATA
 * ============================================================================
 * File: decks/aurora/content.js
 * Global Export: window.AuroraContent / window.PresentationContent
 *
 * UNIFIED VISUAL LOGIC & SEMANTIC DESIGN PRINCIPLES:
 * 1. Zero Walls of Text: Replaces dense prose paragraphs with structured
 *    `ioFlow` ([Input] ➔ [Operator] ➔ [Output]) strips, `specs` ([Tag] + Phrase)
 *    rows, and `diagnostics` ([Badge] + Cause ➔ Outcome) matrices.
 * 2. End-to-End Color Grammar:
 *    - `slate`: Raw sequence / frozen pretrained weights
 *    - `sky`: Normalization, exogenous text & token distillation
 *    - `indigo`: 2D endogenous periodic image stream & prototype bank
 *    - `blue`: Core 1D backbone, active attention & conditioning operators
 *    - `emerald` (Signal Teal): Converged terminal representations (X^fuse, \hat{Y})
 * 3. Macro-to-Micro Visual Guidance: Every pipeline slide includes `phases`
 *    to group individual steps into high-level conceptual stages, and marks
 *    the key innovation step with `focal: true`.
 * ============================================================================
 */

window.AuroraContent = {
  deckMeta: {
    documentTitle: 'AURORA — 通用生成式多模态时间序列预测框架 (16:9 Presentation)',
    homeSlide: 1,
    homeButtonLabel: '⊞ 多路总览 (P2)',
    homeButtonTitle: '返回第 2 页多路总览图 (快捷键: M)',
    tocSubtitle: '点击任意章节直达对应精讲页面 · 按 M 键返回总架构 · 按 S 键或双击卡片开启聚光灯聚焦',
    title: 'AURORA',
    subtitle: '通用生成式多模态时间序列预测框架 (ICLR 2026)',
    defaultAnimSpeed: 'normal'
  },

  slides: [
    /* ========================================================================
     * SLIDE 01: PROBLEM DIAGNOSTIC & BREAKTHROUGH CONTRAST
     * ======================================================================== */
    {
      id: 'slide-01',
      slideNumber: 1,
      sectionTag: 'PART 01 · 问题诊断与范式突破',
      navTitle: '背景与贡献',
      layout: 'contrast-slide',
      title: '多模态生成式时间序列预测：痛点诊断与核心突破',
      subtitle: '从表征视角、跨模态信噪比与概率生成轨迹三个维度，对比传统单模态确定性回归的固有瓶颈与 Aurora 的针对性架构革新。',

      connectors: [
        '⬇ 频域周期折叠 + 三路协同编码',
        '⬇ 质心自适应蒸馏 + 双路相关性引导',
        '⬇ 先验基波原型检索 + 直线流匹配生成'
      ],

      challengesSection: {
        headerTag: '传统单模态确定性预测的三大固有瓶颈',
        guideHint: '诊断维度：输入视角 · 跨模态交互 · 生成轨迹',
        cards: [
          {
            code: '瓶颈 01',
            roleBadge: '表征视角受限',
            title: '一维单模态视角扁平，缺失跨周期与文本语境',
            visualKey: 'contrast.blindness',
            diagnostics: [
              { badge: '周期混叠', text: '历史观测视为扁平一维波形，多重潜伏周期相互混叠', outcome: '跨周期相位失锁' },
              { badge: '语境盲区', text: '极端气象与节假日等外生驱动力仅存于领域文本', outcome: '突发转折误判' }
            ],
            footerChips: [
              { label: '输入模态', value: '仅 1D 数值序列' },
              { label: '相位对齐', value: '隐式混叠' },
              { label: '外生感知', value: '缺失' }
            ],
            points: [
              '仅将历史观测视为扁平一维波形，多重潜伏周期混叠导致跨周期同相位关联难以显式对齐。',
              '极端气象、节假日与宏观事件等关键外部驱动力存在于文本中，纯数值模型无法感知此类语境。'
            ]
          },
          {
            code: '瓶颈 02',
            roleBadge: '信噪比失衡',
            title: '预训练特征高度冗余，直接拼接干扰时序主干',
            visualKey: 'contrast.redundancy',
            diagnostics: [
              { badge: '词元冗余', text: '冻结 ViT 与 BERT 输出数百词元，含大量语法与背景噪声', outcome: '有效信号极度稀疏' },
              { badge: '空间异构', text: '多模态特征与一维时序分布差异显著，直接硬拼接', outcome: '注意力权重发散' }
            ],
            footerChips: [
              { label: '原始序列', value: 'N_raw ≫ K' },
              { label: '交互开销', value: 'O(N · N_raw)' },
              { label: '模态耦合', value: '异构冲突' }
            ],
            points: [
              '冻结的预训练视觉（ViT）与语言（BERT）模型输出数百个词元，包含大量无关语法与背景噪声。',
              '异构模态特征空间与一维时间序列存在显著分布差异，简单拼接易导致跨模态注意力权重发散。'
            ]
          },
          {
            code: '瓶颈 03',
            roleBadge: '生成轨迹发散',
            title: '点预测抹平多峰分布，纯噪声生成路径弯曲漫长',
            visualKey: 'contrast.noiseStart',
            diagnostics: [
              { badge: '均值坍缩', text: 'MSE 确定性回归仅输出条件期望，抹平未来多峰不确定性', outcome: '丢失分布形态' },
              { badge: '无锚起点', text: '常规生成模型从纯高斯白噪声 $\\mathcal{N}(0,I)$ 盲目出发', outcome: '传输路径弯曲易发散' }
            ],
            footerChips: [
              { label: '生成起点', value: 'N(0, I) 白噪声' },
              { label: '轨迹形态', value: '高曲率漫长' },
              { label: '预测输出', value: '单点期望均值' }
            ],
            points: [
              '传统均方误差（MSE）确定性回归仅能输出条件期望均值，无法刻画未来演化的多峰概率分布。',
              '常规生成式模型从纯高斯白噪声 $\\mathcal{N}(0, I)$ 出发，缺乏物理波形先验锚定，传输轨迹弯曲漫长。'
            ]
          }
        ]
      },

      contributionsSection: {
        headerTag: 'Aurora 多模态生成式预测的核心突破',
        guideHint: '点击任意卡片直达对应章节精讲 (P2–P7)',
        cards: [
          {
            code: '核心突破 01',
            jumpLabel: '直达 P2–P4 ↗',
            title: '内生一维与二维双视角及外生文本三路协同编码',
            visualKey: 'contrast.auroraFoundation',
            jumpToSlide: 1,
            diagnostics: [
              { badge: '频域折叠', text: 'FFT 自动识别主导周期 $P$，一维序列折叠为二维周期图', outcome: '同相位纵轴对齐' },
              { badge: '三路协同', text: '外生文本 + 1D 局部时序 + 2D 内生周期图并行编码', outcome: '全视角捕获先验' }
            ],
            footerChips: [
              { label: '协同支路', value: '1D + 2D + Text' },
              { label: '外部配图', value: '零依赖内生构造' },
              { label: '章节索引', value: 'P2 / P3 / P4' }
            ],
            points: [
              '无需外部配图：利用快速傅里叶变换自动识别主导周期 $P$，将一维序列折叠为二维周期图像。',
              '构建外生领域文本、一维局部时序与二维内生周期图像三路并行编码架构，全面捕获多源先验。'
            ]
          },
          {
            code: '核心突破 02',
            jumpLabel: '直达 P5–P6 ↗',
            title: '模态质心自适应蒸馏与双路引导多头自注意力',
            visualKey: 'contrast.distillGuide',
            jumpToSlide: 4,
            diagnostics: [
              { badge: '质心提纯', text: '可学习质心查询 $C_0$ 交叉注意力过滤冗长背景词元', outcome: '浓缩 K 个核心质心' },
              { badge: '双路调制', text: '合成跨模态相关性矩阵 $\\mathrm{Corr}$ 调制中路自注意力', outcome: '精准增强趋势关联' }
            ],
            footerChips: [
              { label: '特征压缩', value: 'K ≪ N_raw' },
              { label: '注意力引导', value: 'Corr 哈达玛调制' },
              { label: '章节索引', value: 'P5 / P6' }
            ],
            points: [
              '设计可学习质心蒸馏器（Distiller），将冗长视觉与文本特征提纯为 $K$ 个紧凑的核心领域质心。',
              '通过双路引导器生成跨模态相关性矩阵 $\\mathrm{Corr}$，动态调制一维时序主干的多头自注意力权重。'
            ]
          },
          {
            code: '核心突破 03',
            jumpLabel: '直达 P7 ↗',
            title: '多尺度先验原型检索与原型引导直线流匹配生成',
            visualKey: 'contrast.pgfmStraight',
            jumpToSlide: 6,
            diagnostics: [
              { badge: '原型锚定', text: '多模态质心软检索周期与趋势原型库合成先验 $\\tilde{\\mathcal{P}}$', outcome: '物理波形生成起点' },
              { badge: '直线流场', text: '在未来条件 $X^{\\text{cond}}$ 制导下拟合最优传输速度场 $v_\\theta$', outcome: '少步积分生成分布' }
            ],
            footerChips: [
              { label: '流场起点', value: '合成原型 P̃' },
              { label: '传输轨迹', value: '零曲率直线 ODE' },
              { label: '章节索引', value: 'P7' }
            ],
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
      sectionTag: 'PART 02 · 全局多路协同拓扑',
      navTitle: '多路总架构',
      layout: 'architecture-slide',
      title: 'Aurora 算法整体多路架构',
      subtitle: '编码器并行处理外生文本、一维历史序列与内生二维周期图像并融合为统一表征；解码器结合先验原型检索与未来条件解码，经流匹配生成预测分布。',

      encoderBand: {
        bandTag: 'Aurora Encoder · 三路并行编码与跨模态双路引导融合',
        metaPills: [
          { label: '上路: 外生文本流 (Sky)', tone: 'sky' },
          { label: '中路: 1D 时序主干 (Royal Blue)', tone: 'blue' },
          { label: '下路: 2D 周期图像流 (Indigo)', tone: 'indigo' },
          { label: '汇聚输出: X^fuse (Signal Teal)', tone: 'teal' }
        ],
        visualKey: 'arch.encoderMultiStream'
      },

      decoderBand: {
        bandTag: 'Aurora Decoder · 先验原型检索、未来条件解码与流匹配生成',
        metaPills: [
          { label: '解码上路: 原型库软检索 P̃ (Indigo)', tone: 'indigo' },
          { label: '解码下路: 因果 + RoPE 条件 X^cond (Royal Blue)', tone: 'blue' },
          { label: '生成终端: 直线流匹配 ODE → Ŷ (Signal Teal)', tone: 'teal' }
        ],
        visualKey: 'arch.decoderMultiStream'
      }
    },

    /* ========================================================================
     * SLIDE 03: 1D TIME SERIES PROCESSING (5 STEPS)
     * ======================================================================== */
    {
      id: 'slide-03',
      slideNumber: 3,
      sectionTag: 'PART 03 · 中路主干：一维时序流',
      navTitle: '1D 时序支路',
      layout: 'pipeline-slide',
      title: '一维时间序列分块与动态重采样嵌入',
      subtitle: '通过可逆实例归一化消除多变量量纲差异，利用首部左补零分块与嵌入核线性插值重采样，将任意采样周期的一维序列映射为局部时序特征。',
      cols: 5,

      phases: [
        { code: 'PHASE 01', title: '统计解耦与边界对齐', summary: '消除量纲 · 保证末块完整', span: 2, tone: 'sky' },
        { code: 'PHASE 02', title: '局部窗口化与动态核重采样', summary: '零重训跨采样率适配', span: 2, tone: 'blue' },
        { code: 'PHASE 03', title: '隐空间表征映射', summary: '输出中路初始特征', span: 1, tone: 'teal' }
      ],

      steps: [
        {
          stepCode: 'STEP 01',
          role: '统计校准',
          title: '可逆实例归一化',
          theme: 'sky',
          visualKey: 'stream1d.revin',
          ioFlow: ['非平稳原序列', '均值/方差剥离', '零均值同分布'],
          specs: [
            { tag: '物理作用', text: '消除多传感器非平稳偏移与量纲差异', tone: 'sky' },
            { tag: '逆向闭环', text: '缓存 $(\\mu, \\sigma)$ 供解码末端逆还原', tone: 'slate' }
          ],
          caption: '逐通道减去历史均值 $\\mu$ 并除以标准差 $\\sigma$，消除非平稳偏移与物理量纲差异；统计量缓存用于预测末端逆还原。',
          chainOp: '零均值单位方差标准化',
          chainLatex: [
            '\\mu = \\mathrm{Mean}(x_{1:T}),\\; \\sigma = \\mathrm{Std}(x_{1:T})',
            '\\tilde{x}_t = (x_t - \\mu) / (\\sigma + \\epsilon)'
          ],
          chainDim: '\\mathbb{R}^{T} \\to \\mathbb{R}^{T}'
        },
        {
          stepCode: 'STEP 02',
          role: '边界对齐',
          title: '序列首部左补零对齐',
          theme: 'sky',
          visualKey: 'stream1d.leftPad',
          ioFlow: ['原长 $T$', '左补 $r$ 零', '整除长 $NP$'],
          specs: [
            { tag: '填充位置', text: '仅在序列最左侧填充 $r$ 个零值', tone: 'sky' },
            { tag: '时序保真', text: '确保最新观测时刻完整落在末尾分块', tone: 'blue' }
          ],
          caption: '当序列长度 $T$ 无法被分块长度 $P$ 整除时，在序列最左侧填充 $r$ 个零值，保证最新历史时刻完整落在末尾分块中。',
          chainOp: '首部余数补零扩展',
          chainLatex: [
            'r = (P - (T \\bmod P)) \\bmod P',
            '\\tilde{x}_{\\text{pad}} = [\\mathbf{0}_{r},\\; \\tilde{x}_{1:T}]'
          ],
          chainDim: '\\mathbb{R}^{T} \\to \\mathbb{R}^{N P}'
        },
        {
          stepCode: 'STEP 03',
          role: '局部窗口化',
          title: '非重叠等长窗口分块',
          theme: 'blue',
          visualKey: 'stream1d.patching',
          ioFlow: ['等齐序列 $NP$', '按窗口 $P$ 切块', '局部块矩阵 $X_p$'],
          specs: [
            { tag: '结构重塑', text: '切分为 $N$ 个非重叠连续局部时间块', tone: 'blue' },
            { tag: '语义粒度', text: '单行保留窗口 $P$ 内短时局部波形', tone: 'slate' }
          ],
          caption: '将补齐后的序列按固定块长 $P$ 切分为 $N$ 个连续局部时间块，每一行代表一个局部时间窗口内的短时波形形态。',
          chainOp: '一维序列重塑为块矩阵',
          chainLatex: [
            'N = (T + r) / P',
            'X_{p} = \\mathrm{Reshape}(\\tilde{x}_{\\text{pad}},\\; N,\\; P)'
          ],
          chainDim: '\\mathbb{R}^{N P} \\to \\mathbb{R}^{N \\times P}'
        },
        {
          stepCode: 'STEP 04',
          role: '核心算子',
          focal: true,
          title: '嵌入权重线性插值',
          theme: 'blue',
          visualKey: 'stream1d.resample',
          ioFlow: ['预训练核 $W_0$', '块长维线性插值', '动态核 $W_{\\text{time}}$'],
          specs: [
            { tag: '动态适配', text: '将基准维度 $P_0$ 连续插值缩放至目标 $P$', tone: 'blue' },
            { tag: '零重训泛化', text: '单一权重无缝适配任意采样率与周期', tone: 'indigo' }
          ],
          caption: '沿块长维度对预训练嵌入矩阵 $W_0$ 执行线性插值重采样，使模型无需重新训练即可适配不同采样率与窗口长度 $P$。',
          chainOp: '嵌入核动态线性插值',
          chainLatex: [
            '\\alpha(p) = (p / P) \\cdot P_0',
            'W_{\\text{time}} = \\mathrm{Interp}_{1\\text{D}}(W_0,\\; P_0 \\to P)'
          ],
          chainDim: '\\mathbb{R}^{P_0 \\times D} \\to \\mathbb{R}^{P \\times D}'
        },
        {
          stepCode: 'STEP 05',
          role: '特征输出',
          title: '线性映射生成时序特征',
          theme: 'emerald',
          visualKey: 'stream1d.embedding',
          ioFlow: ['时序块 $X_p$', '线性投影', '特征 $X^{\\text{time}}$'],
          specs: [
            { tag: '隐空间对齐', text: '局部块矩阵乘动态权重映射至 $D$ 维', tone: 'teal' },
            { tag: '下游流向', text: '送入中路双路引导多头自注意力主干', tone: 'blue' }
          ],
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
      sectionTag: 'PART 04 · 下路支路：二维内生周期图像流',
      navTitle: '2D 周期图像',
      layout: 'pipeline-slide',
      title: '二维内生周期图像构建与视觉编码',
      subtitle: '利用快速傅里叶变换自动识别序列主导周期并按周期折叠为二维矩阵，经双线性插值与三通道扩展后输入预训练视觉编码器提取跨周期纹理特征。',
      cols: 7,

      phases: [
        { code: 'PHASE 01', title: '频域识周期与二维折叠', summary: '1D 序列 ➔ 2D 周期网格', span: 2, tone: 'indigo' },
        { code: 'PHASE 02', title: '视觉标准接口适配', summary: '尺寸放缩 · 三通道扩展', span: 2, tone: 'sky' },
        { code: 'PHASE 03', title: '分块嵌入与 ViT 纹理编码', summary: '提取跨周期演进表征', span: 3, tone: 'blue' }
      ],

      steps: [
        {
          stepCode: 'STEP 01',
          title: '频域提取主导周期',
          theme: 'indigo',
          focal: true,
          visualKey: 'stream2d.dft',
          ioFlow: ['标准化序列', 'FFT 峰值检索', '主导周期 $P$'],
          specs: [
            { tag: '频谱分析', text: '去除直流分量取最大主频 $f^*$', tone: 'indigo' },
            { tag: '内生周期', text: '自动计算主导周期 $P = \\lfloor T/f^* \\rfloor$', tone: 'blue' }
          ],
          caption: '去除直流分量后经 FFT 提取幅值最大的非零主频 $f^*$，取整得到主导周期长度 $P$。',
          chainOp: '频谱峰值识周期',
          chainLatex: [
            'f^* = \\arg\\max |\\mathrm{FFT}(\\tilde{x})|',
            'P = \\lfloor T / f^* \\rfloor'
          ],
          chainDim: '\\mathbb{R}^{T} \\to P \\in \\mathbb{Z}^{+}'
        },
        {
          stepCode: 'STEP 02',
          title: '二维周期矩阵折叠',
          theme: 'indigo',
          focal: true,
          visualKey: 'stream2d.periodFold',
          ioFlow: ['一维序列', '按周期 $P$ 换行', '二维网格 $G$'],
          specs: [
            { tag: '横轴语义', text: '单周期内局部相位连续演进', tone: 'indigo' },
            { tag: '纵轴语义', text: '不同周期的同相位时刻显式对齐', tone: 'blue' }
          ],
          caption: '左补零后按周期长度 $P$ 逐行折回为 $K_p$ 行矩阵，使不同周期的同相位点在纵轴对齐。',
          chainOp: '按周期换行重排',
          chainLatex: [
            'K_p = \\lceil T / P \\rceil',
            'G = \\mathrm{Fold}_{2\\text{D}}(\\tilde{x}_{\\text{pad}}, K_p, P)'
          ],
          chainDim: '\\mathbb{R}^{K_p P} \\to \\mathbb{R}^{K_p \\times P}'
        },
        {
          stepCode: 'STEP 03',
          title: '双线性插值放缩',
          theme: 'sky',
          visualKey: 'stream2d.resize',
          ioFlow: ['动态网格 $G$', '2D 双线性插值', '标准网格 $I_1$'],
          specs: [
            { tag: '尺度统一', text: '消除不同数据集 $K_p \\times P$ 尺寸差异', tone: 'sky' },
            { tag: '标准分辨', text: '统一放缩为 $H \\times W$ 正方形网格', tone: 'slate' }
          ],
          caption: '通过二维双线性插值将任意尺寸的周期网格 $G$ 统一缩放为 $H \\times W$ 标准正方形网格。',
          chainOp: '二维双线性插值',
          chainLatex: [
            'G \\in \\mathbb{R}^{K_p \\times P}',
            'I_1 = \\mathrm{Resize}(G, H, W)'
          ],
          chainDim: '\\mathbb{R}^{K_p \\times P} \\to \\mathbb{R}^{H \\times W}'
        },
        {
          stepCode: 'STEP 04',
          title: '三通道复制扩展',
          theme: 'sky',
          visualKey: 'stream2d.repeat',
          ioFlow: ['单通道图 $I_1$', '通道维复制 $\\times 3$', '三通道图 $I_3$'],
          specs: [
            { tag: '接口对齐', text: '沿通道维复制 3 份构造伪彩色图', tone: 'sky' },
            { tag: '零改结构', text: '无缝对接预训练 RGB 视觉主干', tone: 'slate' }
          ],
          caption: '将单通道周期灰度矩阵 $I_1$ 沿通道维复制 $3$ 份，构造三通道图像 $I_3$ 以对接预训练视觉模型。',
          chainOp: '通道维复制叠加',
          chainLatex: [
            'I_1 \\in \\mathbb{R}^{H \\times W \\times 1}',
            'I_3 = \\mathrm{Repeat}(I_1,\\; 3)'
          ],
          chainDim: '\\mathbb{R}^{H \\times W} \\to \\mathbb{R}^{H \\times W \\times 3}'
        },
        {
          stepCode: 'STEP 05',
          title: '二维网格切块展平',
          theme: 'blue',
          visualKey: 'stream2d.patchFlatten',
          ioFlow: ['图像 $I_3$', '$S \\times S$ 网格切块', '展平序列 $U_v$'],
          specs: [
            { tag: '空间分块', text: '切分为 $N_v$ 个非重叠局部图像块', tone: 'blue' },
            { tag: '局部感受', text: '每块同时包含周期内与跨周期邻域', tone: 'indigo' }
          ],
          caption: '按 $S \\times S$ 像素网格切分为 $N_v$ 个局部图像块，并将每个二维块展平为特征向量。',
          chainOp: '网格分块与展平',
          chainLatex: [
            'N_v = (H / S) \\cdot (W / S)',
            'U_v = \\mathrm{Patch}(I_3,\\; S^2)'
          ],
          chainDim: '\\mathbb{R}^{H \\times W \\times 3} \\to \\mathbb{R}^{N_v \\times 3S^2}'
        },
        {
          stepCode: 'STEP 06',
          title: '线性投影与位置编码',
          theme: 'blue',
          visualKey: 'stream2d.posEmbed',
          ioFlow: ['块向量 $U_v$', '线性投影 + 位置', '视觉词元 $Z_v^{(0)}$'],
          specs: [
            { tag: '维度对齐', text: '通过 $W_v$ 线性映射至主干维度 $D$', tone: 'blue' },
            { tag: '坐标感知', text: '叠加可学习二维位置编码 $E_{\\text{pos}}^{2\\text{D}}$', tone: 'indigo' }
          ],
          caption: '通过线性层映射至 $D$ 维并叠加二维可学习空间位置编码 $E_{\\text{pos}}^{2\\text{D}}$，保留相位坐标感知。',
          chainOp: '投影与空间坐标注入',
          chainLatex: [
            'U_v W_v \\in \\mathbb{R}^{N_v \\times D}',
            'Z_v^{(0)} = U_v W_v + E_{\\text{pos}}^{2\\text{D}}'
          ],
          chainDim: '\\mathbb{R}^{N_v \\times 3S^2} \\to \\mathbb{R}^{N_v \\times D}'
        },
        {
          stepCode: 'STEP 07',
          title: '冻结 ViT 视觉编码',
          theme: 'emerald',
          visualKey: 'stream2d.vitEncode',
          ioFlow: ['视觉词元 $Z_v^{(0)}$', '冻结 ViT 主干', '周期纹理 $H^{\\text{vis}}$'],
          specs: [
            { tag: '参数冻结', text: '复用预训练 ViT 先验，零微调开销', tone: 'slate' },
            { tag: '特征输出', text: '提取全局跨周期纹理表征 $H^{\\text{vis}}$', tone: 'teal' }
          ],
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
      sectionTag: 'PART 05 · 多模态特征提纯：质心自适应蒸馏',
      navTitle: '模态特征蒸馏',
      layout: 'pipeline-slide',
      title: '多模态特征提取与质心自适应蒸馏',
      subtitle: '基于冻结的预训练语言与视觉模型提取初始语义和周期特征，通过可学习质心交叉注意力过滤冗余背景噪声，浓缩固定数量的领域核心特征。',
      cols: 4,

      phases: [
        { code: 'PHASE 01', title: '双路冻结预训练主干编码', summary: '提取原始文本与视觉全序列特征', span: 2, tone: 'slate' },
        { code: 'PHASE 02', title: '可学习质心交叉注意力漏斗提纯', summary: '从 N_raw 词元浓缩为 K 个紧凑质心', span: 2, tone: 'sky' }
      ],

      steps: [
        {
          stepCode: 'STEP 01',
          role: '文本嵌入',
          title: '领域文本分词与位置嵌入',
          theme: 'sky',
          visualKey: 'distill.textTokenize',
          ioFlow: ['外生领域文本', '子词切分 + 位置', '词元序列 $Z_t^{(0)}$'],
          specs: [
            { tag: '语境来源', text: '传感器物理属性、节假日与极端气象描述', tone: 'sky' },
            { tag: '序列构造', text: '切分为 $N_t$ 个子词并叠加位置编码 $E_{\\text{pos}}^{\\text{text}}$', tone: 'slate' }
          ],
          caption: '将传感器物理属性、节假日或气象事件描述切分为 $N_t$ 个子词词元，映射为词向量并叠加序列位置编码 $E_{\\text{pos}}^{\\text{text}}$。',
          chainOp: '子词切分与词向量嵌入',
          chainLatex: [
            'U_t = \\mathrm{Tokenizer}(\\text{Text})',
            'Z_t^{(0)} = U_t W_e + E_{\\text{pos}}^{\\text{text}}'
          ],
          chainDim: '\\text{Text} \\to \\mathbb{R}^{N_t \\times D}'
        },
        {
          stepCode: 'STEP 02',
          role: '冻结主干',
          title: '双路冻结预训练主干编码',
          theme: 'slate',
          visualKey: 'distill.pretrainedEncode',
          ioFlow: ['文本 / 视觉输入', '冻结 BERT & ViT', '长序列 $H^{\\text{text}}, H^{\\text{vis}}$'],
          specs: [
            { tag: '知识复用', text: '冻结预训练 BERT 与 ViT 权重提取高层表征', tone: 'slate' },
            { tag: '维度对齐', text: '统一投影至主干隐空间维度 $D$，含大量冗余', tone: 'sky' }
          ],
          caption: '上路通过冻结的 BERT 提取上下文语义特征 $H^{\\text{text}}$，下路通过冻结的 ViT 提取二维周期纹理特征 $H^{\\text{vis}}$。',
          chainOp: '冻结预训练主干前向提取',
          chainLatex: [
            'H^{\\text{text}} = \\mathrm{BERT}(Z_t^{(0)})',
            'H^{\\text{vis}} = \\mathrm{ViT}(Z_v^{(0)})'
          ],
          chainDim: '\\mathbb{R}^{N_t \\times D},\\; \\mathbb{R}^{N_v \\times D}'
        },
        {
          stepCode: 'STEP 03',
          role: '核心算子',
          focal: true,
          title: '可学习质心交叉注意力聚合',
          theme: 'blue',
          visualKey: 'distill.centroids',
          ioFlow: ['质心查询 $C_0$', '跨序列交叉注意力', '注意力图 $A_{\\text{dist}}^m$'],
          specs: [
            { tag: '查询锚点', text: '引入 $K$ 个可学习领域质心 $C_0 \\in \\mathbb{R}^{K \\times D}$ 为 Query', tone: 'blue' },
            { tag: '噪声过滤', text: '自动吸附关键趋势与周期词元，抑制背景噪声', tone: 'sky' }
          ],
          caption: '引入 $K$ 个可学习质心向量 $C_0$ 作为 Query，以原始长序列 $H$ 作为 Key 与 Value 计算交叉注意力，自动吸附关键趋势与周期特征。',
          chainOp: '质心查询交叉注意力打分',
          chainLatex: [
            'Q_c = C_0 W_Q,\\quad K_m = H^m W_K',
            'A_{\\text{dist}}^m = \\mathrm{Softmax}(Q_c K_m^\\top / \\sqrt{d_k})'
          ],
          chainDim: '\\mathbb{R}^{K \\times N_{\\text{raw}}} \\; (K \\ll N_{\\text{raw}})'
        },
        {
          stepCode: 'STEP 04',
          role: '瓶颈提纯',
          focal: true,
          title: '漏斗提纯输出紧凑先验质心',
          theme: 'emerald',
          visualKey: 'distill.funnel',
          ioFlow: ['长序列 $N_{\\text{raw}}$', '瓶颈蒸馏', '精炼质心 $\\tilde{X}$'],
          specs: [
            { tag: '复杂度骤降', text: '词元数由数百压缩至固定 $K$ 个 ($K \\ll N_{\\text{raw}}$)', tone: 'teal' },
            { tag: '双路赋能', text: '同时供编码器相关性引导与解码器原型检索', tone: 'blue' }
          ],
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
      sectionTag: 'PART 06 · 跨模态交互：双路引导与三路汇聚',
      navTitle: '双路引导融合',
      layout: 'pipeline-slide',
      title: '双路引导多头自注意力与跨模态融合',
      subtitle: '利用文本与视觉引导器计算跨模态双线性相关性矩阵以调制一维时序自注意力权重，并通过跨模态交叉注意力与残差连接输出三路融合表征。',
      cols: 4,

      phases: [
        { code: 'PHASE 01', title: '双路跨模态相关性先验构建', summary: 'TextGuider & VisionGuider 合成 Corr 矩阵', span: 2, tone: 'sky' },
        { code: 'PHASE 02', title: '相关性调制自注意力与三路残差汇聚', summary: 'MG-MSA 演化 + Modality Fuser 输出 X^fuse', span: 2, tone: 'blue' }
      ],

      steps: [
        {
          stepCode: 'STEP 01',
          role: '双线性打分',
          title: '双路引导器跨模态关联打分',
          theme: 'sky',
          visualKey: 'align.guiders',
          ioFlow: ['时序 $X^{\\text{time}}$ + 质心', '双线性投影打分', '响应矩阵 $S_{\\text{text}}, S_{\\text{vis}}$'],
          specs: [
            { tag: '双路交互', text: '计算每个时序块与 $K$ 个文本/视觉质心的亲和度', tone: 'sky' },
            { tag: '参数轻量', text: '通过双线性权重 $W_{\\text{text}}, W_{\\text{vis}}$ 桥接异构空间', tone: 'indigo' }
          ],
          caption: 'TextGuider 与 VisionGuider 分别通过可学习双线性映射矩阵 $W_{\\text{text}}$、$W_{\\text{vis}}$ 计算每个一维时序块与文本、视觉质心的关联响应。',
          chainOp: '双线性跨模态关联度计算',
          chainLatex: [
            'S_{\\text{text}} = \\sigma\\big(X^{\\text{time}} W_{\\text{text}} (\\tilde{X}^{\\text{text}})^\\top\\big)',
            'S_{\\text{vis}} = \\sigma\\big(X^{\\text{time}} W_{\\text{vis}} (\\tilde{X}^{\\text{image}})^\\top\\big)'
          ],
          chainDim: '\\mathbb{R}^{N \\times D} \\to \\mathbb{R}^{N \\times K}'
        },
        {
          stepCode: 'STEP 02',
          role: '引导矩阵合成',
          focal: true,
          title: '合成时间块相关性引导矩阵',
          theme: 'blue',
          visualKey: 'align.bilinear',
          ioFlow: ['响应 $S_{\\text{text}}, S_{\\text{vis}}$', '内积与自适应加权', '引导矩阵 $\\mathrm{Corr}$'],
          specs: [
            { tag: '共现先验', text: '对同一事件或同相位质心高响应的时间块强连接', tone: 'blue' },
            { tag: '自适应融合', text: '通过系数 $\\alpha$ 动态平衡文本与视觉引导强度', tone: 'sky' }
          ],
          caption: '若两个时间块对同一文本事件或同一周期相位质心均有高响应，则在相关性矩阵 $\\mathrm{Corr}$ 中赋予高权重，显式建立跨时间步先验连接。',
          chainOp: '双路相关性矩阵加权合成',
          chainLatex: [
            'C_m = \\mathrm{Softmax}(S_m S_m^\\top)',
            '\\mathrm{Corr} = \\alpha\\, C_{\\text{text}} + (1 - \\alpha)\\, C_{\\text{vis}}'
          ],
          chainDim: '\\mathbb{R}^{N \\times K} \\to \\mathbb{R}^{N \\times N}'
        },
        {
          stepCode: 'STEP 03',
          role: '核心算子',
          focal: true,
          title: '相关性调制多头自注意力',
          theme: 'blue',
          visualKey: 'align.mgmsa',
          ioFlow: ['内积 + $\\mathrm{Corr}$', '哈达玛调制', '引导后 $\\tilde{X}^{\\text{time}}$'],
          specs: [
            { tag: '哈达玛调制', text: '将 $\\mathrm{Corr}$ 与点积注意力矩阵逐元素相乘 ($\\odot$)', tone: 'blue' },
            { tag: '深层演化', text: '经 $K$ 层堆叠放大与未来趋势一致的历史块权重', tone: 'indigo' }
          ],
          caption: '将多模态相关矩阵 $\\mathrm{Corr}$ 与中路标准点积注意力分数逐元素哈达玛积（$\\odot$）调制，经 $K$ 层堆叠演化输出引导后时序特征 $\\tilde{X}^{\\text{time}}$。',
          chainOp: '相关性调制多头自注意力',
          chainLatex: [
            'A_{\\text{MG}} = \\mathrm{Softmax}\\big((Q K^\\top / \\sqrt{d_k}) \\odot \\mathrm{Corr}\\big)',
            '\\tilde{X}^{\\text{time}} = \\mathrm{FFN}\\big(\\mathrm{LN}(X^{\\text{time}} + A_{\\text{MG}} V)\\big)'
          ],
          chainDim: '\\mathbb{R}^{N \\times D} \\to \\mathbb{R}^{N \\times D}'
        },
        {
          stepCode: 'STEP 04',
          role: '三路汇聚',
          title: '三路跨模态交叉注意力汇聚',
          theme: 'emerald',
          visualKey: 'align.fuser',
          ioFlow: ['三路表征', '交叉注意力残差', '融合 $X^{\\text{fuse}}$'],
          specs: [
            { tag: '交叉对齐', text: '以 $\\tilde{X}^{\\text{time}}$ 为 Query 分别对齐文本与视觉质心', tone: 'teal' },
            { tag: '完备表征', text: '残差相加输出兼具局部波形、周期与语境的 $X^{\\text{fuse}}$', tone: 'blue' }
          ],
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
      sectionTag: 'PART 07 · 解码生成：先验原型检索与直线流匹配',
      navTitle: '原型流匹配生成',
      layout: 'pipeline-slide',
      title: '先验原型检索、条件解码与流匹配生成',
      subtitle: '结合因果与旋转位置编码跨注意力解码未来步控制条件，同时从多尺度周期与趋势原型库中检索初始波形锚点，经条件流匹配常微分方程积分生成最终预测。',
      cols: 4,

      phases: [
        { code: 'PHASE 01', title: '双路解码先验准备 (条件 X^cond + 原型 P̃)', summary: '未来控制条件外推 · 物理波形起点检索', span: 2, tone: 'indigo' },
        { code: 'PHASE 02', title: '原型锚定最优传输流匹配生成', summary: '直线速度场学习 · 少步欧拉积分输出 Ŷ', span: 2, tone: 'blue' }
      ],

      steps: [
        {
          stepCode: 'STEP 01',
          role: '未来条件解码',
          title: '因果与旋转位置编码条件解码',
          theme: 'blue',
          visualKey: 'decoder.condition',
          ioFlow: ['融合 $X^{\\text{fuse}}$', '因果+RoPE', '未来条件 $X^{\\text{cond}}$'],
          specs: [
            { tag: '因果递推', text: '下三角掩码自注意力保证历史到未来的自回归因果性', tone: 'blue' },
            { tag: 'RoPE 注入', text: '旋转位置编码对齐多模态上下文，生成未来 $N_p$ 块条件', tone: 'sky' }
          ],
          caption: '将编码融合表征 $X^{\\text{fuse}}$ 送入带下三角掩码的 Causal-Transformer 与引入旋转位置编码（RoPE）的 Cross-Transformer，外推得到未来 $N_p$ 个分块的控制条件 $X^{\\text{cond}}$。',
          chainOp: '因果掩码与 RoPE 跨注意力解码',
          chainLatex: [
            'H_{\\text{causal}} = \\mathrm{CausalAttn}(X^{\\text{fuse}})',
            'X^{\\text{cond}} = \\mathrm{RoPE\\text{-}Attn}\\big(H_{\\text{causal}},\\; [\\tilde{X}^{\\text{image}}; \\tilde{X}^{\\text{text}}]\\big)'
          ],
          chainDim: '\\mathbb{R}^{N \\times D} \\to \\mathbb{R}^{N_p \\times D}'
        },
        {
          stepCode: 'STEP 02',
          role: '先验起点检索',
          focal: true,
          title: '多尺度先验原型库软检索',
          theme: 'indigo',
          visualKey: 'decoder.prototype',
          ioFlow: ['质心 $Q_{\\text{mm}}$', '原型库检索', '先验起点 $\\tilde{\\mathcal{P}}$'],
          specs: [
            { tag: '基波词典', text: '原型库涵盖正弦/余弦周期基与线性/指数趋势基', tone: 'indigo' },
            { tag: '告别白噪声', text: '加权合成物理先验 $\\tilde{\\mathcal{P}}$ 替代盲目高斯噪声起点', tone: 'blue' }
          ],
          caption: '以蒸馏后的视觉与文本质心构造查询向量 $Q_{\\text{mm}}$，与可学习原型库 $B_{\\text{bank}}$（涵盖正弦周期基与多项式趋势基）计算相似度，加权合成初始先验原型 $\\tilde{\\mathcal{P}}$。',
          chainOp: '多尺度周期与趋势原型检索',
          chainLatex: [
            '\\alpha_{\\text{proto}} = \\mathrm{Softmax}(Q_{\\text{mm}} B_{\\text{bank}}^\\top / \\sqrt{D})',
            '\\tilde{\\mathcal{P}} = \\alpha_{\\text{proto}}\\, B_{\\text{bank}}'
          ],
          chainDim: 'B_{\\text{bank}} \\in \\mathbb{R}^{M_b \\times D} \\to \\tilde{\\mathcal{P}} \\in \\mathbb{R}^{N_p \\times D}'
        },
        {
          stepCode: 'STEP 03',
          role: '核心算子',
          focal: true,
          title: '原型锚定条件流匹配速度场学习',
          theme: 'blue',
          visualKey: 'decoder.flowMatching',
          ioFlow: ['起点 $Z_0 = \\tilde{\\mathcal{P}} + \\sigma_0\\epsilon$', 'AdaLN 条件流网络', '直线速度场 $v_\\theta$'],
          specs: [
            { tag: '直线轨迹', text: '构造从先验 $Z_0$ 到真实分布 $Z_1$ 的零曲率线性插值路径', tone: 'blue' },
            { tag: '速度回归', text: '通过 AdaLN 注入条件 $X^{\\text{cond}}$，直接回归恒定速度向量', tone: 'indigo' }
          ],
          caption: '以叠加高斯微扰 $\\epsilon$ 的先验原型 $Z_0 = \\tilde{\\mathcal{P}} + \\sigma_0 \\epsilon$ 为流起点，在流时间步 $\\tau \\in [0,1]$ 上通过 AdaLN 注入条件 $X^{\\text{cond}}$，训练网络预测指向真实分布 $Z_1$ 的直线速度向量 $v_\\theta$。',
          chainOp: '最优传输直线速度场回归',
          chainLatex: [
            'Z_\\tau = (1 - \\tau)(\\tilde{\\mathcal{P}} + \\sigma_0 \\epsilon) + \\tau Z_1',
            '\\mathcal{L}_{\\text{FM}} = \\mathbb{E}\\big\\| v_\\theta(Z_\\tau, \\tau \\mid X^{\\text{cond}}) - (Z_1 - Z_0) \\big\\|_2^2'
          ],
          chainDim: 'v_\\theta \\in \\mathbb{R}^{N_p \\times D}'
        },
        {
          stepCode: 'STEP 04',
          role: '终端生成还原',
          title: '前向欧拉积分与逆归一化还原',
          theme: 'emerald',
          visualKey: 'decoder.eulerOde',
          ioFlow: ['先验 $Z_0$', '欧拉积分还原', '预测分布 $\\hat{Y}$'],
          specs: [
            { tag: '少步采样', text: '得益于直线轨迹，仅需少量几步前向欧拉积分即可收敛', tone: 'teal' },
            { tag: '概率分布', text: '多次噪声微扰采样刻画置信区间，经 $\\mathrm{RevIN}^{-1}$ 还原量纲', tone: 'sky' }
          ],
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
window.PresentationContent = window.AuroraContent;
