/**
 * ============================================================================
 * @file js/slide-layouts.js
 * @description Six Standardized 16:9 Slide Layouts with Unified Visual Logic:
 *              1. `contrast-slide`     — Bottleneck Diagnostic vs Breakthrough
 *              2. `architecture-slide` — Multi-Stream End-to-End Topology
 *              3. `pipeline-slide`     — Phase-Guided Step Pipeline + Math Dock
 *              4. `bento-slide`        — 12-Col Modular Bento Grid Synthesis
 *              5. `benchmark-slide`    — KPI + Visual Bar & Chart Evaluation
 *              6. `matrix-slide`       — Multi-Dimension Semantic Matrix Table
 * ============================================================================
 */

window.PresentationLayouts = {
  /**
   * Layout 1: Contrast Slide (Top Challenges vs Bottom Contributions)
   */
  buildContrastSlide(slide) {
    const topCards = slide.challengesSection.cards.map((card, i) => `
      <article class="contrast-card anim-item" data-anim="fade-up" data-col-idx="${i}" style="--stagger:${i + 1}">
        <div class="contrast-card-head">
          <div class="contrast-card-head-main">
            <span class="contrast-card-tag">${card.code}</span>
            <h3 class="contrast-card-title">${this.formatInlineMath(card.title)}</h3>
          </div>
          ${card.roleBadge ? `<span class="pipe-step-role-badge">${this.formatInlineMath(card.roleBadge)}</span>` : ''}
        </div>
        <div class="contrast-visual">
          ${this.resolveVisual(card.visualKey)}
        </div>
        ${slide.showCardDescriptions === false ? '' : (Array.isArray(card.points) && card.points.length ? `<ul class="contrast-points">
          ${card.points.map(point => `<li>${this.formatInlineMath(point)}</li>`).join('')}
        </ul>` : this.buildContrastDiagnostics(card))}
      </article>
    `).join('');

    const bottomCards = slide.contributionsSection.cards.map((card, i) => `
      <article class="contrast-card ${card.jumpToSlide !== undefined ? 'clickable-card ' : ''}anim-item" data-anim="fade-up" data-col-idx="${i}" style="--stagger:${i + 4}" ${card.jumpToSlide !== undefined ? `data-jump-slide="${card.jumpToSlide}"` : ''}>
        <div class="contrast-card-head">
          <div class="contrast-card-head-main">
            <span class="contrast-card-tag">${card.code}</span>
            <h3 class="contrast-card-title">${this.formatInlineMath(card.title)}</h3>
          </div>
          ${card.jumpLabel ? `<span class="contrast-jump-pill">${this.formatInlineMath(card.jumpLabel)}</span>` : ''}
        </div>
        <div class="contrast-visual">
          ${this.resolveVisual(card.visualKey)}
        </div>
        ${slide.showCardDescriptions === false ? '' : (Array.isArray(card.points) && card.points.length ? `<ul class="contrast-points">
          ${card.points.map(point => `<li>${this.formatInlineMath(point)}</li>`).join('')}
        </ul>` : this.buildContrastDiagnostics(card))}
      </article>
    `).join('');

    const connectorsHtml = slide.connectors && slide.connectors.length ? `
      <div class="contrast-connectors ${slide.connectorStyle === 'arrows' ? 'arrows-only ' : ''}anim-item" data-anim="scale-in" style="--stagger:3;--grid-columns:${Math.min(7, slide.connectors.length)}">
        ${slide.connectors.map(label => {
          const cleanLabel = String(label).replace(/^[⬇↓]\s*/, '');
          return `
            <div class="connector-pill">
              <span class="connector-pill-arrow">↓</span>
              ${cleanLabel ? `<span>${this.formatInlineMath(cleanLabel)}</span>` : ''}
            </div>
          `;
        }).join('')}
      </div>
    ` : '';

    return `
      <div class="contrast-layout">
        <div class="contrast-band band-challenges">
          ${slide.challengesSection.headerTag ? `<div class="band-header"><div class="band-header-left"><span class="band-badge">${slide.challengesSection.headerTag}</span></div></div>` : ''}
          <div class="contrast-cards-grid" style="--grid-columns:${Math.max(1, Math.min(7, slide.challengesSection.cards.length))}">
            ${topCards}
          </div>
        </div>

        ${connectorsHtml}

        <div class="contrast-band band-contributions">
          ${slide.contributionsSection.headerTag ? `<div class="band-header"><div class="band-header-left"><span class="band-badge">${slide.contributionsSection.headerTag}</span></div></div>` : ''}
          <div class="contrast-cards-grid" style="--grid-columns:${Math.max(1, Math.min(7, slide.contributionsSection.cards.length))}">
            ${bottomCards}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Layout 2: Multi-Stream Architecture Slide (Upper Encoder Band + Lower Decoder Band)
   */
  buildArchitectureSlide(slide) {
    const weights = Array.isArray(slide.bandWeights) && slide.bandWeights.length === 2 &&
      slide.bandWeights.every(value => typeof value === 'number' && Number.isFinite(value) && value > 0)
      ? slide.bandWeights : null;

    return `
      <div class="ms-arch-stage ${slide.bandDivider ? 'divider-only' : ''}">
        <div class="ms-band-card encoder-band anim-item" data-anim="fade-up"${weights ? ` style="--stagger:1;height:auto;flex:${weights[0]} 1 0"` : ' style="--stagger:1"'}>
          ${!slide.bandDivider ? `<div class="ms-band-header"><span class="ms-band-tag tag-encoder">${slide.encoderBand.bandTag}</span>${this.buildBandMetaStrip(slide.encoderBand.metaPills)}</div>` : ''}
          <div class="ms-svg-canvas">
            ${this.resolveVisual(slide.encoderBand.visualKey)}
          </div>
        </div>

        ${slide.bandDivider ? `<div class="ms-band-divider"><span class="ms-divider-encoder">Encoder</span><span class="ms-divider-decoder">Decoder</span></div>` : ''}
        <div class="ms-band-card decoder-band anim-item" data-anim="fade-up"${weights ? ` style="--stagger:2;height:auto;flex:${weights[1]} 1 0"` : ' style="--stagger:2"'}>
          ${!slide.bandDivider ? `<div class="ms-band-header"><span class="ms-band-tag tag-decoder">${slide.decoderBand.bandTag}</span>${this.buildBandMetaStrip(slide.decoderBand.metaPills)}</div>` : ''}
          <div class="ms-svg-canvas">
            ${this.resolveVisual(slide.decoderBand.visualKey)}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Layout 3: Pipeline Slide (Phase Track + Step Cards + Multi-Line Math & Tensor Dock)
   */
  buildPipelineSlide(slide) {
    const requestedColumns = Number.isInteger(slide.cols) && slide.cols > 0 ? slide.cols : slide.steps.length;
    const colCount = Math.max(1, Math.min(requestedColumns, slide.steps.reduce((total, step) => total + (step.colSpan || 1), 0) || 1, 7));
    const density = colCount >= 6 ? ' density-compact' : '';

    const phaseTrackHtml = this.buildPhaseTrack(slide.phases, colCount);

    const stepCardsHtml = slide.steps.map((step, i) => `
      <article class="pipe-step-card theme-${step.theme || 'blue'} ${step.focal ? 'is-focal-step ' : ''}${((i + 1) % colCount === 0) ? 'row-end ' : ''}anim-item" data-anim="fade-up" data-col-idx="${i}" style="--stagger:${i + 1}; grid-column: span ${Math.min(step.colSpan || 1, colCount)}">
        <div class="pipe-card-top">
          <div class="pipe-step-meta">
            <div class="pipe-step-meta-left">
              <span class="pipe-step-code">${step.stepCode}</span>
              <h3 class="pipe-step-title">${this.formatInlineMath(step.title)}</h3>
            </div>
            ${step.role ? `<span class="pipe-step-role-badge">${this.formatInlineMath(step.role)}</span>` : ''}
          </div>
        </div>
        <div class="pipe-visual-frame">
          ${this.resolveVisual(step.visualKey)}
        </div>
        ${slide.showStepCaptions === false ? '' : `<div class="pipe-step-caption">
          ${step.caption ? `<span>${this.formatInlineMath(step.caption)}</span>` : this.buildStepSemantics(step)}
        </div>`}
      </article>
    `).join('');

    const chainNodesHtml = slide.steps.map((step, i) => {
      const formulaLines = Array.isArray(step.chainLatex) ? step.chainLatex : [step.chainLatex];
      const mathLinesHtml = formulaLines.map(line => `
        <div class="math-line">
          <span class="latex-formula" data-latex="${this.escapeAttr(line)}" data-display="true"></span>
        </div>
      `).join('');

      return `
        <div class="chain-node-card theme-${step.theme || 'blue'} ${step.focal ? 'is-focal-step ' : ''}anim-item" data-anim="fade-up" data-col-idx="${i}" style="--stagger:${i + 2}; grid-column: span ${Math.min(step.colSpan || 1, colCount)}">
          <div class="chain-tier-math">
            ${mathLinesHtml}
          </div>
          ${step.chainDim ? `<div class="chain-tier-dim">
            <span class="dim-badge latex-formula" data-latex="${this.escapeAttr(step.chainDim)}" data-display="false"></span>
          </div>` : ''}
        </div>
      `;
    }).join('');

    return `
      <div class="pipeline-layout ${slide.uniformColor === 'blue' ? 'uniform-blue' : ''}">
        ${phaseTrackHtml}

        <div class="pipe-cards-grid cols-${colCount}${density}" style="--grid-columns:${colCount}">
          ${stepCardsHtml}
        </div>

        <div class="mapping-chain-panel">
          <div class="mapping-chain-grid cols-${colCount}${density}" style="--grid-columns:${colCount}">
            ${chainNodesHtml}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Layout 4: Modern 12-Column Bento Grid Slide (`bento-slide`)
   */
  buildBentoSlide(slide) {
    const cardsHtml = (slide.bentoCards || []).map((card, i) => `
      <article class="bento-card theme-${card.theme || 'blue'} anim-item" data-anim="fade-up" style="--stagger:${i + 1};--bento-col:${card.colSpan || 4};--bento-row:${card.rowSpan || 1}">
        <div class="bento-card-head">
          <div class="bento-card-title-group">
            <span class="bento-card-badge">${this.formatInlineMath(card.code || `MODULE 0${i + 1}`)}</span>
            <h3 class="bento-card-title">${this.formatInlineMath(card.title)}</h3>
          </div>
          ${card.tag ? `<span class="pipe-step-role-badge">${this.formatInlineMath(card.tag)}</span>` : ''}
        </div>
        <div class="bento-card-body">
          ${card.visualKey ? `<div class="bento-visual-box">${this.resolveVisual(card.visualKey)}</div>` : ''}
          ${this.buildStepSemantics(card)}
          ${card.evidence ? `<blockquote class="bento-evidence"><p>${this.formatInlineMath(card.evidence.text)}</p>${card.evidence.highlight ? `<p><strong>${this.formatInlineMath(card.evidence.highlight)}</strong></p>` : ''}</blockquote>${card.evidence.translation ? `<blockquote class="bento-evidence"><p>${this.formatInlineMath(card.evidence.translation)}</p><p><strong>${this.formatInlineMath(card.evidence.translationHighlight)}</strong></p></blockquote>` : ''}` : ''}
          ${Array.isArray(card.notes) && card.notes.length ? `<div class="bento-notes">${card.notes.map(note => `<p>${this.formatInlineMath(note)}</p>`).join('')}</div>` : ''}
        </div>
      </article>
    `).join('');

    return `
      <div class="bento-layout">
        <div class="bento-grid">
          ${cardsHtml}
        </div>
        ${this.buildCalloutBanner(slide.callout)}
      </div>
    `;
  },

  /**
   * Layout 5: Quantitative & Visual Benchmark Slide (`benchmark-slide`)
   */
  buildBenchmarkSlide(slide) {
    const leftPanel = slide.leftPanel || {};
    const rightPanel = slide.rightPanel || {};

    return `
      <div class="benchmark-layout">
        ${this.buildKPICards(slide.kpis)}

        <div class="benchmark-main-grid">
          <article class="bento-card theme-blue anim-item" data-anim="fade-up" style="--stagger:2">
            <div class="bento-card-head">
              <div class="bento-card-title-group">
                <span class="bento-card-badge">${this.formatInlineMath(leftPanel.code || 'BENCHMARK 01')}</span>
                <h3 class="bento-card-title">${this.formatInlineMath(leftPanel.title || '主流方法性能对比')}</h3>
              </div>
              ${leftPanel.tag ? `<span class="pipe-step-role-badge">${this.formatInlineMath(leftPanel.tag)}</span>` : ''}
            </div>
            <div class="bento-card-body">
              ${leftPanel.visualKey ? `<div class="bento-visual-box">${this.resolveVisual(leftPanel.visualKey)}</div>` : ''}
              ${this.buildComparisonBars(leftPanel.bars)}
            </div>
          </article>

          <article class="bento-card theme-indigo anim-item" data-anim="fade-up" style="--stagger:3">
            <div class="bento-card-head">
              <div class="bento-card-title-group">
                <span class="bento-card-badge">${this.formatInlineMath(rightPanel.code || 'ANALYSIS 02')}</span>
                <h3 class="bento-card-title">${this.formatInlineMath(rightPanel.title || '计算效率与消融剖析')}</h3>
              </div>
              ${rightPanel.tag ? `<span class="pipe-step-role-badge">${this.formatInlineMath(rightPanel.tag)}</span>` : ''}
            </div>
            <div class="bento-card-body">
              ${rightPanel.visualKey ? `<div class="bento-visual-box">${this.resolveVisual(rightPanel.visualKey)}</div>` : ''}
              ${this.buildStepSemantics(rightPanel)}
            </div>
          </article>
        </div>

        ${this.buildCalloutBanner(slide.callout)}
      </div>
    `;
  },

  /**
   * Layout 6: Multi-Dimension Semantic Comparison Matrix Slide (`matrix-slide`)
   */
  buildMatrixSlide(slide) {
    const columns = slide.columns || [];
    const rows = slide.rows || [];

    const theadHtml = `
      <thead>
        <tr>
          ${columns.map(col => `<th>${this.formatInlineMath(col)}</th>`).join('')}
        </tr>
      </thead>
    `;

    const tbodyHtml = `
      <tbody>
        ${rows.map(row => `
          <tr class="${row.highlight ? 'is-highlight' : ''}">
            ${(row.cells || []).map(cell => {
              if (typeof cell === 'object' && cell !== null) {
                return `<td><span class="v-status-pill status-${cell.status || 'mid'}">${this.formatInlineMath(cell.text)}</span></td>`;
              }
              return `<td>${this.formatInlineMath(cell)}</td>`;
            }).join('')}
          </tr>
        `).join('')}
      </tbody>
    `;

    return `
      <div class="matrix-layout">
        ${this.buildPhaseTrack(slide.phases, (slide.phases || []).length || 3)}
        <div class="v-matrix-card anim-item" data-anim="fade-up" style="--stagger:2">
          <table class="v-matrix-table">
            ${theadHtml}
            ${tbodyHtml}
          </table>
        </div>
        ${this.buildCalloutBanner(slide.callout)}
      </div>
    `;
  }
};
