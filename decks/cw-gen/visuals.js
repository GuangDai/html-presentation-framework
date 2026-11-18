/**
 * ============================================================================
 * @file decks/cw-gen/visuals.js
 * @description Pure SVG Visual Component Registry for CW-Gen (ICLR 2026).
 *              - 100% Unified Notation:
 *                Input X \in \mathbb{R}^{H \times d}, Future Y \in \mathbb{R}^{L \times d}
 *                Predicted Mean \widehat{\mu}(X) \in \mathbb{R}^{L \times d}
 *                Predicted Cov \widehat{\Sigma}(X) \in \mathbb{R}^{L \times d \times d}
 *              - Zero grey sub-captions / zero verbose AI-slop filler text
 *              - Strictly monochrome slate-and-blue palette matching Slides 1, 3, 8, 9
 *              - Theory split across 2 spacious slides (Slide 3 & Slide 4)
 *              - JMCE overview & Alg 1 (Slide 5), Sliding Window & Alg 2 (Slide 6),
 *                Cholesky & Theorem 1 Loss Mapping (Slide 7)
 *              - CW-Diff (Slide 8) & CW-Flow (Slide 9): concise Left Train / Right Infer
 *              - Reproduction Experiments (Slides 10–11)
 *              - Personal Analysis I: 4-Stage Geometric & Algebraic Comparison (Slide 12)
 *              - Personal Analysis II: 3 Core Methodological Limitations (Slide 13)
 * ============================================================================
 */

