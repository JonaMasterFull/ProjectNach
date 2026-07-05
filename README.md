# ProjectNach

App full-stack para registrar usuarios con distintas marcas (**Elektra** y **ShopingBaz**). El usuario escribe su nombre en el frontend, se encripta en el navegador y el backend le asigna un número consecutivo por tienda. Ese número viaja encriptado en la respuesta del API y el frontend lo desencripta para mostrárselo al usuario.

## Cómo funciona

1. El usuario entra por la pantalla de bienvenida (tema y tienda según el parámetro `iP` en la URL).
2. Escribe su nombre. Antes de enviarlo, el **frontend lo encripta** con AES-GCM.
3. El **backend** recibe el nombre ya cifrado junto con la tienda (`Elektra` o `ShopingBaz`).
4. Genera el **siguiente consecutivo** de esa tienda (cada marca lleva su propia numeración: 1, 2, 3…).
5. Guarda en MongoDB el nombre encriptado y el consecutivo en claro.
6. Devuelve el consecutivo **encriptado** en el campo `numeroEncriptado`.
7. En la pantalla de resultado, el **frontend desencripta** ese valor y muestra el número de cliente.

El nombre no viaja en texto plano hacia el servidor. El consecutivo tampoco viaja en claro: solo se desencripta en el navegador para mostrarlo.

---

## Decisiones de diseño

Esta sección documenta el **por qué** de las elecciones del proyecto, no solo el **qué**.

### Cifrado en el cliente y en la respuesta

- **Nombre encriptado en el frontend:** el servidor nunca recibe el nombre en claro. El cifrado ocurre antes del `POST /api/users`.
- **Consecutivo encriptado solo en la respuesta:** el backend guarda el número en claro en MongoDB (para generar la secuencia), pero lo devuelve cifrado en `numeroEncriptado`. El frontend lo descifra en la pantalla de resultado.
- **Formato compartido `iv:tag:ciphertext` (hex):** Node (`crypto`) y el navegador (Web Crypto) manejan AES-GCM de forma distinta. Se acordó un formato explícito en hex para que ambos lados sean compatibles.
- **Clave con scrypt:** `APP_SECRET` + `SALT` derivan la misma clave AES-256 en frontend (`@noble/hashes`) y backend (`crypto.scryptSync`). Deben ser **idénticos** en ambos entornos.
- **Sin librería externa de cifrado en el frontend:** se evaluó `@noble/ciphers` y similares, pero se mantuvo Web Crypto nativo + Noble solo para scrypt. Es código estándar del navegador, sin dependencias extra para GCM.

> **Nota de seguridad:** las variables `VITE_*` quedan embebidas en el bundle del frontend. El cifrado en cliente protege el transporte y el diseño del flujo, pero no oculta los secretos al usuario que inspeccione el JS compilado.

### White-label con `iP` y temas JSON

- **`iP` en la URL** (`1` → Elektra, `2` → ShopingBaz) elige tienda y tema sin rutas distintas por marca.
- **Temas en JSON** (`shared` + override por marca): textos, colores y estilos viven en archivos de configuración, no hardcodeados en componentes. Agregar una tienda nueva implica un JSON, assets y una entrada en `storeRoutes.ts`.
- **`ThemeProvider` inyecta CSS variables:** los componentes usan clases Tailwind que leen `--theme-*`, así la UI es reutilizable entre marcas.

### Navegación y estado entre pantallas

- **React Router con rutas `/pages/intro` y `/pages/result`:** separación clara de flujo de bienvenida y resultado.
- **Estado en `location.state` hacia result:** el nombre y `numeroEncriptado` viajan en memoria al cambiar de pantalla (no en la URL). Si el usuario recarga `/pages/result`, no hay estado y se redirige al intro. Es intencional: evita exponer datos sensibles en query params.
- **`public/_redirects` en el frontend (Netlify):** SPA fallback para que rutas como `/pages/intro` resuelvan a `index.html` en producción.

