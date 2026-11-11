/**
 * ============================================================================
 * AURORA PRESENTATION FRAMEWORK — MODULAR RENDERING & INTERACTION ENGINE
 * ============================================================================
 * File: js/presentation-engine.js
 * Global Export: window.PresentationEngine / window.AuroraEngine
 *
 * CAPABILITIES:
 * - Renders 7 layouts (`contrast-slide`, `architecture-slide`, `pipeline-slide`,
 *   `bento-slide`, `benchmark-slide`, `matrix-slide`, `canvas-slide`)
 * - Integrates declarative visual-semantic components (`window.PresentationComponents`)
 * - Typesets TeX via KaTeX / MathJax / 100% pre-compiled offline vector SVG cache
 * - Equalizes sibling card regions across rows with pixel-level precision
 * - Supports interactive Step Spotlight Mode (press `S` or double-click a card)
 * - Supports live Deck Switching via HUD drawer (`D` key) or `?deck=` URL param
 * ============================================================================
 */

class AuroraPresentationEngine {
  constructor(contentData, visualsLibrary) {
    const requestedVariant = new URLSearchParams(window.location.search).get('style');
    const prepared = window.PresentationVariants.prepare(contentData, requestedVariant);
    this.content = prepared.content;
    this.variant = prepared.key;
    this.firstPageBySource = prepared.firstPageBySource;
    this.visuals = visualsLibrary;
    this.slides = this.content.slides || [];
    this.currentSlideIndex = 0;
    this.spotlightColIndex = null;
    this.animSpeed = (this.content.deckMeta && this.content.deckMeta.defaultAnimSpeed) || 'normal';

    this.dom = {
      viewport: document.getElementById('viewport-scaler'),
      stage: document.getElementById('presentation-stage'),
      slideContainer: document.getElementById('slides-container'),
      tocList: document.getElementById('toc-list'),
      tocDrawer: document.getElementById('toc-drawer'),
      animDrawer: document.getElementById('anim-drawer'),
      deckDrawer: document.getElementById('deck-drawer'),
      backdrop: document.getElementById('drawer-backdrop'),
      pageCounter: document.getElementById('hud-page-counter')
    };

    this.configureDeckUI();
    this.init();
  }

