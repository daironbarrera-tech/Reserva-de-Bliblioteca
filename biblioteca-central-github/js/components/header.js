/* Cabecera con navegación según el rol */
function Header(route) {
  const link = (hash, label) => `<a href="#/${hash}" class="${route === hash ? 'on' : ''}">${label}</a>`;
  const logout_ = '<a onclick="logout()">Salir</a>';
  const user = currentUser();

  let nav;
  if (!user) nav = link('', 'Catálogo') + link('login', 'Ingresar');
  else if (isLibrarian()) {
    nav = link('scan', 'Escáner') + link('loans', 'Reservas') + link('inventory', 'Inventario') + link('stats', 'Panel') + logout_;
  } else nav = link('', 'Catálogo') + link('mine', 'Mis reservas') + logout_;

  return `
    <header>
      <a href="#/" class="logo">
        <i>B</i>
        <span><b>Biblioteca Central</b><small>RESERVAS · PRÉSTAMOS</small></span>
      </a>
      <nav>${nav}</nav>
    </header>`;
}

const Footer = () => `
  <footer>
    <span>Plataforma de reservas y control bibliotecario</span>
    <span>Préstamo de ${CONFIG.LOAN_DAYS} días · Recogida en ${CONFIG.HOLD_HOURS} h</span>
  </footer>`;
