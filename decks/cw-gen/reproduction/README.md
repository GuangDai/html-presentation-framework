# CW-Gen 第 8–9 页的复现数据

第 8 页比较标准高斯先验基线 Raw 与接入联合均值和协方差估计器（Joint Mean–Covariance Estimator，JMCE）的 Full。第 9 页展示两项消融。A1 在 Weather 原版比较对角协方差 Diag 与完整协方差 Full。A2 在 ETTh1、ETTh2 和 Weather 原版比较直接从 JMCE 条件高斯采样的 Gaussian 与使用同一先验的 Full。

## 点预测怎么算

在 4090D 上从 `cwgen_v4_user_resume_20261114` 留存的 80 个 `evaluate.P.*` 测试目录读取 `samples.npz`。每个数组按测试起点、轨迹、预测时点和通道排列。首先在 100 条轨迹上取算术均值 `p`，再在该种子的全部测试起点、未来 192 步和全部通道上等权平均 `(p−y)²` 与 `|p−y|`，分别得到均方误差（Mean Squared Error，MSE）与平均绝对误差（Mean Absolute Error，MAE）。`y` 是测试真值。随后按组等权汇总 10 个配对种子。相对变化为 `100 × (Full 均值 / 对照均值 − 1)`。

每版数据以各自训练集拟合的均值和标准差标准化。跨 Weather 版本时使用 `common_scale_mse`、`common_scale_mae`，这两列将两版误差统一到 Weather 原版训练集标准差。历史长度为 168 步，测试起点步幅为 192。ETTh1 与 ETTh2 各用 15 个起点和 7 个通道，Weather 两版各用 54 个起点和 21 个通道。各方法的采样预算相同。Raw、Full 与 Diag 使用各自训练的生成器。Gaussian 直接采样，无新增生成器训练。

这次重算覆盖 240 条方法级记录、148,680 个起点与通道组合，以及 28,546,560 个方法级标量目标。240 条 MSE 与 MAE 均与原评估匹配，最大绝对差分别为 1.78 × 10⁻¹⁵ 和 4.44 × 10⁻¹⁶。

## 文件

| 文件 | 内容 |
| --- | --- |
| `metrics_by_seed.csv` | 240 条逐数据版本、骨干、种子、方法结果。包含重算的 MSE 和 MAE，以及原评估的连续排序概率得分（Continuous Ranked Probability Score，CRPS）和空间公平变分分数（Spatial Fair Variogram Score，VS）。 |
| `errors_by_origin_channel.csv.gz` | 148,680 行训练标准化尺度的点预测误差。每行保存一个种子、方法、测试起点和通道上的未来步数、平方误差和 `sse`、绝对误差和 `sae`。按所需范围汇总后，以总 `sse` 或总 `sae` 除以总 `time_steps` 可还原 MSE 或 MAE。 |
| `paired_summary.csv` | 8 个主实验组、2 个 A1 组、6 个 A2 组的均值、配对差值、相对变化和 Full 误差更低的种子个数。Weather 行额外含共同尺度的 MSE 和 MAE。 |
| `audit.json` | 80 项测试的实际起点、通道、数据和预测的 Git 对象标识、冻结检查点标识，以及与原评估的数值核对。 |
| `probabilistic_results.json` | 正式评估的 CRPS、各通道原始尺度 CRPS、空间 VS 和 16 个配对统计槽。保留原先的 Holm 校正与暂停的条件 FID（Conditional Fréchet Inception Distance，条件 Fréchet 分布距离）记录。 |
| `forecast_examples/` | 8 份 seed 0 首窗口的历史、真值与 Raw、Full 各 100 条轨迹，供绘图使用。`index.json` 给出数组尺度、时间、通道和文件来源。Weather 样例来自正式测试，ETT 样例来自较早的配对测试，按各自来源解读。 |

`forecast_examples/` 的 `Raw` 和 `Full` 维度均为 100 × 192 × 通道数，`history` 为 168 × 通道数，`truth` 为 192 × 通道数。ETT 数组可按 `值 × scaler_scale + scaler_mean` 恢复到源数据尺度。Weather 数组已还原。部分 Weather 源字段的单位含替换字符，索引保留原字段名。

## 更新与核对

```sh
# 4090D 或有完整存档的机器，使用含 NumPy 的 Python 环境
python recompute_point_metrics.py /path/to/cwgen_v4_user_resume_20261114 /path/to/new-output

# 将重算数据放入本目录后，刷新 HTML 中供第 8–9 页读取的表格
python build_slide_tables.py
python build_slide_tables.py --check
```

指标重算脚本依据复现项目 `CWGen_v4_execution` 的 `evaluate_p_formal.py` 和 `metrics.py`，跨版本 Weather 按原始测试行号及原始尺度真值核对。数据包的概率指标来自该项目的 `P_80_metrics_compact.json`，轨迹来自已留存的 `outputs/figures/`。完整的 80 份多轨迹预测档案保存在 4090D，当前目录收录逐起点逐通道误差与首窗口轨迹样例。

更新表格后，检查第 8–9 页的自然语言结论是否仍与数据一致，并重新导出到根目录的 PPTX、PDF 和 `rendered_cwgen_16x9/`。

## 解释边界

这是本地协议重建，Raw 历史训练材料有缺项，当前生成器使用本地条件输入和采样适配。测试集曾提前开放，结果按探索性比较解读。独立作者分支的 60 项密集测试已取消，概率评估中的条件 FID 已暂停。

ETTh2 的 Raw 误差较高，应同时阅读原值和相对变化。Weather 去重分段版调整了重复时间和跨缺口窗口。两版各 81 个 `−9999` 在训练时参与标准化和拟合，对预测的影响有待单独验证。
