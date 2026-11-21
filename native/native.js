/* Colle appli native (Capacitor). Injecté uniquement dans www/, jamais dans le HTML autonome ni la PWA. */
(function () {
  var C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  var App = C.Plugins && C.Plugins.App;
  if (!App) return;
  // Bouton retour Android : remonte la pile d'écrans du jeu, sinon met l'appli en arrière-plan.
  App.addListener('backButton', function () {
    var E = window.__ENG;
    if (E && E.UI && E.UI.stack && E.UI.stack.length) { E.ACT.back(); return; }
    if (App.minimizeApp) App.minimizeApp(); else App.exitApp();
  });
  // Coupe ambiance et voix en arrière-plan, relance l'ambiance au retour si elle est activée.
  App.addListener('appStateChange', function (s) {
    var E = window.__ENG;
    if (!E) return;
    try {
      if (!s.isActive) { E.ambStop(); if (window.speechSynthesis) speechSynthesis.cancel(); }
      else if (E.OPT && E.OPT.amb) E.ambStart();
    } catch (e) {}
  });
})();
