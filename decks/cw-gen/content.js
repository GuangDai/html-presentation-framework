/**
 * ============================================================================
 * @file decks/cw-gen/content.js
 * @description Content & Structure Configuration for CW-Gen (ICLR 2026)
 *              12-Slide Graphical Presentation (16:9 Widescreen).
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
      title: '理论分析（一）',
      subtitle: '',
      visualKey: 'slide3.theory1'
    },
    {
      id: 'slide-04',
      slideNumber: 4,
      navTitle: '理论分析 (二)',
      layout: 'canvas-slide',
      title: '理论分析（二）',
      subtitle: '',
      visualKey: 'slide4.theory2'
    },
    {
      id: 'slide-05',
      slideNumber: 5,
      navTitle: 'JMCE 总览',
      layout: 'canvas-slide',
      title: 'JMCE 总览',
      subtitle: '',
      visualKey: 'slide5.jmce'
    },
    {
      id: 'slide-06',
      slideNumber: 6,
      navTitle: '滑窗协方差',
      layout: 'canvas-slide',
      title: 'Sliding Window 算法',
      subtitle: '',
      visualKey: 'jmce.slidingWindow'
    },
    {
      id: 'slide-07',
      slideNumber: 7,
      navTitle: 'JMCE 损失',
      layout: 'canvas-slide',
      title: 'JMCE 训练流程与 Loss',
      subtitle: '',
      visualKey: 'jmce.trainingFlow'
    },
    {
      id: 'slide-08',
      slideNumber: 8,
      navTitle: 'CW-Diff',
      layout: 'canvas-slide',
      title: 'CW-Diff',
      subtitle: '',
      visualKey: 'slide8.cwdiff'
    },
    {
      id: 'slide-09',
      slideNumber: 9,
      navTitle: 'CW-Flow',
      layout: 'canvas-slide',
      title: 'CW-Flow',
      subtitle: '',
      visualKey: 'slide9.cwflow'
    },
    {
      id: 'slide-10',
      slideNumber: 10,
      navTitle: '误差对比',
      layout: 'canvas-slide',
      title: 'w/o CW 与 CW 的 MSE、MAE 对比',
      subtitle: '',
      visualKey: 'slide10.exp1'
    },
    {
      id: 'slide-11',
      slideNumber: 11,
      navTitle: '预测轨迹',
      layout: 'canvas-slide',
      title: 'ETTh1 与 ETTh2 的预测轨迹示例',
      subtitle: '',
      visualKey: 'slide11.exp2'
    },
    {
      id: 'slide-12',
      slideNumber: 12,
      navTitle: '个人分析',
      layout: 'canvas-slide',
      title: '个人分析',
      subtitle: '',
      visualKey: 'personal.analysis'
    }
  ]
};
window.AuroraContent = window.PresentationContent;