### Dictado por voz

- **Web Speech API nativa** (`SpeechRecognition` / `webkitSpeechRecognition`): sin costo ni API key de terceros.
- **Capa propia** (`lib/speechRecognition.ts` + tipos): el navegador no tipa bien la API; los helpers cubren mensajes en español, formato del transcript y extracción del texto final.
- No se adoptó `react-speech-recognition` para no añadir una dependencia que, al final, también envuelve la misma API del navegador.

### Estructura del código

| Área | Decisión |
|------|----------|
| **Backend** | `createApp()` exportado desde `app.ts` para tests y arranque limpio en `server.ts`. |
| **Frontend crypto** | Módulos en `lib/crypto/` (scrypt, GCM, hex); `utils/crypto.ts` reexporta la API pública. |
| **Convención de funciones** | Funciones flecha `const fn = () =>` en todo el código fuente (frontend y backend). |
| **Páginas vs welcome** | `pages/` orquesta rutas y hooks; `welcome/` concentra UI y acciones del flujo de registro. |

### Tests

| Proyecto | Enfoque | Motivo |
|----------|---------|--------|
| **Backend** | Solo **unitarios** (`src/tests/unit/`), con mocks de Mongoose y dependencias | Rápidos, sin MongoDB en memoria ni HTTP real. Cubren controller, crypto y consecutivos. |
| **Frontend** | Unitarios + componentes + hooks con **Vitest** y Testing Library | `render` / `renderWithTheme` para UI con tema; `renderHook` para hooks sin montar pantalla completa. |

Scripts de cobertura: `npm run coverage` en ambos proyectos.

### Despliegue: dos sitios, dos roles

| Sitio | Plataforma | Qué sirve |
|-------|-----------|-----------|
| **Frontend** | Netlify (`FrontEnd/dist`) | App React. Requiere `_redirects` para SPA. |
| **Backend (estado)** | Netlify (`BackEnd/public`) | Solo `index.html` “Hola mundo” como página de que el proyecto backend existe. **No ejecuta Express.** |
| **Backend (API)** | Render, Railway, Fly.io, VPS, etc. | `npm run build && npm start`. Express + MongoDB + `/api/users`. |

**Por qué Netlify no corre el API:** Netlify publica archivos estáticos (y functions serverless puntuales). Este backend es un servidor Express persistente con MongoDB; necesita un host Node.

- **`BackEnd/netlify.toml`** → `publish = "public"` para la página de estado.
- **`scripts/copy-public.cjs`** → en deploys Node, copia `public/` a `dist/public/` para que Express sirva el mismo `index.html` en `/`.
- **CORS en `app.ts`:** lista explícita de orígenes (`frontendnach.netlify.app`, `localhost:5173`).

### Variables de entorno en producción (frontend)

Vite **incrusta** `VITE_*` en el bundle al compilar. Configúralas en Netlify **antes** del deploy:

| Variable | Uso |
|----------|-----|
| `VITE_API_URL` | URL pública del backend con `/api` (ej. `https://tu-api.onrender.com/api`). **No uses `localhost` en producción.** |
| `VITE_APP_SECRET` | Mismo valor que `APP_SECRET` del backend |
| `VITE_SALT` | Mismo valor que `SALT` del backend |

Secretos locales: `.env.local` (gitignored). Plantilla de referencia: `.env.template`.

---

## Requerimientos

