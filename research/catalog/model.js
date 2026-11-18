// Shape conventions are local to each specimen, so a copied block remains self-contained.
(() => {
  const mask = Array.from({ length: 5 }, (_, q) =>
    Array.from({ length: 5 }, (_, k) => ({
      x: 'k' + (k + 1),
      y: 'q' + (q + 1),
      value: Number(k <= q),
    })),
  ).flat();
  ResearchCatalog.add('模型与张量', [
    [
      'attention',
      '交叉注意力连线',
      'transformer cross attention Q K V 架构 多路融合',
      {
        type: 'diagram',
        title: '交叉注意力的数据流',
        lines: [
          '[查询序列] -> [<op>查询投影]',
          '[上下文] -> [键投影]',
          '[上下文] -> [值投影]',
          '[查询投影] Q -> [<op>注意力]',
          '[键投影] K -> [注意力]',
          '[值投影] V -> [注意力]',
          '[注意力] -> [<out>输出]',
        ],
        description: '查询序列生成 Q，上下文分别生成 K 和 V。三路输入汇入注意力模块后输出。',
        caption: 'Q 为查询，K 为键，V 为值。键和值共享上下文序列。',
      },
    ],
    [
      'causal-mask',
      '因果注意力掩码',
      'transformer causal mask attention heatmap 上三角',
      {
        type: 'chart',
        mode: 'heatmap',
        title: '自回归注意力可见范围',
        xLabel: '键位置 k',
        yLabel: '查询位置 q',
        data: mask,
        colorDomain: [0, 1],
        caption: '1 表示允许访问，0 表示遮挡。位置从 1 开始。',
      },
    ],
    [
      'head-shape',
      '张量轴变换',
      'reshape permute transpose split heads 多头 转置 维度',
      {
        type: 'tensor',
        title: '拆分注意力头并转置',
        stages: [
          {
            name: '输入',
            axes: [
              { label: '批次', size: 'B' },
              { label: '时间', size: 'L' },
              { label: '特征', size: 'D' },
            ],
          },
          {
            name: '拆分特征维',
            axes: [
              { label: '批次', size: 'B' },
              { label: '时间', size: 'L' },
              { label: '头数', size: 'h' },
              { label: '头内特征', size: 'd' },
            ],
          },
          {
            name: '转置',
            axes: [
              { label: '批次', size: 'B' },
              { label: '头数', size: 'h' },
              { label: '时间', size: 'L' },
              { label: '头内特征', size: 'd' },
            ],
          },
        ],
        caption: 'D = h × d。拆分和转置保持张量元素总数。',
      },
    ],
    [
      'dimensions',
      '张量形状表',
      'shape batch channel variable time token 多维时间',
      {
        type: 'table',
        title: '多头注意力的形状变化',
        headers: ['张量', '形状', '轴的含义'],
        rows: [
          ['输入', 'B × L × D', '批次、时间、隐藏维'],
          ['分头查询', 'B × h × L × d', 'h 个头，各有 d 个特征'],
          ['注意力分数', 'B × h × L × L', '查询位置 × 键位置'],
          ['输出', 'B × L × D', '拼接所有头后投影'],
        ],
        caption: '示例采用等宽注意力头，D = h × d。',
      },
    ],
    [
      'axis',
      '时间轴与变量轴',
      'iTransformer channel attention 时间 token 特征轴 多元',
      {
        type: 'table',
        title: '沿哪个轴计算注意力',
        headers: ['Token 定义', '序列长度', '注意力分数形状'],
        rows: [
          ['一个时刻', 'L 个时刻', 'B × h × L × L'],
          ['一个变量', 'C 个变量', 'B × h × C × C'],
        ],
        caption: 'B 为批大小，h 为头数。输入窗口含 C 个变量和 L 个历史时刻。',
      },
    ],
    [
      'residual',
      '残差连接',
      'transformer residual skip pre-norm LN 加法 架构',
      {
        type: 'diagram',
        title: '预归一化残差单元',
        lines: [
          '[输入 X] -> [层归一化]',
          '[层归一化] -> [<op>自注意力]',
          '[自注意力] -> [相加]',
          '[输入 X] -> [相加]',
          '[相加] -> [<out>输出 Y]',
        ],
        caption: '加法两端具有相同形状。示例展示一个注意力子层。',
      },
    ],
    [
      'attention-math',
      '公式与符号',
      'softmax 缩放点积 数学 推导 LaTeX',
      {
        type: 'equation',
        title: '缩放点积注意力',
        lines: [String.raw`S=QK^\top/\sqrt{d_k}`, String.raw`Y=\operatorname{softmax}(S+M)\,V`],
        items: [
          { term: 'dₖ', text: '每个键的特征维数' },
          { term: 'M', text: '可见位置加 0，遮挡位置加负无穷' },
          { term: 'softmax', text: '沿键轴归一化，每行权重之和为 1' },
        ],
      },
    ],
    [
      'pseudocode',
      '逐行伪代码',
      'training algorithm optimizer 梯度 accumulation 代码 高亮',
      {
        type: 'code',
        title: '一次优化器更新',
        language: 'Python 风格伪代码',
        lines: [
          'optimizer.zero_grad()',
          'for x, y in micro_batches:',
          '    pred = model(x)',
          '    loss = mse(pred, y) / K',
          '    loss.backward()',
          'optimizer.step()',
        ],
        focus: [4, 5, 6],
        caption: '示例使用 K 个等大小微批次。每轮循环累积梯度，循环结束后更新一次参数。',
      },
    ],
    [
      'prototype',
      '原型检索',
      'prototype bank retrieval memory 融合 相似度',
      {
        type: 'diagram',
        title: '从原型库检索预测形状',
        lines: [
          '[历史窗口] -> [<op>查询编码]',
          '[查询编码] -> [相似度权重]',
          '[<store>原型库] -> [相似度权重]',
          '[原型库] -> [<op>加权求和]',
          '[相似度权重] -> [加权求和]',
          '[加权求和] -> [<out>预测原型]',
        ],
        caption: '示意结构。库内每个原型的时间长度等于预测步长。',
      },
    ],
  ]);
})();
