# Lead Collector

App para capturar leads en ferias y rondas de negocios (OFFICE PACK). Sacás una
foto de una tarjeta o grabás un audio contando el contacto, la IA de Gemini
extrae los datos, los revisás/completás y los mandás por e-mail. Es una PWA
instalable: se usa como una app más en el celular, sin instalar nada de una
tienda de aplicaciones.

## Configurar la clave de API de Gemini (paso obligatorio, gratis)

La app llama directo desde el celular a la API de Gemini (Google) para leer
tarjetas y transcribir audio — no tiene backend propio que la provea, así que
necesita su propia clave. Gemini tiene un nivel gratuito sin tarjeta de
crédito, suficiente para este uso:

1. Entrá a [aistudio.google.com/apikey](https://aistudio.google.com/apikey) e
   iniciá sesión con una cuenta de Google.
2. Tocá **Create API key** (podés crear un proyecto nuevo si te lo pide) y
   copiá la clave (empieza con `AIzaSy...`).
3. En la app, tocá el ícono de tuerca (Ajustes), pegala en **"Clave de API de
   Gemini"** y tocá **Guardar ajustes**.
4. Probá sacarle una foto a una tarjeta — debería mostrar "Leyendo la
   tarjeta…" y después completar el formulario.

La clave queda guardada sólo en ese teléfono (`localStorage`) y viaja directo
al navegador → Gemini; no pasa por ningún servidor intermedio. El nivel
gratuito tiene un límite de usos por día; si en algún momento aparece el
aviso de cuota agotada, simplemente esperá y volvé a intentar más tarde.

## Uso

1. Abrí la app en el celular (ver URL más abajo) y agregala a la pantalla de
   inicio (ver "Instalarla" abajo).
2. En **Ajustes** (ícono de tuerca), cargá el e-mail adonde querés que lleguen
   los leads y tu clave de API de Gemini (ver sección de arriba).
3. Para cada contacto: **Tarjeta** (foto o galería) o **Audio** (grabás
   contando quién es, la app lo pasa a texto y extrae los datos), o **Manual**
   si preferís tipear.
4. Revisá el formulario — los campos con punto rojo se completaron solos — y
   corregí lo que haga falta.
5. **Enviar por e-mail** lo manda al toque, o **Guardar en la lista** lo deja
   pendiente para mandar varios juntos desde "leads" (arriba a la derecha),
   donde también podés exportarlos a CSV.

La cámara y el micrófono piden permiso del navegador la primera vez. Si lo
rechazaste sin querer, la app te va a explicar cómo habilitarlo desde los
ajustes del navegador o de la app instalada.

Sacar la foto y dictar el audio necesitan conexión (usan la IA de Gemini). El
resto — completar a mano, guardar el borrador, la lista de leads y mandar por
e-mail — funciona sin señal.

### Instalarla en el celular

- **Android (Chrome):** abrí la URL, tocá el menú (⋮) → "Agregar a pantalla de
  inicio" o "Instalar app".
- **iPhone (Safari):** abrí la URL, tocá el ícono de compartir (▢↑) → "Agregar
  a pantalla de inicio".

Una vez instalada abre a pantalla completa, sin la barra del navegador.

## Despliegue (Vercel)

Es un sitio estático, sin build ni backend:

1. En [vercel.com](https://vercel.com) → **Add New → Project** → importá el
   repo de GitHub `delossmario-create/leadadmin`.
2. Framework Preset: **Other**. **Build Command:** ninguno (dejar vacío).
   **Output Directory:** dejar el default (la raíz del repo).
3. Deploy. Cada push a `main` redeploya solo.

Vercel sirve todo por HTTPS automáticamente, que es requisito para que el
navegador habilite cámara y micrófono. El archivo [vercel.json](vercel.json)
fuerza `Cache-Control: no-cache` en `sw.js` y `manifest.json` para que el CDN
nunca sirva una versión vieja de esos dos archivos (el resto de la
actualización la maneja el service worker, ver más abajo).

### Actualizaciones

El service worker (`sw.js`) sirve siempre la versión más nueva cuando hay
señal, y cachea la app para que abra offline. Al publicar un cambio, la
próxima vez que el usuario abra la app con conexión, se actualiza sola (recarga
una vez) — no hace falta desinstalar ni borrar caché a mano.

## Estructura

```
index.html   — la app entera (HTML/CSS/JS, sin dependencias de build)
manifest.json — metadata de instalación como PWA
sw.js         — service worker (offline + actualización)
vercel.json   — cabeceras de caché para el deploy en Vercel
icons/        — íconos de la app en los tamaños que piden Android/iOS
```

Más contexto del proyecto y decisiones de diseño en [CLAUDE.md](CLAUDE.md).
