/* Installation and offline support. All personal progress stays in the handbook's existing store. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const status = $('pwa-status');
  const installButton = $('pwa-install');
  const imageButton = $('pwa-cache-images');
  const updateButton = $('pwa-update');
  const standalone = () => window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
  let pendingInstall = null;
  let registration = null;
  let reloading = false;
  let imageJob = false;
  function updateDisplay() {
    $('pwa-card').hidden = standalone();
    if (standalone()) installButton.hidden = true;
  }
  updateDisplay();
  window.matchMedia('(display-mode: standalone)').addEventListener('change', updateDisplay);
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    pendingInstall = e;
    installButton.hidden = standalone();
    $('pwa-install-help').textContent = 'Tippe auf „Auf dem Tablet installieren“ und bestätige die Installation.';
  });
  installButton.addEventListener('click', async () => {
    if (!pendingInstall) return;
    installButton.disabled = true;
    const prompt = pendingInstall;
    pendingInstall = null;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      installButton.hidden = true;
      if (choice.outcome !== 'accepted') $('pwa-install-help').textContent = 'Du kannst die App später im Chrome-Menü über „Zum Startbildschirm hinzufügen“ installieren.';
    } catch {
      $('pwa-install-help').textContent = 'Öffne das Chrome-Menü ⋮ und wähle „Zum Startbildschirm hinzufügen“ → „Installieren“.';
    } finally { installButton.disabled = false; }
  });
  window.addEventListener('appinstalled', () => { pendingInstall = null; updateDisplay(); });
  // Open the three manifest shortcuts without changing saved progress.
  const query = new URLSearchParams(location.search);
  const section = query.get('bereich');
  if (['cooking', 'pokedex', 'album', 'worlds', 'stones', 'escape'].includes(section)) {
    switchTab(section);
    if (section === 'album' && ['album', 'team', 'wishes'].includes(query.get('lager'))) showCamp(query.get('lager'));
  }
  function offerUpdate() {
    if (registration?.waiting) {
      updateButton.hidden = false;
      status.textContent = 'Eine neue App-Version ist bereit. Dein gespeicherter Fortschritt bleibt erhalten.';
    }
  }
  function observeWorker(worker) {
    if (!worker) return;
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed') {
        if (navigator.serviceWorker.controller) offerUpdate();
        else status.textContent = 'Das Handbuch ist für den Offline-Start gespeichert.';
      }
    });
  }
  const onlineText = () => {
    if (registration?.waiting) return offerUpdate();
    if (!navigator.onLine) status.textContent = 'Du bist offline. Das gespeicherte Handbuch und deine Einträge bleiben nutzbar.';
    else if (registration?.active) status.textContent = 'Das Handbuch ist für den Offline-Start gespeichert.';
  };
  window.addEventListener('online', onlineText);
  window.addEventListener('offline', onlineText);
  updateButton.addEventListener('click', () => {
    if (!registration?.waiting) return;
    updateButton.disabled = true;
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
  });
  imageButton.addEventListener('click', async () => {
    if (imageJob) return;
    if (!navigator.onLine) { $('pwa-image-status').textContent = 'Verbinde das Tablet zuerst mit dem Internet, um die Bilder zu speichern.'; return; }
    if (!registration?.active) { $('pwa-image-status').textContent = 'Die App wird noch vorbereitet. Versuche es gleich noch einmal.'; return; }
    imageJob = true;
    imageButton.disabled = true;
    $('pwa-image-status').textContent = 'Pokémon-Bilder werden gespeichert: 0 / 151 …';
    registration.active.postMessage({ type: 'CACHE_POKEMON_IMAGES' });
  });
  if ('serviceWorker' in navigator && window.isSecureContext) {
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (registration?.active && updateButton.disabled && !reloading) { reloading = true; location.reload(); }
    });
    navigator.serviceWorker.addEventListener('message', e => {
      const data = e.data;
      if (!data || typeof data !== 'object') return;
      if (data.type === 'IMAGE_PROGRESS') $('pwa-image-status').textContent = `Pokémon-Bilder speichern: ${Number(data.done) || 0} / 151 …`;
      if (data.type === 'IMAGE_COMPLETE') {
        imageJob = false; imageButton.disabled = false;
        const saved = Math.max(0, Math.min(151, Number(data.saved) || 0));
        $('pwa-image-status').textContent = saved === 151 ? 'Alle 151 Pokémon-Bilder sind jetzt offline verfügbar. Bereits angezeigte Platzhalter verschwinden beim nächsten Öffnen.' : `${saved} von 151 Bildern gespeichert. Bei stabiler Verbindung kannst du es erneut versuchen.`;
      }
    });
    window.addEventListener('load', async () => {
      try {
        registration = await navigator.serviceWorker.register('./sw.js', { scope: './', updateViaCache: 'none' });
        offerUpdate(); observeWorker(registration.installing);
        registration.addEventListener('updatefound', () => observeWorker(registration.installing));
        await navigator.serviceWorker.ready;
        imageButton.disabled = false;
        if (!registration.waiting) onlineText();
      } catch {
        status.textContent = 'Offline-Speicherung ist gerade nicht verfügbar. Mit Internet kannst du das Handbuch weiter nutzen.';
        imageButton.disabled = true;
      }
    });
  } else {
    status.textContent = 'Öffne die App über schlayer1.github.io/pokemonquest/ in Chrome, um Installation und Offline-Start zu nutzen.';
    imageButton.disabled = true;
  }
})();
