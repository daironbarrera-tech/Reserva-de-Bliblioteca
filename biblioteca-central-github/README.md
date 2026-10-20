# Biblioteca Central · Reservas y control bibliotecario

Aplicación web (HTML + CSS + JavaScript puro, sin compilación) para buscar libros, reservarlos con un **QR único válido 24 horas** y registrar préstamos y devoluciones en el mostrador.

## Funciones
- **Estudiante:** registro/login, catálogo con búsqueda y materias, ubicación física (planta, sección, estante), reserva con QR, "Mis reservas" y cancelación.
- **Bibliotecario:** escáner con **pistola USB**, **cámara del celular** o código manual; préstamo automático (14 días), devoluciones, inventario (agregar, editar, eliminar) y estadísticas.
- **Reglas:** cada QR es único; vence a las 24 h y el ejemplar se libera solo; un QR ya entregado no se reutiliza.

## Cuentas de prueba
| Rol | Correo | Contraseña |
|---|---|---|
| Estudiante | estudiante@biblioteca.com | 1234 |
| Bibliotecario | bibliotecario@biblioteca.com | admin123 |

## Estructura
```
index.html
css/
  base.css              variables, reset, tipografía, estructura
  components.css        botones, tarjetas, formularios, tablas
  views.css             catálogo, ticket QR, escáner
js/
  config.js             constantes (24 h, 14 días, categorías)
  data/seed.js          libros de ejemplo y cuenta del bibliotecario
  core/
    utils.js            helpers ($, esc, fmtDate, toast, navigate)
    store.js            estado global y guardado (localStorage)
    router.js           rutas, control de acceso y render
  services/             lógica de negocio, sin HTML
    library.js          disponibilidad, reservas, préstamos, inventario
    auth.js             registro e inicio de sesión
    qr.js               código único y QR en SVG
    camera.js           lectura de QR con la cámara
    claude-sync.js      opcional, solo dentro de claude.ai
  components/header.js  cabecera y pie
  views/
    auth.js  catalog.js
    student/    my-reservations.js  ticket.js
    librarian/  scanner.js  loans.js  inventory.js  stats.js
  main.js               arranque
```
**Capas:** `data` → `core` → `services` (reglas) → `views` (pantallas). Las vistas no tocan los datos directamente; usan los servicios.

El orden de los `<script>` en `index.html` importa porque comparten ámbito global.

## Ejecutar
Abre `index.html` o sirve la carpeta (`python3 -m http.server`). La cámara requiere **https** o `localhost`.

## Publicar en GitHub Pages
*Settings → Pages → Deploy from a branch → main / root*.

## Pistola lectora USB
Actúa como teclado: escribe el código y pulsa Enter. En **Escáner** el campo siempre tiene el foco.

## Limitación importante
Sin backend, los datos viven en **localStorage** (solo en el navegador que los creó): en GitHub Pages, el celular del estudiante y el computador del bibliotecario **no comparten datos**. Para uso real, reemplaza `commit()` en `js/core/store.js` por llamadas a Supabase o Firebase, y guarda las contraseñas con hash (hoy están en texto plano, solo para demo).
