/* A window is defined in sequence coordinates. The drawing includes all origins
   and uses one common time scale, even when the stride exceeds the history. */
window.ResearchWindows = {
  render(block) {
    const { history, horizon, stride, count = 3, gap = 0 } = block;
    for (const [name, value] of Object.entries({ history, horizon, stride, count, gap })) {
      const min = name === 'gap' ? 0 : 1;
      if (!Number.isSafeInteger(value) || value < min) throw Error(name + ' 需要大于等于 ' + min + ' 的整数');
    }
    if (count > 8) throw Error('单个窗口图最多显示 8 个起点');
    const total = history + gap + horizon + stride * (count - 1);
    const left = 94,
      right = 770,
      top = 16,
      pitch = 49,
      bottom = top + count * pitch;
    const scale = (right - left) / total;
    const x = (t) => left + t * scale;
    const rows = [];
    for (let i = 0; i < count; i++) {
      const start = i * stride,
        y = top + i * pitch,
        target = start + history + gap;
      rows.push(`<text x="6" y="${y + 21}">窗口 ${i + 1}</text>
        <rect x="${x(start)}" y="${y}" width="${history * scale}" height="28" fill="#a9d3cd"/>
        <rect x="${x(target)}" y="${y}" width="${horizon * scale}" height="28" fill="#a4b9df"/>
        <path d="M${x(target)} ${y - 3}v34" stroke="#28466a" stroke-width="2"/>`);
    }
    // Keep tick labels legible for both a six-step example and a long forecast.
    const step = Math.max(1, Math.ceil(total / 6));
    const ticks = [];
    for (let t = 0; t < total; t += step) {
      ticks.push(
        `<path d="M${x(t)} ${bottom}v5" stroke="currentColor"/><text x="${x(t)}" y="${bottom + 23}" text-anchor="middle">${t}</text>`,
      );
    }
    return `<div class="rs-figure"><svg role="img" aria-label="历史 ${history} 步，间隔 ${gap} 步，预测 ${horizon} 步，起点步幅 ${stride}" viewBox="0 0 800 ${bottom + 36}" fill="#243f49" font-family="sans-serif" font-size="16">
      ${rows.join('')}<path d="M${left} ${bottom}H${right}" stroke="currentColor"/>${ticks.join('')}</svg></div>
      <div class="rs-legend"><span>历史 ${history} 步</span><span>间隔 ${gap} 步</span><span>竖线起为预测区间 · ${horizon} 步</span><span>步幅 ${stride}</span></div>`;
  },
};
