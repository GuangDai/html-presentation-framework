# 研究组件使用与维护手册

[打开组件目录](index.html) · [框架 README](../README.md) · [第三方包与许可](vendor/README.md)

## 选择与搭建

1. 在浏览器打开 `research/index.html`。搜索“滑窗”“消融”“多通道”或 `attention` 等关键词，点选元素。每个元素都带有可运行的数据配置。
2. 修改下方 JSON，预览随输入更新。错误会显示在预览区，修正后即可继续。“恢复此示例”恢复当前组件的原始数据。
3. 要复用一个元素，点“复制组件”，粘到目标页的 `blocks` 数组。要同时搭配多个元素，依次点“加入组合”，再打开“我的组合”。每次加入会复制当时的组件数据，可重复加入同类元素。
4. 在组合中上移、下移或移除元素。可直接编辑整页 JSON，包括页标题、组件标题、数组中的观测值和来源。密度、强调色和栏宽属于页面配置，复制整页时一起带走。
5. 将“复制整页”的结果放入自己新稿 `decks/<论文目录>/content.js` 的 `slides` 数组。填写唯一的 `id`，缩短 `navTitle`，在框架入口用 `?deck=<论文目录>` 打开。第一次建稿可复制 `decks/paper-template/`，保留模板要求的三个脚本。

组件预览展示页面正文。窄屏会将预览排成单栏，演示入口使用框架的 1920 × 1080 舞台和真实页眉。较长表格、三块以上的组合，以及加长后的公式，可在正式入口核对投影字号和下边界。浏览器允许本地存储时会保存组件草稿和组合；要移到另一台机器，请复制配置到论文目录。各示例中的实验数值均为演示数据。

## 一张可直接粘贴的页面

下例把基线对照表放在宽栏，将指标定义放在窄栏。把 `rows` 换成实测记录即可复用。块中使用普通文本，公式块中的 `lines` 使用 TeX。

```json
{
  "id": "results-96",
  "layout": "research-slide",
  "title": "预测 96 步的误差对照",
  "navTitle": "实验对照",
  "arrange": "wide-left",
  "density": "normal",
  "accent": "teal",
  "blocks": [
    {
      "type": "comparison",
      "title": "均方误差",
      "direction": "lower",
      "rowLabel": "变量",
      "baselineLabel": "基线",
      "valueLabel": "对照",
      "digits": 3,
      "rows": [
        {"label": "温度", "baseline": 0.320, "value": 0.304},
        {"label": "湿度", "baseline": 0.400, "value": 0.414}
      ]
    },
    {
      "type": "definitions",
      "title": "评价口径",
      "items": [
        {"term": "MSE", "text": "均方误差，数值越低越好。"},
        {"term": "配对条件", "text": "两组使用相同预测起点和测试窗口。"}
      ]
    }
  ],
  "source": "示例数据，用于演示组件配置。"
}
```

### 页面字段

| 字段 | 可选值或含义 |
| --- | --- |
| `id`、`layout`、`title`、`navTitle` | 沿用框架页标识、布局名、投影标题和导航短标题。新布局名为 `research-slide`。 |
| `blocks` | 按阅读顺序排列的组件数组。双栏从左到右填充，再换行。单个组件占满整行。 |
| `arrange` | `stack` 纵排（默认）、`columns` 等宽双栏、`wide-left` 左宽、`wide-right` 右宽。非对称栏宽比为 1.65∶1。 |
| `density` | `normal` 标准、`compact` 紧凑、`large` 大字。作用于正文字号和间距。 |
| `accent` | `teal` 青绿、`blue` 靛蓝、`graphite` 石墨。调整版面线条和标签底色；序列和误差的颜色由图表语义控制。 |
| `source` | 可选页脚，适合填写论文图表编号、数据版本或实验记录路径。单个组件可用 `caption` 单独写来源或口径。 |

## 组件字段速查

每个块有一个 `type`，可选 `title` 和 `caption`。目录中的 JSON 就是作者接口，可整块复制。表中花括号表示一条记录的字段。

