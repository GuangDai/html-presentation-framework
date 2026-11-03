/** 可复用的三种页面布局；论文内容与图形由演示数据提供。 */
window.PresentationLayouts = {
  /**
   * Layout 1: Contrast Slide (Slide 1 — Top Challenges vs Bottom Contributions)
   */
  buildContrastSlide(slide) {
    const topCards = slide.challengesSection.cards.map((card, i) => `
      <article class="contrast-card anim-item" data-anim="fade-up" style="--stagger:${i + 1}">
        <div class="contrast-card-head">
          <span class="contrast-card-tag">${card.code}</span>
          <h3 class="contrast-card-title">${this.formatInlineMath(card.title)}</h3>
        </div>
        <div class="contrast-visual">
          ${this.resolveVisual(card.visualKey)}
        </div>
        <ul class="contrast-points">
          ${card.points.map(pt => `<li>${this.formatInlineMath(pt)}</li>`).join('')}
        </ul>
      </article>
    `).join('');

    const bottomCards = slide.contributionsSection.cards.map((card, i) => `
      <article class="contrast-card ${card.jumpToSlide !== undefined ? 'clickable-card ' : ''}anim-item" data-anim="fade-up" style="--stagger:${i + 4}" ${card.jumpToSlide !== undefined ? `data-jump-slide="${card.jumpToSlide}"` : ''}>
        <div class="contrast-card-head">
          <span class="contrast-card-tag">${card.code}</span>
          <h3 class="contrast-card-title">${this.formatInlineMath(card.title)}</h3>
        </div>
        <div class="contrast-visual">
          ${this.resolveVisual(card.visualKey)}
        </div>
        <ul class="contrast-points">
          ${card.points.map(pt => `<li>${this.formatInlineMath(pt)}</li>`).join('')}
        </ul>
      </article>
    `).join('');

    return `
      <div class="contrast-layout">
        <div class="contrast-band band-challenges">
          <div class="band-header">
            <span class="band-badge">${slide.challengesSection.headerTag}</span>
          </div>
          <div class="contrast-cards-grid" style="--grid-columns:${Math.max(1, Math.min(7, slide.challengesSection.cards.length))}">
            ${topCards}
          </div>
        </div>

        ${slide.connectors && slide.connectors.length ? `<div class="contrast-connectors anim-item" data-anim="scale-in" style="--stagger:3;--grid-columns:${Math.min(7, slide.connectors.length)}">
          ${(slide.connectors || []).map(label => `<div class="connector-pill">${this.formatInlineMath(label)}</div>`).join('')}
        </div>` : ''}

        <div class="contrast-band band-contributions">
          <div class="band-header">
            <span class="band-badge">${slide.contributionsSection.headerTag}</span>
          </div>
          <div class="contrast-cards-grid" style="--grid-columns:${Math.max(1, Math.min(7, slide.contributionsSection.cards.length))}">
            ${bottomCards}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Layout 2: Multi-Stream Architecture Slide (Slide 2 — Upper Encoder Band + Lower Decoder Band)
   */
  buildArchitectureSlide(slide) {
    const weights = Array.isArray(slide.bandWeights) && slide.bandWeights.length === 2 &&
      slide.bandWeights.every(value => typeof value === 'number' && Number.isFinite(value) && value > 0)
      ? slide.bandWeights : null;
    return `
      <div class="ms-arch-stage">
        <div class="ms-band-card encoder-band anim-item" data-anim="fade-up"${weights ? ` style="--stagger:1;height:auto;flex:${weights[0]} 1 0"` : ' style="--stagger:1"'}>
          <div class="ms-band-header">
            <span class="ms-band-tag tag-encoder">${slide.encoderBand.bandTag}</span>
          </div>
          <div class="ms-svg-canvas">
            ${this.resolveVisual(slide.encoderBand.visualKey)}
          </div>
        </div>

        <div class="ms-band-card decoder-band anim-item" data-anim="fade-up"${weights ? ` style="--stagger:2;height:auto;flex:${weights[1]} 1 0"` : ' style="--stagger:2"'}>
          <div class="ms-band-header">
            <span class="ms-band-tag tag-decoder">${slide.decoderBand.bandTag}</span>
          </div>
          <div class="ms-svg-canvas">
            ${this.resolveVisual(slide.decoderBand.visualKey)}
          </div>
        </div>
      </div>
    `;
  },

  /**
   * Layout 3: Pipeline Slide (Slides 3–7 — Step Cards + Compact Multi-Line Formula Chain)
   */
  buildPipelineSlide(slide) {
    const requestedColumns = Number.isInteger(slide.cols) && slide.cols > 0 ? slide.cols : slide.steps.length;
    const colCount = Math.max(1, Math.min(requestedColumns, slide.steps.length || 1, 7));
    const density = colCount === 6 ? ' density-compact' : '';

    const stepCardsHtml = slide.steps.map((step, i) => `
      <article class="pipe-step-card theme-${step.theme || 'blue'} ${((i + 1) % colCount === 0) ? 'row-end ' : ''}anim-item" data-anim="fade-up" style="--stagger:${i + 1}">
        <div class="pipe-card-top">
          <div class="pipe-step-meta">
            <span class="pipe-step-code">${step.stepCode}</span>
            <h3 class="pipe-step-title">${this.formatInlineMath(step.title)}</h3>
          </div>
        </div>
        <div class="pipe-visual-frame">
          ${this.resolveVisual(step.visualKey)}
        </div>
        <div class="pipe-step-caption">
          <span>${this.formatInlineMath(step.caption)}</span>
        </div>
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
        <div class="chain-node-card theme-${step.theme || 'blue'} anim-item" data-anim="fade-up" style="--stagger:${i + 2}">
          <div class="chain-tier-op">
            <span class="chain-step-idx">0${i + 1}</span>
            <span class="chain-op-label">${this.formatInlineMath(step.chainOp)}</span>
          </div>
          <div class="chain-tier-math">
            ${mathLinesHtml}
          </div>
          <div class="chain-tier-dim">
            <span class="dim-badge latex-formula" data-latex="${this.escapeAttr(step.chainDim)}" data-display="false"></span>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="pipeline-layout">
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
  }
};
