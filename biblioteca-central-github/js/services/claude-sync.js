/* OPCIONAL: sincroniza el estado con la base de datos compartida de claude.ai.
   Fuera de claude.ai (por ejemplo en GitHub Pages) `window.claude` no existe y este archivo no hace nada. */
(async () => {
  try {
    const claude = await window.claude?.use('db');
    if (!claude) return;

    remoteDoc = claude.doc('app/state');
    const snap = await remoteDoc.get();
    if (snap.exists) state = cloneData(snap.data());
    else await remoteDoc.set(state);

    remoteDoc.onSnapshot((s) => {
      if (!s.exists) return;
      state = cloneData(s.data());
      safeRender();
    });
    safeRender();
  } catch (e) { /* se queda en modo local */ }
})();
