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

El nombre nunca viaja en texto plano hacia el servidor. El consecutivo tampoco viaja en claro: solo se desencripta en el navegador para mostrarlo.

## Requerimientos para instalar

- [Node.js](https://nodejs.org/) versión 20 o superior

## Cómo está organizado

```
ProjectNach/
├── BackEnd/     → API con Express, TypeScript y MongoDB
└── FrontEnd/    → App React con Vite
```

**Backend** — recibe el registro, asigna el consecutivo por tienda, encripta el número en la respuesta y persiste en MongoDB.

**Frontend** — pantalla de bienvenida, captura del nombre (incluso por voz), encriptación del nombre, desencriptación del consecutivo y resultado. Cambia colores, textos y logos según la tienda.

## Instalación

### Backend

```bash
cd BackEnd
npm install
```

Revisa `BackEnd/.env.template`: ahí están las variables que necesita el proyecto para funcionar. Complétalas en tu entorno local antes de levantar el servidor.

Los valores de `APP_SECRET` y `SALT` deben ser los mismos que uses en el frontend.

### Frontend

```bash
cd FrontEnd
npm install
```

Igual que en el backend, mira `FrontEnd/.env.template` para ver qué variables hacen falta y configúralas en tu máquina.

## Ponerlo en marcha

Necesitas dos terminales abiertas.

**Backend**

```bash
cd BackEnd
npm run dev
```

Queda en `http://localhost:3000`. MongoDB esta activo.

**Frontend**

```bash
cd FrontEnd
npm run dev
```

Queda en `http://localhost:5173`.

### Rutas útiles

- `http://localhost:5173/pages/intro?iP=1` — flujo con tema **Elektra**
- `http://localhost:5173/pages/intro?iP=2` — flujo con tema **ShopingBaz**
- `/pages/result` — pantalla después del registro

El `iP` en la URL elige qué tienda (y qué tema) se muestra.

## API

| Método | Ruta         | Qué hace                          |
|--------|--------------|-----------------------------------|
| POST   | `/api/users` | Registra usuario y devuelve `numeroEncriptado` |

Ejemplo de body:

```json
{
  "encryptedName": "<nombre encriptado en el frontend>",
  "storeType": "Elektra"
}
```

Respuesta exitosa (201):

```json
{
  "numeroEncriptado": "<consecutivo encriptado en el backend>",
  "encryptedName": "<mismo nombre recibido>",
  "storeType": "Elektra"
}
```

`storeType` acepta: `Elektra` o `ShopingBaz`. Cada tienda tiene su propia secuencia de consecutivos.

## Tests

**Backend**

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

```bash
# Backend
cd BackEnd
npm run build
npm start

# Frontend
cd FrontEnd
npm run build
npm run preview
```

El frontend compilado queda en `FrontEnd/dist/`.

## Tecnologías

- **Backend:** Express, TypeScript, Mongoose, Jest
- **Frontend:** React 19, Vite, Tailwind CSS, Vitest
- **Cifrado:** AES-GCM compartido entre frontend y backend (`APP_SECRET` / `SALT` deben coincidir en ambos)

## Si algo falla

- El backend no arranca → revisa que MongoDB esté encendido y que las variables del template estén bien configuradas.
- Puerto 3000 ocupado → desde `BackEnd` puedes usar `npm run kill`.
