/**
 * ============================================================================
 * @file js/visuals-library.js
 * @description Pure SVG Visual Component Registry (`window.AuroraVisuals`).
 *              Completely decoupled from text content and presentation logic.
 *              All mathematical symbols inside SVG diagrams use `<foreignObject>`
 *              with `.latex-formula[data-latex]` so they are typeset by TeX.
 * ============================================================================
 */

(function () {
  /**
   * Helper to embed a centered TeX formula inside an SVG `<foreignObject>`
   */
  function svgTex(x, y, w, h, latex, color = '#0F172A', fontSize = '13px', extraTextPrefix = '', extraTextSuffix = '') {
    const escaped = latex.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
    const pre = extraTextPrefix ? `<span>${extraTextPrefix}</span>` : '';
    const suf = extraTextSuffix ? `<span>${extraTextSuffix}</span>` : '';
    return `<foreignObject x="${x}" y="${y}" width="${w}" height="${h}">
      <div xmlns="http://www.w3.org/1999/xhtml" class="svg-tex-cell" style="color:${color};font-size:${fontSize};">
        ${pre}<span class="latex-formula" data-latex="${escaped}" data-display="false"></span>${suf}
      </div>
    </foreignObject>`;
  }

  window.AuroraVisuals = {
    /* ========================================================================
     * 1. SLIDE 1 VISUALS: FULL-WIDTH 520x175 CANVAS (ZERO OVERFLOW, HIGH FILL)
     * ======================================================================== */
    "contrast.blindness": `<svg viewBox="0 0 520 175" fill="none">
      <rect x="8" y="8" width="236" height="159" rx="12" fill="#EFF6FF" fill-opacity="0.55" stroke="#BFDBFE" stroke-width="1.5"/>
      <rect x="252" y="8" width="260" height="159" rx="12" fill="#FFF1F2" fill-opacity="0.55" stroke="#FECDD3" stroke-width="1.5"/>
      <line x1="248" y1="8" x2="248" y2="167" stroke="#E11D48" stroke-width="2.5" stroke-dasharray="6 5"/>
      <text x="126" y="32" text-anchor="middle" fill="#1E40AF" font-size="15" font-weight="800">相似一维历史观测波形</text>
      <text x="382" y="32" text-anchor="middle" fill="#BE123C" font-size="15" font-weight="800">截然相反的未来演化走势</text>
      <path d="M 24 114 C 66 62, 104 148, 144 98 C 184 52, 216 132, 248 98" stroke="#2563EB" stroke-width="5" stroke-linecap="round"/>
      <path d="M 248 98 C 296 68, 348 52, 408 44 C 444 40, 472 38, 496 36" stroke="#E11D48" stroke-width="4.5" stroke-linecap="round"/>
      <circle cx="496" cy="36" r="6" fill="#E11D48"/>
      <rect x="356" y="54" width="132" height="26" rx="6" fill="#FFE4E6" stroke="#FDA4AF" stroke-width="1.2"/>
      <text x="422" y="72" text-anchor="middle" fill="#BE123C" font-size="13" font-weight="800">场景 A：突发激增</text>
      <path d="M 248 98 C 296 130, 348 148, 408 154 C 444 158, 472 160, 496 160" stroke="#7C3AED" stroke-width="4.5" stroke-dasharray="8 6" stroke-linecap="round"/>
      <circle cx="496" cy="160" r="6" fill="#7C3AED"/>
      <rect x="356" y="114" width="132" height="26" rx="6" fill="#EDE9FE" stroke="#C4B5FD" stroke-width="1.2"/>
      <text x="422" y="132" text-anchor="middle" fill="#5B21B6" font-size="13" font-weight="800">场景 B：断崖骤降</text>
      <circle cx="248" cy="98" r="17" fill="#E11D48"/>
      <text x="248" y="104" text-anchor="middle" fill="#FFFFFF" font-size="17" font-weight="900">?</text>
    </svg>`,

    "contrast.redundancy": `<svg viewBox="0 0 520 175" fill="none">
      <rect x="8" y="8" width="268" height="159" rx="12" fill="#FFF1F2" fill-opacity="0.5" stroke="#FECDD3" stroke-width="1.5"/>
      <text x="142" y="30" text-anchor="middle" fill="#BE123C" font-size="14.5" font-weight="800">预训练特征网格含大量背景冗余</text>
      <g transform="translate(26, 40)">
        ${Array.from({ length: 4 })
          .map((_, r) =>
            Array.from({ length: 9 })
              .map((__, c) => {
                const isKey = (r === 1 && c === 2) || (r === 2 && c === 6);
                const fill = isKey ? "#E11D48" : "#FECDD3";
                return `<rect x="${c * 26}" y="${r * 22}" width="20" height="17" rx="3.5" fill="${fill}"/>`;
              })
              .join("")
          )
          .join("")}
      </g>
      <text x="142" y="152" text-anchor="middle" fill="#9F1239" font-size="13.5" font-weight="800">有效趋势与周期信息极度稀疏</text>

      <path d="M 282 88 L 304 88" stroke="#E11D48" stroke-width="3"/>
      <polygon points="302,82 312,88 302,94" fill="#E11D48"/>

      <rect x="316" y="12" width="196" height="151" rx="14" fill="#FFE4E6" stroke="#F43F5E" stroke-width="2" stroke-dasharray="5 4"/>
      <circle cx="414" cy="58" r="22" fill="#FFFFFF" stroke="#E11D48" stroke-width="2.5"/>
      <path d="M 403 47 L 425 69 M 425 47 L 403 69" stroke="#E11D48" stroke-width="3.8" stroke-linecap="round"/>
      <text x="414" y="108" text-anchor="middle" fill="#BE123C" font-size="15" font-weight="800">跨模态空间异构失配</text>
      <text x="414" y="134" text-anchor="middle" fill="#475569" font-size="13" font-weight="700">直接拼接易淹没主干信号</text>
    </svg>`,

    "contrast.noiseStart": `<svg viewBox="0 0 520 175" fill="none">
      <rect x="10" y="12" width="144" height="151" rx="14" fill="#FFF1F2" stroke="#FECDD3" stroke-width="1.8"/>
      <circle cx="82" cy="70" r="44" fill="#FFE4E6" stroke="#E11D48" stroke-width="2" stroke-dasharray="4 4"/>
      <path d="M 50 72 L 64 40 L 78 98 L 92 42 L 104 92 L 116 60" stroke="#E11D48" stroke-width="2.8" fill="none"/>
      <text x="82" y="142" text-anchor="middle" fill="#BE123C" font-size="13.5" font-weight="800">纯高斯白噪声起点</text>

      <path d="M 164 88 C 206 16, 258 160, 308 48 C 332 18, 348 118, 368 88" stroke="#E11D48" stroke-width="3.8" stroke-dasharray="6 4" fill="none"/>
      <polygon points="366,82 376,88 366,94" fill="#E11D48"/>
      <rect x="184" y="14" width="168" height="28" rx="8" fill="#FFE4E6" stroke="#FDA4AF" stroke-width="1.2"/>
      <text x="268" y="33" text-anchor="middle" fill="#BE123C" font-size="13" font-weight="800">传输路径弯曲漫长 · 易发散</text>

      <rect x="380" y="12" width="130" height="151" rx="14" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2"/>
      <path d="M 398 98 Q 422 44, 446 84 T 492 48" stroke="#2563EB" stroke-width="4" fill="none"/>
      <text x="445" y="142" text-anchor="middle" fill="#1D4ED8" font-size="14" font-weight="800">真实未来分布</text>
    </svg>`,

    "contrast.auroraFoundation": `<svg viewBox="0 0 520 175" fill="none">
      <g transform="translate(10, 12)">
        <rect x="0" y="0" width="136" height="42" rx="9" fill="#DBEAFE" stroke="#3B82F6" stroke-width="2"/>
        <text x="68" y="26" text-anchor="middle" fill="#1E40AF" font-size="14" font-weight="800">一维历史序列</text>
        <rect x="0" y="54" width="136" height="42" rx="9" fill="#EDE9FE" stroke="#8B5CF6" stroke-width="2"/>
        <text x="68" y="80" text-anchor="middle" fill="#5B21B6" font-size="14" font-weight="800">二维内生图像</text>
        <rect x="0" y="108" width="136" height="42" rx="9" fill="#D1FAE5" stroke="#10B981" stroke-width="2"/>
        <text x="68" y="134" text-anchor="middle" fill="#065F46" font-size="14" font-weight="800">外生领域文本</text>
      </g>
      <path d="M 148 33 L 204 82 M 148 87 L 204 87 M 148 141 L 204 92" stroke="#2563EB" stroke-width="2.8"/>
      <rect x="204" y="38" width="118" height="98" rx="16" fill="#2563EB"/>
      <text x="263" y="82" text-anchor="middle" fill="#FFFFFF" font-size="18" font-weight="900">AURORA</text>
      <text x="263" y="108" text-anchor="middle" fill="#DBEAFE" font-size="13.5" font-weight="800">三路协同编码</text>
      <path d="M 324 87 L 368 46 M 324 87 L 368 128" stroke="#059669" stroke-width="3.2"/>
      <rect x="370" y="12" width="140" height="68" rx="12" fill="#ECFDF5" stroke="#10B981" stroke-width="2"/>
      <path d="M 386 50 Q 428 24, 494 22" stroke="#059669" stroke-width="3.8" fill="none"/>
      <text x="440" y="69" text-anchor="middle" fill="#065F46" font-size="13" font-weight="800">场景 A 精准预测</text>
      <rect x="370" y="94" width="140" height="68" rx="12" fill="#F5F3FF" stroke="#8B5CF6" stroke-width="2"/>
      <path d="M 386 108 Q 428 130, 494 134" stroke="#7C3AED" stroke-width="3.8" fill="none"/>
      <text x="440" y="152" text-anchor="middle" fill="#5B21B6" font-size="13" font-weight="800">场景 B 精准预测</text>
    </svg>`,

    "contrast.distillGuide": `<svg viewBox="0 0 520 175" fill="none">
      <g transform="translate(10, 12)">
        <rect x="0" y="0" width="94" height="150" rx="12" fill="#EDE9FE" stroke="#8B5CF6" stroke-width="2"/>
        <text x="47" y="62" text-anchor="middle" fill="#5B21B6" font-size="14.5" font-weight="900">原始特征</text>
        <text x="47" y="90" text-anchor="middle" fill="#6D28D9" font-size="12.5" font-weight="800">高维冗余序列</text>

        <polygon points="104,14 182,44 182,106 104,136" fill="#D1FAE5" stroke="#10B981" stroke-width="2.2"/>
        <text x="143" y="80" text-anchor="middle" fill="#065F46" font-size="14" font-weight="800">质心蒸馏</text>

        <rect x="192" y="38" width="76" height="74" rx="12" fill="#059669"/>
        <text x="230" y="70" text-anchor="middle" fill="#FFFFFF" font-size="14" font-weight="900">精炼质心</text>
        ${svgTex(196, 78, 68, 26, 'K \\ll N', '#D1FAE5', '12px')}
      </g>
      <line x1="282" y1="87" x2="310" y2="87" stroke="#D97706" stroke-width="3.5"/>
      <polygon points="308,81 318,87 308,93" fill="#D97706"/>
      <g transform="translate(320, 12)">
        <rect x="0" y="0" width="190" height="150" rx="14" fill="#FFFBEB" stroke="#F59E0B" stroke-width="2.2"/>
        ${svgTex(10, 8, 170, 26, '\\mathrm{Corr}', '#B45309', '13.5px', '双路相关性矩阵 ', '')}
        <g transform="translate(45, 38)">
          <rect x="0" y="0" width="22" height="20" rx="3.5" fill="#F59E0B"/><rect x="26" y="0" width="22" height="20" rx="3.5" fill="#FDE68A"/><rect x="52" y="0" width="22" height="20" rx="3.5" fill="#FEF3C7"/><rect x="78" y="0" width="22" height="20" rx="3.5" fill="#FBBF24"/>
          <rect x="0" y="24" width="22" height="20" rx="3.5" fill="#FDE68A"/><rect x="26" y="24" width="22" height="20" rx="3.5" fill="#D97706"/><rect x="52" y="24" width="22" height="20" rx="3.5" fill="#FDE68A"/><rect x="78" y="24" width="22" height="20" rx="3.5" fill="#FEF3C7"/>
          <rect x="0" y="48" width="22" height="20" rx="3.5" fill="#FEF3C7"/><rect x="26" y="48" width="22" height="20" rx="3.5" fill="#FBBF24"/><rect x="52" y="48" width="22" height="20" rx="3.5" fill="#D97706"/><rect x="78" y="48" width="22" height="20" rx="3.5" fill="#F59E0B"/>
        </g>
        <text x="95" y="134" text-anchor="middle" fill="#92400E" font-size="13" font-weight="800">调制时序多头自注意力</text>
      </g>
    </svg>`,

    "contrast.pgfmStraight": `<svg viewBox="0 0 520 175" fill="none">
      <g transform="translate(10, 12)">
        <rect x="0" y="0" width="148" height="150" rx="14" fill="#F5F3FF" stroke="#8B5CF6" stroke-width="2.2"/>
        ${svgTex(8, 10, 132, 26, '\\tilde{\\mathcal{P}}', '#5B21B6', '13.5px', '检索先验原型 ', '')}
        <path d="M 18 86 Q 48 40, 76 86 T 130 58" stroke="#7C3AED" stroke-width="4" fill="none"/>
        <text x="74" y="132" text-anchor="middle" fill="#6D28D9" font-size="13" font-weight="800">周期与趋势基波锚点</text>
      </g>
      <line x1="166" y1="87" x2="346" y2="87" stroke="#059669" stroke-width="5"/>
      <polygon points="344,78 362,87 344,96" fill="#059669"/>
      <circle cx="222" cy="87" r="6.5" fill="#10B981"/><circle cx="290" cy="87" r="6.5" fill="#10B981"/>
      <rect x="182" y="44" width="152" height="28" rx="8" fill="#ECFDF5" stroke="#A7F3D0" stroke-width="1.2"/>
      <text x="258" y="63" text-anchor="middle" fill="#065F46" font-size="13.5" font-weight="800">最优传输直线流匹配</text>
      <g transform="translate(366, 12)">
        <rect x="0" y="0" width="144" height="150" rx="14" fill="#ECFDF5" stroke="#10B981" stroke-width="2.2"/>
        ${svgTex(8, 10, 128, 26, '\\hat{Y}', '#065F46', '13.5px', '生成预测分布 ', '')}
        <path d="M 16 96 Q 46 42, 74 78 T 128 48" stroke="#10B981" stroke-width="12" stroke-opacity="0.28" fill="none"/>
        <path d="M 16 96 Q 46 42, 74 78 T 128 48" stroke="#059669" stroke-width="4" fill="none"/>
        <text x="72" y="132" text-anchor="middle" fill="#047857" font-size="13" font-weight="800">多峰概率置信区间</text>
      </g>
    </svg>`,

    /* ========================================================================
     * 2. SLIDE 2 VISUALS: AUTHENTIC MULTI-STREAM ENCODER & DECODER DIAGRAMS
     * ======================================================================== */
    "arch.encoderMultiStream": `<svg viewBox="0 0 1740 435" fill="none">
      <!-- Lane 1: Top Text Stream Background -->
      <rect x="10" y="6" width="1340" height="106" rx="16" fill="#F0FDF4" stroke="#A7F3D0" stroke-width="1.8"/>
      <text x="28" y="26" fill="#047857" font-size="13" font-weight="900">上路支路 · 外生领域文本流 (Text Modality Stream)</text>

      <!-- Lane 2: Middle 1D Time Series Backbone Background -->
      <rect x="10" y="120" width="1340" height="194" rx="18" fill="#EFF6FF" stroke="#93C5FD" stroke-width="2"/>
      <text x="28" y="142" fill="#1D4ED8" font-size="13.5" font-weight="900">中路主干 · 一维时间序列流 (1D Time Series Backbone Stream)</text>

      <!-- Lane 3: Bottom 2D Endogenous Image Stream Background -->
      <rect x="10" y="322" width="1340" height="106" rx="16" fill="#F5F3FF" stroke="#C4B5FD" stroke-width="1.8"/>
      <text x="276" y="342" fill="#6D28D9" font-size="13" font-weight="900">下路支路 · 二维内生图像流 (2D Endogenous Image Stream · 由一维序列按主周期折叠生成)</text>

      <!-- ==================== TOP STREAM: TEXT MODALITY ==================== -->
      <g class="svg-clickable-group" data-jump-slide="4">
        <rect x="28" y="34" width="230" height="68" rx="12" fill="#FFFFFF" stroke="#10B981" stroke-width="2"/>
        <rect x="40" y="44" width="64" height="18" rx="4" fill="#059669"/>
        <text x="72" y="57" text-anchor="middle" fill="#FFFFFF" font-size="11" font-weight="800">领域文本</text>
        <text x="112" y="57" fill="#065F46" font-size="12" font-weight="700">新闻 / 气象 / 领域描述</text>
        <rect x="40" y="68" width="196" height="8" rx="3" fill="#A7F3D0"/>
        <rect x="40" y="82" width="146" height="8" rx="3" fill="#6EE7B7"/>

        <line x1="258" y1="68" x2="294" y2="68" stroke="#059669" stroke-width="3"/>
        <polygon points="292,62 304,68 292,74" fill="#059669"/>

        <rect x="306" y="40" width="144" height="56" rx="10" fill="#D1FAE5" stroke="#059669" stroke-width="2"/>
        <text x="378" y="65" text-anchor="middle" fill="#065F46" font-size="14" font-weight="900">Tokenizer</text>
        <text x="378" y="84" text-anchor="middle" fill="#047857" font-size="11.5" font-weight="700">文本分词与位置嵌入</text>

        <line x1="450" y1="68" x2="486" y2="68" stroke="#059669" stroke-width="3"/>
        <polygon points="484,62 496,68 484,74" fill="#059669"/>

        <rect x="498" y="38" width="196" height="60" rx="12" fill="#059669"/>
        <text x="596" y="64" text-anchor="middle" fill="#FFFFFF" font-size="14.5" font-weight="900">TextEncoder (BERT)</text>
        <text x="596" y="84" text-anchor="middle" fill="#D1FAE5" font-size="11.5" font-weight="700">冻结预训练参数 · 提取上下文</text>

        <line x1="694" y1="68" x2="758" y2="68" stroke="#059669" stroke-width="3"/>
        <polygon points="756,62 768,68 756,74" fill="#059669"/>
        ${svgTex(696, 42, 64, 22, 'H^{\\text{text}}', '#047857', '12px')}

        <rect x="770" y="38" width="216" height="60" rx="12" fill="#ECFDF5" stroke="#059669" stroke-width="2.5"/>
        <text x="878" y="64" text-anchor="middle" fill="#065F46" font-size="14.5" font-weight="900">TextDistiller (质心蒸馏)</text>
        <text x="878" y="84" text-anchor="middle" fill="#047857" font-size="11.5" font-weight="700">交叉注意力提纯核心语义质心</text>

        <line x1="986" y1="68" x2="1044" y2="68" stroke="#059669" stroke-width="3"/>
        <polygon points="1042,62 1054,68 1042,74" fill="#059669"/>

        <rect x="1056" y="34" width="164" height="68" rx="12" fill="#FFFFFF" stroke="#059669" stroke-width="2.5"/>
        <rect x="1068" y="46" width="16" height="16" rx="3" fill="#059669"/>
        <rect x="1068" y="66" width="16" height="16" rx="3" fill="#10B981"/>
        <rect x="1088" y="46" width="16" height="16" rx="3" fill="#34D399"/>
        <rect x="1088" y="66" width="16" height="16" rx="3" fill="#059669"/>
        <text x="1162" y="58" text-anchor="middle" fill="#065F46" font-size="13" font-weight="900">蒸馏文本质心</text>
        ${svgTex(1108, 66, 108, 28, '\\tilde{X}^{\\text{text}} \\in \\mathbb{R}^{K \\times D}', '#047857', '11.5px')}
      </g>

      <!-- ==================== MIDDLE STREAM: 1D TIME SERIES BACKBONE ==================== -->
      <g class="svg-clickable-group" data-jump-slide="2">
        <rect x="28" y="152" width="230" height="114" rx="14" fill="#FFFFFF" stroke="#2563EB" stroke-width="2.5"/>
        <text x="143" y="175" text-anchor="middle" fill="#1E40AF" font-size="14" font-weight="900">原始时间序列 (Time Series)</text>
        <line x1="44" y1="212" x2="242" y2="212" stroke="#CBD5E1" stroke-width="1.5" stroke-dasharray="4 3"/>
        <path d="M 44 230 C 74 184, 102 242, 132 200 C 162 170, 192 234, 222 188 L 240 202" stroke="#2563EB" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <circle cx="196" cy="200" r="16" fill="none" stroke="#E11D48" stroke-width="2" stroke-dasharray="3 2"/>
        ${svgTex(38, 236, 210, 26, 'x_{1:T} \\in \\mathbb{R}^{T}', '#475569', '12px', '历史序列 ', '')}

        <line x1="258" y1="210" x2="294" y2="210" stroke="#2563EB" stroke-width="3.5"/>
        <polygon points="292,204 304,210 292,216" fill="#2563EB"/>

        <rect x="306" y="172" width="166" height="76" rx="12" fill="#DBEAFE" stroke="#2563EB" stroke-width="2.5"/>
        <text x="389" y="200" text-anchor="middle" fill="#1E40AF" font-size="14.5" font-weight="900">1D Tokenizer</text>
        <text x="389" y="220" text-anchor="middle" fill="#1D4ED8" font-size="12" font-weight="800">RevIN 归一化 + 左补零</text>
        <text x="389" y="237" text-anchor="middle" fill="#2563EB" font-size="11.5" font-weight="700">一维分块与动态重采样嵌入</text>

        <line x1="472" y1="210" x2="508" y2="210" stroke="#2563EB" stroke-width="3.5"/>
        <polygon points="506,204 518,210 506,216" fill="#2563EB"/>

        <rect x="520" y="168" width="96" height="84" rx="12" fill="#FFFFFF" stroke="#2563EB" stroke-width="2.5"/>
        <rect x="530" y="182" width="14" height="14" rx="3" fill="#2563EB"/>
        <rect x="530" y="202" width="14" height="14" rx="3" fill="#3B82F6"/>
        <rect x="530" y="222" width="14" height="14" rx="3" fill="#60A5FA"/>
        <text x="580" y="198" text-anchor="middle" fill="#1E40AF" font-size="13" font-weight="900">时序块</text>
        ${svgTex(546, 208, 68, 30, 'X^{\\text{time}}', '#2563EB', '12.5px')}
      </g>

      <!-- ==================== ENDOGENOUS BRANCH: TIME SERIES -> 2D IMAGE ==================== -->
      <g class="svg-clickable-group" data-jump-slide="3">
        <line x1="143" y1="266" x2="143" y2="280" stroke="#7C3AED" stroke-width="3" stroke-dasharray="4 3"/>
        <rect x="54" y="280" width="178" height="24" rx="12" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1.5"/>
        <text x="143" y="296" text-anchor="middle" fill="#5B21B6" font-size="11.5" font-weight="800">FFT 提取主周期折叠成图</text>
        <line x1="143" y1="304" x2="143" y2="332" stroke="#7C3AED" stroke-width="3" stroke-dasharray="4 3"/>
        <polygon points="137,330 143,342 149,330" fill="#7C3AED"/>

        <rect x="28" y="344" width="230" height="74" rx="12" fill="#FFFFFF" stroke="#7C3AED" stroke-width="2"/>
        <rect x="42" y="354" width="54" height="54" rx="6" fill="url(#encHeat2D)" stroke="#5B21B6" stroke-width="1.5"/>
        <line x1="42" y1="372" x2="96" y2="372" stroke="rgba(255,255,255,0.5)"/>
        <line x1="42" y1="390" x2="96" y2="390" stroke="rgba(255,255,255,0.5)"/>
        <line x1="60" y1="354" x2="60" y2="408" stroke="rgba(255,255,255,0.5)"/>
        <line x1="78" y1="354" x2="78" y2="408" stroke="rgba(255,255,255,0.5)"/>
        <text x="174" y="374" text-anchor="middle" fill="#5B21B6" font-size="13.5" font-weight="900">二维内生周期图</text>
        ${svgTex(100, 382, 152, 26, 'I \\in \\mathbb{R}^{H \\times W \\times 3}', '#6D28D9', '11.5px')}

        <line x1="258" y1="381" x2="294" y2="381" stroke="#7C3AED" stroke-width="3"/>
        <polygon points="292,375 304,381 292,387" fill="#7C3AED"/>

        <rect x="306" y="353" width="144" height="56" rx="10" fill="#EDE9FE" stroke="#7C3AED" stroke-width="2"/>
        <text x="378" y="378" text-anchor="middle" fill="#5B21B6" font-size="14" font-weight="900">2D Tokenizer</text>
        <text x="378" y="397" text-anchor="middle" fill="#6D28D9" font-size="11.5" font-weight="700">二维网格分块 + 位置嵌入</text>

        <line x1="450" y1="381" x2="486" y2="381" stroke="#7C3AED" stroke-width="3"/>
        <polygon points="484,375 496,381 484,387" fill="#7C3AED"/>

        <rect x="498" y="351" width="196" height="60" rx="12" fill="#7C3AED"/>
        <text x="596" y="377" text-anchor="middle" fill="#FFFFFF" font-size="14.5" font-weight="900">VisionEncoder (ViT)</text>
        <text x="596" y="397" text-anchor="middle" fill="#EDE9FE" font-size="11.5" font-weight="700">冻结预训练参数 · 提取周期纹理</text>

        <line x1="694" y1="381" x2="758" y2="381" stroke="#7C3AED" stroke-width="3"/>
        <polygon points="756,375 768,381 756,387" fill="#7C3AED"/>
        ${svgTex(696, 355, 64, 22, 'H^{\\text{vis}}', '#6D28D9', '12px')}

        <rect x="770" y="351" width="216" height="60" rx="12" fill="#F5F3FF" stroke="#7C3AED" stroke-width="2.5"/>
        <text x="878" y="377" text-anchor="middle" fill="#5B21B6" font-size="14.5" font-weight="900">VisionDistiller (质心蒸馏)</text>
        <text x="878" y="397" text-anchor="middle" fill="#6D28D9" font-size="11.5" font-weight="700">交叉注意力提纯核心周期质心</text>

        <line x1="986" y1="381" x2="1044" y2="381" stroke="#7C3AED" stroke-width="3"/>
        <polygon points="1042,375 1054,381 1042,387" fill="#7C3AED"/>

        <rect x="1056" y="347" width="164" height="68" rx="12" fill="#FFFFFF" stroke="#7C3AED" stroke-width="2.5"/>
        <rect x="1068" y="359" width="16" height="16" rx="3" fill="#7C3AED"/>
        <rect x="1068" y="379" width="16" height="16" rx="3" fill="#8B5CF6"/>
        <rect x="1088" y="359" width="16" height="16" rx="3" fill="#A78BFA"/>
        <rect x="1088" y="379" width="16" height="16" rx="3" fill="#7C3AED"/>
        <text x="1162" y="371" text-anchor="middle" fill="#5B21B6" font-size="13" font-weight="900">蒸馏视觉质心</text>
        ${svgTex(1108, 379, 108, 28, '\\tilde{X}^{\\text{image}} \\in \\mathbb{R}^{K \\times D}', '#6D28D9', '11.5px')}
      </g>

      <!-- ==================== CENTRAL HUB: GUIDERS + MG-MSA + MODALITY FUSER ==================== -->
      <g class="svg-clickable-group" data-jump-slide="5">
        <rect x="756" y="125" width="244" height="40" rx="10" fill="#FEF3C7" stroke="#D97706" stroke-width="2"/>
        <text x="878" y="150" text-anchor="middle" fill="#92400E" font-size="13" font-weight="900">TextGuider (时序-文本相关性引导)</text>
        <path d="M 600 168 L 600 145 L 746 145" stroke="#D97706" stroke-width="2.2" fill="none"/>
        <polygon points="744,140 754,145 744,150" fill="#D97706"/>
        <path d="M 1056 84 L 1018 84 L 1018 145 L 1008 145" stroke="#059669" stroke-width="2.2" fill="none"/>
        <polygon points="1010,140 1000,145 1010,150" fill="#059669"/>
        <line x1="820" y1="165" x2="820" y2="176" stroke="#D97706" stroke-width="3"/>

        <rect x="756" y="268" width="244" height="40" rx="10" fill="#FEF3C7" stroke="#D97706" stroke-width="2"/>
        <text x="878" y="293" text-anchor="middle" fill="#92400E" font-size="13" font-weight="900">VisionGuider (时序-视觉相关性引导)</text>
        <path d="M 600 252 L 600 288 L 746 288" stroke="#D97706" stroke-width="2.2" fill="none"/>
        <polygon points="744,283 754,288 744,293" fill="#D97706"/>
        <path d="M 1056 365 L 1018 365 L 1018 288 L 1008 288" stroke="#7C3AED" stroke-width="2.2" fill="none"/>
        <polygon points="1010,283 1000,288 1010,293" fill="#7C3AED"/>
        <line x1="820" y1="268" x2="820" y2="256" stroke="#D97706" stroke-width="3"/>

        <rect x="650" y="174" width="530" height="84" rx="14" fill="#FFFFFF" stroke="#2563EB" stroke-width="2.5"/>
        <rect x="664" y="184" width="212" height="64" rx="10" fill="#FFFBEB" stroke="#F59E0B" stroke-width="2"/>
        <text x="770" y="207" text-anchor="middle" fill="#92400E" font-size="13" font-weight="900">模态引导多头自注意力 (MG-MSA)</text>
        ${svgTex(674, 214, 192, 28, '\\mathrm{Corr}', '#B45309', '11.5px', '注入双线性引导矩阵 ', '')}

        <line x1="876" y1="216" x2="896" y2="216" stroke="#2563EB" stroke-width="2.5"/>
        <rect x="896" y="186" width="84" height="60" rx="8" fill="#DBEAFE" stroke="#3B82F6" stroke-width="1.8"/>
        <text x="938" y="213" text-anchor="middle" fill="#1E40AF" font-size="12" font-weight="800">Add &amp; Norm</text>
        <text x="938" y="231" text-anchor="middle" fill="#2563EB" font-size="11" font-weight="700">残差连接</text>

        <line x1="980" y1="216" x2="1000" y2="216" stroke="#2563EB" stroke-width="2.5"/>
        <rect x="1000" y="186" width="76" height="60" rx="8" fill="#EFF6FF" stroke="#3B82F6" stroke-width="1.8"/>
        <text x="1038" y="213" text-anchor="middle" fill="#1E40AF" font-size="12.5" font-weight="900">FFN</text>
        <text x="1038" y="231" text-anchor="middle" fill="#2563EB" font-size="11" font-weight="700">前馈网络</text>

        <line x1="1076" y1="216" x2="1094" y2="216" stroke="#2563EB" stroke-width="2.5"/>
        <rect x="1094" y="186" width="74" height="60" rx="8" fill="#2563EB"/>
        ${svgTex(1096, 192, 70, 26, '\\times K', '#FFFFFF', '12px', '', ' 层')}
        <text x="1131" y="233" text-anchor="middle" fill="#DBEAFE" font-size="11" font-weight="700">堆叠演化</text>

        <line x1="616" y1="216" x2="646" y2="216" stroke="#2563EB" stroke-width="3.5"/>
        <polygon points="644,210 654,216 644,222" fill="#2563EB"/>

        <line x1="1180" y1="216" x2="1214" y2="216" stroke="#2563EB" stroke-width="3.5"/>
        <polygon points="1212,210 1222,216 1212,222" fill="#2563EB"/>

        <rect x="1224" y="176" width="110" height="80" rx="12" fill="#FFFFFF" stroke="#2563EB" stroke-width="2.5"/>
        <text x="1279" y="204" text-anchor="middle" fill="#1E40AF" font-size="13" font-weight="900">引导后时序</text>
        ${svgTex(1230, 214, 98, 30, '\\tilde{X}^{\\text{time}}', '#2563EB', '12.5px')}

        <rect x="1366" y="6" width="364" height="422" rx="18" fill="#FFFBEB" stroke="#FCD34D" stroke-width="2"/>
        <text x="1548" y="32" text-anchor="middle" fill="#B45309" font-size="13.5" font-weight="900">三路跨模态对齐与融合 (Modality Fuser)</text>

        <path d="M 1220 68 L 1456 68 L 1456 126" stroke="#059669" stroke-width="3.5" fill="none"/>
        <polygon points="1450,124 1456,136 1462,124" fill="#059669"/>
        <line x1="1334" y1="216" x2="1382" y2="216" stroke="#2563EB" stroke-width="4"/>
        <polygon points="1380,210 1392,216 1380,222" fill="#2563EB"/>
        <path d="M 1220 381 L 1456 381 L 1456 306" stroke="#7C3AED" stroke-width="3.5" fill="none"/>
        <polygon points="1450,308 1456,296 1462,308" fill="#7C3AED"/>

        <rect x="1392" y="138" width="164" height="156" rx="22" fill="#FFFFFF" stroke="#D97706" stroke-width="3"/>
        <circle cx="1474" cy="182" r="20" fill="#F59E0B"/>
        <text x="1474" y="189" text-anchor="middle" fill="#FFFFFF" font-size="22" font-weight="900">+</text>
        <text x="1474" y="226" text-anchor="middle" fill="#92400E" font-size="15" font-weight="900">Modality Fuser</text>
        <text x="1474" y="248" text-anchor="middle" fill="#B45309" font-size="12" font-weight="800">交叉注意力对齐</text>
        <text x="1474" y="268" text-anchor="middle" fill="#D97706" font-size="11.5" font-weight="700">时序 + 视觉 + 文本残差相加</text>

        <line x1="1556" y1="216" x2="1592" y2="216" stroke="#D97706" stroke-width="3.5"/>
        <polygon points="1590,210 1602,216 1590,222" fill="#D97706"/>

        <rect x="1604" y="138" width="112" height="156" rx="14" fill="#FFFFFF" stroke="#2563EB" stroke-width="2.5"/>
        <rect x="1624" y="156" width="22" height="18" rx="4" fill="#2563EB"/>
        <rect x="1652" y="156" width="22" height="18" rx="4" fill="#7C3AED"/>
        <rect x="1680" y="156" width="22" height="18" rx="4" fill="#059669"/>
        <text x="1660" y="202" text-anchor="middle" fill="#0F172A" font-size="14" font-weight="900">多模态融合表征</text>
        ${svgTex(1612, 212, 96, 32, 'X^{\\text{fuse}}', '#2563EB', '13.5px')}
        <text x="1660" y="262" text-anchor="middle" fill="#64748B" font-size="11" font-weight="700">三路对齐编码输出</text>
      </g>

      <defs>
        <linearGradient id="encHeat2D" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#3B82F6"/>
          <stop offset="50%" stop-color="#8B5CF6"/>
          <stop offset="100%" stop-color="#EC4899"/>
        </linearGradient>
      </defs>
    </svg>`,

    "arch.decoderMultiStream": `<svg viewBox="0 0 1740 300" fill="none">
      <rect x="10" y="6" width="1152" height="134" rx="16" fill="#F5F3FF" stroke="#DDD6FE" stroke-width="1.8"/>
      <text x="28" y="26" fill="#6D28D9" font-size="13" font-weight="900">解码上路 · 多模态先验原型检索支路 (Prototype Retrieval Stream)</text>

      <rect x="10" y="150" width="1152" height="144" rx="16" fill="#EFF6FF" stroke="#BFDBFE" stroke-width="1.8"/>
      <text x="28" y="170" fill="#1D4ED8" font-size="13" font-weight="900">解码下路 · 未来多模态条件解码支路 (ConditionDecoder Stream)</text>

      <g class="svg-clickable-group" data-jump-slide="6">
        <rect x="28" y="36" width="204" height="92" rx="12" fill="#FFFFFF" stroke="#7C3AED" stroke-width="2"/>
        <rect x="44" y="50" width="18" height="18" rx="3" fill="#7C3AED"/>
        <rect x="44" y="74" width="18" height="18" rx="3" fill="#8B5CF6"/>
        <circle cx="80" cy="71" r="11" fill="#F5F3FF" stroke="#7C3AED" stroke-width="1.5"/>
        <text x="80" y="76" text-anchor="middle" fill="#5B21B6" font-size="14" font-weight="900">⊕</text>
        <rect x="98" y="50" width="18" height="18" rx="3" fill="#059669"/>
        <rect x="98" y="74" width="18" height="18" rx="3" fill="#10B981"/>
        <text x="172" y="64" text-anchor="middle" fill="#4C1D95" font-size="13" font-weight="900">视觉 + 文本质心</text>
        ${svgTex(120, 74, 106, 28, '[\\tilde{X}^{\\text{image}}; \\tilde{X}^{\\text{text}}]', '#6D28D9', '11.5px')}

        <line x1="232" y1="82" x2="268" y2="82" stroke="#7C3AED" stroke-width="3"/>
        <polygon points="266,76 278,82 266,88" fill="#7C3AED"/>

        <rect x="280" y="42" width="196" height="80" rx="12" fill="#EDE9FE" stroke="#7C3AED" stroke-width="2"/>
        <text x="378" y="72" text-anchor="middle" fill="#5B21B6" font-size="14" font-weight="900">PrototypeRetriever</text>
        <text x="378" y="94" text-anchor="middle" fill="#6D28D9" font-size="12" font-weight="800">余弦相似度软注意力打分</text>
        <text x="378" y="111" text-anchor="middle" fill="#7C3AED" font-size="11" font-weight="700">计算各基元波形匹配权重</text>

        <line x1="476" y1="82" x2="512" y2="82" stroke="#7C3AED" stroke-width="3"/>
        <polygon points="510,76 522,82 510,88" fill="#7C3AED"/>

        <rect x="524" y="34" width="386" height="96" rx="14" fill="#FFFFFF" stroke="#7C3AED" stroke-width="2.5"/>
        <text x="717" y="54" text-anchor="middle" fill="#4C1D95" font-size="13.5" font-weight="900">Prototype Bank (先验原型库：周期基 + 趋势基)</text>
        <rect x="540" y="64" width="80" height="54" rx="6" fill="#F5F3FF" stroke="#C4B5FD"/>
        <path d="M 548 90 Q 564 68, 580 90 T 612 90" stroke="#7C3AED" stroke-width="2.5" fill="none"/>
        <text x="580" y="112" text-anchor="middle" fill="#5B21B6" font-size="10" font-weight="800">低频正弦</text>
        <rect x="630" y="64" width="80" height="54" rx="6" fill="#F5F3FF" stroke="#C4B5FD"/>
        <path d="M 636 90 Q 644 70, 652 90 T 668 90 T 684 90 T 702 90" stroke="#2563EB" stroke-width="2" fill="none"/>
        <text x="670" y="112" text-anchor="middle" fill="#1D4ED8" font-size="10" font-weight="800">高频余弦</text>
        <rect x="720" y="64" width="80" height="54" rx="6" fill="#FFF1F2" stroke="#FECDD3"/>
        <path d="M 728 100 Q 760 88, 792 70" stroke="#E11D48" stroke-width="2.5" fill="none"/>
        <text x="760" y="112" text-anchor="middle" fill="#BE123C" font-size="10" font-weight="800">上升趋势</text>
        <rect x="810" y="64" width="84" height="54" rx="6" fill="#ECFDF5" stroke="#A7F3D0"/>
        <path d="M 818 72 L 840 94 L 862 76 L 886 96" stroke="#059669" stroke-width="2.5" fill="none"/>
        <text x="852" y="112" text-anchor="middle" fill="#047857" font-size="10" font-weight="800">复合包络</text>

        <line x1="910" y1="82" x2="946" y2="82" stroke="#7C3AED" stroke-width="3"/>
        <polygon points="944,76 956,82 944,88" fill="#7C3AED"/>

        <rect x="958" y="36" width="190" height="92" rx="12" fill="#FFFFFF" stroke="#7C3AED" stroke-width="2.5"/>
        <path d="M 972 72 Q 996 48, 1020 72 T 1068 58" stroke="#7C3AED" stroke-width="3" fill="none"/>
        ${svgTex(966, 86, 174, 30, '\\tilde{\\mathcal{P}} \\in \\mathbb{R}^{N_p \\times D}', '#4C1D95', '12px', '先验原型 ', '')}

        <!-- ==================== LOWER DECODER STREAM: CONDITION DECODER ==================== -->
        <rect x="28" y="180" width="204" height="100" rx="12" fill="#FFFFFF" stroke="#2563EB" stroke-width="2"/>
        <rect x="44" y="198" width="20" height="16" rx="3" fill="#2563EB"/>
        <rect x="44" y="220" width="20" height="16" rx="3" fill="#3B82F6"/>
        <rect x="44" y="242" width="20" height="16" rx="3" fill="#60A5FA"/>
        <text x="142" y="208" text-anchor="middle" fill="#1E40AF" font-size="13" font-weight="900">编码融合表征</text>
        ${svgTex(82, 216, 120, 28, 'X^{\\text{fuse}} \\in \\mathbb{R}^{N \\times D}', '#2563EB', '12px')}
        <text x="142" y="260" text-anchor="middle" fill="#64748B" font-size="11" font-weight="700">构造未来查询初值</text>

        <line x1="232" y1="230" x2="268" y2="230" stroke="#2563EB" stroke-width="3"/>
        <polygon points="266,224 278,230 266,236" fill="#2563EB"/>

        <rect x="280" y="180" width="300" height="100" rx="14" fill="#FFFFFF" stroke="#3B82F6" stroke-width="2.2"/>
        <text x="430" y="200" text-anchor="middle" fill="#1E40AF" font-size="13.5" font-weight="900">Causal-Transformer</text>
        <rect x="294" y="210" width="84" height="56" rx="8" fill="#DBEAFE" stroke="#2563EB" stroke-width="1.5"/>
        <text x="336" y="235" text-anchor="middle" fill="#1E40AF" font-size="12" font-weight="900">Mask MSA</text>
        <text x="336" y="253" text-anchor="middle" fill="#2563EB" font-size="10.5" font-weight="700">因果自注意力</text>
        <line x1="378" y1="238" x2="392" y2="238" stroke="#2563EB" stroke-width="2"/>
        <rect x="392" y="210" width="80" height="56" rx="8" fill="#EFF6FF" stroke="#3B82F6" stroke-width="1.5"/>
        <text x="432" y="235" text-anchor="middle" fill="#1E40AF" font-size="11.5" font-weight="800">Add&amp;Norm</text>
        <text x="432" y="253" text-anchor="middle" fill="#2563EB" font-size="10.5" font-weight="700">+ FFN</text>
        <line x1="472" y1="238" x2="486" y2="238" stroke="#2563EB" stroke-width="2"/>
        <rect x="486" y="210" width="80" height="56" rx="8" fill="#2563EB"/>
        ${svgTex(488, 214, 76, 24, '\\times L', '#FFFFFF', '11.5px', '', ' 层')}
        <text x="526" y="254" text-anchor="middle" fill="#DBEAFE" font-size="10.5" font-weight="700">时序递推</text>

        <line x1="580" y1="230" x2="616" y2="230" stroke="#2563EB" stroke-width="3"/>
        <polygon points="614,224 626,230 614,236" fill="#2563EB"/>

        <rect x="628" y="180" width="300" height="100" rx="14" fill="#FFFFFF" stroke="#2563EB" stroke-width="2.2"/>
        <text x="778" y="200" text-anchor="middle" fill="#1E40AF" font-size="13.5" font-weight="900">Cross-Transformer (含 RoPE)</text>
        <rect x="642" y="210" width="96" height="56" rx="8" fill="#FFF1F2" stroke="#E11D48" stroke-width="1.5"/>
        <text x="690" y="235" text-anchor="middle" fill="#BE123C" font-size="12" font-weight="900">RoPE + MCA</text>
        <text x="690" y="253" text-anchor="middle" fill="#E11D48" font-size="10.5" font-weight="700">跨模态上下文对齐</text>
        <line x1="738" y1="238" x2="752" y2="238" stroke="#2563EB" stroke-width="2"/>
        <rect x="752" y="210" width="76" height="56" rx="8" fill="#EFF6FF" stroke="#3B82F6" stroke-width="1.5"/>
        <text x="790" y="235" text-anchor="middle" fill="#1E40AF" font-size="11.5" font-weight="800">Add&amp;Norm</text>
        <text x="790" y="253" text-anchor="middle" fill="#2563EB" font-size="10.5" font-weight="700">+ FFN</text>
        <line x1="828" y1="238" x2="842" y2="238" stroke="#2563EB" stroke-width="2"/>
        <rect x="842" y="210" width="72" height="56" rx="8" fill="#1D4ED8"/>
        ${svgTex(844, 214, 68, 24, '\\times L', '#FFFFFF', '11.5px', '', ' 层')}
        <text x="878" y="254" text-anchor="middle" fill="#DBEAFE" font-size="10.5" font-weight="700">交叉解码</text>

        <line x1="928" y1="230" x2="950" y2="230" stroke="#2563EB" stroke-width="3"/>
        <polygon points="948,224 960,230 948,236" fill="#2563EB"/>

        <rect x="958" y="180" width="190" height="100" rx="12" fill="#FFFFFF" stroke="#2563EB" stroke-width="2.5"/>
        <rect x="972" y="196" width="22" height="20" rx="4" fill="#DBEAFE" stroke="#2563EB"/><text x="983" y="210" text-anchor="middle" fill="#1E40AF" font-size="11" font-weight="800">1</text>
        <rect x="972" y="222" width="22" height="20" rx="4" fill="#DBEAFE" stroke="#2563EB"/><text x="983" y="236" text-anchor="middle" fill="#1E40AF" font-size="11" font-weight="800">2</text>
        <rect x="972" y="248" width="22" height="20" rx="4" fill="#2563EB"/><text x="983" y="262" text-anchor="middle" fill="#FFFFFF" font-size="11" font-weight="800">n</text>
        <text x="1070" y="214" text-anchor="middle" fill="#1E40AF" font-size="13" font-weight="900">未来引导条件</text>
        ${svgTex(1000, 224, 140, 32, 'X^{\\text{cond}} \\in \\mathbb{R}^{N_p \\times D}', '#2563EB', '12px')}

        <!-- ==================== RIGHT HUB: PROTOTYPE-GUIDED FLOW MATCHING ==================== -->
        <rect x="1190" y="6" width="540" height="288" rx="18" fill="#FFF1F2" stroke="#FDA4AF" stroke-width="2"/>
        <text x="1460" y="28" text-anchor="middle" fill="#BE123C" font-size="13.5" font-weight="900">原型引导流匹配生成 (Prototype-Guided Flow Matching)</text>

        <rect x="1208" y="42" width="112" height="48" rx="8" fill="#FFFFFF" stroke="#E11D48" stroke-width="1.8"/>
        <text x="1264" y="60" text-anchor="middle" fill="#BE123C" font-size="12" font-weight="900">Time &amp; Noise</text>
        ${svgTex(1212, 63, 104, 24, '\\tau, \\epsilon \\sim \\mathcal{N}(0, I)', '#E11D48', '11px')}
        <line x1="1320" y1="66" x2="1342" y2="66" stroke="#E11D48" stroke-width="2.5"/>
        <polygon points="1340,61 1350,66 1340,71" fill="#E11D48"/>

        <path d="M 1148 82 L 1174 82 L 1174 154 L 1342 154" stroke="#7C3AED" stroke-width="3.5" fill="none"/>
        <polygon points="1340,148 1350,154 1340,160" fill="#7C3AED"/>
        ${svgTex(1204, 122, 132, 26, '\\tilde{\\mathcal{P}}', '#5B21B6', '12px', '先验原型 ', '')}

        <line x1="1148" y1="230" x2="1342" y2="230" stroke="#2563EB" stroke-width="3.5"/>
        <polygon points="1340,224 1350,230 1340,236" fill="#2563EB"/>
        ${svgTex(1204, 198, 132, 26, 'X^{\\text{cond}}', '#1E40AF', '12px', '引导条件 ', '')}

        <rect x="1352" y="40" width="120" height="236" rx="14" fill="#E11D48"/>
        <text x="1412" y="138" text-anchor="middle" fill="#FFFFFF" font-size="14.5" font-weight="900">Flow-Matching</text>
        <text x="1412" y="160" text-anchor="middle" fill="#FFFFFF" font-size="14.5" font-weight="900">Net (AdaLN)</text>
        <text x="1412" y="186" text-anchor="middle" fill="#FFE4E6" font-size="11.5" font-weight="700">预测最优传输速度场</text>

        <line x1="1472" y1="158" x2="1516" y2="158" stroke="#059669" stroke-width="4"/>
        <polygon points="1514,151 1526,158 1514,165" fill="#059669"/>
        ${svgTex(1472, 126, 48, 26, 'v_\\theta', '#065F46', '12.5px')}

        <rect x="1528" y="40" width="188" height="236" rx="14" fill="#FFFFFF" stroke="#059669" stroke-width="2.5"/>
        <text x="1622" y="62" text-anchor="middle" fill="#065F46" font-size="13" font-weight="900">欧拉 ODE 积分演化</text>
        <rect x="1544" y="72" width="156" height="38" rx="6" fill="#F5F3FF" stroke="#C4B5FD"/>
        <path d="M 1552 94 Q 1578 76, 1604 94 T 1648 84" stroke="#7C3AED" stroke-width="2.2" fill="none"/>
        ${svgTex(1650, 78, 46, 26, '\\tau=0', '#5B21B6', '11px')}
        <line x1="1622" y1="112" x2="1622" y2="128" stroke="#059669" stroke-width="2.5"/>
        <rect x="1544" y="130" width="156" height="92" rx="8" fill="#ECFDF5" stroke="#10B981" stroke-width="1.8"/>
        <path d="M 1554 190 Q 1585 164, 1620 170 Q 1655 138, 1688 134 L 1688 200 Q 1655 186, 1620 180 Q 1585 178, 1554 190 Z" fill="#A7F3D0" fill-opacity="0.6"/>
        <path d="M 1554 190 Q 1585 172, 1620 175 T 1688 160" stroke="#059669" stroke-width="3" fill="none"/>
        ${svgTex(1548, 194, 148, 26, '\\tau=1 \\implies \\hat{Y}', '#047857', '11.5px')}
        <rect x="1544" y="232" width="156" height="32" rx="8" fill="#ECFEFF" stroke="#0891B2" stroke-width="1.5"/>
        <text x="1622" y="252" text-anchor="middle" fill="#0E7490" font-size="11.5" font-weight="800">RevIN 逆归一化还原量纲</text>
      </g>
    </svg>`,

    /* ========================================================================
     * 3. SLIDE 3 VISUALS: 1D TEMPORAL STREAM (5 STEPS, TIGHTENED VIEWBOX)
     * ======================================================================== */
    "stream1d.revin": `<svg viewBox="6 5.8 268 410.7" fill="none">
      <rect x="10" y="11.4" width="260" height="148.3" rx="14" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      <text x="140" y="42.8" text-anchor="middle" fill="#475569" font-size="14" font-weight="800">原始序列 (各传感器量纲各异)</text>
      <path d="M 24 125.5 C 56 71.3, 86 142.6, 118 99.8 C 148 62.8, 178 139.7, 210 88.4 C 230 65.5, 244 111.2, 256 82.7" stroke="#64748B" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <line x1="140" y1="165.4" x2="140" y2="248.2" stroke="#0891B2" stroke-width="3.5"/>
      <polygon points="132,242.4 140,262.4 148,242.4" fill="#0891B2"/>
      <rect x="34" y="185.4" width="212" height="42.8" rx="15" fill="#ECFEFF" stroke="#0891B2" stroke-width="1.8"/>
      ${svgTex(40, 188.3, 200, 37, '(\\mu, \\sigma)', '#0E7490', '13px', '减去均值 · 除以标准差 ', '')}
      <rect x="10" y="265.2" width="260" height="145.5" rx="14" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2"/>
      <text x="140" y="296.6" text-anchor="middle" fill="#1D4ED8" font-size="14" font-weight="800">标准化序列 (零均值单位方差)</text>
      <line x1="22" y1="359.4" x2="258" y2="359.4" stroke="#93C5FD" stroke-width="2" stroke-dasharray="5 4"/>
      <path d="M 24 382.1 C 56 325.1, 86 396.4, 118 356.5 C 148 319.5, 178 393.5, 210 345.1 C 230 322.2, 244 367.9, 256 336.5" stroke="#2563EB" stroke-width="4" fill="none" stroke-linecap="round"/>
    </svg>`,

    "stream1d.leftPad": `<svg viewBox="6 5.8 268 410.7" fill="none">
      ${svgTex(20, 8.5, 240, 37, 'T', '#475569', '14px', '补齐前原始序列 (长度 ', ')')}
      <rect x="76" y="54.2" width="192" height="74.2" rx="10" fill="#DBEAFE" stroke="#2563EB" stroke-width="2"/>
      <text x="172" y="99.8" text-anchor="middle" fill="#1E40AF" font-size="14.5" font-weight="800">有效历史观测点</text>
      <rect x="12" y="54.2" width="60" height="74.2" rx="10" fill="#FFF1F2" stroke="#E11D48" stroke-width="2" stroke-dasharray="4 4"/>
      <text x="42" y="99.8" text-anchor="middle" fill="#BE123C" font-size="13.5" font-weight="800">余数缺口</text>
      <line x1="140" y1="139.7" x2="140" y2="239.5" stroke="#2563EB" stroke-width="3.5"/>
      <polygon points="132,233.9 140,253.8 148,233.9" fill="#2563EB"/>
      <rect x="38" y="168.2" width="204" height="45.7" rx="16" fill="#EFF6FF" stroke="#3B82F6" stroke-width="1.5"/>
      <text x="140" y="198.3" text-anchor="middle" fill="#1D4ED8" font-size="13.5" font-weight="800">首部填充零值使总长整除块长</text>
      <text x="140" y="288.1" text-anchor="middle" fill="#0F172A" font-size="14.5" font-weight="800">补齐后完整等分序列</text>
      <rect x="12" y="305.2" width="60" height="79.8" rx="10" fill="#FFE4E6" stroke="#E11D48" stroke-width="2.5"/>
      <text x="42" y="353.6" text-anchor="middle" fill="#BE123C" font-size="14" font-weight="900">左补零</text>
      <rect x="76" y="305.2" width="192" height="79.8" rx="10" fill="#2563EB"/>
      <text x="172" y="353.6" text-anchor="middle" fill="#FFFFFF" font-size="14.5" font-weight="800">原始时序保持不变</text>
      <path d="M 12 396.4 L 12 410.7 L 268 410.7 L 268 396.4" stroke="#2563EB" stroke-width="2.5" fill="none"/>
    </svg>`,

    "stream1d.patching": `<svg viewBox="6 5.8 268 410.7" fill="none">
      <text x="140" y="34.3" text-anchor="middle" fill="#1E40AF" font-size="14.5" font-weight="800">按固定窗口切分为连续局部块</text>
      <g transform="translate(16, 54.2)">
        <rect x="0" y="0" width="248" height="71.3" rx="10" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2"/>
        <rect x="0" y="0" width="56" height="71.3" rx="10" fill="#FFE4E6" stroke="#E11D48" stroke-width="1.8"/>
        <text x="28" y="42.8" text-anchor="middle" fill="#BE123C" font-size="12.5" font-weight="800">左补零</text>
        <path d="M 68 48.5 Q 100 20, 140 42.8 T 192 25.6" stroke="#2563EB" stroke-width="3" fill="none"/>
        <text x="218" y="42.8" text-anchor="middle" fill="#1D4ED8" font-size="13" font-weight="800">第 1 块</text>
        <rect x="0" y="88.4" width="248" height="71.3" rx="10" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2"/>
        <path d="M 18 131.2 Q 68 94.1, 126 134.1 T 192 105.6" stroke="#2563EB" stroke-width="3" fill="none"/>
        <text x="218" y="131.2" text-anchor="middle" fill="#1D4ED8" font-size="13" font-weight="800">第 2 块</text>
        <circle cx="124" cy="182.5" r="4" fill="#64748B"/>
        <circle cx="124" cy="205.4" r="4" fill="#64748B"/>
        <rect x="0" y="225.3" width="248" height="71.3" rx="10" fill="#DBEAFE" stroke="#2563EB" stroke-width="2.5"/>
        <path d="M 18 268.1 Q 78 231, 140 265.2 T 192 242.4" stroke="#1D4ED8" stroke-width="3.5" fill="none"/>
        ${svgTex(190, 242.4, 56, 37, 'N', '#1E3A8A', '13px', '第 ', ' 块')}
      </g>
      <rect x="22" y="365" width="236" height="45.7" rx="10" fill="#EFF6FF" stroke="#93C5FD" stroke-width="1.5"/>
      <text x="140" y="395" text-anchor="middle" fill="#1E3A8A" font-size="13.5" font-weight="800">行构成块序列 · 列保留局部波形</text>
    </svg>`,

    "stream1d.resample": `<svg viewBox="6 5.8 268 410.7" fill="none">
      <g transform="translate(14, 20)">
        <rect x="0" y="0" width="98" height="185.4" rx="12" fill="#FFFFFF" stroke="#64748B" stroke-width="2"/>
        <text x="49" y="37" text-anchor="middle" fill="#334155" font-size="13.5" font-weight="800">预训练权重</text>
        <rect x="14" y="57" width="70" height="20" rx="3" fill="#94A3B8"/>
        <rect x="14" y="88.4" width="70" height="20" rx="3" fill="#CBD5E1"/>
        <rect x="14" y="119.8" width="70" height="20" rx="3" fill="#94A3B8"/>
        ${svgTex(6, 145.5, 86, 34.3, 'W_0 \\in \\mathbb{R}^{P_0 \\times D}', '#475569', '11.5px')}
      </g>
      <path d="M 118 114.1 L 154 114.1" stroke="#2563EB" stroke-width="3.5"/>
      <polygon points="150,104.1 162,114.1 150,124.1" fill="#2563EB"/>
      <g transform="translate(166, 11.4)">
        <rect x="0" y="0" width="100" height="202.5" rx="12" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.5"/>
        <text x="50" y="37" text-anchor="middle" fill="#1D4ED8" font-size="13.5" font-weight="800">重采样权重</text>
        <rect x="14" y="54.2" width="72" height="15.6" rx="2" fill="#2563EB"/>
        <rect x="14" y="77" width="72" height="15.6" rx="2" fill="#3B82F6"/>
        <rect x="14" y="99.8" width="72" height="15.6" rx="2" fill="#60A5FA"/>
        <rect x="14" y="122.6" width="72" height="15.6" rx="2" fill="#3B82F6"/>
        <rect x="14" y="145.5" width="72" height="15.6" rx="2" fill="#2563EB"/>
        ${svgTex(4, 164, 92, 34.3, 'W_{\\text{time}} \\in \\mathbb{R}^{P \\times D}', '#1E40AF', '11.5px')}
      </g>
      <rect x="14" y="236.7" width="252" height="171.1" rx="14" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.8"/>
      <text x="140" y="276.7" text-anchor="middle" fill="#1D4ED8" font-size="14" font-weight="800">沿块长维度连续线性插值</text>
      <line x1="38" y1="336.5" x2="242" y2="336.5" stroke="#94A3B8" stroke-width="3.5"/>
      <circle cx="75" cy="336.5" r="8" fill="#334155"/><text x="75" y="382.1" text-anchor="middle" fill="#334155" font-size="13" font-weight="800">左邻格点</text>
      <circle cx="145" cy="336.5" r="10" fill="#2563EB"/><text x="145" y="308" text-anchor="middle" fill="#2563EB" font-size="13.5" font-weight="800">插值采样点</text>
      <circle cx="205" cy="336.5" r="8" fill="#334155"/><text x="205" y="382.1" text-anchor="middle" fill="#334155" font-size="13" font-weight="800">右邻格点</text>
    </svg>`,

    "stream1d.embedding": `<svg viewBox="6 5.8 268 410.7" fill="none">
      <g transform="translate(14, 34.3)">
        <rect x="0" y="8.5" width="72" height="191.1" rx="10" fill="#DBEAFE" stroke="#2563EB" stroke-width="2"/>
        <line x1="0" y1="54.2" x2="72" y2="54.2" stroke="#93C5FD"/><line x1="0" y1="102.7" x2="72" y2="102.7" stroke="#93C5FD"/><line x1="0" y1="151.1" x2="72" y2="151.1" stroke="#93C5FD"/>
        <text x="36" y="233.9" text-anchor="middle" fill="#1E40AF" font-size="13.5" font-weight="800">时序块矩阵</text>
        ${svgTex(72, 88.4, 26, 39.9, '\\times', '#0F172A', '16px')}
        <rect x="98" y="37" width="58" height="134.1" rx="10" fill="#E0E7FF" stroke="#4F46E5" stroke-width="2"/>
        <line x1="127" y1="37" x2="127" y2="171.1" stroke="#A5B4FC"/>
        <text x="127" y="233.9" text-anchor="middle" fill="#3730A3" font-size="13.5" font-weight="800">嵌入权重</text>
        ${svgTex(156, 88.4, 26, 39.9, '=', '#0F172A', '16px')}
        <rect x="182" y="8.5" width="72" height="191.1" rx="12" fill="#2563EB"/>
        <line x1="182" y1="54.2" x2="254" y2="54.2" stroke="#60A5FA"/><line x1="182" y1="102.7" x2="254" y2="102.7" stroke="#60A5FA"/><line x1="182" y1="151.1" x2="254" y2="151.1" stroke="#60A5FA"/>
        <text x="218" y="233.9" text-anchor="middle" fill="#1D4ED8" font-size="13.5" font-weight="800">时序特征块</text>
      </g>
      <rect x="14" y="293.7" width="252" height="114.1" rx="14" fill="#ECFEFF" stroke="#0891B2" stroke-width="2"/>
      ${svgTex(20, 305.2, 240, 42.8, 'X^{\\text{time}} \\in \\mathbb{R}^{N \\times D}', '#0E7490', '14px', '输出特征 ', '')}
      <text x="140" y="382.1" text-anchor="middle" fill="#155E75" font-size="13" font-weight="700">送入中路引导自注意力模块</text>
    </svg>`,

    /* ========================================================================
     * 4. SLIDE 4 VISUALS: 2D ENDOGENOUS IMAGE STREAM (7 STEPS)
     * ======================================================================== */
    "stream2d.dft": `<svg viewBox="6 6.3 198 453.9" fill="none">
      <text x="105" y="31.1" text-anchor="middle" fill="#5B21B6" font-size="13.5" font-weight="800">一维时间序列网格</text>
      <g transform="translate(14, 43.5)">
        <rect x="0" y="0" width="182" height="43.5" rx="5" fill="#F5F3FF" stroke="#7C3AED" stroke-width="2"/>
        <line x1="30" y1="0" x2="30" y2="43.5" stroke="#7C3AED"/><line x1="60" y1="0" x2="60" y2="43.5" stroke="#7C3AED"/>
        <line x1="91" y1="0" x2="91" y2="43.5" stroke="#7C3AED"/><line x1="121" y1="0" x2="121" y2="43.5" stroke="#7C3AED"/>
        <line x1="151" y1="0" x2="151" y2="43.5" stroke="#7C3AED"/>
      </g>
      <path d="M 105 93.3 L 105 133.6" stroke="#7C3AED" stroke-width="2.5"/>
      <polygon points="99,130.6 105,146.2 111,130.6" fill="#7C3AED"/>
      <rect x="10" y="149.2" width="190" height="164.7" rx="12" fill="#FFFFFF" stroke="#C4B5FD" stroke-width="2"/>
      <line x1="22" y1="279.8" x2="188" y2="279.8" stroke="#94A3B8" stroke-width="2"/>
      <rect x="34" y="255" width="16" height="24.8" rx="2" fill="#CBD5E1"/>
      <rect x="64" y="217.6" width="16" height="62.2" rx="2" fill="#A78BFA"/>
      <rect x="96" y="174.1" width="22" height="105.7" rx="3" fill="#E11D48"/>
      <circle cx="107" cy="163.2" r="4.5" fill="#F59E0B"/>
      <text x="154" y="217.6" text-anchor="middle" fill="#BE123C" font-size="13" font-weight="800">幅值最大</text>
      <text x="154" y="248.7" text-anchor="middle" fill="#E11D48" font-size="13" font-weight="800">非零主频</text>
      <path d="M 105 320.2 L 105 357.5" stroke="#7C3AED" stroke-width="2.5"/>
      <polygon points="99,354.4 105,369.9 111,354.4" fill="#7C3AED"/>
      <rect x="12" y="373.1" width="186" height="80.9" rx="12" fill="#EDE9FE" stroke="#7C3AED" stroke-width="2"/>
      ${svgTex(18, 391.7, 174, 43.5, 'P', '#4C1D95', '13px', '主频倒数取整得周期 ', '')}
    </svg>`,

    "stream2d.periodFold": `<svg viewBox="6 6.3 198 453.9" fill="none">
      <text x="105" y="31.1" text-anchor="middle" fill="#5B21B6" font-size="13.5" font-weight="800">左补零 + 按单周期换行</text>
      <g transform="translate(18, 52.9)">
        <path d="M 14 0 L 0 0 L 0 264.2 L 14 264.2" stroke="#0F172A" stroke-width="3.5" fill="none"/>
        <path d="M 160 0 L 174 0 L 174 264.2 L 160 264.2" stroke="#0F172A" stroke-width="3.5" fill="none"/>
        <rect x="14" y="18.7" width="46" height="43.5" rx="4" fill="#FFE4E6" stroke="#E11D48" stroke-width="1.8"/>
        <text x="37" y="46.6" text-anchor="middle" fill="#BE123C" font-size="11.5" font-weight="800">左补零</text>
        <rect x="64" y="18.7" width="96" height="43.5" rx="4" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1.8"/>
        <path d="M 70 43.5 Q 92 24.8, 114 40.4 T 152 31.1" stroke="#6D28D9" stroke-width="2.2" fill="none"/>
        <rect x="14" y="77.7" width="146" height="43.5" rx="4" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1.8"/>
        <path d="M 20 102.5 Q 55 80.9, 85 99.5 T 152 90.1" stroke="#6D28D9" stroke-width="2.2" fill="none"/>
        <rect x="14" y="136.8" width="146" height="43.5" rx="4" fill="#F5F3FF" stroke="#8B5CF6" stroke-width="1.8"/>
        <path d="M 20 161.7 Q 55 139.9, 85 158.6 T 152 149.2" stroke="#7C3AED" stroke-width="2.2" fill="none"/>
        <rect x="14" y="195.8" width="146" height="43.5" rx="4" fill="#DDD6FE" stroke="#6D28D9" stroke-width="1.8"/>
        <path d="M 20 220.7 Q 55 198.9, 85 217.6 T 152 208.3" stroke="#5B21B6" stroke-width="2.2" fill="none"/>
      </g>
      <rect x="10" y="338.8" width="190" height="115.1" rx="12" fill="#FFFFFF" stroke="#C4B5FD" stroke-width="1.8"/>
      <text x="105" y="382.3" text-anchor="middle" fill="#1D4ED8" font-size="12.5" font-weight="800">横轴：单周期内相位演化</text>
      <text x="105" y="426" text-anchor="middle" fill="#6D28D9" font-size="12.5" font-weight="800">纵轴：跨周期同相位对齐</text>
    </svg>`,

    "stream2d.resize": `<svg viewBox="6 6.3 198 453.9" fill="none">
      <text x="105" y="31.1" text-anchor="middle" fill="#5B21B6" font-size="13.5" font-weight="800">双线性插值统一分辨率</text>
      <g transform="translate(14, 52.9)">
        <path d="M 14 0 L 0 0 L 0 264.2 L 14 264.2" stroke="#0F172A" stroke-width="3.5" fill="none"/>
        <path d="M 168 0 L 182 0 L 182 264.2 L 168 264.2" stroke="#0F172A" stroke-width="3.5" fill="none"/>
        <rect x="18" y="18.7" width="146" height="226.9" rx="10" fill="url(#lightHeat2D)" stroke="#7C3AED" stroke-width="2"/>
        <line x1="54" y1="18.7" x2="54" y2="245.6" stroke="rgba(255,255,255,0.45)"/>
        <line x1="91" y1="18.7" x2="91" y2="245.6" stroke="rgba(255,255,255,0.45)"/>
        <line x1="127" y1="18.7" x2="127" y2="245.6" stroke="rgba(255,255,255,0.45)"/>
        <line x1="18" y1="74.6" x2="164" y2="74.6" stroke="rgba(255,255,255,0.45)"/>
        <line x1="18" y1="132.1" x2="164" y2="132.1" stroke="rgba(255,255,255,0.45)"/>
        <line x1="18" y1="188" x2="164" y2="188" stroke="rgba(255,255,255,0.45)"/>
        <rect x="38" y="107.3" width="106" height="49.8" rx="8" fill="rgba(15,23,42,0.82)"/>
        <text x="91" y="139.9" text-anchor="middle" fill="#FFFFFF" font-size="13.5" font-weight="900">标准正方形网格</text>
      </g>
      <defs>
        <linearGradient id="lightHeat2D" x1="0" y1="0" x2="1" y2="1.5">
          <stop offset="0%" stop-color="#3B82F6"/>
          <stop offset="50%" stop-color="#8B5CF6"/>
          <stop offset="100%" stop-color="#EC4899"/>
        </linearGradient>
      </defs>
      <rect x="10" y="338.8" width="190" height="115.1" rx="12" fill="#FFFFFF" stroke="#C4B5FD" stroke-width="1.8"/>
      ${svgTex(16, 354.4, 178, 40.4, 'H \\times W', '#4C1D95', '12.5px', '统一放缩为 ', '')}
      <text x="105" y="426" text-anchor="middle" fill="#1D4ED8" font-size="12" font-weight="800">适配视觉主干标准输入</text>
    </svg>`,

    "stream2d.repeat": `<svg viewBox="6 6.3 198 453.9" fill="none">
      <text x="105" y="31.1" text-anchor="middle" fill="#5B21B6" font-size="13.5" font-weight="800">沿通道维复制叠加三层</text>
      <g transform="translate(14, 59)">
        <rect x="48" y="0" width="110" height="171" rx="10" fill="#DDD6FE" stroke="#7C3AED" stroke-width="2"/>
        <rect x="26" y="37.4" width="110" height="171" rx="10" fill="#C4B5FD" stroke="#6D28D9" stroke-width="2"/>
        <rect x="4" y="74.6" width="110" height="171" rx="10" fill="url(#lightHeat2D)" stroke="#4C1D95" stroke-width="2.5"/>
        <text x="59" y="152.3" text-anchor="middle" fill="#FFFFFF" font-size="14" font-weight="900">三通道伪图</text>
        <text x="59" y="186.5" text-anchor="middle" fill="#F3E8FF" font-size="12" font-weight="800">三通道数值一致</text>
        <circle cx="160" cy="155.4" r="22" fill="#FFF1F2" stroke="#E11D48" stroke-width="2"/>
        ${svgTex(138, 133.6, 44, 43.5, '\\times 3', '#E11D48', '14px')}
      </g>
      <rect x="10" y="338.8" width="190" height="115.1" rx="12" fill="#FFFFFF" stroke="#C4B5FD" stroke-width="1.8"/>
      <text x="105" y="382.3" text-anchor="middle" fill="#4C1D95" font-size="13" font-weight="800">三通道像素完全一致</text>
      <text x="105" y="426" text-anchor="middle" fill="#6D28D9" font-size="12" font-weight="800">对接预训练彩色图像接口</text>
    </svg>`,

    "stream2d.patchFlatten": `<svg viewBox="6 6.3 198 453.9" fill="none">
      <text x="105" y="31.1" text-anchor="middle" fill="#5B21B6" font-size="13.5" font-weight="800">网格切分并按行展平</text>
      <g transform="translate(12, 52.9)">
        <rect x="0" y="40.4" width="70" height="108.8" rx="8" fill="url(#lightHeat2D)" stroke="#4C1D95" stroke-width="2"/>
        <line x1="23" y1="40.4" x2="23" y2="149.2" stroke="#FFF" stroke-width="1.5"/>
        <line x1="46" y1="40.4" x2="46" y2="149.2" stroke="#FFF" stroke-width="1.5"/>
        <line x1="0" y1="76.2" x2="70" y2="76.2" stroke="#FFF" stroke-width="1.5"/>
        <line x1="0" y1="111.9" x2="70" y2="111.9" stroke="#FFF" stroke-width="1.5"/>
        <text x="35" y="183.4" text-anchor="middle" fill="#5B21B6" font-size="12" font-weight="800">规则网格切分</text>
        <path d="M 76 94.8 L 98 94.8" stroke="#7C3AED" stroke-width="2.5"/>
        <polygon points="96,87 104,94.8 96,102.5" fill="#7C3AED"/>
        <path d="M 116 0 L 108 0 L 108 261.1 L 116 261.1" stroke="#0F172A" stroke-width="3" fill="none"/>
        <path d="M 178 0 L 186 0 L 186 261.1 L 178 261.1" stroke="#0F172A" stroke-width="3" fill="none"/>
        <rect x="116" y="15.5" width="62" height="43.5" rx="5" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1.8"/><text x="147" y="43.5" text-anchor="middle" fill="#4C1D95" font-size="11.5" font-weight="800">块 1</text>
        <rect x="116" y="71.5" width="62" height="43.5" rx="5" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1.8"/><text x="147" y="99.5" text-anchor="middle" fill="#4C1D95" font-size="11.5" font-weight="800">块 2</text>
        <rect x="116" y="127.5" width="62" height="43.5" rx="5" fill="#DDD6FE" stroke="#6D28D9" stroke-width="1.8"/><text x="147" y="155.4" text-anchor="middle" fill="#4C1D95" font-size="11.5" font-weight="800">块 3</text>
        <circle cx="147" cy="186.5" r="2.5" fill="#6D28D9"/><circle cx="147" cy="198.9" r="2.5" fill="#6D28D9"/>
        <rect x="116" y="211.4" width="62" height="37.4" rx="5" fill="#7C3AED"/>
        ${svgTex(116, 211.4, 62, 37.4, 'N_v', '#FFFFFF', '11px', '块 ', '')}
      </g>
      <rect x="10" y="338.8" width="190" height="115.1" rx="12" fill="#FFF1F2" stroke="#FDA4AF" stroke-width="1.8"/>
      <text x="105" y="382.3" text-anchor="middle" fill="#BE123C" font-size="12.5" font-weight="800">每块含三通道局部像素</text>
      <text x="105" y="426" text-anchor="middle" fill="#9F1239" font-size="12" font-weight="700">展平堆叠为二维块矩阵</text>
    </svg>`,

    "stream2d.posEmbed": `<svg viewBox="6 6.3 198 453.9" fill="none">
      <text x="105" y="31.1" text-anchor="middle" fill="#5B21B6" font-size="13.5" font-weight="800">线性映射叠加位置编码</text>
      <rect x="12" y="59" width="108" height="84" rx="12" fill="#EDE9FE" stroke="#7C3AED" stroke-width="2"/>
      <text x="66" y="108.8" text-anchor="middle" fill="#4C1D95" font-size="14" font-weight="900">投影块特征</text>
      <rect x="132" y="43.5" width="66" height="71.5" rx="10" fill="#FFFBEB" stroke="#F59E0B" stroke-width="2"/>
      <text x="165" y="76.2" text-anchor="middle" fill="#B45309" font-size="13" font-weight="900">+ 位置</text>
      <text x="165" y="102.5" text-anchor="middle" fill="#D97706" font-size="11" font-weight="800">空间坐标</text>
      <path d="M 165 115.1 L 165 130.6 L 124 130.6" stroke="#D97706" stroke-width="2.5" fill="none"/>
      <polygon points="126,122.8 118,130.6 126,138.4" fill="#D97706"/>
      <path d="M 66 149.2 L 66 202.1" stroke="#7C3AED" stroke-width="3"/>
      <polygon points="60,198.9 66,214.5 72,198.9" fill="#7C3AED"/>
      <rect x="12" y="220.7" width="186" height="99.5" rx="14" fill="#7C3AED"/>
      <text x="105" y="265.8" text-anchor="middle" fill="#FFFFFF" font-size="14" font-weight="900">注入二维空间拓扑感知</text>
      <text x="105" y="300" text-anchor="middle" fill="#E9D5FF" font-size="11.5" font-weight="700">横轴相位 + 纵轴周期坐标</text>
      <path d="M 105 326.4 L 105 363.8" stroke="#7C3AED" stroke-width="3"/>
      <polygon points="99,360.6 105,376.2 111,360.6" fill="#7C3AED"/>
      <rect x="16" y="376.2" width="178" height="77.7" rx="12" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2"/>
      ${svgTex(20, 391.7, 170, 46.6, 'Z_v^{(0)} \\in \\mathbb{R}^{N_v \\times D}', '#1D4ED8', '12.5px')}
    </svg>`,

    "stream2d.vitEncode": `<svg viewBox="6 6.3 198 453.9" fill="none">
      <rect x="26" y="18.7" width="158" height="68.4" rx="10" fill="#EDE9FE" stroke="#7C3AED" stroke-width="2"/>
      <text x="105" y="60.7" text-anchor="middle" fill="#4C1D95" font-size="14" font-weight="900">输入视觉特征序列</text>
      <path d="M 105 93.3 L 105 139.9" stroke="#7C3AED" stroke-width="3"/>
      <polygon points="99,136.8 105,152.3 111,136.8" fill="#7C3AED"/>
      <rect x="14" y="155.4" width="182" height="149.2" rx="16" fill="#5B21B6"/>
      <text x="105" y="217.6" text-anchor="middle" fill="#FFFFFF" font-size="18.5" font-weight="900">VisionEncoder</text>
      <text x="105" y="258" text-anchor="middle" fill="#DDD6FE" font-size="12" font-weight="700">冻结 ViT · 全局周期纹理编码</text>
      <line x1="38" y1="279.8" x2="172" y2="279.8" stroke="#A78BFA" stroke-width="2" stroke-dasharray="4 3"/>
      <path d="M 105 310.9 L 105 360.6" stroke="#2563EB" stroke-width="3"/>
      <polygon points="99,357.5 105,373.1 111,357.5" fill="#2563EB"/>
      <rect x="14" y="373.1" width="182" height="80.9" rx="12" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.5"/>
      ${svgTex(18, 388.6, 174, 49.8, 'H^{\\text{vis}} \\in \\mathbb{R}^{N_v \\times D}', '#1E3A8A', '13px')}
    </svg>`,

    /* ========================================================================
     * 5. SLIDE 5 VISUALS: TEXT STREAM & DUAL-MODALITY TOKEN DISTILLATION
     * ======================================================================== */
    "distill.textTokenize": `<svg viewBox="12 8.1 316 370.2" fill="none">
      <rect x="24" y="16.3" width="292" height="138.3" rx="16" fill="#ECFDF5" stroke="#10B981" stroke-width="2"/>
      <rect x="44" y="38" width="92" height="27.1" rx="5" fill="#059669"/>
      <text x="90" y="57" text-anchor="middle" fill="#FFFFFF" font-size="11.5" font-weight="800">领域背景文本</text>
      <rect x="146" y="43.4" width="144" height="16.3" rx="4" fill="#A7F3D0"/>
      <rect x="44" y="78.6" width="246" height="16.3" rx="4" fill="#6EE7B7"/>
      <rect x="44" y="108.5" width="184" height="16.3" rx="4" fill="#A7F3D0"/>
      <path d="M 170 162.7 L 170 219.7" stroke="#059669" stroke-width="3.5"/>
      <polygon points="162,214.2 170,233.2 178,214.2" fill="#059669"/>
      <g transform="translate(18, 241.4)">
        <rect x="0" y="0" width="66" height="78.6" rx="10" fill="#059669"/>
        <text x="33" y="46.1" text-anchor="middle" fill="#FFFFFF" font-size="13.5" font-weight="900">起始符</text>
        <rect x="78" y="0" width="66" height="78.6" rx="10" fill="#D1FAE5" stroke="#059669" stroke-width="2"/>
        <text x="111" y="46.1" text-anchor="middle" fill="#065F46" font-size="13.5" font-weight="800">词元 1</text>
        <rect x="156" y="0" width="66" height="78.6" rx="10" fill="#D1FAE5" stroke="#059669" stroke-width="2"/>
        <text x="189" y="46.1" text-anchor="middle" fill="#065F46" font-size="13.5" font-weight="800">词元 2</text>
        <rect x="234" y="0" width="70" height="78.6" rx="10" fill="#ECFDF5" stroke="#10B981" stroke-width="2" stroke-dasharray="5 3"/>
        ${svgTex(236, 20.3, 66, 38, 'N_t', '#047857', '13px', '词元 ', '')}
      </g>
      <text x="170" y="363.4" text-anchor="middle" fill="#065F46" font-size="14" font-weight="800">词表嵌入 + 序列位置编码</text>
    </svg>`,

    "distill.pretrainedEncode": `<svg viewBox="12 8.1 316 370.2" fill="none">
      <g transform="translate(22, 16.3)">
        <rect x="0" y="0" width="136" height="92.2" rx="12" fill="#EDE9FE" stroke="#7C3AED" stroke-width="2"/>
        <text x="68" y="40.7" text-anchor="middle" fill="#5B21B6" font-size="14" font-weight="800">VisionEncoder</text>
        <rect x="18" y="57" width="100" height="16.3" rx="4" fill="#8B5CF6"/>
        <rect x="160" y="0" width="136" height="92.2" rx="12" fill="#D1FAE5" stroke="#059669" stroke-width="2"/>
        <text x="228" y="40.7" text-anchor="middle" fill="#065F46" font-size="14" font-weight="800">TextEncoder</text>
        <rect x="178" y="57" width="100" height="16.3" rx="4" fill="#10B981"/>
      </g>
      <polygon points="20,132.9 320,132.9 282,233.2 58,233.2" fill="#EFF6FF" stroke="#2563EB" stroke-width="2.5"/>
      <text x="170" y="176.3" text-anchor="middle" fill="#1E40AF" font-size="15" font-weight="900">双路冻结预训练编码与维度对齐</text>
      ${svgTex(40, 187.1, 260, 35.3, 'D', '#2563EB', '12.5px', '预训练隐层特征统一投影至主干维度 ', '')}
      <path d="M 170 241.4 L 170 279.3" stroke="#2563EB" stroke-width="3"/>
      <polygon points="163,273.9 170,290.2 177,273.9" fill="#2563EB"/>
      <g transform="translate(64, 295.6)">
        <rect x="0" y="0" width="96" height="75.9" rx="10" fill="#7C3AED"/>
        ${svgTex(4, 16.3, 88, 43.4, 'H^{\\text{vis}}', '#FFFFFF', '13.5px', '视觉 ', '')}
        <rect x="116" y="0" width="96" height="75.9" rx="10" fill="#059669"/>
        ${svgTex(120, 16.3, 88, 43.4, 'H^{\\text{text}}', '#FFFFFF', '13.5px', '文本 ', '')}
      </g>
    </svg>`,

    "distill.centroids": `<svg viewBox="12 8.1 316 370.2" fill="none">
      <rect x="18" y="16.3" width="132" height="352.6" rx="16" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="2"/>
      <text x="84" y="51.5" text-anchor="middle" fill="#475569" font-size="14" font-weight="800">冗长原始特征</text>
      ${Array.from({ length: 7 })
        .map((_, r) =>
          Array.from({ length: 4 })
            .map((__, c) => {
              const active = (r + c) % 3 === 0;
              return `<rect x="${34 + c * 26}" y="${73.2 + r * 35.3}" width="20" height="24.4" rx="4" fill="${
                active ? "#6EE7B7" : "#E2E8F0"
              }" stroke="${active ? "#059669" : "none"}"/>`;
            })
            .join("")
        )
        .join("")}
      <text x="84" y="347.1" text-anchor="middle" fill="#64748B" font-size="13" font-weight="800">含大量背景噪声</text>
      <path d="M 154 100.3 L 210 130.2 M 154 192.6 L 210 181.7 M 154 287.5 L 210 233.2" stroke="#059669" stroke-width="2.5" stroke-dasharray="5 4"/>
      <rect x="212" y="57" width="110" height="271.2" rx="16" fill="#ECFDF5" stroke="#059669" stroke-width="2.5"/>
      ${svgTex(218, 65.1, 98, 38, 'C_0 \\in \\mathbb{R}^{K \\times D}', '#065F46', '12.5px')}
      <circle cx="267" cy="141" r="15" fill="#059669"/>${svgTex(247, 122, 40, 38, 'c_1', '#FFFFFF', '12px')}
      <circle cx="267" cy="192.6" r="15" fill="#10B981"/>${svgTex(247, 173.6, 40, 38, 'c_2', '#FFFFFF', '12px')}
      <circle cx="267" cy="244.1" r="15" fill="#059669"/>${svgTex(247, 225.1, 40, 38, 'c_K', '#FFFFFF', '12px')}
      <text x="267" y="303.7" text-anchor="middle" fill="#047857" font-size="13" font-weight="800">可学习质心查询</text>
    </svg>`,

    "distill.funnel": `<svg viewBox="12 8.1 316 370.2" fill="none">
      <rect x="22" y="16.3" width="296" height="62.4" rx="10" fill="#EDE9FE" stroke="#7C3AED" stroke-width="2"/>
      <text x="170" y="55.6" text-anchor="middle" fill="#5B21B6" font-size="14" font-weight="800">输入冗长视觉 / 文本特征序列</text>
      <polygon points="24,89.5 316,89.5 266,235.9 74,235.9" fill="url(#funnelGrad)" stroke="#059669" stroke-width="2.5"/>
      <line x1="66" y1="89.5" x2="115" y2="235.9" stroke="rgba(255,255,255,0.45)" stroke-width="2"/>
      <line x1="170" y1="89.5" x2="170" y2="235.9" stroke="rgba(255,255,255,0.45)" stroke-width="2"/>
      <line x1="274" y1="89.5" x2="225" y2="235.9" stroke="rgba(255,255,255,0.45)" stroke-width="2"/>
      <text x="170" y="151.9" text-anchor="middle" fill="#FFFFFF" font-size="15.5" font-weight="900">VisionDistiller &amp; TextDistiller</text>
      <text x="170" y="189.8" text-anchor="middle" fill="#D1FAE5" font-size="13" font-weight="800">多头交叉注意力提纯核心质心</text>
      <defs>
        <linearGradient id="funnelGrad" x1="0" y1="0" x2="0" y2="1.4">
          <stop offset="0%" stop-color="#10B981"/>
          <stop offset="100%" stop-color="#047857"/>
        </linearGradient>
      </defs>
      <path d="M 170 244.1 L 170 282" stroke="#059669" stroke-width="3.5"/>
      <polygon points="162,276.6 170,295.6 178,276.6" fill="#059669"/>
      <g transform="translate(48, 298.3)">
        <rect x="0" y="0" width="112" height="73.2" rx="12" fill="#7C3AED"/>
        ${svgTex(6, 16.3, 100, 40.7, '\\tilde{X}^{\\text{image}}', '#FFFFFF', '13.5px', '视觉 ', '')}
        <rect x="132" y="0" width="112" height="73.2" rx="12" fill="#059669"/>
        ${svgTex(138, 16.3, 100, 40.7, '\\tilde{X}^{\\text{text}}', '#FFFFFF', '13.5px', '文本 ', '')}
      </g>
    </svg>`,

    /* ========================================================================
     * 6. SLIDE 6 VISUALS: MODALITY-GUIDED MSA & THREE-STREAM FUSER
     * ======================================================================== */
    "align.guiders": `<svg viewBox="12 8.1 316 370.2" fill="none">
      <rect x="14" y="13.6" width="312" height="168.1" rx="16" fill="#F5F3FF" stroke="#8B5CF6" stroke-width="2"/>
      <text x="170" y="46.1" text-anchor="middle" fill="#5B21B6" font-size="14" font-weight="800">VisionGuider (时序与视觉质心交互)</text>
      <g transform="translate(36, 62.4)">
        <rect x="0" y="8.1" width="54" height="84.1" rx="6" fill="#DBEAFE" stroke="#2563EB" stroke-width="1.8"/>
        ${svgTex(2, 29.8, 50, 40.7, 'X^{\\text{time}}', '#1E40AF', '12px')}
        ${svgTex(56, 29.8, 24, 40.7, '\\times', '#6D28D9', '15px')}
        <rect x="82" y="21.7" width="64" height="57" rx="6" fill="#EDE9FE" stroke="#7C3AED" stroke-width="1.8"/>
        ${svgTex(84, 29.8, 60, 40.7, '\\tilde{X}^{\\text{image}}', '#5B21B6', '12px')}
        <text x="162" y="57" text-anchor="middle" fill="#6D28D9" font-size="16" font-weight="900">➔</text>
        <g transform="translate(182, 8.1)">
          <rect x="0" y="0" width="24" height="24.4" rx="3" fill="#7C3AED"/><rect x="28" y="0" width="24" height="24.4" rx="3" fill="#C4B5FD"/><rect x="56" y="0" width="24" height="24.4" rx="3" fill="#DDD6FE"/>
          <rect x="0" y="29.8" width="24" height="24.4" rx="3" fill="#DDD6FE"/><rect x="28" y="29.8" width="24" height="24.4" rx="3" fill="#8B5CF6"/><rect x="56" y="29.8" width="24" height="24.4" rx="3" fill="#7C3AED"/>
          <rect x="0" y="59.7" width="24" height="24.4" rx="3" fill="#C4B5FD"/><rect x="28" y="59.7" width="24" height="24.4" rx="3" fill="#7C3AED"/><rect x="56" y="59.7" width="24" height="24.4" rx="3" fill="#EDE9FE"/>
        </g>
      </g>
      <rect x="14" y="203.4" width="312" height="168.1" rx="16" fill="#ECFDF5" stroke="#10B981" stroke-width="2"/>
      <text x="170" y="235.9" text-anchor="middle" fill="#065F46" font-size="14" font-weight="800">TextGuider (时序与文本质心交互)</text>
      <g transform="translate(36, 252.2)">
        <rect x="0" y="8.1" width="54" height="84.1" rx="6" fill="#DBEAFE" stroke="#2563EB" stroke-width="1.8"/>
        ${svgTex(2, 29.8, 50, 40.7, 'X^{\\text{time}}', '#1E40AF', '12px')}
        ${svgTex(56, 29.8, 24, 40.7, '\\times', '#059669', '15px')}
        <rect x="82" y="21.7" width="64" height="57" rx="6" fill="#D1FAE5" stroke="#059669" stroke-width="1.8"/>
        ${svgTex(84, 29.8, 60, 40.7, '\\tilde{X}^{\\text{text}}', '#065F46', '12px')}
        <text x="162" y="57" text-anchor="middle" fill="#059669" font-size="16" font-weight="900">➔</text>
        <g transform="translate(182, 8.1)">
          <rect x="0" y="0" width="24" height="24.4" rx="3" fill="#059669"/><rect x="28" y="0" width="24" height="24.4" rx="3" fill="#A7F3D0"/><rect x="56" y="0" width="24" height="24.4" rx="3" fill="#10B981"/>
          <rect x="0" y="29.8" width="24" height="24.4" rx="3" fill="#A7F3D0"/><rect x="28" y="29.8" width="24" height="24.4" rx="3" fill="#059669"/><rect x="56" y="29.8" width="24" height="24.4" rx="3" fill="#D1FAE5"/>
          <rect x="0" y="59.7" width="24" height="24.4" rx="3" fill="#10B981"/><rect x="28" y="59.7" width="24" height="24.4" rx="3" fill="#6EE7B7"/><rect x="56" y="59.7" width="24" height="24.4" rx="3" fill="#059669"/>
        </g>
      </g>
    </svg>`,

    "align.bilinear": `<svg viewBox="12 8.1 316 370.2" fill="none">
      <g transform="translate(16, 21.7)">
        <rect x="0" y="5.4" width="78" height="127.5" rx="10" fill="#F5F3FF" stroke="#8B5CF6" stroke-width="2"/>
        ${svgTex(4, 29.8, 70, 38, 'S_{\\text{vis}}', '#4C1D95', '13.5px')}
        <text x="39" y="97.6" text-anchor="middle" fill="#6D28D9" font-size="12" font-weight="700">视觉响应</text>
        <text x="92" y="75.9" text-anchor="middle" fill="#D97706" font-size="22" font-weight="900">·</text>
        <rect x="106" y="21.7" width="84" height="94.9" rx="10" fill="#FFFBEB" stroke="#F59E0B" stroke-width="2.5"/>
        ${svgTex(110, 32.5, 76, 38, '(\\alpha, 1-\\alpha)', '#92400E', '12.5px')}
        <text x="148" y="92.2" text-anchor="middle" fill="#B45309" font-size="12" font-weight="700">自适应加权</text>
        <text x="204" y="75.9" text-anchor="middle" fill="#D97706" font-size="22" font-weight="900">·</text>
        <rect x="218" y="21.7" width="90" height="94.9" rx="10" fill="#ECFDF5" stroke="#10B981" stroke-width="2"/>
        ${svgTex(222, 32.5, 82, 38, 'S_{\\text{text}}', '#065F46', '13.5px')}
        <text x="263" y="92.2" text-anchor="middle" fill="#047857" font-size="12" font-weight="700">文本响应</text>
      </g>
      <path d="M 170 162.7 L 170 206.1" stroke="#D97706" stroke-width="3.5"/>
      <polygon points="162,200.7 170,219.7 178,200.7" fill="#D97706"/>
      <rect x="20" y="225.1" width="300" height="146.4" rx="16" fill="#FFFBEB" stroke="#F59E0B" stroke-width="2.5"/>
      <g transform="translate(40, 246.8)">
        <rect x="0" y="0" width="22" height="29.8" rx="4" fill="#D97706"/><rect x="26" y="0" width="22" height="29.8" rx="4" fill="#FDE68A"/><rect x="52" y="0" width="22" height="29.8" rx="4" fill="#F59E0B"/>
        <rect x="0" y="35.3" width="22" height="29.8" rx="4" fill="#FDE68A"/><rect x="26" y="35.3" width="22" height="29.8" rx="4" fill="#B45309"/><rect x="52" y="35.3" width="22" height="29.8" rx="4" fill="#FDE68A"/>
        <rect x="0" y="70.5" width="22" height="29.8" rx="4" fill="#F59E0B"/><rect x="26" y="70.5" width="22" height="29.8" rx="4" fill="#FDE68A"/><rect x="52" y="70.5" width="22" height="29.8" rx="4" fill="#D97706"/>
      </g>
      ${svgTex(124, 257.6, 186, 40.7, '\\mathrm{Corr} \\in \\mathbb{R}^{N \\times N}', '#92400E', '14px', '引导矩阵 ', '')}
      <text x="216" y="328.2" text-anchor="middle" fill="#B45309" font-size="12.5" font-weight="700">桥接任意两时序块跨模态关联</text>
    </svg>`,

    "align.mgmsa": `<svg viewBox="12 8.1 316 370.2" fill="none">
      <g transform="translate(20, 19)">
        <rect x="0" y="0" width="88" height="113.9" rx="10" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2"/>
        <text x="44" y="46.1" text-anchor="middle" fill="#1E40AF" font-size="12.5" font-weight="800">时序内积</text>
        ${svgTex(4, 57, 80, 43.4, 'Q K^\\top / \\sqrt{d_k}', '#2563EB', '12px')}
        <circle cx="109" cy="57" r="13" fill="#FFFBEB" stroke="#D97706" stroke-width="2"/>
        ${svgTex(96, 38, 26, 38, '\\odot', '#D97706', '15px')}
        <rect x="130" y="0" width="86" height="113.9" rx="10" fill="#FFFBEB" stroke="#F59E0B" stroke-width="2"/>
        <text x="173" y="46.1" text-anchor="middle" fill="#92400E" font-size="12.5" font-weight="800">多模态引导</text>
        ${svgTex(134, 57, 78, 43.4, '\\mathrm{Corr}', '#D97706', '13px')}
        <text x="232" y="65.1" text-anchor="middle" fill="#059669" font-size="18" font-weight="900">➔</text>
        <rect x="248" y="0" width="52" height="113.9" rx="10" fill="#059669"/>
        <text x="274" y="54.2" text-anchor="middle" fill="#FFFFFF" font-size="12.5" font-weight="800">调制</text>
        <text x="274" y="81.4" text-anchor="middle" fill="#D1FAE5" font-size="12" font-weight="700">权重</text>
      </g>
      <path d="M 170 146.4 L 170 192.6" stroke="#2563EB" stroke-width="3.5"/>
      <polygon points="162,187.1 170,206.1 178,187.1" fill="#2563EB"/>
      <rect x="20" y="211.5" width="300" height="160" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2"/>
      <g transform="translate(38, 235.9)">
        <rect x="0" y="0" width="118" height="62.4" rx="8" fill="#2563EB"/>
        <text x="59" y="38" text-anchor="middle" fill="#FFFFFF" font-size="13.5" font-weight="800">Add &amp; Norm</text>
        <path d="M 122 31.2 L 142 31.2" stroke="#2563EB" stroke-width="2.5"/>
        <rect x="146" y="0" width="118" height="62.4" rx="8" fill="#1D4ED8"/>
        <text x="205" y="38" text-anchor="middle" fill="#FFFFFF" font-size="13.5" font-weight="800">FFN + Norm</text>
      </g>
      <text x="170" y="341.7" text-anchor="middle" fill="#1E3A8A" font-size="13.5" font-weight="800">放大与未来趋势一致的关键历史块权重</text>
    </svg>`,

    "align.fuser": `<svg viewBox="12 8.1 316 370.2" fill="none">
      <g transform="translate(18, 16.3)">
        <rect x="0" y="0" width="90" height="100.3" rx="12" fill="#EFF6FF" stroke="#2563EB" stroke-width="2"/>
        <text x="45" y="38" text-anchor="middle" fill="#1E40AF" font-size="13" font-weight="800">时序主干</text>
        ${svgTex(6, 48.8, 78, 40.7, '\\tilde{X}^{\\text{time}}', '#2563EB', '12.5px')}
        <rect x="107" y="0" width="90" height="100.3" rx="12" fill="#F5F3FF" stroke="#8B5CF6" stroke-width="2"/>
        <text x="152" y="38" text-anchor="middle" fill="#5B21B6" font-size="13" font-weight="800">视觉对齐</text>
        ${svgTex(113, 48.8, 78, 40.7, '\\tilde{X}^{\\text{image}}', '#7C3AED', '12.5px')}
        <rect x="214" y="0" width="90" height="100.3" rx="12" fill="#ECFDF5" stroke="#10B981" stroke-width="2"/>
        <text x="259" y="38" text-anchor="middle" fill="#065F46" font-size="13" font-weight="800">文本对齐</text>
        ${svgTex(220, 48.8, 78, 40.7, '\\tilde{X}^{\\text{text}}', '#059669', '12.5px')}
      </g>
      <path d="M 63 122 L 154 189.8 M 170 122 L 170 179 M 277 122 L 186 189.8" stroke="#D97706" stroke-width="3"/>
      <circle cx="170" cy="203.4" r="22" fill="#F59E0B" stroke="#FFFFFF" stroke-width="3"/>
      <text x="170" y="214.2" text-anchor="middle" fill="#FFFFFF" font-size="24" font-weight="900">+</text>
      <path d="M 170 235.9 L 170 276.6" stroke="#D97706" stroke-width="3.5"/>
      <polygon points="162,271.2 170,290.2 178,271.2" fill="#D97706"/>
      <rect x="26" y="292.9" width="288" height="81.4" rx="14" fill="#FFFBEB" stroke="#F59E0B" stroke-width="2.5"/>
      ${svgTex(36, 301, 268, 38, 'X^{\\text{fuse}} \\in \\mathbb{R}^{N \\times D}', '#92400E', '14px', '输出融合表征 ', '')}
      <text x="170" y="358" text-anchor="middle" fill="#B45309" font-size="12.5" font-weight="700">兼具局部波形、全局周期与文本背景</text>
    </svg>`,

    /* ========================================================================
     * 7. SLIDE 7 VISUALS: DUAL-STREAM DECODER & PROTOTYPE FLOW MATCHING
     * ======================================================================== */
    "decoder.condition": `<svg viewBox="12 8.1 316 370.2" fill="none">
      <rect x="18" y="13.6" width="304" height="154.6" rx="16" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2"/>
      <text x="170" y="46.1" text-anchor="middle" fill="#1E40AF" font-size="14" font-weight="800">第一阶段：Causal-Transformer</text>
      <g transform="translate(44, 62.4)">
        <rect x="0" y="0" width="52" height="84.1" rx="6" fill="#2563EB"/><text x="26" y="48.8" text-anchor="middle" fill="#FFF" font-size="12.5" font-weight="800">块 1</text>
        <rect x="66" y="21.7" width="52" height="62.4" rx="6" fill="#3B82F6"/><text x="92" y="59.7" text-anchor="middle" fill="#FFF" font-size="12.5" font-weight="800">块 2</text>
        <rect x="132" y="40.7" width="52" height="43.4" rx="6" fill="#60A5FA"/><text x="158" y="67.8" text-anchor="middle" fill="#FFF" font-size="12" font-weight="800">块 3</text>
        <rect x="198" y="57" width="52" height="27.1" rx="5" fill="#93C5FD"/><text x="224" y="75.9" text-anchor="middle" fill="#1E3A8A" font-size="11" font-weight="800">末块</text>
      </g>
      <path d="M 170 176.3 L 170 217" stroke="#E11D48" stroke-width="3.5"/>
      <polygon points="162,211.5 170,230.5 178,211.5" fill="#E11D48"/>
      <rect x="18" y="233.2" width="304" height="138.3" rx="16" fill="#FFF1F2" stroke="#E11D48" stroke-width="2.5"/>
      <circle cx="64" cy="302.4" r="26" fill="#FFFFFF" stroke="#E11D48" stroke-width="2.5"/>
      <line x1="64" y1="302.4" x2="84" y2="282" stroke="#E11D48" stroke-width="3"/>
      <line x1="64" y1="302.4" x2="86" y2="311.9" stroke="#2563EB" stroke-width="3"/>
      <path d="M 78 287.5 A 16 16 0 0 1 80 309.2" stroke="#F59E0B" stroke-width="2.5" fill="none"/>
      <text x="206" y="287.5" text-anchor="middle" fill="#BE123C" font-size="14.5" font-weight="900">第二阶段：Cross-Transformer</text>
      ${svgTex(104, 303.7, 206, 40.7, 'X^{\\text{cond}} \\in \\mathbb{R}^{N_p \\times D}', '#9F1239', '12.5px', 'RoPE 跨注意力输出 ', '')}
    </svg>`,

    "decoder.prototype": `<svg viewBox="12 8.1 316 370.2" fill="none">
      <rect x="16" y="13.6" width="308" height="203.4" rx="16" fill="#F5F3FF" stroke="#8B5CF6" stroke-width="2"/>
      <text x="170" y="43.4" text-anchor="middle" fill="#5B21B6" font-size="14" font-weight="800">Prototype Bank (周期基 + 趋势基原型库)</text>
      <g transform="translate(34, 57)">
        <rect x="0" y="0" width="82" height="59.7" rx="8" fill="#FFFFFF" stroke="#C4B5FD"/><path d="M 8 29.8 Q 24 8.1, 41 29.8 T 74 29.8" stroke="#7C3AED" stroke-width="2.5" fill="none"/><text x="41" y="52.9" text-anchor="middle" fill="#6D28D9" font-size="10.5" font-weight="800">正弦周期</text>
        <rect x="95" y="0" width="82" height="59.7" rx="8" fill="#FFFFFF" stroke="#C4B5FD"/><path d="M 103 13.6 Q 120 43.4, 136 24.4 T 169 35.3" stroke="#8B5CF6" stroke-width="2.5" fill="none"/><text x="136" y="52.9" text-anchor="middle" fill="#6D28D9" font-size="10.5" font-weight="800">余弦周期</text>
        <rect x="190" y="0" width="82" height="59.7" rx="8" fill="#FFFFFF" stroke="#C4B5FD"/><path d="M 198 40.7 Q 220 16.3, 264 13.6" stroke="#2563EB" stroke-width="2.5" fill="none"/><text x="231" y="52.9" text-anchor="middle" fill="#1D4ED8" font-size="10.5" font-weight="800">对数增长</text>
        <rect x="0" y="73.2" width="82" height="59.7" rx="8" fill="#FFFFFF" stroke="#C4B5FD"/><path d="M 8 113.9 Q 52 108.5, 74 81.4" stroke="#059669" stroke-width="2.5" fill="none"/><text x="41" y="126.1" text-anchor="middle" fill="#047857" font-size="10.5" font-weight="800">指数趋势</text>
        <rect x="95" y="73.2" width="82" height="59.7" rx="8" fill="#FFFFFF" stroke="#C4B5FD"/><line x1="103" y1="111.2" x2="169" y2="84.1" stroke="#D97706" stroke-width="2.5"/><text x="136" y="126.1" text-anchor="middle" fill="#B45309" font-size="10.5" font-weight="800">线性趋势</text>
        <rect x="190" y="73.2" width="82" height="59.7" rx="8" fill="#FFFFFF" stroke="#C4B5FD"/><path d="M 198 108.5 L 220 84.1 L 242 111.2 L 264 81.4" stroke="#E11D48" stroke-width="2.5" fill="none"/><text x="231" y="126.1" text-anchor="middle" fill="#BE123C" font-size="10.5" font-weight="800">复合包络</text>
      </g>
      <path d="M 170 225.1 L 170 263.1" stroke="#E11D48" stroke-width="3.5"/>
      <polygon points="162,257.6 170,276.6 178,257.6" fill="#E11D48"/>
      <rect x="18" y="279.3" width="304" height="92.2" rx="14" fill="#FFF1F2" stroke="#E11D48" stroke-width="2"/>
      <path d="M 38 336.3 Q 66 295.6, 98 330.9 T 158 309.2" stroke="#E11D48" stroke-width="3.5" fill="none"/>
      <text x="238" y="314.6" text-anchor="middle" fill="#BE123C" font-size="14" font-weight="900">PrototypeRetriever</text>
      ${svgTex(164, 325.4, 148, 38, '\\tilde{\\mathcal{P}}', '#9F1239', '12.5px', '加权合成先验原型 ', '')}
    </svg>`,

    "decoder.flowMatching": `<svg viewBox="12 8.1 316 370.2" fill="none">
      <rect x="16" y="13.6" width="308" height="176.3" rx="16" fill="#FFF1F2" stroke="#E11D48" stroke-width="2"/>
      <text x="170" y="46.1" text-anchor="middle" fill="#BE123C" font-size="14" font-weight="800">从合成原型出发的最优传输直线轨迹</text>
      <circle cx="58" cy="111.2" r="22" fill="#7C3AED"/>
      ${svgTex(36, 92.2, 44, 38, 'Z_0', '#FFFFFF', '13px')}
      <line x1="84" y1="111.2" x2="248" y2="111.2" stroke="#059669" stroke-width="5"/>
      <polygon points="246,100.3 262,111.2 246,122" fill="#059669"/>
      <circle cx="170" cy="111.2" r="9" fill="#2563EB" stroke="#FFF" stroke-width="2.5"/>
      <circle cx="286" cy="111.2" r="22" fill="#059669"/>
      ${svgTex(264, 92.2, 44, 38, 'Z_1', '#FFFFFF', '13px')}
      <text x="170" y="168.1" text-anchor="middle" fill="#065F46" font-size="13.5" font-weight="800">恒定目标速度向量 · 零曲率最短路径</text>
      <path d="M 170 198 L 170 235.9" stroke="#2563EB" stroke-width="3.5"/>
      <polygon points="162,230.5 170,249.5 178,230.5" fill="#2563EB"/>
      <rect x="16" y="252.2" width="308" height="119.3" rx="16" fill="#EFF6FF" stroke="#2563EB" stroke-width="2"/>
      <g transform="translate(26, 273.9)">
        <rect x="0" y="0" width="106" height="75.9" rx="10" fill="#DBEAFE" stroke="#3B82F6" stroke-width="1.8"/>
        <text x="53" y="29.8" text-anchor="middle" fill="#1E40AF" font-size="12" font-weight="800">输入状态与条件</text>
        ${svgTex(6, 38, 94, 32.5, 'Z_\\tau, X^{\\text{cond}}', '#2563EB', '11.5px')}
        <path d="M 108 38 L 126 38" stroke="#2563EB" stroke-width="2.5"/>
        <rect x="128" y="0" width="160" height="75.9" rx="10" fill="#2563EB"/>
        <text x="208" y="32.5" text-anchor="middle" fill="#FFFFFF" font-size="13.5" font-weight="900">Flow-Matching Net</text>
        ${svgTex(134, 38, 148, 32.5, 'v_\\theta(Z_\\tau, \\tau \\mid X^{\\text{cond}})', '#DBEAFE', '11.5px')}
      </g>
    </svg>`,

    "decoder.eulerOde": `<svg viewBox="12 8.1 316 370.2" fill="none">
      <rect x="16" y="13.6" width="308" height="189.8" rx="16" fill="#ECFDF5" stroke="#10B981" stroke-width="2"/>
      <text x="170" y="46.1" text-anchor="middle" fill="#065F46" font-size="14" font-weight="800">前向欧拉积分与多轨迹概率采样</text>
      <path d="M 44 146.4 Q 108 105.8, 170 111.2 Q 232 57, 296 40.7 L 296 173.6 Q 232 149.2, 170 130.2 Q 108 124.8, 44 146.4 Z" fill="#A7F3D0" fill-opacity="0.55"/>
      <path d="M 44 146.4 Q 108 115.3, 170 119.3 Q 232 78.6, 296 70.5 L 296 141 Q 232 127.5, 170 124.8 Q 108 122, 44 146.4 Z" fill="#34D399" fill-opacity="0.55"/>
      <path d="M 44 146.4 Q 108 119.3, 170 122 T 296 103.1" stroke="#059669" stroke-width="4" fill="none"/>
      <circle cx="44" cy="146.4" r="6" fill="#7C3AED"/>
      <circle cx="108" cy="124.8" r="5" fill="#2563EB"/>
      <circle cx="170" cy="122" r="5" fill="#2563EB"/>
      <circle cx="232" cy="111.2" r="5" fill="#059669"/>
      <circle cx="296" cy="103.1" r="7" fill="#059669"/>
      <text x="170" y="189.8" text-anchor="middle" fill="#047857" font-size="12.5" font-weight="800">多次采样噪声生成未来概率置信区间</text>
      <path d="M 170 211.5 L 170 249.5" stroke="#0891B2" stroke-width="3.5"/>
      <polygon points="162,244.1 170,263.1 178,244.1" fill="#0891B2"/>
      <rect x="16" y="265.8" width="308" height="105.8" rx="16" fill="#ECFEFF" stroke="#0891B2" stroke-width="2.5"/>
      <text x="170" y="306.5" text-anchor="middle" fill="#0E7490" font-size="14.5" font-weight="900">拼接未来块 + RevIN 逆归一化还原</text>
      ${svgTex(36, 322.7, 268, 38, '\\hat{Y} \\in \\mathbb{R}^{H_f}', '#155E75', '12.5px', '还原真实物理量纲输出预测 ', '')}
    </svg>`
  };
})();
