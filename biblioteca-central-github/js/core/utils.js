/* Utilidades generales */
const $ = (selector) => document.querySelector(selector);

/** Escapa HTML para insertar texto de usuario de forma segura. */
const esc = (value) =>
  String(value ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

const fmtDate = (timestamp) =>
  new Date(timestamp).toLocaleString('es', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const navigate = (hash) => { location.hash = hash; };

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 2600);
}
