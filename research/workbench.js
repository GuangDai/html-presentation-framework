// The catalog owns drafts and composition order. Rendering is delegated to the same ResearchUI used on stage.
(() => {
  const $ = (id) => document.getElementById(id);
  const entries = ResearchCatalog.entries;
  const storeKey = 'research-workbench-v1';
  const pretty = (value) => JSON.stringify(value, null, 2);
  const initialSlide = {
    id: 'research-01',
    layout: 'research-slide',
    title: '研究展示',
    navTitle: '研究展示',
    arrange: 'columns',
    density: 'normal',
    accent: 'teal',
    blocks: [],
  };
  let drafts = {},
    assemblyText = pretty(initialSlide);
  try {
    const saved = JSON.parse(localStorage.getItem(storeKey) || '{}');
    if (saved.drafts && typeof saved.drafts === 'object') drafts = saved.drafts;
    if (typeof saved.assembly === 'string') assemblyText = saved.assembly;
  } catch {
    /* Storage can be unavailable when opening a local file. */
  }
  function persist() {
    try {
      localStorage.setItem(storeKey, JSON.stringify({ drafts, assembly: assemblyText }));
    } catch {
      /* Copy and editing still work within this tab. */
    }
  }
  const byId = (id) => entries.find((item) => item.id === id);
  let selected = byId(location.hash.slice(1)) || byId('attention');
  let composing = location.hash === '#assembly',
    valid = false;
  const singleStyle = { density: 'normal', accent: 'teal' };

  function button(text, action) {
    const node = document.createElement('button');
    node.type = 'button';
    node.textContent = text;
    node.addEventListener('click', action);
    return node;
  }
  function listCatalog() {
    const text = $('search').value.trim().toLowerCase();
    const found = entries.filter((e) =>
      `${e.label} ${e.group} ${e.keywords} ${e.block.type} ${e.id}`.toLowerCase().includes(text),
    );
    $('count').textContent = `${found.length} / ${entries.length}`;
    const nav = $('catalog');
    nav.replaceChildren();
    let previous = '';
    for (const item of found) {
      if (item.group !== previous) {
        const title = document.createElement('h2');
        title.textContent = item.group;
        nav.append(title);
        previous = item.group;
      }
      const link = button(item.label, () => visit(item.id));
      if (!composing && item === selected) link.setAttribute('aria-current', 'true');
      nav.append(link);
    }
    if (!found.length) nav.textContent = '没有匹配的组件。';
  }

  function visit(id) {
    if (location.hash.slice(1) !== id) location.hash = id;
    else openView();
  }
  function openView() {
    composing = location.hash === '#assembly';
    selected = byId(location.hash.slice(1)) || selected;
    $('single').setAttribute('aria-pressed', String(!composing));
    $('assembly').setAttribute('aria-pressed', String(composing));
    $('name').textContent = composing ? '我的组合' : selected.label;
    $('context').textContent = composing
      ? '页面配置 / research-slide'
      : `${selected.group} / ${selected.block.type}`;
    $('copy').textContent = composing ? '复制整页' : '复制组件';
    $('edit-label').textContent = composing ? '页面配置 · JSON' : '组件配置 · JSON';
    $('edit-hint').textContent = composing
      ? '复制整页到新稿 content.js 的 slides 数组。每页使用唯一的 id。'
      : '可修改下方数据并查看预览。复制的组件可放入 research-slide 的 blocks 数组。';
    $('layout-label').hidden = !composing;
    $('add').hidden = $('reset').hidden = composing;
    $('editor').value = composing ? assemblyText : (drafts[selected.id] ?? pretty(selected.block));
    $('message').textContent = '';
    listCatalog();
    preview();
  }

  function assembly() {
    const slide = JSON.parse(assemblyText);
    if (slide.layout !== 'research-slide' || !Array.isArray(slide.blocks) || !slide.id || !slide.title) {
      throw Error('页面需要 id、title、layout="research-slide" 和 blocks 数组');
    }
    return slide;
  }
  function orderControls(slide) {
    const list = document.createElement('ol');
    slide.blocks.forEach((block, i) => {
      const row = document.createElement('li');
      row.append(document.createTextNode(block.title || block.type));
      function edit(label, offset) {
        const b = button(label, () => {
          const current = assembly();
          const [moved] = current.blocks.splice(i, 1);
          if (offset !== null) current.blocks.splice(i + offset, 0, moved);
          replaceAssembly(current);
          $('order')
            .querySelectorAll('li')
            [Math.min(i, current.blocks.length - 1)]?.querySelector('button:not(:disabled)')
            ?.focus();
        });
        b.setAttribute('aria-label', `${label} ${block.title || block.type}`);
        b.disabled = offset !== null && (i + offset < 0 || i + offset >= slide.blocks.length);
        row.append(b);
      }
      edit('上移', -1);
      edit('下移', 1);
      edit('移除', null);
      list.append(row);
    });
    $('order').append(list);
  }
  function replaceAssembly(slide) {
    assemblyText = pretty(slide);
    persist();
    if (composing) $('editor').value = assemblyText;
    preview();
  }
  function preview() {
    const pane = $('preview');
    $('order').replaceChildren();
    let count;
    try {
      count = assembly().blocks.length;
    } catch {
      count = '?';
    }
    $('size').textContent = count;
    try {
      const slide = composing ? assembly() : { ...singleStyle, blocks: [JSON.parse($('editor').value)] };
      $('density').value = slide.density ?? 'normal';
      $('accent').value = slide.accent ?? 'teal';
      $('arrange').value = slide.arrange ?? 'stack';
      if (slide.blocks.length) pane.innerHTML = ResearchUI.renderSlide(slide);
      else pane.innerHTML = '<p class="empty">选择目录中的组件，再点“加入组合”。</p>';
      if (composing && slide.blocks.length) orderControls(slide);
      valid = slide.blocks.length > 0;
      $('editor').removeAttribute('aria-invalid');
    } catch (error) {
      pane.replaceChildren();
      const notice = document.createElement('p');
      notice.className = 'error';
      notice.setAttribute('role', 'alert');
      notice.textContent = '配置需要修改。' + error.message;
      pane.append(notice);
      $('editor').setAttribute('aria-invalid', 'true');
      valid = false;
    }
    $('copy').disabled = !valid;
    $('add').disabled = !valid || count === '?';
    if (!composing && count === '?') $('message').textContent = '请先修正“我的组合”中的 JSON，再添加组件。';
  }
  $('editor').addEventListener('input', () => {
    if (composing) assemblyText = $('editor').value;
    else drafts[selected.id] = $('editor').value;
    $('message').textContent = '';
    persist();
    preview();
  });
  for (const field of ['density', 'accent', 'arrange']) {
    $(field).addEventListener('change', () => {
      if (composing) {
        try {
          const slide = assembly();
          slide[field] = $(field).value;
          replaceAssembly(slide);
        } catch {
          $('message').textContent = '请先修正页面配置。';
        }
      } else {
        singleStyle[field] = $(field).value;
        preview();
      }
    });
  }
  $('add').addEventListener('click', () => {
    const slide = assembly();
    slide.blocks.push(JSON.parse($('editor').value));
    replaceAssembly(slide);
    $('message').textContent = `已加入“我的组合”，共 ${slide.blocks.length} 个组件。`;
  });
  $('copy').addEventListener('click', async () => {
    const text = $('editor').value;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      $('editor').focus();
      $('editor').select();
      if (!document.execCommand('copy')) {
        $('message').textContent = '配置已选中，请按 Ctrl+C 或 ⌘C 复制。';
        return;
      }
    }
    $('message').textContent = composing ? '已复制整页配置。' : '已复制组件配置。';
  });
  $('reset').addEventListener('click', () => {
    delete drafts[selected.id];
    persist();
    openView();
    $('message').textContent = '已恢复此组件的示例数据。';
  });
  $('search').addEventListener('input', listCatalog);
  $('single').addEventListener('click', () => visit(selected.id));
  $('assembly').addEventListener('click', () => visit('assembly'));
  window.addEventListener('hashchange', openView);
  openView();
})();
