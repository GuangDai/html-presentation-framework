/* Research slide components. Public input is plain data; each renderer returns static markup. */
window.ResearchUI = (() => {
  // Resolve figure paths from the repository root in both index.html and research/index.html.
  const assetRoot = new URL('../', document.currentScript.src);
  const escape = (value) =>
    String(value ?? '').replace(
      /[&<>"']/g,
      (c) =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[c],
    );
  const list = (value, field) => {
    if (!Array.isArray(value) || !value.length) throw Error(`${field} 至少需要一项`);
    return value;
  };
  function choice(value, choices) {
    if (!choices.includes(value)) throw Error(`可选值为 ${choices.join(' / ')}`);
    return value;
  }
  function table(headers, rows, name, numeric = []) {
    const head = headers
      .map((s, i) => `<th scope="col" class="${numeric.includes(i) ? 'rs-num' : ''}">${escape(s)}</th>`)
      .join('');
    return `<table class="rs-table" aria-label="${escape(name)}"><thead><tr>${head}</tr></thead><tbody>${rows
      .map(
        (row) =>
          `<tr>${row
            .map((cell, i) =>
              i === 0
                ? `<th scope="row">${cell}</th>`
                : `<td class="${numeric.includes(i) ? 'rs-num' : ''}">${cell}</td>`,
            )
            .join('')}</tr>`,
      )
      .join('')}</tbody></table>`;
  }
  function dataTable(b) {
    const headers = list(b.headers, 'headers');
    const rows = list(b.rows, 'rows').map((row) => {
      if (!Array.isArray(row) || row.length !== headers.length) throw Error('每行的单元格数应与表头一致');
      return row.map((cell) => escape(cell ?? '—'));
    });
    return table(headers, rows, b.title, b.numericColumns);
  }
  // Keep both measured values neutral. Round only the displayed delta, after division.
  // A missing measurement or a zero reference has no defined percentage.
  function comparison(b) {
    const direction = choice(b.direction, ['lower', 'higher']);
    const digits = b.digits ?? 3;
    if (!Number.isInteger(digits) || digits < 0 || digits > 8) throw Error('digits 需要 0–8 的整数');
    const format = (v) => (v === null ? '—' : v.toFixed(digits));
    const rows = list(b.rows, 'rows').map(({ label, baseline, value }) => {
      for (const v of [baseline, value]) {
        if (v !== null && !Number.isFinite(v)) throw Error('基线和对照需要数值，缺测请填 null');
      }
      let delta = '—';
      if (baseline !== null && baseline !== 0 && value !== null) {
        const pct = Number(((100 * (value - baseline)) / baseline).toFixed(2));
        const favorable = direction === 'lower' ? value < baseline : value > baseline;
        const tone = pct === 0 ? '' : favorable ? 'rs-favorable' : 'rs-adverse';
        delta = `<span class="${tone}">${pct > 0 ? '+' : ''}${pct.toFixed(2)}%</span>`;
      }
      return [escape(label), format(baseline), format(value), delta];
    });
    return table(
      [b.rowLabel ?? '条件', b.baselineLabel ?? '基线', b.valueLabel ?? '对照', '相对变化'],
      rows,
      b.title,
      [1, 2, 3],
    );
  }

  const diagramStyle = [
    '#font: sans-serif',
    '#fontSize: 15',
    '#leading: 1.5',
    '#padding: 13',
    '#spacing: 42',
    '#lineWidth: 2',
    '#stroke: #354a56',
    '#fill: #f3f6f7',
    '#fillArrows: true',
    '#edges: rounded',
    '#.op: visual=roundrect fill=#dcefeb',
    '#.store: visual=database fill=#e6ebf6',
    '#.out: visual=roundrect fill=#e5eaf6',
  ].join('\n');

  function diagram(b) {
    const direction = choice(b.direction ?? 'right', ['right', 'down']);
    const source = [diagramStyle, '#direction: ' + direction, ...list(b.lines, 'lines')].join('\n');
    const svg = nomnoml.renderSvg(source, document);
    return `<div class="rs-diagram" role="img" aria-label="${escape(b.description || b.title)}">${svg}</div>`;
  }
  function split(b) {
    const parts = list(b.parts, 'parts');
    if (!parts.every((p) => Number.isFinite(p.count) && p.count > 0)) throw Error('划分大小需要正数');
    const total = parts.reduce((sum, p) => sum + p.count, 0);
    return `<div class="rs-part-bar" aria-hidden="true">${parts.map((p) => `<i style="flex:${p.count / total}"></i>`).join('')}</div>
      <dl class="rs-parts">${parts.map((p) => `<div><dt>${escape(p.label)}</dt><dd><b>${escape(p.count)}</b> ${escape(b.unit)} · ${((100 * p.count) / total).toFixed(1)}%</dd>${p.note ? `<dd>${escape(p.note)}</dd>` : ''}</div>`).join('')}</dl>`;
  }
  function code(b) {
    return `<ol class="rs-code" aria-label="${escape(b.language || '伪代码')}">${list(b.lines, 'lines')
      .map(
        (line, i) =>
          `<li${b.focus?.includes(i + 1) ? ' class="rs-focus"' : ''}><code>${escape(line) || ' '}</code></li>`,
      )
      .join('')}</ol>`;
  }
  function definitions(items) {
    return `<dl class="rs-defs">${list(items, 'items')
      .map((p) => `<div><dt>${escape(p.term)}</dt><dd>${escape(p.text)}</dd></div>`)
      .join('')}</dl>`;
  }
  // Extract native MathML so cached local JS suffices for offline rendering.
  // Original slide formulas continue through PresentationEngine's own TeX pipeline.
  function equations(b) {
    const render = (tex) => {
      const html = katex.renderToString(String(tex), {
        output: 'mathml',
        displayMode: true,
        throwOnError: true,
        trust: false,
      });
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.querySelector('math').outerHTML;
    };
    return `<div class="rs-equations">${list(b.lines, 'lines')
      .map((tex) => render(tex))
      .join('')}</div>${b.items ? definitions(b.items) : ''}`;
  }
  function evidence(b) {
    return `<blockquote class="rs-quote">${escape(b.quote)}</blockquote>${b.items ? definitions(b.items) : ''}`;
  }
  function figure(b, context) {
    if (!b.alt) throw Error('figure 需要填写 alt 图形说明');
    if (b.visualKey) {
      const visual = context.resolveVisual?.(b.visualKey);
      if (!visual) throw Error('visualKey 需要在含有该图形的演示稿中预览：' + b.visualKey);
      return `<div class="rs-figure" role="img" aria-label="${escape(b.alt)}">${visual}</div>`;
    }
    if (!b.src) throw Error('figure 需要 src 或 visualKey');
    return `<img class="rs-image" src="${escape(new URL(b.src, assetRoot).href)}" alt="${escape(b.alt)}">`;
  }
  const renderers = {
    figure,
    tensor: (b) => ResearchTensors.render(b),
    windows: (b) => ResearchWindows.render(b),
    table: dataTable,
    comparison,
    diagram,
    split,
    code,
    equation: equations,
    definitions: (b) => definitions(b.items),
    evidence,
    chart: (b) => ResearchCharts.chart(b),
  };
  function renderBlock(block, context = {}) {
    if (!block || !Object.hasOwn(renderers, block.type)) throw Error('未知的组件类型 ' + block?.type);
    const title = block.title ? `<h2>${escape(block.title)}</h2>` : '';
    const caption = block.caption ? `<figcaption>${escape(block.caption)}</figcaption>` : '';
    return `<figure class="rs-block rs-b-${block.type}">${title}${renderers[block.type](block, context)}${caption}</figure>`;
  }
  function renderSlide(slide, context = {}) {
    const arrangement = choice(slide.arrange ?? 'stack', ['stack', 'columns', 'wide-left', 'wide-right']);
    const density = choice(slide.density ?? 'normal', ['normal', 'compact', 'large']);
    const accent = choice(slide.accent ?? 'teal', ['teal', 'blue', 'graphite']);
    const blocks = list(slide.blocks, 'blocks');
    return `<div class="rs-scope"><div class="rs-sheet rs-${arrangement} rs-${density} rs-${accent}">${blocks.map((block) => renderBlock(block, context)).join('')}</div>
      ${slide.source ? `<footer class="rs-source">${escape(slide.source)}</footer>` : ''}</div>`;
  }
  return { renderSlide, renderBlock };
})();
