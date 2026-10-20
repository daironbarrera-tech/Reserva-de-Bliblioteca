/* Reglas de negocio: disponibilidad, reservas, préstamos, devoluciones e inventario */
const STATUS = {
  active:    { label: 'Reservada', tone: 'no' },
  loaned:    { label: 'Prestada',  tone: 'wa' },
  returned:  { label: 'Devuelta',  tone: 'ok' },
  expired:   { label: 'Vencida',   tone: 'gy' },
  cancelled: { label: 'Cancelada', tone: 'gy' },
};
const OCCUPYING = ['active', 'loaned']; // estados que ocupan un ejemplar

const findBook = (id) => state.books.find((b) => b.id === id);
const findUser = (id) => state.users.find((u) => u.id === id);
const findReservation = (code) => state.reservations.find((r) => r.code === code);

/** Una reserva activa pasadas las 24 h cuenta como vencida (libera el ejemplar sola). */
function statusOf(reservation) {
  return reservation.status === 'active' && Date.now() > reservation.expiresAt ? 'expired' : reservation.status;
}

function availableCopies(book) {
  const used = state.reservations.filter((r) => r.bookId === book.id && OCCUPYING.includes(statusOf(r))).length;
  return book.copies - used;
}

function hasOpenReservation(userId, bookId) {
  return state.reservations.some(
    (r) => r.userId === userId && r.bookId === bookId && OCCUPYING.includes(statusOf(r))
  );
}

/* ---------- Estudiante ---------- */
async function reserveBook(bookId) {
  const user = currentUser();
  let code = null;
  let error = '';

  await commit((s) => {
    const book = s.books.find((b) => b.id === bookId);
    const taken = s.reservations.filter((r) => r.bookId === bookId && OCCUPYING.includes(statusOf(r))).length;
    if (!book || book.copies - taken < 1) { error = 'Sin ejemplares disponibles'; return; }
    if (s.reservations.some((r) => r.bookId === bookId && r.userId === user.id && OCCUPYING.includes(statusOf(r)))) {
      error = 'Ya tienes este libro reservado'; return;
    }
    do { code = generateCode(); } while (s.reservations.some((r) => r.code === code));
    s.reservations.push({
      code, userId: user.id, bookId,
      createdAt: Date.now(),
      expiresAt: Date.now() + CONFIG.HOLD_HOURS * HOUR_MS,
      status: 'active',
    });
  });
  return error ? { ok: false, error } : { ok: true, code };
}

async function cancelReservation(code) {
  await commit((s) => {
    const r = s.reservations.find((x) => x.code === code);
    if (r && statusOf(r) === 'active') r.status = 'cancelled';
  });
}

/* ---------- Bibliotecario ---------- */
/** Valida un QR y, si es válido, registra el préstamo.
    type: invalid | checked_out | already_loaned | expired | closed */
async function checkoutReservation(code) {
  const reservation = findReservation(code);
  if (!reservation) return { type: 'invalid' };

  const base = { reservation, book: findBook(reservation.bookId), user: findUser(reservation.userId) };
  const status = statusOf(reservation);

  if (status === 'active') {
    await commit((s) => {
      const r = s.reservations.find((x) => x.code === code);
      r.status = 'loaned';
      r.loanedAt = Date.now();
      r.dueAt = Date.now() + CONFIG.LOAN_DAYS * DAY_MS;
    });
    return { ...base, reservation: findReservation(code), type: 'checked_out' };
  }
  if (status === 'loaned') return { ...base, type: 'already_loaned' };
  if (status === 'expired') return { ...base, type: 'expired' };
  return { ...base, type: 'closed', status };
}

async function returnLoan(code) {
  await commit((s) => {
    const r = s.reservations.find((x) => x.code === code);
    if (r && r.status === 'loaned') { r.status = 'returned'; r.returnedAt = Date.now(); }
  });
}

async function saveBook(id, data) {
  await commit((s) => {
    if (id) Object.assign(s.books.find((b) => b.id === id), data);
    else s.books.push({ id: 'b' + Date.now(), ...data });
  });
}

async function deleteBook(id) {
  await commit((s) => { s.books = s.books.filter((b) => b.id !== id); });
}

function libraryStats() {
  const count = (status) => state.reservations.filter((r) => statusOf(r) === status).length;
  return {
    titles: state.books.length,
    copies: state.books.reduce((sum, b) => sum + b.copies, 0),
    available: state.books.reduce((sum, b) => sum + availableCopies(b), 0),
    active: count('active'),
    loaned: count('loaned'),
    expired: count('expired'),
    returned: count('returned'),
    students: state.users.filter((u) => u.role === 'student').length,
  };
}
