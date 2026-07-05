# ProjectNach

App para registrar usuarios en **Elektra** y **ShopingBaz**. La persona escribe su nombre, el navegador lo encripta antes de mandarlo, el servidor le asigna un número de turno por tienda y se lo devuelve también encriptado para mostrarlo en pantalla.

## Qué hace el flujo

1. Entras a la pantalla de bienvenida. Según el `iP` de la URL ves Elektra o ShopingBaz.
2. Escribes tu nombre (o lo dictas con el micrófono).
3. El frontend encripta el nombre y lo manda al backend junto con la tienda.
4. El backend guarda el registro, calcula el siguiente número de esa tienda y te lo regresa encriptado.
5. En la pantalla de resultado el frontend lo desencripta y te muestra tu número.

Cada tienda lleva su propia numeración: Elektra va 1, 2, 3… y ShopingBaz igual, por su lado.

---

## Por qué lo hicimos así

### Sobre el cifrado

Queríamos que el nombre no viajara legible por la red. Por eso se encripta en el navegador antes del envío.

El número de turno sí se guarda en claro en la base de datos (así podemos saber cuál sigue), pero al usuario se le regresa encriptado y solo se lee en su pantalla.

Frontend y backend usan la misma clave, derivada de `APP_SECRET` y `SALT`. Esos dos valores tienen que coincidir en ambos lados.

No metimos librerías raras de cifrado: en el navegador usamos lo que ya trae, y en el servidor lo de Node. El código de crypto quedó repartido en archivos chicos para que se entienda mejor.

Ojo: las variables `VITE_*` del frontend se ven en el código compilado. El cifrado cumple su papel en el flujo, pero no es un vault impenetrable.

### Dos marcas, una sola app

En vez de duplicar la app, cambiamos colores, textos y logos con archivos JSON de tema.

El `iP` en la URL elige la tienda: `1` es Elektra, `2` es ShopingBaz. Para agregar otra marca hay que sumar tema, logo y una línea en la config de rutas.

### Pantallas y navegación

Hay dos pantallas: bienvenida (`/pages/intro`) y resultado (`/pages/result`).

Al pasar al resultado, el nombre y el número encriptado viajan en memoria, no en la URL. Si alguien recarga la pantalla de resultado, vuelve al inicio. Así evitamos dejar datos en el link.

En Netlify el frontend necesita un `_redirects` para que esas rutas no den 404 al entrar directo o al refrescar.

### Dictado por voz

Usamos la API de voz del navegador. No cuesta extra ni pide API key. Solo agregamos helpers propios para mensajes en español y para formatear lo que se escucha.

### Código y tests

En frontend y backend usamos funciones flecha (`const algo = () => {}`) en todo el proyecto.

En el backend solo hay pruebas unitarias, con mocks. Son rápidas y no necesitan levantar Mongo ni pegarle al API de verdad.

En el frontend probamos funciones, componentes y hooks. Donde hace falta tema usamos un wrapper; donde solo es lógica, probamos el hook directo.

Para cobertura: `npm run coverage` en cualquiera de los dos.

### Dónde va cada cosa en producción

Aquí nos confundimos un rato y vale la pena dejarlo claro:

**Frontend en Netlify** — ahí vive la app React. Compilas con `npm run build` y publicas la carpeta `dist`.

**Backend en Netlify** — solo sirve la paginita de “Hola mundo” en `public/`. Confirma que el repo backend existe, pero **no corre el API**. Netlify no levanta Express ni MongoDB.

**Backend de verdad (el API)** — tiene que estar en un servicio que corra Node: Render, Railway, un VPS, lo que prefieras. Ahí sí: `npm run build` y `npm start`.

Si el frontend en producción no puede registrar usuarios, casi seguro `VITE_API_URL` apunta a `localhost` o no está configurada en Netlify. Vite mete esas variables al compilar, así que hay que definirlas **antes** del deploy y volver a publicar.

Variables del frontend en Netlify (producción):

- `VITE_API_URL` — URL pública del backend con `/api` al final
- `VITE_APP_SECRET` — igual que en el backend
- `VITE_SALT` — igual que en el backend

En local, copia `.env.template` a `.env.local` y no subas secretos al repo.

---

## Qué necesitas

- Node 20+
- MongoDB (local o Atlas)

## Estructura

```
ProjectNach/
├── BackEnd/    → API, MongoDB, pagina de estado
└── FrontEnd/   → App React con temas Elektra / ShopingBaz
```

## Instalación

**Backend**

```bash
cd BackEnd
npm install
```

Mira `BackEnd/.env.template` y crea tu `.env` con los valores reales.

**Frontend**

```bash
cd FrontEnd
npm install
```

Copia `FrontEnd/.env.template` a `.env.local` y llena los secretos.

## Correr en local

Abre dos terminales.

Backend:

```bash
cd BackEnd
npm run dev
```

Queda en http://localhost:3000. El API está en `/api/users`. En `/` ves el “Hola mundo”.

Frontend:

```bash
cd FrontEnd
npm run dev
```

Queda en http://localhost:5173.

Links de prueba:

- http://localhost:5173/pages/intro?iP=1 → Elektra
- http://localhost:5173/pages/intro?iP=2 → ShopingBaz

## API

Un solo endpoint importante:

**POST `/api/users`**

Manda:

```json
{
  "encryptedName": "nombre ya encriptado",
  "storeType": "Elektra"
}
```

Te responde con el número encriptado, el nombre que recibió y la tienda. `storeType` puede ser `Elektra` o `ShopingBaz`.

## Tests

Backend:

```bash
cd BackEnd
npm test
```

Frontend:

```bash
cd FrontEnd
npm test
```

En ambos también puedes usar `npm run test:watch` y `npm run coverage`.

## Producción

**Frontend (Netlify)**

- Carpeta base: `FrontEnd`
- Build: `npm run build`
- Publicar: `dist`
- Variables: `VITE_API_URL`, `VITE_APP_SECRET`, `VITE_SALT`

**Backend — pagina de estado (Netlify)**

- Carpeta base: `BackEnd`
- Publicar: `public` (ya está en `netlify.toml`)
- Solo muestra el Hola mundo

**Backend — API (servicio Node)**

```bash
cd BackEnd
npm run build
npm start
```

Necesitas `PORT`, `URL_DATABASE`, `APP_SECRET` y `SALT`. Si cambias el dominio del frontend, actualiza CORS en `app.ts`.

## Si algo no jala

- **No guarda el nombre en producción** → Revisa `VITE_API_URL` en Netlify. No puede ser localhost. Redeploy después de cambiarla.
- **No muestra el número en resultado** → `VITE_APP_SECRET` y `VITE_SALT` no coinciden con el backend, o faltan en el build.
- **404 en rutas del frontend** → Falta el `_redirects` o la carpeta de publish está mal.
- **Netlify del backend sin Hola mundo** → Publish debe ser `public`, no `dist`.
- **El API no responde en Netlify** → Es normal. El API va en otro servicio.
- **Backend local no arranca** → Mongo caído o `.env` incompleto.
- **Puerto 3000 ocupado** → `npm run kill` desde BackEnd.

## Stack

Express + MongoDB + TypeScript en el backend. React + Vite + Tailwind en el frontend.
