/**
 * ============================================================================
 * @file decks/decomp-dbloss/content.js
 * @description Content & Structure Configuration for DecompNet & DBLoss
 *              7-Slide Graphical Presentation (16:9 Widescreen).
 * ============================================================================
 */

window.PresentationContent = {
  deckMeta: {
    documentTitle: '分解趋势与季节性：DecompNet 与 DBLoss (16:9 Presentation)',
    defaultAnimSpeed: 'normal',
    homeSlide: 0,
    homeButtonLabel: '⊞ 结构总览 (P1)',
    homeButtonTitle: '返回第 1 页双论文抽象结构总览 (快捷键: M)',
    tocSubtitle: '点击章节直达对应页面 · 键盘左右方向键或数字键 1–7 快速翻页',
    title: 'DecompNet & DBLoss',
    subtitle: '时间序列趋势与季节性分解的两种范式 (NeurIPS 2025)'
  },

  slides: [
    {
      id: 'slide-01',
      slideNumber: 1,
      navTitle: '抽象结构总览',
      layout: 'canvas-slide',
      title: '分解趋势与季节性：DecompNet 与 DBLoss',
      subtitle: '',
      visualKey: 'slide1.overview'
    },
    {
      id: 'slide-02',
      slideNumber: 2,
      navTitle: 'DecompNet',
      layout: 'canvas-slide',
      title: 'DecompNet：解耦训练与参数融合（无法复现）',
      subtitle: '',
      visualKey: 'slide2.decompnet'
    },
    {
      id: 'slide-03',
      slideNumber: 3,
      navTitle: 'DBLoss',
      layout: 'canvas-slide',
      title: 'DBLoss：输出端 EMA 分解与尺度对齐损失（提升显著）',
      subtitle: '',
      visualKey: 'slide3.dbloss'
    },
    {
      id: 'slide-04',
      slideNumber: 4,
      navTitle: '论文结果',
      layout: 'canvas-slide',
      title: '论文结果：基线与 DBLoss',
      subtitle: '',
      visualKey: 'slide4.paperResults'
    },
    {
      id: 'slide-05',
      slideNumber: 5,
      navTitle: '范数组合',
      layout: 'canvas-slide',
      title: '范数组合消融（本地复现）',
      subtitle: '',
      visualKey: 'slide5.normResults'
    },
    {
      id: 'slide-06',
      slideNumber: 6,
      navTitle: '分解算子',
      layout: 'canvas-slide',
      title: '分解算子消融（本地复现）',
      subtitle: '',
      visualKey: 'slide6.operatorResults'
    },
    {
      id: 'slide-07',
      slideNumber: 7,
      navTitle: '复现反思',
      layout: 'canvas-slide',
      title: '复现反思',
      subtitle: '',
      blank: true
    }
  ]
};
window.AuroraContent = window.PresentationContent;
