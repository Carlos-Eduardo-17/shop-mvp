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

## Carrito (`/api/carts`)

### `POST /api/cart/items`
Agrega un producto al carrito del usuario autenticado, o actualiza su cantidad si ya existe en el carrito. Si el usuario no tiene carrito aún, se crea automáticamente.

- **Auth**: Sí

**Body**
```json
{ "productId": 1, "quantity": 2 }
```

**Reglas de validación**
- `productId`: obligatorio, entero positivo (≥ 1).
- `quantity`: obligatorio, entero entre 1 y 5.

**Reglas de negocio**
- Máximo 5 unidades acumuladas por producto en el carrito (si ya había unidades, se valida la suma total).
- Se valida que el producto exista y que haya stock suficiente para la cantidad solicitada.

**Respuesta `200`**
```json
{
  "message": "Se agregó/actualizó correctamente la cantidad del producto.",
  "data": { "id": 10, "quantity": 2, "cartId": 3, "productId": 1 }
}
```

**Errores posibles**: `400` cantidad inválida, límite de 5 unidades superado, o stock insuficiente · `404` el producto no existe · `401` no autenticado.

---

### `GET /api/cart`
Obtiene el carrito activo del usuario autenticado, con el detalle de cada producto y el total calculado. Si el usuario no tiene carrito, devuelve uno vacío.

- **Auth**: Sí

**Respuesta `200`**
```json
{
  "message": "Se obtuvo el carrito y su total correctamente.",
  "data": {
    "id": 3,
    "userId": "uuid",
    "items": [
      {
        "id": 10,
        "quantity": 2,
        "productId": 1,
        "product": { "id": 1, "name": "Osito Dormilón", "unitPrice": 45.00, "imageUrl": "https://..." },
        "subtotal": 90.00
      }
    ],
    "total": 90.00
  }
}
```

**Errores posibles**: `401` no autenticado.

---

### `DELETE /api/cart/items`
Elimina un ítem específico (?cartItemId=6) del carrito del usuario autenticado.

- **Auth**: Sí

- **Validación**: `cartItemId` (query, opcional) debe ser numérico >= 1.

**Reglas de validación**
- `cartItemId`: obligatorio, entero positivo (≥ 1).

**Respuesta `200`**
```json
{ "message": "Se removió correctamente el item del carrito" }
```

**Errores posibles**: `404` carrito no encontrado, o el ítem no pertenece al carrito del usuario · `401` no autenticado.

---

## Órdenes (`/api/orders`)

### `POST /api/orders`
Convierte el carrito activo del usuario en una orden con estado `PENDING`. Revalida el stock de cada producto al momento del checkout, congela el precio unitario vigente en cada línea del detalle, descuenta el stock y vacía el carrito — todo en una transacción atómica.

- **Auth**: Sí

**Body**
```json
{ "shippingAddress": "Av. Siempre Viva 742, Lima" }
```

**Reglas de validación**
- `shippingAddress`: obligatorio, texto entre 8 y 128 caracteres.

**Respuesta `201`**
```json
{
  "message": "Se generó la orden correctamente. Queda pendiente de pago.",
  "data": {
    "id": 5,
    "status": "PENDING",
    "total": 90.00,
    "shippingAddress": "Av. Siempre Viva 742, Lima",
    "createdAt": "2026-07-31T00:00:00.000Z",
    "details": [
      { "id": 1, "productId": 1, "quantity": 2, "unitPrice": 45.00, "subtotal": 90.00 }
    ]
  }
}
```

**Errores posibles**: `400` el carrito está vacío, o stock insuficiente de algún producto · `401` no autenticado.

**Nota**: el paso de `PENDING` a `PAID` no tiene endpoint propio en esta versión — lo realiza el desarrollador manualmente en Supabase (ver [`alcance.md`](./alcance.md)).

---

### `GET /api/orders`
Lista todas las órdenes del usuario autenticado, con el detalle de productos de cada una, ordenadas de la más reciente a la más antigua.

- **Auth**: Sí

**Respuesta `200`**
```json
{
  "message": "Órdenes",
  "data": [
    {
      "id": 5,
      "status": "PENDING",
      "total": 90.00,
      "shippingAddress": "Av. Siempre Viva 742, Lima",
      "createdAt": "2026-07-31T00:00:00.000Z",
      "details": [
        { "id": 1, "productId": 1, "quantity": 2, "unitPrice": 45.00, "subtotal": 90.00 }
      ]
    }
  ]
}
```

**Errores posibles**: `401` no autenticado.