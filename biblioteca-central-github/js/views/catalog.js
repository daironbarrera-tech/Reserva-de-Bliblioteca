/* Vista: catálogo con búsqueda, filtros, ficha lateral y reserva */
const CatalogView = {
  query: '',
  category: 'Todas',
  selectedId: null,

  html() {
    const volumes = state.books.reduce((sum, b) => sum + b.copies, 0);
    const chips = ['Todas', ...CONFIG.CATEGORIES]
      .map((c) => `
        <button class="chip ${c === this.category ? 'on' : ''}" onclick="CatalogView.setCategory('${c}')">
          ${c === 'Todas' ? 'Todas las materias' : c}
        </button>`)
      .join('');

    return `
      <div class="eye">Búsqueda · ${volumes} volúmenes</div>
      <h1>¿Qué libro<br>buscas hoy?</h1>
      <p class="s">Consulta la disponibilidad y la ubicación exacta en la estantería, y reserva antes de venir.</p>

      <div class="sb">
        <input placeholder="Título, autor, ISBN o signatura topográfica"
               value="${esc(this.query)}" oninput="CatalogView.setQuery(this.value)">
        <button class="btn">Buscar</button>
      </div>
      <div class="chips">${chips}</div>

      <div class="grid">
        <section>
          <div class="hd"><h2 style="font-size:20px">Resultados</h2><span class="mono mu sm" id="count"></span></div>
          <div id="results"></div>
        </section>
        <aside id="detail"></aside>
      </div>`;
  },

  mount() { this.renderResults(); },

  setQuery(value) { this.query = value; this.renderResults(); },
  setCategory(category) { this.category = category; render(); },
  select(id) { this.selectedId = id; this.renderDetail(this.filtered()); },

  filtered() {
    const text = this.query.toLowerCase();
    return state.books.filter(
      (b) =>
        (this.category === 'Todas' || b.category === this.category) &&
        (b.title + b.author + b.signature).toLowerCase().includes(text)
    );
  },

  renderResults() {
    const books = this.filtered();
    const user = currentUser();
    $('#count').textContent = `${books.length} de ${state.books.length}`;

    $('#results').innerHTML = books.map((b) => {
      const free = availableCopies(b) > 0;
      const mine = user && hasOpenReservation(user.id, b.id);
      const tag = mine ? ['no', 'Reservado'] : free ? ['ok', 'Disponible'] : ['wa', 'Prestado'];
      const action = mine
        ? '<span class="mu">Ya tienes una reserva activa</span>'
        : free
          ? `<button class="lnk" onclick="event.stopPropagation();CatalogView.reserve('${b.id}')">Reservar</button>`
          : '<span class="mu">Sin ejemplares en estantería</span>';

      return `
        <div class="row" onclick="CatalogView.select('${b.id}')">
          <div class="cov">${b.signature.split(' ')[0]}</div>
          <div>
            <div style="display:flex;justify-content:space-between;gap:10px">
              <h3>${esc(b.title)}</h3>
              <span class="tag ${tag[0]}">${tag[1]}</span>
            </div>
            <div class="mu">${esc(b.author)} · ${b.year} · ${b.pages} p.</div>
            <div class="mono mu sm" style="margin:10px 0">
              ${esc(b.signature)} · Planta ${b.floor} · Sección ${esc(b.section)} · Estante ${b.shelf}
            </div>
            ${action}
          </div>
        </div>`;
    }).join('') || '<p class="mu">Sin resultados.</p>';

    this.renderDetail(books);
  },

  renderDetail(books) {
    const b = findBook(this.selectedId) || books[0];
    if (!b) { $('#detail').innerHTML = ''; return; }
    const free = availableCopies(b);

    $('#detail').innerHTML = `
      <div class="side">
        <div class="eye">Ficha · ${free > 0 ? 'Disponible' : 'Sin stock'}</div>
        <h2 style="margin:10px 0 4px">${esc(b.title)}</h2>
        <div class="mu sm">${esc(b.author)} · ${b.year} · ${b.pages} p.</div>
        <div style="margin:20px 0">
          <div class="kv"><span>Signatura</span><span class="mono">${esc(b.signature)}</span></div>
          <div class="kv"><span>Ubicación</span><span class="mono">Planta ${b.floor} · Sección ${esc(b.section)} · Estante ${b.shelf}</span></div>
          <div class="kv"><span>Ejemplares</span><span class="mono">${free} / ${b.copies}</span></div>
          <div class="kv"><span>Préstamo</span><span class="mono">${CONFIG.LOAN_DAYS} días</span></div>
        </div>
        <button class="btn" style="width:100%" ${free > 0 ? '' : 'disabled'} onclick="CatalogView.reserve('${b.id}')">
          Reservar este ejemplar
        </button>
        <p class="mu sm" style="text-align:center">Recibirás un QR para recogerlo en el mostrador.</p>
      </div>`;
  },

  async reserve(bookId) {
    if (!currentUser()) return navigate('/login');
    const result = await reserveBook(bookId);
    if (result.ok) navigate('/qr/' + result.code);
    else toast(result.error);
  },
};
