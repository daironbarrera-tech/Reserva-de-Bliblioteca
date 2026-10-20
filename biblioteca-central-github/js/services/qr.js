/* Generación de códigos de reserva y de su imagen QR */

/** Código único, p. ej. RES-1A2B3C4D-5E6F */
function generateCode() {
  const hex = (bytes) =>
    [...crypto.getRandomValues(new Uint8Array(bytes))].map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
  return `RES-${hex(4)}-${hex(2)}`;
}

/** Devuelve el QR como SVG (usa la librería qrcode-generator). */
function qrSvg(text) {
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  return qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
}
