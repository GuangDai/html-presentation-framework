// Small, editable examples of input preparation. Counts describe these examples only.
(function () {
  const heat = [
    [1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 1, 1],
    [1, 0, 1, 1, 1, 0],
  ];
  ResearchCatalog.add('数据与时间轴', [
    [
      'windows',
      '滑动窗口',
      'rolling origin backtest lookback horizon gap 回测 切窗 预测长度',
      {
        type: 'windows',
        title: '多个预测起点的输入与目标',
        history: 96,
        horizon: 24,
        stride: 32,
        gap: 0,
        count: 3,
        caption: '横轴从零开始，各变量共用同一组时间边界。',
      },
    ],
    [
      'rolling-window',
      '插入已有图形',
      '切窗 stride horizon 输入窗 预测窗',
      {
        type: 'figure',
        title: '历史窗口与预测窗口',
        src: 'research/assets/rolling-window.svg',
        alt: '历史 6 步、预测 3 步。第二个窗口的起点后移 2 个时刻，全部变量同步移动。',
        caption: '步幅为 2。每个色块对应一个时刻，包含该时刻的所有变量。',
      },
    ],
    [
      'split',
      '时间顺序划分',
      'split train validation test 训练 验证 测试',
      {
        type: 'split',
        title: '按时间顺序划分序列',
        unit: '步',
        parts: [
          { label: '训练', count: 700, note: '拟合参数与缩放器' },
          { label: '验证', count: 150, note: '选择超参数' },
          { label: '测试', count: 150, note: '冻结后评估' },
        ],
        caption: '示例长度为 1,000 步。按目标时间归属划分窗口。',
      },
    ],
    [
      'missing-mask',
      '缺测掩码',
      'heatmap mask 缺失 多变量 热图',
      {
        type: 'chart',
        mode: 'heatmap',
        title: '各通道的观测状态',
        xLabel: '时间步',
        yLabel: '变量',
        data: heat.flatMap((row, i) =>
          row.map((value, j) => ({ x: j + 1, y: ['温度', '湿度', '风速'][i], value })),
        ),
        colorDomain: [0, 1],
        caption: '1 表示已观测，0 表示缺测。示例数据。',
      },
    ],
    [
      'standardize',
      '标准化公式',
      'scaler train z-score 均值 标准差',
      {
        type: 'equation',
        title: '按训练集统计量标准化',
        lines: [String.raw`z_{t,c}=\frac{x_{t,c}-\mu_c}{\sqrt{\sigma_c^2+\varepsilon}}`],
        items: [
          { term: 't / c', text: '时间下标 / 变量下标' },
          { term: 'μ / σ²', text: '各变量在训练时段的均值和方差' },
          { term: 'ε', text: '防止分母为零的正数' },
        ],
      },
    ],
    [
      'patch',
      '分块与嵌入',
      'patching patch token unfold 维度',
      {
        type: 'diagram',
        title: '从多变量窗口到分块嵌入',
        lines: ['[输入|B × C × L] -> [<op>滑窗分块|B × C × N × P]', '[滑窗分块] -> [<out>线性投影|B × C × N × D]'],
        caption: '示例使用无填充滑窗。B 为批大小，C 为变量数，L 为历史长度，N 为块数，P 为块长，D 为嵌入宽度。',
      },
    ],
    [
      'decompose',
      '趋势与残差',
      'moving average decomposition 季节 分解 滤波',
      {
        type: 'diagram',
        title: '移动平均分解',
        lines: [
          '[序列 X] -> [<op>移动平均]',
          '[移动平均] -> [趋势 T]',
          '[序列 X] -> [<out>相减]',
          '[趋势 T] -> [相减]',
          '[相减] -> [残差 R]',
        ],
        caption: 'R = X − T。端点如何填充会影响两端的趋势估计。',
      },
    ],
    [
      'alignment',
      '变量对齐表',
      '时间戳 重采样 插补 exogenous covariates',
      {
        type: 'table',
        title: '变量的时间对齐规则',
        headers: ['变量', '原始间隔', '对齐与可用性'],
        rows: [
          ['负荷', '15 分钟', '作为预测目标'],
          ['气温观测', '1 小时', '使用预测起点前最近观测'],
          ['小时编码', '15 分钟', '未来日历可知'],
        ],
      },
    ],
  ]);
})();
