/* Vista del estudiante: historial de reservas */
const MyReservationsView = {
  html() {
    const list = state.reservations
      .filter((r) => r.userId === currentUser().id)
      .sort((a, b) => b.createdAt - a.createdAt);

    const rows = list.map((r) => {
      const b = findBook(r.bookId) || { title: '(eliminado)', author: '', signature: '', floor: '', shelf: '' };
      const status = statusOf(r);
      const deadline = status === 'loaned' ? `Devolver antes del ${fmtDate(r.dueAt)}` : `Recoger antes del ${fmtDate(r.expiresAt)}`;
      const actions = status === 'active' ? `
        <p>
          <button class="lnk" onclick="navigate('/qr/${r.code}')">Ver código QR</button>
          <button class="lnk r" onclick="MyReservationsView.cancel('${r.code}')">Cancelar</button>
        </p>` : '';

      return `
        <div class="row" style="cursor:default">
          <div style="flex:1">
            <div style="display:flex;justify-content:space-between">
              <h3>${esc(b.title)}</h3>
              <span class="${STATUS[status].tone} sm">${STATUS[status].label}</span>
            </div>
            <div class="mu">${esc(b.author)}</div>
            <div class="mono mu sm" style="margin:8px 0">${r.code} · ${esc(b.signature)} · Planta ${b.floor} · Estante ${b.shelf}</div>
            <div class="mu sm">${deadline}</div>
            ${actions}
          </div>
        </div>`;
    }).join('');

    return `
      <div class="eye">Tu cuenta</div>
      <h1>Mis reservas</h1>
      <p class="s">Cada reserva tiene una vigencia de ${CONFIG.HOLD_HOURS} horas. Presenta su código QR en el mostrador; si no la recoges, se libera automáticamente.</p>
      <div class="hd" style="margin-top:34px">
        <h2 style="font-size:20px">Historial</h2><span class="mono mu sm">${list.length} registros</span>
      </div>
      ${rows || '<p class="mu">Aún no tienes reservas.</p>'}`;
  },

  async cancel(code) {
    if (!confirm('¿Cancelar esta reserva?')) return;
    await cancelReservation(code);
    render();
  },
};
