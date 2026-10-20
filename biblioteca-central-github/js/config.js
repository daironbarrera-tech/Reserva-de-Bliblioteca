/* Configuración general de la aplicación */
const CONFIG = {
  HOLD_HOURS: 24,          // vigencia de una reserva sin recoger
  LOAN_DAYS: 14,           // duración del préstamo
  CATEGORIES: ['Ciencias', 'Filosofía', 'Literatura', 'Historia', 'Arte'],
  STORAGE_KEY: 'bib_state_v2',
  SESSION_KEY: 'bib_session_v2',
  DEMO_STUDENT: { name: 'Estudiante Demo', email: 'estudiante@biblioteca.com', password: '1234' },
};

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
