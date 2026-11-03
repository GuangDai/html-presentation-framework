/**
 * ============================================================================
 * @file decks/paper-template/visuals.js
 * @description Clean White-Blue Vector SVG Diagrams for the Paper Template Deck.
 * ============================================================================
 */
window.PresentationVisuals = {
  'example.diagram': `<svg viewBox="0 0 520 165" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="36" width="160" height="92" rx="10" fill="#F8FAFC" stroke="#94A3B8" stroke-width="2"/>
    <text x="100" y="88" text-anchor="middle" fill="#334155" font-size="16" font-weight="800">输入表征 x</text>
    <path d="M 188 82 H 236 M 228 74 L 238 82 L 228 90" stroke="#2563EB" stroke-width="3"/>
    <rect x="244" y="32" width="116" height="100" rx="12" fill="#2563EB"/>
    <text x="302" y="88" text-anchor="middle" fill="#FFFFFF" font-size="16" font-weight="900">核心算子 f_θ</text>
    <path d="M 368 82 H 398 M 390 74 L 400 82 L 390 90" stroke="#0D9488" stroke-width="3"/>
    <rect x="406" y="36" width="96" height="92" rx="10" fill="#F0FDFA" stroke="#0D9488" stroke-width="2"/>
    <text x="454" y="88" text-anchor="middle" fill="#0F766E" font-size="16" font-weight="800">输出 ŷ</text>
  </svg>`,

  'template.problem': `<svg viewBox="0 0 520 165" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="16" y="20" width="210" height="125" rx="10" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.8"/>
    <text x="121" y="68" text-anchor="middle" fill="#334155" font-size="15" font-weight="800">传统单视角输入</text>
    <text x="121" y="98" text-anchor="middle" fill="#64748B" font-size="12.5" font-weight="700">忽略结构先验与外部语境</text>
    <path d="M 236 82 H 284" stroke="#E11D48" stroke-width="3" stroke-dasharray="5 4"/>
    <polygon points="282,76 292,82 282,88" fill="#E11D48"/>
    <rect x="298" y="20" width="206" height="125" rx="10" fill="#FFF1F2" stroke="#FECDD3" stroke-width="1.8"/>
    <text x="401" y="68" text-anchor="middle" fill="#BE123C" font-size="15" font-weight="800">表征失配 · 预测发散</text>
    <text x="401" y="98" text-anchor="middle" fill="#64748B" font-size="12.5" font-weight="700">复杂场景下性能显著退化</text>
  </svg>`,

  'template.solution': `<svg viewBox="0 0 520 165" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="16" y="24" width="144" height="116" rx="10" fill="#F0F9FF" stroke="#0284C7" stroke-width="1.8"/>
    <text x="88" y="74" text-anchor="middle" fill="#0369A1" font-size="14.5" font-weight="800">多源先验输入</text>
    <text x="88" y="100" text-anchor="middle" fill="#0284C7" font-size="12" font-weight="700">结构 + 语义协同</text>
    <path d="M 166 82 H 196" stroke="#2563EB" stroke-width="3"/>
    <polygon points="194,76 204,82 194,88" fill="#2563EB"/>
    <rect x="208" y="20" width="124" height="124" rx="12" fill="#2563EB"/>
    <text x="270" y="76" text-anchor="middle" fill="#FFFFFF" font-size="15.5" font-weight="900">核心创新算子</text>
    <text x="270" y="102" text-anchor="middle" fill="#DBEAFE" font-size="12" font-weight="700">焦点高亮模块</text>
    <path d="M 336 82 H 366" stroke="#0D9488" stroke-width="3"/>
    <polygon points="364,76 374,82 364,88" fill="#0D9488"/>
    <rect x="378" y="24" width="126" height="116" rx="10" fill="#F0FDFA" stroke="#0D9488" stroke-width="2"/>
    <text x="441" y="74" text-anchor="middle" fill="#0F766E" font-size="14.5" font-weight="800">精准目标输出</text>
    <text x="441" y="100" text-anchor="middle" fill="#0D9488" font-size="12" font-weight="700">高置信度收敛</text>
  </svg>`,

  'template.archUpper': `<svg viewBox="0 0 1600 280" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="16" y="16" width="1568" height="248" rx="14" fill="#F8FAFC" stroke="#CBD5E1" stroke-width="1.5"/>
    <rect x="44" y="54" width="280" height="172" rx="12" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2"/>
    <text x="184" y="128" text-anchor="middle" fill="#334155" font-size="18" font-weight="800">1. 多源输入层 (Input)</text>
    <text x="184" y="160" text-anchor="middle" fill="#64748B" font-size="14" font-weight="700">浅灰蓝边框表示原始输入</text>
    <path d="M 328 140 H 412" stroke="#0284C7" stroke-width="3.5"/>
    <polygon points="410,132 424,140 410,148" fill="#0284C7"/>
    <rect x="428" y="54" width="320" height="172" rx="12" fill="#F0F9FF" stroke="#0284C7" stroke-width="2"/>
    <text x="588" y="128" text-anchor="middle" fill="#0369A1" font-size="18" font-weight="800">2. 特征校准与提纯 (Sky)</text>
    <text x="588" y="160" text-anchor="middle" fill="#0284C7" font-size="14" font-weight="700">天际蓝表示归一化与降噪</text>
    <path d="M 752 140 H 836" stroke="#2563EB" stroke-width="3.5"/>
    <polygon points="834,132 848,140 834,148" fill="#2563EB"/>
    <rect x="852" y="44" width="340" height="192" rx="14" fill="#2563EB"/>
    <text x="1022" y="128" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">3. 核心编码主干 (Focal Blue)</text>
    <text x="1022" y="162" text-anchor="middle" fill="#DBEAFE" font-size="14" font-weight="700">实心皇家蓝突出全图视觉焦点</text>
    <path d="M 1196 140 H 1272" stroke="#0D9488" stroke-width="3.5"/>
    <polygon points="1270,132 1284,140 1270,148" fill="#0D9488"/>
    <rect x="1288" y="54" width="264" height="172" rx="12" fill="#F0FDFA" stroke="#0D9488" stroke-width="2.5"/>
    <text x="1420" y="128" text-anchor="middle" fill="#0F766E" font-size="18" font-weight="900">4. 融合表征 h</text>
    <text x="1420" y="160" text-anchor="middle" fill="#0D9488" font-size="14" font-weight="700">信号青表示阶段输出</text>
  </svg>`,

  'template.archLower': `<svg viewBox="0 0 1600 260" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="16" y="14" width="1568" height="232" rx="14" fill="#F5F7FF" stroke="#C7D2FE" stroke-width="1.5"/>
    <rect x="44" y="48" width="320" height="164" rx="12" fill="#EEF2FF" stroke="#4F46E5" stroke-width="2"/>
    <text x="204" y="120" text-anchor="middle" fill="#3730A3" font-size="18" font-weight="800">先验原型库检索 (Indigo)</text>
    <text x="204" y="152" text-anchor="middle" fill="#4338CA" font-size="14" font-weight="700">靛青蓝表示结构化先验空间</text>
    <path d="M 368 130 H 520" stroke="#4F46E5" stroke-width="3.5"/>
    <polygon points="518,122 532,130 518,138" fill="#4F46E5"/>
    <rect x="536" y="40" width="480" height="180" rx="14" fill="#1D4ED8"/>
    <text x="776" y="120" text-anchor="middle" fill="#FFFFFF" font-size="20" font-weight="900">条件引导流匹配解码器 (Core Decoder)</text>
    <text x="776" y="154" text-anchor="middle" fill="#DBEAFE" font-size="14" font-weight="700">融合上层表征与先验起点生成目标轨迹</text>
    <path d="M 1020 130 H 1168" stroke="#0D9488" stroke-width="3.5"/>
    <polygon points="1166,122 1180,130 1166,138" fill="#0D9488"/>
    <rect x="1184" y="48" width="368" height="164" rx="12" fill="#F0FDFA" stroke="#0D9488" stroke-width="2.5"/>
    <text x="1368" y="120" text-anchor="middle" fill="#0F766E" font-size="18" font-weight="900">终端预测输出 ŷ ∈ R^m</text>
    <text x="1368" y="152" text-anchor="middle" fill="#0D9488" font-size="14" font-weight="700">输出完整预测分布与置信区间</text>
  </svg>`,

  'template.step1': `<svg viewBox="0 0 320 340" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="20" width="280" height="110" rx="12" fill="#FFFFFF" stroke="#94A3B8" stroke-width="2"/>
    <text x="160" y="66" text-anchor="middle" fill="#334155" font-size="15" font-weight="800">原始输入向量 x</text>
    <text x="160" y="96" text-anchor="middle" fill="#64748B" font-size="13" font-weight="700">存在非平稳偏移与量纲差异</text>
    <path d="M 160 136 V 196" stroke="#0284C7" stroke-width="3.5"/>
    <polygon points="152,192 160,208 168,192" fill="#0284C7"/>
    <rect x="20" y="212" width="280" height="108" rx="12" fill="#F0F9FF" stroke="#0284C7" stroke-width="2"/>
    <text x="160" y="258" text-anchor="middle" fill="#0369A1" font-size="15" font-weight="800">标准化初始表征 z_0</text>
    <text x="160" y="288" text-anchor="middle" fill="#0284C7" font-size="13" font-weight="700">零均值单位方差对齐</text>
  </svg>`,

  'template.step2': `<svg viewBox="0 0 320 340" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="20" width="280" height="136" rx="14" fill="#2563EB"/>
    <text x="160" y="76" text-anchor="middle" fill="#FFFFFF" font-size="17" font-weight="900">引导自注意力核心算子</text>
    <text x="160" y="110" text-anchor="middle" fill="#DBEAFE" font-size="13" font-weight="700">先验矩阵 M 哈达玛积调制</text>
    <path d="M 160 162 V 208" stroke="#2563EB" stroke-width="3.5"/>
    <polygon points="152,204 160,220 168,204" fill="#2563EB"/>
    <rect x="20" y="224" width="280" height="96" rx="12" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2"/>
    <text x="160" y="278" text-anchor="middle" fill="#1D4ED8" font-size="15" font-weight="800">残差连接 + 层归一化输出 h</text>
  </svg>`,

  'template.step3': `<svg viewBox="0 0 320 340" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="20" width="280" height="110" rx="12" fill="#EFF6FF" stroke="#3B82F6" stroke-width="2"/>
    <text x="160" y="80" text-anchor="middle" fill="#1D4ED8" font-size="15" font-weight="800">深层隐空间表征 h</text>
    <path d="M 160 136 V 196" stroke="#0D9488" stroke-width="3.5"/>
    <polygon points="152,192 160,208 168,192" fill="#0D9488"/>
    <rect x="20" y="212" width="280" height="108" rx="12" fill="#F0FDFA" stroke="#0D9488" stroke-width="2.5"/>
    <text x="160" y="258" text-anchor="middle" fill="#0F766E" font-size="16" font-weight="900">最终预测输出 ŷ ∈ R^m</text>
    <text x="160" y="288" text-anchor="middle" fill="#0D9488" font-size="13" font-weight="700">线性映射 + 物理量纲逆还原</text>
  </svg>`
};
window.AuroraVisuals = window.PresentationVisuals;
