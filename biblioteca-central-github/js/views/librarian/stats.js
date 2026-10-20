/* Vista del bibliotecario: panel de estadísticas */
const StatsView = {
  html() {
    const s = libraryStats();
    const cards = [
      ['Títulos', s.titles], ['Ejemplares', s.copies], ['Disponibles', s.available],
      ['Reservas activas', s.active], ['Prestados', s.loaned], ['Vencidas', s.expired],
      ['Devueltas', s.returned], ['Usuarios', s.students],
    ].map(([label, value]) => `<div class="card"><span class="mu sm">${label}</span><b>${value}</b></div>`).join('');

    return `
      <div class="eye">Panel</div>
      <h1 style="font-size:46px">Estadísticas</h1>
      <div class="cards">${cards}</div>`;
  },
};
