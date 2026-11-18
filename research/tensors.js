// 张量接口图只描述轴顺序和宽度。轴名在多个阶段之间共享，转置后仍能追踪同一轴。
window.ResearchTensors = (() => {
  function render(block) {
    if (!Array.isArray(block.stages) || !block.stages.length) throw Error('stages 需要至少一个张量阶段');
    const axes = new Map();
    const list = document.createElement('ol');
    list.className = 'rs-tensors';
    for (const stage of block.stages) {
      if (!stage.name || !Array.isArray(stage.axes) || !stage.axes.length)
        throw Error('每个阶段需要 name 和非空 axes 数组');
      const row = document.createElement('li');
      const name = document.createElement('strong');
      name.textContent = stage.name;
      row.append(name);
      const shape = document.createElement('div');
      shape.className = 'rs-shape';
      for (const axis of stage.axes) {
        if (!axis.label || axis.size == null) throw Error('每个轴需要 label 和 size');
        if (!axes.has(axis.label)) axes.set(axis.label, axes.size);
        const dim = document.createElement('span');
        dim.className = 'rs-axis rs-axis-' + (axes.get(axis.label) % 4);
        const label = document.createElement('small');
        label.textContent = axis.label;
        const size = document.createElement('b');
        size.textContent = axis.size;
        dim.append(label, size);
        shape.append(dim);
      }
      row.append(shape);
      list.append(row);
    }
    return list.outerHTML;
  }
  return { render };
})();
