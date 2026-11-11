/**
 * ============================================================================
 * @file decks/decomp-dbloss/visuals.js
 * @description Pure SVG Visual Component Registry for DecompNet & DBLoss.
 *              UI Redesign Round 7:
 *              - Restores ALL Round 5 node labels (历史序列, 预测模型/任意 Backbone,
 *                预测序列/及真实值 Y, 趋势分量, 季节分量, 趋势专家, 趋势参数, etc.)
 *              - Applies ONLY the exact requested changes:
 *                1. All math symbols compiled via KaTeX/LaTeX (`svgTex` / `svgRich`),
 *                   zero Unicode math characters.
 *                2. Replaced X^趋, X^季, \hat{Y}^趋, \hat{Y}^季 with pure X_T, X_S,
 *                   \hat{Y}_T, \hat{Y}_S (while keeping the card titles!).
 *                3. Slide 1: Fuse block -> pure "Fuse"; EMA block -> pure "EMA"
 *                   (removed A, I-A); Loss block -> pure "DBLoss" (removed formula).
 *                4. Slide 3: Top-left title -> "指数衰减滑动平均 (Exponential Moving Average, EMA)";
 *                   EMA block -> pure "EMA" (no formula); Bottom panel -> removed
 *                   the 2 verbose subtitles under Trend/Seasonality and removed
 *                   the 3 explanations on the right of Matrix A.
 * ============================================================================
 */

