# CW 与 w/o CW 的结果和轨迹

演示第 8 页将 FlowTS 和 Diffusion-TS 分开，分别对照 CW 与 w/o CW 的 MSE、MAE。第 9 页用 `ETTh1_ETTh2_all_models_28channels.pdf` 对应的原始数组重绘四个轨迹示例。

## 结果数据

| 文件 | 内容 |
| --- | --- |
| `main_metrics.csv` | 4 个数据版本 × 2 个生成骨干 × 2 种方法，共 16 行汇总值。 |
| `paired_summary.csv` | 8 组的 CW 与 w/o CW 汇总值、差值和相对变化。 |
| `errors_by_origin_channel.csv.gz` | 9,912 行按数据版本、骨干、方法、起点和变量汇总的误差。每行的 `sse`、`sae` 分别是平方和绝对误差之和，除以 `target_count` 得到对应的 MSE、MAE。 |
| `audit.json` | 测试数、标量目标数、各数据版本的起点和通道，以及与保存指标的数值核对。 |

归档中的 `Full` 对应 CW，`Raw` 对应 w/o CW。重算读取 4090D 上 `cwgen_v4_user_resume_20261114` 中的 80 个正式测试目录。每个起点的 100 条预测轨迹先取均值，再用训练集标准化后的真值计算均方误差（Mean Squared Error，MSE）和平均绝对误差（Mean Absolute Error，MAE）。每组等权汇总 10 个配对种子。跨 Weather 版本可用 `common_scale_mse`、`common_scale_mae`，两列都使用 Weather 原版的训练集标准差。

重算使用已有预测。160 个方法评估的 MSE、MAE 与保存指标的最大绝对差分别为 1.78 × 10⁻¹⁵、4.44 × 10⁻¹⁶。本地生成器使用项目的条件输入和采样适配，测试集曾提前开放，结果按探索性比较解读。

Weather(修改版) 对应 `Weather_deduplicated_segmented`。2020-05-12 06:00 的两条相同记录保留一条，数据从 52,696 行减至 52,695 行，时间戳集合一致。原数据在 2020-05-29 09:30 与 11:10 的两条记录之间缺 9 个采样点，采样间隔为 10 分钟。修改版排除了 359 个从历史起点到预测终点跨过该缺口的训练窗口。按异常值删除的时间点为 0 个，两版训练数据各有 81 个 `−9999` 值参与标准化和训练。

## 轨迹数据

`forecast_examples/index.json` 索引了 8 份首窗口数组。每份保存同一窗口的观测历史、真实未来及两种方法各 100 条轨迹。`Raw` 和 `Full` 的维度为 100 × 192 × 通道数。`history` 和 `truth` 分别对应 168 和 192 个时点。ETT 数组乘 `scaler_scale` 再加 `scaler_mean` 可恢复原始数据尺度，Weather 数组已还原。

第 9 页从图册的四个数据集与骨干组合中各选一个误差下降明显的变量，绘制算术均值轨迹。图册的 ETT 样例来自早期配对测试，图中样例用于观察轨迹形态，第 8 页的均值来自正式测试。`forecast_examples/selected_window_metrics.csv` 保存四张图对应窗口的原始尺度误差，`forecast_comparison.svg` 是可单独打开的矢量图。

## 更新方法

```sh
# 使用带 NumPy 的 Python，从正式存档写入一个新目录
python recompute_point_metrics.py /path/to/cwgen_v4_user_resume_20261114 /path/to/new-output

# 将新数据复制到本目录，刷新演示表格
python build_slide_tables.py
python build_slide_tables.py --check

# 用 NumPy、Matplotlib 和中文字体重绘第 9 页
python plot_forecast_examples.py --font /path/to/NotoSansCJK-Regular.ttc
```
