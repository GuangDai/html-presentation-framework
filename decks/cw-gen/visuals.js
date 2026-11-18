/**
 * ============================================================================
 * @file decks/cw-gen/visuals.js
 * @description Pure SVG Visual Component Registry for CW-Gen (ICLR 2026).
 *              - 100% Unified Notation:
 *                Input X \in \mathbb{R}^{H \times d}, Future Y \in \mathbb{R}^{L \times d}
 *                Predicted Mean \widehat{\mu}(X) \in \mathbb{R}^{L \times d}
 *                Predicted Cov \widehat{\Sigma}(X) \in \mathbb{R}^{L \times d \times d}
 *              - Zero grey sub-captions / zero verbose filler text
 *              - Strictly monochrome slate-and-blue palette matching DBLoss
 *              - Theory split across 2 spacious slides (Slide 3 & Slide 4)
 *              - JMCE overview, sliding covariance and loss (Slides 5–7)
 *              - CW-Diff (Slide 8) & CW-Flow (Slide 9): concise Left Train / Right Infer
 *              - Reproduction Experiments and Personal Analysis
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

  function drawJmceOverview() {
    return `<g class="jmce-overview">
      <rect x="12" y="8" width="896" height="784" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
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

  function drawObservationPair(x, y, lengths, angle, labels) {
    const radians = angle * Math.PI / 180;
    const scale = 68;
    const a = lengths[0] * scale;
    const bx = lengths[1] * scale * Math.cos(radians);
    const by = -lengths[1] * scale * Math.sin(radians);
    const rightAngle = angle === 90;
    const arcRadius = 62;
    const mark = rightAngle
      ? 'M 26 0 V -26 H 0'
      : `M ${arcRadius} 0 A ${arcRadius} ${arcRadius} 0 0 0 ${arcRadius * Math.cos(radians)} ${-arcRadius * Math.sin(radians)}`;
    return `<g class="observation-vectors" data-angle="${angle}" transform="translate(${x},${y})">
      <path d="${mark}" fill="none" stroke="#94A3B8" stroke-width="2"/>
      <line x1="0" y1="0" x2="${a}" y2="0" stroke="#1D4ED8" stroke-width="4.5" marker-end="url(#obs-blue)"/>
      <line x1="0" y1="0" x2="${bx}" y2="${by}" stroke="#B45322" stroke-width="4.5" marker-end="url(#obs-orange)"/>
      <circle cx="0" cy="0" r="4" fill="#334155"/>
      <text x="${rightAngle ? 41 : 88}" y="${rightAngle ? -38 : -25}" text-anchor="middle"
            font-size="22" font-weight="750" fill="#475569">${rightAngle ? '90°' : '36.9°'}</text>
      ${svgTex(a - 35, 5, 70, 38, labels[0], '#1D4ED8', '21px', '', '', 1.7)}
      ${svgTex(bx - 35, by - 46, 70, 38, labels[1], '#B45322', '21px', '', '', 1.7)}
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
      ${drawJmceOverview()}

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
     * SLIDE 2: PROBLEMS & INNOVATIONS (Matches Hand-Drawn Sketch Page 2)
     * 4 clean visual cards on top -> Arrow -> 2 clean boxes on bottom (理论分析, 设计了 JMCE)
     * Zero grey sub-captions / zero citation clutter!
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
      <!-- Left Innovation Box: 理论分析 -->
      <rect x="12" y="532" width="894" height="360" rx="18" fill="#FFFFFF" stroke="#1D4ED8" stroke-width="3"/>
      ${drawFloatingBadge(28, 548, 224, 48, '理论分析', '1')}

      <rect x="36" y="616" width="846" height="148" rx="16" fill="#EFF6FF" stroke="#93C5FD" stroke-width="2.4"/>
      ${svgRich(52, 628, 814, 38, '定理 1：条件高斯 $\\widehat{Q}_X = \\mathcal{N}(\\widehat{\\mu}, \\widehat{\\Sigma})$ 优于标准高斯 $\\mathcal{N}(0, I)$ 的充分条件', '#1E3A8A', '21.5px', '900', 1.45)}
      ${svgTex(52, 676, 814, 76, '\\displaystyle \\frac{\\|\\mu-\\widehat{\\mu}\\|_2^2 + \\|\\Sigma-\\widehat{\\Sigma}\\|_*}{\\lambda_{\\min}(\\widehat{\\Sigma})} + \\sqrt{L d}\\,\\|\\Sigma-\\widehat{\\Sigma}\\|_F \\le \\|\\mu\\|_2^2', '#0F172A', '21px', '', '', 1.82)}

      <rect x="36" y="782" width="846" height="88" rx="14" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2.2"/>
      ${svgRich(52, 806, 814, 42, 'KL 正交投影恒等式：$D_{\\mathrm{KL}}(P\\|Q) = D_{\\mathrm{KL}}(P\\|Q^*) + D_{\\mathrm{KL}}(Q^*\\|Q), \\quad Q^* = \\mathcal{N}(\\mu, \\Sigma)$', '#0F172A', '20.5px', '900', 1.48)}

      <!-- Right Innovation Box: 设计了 JMCE -->
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
     * Spacious 2-Column Layout:
     *   Left Panel: 1. 标准高斯 N(0,I) 远离真实未来分布 P = P_{Y|X} (Visual Bell Curves)
     *   Right Panel: 2. 最优高斯投影 Q* = N(\mu, \Sigma) & 3. 条件高斯估计 \widehat{Q}_X
     * ======================================================================== */
    "slide3.theory1": `<svg viewBox="0 0 1840 900" fill="none">
      <!-- ==================== LEFT PANEL: STEP 1 (Why N(0,I) is far from Future Y) ==================== -->
      <rect x="12" y="8" width="896" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(28, 22, 548, 48, '1. 标准高斯 $\\mathcal{N}(0, I)$ 可能远离未来分布 $P_{Y|X}$')}

      <!-- Problem Formulation Cards -->
      <rect x="36" y="96" width="412" height="128" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <text x="242" y="140" text-anchor="middle" fill="#0F172A" font-size="22" font-weight="900">传统扩散终端分布</text>
      ${svgTex(56, 156, 372, 54, 'Q_0 = \\mathcal{N}(0, I)', '#334155', '23px', '', '', 2.0)}

      <rect x="472" y="96" width="412" height="128" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <text x="678" y="140" text-anchor="middle" fill="#1E3A8A" font-size="22" font-weight="900">真实未来条件分布</text>
      ${svgTex(492, 156, 372, 54, 'P = P_{Y \\mid X}', '#1D4ED8', '23px', '', '', 2.0)}

      <!-- Large Spacious Gaussian Distance Diagram: N(0,1) vs N(10,4) -->
      <rect x="36" y="252" width="848" height="444" rx="18" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2.2"/>
      ${svgRich(56, 274, 808, 42, '一维直观算例：标准高斯 $Q_0 = \\mathcal{N}(0, 1)$ 与真实未来 $P = \\mathcal{N}(10, 4)$', '#0F172A', '22px', '900', 1.48)}

      <!-- Horizontal Axis -->
      <line x1="84" y1="612" x2="836" y2="612" stroke="#334155" stroke-width="3"/>
      <!-- Tick 0 -->
      <line x1="232" y1="612" x2="232" y2="626" stroke="#334155" stroke-width="3"/>
      <text x="232" y="658" text-anchor="middle" fill="#0F172A" font-size="22" font-weight="900">0</text>
      <!-- Tick 10 -->
      <line x1="624" y1="612" x2="624" y2="626" stroke="#1D4ED8" stroke-width="3"/>
      <text x="624" y="658" text-anchor="middle" fill="#1D4ED8" font-size="22" font-weight="900">10</text>

      <!-- Curve 1: Standard Gaussian N(0,1) -->
      <path d="M 116 612 C 160 612, 190 364, 232 364 C 274 364, 304 612, 348 612" stroke="#64748B" stroke-width="5" fill="#CBD5E1" fill-opacity="0.55"/>
      <line x1="232" y1="364" x2="232" y2="612" stroke="#64748B" stroke-width="2.5" stroke-dasharray="6 5"/>
      ${svgTex(142, 316, 180, 44, '\\mathcal{N}(0, 1)', '#334155', '21px', '', '', 1.8)}

      <!-- Curve 2: True Future N(10,4) -->
      <path d="M 432 612 C 504 612, 560 424, 624 424 C 688 424, 744 612, 816 612" stroke="#1D4ED8" stroke-width="5.5" fill="#93C5FD" fill-opacity="0.55"/>
      <line x1="624" y1="424" x2="624" y2="612" stroke="#1D4ED8" stroke-width="2.5" stroke-dasharray="6 5"/>
      ${svgTex(534, 372, 180, 44, '\\mathcal{N}(10, 4)', '#1D4ED8', '21px', '', '', 1.8)}

      <!-- Distance Arrow -->
      <line x1="248" y1="504" x2="608" y2="504" stroke="#1D4ED8" stroke-width="4" stroke-dasharray="8 6"/>
      <polygon points="600,494 618,504 600,514" fill="#1D4ED8"/>
      <polygon points="256,494 238,504 256,514" fill="#1D4ED8"/>
      <rect x="336" y="452" width="184" height="42" rx="10" fill="#EFF6FF" stroke="#2563EB" stroke-width="2"/>
      ${svgRich(344, 456, 168, 34, '$\\mu = 10,\\; \\sigma = 2$', '#1D4ED8', '19.5px', '900', 1.42)}

      <!-- Bottom Conclusion Box -->
      <rect x="36" y="724" width="848" height="140" rx="16" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="2.8"/>
      ${svgRich(56, 742, 808, 46, "核心动机：将历史条件信息 $X$ 引入终端高斯分布", "#1E3A8A", "23.5px", "900", 1.52)}
      <text x="460" y="826" text-anchor="middle" fill="#1D4ED8" font-size="21.5" font-weight="800">构造贴近未来分布的条件高斯参考分布，缩减前向收敛与逆向生成距离</text>


      <!-- ==================== CENTER VERTICAL DIVIDER ==================== -->
      <line x1="920" y1="28" x2="920" y2="872" stroke="#CBD5E1" stroke-width="2.5" stroke-dasharray="8 6"/>


      <!-- ==================== RIGHT PANEL: STEP 2 & STEP 3 (Optimal Gaussian & Estimator) ==================== -->
      <rect x="932" y="8" width="896" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(948, 22, 540, 48, '2. 最优高斯投影 $Q^*$ 与条件先验估计 $\\widehat{Q}_X$')}

      <!-- Step 2A: True Conditional Moments -->
      <rect x="956" y="96" width="848" height="184" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <text x="1380" y="138" text-anchor="middle" fill="#0F172A" font-size="22.5" font-weight="900">真实条件均值与真实条件协方差</text>
      ${svgTex(976, 156, 808, 52, '\\displaystyle \\mu = \\mathbb{E}[Y \\mid X], \\qquad \\Sigma = \\mathrm{Cov}(Y \\mid X)', '#0F172A', '22px', '', '', 1.92)}
      ${svgRich(976, 218, 808, 44, '在所有正定高斯分布中，与任意真实分布 $P$ 的 KL 散度最小的高斯分布为 $Q^* = \\mathcal{N}(\\mu, \\Sigma)$', '#1E3A8A', '20px', '900', 1.42)}

      <line x1="1380" y1="280" x2="1380" y2="316" stroke="#1D4ED8" stroke-width="4.2"/>
      <polygon points="1370,310 1380,328 1390,310" fill="#1D4ED8"/>

      <!-- Step 2B: KL 投影恒等式（引理 1） -->
      <rect x="956" y="330" width="848" height="204" rx="18" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="3"/>
      <rect x="980" y="352" width="292" height="46" rx="10" fill="#1D4ED8"/>
      <text x="1126" y="382" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">KL 投影恒等式（引理 1）</text>
      ${svgRich(1292, 356, 488, 38, '因 $D_{\\mathrm{KL}}(Q^*\\|Q) \\ge 0$，当 $Q = Q^*$ 时取得最小值', '#1E3A8A', '19.5px', '900', 1.4)}
      ${svgTex(976, 418, 808, 92, '\\displaystyle D_{\\mathrm{KL}}(P \\,\\|\\, Q) = D_{\\mathrm{KL}}(P \\,\\|\\, Q^*) + D_{\\mathrm{KL}}(Q^* \\,\\|\\, Q)', '#0F172A', '24px', '', '', 2.15)}

      <line x1="1380" y1="534" x2="1380" y2="570" stroke="#1D4ED8" stroke-width="4.2"/>
      <polygon points="1370,564 1380,582 1390,564" fill="#1D4ED8"/>

      <!-- Step 3: Unknown True Moments -> Estimator \widehat{Q}_X -->
      <rect x="956" y="584" width="848" height="280" rx="18" fill="#F8FAFC" stroke="#2563EB" stroke-width="2.6"/>
      ${svgRich(976, 598, 808, 42, "3. 真实 $\\mu, \\Sigma$ 未知：用历史 $X$ 的估计量构造 $\\widehat{Q}_X$", "#0F172A", "22px", "900", 1.48)}

      <!-- Two Comparison Boxes Side-by-Side -->
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

    "slide5.jmce": `<svg viewBox="0 0 1840 900" fill="none">
      ${drawJmceOverview()}
      <g class="jmce-pseudocode">
        <text x="952" y="48" font-size="28" font-weight="900" fill="#111827">算法 1　训练 JMCE</text>
        <line x1="952" y1="68" x2="1812" y2="68" stroke="#111827" stroke-width="3"/>
        ${svgRich(960, 80, 840, 38, '输入　训练对 $(X,Y)$（历史、未来），阈值 $\\lambda_{\\min}$ 和权重 $w_{\\mathrm{Eigen}}$', '#111827', '23px', '650', 1.6, 'flex-start')}
        ${svgRich(960, 120, 840, 38, '输出　训练好的估计器 $\\mathrm{JMCE}_{\\theta}$', '#111827', '23px', '650', 1.6, 'flex-start')}
        <line x1="952" y1="168" x2="1812" y2="168" stroke="#111827" stroke-width="1.5"/>

        ${[
          [0, '从每个未来真值 $Y$ 计算滑窗协方差标签 $\\widetilde{\\Sigma}_{1:L}$'],
          [0, '初始化 JMCE 参数 $\\theta$'],
          [0, 'while 未满足停止条件 do'],
          [1, '取一批 $(X,Y)$ 及对应的滑窗标签'],
          [1, '$(\\widehat{\\mu},\\widehat{L}_{1:L})\\leftarrow\\mathrm{JMCE}_{\\theta}(X)$'],
          [1, 'for $t=1,\\ldots,L$ do'],
          [2, '$\\widehat{\\Sigma}_t\\leftarrow\\widehat{L}_t\\widehat{L}_t^\\top$，$E_t\\leftarrow\\widetilde{\\Sigma}_t-\\widehat{\\Sigma}_t$'],
          [2, '$s_t\\leftarrow\\operatorname{svdvals}(E_t)$，$\\lambda_t\\leftarrow\\operatorname{eigvalsh}(\\widehat{\\Sigma}_t)$'],
          [1, 'end for'],
          [1, '合成四项损失，令 $\\ell$ 为批次内的总损失均值'],
          [1, '用梯度 $\\nabla_\\theta\\ell$ 更新参数 $\\theta$'],
          [0, 'end while'],
          [0, 'return $\\mathrm{JMCE}_{\\theta}$']
        ].map(([level, instruction], i) => {
          const y = 178 + i * 44;
          const indent = 1020 + level * 44;
          const control = /^(while|for|end|return)\b/.test(instruction);
          return `<g class="jmce-code-line">
            <text x="990" y="${y + 29}" text-anchor="end" fill="#475569" font-size="20"
                  style="font-variant-numeric:tabular-nums">${i + 1}</text>
            ${svgRich(indent, y, 1798 - indent, 42, instruction, '#111827', '23px', control ? '850' : '600', 1.75, 'flex-start')}
          </g>`;
        }).join('')}

        <line x1="952" y1="760" x2="1812" y2="760" stroke="#111827" stroke-width="3"/>
        ${svgRich(960, 772, 840, 62, '$s_t$ 是误差矩阵的奇异值。$\\lambda_t$ 是预测协方差的特征值。', '#334155', '21px', '600', 1.7, 'flex-start')}
      </g>
    </svg>`,

    "jmce.slidingWindow": `<svg viewBox="0 0 1840 900" fill="none">
      <g class="sliding-window-steps">
        <text x="48" y="63" fill="#0F172A" font-size="29" font-weight="850">1. 左右各补几步</text>
        ${svgRich(48, 82, 1740, 48, '给定未来真值 $Y=(y_1,\\ldots,y_L)$。窗口宽度 $W=2r+1$，左右各反射补 $r$ 步。$W=95$ 时，每侧补 $47$ 步。', '#334155', '25px', '700', 1.8, 'flex-start')}

        ${[
          [48, 476, '左补 r 步', '[y_{r+1},\\ldots,y_2]'],
          [548, 744, '原序列 L 步', '[y_1,\\ldots,y_L]'],
          [1316, 476, '右补 r 步', '[y_{L-1},\\ldots,y_{L-r}]']
        ].map(([x, width, label, formula], i) => `<g>
          <rect x="${x}" y="154" width="${width}" height="139" rx="12"
                fill="${i === 1 ? '#EFF6FF' : '#F8FAFC'}" stroke="${i === 1 ? '#2563EB' : '#CBD5E1'}" stroke-width="2"/>
          <text x="${x + width / 2}" y="201" text-anchor="middle" fill="#0F172A" font-size="24" font-weight="800">${label}</text>
          ${svgTex(x + 20, 213, width - 40, 61, formula, '#1E3A8A', '25px', '', '', 2.05)}
        </g>`).join('')}
        ${svgRich(48, 305, 1740, 44, '拼接得到补齐后的序列 $P=(p_1,\\ldots,p_{L+2r})$。', '#334155', '24px', '650', 1.8, 'flex-start')}

        <line x1="48" y1="372" x2="1792" y2="372" stroke="#CBD5E1" stroke-width="2"/>
        <text x="48" y="423" fill="#0F172A" font-size="29" font-weight="850">2. 均值和协方差分别怎么算</text>
        ${svgRich(48, 444, 1740, 46, 'MoveAverage 每次取连续 $W$ 步，向右移 1 步。均值直接平均向量，协方差用外积的平均减去均值的外积。', '#334155', '25px', '700', 1.8, 'flex-start')}
        <rect x="48" y="514" width="700" height="121" rx="12" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
        <rect x="772" y="514" width="1020" height="121" rx="12" fill="#EFF6FF" stroke="#2563EB" stroke-width="2"/>
        <text x="76" y="576" fill="#0F172A" font-size="25" font-weight="850">均值</text>
        <text x="800" y="576" fill="#1E3A8A" font-size="25" font-weight="850">协方差</text>
        ${svgTex(190, 523, 526, 104, '\\displaystyle m_t=\\frac1W\\sum_{j=0}^{W-1}p_{t+j}', '#0F172A', '25px', '', '', 2.1)}
        ${svgTex(932, 523, 834, 104, '\\displaystyle \\widetilde{\\Sigma}_t=\\frac1W\\sum_{j=0}^{W-1}p_{t+j}p_{t+j}^{\\top}-m_tm_t^{\\top}', '#1E3A8A', '25px', '', '', 2.1)}

        <line x1="48" y1="670" x2="1792" y2="670" stroke="#CBD5E1" stroke-width="2"/>
        <text x="48" y="722" fill="#0F172A" font-size="29" font-weight="850">3. 为什么输出正好有 L 步</text>
        ${svgRich(48, 737, 1740, 54, '步幅为 1 时，窗口数为 $(L+2r)-W+1=L$。每步输出一个 $d\\times d$ 协方差，堆叠为 $L\\times d\\times d$。', '#334155', '25px', '700', 1.9, 'flex-start')}
        ${svgRich(48, 813, 1740, 46, '逐窗口直接计算的单样本复杂度为 $O(LWd^2)$，其中 $d$ 是通道数。', '#334155', '24px', '650', 1.8, 'flex-start')}
      </g>
    </svg>`,


    "jmce.trainingFlow": `<svg viewBox="0 0 1840 900" fill="none">
      <rect x="12" y="8" width="820" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(28, 22, 396, 48, '预测值与监督目标如何汇合')}
      <rect x="36" y="100" width="368" height="410" rx="16" fill="#EFF6FF" stroke="#93C5FD" stroke-width="2"/>
      <rect x="440" y="100" width="368" height="410" rx="16" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2"/>
      <text x="220" y="155" text-anchor="middle" fill="#1E3A8A" font-size="26" font-weight="850">历史输入</text>
      <text x="624" y="155" text-anchor="middle" fill="#0F172A" font-size="26" font-weight="850">未来真值</text>
      ${svgTex(52, 173, 336, 52, 'X\\in\\mathbb{R}^{H\\times d}', '#1D4ED8', '24px', '', '', 2.05)}
      ${svgTex(456, 173, 336, 52, 'Y\\in\\mathbb{R}^{L\\times d}', '#0F172A', '24px', '', '', 2.05)}
      <path d="M220 237 V268 M624 237 V268" stroke="#64748B" stroke-width="3"/>
      <polygon points="212,266 228,266 220,282" fill="#2563EB"/>
      <polygon points="616,266 632,266 624,282" fill="#64748B"/>
      <text x="220" y="325" text-anchor="middle" fill="#1E3A8A" font-size="24" font-weight="850">非平稳 Transformer</text>
      <text x="624" y="325" text-anchor="middle" fill="#334155" font-size="24" font-weight="850">滑窗协方差</text>
      ${svgTex(52, 343, 336, 48, '\\widehat{\\mu},\\,\\widehat{L}_1,\\ldots,\\widehat{L}_L', '#1D4ED8', '24px', '', '', 2.05)}
      ${svgTex(456, 343, 336, 48, '\\widetilde{\\Sigma}_1,\\ldots,\\widetilde{\\Sigma}_L', '#0F172A', '24px', '', '', 2.05)}
      <line x1="56" y1="407" x2="384" y2="407" stroke="#93C5FD" stroke-width="1.5"/>
      <line x1="460" y1="407" x2="788" y2="407" stroke="#CBD5E1" stroke-width="1.5"/>
      ${svgTex(52, 425, 336, 59, '\\widehat{\\Sigma}_t=\\widehat{L}_t\\widehat{L}_t^\\top', '#1D4ED8', '24px', '', '', 2.05)}
      <text x="624" y="456" text-anchor="middle" fill="#334155" font-size="23" font-weight="750">真值也用于均值监督</text>

      <path d="M220 510 V555 H422 V590 M624 510 V555 H422" stroke="#2563EB" stroke-width="3.5" fill="none"/>
      <polygon points="412,583 432,583 422,603" fill="#2563EB"/>
      <rect x="100" y="606" width="644" height="142" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.4"/>
      <text x="422" y="655" text-anchor="middle" fill="#1E3A8A" font-size="25" font-weight="850">按预测时点配对</text>
      ${svgTex(120, 668, 604, 58, '\\widehat{\\mu}\\leftrightarrow Y,\\qquad \\widehat{\\Sigma}_t\\leftrightarrow\\widetilde{\\Sigma}_t', '#1D4ED8', '24px', '', '', 2.05)}
      <line x1="422" y1="748" x2="422" y2="775" stroke="#2563EB" stroke-width="3"/>
      <polygon points="414,772 430,772 422,788" fill="#2563EB"/>
      <text x="422" y="822" text-anchor="middle" fill="#0F172A" font-size="25" font-weight="750">总损失反向传播，更新 JMCE 参数</text>

      <rect x="856" y="8" width="972" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(872, 22, 370, 48, 'JMCE 损失函数')}
      <rect x="880" y="93" width="924" height="115" rx="14" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.4"/>
      ${svgTex(902, 106, 880, 86, '\\displaystyle \\mathcal{L}_{\\mathrm{JMCE}}=\\mathcal{L}_2+\\mathcal{L}_{\\mathrm{SVD}}+\\lambda_{\\min}\\sqrt{Ld}\\,\\mathcal{L}_F+w_{\\mathrm{Eigen}}R', '#1E3A8A', '24px', '', '', 2.05)}
      ${svgRich(892, 225, 900, 46, '记协方差误差为 $E_t=\\widetilde{\\Sigma}_t-\\widehat{\\Sigma}_t$。以下是单样本损失项。', '#334155', '23px', '700', 1.8, 'flex-start')}

      ${[
        ['均值平方误差', '\\displaystyle \\mathcal{L}_2=\\|Y-\\widehat{\\mu}\\|_F^2'],
        ['协方差误差的核范数', '\\displaystyle \\mathcal{L}_{\\mathrm{SVD}}=\\sum_{t=1}^L\\sum_{i=1}^d\\sigma_i(E_t)'],
        ['协方差误差的 F 范数', '\\displaystyle \\mathcal{L}_F=\\sum_{t=1}^L\\|E_t\\|_F'],
        ['小特征值惩罚', '\\displaystyle R=\\sum_{t=1}^L\\sum_{i=1}^d\\max\\{0,\\lambda_{\\min}-\\lambda_i(\\widehat{\\Sigma}_t)\\}']
      ].map(([label, formula], index) => {
        const y = 289 + index * 105;
        return `<g>
          <rect x="880" y="${y}" width="924" height="91" rx="12" fill="${index % 2 === 0 ? '#F8FAFC' : '#FFFFFF'}" stroke="#CBD5E1" stroke-width="1.5"/>
          <text x="902" y="${y + 54}" fill="#0F172A" font-size="22" font-weight="850">${label}</text>
          ${svgTex(1160, y + 1, 620, 89, formula, '#0F172A', '24px', '', '', 1.86)}
        </g>`;
      }).join('')}

      ${svgRich(892, 735, 906, 52, '每个时点对 $d\\times d$ 的矩阵求奇异值、特征值。', '#1E3A8A', '24px', '800', 1.8, 'flex-start')}
      ${svgRich(892, 796, 906, 52, '单样本的密集谱运算为 $O(Ld^3)$，另计网络前后向。', '#1E3A8A', '24px', '800', 1.8, 'flex-start')}
    </svg>`,


    /* ========================================================================
     * SLIDE 8: CW-DIFF TRAINING & INFERENCE (Left: Training, Right: Inference)
     * Unified Notation: Input X, Target Y, Whitened Y^{\mathrm{CW}}, Score Network s_\theta^{\mathrm{CW}}
     * Concise equations, zero verbose grey subtitles!
     * ======================================================================== */
    "slide8.cwdiff": `<svg viewBox="0 0 1840 900" fill="none">
      <!-- ==================== LEFT PANEL: CW-DIFF TRAINING ==================== -->
      <rect x="12" y="8" width="896" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(28, 22, 340, 48, '左栏：CW-Diff 训练过程')}

      <!-- Step 1: Conditional Whitening -->
      <rect x="36" y="96" width="848" height="224" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <rect x="56" y="116" width="248" height="46" rx="10" fill="#1D4ED8"/>
      <text x="180" y="146" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">1. 条件白化变换</text>
      ${svgTex(56, 184, 808, 108, '\\displaystyle Y_0^{\\mathrm{CW}} = \\widehat{\\Sigma}(X)^{-0.5} \\circ \\big(Y - \\widehat{\\mu}(X)\\big)', '#0F172A', '24px', '', '', 2.15)}

      <line x1="460" y1="320" x2="460" y2="360" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="450,354 460,374 470,354" fill="#1D4ED8"/>

      <!-- Step 2: Forward OU Diffusion -->
      <rect x="36" y="376" width="848" height="224" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <rect x="56" y="396" width="248" height="46" rx="10" fill="#334155"/>
      <text x="180" y="426" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">2. 白化空间前向加噪</text>
      ${svgTex(56, 456, 808, 60, '\\displaystyle dY_\\tau^{\\mathrm{CW}} = -\\frac{1}{2}\\beta_\\tau Y_\\tau^{\\mathrm{CW}}d\\tau + \\sqrt{\\beta_\\tau}\\,dW_\\tau, \\qquad \\tau \\in [0, 1]', '#0F172A', '21.5px', '', '', 1.9)}
      ${svgTex(56, 524, 808, 56, '\\displaystyle Y_\\tau^{\\mathrm{CW}} = \\alpha_\\tau Y_0^{\\mathrm{CW}} + \\sigma_\\tau \\epsilon, \\qquad \\epsilon \\sim \\mathcal{N}(0, I)', '#1E3A8A', '21.5px', '', '', 1.9)}

      <line x1="460" y1="600" x2="460" y2="640" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="450,634 460,654 470,634" fill="#1D4ED8"/>

      <!-- Step 3: Score Network Loss -->
      <rect x="36" y="656" width="848" height="208" rx="16" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="3"/>
      <rect x="56" y="676" width="248" height="46" rx="10" fill="#1D4ED8"/>
      <text x="180" y="706" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">3. 去噪网络训练损失</text>
      ${svgTex(56, 738, 808, 96, '\\displaystyle \\mathcal{L}_{\\mathrm{Diff}} = \\mathbb{E}_{(X, Y), \\tau, \\epsilon}\\Big\\|s_\\theta^{\\mathrm{CW}}\\big(\\alpha_\\tau Y_0^{\\mathrm{CW}} + \\sigma_\\tau \\epsilon,\\, X,\\, \\tau\\big) + \\frac{\\epsilon}{\\sigma_\\tau}\\Big\\|_2^2', '#0F172A', '22px', '', '', 1.95)}


      <!-- ==================== CENTER VERTICAL DIVIDER ==================== -->
      <line x1="920" y1="28" x2="920" y2="872" stroke="#CBD5E1" stroke-width="2.5" stroke-dasharray="8 6"/>


      <!-- ==================== RIGHT PANEL: CW-DIFF INFERENCE ==================== -->
      <rect x="932" y="8" width="896" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(948, 22, 340, 48, '右栏：CW-Diff 推理过程')}

      <!-- Step 1: Prior Prediction & Standard Noise -->
      <rect x="956" y="96" width="848" height="224" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <rect x="976" y="116" width="248" height="46" rx="10" fill="#334155"/>
      <text x="1100" y="146" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">1. 先验预测与噪声采样</text>
      ${svgTex(976, 176, 808, 60, '\\displaystyle \\widehat{\\mu}(X),\\; \\widehat{\\Sigma}(X) = \\mathrm{JMCE}(X)', '#0F172A', '22px', '', '', 1.95)}
      ${svgTex(976, 244, 808, 56, '\\displaystyle \\overleftarrow{Y}_1^{\\mathrm{CW}} \\sim \\mathcal{N}(0, I)', '#1D4ED8', '22.5px', '', '', 2.0)}

      <line x1="1380" y1="320" x2="1380" y2="360" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="1370,354 1380,374 1390,354" fill="#1D4ED8"/>

      <!-- Step 2: Reverse SDE -->
      <rect x="956" y="376" width="848" height="224" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <rect x="976" y="396" width="248" height="46" rx="10" fill="#2563EB"/>
      <text x="1100" y="426" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">2. 白化空间逆向 SDE</text>
      ${svgTex(976, 468, 808, 96, '\\displaystyle d\\overleftarrow{Y}_\\tau^{\\mathrm{CW}} = \\Big[-\\frac{1}{2}\\beta_\\tau \\overleftarrow{Y}_\\tau^{\\mathrm{CW}} - \\beta_\\tau s_\\theta^{\\mathrm{CW}}\\big(\\overleftarrow{Y}_\\tau^{\\mathrm{CW}}, X, \\tau\\big)\\Big]d\\tau + \\sqrt{\\beta_\\tau}\\,d\\overleftarrow{W}_\\tau', '#0F172A', '21px', '', '', 1.85)}

      <line x1="1380" y1="600" x2="1380" y2="640" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="1370,634 1380,654 1390,634" fill="#1D4ED8"/>

      <!-- Step 3: Inverse Whitening -->
      <rect x="956" y="656" width="848" height="208" rx="16" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="3"/>
      <rect x="976" y="676" width="248" height="46" rx="10" fill="#1D4ED8"/>
      <text x="1100" y="706" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">3. 逆条件白化还原</text>
      ${svgTex(976, 738, 808, 96, '\\displaystyle \\widehat{Y} = \\widehat{\\Sigma}(X)^{0.5} \\circ \\overleftarrow{Y}_{\\tau_{\\min}}^{\\mathrm{CW}} + \\widehat{\\mu}(X)', '#1D4ED8', '24px', '', '', 2.15)}
    </svg>`,

    /* ========================================================================
     * SLIDE 9: CW-FLOW TRAINING & INFERENCE (Left: Training, Right: Inference)
     * Unified Notation: Input X, Target Y, Prior Noise \epsilon^{\mathrm{CW}}, Velocity v_\psi^{\mathrm{CW}}
     * Concise equations, zero verbose grey subtitles!
     * ======================================================================== */
    "slide9.cwflow": `<svg viewBox="0 0 1840 900" fill="none">
      <!-- ==================== LEFT PANEL: CW-FLOW TRAINING ==================== -->
      <rect x="12" y="8" width="896" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(28, 22, 340, 48, '左栏：CW-Flow 训练过程')}

      <!-- Step 1: Prior Noise Construction -->
      <rect x="36" y="96" width="848" height="224" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <rect x="56" y="116" width="248" height="46" rx="10" fill="#1D4ED8"/>
      <text x="180" y="146" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">1. 构造条件高斯噪声</text>
      ${svgTex(56, 184, 808, 108, '\\displaystyle \\epsilon^{\\mathrm{CW}} = \\widehat{\\Sigma}(X)^{0.5} \\circ \\epsilon + \\widehat{\\mu}(X) \\;\\sim\\; \\mathcal{N}\\big(\\widehat{\\mu}(X),\\, \\widehat{\\Sigma}(X)\\big)', '#0F172A', '22.5px', '', '', 2.0)}

      <line x1="460" y1="320" x2="460" y2="360" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="450,354 460,374 470,354" fill="#1D4ED8"/>

      <!-- Step 2: Linear ODE Interpolation -->
      <rect x="36" y="376" width="848" height="224" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <rect x="56" y="396" width="248" height="46" rx="10" fill="#334155"/>
      <text x="180" y="426" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">2. 线性流轨迹插值</text>
      ${svgTex(56, 456, 808, 60, '\\displaystyle dY_\\tau^{\\mathrm{CW}} = \\big(\\epsilon^{\\mathrm{CW}} - Y\\big)d\\tau, \\qquad \\tau \\in [0, 1]', '#0F172A', '22px', '', '', 1.95)}
      ${svgTex(56, 524, 808, 56, '\\displaystyle Y_\\tau^{\\mathrm{CW}} = (1 - \\tau)Y + \\tau \\epsilon^{\\mathrm{CW}}', '#1E3A8A', '22px', '', '', 1.95)}

      <line x1="460" y1="600" x2="460" y2="640" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="450,634 460,654 470,634" fill="#1D4ED8"/>

      <!-- Step 3: Flow Matching Velocity Loss -->
      <rect x="36" y="656" width="848" height="208" rx="16" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="3"/>
      <rect x="56" y="676" width="248" height="46" rx="10" fill="#1D4ED8"/>
      <text x="180" y="706" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">3. 速度场匹配损失</text>
      ${svgTex(56, 738, 808, 96, '\\displaystyle \\mathcal{L}_{\\mathrm{Flow}} = \\mathbb{E}_{(X, Y), \\tau, \\epsilon^{\\mathrm{CW}}}\\Big\\|\\epsilon^{\\mathrm{CW}} - Y - v_\\psi^{\\mathrm{CW}}\\big(Y_\\tau^{\\mathrm{CW}},\\, X,\\, \\tau\\big)\\Big\\|_2^2', '#0F172A', '22px', '', '', 1.95)}


      <!-- ==================== CENTER VERTICAL DIVIDER ==================== -->
      <line x1="920" y1="28" x2="920" y2="872" stroke="#CBD5E1" stroke-width="2.5" stroke-dasharray="8 6"/>


      <!-- ==================== RIGHT PANEL: CW-FLOW INFERENCE ==================== -->
      <rect x="932" y="8" width="896" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      ${drawFloatingBadge(948, 22, 340, 48, '右栏：CW-Flow 推理过程')}

      <!-- Step 1: Sample Prior Start State -->
      <rect x="956" y="96" width="848" height="224" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <rect x="976" y="116" width="248" height="46" rx="10" fill="#334155"/>
      <text x="1100" y="146" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">1. 采样条件高斯起点</text>
      ${svgTex(976, 176, 808, 60, '\\displaystyle \\widehat{\\mu}(X),\\; \\widehat{\\Sigma}(X) = \\mathrm{JMCE}(X)', '#0F172A', '22px', '', '', 1.95)}
      ${svgTex(976, 244, 808, 56, '\\displaystyle \\overleftarrow{Y}_1^{\\mathrm{CW}} \\sim \\mathcal{N}\\big(\\widehat{\\mu}(X),\\, \\widehat{\\Sigma}(X)\\big)', '#1D4ED8', '22px', '', '', 1.95)}

      <line x1="1380" y1="320" x2="1380" y2="360" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="1370,354 1380,374 1390,354" fill="#1D4ED8"/>

      <!-- Step 2: Reverse ODE Integration -->
      <rect x="956" y="376" width="848" height="224" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <rect x="976" y="396" width="248" height="46" rx="10" fill="#2563EB"/>
      <text x="1100" y="426" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">2. 逆向 ODE 积分</text>
      ${svgTex(976, 468, 808, 96, '\\displaystyle d\\overleftarrow{Y}_\\tau^{\\mathrm{CW}} = -v_\\psi^{\\mathrm{CW}}\\big(\\overleftarrow{Y}_\\tau^{\\mathrm{CW}},\\, X,\\, \\tau\\big)d\\tau, \\qquad \\tau \\in [1, \\tau_{\\min}]', '#0F172A', '22px', '', '', 1.95)}

      <line x1="1380" y1="600" x2="1380" y2="640" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="1370,634 1380,654 1390,634" fill="#1D4ED8"/>

      <!-- Step 3: Direct Output -->
      <rect x="956" y="656" width="848" height="208" rx="16" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="3"/>
      <rect x="976" y="676" width="248" height="46" rx="10" fill="#1D4ED8"/>
      <text x="1100" y="706" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">3. 直接输出预测序列</text>
      ${svgTex(976, 738, 808, 96, '\\displaystyle \\widehat{Y} = \\overleftarrow{Y}_{\\tau_{\\min}}^{\\mathrm{CW}}', '#1D4ED8', '25px', '', '', 2.25)}
    </svg>`,

    "slide10.exp1": `<svg viewBox="0 0 1840 900" fill="none">
      ${drawModelMetricsTable(38, 'FlowTS')}
      ${drawModelMetricsTable(956, 'Diffusion-TS')}
      <text class="cw-metrics-note" x="50" y="700" fill="#475569" font-size="23">
        <tspan x="50">Weather(修改版) 删除 1 条重复记录。原数据缺 9 个采样点，修改版排除 359 个跨缺口的训练窗口。</tspan>
        <tspan x="50" dy="36">按异常值删除的时间点为 0 个。两版训练数据各有 81 个 −9999 值参与标准化和训练。</tspan>
      </text>
    </svg>`,

    "slide11.exp2": `<svg viewBox="0 0 1840 900" role="img" aria-label="ETTh1 和 ETTh2 的历史、真实值以及 CW 与 w/o CW 预测轨迹">
      <image x="12" y="12" width="1816" height="876" href="decks/cw-gen/reproduction/forecast_comparison.svg"/>
    </svg>`,


    "personal.analysis": `<svg viewBox="0 0 1840 900" fill="none">
      <defs>
        <marker id="obs-blue" markerWidth="14" markerHeight="14" refX="12" refY="7"
                orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0 0 L14 7 L0 14 Z" fill="#1D4ED8"/>
        </marker>
        <marker id="obs-orange" markerWidth="14" markerHeight="14" refX="12" refY="7"
                orient="auto" markerUnits="userSpaceOnUse">
          <path d="M0 0 L14 7 L0 14 Z" fill="#B45322"/>
        </marker>
      </defs>
      <text x="48" y="51" fill="#0F172A" font-size="30" font-weight="850">从通道观测向量看白化</text>
      ${svgRich(48, 65, 1744, 52, '把一个通道的 $n$ 次观测排成一个 $n$ 维向量。图画出两根中心化向量张成的平面，示例取 $n=4$。', '#334155', '25px', '700', 1.78, 'flex-start')}
      <rect x="48" y="123" width="1744" height="85" rx="12" fill="#F1F5F9"/>
      ${svgTex(70, 125, 1010, 80, '\\displaystyle \\operatorname{Cov}_n(X,Y)=\\frac{\\widetilde{\\mathbf{x}}^\\top\\widetilde{\\mathbf{y}}}{n},\\qquad \\rho=\\frac{\\widetilde{\\mathbf{x}}^\\top\\widetilde{\\mathbf{y}}}{\\|\\widetilde{\\mathbf{x}}\\|\\,\\|\\widetilde{\\mathbf{y}}\\|}=\\cos\\theta', '#0F172A', '26px', '', '', 2.0)}
      <line x1="1145" y1="137" x2="1145" y2="194" stroke="#CBD5E1" stroke-width="1.5"/>
      <text x="1180" y="156" fill="#334155" font-size="22" font-weight="650">协方差同时取决于向量的长度和夹角。</text>
      <text x="1180" y="187" fill="#334155" font-size="22" font-weight="650">皮尔逊相关系数约去长度，只剩夹角的余弦。</text>

      <line x1="614" y1="233" x2="614" y2="593" stroke="#CBD5E1" stroke-width="1.5"/>
      <line x1="1224" y1="233" x2="1224" y2="593" stroke="#CBD5E1" stroke-width="1.5"/>
      <text x="48" y="261" fill="#0F172A" font-size="28" font-weight="850">中心化（减均值）</text>
      <text x="656" y="261" fill="#0F172A" font-size="28" font-weight="850">标准化</text>
      <text x="1264" y="261" fill="#0F172A" font-size="28" font-weight="850">白化</text>

      ${drawObservationPair(168, 432, [3.2, 1.5], Math.acos(0.8) * 180 / Math.PI, ['\\widetilde{\\mathbf{x}}', '\\widetilde{\\mathbf{y}}'])}
      ${drawObservationPair(786, 432, [2, 2], Math.acos(0.8) * 180 / Math.PI, ['\\mathbf{u}', '\\mathbf{v}'])}
      ${drawObservationPair(1394, 432, [2, 2], 90, ['\\mathbf{z}_1', '\\mathbf{z}_2'])}

      <text x="48" y="499" fill="#0F172A" font-size="24" font-weight="750">每个通道减去自己的均值。</text>
      ${svgRich(48, 514, 532, 46, '长度反映波动。本例 $\\rho=0.8$，夹角约 $36.9^\\circ$。', '#334155', '23px', '650', 1.65, 'flex-start')}
      ${svgTex(48, 557, 532, 40, '\\widetilde{\\mathbf{x}}=\\mathbf{x}-\\bar{x}\\mathbf{1}', '#1D4ED8', '22px', '', '', 1.65, 'flex-start')}
      <text x="656" y="499" fill="#0F172A" font-size="24" font-weight="750">每个向量除以自身的标准差。</text>
      ${svgRich(656, 514, 532, 46, '长度都变成 $\\sqrt{n}$，夹角仍约为 $36.9^\\circ$。', '#334155', '23px', '650', 1.65, 'flex-start')}
      ${svgTex(656, 557, 532, 40, '\\mathbf{u}=\\widetilde{\\mathbf{x}}/\\sigma_X,\\qquad \\mathbf{v}=\\widetilde{\\mathbf{y}}/\\sigma_Y', '#1D4ED8', '22px', '', '', 1.65, 'flex-start')}
      <text x="1264" y="499" fill="#0F172A" font-size="24" font-weight="750">从第二根向量中减去它在第一根上的投影。</text>
      ${svgRich(1264, 514, 532, 46, '再缩放到同一长度。两向量正交，$\\rho=0$。', '#334155', '23px', '650', 1.65, 'flex-start')}
      ${svgTex(1264, 557, 532, 40, '\\mathbf{z}_1=\\mathbf{u},\\qquad \\mathbf{z}_2=(\\mathbf{v}-0.8\\mathbf{u})/0.6', '#1D4ED8', '22px', '', '', 1.65, 'flex-start')}

      <text x="48" y="630" fill="#475569" font-size="23" font-weight="650">图中采用三角白化。正交表示样本线性相关为零，非线性依赖仍可能存在。</text>
      <line x1="48" y1="652" x2="1792" y2="652" stroke="#94A3B8" stroke-width="2"/>

      <text x="48" y="698" fill="#0F172A" font-size="25" font-weight="850">更强的基线会怎样</text>
      <text x="48" y="742" fill="#334155" font-size="23" font-weight="650">ETTh2 的 w/o CW 误差偏高。</text>
      <text x="48" y="783" fill="#334155" font-size="23" font-weight="650">如果更强的模型能自行学到跨通道变换，</text>
      <text x="48" y="824" fill="#334155" font-size="23" font-weight="650">额外加 CW 的增益可能会缩小。</text>

      <text x="656" y="698" fill="#0F172A" font-size="25" font-weight="850">CW-Diff 何时可逆</text>
      ${svgRich(656, 716, 540, 43, '$\\widehat{L}_t\\widehat{L}_t^\\top$ 可能奇异，逆平方根要求正定。', '#334155', '23px', '650', 1.65, 'flex-start')}
      ${svgRich(656, 757, 540, 43, '本次复现把特征值下限设为 $0.1$，', '#334155', '23px', '650', 1.65, 'flex-start')}
      <text x="656" y="823" fill="#334155" font-size="23" font-weight="650">避免零特征值进入逆变换。</text>

      <text x="1264" y="698" fill="#0F172A" font-size="25" font-weight="850">高维白化的时间开销</text>
      ${svgRich(1264, 716, 540, 43, '密集特征分解需 $O(Ld^3)$。', '#334155', '23px', '650', 1.65, 'flex-start')}
      <text x="1264" y="783" fill="#334155" font-size="23" font-weight="650">已知可逆的下三角因子时，</text>
      ${svgRich(1264, 796, 540, 43, '单条轨迹逐时点解三角方程需 $O(Ld^2)$。', '#334155', '23px', '650', 1.65, 'flex-start')}
    </svg>`
  };
})();
