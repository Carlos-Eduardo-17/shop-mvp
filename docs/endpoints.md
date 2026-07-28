# Endpoints de la API

Base URL local: `http://localhost:3000/api`

Notas generales:
- Todos los endpoints tienen **rate limiting** por IP (respuesta `429` con mensaje indicando cuándo reintentar).
- Los endpoints que reciben body validan estrictamente los campos permitidos (`express-validator` + `checkExact`); enviar un campo extra o faltante retorna `400`.
- Los endpoints marcados como **Auth: Sí** requieren la cookie `accessToken` (se obtiene vía `/users/login`).
- Formato de error estándar:
  ```json
  {
    "status": "Error",
    "message": "Descripción del error",
    "details": "-"
  }
  ```
  (en `NODE_ENV=development`, `status` y `details` incluyen información técnica adicional para debugging).

---

## Salud del servicio

### `GET /api/health`
Verifica que el backend esté activo.

- **Auth**: No

**Respuesta `200`**
```json
{
  "status": "✅ Backend connected.",
  "timestamp_UTC": "2026-07-27T00:00:00.000Z",
  "region": "Lima, Perú"
}
```

---

## Usuarios (`/api/users`)

### `POST /api/users/register`
Crea una nueva cuenta de usuario.

- **Auth**: No

**Body**
```json
{
  "email": "cliente@correo.com",
  "password": "Clave123!",
  "firstName": "Ana",
  "lastName": "Torres"
}
```

**Reglas de validación**
- `email`: obligatorio, formato válido, máx. 64 caracteres.
- `password`: obligatorio, mín. 8 caracteres, con mayúscula, minúscula, número y símbolo, máx. 32 caracteres.
- `firstName` / `lastName`: obligatorios, solo letras, máx. 32 caracteres.

**Respuesta `201`**
```json
{ "message": "Se registró exitosamente la cuenta (uuid) de Ana Torres usando cliente@correo.com." }
```

**Errores posibles**: `409` email ya registrado · `400` datos inválidos.

---

### `POST /api/users/login`
Inicia sesión y entrega las cookies de sesión.

- **Auth**: No

**Body**
```json
{ "email": "cliente@correo.com", "password": "Clave123!" }
```

**Respuesta `200`** — además setea cookies `httpOnly`: `accessToken` (15 min) y `refreshToken` (7 días)
```json
{
  "message": "Login exitoso",
  "data": { "id": "uuid", "email": "cliente@correo.com", "firstName": "Ana", "lastName": "Torres" }
}
```

**Errores posibles**: `401` credenciales inválidas o cuenta no registrada.

---

### `POST /api/users/refresh`
Renueva el access token usando el refresh token vigente (enviado automáticamente vía cookie).

- **Auth**: Requiere cookie `refreshToken` válida (no requiere `accessToken`)
- **Body**: ninguno

**Respuesta `200`** — rota ambas cookies (`accessToken` y `refreshToken`)
```json
{ "message": "Sesión renovada exitosamente" }
```

**Errores posibles**: `401` token inválido, expirado o revocado.

---

### `GET /api/users/me`
Obtiene el perfil del usuario autenticado.

- **Auth**: Sí

**Respuesta `200`**
```json
{
  "message": "Perfil recuperado con éxito",
  "data": { "email": "cliente@correo.com", "firstName": "Ana", "lastName": "Torres" }
}
```

**Errores posibles**: `401` no autenticado · `404` usuario no encontrado.

---

### `POST /api/users/logout`
Cierra la sesión: revoca el refresh token en base de datos y limpia las cookies del navegador.

- **Auth**: Sí

**Respuesta `200`**
```json
{ "message": "Sesión finalizada correctamente." }
```

---

## Categorías (`/api/categories`)

### `GET /api/categories`
Lista todas las categorías (usado para menús desplegables de filtro).

- **Auth**: No

**Respuesta `200`**
```json
{
  "message": "Categorías",
  "data": [
    { "id": 1, "name": "Amigurumis" },
    { "id": 2, "name": "Materiales" }
  ]
}
```

---

## Productos (`/api/products`)

### `GET /api/products/`
Lista productos. Acepta un query param opcional categoryId (numérico, mayor a 0); si se envía, filtra por esa categoría, en caso contrario retorna todos los productos.

- **Auth**: No
- **Validación**: `categoryId` (query, opcional) debe ser numérico >= 1.

**Respuesta `200`**
```json
{
  "message": "Productos",
  "data": [
    {
      "id": 1,
      "name": "Osito Dormilón",
      "description": "Amigurumi tejido a mano con hilo de algodón hipoalergénico.",
      "unitPrice": 45.00,
      "unitsInStock": 5,
      "imageUrl": "https://...",
      "categoryId": 1,
      "categoryName": "Amigurumis"
    }
  ]
}
```

### `GET /api/products/:id`
Obtiene el detalle de un producto por su ID.

- **Auth**: No
- **Validación**: `id` debe ser numérico.

**Respuesta esperada `200`**
```json
{
  "message": "Producto",
  "data": {
    "id": 1,
    "name": "Osito Dormilón",
    "description": "Amigurumi tejido a mano con hilo de algodón hipoalergénico.",
    "unitPrice": 45.00,
    "unitsInStock": 5,
    "imageUrl": "https://...",
    "categoryId": 1,
    "categoryName": "Amigurumis"
  }
}
```

---

## Próximos endpoints (fuera del MVP actual)

Modelados en la base de datos pero sin implementar todavía en la API:

- `Cart` / `CartItem` → gestión del carrito de compras del usuario autenticado.
- `Order` / `OrderDetail` → checkout y generación de órdenes de compra.

Ver alcance detallado en [`alcance.md`](./alcance.md).
