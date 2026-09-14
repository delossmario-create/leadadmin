# Lead Collector — contexto del proyecto

Herramienta de captura de leads para OFFICE PACK, empresa B2B de Buenos Aires.
La usa el responsable comercial desde el celular en ferias y rondas de negocios:
saca una foto de una tarjeta o graba un audio, extrae los datos con la API de
Anthropic (Claude), deja revisar/editar el formulario resultante y lo manda por
e-mail (o lo guarda en una lista local para mandar varios juntos).

## Cómo está armado

- `index.html` — toda la app: HTML, CSS y JS en un solo archivo, sin backend ni
  build step. Es el `start_url` del PWA.
- `manifest.json` — metadata de instalación (nombre, íconos, colores, `display: standalone`).
- `sw.js` — service worker: cachea el shell de la app para que abra offline y
  sirve la tipografía cache-first. La estrategia general es "red primero, caché
  de respaldo" para que una visita con señal siempre traiga la versión publicada
  más reciente (ver comentario al principio del archivo).
- `icons/` — íconos PNG generados por código (monograma "LC" en rojo sobre
  negro), en los tamaños que piden Android/iOS/manifest.
- Sin dependencias de build ni paquetes: se despliega tal cual.

## Diseño (no tocar sin avisar)

Paleta negro/rojo/blanco/gris, tipografía Roboto, switch de tema claro/oscuro
con variables CSS (`[data-theme="dark"]` / `[data-theme="light"]`). El estilo
es intencional (feria/ronda de negocios, mobile-first, botones grandes para
usar con una mano). No cambiar colores, tipografía ni la lógica de captura sin
proponerlo primero.

## Qué requiere conexión y qué no

- **Necesitan internet:** la lectura de la tarjeta (foto → Claude) y el
  dictado por voz (Web Speech API + envío del texto a Claude para extraer
  los campos).
- **Funciona offline:** abrir la app, completar el formulario a mano, guardar
  el borrador y la lista de leads (`localStorage`), y el botón "Enviar por
  e-mail" (abre la app de correo del teléfono vía `mailto:`, que encola el
  envío para cuando haya señal).

## Cámara y micrófono

Requieren HTTPS (Netlify lo da por defecto) y permiso del navegador. Los
mensajes de error de permiso denegado (`permisoError` en `index.html`) están
pensados para el escenario real de uso: el sitio ya deployado en su propio
dominio, no embebido en otra app.

## Despliegue

Ver [README.md](README.md). Resumen: Vercel importando el repo de GitHub
(`delossmario-create/leadadmin`), sin build command (sitio estático). El
`vercel.json` fuerza `no-cache` en `sw.js`/`manifest.json` a nivel CDN.

## Clave de API

Deployada de forma standalone (Vercel), la app **necesita** una clave de API
de Anthropic cargada en Ajustes — no hay ningún proxy que la provea. Sin
clave, `callClaude()` llama a `api.anthropic.com` sin auth y falla (401). La
clave se guarda en `localStorage` del propio teléfono y viaja directo del
navegador a Anthropic (header `anthropic-dangerous-direct-browser-access`),
nunca pasa por un servidor propio. Es el trade-off consciente de un PWA sin
backend: la clave queda visible para quien tenga acceso al teléfono/DevTools,
aceptable para una herramienta de uso personal.
