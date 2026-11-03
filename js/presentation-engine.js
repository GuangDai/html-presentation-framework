/**
 * ============================================================================
 * AURORA PRESENTATION FRAMEWORK — MODULAR RENDERING & INTERACTION ENGINE
 * ============================================================================
 * File: js/presentation-engine.js
 * Global Export: window.AuroraEngine
 *
 * ARCHITECTURE & RESPONSIBILITIES:
 * - Reads declarative content from `window.AuroraContent` (`decks/aurora/content.js`)
 * - Fetches pure SVG diagrams by key from `window.AuroraVisuals` (`decks/aurora/visuals.js`)
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

    this.configureDeckUI();
    this.init();
  }

  /** 将目录和总览入口交由演示数据配置。 */
  configureDeckUI() {
    const meta = this.content.deckMeta || {};
    if (meta.documentTitle) document.title = meta.documentTitle;
    this.homeSlide = Number.isInteger(meta.homeSlide) && meta.homeSlide >= 0 && meta.homeSlide < this.slides.length ? meta.homeSlide : null;
    const button = document.getElementById('hud-btn-arch');
    if (button) {
      button.hidden = this.homeSlide === null;
      if (this.homeSlide !== null) {
        button.textContent = meta.homeButtonLabel || `⊞ 总览 (P${this.homeSlide + 1})`;
        button.title = meta.homeButtonTitle || `返回第 ${this.homeSlide + 1} 页 (快捷键: M)`;
      }
    }
    const title = document.getElementById('toc-heading');
    if (title) title.textContent = `幻灯片目录导航 (快捷键: 1–${Math.min(this.slides.length, 9)} / T)`;
    const subtitle = document.getElementById('toc-subtitle');
    if (subtitle) subtitle.textContent = meta.tocSubtitle || '点击章节直达对应页面';
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
        <span class="pill-num">${String(idx + 1).padStart(2, '0')}</span>
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
        <span class="toc-num">${String(idx + 1).padStart(2, '0')}</span>
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
    // Keep the navigation rail within the fixed stage when a deck has many pages.
    const start = Math.max(0, Math.min(idx - 3, this.slides.length - 7));
    const visibleSlides = this.slides.slice(start, start + 7);
    const agendaHtml = visibleSlides.map((s, offset) => {
      const sIdx = start + offset;
      return `
      <button class="agenda-pill ${sIdx === idx ? 'active' : ''}" data-slide-idx="${sIdx}">
        <span class="pill-num">${String(sIdx + 1).padStart(2, '0')}</span>
        <span>${s.navTitle || s.title}</span>
      </button>
    `;
    }).join('');

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

      // Equalize regions within each actual grid row, including wrapped layouts.
      const equalizeRows = (container, cardSelector, selectors) => {
        if (!container) return;
        const cards = Array.from(container.querySelectorAll(cardSelector));
        const rows = new Map();
        cards.forEach(card => {
          const row = card.offsetTop;
          if (!rows.has(row)) rows.set(row, []);
          rows.get(row).push(card);
        });
        rows.forEach(rowCards => selectors.forEach(selector => {
          const nodes = rowCards.map(card => card.querySelector(selector)).filter(Boolean);
          nodes.forEach(node => { node.style.height = 'auto'; });
          if (nodes.length > 1) {
            const maxH = Math.max(...nodes.map(node => node.offsetHeight));
            if (maxH > 0) nodes.forEach(node => { node.style.height = `${maxH}px`; });
          }
        }));
      };
      equalizeRows(frame.querySelector('.pipe-cards-grid'), '.pipe-step-card', [
        '.pipe-card-top', '.pipe-step-caption'
      ]);
      equalizeRows(frame.querySelector('.mapping-chain-grid'), '.chain-node-card', [
        '.chain-tier-op', '.chain-tier-math', '.chain-tier-dim'
      ]);
      frame.querySelectorAll('.contrast-cards-grid').forEach(grid => {
        equalizeRows(grid, '.contrast-card', ['.contrast-card-head', '.contrast-points']);
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

      const mathCache = window.PresentationMathSvgs || window.AURORA_MATH_SVGS;
      if (mathCache && mathCache[latex]) {
        node.innerHTML = mathCache[latex];
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
    if (btnHome) btnHome.addEventListener('click', () => { if (this.homeSlide !== null) this.goToSlide(this.homeSlide); });
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
        if (this.homeSlide !== null) this.goToSlide(this.homeSlide);
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

Object.assign(AuroraPresentationEngine.prototype, window.PresentationLayouts);
window.PresentationEngine = AuroraPresentationEngine;
window.AuroraEngine = AuroraPresentationEngine;

document.addEventListener('DOMContentLoaded', () => {
  const content = window.PresentationContent || window.AuroraContent;
  const visuals = window.PresentationVisuals || window.AuroraVisuals || {};
  if (content) {
    window.presentationApp = new AuroraPresentationEngine(content, visuals);
    window.auroraApp = window.presentationApp;
  }
});
