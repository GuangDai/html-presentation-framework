/**
 * ============================================================================
 * @file decks/paper-template/content.js
 * @description Comprehensive 6-Layout Reusable Scaffold Template for New Papers.
 *              Copy `decks/paper-template/` to `decks/your-paper/` and switch
 *              `decks/active.js` (or open `?deck=your-paper`).
 * ============================================================================
 */

window.PresentationContent = {
  deckMeta: {
    documentTitle: '论文标题 — 现代白蓝 16:9 学术演示模板',
    defaultAnimSpeed: 'normal',
    homeSlide: 1,
    homeButtonLabel: '⊞ 方法总览 (P2)',
    homeButtonTitle: '返回第 2 页方法总览 (快捷键: M)',
    tocSubtitle: '点击章节直达对应页面 · 支持 6 大标准布局与结构化视觉语义组件'
  },

  slides: [
    /* 1. Contrast Slide Template */
    {
      id: 'template-01',
      sectionTag: 'PART 01 · 问题诊断与核心贡献',
      navTitle: '问题与贡献',
      layout: 'contrast-slide',
      title: '研究背景：现有方法瓶颈与本文核心突破',
      subtitle: '上层剖析现有方案的三个核心痛点（成因 ➔ 后果），下层一一对应展示本文提出的创新机制与量化收益。',
      connectors: [
        '⬇ 对应突破机制一',
        '⬇ 对应突破机制二',
        '⬇ 对应突破机制三'
      ],
      challengesSection: {
        headerTag: '现有方法的固有局限',
        guideHint: '诊断维度：表征能力 · 计算开销 · 泛化边界',
        cards: [
          {
            code: '局限 01',
            roleBadge: '痛点维度一',
            title: '现有方法在维度一上的核心痛点标题',
            visualKey: 'template.problem',
            diagnostics: [
              { badge: '表层成因', text: '简明扼要描述现有假设的不足', outcome: '导致后果一' },
              { badge: '深层瓶颈', text: '说明在复杂场景下的失效边界', outcome: '导致后果二' }
            ],
            footerChips: [
              { label: '传统假设', value: '静态单一视角' },
              { label: '性能瓶颈', value: '误差显著偏高' }
            ]
          },
          {
            code: '局限 02',
            roleBadge: '痛点维度二',
            title: '现有方法在维度二上的核心痛点标题',
            visualKey: 'template.problem',
            diagnostics: [
              { badge: '计算冗余', text: '特征序列未经过滤直接参与全局交互', outcome: '复杂度 O(N²)' },
              { badge: '分布偏移', text: '异构空间缺乏显式对齐桥梁', outcome: '优化难以收敛' }
            ],
            footerChips: [
              { label: '计算复杂度', value: 'O(N²)' },
              { label: '信噪比', value: '低' }
            ]
          },
          {
            code: '局限 03',
            roleBadge: '痛点维度三',
            title: '现有方法在维度三上的核心痛点标题',
            visualKey: 'template.problem',
            diagnostics: [
              { badge: '表达受限', text: '单点回归无法刻画不确定性分布', outcome: '丢失置信区间' },
              { badge: '推理缓慢', text: '多步迭代采样路径弯曲漫长', outcome: '延迟难以满足实时需求' }
            ],
            footerChips: [
              { label: '输出形式', value: '单点估计' },
              { label: '采样步数', value: '> 50 步' }
            ]
          }
        ]
      },
      contributionsSection: {
        headerTag: '本文方法的核心突破',
        guideHint: '点击卡片可跳转至对应精讲页',
        cards: [
          {
            code: '贡献 01',
            jumpLabel: '直达 P2 ↗',
            title: '针对局限一提出的创新表征架构',
            visualKey: 'template.solution',
            jumpToSlide: 1,
            diagnostics: [
              { badge: '创新机制', text: '引入多视角协同编码算子 $f_\\theta(x)$', outcome: '捕获完备先验' },
              { badge: '理论优势', text: '显式对齐跨尺度结构特征', outcome: '表征能力显著增强' }
            ],
            footerChips: [
              { label: '视角维度', value: '多路协同' },
              { label: '额外开销', value: '零外部依赖' }
            ]
          },
          {
            code: '贡献 02',
            jumpLabel: '直达 P3 ↗',
            title: '针对局限二提出的瓶颈压缩与引导算子',
            visualKey: 'template.solution',
            jumpToSlide: 2,
            diagnostics: [
              { badge: '特征提纯', text: '通过 $K$ 个可学习原型过滤背景冗余', outcome: '复杂度降至 O(NK)' },
              { badge: '动态引导', text: '生成相关性矩阵动态调制主干权重', outcome: '信噪比大幅提升' }
            ],
            footerChips: [
              { label: '计算复杂度', value: 'O(N·K), K≪N' },
              { label: '精度增益', value: '↑ 显著提升' }
            ]
          },
          {
            code: '贡献 03',
            jumpLabel: '直达 P5 ↗',
            title: '针对局限三提出的高效生成与优化范式',
            visualKey: 'template.solution',
            jumpToSlide: 4,
            diagnostics: [
              { badge: '先验锚定', text: '以结构化先验替代随机高斯白噪声起点', outcome: '缩短传输路径' },
              { badge: '快速收敛', text: '直线轨迹仅需少量几步数值积分', outcome: '兼顾精度与速度' }
            ],
            footerChips: [
              { label: '输出形式', value: '完整概率分布' },
              { label: '采样步数', value: '仅需 5 步' }
            ]
          }
        ]
      }
    },

    /* 2. Architecture Slide Template */
    {
      id: 'template-02',
      sectionTag: 'PART 02 · 系统整体架构',
      navTitle: '方法总览',
      layout: 'architecture-slide',
      title: '方法总览：上下双层核心模块拓扑',
      subtitle: '概括方法的主要数据流向、核心算子位置与输出表征形态，遵循“输入浅灰蓝、核心算子实心皇家蓝、输出信号青”的色彩规范。',
      bandWeights: [1, 1],
      encoderBand: {
        bandTag: '上层阶段 · 多源特征编码与表征对齐模块',
        metaPills: [
          { label: '输入源: 原始观测 x ∈ R^d', tone: 'sky' },
          { label: '核心算子: 特征编码器 Encoder', tone: 'blue' },
          { label: '阶段输出: 隐空间表征 h ∈ R^k', tone: 'teal' }
        ],
        visualKey: 'template.archUpper'
      },
      decoderBand: {
        bandTag: '下层阶段 · 条件解码与目标预测生成模块',
        metaPills: [
          { label: '条件输入: 融合表征 h ∈ R^k', tone: 'indigo' },
          { label: '核心算子: 条件解码器 Decoder', tone: 'blue' },
          { label: '最终输出: 预测结果 ŷ ∈ R^m', tone: 'teal' }
        ],
        visualKey: 'template.archLower'
      }
    },

    /* 3. Pipeline Slide Template */
    {
      id: 'template-03',
      sectionTag: 'PART 03 · 核心算法流水线',
      navTitle: '处理流程',
      layout: 'pipeline-slide',
      title: '分步算法流程：从输入校准到目标输出映射',
      subtitle: '结合顶部宏观阶段引导轨、中部几何流向图、结构化三节点语义条与底部数学张量演进坞，清晰拆解每一步算子。',
      cols: 3,
      phases: [
        { code: 'PHASE 01', title: '输入预处理与特征提取', summary: '消除量纲与噪声', span: 1, tone: 'sky' },
        { code: 'PHASE 02', title: '核心算子非线性变换', summary: '焦点模块高亮展示', span: 1, tone: 'blue' },
        { code: 'PHASE 03', title: '终端解码与输出还原', summary: '生成最终预测分布', span: 1, tone: 'teal' }
      ],
      steps: [
        {
          stepCode: 'STEP 01',
          role: '输入校准',
          title: '数据标准化与分块嵌入',
          theme: 'sky',
          visualKey: 'template.step1',
          ioFlow: ['原始输入 $x$', '标准化分块', '初始特征 $z_0$'],
          specs: [
            { tag: '输入条件', text: '接收任意尺度原始输入向量 $x \\in \\mathbb{R}^d$', tone: 'sky' },
            { tag: '操作性质', text: '消除量纲差异并映射至统一隐空间', tone: 'slate' }
          ],
          chainOp: '输入归一化与线性嵌入',
          chainLatex: [
            '\\tilde{x} = (x - \\mu) / \\sigma',
            'z_0 = \\tilde{x} W_{\\text{in}} + b_{\\text{in}}'
          ],
          chainDim: '\\mathbb{R}^{d} \\to \\mathbb{R}^{k}'
        },
        {
          stepCode: 'STEP 02',
          role: '核心算子',
          focal: true,
          title: '引导注意力特征变换',
          theme: 'blue',
          visualKey: 'template.step2',
          ioFlow: ['初始特征 $z_0$', '引导自注意力', '深层表征 $h$'],
          specs: [
            { tag: '核心创新', text: '引入先验引导矩阵调制注意力权重分布', tone: 'blue' },
            { tag: '残差演化', text: '经多层前馈网络与层归一化提取高阶特征', tone: 'indigo' }
          ],
          chainOp: '先验调制注意力变换',
          chainLatex: [
            'A = \\mathrm{Softmax}(Q K^\\top / \\sqrt{k}) \\odot M',
            'h = \\mathrm{LN}(z_0 + A V)'
          ],
          chainDim: '\\mathbb{R}^{k} \\to \\mathbb{R}^{k}'
        },
        {
          stepCode: 'STEP 03',
          role: '终端输出',
          title: '解码投影与量纲逆还原',
          theme: 'emerald',
          visualKey: 'template.step3',
          ioFlow: ['深层表征 $h$', '输出投影还原', '预测结果 $\\hat{y}$'],
          specs: [
            { tag: '目标映射', text: '将隐空间表征线性投影至目标输出空间', tone: 'teal' },
            { tag: '闭环还原', text: '结合缓存统计量恢复原始物理量纲', tone: 'sky' }
          ],
          chainOp: '目标空间映射与还原',
          chainLatex: [
            'u = h W_{\\text{out}}',
            '\\hat{y} = \\sigma \\cdot u + \\mu'
          ],
          chainDim: '\\mathbb{R}^{k} \\to \\mathbb{R}^{m}'
        }
      ]
    },

    /* 4. Bento Grid Slide Template */
    {
      id: 'template-04',
      sectionTag: 'PART 04 · 模块解构与理论性质',
      navTitle: '模块解构 (Bento)',
      layout: 'bento-slide',
      title: 'Bento 模块化网格：关键子模块与理论复杂度剖析',
      subtitle: '使用 12 列自由跨度的 Bento 卡片矩阵，灵活组合矢量架构图、三节点流向条与关键性质标签。',
      bentoCards: [
        {
          code: 'MODULE 01',
          tag: '时间复杂度 O(NK)',
          title: '子模块一：低秩瓶颈特征提纯机制',
          theme: 'blue',
          colSpan: 6,
          visualKey: 'template.solution',
          ioFlow: ['高维输入 $N$', '低秩投影 $K$', '紧凑表征 $K \\ll N$'],
          specs: [
            { tag: '理论保证', text: '将二次复杂度降低为随序列长度线性增长', tone: 'blue' },
            { tag: '降噪效应', text: '显式过滤无关背景词元，提升注意力聚焦度', tone: 'sky' }
          ]
        },
        {
          code: 'MODULE 02',
          tag: '零重训泛化',
          title: '子模块二：多尺度先验知识注入机制',
          theme: 'indigo',
          colSpan: 6,
          visualKey: 'template.solution',
          ioFlow: ['多源先验库', '余弦软检索', '动态锚点合成'],
          specs: [
            { tag: '先验字典', text: '涵盖多频率周期基元与多阶趋势基元', tone: 'indigo' },
            { tag: '自适应合成', text: '根据当前样本特征动态加权组合最优起点', tone: 'teal' }
          ]
        }
      ],
      callout: {
        badge: '核心理论性质',
        text: '各子模块满足端到端可微性，在保持单卡轻量化推理开销的同时显著拓宽模型泛化边界。',
        pills: ['端到端可微', '线性复杂度', '零样本迁移']
      }
    },

    /* 5. Benchmark Slide Template */
    {
      id: 'template-05',
      sectionTag: 'PART 05 · 实验评测与消融分析',
      navTitle: '实验评测',
      layout: 'benchmark-slide',
      title: '实验评测：主实验定量对比与核心组件消融验证',
      subtitle: '顶部汇总四项核心指标增益，左栏展示主流基线对比条，右栏展示消融实验分析。',
      kpis: [
        { label: '主指标误差 (MSE ↓)', value: '0.192', delta: '↓ 21.5% vs SOTA', tone: 'blue' },
        { label: '次指标误差 (MAE ↓)', value: '0.245', delta: '↓ 18.2% vs SOTA', tone: 'indigo' },
        { label: '参数规模 (Params)', value: '12.4M', delta: '轻量化架构', tone: 'sky' },
        { label: '推理吞吐率', value: '4.2×', delta: '显著优于扩散基线', tone: 'teal' }
      ],
      leftPanel: {
        code: 'MAIN RESULTS',
        tag: '标准基准数据集定量对比',
        title: '本文方法与主流基线模型误差对比',
        visualKey: 'template.archUpper',
        bars: [
          { name: 'Ours (本文完整方法)', metric: 'MSE: 0.192 · MAE: 0.245', percent: 40, highlight: true },
          { name: 'Baseline A (次优竞争基线)', metric: 'MSE: 0.245 · MAE: 0.299', percent: 68, highlight: false },
          { name: 'Baseline B (传统单模态基线)', metric: 'MSE: 0.280 · MAE: 0.335', percent: 84, highlight: false }
        ]
      },
      rightPanel: {
        code: 'ABLATION STUDY',
        tag: '逐模块移除消融实验',
        title: '各核心模块对最终性能的独立贡献度',
        visualKey: 'template.archLower',
        ioFlow: ['完整模型 (0.192)', '移除引导 (0.218)', '移除先验 (0.236)'],
        specs: [
          { tag: '模块一贡献', text: '移除特征提纯模块导致冗余干扰增加，误差上升 13.5%', tone: 'blue' },
          { tag: '模块二贡献', text: '移除先验原型起点导致生成轨迹变长，误差上升 22.9%', tone: 'teal' }
        ]
      },
      callout: {
        badge: '实验结论',
        text: '本文方法在全部评测基准上取得最优表现，且消融实验证实各创新模块缺一不可。',
        pills: ['全基准 SOTA', '消融验证完备', '推理高效']
      }
    },

    /* 6. Matrix Slide Template */
    {
      id: 'template-06',
      sectionTag: 'PART 06 · 方法范式全景对比',
      navTitle: '范式矩阵',
      layout: 'matrix-slide',
      title: '范式对比矩阵：本文方法与既有路线的多维特性对照',
      subtitle: '从表征视角、复杂度与输出形态等维度进行结构化横向对比。',
      phases: [
        { code: 'ASPECT 01', title: '输入表征完备性', summary: '多模态协同', span: 1, tone: 'sky' },
        { code: 'ASPECT 02', title: '计算效率与可扩展性', summary: '复杂度对比', span: 1, tone: 'indigo' },
        { code: 'ASPECT 03', title: '输出分布表达力', summary: '概率建模能力', span: 1, tone: 'blue' }
      ],
      columns: ['方法类别', '多源异构表征', '噪声过滤机制', '计算复杂度', '概率分布生成'],
      rows: [
        {
          highlight: false,
          cells: [
            '传统单模态方法',
            { status: 'no', text: '✕ 仅单一视角' },
            { status: 'mid', text: '— 无跨模态项' },
            '$\\mathcal{O}(N^2)$',
            { status: 'no', text: '✕ 仅单点均值' }
          ]
        },
        {
          highlight: false,
          cells: [
            '简单拼接多模态方法',
            { status: 'yes', text: '✓ 支持多模态' },
            { status: 'no', text: '✕ 缺失去噪机制' },
            '$\\mathcal{O}((N+M)^2)$',
            { status: 'no', text: '✕ 易受噪声干扰' }
          ]
        },
        {
          highlight: true,
          cells: [
            '本文方法 (Ours)',
            { status: 'yes', text: '✓ 内生+外生三路协同' },
            { status: 'yes', text: '✓ 质心自适应蒸馏' },
            '$\\mathcal{O}(N \\cdot K),\\; K \\ll N$',
            { status: 'yes', text: '✓ 高效直线流生成' }
          ]
        }
      ],
      callout: {
        badge: '总结与展望',
        text: '复制 decks/paper-template/ 即可快速构建兼具视觉秩序与学术深度的 16:9 演示文稿。',
        pills: ['结构清晰', '视觉统一', '开箱即用']
      }
    }
  ]
};
window.AuroraContent = window.PresentationContent;
