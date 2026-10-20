/* Vista del estudiante: tarjeta con el QR de la reserva y cuenta regresiva */
const TicketView = {
  timer: null,

  html(code) {
    const r = findReservation(code);
    if (!r || r.userId !== currentUser().id) {
      return '<p class="mu">Reserva no encontrada. <a class="ok" href="#/mine">Ir a mis reservas</a></p>';
    }
    const b = findBook(r.bookId) || {};
    const status = statusOf(r);

    return `
      <div class="two">
        <div>
          <div class="eye">Confirmación de reserva</div>
          <h1 style="font-size:46px">Tu reserva está lista</h1>
          <p class="s">Muestra el código QR desde tu celular en el mostrador. El bibliotecario lo escaneará, validará la reserva y registrará el préstamo.</p>
          <div class="kv"><span>Ejemplar</span><span class="mono">${esc(b.signature)} · Estante ${b.shelf}</span></div>
          <div class="kv"><span>Recogida</span><span class="mono">Hasta ${fmtDate(r.expiresAt)}</span></div>
          <div class="kv"><span>Tiempo restante</span><span class="mono" id="countdown"></span></div>
          <div class="kv"><span>Código</span><span class="mono">${r.code}</span></div>
        </div>
        <div class="tkt">
          <div class="mono mu sm" style="letter-spacing:.15em">BIBLIOTECA CENTRAL</div>
          <div class="q" style="${status === 'active' ? '' : 'opacity:.25'}">${qrSvg(r.code)}</div>
          <div class="mono"><b>${r.code}</b></div>
          <div class="mu sm">${esc(b.title)} · Planta ${b.floor} · Sección ${esc(b.section)}</div>
          <div class="stamp ${STATUS[status].tone}">${STATUS[status].label.toUpperCase()}</div>
        </div>
      </div>`;
  },

  mount(code) {
    const r = findReservation(code);
    const update = () => {
      const el = $('#countdown');
      if (!el || !r) return;
      const left = r.expiresAt - Date.now();
      el.textContent = statusOf(r) === 'active'
        ? `${Math.floor(left / HOUR_MS)}h ${Math.floor((left % HOUR_MS) / 60000)}m`
        : STATUS[statusOf(r)].label;
    };
    update();
    this.timer = setInterval(update, 30000);
  },

  unmount() { clearInterval(this.timer); },
};
