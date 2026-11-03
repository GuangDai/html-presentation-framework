/**
 * ============================================================================
 * @file decks/component-showcase/content.js
 * @description Flagship 6-Slide Component & Layout Showcase Deck demonstrating
 *              all 6 standardized layouts and 12+ visual-semantic components.
 * ============================================================================
 */

window.PresentationContent = {
  deckMeta: {
    documentTitle: '现代白蓝视觉语义组件与 6 大标准布局全景库 (16:9 Showcase)',
    defaultAnimSpeed: 'normal',
    homeSlide: 1,
    homeButtonLabel: '⊞ 架构全景 (P2)',
    homeButtonTitle: '返回第 2 页系统架构全景 (快捷键: M)',
    tocSubtitle: '全景展示 6 大标准布局与 12 类结构化视觉语义组件 · 按 D 键切换演示库'
  },

  slides: [
    /* Slide 1: Contrast Layout */
    {
      id: 'showcase-01',
      sectionTag: 'LAYOUT 01 · CONTRAST DIAGNOSTIC SLIDE',
      navTitle: '对比诊断页',
      layout: 'contrast-slide',
      title: '对比诊断布局：传统瓶颈剖析与核心突破映射',
      subtitle: '上层采用灰蓝+克制珊瑚红锚定三大痛点成因与后果，中层通过方向胶囊桥接转化算子，下层以现代皇家蓝突出核心突破与指标收益。',
      connectors: [
        '⬇ 频域折叠算子 + 多源并行编码',
        '⬇ 质心漏斗蒸馏 + 双线性引导矩阵',
        '⬇ 先验原型锚定 + 直线流匹配积分'
      ],
      challengesSection: {
        headerTag: '上层诊断区：现有方法的结构性局限 (Slate + Diagnostic Rose)',
        guideHint: '组件：CauseEffectDiagnostic + FooterMetricChips',
        cards: [
          {
            code: '痛点 01',
            roleBadge: '表征受限',
            title: '单一模态扁平视角，缺失跨周期与外部语境',
            visualKey: 'showcase.contrastLeft',
            diagnostics: [
              { badge: '周期混叠', text: '一维波形混叠多重潜伏周期成分', outcome: '跨周期相位失锁' },
              { badge: '外生盲区', text: '忽略领域文本中的事件驱动信号', outcome: '突变拐点误判' }
            ],
            footerChips: [
              { label: '模态维度', value: '1D 单一视角' },
              { label: '先验利用', value: '0%' }
            ]
          },
          {
            code: '痛点 02',
            roleBadge: '信噪比低',
            title: '预训练词元高度冗余，硬拼接引发注意力发散',
            visualKey: 'showcase.contrastMid',
            diagnostics: [
              { badge: '词元爆炸', text: '冻结大模型输出数百背景词元 $N_{\\text{raw}}$', outcome: '计算开销 O(N²)' },
              { badge: '分布异构', text: '跨模态特征空间直接拼接', outcome: '主干信号被淹没' }
            ],
            footerChips: [
              { label: '冗余比例', value: '> 85% 噪声' },
              { label: '对齐机制', value: '直接硬拼接' }
            ]
          },
          {
            code: '痛点 03',
            roleBadge: '轨迹发散',
            title: '纯白噪声起点缺乏物理锚定，生成路径弯曲漫长',
            visualKey: 'showcase.contrastRight',
            diagnostics: [
              { badge: '均值坍缩', text: '确定性回归抹平多峰概率分布', outcome: '缺失置信区间' },
              { badge: '盲目起点', text: '从高斯白噪声 $\\mathcal{N}(0,I)$ 随机演化', outcome: '多步采样易发散' }
            ],
            footerChips: [
              { label: '初始状态', value: 'N(0, I) 噪声' },
              { label: '采样步数', value: '50–100 步' }
            ]
          }
        ]
      },
      contributionsSection: {
        headerTag: '下层突破区：本框架的核心架构创新 (Royal Blue + Signal Teal)',
        guideHint: '支持点击卡片直达对应章节 (data-jump-slide)',
        cards: [
          {
            code: '突破 01',
            jumpLabel: '直达 P2 ↗',
            title: '内生二维周期图与外生文本三路协同表征',
            visualKey: 'showcase.contribLeft',
            jumpToSlide: 1,
            diagnostics: [
              { badge: '频域折叠', text: 'FFT 提取主周期 $P$ 折叠为二维矩阵', outcome: '同相位纵轴对齐' },
              { badge: '三路编码', text: '1D 时序 + 2D 周期图 + 领域文本协同', outcome: '全视角互补表征' }
            ],
            footerChips: [
              { label: '模态维度', value: '1D + 2D + Text' },
              { label: '外部配图', value: '零依赖' }
            ]
          },
          {
            code: '突破 02',
            jumpLabel: '直达 P3 ↗',
            title: '可学习质心漏斗蒸馏与双线性引导矩阵调制',
            visualKey: 'showcase.contribMid',
            jumpToSlide: 2,
            diagnostics: [
              { badge: '瓶颈蒸馏', text: '引入 $K$ 个质心查询 $C_0$ 提纯关键语义', outcome: '浓缩 K ≪ N_raw' },
              { badge: '相关调制', text: '双线性相关性矩阵 $\\mathrm{Corr}$ 哈达玛调制', outcome: '聚焦关键历史块' }
            ],
            footerChips: [
              { label: '复杂度降低', value: '↓ 72% FLOPs' },
              { label: '调制方式', value: 'Corr ⊙ Attn' }
            ]
          },
          {
            code: '突破 03',
            jumpLabel: '直达 P5 ↗',
            title: '先验原型库软检索与最优传输直线流匹配',
            visualKey: 'showcase.contribRight',
            jumpToSlide: 4,
            diagnostics: [
              { badge: '原型锚定', text: '软检索周期与趋势基合成先验起点 $\\tilde{\\mathcal{P}}$', outcome: '物理波形高维锚定' },
              { badge: '直线流场', text: '拟合零曲率最优传输恒定速度场 $v_\\theta$', outcome: '5 步积分精准收敛' }
            ],
            footerChips: [
              { label: '初始状态', value: '合成原型 P̃' },
              { label: '采样步数', value: '仅需 5 步' }
            ]
          }
        ]
      }
    },

    /* Slide 2: Architecture Layout */
    {
      id: 'showcase-02',
      sectionTag: 'LAYOUT 02 · MULTI-STREAM ARCHITECTURE SLIDE',
      navTitle: '多路架构页',
      layout: 'architecture-slide',
      title: '多路系统架构布局：双层分带拓扑与流向元数据',
      subtitle: '支持按权重比例分配上下双层画布高度，顶部配备模态流向元数据胶囊（BandMetaStrip），图内支持交互式章节跳转。',
      bandWeights: [1.35, 1],
      encoderBand: {
        bandTag: '上层编码拓扑 · 多路并行表征提取与跨模态相关性引导汇聚',
        metaPills: [
          { label: '天际蓝 (Sky): 外生文本与归一化', tone: 'sky' },
          { label: '皇家蓝 (Royal): 1D 主干与核心注意力', tone: 'blue' },
          { label: '靛青蓝 (Indigo): 2D 周期与原型空间', tone: 'indigo' },
          { label: '信号青 (Teal): 终端收敛输出', tone: 'teal' }
        ],
        visualKey: 'showcase.archTop'
      },
      decoderBand: {
        bandTag: '下层解码拓扑 · 先验原型库检索与条件流匹配概率生成',
        metaPills: [
          { label: '输入端: 灰蓝边框 (Slate)', tone: 'blue' },
          { label: '核心算子: 高对比实心蓝 (Focal)', tone: 'indigo' },
          { label: '输出端: 浅蓝底色张量胶囊 (Output)', tone: 'teal' }
        ],
        visualKey: 'showcase.archBottom'
      }
    },

    /* Slide 3: Pipeline Layout */
    {
      id: 'showcase-03',
      sectionTag: 'LAYOUT 03 · PHASE-GUIDED PIPELINE SLIDE',
      navTitle: '阶段流水线页',
      layout: 'pipeline-slide',
      title: '阶段引导流水线布局：四层垂直空间区隔与零段落语义卡',
      subtitle: '由宏观阶段引导轨（PhaseTrack）、图形拓扑井（VisualWell）、三节点流向条（IOFlowStrip + KVGrid）与底部数学张量坞（MathDock）四层组成。',
      cols: 4,
      phases: [
        { code: 'PHASE 01', title: '统计校准与局部窗口分块', summary: '消除量纲 · 构造时序块矩阵', span: 2, tone: 'sky' },
        { code: 'PHASE 02', title: '动态核重采样与隐空间对齐', summary: '零重训适配 · 突出核心算子', span: 2, tone: 'blue' }
      ],
      steps: [
        {
          stepCode: 'STEP 01',
          role: '输入校准',
          title: '可逆实例归一化',
          theme: 'sky',
          visualKey: 'showcase.pipe1',
          ioFlow: ['原始序列 $x$', '均值方差剥离', '平稳序列 $\\tilde{x}$'],
          specs: [
            { tag: '核心机制', text: '逐通道标准化消除非平稳偏移', tone: 'sky' },
            { tag: '逆向闭环', text: '缓存 $(\\mu, \\sigma)$ 供末端无损还原', tone: 'slate' }
          ],
          chainOp: '零均值单位方差标准化',
          chainLatex: [
            '\\mu = \\mathrm{Mean}(x_{1:T}),\\; \\sigma = \\mathrm{Std}(x_{1:T})',
            '\\tilde{x}_t = (x_t - \\mu) / (\\sigma + \\epsilon)'
          ],
          chainDim: '\\mathbb{R}^{T} \\to \\mathbb{R}^{T}'
        },
        {
          stepCode: 'STEP 02',
          role: '结构重塑',
          title: '左补零与等长分块',
          theme: 'blue',
          visualKey: 'showcase.pipe2',
          ioFlow: ['补齐序列 $NP$', '非重叠切块', '块矩阵 $X_p$'],
          specs: [
            { tag: '首部对齐', text: '左侧填充 $r$ 个零值保证末块完整', tone: 'blue' },
            { tag: '矩阵重排', text: '切分为 $N$ 行局部窗口短时波形', tone: 'slate' }
          ],
          chainOp: '首部补零与窗口重塑',
          chainLatex: [
            'r = (P - (T \\bmod P)) \\bmod P',
            'X_{p} = \\mathrm{Reshape}(\\tilde{x}_{\\text{pad}},\\; N,\\; P)'
          ],
          chainDim: '\\mathbb{R}^{T} \\to \\mathbb{R}^{N \\times P}'
        },
        {
          stepCode: 'STEP 03',
          role: '核心算子',
          focal: true,
          title: '嵌入核动态重采样',
          theme: 'indigo',
          visualKey: 'showcase.pipe3',
          ioFlow: ['基准核 $W_0$', '线性插值缩放', '适配核 $W_{\\text{time}}$'],
          specs: [
            { tag: '焦点突出', text: 'focal: true 自动启用高对比视觉高亮', tone: 'indigo' },
            { tag: '跨周期泛化', text: '无需重训适配任意分块长度 $P$', tone: 'blue' }
          ],
          chainOp: '嵌入核连续线性插值',
          chainLatex: [
            '\\alpha(p) = (p / P) \\cdot P_0',
            'W_{\\text{time}} = \\mathrm{Interp}_{1\\text{D}}(W_0,\\; P_0 \\to P)'
          ],
          chainDim: '\\mathbb{R}^{P_0 \\times D} \\to \\mathbb{R}^{P \\times D}'
        },
        {
          stepCode: 'STEP 04',
          role: '终端输出',
          title: '隐空间特征线性投影',
          theme: 'emerald',
          visualKey: 'showcase.pipe4',
          ioFlow: ['块矩阵 $X_p$', '矩阵乘法映射', '时序表征 $X^{\\text{time}}$'],
          specs: [
            { tag: '维度对齐', text: '投影至 $D$ 维统一隐空间表征', tone: 'teal' },
            { tag: '下游接口', text: '输出至双路引导多头自注意力模块', tone: 'blue' }
          ],
          chainOp: '隐空间矩阵投影',
          chainLatex: [
            'X_{p} \\in \\mathbb{R}^{N \\times P},\\; W_{\\text{time}} \\in \\mathbb{R}^{P \\times D}',
            'X^{\\text{time}} = X_{p}\\, W_{\\text{time}}'
          ],
          chainDim: '\\mathbb{R}^{N \\times P} \\to \\mathbb{R}^{N \\times D}'
        }
      ]
    },

    /* Slide 4: Bento Grid Layout */
    {
      id: 'showcase-04',
      sectionTag: 'LAYOUT 04 · 12-COLUMN BENTO GRID SLIDE',
      navTitle: 'Bento 网格页',
      layout: 'bento-slide',
      title: 'Bento 模块化网格布局：多维系统特性与机制解构',
      subtitle: '基于 12 列 CSS Grid 的自适应模块化卡片布局（支持任意 colSpan 与 rowSpan 组合），适合展示系统特性全景、消融实验剖析或方法论分类。',
      bentoCards: [
        {
          code: 'BENTO 01 · 6 COLS',
          tag: '核心色彩规范',
          title: '85% 纯白底色 + 12% 递进蓝阶 + 3% 点睛诊断色',
          theme: 'blue',
          colSpan: 6,
          visualKey: 'showcase.bentoPalette',
          ioFlow: ['85% 纯白画布', '12% 四级递进蓝', '3% 克制诊断色'],
          specs: [
            { tag: '色彩一致性', text: '同一模态在全篇所有页面保持恒定色相编码', tone: 'blue' },
            { tag: '焦点法则', text: '仅核心创新算子使用实心深蓝填充，杜绝全屏高饱和色块', tone: 'indigo' }
          ]
        },
        {
          code: 'BENTO 02 · 6 COLS',
          tag: '空间区隔准则',
          title: '四层垂直空间区隔与同行像素级动态等高',
          theme: 'indigo',
          colSpan: 6,
          visualKey: 'showcase.bentoZones',
          ioFlow: ['宏观阶段轨', '内凹图形井 + 语义条', '数学张量坞'],
          specs: [
            { tag: '同行等高', text: '引擎自动测量并拉齐同行卡片标题、图形、语义区与公式框高度', tone: 'indigo' },
            { tag: '结构化表达', text: '用三节点流向条与键值标签彻底替代冗长散文段落', tone: 'sky' }
          ]
        },
        {
          code: 'BENTO 03 · 4 COLS',
          tag: '数学排版引擎',
          title: '多行公式拆分与离线矢量缓存',
          theme: 'sky',
          colSpan: 4,
          visualKey: 'showcase.bentoMath',
          specs: [
            { tag: '多行对齐', text: '长公式拆分为独立 .math-line 堆叠展示', tone: 'sky' },
            { tag: '离线无忧', text: '内置 dvisvgm 预编译矢量缓存，断网 100% 渲染', tone: 'teal' }
          ]
        },
        {
          code: 'BENTO 04 · 4 COLS',
          tag: '演讲辅助交互',
          title: '聚光灯聚焦模式与多演示库热切换',
          theme: 'blue',
          colSpan: 4,
          visualKey: 'showcase.bentoHud',
          specs: [
            { tag: '聚光灯聚焦', text: '按 S 键或双击卡片高亮当前列并柔化其余列', tone: 'blue' },
            { tag: '一键切库', text: '按 D 键在 Aurora、组件库与论文模板间即时切换', tone: 'indigo' }
          ]
        },
        {
          code: 'BENTO 05 · 4 COLS',
          tag: '工程自动化',
          title: '一键编译、截图导出与完整性校验',
          theme: 'teal',
          colSpan: 4,
          visualKey: 'showcase.bentoExport',
          specs: [
            { tag: '导出管线', text: '支持 2x Retina PNG、PDF 与 16:9 PPTX 自动生成', tone: 'teal' },
            { tag: '依赖自检', text: '自动核验全部脚本、样式、图形键与公式缓存完整性', tone: 'slate' }
          ]
        }
      ],
      callout: {
        badge: '设计哲学总结',
        text: '以克制的现代白蓝视觉秩序承载高密度学术逻辑，让听众在 3 秒内锁定每页核心算子与张量演进链路。',
        pills: ['零大段散文', '全篇色彩同构', '像素级同行等高', '100% 离线可用']
      }
    },

    /* Slide 5: Benchmark Layout */
    {
      id: 'showcase-05',
      sectionTag: 'LAYOUT 05 · QUANTITATIVE BENCHMARK SLIDE',
      navTitle: '定量评测页',
      layout: 'benchmark-slide',
      title: '定量评测与消融分析布局：核心指标卡 + 视觉对比条 + 帕累托权衡图',
      subtitle: '顶部通过高对比 KPI 指标卡提炼核心增益，下方左栏结合矢量图与进度条对比主流基线，右栏剖析消融实验与计算效率。',
      kpis: [
        { label: '多模态预测误差 (MSE ↓)', value: '0.184', delta: '↓ 24.6% vs SOTA', tone: 'blue' },
        { label: '概率校准误差 (CRPS ↓)', value: '0.112', delta: '↓ 31.8% vs Diffusion', tone: 'indigo' },
        { label: '跨模态注意力计算量', value: 'O(K·N)', delta: '↓ 72% FLOPs (K≪N)', tone: 'sky' },
        { label: 'ODE 生成采样步数', value: '5 Steps', delta: '10× 推理加速', tone: 'teal' }
      ],
      leftPanel: {
        code: 'BENCHMARK 01',
        tag: '多数据集平均归一化误差对比 (越短越优)',
        title: '主流时间序列预测模型性能对比',
        visualKey: 'showcase.benchChart',
        bars: [
          { name: 'Aurora (Ours · 1D+2D+Text + 原型直线流匹配)', metric: 'MSE: 0.184 · CRPS: 0.112', percent: 38, highlight: true },
          { name: 'TimeGrad / CSDI (纯高斯白噪声扩散生成模型)', metric: 'MSE: 0.244 · CRPS: 0.164', percent: 64, highlight: false },
          { name: 'PatchTST / iTransformer (单模态 1D 确定性回归)', metric: 'MSE: 0.268 · 无法输出概率分布', percent: 76, highlight: false },
          { name: 'Raw-Concat VLM (未蒸馏直接拼接视觉与文本词元)', metric: 'MSE: 0.295 · 冗余噪声干扰主干', percent: 88, highlight: false }
        ]
      },
      rightPanel: {
        code: 'ABLATION 02',
        tag: '模块贡献度与推理延迟解耦',
        title: '核心模块消融实验与精度-效率帕累托前沿',
        visualKey: 'showcase.ablationPlot',
        ioFlow: ['+2D 周期图 (↓9.4%)', '+质心蒸馏 (↓8.1%)', '+原型流匹配 (↓7.1%)'],
        specs: [
          { tag: '质心蒸馏收益', text: '在降低 72% 跨模态计算开销的同时，因滤除背景噪声反令预测精度提升 8.1%', tone: 'blue' },
          { tag: '先验原型收益', text: '相比纯高斯噪声起点，合成先验原型使 ODE 仅需 5 步欧拉积分即可超越扩散模型 50 步效果', tone: 'teal' }
        ]
      },
      callout: {
        badge: '实验核心发现',
        text: '三路协同编码、质心自适应蒸馏与先验原型直线流匹配形成正向闭环，同时刷新确定性精度（MSE）与概率分布质量（CRPS）。',
        pills: ['MSE ↓ 24.6%', 'CRPS ↓ 31.8%', 'FLOPs ↓ 72%', '5-Step ODE']
      }
    },

    /* Slide 6: Matrix Layout */
    {
      id: 'showcase-06',
      sectionTag: 'LAYOUT 06 · SEMANTIC COMPARISON MATRIX SLIDE',
      navTitle: '语义矩阵页',
      layout: 'matrix-slide',
      title: '多维语义矩阵布局：主流预测范式全景能力对比',
      subtitle: '使用结构化状态胶囊（原生支持 / 局部受限 / 缺失）与行内数学公式，替代繁琐的文字罗列，一目了然展现方法代际优势。',
      phases: [
        { code: 'DIMENSION 01', title: '多源先验表征能力 (1D + 2D + Text)', summary: '输入视角完备度', span: 1, tone: 'sky' },
        { code: 'DIMENSION 02', title: '跨模态降噪与计算复杂度', summary: '信噪比与可扩展性', span: 1, tone: 'indigo' },
        { code: 'DIMENSION 03', title: '概率生成轨迹与采样效率', summary: '不确定性量化能力', span: 1, tone: 'blue' }
      ],
      columns: [
        '方法范式 / 代表模型',
        '内生跨周期 2D 纹理',
        '外生领域文本感知',
        '跨模态去噪与复杂度',
        '生成起点与轨迹形态',
        '多峰概率分布输出'
      ],
      rows: [
        {
          highlight: false,
          cells: [
            '1D 确定性回归 (PatchTST / DLinear)',
            { status: 'no', text: '✕ 缺失 (仅扁平 1D)' },
            { status: 'no', text: '✕ 缺失 (纯数值输入)' },
            { status: 'mid', text: '— 无跨模态交互' },
            '单点 MSE 均值回归',
            { status: 'no', text: '✕ 抹平多峰分布' }
          ]
        },
        {
          highlight: false,
          cells: [
            '周期折叠确定性模型 (TimesNet)',
            { status: 'yes', text: '✓ FFT 2D 卷积核' },
            { status: 'no', text: '✕ 缺失外部文本语境' },
            { status: 'mid', text: '△ 缺少预训练视觉先验' },
            '单点 MSE 均值回归',
            { status: 'no', text: '✕ 无概率置信区间' }
          ]
        },
        {
          highlight: false,
          cells: [
            '直接拼接多模态模型 (Naive VLM-TS)',
            { status: 'mid', text: '△ 需外部额外配图' },
            { status: 'yes', text: '✓ 引入冻结文本特征' },
            { status: 'no', text: '✕ 词元冗余 $\\mathcal{O}(N \\cdot N_{\\text{raw}})$' },
            '直接线性映射输出',
            { status: 'no', text: '✕ 易受背景噪声发散' }
          ]
        },
        {
          highlight: false,
          cells: [
            '传统噪声扩散生成 (TimeGrad / CSDI)',
            { status: 'no', text: '✕ 仅 1D 条件去噪' },
            { status: 'no', text: '✕ 缺失文本事件制导' },
            { status: 'mid', text: '△ 逐步迭代开销高昂' },
            '纯白噪声 $\\mathcal{N}(0,I)$ 弯曲轨迹',
            { status: 'yes', text: '✓ 支持但需 50–100 步' }
          ]
        },
        {
          highlight: true,
          cells: [
            'Aurora (本文多模态原型流匹配框架)',
            { status: 'yes', text: '✓ 内生 FFT 折叠 + ViT' },
            { status: 'yes', text: '✓ 领域文本 + 质心蒸馏' },
            { status: 'yes', text: '✓ 质心压缩 $\\mathcal{O}(N \\cdot K)$' },
            '先验原型 $\\tilde{\\mathcal{P}}$ 零曲率直线流',
            { status: 'yes', text: '✓ 少步积分输出多峰 $\\hat{Y}$' }
          ]
        }
      ],
      callout: {
        badge: '范式代际跨越',
        text: 'Aurora 首次在单一统一架构内同时实现“三路内生/外生多模态协同”、“质心级低开销对齐”与“先验原型锚定直线流匹配生成”。',
        pills: ['6 大标准布局', '12+ 视觉语义组件', '支持一键套用新论文']
      }
    }
  ]
};
window.AuroraContent = window.PresentationContent;