| 类型 | 主要输入 | 适用场景 |
| --- | --- | --- |
| `windows` | 正整数 `history, horizon, stride`，可选 `gap`（默认 0）、`count`（1–8，默认 3） | 滚动预测起点、历史窗、空档期与预测窗。长度均以时间步计，横轴从 0 开始。 |
| `split` | `unit`，`parts: [{label,count,note}]` | 训练、验证、测试的时间跨度或样本数。宽度和百分比按实际正数计算，所有段使用同一单位。 |
| `tensor` | `stages: [{name,axes: [{label,size}]}]` | 拆分、转置、合并前后的轴顺序。size 可填符号或实数值，同一轴在不同行使用相同标签。 |
| `diagram` | `lines` 为 nomnoml 连线数组，可选 `direction: "right" / "down"` 和 `description` | 分支、汇合、残差旁路、查询／键／值连接、原型检索。节点自动排布。 |
| `figure` | `src` 或 `visualKey`，以及 `alt` | 放入已有 SVG、PNG 或当前稿件注册的图形。相对 `src` 从框架根目录解析；`visualKey` 在对应稿件的演示入口解析，可使用原框架的点分键。 |
| `equation` | `lines` 为 TeX 数组，可选 `items: [{term,text}]` | 多行推导与符号表。每行一式，省略美元分隔符。数学块使用本地 KaTeX 输出 MathML，字形由浏览器和系统数学字体决定。 |
| `code` | `lines` 为字符串数组，可选 `language` 和 `focus` | 算法或伪代码。保留缩进并自动换行，`focus: [2,4]` 强调第 2、4 行。 |
| `table` | `headers`，等列数的 `rows`，可选 `numericColumns` | 张量形状、变量对齐、逐种子结果。数字列按从 0 开始的列号右对齐；固定精度的展示值可用字符串。 |
| `comparison` | `direction`，`rows: [{label,baseline,value}]` | 分步长复现、逐项消融。有原始基线时自动计算相对变化。 |
| `chart` | `mode`、`data`、`xLabel`、`yLabel` | 数值图、分面图、矩阵。各模式见下表。 |
| `definitions` | `items: [{term,text}]` | 符号、变量、协议、模块输入输出。 |
| `evidence` | `quote`，可选 `items: [{term,text}]` | 引文、观察、适用条件。可通过 `caption` 标注来源。 |

### 拓扑、公式与原图