(function () {
  function renderMixedLatex(text, texZoom = 1.38) {
    return text.replace(/\$([^$]+)\$/g, (_, tex) => {
      const escaped = tex.trim().replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      return `<span class="latex-formula" data-latex="${escaped}" data-display="false" style="display:inline-flex;align-items:center;margin:0 3px;--tex-zoom:${texZoom};"></span>`;
    });
  }

  function svgRich(x, y, w, h, mixedText, color = '#0F172A', fontSize = '20px', fontWeight = '900', texZoom = 1.42, align = 'center') {
    const html = renderMixedLatex(mixedText, texZoom);
    return `<foreignObject x="${x}" y="${y}" width="${w}" height="${h}">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-tex-cell" style="color:${color};font-size:${fontSize};font-weight:${fontWeight};justify-content:${align};--tex-zoom:${texZoom};white-space:nowrap;">
        ${html}
      </div>
    </foreignObject>`;
  }

  function drawFloatingBadge(x, y, w, h, titleText, badgeNum = '') {
    if (titleText.includes('$')) {
      const numEl = badgeNum
        ? `<span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:${h - 16}px;border-radius:8px;background:#1D4ED8;color:#FFFFFF;font-size:18px;font-weight:900;margin-right:10px;flex-shrink:0;">${badgeNum}</span>`
        : `<span style="display:inline-block;width:6px;height:${h - 22}px;border-radius:3px;background:#1D4ED8;margin-right:12px;flex-shrink:0;"></span>`;
      return `<g>
        <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#EFF6FF" stroke="#60A5FA" stroke-width="2"/>
        <foreignObject x="${x + 12}" y="${y}" width="${w - 24}" height="${h}">
          <div xmlns="http://www.w3.org/1999/xhtml" class="svg-tex-cell" style="height:100%;color:#0F172A;font-size:20px;font-weight:900;justify-content:flex-start;--tex-zoom:1.38;white-space:nowrap;">
            ${numEl}${renderMixedLatex(titleText, 1.38)}
          </div>
        </foreignObject>
      </g>`;
    }
    const numBlock = badgeNum
      ? `<rect x="${x + 10}" y="${y + 8}" width="38" height="${h - 16}" rx="8" fill="#1D4ED8"/>
         <text x="${x + 29}" y="${y + h / 2 + 7}" text-anchor="middle" fill="#FFFFFF" font-size="18.5" font-weight="900">${badgeNum}</text>
         <text x="${x + 58}" y="${y + h / 2 + 7}" fill="#0F172A" font-size="20.5" font-weight="900">${titleText}</text>`
      : `<rect x="${x + 14}" y="${y + 11}" width="6" height="${h - 22}" rx="3" fill="#1D4ED8"/>
         <text x="${x + 30}" y="${y + h / 2 + 7}" fill="#0F172A" font-size="20.5" font-weight="900">${titleText}</text>`;
    return `<g>
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#EFF6FF" stroke="#60A5FA" stroke-width="2"/>
      ${numBlock}
    </g>`;
  }

  function svgTex(x, y, w, h, latex, color = '#0F172A', fontSize = '21px', extraTextPrefix = '', extraTextSuffix = '', zoom = 1.85, align = 'center') {
    const escaped = latex.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    const pre = extraTextPrefix ? `<span style="margin-right:6px;font-weight:800;">${extraTextPrefix}</span>` : '';
    const suf = extraTextSuffix ? `<span style="margin-left:6px;font-weight:800;">${extraTextSuffix}</span>` : '';
    return `<foreignObject x="${x}" y="${y}" width="${w}" height="${h}">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-tex-cell" style="color:${color};font-size:${fontSize};justify-content:${align};--tex-zoom:${zoom};">
        ${pre}<span class="latex-formula" data-latex="${escaped}" data-display="false"></span>${suf}
      </div>
    </foreignObject>`;
  }

  function drawWeightGrid(x, y, rows, cols, cellW, cellH, gap, colors) {
    let out = `<g transform="translate(${x}, ${y})">`;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const color = colors[(r * cols + c) % colors.length];
        out += `<rect x="${c * (cellW + gap)}" y="${r * (cellH + gap)}" width="${cellW}" height="${cellH}" rx="3.5" fill="${color}"/>`;
      }
    }
    out += `</g>`;
    return out;
  }

  function drawNeuralStack(x, y, w, h, strokeColor, fillBg, barColors) {
    const padX = 22;
    const barW = w - padX * 2;
    const barH = 18;
    return `<g transform="translate(${x}, ${y})">
      <rect x="0" y="0" width="${w}" height="${h}" rx="16" fill="${fillBg}" stroke="${strokeColor}" stroke-width="2.4"/>
      <rect x="${padX}" y="28" width="${barW}" height="${barH}" rx="4" fill="${barColors[0]}"/>
      <rect x="${padX}" y="58" width="${barW}" height="${barH}" rx="4" fill="${barColors[1]}"/>
      <rect x="${padX}" y="88" width="${barW}" height="${barH}" rx="4" fill="${barColors[2]}"/>
      <line x1="${w/2 - 22}" y1="46" x2="${w/2 - 22}" y2="58" stroke="${strokeColor}" stroke-width="2.2"/>
      <line x1="${w/2 + 22}" y1="46" x2="${w/2 + 22}" y2="58" stroke="${strokeColor}" stroke-width="2.2"/>
      <line x1="${w/2 - 22}" y1="76" x2="${w/2 - 22}" y2="88" stroke="${strokeColor}" stroke-width="2.2"/>
      <line x1="${w/2 + 22}" y1="76" x2="${w/2 + 22}" y2="88" stroke="${strokeColor}" stroke-width="2.2"/>
    </g>`;
  }

  function drawJmceOverview(fullHeight = false) {
    const cardH = fullHeight ? 884 : 784;
    const bottomFooter = fullHeight
      ? `<rect x="36" y="768" width="848" height="96" rx="14" fill="#EFF6FF" stroke="#93C5FD" stroke-width="2.2"/>
         ${svgRich(52, 778, 816, 38, '非自回归联合映射（主干网络：Non-stationary Transformer）', '#1E3A8A', '20px', '900', 1.4)}
         ${svgTex(52, 816, 816, 42, '\\mathrm{JMCE}_\\theta(X) \\;\\mapsto\\; \\big(\\widehat{\\mu}(X) \\in \\mathbb{R}^{L \\times d},\\; \\widehat{L}_{1:L}(X) \\in \\mathbb{R}^{L \\times d \\times d}\\big)', '#0F172A', '19.5px', '', '', 1.68)}`
      : '';
    return `<g class="jmce-overview">
      <rect x="12" y="8" width="896" height="${cardH}" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(28, 22, 436, 48, 'Joint Mean-Covariance Estimator')}

      <!-- Top Path: X_{input}^{H \times d} -> JMCE Model -> [\widehat{\mu}(X), \widehat{\Sigma}(X)] -->
      <rect x="36" y="152" width="148" height="224" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <text x="110" y="200" text-anchor="middle" fill="#0F172A" font-size="22" font-weight="900">历史输入</text>
      ${svgTex(44, 218, 132, 54, 'X^{H \\times d}', '#0F172A', '23px', '', '', 1.95)}
      <path d="M 54 334 C 74 294, 92 346, 112 308 C 128 278, 146 322, 166 290" stroke="#475569" stroke-width="4.5" stroke-linecap="round" fill="none"/>

      <line x1="184" y1="264" x2="226" y2="264" stroke="#2563EB" stroke-width="4.2"/>
      <polygon points="220,255 238,264 220,273" fill="#2563EB"/>

      ${drawNeuralStack(240, 152, 180, 224, '#2563EB', '#EFF6FF', ['#1D4ED8', '#3B82F6', '#60A5FA'])}
      <text x="330" y="328" text-anchor="middle" fill="#1E3A8A" font-size="23" font-weight="900">JMCE Model</text>

      <line x1="420" y1="264" x2="462" y2="264" stroke="#1D4ED8" stroke-width="4.2"/>
      <polygon points="456,255 474,264 456,273" fill="#1D4ED8"/>

      <!-- Estimated Moments Box -->
      <rect x="476" y="140" width="236" height="248" rx="18" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="2.8"/>
      <rect x="496" y="164" width="196" height="92" rx="12" fill="#FFFFFF" stroke="#93C5FD" stroke-width="2"/>
      ${svgTex(504, 182, 180, 56, '\\widehat{\\mu}(X)^{L \\times d}', '#1E3A8A', '21px', '', '', 1.85)}
      <rect x="496" y="272" width="196" height="92" rx="12" fill="#FFFFFF" stroke="#93C5FD" stroke-width="2"/>
      ${svgTex(504, 290, 180, 56, '\\widehat{\\Sigma}(X)^{L \\times d \\times d}', '#1E3A8A', '21px', '', '', 1.85)}

      <!-- Bottom Path: Y^{L \times d} -> Sliding Window Covariance -> [\mu(Y), \Sigma(Y)] -->
      <rect x="36" y="492" width="148" height="224" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <text x="110" y="540" text-anchor="middle" fill="#0F172A" font-size="22" font-weight="900">未来序列</text>
      ${svgTex(44, 558, 132, 54, 'Y^{L \\times d}', '#0F172A', '23px', '', '', 1.95)}
      <path d="M 54 674 C 74 634, 92 686, 112 648 C 128 618, 146 662, 166 630" stroke="#2563EB" stroke-width="4.5" stroke-linecap="round" fill="none"/>

      <line x1="184" y1="604" x2="226" y2="604" stroke="#64748B" stroke-width="4.2"/>
      <polygon points="220,595 238,604 220,613" fill="#64748B"/>

      <rect x="240" y="492" width="180" height="224" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <text x="330" y="588" text-anchor="middle" fill="#0F172A" font-size="21.5" font-weight="900">Sliding Window</text>
      <text x="330" y="628" text-anchor="middle" fill="#0F172A" font-size="21.5" font-weight="900">Covariance</text>

      <line x1="420" y1="604" x2="462" y2="604" stroke="#64748B" stroke-width="4.2"/>
      <polygon points="456,595 474,604 456,613" fill="#64748B"/>

      <!-- Target Moments Box -->
      <rect x="476" y="480" width="236" height="248" rx="18" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.6"/>
      <rect x="496" y="504" width="196" height="92" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${svgTex(504, 522, 180, 56, '\\mu(Y)^{L \\times d}', '#0F172A', '21px', '', '', 1.85)}
      <rect x="496" y="612" width="196" height="92" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${svgTex(504, 630, 180, 56, '\\Sigma(Y)^{L \\times d \\times d}', '#0F172A', '21px', '', '', 1.85)}

      <!-- Convergence into Loss Box -->
      <path d="M 712 264 L 744 264 L 744 372" stroke="#1D4ED8" stroke-width="4.5" fill="none"/>
      <polygon points="734,366 744,386 754,366" fill="#1D4ED8"/>

      <path d="M 712 604 L 744 604 L 744 496" stroke="#64748B" stroke-width="4.5" fill="none"/>
      <polygon points="734,502 744,482 754,502" fill="#64748B"/>

      <!-- Focal Loss Hub -->
      <rect x="732" y="386" width="152" height="96" rx="18" fill="#1D4ED8"/>
      <text x="808" y="445" text-anchor="middle" fill="#FFFFFF" font-size="31" font-weight="900">Loss</text>

      <!-- Backprop Feedback Loop from Loss to JMCE Model -->
      <path d="M 808 386 L 808 96 L 330 96 L 330 138" stroke="#1D4ED8" stroke-width="4.2" fill="none"/>
      <polygon points="320,132 330,152 340,132" fill="#1D4ED8"/>

      ${bottomFooter}
    </g>`;
  }

  // Begin generated reproduction tables.
  const reproductionTables = {
    "FlowTS": [
      ["ETTh1", "0.872", "0.623", "0.685", "0.551"],
      ["ETTh2", "7.122", "0.698", "2.265", "0.615"],
      ["Weather", "0.390", "0.312", "0.409", "0.345"],
      ["Weather(修改版)", "0.372", "0.323", "0.399", "0.351"],
    ],
    "Diffusion-TS": [
      ["ETTh1", "1.125", "0.653", "0.810", "0.558"],
      ["ETTh2", "9.686", "0.751", "2.691", "0.644"],
      ["Weather", "0.489", "0.325", "0.452", "0.367"],
      ["Weather(修改版)", "0.447", "0.316", "0.420", "0.354"],
    ],
  };
  // End generated reproduction tables.

  function drawModelMetricsTable(x, model) {
    const rows = reproductionTables[model];
    const columns = [331, 478, 625, 772];
    const methods = ['w/o CW', 'CW', 'w/o CW', 'CW'];
    const rowHeight = 62;
    const bodyTop = 194;
    const bottom = bodyTop + rowHeight * rows.length;
    return `<g class="cw-metrics-table" transform="translate(${x}, 200)"
               fill="#0F172A" font-size="27" style="font-variant-numeric:tabular-nums">
      <text x="12" y="32" font-weight="800">${model}</text>

      <line x1="0" y1="64" x2="846" y2="64" stroke="#0F172A" stroke-width="2.5"/>
      <g text-anchor="middle" font-weight="750">
        <text x="404.5" y="108">MSE</text>
        <text x="698.5" y="108">MAE</text>
      </g>
      <path d="M270 127 H539 M564 127 H834" stroke="#64748B" stroke-width="1.25"/>
      <g class="cw-metrics-header" font-weight="650">
        <text x="12" y="170">数据版本</text>
        ${methods.map((method, index) => `<text x="${columns[index]}" y="170" text-anchor="middle">${method}</text>`).join('')}
      </g>
      <line x1="0" y1="${bodyTop}" x2="846" y2="${bodyTop}" stroke="#475569" stroke-width="1.5"/>

      ${rows.map(([dataset, ...scores], rowIndex) => {
        const y = bodyTop + 40 + rowIndex * rowHeight;
        return `<g class="cw-metrics-row">
          <text x="12" y="${y}">${dataset}</text>
          ${scores.map((score, col) => {
            const other = scores[col % 2 === 0 ? col + 1 : col - 1];
            const best = Number(score) < Number(other);
            return `<text x="${columns[col]}" y="${y}" text-anchor="middle" font-weight="${best ? 800 : 500}">${score}</text>`;
          }).join('')}
        </g>`;
      }).join('')}
      <line x1="0" y1="${bottom}" x2="846" y2="${bottom}" stroke="#0F172A" stroke-width="2.5"/>
    </g>`;
  }

  /**
   * Helper for Slide 12: 2D Distribution Ellipse Plot (Upper visual in each of the 4 columns)
   */
  function drawDistributionPlot2D(cx, cy, mode) {
    const left = cx - 199;
    const top = cy - 108;
    const ox = cx - 12;
    const oy = cy + 28;

    const rawOffsets = [
      [-1.05, -0.85], [-0.8, -0.5], [-0.55, -0.7], [-0.4, -0.2], [-0.2, -0.35],
      [-0.1, 0.05], [0.0, 0.0], [0.15, -0.05], [0.25, 0.3], [0.45, 0.2],
      [0.55, 0.6], [0.75, 0.45], [0.95, 0.85], [-0.65, -0.3], [0.35, 0.5], [-0.3, -0.1]
    ];

    let ellipseSvg = '';
    let dotsSvg = '';
    let annotSvg = '';

    if (mode === 'raw') {
      const ecx = ox + 56;
      const ecy = oy - 34;
      ellipseSvg = `
        <line x1="${ox}" y1="${ecy}" x2="${ecx}" y2="${ecy}" stroke="#94A3B8" stroke-width="1.8" stroke-dasharray="4 3"/>
        <line x1="${ecx}" y1="${oy}" x2="${ecx}" y2="${ecy}" stroke="#94A3B8" stroke-width="1.8" stroke-dasharray="4 3"/>
        <g transform="translate(${ecx}, ${ecy}) rotate(-26)">
          <ellipse cx="0" cy="0" rx="68" ry="21" fill="#DBEAFE" fill-opacity="0.7" stroke="#1D4ED8" stroke-width="2.6"/>
          <line x1="-72" y1="0" x2="72" y2="0" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="5 3"/>
        </g>
        <circle cx="${ecx}" cy="${ecy}" r="4.5" fill="#1D4ED8"/>
      `;
      dotsSvg = rawOffsets.map(([u, v]) => {
        const px = ecx + u * 44 - v * 11;
        const py = ecy - (u * 21 + v * 13);
        return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="3" fill="#1E40AF" opacity="0.78"/>`;
      }).join('');
      annotSvg = svgRich(left + 12, top + 5, 374, 30, '中心 $(\\mu_1, \\mu_2) \\neq (0,0)$ 的偏心倾斜椭圆', '#1E3A8A', '16px', '850', 1.18, 'flex-start');
    } else if (mode === 'center') {
      ellipseSvg = `
        <g transform="translate(${ox}, ${oy}) rotate(-26)">
          <ellipse cx="0" cy="0" rx="68" ry="21" fill="#DBEAFE" fill-opacity="0.7" stroke="#1D4ED8" stroke-width="2.6"/>
          <line x1="-72" y1="0" x2="72" y2="0" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="5 3"/>
        </g>
        <circle cx="${ox}" cy="${oy}" r="4.5" fill="#1D4ED8"/>
      `;
      dotsSvg = rawOffsets.map(([u, v]) => {
        const px = ox + u * 44 - v * 11;
        const py = oy - (u * 21 + v * 13);
        return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="3" fill="#1E40AF" opacity="0.78"/>`;
      }).join('');
      annotSvg = svgRich(left + 12, top + 5, 374, 30, '平移至原点 $(0,0)$，长短轴与倾角不变', '#1E3A8A', '16px', '850', 1.18, 'flex-start');
    } else if (mode === 'std') {
      const boxR = 48;
      ellipseSvg = `
        <rect x="${ox - boxR}" y="${oy - boxR}" width="${boxR * 2}" height="${boxR * 2}" fill="none" stroke="#94A3B8" stroke-width="1.6" stroke-dasharray="5 4"/>
        <g transform="translate(${ox}, ${oy}) rotate(-45)">
          <ellipse cx="0" cy="0" rx="63" ry="21" fill="#DBEAFE" fill-opacity="0.7" stroke="#1D4ED8" stroke-width="2.6"/>
          <line x1="-66" y1="0" x2="66" y2="0" stroke="#2563EB" stroke-width="1.5" stroke-dasharray="5 3"/>
        </g>
        <circle cx="${ox}" cy="${oy}" r="4.5" fill="#1D4ED8"/>
      `;
      dotsSvg = rawOffsets.map(([u, v]) => {
        const px = ox + u * 35 - v * 9;
        const py = oy - (u * 35 + v * 9);
        return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="3" fill="#1E40AF" opacity="0.78"/>`;
      }).join('');
      annotSvg = svgRich(left + 12, top + 5, 374, 30, '宽高拉齐为 $1$，但仍呈 $45^\\circ$ 斜拉伸椭圆', '#1E3A8A', '16px', '850', 1.18, 'flex-start');
    } else if (mode === 'whiten') {
      const rad = 48;
      ellipseSvg = `
        <circle cx="${ox}" cy="${oy}" r="${rad}" fill="#BFDBFE" fill-opacity="0.75" stroke="#1D4ED8" stroke-width="3"/>
        <circle cx="${ox}" cy="${oy}" r="${(rad * 0.55).toFixed(1)}" fill="none" stroke="#3B82F6" stroke-width="1.5" stroke-dasharray="4 3"/>
        <circle cx="${ox}" cy="${oy}" r="4.5" fill="#1D4ED8"/>
      `;
      const circlePts = [
        [-0.7, -0.2], [-0.4, 0.6], [-0.55, -0.55], [0.0, 0.75], [0.65, 0.35],
        [0.7, -0.3], [0.25, -0.7], [-0.2, -0.75], [-0.3, 0.25], [0.35, 0.3],
        [0.4, -0.35], [-0.65, 0.35], [0.15, -0.25], [-0.15, 0.5], [0.55, 0.0], [0.0, -0.45]
      ];
      dotsSvg = circlePts.map(([u, v]) => {
        const px = ox + u * 41;
        const py = oy - v * 41;
        return `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="3.1" fill="#1D4ED8" opacity="0.85"/>`;
      }).join('');
      annotSvg = svgRich(left + 12, top + 5, 374, 30, '各向同性标准正圆 $\\mathcal{N}(0, I_d)$', '#1D4ED8', '16px', '900', 1.18, 'flex-start');
    }

    return `<g class="dist-plot-2d">
      <rect x="${left}" y="${top}" width="398" height="216" rx="12" fill="#FFFFFF" stroke="${mode === 'whiten' ? '#60A5FA' : '#CBD5E1'}" stroke-width="2"/>
      <line x1="${left + 10}" y1="${top + 38}" x2="${left + 388}" y2="${top + 38}" stroke="#E2E8F0" stroke-width="1.4"/>
      ${annotSvg}
      <!-- Axes strictly inside lower plot area -->
      <line x1="${left + 22}" y1="${oy}" x2="${left + 372}" y2="${oy}" stroke="#64748B" stroke-width="1.8"/>
      <polygon points="${left + 368},${oy - 4.5} ${left + 380},${oy} ${left + 368},${oy + 4.5}" fill="#64748B"/>
      <line x1="${ox}" y1="${top + 202}" x2="${ox}" y2="${top + 48}" stroke="#64748B" stroke-width="1.8"/>
      <polygon points="${ox - 4.5},${top + 52} ${ox},${top + 42} ${ox + 4.5},${top + 52}" fill="#64748B"/>
      ${ellipseSvg}
      ${dotsSvg}
    </g>`;
  }

  /**
   * Helper for Slide 12: Channel Vector Linear Algebra Plot (Middle visual in each of the 4 columns)
   */
  function drawVectorPlot2D(cx, cy, mode) {
    const left = cx - 199;
    const top = cy - 104;
    const ox = left + 74;
    const oy = top + 178;

    let vecSvg = '';
    let topNote = '';

    if (mode === 'raw') {
      const mx = ox + 38;
      const my = oy - 24;
      vecSvg = `
        <line x1="${ox}" y1="${oy}" x2="${mx}" y2="${my}" stroke="#64748B" stroke-width="2.5" stroke-dasharray="5 3"/>
        <circle cx="${ox}" cy="${oy}" r="3.5" fill="#64748B"/>
        <circle cx="${mx}" cy="${my}" r="4" fill="#64748B"/>
        ${svgTex(ox - 12, oy - 30, 56, 30, '\\boldsymbol{\\mu}', '#475569', '17.5px', '', '', 1.4)}
        <line x1="${mx}" y1="${my}" x2="${mx + 184}" y2="${my - 10}" stroke="#1D4ED8" stroke-width="4.4" marker-end="url(#obs-blue)"/>
        <line x1="${mx}" y1="${my}" x2="${mx + 82}" y2="${my - 76}" stroke="#334155" stroke-width="4.4" marker-end="url(#obs-slate)"/>
        ${svgTex(mx + 176, my - 6, 62, 34, '\\mathbf{y}_1', '#1D4ED8', '18.5px', '', '', 1.5)}
        ${svgTex(mx + 82, my - 98, 62, 34, '\\mathbf{y}_2', '#334155', '18.5px', '', '', 1.5)}
      `;
      topNote = svgRich(left + 12, top + 5, 374, 30, '含均值偏移 $\\boldsymbol{\\mu}$，模长不等且非正交', '#334155', '16px', '850', 1.18, 'flex-start');
    } else if (mode === 'center') {
      const deg = 36.9;
      const rad = deg * Math.PI / 180;
      const len1 = 196;
      const len2 = 112;
      const x2 = ox + len2 * Math.cos(rad);
      const y2 = oy - len2 * Math.sin(rad);
      const arcR = 52;
      vecSvg = `
        <path d="M ${ox + arcR} ${oy} A ${arcR} ${arcR} 0 0 0 ${(ox + arcR * Math.cos(rad)).toFixed(1)} ${(oy - arcR * Math.sin(rad)).toFixed(1)}" fill="none" stroke="#64748B" stroke-width="2.2"/>
        <text x="${ox + 106}" y="${oy - 18}" text-anchor="middle" fill="#1E3A8A" font-size="17.5" font-weight="900">θ = 36.9°</text>
        <line x1="${ox}" y1="${oy}" x2="${ox + len1}" y2="${oy}" stroke="#1D4ED8" stroke-width="4.4" marker-end="url(#obs-blue)"/>
        <line x1="${ox}" y1="${oy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#334155" stroke-width="4.4" marker-end="url(#obs-slate)"/>
        <circle cx="${ox}" cy="${oy}" r="4.5" fill="#0F172A"/>
        ${svgTex(ox + len1 + 2, oy - 18, 66, 36, '\\widetilde{\\mathbf{y}}_1', '#1D4ED8', '18.5px', '', '', 1.5)}
        ${svgTex(x2 + 2, y2 - 34, 66, 36, '\\widetilde{\\mathbf{y}}_2', '#334155', '18.5px', '', '', 1.5)}
      `;
      topNote = svgRich(left + 12, top + 5, 374, 30, '模长不等 $\\|\\widetilde{\\mathbf{y}}_1\\| \\neq \\|\\widetilde{\\mathbf{y}}_2\\|$，夹角 $\\theta \\neq 90^\\circ$', '#1E3A8A', '16px', '850', 1.18, 'flex-start');
    } else if (mode === 'std') {
      const deg = 36.9;
      const rad = deg * Math.PI / 180;
      const len = 136;
      const x2 = ox + len * Math.cos(rad);
      const y2 = oy - len * Math.sin(rad);
      const arcR = 48;
      vecSvg = `
        <path d="M ${ox + len} ${oy} A ${len} ${len} 0 0 0 ${(ox + len * Math.cos(0.45 * Math.PI)).toFixed(1)} ${(oy - len * Math.sin(0.45 * Math.PI)).toFixed(1)}" fill="none" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="5 4"/>
        <path d="M ${ox + arcR} ${oy} A ${arcR} ${arcR} 0 0 0 ${(ox + arcR * Math.cos(rad)).toFixed(1)} ${(oy - arcR * Math.sin(rad)).toFixed(1)}" fill="none" stroke="#64748B" stroke-width="2.2"/>
        <text x="${ox + 112}" y="${oy - 18}" text-anchor="middle" fill="#1E3A8A" font-size="17" font-weight="900">θ = 36.9° (不变)</text>
        <line x1="${ox}" y1="${oy}" x2="${ox + len}" y2="${oy}" stroke="#1D4ED8" stroke-width="4.4" marker-end="url(#obs-blue)"/>
        <line x1="${ox}" y1="${oy}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#334155" stroke-width="4.4" marker-end="url(#obs-slate)"/>
        <circle cx="${ox}" cy="${oy}" r="4.5" fill="#0F172A"/>
        ${svgTex(ox + len + 4, oy - 18, 64, 34, '\\mathbf{u}_1', '#1D4ED8', '18.5px', '', '', 1.5)}
        ${svgTex(x2 + 4, y2 - 30, 64, 34, '\\mathbf{u}_2', '#334155', '18.5px', '', '', 1.5)}
      `;
      topNote = svgRich(left + 12, top + 5, 374, 30, '模长拉齐为 $1$，但夹角 $\\theta$ 丝毫未变', '#1E3A8A', '16px', '850', 1.18, 'flex-start');
    } else if (mode === 'whiten') {
      const len = 110;
      const deg = 36.9;
      const rad = deg * Math.PI / 180;
      const oldX2 = ox + len * Math.cos(rad);
      const oldY2 = oy - len * Math.sin(rad);
      const projX = ox + len * Math.cos(rad);
      vecSvg = `
        <path d="M ${ox + 22} ${oy} V ${oy - 22} H ${ox}" fill="none" stroke="#1D4ED8" stroke-width="2.4"/>
        <line x1="${ox}" y1="${oy}" x2="${oldX2.toFixed(1)}" y2="${oldY2.toFixed(1)}" stroke="#94A3B8" stroke-width="2" stroke-dasharray="5 4"/>
        <line x1="${oldX2.toFixed(1)}" y1="${oldY2.toFixed(1)}" x2="${projX.toFixed(1)}" y2="${oy}" stroke="#94A3B8" stroke-width="1.8" stroke-dasharray="3 3"/>
        <path d="M ${(oldX2 - 6).toFixed(1)} ${(oldY2 - 6).toFixed(1)} Q ${(ox + 48).toFixed(1)} ${(oy - 96).toFixed(1)} ${(ox + 10).toFixed(1)} ${(oy - 100).toFixed(1)}" fill="none" stroke="#2563EB" stroke-width="2" stroke-dasharray="4 3"/>
        <line x1="${ox}" y1="${oy}" x2="${ox + len}" y2="${oy}" stroke="#1D4ED8" stroke-width="4.6" marker-end="url(#obs-blue)"/>
        <line x1="${ox}" y1="${oy}" x2="${ox}" y2="${oy - len}" stroke="#2563EB" stroke-width="4.6" marker-end="url(#obs-blue)"/>
        <circle cx="${ox}" cy="${oy}" r="4.5" fill="#1D4ED8"/>
        <text x="${ox + 52}" y="${oy - 28}" text-anchor="middle" fill="#1D4ED8" font-size="18" font-weight="900">90° 正交</text>
        ${svgTex(ox + len + 4, oy - 18, 64, 34, '\\mathbf{z}_1', '#1D4ED8', '18.5px', '', '', 1.5)}
        ${svgTex(ox - 54, oy - len - 8, 54, 34, '\\mathbf{z}_2', '#1D4ED8', '18.5px', '', '', 1.5)}
      `;
      topNote = svgRich(left + 12, top + 5, 374, 30, '消去投影并重组合：模长为 $1$ 且 $90^\\circ$ 正交', '#1D4ED8', '16px', '900', 1.18, 'flex-start');
    }

    return `<g class="vec-plot-2d">
      <rect x="${left}" y="${top}" width="398" height="208" rx="12" fill="#FFFFFF" stroke="${mode === 'whiten' ? '#60A5FA' : '#CBD5E1'}" stroke-width="2"/>
      <line x1="${left + 10}" y1="${top + 38}" x2="${left + 388}" y2="${top + 38}" stroke="#E2E8F0" stroke-width="1.4"/>
      ${topNote}
      ${vecSvg}
    </g>`;
  }


  window.PresentationVisuals = window.AuroraVisuals = {

    /* ========================================================================
     * SLIDE 1: OVERALL ARCHITECTURE (Matches Hand-Drawn Sketch Page 1)
     * Pure Unified Notation: X^{H \times d}, Y^{L \times d}, \widehat{\mu}(X), \widehat{\Sigma}(X)
     * Zero grey annotations inside boxes!
     * ======================================================================== */
    "slide1.overview": `<svg viewBox="0 0 1840 900" fill="none">
      <!-- ==================== LEFT PANEL: Joint Mean-Covariance Estimator ==================== -->
      ${drawJmceOverview(false)}

      <!-- ==================== CENTER VERTICAL DIVIDER ==================== -->
      <line x1="920" y1="28" x2="920" y2="776" stroke="#CBD5E1" stroke-width="2.5" stroke-dasharray="8 6"/>


      <!-- ==================== RIGHT PANEL: Conditional Whitened Generative Model ==================== -->
      <rect x="932" y="8" width="896" height="784" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(948, 22, 512, 48, 'Conditional Whitened Generative Model')}

      <!-- 3 Inputs: \widehat{\mu}(X), \widehat{\Sigma}(X), X -->
      <rect x="968" y="152" width="196" height="132" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <text x="1066" y="196" text-anchor="middle" fill="#1E3A8A" font-size="21" font-weight="900">条件均值</text>
      ${svgTex(980, 212, 172, 56, '\\widehat{\\mu}(X)', '#1D4ED8', '24px', '', '', 2.1)}

      <rect x="968" y="328" width="196" height="132" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <text x="1066" y="372" text-anchor="middle" fill="#1E3A8A" font-size="21" font-weight="900">条件协方差</text>
      ${svgTex(980, 388, 172, 56, '\\widehat{\\Sigma}(X)', '#1D4ED8', '24px', '', '', 2.1)}

      <rect x="968" y="504" width="196" height="132" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <text x="1066" y="548" text-anchor="middle" fill="#0F172A" font-size="21" font-weight="900">历史输入</text>
      ${svgTex(980, 564, 172, 56, 'X', '#0F172A', '24px', '', '', 2.1)}

      <!-- Arrows into Central Diffusion / Flow Block -->
      <path d="M 1164 218 L 1220 218 L 1220 318 L 1256 318" stroke="#1D4ED8" stroke-width="4.2" fill="none"/>
      <polygon points="1250,309 1268,318 1250,327" fill="#1D4ED8"/>

      <line x1="1164" y1="394" x2="1256" y2="394" stroke="#1D4ED8" stroke-width="4.2"/>
      <polygon points="1250,385 1268,394 1250,403" fill="#1D4ED8"/>

      <path d="M 1164 570 L 1220 570 L 1220 470 L 1256 470" stroke="#64748B" stroke-width="4.2" fill="none"/>
      <polygon points="1250,461 1268,470 1250,479" fill="#64748B"/>

      <!-- Central Generative Hub: Diffusion / Flow -->
      <rect x="1270" y="218" width="268" height="352" rx="22" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="3.2"/>
      <rect x="1294" y="242" width="220" height="136" rx="16" fill="#1D4ED8"/>
      <text x="1404" y="322" text-anchor="middle" fill="#FFFFFF" font-size="33" font-weight="900">Diffusion</text>

      <line x1="1302" y1="394" x2="1506" y2="394" stroke="#93C5FD" stroke-width="2.5" stroke-dasharray="8 6"/>

      <rect x="1294" y="410" width="220" height="136" rx="16" fill="#2563EB"/>
      <text x="1404" y="490" text-anchor="middle" fill="#FFFFFF" font-size="33" font-weight="900">Flow</text>

      <!-- Arrow to Predict -->
      <line x1="1538" y1="394" x2="1596" y2="394" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="1590,384 1610,394 1590,404" fill="#1D4ED8"/>

      <!-- Output Predict Card -->
      <rect x="1612" y="274" width="184" height="240" rx="18" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="2.8"/>
      <text x="1704" y="330" text-anchor="middle" fill="#1E3A8A" font-size="27" font-weight="900">Predict</text>
      ${svgTex(1624, 352, 160, 56, '\\widehat{Y}^{L \\times d}', '#1D4ED8', '24px', '', '', 2.05)}
      <path d="M 1636 462 C 1658 422, 1680 476, 1704 436 C 1726 402, 1748 450, 1772 416" stroke="#1D4ED8" stroke-width="5.5" stroke-linecap="round" fill="none"/>

      <!-- ==================== BOTTOM SUMMARY BANNER ==================== -->
      <rect x="12" y="808" width="1816" height="84" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <rect x="32" y="824" width="124" height="52" rx="10" fill="#1D4ED8"/>
      <text x="94" y="858" text-anchor="middle" fill="#FFFFFF" font-size="21" font-weight="900">核心思想</text>
      <text x="970" y="859" text-anchor="middle" fill="#0F172A" font-size="25" font-weight="900">训练模型估计未来期望与协方差，并作为先验信息降低流匹配 / 扩散模型拟合难度</text>
    </svg>`,

    /* ========================================================================
     * SLIDE 2: PROBLEMS & INNOVATIONS
     * ======================================================================== */
    "slide2.problems": `<svg viewBox="0 0 1840 900" fill="none">
      <!-- ==================== UPPER BAND: 4 CORE CHALLENGES ==================== -->
      <rect x="12" y="8" width="1816" height="444" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(28, 22, 340, 48, '面临的四大核心问题')}

      <!-- Problem 1: Non-stationarity -->
      <g>
        <rect x="28" y="92" width="430" height="336" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
        <rect x="48" y="114" width="46" height="42" rx="10" fill="#1D4ED8"/>
        <text x="71" y="143" text-anchor="middle" fill="#FFFFFF" font-size="21" font-weight="900">01</text>
        <text x="112" y="144" fill="#0F172A" font-size="25" font-weight="900">非平稳性特征</text>
        <rect x="48" y="178" width="390" height="148" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <line x1="68" y1="296" x2="418" y2="206" stroke="#94A3B8" stroke-width="2.5" stroke-dasharray="6 4"/>
        <path d="M 68 302 Q 102 266, 136 286 T 204 258 T 272 234 T 340 206 T 418 198" stroke="#1D4ED8" stroke-width="5" fill="none"/>
        <text x="243" y="382" text-anchor="middle" fill="#0F172A" font-size="22" font-weight="900">趋势、季节效应与异方差</text>
      </g>

      <!-- Problem 2: Inter-variable Dependencies -->
      <g>
        <rect x="479" y="92" width="430" height="336" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
        <rect x="499" y="114" width="46" height="42" rx="10" fill="#1D4ED8"/>
        <text x="522" y="143" text-anchor="middle" fill="#FFFFFF" font-size="21" font-weight="900">02</text>
        <text x="563" y="144" fill="#0F172A" font-size="25" font-weight="900">变量间复杂依赖</text>
        <rect x="499" y="178" width="390" height="148" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        ${drawWeightGrid(540, 204, 3, 4, 28, 26, 6, ['#1D4ED8', '#60A5FA', '#93C5FD', '#2563EB'])}
        ${svgTex(700, 222, 170, 60, '\\Sigma(Y) \\neq \\mathrm{diag}', '#1E3A8A', '21px', '', '', 1.75)}
        <text x="694" y="382" text-anchor="middle" fill="#0F172A" font-size="22" font-weight="900">多维特征耦合与非对角协方差</text>
      </g>

      <!-- Problem 3: Inherent Uncertainty -->
      <g>
        <rect x="930" y="92" width="430" height="336" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
        <rect x="950" y="114" width="46" height="42" rx="10" fill="#1D4ED8"/>
        <text x="973" y="143" text-anchor="middle" fill="#FFFFFF" font-size="21" font-weight="900">03</text>
        <text x="1014" y="144" fill="#0F172A" font-size="25" font-weight="900">内生数据不确定性</text>
        <rect x="950" y="178" width="390" height="148" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <path d="M 976 252 C 1022 212, 1070 292, 1120 242 C 1170 202, 1220 292, 1270 246 C 1294 226, 1308 266, 1318 248" stroke="#93C5FD" stroke-width="26" stroke-linecap="round" fill="none" opacity="0.55"/>
        <path d="M 976 252 L 1004 224 L 1032 276 L 1060 228 L 1088 270 L 1116 220 L 1144 278 L 1172 224 L 1200 268 L 1228 218 L 1256 272 L 1284 230 L 1316 252" stroke="#2563EB" stroke-width="4" fill="none"/>
        <text x="1145" y="382" text-anchor="middle" fill="#0F172A" font-size="22" font-weight="900">高频短期波动与随机噪声</text>
      </g>

      <!-- Problem 4: Distribution Shifts -->
      <g>
        <rect x="1381" y="92" width="430" height="336" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
        <rect x="1401" y="114" width="46" height="42" rx="10" fill="#1D4ED8"/>
        <text x="1424" y="143" text-anchor="middle" fill="#FFFFFF" font-size="21" font-weight="900">04</text>
        <text x="1465" y="144" fill="#0F172A" font-size="25" font-weight="900">训练与测试分布偏移</text>
        <rect x="1401" y="178" width="390" height="148" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
        <path d="M 1422 296 C 1452 296, 1470 212, 1502 212 C 1534 212, 1552 296, 1582 296" stroke="#64748B" stroke-width="4.5" fill="#E2E8F0" fill-opacity="0.65"/>
        <path d="M 1592 296 C 1622 296, 1646 208, 1682 208 C 1718 208, 1742 296, 1772 296" stroke="#1D4ED8" stroke-width="4.5" fill="#BFDBFE" fill-opacity="0.65"/>
        <line x1="1502" y1="246" x2="1674" y2="246" stroke="#1D4ED8" stroke-width="3.5" stroke-dasharray="6 4"/>
        <text x="1596" y="382" text-anchor="middle" fill="#0F172A" font-size="22" font-weight="900">标准高斯先验产生显著分布偏移</text>
      </g>

      <!-- ==================== CENTRAL DOWNWARD TRANSITION ARROW ==================== -->
      <path d="M 906 458 L 906 502 M 934 458 L 934 502" stroke="#1D4ED8" stroke-width="5" stroke-linecap="round"/>
      <polygon points="888,496 920,526 952,496" fill="#1D4ED8"/>

      <!-- ==================== LOWER BAND: TWO CORE INNOVATIONS ==================== -->
      <rect x="12" y="532" width="894" height="360" rx="18" fill="#FFFFFF" stroke="#1D4ED8" stroke-width="3"/>
      ${drawFloatingBadge(28, 548, 224, 48, '理论分析', '1')}

      <rect x="36" y="616" width="846" height="148" rx="16" fill="#EFF6FF" stroke="#93C5FD" stroke-width="2.4"/>
      ${svgRich(52, 628, 814, 38, '定理 1：条件高斯 $\\widehat{Q}_X = \\mathcal{N}(\\widehat{\\mu}, \\widehat{\\Sigma})$ 优于标准高斯 $\\mathcal{N}(0, I)$ 的充分条件', '#1E3A8A', '21.5px', '900', 1.45)}
      ${svgTex(52, 676, 814, 76, '\\displaystyle \\frac{\\|\\mu-\\widehat{\\mu}\\|_2^2 + \\|\\Sigma-\\widehat{\\Sigma}\\|_*}{\\lambda_{\\min}(\\widehat{\\Sigma})} + \\sqrt{L d}\\,\\|\\Sigma-\\widehat{\\Sigma}\\|_F \\le \\|\\mu\\|_2^2', '#0F172A', '21px', '', '', 1.82)}

      <rect x="36" y="782" width="846" height="88" rx="14" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2.2"/>
      ${svgRich(52, 806, 814, 42, 'KL 正交投影恒等式：$D_{\\mathrm{KL}}(P\\|Q) = D_{\\mathrm{KL}}(P\\|Q^*) + D_{\\mathrm{KL}}(Q^*\\|Q), \\quad Q^* = \\mathcal{N}(\\mu, \\Sigma)$', '#0F172A', '20.5px', '900', 1.48)}

      <rect x="934" y="532" width="894" height="360" rx="18" fill="#FFFFFF" stroke="#1D4ED8" stroke-width="3"/>
      ${drawFloatingBadge(950, 548, 260, 48, '设计了 JMCE', '2')}

      <rect x="958" y="616" width="846" height="148" rx="16" fill="#EFF6FF" stroke="#93C5FD" stroke-width="2.4"/>
      <text x="1381" y="656" text-anchor="middle" fill="#1E3A8A" font-size="21.5" font-weight="900">受定理 1 左端项启发的联合均值与滑窗协方差损失</text>
      ${svgTex(974, 676, 814, 76, '\\displaystyle \\mathcal{L}_{\\mathrm{JMCE}} = \\mathcal{L}_2 + \\mathcal{L}_{\\mathrm{SVD}} + \\lambda_{\\min}\\sqrt{L d}\\,\\mathcal{L}_F + w_{\\mathrm{Eigen}}\\sum_{t=1}^{L}\\mathcal{R}_{\\lambda_{\\min}}(\\widehat{\\Sigma}_t)', '#0F172A', '20px', '', '', 1.72)}

      <rect x="958" y="782" width="412" height="88" rx="14" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2.2"/>
      ${svgRich(970, 806, 388, 42, 'CW-Diff：$Y^{\\mathrm{CW}} = \\widehat{\\Sigma}^{-0.5} \\circ (Y - \\widehat{\\mu})$', '#1E3A8A', '20.5px', '900', 1.48)}

      <rect x="1392" y="782" width="412" height="88" rx="14" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2.2"/>
      ${svgRich(1404, 806, 388, 42, 'CW-Flow：$dY_\\tau^{\\mathrm{CW}} = (\\epsilon^{\\mathrm{CW}} - Y)d\\tau$', '#1E3A8A', '20.5px', '900', 1.48)}
    </svg>`,

    /* ========================================================================
     * SLIDE 3: THEORETICAL ANALYSIS PART 1 (Steps 1, 2, 3)
     * ======================================================================== */
    "slide3.theory1": `<svg viewBox="0 0 1840 900" fill="none">
      <rect x="12" y="8" width="896" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(28, 22, 548, 48, '1. 标准高斯 $\\mathcal{N}(0, I)$ 可能远离未来分布 $P_{Y|X}$')}

      <rect x="36" y="96" width="412" height="128" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <text x="242" y="140" text-anchor="middle" fill="#0F172A" font-size="22" font-weight="900">传统扩散终端分布</text>
      ${svgTex(56, 156, 372, 54, 'Q_0 = \\mathcal{N}(0, I)', '#334155', '23px', '', '', 2.0)}

      <rect x="472" y="96" width="412" height="128" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <text x="678" y="140" text-anchor="middle" fill="#1E3A8A" font-size="22" font-weight="900">真实未来条件分布</text>
      ${svgTex(492, 156, 372, 54, 'P = P_{Y \\mid X}', '#1D4ED8', '23px', '', '', 2.0)}

      <rect x="36" y="252" width="848" height="444" rx="18" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2.2"/>
      ${svgRich(56, 274, 808, 42, '一维直观算例：标准高斯 $Q_0 = \\mathcal{N}(0, 1)$ 与真实未来 $P = \\mathcal{N}(10, 4)$', '#0F172A', '22px', '900', 1.48)}

      <line x1="84" y1="612" x2="836" y2="612" stroke="#334155" stroke-width="3"/>
      <line x1="232" y1="612" x2="232" y2="626" stroke="#334155" stroke-width="3"/>
      <text x="232" y="658" text-anchor="middle" fill="#0F172A" font-size="22" font-weight="900">0</text>
      <line x1="624" y1="612" x2="624" y2="626" stroke="#1D4ED8" stroke-width="3"/>
      <text x="624" y="658" text-anchor="middle" fill="#1D4ED8" font-size="22" font-weight="900">10</text>

      <path d="M 116 612 C 160 612, 190 364, 232 364 C 274 364, 304 612, 348 612" stroke="#64748B" stroke-width="5" fill="#CBD5E1" fill-opacity="0.55"/>
      <line x1="232" y1="364" x2="232" y2="612" stroke="#64748B" stroke-width="2.5" stroke-dasharray="6 5"/>
      ${svgTex(142, 316, 180, 44, '\\mathcal{N}(0, 1)', '#334155', '21px', '', '', 1.8)}

      <path d="M 432 612 C 504 612, 560 424, 624 424 C 688 424, 744 612, 816 612" stroke="#1D4ED8" stroke-width="5.5" fill="#93C5FD" fill-opacity="0.55"/>
      <line x1="624" y1="424" x2="624" y2="612" stroke="#1D4ED8" stroke-width="2.5" stroke-dasharray="6 5"/>
      ${svgTex(534, 372, 180, 44, '\\mathcal{N}(10, 4)', '#1D4ED8', '21px', '', '', 1.8)}

      <line x1="248" y1="504" x2="608" y2="504" stroke="#1D4ED8" stroke-width="4" stroke-dasharray="8 6"/>
      <polygon points="600,494 618,504 600,514" fill="#1D4ED8"/>
      <polygon points="256,494 238,504 256,514" fill="#1D4ED8"/>
      <rect x="336" y="452" width="184" height="42" rx="10" fill="#EFF6FF" stroke="#2563EB" stroke-width="2"/>
      ${svgRich(344, 456, 168, 34, '$\\mu = 10,\\; \\sigma = 2$', '#1D4ED8', '19.5px', '900', 1.42)}

      <rect x="36" y="724" width="848" height="140" rx="16" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="2.8"/>
      ${svgRich(56, 742, 808, 46, "核心动机：将历史条件信息 $X$ 引入终端高斯分布", "#1E3A8A", "23.5px", "900", 1.52)}
      <text x="460" y="826" text-anchor="middle" fill="#1D4ED8" font-size="21.5" font-weight="800">构造贴近未来分布的条件高斯参考分布，缩减前向收敛与逆向生成距离</text>

      <line x1="920" y1="28" x2="920" y2="872" stroke="#CBD5E1" stroke-width="2.5" stroke-dasharray="8 6"/>

      <rect x="932" y="8" width="896" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(948, 22, 540, 48, '2. 最优高斯投影 $Q^*$ 与条件先验估计 $\\widehat{Q}_X$')}

      <rect x="956" y="96" width="848" height="184" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <text x="1380" y="138" text-anchor="middle" fill="#0F172A" font-size="22.5" font-weight="900">真实条件均值与真实条件协方差</text>
      ${svgTex(976, 156, 808, 52, '\\displaystyle \\mu = \\mathbb{E}[Y \\mid X], \\qquad \\Sigma = \\mathrm{Cov}(Y \\mid X)', '#0F172A', '22px', '', '', 1.92)}
      ${svgRich(976, 218, 808, 44, '在所有正定高斯分布中，与任意真实分布 $P$ 的 KL 散度最小的高斯分布为 $Q^* = \\mathcal{N}(\\mu, \\Sigma)$', '#1E3A8A', '20px', '900', 1.42)}

      <line x1="1380" y1="280" x2="1380" y2="316" stroke="#1D4ED8" stroke-width="4.2"/>
      <polygon points="1370,310 1380,328 1390,310" fill="#1D4ED8"/>

      <rect x="956" y="330" width="848" height="204" rx="18" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="3"/>
      <rect x="980" y="352" width="292" height="46" rx="10" fill="#1D4ED8"/>
      <text x="1126" y="382" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">KL 投影恒等式（引理 1）</text>
      ${svgRich(1292, 356, 488, 38, '因 $D_{\\mathrm{KL}}(Q^*\\|Q) \\ge 0$，当 $Q = Q^*$ 时取得最小值', '#1E3A8A', '19.5px', '900', 1.4)}
      ${svgTex(976, 418, 808, 92, '\\displaystyle D_{\\mathrm{KL}}(P \\,\\|\\, Q) = D_{\\mathrm{KL}}(P \\,\\|\\, Q^*) + D_{\\mathrm{KL}}(Q^* \\,\\|\\, Q)', '#0F172A', '24px', '', '', 2.15)}

      <line x1="1380" y1="534" x2="1380" y2="570" stroke="#1D4ED8" stroke-width="4.2"/>
      <polygon points="1370,564 1380,582 1390,564" fill="#1D4ED8"/>

      <rect x="956" y="584" width="848" height="280" rx="18" fill="#F8FAFC" stroke="#2563EB" stroke-width="2.6"/>
      ${svgRich(976, 598, 808, 42, "3. 真实 $\\mu, \\Sigma$ 未知：用历史 $X$ 的估计量构造 $\\widehat{Q}_X$", "#0F172A", "22px", "900", 1.48)}

      <rect x="984" y="654" width="376" height="182" rx="14" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2.2"/>
      <text x="1172" y="698" text-anchor="middle" fill="#334155" font-size="21" font-weight="900">传统扩散终端参考分布</text>
      ${svgTex(1004, 726, 336, 80, '\\displaystyle Q_0 = \\mathcal{N}(0, I)', '#0F172A', '24px', '', '', 2.1)}

      <rect x="1396" y="654" width="380" height="182" rx="14" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="2.8"/>
      <text x="1586" y="698" text-anchor="middle" fill="#1E3A8A" font-size="21" font-weight="900">本文条件高斯参考分布</text>
      ${svgTex(1412, 726, 348, 80, '\\displaystyle \\widehat{Q}_X = \\mathcal{N}\\big(\\widehat{\\mu}(X),\\, \\widehat{\\Sigma}(X)\\big)', '#1D4ED8', '22px', '', '', 1.92)}
    </svg>`,

    /* ========================================================================
     * SLIDE 4: THEOREM 1 (From the KL identity to the sufficient condition)
     * ======================================================================== */
    "slide4.theory2": `<svg viewBox="0 0 1840 900" fill="none">
      <rect x="12" y="8" width="896" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(28, 22, 428, 48, '引理 1 怎样接到定理 1？')}

      <rect x="36" y="92" width="848" height="292" rx="16" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2.2"/>
      <text x="460" y="144" text-anchor="middle" fill="#0F172A" font-size="26" font-weight="800">用引理 1 拆开两种参考分布的 KL</text>
      ${svgTex(56, 164, 808, 58, '\\displaystyle D_{\\mathrm{KL}}(P\\|\\widehat{Q}_X) = D_{\\mathrm{KL}}(P\\|Q^*) + D_{\\mathrm{KL}}(Q^*\\|\\widehat{Q}_X)', '#0F172A', '24px', '', '', 2.2)}
      ${svgTex(56, 231, 808, 58, '\\displaystyle D_{\\mathrm{KL}}(P\\|Q_0) = D_{\\mathrm{KL}}(P\\|Q^*) + D_{\\mathrm{KL}}(Q^*\\|Q_0)', '#0F172A', '24px', '', '', 2.2)}
      ${svgRich(56, 311, 808, 46, '两式相减，共同项 $D_{\\mathrm{KL}}(P\\|Q^*)$ 抵消。', '#1D4ED8', '25px', '800', 2.0)}

      <path d="M460 384 V411" stroke="#2563EB" stroke-width="3"/>
      <polygon points="451,408 469,408 460,425" fill="#2563EB"/>

      <rect x="36" y="427" width="848" height="181" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <text x="460" y="481" text-anchor="middle" fill="#1E3A8A" font-size="26" font-weight="800">剩下两个高斯 KL 的差</text>
      ${svgTex(56, 504, 808, 72, '\\displaystyle D_{\\mathrm{KL}}(Q^*\\|\\widehat{Q}_X) - D_{\\mathrm{KL}}(Q^*\\|Q_0)', '#1D4ED8', '24px', '', '', 2.25)}

      <rect x="36" y="638" width="848" height="226" rx="16" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2.2"/>
      <text x="68" y="726" fill="#0F172A" font-size="26" font-weight="750">作者用均值和协方差的估计误差给这个差值求上界。</text>
      ${svgRich(68, 754, 784, 58, '右栏式（3）要求上界 $\\le 0$，于是原来的 KL 差也 $\\le 0$。', '#1E3A8A', '26px', '800', 2.0, 'flex-start')}

      <line x1="920" y1="28" x2="920" y2="872" stroke="#CBD5E1" stroke-width="2.5" stroke-dasharray="8 6"/>
      <rect x="932" y="8" width="896" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(948, 22, 518, 48, '4. 定理 1：替换标准高斯的充分条件')}

      <rect x="956" y="92" width="848" height="187" rx="18" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="3"/>
      <text x="980" y="137" fill="#1E3A8A" font-size="24" font-weight="800">论文式（3）</text>
      ${svgTex(978, 151, 804, 108, '\\displaystyle \\frac{\\|\\mu-\\widehat{\\mu}\\|_2^2 + \\|\\Sigma-\\widehat{\\Sigma}\\|_*}{\\lambda_{\\min}(\\widehat{\\Sigma})} + \\sqrt{n}\\,\\|\\Sigma-\\widehat{\\Sigma}\\|_F \\le \\|\\mu\\|_2^2', '#0F172A', '24px', '', '', 2.35)}

      <rect x="956" y="299" width="848" height="132" rx="16" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2.2"/>
      <text x="1380" y="345" text-anchor="middle" fill="#0F172A" font-size="24" font-weight="800">满足式（3）时，条件高斯更接近或同样接近真实分布</text>
      ${svgTex(978, 356, 804, 57, '\\displaystyle D_{\\mathrm{KL}}\\big(P \\,\\|\\, \\widehat{Q}_X\\big) \\le D_{\\mathrm{KL}}\\big(P \\,\\|\\, Q_0\\big)', '#1D4ED8', '24px', '', '', 2.2)}

      <rect x="956" y="451" width="848" height="413" rx="16" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2.2"/>
      <path d="M972 451 H1788 Q1804 451 1804 467 V507 H956 V467 Q956 451 972 451Z" fill="#F1F5F9"/>
      <text x="1100" y="488" text-anchor="middle" fill="#0F172A" font-size="23" font-weight="800">数学量</text>
      <text x="1248" y="488" fill="#0F172A" font-size="23" font-weight="800">含义</text>
      ${[
        ['\\|\\mu-\\widehat{\\mu}\\|_2^2', '条件均值的平方估计误差'],
        ['\\|\\Sigma-\\widehat{\\Sigma}\\|_*', '协方差误差的核范数（奇异值之和）'],
        ['\\|\\Sigma-\\widehat{\\Sigma}\\|_F', '协方差误差的 Frobenius 范数'],
        ['\\lambda_{\\min}(\\widehat{\\Sigma})', '估计协方差的最小特征值，越小越放大误差'],
        ['\\|\\mu\\|_2^2', '真实条件均值到原点的平方距离']
      ].map(([formula, meaning], index) => {
        const top = 507 + index * 60;
        return `<g>
          ${index % 2 ? `<rect x="957" y="${top}" width="846" height="60" fill="#F8FAFC"/>` : ''}
          <line x1="957" y1="${top}" x2="1803" y2="${top}" stroke="#E2E8F0" stroke-width="1.5"/>
          ${svgTex(974, top + 5, 252, 50, formula, '#1E3A8A', '24px', '', '', 2.1)}
          <text x="1248" y="${top + 38}" fill="#0F172A" font-size="23" font-weight="700">${meaning}</text>
        </g>`;
      }).join('')}
      <line x1="957" y1="807" x2="1803" y2="807" stroke="#E2E8F0" stroke-width="1.5"/>
      ${svgRich(980, 816, 800, 40, '$n$ 为随机向量的维度，估计协方差 $\\widehat{\\Sigma}$ 为正定矩阵。', '#334155', '22px', '700', 1.8, 'flex-start')}
    </svg>`,

    /* ========================================================================
     * SLIDE 5: JMCE OVERVIEW & ALGORITHM 1 (Rebuilt with Standard Card + 3-Line Table + Vertical Guides)
     * ======================================================================== */
    "slide5.jmce": `<svg viewBox="0 0 1840 900" fill="none">
      <!-- ==================== LEFT PANEL: JMCE Architecture ==================== -->
      ${drawJmceOverview(true)}

      <!-- ==================== CENTER VERTICAL DIVIDER ==================== -->
      <line x1="920" y1="28" x2="920" y2="872" stroke="#CBD5E1" stroke-width="2.5" stroke-dasharray="8 6"/>

      <!-- ==================== RIGHT PANEL: Algorithm 1 (Three-Line Table Pseudocode) ==================== -->
      <rect x="932" y="8" width="896" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(948, 22, 446, 48, '算法 1：训练联合估计器 JMCE')}

      <!-- Top Rule of 3-Line Table -->
      <line x1="952" y1="86" x2="1808" y2="86" stroke="#0F172A" stroke-width="3"/>
      <rect x="952" y="88" width="856" height="80" fill="#F8FAFC"/>
      ${svgRich(964, 92, 836, 36, '输入：历史与未来序列对 $(X, Y)$，特征值下界 $\\lambda_{\\min}$，正则权重 $w_{\\mathrm{Eigen}}$', '#0F172A', '19.5px', '800', 1.4, 'flex-start')}
      ${svgRich(964, 128, 836, 36, '输出：训练收敛的联合均值-协方差估计器 $\\mathrm{JMCE}_{\\theta}$', '#0F172A', '19.5px', '800', 1.4, 'flex-start')}
      <!-- Middle Rule of 3-Line Table -->
      <line x1="952" y1="170" x2="1808" y2="170" stroke="#0F172A" stroke-width="1.8"/>

      <!-- VS Code / algpseudocode Vertical Indent Guide Lines -->
      <!-- Level 1 guide (while loop body: lines 4 to 14) -->
      <line x1="1008" y1="${178 + 3 * 42 + 6}" x2="1008" y2="${178 + 14 * 42 - 6}" stroke="#CBD5E1" stroke-width="2.2"/>
      <!-- Level 2 guide (for loop body: lines 6 to 9) -->
      <line x1="1040" y1="${178 + 5 * 42 + 6}" x2="1040" y2="${178 + 9 * 42 - 6}" stroke="#93C5FD" stroke-width="2.2"/>

      ${[
        [0, '调用算法 2 预计算未来序列 $Y$ 的滑窗协方差真值 $\\widetilde{\\Sigma}_{1:L} \\in \\mathbb{R}^{L \\times d \\times d}$', ''],
        [0, '初始化非平稳 Transformer 网络参数 $\\theta$', ''],
        [0, 'while 网络未收敛 do', ''],
        [1, '$(\\widehat{\\mu},\\, \\widehat{L}_{1:L}) \\leftarrow \\mathrm{JMCE}_{\\theta}(X)$', '$\\triangleright\\;\\widehat{\\mu}\\in\\mathbb{R}^{L\\times d},\\;\\widehat{L}_t\\in\\mathbb{R}^{d\\times d}$ 下三角'],
        [1, 'for $t = 1, \\ldots, L$ do', ''],
        [2, '$\\widehat{\\Sigma}_t \\leftarrow \\widehat{L}_t \\widehat{L}_t^\\top$', '$\\triangleright\\;$Cholesky 重构预测协方差'],
        [2, '$E_t \\leftarrow \\widetilde{\\Sigma}_t - \\widehat{\\Sigma}_t$', '$\\triangleright\\;$当前预测步协方差误差矩阵'],
        [2, '$\\{\\widetilde{s}_{t,i}\\}_{i=1}^{d} \\leftarrow \\mathrm{SVD}(E_t)$', '$\\triangleright\\;$求误差矩阵 $E_t$ 的奇异值'],
        [2, '$\\{\\widehat{\\lambda}_{t,i}\\}_{i=1}^{d} \\leftarrow \\mathrm{Eig}(\\widehat{\\Sigma}_t)$', '$\\triangleright\\;$求预测协方差 $\\widehat{\\Sigma}_t$ 的特征值'],
        [1, 'end for', ''],
        [1, '$\\mathcal{L}_2 \\leftarrow \\|Y - \\widehat{\\mu}\\|_2^2, \\qquad \\mathcal{L}_F \\leftarrow \\sum_{t=1}^{L} \\|E_t\\|_F$', ''],
        [1, '$\\mathcal{L}_{\\mathrm{SVD}} \\leftarrow \\sum_{t=1}^{L}\\sum_{i=1}^{d}\\widetilde{s}_{t,i}, \\quad \\mathcal{R}_{\\lambda_{\\min}} \\leftarrow \\sum_{t=1}^{L}\\sum_{i=1}^{d}\\max(0,\\, \\lambda_{\\min}-\\widehat{\\lambda}_{t,i})$', ''],
        [1, '$\\mathcal{L}_{\\mathrm{JMCE}} \\leftarrow \\mathcal{L}_2 + \\mathcal{L}_{\\mathrm{SVD}} + \\lambda_{\\min}\\sqrt{Ld}\\,\\mathcal{L}_F + w_{\\mathrm{Eigen}}\\mathcal{R}_{\\lambda_{\\min}}$', ''],
        [1, '反向传播梯度 $\\nabla_{\\theta}\\mathcal{L}_{\\mathrm{JMCE}}$ 并更新网络参数 $\\theta$', ''],
        [0, 'end while', ''],
        [0, 'return $\\mathrm{JMCE}_{\\theta}$', '']
      ].map(([level, stmt, comment], i) => {
        const y = 178 + i * 42;
        const indentX = 996 + level * 32;
        const isControl = /^(while|for|end|return)\b/.test(stmt);
        const rowBg = (i === 12) ? `<rect x="954" y="${y + 1}" width="852" height="40" rx="6" fill="#EFF6FF"/>` : '';
        return `<g class="alg1-line">
          ${rowBg}
          <text x="982" y="${y + 27}" text-anchor="end" fill="#64748B" font-size="17.5" font-weight="700" style="font-variant-numeric:tabular-nums">${i + 1}</text>
          ${svgRich(indentX, y, comment ? 500 : (1804 - indentX), 40, stmt, isControl ? '#1E3A8A' : '#0F172A', '19px', isControl ? '900' : '700', 1.38, 'flex-start')}
          ${comment ? svgRich(1476, y, 328, 40, comment, '#475569', '17px', '700', 1.28, 'flex-start') : ''}
        </g>`;
      }).join('')}

      <!-- Bottom Rule of 3-Line Table -->
      <line x1="952" y1="862" x2="1808" y2="862" stroke="#0F172A" stroke-width="3"/>
    </svg>`,

    /* ========================================================================
     * SLIDE 6: SLIDING WINDOW COVARIANCE (Left: 3 Core Calculation Cards, Right: Alg 2 + Window Schematic)
     * ======================================================================== */
    "jmce.slidingWindow": `<svg viewBox="0 0 1840 900" fill="none">
      <!-- ==================== LEFT PANEL: 3 Core Calculation Step Cards ==================== -->
      <rect x="12" y="8" width="896" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(28, 22, 460, 48, '左栏：局部滑窗协方差计算三步走')}

      <!-- Step 1 Card: Why Sliding Window & Local Window Definition -->
      <rect x="36" y="92" width="848" height="232" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <rect x="56" y="112" width="386" height="44" rx="10" fill="#1D4ED8"/>
      <text x="249" y="141" text-anchor="middle" fill="#FFFFFF" font-size="19.5" font-weight="900">1. 为什么要用滑窗：单时刻无法算协方差</text>
      ${svgRich(56, 166, 808, 40, '单时刻 $y_t \\in \\mathbb{R}^d$ 仅有一个样本向量；以 $t$ 为中心截取宽度 $W=2r+1$ 的局部窗口：', '#0F172A', '19.5px', '800', 1.38, 'flex-start')}
      <rect x="56" y="216" width="808" height="88" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${svgTex(72, 228, 776, 64, '\\displaystyle \\mathcal{W}_t = \\big\\{y_{t-r},\\, \\ldots,\\, y_t,\\, \\ldots,\\, y_{t+r}\\big\\} \\in \\mathbb{R}^{W \\times d}, \\qquad r = \\frac{W - 1}{2}', '#1E3A8A', '21.5px', '', '', 1.85)}

      <line x1="460" y1="324" x2="460" y2="356" stroke="#1D4ED8" stroke-width="4.2"/>
      <polygon points="450,350 460,368 470,350" fill="#1D4ED8"/>

      <!-- Step 2 Card: Window Mean & Covariance Formulas -->
      <rect x="36" y="370" width="848" height="262" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.8"/>
      <rect x="56" y="388" width="386" height="42" rx="10" fill="#1D4ED8"/>
      <text x="249" y="416" text-anchor="middle" fill="#FFFFFF" font-size="19.5" font-weight="900">2. 窗口内局部均值与协方差核心公式</text>
      ${svgTex(56, 432, 808, 86, '\\displaystyle \\widetilde{\\mu}_t = \\frac{1}{W}\\sum_{k=-r}^{r} y_{t+k} \\in \\mathbb{R}^d', '#0F172A', '20.5px', '局部均值：', '', 1.65)}
      <line x1="68" y1="522" x2="852" y2="522" stroke="#93C5FD" stroke-width="1.6" stroke-dasharray="6 4"/>
      ${svgTex(48, 528, 824, 96, '\\displaystyle \\widetilde{\\Sigma}_t = \\frac{1}{W}\\sum_{k=-r}^{r}(y_{t+k}-\\widetilde{\\mu}_t)(y_{t+k}-\\widetilde{\\mu}_t)^\\top = \\frac{1}{W}\\sum_{k=-r}^{r} y_{t+k}y_{t+k}^\\top - \\widetilde{\\mu}_t\\widetilde{\\mu}_t^\\top', '#1E3A8A', '19px', '', '', 1.58)}

      <line x1="460" y1="632" x2="460" y2="664" stroke="#1D4ED8" stroke-width="4.2"/>
      <polygon points="450,658 460,676 470,658" fill="#1D4ED8"/>

      <!-- Step 3 Card: Slide Step-by-Step Along L -->
      <rect x="36" y="678" width="848" height="192" rx="16" fill="#F8FAFC" stroke="#1D4ED8" stroke-width="2.6"/>
      <rect x="56" y="696" width="386" height="44" rx="10" fill="#334155"/>
      <text x="249" y="725" text-anchor="middle" fill="#FFFFFF" font-size="19.5" font-weight="900">3. 沿时间轴滑动一步一算，堆叠输出</text>
      ${svgRich(456, 698, 412, 40, '步幅为 $1$，共 $L$ 个窗口 · 复杂度 $O(LWd^2)$', '#1E3A8A', '19px', '800', 1.35, 'flex-end')}
      ${svgTex(56, 756, 808, 92, '\\displaystyle \\widetilde{\\Sigma}(Y) = \\big[\\widetilde{\\Sigma}_1,\\, \\widetilde{\\Sigma}_2,\\, \\ldots,\\, \\widetilde{\\Sigma}_L\\big] \\in \\mathbb{R}^{L \\times d \\times d}', '#1D4ED8', '23px', '', '', 2.0)}

      <!-- ==================== CENTER VERTICAL DIVIDER ==================== -->
      <line x1="920" y1="28" x2="920" y2="872" stroke="#CBD5E1" stroke-width="2.5" stroke-dasharray="8 6"/>

      <!-- ==================== RIGHT PANEL: Algorithm 2 + Sliding Window Schematic ==================== -->
      <rect x="932" y="8" width="896" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(948, 22, 536, 48, '算法 2：滑窗协方差计算 (SlidingWindowCov)')}

      <!-- Top Rule of 3-Line Table -->
      <line x1="952" y1="86" x2="1808" y2="86" stroke="#0F172A" stroke-width="3"/>
      <rect x="952" y="88" width="856" height="80" fill="#F8FAFC"/>
      ${svgRich(964, 92, 836, 36, '输入：未来真实序列 $Y = [y_1, \\ldots, y_L]^\\top \\in \\mathbb{R}^{L \\times d}$，奇数窗口长度 $W = 2r + 1$', '#0F172A', '19.5px', '800', 1.4, 'flex-start')}
      ${svgRich(964, 128, 836, 36, '输出：滑窗协方差真值张量 $\\widetilde{\\Sigma}_{1:L} \\in \\mathbb{R}^{L \\times d \\times d}$', '#0F172A', '19.5px', '800', 1.4, 'flex-start')}
      <!-- Middle Rule -->
      <line x1="952" y1="170" x2="1808" y2="170" stroke="#0F172A" stroke-width="1.8"/>

      <!-- Vertical Indent Guide for 'for t = 1, ..., L' (lines 4 to 7) -->
      <line x1="1008" y1="${182 + 3 * 46 + 6}" x2="1008" y2="${182 + 7 * 46 - 6}" stroke="#93C5FD" stroke-width="2.4"/>

      ${[
        [0, '计算单侧窗口半径 $r \\leftarrow (W - 1) / 2$', ''],
        [0, '对 $Y$ 首尾各反射延拓 $r$ 步，得扩展序列 $\\widetilde{Y} \\in \\mathbb{R}^{(L+2r)\\times d}$', ''],
        [0, 'for $t = 1, \\ldots, L$ do', ''],
        [1, '截取以 $t$ 为中心的 $W$ 步局部窗口 $\\mathcal{W}_t = \\{y_{t-r}, \\ldots, y_{t+r}\\}$', ''],
        [1, '$\\widetilde{\\mu}_t \\leftarrow \\frac{1}{W} \\sum_{k=-r}^{r} y_{t+k}$', '$\\triangleright\\;$窗口内局部均值向量 $(\\mathbb{R}^d)$'],
        [1, '$M_t \\leftarrow \\frac{1}{W} \\sum_{k=-r}^{r} y_{t+k} y_{t+k}^\\top$', '$\\triangleright\\;$窗口内二阶外积矩阵 $(\\mathbb{R}^{d \\times d})$'],
        [1, '$\\widetilde{\\Sigma}_t \\leftarrow M_t - \\widetilde{\\mu}_t \\widetilde{\\mu}_t^\\top$', '$\\triangleright\\;$中心化得 $t$ 时刻滑窗协方差'],
        [0, 'end for', ''],
        [0, 'return $\\widetilde{\\Sigma}_{1:L} = [\\widetilde{\\Sigma}_1, \\ldots, \\widetilde{\\Sigma}_L]$', '']
      ].map(([level, stmt, comment], i) => {
        const y = 182 + i * 46;
        const indentX = 996 + level * 32;
        const isControl = /^(for|end|return)\b/.test(stmt);
        const rowBg = (i === 6) ? `<rect x="954" y="${y + 1}" width="852" height="42" rx="6" fill="#EFF6FF"/>` : '';
        return `<g class="alg2-line">
          ${rowBg}
          <text x="982" y="${y + 29}" text-anchor="end" fill="#64748B" font-size="18" font-weight="700" style="font-variant-numeric:tabular-nums">${i + 1}</text>
          ${svgRich(indentX, y, comment ? 480 : (1804 - indentX), 42, stmt, isControl ? '#1E3A8A' : '#0F172A', '19.5px', isControl ? '900' : '700', 1.4, 'flex-start')}
          ${comment ? svgRich(1468, y, 336, 42, comment, '#475569', '17.5px', '700', 1.3, 'flex-start') : ''}
        </g>`;
      }).join('')}

      <!-- Bottom Rule of 3-Line Table -->
      <line x1="952" y1="604" x2="1808" y2="604" stroke="#0F172A" stroke-width="3"/>

      <!-- Companion Visual Schematic below Table: Reflection Padding & Sliding Window W_t -->
      <rect x="952" y="626" width="856" height="244" rx="16" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2.2"/>
      ${svgRich(972, 636, 816, 36, '反射延拓与局部滑窗截取示意图（默认 $W=95,\\; r=47$；ILI 数据集 $W=15,\\; r=7$）', '#0F172A', '19px', '900', 1.35, 'flex-start')}

      <!-- 3 Sequence Segments: Left Reflection | True Future Y | Right Reflection -->
      <rect x="974" y="688" width="186" height="74" rx="10" fill="#F1F5F9" stroke="#94A3B8" stroke-width="2" stroke-dasharray="5 3"/>
      <text x="1067" y="716" text-anchor="middle" fill="#475569" font-size="17" font-weight="800">左反射延拓 r 步</text>
      ${svgTex(982, 722, 170, 36, 'y_{r+1}, \\ldots, y_2', '#475569', '17px', '', '', 1.4)}

      <rect x="1168" y="688" width="424" height="74" rx="10" fill="#FFFFFF" stroke="#2563EB" stroke-width="2.4"/>
      <text x="1380" y="716" text-anchor="middle" fill="#1E3A8A" font-size="17.5" font-weight="900">真实未来序列 Y（共 L 步）</text>
      ${svgTex(1184, 722, 392, 36, 'y_1, \\ldots, y_{t-r}, \\ldots, y_t, \\ldots, y_{t+r}, \\ldots, y_L', '#0F172A', '17px', '', '', 1.4)}

      <rect x="1600" y="688" width="186" height="74" rx="10" fill="#F1F5F9" stroke="#94A3B8" stroke-width="2" stroke-dasharray="5 3"/>
      <text x="1693" y="716" text-anchor="middle" fill="#475569" font-size="17" font-weight="800">右反射延拓 r 步</text>
      ${svgTex(1608, 722, 170, 36, 'y_{L-1}, \\ldots, y_{L-r}', '#475569', '17px', '', '', 1.4)}

      <!-- Sliding Window Highlight Overlay W_t -->
      <rect x="1244" y="680" width="272" height="90" rx="12" fill="#2563EB" fill-opacity="0.10" stroke="#1D4ED8" stroke-width="2.8"/>
      <path d="M 1380 770 L 1380 796" stroke="#1D4ED8" stroke-width="3"/>
      <polygon points="1372,792 1380,806 1388,792" fill="#1D4ED8"/>

      <rect x="1104" y="806" width="552" height="48" rx="10" fill="#EFF6FF" stroke="#2563EB" stroke-width="2"/>
      ${svgRich(1116, 811, 528, 38, '窗口 $\\mathcal{W}_t$（宽 $W=2r+1$）$\\;\\longrightarrow\\;$ 输出 $(\\widetilde{\\mu}_t \\in \\mathbb{R}^d,\\; \\widetilde{\\Sigma}_t \\in \\mathbb{R}^{d \\times d})$', '#1E3A8A', '18.5px', '900', 1.35)}
    </svg>`,

    /* ========================================================================
     * SLIDE 7: JMCE LOSS & THEOREM 1 MAPPING (Left: Cholesky & Theorem 1 Mapping, Right: 4 Loss Terms)
     * ======================================================================== */
    "jmce.trainingFlow": `<svg viewBox="0 0 1840 900" fill="none">
      <!-- ==================== LEFT PANEL: Cholesky Parameterization & Theorem 1 Mapping ==================== -->
      <rect x="12" y="8" width="896" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(28, 22, 536, 48, '1. Cholesky 下三角重构与定理 1 映射关系')}

      <!-- Top Card: Cholesky Lower-Triangular Parameterization -->
      <rect x="36" y="92" width="848" height="244" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <rect x="56" y="110" width="388" height="44" rx="10" fill="#1D4ED8"/>
      <text x="250" y="139" text-anchor="middle" fill="#FFFFFF" font-size="19.5" font-weight="900">Cholesky 下三角参数化（天然半正定）</text>
      ${svgRich(458, 112, 412, 40, '网络输出下三角因子 $\\widehat{L}_t \\in \\mathbb{R}^{d \\times d}$', '#1E3A8A', '19px', '800', 1.38, 'flex-end')}
      ${svgTex(56, 166, 808, 76, '\\displaystyle \\widehat{\\Sigma}_t = \\widehat{L}_t \\widehat{L}_t^\\top \\succeq 0, \\qquad E_t = \\widetilde{\\Sigma}_t - \\widehat{\\Sigma}_t \\in \\mathbb{R}^{d \\times d}', '#0F172A', '23px', '', '', 2.0)}
      ${svgRich(56, 258, 808, 56, '对任意向量 $v \\in \\mathbb{R}^d$ 有 $v^\\top \\widehat{L}_t\\widehat{L}_t^\\top v = \\|\\widehat{L}_t^\\top v\\|_2^2 \\ge 0$，从结构上杜绝非对称或负定协方差', '#1E3A8A', '18.5px', '800', 1.32)}

      <line x1="460" y1="336" x2="460" y2="370" stroke="#1D4ED8" stroke-width="4.2"/>
      <polygon points="450,364 460,382 470,364" fill="#1D4ED8"/>

      <!-- Bottom Card: Theorem 1 Upper Bound to JMCE Loss Mapping -->
      <rect x="36" y="384" width="848" height="486" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <rect x="56" y="402" width="424" height="44" rx="10" fill="#334155"/>
      <text x="268" y="431" text-anchor="middle" fill="#FFFFFF" font-size="19.5" font-weight="900">定理 1 充分条件左端上界四项逐一映射</text>
      ${svgRich(492, 404, 372, 40, '最小化式 (3) 左端项即降低终端 KL 散度', '#334155', '18.5px', '800', 1.32, 'flex-end')}

      <!-- Theorem 1 LHS Box -->
      <rect x="56" y="460" width="808" height="104" rx="12" fill="#FFFFFF" stroke="#2563EB" stroke-width="2.2"/>
      ${svgTex(68, 470, 784, 84, '\\displaystyle \\mathrm{LHS} = \\big(\\min_{t,i}\\widehat{\\lambda}_{t,i}\\big)^{-1}\\Big(\\|\\mu-\\widehat{\\mu}\\|_2^2 + \\|\\Sigma-\\widehat{\\Sigma}\\|_*\\Big) + \\sqrt{Ld}\\,\\|\\Sigma-\\widehat{\\Sigma}\\|_F', '#0F172A', '21.5px', '', '', 1.85)}

      <!-- 4 Mapping Rows -->
      ${[
        ['\\|\\mu - \\widehat{\\mu}\\|_2^2', '\\mathcal{L}_2', '均值二范数平方误差（控制一阶趋势偏差）'],
        ['\\|\\Sigma - \\widehat{\\Sigma}\\|_*', '\\mathcal{L}_{\\mathrm{SVD}}', '协方差误差核范数（奇异值之和，控制谱误差）'],
        ['\\sqrt{Ld}\\,\\|\\Sigma - \\widehat{\\Sigma}\\|_F', '\\lambda_{\\min}\\sqrt{Ld}\\,\\mathcal{L}_F', '同乘特征值下界 $\\lambda_{\\min}$ 后的 Frobenius 范数项'],
        ['(\\min_{t,i}\\widehat{\\lambda}_{t,i})^{-1}', 'w_{\\mathrm{Eigen}}\\mathcal{R}_{\\lambda_{\\min}}', '惩罚小于 $\\lambda_{\\min}$ 的特征值，防止逆因子爆炸']
      ].map(([thmTerm, lossTerm, desc], idx) => {
        const y = 582 + idx * 68;
        return `<g>
          <rect x="56" y="${y}" width="808" height="58" rx="10" fill="${idx % 2 === 0 ? '#EFF6FF' : '#FFFFFF'}" stroke="#CBD5E1" stroke-width="1.6"/>
          ${svgTex(66, y + 6, 196, 46, thmTerm, '#0F172A', '19px', '', '', 1.55)}
          <text x="272" y="${y + 36}" text-anchor="middle" fill="#1D4ED8" font-size="22" font-weight="900">→</text>
          ${svgTex(292, y + 6, 172, 46, lossTerm, '#1D4ED8', '19px', '', '', 1.55)}
          ${svgRich(472, y + 8, 384, 42, desc, '#0F172A', '18px', '800', 1.3, 'flex-start')}
        </g>`;
      }).join('')}

      <!-- ==================== CENTER VERTICAL DIVIDER ==================== -->
      <line x1="920" y1="28" x2="920" y2="872" stroke="#CBD5E1" stroke-width="2.5" stroke-dasharray="8 6"/>

      <!-- ==================== RIGHT PANEL: 4 Loss Terms Breakdown ==================== -->
      <rect x="932" y="8" width="896" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(948, 22, 446, 48, '2. JMCE 联合训练总损失与四项分解')}

      <!-- Total Loss Banner -->
      <rect x="956" y="92" width="848" height="122" rx="16" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="3"/>
      ${svgTex(972, 108, 816, 90, '\\displaystyle \\mathcal{L}_{\\mathrm{JMCE}} = \\mathcal{L}_2 + \\mathcal{L}_{\\mathrm{SVD}} + \\lambda_{\\min}\\sqrt{Ld}\\,\\mathcal{L}_F + w_{\\mathrm{Eigen}}\\sum_{t=1}^{L}\\mathcal{R}_{\\lambda_{\\min}}(\\widehat{\\Sigma}_t)', '#1E3A8A', '22px', '', '', 1.88)}

      <!-- 4 Loss Component Cards -->
      ${[
        ['01', '均值平方误差', '点预测一阶矩监督', '\\displaystyle \\mathcal{L}_2 = \\|Y - \\widehat{\\mu}\\|_2^2 = \\sum_{t=1}^{L}\\|y_t - \\widehat{\\mu}_t\\|_2^2'],
        ['02', '协方差核范数损失', '误差矩阵奇异值之和', '\\displaystyle \\mathcal{L}_{\\mathrm{SVD}} = \\sum_{t=1}^{L}\\|E_t\\|_* = \\sum_{t=1}^{L}\\sum_{i=1}^{d}\\widetilde{s}_{t,i}'],
        ['03', '协方差 F 范数损失', '误差矩阵元素平方和开方', '\\displaystyle \\mathcal{L}_F = \\sum_{t=1}^{L}\\|E_t\\|_F = \\sum_{t=1}^{L}\\sqrt{\\mathrm{Tr}(E_t E_t^\\top)}'],
        ['04', '最小特征值下界惩罚', '默认 $\\lambda_{\\min}=0.1,\\; w_{\\mathrm{Eigen}}=50$', '\\displaystyle \\mathcal{R}_{\\lambda_{\\min}}(\\widehat{\\Sigma}_t) = \\sum_{i=1}^{d}\\mathrm{ReLU}\\big(\\lambda_{\\min} - \\widehat{\\lambda}_{t,i}\\big)']
      ].map(([code, title, sub, formula], index) => {
        const y = 232 + index * 130;
        const isBlue = index % 2 === 1;
        return `<g>
          <rect x="956" y="${y}" width="848" height="114" rx="14" fill="${isBlue ? '#EFF6FF' : '#F8FAFC'}" stroke="${isBlue ? '#60A5FA' : '#CBD5E1'}" stroke-width="2.2"/>
          <rect x="976" y="${y + 18}" width="42" height="38" rx="9" fill="#1D4ED8"/>
          <text x="997" y="${y + 44}" text-anchor="middle" fill="#FFFFFF" font-size="18.5" font-weight="900">${code}</text>
          <text x="1032" y="${y + 44}" fill="#0F172A" font-size="21.5" font-weight="900">${title}</text>
          ${svgRich(976, y + 64, 310, 36, sub, '#475569', '17.5px', '750', 1.28, 'flex-start')}
          ${svgTex(1276, y + 12, 512, 90, formula, '#0F172A', '21.5px', '', '', 1.82)}
        </g>`;
      }).join('')}

      <!-- Bottom Complexity Box -->
      <rect x="956" y="758" width="848" height="112" rx="14" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.4"/>
      ${svgRich(976, 770, 808, 42, '谱分解计算代价：每步需对 $d \\times d$ 矩阵求 SVD 奇异值与特征值', '#1E3A8A', '20.5px', '900', 1.42)}
      ${svgRich(976, 814, 808, 42, '单样本密集谱运算复杂度为 $O(Ld^3)$（高维通道 $d$ 较大时成为主要耗时瓶颈）', '#0F172A', '19.5px', '800', 1.38)}
    </svg>`,


    /* ========================================================================
     * SLIDE 8: CW-DIFF TRAINING & INFERENCE (Left: Training, Right: Inference)
     * ======================================================================== */
    "slide8.cwdiff": `<svg viewBox="0 0 1840 900" fill="none">
      <rect x="12" y="8" width="896" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(28, 22, 340, 48, '左栏：CW-Diff 训练过程')}

      <rect x="36" y="96" width="848" height="224" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <rect x="56" y="116" width="248" height="46" rx="10" fill="#1D4ED8"/>
      <text x="180" y="146" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">1. 条件白化变换</text>
      ${svgTex(56, 184, 808, 108, '\\displaystyle Y_0^{\\mathrm{CW}} = \\widehat{\\Sigma}(X)^{-0.5} \\circ \\big(Y - \\widehat{\\mu}(X)\\big)', '#0F172A', '24px', '', '', 2.15)}

      <line x1="460" y1="320" x2="460" y2="360" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="450,354 460,374 470,354" fill="#1D4ED8"/>

      <rect x="36" y="376" width="848" height="224" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <rect x="56" y="396" width="248" height="46" rx="10" fill="#334155"/>
      <text x="180" y="426" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">2. 白化空间前向加噪</text>
      ${svgTex(56, 456, 808, 60, '\\displaystyle dY_\\tau^{\\mathrm{CW}} = -\\frac{1}{2}\\beta_\\tau Y_\\tau^{\\mathrm{CW}}d\\tau + \\sqrt{\\beta_\\tau}\\,dW_\\tau, \\qquad \\tau \\in [0, 1]', '#0F172A', '21.5px', '', '', 1.9)}
      ${svgTex(56, 524, 808, 56, '\\displaystyle Y_\\tau^{\\mathrm{CW}} = \\alpha_\\tau Y_0^{\\mathrm{CW}} + \\sigma_\\tau \\epsilon, \\qquad \\epsilon \\sim \\mathcal{N}(0, I)', '#1E3A8A', '21.5px', '', '', 1.9)}

      <line x1="460" y1="600" x2="460" y2="640" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="450,634 460,654 470,634" fill="#1D4ED8"/>

      <rect x="36" y="656" width="848" height="208" rx="16" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="3"/>
      <rect x="56" y="676" width="248" height="46" rx="10" fill="#1D4ED8"/>
      <text x="180" y="706" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">3. 去噪网络训练损失</text>
      ${svgTex(56, 738, 808, 96, '\\displaystyle \\mathcal{L}_{\\mathrm{Diff}} = \\mathbb{E}_{(X, Y), \\tau, \\epsilon}\\Big\\|s_\\theta^{\\mathrm{CW}}\\big(\\alpha_\\tau Y_0^{\\mathrm{CW}} + \\sigma_\\tau \\epsilon,\\, X,\\, \\tau\\big) + \\frac{\\epsilon}{\\sigma_\\tau}\\Big\\|_2^2', '#0F172A', '22px', '', '', 1.95)}

      <line x1="920" y1="28" x2="920" y2="872" stroke="#CBD5E1" stroke-width="2.5" stroke-dasharray="8 6"/>

      <rect x="932" y="8" width="896" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(948, 22, 340, 48, '右栏：CW-Diff 推理过程')}

      <rect x="956" y="96" width="848" height="224" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <rect x="976" y="116" width="248" height="46" rx="10" fill="#334155"/>
      <text x="1100" y="146" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">1. 先验预测与噪声采样</text>
      ${svgTex(976, 176, 808, 60, '\\displaystyle \\widehat{\\mu}(X),\\; \\widehat{\\Sigma}(X) = \\mathrm{JMCE}(X)', '#0F172A', '22px', '', '', 1.95)}
      ${svgTex(976, 244, 808, 56, '\\displaystyle \\overleftarrow{Y}_1^{\\mathrm{CW}} \\sim \\mathcal{N}(0, I)', '#1D4ED8', '22.5px', '', '', 2.0)}

      <line x1="1380" y1="320" x2="1380" y2="360" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="1370,354 1380,374 1390,354" fill="#1D4ED8"/>

      <rect x="956" y="376" width="848" height="224" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <rect x="976" y="396" width="248" height="46" rx="10" fill="#2563EB"/>
      <text x="1100" y="426" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">2. 白化空间逆向 SDE</text>
      ${svgTex(976, 468, 808, 96, '\\displaystyle d\\overleftarrow{Y}_\\tau^{\\mathrm{CW}} = \\Big[-\\frac{1}{2}\\beta_\\tau \\overleftarrow{Y}_\\tau^{\\mathrm{CW}} - \\beta_\\tau s_\\theta^{\\mathrm{CW}}\\big(\\overleftarrow{Y}_\\tau^{\\mathrm{CW}}, X, \\tau\\big)\\Big]d\\tau + \\sqrt{\\beta_\\tau}\\,d\\overleftarrow{W}_\\tau', '#0F172A', '21px', '', '', 1.85)}

      <line x1="1380" y1="600" x2="1380" y2="640" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="1370,634 1380,654 1390,634" fill="#1D4ED8"/>

      <rect x="956" y="656" width="848" height="208" rx="16" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="3"/>
      <rect x="976" y="676" width="248" height="46" rx="10" fill="#1D4ED8"/>
      <text x="1100" y="706" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">3. 逆条件白化还原</text>
      ${svgTex(976, 738, 808, 96, '\\displaystyle \\widehat{Y} = \\widehat{\\Sigma}(X)^{0.5} \\circ \\overleftarrow{Y}_{\\tau_{\\min}}^{\\mathrm{CW}} + \\widehat{\\mu}(X)', '#1D4ED8', '24px', '', '', 2.15)}
    </svg>`,

    /* ========================================================================
     * SLIDE 9: CW-FLOW TRAINING & INFERENCE
     * ======================================================================== */
    "slide9.cwflow": `<svg viewBox="0 0 1840 900" fill="none">
      <rect x="12" y="8" width="896" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(28, 22, 340, 48, '左栏：CW-Flow 训练过程')}

      <rect x="36" y="96" width="848" height="224" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <rect x="56" y="116" width="248" height="46" rx="10" fill="#1D4ED8"/>
      <text x="180" y="146" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">1. 构造条件高斯噪声</text>
      ${svgTex(56, 184, 808, 108, '\\displaystyle \\epsilon^{\\mathrm{CW}} = \\widehat{\\Sigma}(X)^{0.5} \\circ \\epsilon + \\widehat{\\mu}(X) \\;\\sim\\; \\mathcal{N}\\big(\\widehat{\\mu}(X),\\, \\widehat{\\Sigma}(X)\\big)', '#0F172A', '22.5px', '', '', 2.0)}

      <line x1="460" y1="320" x2="460" y2="360" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="450,354 460,374 470,354" fill="#1D4ED8"/>

      <rect x="36" y="376" width="848" height="224" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <rect x="56" y="396" width="248" height="46" rx="10" fill="#334155"/>
      <text x="180" y="426" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">2. 线性流轨迹插值</text>
      ${svgTex(56, 456, 808, 60, '\\displaystyle dY_\\tau^{\\mathrm{CW}} = \\big(\\epsilon^{\\mathrm{CW}} - Y\\big)d\\tau, \\qquad \\tau \\in [0, 1]', '#0F172A', '22px', '', '', 1.95)}
      ${svgTex(56, 524, 808, 56, '\\displaystyle Y_\\tau^{\\mathrm{CW}} = (1 - \\tau)Y + \\tau \\epsilon^{\\mathrm{CW}}', '#1E3A8A', '22px', '', '', 1.95)}

      <line x1="460" y1="600" x2="460" y2="640" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="450,634 460,654 470,634" fill="#1D4ED8"/>

      <rect x="36" y="656" width="848" height="208" rx="16" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="3"/>
      <rect x="56" y="676" width="248" height="46" rx="10" fill="#1D4ED8"/>
      <text x="180" y="706" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">3. 速度场匹配损失</text>
      ${svgTex(56, 738, 808, 96, '\\displaystyle \\mathcal{L}_{\\mathrm{Flow}} = \\mathbb{E}_{(X, Y), \\tau, \\epsilon^{\\mathrm{CW}}}\\Big\\|\\epsilon^{\\mathrm{CW}} - Y - v_\\psi^{\\mathrm{CW}}\\big(Y_\\tau^{\\mathrm{CW}},\\, X,\\, \\tau\\big)\\Big\\|_2^2', '#0F172A', '22px', '', '', 1.95)}

      <line x1="920" y1="28" x2="920" y2="872" stroke="#CBD5E1" stroke-width="2.5" stroke-dasharray="8 6"/>

      <rect x="932" y="8" width="896" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(948, 22, 340, 48, '右栏：CW-Flow 推理过程')}

      <rect x="956" y="96" width="848" height="224" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <rect x="976" y="116" width="248" height="46" rx="10" fill="#334155"/>
      <text x="1100" y="146" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">1. 采样条件高斯起点</text>
      ${svgTex(976, 176, 808, 60, '\\displaystyle \\widehat{\\mu}(X),\\; \\widehat{\\Sigma}(X) = \\mathrm{JMCE}(X)', '#0F172A', '22px', '', '', 1.95)}
      ${svgTex(976, 244, 808, 56, '\\displaystyle \\overleftarrow{Y}_1^{\\mathrm{CW}} \\sim \\mathcal{N}\\big(\\widehat{\\mu}(X),\\, \\widehat{\\Sigma}(X)\\big)', '#1D4ED8', '22px', '', '', 1.95)}

      <line x1="1380" y1="320" x2="1380" y2="360" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="1370,354 1380,374 1390,354" fill="#1D4ED8"/>

      <rect x="956" y="376" width="848" height="224" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <rect x="976" y="396" width="248" height="46" rx="10" fill="#2563EB"/>
      <text x="1100" y="426" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">2. 逆向 ODE 积分</text>
      ${svgTex(976, 468, 808, 96, '\\displaystyle d\\overleftarrow{Y}_\\tau^{\\mathrm{CW}} = -v_\\psi^{\\mathrm{CW}}\\big(\\overleftarrow{Y}_\\tau^{\\mathrm{CW}},\\, X,\\, \\tau\\big)d\\tau, \\qquad \\tau \\in [1, \\tau_{\\min}]', '#0F172A', '22px', '', '', 1.95)}

      <line x1="1380" y1="600" x2="1380" y2="640" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="1370,634 1380,654 1390,634" fill="#1D4ED8"/>

      <rect x="956" y="656" width="848" height="208" rx="16" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="3"/>
      <rect x="976" y="676" width="248" height="46" rx="10" fill="#1D4ED8"/>
      <text x="1100" y="706" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">3. 直接输出预测序列</text>
      ${svgTex(976, 738, 808, 96, '\\displaystyle \\widehat{Y} = \\overleftarrow{Y}_{\\tau_{\\min}}^{\\mathrm{CW}}', '#1D4ED8', '25px', '', '', 2.25)}
    </svg>`,

    /* ========================================================================
     * SLIDE 10: REPRODUCTION METRICS TABLE
     * ======================================================================== */
    "slide10.exp1": `<svg viewBox="0 0 1840 900" fill="none">
      ${drawModelMetricsTable(38, 'FlowTS')}
      ${drawModelMetricsTable(956, 'Diffusion-TS')}
      <text class="cw-metrics-note" x="50" y="700" fill="#475569" font-size="23">
        <tspan x="50">Weather(修改版) 删除 1 条重复记录。原数据缺 9 个采样点，修改版排除 359 个跨缺口的训练窗口。</tspan>
        <tspan x="50" dy="36">按异常值删除的时间点为 0 个。两版训练数据各有 81 个 −9999 值参与标准化和训练。</tspan>
      </text>
    </svg>`,

    /* ========================================================================
     * SLIDE 11: REPRODUCTION FORECAST TRAJECTORIES
     * ======================================================================== */
    "slide11.exp2": `<svg viewBox="0 0 1840 900" role="img" aria-label="ETTh1 和 ETTh2 的历史、真实值以及 CW 与 w/o CW 预测轨迹">
      <image x="12" y="12" width="1816" height="876" href="decks/cw-gen/reproduction/forecast_comparison.svg"/>
    </svg>`,

    /* ========================================================================
     * SLIDE 12: PERSONAL ANALYSIS PART 1 — Centering vs Standardization vs Whitening
     * 4-Column Card Layout:
     *   Top Band: Core Insight & Vector Inner Product / Correlation Formula
     *   4 Columns: 0. 原始数据 -> 1. 减去均值（中心化） -> 2. 标准化 -> 3. 白化变换
     *   Each Column:
     *     - Header & Formula Pill
     *     - Upper Visual: 2D Distribution Shape Evolution (Shifted Ellipse -> Centered Ellipse -> Tilted Boxed Ellipse -> Standard Circle)
     *     - Middle Visual: Channel Vector Linear Algebra (Shifted -> Unequal Length & 36.9° -> Equal Length & 36.9° -> Equal Length & 90° Orthogonal)
     *     - Bottom Card: Scope & Covariance Property
     * ======================================================================== */
    "personal.whitening": `<svg viewBox="0 0 1840 900" fill="none">
      <defs>
        <marker id="obs-blue" markerWidth="13" markerHeight="13" refX="11" refY="6.5" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0 0 L13 6.5 L0 13 Z" fill="#1D4ED8"/>
        </marker>
        <marker id="obs-slate" markerWidth="13" markerHeight="13" refX="11" refY="6.5" orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0 0 L13 6.5 L0 13 Z" fill="#334155"/>
        </marker>
      </defs>

      <!-- ==================== TOP CORE INSIGHT & FORMULA BANNER ==================== -->
      <rect x="12" y="8" width="1816" height="106" rx="16" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      <rect x="28" y="24" width="144" height="44" rx="10" fill="#1D4ED8"/>
      <text x="100" y="53" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">核心区别</text>
      ${svgRich(188, 22, 1020, 44, '标准化只做单通道自身尺度放缩（除以标准差 $D^{-1/2}$，夹角 $\\theta$ 不变）；', '#0F172A', '21px', '900', 1.4, 'flex-start')}
      ${svgRich(28, 66, 1180, 40, '白化则利用完整协方差 $\\Sigma$ 将多通道向量重新线性组合，消去投影分量使夹角变为 $90^\\circ$（严格正交去相关）。', '#1E3A8A', '20px', '900', 1.38, 'flex-start')}

      <line x1="1220" y1="22" x2="1220" y2="100" stroke="#CBD5E1" stroke-width="2"/>
      <rect x="1236" y="20" width="576" height="82" rx="12" fill="#EFF6FF" stroke="#93C5FD" stroke-width="2"/>
      ${svgTex(1248, 28, 552, 66, '\\displaystyle \\mathrm{Cov}(\\mathbf{y}_1, \\mathbf{y}_2) = \\frac{1}{L}\\widetilde{\\mathbf{y}}_1^\\top\\widetilde{\\mathbf{y}}_2, \\quad \\rho = \\cos\\theta = \\frac{\\widetilde{\\mathbf{y}}_1^\\top\\widetilde{\\mathbf{y}}_2}{\\|\\widetilde{\\mathbf{y}}_1\\|\\,\\|\\widetilde{\\mathbf{y}}_2\\|}', '#0F172A', '19.5px', '', '', 1.65)}

      <!-- ==================== 4 STAGE COMPARISON COLUMNS ==================== -->
      ${[
        {
          idx: '0',
          title: '原始数据 (Raw)',
          mode: 'raw',
          formula: 'Y \\in \\mathbb{R}^{L \\times d}',
          scope: '未处理（存在均值偏移与跨通道耦合）',
          distDesc: '偏离原点 $(\\mu_1,\\mu_2)$ 的倾斜窄椭圆',
          vecDesc: '含均值偏移 $\\boldsymbol{\\mu}$，模长不等，$\\theta \\neq 90^\\circ$',
          covFormula: '\\mathbb{E}[Y]=\\mu\\neq 0,\\quad \\mathrm{Cov}(Y)=\\Sigma'
        },
        {
          idx: '1',
          title: '减去均值 (Centering)',
          mode: 'center',
          formula: 'Y_c = Y - \\mu',
          scope: '单通道独立平移（仅消去一阶均值）',
          distDesc: '平移至原点 $(0,0)$ 的倾斜窄椭圆',
          vecDesc: '模长不等 $\\|\\widetilde{\\mathbf{y}}_1\\|\\neq\\|\\widetilde{\\mathbf{y}}_2\\|$，夹角 $\\theta=36.9^\\circ$',
          covFormula: '\\mathbb{E}[Y_c]=0,\\quad \\mathrm{Cov}(Y_c)=\\Sigma'
        },
        {
          idx: '2',
          title: '标准化 (Standardization)',
          mode: 'std',
          formula: 'Y_{\\mathrm{std}} = D^{-1/2}(Y - \\mu)',
          scope: '单通道独立放缩（仅用对角方差 $D$）',
          distDesc: '宽高拉齐为 $1$，但仍斜向拉伸的椭圆',
          vecDesc: '模长拉齐为 $1$，夹角 $\\theta=36.9^\\circ$ 丝毫不变',
          covFormula: '\\mathrm{Cov}(Y_{\\mathrm{std}}) = R \\neq I_d\\;(\\rho = 0.8)'
        },
        {
          idx: '3',
          title: '白化变换 (Whitening)',
          mode: 'whiten',
          formula: 'Y^{\\mathrm{CW}} = \\Sigma^{-1/2}(Y - \\mu)',
          scope: '多通道联合线性重组（利用完整 $\\Sigma$）',
          distDesc: '消除斜向相关性，化为标准正圆 $\\mathcal{N}(0,I)$',
          vecDesc: '消去投影重组合：模长为 $1$ 且 $\\theta=90^\\circ$ 正交',
          covFormula: '\\mathrm{Cov}(Y^{\\mathrm{CW}}) = I_d\\;(\\rho = 0,\\; \\mathbf{z}_1 \\perp \\mathbf{z}_2)'
        }
      ].map((col, i) => {
        const x = 12 + i * 458;
        const w = 442;
        const cx = x + w / 2;
        const isWhiten = col.mode === 'whiten';
        return `<g class="whitening-col-${i}">
          <rect x="${x}" y="128" width="${w}" height="764" rx="18" fill="${isWhiten ? '#EFF6FF' : '#FFFFFF'}" stroke="${isWhiten ? '#1D4ED8' : '#CBD5E1'}" stroke-width="${isWhiten ? 3 : 2}"/>

          <!-- Header Row -->
          <rect x="${x + 18}" y="144" width="38" height="38" rx="9" fill="${isWhiten ? '#1D4ED8' : '#334155'}"/>
          <text x="${x + 37}" y="170" text-anchor="middle" fill="#FFFFFF" font-size="18.5" font-weight="900">${col.idx}</text>
          <text x="${x + 68}" y="170" fill="${isWhiten ? '#1E3A8A' : '#0F172A'}" font-size="22" font-weight="900">${col.title}</text>

          <!-- Formula Box -->
          <rect x="${x + 18}" y="194" width="${w - 36}" height="56" rx="10" fill="${isWhiten ? '#FFFFFF' : '#F8FAFC'}" stroke="${isWhiten ? '#60A5FA' : '#CBD5E1'}" stroke-width="1.8"/>
          ${svgTex(x + 26, 200, w - 52, 44, '\\displaystyle ' + col.formula, isWhiten ? '#1D4ED8' : '#0F172A', '20px', '', '', 1.7)}

          <!-- Upper Visual: 2D Distribution Shape -->
          <text x="${x + 22}" y="274" fill="#475569" font-size="16.5" font-weight="800">上层视角：二维数据分布形态演进</text>
          ${drawDistributionPlot2D(cx, 392, col.mode)}

          <!-- Middle Visual: Channel Vectors -->
          <text x="${x + 22}" y="524" fill="#475569" font-size="16.5" font-weight="800">下层视角：通道向量几何与夹角变化</text>
          ${drawVectorPlot2D(cx, 638, col.mode)}

          <!-- Bottom Summary Card -->
          <rect x="${x + 18}" y="754" width="${w - 36}" height="122" rx="12" fill="${isWhiten ? '#FFFFFF' : '#F8FAFC'}" stroke="${isWhiten ? '#2563EB' : '#CBD5E1'}" stroke-width="2"/>
          ${svgRich(x + 28, 760, w - 56, 34, col.scope, isWhiten ? '#1D4ED8' : '#0F172A', '17.5px', '900', 1.25, 'flex-start')}
          ${svgRich(x + 28, 792, w - 56, 34, col.vecDesc, '#334155', '17px', '750', 1.25, 'flex-start')}
          ${svgTex(x + 26, 828, w - 52, 40, col.covFormula, isWhiten ? '#1E3A8A' : '#0F172A', '18px', '', '', 1.5)}
        </g>`;
      }).join('')}
    </svg>`,

    /* ========================================================================
     * SLIDE 13: PERSONAL ANALYSIS PART 2 — Three Core Methodological Limitations
     * 3 Structured Module Cards + Bottom Synthesis Banner:
     *   1. Baseline 太弱（ETTh2 w/o CW 崩盘 7.12~9.69；白化仅是线性变换，强模型下增益缩水）
     *   2. CW-Diff 协方差矩阵的正定性与可逆性隐患（逆平方根要求严格正定，多通道共线奇异，靠 \lambda_min=0.1 硬撑扭曲真实相关性）
     *   3. 时间复杂度太大（O(Ld^3) SVD+Eig，Solar d=137 上 JMCE 24,185s + 白化 14,460s = 10.7h，是生成模型 684s 的 56.5 倍）
     * ======================================================================== */
    "personal.limitations": `<svg viewBox="0 0 1840 900" fill="none">
      <!-- ==================== CARD 1: Weak Baselines & Linear Transform Limit ==================== -->
      <rect x="12" y="8" width="592" height="784" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2.2"/>
      ${drawFloatingBadge(28, 22, 520, 48, 'Baseline 太弱与线性变换增益上限', '1')}

      <!-- Top Evidence Card: ETTh2 Collapse -->
      <rect x="32" y="92" width="552" height="262" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.2"/>
      <text x="52" y="130" fill="#0F172A" font-size="21" font-weight="900">复现证据：ETTh2 上裸基线 w/o CW 直接崩盘</text>

      <!-- Bar Chart Comparison inside Card 1 -->
      <rect x="52" y="148" width="512" height="136" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.8"/>
      <!-- FlowTS row -->
      <text x="68" y="182" fill="#0F172A" font-size="18" font-weight="800">FlowTS</text>
      <rect x="188" y="162" width="176" height="24" rx="5" fill="#94A3B8"/>
      <text x="374" y="181" fill="#334155" font-size="17.5" font-weight="850">w/o CW: 7.122</text>
      <rect x="188" y="190" width="26" height="22" rx="5" fill="#1D4ED8"/>
      <text x="224" y="207" fill="#1D4ED8" font-size="17.5" font-weight="900">CW: 0.698</text>

      <!-- Diffusion-TS row -->
      <text x="68" y="244" fill="#0F172A" font-size="18" font-weight="800">Diffusion-TS</text>
      <rect x="188" y="224" width="236" height="24" rx="5" fill="#64748B"/>
      <text x="434" y="243" fill="#0F172A" font-size="17.5" font-weight="900">w/o CW: 9.686</text>
      <rect x="188" y="252" width="28" height="22" rx="5" fill="#1D4ED8"/>
      <text x="226" y="269" fill="#1D4ED8" font-size="17.5" font-weight="900">CW: 0.751</text>

      ${svgRich(52, 298, 512, 42, '裸基线缺乏基本非平稳归一化，显著增益源于基线崩溃', '#1E3A8A', '18.5px', '800', 1.32, 'flex-start')}

      <!-- Bottom Analysis Card: Linear Transform Essence -->
      <rect x="32" y="374" width="552" height="396" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.4"/>
      <text x="52" y="414" fill="#1E3A8A" font-size="21" font-weight="900">本质剖析：白化只是外挂仿射线性变换</text>

      <rect x="52" y="434" width="512" height="86" rx="12" fill="#FFFFFF" stroke="#93C5FD" stroke-width="2"/>
      ${svgTex(64, 444, 488, 66, '\\displaystyle Y_0^{\\mathrm{CW}} = \\widehat{\\Sigma}(X)^{-0.5} \\circ \\big(Y - \\widehat{\\mu}(X)\\big)', '#0F172A', '21.5px', '', '', 1.85)}

      <rect x="52" y="540" width="512" height="100" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.8"/>
      <text x="70" y="576" fill="#0F172A" font-size="19" font-weight="850">• 仅消除一阶均值与二阶线性相关性</text>
      <text x="70" y="614" fill="#334155" font-size="18" font-weight="700">无法处理高阶非线性时序耦合与非高斯重尾分布</text>

      <rect x="52" y="654" width="512" height="98" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.8"/>
      <text x="70" y="690" fill="#1E3A8A" font-size="19" font-weight="850">• 强基线模型可自发学习等价变换</text>
      <text x="70" y="728" fill="#334155" font-size="18" font-weight="700">自带跨通道融合与归一化的强模型下，外挂 CW 增益大幅缩水</text>


      <!-- ==================== CARD 2: Positive-Definiteness & Invertibility Hazard ==================== -->
      <rect x="624" y="8" width="592" height="784" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2.2"/>
      ${drawFloatingBadge(640, 22, 548, 48, 'CW-Diff 协方差正定性与可逆性隐患', '2')}

      <!-- Top Box: Strict PD Requirement -->
      <rect x="644" y="92" width="552" height="262" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.4"/>
      <text x="664" y="130" fill="#1E3A8A" font-size="21" font-weight="900">代数前提：求逆平方根要求严格正定</text>

      <rect x="664" y="148" width="512" height="86" rx="12" fill="#FFFFFF" stroke="#93C5FD" stroke-width="2"/>
      ${svgRich(676, 158, 488, 66, '逆因子 $\\widehat{\\Sigma}_t^{-0.5}$ 或 $\\widehat{L}_t^{-1}$ 存在 $\\iff \\lambda_{\\min}(\\widehat{\\Sigma}_t) > 0$', '#0F172A', '20px', '900', 1.55)}

      ${svgRich(664, 248, 512, 42, '但 Cholesky 重构 $\\widehat{\\Sigma}_t = \\widehat{L}_t\\widehat{L}_t^\\top \\succeq 0$ 仅保证半正定；', '#0F172A', '18.5px', '800', 1.32, 'flex-start')}
      ${svgRich(664, 292, 512, 42, '当多通道序列高度共线时，$\\widehat{L}_t$ 对角元趋零，$\\widehat{\\Sigma}_t$ 奇异不可逆', '#1E3A8A', '18.5px', '800', 1.32, 'flex-start')}

      <!-- Bottom Box: Regularization Distortion -->
      <rect x="644" y="374" width="552" height="396" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.2"/>
      <text x="664" y="414" fill="#0F172A" font-size="21" font-weight="900">强行正则化的代价：扭曲真实通道相关性</text>

      <!-- Table 9 Evidence Box -->
      <rect x="664" y="434" width="512" height="110" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${svgRich(680, 444, 480, 38, '论文表 9 实测：无惩罚 ($w_{\\mathrm{Eigen}}=0$) 时最小特征值倒数爆炸', '#0F172A', '18px', '850', 1.28, 'flex-start')}
      ${svgTex(680, 486, 480, 48, '\\displaystyle \\big(\\min_{t,i}\\widehat{\\lambda}_{t,i}\\big)^{-1} = 2.2 \\times 10^{7} \\;\\xrightarrow{w_{\\mathrm{Eigen}}=50,\\;\\lambda_{\\min}=0.1}\\; 11.49', '#1D4ED8', '19.5px', '', '', 1.65)}

      <rect x="664" y="562" width="512" height="90" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.8"/>
      ${svgRich(680, 570, 480, 36, '• 靠 $\\lambda_{\\min}=0.1$ 惩罚强行撑起小特征值', '#0F172A', '19px', '850', 1.32, 'flex-start')}
      <text x="680" y="634" fill="#334155" font-size="18" font-weight="700">本质是在协方差对角线上人为注入各向同性白噪声</text>

      <rect x="664" y="666" width="512" height="86" rx="12" fill="#EFF6FF" stroke="#60A5FA" stroke-width="1.8"/>
      ${svgRich(680, 674, 480, 36, '• 破坏高维低秩相关性（论文第 22 页表 10 自证）', '#1E3A8A', '18.5px', '850', 1.3, 'flex-start')}
      ${svgRich(680, 712, 480, 34, '$\\lambda_{\\min}$ 增大时，协方差估计误差 $\\mathcal{L}_{\\mathrm{SVD}}$ 从 $0.484$ 恶化至 $0.528$', '#334155', '17.5px', '750', 1.25, 'flex-start')}


      <!-- ==================== CARD 3: O(L d^3) Computational Complexity Bottleneck ==================== -->
      <rect x="1236" y="8" width="592" height="784" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2.2"/>
      ${drawFloatingBadge(1252, 22, 548, 48, 'O(Ld³) 谱分解时间复杂度过大', '3')}

      <!-- Top Box: O(L d^3) Formula -->
      <rect x="1256" y="92" width="552" height="262" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.2"/>
      <text x="1276" y="130" fill="#0F172A" font-size="21" font-weight="900">每步双重矩阵分解：单样本复杂度 O(Ld³)</text>

      <rect x="1276" y="148" width="512" height="86" rx="12" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${svgTex(1288, 158, 488, 66, '\\displaystyle \\mathcal{T}_{\\mathrm{JMCE+CW}} = O\\big(L \\cdot d^3\\big) \\quad (\\mathrm{SVD} + \\mathrm{Eig} + \\widehat{\\Sigma}_t^{-0.5})', '#1E3A8A', '20px', '', '', 1.72)}

      ${svgRich(1276, 248, 512, 42, '训练每步需对 $L=192$ 个 $d \\times d$ 矩阵做 SVD 与特征分解；', '#0F172A', '18.5px', '800', 1.32, 'flex-start')}
      ${svgRich(1276, 292, 512, 42, '计算开销随通道数 $d$ 呈三次方增长，高维场景严重受限', '#1E3A8A', '18.5px', '800', 1.32, 'flex-start')}

      <!-- Bottom Box: Solar Energy (d=137) Runtime Breakdown (Table 19) -->
      <rect x="1256" y="374" width="552" height="396" rx="16" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="2.6"/>
      ${svgRich(1276, 390, 512, 38, '实测耗时（论文表 19：Solar Energy，$d=137$）', '#1E3A8A', '20.5px', '900', 1.38, 'flex-start')}

      <!-- Runtime Bar Comparison Card -->
      <rect x="1276" y="436" width="512" height="196" rx="12" fill="#FFFFFF" stroke="#93C5FD" stroke-width="2"/>

      <!-- Bar 1: Train NsDiff (684.45 s) -->
      <text x="1294" y="472" fill="#334155" font-size="18" font-weight="800">生成模型训练 (NsDiff)</text>
      <rect x="1294" y="480" width="24" height="20" rx="4" fill="#64748B"/>
      <text x="1328" y="497" fill="#0F172A" font-size="18" font-weight="900">684.45 s（约 11.4 分钟，基准 1.0×）</text>

      <!-- Bar 2: CW eigen (14,460 s) -->
      <text x="1294" y="532" fill="#1E3A8A" font-size="18" font-weight="800">条件白化特征分解 (CW eigen)</text>
      <rect x="1294" y="540" width="212" height="20" rx="4" fill="#3B82F6"/>
      <text x="1516" y="557" fill="#1E3A8A" font-size="18" font-weight="900">14,460 s（4.02 小时，21.1×）</text>

      <!-- Bar 3: Train JMCE (24,185 s) -->
      <text x="1294" y="592" fill="#1D4ED8" font-size="18" font-weight="900">训练联合估计器 (Train JMCE)</text>
      <rect x="1294" y="600" width="354" height="20" rx="4" fill="#1D4ED8"/>
      <text x="1656" y="617" fill="#1D4ED8" font-size="18" font-weight="900">24,185 s (35.3×)</text>

      <!-- Highlight Conclusion Box -->
      <rect x="1276" y="646" width="512" height="106" rx="12" fill="#1D4ED8"/>
      <text x="1532" y="686" text-anchor="middle" fill="#FFFFFF" font-size="21" font-weight="900">先验训练 + 白化总耗时 38,645 s（10.73 小时）</text>
      <text x="1532" y="728" text-anchor="middle" fill="#DBEAFE" font-size="19.5" font-weight="800">是生成模型本体训练时间（684.45 s）的 56.5 倍！</text>

      <!-- ==================== BOTTOM SYNTHESIS BANNER ==================== -->
      <rect x="12" y="808" width="1816" height="84" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <rect x="32" y="824" width="124" height="52" rx="10" fill="#1D4ED8"/>
      <text x="94" y="858" text-anchor="middle" fill="#FFFFFF" font-size="21" font-weight="900">综合评价</text>
      <text x="978" y="859" text-anchor="middle" fill="#0F172A" font-size="23.5" font-weight="900">CW-Gen 给出了清晰的先验替换理论界，但实际增益依赖弱基线对比，且高维下受制于正定性惩罚失真与 O(Ld³) 谱分解瓶颈</text>
    </svg>`
  };
})();
