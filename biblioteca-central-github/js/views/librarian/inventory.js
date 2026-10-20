/* Vista del bibliotecario: gestión de libros y ejemplares */
const InventoryView = {
  html() {
    const rows = state.books.map((b) => `
      <tr>
        <td><b>${esc(b.title)}</b><br><span class="mu">${esc(b.author)}</span></td>
        <td class="mono">${esc(b.signature)}</td>
        <td class="mono">P${b.floor}·${esc(b.section)}·E${b.shelf}</td>
        <td class="mono">${availableCopies(b)}/${b.copies}</td>
        <td>
          <button class="lnk" onclick="InventoryView.openForm('${b.id}')">Editar</button>
          <button class="lnk r" onclick="InventoryView.remove('${b.id}')">Eliminar</button>
        </td>
      </tr>`).join('');

    return `
      <div class="eye">Inventario</div>
      <div style="display:flex;justify-content:space-between;align-items:end;flex-wrap:wrap;gap:12px">
        <h1 style="font-size:46px">Libros y ejemplares</h1>
        <button class="btn" onclick="InventoryView.openForm()">+ Agregar libro</button>
      </div>
      <div class="tw">
        <table>
          <tr><th>Título</th><th>Signatura</th><th>Ubicación</th><th>Disp.</th><th></th></tr>
          ${rows}
        </table>
      </div>`;
  },

  openForm(id) {
    const b = findBook(id) || { title: '', author: '', year: 2024, pages: 100, signature: '', floor: 1, section: 'A', shelf: 1, category: CONFIG.CATEGORIES[0], copies: 1 };
    const field = (key, label, type = 'text') =>
      `<div><label>${label}</label><input class="f" id="f_${key}" type="${type}" value="${esc(b[key])}"></div>`;
    const options = CONFIG.CATEGORIES.map((c) => `<option ${c === b.category ? 'selected' : ''}>${c}</option>`).join('');

    $('#dlg').innerHTML = `
      <h2>${id ? 'Editar' : 'Agregar'} libro</h2>
      ${field('title', 'Título')}
      ${field('author', 'Autor')}
      ${field('signature', 'Signatura')}
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:10px">
        ${field('floor', 'Planta', 'number')}
        ${field('section', 'Sección')}
        ${field('shelf', 'Estante', 'number')}
        ${field('year', 'Año', 'number')}
        ${field('pages', 'Páginas', 'number')}
        ${field('copies', 'Ejemplares', 'number')}
      </div>
      <label>Materia</label>
      <select class="f" id="f_category">${options}</select>
      <div style="display:flex;gap:10px;justify-content:flex-end">
        <button class="btn o" onclick="$('#dlg').close()">Cancelar</button>
        <button class="btn" onclick="InventoryView.save('${id || ''}')">Guardar</button>
      </div>`;
    $('#dlg').showModal();
  },

  async save(id) {
    const val = (key) => $('#f_' + key).value.trim();
    const data = {
      title: val('title'), author: val('author'), signature: val('signature'),
      floor: +val('floor'), section: val('section'), shelf: +val('shelf'),
      year: +val('year'), pages: +val('pages'), copies: Math.max(0, +val('copies')),
      category: val('category'),
    };
    if (!data.title || !data.signature) return toast('Título y signatura son obligatorios');
    await saveBook(id, data);
    $('#dlg').close();
    render();
  },

  async remove(id) {
    if (!confirm('¿Eliminar este libro?')) return;
    await deleteBook(id);
    render();
  },
};
