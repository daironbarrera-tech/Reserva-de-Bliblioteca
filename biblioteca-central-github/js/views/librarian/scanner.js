/* Vista del bibliotecario: escáner (pistola USB, cámara o código manual) */
const ScannerView = {
  lastResult: '',

  html() {
    return `
      <div class="eye">Mostrador</div>
      <h1 style="font-size:46px">Escanear reserva</h1>
      <p class="s">Dispara la pistola lectora sobre el QR del celular. El campo siempre está activo; también puedes escribir el código y pulsar Enter.</p>

      <div class="scan">
        <div class="mono mu sm" style="margin-bottom:12px">● LISTO PARA ESCANEAR</div>
        <input id="scan-input" autocomplete="off" placeholder="RES-XXXXXXXX-XXXX"
               onkeydown="if(event.key==='Enter'){ScannerView.process(this.value);this.value=''}"
               onblur="ScannerView.focusInput()">
        <div style="margin-top:16px">
          <button class="btn o" onclick="ScannerView.toggleCamera()">📷 Escanear con la cámara</button>
        </div>
        <video id="scan-video" playsinline muted
               style="display:none;width:100%;max-width:420px;border-radius:16px;margin-top:14px"></video>
      </div>
      <div id="scan-result">${this.lastResult}</div>`;
  },

  mount() { this.focusInput(); },
  unmount() { Camera.stop(); },

  /** Mantiene el foco para que la pistola USB siempre escriba aquí. */
  focusInput() {
    setTimeout(() => {
      const input = $('#scan-input');
      if (input && !Camera.active && !$('#dlg').open && location.hash === '#/scan') input.focus();
    }, 50);
  },

  toggleCamera() {
    if (Camera.active) Camera.stop();
    else Camera.start($('#scan-video'), (text) => this.process(text));
  },

  card(tone, title, body, code) {
    return `<div class="res ${tone}"><div class="mono sm">${esc(code)}</div><h2>${title}</h2><div>${body}</div></div>`;
  },

  async process(raw) {
    const code = raw.trim().toUpperCase().replace(/\s/g, '');
    if (!code) return;

    const r = await checkoutReservation(code);
    let html;

    if (r.type === 'invalid') {
      html = this.card('e', 'Código no válido', 'No existe ninguna reserva con este código.', code);
    } else {
      const { book: b, user: u, reservation: res } = r;
      const info = `
        <b>${esc(b?.title)}</b> · ${esc(b?.signature)}<br>
        Planta ${b?.floor} · Sección ${esc(b?.section)} · Estante ${b?.shelf}<br>
        Usuario: ${esc(u?.name)} (${esc(u?.email)})`;

      if (r.type === 'checked_out') {
        html = this.card('g', '✔ Reserva válida · ENTREGAR LIBRO',
          `${info}<br>Préstamo registrado. Devolución: <b>${fmtDate(res.dueAt)}</b>`, code);
      } else if (r.type === 'already_loaned') {
        html = this.card('w', 'Ya fue entregado', `${info}<br>
          Prestado el ${fmtDate(res.loanedAt)} · vence ${fmtDate(res.dueAt)}<br><br>
          <button class="btn o" style="color:#fff;border-color:#fff" onclick="ScannerView.registerReturn('${code}')">Registrar devolución</button>`, code);
      } else if (r.type === 'expired') {
        html = this.card('e', 'Reserva vencida', `${info}<br>Venció el ${fmtDate(res.expiresAt)}. El ejemplar fue liberado.`, code);
      } else {
        html = this.card('e', `Reserva ${STATUS[r.status].label.toLowerCase()}`, info, code);
      }
    }

    this.lastResult = html;
    if (location.hash === '#/scan') $('#scan-result').innerHTML = html;
    this.focusInput();
  },

  async registerReturn(code) {
    await returnLoan(code);
    this.lastResult = '<div class="res g"><h2>Devolución registrada</h2>Inventario actualizado.</div>';
    render();
  },
};