- [Node.js](https://nodejs.org/) versión 20 o superior
- MongoDB (local o Atlas) para el backend

## Cómo está organizado

```
ProjectNach/
├── BackEnd/
│   ├── public/          → index.html de estado (Netlify / Express)
│   ├── src/
│   │   ├── app.ts       → Express, CORS, estáticos, rutas
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/       → crypto, consecutivos
│   │   └── tests/unit/
│   └── netlify.toml     → deploy estático de public/
└── FrontEnd/
    ├── public/_redirects → SPA fallback para Netlify
    └── src/
        ├── config/      → temas, rutas por iP
        ├── lib/crypto/  → cifrado en navegador
        ├── pages/       → IntroPage, ResultPage
        ├── welcome/     → UI del flujo de registro
        └── test/
```

## Instalación

### Backend

```bash
cd BackEnd
npm install
```

Revisa `BackEnd/.env.template` y configura las variables en tu `.env` local.

### Frontend

```bash
cd FrontEnd
npm install
```

Copia `FrontEnd/.env.template` como `.env.local` y completa los valores. Los secretos no deben subirse al repositorio.

## Ponerlo en marcha

Dos terminales:

**Backend**

```bash
cd BackEnd
npm run dev
```

→ `http://localhost:3000` (API en `/api/users`, estado en `/` con “Hola mundo”).

**Frontend**

```bash
cd FrontEnd
npm run dev
```

→ `http://localhost:5173`

### Rutas útiles

- `http://localhost:5173/pages/intro?iP=1` — tema **Elektra**
- `http://localhost:5173/pages/intro?iP=2` — tema **ShopingBaz**
- `/pages/result` — pantalla después del registro (requiere navegación con estado)

## API

| Método | Ruta         | Qué hace |
|--------|--------------|----------|
| POST   | `/api/users` | Registra usuario y devuelve `numeroEncriptado` |

Body:

```json
{
  "encryptedName": "<nombre encriptado en el frontend>",
  "storeType": "Elektra"
}
```

Respuesta (201):

```json
{
  "numeroEncriptado": "<consecutivo encriptado>",
  "encryptedName": "<nombre recibido>",
  "storeType": "Elektra"
}
```

`storeType`: `Elektra` o `ShopingBaz`. Cada tienda tiene su propia secuencia de consecutivos.

## Tests

**Backend** (solo unitarios)

```bash
cd BackEnd
npm test
```

También: `npm run test:watch` y `npm run coverage`.

**Frontend**

```bash
cd FrontEnd
npm test
```

También: `npm run test:watch` y `npm run coverage`.

## Producción

### Frontend (Netlify)

- Base directory: `FrontEnd`
- Build: `npm run build`
- Publish: `dist`
- Variables: `VITE_API_URL`, `VITE_APP_SECRET`, `VITE_SALT`

### Backend — página de estado (Netlify)

- Base directory: `BackEnd`
- Publish: `public` (definido en `netlify.toml`)
- Solo muestra `index.html`; no expone el API.

### Backend — API (host Node)

```bash
cd BackEnd
npm run build   # compila TS y copia public/ → dist/public/
npm start
```

Variables: `PORT`, `URL_DATABASE`, `APP_SECRET`, `SALT`.

Actualiza CORS en `app.ts` si cambia el dominio del frontend.

## Tecnologías

- **Backend:** Express 5, TypeScript, Mongoose, Jest
- **Frontend:** React 19, Vite, Tailwind CSS 4, Vitest, Testing Library
- **Cifrado:** AES-256-GCM + scrypt; `@noble/hashes` (frontend), `crypto` de Node (backend)

## Si algo falla

| Síntoma | Causa probable |
|---------|------------------|
| Error al enviar nombre en producción | `VITE_API_URL` apunta a `localhost` o no está definida en Netlify. Redeploy después de corregir. |
| “No se pudo obtener tu número” en resultado | `VITE_APP_SECRET` / `VITE_SALT` distintos al backend, o no configurados en el build. |
| 404 en rutas del frontend en Netlify | Falta `public/_redirects` o publish directory incorrecto. |
| Backend Netlify sin “Hola mundo” | Publish debe ser `public`, no `dist`. |
| `/api/users` no responde en Netlify | Normal: el API debe estar en un host Node, no en Netlify estático. |
| Backend local no arranca | MongoDB inaccesible o variables de `.env` incompletas. |
| Puerto 3000 ocupado | Desde `BackEnd`: `npm run kill`. |
