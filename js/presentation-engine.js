/**
 * ============================================================================
 * AURORA PRESENTATION FRAMEWORK — MODULAR RENDERING & INTERACTION ENGINE
 * ============================================================================
 * File: js/presentation-engine.js
 * Global Export: window.AuroraEngine
 *
 * ARCHITECTURE & RESPONSIBILITIES:
 * - Reads declarative content from `window.AuroraContent` (`js/slide-content.js`)
 * - Fetches pure SVG diagrams by key from `window.AuroraVisuals` (`js/visuals-library.js`)
 * - Renders multi-part/long equations on separate stacked lines (`.math-line`)
 *   inside compact formula boxes.
 * - Dynamically measures and equalizes the heights of card headers, captions,
 *   operation titles, formula boxes, and dimension bars across all columns on
 *   each slide (`equalizeAllSlidesRegions`) so every region matches the tallest
 *   element in its row with pixel-level visual uniformity.
 * ============================================================================
 */

class AuroraPresentationEngine {
  /**
   * @param {Object} contentData - Declarative deck schema (`window.AuroraContent`)
   * @param {Object} visualsLibrary - Key-indexed SVG map (`window.AuroraVisuals`)
   */
  constructor(contentData, visualsLibrary) {
    this.content = contentData;
    this.visuals = visualsLibrary;
    this.slides = contentData.slides || [];
    this.currentSlideIndex = 0;
    this.animSpeed = (contentData.deckMeta && contentData.deckMeta.defaultAnimSpeed) || 'normal';

    this.dom = {
      viewport: document.getElementById('viewport-scaler'),
      stage: document.getElementById('presentation-stage'),
      slideContainer: document.getElementById('slides-container'),
      headerAgenda: document.getElementById('header-agenda-rail'),
      tocList: document.getElementById('toc-list'),
      tocDrawer: document.getElementById('toc-drawer'),
      animDrawer: document.getElementById('anim-drawer'),
      backdrop: document.getElementById('drawer-backdrop'),
      pageCounter: document.getElementById('hud-page-counter')
    };

    this.init();
  }

  /**
   * Initialize presentation DOM, math typesetting, dynamic height equalization, and events
   */
  init() {
    this.renderHeaderAgenda();
    this.renderTocDrawer();
    this.renderAllSlides();
    this.typesetAllMath();
    this.equalizeAllSlidesRegions();
    this.bindEvents();
    this.applyAnimationSpeed(this.animSpeed);
    this.updateViewportScale();
    this.goToSlide(0, false);
  }

  /**
   * Resolve a `visualKey` from `window.AuroraVisuals`
   */
  resolveVisual(visualKey) {
    if (!visualKey || !this.visuals) return '';
    if (typeof this.visuals[visualKey] === 'string') {
      return this.visuals[visualKey];
    }
    const parts = visualKey.split('.');
    let cursor = this.visuals;
    for (const part of parts) {
      if (cursor && Object.prototype.hasOwnProperty.call(cursor, part)) {
        cursor = cursor[part];
      } else {
        return '';
      }
    }
    return typeof cursor === 'string' ? cursor : '';
  }

  /**
   * Convert inline `$latex$` segments within a text string into `.latex-formula` spans
   */
  formatInlineMath(str) {
    if (!str) return '';
    return String(str).replace(/\$([^$]+)\$/g, (_, latex) => {
      const escaped = this.escapeAttr(latex.trim());
      return `<span class="latex-formula latex-inline" data-latex="${escaped}" data-display="false"></span>`;
    });
  }

  /**
   * Render top-right integrated Agenda Rail pills
   */
  renderHeaderAgenda() {
    if (!this.dom.headerAgenda) return;
    this.dom.headerAgenda.innerHTML = this.slides.map((slide, idx) => `
      <button class="agenda-pill" data-slide-idx="${idx}" title="${slide.title}">
        <span class="pill-num">0${idx + 1}</span>
        <span>${slide.navTitle || slide.title}</span>
      </button>
    `).join('');
  }

  /**
   * Render slide directory items inside the collapsible TOC drawer
   */
  renderTocDrawer() {
    if (!this.dom.tocList) return;
    this.dom.tocList.innerHTML = this.slides.map((slide, idx) => `
      <div class="toc-item" data-slide-idx="${idx}">
        <span class="toc-num">0${idx + 1}</span>
        <div class="toc-text">
          <div class="toc-title">${slide.title}</div>
          <div class="toc-sub">${slide.subtitle}</div>
        </div>
      </div>
    `).join('');
  }

