/**
 * ============================================================================
 * @file decks/cw-gen/content.js
 * @description Content & Structure Configuration for CW-Gen (ICLR 2026)
 *              10-Slide Graphical Presentation (16:9 Widescreen).
 *              Unified Notation: Input X \in R^{H \times d}, Target Y \in R^{L \times d}.
 * ============================================================================
 */

window.PresentationContent = {
  deckMeta: {
    documentTitle: '条件白化生成模型：CW-Gen (ICLR 2026)',
    defaultAnimSpeed: 'normal',
    homeSlide: 0,
    homeButtonLabel: '⊞ 框架总览 (P1)',
    homeButtonTitle: '返回第 1 页 CW-Gen 总体框架总览 (快捷键: M)',
    tocSubtitle: '点击章节直达对应页面 · 键盘左右方向键或数字键 1–9 快速翻页',
    title: 'CW-Gen (ICLR 2026)',
    subtitle: '条件均值与滑窗协方差先验引导的时间序列生成模型'
  },

  slides: [
    {
      id: 'slide-01',
      slideNumber: 1,
      navTitle: '总体架构',
      layout: 'canvas-slide',
      title: 'CW-Gen：条件白化生成模型 (ICLR 2026，预测任务)',
      subtitle: '',
      visualKey: 'slide1.overview'
    },
    {
      id: 'slide-02',
      slideNumber: 2,
      navTitle: '问题与创新',
      layout: 'canvas-slide',
      title: '面临的问题与创新',
      subtitle: '',
      visualKey: 'slide2.problems'
    },
    {
      id: 'slide-03',
      slideNumber: 3,
      navTitle: '理论分析 (一)',
      layout: 'canvas-slide',
      title: '理论分析（一）：从标准高斯到条件高斯参考分布',
      subtitle: '',
      visualKey: 'slide3.theory1'
    },
    {
      id: 'slide-04',
      slideNumber: 4,
      navTitle: '理论分析 (二)',
      layout: 'canvas-slide',
      title: '理论分析（二）：替换标准高斯的充分条件',
      subtitle: '',
      visualKey: 'slide4.theory2'
    },
    {
      id: 'slide-05',
      slideNumber: 5,
      navTitle: 'JMCE 总览',
      layout: 'canvas-slide',
      title: 'JMCE 总览：联合条件均值与滑窗协方差估计器',
      subtitle: '',
      visualKey: 'slide5.jmce'
    },
    {
      id: 'slide-06',
      slideNumber: 6,
      navTitle: 'CW-Diff',
      layout: 'canvas-slide',
      title: 'CW-Diff：条件白化扩散模型的训练与推理',
      subtitle: '',
      visualKey: 'slide6.cwdiff'
    },
    {
      id: 'slide-07',
      slideNumber: 7,
      navTitle: 'CW-Flow',
      layout: 'canvas-slide',
      title: 'CW-Flow：条件白化流匹配的训练与推理',
      subtitle: '',
      visualKey: 'slide7.cwflow'
    },
    {
      id: 'slide-08',
      slideNumber: 8,
      navTitle: '复现实验 (一)',
      layout: 'canvas-slide',
      title: '复现实验（一）',
      subtitle: '',
      visualKey: 'slide8.exp1'
    },
    {
      id: 'slide-09',
      slideNumber: 9,
      navTitle: '复现实验 (二)',
      layout: 'canvas-slide',
      title: '复现实验（二）',
      subtitle: '',
      visualKey: 'slide9.exp2'
    },
    {
      id: 'slide-10',
      slideNumber: 10,
      navTitle: '批判与分析',
      layout: 'canvas-slide',
      title: '批判与个人分析',
      subtitle: '',
      visualKey: 'slide10.critique'
    }
  ]
};
window.AuroraContent = window.PresentationContent;
