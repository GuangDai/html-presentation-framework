# AURORA (ICLR 2026) · 模块化 16:9 HTML 演示与多路架构可视化框架

本项目围绕 **《AURORA: Towards Universal Generative Multimodal Time Series Forecasting》 (ICLR 2026)** 构建，采用**内容数据、SVG 视觉图形库、CSS 样式令牌与渲染引擎四层彻底解耦**的标准前端工程结构。详细的开发规范与视觉校验守则请参阅项目根目录下的 **[`AGENTS.md`](./AGENTS.md)**。

## 📁 目录结构

```text
aurora_html_framework/
├── index.html                        # 标准 HTML5 主入口（引入 KaTeX v0.16.11 与 MathJax v3.2.2）
├── AGENTS.md                         # AI Agent 与开发者全局工程规范与视觉校验指南
├── README.md                         # 项目目录与使用说明
├── css/
│   ├── variables.css                 # 全局颜色令牌、字号阶梯、间距与卡片阴影变量
│   ├── layout.css                    # 16:9 舞台、双层多路架构图、流程卡片与底部紧凑多行公式链布局
│   └── animations.css                # 基于 data-anim-speed 的无耦合动画样式表
├── js/
│   ├── slide-content.js              # 【纯内容数据层】7 页幻灯片文本与多行 TeX 映射链配置
│   ├── visuals-library.js            # 【纯矢量图形层】多路架构图与各步骤抽象几何 SVG 库
│   └── presentation-engine.js        # 【渲染与交互引擎】DOM 组装、动态等高对齐、公式排版与快捷键控制
├── rendered_slides_16x9/             # 16:9 (3840×2160 2x Retina) 渲染导出的高清幻灯片 PNG
│   ├── slide_01.png ~ slide_07.png
├── Aurora_Presentation_16x9.pdf      # 由 16:9 渲染图生成的标准宽屏 PDF 演示文稿
└── Aurora_Presentation_16x9.pptx     # 由 16:9 渲染图生成的标准宽屏 PowerPoint 演示文稿
```
