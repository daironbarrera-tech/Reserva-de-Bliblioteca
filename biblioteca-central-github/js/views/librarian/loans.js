/* Vista del bibliotecario: todas las reservas y préstamos */
const LoansView = {
  html() {
    const list = [...state.reservations].sort((a, b) => b.createdAt - a.createdAt);
    const rows = list.map((r) => {
      const status = statusOf(r);
      const limit = status === 'loaned' ? r.dueAt : r.expiresAt;
      const action = status === 'loaned'
        ? `<button class="lnk" onclick="LoansView.registerReturn('${r.code}')">Devolución</button>` : '';
      return `
        <tr>
          <td class="mono">${r.code}</td>
          <td>${esc(findBook(r.bookId)?.title)}</td>
          <td>${esc(findUser(r.userId)?.name)}</td>
          <td class="${STATUS[status].tone}">${STATUS[status].label}</td>
          <td>${fmtDate(limit)}</td>
          <td>${action}</td>
        </tr>`;
    }).join('');

    return `
      <div class="eye">Control</div>
      <h1 style="font-size:46px">Reservas y préstamos</h1>
      <div class="tw">
        <table>
          <tr><th>Código</th><th>Libro</th><th>Usuario</th><th>Estado</th><th>Límite</th><th></th></tr>
          ${rows || '<tr><td colspan="6" class="mu">Sin registros</td></tr>'}
        </table>
      </div>`;
  },

  async registerReturn(code) { await returnLoan(code); render(); },
};
