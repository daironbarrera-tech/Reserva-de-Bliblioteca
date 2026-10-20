/* Vista: registro e inicio de sesión */
const AuthView = {
  registering: false,

  html() {
    const reg = this.registering;
    return `
      <div class="two">
        <div>
          <div class="eye">${reg ? 'Crear cuenta' : 'Bienvenido'}</div>
          <h1>${reg ? 'Regístrate' : 'Ingresa'}</h1>
          <p class="s">
            Estudiante de prueba: ${CONFIG.DEMO_STUDENT.email} / ${CONFIG.DEMO_STUDENT.password}<br>
            Bibliotecario de prueba: bibliotecario@biblioteca.com / admin123
          </p>
        </div>
        <div class="card">
          ${reg ? '<label>Nombre</label><input class="f" id="auth-name">' : ''}
          <label>Correo</label>
          <input class="f" id="auth-email" type="email">
          <label>Contraseña</label>
          <input class="f" id="auth-pass" type="password" onkeydown="if(event.key==='Enter')AuthView.submit()">
          <button class="btn" style="width:100%" onclick="AuthView.submit()">${reg ? 'Crear cuenta' : 'Ingresar'}</button>
          <p class="sm" style="text-align:center">
            <a class="ok" onclick="AuthView.toggle()">${reg ? 'Ya tengo cuenta' : 'Crear una cuenta'}</a>
          </p>
        </div>
      </div>`;
  },

  toggle() { this.registering = !this.registering; render(); },

  async submit() {
    const email = $('#auth-email').value.trim().toLowerCase();
    const password = $('#auth-pass').value;
    if (!email || !password) return toast('Completa los campos');

    try {
      const result = this.registering
        ? await registerUser({ name: $('#auth-name').value.trim(), email, password })
        : await loginUser(email, password);
      if (!result.ok) return toast(result.error);

      setSession(result.id);
      toast('Sesión iniciada');
      navigate('/');
      render();
    } catch (e) {
      toast('Error: ' + (e.message || e));
    }
  },
};
