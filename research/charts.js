/* Cartesian research figures. Each row is one observation, in data units. */
window.ResearchCharts = (() => {
  const colors = ['#126b70', '#3d5ba8', '#a35425', '#754d91', '#535f69', '#aa3c62'];
  const dashes = [null, '8 4', '2 3', '10 3 2 3', '5 3', '2 2 7 2'];
  const symbols = ['circle', 'square', 'triangle', 'diamond', 'cross', 'star'];

  function domain(value, name) {
    if (value === undefined) return undefined;
    if (Array.isArray(value) && value.length === 2 && value.every(Number.isFinite) && value[0] < value[1])
      return value;
    throw Error(name + ' 需要两个递增的有限数值');
  }

  function chart(block) {
    const { mode, data, xLabel, yLabel } = block;
    if (!Array.isArray(data) || !data.length) throw Error('data 至少需要一条观测');
    const heat = mode === 'heatmap',
      bars = mode === 'bar';
    const range = mode === 'range';
    const faceted = mode === 'line' && data.some((d) => d?.channel !== undefined);
    const validLabel = (v) => (typeof v === 'string' && v.length > 0) || Number.isFinite(v);
    for (const d of data) {
      if (!d || !(heat ? validLabel(d.x) : Number.isFinite(d.x))) throw Error('请检查 x 坐标');
      const validY =
        bars || heat || range ? validLabel(d.y) : Number.isFinite(d.y) || (d.y === null && mode === 'line');
      if (!validY || (heat && !Number.isFinite(d.value))) throw Error('请检查 y 坐标或矩阵值');
      if (faceted && !validLabel(d.channel)) throw Error('每行都需要 channel 分面标签');
      if (range && !(Number.isFinite(d.low) && Number.isFinite(d.high) && d.low <= d.x && d.x <= d.high)) {
        throw Error('横向区间需要 low ≤ x ≤ high');
      }
      if (mode === 'interval' && !(Number.isFinite(d.low) && Number.isFinite(d.high) && d.low <= d.high)) {
        throw Error('区间图的每一行都需要 low ≤ high');
      }
    }
    const groups = [...new Set(data.map((d) => d.series ?? ''))];
    if (groups.length > colors.length) throw Error('一幅图最多放六个系列，请拆成多幅图');
    const marks = [];
    const legend = document.createElement('div');
    legend.className = 'rs-legend';
    const width = block.width ?? 800,
      height = block.height ?? 370;
    if (![width, height].every((v) => Number.isFinite(v) && v >= 220 && v <= 2400))
      throw Error('图幅宽高范围为 220–2400');
    if (heat) {
      marks.push(
        Plot.cell(data, { x: 'x', y: 'y', fill: 'value', inset: 1 }),
        Plot.text(data, { x: 'x', y: 'y', text: (d) => String(d.value), fill: '#172c35', fontSize: 18 }),
      );
    } else if (range) {
      marks.push(
        Plot.ruleY(data, { y: 'y', x1: 'low', x2: 'high', stroke: colors[0], strokeWidth: 3 }),
        Plot.tickX(data, { y: 'y', x: 'low', stroke: colors[0], inset: 9 }),
        Plot.tickX(data, { y: 'y', x: 'high', stroke: colors[0], inset: 9 }),
        Plot.dot(data, { y: 'y', x: 'x', fill: colors[0], r: 6 }),
      );
    } else if (bars) {
      if (new Set(data.map((d) => d.y)).size !== data.length) throw Error('横条图的类别需要唯一');
      marks.push(
        Plot.barX(data, { x: 'x', y: 'y', fill: colors[0], insetTop: 5, insetBottom: 5 }),
        Plot.ruleX([0]),
      );
    } else {
      groups.forEach((group, i) => {
        const rows = data.filter((d) => (d.series ?? '') === group).sort((a, b) => a.x - b.x);
        // fy creates one panel per variable while retaining a shared numeric scale.
        const channels = { x: 'x', y: 'y', stroke: colors[i], fy: faceted ? 'channel' : undefined };
        if (mode === 'interval') {
          marks.push(Plot.areaY(rows, { x: 'x', y1: 'low', y2: 'high', fill: colors[i], fillOpacity: 0.16 }));
        }
        if (mode === 'line' || mode === 'interval') {
          marks.push(Plot.line(rows, { ...channels, strokeWidth: 3, strokeDasharray: dashes[i] }));
        } else if (mode !== 'scatter') {
          throw Error('未知图表模式 ' + mode);
        }
        marks.push(Plot.dot(rows, { ...channels, symbol: symbols[i], r: 4.5, fill: 'white', strokeWidth: 2.2 }));
        if (group !== '') {
          const item = document.createElement('span');
          const symbol = ['○', '□', '△', '◇', '＋', '☆'][i];
          item.textContent = symbol + '  ' + group;
          item.style.color = colors[i];
          legend.append(item);
        }
      });
    }
    const categories = (key) => [...new Set(data.map((d) => d[key]))];
    const options = {
      width,
      height,
      marginLeft: block.marginLeft ?? (bars || heat || range ? 110 : 80),
      marginRight: faceted ? 78 : 32,
      marginTop: 24,
      marginBottom: 64,
      style: { background: 'transparent', color: '#344956', fontSize: '16px', fontFamily: 'inherit' },
      ariaLabel: block.title,
      x: {
        type: heat ? 'band' : 'linear',
        grid: bars || range,
        label: xLabel,
        labelAnchor: 'center',
        domain: heat ? categories('x') : domain(block.xDomain, 'xDomain'),
        ticks: heat ? undefined : 6,
        zero: bars,
      },
      y: {
        type: heat || bars || range ? 'band' : 'linear',
        grid: !heat && !bars && !range,
        label: yLabel,
        labelAnchor: 'center',
        domain: heat || bars || range ? categories('y') : domain(block.yDomain, 'yDomain'),
        ticks: heat || bars || range ? undefined : 5,
      },
      fy: faceted ? { label: null, domain: categories('channel') } : undefined,
      color: { type: 'linear', range: ['#f1f6f7', '#81bbbd'], domain: domain(block.colorDomain, 'colorDomain') },
      marks,
    };
    const result = Plot.plot(options);
    return result.outerHTML + legend.outerHTML;
  }
  return { chart };
})();