  /** Configure deck-specific titles, home button, and deck switcher state */
  configureDeckUI() {
    const meta = this.content.deckMeta || {};
    if (meta.documentTitle) document.title = meta.documentTitle;
    this.homeSlide = Number.isInteger(meta.homeSlide) && meta.homeSlide >= 0 && meta.homeSlide < this.slides.length
      ? meta.homeSlide : null;
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

    const variantSelect = document.getElementById('hud-variant');
    if (variantSelect) variantSelect.value = this.variant;

    const currentDeck = window.ACTIVE_DECK_NAME || 'aurora';
    document.querySelectorAll('[data-deck-option]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-deck-option') === currentDeck);
    });
  }

  /** Initialize DOM, math rendering, row height equalization, and listeners */
  init() {
    this.renderTocDrawer();
    this.renderAllSlides();
    this.typesetAllMath();
    this.equalizeAllSlidesRegions();
    this.bindEvents();
    this.applyAnimationSpeed(this.animSpeed);
    this.updateViewportScale();
    this.goToSlide(0, false);
  }

  /** Resolve a `visualKey` from `window.PresentationVisuals` / `window.AuroraVisuals` */
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

  /** Convert inline `$latex$` segments within text into `.latex-formula` spans */
  formatInlineMath(str) {
    if (str === undefined || str === null) return '';
    return String(str).replace(/\$([^$]+)\$/g, (_, latex) => {
      const escaped = this.escapeAttr(latex.trim());
      return `<span class="latex-formula latex-inline" data-latex="${escaped}" data-display="false"></span>`;
    });
  }

  /** Render top-right Agenda Rail pills */
  renderHeaderAgenda() {
    if (!this.dom.headerAgenda) return;
    this.dom.headerAgenda.innerHTML = this.slides.map((slide, idx) => `
      <button class="agenda-pill" data-slide-idx="${idx}" title="${slide.title}">
        <span class="pill-num">${idx + 1}</span>
        <span>${slide.navTitle || slide.title}</span>
      </button>
    `).join('');
  }

  /** Render TOC Drawer items */
  renderTocDrawer() {
    if (!this.dom.tocList) return;
    this.dom.tocList.innerHTML = this.slides.map((slide, idx) => `
      <div class="toc-item" data-slide-idx="${idx}">
        <span class="toc-num">${idx + 1}</span>
        <div class="toc-text">
          <div class="toc-title">${this.formatInlineMath(slide.title)}</div>
          <div class="toc-sub">${this.formatInlineMath(slide.subtitle)}</div>
        </div>
      </div>
    `).join('');
  }

  /** Render all slides into `#slides-container` */
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
      } else if (slide.layout === 'bento-slide') {
        bodyHtml = this.buildBentoSlide(slide);
      } else if (slide.layout === 'benchmark-slide') {
        bodyHtml = this.buildBenchmarkSlide(slide);
      } else if (slide.layout === 'matrix-slide') {
        bodyHtml = this.buildMatrixSlide(slide);
      } else if (slide.layout === 'canvas-slide') {
        bodyHtml = this.buildCanvasSlide(slide);
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

  /** Build the standardized top header bar with Section Tag + Title + Agenda Rail */
  buildSlideHeader(slide, idx) {
    const start = Math.max(0, Math.min(idx - 3, this.slides.length - 7));
    const visibleSlides = this.slides.slice(start, start + 7);
    const agendaHtml = visibleSlides.map((s, offset) => {
      const sIdx = start + offset;
      const stateClass = sIdx === idx ? 'active' : (sIdx < idx ? 'passed' : '');
      return `
        <button class="agenda-pill ${stateClass}" data-slide-idx="${sIdx}">
          <span class="pill-num">${sIdx + 1}</span>
          <span>${s.navTitle || s.title}</span>
        </button>
      `;
    }).join('');

    return `
      <header class="slide-header anim-item" data-anim="fade-down" style="--stagger:0">
        <div class="slide-header-left">
          <div class="slide-title-row">
            <h1 class="slide-title">${this.formatInlineMath(slide.title)}</h1>
          </div>
          ${slide.subtitle ? `<p class="slide-subtitle">${this.formatInlineMath(slide.subtitle)}</p>` : ""}
        </div>
        <nav class="slide-agenda-rail" aria-label="Slide Navigation">
          ${agendaHtml}
        </nav>
      </header>
    `;
  }

  /**
   * Dynamically equalize the height of corresponding regions across cards in the same row
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
        equalizeRows(grid, '.contrast-card', [
          '.contrast-card-head', '.contrast-points', '.v-diagnostic-panel'
        ]);
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

  /** Escape double quotes for HTML attribute embedding */
  escapeAttr(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  }

  /** Typeset formulas with the offline cache, KaTeX, or MathJax. */
  typesetAllMath(pendingOnly = false) {
    const mathNodes = document.querySelectorAll('.latex-formula[data-latex]');
    mathNodes.forEach(node => {
      if (pendingOnly && node.querySelector('svg, .katex, mjx-container')) return;
      const latex = node.getAttribute('data-latex');
      if (!latex) return;

      const mathCache = window.PresentationMathSvgs || window.AURORA_MATH_SVGS;

      if (mathCache && mathCache[latex]) {
        node.innerHTML = mathCache[latex];
        return;
      }

      if (window.katex && typeof window.katex.render === 'function') {
        try {
          window.katex.render(latex, node, {
            displayMode: false,
            throwOnError: false,
            strict: false
          });
          return;
        } catch (err) {
          console.warn('[PresentationEngine] KaTeX render warning:', err);
        }
      }

      if (window.MathJax && typeof window.MathJax.tex2svg === 'function') {
        try {
          const svgWrapper = window.MathJax.tex2svg(latex, { display: false });
          node.innerHTML = svgWrapper.innerHTML;
          return;
        } catch (err) {
          console.warn('[PresentationEngine] MathJax render warning:', err);
        }
      }

      node.textContent = latex;
    });
  }

  /** Navigate to a 0-based slide index */
  goToSlide(targetIdx, animate = true) {
    const total = this.slides.length;
    if (targetIdx < 0 || targetIdx >= total) return;

    this.clearSpotlight();
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

  /** Interactive Step Spotlight Mode: Highlight column `colIdx` on active slide */
  toggleSpotlight(colIdx = null) {
    const activeFrame = document.querySelector('.slide-frame.active');
    if (!activeFrame) return;

    const cards = activeFrame.querySelectorAll('[data-col-idx]');
    if (!cards.length) return;

    const maxCol = Math.max(...Array.from(cards).map(c => parseInt(c.getAttribute('data-col-idx'), 10)));
    if (colIdx === null) {
      if (this.spotlightColIndex === null) {
        this.spotlightColIndex = 0;
      } else if (this.spotlightColIndex < maxCol) {
        this.spotlightColIndex += 1;
      } else {
        this.clearSpotlight();
        return;
      }
    } else if (this.spotlightColIndex === colIdx) {
      this.clearSpotlight();
      return;
    } else {
      this.spotlightColIndex = colIdx;
    }

    activeFrame.classList.add('spotlight-mode');
    cards.forEach(card => {
      const cIdx = parseInt(card.getAttribute('data-col-idx'), 10);
      card.classList.toggle('spotlight-focused', cIdx === this.spotlightColIndex);
      card.classList.toggle('spotlight-dimmed', cIdx !== this.spotlightColIndex);
    });
  }

  clearSpotlight() {
    this.spotlightColIndex = null;
    document.querySelectorAll('.slide-frame.spotlight-mode').forEach(frame => {
      frame.classList.remove('spotlight-mode');
      frame.querySelectorAll('.spotlight-focused, .spotlight-dimmed').forEach(el => {
        el.classList.remove('spotlight-focused', 'spotlight-dimmed');
      });
    });
  }

  /** Re-trigger entrance animations on the newly active slide */
  triggerSlideAnimations(slideEl) {
    const items = slideEl.querySelectorAll('.anim-item');
    items.forEach(el => {
      el.classList.remove('anim-play');
      void el.offsetWidth;
      el.classList.add('anim-play');
    });
  }

  /** Apply global animation speed preset ('off' | 'fast' | 'normal' | 'slow') */
  applyAnimationSpeed(speedMode) {
    this.animSpeed = speedMode;
    document.body.setAttribute('data-anim-speed', speedMode);

    document.querySelectorAll('[data-speed-option]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-speed-option') === speedMode);
    });
  }

  /** Scale the 1920x1080 stage proportionally to fit any browser window */
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

  /** Open/close TOC, Animation, or Deck Switcher drawers */
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
    if (this.dom.deckDrawer) this.dom.deckDrawer.classList.remove('open');
    if (this.dom.backdrop) this.dom.backdrop.classList.remove('open');
  }

  /** Bind all UI click, double-click, keyboard, and resize listeners */
  bindEvents() {
    window.addEventListener('resize', () => {
      this.equalizeAllSlidesRegions();
      this.updateViewportScale();
    });

    document.addEventListener('dblclick', (e) => {
      const colCard = e.target.closest('[data-col-idx]');
      if (colCard) {
        const colIdx = parseInt(colCard.getAttribute('data-col-idx'), 10);
        if (!isNaN(colIdx)) this.toggleSpotlight(colIdx);
      }
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
        if (!isNaN(slideIdx)) {
          const target = this.firstPageBySource[slideIdx];
          if (target !== undefined) this.goToSlide(target);
        }
        return;
      }

      const speedBtn = e.target.closest('[data-speed-option]');
      if (speedBtn) {
        this.applyAnimationSpeed(speedBtn.getAttribute('data-speed-option'));
        return;
      }

      const deckBtn = e.target.closest('[data-deck-option]');
      if (deckBtn) {
        const targetDeck = deckBtn.getAttribute('data-deck-option');
        if (targetDeck) {
          const url = new URL(window.location.href);
          url.searchParams.set('deck', targetDeck);
          window.location.href = url.toString();
        }
        return;
      }
    });

    const variantSelect = document.getElementById('hud-variant');
    if (variantSelect) variantSelect.addEventListener('change', () => {
      const url = new URL(window.location.href);
      if (variantSelect.value === window.PresentationVariants.defaultVariant) url.searchParams.delete('style');
      else url.searchParams.set('style', variantSelect.value);
      window.location.href = url.toString();
    });

    const btnPrev = document.getElementById('hud-btn-prev');
    const btnNext = document.getElementById('hud-btn-next');
    const btnHome = document.getElementById('hud-btn-arch');
    const btnToc = document.getElementById('hud-btn-toc');
    const btnAnim = document.getElementById('hud-btn-anim');
    const btnDeck = document.getElementById('hud-btn-deck');
    const btnSpot = document.getElementById('hud-btn-spot');

    if (btnPrev) btnPrev.addEventListener('click', () => this.goToSlide(this.currentSlideIndex - 1));
    if (btnNext) btnNext.addEventListener('click', () => this.goToSlide(this.currentSlideIndex + 1));
    if (btnHome) btnHome.addEventListener('click', () => { if (this.homeSlide !== null) this.goToSlide(this.homeSlide); });
    if (btnToc) btnToc.addEventListener('click', () => this.toggleDrawer(this.dom.tocDrawer));
    if (btnAnim) btnAnim.addEventListener('click', () => this.toggleDrawer(this.dom.animDrawer));
    if (btnDeck) btnDeck.addEventListener('click', () => this.toggleDrawer(this.dom.deckDrawer));
    if (btnSpot) btnSpot.addEventListener('click', () => this.toggleSpotlight());
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
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        this.toggleDrawer(this.dom.deckDrawer);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        this.toggleSpotlight();
      } else if (e.key === 'Escape') {
        this.clearSpotlight();
        this.closeDrawers();
      } else if (/^[1-9]$/.test(e.key)) {
        const num = parseInt(e.key, 10) - 1;
        if (num < this.slides.length) this.goToSlide(num);
      }
    });
  }
}

