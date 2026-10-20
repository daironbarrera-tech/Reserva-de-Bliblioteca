/* Estado global y persistencia.
   Por defecto todo se guarda en localStorage (solo este navegador).
   Para compartir datos entre dispositivos, reemplaza commit() por llamadas a tu backend. */
let state = null;
let sessionId = null;
let remoteDoc = null; // opcional: lo asigna services/claude-sync.js

const cloneData = (data) => JSON.parse(JSON.stringify(data));

function loadState() {
  try { state = JSON.parse(localStorage.getItem(CONFIG.STORAGE_KEY)); } catch (e) { /* sin datos */ }
  state = state || createSeed();
  try { sessionId = localStorage.getItem(CONFIG.SESSION_KEY); } catch (e) { /* sin sesión */ }
}

/** Aplica un cambio al estado y lo guarda. */
async function commit(mutator) {
  if (remoteDoc) {
    try {
      const snap = await remoteDoc.get();
      if (snap.exists) state = cloneData(snap.data());
    } catch (e) { /* se usa el estado local */ }
  }
  mutator(state);
  try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state)); } catch (e) { /* ignorar */ }
  if (remoteDoc) {
    try { await remoteDoc.set(state); } catch (e) { /* ignorar */ }
  }
}

function setSession(userId) {
  sessionId = userId;
  try {
    if (userId) localStorage.setItem(CONFIG.SESSION_KEY, userId);
    else localStorage.removeItem(CONFIG.SESSION_KEY);
  } catch (e) { /* ignorar */ }
}

const currentUser = () => state.users.find((u) => u.id === sessionId);
const isLibrarian = () => currentUser()?.role === 'librarian';
