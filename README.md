# Lead Collector

App para capturar leads en ferias y rondas de negocios (OFFICE PACK). Sacás una
foto de una tarjeta o grabás un audio contando el contacto, la IA de Claude
extrae los datos, los revisás/completás y los mandás por e-mail. Es una PWA
instalable: se usa como una app más en el celular, sin instalar nada de una
tienda de aplicaciones.

## Uso

1. Abrí la app en el celular (ver URL más abajo) y agregala a la pantalla de
   inicio (ver "Instalarla" abajo).
2. En **Ajustes** (ícono de tuerca), cargá el e-mail adonde querés que lleguen
   los leads y, si hace falta, tu clave de API de Anthropic.
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

Sacar la foto y dictar el audio necesitan conexión (usan la IA de Claude). El
resto — completar a mano, guardar el borrador, la lista de leads y mandar por
e-mail — funciona sin señal.

### Instalarla en el celular

- **Android (Chrome):** abrí la URL, tocá el menú (⋮) → "Agregar a pantalla de
  inicio" o "Instalar app".
- **iPhone (Safari):** abrí la URL, tocá el ícono de compartir (▢↑) → "Agregar
  a pantalla de inicio".

Una vez instalada abre a pantalla completa, sin la barra del navegador.

## Despliegue (Netlify)

Es un sitio estático, sin build ni backend:

- **Build command:** ninguno (dejar vacío).
- **Publish directory:** `.` (la raíz del repo).

Conectando el repo de GitHub a Netlify, cada push a la rama principal
redeploya solo. Netlify sirve todo por HTTPS automáticamente, que es requisito
para que el navegador habilite cámara y micrófono.

Si preferís no usar git, también se puede arrastrar la carpeta del proyecto a
[Netlify Drop](https://app.netlify.com/drop) para un deploy manual.

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
icons/        — íconos de la app en los tamaños que piden Android/iOS
```

Más contexto del proyecto y decisiones de diseño en [CLAUDE.md](CLAUDE.md).
