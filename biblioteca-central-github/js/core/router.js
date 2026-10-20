/* Router por hash (#/ruta/parametro), control de acceso y render principal */
const ROUTES = {
  '':        { view: CatalogView,         access: 'any' },
  login:     { view: AuthView,            access: 'guest' },
  mine:      { view: MyReservationsView,  access: 'student' },
  qr:        { view: TicketView,          access: 'student' },
  scan:      { view: ScannerView,         access: 'librarian' },
  loans:     { view: LoansView,           access: 'librarian' },
  inventory: { view: InventoryView,       access: 'librarian' },
  stats:     { view: StatsView,           access: 'librarian' },
};

let routeName = '';
let activeView = null;

function render() {
  const [name = '', param] = location.hash.replace(/^#\/?/, '').split('/');
  const route = ROUTES[name] || ROUTES[''];
  routeName = ROUTES[name] ? name : '';

  // Control de acceso
  if (isLibrarian() && route.access !== 'librarian') return navigate('/scan');
  if (!isLibrarian() && route.access === 'librarian') return navigate(currentUser() ? '/' : '/login');
  if (route.access === 'student' && !currentUser()) return navigate('/login');

  activeView?.unmount?.();
  activeView = route.view;

  $('#app').innerHTML = Header(routeName) + '<main>' + route.view.html(param) + '</main>' + Footer();
  route.view.mount?.(param);
}

/** Re-dibuja por cambios remotos sin borrar lo que el usuario está escribiendo. */
function safeRender() {
  const active = document.activeElement;
  const typing = active && /INPUT|SELECT|TEXTAREA/.test(active.tagName);
  if (['login', 'scan'].includes(routeName) || $('#dlg').open || typing) return;
  render();
}
