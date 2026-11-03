/**
 * ============================================================================
 * @file js/visual-components.js
 * @description Reusable Declarative Visual-Semantic Component Builders
 *              (`window.PresentationComponents`).
 *
 * Transforms dense text explanations into scannable visual logic:
 * - `buildPhaseTrack`: Macro-phase grouping rail above pipeline steps
 * - `buildStepSemantics`: 3-node [Input ➔ Op ➔ Output] strip + tagged KV rows
 * - `buildContrastDiagnostics`: Structured [Tag + Cause ➔ Effect] rows + footer chips
 * - `buildBandMetaStrip`: Architecture stream metadata pills
 * - `buildKPICards`, `buildComparisonBars`, `buildCalloutBanner`: Rich analytical widgets
 * ============================================================================
 */

window.PresentationComponents = {
  /**
   * 1. Macro Phase Guidance Track (`.v-phase-track`)
   */
  buildPhaseTrack(phases, colCount) {
    if (!Array.isArray(phases) || phases.length === 0) return '';
    const pillsHtml = phases.map(p => {
      const span = Math.max(1, Math.min(colCount, Number(p.span) || 1));
      const tone = p.tone || 'blue';
      return `
        <div class="v-phase-pill phase-${tone}" style="--phase-span:${span}">
          <div class="v-phase-left">
            <span class="v-phase-code">${this.formatInlineMath(p.code || 'PHASE')}</span>
            <span class="v-phase-title">${this.formatInlineMath(p.title || '')}</span>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="v-phase-track cols-${colCount} anim-item" data-anim="fade-down" style="--stagger:1;--grid-columns:${colCount}">
        ${pillsHtml}
      </div>
    `;
  },

  /**
   * 2. Structured Step Semantic Block (`.v-step-semantics`)
   * Replaces walls of prose in `.pipe-step-caption` with:
   * - 3-node [Input] ➔ [Operator] ➔ [Output] visual flow strip
   * - 2-row tagged Key-Value specification grid
   */
  buildStepSemantics(step) {
    const hasStructured = (Array.isArray(step.ioFlow) && step.ioFlow.length === 3) ||
                          (Array.isArray(step.specs) && step.specs.length > 0);
    if (!hasStructured) {
      return `<span>${this.formatInlineMath(step.caption || '')}</span>`;
    }

    let ioHtml = '';
    if (Array.isArray(step.ioFlow) && step.ioFlow.length === 3) {
      ioHtml = `
        <div class="v-io-strip">
          <span class="v-io-node io-in">${this.formatInlineMath(step.ioFlow[0])}</span>
          <span class="v-io-arrow">➔</span>
          <span class="v-io-node io-op">${this.formatInlineMath(step.ioFlow[1])}</span>
          <span class="v-io-arrow">➔</span>
          <span class="v-io-node io-out">${this.formatInlineMath(step.ioFlow[2])}</span>
        </div>
      `;
    }

    let kvHtml = '';
    if (Array.isArray(step.specs) && step.specs.length > 0) {
      kvHtml = `
        <div class="v-kv-grid">
          ${step.specs.map(item => `
            <div class="v-kv-row">
              <span class="v-kv-tag tag-${item.tone || 'blue'}">${this.formatInlineMath(item.tag)}</span>
              <span class="v-kv-val">${this.formatInlineMath(item.text)}</span>
            </div>
          `).join('')}
        </div>
      `;
    }

    return `
      <div class="v-step-semantics">
        ${ioHtml}
        ${kvHtml}
      </div>
    `;
  },

  /**
   * 3. Contrast Card Visual Diagnostic & Mechanism Panel (`.v-diagnostic-panel`)
   * Replaces multi-line prose bullet lists with structured [Badge + Core ➔ Outcome] rows
   */
  buildContrastDiagnostics(card) {
    if (!Array.isArray(card.diagnostics) || card.diagnostics.length === 0) {
      return `
        <ul class="contrast-points">
          ${(card.points || []).map(pt => `<li>${this.formatInlineMath(pt)}</li>`).join('')}
        </ul>
      `;
    }

    const rowsHtml = card.diagnostics.map(d => `
      <div class="v-diag-row">
        <div class="v-diag-left">
          <span class="v-diag-badge">${this.formatInlineMath(d.badge)}</span>
          <span class="v-diag-text">${this.formatInlineMath(d.text)}</span>
        </div>
        <span class="v-diag-arrow">➔</span>
        <span class="v-diag-outcome">${this.formatInlineMath(d.outcome)}</span>
      </div>
    `).join('');

    const footerHtml = Array.isArray(card.footerChips) && card.footerChips.length > 0 ? `
      <div class="v-card-footer-strip">
        ${card.footerChips.map(chip => `
          <span class="v-footer-chip">
            <span>${this.formatInlineMath(chip.label)}:</span>
            <strong>${this.formatInlineMath(chip.value)}</strong>
          </span>
        `).join('')}
      </div>
    ` : '';

    return `
      <div class="v-diagnostic-panel">
        ${rowsHtml}
        ${footerHtml}
      </div>
    `;
  },

  /**
   * 4. Architecture Band Metadata Strip (`.v-band-meta`)
   */
  buildBandMetaStrip(metaPills) {
    if (!Array.isArray(metaPills) || metaPills.length === 0) return '';
    return `
      <div class="v-band-meta">
        ${metaPills.map(pill => `
          <span class="v-meta-pill pill-${pill.tone || 'blue'}">
            <span class="dot"></span>
            <span>${this.formatInlineMath(pill.label)}</span>
          </span>
        `).join('')}
      </div>
    `;
  },

  /**
   * 5. KPI Metric Strip (`.v-kpi-strip`)
   */
  buildKPICards(kpis) {
    if (!Array.isArray(kpis) || kpis.length === 0) return '';
    return `
      <div class="v-kpi-strip anim-item" data-anim="fade-up" style="--stagger:1;--kpi-cols:${Math.min(6, kpis.length)}">
        ${kpis.map(kpi => `
          <div class="v-kpi-card theme-${kpi.tone || 'blue'}">
            <div class="v-kpi-info">
              <span class="v-kpi-label">${this.formatInlineMath(kpi.label)}</span>
              <span class="v-kpi-value">${this.formatInlineMath(kpi.value)}</span>
            </div>
            ${kpi.delta ? `<span class="v-kpi-delta">${this.formatInlineMath(kpi.delta)}</span>` : ''}
          </div>
        `).join('')}
      </div>
    `;
  },

  /**
   * 6. Horizontal Visual Benchmark Bars (`.v-bar-list`)
   */
  buildComparisonBars(bars) {
    if (!Array.isArray(bars) || bars.length === 0) return '';
    return `
      <div class="v-bar-list">
        ${bars.map(b => `
          <div class="v-bar-item">
            <div class="v-bar-head ${b.highlight ? 'is-ours' : ''}">
              <span>${this.formatInlineMath(b.name)}</span>
              <span>${this.formatInlineMath(b.metric)}</span>
            </div>
            <div class="v-bar-track">
              <div class="v-bar-fill ${b.highlight ? 'is-ours' : ''}" style="width:${Math.max(5, Math.min(100, Number(b.percent) || 50))}%"></div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  /**
   * 7. Bottom Insight / Takeaway Callout Banner (`.v-callout-banner`)
   */
  buildCalloutBanner(banner) {
    if (!banner) return '';
    const pillsHtml = Array.isArray(banner.pills) ? banner.pills.map(p => `
      <span class="v-footer-chip"><strong>${this.formatInlineMath(p)}</strong></span>
    `).join('') : '';
    return `
      <div class="v-callout-banner anim-item" data-anim="fade-up" style="--stagger:5">
        <div class="v-callout-left">
          <span class="v-callout-badge">${this.formatInlineMath(banner.badge || '核心结论')}</span>
          <span class="v-callout-text">${this.formatInlineMath(banner.text || '')}</span>
        </div>
        <div class="v-callout-pills">${pillsHtml}</div>
      </div>
    `;
  }
};
