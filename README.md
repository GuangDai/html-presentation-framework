# 学术论文 16:9 HTML 演示框架

默认演示是 Aurora 论文汇报。通用布局、样式和交互与论文素材分开存放；切换论文只需在 `decks/active.js` 修改目录名。页面使用 1920×1080 舞台，提供对比页、双层架构页、流程公式页及三种扩展布局，支持目录、键盘翻页与动画。

## 目录和职责

```text
index.html                  通用页面入口、公式引擎和演示控件
css/variables.css           设计变量（部分颜色也写在 layout.css 和 SVG 中）
css/layout.css              舞台、页面及控件布局和样式
css/components.css          阶段条和扩展布局组件样式
css/typography.css          PPT 物理字号对应的页面字号
css/animations.css          动画预设
js/slide-layouts.js         六种页面的 HTML 结构
js/visual-components.js     阶段条和扩展布局的组件构建器
js/presentation-variants.js A、B、C 版式配置与分页计算
js/presentation-engine.js   渲染、公式、区域等高和交互
decks/active.js             当前论文目录选择
decks/aurora/               Aurora 论文素材
  content.js                页面文字、公式、图形引用和导航配置
  visuals.js                论文专用 SVG 图形
  math-cache.js             Aurora 公式的离线 SVG 缓存
decks/paper-template/       可复制的新论文模板，含上述三个文件
decks/component-showcase/   六种布局的展示示例
scripts/build_math_cache.py 生成离线公式缓存（需本机 TeX 工具）
rendered_slides_16x9/       Aurora 当前导出 PNG
```

根目录中的 PDF、PPTX 与 `rendered_slides_16x9/` 中的 PNG 是默认 A 版式的导出结果，不会随源码修改自动更新。PPTX 每页包含一张完整的幻灯片图片。本仓库没有附带导出脚本。

## 新建和切换论文

1. 复制 `decks/paper-template/`，将副本改名为论文目录，例如 `decks/my-paper/`。目录名只使用英文字母、数字、连字符或下划线。
2. 修改该目录的 `content.js`：填写论文标题、页面文字、公式与导航。按需复制或删减 `slides` 数组中的页面。
3. 修改该目录的 `visuals.js`：用论文专用 SVG 替换示例图形，并让内容中的 `visualKey` 与图形键名一致。图内文字、连线和颜色都属于图形素材。
4. 模板的 `math-cache.js` 带有示例公式缓存；如需离线显示新论文公式，可为新公式添加对应 SVG，或使用 `scripts/build_math_cache.py` 生成缓存。它是每个论文目录都需要保留的文件。
5. 将 `decks/active.js` 中的 `defaultDeck` 改成 `my-paper`，然后用浏览器打开或刷新 `index.html`。恢复 Aurora 时把目录名改回 `aurora`。

也可通过 URL 参数 `?deck=目录名` 临时切换演示，或按 D 打开演示库选择。每个目录的三个脚本会按 `math-cache.js`、`visuals.js`、`content.js` 的顺序同步加载，然后由通用布局和引擎渲染。复制模板时保留三个文件，即使某个文件暂时为空。`active.js` 使用浏览器解析阶段的 `document.write` 加载脚本，应通过 `index.html` 的普通同步 `<script>` 引用，不要添加 `async` 或 `defer`。

## 内容格式

`content.js` 定义 `window.PresentationContent = { deckMeta, slides }`。模板提供六种页面的可编辑示例；Aurora 的完整实例在 `decks/aurora/content.js`。

### A、B、C 版式

演示右下角的“版式 A／B／C”控件可切换版式，默认 A。也可在页面 URL 后使用 `?style=A`、`?style=B` 或 `?style=C`，并与 `?deck=` 参数组合使用：例如 `?deck=aurora&style=B`。

- A：每页最多七步，Aurora 为 7 页。
- B：每页最多四步，Aurora 为 9 页。
- C：每页最多三步，Aurora 为 13 页。

三个版式读取同一份内容、图形和样式；修改论文数据后自动体现在所有版式中。分页按步骤顺序计算，目录会列出分页后的页面；总架构图和卡片链接仍以原页面索引为目标，切换版式后会跳到对应的第一页。各版式的步骤上限和默认值在 `js/presentation-variants.js` 修改；`design-previews/` 是本机生成的预览，不属于配置。

### 演示配置

- `deckMeta.documentTitle`：浏览器标签标题。
- `defaultAnimSpeed`：`off`、`fast`、`normal` 或 `slow`，默认 `normal`。
- `homeSlide`：可选的总览页索引，从 0 开始。配置有效索引后显示总览按钮，M 和 Home 键跳转至该页；省略则隐藏按钮。
- `homeButtonLabel`、`homeButtonTitle`、`tocSubtitle`：可选的按钮和目录文字。
- `slides`：按展示顺序排列的页面数组。每页填写唯一的 `id`、`layout`、`title`、`subtitle`，可选 `navTitle`。方向键和目录适用于全部页面；数字键 1–9 对应前九页；超过七页时，页眉显示当前页附近最多七项，完整目录仍可访问全部页面。