  /**
   * Render all slides into `#slides-container`
   */
  renderAllSlides() {
    if (!this.dom.slideContainer) return;
    this.dom.slideContainer.innerHTML = this.slides.map((slide, idx) => {
      let bodyHtml = '';
      if (slide.layout === 'contrast-slide') {
        bodyHtml = this.buildContrastSlide(slide);
      } else if (slide.layout === 'architecture-slide') {
        bodyHtml = this.buildArchitectureSlide(slide);
      } else if (slide.layout === 'pipeline-slide') {
        bodyHtml = this.buildPipelineSlide(slide);
      }

      return `
        <section class="slide-frame" id="${slide.id}" data-index="${idx}">
          ${this.buildSlideHeader(slide, idx)}
          <div class="slide-body">
            ${bodyHtml}
          </div>
        </section>
      `;
    }).join('');
  }

  /**
   * Build the standardized top header bar
   */
  buildSlideHeader(slide, idx) {
    const agendaHtml = this.slides.map((s, sIdx) => `
      <button class="agenda-pill ${sIdx === idx ? 'active' : ''}" data-slide-idx="${sIdx}">
        <span class="pill-num">0${sIdx + 1}</span>
        <span>${s.navTitle}</span>
      </button>
    `).join('');

    return `
      <header class="slide-header anim-item" data-anim="fade-down" style="--stagger:0">
        <div class="slide-header-left">
          <h1 class="slide-title">${this.formatInlineMath(slide.title)}</h1>
          <p class="slide-subtitle">${this.formatInlineMath(slide.subtitle)}</p>
        </div>
        <nav class="slide-agenda-rail" aria-label="Slide Navigation">
          ${agendaHtml}
        </nav>
      </header>
    `;
  }

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
      <article class="contrast-card clickable-card anim-item" data-anim="fade-up" style="--stagger:${i + 4}" data-jump-slide="${card.jumpToSlide !== undefined ? card.jumpToSlide : 1}">
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
          <div class="contrast-cards-grid">
            ${topCards}
          </div>
        </div>

        <div class="contrast-connectors anim-item" data-anim="scale-in" style="--stagger:3">
          <div class="connector-pill">⬇ 频域周期折叠 + 三路协同编码</div>
          <div class="connector-pill">⬇ 质心自适应蒸馏 + 双路相关性引导</div>
          <div class="connector-pill">⬇ 先验基波原型检索 + 直线流匹配生成</div>
        </div>

