/* Registro, inicio y cierre de sesión (demo: contraseñas en texto plano) */
async function registerUser({ name, email, password }) {
  if (!name || password.length < 4) return { ok: false, error: 'Nombre y contraseña (mín. 4)' };
  let id = null;
  await commit((s) => {
    if (s.users.some((u) => u.email === email)) return;
    id = 'u' + Date.now();
    s.users.push({ id, name, email, password, role: 'student' });
  });
  return id ? { ok: true, id } : { ok: false, error: 'Ese correo ya existe' };
}

async function loginUser(email, password) {
  const demo = CONFIG.DEMO_STUDENT;
  if (email === demo.email && password === demo.password && !state.users.some((u) => u.email === email)) {
    await commit((s) => s.users.push({ id: 'u1', role: 'student', ...demo }));
  }
  const user = state.users.find((u) => u.email === email && u.password === password);
  return user ? { ok: true, id: user.id } : { ok: false, error: 'Credenciales incorrectas' };
}

function logout() {
  setSession(null);
  navigate('/');
}
