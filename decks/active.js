// 切换论文时只修改此目录名；目录需包含 content.js、visuals.js、math-cache.js。
const activeDeck = 'aurora';
if (!/^[a-zA-Z0-9_-]+$/.test(activeDeck)) throw new Error('无效的论文目录名');
for (const file of ['math-cache.js', 'visuals.js', 'content.js']) {
  document.write(`<script src="decks/${activeDeck}/${file}"><\/script>`);
}