(function () {
  /**
   * Helper to convert inline `$latex$` inside a mixed HTML/Chinese string into
   * `<span class="latex-formula" data-latex="..."></span>` so `build_math_cache.py`
   * compiles 100% of inline math symbols into offline vector SVGs!
   */
  function renderMixedLatex(text, texZoom = 1.35) {
    return text.replace(/\$([^$]+)\$/g, (_, tex) => {
      const escaped = tex.trim().replace(/&/g, '&amp;').replace(/"/g, '&quot;');
      return `<span class="latex-formula" data-latex="${escaped}" data-display="false" style="display:inline-flex;align-items:center;margin:0 3px;--tex-zoom:${texZoom};"></span>`;
    });
  }

  /**
   * Helper to render a mixed Chinese + TeX line inside an SVG `<foreignObject>`
   */
  function svgRich(x, y, w, h, mixedText, color = '#0F172A', fontSize = '19px', fontWeight = '800', texZoom = 1.38, align = 'center') {
    const html = renderMixedLatex(mixedText, texZoom);
    return `<foreignObject x="${x}" y="${y}" width="${w}" height="${h}">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-tex-cell" style="color:${color};font-size:${fontSize};font-weight:${fontWeight};justify-content:${align};--tex-zoom:${texZoom};white-space:nowrap;">
        ${html}
      </div>
    </foreignObject>`;
  }

  /**
   * Helper to render an ultra-compact floating top-left badge (浮动的左上角小块标签)
   * Supports inline `$latex$` inside `titleText` via `renderMixedLatex`.
   */
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

  /**
   * Helper to embed a pure TeX formula inside an SVG `<foreignObject>`
   */
  function svgTex(x, y, w, h, latex, color = '#0F172A', fontSize = '20px', extraTextPrefix = '', extraTextSuffix = '', zoom = 1.75, align = 'center') {
    const escaped = latex.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    const pre = extraTextPrefix ? `<span style="margin-right:6px;font-weight:800;">${extraTextPrefix}</span>` : '';
    const suf = extraTextSuffix ? `<span style="margin-left:6px;font-weight:800;">${extraTextSuffix}</span>` : '';
    return `<foreignObject x="${x}" y="${y}" width="${w}" height="${h}">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-tex-cell" style="color:${color};font-size:${fontSize};justify-content:${align};--tex-zoom:${zoom};">
        ${pre}<span class="latex-formula" data-latex="${escaped}" data-display="false"></span>${suf}
      </div>
    </foreignObject>`;
  }

  /**
   * Helper to render a clean monochrome-blue or slate weight matrix grid
   */
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

  /**
   * Helper to render a clean, quiet neural network stack icon
   */
  function drawNeuralStack(x, y, w, h, strokeColor, fillBg, barColors) {
    const padX = 20;
    const barW = w - padX * 2;
    const barH = 16;
    return `<g transform="translate(${x}, ${y})">
      <rect x="0" y="0" width="${w}" height="${h}" rx="16" fill="${fillBg}" stroke="${strokeColor}" stroke-width="2.4"/>
      <rect x="${padX}" y="20" width="${barW}" height="${barH}" rx="4" fill="${barColors[0]}"/>
      <rect x="${padX}" y="46" width="${barW}" height="${barH}" rx="4" fill="${barColors[1]}"/>
      <rect x="${padX}" y="72" width="${barW}" height="${barH}" rx="4" fill="${barColors[2]}"/>
      <line x1="${w/2 - 20}" y1="36" x2="${w/2 - 20}" y2="46" stroke="${strokeColor}" stroke-width="2"/>
      <line x1="${w/2 + 20}" y1="36" x2="${w/2 + 20}" y2="46" stroke="${strokeColor}" stroke-width="2"/>
      <line x1="${w/2 - 20}" y1="62" x2="${w/2 - 20}" y2="72" stroke="${strokeColor}" stroke-width="2"/>
      <line x1="${w/2 + 20}" y1="62" x2="${w/2 + 20}" y2="72" stroke="${strokeColor}" stroke-width="2"/>
    </g>`;
  }

  /** Dataset-level means over four horizons and five paired seeds. */
  function drawResultTables(groups) {
    return `<svg viewBox="0 0 1840 900" fill="none">
      ${groups.map((group, index) => {
        const x = index % 2 ? 928 : 12;
        const y = index < 2 ? 8 : 458;
        const rowHeight = group.rows.length === 4 ? 66 : 87;
        return `<g>
          <rect x="${x}" y="${y}" width="900" height="434" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
          ${drawFloatingBadge(x + 18, y + 16, 182, 48, group.dataset)}
          ${index === 0 ? `<text x="${x + 880}" y="${y + 47}" text-anchor="end" fill="#475569" font-size="19" font-weight="800">MSE / MAE · 4 步长 · 5 种子</text>` : ''}
          <rect x="${x + 16}" y="${y + 88}" width="868" height="54" fill="#F1F5F9"/>
          <text x="${x + 156}" y="${y + 123}" text-anchor="middle" fill="#0F172A" font-size="21" font-weight="900">${group.firstColumn}</text>
          <text x="${x + 465}" y="${y + 123}" text-anchor="middle" fill="#0F172A" font-size="21" font-weight="900">DLinear</text>
          <text x="${x + 735}" y="${y + 123}" text-anchor="middle" fill="#0F172A" font-size="21" font-weight="900">PatchTST</text>
          ${group.rows.map((row, i) => {
            const top = y + 142 + i * rowHeight;
            const value = pair => `${pair[0].toFixed(4)} / ${pair[1].toFixed(4)}`;
            return `<g>
              ${i % 2 ? `<rect x="${x + 16}" y="${top}" width="868" height="${rowHeight}" fill="#F8FAFC"/>` : ''}
              <text x="${x + 156}" y="${top + rowHeight / 2 + 8}" text-anchor="middle" fill="#0F172A" font-size="21" font-weight="800">${row[0]}</text>
              <text x="${x + 465}" y="${top + rowHeight / 2 + 8}" text-anchor="middle" fill="#1E3A8A" font-size="23" font-weight="800" font-family="monospace">${value(row[1])}</text>
              <text x="${x + 735}" y="${top + rowHeight / 2 + 8}" text-anchor="middle" fill="#1E3A8A" font-size="23" font-weight="800" font-family="monospace">${value(row[2])}</text>
              <line x1="${x + 16}" y1="${top + rowHeight}" x2="${x + 884}" y2="${top + rowHeight}" stroke="#E2E8F0" stroke-width="1.3"/>
            </g>`;
          }).join('')}
        </g>`;
      }).join('')}
    </svg>`;
  }

  window.PresentationVisuals = window.AuroraVisuals = {

    /* ========================================================================
     * SLIDE 1: ABSTRACT STRUCTURAL COMPARISON (DecompNet vs. DBLoss)
     * Restored all Round 5 labels + applied ONLY requested edits:
     *   - X_T, X_S, \hat{Y}_T, \hat{Y}_S (pure KaTeX)
     *   - Fuse box: pure "Fuse"
     *   - EMA box: pure "EMA" (removed A, I-A)
     *   - Loss box: pure "DBLoss" (removed formula)
     * ======================================================================== */
    "slide1.overview": `<svg viewBox="0 0 1840 900" fill="none">
      <!-- ==================== LEFT PANEL: DecompNet ==================== -->
      <rect x="12" y="8" width="884" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>

      <!-- Ultra-Compact Floating Badge in Top-Left -->
      ${drawFloatingBadge(28, 22, 166, 48, 'DecompNet')}

      <!-- Far-Left Centered Input X (Below Floating Badge, y=342..534) -->
      <rect x="28" y="342" width="136" height="192" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <text x="96" y="384" text-anchor="middle" fill="#0F172A" font-size="21" font-weight="900">原始输入</text>
      ${svgTex(42, 396, 108, 44, 'X', '#0F172A', '21px', '', '', 1.82)}
      <path d="M 44 496 C 64 454, 82 508, 102 468 C 118 436, 134 484, 148 448" stroke="#475569" stroke-width="4.5" stroke-linecap="round" fill="none"/>

      <!-- Orthogonal Split from X into Upper Branch (y=130) & Lower Branch (y=742) -->
      <path d="M 164 406 L 184 406 L 184 130 L 204 130" stroke="#64748B" stroke-width="3.8" fill="none"/>
      <polygon points="198,121 216,130 198,139" fill="#64748B"/>

      <path d="M 164 470 L 184 470 L 184 742 L 204 742" stroke="#64748B" stroke-width="3.8" fill="none"/>
      <polygon points="198,733 216,742 198,751" fill="#64748B"/>

      <!-- Upper Branch occupies top space (x=218..732, y=28..232) directly to the right of Floating Badge! -->
      <g>
        <rect x="218" y="28" width="154" height="204" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
        <text x="295" y="68" text-anchor="middle" fill="#0F172A" font-size="21" font-weight="900">趋势分量</text>
        ${svgTex(226, 80, 138, 46, 'X_T', '#0F172A', '21px', '', '', 1.82)}
        <line x1="236" y1="194" x2="354" y2="194" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="5 4"/>
        <path d="M 236 204 C 272 192, 310 164, 354 142" stroke="#1D4ED8" stroke-width="5.5" stroke-linecap="round" fill="none"/>

        <line x1="372" y1="130" x2="394" y2="130" stroke="#94A3B8" stroke-width="3.8"/>
        <polygon points="388,121 406,130 388,139" fill="#94A3B8"/>

        ${drawNeuralStack(408, 36, 144, 188, '#94A3B8', '#F8FAFC', ['#CBD5E1', '#94A3B8', '#64748B'])}
        <text x="480" y="192" text-anchor="middle" fill="#0F172A" font-size="20" font-weight="900">趋势专家</text>

        <line x1="552" y1="130" x2="574" y2="130" stroke="#2563EB" stroke-width="3.8"/>
        <polygon points="568,121 586,130 568,139" fill="#2563EB"/>

        <rect x="588" y="28" width="144" height="204" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
        <text x="660" y="68" text-anchor="middle" fill="#1E3A8A" font-size="20.5" font-weight="900">趋势参数</text>
        ${drawWeightGrid(604, 86, 3, 4, 23, 19, 5, ['#1D4ED8', '#3B82F6', '#60A5FA', '#93C5FD'])}
        ${svgTex(596, 174, 128, 46, '\\Theta_A', '#1E3A8A', '20px', '', '', 1.75)}
      </g>

      <!-- Lower Branch: Seasonal X_S -> Expert Model -> Param B -->
      <g>
        <rect x="218" y="640" width="154" height="204" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
        <text x="295" y="680" text-anchor="middle" fill="#0F172A" font-size="21" font-weight="900">季节分量</text>
        ${svgTex(226, 692, 138, 46, 'X_S', '#0F172A', '21px', '', '', 1.82)}
        <line x1="236" y1="794" x2="354" y2="794" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="5 4"/>
        <path d="M 236 794 Q 251 760, 266 794 T 295 794 T 324 794 T 354 794" stroke="#2563EB" stroke-width="5" stroke-linecap="round" fill="none"/>

        <line x1="372" y1="742" x2="394" y2="742" stroke="#94A3B8" stroke-width="3.8"/>
        <polygon points="388,733 406,742 388,751" fill="#94A3B8"/>

        ${drawNeuralStack(408, 648, 144, 188, '#94A3B8', '#F8FAFC', ['#CBD5E1', '#94A3B8', '#64748B'])}
        <text x="480" y="804" text-anchor="middle" fill="#0F172A" font-size="20" font-weight="900">季节专家</text>

        <line x1="552" y1="742" x2="574" y2="742" stroke="#2563EB" stroke-width="3.8"/>
        <polygon points="568,733 586,742 568,751" fill="#2563EB"/>

        <rect x="588" y="640" width="144" height="204" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
        <text x="660" y="680" text-anchor="middle" fill="#1E3A8A" font-size="20.5" font-weight="900">季节参数</text>
        ${drawWeightGrid(604, 698, 3, 4, 23, 19, 5, ['#3B82F6', '#60A5FA', '#93C5FD', '#1D4ED8'])}
        ${svgTex(596, 786, 128, 46, '\\Theta_B', '#1E3A8A', '20px', '', '', 1.75)}
      </g>

      <!-- Vertical Convergence into Focal Fuse Hub -->
      <line x1="660" y1="232" x2="660" y2="358" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="650,352 660,372 670,352" fill="#1D4ED8"/>

      <line x1="660" y1="640" x2="660" y2="514" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="650,520 660,500 670,520" fill="#1D4ED8"/>

      <!-- FOCAL ANCHOR 1: Pure "Fuse" Box (Per user: "第一页的 Fuse就行，别 Fuse 融合") -->
      <rect x="536" y="374" width="184" height="124" rx="20" fill="#1D4ED8"/>
      <text x="628" y="448" text-anchor="middle" fill="#FFFFFF" font-size="34" font-weight="900">Fuse</text>

      <!-- Arrow to Fused Model -->
      <line x1="720" y1="436" x2="746" y2="436" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="740,426 758,436 740,446" fill="#1D4ED8"/>

      <!-- Fused Model Card -->
      <rect x="760" y="340" width="122" height="192" rx="18" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="3"/>
      <text x="821" y="382" text-anchor="middle" fill="#1E3A8A" font-size="20.5" font-weight="900">融合模型</text>
      ${drawWeightGrid(776, 404, 3, 4, 19, 18, 4.5, ['#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA'])}
      <text x="821" y="508" text-anchor="middle" fill="#1D4ED8" font-size="17.5" font-weight="900">直接推理</text>


      <!-- ==================== CENTER VERTICAL DIVIDER ==================== -->
      <line x1="920" y1="28" x2="920" y2="872" stroke="#CBD5E1" stroke-width="2.5" stroke-dasharray="8 6"/>


      <!-- ==================== RIGHT PANEL: DBLoss ==================== -->
      <rect x="944" y="8" width="884" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>

      <!-- Ultra-Compact Floating Badge in Top-Left -->
      ${drawFloatingBadge(964, 22, 260, 48, 'DBLoss · 解耦损失')}

      <!-- 1. Raw Input X -->
      <rect x="964" y="342" width="142" height="192" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <text x="1035" y="384" text-anchor="middle" fill="#0F172A" font-size="21.5" font-weight="900">原始输入</text>
      ${svgTex(980, 396, 110, 44, 'X', '#0F172A', '21px', '', '', 1.82)}
      <path d="M 980 496 C 1002 452, 1022 510, 1044 468 C 1062 434, 1078 486, 1092 448" stroke="#475569" stroke-width="4.5" stroke-linecap="round" fill="none"/>

      <line x1="1106" y1="438" x2="1136" y2="438" stroke="#94A3B8" stroke-width="3.8"/>
      <polygon points="1130,429 1148,438 1130,447" fill="#94A3B8"/>

      <!-- 2. Backbone Model -->
      ${drawNeuralStack(1150, 342, 162, 192, '#94A3B8', '#F8FAFC', ['#CBD5E1', '#94A3B8', '#64748B'])}
      <text x="1231" y="496" text-anchor="middle" fill="#0F172A" font-size="21" font-weight="900">预测主干</text>

      <line x1="1312" y1="438" x2="1342" y2="438" stroke="#2563EB" stroke-width="3.8"/>
      <polygon points="1336,429 1354,438 1336,447" fill="#2563EB"/>

      <!-- 3. Predicted Y_hat -->
      <rect x="1356" y="342" width="136" height="192" rx="16" fill="#FFFFFF" stroke="#2563EB" stroke-width="2.6"/>
      <text x="1424" y="384" text-anchor="middle" fill="#1E3A8A" font-size="21.5" font-weight="900">预测输出</text>
      ${svgTex(1370, 396, 108, 44, '\\hat{Y}', '#1D4ED8', '21px', '', '', 1.82)}
      <path d="M 1372 496 C 1392 458, 1412 508, 1432 466 C 1448 436, 1460 480, 1474 448" stroke="#2563EB" stroke-width="4.5" stroke-linecap="round" fill="none"/>

      <line x1="1492" y1="438" x2="1522" y2="438" stroke="#1D4ED8" stroke-width="4.2"/>
      <polygon points="1516,429 1534,438 1516,447" fill="#1D4ED8"/>

      <!-- 4. FOCAL ANCHOR 2A: Pure Tall "EMA" Block (Per user: "EMA 也是就是只需要EMA 就行... 然后 EMA 下面的 A，I-A 也删了") -->
      <rect x="1536" y="302" width="92" height="272" rx="18" fill="#1D4ED8"/>
      <text x="1582" y="450" text-anchor="middle" fill="#FFFFFF" font-size="31" font-weight="900">EMA</text>

      <!-- Upper Output Branch occupies top-right space (y=28..232) right next to floating badge! -->
      <path d="M 1582 302 L 1582 130 L 1640 130" stroke="#2563EB" stroke-width="4.2" fill="none"/>
      <polygon points="1634,121 1652,130 1634,139" fill="#2563EB"/>

      <rect x="1654" y="28" width="158" height="204" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <text x="1733" y="68" text-anchor="middle" fill="#1E3A8A" font-size="21" font-weight="900">预测趋势</text>
      ${svgTex(1664, 80, 138, 46, '\\hat{Y}_T', '#1D4ED8', '21px', '', '', 1.82)}
      <line x1="1674" y1="194" x2="1792" y2="194" stroke="#93C5FD" stroke-width="2" stroke-dasharray="5 4"/>
      <path d="M 1676 204 C 1712 192, 1750 164, 1790 142" stroke="#1D4ED8" stroke-width="5.5" stroke-linecap="round" fill="none"/>

      <!-- Lower Output Branch (y=640..844) -->
      <path d="M 1582 574 L 1582 742 L 1640 742" stroke="#2563EB" stroke-width="4.2" fill="none"/>
      <polygon points="1634,733 1652,742 1634,751" fill="#2563EB"/>

      <rect x="1654" y="640" width="158" height="204" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <text x="1733" y="680" text-anchor="middle" fill="#1E3A8A" font-size="21" font-weight="900">预测季节</text>
      ${svgTex(1664, 692, 138, 46, '\\hat{Y}_S', '#1D4ED8', '21px', '', '', 1.82)}
      <line x1="1674" y1="794" x2="1792" y2="794" stroke="#93C5FD" stroke-width="2" stroke-dasharray="5 4"/>
      <path d="M 1676 794 Q 1690 760, 1704 794 T 1733 794 T 1762 794 T 1790 794" stroke="#2563EB" stroke-width="5" stroke-linecap="round" fill="none"/>

      <!-- Convergence into Loss Hub -->
      <line x1="1733" y1="232" x2="1733" y2="358" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="1723,352 1733,372 1743,352" fill="#1D4ED8"/>

      <line x1="1733" y1="640" x2="1733" y2="514" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="1723,520 1733,500 1743,520" fill="#1D4ED8"/>

      <!-- FOCAL ANCHOR 2B: Pure "DBLoss" Box (Per user: "Loss 损失也是，不需要贴公式，只需要写成 DBLoss") -->
      <rect x="1648" y="374" width="168" height="124" rx="20" fill="#1D4ED8"/>
      <text x="1732" y="448" text-anchor="middle" fill="#FFFFFF" font-size="31" font-weight="900">DBLoss</text>
    </svg>`,

    /* ========================================================================
     * SLIDE 2: DECOMPNET WORKFLOW (Pretraining, Fusion & Fine-tuning)
     * Restored all Round 5 labels + pure KaTeX X_T, X_S, \lambda
     * ======================================================================== */
    "slide2.decompnet": `<svg viewBox="0 0 1840 900" fill="none">
      <!-- ==================== UPPER BAND: STAGE 1 & 2 (PRETRAIN & FUSE) ==================== -->
      <rect x="12" y="8" width="1816" height="516" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>

      <!-- Compact Floating Badge in Top-Left -->
      ${drawFloatingBadge(28, 22, 312, 48, '阶段一 & 二：预训练与融合')}

      <!-- 1. Raw Input X -->
      <rect x="36" y="176" width="180" height="192" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <text x="126" y="218" text-anchor="middle" fill="#0F172A" font-size="22" font-weight="900">原始序列</text>
      ${svgTex(66, 232, 120, 46, 'X', '#0F172A', '22px', '', '', 1.9)}
      <path d="M 56 326 C 82 278, 106 338, 132 294 C 154 256, 174 318, 196 276" stroke="#475569" stroke-width="4.5" stroke-linecap="round" fill="none"/>

      <!-- Arrow: 归一化 -->
      <line x1="216" y1="272" x2="306" y2="272" stroke="#94A3B8" stroke-width="3.8"/>
      <polygon points="300,263 318,272 300,281" fill="#94A3B8"/>
      <text x="261" y="250" text-anchor="middle" fill="#334155" font-size="19.5" font-weight="900">归一化</text>

      <!-- 2. Normalized X_tilde -->
      <rect x="320" y="176" width="180" height="192" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <text x="410" y="218" text-anchor="middle" fill="#0F172A" font-size="22" font-weight="900">归一化序列</text>
      ${svgTex(350, 232, 120, 46, '\\tilde{X}', '#0F172A', '22px', '', '', 1.9)}
      <line x1="340" y1="306" x2="480" y2="306" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="5 4"/>
      <path d="M 340 324 C 366 278, 390 336, 416 296 C 438 260, 458 318, 480 280" stroke="#334155" stroke-width="4.5" stroke-linecap="round" fill="none"/>

      <!-- Orthogonal Branching from X_tilde -->
      <path d="M 500 246 L 524 246 L 524 118 L 622 118" stroke="#64748B" stroke-width="3.8" fill="none"/>
      <polygon points="616,109 634,118 616,127" fill="#64748B"/>
      <text x="573" y="96" text-anchor="middle" fill="#0F172A" font-size="18" font-weight="900">Move Average</text>

      <path d="M 500 298 L 524 298 L 524 412 L 622 412" stroke="#64748B" stroke-width="3.8" fill="none"/>
      <polygon points="616,403 634,412 616,421" fill="#64748B"/>
      <text x="573" y="446" text-anchor="middle" fill="#334155" font-size="18.5" font-weight="900">残差剥离</text>

      <!-- 3A. Upper Branch occupies top space (y=24..208) directly to the right of Floating Badge! -->
      <rect x="636" y="24" width="198" height="184" rx="16" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2.4"/>
      <text x="735" y="64" text-anchor="middle" fill="#0F172A" font-size="22" font-weight="900">趋势分量</text>
      ${svgTex(656, 76, 158, 46, 'X_T', '#0F172A', '21px', '', '', 1.85)}
      <path d="M 660 182 C 702 168, 748 142, 810 120" stroke="#1D4ED8" stroke-width="5.5" stroke-linecap="round" fill="none"/>

      <line x1="834" y1="118" x2="914" y2="118" stroke="#64748B" stroke-width="3.8"/>
      <polygon points="908,109 926,118 908,127" fill="#64748B"/>
      <text x="874" y="96" text-anchor="middle" fill="#334155" font-size="19.5" font-weight="900">训练</text>

      <rect x="928" y="24" width="236" height="184" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      ${svgRich(938, 36, 216, 38, '模型 $A$ (趋势专家)', '#1E3A8A', '21.5px', '900', 1.45)}
      ${drawWeightGrid(986, 82, 3, 4, 26, 18, 5, ['#1D4ED8', '#3B82F6', '#60A5FA', '#93C5FD'])}
      ${svgTex(956, 152, 180, 46, '\\mathrm{para\\,A}', '#1E3A8A', '20px', '', '', 1.72)}

      <!-- 3B. Lower Branch (y=320..504) -->
      <rect x="636" y="320" width="198" height="184" rx="16" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2.4"/>
      <text x="735" y="360" text-anchor="middle" fill="#0F172A" font-size="22" font-weight="900">季节分量</text>
      ${svgTex(656, 372, 158, 46, 'X_S', '#0F172A', '21px', '', '', 1.85)}
      <path d="M 660 462 Q 678 426, 696 462 T 735 462 T 774 462 T 810 462" stroke="#2563EB" stroke-width="5" stroke-linecap="round" fill="none"/>

      <line x1="834" y1="412" x2="914" y2="412" stroke="#64748B" stroke-width="3.8"/>
      <polygon points="908,403 926,412 908,421" fill="#64748B"/>
      <text x="874" y="390" text-anchor="middle" fill="#334155" font-size="19.5" font-weight="900">训练</text>

      <rect x="928" y="320" width="236" height="184" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      ${svgRich(938, 332, 216, 38, '模型 $B$ (季节专家)', '#1E3A8A', '21.5px', '900', 1.45)}
      ${drawWeightGrid(986, 378, 3, 4, 26, 18, 5, ['#3B82F6', '#60A5FA', '#93C5FD', '#1D4ED8'])}
      ${svgTex(956, 448, 180, 46, '\\mathrm{para\\,B}', '#1E3A8A', '20px', '', '', 1.72)}

      <!-- Orthogonal Arrows from 模型 A and 模型 B into Parameter Fusion Box -->
      <path d="M 1164 118 L 1372 118 L 1372 164" stroke="#1D4ED8" stroke-width="4.5" fill="none"/>
      <polygon points="1362,158 1372,178 1382,158" fill="#1D4ED8"/>

      <path d="M 1164 412 L 1372 412 L 1372 366" stroke="#1D4ED8" stroke-width="4.5" fill="none"/>
      <polygon points="1362,372 1372,352 1382,372" fill="#1D4ED8"/>

      <!-- 4. FOCAL PARAMETER FUSION BOX: para A + \lambda para B -->
      <rect x="1208" y="180" width="328" height="170" rx="20" fill="#1D4ED8"/>
      <text x="1372" y="226" text-anchor="middle" fill="#FFFFFF" font-size="24" font-weight="900">按层权重线性重参数化</text>
      <rect x="1230" y="246" width="284" height="82" rx="14" fill="#FFFFFF"/>
      ${svgTex(1238, 262, 268, 50, '\\mathrm{para\\,A} + \\lambda\\,\\mathrm{para\\,B}', '#1E3A8A', '21px', '', '', 1.82)}

      <!-- Arrow to 模型 C -->
      <line x1="1536" y1="265" x2="1588" y2="265" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="1582,255 1602,265 1582,275" fill="#1D4ED8"/>

      <!-- 5. FUSED MODEL C -->
      <rect x="1604" y="170" width="198" height="190" rx="20" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="3"/>
      ${svgRich(1618, 184, 170, 40, '模型 $C$', '#1E3A8A', '24.5px', '900', 1.55)}
      ${drawWeightGrid(1643, 236, 3, 4, 26, 18, 5, ['#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA'])}
      <text x="1703" y="336" text-anchor="middle" fill="#1D4ED8" font-size="19" font-weight="900">融合单模型</text>


      <!-- ==================== LOWER BAND: STAGE 3 (FINE-TUNE & INFERENCE) ==================== -->
      <rect x="12" y="540" width="1816" height="352" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>

      <!-- Ultra-Compact Floating Badge in Top-Left -->
      ${drawFloatingBadge(28, 556, 292, 48, '阶段三：闭环微调模型 $C$')}

      <!-- Lower Flow: X --归一化--> X_tilde --> 模型 C --> MSE Loss -->
      <rect x="64" y="636" width="224" height="230" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <text x="176" y="684" text-anchor="middle" fill="#0F172A" font-size="23" font-weight="900">原始序列</text>
      ${svgTex(116, 700, 120, 48, 'X', '#0F172A', '22px', '', '', 1.92)}
      <path d="M 92 814 C 122 764, 152 828, 182 782 C 208 742, 234 806, 260 764" stroke="#475569" stroke-width="4.5" stroke-linecap="round" fill="none"/>

      <!-- Arrow: 归一化 -->
      <line x1="288" y1="751" x2="424" y2="751" stroke="#94A3B8" stroke-width="3.8"/>
      <polygon points="418,742 436,751 418,760" fill="#94A3B8"/>
      <text x="356" y="728" text-anchor="middle" fill="#334155" font-size="20" font-weight="900">归一化</text>

      <!-- Node 2: X_tilde -->
      <rect x="438" y="636" width="256" height="230" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <text x="566" y="684" text-anchor="middle" fill="#0F172A" font-size="22.5" font-weight="900">归一化序列 (不分解)</text>
      ${svgTex(506, 700, 120, 48, '\\tilde{X}', '#0F172A', '22px', '', '', 1.92)}
      <line x1="468" y1="788" x2="664" y2="788" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="5 4"/>
      <path d="M 468 814 C 500 764, 534 824, 568 782 C 598 744, 630 806, 664 764" stroke="#334155" stroke-width="4.5" stroke-linecap="round" fill="none"/>

      <!-- Arrow: X_tilde -> 模型 C -->
      <line x1="694" y1="751" x2="818" y2="751" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="812,742 830,751 812,760" fill="#1D4ED8"/>

      <!-- Node 3: 模型 C -->
      <rect x="832" y="634" width="332" height="234" rx="18" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="3"/>
      ${svgRich(862, 650, 272, 42, '模型 $C$ (融合模型)', '#1E3A8A', '23.5px', '900', 1.5)}
      ${drawWeightGrid(938, 702, 3, 4, 26, 18, 5, ['#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA'])}
      ${svgTex(844, 794, 308, 50, '\\hat{Y} = f(\\tilde{X};\\, \\mathrm{para\\,A} + \\lambda\\,\\mathrm{para\\,B})', '#1E3A8A', '18px', '', '', 1.54)}

      <!-- Arrow: 模型 C -> MSE Loss -->
      <line x1="1164" y1="751" x2="1298" y2="751" stroke="#1D4ED8" stroke-width="4.5"/>
      <polygon points="1292,742 1310,751 1292,760" fill="#1D4ED8"/>
      ${svgTex(1196, 698, 72, 44, '\\hat{Y}', '#1D4ED8', '21px', '', '', 1.8)}

      <!-- Node 4: MSE Loss -->
      <rect x="1312" y="636" width="336" height="230" rx="18" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.6"/>
      <text x="1480" y="686" text-anchor="middle" fill="#0F172A" font-size="25" font-weight="900">MSE Loss</text>
      ${svgTex(1340, 712, 280, 58, '\\mathcal{L}_{\\text{MSE}} = \\big\\|\\hat{Y} - Y\\big\\|_2^2', '#0F172A', '20px', '', '', 1.78)}
      ${svgRich(1330, 804, 300, 36, '微调融合系数 $\\lambda$ 与网络权重', '#334155', '18.5px', '800', 1.38)}

      <!-- Feedback Loop Arrow above 模型 C & MSE Loss -->
      <path d="M 1480 636 L 1480 578 L 998 578 L 998 618" stroke="#1D4ED8" stroke-width="4" fill="none"/>
      <polygon points="988,612 998,632 1008,612" fill="#1D4ED8"/>
      <rect x="1096" y="554" width="284" height="46" rx="23" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.2"/>
      ${svgRich(1108, 558, 260, 38, '反向传播更新模型 $C$', '#1D4ED8', '19px', '900', 1.38)}
    </svg>`,

    /* ========================================================================
     * SLIDE 3: DBLOSS WORKFLOW, LOSS EQUATIONS & EMA MATRIX OPERATOR
     * Restored all Round 5 labels (历史序列, 预测模型/任意 Backbone, 预测序列/及真实值 Y,
     * 趋势分量, 季节分量, 2. 损失与对齐, 季节 L2, 趋势 L1, 无梯度尺度对齐, DBLoss 总损失)
     * + Applied ONLY the exact user instructions:
     *   - Top-Left Badge: 指数衰减滑动平均 (Exponential Moving Average, EMA)
     *   - Top-Left EMA Box: pure "EMA" (no formula!)
     *   - Bottom Panel: deleted verbose subtitles under Trend/Seasonality and
     *     deleted the 3 explanations on the right of Matrix A!
     * ======================================================================== */
    "slide3.dbloss": `<svg viewBox="0 0 1840 900" fill="none">
      <!-- ==================== TOP-LEFT PANEL: FORWARD & EMA SPLIT ==================== -->
      <rect x="12" y="8" width="876" height="432" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>

      <!-- Academic Floating Badge in Top-Left (Per user: "指数衰减滑动平均（英文名，EMA）") -->
      ${drawFloatingBadge(28, 22, 652, 48, '指数衰减滑动平均 (Exponential Moving Average, EMA)')}

      <!-- Flow: X -> [Backbone] -> Y_hat -> [EMA] -> \hat{Y}_T & \hat{Y}_S -->
      <rect x="34" y="132" width="136" height="232" rx="16" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2.4"/>
      <text x="102" y="178" text-anchor="middle" fill="#0F172A" font-size="21" font-weight="900">历史序列</text>
      ${svgTex(50, 194, 104, 46, 'X', '#0F172A', '21px', '', '', 1.82)}
      <path d="M 48 312 C 68 268, 86 326, 106 286 C 122 252, 138 304, 154 268" stroke="#475569" stroke-width="4.5" stroke-linecap="round" fill="none"/>

      <line x1="170" y1="248" x2="198" y2="248" stroke="#94A3B8" stroke-width="3.8"/>
      <polygon points="192,239 210,248 192,257" fill="#94A3B8"/>

      ${drawNeuralStack(212, 132, 160, 232, '#94A3B8', '#F8FAFC', ['#CBD5E1', '#94A3B8', '#64748B'])}
      <text x="292" y="286" text-anchor="middle" fill="#0F172A" font-size="21" font-weight="900">预测模型</text>
      <text x="292" y="322" text-anchor="middle" fill="#475569" font-size="16.5" font-weight="800">任意 Backbone</text>

      <line x1="372" y1="248" x2="402" y2="248" stroke="#2563EB" stroke-width="3.8"/>
      <polygon points="396,239 414,248 396,257" fill="#2563EB"/>

      <rect x="416" y="132" width="136" height="232" rx="16" fill="#FFFFFF" stroke="#2563EB" stroke-width="2.6"/>
      <text x="484" y="178" text-anchor="middle" fill="#1E3A8A" font-size="21" font-weight="900">预测序列</text>
      ${svgTex(432, 194, 104, 46, '\\hat{Y}', '#1D4ED8', '21px', '', '', 1.82)}
      <path d="M 430 302 C 450 264, 468 314, 488 274 C 504 246, 518 290, 536 256" stroke="#2563EB" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      ${svgRich(424, 316, 120, 34, '及真实值 $Y$', '#475569', '17px', '800', 1.32)}

      <line x1="552" y1="248" x2="578" y2="248" stroke="#1D4ED8" stroke-width="4.2"/>
      <polygon points="572,239 590,248 572,257" fill="#1D4ED8"/>

      <!-- FOCAL EMA BLOCK: Pure "EMA" (Per user: "然后第三页的 EMA 也是一样的... 不需要写公式") -->
      <rect x="592" y="156" width="96" height="184" rx="18" fill="#1D4ED8"/>
      <text x="640" y="258" text-anchor="middle" fill="#FFFFFF" font-size="30" font-weight="900">EMA</text>

      <!-- Upper Branch occupies top-right space (y=22..206) right next to Floating Badge! -->
      <path d="M 688 206 L 704 206 L 704 114 L 716 114" stroke="#1D4ED8" stroke-width="4" fill="none"/>
      <polygon points="712,105 728,114 712,123" fill="#1D4ED8"/>

      <rect x="730" y="22" width="144" height="186" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <text x="802" y="62" text-anchor="middle" fill="#1E3A8A" font-size="20.5" font-weight="900">趋势分量</text>
      ${svgTex(738, 74, 128, 46, '\\hat{Y}_T', '#1D4ED8', '21px', '', '', 1.82)}
      <path d="M 748 182 C 776 170, 812 146, 854 126" stroke="#1D4ED8" stroke-width="5.5" stroke-linecap="round" fill="none"/>

      <!-- Lower Branch (y=236..420) -->
      <path d="M 688 290 L 704 290 L 704 328 L 716 328" stroke="#1D4ED8" stroke-width="4" fill="none"/>
      <polygon points="712,319 728,328 712,337" fill="#1D4ED8"/>

      <rect x="730" y="236" width="144" height="186" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.6"/>
      <text x="802" y="276" text-anchor="middle" fill="#1E3A8A" font-size="20.5" font-weight="900">季节分量</text>
      ${svgTex(738, 288, 128, 46, '\\hat{Y}_S', '#1D4ED8', '21px', '', '', 1.82)}
      <path d="M 748 386 Q 761 354, 774 386 T 802 386 T 830 386 T 854 386" stroke="#2563EB" stroke-width="5" stroke-linecap="round" fill="none"/>


      <!-- ==================== TOP-RIGHT PANEL: LOSS FORMULATION (RIGHT-OF-BADGE LAYOUT!) ==================== -->
      <rect x="908" y="8" width="920" height="432" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>

      <!-- Ultra-Compact Floating Badge at Top-Left + Sub-Pill with Compiled TeX \alpha, \beta -->
      ${drawFloatingBadge(924, 22, 224, 48, '2. 损失与对齐')}
      <rect x="924" y="80" width="224" height="46" rx="10" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.8"/>
      ${svgRich(932, 86, 208, 34, '$\\alpha, \\beta$ 为超参数', '#334155', '17.5px', '900', 1.35)}

      <!-- Row 1 (Level 1 Quiet Slate) sits at y=22..126 directly on the right of the floating badge! -->
      <rect x="1164" y="22" width="314" height="104" rx="14" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2.2"/>
      ${svgRich(1172, 56, 104, 36, '季节 ($L_2$)', '#0F172A', '18.5px', '900', 1.32)}
      <line x1="1282" y1="38" x2="1282" y2="110" stroke="#CBD5E1" stroke-width="2"/>
      ${svgTex(1288, 34, 184, 80, '\\mathcal{L}_{\\mathcal{S}} = \\|\\hat{Y}_S\\!-\\!Y_S\\|_2', '#0F172A', '18px', '', '', 1.52)}

      <rect x="1494" y="22" width="314" height="104" rx="14" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2.2"/>
      ${svgRich(1502, 56, 104, 36, '趋势 ($L_1$)', '#0F172A', '18.5px', '900', 1.32)}
      <line x1="1612" y1="38" x2="1612" y2="110" stroke="#CBD5E1" stroke-width="2"/>
      ${svgTex(1618, 34, 184, 80, '\\mathcal{L}_{\\mathcal{T}} = \\|\\hat{Y}_T\\!-\\!Y_T\\|_1', '#0F172A', '18px', '', '', 1.52)}

      <!-- Connectors down to Row 2 -->
      <line x1="1321" y1="126" x2="1321" y2="156" stroke="#94A3B8" stroke-width="3.5"/>
      <polygon points="1312,150 1321,164 1330,150" fill="#94A3B8"/>
      <line x1="1651" y1="126" x2="1651" y2="156" stroke="#94A3B8" stroke-width="3.5"/>
      <polygon points="1642,150 1651,164 1660,150" fill="#94A3B8"/>

      <!-- Row 2 (Level 2 Soft Blue): Scale Alignment with Stop-Gradient -->
      <rect x="924" y="164" width="884" height="118" rx="16" fill="#F8FAFC" stroke="#93C5FD" stroke-width="2.4"/>
      <text x="1042" y="216" text-anchor="middle" fill="#1E3A8A" font-size="21" font-weight="900">无梯度尺度对齐</text>
      <text x="1042" y="250" text-anchor="middle" fill="#475569" font-size="17" font-weight="800">stopgrad 截断梯度</text>
      <line x1="1158" y1="182" x2="1158" y2="264" stroke="#CBD5E1" stroke-width="2"/>
      ${svgTex(1174, 172, 616, 102, '\\displaystyle \\mathcal{L}_{\\mathcal{T}}^{\\text{aligned}} := \\mathcal{L}_{\\mathcal{T}} \\times \\mathrm{stopgrad}\\!\\left(\\frac{\\mathcal{L}_{\\mathcal{S}}}{\\mathcal{L}_{\\mathcal{T}} + \\epsilon}\\right)', '#0F172A', '20px', '', '', 1.78)}

      <!-- Connector down to Row 3 -->
      <line x1="1366" y1="282" x2="1366" y2="312" stroke="#1D4ED8" stroke-width="4.2"/>
      <polygon points="1357,306 1366,320 1375,306" fill="#1D4ED8"/>

      <!-- Row 3 (Level 3 Focal Anchor): Final Weighted DBLoss -->
      <rect x="924" y="320" width="884" height="102" rx="16" fill="#EFF6FF" stroke="#1D4ED8" stroke-width="3"/>
      <rect x="942" y="338" width="200" height="66" rx="12" fill="#1D4ED8"/>
      <text x="1042" y="380" text-anchor="middle" fill="#FFFFFF" font-size="21.5" font-weight="900">DBLoss 总损失</text>
      ${svgTex(1174, 330, 616, 82, '\\displaystyle \\mathcal{L} := \\beta \\cdot \\mathcal{L}_{\\mathcal{S}} + (1 - \\beta) \\cdot \\mathcal{L}_{\\mathcal{T}}^{\\text{aligned}}', '#0F172A', '21px', '', '', 1.88)}


      <!-- ==================== BOTTOM PANEL: EMA MATRIX OPERATOR ==================== -->
      <!-- Per user: "然后第三页的 3. 下三角矩阵A xxx 和下面的互补算子 xxxx 这种废话删了。 然后矩阵 A 右边的三个解释也删了。" -->
      <rect x="12" y="456" width="1816" height="436" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>

      <!-- Compact Floating Badge in Top-Left -->
      ${drawFloatingBadge(28, 472, 168, 48, '3. EMA 算子')}

      <!-- Left Column (x: 28..720, y: 536..872): Pure Trend = A\hat{Y} & Seasonality = (I-A)\hat{Y} -->
      <rect x="28" y="536" width="692" height="158" rx="16" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2.2"/>
      <g transform="translate(64, 572)">
        <rect x="0" y="0" width="20" height="18" rx="3" fill="#1D4ED8"/><rect x="24" y="0" width="20" height="18" rx="3" fill="#E2E8F0"/><rect x="48" y="0" width="20" height="18" rx="3" fill="#E2E8F0"/><rect x="72" y="0" width="20" height="18" rx="3" fill="#E2E8F0"/>
        <rect x="0" y="22" width="20" height="18" rx="3" fill="#3B82F6"/><rect x="24" y="22" width="20" height="18" rx="3" fill="#1D4ED8"/><rect x="48" y="22" width="20" height="18" rx="3" fill="#E2E8F0"/><rect x="72" y="22" width="20" height="18" rx="3" fill="#E2E8F0"/>
        <rect x="0" y="44" width="20" height="18" rx="3" fill="#60A5FA"/><rect x="24" y="44" width="20" height="18" rx="3" fill="#3B82F6"/><rect x="48" y="44" width="20" height="18" rx="3" fill="#1D4ED8"/><rect x="72" y="44" width="20" height="18" rx="3" fill="#E2E8F0"/>
        <rect x="0" y="66" width="20" height="18" rx="3" fill="#93C5FD"/><rect x="24" y="66" width="20" height="18" rx="3" fill="#60A5FA"/><rect x="48" y="66" width="20" height="18" rx="3" fill="#3B82F6"/><rect x="72" y="66" width="20" height="18" rx="3" fill="#1D4ED8"/>
      </g>
      <line x1="188" y1="560" x2="188" y2="670" stroke="#CBD5E1" stroke-width="2"/>
      ${svgTex(208, 566, 488, 98, '\\displaystyle \\mathrm{Trend} = A\\,\\hat{Y}', '#0F172A', '24px', '', '', 2.3)}

      <rect x="28" y="714" width="692" height="158" rx="16" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="2.2"/>
      <g transform="translate(64, 750)">
        <rect x="0" y="0" width="20" height="18" rx="3" fill="#E2E8F0"/><rect x="24" y="0" width="20" height="18" rx="3" fill="#E2E8F0"/><rect x="48" y="0" width="20" height="18" rx="3" fill="#E2E8F0"/><rect x="72" y="0" width="20" height="18" rx="3" fill="#E2E8F0"/>
        <rect x="0" y="22" width="20" height="18" rx="3" fill="#93C5FD"/><rect x="24" y="22" width="20" height="18" rx="3" fill="#2563EB"/><rect x="48" y="22" width="20" height="18" rx="3" fill="#E2E8F0"/><rect x="72" y="22" width="20" height="18" rx="3" fill="#E2E8F0"/>
        <rect x="0" y="44" width="20" height="18" rx="3" fill="#60A5FA"/><rect x="24" y="44" width="20" height="18" rx="3" fill="#60A5FA"/><rect x="48" y="44" width="20" height="18" rx="3" fill="#2563EB"/><rect x="72" y="44" width="20" height="18" rx="3" fill="#E2E8F0"/>
        <rect x="0" y="66" width="20" height="18" rx="3" fill="#3B82F6"/><rect x="24" y="66" width="20" height="18" rx="3" fill="#93C5FD"/><rect x="48" y="66" width="20" height="18" rx="3" fill="#60A5FA"/><rect x="72" y="66" width="20" height="18" rx="3" fill="#2563EB"/>
      </g>
      <line x1="188" y1="738" x2="188" y2="848" stroke="#CBD5E1" stroke-width="2"/>
      ${svgTex(208, 744, 488, 98, '\\displaystyle \\mathrm{Seasonality} = (I - A)\\,\\hat{Y}', '#0F172A', '24px', '', '', 2.3)}

      <!-- Right Column (x: 748..1808, y: 472..872): Pure Matrix A (3 right-hand explanations deleted!) -->
      <rect x="748" y="472" width="1060" height="400" rx="16" fill="#F8FAFC" stroke="#93C5FD" stroke-width="2.4"/>
      ${svgTex(780, 492, 996, 360, '\\displaystyle A = \\begin{bmatrix} 1 & 0 & 0 & 0 \\\\[6pt] q & \\alpha & 0 & 0 \\\\[6pt] q^2 & \\alpha q & \\alpha & 0 \\\\[6pt] q^3 & \\alpha q^2 & \\alpha q & \\alpha \\end{bmatrix}, \\qquad q = 1 - \\alpha', '#0F172A', '23px', '', '', 2.22)}
    </svg>`,

    /* Paper Table 1 and paired local test means, separated by model and horizon. */
    "slide4.paperResults": `<svg viewBox="0 0 1840 900" fill="none">
      <rect x="12" y="8" width="1816" height="884" rx="18" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      <text x="42" y="58" fill="#334155" font-size="21" font-weight="800">MSE / MAE · 复现结果为 10 个种子均值</text>
      <line x1="32" y1="82" x2="1808" y2="82" stroke="#0F172A" stroke-width="2"/>
      <rect x="32" y="84" width="1776" height="100" fill="#F1F5F9"/>
      <text x="82" y="151" text-anchor="middle" fill="#0F172A" font-size="19" font-weight="900">数据集</text>
      <text x="170" y="151" text-anchor="middle" fill="#0F172A" font-size="19" font-weight="900">步长</text>
      <text x="630" y="117" text-anchor="middle" fill="#0F172A" font-size="23" font-weight="900">DLinear</text>
      <text x="1430" y="117" text-anchor="middle" fill="#0F172A" font-size="23" font-weight="900">PatchTST</text>
      <line x1="232" y1="129" x2="1808" y2="129" stroke="#CBD5E1" stroke-width="1.5"/>
      ${['论文基线','论文 DBLoss','复现基线','复现 DBLoss','论文基线','论文 DBLoss','复现基线','复现 DBLoss'].map((label, i) => `<text x="${330 + i * 200}" y="160" text-anchor="middle" fill="${i % 4 === 3 ? '#1D4ED8' : '#334155'}" font-size="18" font-weight="900">${label}</text>`).join('')}
      ${[
        ["ETTh1", "96", "0.379 / 0.403", "0.369 / 0.390", "0.4241 / 0.4392", "0.4217 / 0.4353", "0.377 / 0.397", "0.373 / 0.390", "0.4225 / 0.4438", "0.4305 / 0.4439"],
        ["ETTh1", "192", "0.408 / 0.419", "0.402 / 0.409", "0.4673 / 0.4736", "0.4640 / 0.4674", "0.409 / 0.425", "0.395 / 0.413", "0.4880 / 0.4926", "0.4761 / 0.4838"],
        ["ETTh1", "336", "0.440 / 0.440", "0.430 / 0.428", "0.5123 / 0.5078", "0.5085 / 0.5001", "0.431 / 0.444", "0.414 / 0.426", "0.5473 / 0.5324", "0.5286 / 0.5196"],
        ["ETTh1", "720", "0.471 / 0.493", "0.449 / 0.475", "0.6262 / 0.5930", "0.6233 / 0.5851", "0.457 / 0.477", "0.425 / 0.451", "0.6596 / 0.6076", "0.6524 / 0.6023"],
        ["ETTh2", "96", "0.300 / 0.364", "0.284 / 0.342", "0.2180 / 0.3172", "0.2137 / 0.3084", "0.274 / 0.337", "0.274 / 0.334", "0.2261 / 0.3223", "0.2182 / 0.3139"],
        ["ETTh2", "192", "0.387 / 0.423", "0.357 / 0.390", "0.2700 / 0.3586", "0.2596 / 0.3427", "0.348 / 0.384", "0.334 / 0.376", "0.2940 / 0.3670", "0.2795 / 0.3579"],
        ["ETTh2", "336", "0.490 / 0.487", "0.407 / 0.430", "0.3102 / 0.3926", "0.2905 / 0.3690", "0.377 / 0.416", "0.349 / 0.392", "0.3460 / 0.3994", "0.3241 / 0.3881"],
        ["ETTh2", "720", "0.704 / 0.597", "0.586 / 0.533", "0.3968 / 0.4516", "0.3769 / 0.4336", "0.406 / 0.441", "0.390 / 0.422", "0.4078 / 0.4390", "0.3883 / 0.4246"],
        ["ETTm1", "96", "0.300 / 0.345", "0.295 / 0.337", "0.3373 / 0.3730", "0.3302 / 0.3654", "0.289 / 0.343", "0.284 / 0.328", "0.3255 / 0.3778", "0.3199 / 0.3608"],
        ["ETTm1", "192", "0.336 / 0.366", "0.331 / 0.358", "0.3896 / 0.4044", "0.3867 / 0.3983", "0.329 / 0.368", "0.322 / 0.355", "0.3740 / 0.4103", "0.3739 / 0.3968"],
        ["ETTm1", "336", "0.367 / 0.386", "0.361 / 0.378", "0.4237 / 0.4324", "0.4210 / 0.4263", "0.362 / 0.390", "0.359 / 0.376", "0.4165 / 0.4412", "0.4221 / 0.4308"],
        ["ETTm1", "720", "0.419 / 0.416", "0.415 / 0.409", "0.4731 / 0.4712", "0.4712 / 0.4642", "0.416 / 0.423", "0.410 / 0.412", "0.4793 / 0.4850", "0.4811 / 0.4762"],
        ["ETTm2", "96", "0.164 / 0.255", "0.163 / 0.247", "0.1487 / 0.2534", "0.1433 / 0.2456", "0.165 / 0.255", "0.163 / 0.246", "0.1485 / 0.2544", "0.1432 / 0.2456"],
        ["ETTm2", "192", "0.224 / 0.304", "0.220 / 0.290", "0.1851 / 0.2855", "0.1754 / 0.2748", "0.221 / 0.293", "0.219 / 0.284", "0.1860 / 0.2847", "0.1768 / 0.2746"],
        ["ETTm2", "336", "0.277 / 0.337", "0.277 / 0.329", "0.2298 / 0.3219", "0.2134 / 0.3035", "0.276 / 0.327", "0.273 / 0.320", "0.2178 / 0.3090", "0.2113 / 0.3029"],
        ["ETTm2", "720", "0.371 / 0.401", "0.366 / 0.390", "0.2838 / 0.3598", "0.2638 / 0.3408", "0.362 / 0.381", "0.357 / 0.374", "0.2836 / 0.3526", "0.2771 / 0.3464"],
      ].map((row, i) => {
        const y = 184 + i * 43;
        return `<g>
          ${Math.floor(i / 4) % 2 ? `<rect x="32" y="${y}" width="1776" height="43" fill="#F8FAFC"/>` : ''}
          <text x="82" y="${y + 29}" text-anchor="middle" fill="#0F172A" font-size="18" font-weight="900">${row[0]}</text>
          <text x="170" y="${y + 29}" text-anchor="middle" fill="#334155" font-size="18" font-weight="800">${row[1]}</text>
          ${row.slice(2).map((value, j) => `<text x="${330 + j * 200}" y="${y + 29}" text-anchor="middle" fill="${j % 4 === 3 ? '#1D4ED8' : '#334155'}" font-size="18" font-weight="${j % 4 === 3 ? '900' : '700'}" font-family="monospace">${value}</text>`).join('')}
          <line x1="32" y1="${y + 43}" x2="1808" y2="${y + 43}" stroke="${(i + 1) % 4 === 0 ? '#94A3B8' : '#E2E8F0'}" stroke-width="${(i + 1) % 4 === 0 ? '1.8' : '1'}"/>
        </g>`;
      }).join('')}
      <line x1="1028" y1="84" x2="1028" y2="872" stroke="#CBD5E1" stroke-width="1.8"/>
    </svg>`,

    /* Local test metrics: four ETT horizons and five paired seeds per model.
       Source: 4090D unified_evaluation_20261111_06/completion.jsonl and
       f07/evaluations/unified_20261111_01/summary.json. */
    "slide5.normResults": drawResultTables([
      {dataset:'ETTh1', firstColumn:'季节 / 趋势', rows:[
        ['L2 / L1（基准）',[0.50429027,0.49688665],[0.52196402,0.51247610]],
        ['L1 / L1',[0.50337669,0.49520457],[0.52181007,0.51087913]],
        ['L1 / L2',[0.50537613,0.50157976],[0.52645760,0.51766973]],
        ['L2 / L2',[0.50636785,0.50273487],[0.52337809,0.51708478]]]},
      {dataset:'ETTh2', firstColumn:'季节 / 趋势', rows:[
        ['L2 / L1（基准）',[0.28533199,0.36354291],[0.30690315,0.37475124]],
        ['L1 / L1',[0.28414079,0.36209795],[0.29738989,0.36654839]],
        ['L1 / L2',[0.30097330,0.38043734],[0.30825290,0.37584488]],
        ['L2 / L2',[0.30429363,0.38308631],[0.31024443,0.37848904]]]},
      {dataset:'ETTm1', firstColumn:'季节 / 趋势', rows:[
        ['L2 / L1（基准）',[0.40226219,0.41354479],[0.45898647,0.45528809]],
        ['L1 / L1',[0.40138299,0.41218611],[0.41212256,0.42772875]],
        ['L1 / L2',[0.40511723,0.41928983],[0.40169811,0.43284897]],
        ['L2 / L2',[0.40553262,0.41970056],[0.42559843,0.44906167]]]},
      {dataset:'ETTm2', firstColumn:'季节 / 趋势', rows:[
        ['L2 / L1（基准）',[0.19876701,0.29095749],[0.21469834,0.30542242]],
        ['L1 / L1',[0.19819588,0.29017898],[0.20194874,0.29322978]],
        ['L1 / L2',[0.20409499,0.29829091],[0.20551103,0.29814531]],
        ['L2 / L2',[0.20599123,0.30033701],[0.20994487,0.30327172]]]}
    ]),

    "slide6.operatorResults": drawResultTables([
      {dataset:'ETTh1', firstColumn:'分解算子', rows:[
        ['EMA（基准）',[0.50429027,0.49688665],[0.52196411,0.51247617]],
        ['因果 SMA-9',[0.50528423,0.49767376],[0.51831752,0.51018617]],
        ['中心 MA-25',[0.50524190,0.49838626],[0.51902837,0.51142810]]]},
      {dataset:'ETTh2', firstColumn:'分解算子', rows:[
        ['EMA（基准）',[0.28533199,0.36354291],[0.30690303,0.37475105]],
        ['因果 SMA-9',[0.28563631,0.36388294],[0.30578502,0.37366885]],
        ['中心 MA-25',[0.28571856,0.36389508],[0.30599023,0.37388992]]]},
      {dataset:'ETTm1', firstColumn:'分解算子', rows:[
        ['EMA（基准）',[0.40226219,0.41354479],[0.45898748,0.45528876]],
        ['因果 SMA-9',[0.40221961,0.41325668],[0.46035923,0.45461031]],
        ['中心 MA-25',[0.40188572,0.41247105],[0.52900612,0.48896118]]]},
      {dataset:'ETTm2', firstColumn:'分解算子', rows:[
        ['EMA（基准）',[0.19876701,0.29095749],[0.21469833,0.30542243]],
        ['因果 SMA-9',[0.19875170,0.29088211],[0.21299649,0.30380288]],
        ['中心 MA-25',[0.19874437,0.29070168],[0.21533430,0.30674314]]]}
    ])
  };
})();
