/* Lectura de QR con la cámara del celular (usa jsQR) */
const Camera = {
  stream: null,
  video: null,
  frame: 0,

  get active() { return Boolean(this.stream); },

  async start(video, onCode) {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    } catch (e) {
      this.stream = null;
      return toast('No se pudo abrir la cámara (permiso denegado o no disponible)');
    }
    this.video = video;
    video.srcObject = this.stream;
    video.style.display = 'block';
    await video.play();

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const scanFrame = () => {
      if (!this.stream) return;
      if (video.videoWidth) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const result = jsQR(img.data, canvas.width, canvas.height);
        if (result && result.data) { this.stop(); onCode(result.data); return; }
      }
      this.frame = requestAnimationFrame(scanFrame);
    };
    scanFrame();
  },

  stop() {
    cancelAnimationFrame(this.frame);
    this.stream?.getTracks().forEach((t) => t.stop());
    this.stream = null;
    if (this.video) this.video.style.display = 'none';
  },
};
