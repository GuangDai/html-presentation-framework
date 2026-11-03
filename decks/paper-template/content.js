// 复制本目录，填写论文内容后，在 decks/active.js 中切换目录名。
window.PresentationContent = {
  deckMeta: {
    documentTitle: '论文标题 — 学术演示',
    defaultAnimSpeed: 'normal',
    homeSlide: 1, // 可删除；索引从 0 开始
    homeButtonLabel: '⊞ 方法总览 (P2)',
    tocSubtitle: '点击章节直达对应页面 · 按 M 键返回方法总览'
  },
  slides: [
    {
      id: 'slide-01', navTitle: '问题与贡献', layout: 'contrast-slide',
      title: '研究问题与贡献', subtitle: '用一两句话概括本页内容。',
      connectors: ['⬇ 对应方法一', '⬇ 对应方法二', '⬇ 对应方法三'],
      challengesSection: { headerTag: '研究问题', cards: [
        { code: '问题 01', title: '问题一', visualKey: 'example.diagram', points: ['描述问题及其条件。'] },
        { code: '问题 02', title: '问题二', visualKey: 'example.diagram', points: ['描述现有方法的局限。'] },
        { code: '问题 03', title: '问题三', visualKey: 'example.diagram', points: ['描述尚未解决的困难。'] }
      ] },
      contributionsSection: { headerTag: '研究贡献', cards: [
        { code: '贡献 01', title: '方法一', visualKey: 'example.diagram', jumpToSlide: 1, points: ['解释对应的解决方法。'] },
        { code: '贡献 02', title: '方法二', visualKey: 'example.diagram', points: ['说明方法的作用。'] },
        { code: '贡献 03', title: '方法三', visualKey: 'example.diagram', points: ['说明主要结果。'] }
      ] }
    },
    {
      id: 'slide-02', navTitle: '方法总览', layout: 'architecture-slide',
      title: '方法总览', subtitle: '概括方法的主要模块及其关系。',
      bandWeights: [1, 1], // 按比例分配上下两层的可用高度
      encoderBand: { bandTag: '上层模块', visualKey: 'example.diagram' },
      decoderBand: { bandTag: '下层模块', visualKey: 'example.diagram' }
    },
    {
      id: 'slide-03', navTitle: '处理流程', layout: 'pipeline-slide',
      title: '处理流程', subtitle: '说明输入如何经过各步骤得到输出。',
      steps: [
        { stepCode: '步骤 01', title: '输入', theme: 'blue', visualKey: 'example.diagram', caption: '准备输入数据。', chainOp: '输入映射', chainLatex: ['x \\in \\mathbb{R}^{d}'], chainDim: '\\mathbb{R}^{d}' },
        { stepCode: '步骤 02', title: '处理', theme: 'purple', visualKey: 'example.diagram', caption: '提取所需特征。', chainOp: '特征变换', chainLatex: ['h = f(x)'], chainDim: '\\mathbb{R}^{d} \\to \\mathbb{R}^{k}' },
        { stepCode: '步骤 03', title: '输出', theme: 'emerald', visualKey: 'example.diagram', caption: '生成最终结果。', chainOp: '输出映射', chainLatex: ['y = g(h)'], chainDim: '\\mathbb{R}^{k} \\to \\mathbb{R}^{m}' }
      ]
    }
  ]
};
