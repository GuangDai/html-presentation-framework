/**
 * 同一份论文数据的三种流程页排布。修改步骤或图形后，所有版式自动共享。
 * maxSteps 表示流程页每页的最大步骤数；非流程页保持原样。
 */
window.PresentationVariants = (() => {
  const configurations = {
    A: { label: 'A · 单页流程', maxSteps: 7 },
    B: { label: 'B · 每页最多四步', maxSteps: 4 },
    C: { label: 'C · 每页最多三步', maxSteps: 3 }
  };
  const defaultVariant = 'A';

  function prepare(content, requested) {
    const key = Object.prototype.hasOwnProperty.call(configurations, requested) ? requested : defaultVariant;
    const limit = configurations[key].maxSteps;
    const source = Array.isArray(content.slides) ? content.slides : [];
    const slides = [];
    const firstPageBySource = [];

    source.forEach((slide, index) => {
      firstPageBySource[index] = slides.length;
      if (slide.layout !== 'pipeline-slide' || !Array.isArray(slide.steps) || slide.steps.length <= limit) {
        slides.push(slide);
        return;
      }
      const parts = Math.ceil(slide.steps.length / limit);
      for (let part = 0; part < parts; part++) {
        const start = part * limit;
        const end = Math.min(start + limit, slide.steps.length);
        let phaseStart = 0;
        const phases = (slide.phases || []).map(phase => {
          const from = phaseStart;
          phaseStart += Math.max(1, Number(phase.span) || 1);
          return { ...phase, span: Math.max(0, Math.min(end, phaseStart) - Math.max(start, from)) };
        }).filter(phase => phase.span > 0);
        slides.push({
          ...slide,
          id: part === 0 ? slide.id : `${slide.id}-part-${part + 1}`,
          title: `${slide.title}（${part + 1}/${parts}）`,
          navTitle: `${slide.navTitle || slide.title} ${part + 1}/${parts}`,
          steps: slide.steps.slice(start, end),
          cols: end - start,
          phases
        });
      }
    });

    const meta = { ...(content.deckMeta || {}) };
    if (Number.isInteger(meta.homeSlide) && firstPageBySource[meta.homeSlide] !== undefined) {
      meta.homeSlide = firstPageBySource[meta.homeSlide];
    }
    return { key, content: { ...content, deckMeta: meta, slides }, firstPageBySource };
  }

  return { configurations, defaultVariant, prepare };
})();
