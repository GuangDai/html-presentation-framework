/**
 * ============================================================================
 * @file decks/active.js
 * @description Active Deck Router.
 *              - Default deck: 'aurora'
 *              - Can also be switched dynamically via URL query `?deck=component-showcase`
 *                or `?deck=paper-template` without modifying source files.
 * ============================================================================
 */
(function () {
  const defaultDeck = 'aurora';
  let requestedDeck = defaultDeck;
  try {
    const params = new URLSearchParams(window.location.search);
    const fromUrl = params.get('deck');
    if (fromUrl && /^[a-zA-Z0-9_-]+$/.test(fromUrl)) {
      requestedDeck = fromUrl;
    }
  } catch (_) {}

  window.ACTIVE_DECK_NAME = requestedDeck;
  for (const file of ['math-cache.js', 'visuals.js', 'content.js']) {
    document.write(`<script src="decks/${requestedDeck}/${file}"><\/script>`);
  }
})();
