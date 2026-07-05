# ProjectNach

App para registrar usuarios en **Elektra** y **ShopingBaz**. La persona escribe su nombre, el navegador lo encripta antes de enviarlo, el servidor le asigna un número de turno por tienda y lo devuelve encriptado para mostrarlo en pantalla.

## Qué hace el flujo

1. Entras a la pantalla de bienvenida. Según el `iP` de la URL ves Elektra o ShopingBaz.
2. Escribes tu nombre (o lo dictas con el micrófono).
3. El frontend encripta el nombre y lo envía al backend junto con la tienda.
4. El backend guarda el registro, calcula el siguiente número de esa tienda y lo regresa encriptado.
5. En la pantalla de resultado el frontend lo desencripta y muestra tu número.

Cada tienda lleva su propia numeración: Elektra va 1, 2, 3… y ShopingBaz igual, por su lado.

---

## Por qué está hecho así

### Cifrado

El nombre no viaja legible por la red: se encripta en el navegador antes del envío.

El número de turno se guarda en claro en la base de datos para poder generar la secuencia, pero al usuario se le regresa encriptado y solo se muestra en su pantalla.

Frontend y backend comparten la misma clave, derivada de `APP_SECRET` y `SALT`. Esos dos valores deben coincidir en ambos lados.

Las variables `VITE_*` del frontend quedan en el código compilado. El cifrado protege el flujo de datos, pero no sustituye un manejo seguro de secretos en el servidor.

### Dos marcas, una sola app

En lugar de duplicar la aplicación, los colores, textos y logos se configuran con archivos JSON de tema.

El `iP` en la URL elige la tienda: `1` es Elektra, `2` es ShopingBaz. Para agregar otra marca hay que sumar tema, logo y su entrada en la configuración de rutas.

### Pantallas y navegación

Hay dos pantallas: bienvenida (`/pages/intro`) y resultado (`/pages/result`).

Al pasar al resultado, el nombre y el número encriptado viajan en memoria, no en la URL. Si se recarga la pantalla de resultado, la app regresa al inicio para no exponer datos en el enlace.

En Netlify, el frontend usa `_redirects` para que esas rutas funcionen al entrar directo o al refrescar la página.

### Dictado por voz

Se usa la API de voz del navegador, sin servicios externos ni costo adicional. Los mensajes al usuario están en español y el texto dictado se formatea antes de mostrarse.

### Tests

En el backend hay pruebas unitarias con mocks: no requieren MongoDB ni llamadas HTTP reales.

En el frontend se prueban funciones, componentes y hooks de forma aislada.

Para cobertura: `npm run coverage` en cualquiera de los dos proyectos.

### Producción

El proyecto se despliega en dos partes:

**Frontend (Netlify)** — la app React. Build con `npm run build`, publish en `dist`.

**Backend en Netlify** — solo la página de estado en `public/` (“Hola mundo”). No ejecuta el API: Netlify no corre Express ni MongoDB.

**Backend API** — debe estar en un servicio Node (Render, Railway, VPS, etc.) con `npm run build` y `npm start`.

Las variables del frontend se incluyen al compilar. En Netlify deben definirse antes del deploy:

- `VITE_API_URL` — URL pública del backend con `/api` al final
- `VITE_APP_SECRET` — mismo valor que en el backend
- `VITE_SALT` — mismo valor que en el backend

En local, usa `.env.template` como referencia y guarda los secretos en `.env.local` sin subirlos al repositorio.

---

## Qué necesitas

- Node 20+
- MongoDB (local o Atlas)

## Estructura

```
ProjectNach/
├── BackEnd/    → API, MongoDB, página de estado
└── FrontEnd/   → App React con temas Elektra / ShopingBaz
```

## Instalación

**Backend**

```bash
cd BackEnd
npm install
```

Revisa `BackEnd/.env.template` y crea tu `.env` con los valores correspondientes.

**Frontend**

```bash
cd FrontEnd
npm install
```

Copia `FrontEnd/.env.template` a `.env.local` y completa los secretos.

## Correr en local

Abre dos terminales.

Backend:

```bash
cd BackEnd
npm run dev
```

Disponible en http://localhost:3000. El API está en `/api/users`. En `/` se muestra la página de estado.

Frontend:

```bash
cd FrontEnd
npm run dev
```

Disponible en http://localhost:5173.

Enlaces de prueba:

- http://localhost:5173/pages/intro?iP=1 → Elektra
- http://localhost:5173/pages/intro?iP=2 → ShopingBaz

## API

**POST `/api/users`**

Body:

```json
{
  "encryptedName": "nombre ya encriptado",
  "storeType": "Elektra"
}
```

Respuesta: número encriptado, nombre recibido y tienda. `storeType` acepta `Elektra` o `ShopingBaz`.

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

También disponibles: `npm run test:watch` y `npm run coverage`.

## Producción

**Frontend (Netlify)**

- Base directory: `FrontEnd`
- Build: `npm run build`
- Publish: `dist`
- Variables: `VITE_API_URL`, `VITE_APP_SECRET`, `VITE_SALT`

**Backend — página de estado (Netlify)**

- Base directory: `BackEnd`
- Publish: `public` (configurado en `netlify.toml`)

**Backend — API (servicio Node)**

```bash
cd BackEnd
npm run build
npm start
```

Variables: `PORT`, `URL_DATABASE`, `APP_SECRET`, `SALT`. Si cambia el dominio del frontend, actualiza CORS en `app.ts`.

## Problemas frecuentes

- **El registro falla en producción** — Verifica que `VITE_API_URL` en Netlify apunte al backend público (no a `localhost`) y vuelve a desplegar.
- **No se muestra el número en resultado** — Confirma que `VITE_APP_SECRET` y `VITE_SALT` coincidan con el backend y estén definidos antes del build.
- **404 en rutas del frontend** — Revisa que exista `public/_redirects` y que la carpeta de publish sea `dist`.
- **La página de estado del backend no carga en Netlify** — El publish directory debe ser `public`, no `dist`.
- **El API no responde en Netlify** — Es el comportamiento esperado; el API debe estar en un servicio Node.
- **El backend local no inicia** — Revisa la conexión a MongoDB y que el `.env` esté completo.
- **Puerto 3000 en uso** — Ejecuta `npm run kill` desde `BackEnd`.

## Stack

Express, MongoDB y TypeScript en el backend. React, Vite y Tailwind en el frontend.