### 页面布局

- `contrast-slide`：上下两组卡片分别放在 `challengesSection`、`contributionsSection`，每组包含 `headerTag` 和 `cards`。卡片填写 `code`、`title`、`visualKey`、`points`；下组卡片可选 `jumpToSlide`，值为零起始页码。可选的 `connectors` 数组控制两组之间的说明文字。优先使用 `points` 作为模块说明，没有 `points` 时使用 `diagnostics`；每组按卡片数自动计算列数，单行最多七列，超过后换行；连接文字也按数量分列。
- `architecture-slide`：`encoderBand` 和 `decoderBand` 各包含 `bandTag` 与 `visualKey`。这两个字段名沿用 Aurora 示例，可以填写其他论文的上下两组模块。可选 `bandWeights: [上层比例, 下层比例]` 按比例分配可用高度；省略时沿用 Aurora 的固定比例。
- `pipeline-slide`：`steps` 数组的每一项包含 `stepCode`、`title`、`theme`、`visualKey`、`caption`、`chainLatex`、`chainDim`。`chainLatex` 使用字符串数组，一项显示一行；原有 `chainOp` 字段不会显示。优先使用 `caption` 作为模块说明，没有 `caption` 时使用 `ioFlow` 和 `specs`；可选 `phases` 展示阶段编号与标题，`summary` 不显示。列数默认按步骤数计算，单行最多七列；也可用 `cols` 指定每行列数，超出时换行。对应公式按相同列数排列，同一行的卡片区域分别等高。内容过多时受固定画布高度和字号限制，应拆成多页或精简文字，框架不会自动分页或改写内容。可用主题名为 `blue`、`indigo`、`teal`、`purple`、`amber`、`rose`、`emerald`。

`bento-slide`、`benchmark-slide` 和 `matrix-slide` 的字段示例见 `decks/paper-template/content.js` 与 `decks/component-showcase/content.js`。这些扩展布局使用 `visual-components.js` 中的组件。

正文行内公式用 `$...$`；JavaScript 字符串中的 TeX 反斜杠写成 `\\`。长公式或多个公式应拆成多行，避免溢出。内容和 SVG 均作为 HTML 插入，因此只能使用可信来源。

### 图形和离线公式

`visuals.js` 定义 `window.PresentationVisuals`，将图形键映射到 SVG 字符串；`visualKey` 支持完整字符串键或嵌套对象路径。SVG 中可使用带 `latex-formula` 类和 `data-latex` 属性的元素渲染公式，参见 Aurora 图形库。

公式优先使用在线 KaTeX 或 MathJax；两者不可用时查找 `window.PresentationMathSvgs` 中的缓存，缓存也不存在时显示原始 TeX。Aurora 的缓存沿用 `window.AURORA_MATH_SVGS`，引擎兼容该旧名称。新论文的空缓存不会自动生成新公式 SVG。

## PPT 字号与页面尺寸

舞台固定为 1920×1080，导出的 PPT 页面宽 13⅓ 英寸、高 7½ 英寸，故 2 个舞台 CSS 像素对应 PPT 的 1 磅。`css/variables.css` 中字号分别为标题 18 磅（36 px）、正文及图表主标注 10 磅（20 px）和图表次标注 8 磅（16 px）。`css/typography.css` 将这些字号应用于页面文字和数学区域。

SVG 图形按画布等比缩放，其内部文字不自动遵循舞台字号；复杂图形尤其是多列页面的图内标签仍需要逐图重新排版，才能达到 8 或 10 磅。三个版式共享同一份正式演示数据。

## 修改通用外观与功能

- 颜色、字号和尺寸变量：`css/variables.css`。部分颜色、布局规则和 SVG 颜色仍直接写在 `css/layout.css` 或各论文的 `visuals.js`，更换整套配色时也需检查这些位置。
- 间距、网格、卡片和舞台：`css/layout.css`；动画：`css/animations.css`。
- 页面结构：`js/slide-layouts.js`；DOM 组装、等高、公式和导航：`js/presentation-engine.js`。新增布局还需在引擎的 `renderAllSlides` 中注册。

原有 `window.AuroraContent`、`window.AuroraVisuals`、`window.AuroraEngine` 和 `window.auroraApp` 仍受支持。修改既有 Aurora 演示时还应遵循 [AGENTS.md](./AGENTS.md) 的算法和排版规范；其中关于 Aurora 的数据流和图形规则针对该论文，不应套用为其他论文的事实。