Object.assign(
  AuroraPresentationEngine.prototype,
  window.PresentationComponents || {},
  window.PresentationLayouts || {}
);
window.PresentationEngine = AuroraPresentationEngine;
window.AuroraEngine = AuroraPresentationEngine;

function bootPresentationApp() {
  if (window.presentationApp) return;
  const content = window.PresentationContent || window.AuroraContent;
  const visuals = window.PresentationVisuals || window.AuroraVisuals || {};
  if (content && document.getElementById('slides-container')) {
    window.presentationApp = new AuroraPresentationEngine(content, visuals);
    window.auroraApp = window.presentationApp;

    // Deferred KaTeX and asynchronous MathJax can finish after the first render.
    const retryPendingMath = () => {
      window.presentationApp.typesetAllMath(true);
      window.presentationApp.equalizeAllSlidesRegions();
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', retryPendingMath, { once: true });
    }
    const waitForMathJax = () => {
      const startup = window.MathJax && window.MathJax.startup;
      if (startup && startup.promise) {
        startup.promise.then(retryPendingMath).catch(err => {
          console.warn('[PresentationEngine] MathJax startup warning:', err);
        });
      } else {
        retryPendingMath();
      }
    };
    const mathJaxScript = document.getElementById('mathjax-script');
    if (window.MathJax && window.MathJax.startup && window.MathJax.startup.promise) {
      waitForMathJax();
    } else if (mathJaxScript) {
      mathJaxScript.addEventListener('load', waitForMathJax, { once: true });
    }
  }
}
if (document.getElementById('slides-container')) {
  bootPresentationApp();
} else {
  document.addEventListener('DOMContentLoaded', bootPresentationApp);
}