        <div class="contrast-band band-contributions">
          <div class="band-header">
            <span class="band-badge">${slide.contributionsSection.headerTag}</span>
          </div>
          <div class="contrast-cards-grid">
            ${bottomCards}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Layout 2: Multi-Stream Architecture Slide (Slide 2 — Upper Encoder Band + Lower Decoder Band)
   */
  buildArchitectureSlide(slide) {
    return `
      <div class="ms-arch-stage">
        <div class="ms-band-card encoder-band anim-item" data-anim="fade-up" style="--stagger:1">
          <div class="ms-band-header">
            <span class="ms-band-tag tag-encoder">${slide.encoderBand.bandTag}</span>
          </div>
          <div class="ms-svg-canvas">
            ${this.resolveVisual(slide.encoderBand.visualKey)}
          </div>
        </div>

        <div class="ms-band-card decoder-band anim-item" data-anim="fade-up" style="--stagger:2">
          <div class="ms-band-header">
            <span class="ms-band-tag tag-decoder">${slide.decoderBand.bandTag}</span>
          </div>
          <div class="ms-svg-canvas">
            ${this.resolveVisual(slide.decoderBand.visualKey)}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Layout 3: Pipeline Slide (Slides 3–7 — Step Cards + Compact Multi-Line Formula Chain)
   */
  buildPipelineSlide(slide) {
    const colCount = slide.cols || slide.steps.length;

    const stepCardsHtml = slide.steps.map((step, i) => `
      <article class="pipe-step-card theme-${step.theme || 'blue'} anim-item" data-anim="fade-up" style="--stagger:${i + 1}">
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
        <div class="pipe-cards-grid cols-${colCount}">
          ${stepCardsHtml}
        </div>

        <div class="mapping-chain-panel">
          <div class="mapping-chain-grid cols-${colCount}">
            ${chainNodesHtml}
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Dynamically equalize the height of corresponding regions across cards in the same row
   * so that every region (`.pipe-card-top`, `.pipe-step-caption`, `.chain-tier-op`,
   * `.chain-tier-math`, `.chain-tier-dim`, `.contrast-card-head`, `.contrast-points`)
   * matches the maximum height in its group!
   */
  equalizeAllSlidesRegions() {
    const prevTransform = this.dom.stage ? this.dom.stage.style.transform : '';
    if (this.dom.stage) {
      this.dom.stage.style.transform = 'none';
    }

    const allFrames = document.querySelectorAll('.slide-frame');
    allFrames.forEach(frame => {
      const wasActive = frame.classList.contains('active');
      if (!wasActive) {
        frame.style.display = 'flex';
        frame.style.visibility = 'hidden';
      }

      // 1. Equalize pipeline slide regions
      const pipeGroups = [
        '.pipe-card-top',
        '.pipe-step-caption',
        '.chain-tier-op',
        '.chain-tier-math',
        '.chain-tier-dim'
      ];
      pipeGroups.forEach(selector => {
        const nodes = Array.from(frame.querySelectorAll(selector));
        if (nodes.length > 1) {
          nodes.forEach(el => { el.style.height = 'auto'; });
          const maxH = Math.max(...nodes.map(el => el.offsetHeight));
          if (maxH > 0) {
            nodes.forEach(el => { el.style.height = `${maxH}px`; });
          }
        }
      });

      // 2. Equalize contrast slide regions per band
      frame.querySelectorAll('.contrast-band').forEach(band => {
        ['.contrast-card-head', '.contrast-points'].forEach(selector => {
          const nodes = Array.from(band.querySelectorAll(selector));
          if (nodes.length > 1) {
            nodes.forEach(el => { el.style.height = 'auto'; });
            const maxH = Math.max(...nodes.map(el => el.offsetHeight));
            if (maxH > 0) {
              nodes.forEach(el => { el.style.height = `${maxH}px`; });
            }
          }
        });
      });

      if (!wasActive) {
        frame.style.display = '';
        frame.style.visibility = '';
      }
    });

    if (this.dom.stage) {
      this.dom.stage.style.transform = prevTransform;
    }
  }

  /**
   * Escape double quotes for HTML attribute embedding
   */
  escapeAttr(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }

  /**
   * Typeset all `.latex-formula[data-latex]` elements at a uniform font size
   */
  typesetAllMath() {
    const mathNodes = document.querySelectorAll('.latex-formula[data-latex]');
    mathNodes.forEach(node => {
      const latex = node.getAttribute('data-latex');
      if (!latex) return;

      if (window.katex && typeof window.katex.render === 'function') {
        try {
          window.katex.render(latex, node, {
            displayMode: false,
            throwOnError: false,
            strict: false
          });
          return;
        } catch (err) {
          console.warn('[AuroraEngine] KaTeX render warning:', err);
        }
      }

      if (window.MathJax && typeof window.MathJax.tex2svg === 'function') {
        try {
          const svgWrapper = window.MathJax.tex2svg(latex, { display: false });
          node.innerHTML = svgWrapper.innerHTML;
          return;
        } catch (err) {
          console.warn('[AuroraEngine] MathJax render warning:', err);
        }
      }

      if (window.AURORA_MATH_SVGS && window.AURORA_MATH_SVGS[latex]) {
        node.innerHTML = window.AURORA_MATH_SVGS[latex];
        return;
      }

      node.textContent = latex;
    });
  }

  /**
   * Navigate to a specific 0-based slide index
   */
  goToSlide(targetIdx, animate = true) {
    const total = this.slides.length;
    if (targetIdx < 0 || targetIdx >= total) return;

    this.currentSlideIndex = targetIdx;

    const allFrames = document.querySelectorAll('.slide-frame');
    allFrames.forEach((frame, idx) => {
      if (idx === targetIdx) {
        frame.classList.add('active');
        if (animate && this.animSpeed !== 'off') {
          this.triggerSlideAnimations(frame);
        }
      } else {
        frame.classList.remove('active');
      }
    });

    document.querySelectorAll('.toc-item').forEach((item, idx) => {
      item.classList.toggle('active', idx === targetIdx);
    });

    if (this.dom.pageCounter) {
      this.dom.pageCounter.textContent = `${targetIdx + 1} / ${total}`;
    }

    this.closeDrawers();
  }

  /**
   * Re-trigger entrance animations on the newly active slide
   */
  triggerSlideAnimations(slideEl) {
    const items = slideEl.querySelectorAll('.anim-item');
    items.forEach(el => {
      el.classList.remove('anim-play');
      void el.offsetWidth;
      el.classList.add('anim-play');
    });
  }

  /**
   * Apply global animation speed preset ('off' | 'fast' | 'normal' | 'slow')
   */
  applyAnimationSpeed(speedMode) {
    this.animSpeed = speedMode;
    document.body.setAttribute('data-anim-speed', speedMode);

    document.querySelectorAll('[data-speed-option]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-speed-option') === speedMode);
    });
  }

  /**
   * Scale the 1920x1080 stage proportionally to fit any browser window
   */
  updateViewportScale() {
    if (!this.dom.stage) return;
    if (document.body.classList.contains('export-mode')) {
      this.dom.stage.style.transform = 'none';
      return;
    }
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const scale = Math.min(vw / 1920, vh / 1080);
    this.dom.stage.style.transform = `scale(${scale})`;
  }

  /**
   * Open/close TOC or Animation Configuration drawers
   */
  toggleDrawer(drawerEl) {
    if (!drawerEl) return;
    const isOpen = drawerEl.classList.contains('open');
    this.closeDrawers();
    if (!isOpen) {
      drawerEl.classList.add('open');
      if (this.dom.backdrop) this.dom.backdrop.classList.add('open');
    }
  }

  closeDrawers() {
    if (this.dom.tocDrawer) this.dom.tocDrawer.classList.remove('open');
    if (this.dom.animDrawer) this.dom.animDrawer.classList.remove('open');
    if (this.dom.backdrop) this.dom.backdrop.classList.remove('open');
  }

  /**
   * Bind all UI click, keyboard, and resize listeners
   */
  bindEvents() {
    window.addEventListener('resize', () => {
      this.equalizeAllSlidesRegions();
      this.updateViewportScale();
    });

    document.addEventListener('click', (e) => {
      const agendaBtn = e.target.closest('[data-slide-idx]');
      if (agendaBtn) {
        const idx = parseInt(agendaBtn.getAttribute('data-slide-idx'), 10);
        if (!isNaN(idx)) this.goToSlide(idx);
        return;
      }

      const jumpNode = e.target.closest('[data-jump-slide]');
      if (jumpNode) {
        const slideIdx = parseInt(jumpNode.getAttribute('data-jump-slide'), 10);
        if (!isNaN(slideIdx)) this.goToSlide(slideIdx);
        return;
      }

      const speedBtn = e.target.closest('[data-speed-option]');
      if (speedBtn) {
        this.applyAnimationSpeed(speedBtn.getAttribute('data-speed-option'));
        return;
      }
    });

    const btnPrev = document.getElementById('hud-btn-prev');
    const btnNext = document.getElementById('hud-btn-next');
    const btnHome = document.getElementById('hud-btn-arch');
    const btnToc = document.getElementById('hud-btn-toc');
    const btnAnim = document.getElementById('hud-btn-anim');

    if (btnPrev) btnPrev.addEventListener('click', () => this.goToSlide(this.currentSlideIndex - 1));
    if (btnNext) btnNext.addEventListener('click', () => this.goToSlide(this.currentSlideIndex + 1));
    if (btnHome) btnHome.addEventListener('click', () => this.goToSlide(1));
    if (btnToc) btnToc.addEventListener('click', () => this.toggleDrawer(this.dom.tocDrawer));
    if (btnAnim) btnAnim.addEventListener('click', () => this.toggleDrawer(this.dom.animDrawer));
    if (this.dom.backdrop) this.dom.backdrop.addEventListener('click', () => this.closeDrawers());

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        this.goToSlide(this.currentSlideIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        this.goToSlide(this.currentSlideIndex - 1);
      } else if (e.key === 'm' || e.key === 'M' || e.key === 'Home') {
        e.preventDefault();
        this.goToSlide(1);
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        this.toggleDrawer(this.dom.tocDrawer);
      } else if (e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        this.toggleDrawer(this.dom.animDrawer);
      } else if (e.key === 'Escape') {
        this.closeDrawers();
      } else if (/^[1-9]$/.test(e.key)) {
        const num = parseInt(e.key, 10) - 1;
        if (num < this.slides.length) this.goToSlide(num);
      }
    });
  }
}

window.AuroraEngine = AuroraPresentationEngine;

document.addEventListener('DOMContentLoaded', () => {
  if (window.AuroraContent && window.AuroraVisuals) {
    window.auroraApp = new AuroraPresentationEngine(window.AuroraContent, window.AuroraVisuals);
  }
});
