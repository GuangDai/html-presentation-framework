// Parser-time loader shared by the presentation entry point and the standalone catalog.
(() => {
  const base = new URL('.', document.currentScript.src);
  const url = (file) => new URL(file, base).href.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  document.write('<link rel="stylesheet" href="' + url('components.css') + '">');
  for (const file of [
    'vendor/d3.min.js',
    'vendor/plot.umd.min.js',
    'vendor/graphre.js',
    'vendor/nomnoml.js',
    'vendor/katex.min.js',
    'charts.js',
    'windows.js',
    'tensors.js',
    'components.js',
  ]) {
    document.write('<script src="' + url(file) + '"><\/script>');
  }
})();