- 每条连线写成 `[源] -> [目标]`。例如 `[查询投影] Q -> [注意力]` 和 `[键投影] K -> [注意力]` 会汇入同一个节点。用 `[<op>投影]`、`[<store>原型库]`、`[<out>输出]` 可分别表示算子、存储和输出。多次引用同一节点时保持名字一致。[nomnoml 语法](https://github.com/skanaar/nomnoml)
- 在 JSON 中用双反斜杠书写 TeX，如 `"\\hat{y}_t"`。编辑 JavaScript 配置文件时也可用 `String.raw` 模板字符串。长推导拆成多条 `lines`，定义紧接在公式下方。
- 图形需要人工指定端口、精确走线或保留原论文位置关系时，使用 `figure` 挂接已绘制的矢量图。论文专用图形继续放在该稿件的 `visuals.js`，目录中的通用块只保存引用。

### 实验表的计算口径

`comparison` 对每行分别计算 `100 × (value − baseline) / baseline`。以示例中的温度行为例，表中显示 **−5.00%**；湿度行为 **+3.50%**。原始指标使用中性文字，变化列保留正负号。颜色由原始指标的变动方向和 `direction` 决定，`lower` 用于误差、耗时等越小越好的指标，`higher` 用于越大越好的指标。显示时再舍入。

- 原始值使用 JSON 数字。缺测写 `null`，确实测得零值写 `0`。基线为零或任一侧缺测时，相对变化列显示横线。
- `rowLabel`、`baselineLabel`、`valueLabel` 控制列名。`digits` 控制普通数值的小数位数，默认为 3；变化列保留两位小数。
- 对准确率等指标，百分点差和相对百分比使用不同口径。要展示百分点差或作者报告的现成数据，可用 `table` 并标明单位。

### 图表模式

| `mode` | 每条观测 | 绘制规则 |
| --- | --- | --- |
| `line` | `{x,y,series?,channel?}` | 同系列按数值 x 排列。用 `y:null` 留出断点。提供 `channel` 后，每个变量单独成图，共享数值轴。 |
| `interval` | `{x,y,low,high,series?}` | 阴影连接上下界，实线绘制 y。作者提供分位数或区间端点，并在图注中写明含义。 |
| `scatter` | `{x,y,series?}` | 散点图，适合延迟与误差、参数量与精度等两个数值量。 |
| `bar` | `{x,y}` | x 为数值，y 为唯一类别。横条以零为起点，适合各阶段耗时。 |
| `range` | `{x,y,low,high}` | y 为类别，点为 x，横线为观测范围；要求 `low ≤ x ≤ high`。 |
| `heatmap` | `{x,y,value}` | x、y 为行列坐标，按首次出现顺序排列。颜色按数值大小变化，每格同时显示原值。适合遮罩、观测状态和小型矩阵。 |

`xDomain`、`yDomain` 可固定连续坐标范围，`colorDomain` 可统一多幅矩阵的色阶，格式均为两个递增数值组成的数组。对比不同实验时可设置相同范围。默认图幅为 800 × 370，通过 `width`、`height` 调整内部比例，长标签可加大 `marginLeft`。同图最多使用六个命名系列，通过点形和颜色区分。时间序列分面适合单位一致的通道。需要扩展新的坐标或图元时，可复用 Plot 的 marks、scales 和 facets。[Observable Plot](https://observablehq.com/plot/getting-started)

## 模块与扩展

| 路径 | 职责 |
| --- | --- |
| `research/catalog/{data,model,results}.js` | 按主题收纳目录条目、搜索词和独立示例数据。 |
| `research/catalog/registry.js` | 登记条目并检查 ID 是否重复。目录 ID 同时用于可收藏的预览地址，如 `research/index.html#attention`。 |
| `research/workbench.js`、`catalog.css` | 搜索、预览、编辑、临时组合、复制与目录界面。 |
| `research/components.js` | 页面排布、组件分派、表格与公式等通用元素。对普通文本转义，图形引用交由演示引擎解析。 |
| `research/charts.js`、`windows.js`、`tensors.js` | 数据坐标、分面与标记，以及滚动窗口的时间坐标和张量轴变换。 |
| `research/components.css` | 投影与目录共用的组件样式。所有样式限定在 `rs-` 前缀下。 |
| `research/load.js`、`vendor/` | 同步装载本地依赖和渲染器。正式入口在选定稿件含有研究页时加载。 |
| `research/assets/` | 可直接引用的通用图文件。稿件自有图片建议放在自己的 `decks/<名称>/` 目录。 |

**添加一个已有类型的示例。** 在对应的 `catalog/*.js` 中添加一条 `[唯一ID, 显示名, 搜索词, block]`。例如，为新的指标添加 `comparison` 示例只需修改数据和 `direction`。目录与正式页调用同一套组件渲染器。

**添加一种新元素。** 在 `components.js` 的 `renderers` 表登记类型，较独立的绘图逻辑可放到单独文件并在 `load.js` 中按依赖顺序加载。图表模式放在 `charts.js`。在 `components.css` 定义组件样式，提供一个能直接复制的目录条目，并更新上面的字段表。

**局部微调。** 若一页需要单独改变字号和图高，可在自己的样式表中用页面 ID 限定范围，并在组件样式之后加载。图表坐标文字使用 SVG 内部坐标，调整图幅宽高会影响最终投影比例。

```css
#results-96 .rs-sheet {
  --rs-size: 26px;
  --rs-space: 1.2em;
  --rs-pad: 0.8em;
  --rs-figure-height: 440px;
}
```

原框架的 `contrast-slide`、`architecture-slide`、`pipeline-slide`、`bento-slide`、`benchmark-slide`、`matrix-slide` 和 `canvas-slide` 仍适合直接复用完整页面结构。流程页的阶段条、输入／算子／输出条和公式映射链可从既有展示例复制；同一稿件也可以混排研究组件页。[原有布局示例](../index.html?deck=component-showcase)


修改组件后，可在浏览器打开[离线回归检查](../scripts/check-research.html)。页面遍历全部目录条目，并核对变化率、缺测断线、多通道分面和代码文本转义。
