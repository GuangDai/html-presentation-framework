/* Catalog metadata is editor-only. A copied block works without this registry.
   Each record has a stable link id, a Chinese label, search terms and the actual block. */
window.ResearchCatalog = {
  entries: [],
  add(group, records) {
    for (const [id, label, keywords, block] of records) {
      if (this.entries.some((item) => item.id === id)) throw Error('重复的组件目录 ID ' + id);
      this.entries.push({ id, group, label, keywords, block });
    }
  },
};
