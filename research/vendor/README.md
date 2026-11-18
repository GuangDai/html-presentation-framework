# 离线渲染依赖

以下脚本直接取自 npm 对应版本的 `dist/` 目录。目录和正式演示均以普通脚本方式加载，作者机器上无需安装 Node.js 或运行打包器。

| 包 | 版本 | 发布文件 | 在组件库中的职责 |
| --- | --- | --- | --- |
| d3 | 7.9.2 | d3.min.js | Observable Plot 使用的比例尺、坐标轴和图形运算。[D3](https://d3js.org/) |
| @observablehq/plot | 0.6.19 | plot.umd.min.js | 折线、区间、散点、分面与矩阵的 SVG 渲染。[Plot 文档](https://observablehq.com/plot/getting-started) |
| graphre | 0.1.3 | graphre.js | nomnoml 的有向图分层布局。[graphre](https://github.com/skanaar/graphre) |
| nomnoml | 1.7.0 | nomnoml.js | 从文本描述生成带分支、箭头、边标签的 SVG。[nomnoml 语法](https://github.com/skanaar/nomnoml) |
| katex | 0.16.11 | katex.min.js | 将研究组件内的 TeX 公式转换为浏览器原生 MathML。[KaTeX 输出选项](https://katex.org/docs/options.html) |

D3 和 Plot 使用 ISC 许可，graphre、nomnoml 和 KaTeX 使用 MIT 许可。上游发布包及所用依赖的许可文本汇集在 [LICENSES.txt](LICENSES.txt)。

在此目录执行 `sha256sum -c SHA256SUMS` 可验证脚本内容。升级时用 `npm pack 包名@精确版本` 获取发布包，从归档的 `package/dist/` 取同名文件，核对其依赖版本、加载顺序及许可文本，再更新本表和 SHA256SUMS。用组件目录检查多通道分面、带边标签的图和多行公式，最后用一张包含两种组件的研究页检查正式演示入口。
