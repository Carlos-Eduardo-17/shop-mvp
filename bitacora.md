## 0. Prerequisitos
- Tener instalado:
    - Node.js y npm.
    - PNPM.
    - Git.
    - Postman.
- Tener configurado el usuario de Git:

        git config --global user.name "Carlos Eduardo"
        git config --global user.email "carlos.1710.ml@gmail.com"

- Saber cómo enviar cambios del repositorio local al remoto:

        git add . → Envía cambios recientes al área de stagging
        git commit -m "Create archivo" → Envía cambios del área de stagging al repositorio local
        git push origin main → Envía cambios del repositorio local al remoto

- Usar verbos en infinitivo y descripciones breves para commits de git
            
        Corregir validación de formulario de contacto

        - Se añadió validación para campos vacíos en el lado del cliente.
        - Se ajustó el regex del correo electrónico para permitir nuevos dominios.
        - Resuelve issue 123.

## 1. Inicialización de repositorio Git
- Ir a GitHub y crear un **repositorio remoto** siguiendo esta [referencia](./docs/img/github-01.png).
- Ir a la sección de **<>Code** y copiar el enlace HTTPS: https://github.com/Carlos-Eduardo-17/shop-mvp.git.
- Ir a la carpeta local del proyecto y abrir la terminal de comandos.

    - Clonar repositorio remoto a local:

            git clone https://github.com/Carlos-Eduardo-17/shop-mvp.git
    - Ingresar a la carpeta y verificar repositorios remotos asociados al repositorio local:
            
            cd shop-mvp
            git remote -v
      Donde:

            origin  https://github.com/Carlos-Eduardo-17/shop-mvp.git (fetch) →  Usado para traer cambios del remoto al local
            origin  https://github.com/Carlos-Eduardo-17/shop-mvp.git (push) → Usado para enviar cambios del local al remoto

## 2. Edición de readme y creación de documentación adjunta
- Reglas de negocio
- Alcance
- Estructura de carpetas
- Sustentación de paquetes que se usarán
- Roles

## 3. Modificación de .gitignore
**Ignorados predeterminadamente:**
- .env    → Contiene credenciales y contraseñas críticas del sistema. En su lugar, 
- node_modules/   → Innecesario y pesado. Se generar a partir de package.json

**Persistencia temporal:**
- dist/ → Contendrá el código fuente en formato JS. Eliminarlo de .gitignore cuando se entre en la etapa de producción.
- src/ → Contiene el código fuente en formato TS. No ignorarlo mientras se esté en la etapa de desarrollo.

**Ignorados personalizados:**
- /pasos.md → Bitácora interna del desarrollador. Innecesario para público en general.

## 4. Inicialización de proyecto PNPM
- Establecer la versión de PNPM e inicializar proyecto.

        pnpm --version → Ver versión de pnpm
        corepack use pnpm@latest-11 → Establecer versión de pnpm e inicializar proyecto

    Se creará automáticamente: package.json, pnpm-lock.yaml y node_modules/

## 5. Instalación y configuración de TypeScript
- Instalar TypeScript, Rimraf y Tsx solo para el entorno de desarrollo

        pnpm add -D typescript rimraf tsx
  Se creará automáticamente: pnpm-workspace.yaml
- Aprobar todas las dependencias (esbuild@0.28.1) necesarias para Tsx

        pnpm approve-builds
- Generar archivo de configuración inicial para TS

        npx tsc --init

    Se creará automáticamente: tsconfig.json
- Modicar archivo tsconfig.json
  - Véase [tsconfig.json](/tsconfig.json)

## 6. Configuración de package.json
- Agregar las siguientes clave: valor al inicio de package.json

      "name": "shop-mvp",
      "version": "1.0.0", → (gran cambio).(pequeño cambio).(corrección compatible con c.pequeño)
      "description": "Monolito (API REST) de Backend de e-commerce B2C (MVP) orientado a la venta de amigurumis y productos relacionados con el crochet.",
      "main": "index.js", → Entry Point
      "scripts": {
          "test": "echo \"Error: no test specified\" && exit 1",
          "build": "rimraf dist && tsc", → Borra dist/ y vuelve a compilar
          "start": "node dist/index.js", → Esto deberá ejecutar el servidor en producción
          "dev": "tsx watch src/index.ts" → Dedicado exclusivamente para entorno de desarrollo.
      },
      "keywords": [],
      "author": "Carlos Medina",
      "license": "ISC",
      "type": "module",

## 7. Instalación de Dependencias
**Dependencias**

    pnpm add express cors dotenv helmet jsonwebtoken bcrypt pg express-rate-limit cookie-parser @prisma/client @prisma/adapter-pg

**Dependencias de desarrollo**

    pnpm add -D @types/bcrypt @types/cookie-parser @types/cors @types/express @types/jsonwebtoken @types/node @types/pg prisma

## 8. Inicialización de Prisma
- Usar la CLI (prisma) para inicializar con PostgreSQL como DB.

        pnpm dlx prisma init --datasource-provider postgresql

    Se crearán automáticamente: 
    - prisma/schema.prisma: Permite definir tablas (modelos) y el código que se va a generar.
    - prisma.config.ts: Administrador de conexión a la DB.
    - .env: Contiene variables de entorno.
- Automáticamente tsconfig.json se pondrá en rojo (error). Esto ocurre porque al crearse el archivo prisma.config.ts, TS se pone en alerta al detectar un primer archivo TS y nos alerta que no está dentro de src como le indicamos en el archivo tsconfig.json ("include": ["src/**/*",],). Se soluciona creando la carpeta src/ y un archivo TS cualquiera dentro.

## 9. Configuración de Prisma
- Modificar prisma.config.ts
    - Cambiar: 
        - import { defineConfig } from "prisma/config"; → import { defineConfig, env } from "prisma/config";    
        - url: process.env["DATABASE_URL"], → url: env("DATABASE_URL"),
- Modificar schema.prisma
    - Eliminar:
        - output   = "../src/generated/prisma"
    - Modificar:
        - provider = "prisma-client" → provider = "prisma-client-js"

## 10. Obtención de URL de la DB de Supabase
- Ir a Supabase y crear un nuevo proyecto:
    - Nombre: mvp-commerce
    - Contraseña: generada por Supabase (guardarla en bloc de notas momentáneamente)
    - Región: América
    - Desmarcar:
        - Enable Data API → Supabase genera una API paralela
        - Automatically expose new tables → Expone tablas públicamente
        - Enable automatic RLS → Permite conectar al Frontend directamente a la DB
- Una vez creado el proyecto, hacer clic en Connect (arriba a la derecha), ir a: Direct → Direct connection → Type: URI → Connection string y copiar la cadena de conexión.
- Ir a VSCode y pegar la cadena de conexión en .env. Quedará algo como esto: DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.ufamtwtqiyhmxolkwall.supabase.co:5432/postgres", reemplazar [YOUR-PASSWORD] por la contraseña que Supabase generó.

## 11. Creación de la estructura de carpetas
- Crear src/ y todas sus subcarpetas, incluyendo un archivo index.ts.
    - Adicionalmente ayudará a  mitigar la alerta de tsconfig.json.

            mkdir src src/routes src/controllers src/services src/repositories src/config src/middlewares src/utils src/seeds src/dtos
            touch src/index.ts

## 12. Creación de Cliente de Prisma, definición y sincronización de modelos de la DB
- Ir a schema.prisma y definir las tablas junto con sus campos. Ver [schema](/prisma/schema.prisma).
- Crear al Cliente de Prisma y enviar las tablas definidas a Supabase.

        pnpm exec prisma db push
    Esto crea al Cliente de Prisma por debajo y sincroniza schema.prisma directamente con Supabase sin crear un historial de migraciones. Ideal en etapa de construcción.

    Salida esperada: Your database is now in sync with your Prisma schema.
- Ir a Supabase → TableEditor. Debería evidenciarse las tablas creadas.

## 13. Creación puntual de Cliente de Prisma (opcional)
- En caso de haber borrado la carpeta node_modules o necesitar reforzar la actualización de tipos, se pueden regenerar los tipos para TS creando nuevamente el Cliente de Prisma.

        pnpm exec prisma generate

## 14. Creación de Archivo de Conexión
- Ir a src/config/ y crear db.ts para que TS pueda levantar la conexión a la DB usando los 3 paquetes (@prisma/client, pg y @prisma/adapter-pg). Se inicializará al cliente inyectándole el adaptador `pg` para optimizar el rendimiento. Ver [db.ts](/src/config/db.ts).
- Nótese que al inicio, PrismaClient dirá "El módulo '"@prisma/client"' no tiene ningún miembro 'PrismaClient' exportado.", eso sucede porque al instalar @prisma/client por primera vez, viene vacío por defecto y necesita leer el archivo schema.prisma para generar dinámicamente el código TS (incluyendo la clase PrismaClient).
- Generar nuevamente el Cliente de Prisma para solucionar el error: "El módulo '"@prisma/client"' no tiene ningún miembro 'PrismaClient' exportado."

        pnpm exec prisma generate
    Salida esperada: ✔ Generated Prisma Client

## 15. Creación de Punto de entrada y Servidor de Express
- Crear src/server.ts. como Servidor de Express (ver [server.ts](/src/server.ts)).
- Modificar src/index.ts como Punto de Entrada (ver [index.ts](/src/index.ts)).

## 16. Creación de módulo user
### 16.1. Registrar usuario
- Todo ok
### 16.2. Login
- Se usará una estrategia con JWToken + httpOnly
- Se crean variables de entorno: JWT_ACCESS_SECRET, JWT_REFRESH_SECRET y NODE_ENV.
- Se crean dos métodos en el repositorio: findUserByEmail y saveRefreshToken.
- Se crea un método en service: loginUser y se importan bcrypt, jwt y el repositorio. 
- En service se verifica que el user exista y que la contraseña coincida usando compare de Bcrypt.
- En service, se crea accessToken (userID, role, JWT_ACCESS_SECRET, expiresIn: '15m') y  refreshToken(userId, JWT_REFRESH_SECRET, expiresIn: '7d')
- En service se guarda el refreshToken en la DB.
- En service se entrega accessToken, refreshToken y user al controller.
- En controller, se crea el método login.
- En controller, se crea la variable cookieOptions (de tipo CookieOptions desde express) para definir httpOnly, secure (accesibilidad) y sameSite: 'strict'.
- En controller se inyecta a una cookie (que se llamará accessToken) el AccessToken obtenido, y se le configura el tiempo de duración de la cookie a 15 minutos. 
- En controller se inyecta a una cookie (que se llamará refreshToken) el RefreshToken obtenido, y se le configura el tiempo de duración de la cookie a 7 días.
- En controller se le entrega al usuario final un mensaje de éxito y se le muestra su usuario.
- En route se agregó la ruta login
- Login solicita correo y contraseña, y entregará un mensaje y datos básicos del usuario actual en un JSON, adicionalmente creará las cookies: accessToken y refreshToken
## 16.3. RefreshToken
- Hacer una modificación en schema.prisma:
    - En la tabla users, agregar la etiqueta @unique al campo refresh_token
    - Aplicar cambios a la DB de Supabase

            pnpm exec prisma db push
    - Generar nuevamente el cliente de Prisma para que vuelva a cargar los Tipos

            pnpm exec prisma generate
- En repository, se crea los métodos:
    - findByRefreshToken: Buscar usuario por refreshtoken
    - updateRefreshToken: Actualizar refreshtoken del usuario
- En service, se crea el método refreshSession para renovar el refreshToken, donde:
    - Se comprueba (usando el JWT_REFRESH_SECRET) que el refreshToken (tomado de las cookies) sea válido.
    - Se comprueba que exista el usuario, buscándolo en la DB usando el refreshToken ya comprobado.
    - Se crean dos contantes para almacenar los nuevos tokens: newAccessToken y newRefreshToken.
    - Se almacena el nuevo refreshToken en la DB. Mientras se le entregan el nuevo accessToken y el nuevo refreshToken al controllador para que los almacene en las cookies httpOnly.
- En controller, se crea el método refresh que:
    - Obtiene el antiguo refreshToken desde las cookies.
    - obtiene el nuevo accessToken y el nuevo refreshToken desde el service enviándole el antiguo refreshToken.
    - Crea una configuración personalizada para cookies y almacena en ellas el nuevo accessToken y el nuevo refreshtoken, asignándoles adicionalmente un tiempo de vida.
    - Envía un mensaje de éxito al usuario final.
- En route, se agrega la ruta refresh.
- En server, se importa y agrega cookieParser() como middleware.
## 16.4. requireAuth
- Lee la cookie accessToken para comprobar la identidad del usuario.

## CAMBIO DE ESTADO DEL USUARIO (FUERA DEL ALCANCE DE ESTE PROYECTO)
- Normalmente requeriría de endpoints y estrategias con nodemailer y SMTP para que el usuario active su cuenta mediante el envío y comprobación de un código corto a su correo electrónico registrado.
- Para este proyecto, el usuario crea su cuenta normalmente con estado VISITOR y **en supabase se cambia MANUALMENTE ese estado a CLIENT**.

## 17. Creación de módulo Category y Product
- Por temas de practicidad, Category pertenecerá al módulo Product.
- Dado que en este sistema solo existe el usuario (cliente):
    - No hay necesidad de crear servicios de creación o mantenimiendo de categorías. Solo de visualización del nombre.
    - No hay necesidad de crear servicios de creación o mantenimiendo administrativo de productos. Pero sí de stock y visualización de ellos cuando se realiza una compra.
- Product no podrá ser ordenado personalizadamente. Solo será ordenado por orden predeterminado de consulta.
- Product sí puede ser filtrado solo por categoría.

## 18. Creación de seeds de categorías y productos.
- Ir a package.json y agregar:

        "prisma": {
            "seed": "tsx prisma/seed.ts"
        },
- Crear [prisma/seed.ts](prisma/seed.ts) y agregar contenido.
- Crear [prisma/tsconfig.json](prisma/tsconfig.json) y agregar contenido.
- En [prisma.config.ts](prisma.config.ts) agregar dentro de migrations:
        
        seed: 'npx tsx ./prisma/seed.ts',
- Generar nuevamente el cliente de Prisma y ejecutar el seed

        pnpm exec prisma generate
        pnpm exec prisma db seed

    Debería aparecer:

        Seeding completado con éxito.


# ORDENAR

## Evaluación general: **6.5/10**

El esquema cubre correctamente el núcleo del MVP: usuarios, catálogo, carrito, órdenes y detalle de órdenes. Las relaciones principales coinciden con el alcance documentado, se usa `Decimal` para importes, se conserva el precio de compra en `OrderDetail` y se impide repetir un producto dentro del mismo carrito.

La nota baja porque faltan decisiones importantes de integridad, seguridad, borrado, expiración y concurrencia. Algunas funcionalidades declaradas —eliminación de cuenta, rotación de refresh tokens y pago limitado a cinco minutos— no están realmente respaldadas por el modelo actual.

### Desglose

| Área                      | Evaluación |
| ------------------------- | ---------: |
| Cobertura del dominio MVP |       8/10 |
| Relaciones principales    |       8/10 |
| Integridad de datos       |       5/10 |
| Autenticación y sesiones  |       4/10 |
| Historial de órdenes      |       6/10 |
| Rendimiento e índices     |       5/10 |
| Compatibilidad Prisma 7   |       6/10 |

---

# Problemas e incongruencias

## 1. `Role.VISITOR` es conceptualmente incorrecto

Actualmente, todo usuario nuevo recibe:

```prisma
role Role @default(VISITOR)
```

Pero un visitante no registrado no debería existir como registro de `User`. Además, la documentación establece que los roles y permisos están fuera del alcance y solamente distingue entre usuario no registrado y registrado.

Esto produce una contradicción directa: después de registrarse, la persona sigue marcada como `VISITOR`.

### Solución

Para este MVP, elimina completamente `Role`:

```prisma
enum Role {
  VISITOR
  CLIENT
}
```

y elimina `role` de `User`.

No necesitas almacenar en la base de datos el hecho de que alguien no está autenticado. Esa condición se determina por la ausencia de una sesión o JWT válido.

Si conservas el enum por una posible ampliación futura, el valor predeterminado tendría que ser `CLIENT`, pero mantenerlo ahora añade complejidad sin aportar control real.

---

## 2. La eliminación de cuenta entra en conflicto con las órdenes

La documentación permite que un usuario autenticado elimine su cuenta. Sin embargo:

```prisma
userId String
user   User @relation(fields: [userId], references: [id])
```

hace obligatoria la relación entre orden y usuario. No existe una política `onDelete` que permita conservar la orden después de eliminar la cuenta.

Las alternativas actuales serían malas:

* Bloquear la eliminación del usuario.
* Borrar también todas sus órdenes.
* Eliminar manualmente el historial antes de borrar la cuenta.

### Solución recomendada

Conservar la orden y desacoplarla del usuario:

```prisma
model Order {
  // ...

  customerEmail String @map("customer_email")
  customerName  String @map("customer_name")

  userId String? @map("user_id") @db.Uuid
  user   User?   @relation(
    fields: [userId],
    references: [id],
    onDelete: SetNull
  )
}
```

Al crear la orden se copian `email`, nombre, dirección y demás datos históricos necesarios. Cuando se elimina la cuenta:

* El carrito desaparece.
* Las sesiones desaparecen.
* `orders.user_id` pasa a `NULL`.
* La compra histórica permanece utilizable.

---

## 3. El modelo de refresh token no implementa una rotación robusta

El esquema guarda un solo refresh token por usuario:

```prisma
refreshToken String? @unique
```

Esto tiene tres problemas:

1. Probablemente almacena el token directamente y no su hash.
2. Solo permite una sesión efectiva por usuario.
3. No permite identificar familias de tokens, revocaciones ni reutilización de un token anterior.

La documentación promete explícitamente refresh token rotation.

### Solución recomendada

Separar las sesiones:

```prisma
model RefreshSession {
  id        String   @id @default(uuid()) @db.Uuid
  tokenHash String   @unique @map("token_hash")
  familyId  String   @default(uuid()) @map("family_id") @db.Uuid

  userId    String   @map("user_id") @db.Uuid
  expiresAt DateTime @map("expires_at")
  revokedAt DateTime? @map("revoked_at")
  createdAt DateTime @default(now()) @map("created_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([familyId])
  @@map("refresh_sessions")
}
```

En cada rotación:

1. Se busca la sesión mediante el hash del token.
2. Se verifica que no esté revocada ni expirada.
3. Se revoca el token utilizado.
4. Se crea otro token dentro de la misma `familyId`.
5. Si reaparece un token revocado, se revoca toda la familia.

Para refresh tokens aleatorios de alta entropía, resulta práctico almacenar un digest SHA-256 o HMAC para poder buscarlo directamente. `bcrypt` debe seguir utilizándose para las contraseñas.

---

## 4. No existen restricciones para cantidades, precios o stock negativos

Actualmente la base de datos acepta potencialmente:

```text
quantity = 0
quantity = -5
unitsInStock = -20
unitPrice = -15.00
total = -100.00
```

Los tipos `Int` y `Decimal` no expresan por sí solos que los valores deban ser positivos.

La validación del servicio es necesaria, pero no suficiente: scripts, seeds, errores de código o accesos directos podrían insertar información inválida.

### Solución

Agregar restricciones `CHECK` en una migración SQL:

```sql
ALTER TABLE "products"
ADD CONSTRAINT "products_unit_price_nonnegative"
CHECK ("unit_price" >= 0);

ALTER TABLE "products"
ADD CONSTRAINT "products_stock_nonnegative"
CHECK ("units_in_stock" >= 0);

ALTER TABLE "cart_items"
ADD CONSTRAINT "cart_items_quantity_positive"
CHECK ("quantity" > 0);

ALTER TABLE "orders"
ADD CONSTRAINT "orders_total_nonnegative"
CHECK ("total" >= 0);

ALTER TABLE "order_details"
ADD CONSTRAINT "order_details_quantity_positive"
CHECK ("quantity" > 0);

ALTER TABLE "order_details"
ADD CONSTRAINT "order_details_unit_price_nonnegative"
CHECK ("unit_price" >= 0);
```

Prisma documenta el uso de migraciones SQL para incorporar restricciones `CHECK` en PostgreSQL. ([Prisma][1])

---

## 5. La regla de pago en cinco minutos no está modelada

La documentación indica que una orden pendiente solo puede pagarse durante cinco minutos, pero `Order` únicamente posee `createdAt`. No hay `expiresAt` ni `paidAt`.

Se puede calcular `createdAt + 5 minutos`, pero almacenar explícitamente el vencimiento evita que futuros cambios en la regla alteren órdenes ya creadas.

### Solución

```prisma
model Order {
  // ...

  expiresAt DateTime  @map("expires_at")
  paidAt    DateTime? @map("paid_at")
}
```

Al generar la orden:

```ts
expiresAt = new Date(Date.now() + 5 * 60 * 1000);
```

Para mantener el alcance actual, puedes conservar solamente:

```prisma
enum OrderStatus {
  PENDING
  PAID
}
```

La orden se considera vencida cuando:

```ts
order.status === "PENDING" && order.expiresAt < new Date()
```

No es indispensable agregar `EXPIRED` si quieres respetar estrictamente el flujo documentado `PENDING → PAID`.

---

## 6. El historial de compra está incompleto

`OrderDetail.unitPrice` conserva correctamente el precio existente al comprar. Sin embargo, el nombre y la imagen siguen dependiendo de `Product`.

Si posteriormente cambia:

* El nombre del producto.
* La imagen.
* La descripción.
* La presentación comercial.

una orden histórica podría mostrar información distinta de la que vio el cliente al comprar.

### Solución

Guardar una instantánea mínima:

```prisma
model OrderDetail {
  id           Int     @id @default(autoincrement())
  quantity     Int
  unitPrice    Decimal @map("unit_price") @db.Decimal(10, 2)
  productName  String  @map("product_name")
  productImage String? @map("product_image")

  // ...
}
```

El precio y los datos históricos siempre deben proceder del servidor, nunca del cuerpo enviado por el frontend.

---

## 7. Falta impedir productos repetidos en una orden

El carrito sí protege esta regla:

```prisma
@@unique([cartId, productId])
```

pero `OrderDetail` no tiene una restricción equivalente.

Un error del servicio podría crear dos líneas para el mismo producto dentro de una orden.

### Solución

```prisma
@@unique([orderId, productId])
```

---

## 8. No existe una política clara para eliminar productos

`OrderDetail` y `CartItem` dependen obligatoriamente de `Product`, pero sus relaciones no definen explícitamente qué ocurre al borrar un producto.

Además, el seed ejecuta:

```ts
await prisma.product.deleteMany();
await prisma.category.deleteMany();
```

Cuando ya existan órdenes, esa limpieza puede fallar porque los detalles históricos siguen apuntando a los productos.

### Solución

No borres productos que ya participan en órdenes. Agrega:

```prisma
isActive Boolean @default(true) @map("is_active")
```

Esto no tiene que considerarse un soft delete completo; es una desactivación del catálogo:

* `isActive = false`: no aparece ni puede añadirse al carrito.
* La fila continúa disponible para las órdenes históricas.

Define además las políticas explícitamente:

```prisma
category Category @relation(
  fields: [categoryId],
  references: [id],
  onDelete: Restrict
)

product Product @relation(
  fields: [productId],
  references: [id],
  onDelete: Restrict
)
```

Para el seed, utiliza `upsert` con un identificador estable como `sku` o `slug`, en vez de borrar todo el catálogo.

---

## 9. El email único puede presentar inconsistencias de mayúsculas

La regla de negocio declara que el email es el identificador único.

La solución mínima es normalizar siempre antes de guardar o buscar:

```ts
const normalizedEmail = email.trim().toLowerCase();
```

Debe aplicarse en:

* Registro.
* Login.
* Cambio de email.
* Seeds y pruebas.

Para una protección adicional en PostgreSQL puede crearse un índice único sobre `lower(email)`, aunque los índices basados en expresiones requieren personalización SQL en lugar de una declaración Prisma convencional. ([Prisma][2])

---

## 10. Faltan índices para consultas habituales

El esquema solo posee los índices generados por claves primarias, campos únicos y la restricción compuesta del carrito.

Conviene agregar índices para:

```prisma
model Product {
  // ...
  @@index([categoryId])
}

model CartItem {
  // ...
  @@index([productId])
}

model Order {
  // ...
  @@index([userId, createdAt])
  @@index([status, expiresAt])
}

model OrderDetail {
  // ...
  @@index([productId])
}
```

PostgreSQL no crea automáticamente un índice sobre el lado que contiene una clave foránea, por lo que estas consultas pueden terminar recorriendo más filas de las necesarias. ([PostgreSQL][3])

---

## 11. Se genera un UUID, pero actualmente se almacena como texto

El identificador del usuario utiliza:

```prisma
id String @id @default(uuid())
```

En PostgreSQL, `String` se mapea por defecto a `text`. Para utilizar el tipo nativo `uuid`, debe declararse `@db.Uuid`.  ([Prisma][4])

### Solución

```prisma
id String @id @default(uuid()) @db.Uuid
```

y en todas sus claves foráneas:

```prisma
userId String @db.Uuid
```

No es un error funcional grave, pero conviene corregirlo antes de acumular datos. Si la base ya contiene filas, la migración debe convertir las columnas mediante un cast a `uuid`.

---

## 12. El generador está obsoleto para un proyecto nuevo con Prisma 7

El proyecto utiliza Prisma `7.8.0`, pero el esquema mantiene:

```prisma
generator client {
  provider = "prisma-client-js"
}
```

`prisma-client-js` está deprecado. Para Prisma 7, la documentación recomienda `prisma-client` con una ruta `output`. ([Prisma][5])

### Solución

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}
```

Después deberán cambiarse los imports actuales de:

```ts
import { PrismaClient } from "@prisma/client";
```

a la ubicación generada. Actualmente tanto `src/config/db.ts` como el seed importan desde `@prisma/client`.

La configuración de `DATABASE_URL` en `prisma.config.ts`, en cambio, sí es correcta para Prisma 7.  ([Prisma][6])

---

# Esquema objetivo recomendado

Esta versión mantiene el MVP sin administrador, conserva únicamente `PENDING → PAID` y resuelve sesiones, eliminación de usuarios, historial, expiración e índices:

```prisma
generator client {
  provider = "prisma-client"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "postgresql"
}

enum OrderStatus {
  PENDING
  PAID
}

model User {
  id           String @id @default(uuid()) @db.Uuid
  email        String @unique
  passwordHash String @map("password_hash")
  firstName    String @map("first_name")
  lastName     String @map("last_name")

  cart            Cart?
  orders          Order[]
  refreshSessions RefreshSession[]

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}

model RefreshSession {
  id        String @id @default(uuid()) @db.Uuid
  tokenHash String @unique @map("token_hash")
  familyId  String @default(uuid()) @map("family_id") @db.Uuid

  userId    String    @map("user_id") @db.Uuid
  expiresAt DateTime  @map("expires_at")
  revokedAt DateTime? @map("revoked_at")
  createdAt DateTime  @default(now()) @map("created_at")

  user User @relation(
    fields: [userId],
    references: [id],
    onDelete: Cascade
  )

  @@index([userId])
  @@index([familyId])
  @@map("refresh_sessions")
}

model Category {
  id   Int    @id @default(autoincrement())
  name String @unique

  products Product[]

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("categories")
}

model Product {
  id           Int     @id @default(autoincrement())
  name         String
  description  String
  unitPrice    Decimal @map("unit_price") @db.Decimal(10, 2)
  unitsInStock Int     @default(0) @map("units_in_stock")
  imageUrl     String? @map("image_url")
  isActive     Boolean @default(true) @map("is_active")

  categoryId Int @map("category_id")

  category     Category      @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  cartItems    CartItem[]
  orderDetails OrderDetail[]

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([categoryId])
  @@map("products")
}

model Cart {
  id Int @id @default(autoincrement())

  userId String @unique @map("user_id") @db.Uuid

  user  User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  items CartItem[]

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("carts")
}

model CartItem {
  id       Int @id @default(autoincrement())
  quantity Int

  cartId    Int @map("cart_id")
  productId Int @map("product_id")

  cart Cart @relation(
    fields: [cartId],
    references: [id],
    onDelete: Cascade
  )

  product Product @relation(
    fields: [productId],
    references: [id],
    onDelete: Cascade
  )

  @@unique([cartId, productId])
  @@index([productId])
  @@map("cart_items")
}

model Order {
  id              Int         @id @default(autoincrement())
  status          OrderStatus @default(PENDING)
  total           Decimal     @db.Decimal(10, 2)
  shippingAddress String      @map("shipping_address")

  customerEmail String @map("customer_email")
  customerName  String @map("customer_name")

  expiresAt DateTime  @map("expires_at")
  paidAt    DateTime? @map("paid_at")

  userId String? @map("user_id") @db.Uuid

  user User? @relation(
    fields: [userId],
    references: [id],
    onDelete: SetNull
  )

  details OrderDetail[]

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@index([userId, createdAt])
  @@index([status, expiresAt])
  @@map("orders")
}

model OrderDetail {
  id           Int     @id @default(autoincrement())
  quantity     Int
  unitPrice    Decimal @map("unit_price") @db.Decimal(10, 2)
  productName  String  @map("product_name")
  productImage String? @map("product_image")

  orderId   Int @map("order_id")
  productId Int @map("product_id")

  order Order @relation(
    fields: [orderId],
    references: [id],
    onDelete: Cascade
  )

  product Product @relation(
    fields: [productId],
    references: [id],
    onDelete: Restrict
  )

  @@unique([orderId, productId])
  @@index([productId])
  @@map("order_details")
}
```

---

# Flujo integral que debería acompañar al esquema

## Registro

Ejecutar en una transacción:

1. Normalizar email.
2. Hashear contraseña.
3. Crear usuario.
4. Crear carrito vacío.
5. No crear todavía una refresh session hasta que se complete el login.

## Creación de orden

Dentro de una transacción:

1. Obtener los productos del carrito directamente desde la base.
2. Verificar `isActive`.
3. Verificar que las cantidades sean positivas.
4. Calcular precios y total en el servidor.
5. Copiar nombre, imagen y precio a `OrderDetail`.
6. Establecer `expiresAt`.
7. Crear la orden como `PENDING`.
8. No descontar stock todavía si el MVP no implementará reservas.

## Pago

Dentro de una sola transacción:

1. Verificar que la orden pertenezca al usuario.
2. Verificar `status === PENDING`.
3. Verificar `now <= expiresAt`.
4. Descontar stock mediante operaciones condicionales.
5. Fallar toda la transacción si algún producto no tiene stock.
6. Actualizar `status = PAID` y `paidAt = now`.
7. Vaciar el carrito.

La actualización de stock debería exigir simultáneamente:

```sql
WHERE units_in_stock >= cantidad
```

Así se evita vender más unidades que las disponibles cuando dos clientes pagan al mismo tiempo.

## Eliminación de cuenta

En una transacción:

1. Eliminar o revocar refresh sessions.
2. Eliminar el usuario.
3. El carrito se elimina por cascada.
4. Las órdenes permanecen con `userId = NULL`.
5. Los datos históricos de la compra permanecen en la orden.

---

# Prioridad de implementación

**Primero:** eliminar `Role`, corregir refresh sessions, resolver eliminación de usuario, agregar `expiresAt`, `paidAt` y restricciones positivas.

**Después:** snapshots de producto, índices, desactivación de catálogo y seed mediante `upsert`.

**Finalmente:** migrar al generador `prisma-client`, cambiar imports y convertir los identificadores de usuario a UUID nativo.

También hay una incongruencia menor en el diagrama ER: las explicaciones de “Producto–Detalle de Orden” y “Producto–Elemento de Carrito” están intercambiadas, aunque las relaciones del esquema sí están colocadas correctamente.

[1]: https://docs.prisma.io/docs/orm/more/troubleshooting/check-constraints?utm_source=chatgpt.com "Data validation with CHECK constraints (PostgreSQL) | Prisma Documentation"
[2]: https://www.prisma.io/docs/orm/reference/prisma-schema-reference?utm_source=chatgpt.com "Prisma Schema API | Prisma Documentation"
[3]: https://www.postgresql.org/docs/16/ddl-constraints.html?utm_source=chatgpt.com "PostgreSQL: Documentation: 16: 5.4. Constraints"
[4]: https://www.prisma.io/docs/orm/prisma-migrate/workflows/native-database-types?utm_source=chatgpt.com "Native database types | Prisma Documentation"
[5]: https://www.prisma.io/docs/orm/prisma-schema/overview/generators?utm_source=chatgpt.com "Generators (Reference) | Prisma Documentation"
[6]: https://www.prisma.io/docs/orm/reference/prisma-config-reference?utm_source=chatgpt.com "Reference documentation for the prisma config file | Prisma Documentation"

# ORDENAR

# Resultado de la revisión

La carpeta `docs/` contiene **ocho archivos Markdown y dos imágenes**:

| Archivo                | Evaluación                                                                    |
| ---------------------- | ----------------------------------------------------------------------------- |
| `alcance.md`           | Incompleto y desalineado con código, roles y modelo                           |
| `diagramaER.md`        | Tiene relaciones descritas incorrectamente                                    |
| `endpoints.md`         | Vacío                                                                         |
| `estructura.md`        | Varias rutas y responsabilidades no coinciden con el repositorio              |
| `paquetes.md`          | Útil, pero contiene omisiones, afirmaciones imprecisas y errores de redacción |
| `reglas_de_negocio.md` | Incompleto y contradictorio con implementación y roles                        |
| `roles.md`             | Mezcla actores, estados de cuenta y capacidades no implementadas              |
| `seeds.md`             | Prácticamente vacío                                                           |
| `img/dbdiagram-01.png` | No tiene una fuente editable ni control contra desactualización               |
| `img/github-01.png`    | Es material de bitácora, no documentación del producto                        |

El problema principal no es la falta de texto: es que la documentación mezcla tres estados distintos sin identificarlos:

* Lo que ya está implementado.
* Lo que se piensa implementar.
* Lo que está fuera del MVP.

Por eso actualmente no puede tratarse como una fuente de verdad confiable.

---

# 1. `docs/alcance.md`

## Problemas

### El alcance principal no describe un e-commerce

Las funcionalidades principales solo contienen autenticación y edición/eliminación de cuenta. No aparecen:

* Catálogo.
* Categorías.
* Detalle de producto.
* Carrito.
* Checkout.
* Órdenes.
* Pago.

Sin embargo, el mismo documento menciona posteriormente órdenes, pago y reserva por cinco minutos. Además, `roles.md` sí considera carrito y checkout.

### Declara funcionalidades que no existen

Se incluye edición y eliminación de cuenta, pero las rutas actuales de usuario solo implementan:

* Registro.
* Login.
* Refresh.
* Perfil.
* Logout.

No hay endpoints para editar datos, cambiar contraseña o eliminar cuenta.

Además, la eliminación física de un usuario sería problemática si ya tiene órdenes, porque `Order.userId` es obligatorio y la relación no tiene eliminación en cascada.

### Confunde requisitos funcionales y no funcionales

Helmet, rate limiting y validación de entradas no son funcionalidades secundarias del usuario. Son requisitos de seguridad y calidad.

### El frontend documentado está desactualizado

Se habla de un frontend básico HTML/CSS, pero el frontend real usa React, TypeScript, Vite, Axios, React Router, Tailwind y DaisyUI.

### La regla de cinco minutos está incompleta

No se define:

* Cuándo comienzan los cinco minutos.
* Si el stock queda reservado.
* Qué ocurre cuando vence.
* Cómo se representa una orden vencida.
* Si el total puede recalcularse.
* Si el endpoint de pago debe ser idempotente.

El esquema solo tiene `PENDING` y `PAID`; no existe `EXPIRED`, `expiresAt` ni una reserva de stock explícita.

### Roles fuera del alcance, pero existe `Role`

El documento excluye roles y permisos, pero Prisma contiene `Role.VISITOR` y `Role.CLIENT`.

### Exclusiones duplicadas o mal formuladas

* “Panel de administración”, “administrador del sistema” y gestión administrativa se repiten.
* Recuperación de contraseña aparece de forma independiente y dentro de envío de emails.
* Falta cerrar las comillas en `"RETURNED`.
* “Datos con regulación legal fuera del alcance” no es una formulación adecuada. Conviene indicar qué clases de datos no se procesarán, en lugar de intentar excluir obligaciones legales.

## Solución

Dividir el archivo en:

1. **Objetivo del MVP.**
2. **Actores.**
3. **Incluido e implementado.**
4. **Incluido pero pendiente.**
5. **Fuera de alcance.**
6. **Criterios de aceptación.**

Estado sugerido:

| Módulo                        | Estado                |
| ----------------------------- | --------------------- |
| Autenticación                 | Implementado          |
| Perfil de solo lectura        | Implementado          |
| Catálogo backend              | Implementado          |
| Catálogo frontend             | En integración        |
| Carrito                       | Planificado para MVP  |
| Checkout y orden              | Planificado para MVP  |
| Pago simulado                 | Planificado para MVP  |
| Edición/eliminación de cuenta | Fuera del MVP inicial |
| Administración                | Fuera de alcance      |

Para el pago, la opción más simple es **no reservar stock al crear la orden**. Al pagar, se valida y descuenta el stock dentro de una transacción. Si se mantiene el límite de cinco minutos, agregar `expiresAt` y rechazar pagos posteriores.

---

# 2. `docs/reglas_de_negocio.md`

## Problemas

### Las contraseñas no se “encriptan”

Bcrypt produce un hash; no cifra la contraseña de una forma reversible. El texto debe decir:

> Las contraseñas se almacenan mediante hash seguro con bcrypt.

### “Dominio válido” no coincide con la implementación

`isEmail()` verifica formato, pero no comprueba que el dominio exista, tenga registros DNS o pueda recibir correos. La regla documentada promete más de lo que el código garantiza.

Debe cambiarse por:

> El email debe tener un formato válido y será normalizado antes de guardarse.

La existencia del dominio solo debería afirmarse si se implementa una validación adicional.

### El carrito anónimo contradice `roles.md`

Las reglas dicen que los usuarios no autenticados tendrán carrito en `localStorage`; `roles.md` dice que solo el usuario registrado agrega productos al carrito.

Debe tomarse una decisión:

* **MVP más simple:** carrito únicamente para usuarios autenticados.
* **MVP más comercial:** carrito anónimo en `localStorage` y combinación con el carrito remoto al iniciar sesión.

La segunda opción necesita reglas explícitas de fusión, duplicados, cantidades y stock.

### La sincronización al iniciar sesión no existe

El documento afirma que el carrito de base de datos se sincronizará al iniciar sesión, pero el login solo genera tokens y devuelve datos básicos del usuario.

### La regla de caracteres especiales no coincide con el validador

La documentación limita los símbolos a `@`, `$`, `#`, `%` o `&`, mientras que `isStrongPassword()` acepta otros símbolos.

Debe hacerse una de estas dos cosas:

* Eliminar la lista cerrada de símbolos de la documentación.
* Agregar un regex que limite realmente los caracteres permitidos.

### Los límites de intentos no coinciden con el código

La documentación establece:

* Registro: 5 intentos en 15 minutos.
* Login: 3 intentos en 15 minutos.
* Bloqueo posterior de 60 minutos.

Pero las rutas usan actualmente `limitRequests(300, 100)`, es decir, hasta 100 solicitudes durante 300 segundos. Además, el middleware cuenta solicitudes, no únicamente intentos fallidos.

Para un MVP conviene documentar e implementar una regla más simple:

* Login: máximo 5 solicitudes por IP/email durante 15 minutos.
* `skipSuccessfulRequests: true`.
* Reintento al terminar la ventana.

Un bloqueo adicional de 60 minutos necesita una estrategia distinta o un registro persistente de intentos.

### Faltan casi todas las reglas del dominio

No se documentan reglas para:

* Productos sin stock.
* Cantidades mínimas y máximas.
* Unicidad de productos dentro del carrito.
* Cálculo del total.
* Propiedad del carrito y de las órdenes.
* Modificación de precios.
* Pago duplicado.
* Vencimiento de órdenes.
* Descuento de stock.
* Transacciones.
* Dirección de entrega.

## Solución

Añadir secciones independientes:

```text
Autenticación
Catálogo
Carrito
Checkout
Órdenes
Pago
Stock
Seguridad y propiedad de recursos
```

Una regla importante debería ser:

> Todos los totales, precios y validaciones de stock se calculan nuevamente en el servidor. El cliente nunca es fuente de verdad para importes ni disponibilidad.

---

# 3. `docs/roles.md`

## Problemas

### Son actores, no roles técnicos

“Usuario no registrado” no existe como registro en la base de datos. Es un visitante. Mientras tanto, el enum `VISITOR` sí se almacena en cuentas creadas, lo cual genera dos significados distintos para “visitor”.

### Capacidades no implementadas

Se afirma que un usuario puede:

* Modificar datos personales.
* Cambiar contraseña.
* Administrar carrito.
* Hacer checkout.
* Generar una orden.

Ninguna de esas operaciones tiene actualmente una ruta backend.

### La dirección alterna no tiene sentido con el modelo actual

El texto habla de “otra dirección alterna”, pero el usuario no tiene una dirección principal almacenada. Solo existe `shippingAddress` en la orden.

Debe decir:

> El usuario proporciona una dirección de entrega al realizar el checkout.

### No aparece el historial de órdenes

El modelo permite varias órdenes por usuario, pero no se documenta que pueda consultarlas.

## Solución

Renombrar el archivo a `actores_y_permisos.md` y usar una matriz:

| Acción                     | Visitante | Usuario autenticado |
| -------------------------- | --------: | ------------------: |
| Ver categorías y productos |        Sí |                  Sí |
| Ver detalle                |        Sí |                  Sí |
| Registrarse/iniciar sesión |        Sí |           No aplica |
| Consultar perfil propio    |        No |                  Sí |
| Administrar carrito propio |        No |                  Sí |
| Crear orden                |        No |                  Sí |
| Consultar órdenes propias  |        No |                  Sí |
| Administrar productos      |        No |                  No |

Como solo existe un tipo de usuario, recomiendo eliminar `Role` del MVP. Si se necesita controlar activación, usar otro concepto como `AccountStatus`, no un rol.

---

# 4. `docs/diagramaER.md`

## Errores concretos

### Las dos últimas explicaciones están intercambiadas

Bajo “Producto : Detalle de Orden” dice que un producto puede aparecer en carritos.

Bajo “Producto : Elemento de Carrito” dice que puede aparecer en órdenes históricas. Es exactamente al revés.

Corrección:

```text
Producto : Detalle de Orden
Un producto puede aparecer en múltiples detalles de órdenes históricas.

Producto : Elemento de Carrito
Un producto puede aparecer en múltiples carritos.
```

### Las cardinalidades ignoran opcionalidad

El documento señala `1 Usuario : 1 Carrito`, pero el esquema permite que un usuario todavía no tenga carrito:

```prisma
cart Cart?
```

La cardinalidad correcta es:

```text
Usuario 1 — 0..1 Carrito
```

Lo mismo ocurre con órdenes, productos de una categoría y elementos de carrito: normalmente deben representarse como `0..N`, no simplemente `N`.

### No es realmente un ERD

Se utiliza `graph LR`, que presenta relaciones generales pero no muestra:

* Claves primarias.
* Claves foráneas.
* Opcionalidad.
* Cardinalidad formal.
* Atributos.
* Restricciones únicas.

### Error ortográfico repetido

La forma correcta es **orden**, sin tilde. Aparecen “Órden” y “Órdenes” mezclados.

## Solución

Usar Mermaid `erDiagram`:

```mermaid
erDiagram
    USER ||--o| CART : posee
    USER ||--o{ ORDER : realiza
    CATEGORY ||--o{ PRODUCT : agrupa
    CART ||--o{ CART_ITEM : contiene
    PRODUCT ||--o{ CART_ITEM : aparece_en
    ORDER ||--|{ ORDER_DETAIL : contiene
    PRODUCT ||--o{ ORDER_DETAIL : aparece_en
```

Además, debe definirse una sola fuente de verdad:

* `schema.prisma` como modelo ejecutable.
* ERD generado a partir del esquema.
* Evitar modificar manualmente imagen, Mermaid y Prisma por separado.

---

# 5. `docs/endpoints.md`

El archivo está completamente vacío.

Esto es crítico porque el README lo presenta como documentación disponible.

## Problemas adicionales revelados por el código

Las rutas actuales son:

```http
GET  /api/health

POST /api/users/register
POST /api/users/login
POST /api/users/refresh
GET  /api/users/me
POST /api/users/logout

GET /api/categories/getCategories
GET /api/products/getProducts/:categoryId
GET /api/products/getProduct/:id
```

Además:

* Los GET de categoría, productos, producto y perfil responden `201`, pero deberían responder `200`.
* “Producto no encontrado” genera un error `500`; debería ser `404`.
* La ruta exige `categoryId`, aunque el servicio permite obtener todos los productos sin categoría.

## Solución

Normalizar a:

```http
GET /api/categories
GET /api/products
GET /api/products?categoryId=1
GET /api/products/:id
```

Y documentar para cada endpoint:

* Autenticación requerida.
* Parámetros.
* Body.
* Cookies.
* Respuesta exitosa.
* Errores.
* Código HTTP.
* Rate limit.
* Ejemplo.

La mejor solución es crear `docs/openapi.yaml` y generar la documentación desde OpenAPI, dejando `endpoints.md` como índice o eliminándolo.

---

# 6. `docs/estructura.md`

## Incongruencias con la estructura real

### Documenta una carpeta inexistente

Se describe `src/seed`, pero el seed real está en `prisma/seed.ts`.

### No documenta carpetas existentes

Faltan, entre otras:

* `src/validators`.
* `prisma/`.
* La ampliación de tipos de Express.
* Una posible carpeta de pruebas.

### Los DTO no validan en tiempo de ejecución

El documento afirma que los DTO “definen y validan” estructuras. Las interfaces TypeScript solo ayudan durante compilación; la validación real ocurre mediante `express-validator` y `validateRequest`.

### La regla de imports de routes no se cumple

El documento dice que routes importa solo controllers y middlewares. Sin embargo, las rutas instancian directamente:

* Repository.

* Service.

* Controller.

Esto convierte las rutas en un composition root improvisado.

### Los services dependen de tipos de Prisma

La documentación dice que services no conocen persistencia, pero `UserService` importa `User` desde `@prisma/client`. El servicio de productos también recibe tipos definidos junto al repository y convierte `Decimal` con `.toNumber()`.

### La explicación de `db.ts` es incorrecta

Dice que:

* Exporta una función de conexión.
* Solo importa routes y ORM.

En realidad exporta una instancia de Prisma e importa Prisma Client, `pg` y el adaptador. No importa rutas.

### Falta `.env.example`

El documento dice correctamente que debe existir, pero actualmente el repositorio no lo contiene.

### “Será constante” no aporta información

Decir que una carpeta, middleware, utilidad o punto de entrada “será constante” no documenta una responsabilidad arquitectónica y en varios casos ni siquiera resulta semánticamente correcto.

## Solución

Actualizar el árbol real:

```text
src/
├── config/
├── controllers/
├── dtos/
├── middlewares/
├── repositories/
├── routes/
├── services/
├── types/
├── utils/
├── validators/
├── index.ts
└── server.ts

prisma/
├── schema.prisma
├── seed.ts
└── tsconfig.json
```

También conviene:

* Mover `custom.d.ts` de `dtos` a `types/express.d.ts`.
* Crear un composition root o fábricas para construir repositories, services y controllers.
* Dejar routes únicamente con rutas, middleware y métodos del controller.
* Crear `.env.example`.

---

# 7. `docs/paquetes.md`

## Omisiones

`express-validator` está instalado y es fundamental en la estrategia de seguridad, pero no aparece en la lista detallada de dependencias de producción. Sí aparece más adelante, sin explicación propia.

## Afirmaciones imprecisas

* Bcrypt no “encripta”; produce hashes.

* JWT no es totalmente stateless en esta implementación porque el refresh token se guarda en PostgreSQL.

* `cookie-parser` no hace que una cookie sea segura; solo la analiza. La seguridad depende de HTTPS, `HttpOnly`, `Secure`, `SameSite`, expiración y una política de CSRF.

* `express-rate-limit` no debe presentarse como protección completa frente a DDoS.

* Helmet reduce superficie de ataque mediante headers; no evita por sí mismo XSS o clickjacking.

* Dotenv carga variables, pero no hace que los secretos sean seguros automáticamente.

* `prisma` permite migraciones, pero el proyecto está usando `prisma db push` y no tiene actualmente un historial de migraciones documentado.

* Llamar a `pg` “driver nativo” puede confundirse con implementaciones nativas; es preferible “driver PostgreSQL para Node.js”.

* La cifra de “hasta 90 % de ahorro” de PNPM es una afirmación promocional no sustentada en el documento.

## Contradicción en CORS

El documento dice que CORS permite exclusivamente el frontend en Vercel, pero el servidor permite actualmente `http://localhost:5173`.

La solución es usar:

```ts
origin: process.env.FRONTEND_URL
```

y documentar valores para desarrollo y producción.

## Errores de redacción

Hay errores como:

* `ususario`.
* `guardas`.
* `ode denegación`.
* `Driver Adaptes`.
* `traducidapor`.
* `NPM.Y`.
* Un `**` sobrante en el encabezado de tokens.
* Uso inconsistente de Node, Node.js, DB y tokens.

## Solución

Reducir el documento a una tabla verificable:

| Paquete           | Entorno    | Responsabilidad            | Lugar de uso        |
| ----------------- | ---------- | -------------------------- | ------------------- |
| Express           | Producción | API HTTP                   | `server.ts`, routes |
| Prisma Client     | Producción | Acceso tipado a PostgreSQL | repositories        |
| express-validator | Producción | Validación HTTP            | validators          |
| jsonwebtoken      | Producción | Access y refresh tokens    | user service        |
| bcrypt            | Producción | Hash de contraseña         | hash utility        |

Evitar comparaciones comerciales y afirmaciones de seguridad absolutas.

---

# 8. `docs/seeds.md`

El documento solo contiene dos encabezados.

## Problemas del seed real que deberían documentarse

* Elimina todos los productos y categorías antes de volver a crearlos.

* La operación es destructiva.

* Puede fallar cuando existan `CartItem` u `OrderDetail` que referencien productos.

* Los IDs cambian al volver a ejecutar el seed.

* El comentario dice “12 productos”, pero el arreglo contiene 4.

* No se ejecuta dentro de una transacción.

* No protege contra ejecución accidental en producción.

## Solución

El documento debería incluir:

```text
Propósito
Entornos permitidos
Advertencia de operación destructiva
Prerrequisitos
Comando de ejecución
Datos creados
Resultado esperado
Procedimiento de limpieza
Solución de errores
```

Y el código debería:

1. Rechazar ejecución cuando `NODE_ENV === "production"`.
2. Usar una transacción.
3. Usar `upsert` para categorías.
4. Añadir un identificador estable como `slug` o `sku` a productos.
5. Evitar borrar productos que tengan historial.
6. Corregir el comentario de 12 a 4 productos.

---

# 9. `docs/img/dbdiagram-01.png`

## Problemas de documentación

La imagen se referencia sin texto alternativo:

```md
![](/docs/img/dbdiagram-01.png)
```

También existe duplicación entre:

* `schema.prisma`.
* Mermaid.
* Imagen PNG.

No hay un archivo editable, como DBML, que permita regenerar la imagen. Eso hace muy probable que los tres modelos diverjan.

## Solución

Usar:

```md
![Diagrama entidad-relación del MVP de tienda](./img/dbdiagram-01.png)
```

Y guardar una fuente editable:

```text
docs/database/schema.dbml
```

Mejor todavía: generar el diagrama automáticamente desde Prisma y declarar `schema.prisma` como única fuente de verdad.

---

# 10. `docs/img/github-01.png`

La imagen se utiliza desde la bitácora como referencia para crear el repositorio remoto, no para explicar el comportamiento del MVP.

## Problemas

* Es documentación personal del proceso de aprendizaje.
* Una captura de la interfaz de GitHub puede quedar obsoleta rápidamente.
* El contenido de una captura no es fácilmente buscable ni accesible.
* No está relacionada con arquitectura, negocio o uso del sistema.

## Solución

Una de estas dos alternativas:

* Eliminarla junto con la bitácora al terminar el proyecto.
* Moverla a `docs/development/tutorial/`, con título, descripción y texto equivalente a los pasos mostrados.

No debería formar parte de la documentación principal del producto.

---

# Incongruencias más graves entre documentos

| Prioridad | Incongruencia                                             | Decisión necesaria                     |
| --------- | --------------------------------------------------------- | -------------------------------------- |
| Crítica   | `endpoints.md` vacío                                      | Crear OpenAPI o documentación completa |
| Crítica   | Alcance no contiene catálogo/carrito/órdenes              | Redefinir alcance por módulos y estado |
| Crítica   | Rate limits documentados no coinciden con código          | Modificar código o reglas              |
| Crítica   | Relaciones de producto intercambiadas en ERD              | Corregir texto y Mermaid               |
| Alta      | Carrito anónimo en reglas, pero no en roles               | Elegir una sola estrategia             |
| Alta      | Edición/eliminación de usuario declarada pero inexistente | Implementar o sacar del MVP            |
| Alta      | Roles fuera de alcance, pero Prisma tiene `Role`          | Eliminarlo o convertirlo en estado     |
| Alta      | Checkout y orden declarados, pero no hay rutas            | Etiquetarlos como pendientes           |
| Alta      | Seed destructivo y sin documentación                      | Proteger y documentar                  |
| Media     | Estructura documentada no coincide con carpetas reales    | Regenerar desde el repositorio         |
| Media     | Dependencias descritas de forma imprecisa                 | Simplificar y corregir                 |
| Media     | Imágenes sin fuente editable ni alt text                  | Generar y hacer accesibles             |

# Estructura documental recomendada

```text
docs/
├── README.md
├── alcance.md
├── reglas_de_negocio.md
├── actores_y_permisos.md
├── arquitectura.md
├── modelo_de_datos.md
├── dependencias.md
├── desarrollo/
│   ├── configuracion.md
│   └── seeds.md
├── api/
│   ├── openapi.yaml
│   └── autenticacion.md
└── img/
    └── modelo-de-datos.png
```

Cada funcionalidad debería tener una etiqueta:

```text
✅ Implementada
🚧 En desarrollo
📋 Planificada para el MVP
⏭️ Versión futura
🚫 Fuera de alcance
```

## Orden correcto de corrección

1. Reescribir `alcance.md`.
2. Resolver la decisión sobre `VISITOR/CLIENT`.
3. Corregir `reglas_de_negocio.md`.
4. Crear `openapi.yaml` y normalizar rutas/códigos HTTP.
5. Corregir el modelo ER.
6. Actualizar `estructura.md`.
7. Documentar y proteger el seed.
8. Corregir `paquetes.md`.
9. Eliminar o reubicar las imágenes de bitácora.

La documentación actual es una buena bitácora del proceso, pero todavía no debe presentarse como documentación técnica terminada. La primera corrección debe ser separar con claridad **implementado**, **pendiente del MVP** y **fuera de alcance**.

# ORDENAR

## Conclusión

**Kiro SPEC no es un estándar formal de la industria.** Es una metodología propia de Kiro para desarrollo dirigido por especificaciones. Su flujo principal —`requirements.md` → `design.md` → `tasks.md`— y sus nombres de archivo son convenciones de la herramienta, no formatos establecidos por ISO, IEEE u otra organización. ([Kiro][1])

Sin embargo, **sí aplica buenas prácticas reconocidas**:

* Separa el **qué** debe hacer el sistema del **cómo** se implementará.
* Utiliza historias de usuario, criterios de aceptación, casos límite y manejo de errores.
* Emplea EARS para redactar requisitos verificables.
* Mantiene trazabilidad entre requisitos, diseño y tareas.
* Introduce revisión humana antes de implementar.
* Permite refinar los requisitos y sincronizar nuevamente diseño y tareas. ([Kiro][1])

EARS también es una técnica real y reconocida para restringir el lenguaje natural mediante estructuras como “cuando ocurra X, el sistema deberá hacer Y”. No es exclusiva de Kiro. ([Alistair Mavin][2])

## ¿Existen estándares?

Sí existen estándares para **partes específicas** de la documentación:

* **ISO/IEC/IEEE 29148:2018** define procesos y contenidos relacionados con ingeniería de requisitos. ([ISO][3])
* **ISO/IEC/IEEE 42010:2022** establece cómo estructurar una descripción arquitectónica. Sin embargo, aclara que no prescribe un formato de archivo, una herramienta ni un medio concreto para documentarla. ([ISO][4])
* C4 ofrece una convención práctica para diagramas de contexto, contenedores, componentes y código; para la mayoría de equipos pequeños suelen bastar los diagramas de contexto y contenedores. ([C4 model][5])
* Los ADR documentan decisiones arquitectónicas importantes junto con su contexto, razones y consecuencias. ([Architectural Decision Records][6])

Por tanto, **no existe un estándar universal que obligue a tener archivos llamados `alcance.md`, `reglas.md` o `arquitectura.md`**. Lo correcto es construir una estructura ligera, coherente y trazable, tomando buenas prácticas de esas referencias.

---

# Estructura recomendada para tu MVP

Para tu caso evitaría una documentación corporativa enorme. Recomiendo separar:

1. Documentación global del producto.
2. Reglas estables que Kiro debe conocer siempre.
3. Especificaciones individuales por funcionalidad.

```text
shop-mvp-backend/
├── README.md
├── docs/
│   ├── product/
│   │   ├── scope.md
│   │   ├── business-rules.md
│   │   ├── user-flows.md
│   │   └── glossary.md
│   │
│   ├── requirements/
│   │   ├── functional-requirements.md
│   │   └── non-functional-requirements.md
│   │
│   ├── architecture/
│   │   ├── overview.md
│   │   ├── data-model.md
│   │   ├── api-contract.yaml
│   │   ├── security.md
│   │   └── decisions/
│   │       ├── 0001-use-layered-architecture.md
│   │       ├── 0002-use-jwt-http-only-cookie.md
│   │       └── 0003-use-prisma-with-supabase.md
│   │
│   ├── quality/
│   │   └── test-strategy.md
│   │
│   └── delivery/
│       ├── roadmap.md
│       ├── environments.md
│       └── deployment.md
│
├── .kiro/
│   ├── steering/
│   │   ├── product.md
│   │   ├── tech.md
│   │   ├── structure.md
│   │   ├── api-standards.md
│   │   └── security-standards.md
│   │
│   └── specs/
│       ├── user-registration/
│       │   ├── requirements.md
│       │   ├── design.md
│       │   └── tasks.md
│       ├── user-authentication/
│       │   ├── requirements.md
│       │   ├── design.md
│       │   └── tasks.md
│       └── another-feature/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
│
├── prisma/
│   └── schema.prisma
├── src/
└── .env.example
```

Kiro genera oficialmente `product.md`, `tech.md` y `structure.md` como archivos fundamentales de steering. Estos describen el producto, las tecnologías y la estructura del proyecto, y se incluyen por defecto en sus interacciones. Los archivos personalizados, como `api-standards.md`, también están soportados. ([Kiro][7])

---

# Contenido de cada archivo

## `README.md`

Debe ser la puerta de entrada al proyecto:

* Qué es el sistema.
* Estado actual.
* Tecnologías.
* Requisitos para ejecutarlo.
* Variables de entorno.
* Comandos PNPM.
* Enlaces hacia `/docs`.
* Estructura general del repositorio.

No debe contener todos los requisitos ni toda la arquitectura.

---

## `docs/product/scope.md`

El archivo más importante para controlar el MVP.

```md
# Alcance del MVP

## Problema

## Objetivo

## Usuario objetivo

## Funcionalidades incluidas

## Fuera de alcance

## Restricciones

## Supuestos

## Criterios de éxito

## Condiciones para considerar terminado el MVP
```

En tu caso debe dejar explícito:

```md
- El sistema contempla exclusivamente el rol Usuario.
- No se implementará un rol Administrador.
- La administración directa de información se realizará fuera del sistema
  o mediante las herramientas disponibles en Supabase, cuando corresponda.
```

La sección **Fuera de alcance** es crítica. Impide que Kiro o cualquier desarrollador agregue funcionalidades “útiles” que realmente amplían el producto.

---

## `docs/product/business-rules.md`

Contiene reglas del negocio, no decisiones técnicas.

Ejemplo:

```md
# Reglas de negocio

## RN-001 — Usuario único

El sistema solamente reconocerá el rol Usuario.

## RN-002 — Correo único

No podrán existir dos usuarios registrados con el mismo correo electrónico.

## RN-003 — Credenciales

La contraseña nunca se almacenará en texto plano.

## RN-004 — Sesión

Un usuario solamente podrá acceder a recursos privados cuando posea
una sesión válida.

## RN-005 — Propiedad de recursos

Un usuario solamente podrá consultar o modificar recursos que le pertenezcan.
```

Usa identificadores como `RN-001`. Esto permite referenciar las reglas desde requisitos, pruebas y especificaciones.

---

## `docs/product/user-flows.md`

Describe recorridos completos del usuario, no endpoints.

Ejemplo:

```md
## FL-001 — Registro

1. El usuario proporciona sus datos.
2. El sistema valida los campos.
3. El sistema comprueba que el correo no esté registrado.
4. El sistema protege la contraseña.
5. El sistema crea la cuenta.
6. El sistema devuelve el resultado correspondiente.

## Flujos alternativos

- Correo previamente registrado.
- Contraseña inválida.
- Datos incompletos.
- Error de persistencia.
```

Puede contener diagramas Mermaid cuando el recorrido tenga decisiones relevantes.

---

## `docs/product/glossary.md`

Define términos que podrían interpretarse de distintas maneras:

```md
| Término | Definición |
|---|---|
| Usuario | Persona registrada que utiliza el sistema |
| Sesión | Estado autenticado representado mediante un JWT |
| Recurso propio | Registro cuyo `userId` pertenece al usuario autenticado |
| MVP | Primera versión que satisface el alcance definido |
```

Esto reduce ambigüedades tanto para personas como para asistentes de IA.

---

## `docs/requirements/functional-requirements.md`

Debe describir comportamientos observables.

```md
# Requisitos funcionales

## RF-001 — Registrar usuario

El sistema deberá permitir que una persona cree una cuenta usando
un correo electrónico y una contraseña válidos.

### Criterios de aceptación

- Cuando los datos sean válidos, el sistema deberá crear la cuenta.
- Cuando el correo ya exista, el sistema deberá responder con un conflicto.
- Cuando los datos sean inválidos, el sistema deberá indicar los campos afectados.

### Reglas relacionadas

- RN-001
- RN-002
- RN-003
```

Para los comportamientos importantes puedes usar EARS:

```md
CUANDO un usuario envíe un correo ya registrado,
EL SISTEMA DEBERÁ rechazar la creación de la cuenta
sin revelar información sensible.
```

---

## `docs/requirements/non-functional-requirements.md`

Debe contener requisitos medibles, no frases vagas.

```md
# Requisitos no funcionales

## RNF-001 — Seguridad de contraseña

Las contraseñas deberán almacenarse mediante bcrypt y nunca deberán
registrarse en logs.

## RNF-002 — Autenticación

El token de autenticación deberá enviarse mediante una cookie HttpOnly.

## RNF-003 — Validación

Toda entrada recibida desde HTTP deberá validarse antes de llegar
a la capa de servicio.

## RNF-004 — Mantenibilidad

Los controladores no deberán acceder directamente a Prisma.

## RNF-005 — Respuestas

La API deberá utilizar una estructura consistente para errores.
```

Evita requisitos como “la API debe ser rápida” o “el sistema debe ser seguro”. Deben traducirse en condiciones verificables.

---

## `docs/architecture/overview.md`

Describe la arquitectura global:

```md
# Arquitectura

## Contexto del sistema

## Principios arquitectónicos

## Arquitectura por capas

## Responsabilidades

### index.ts
Punto de entrada del proceso.

### server.ts
Configuración de Express, middlewares y rutas.

### Routes
Definición de endpoints y vinculación con controladores.

### Controllers
Adaptación entre HTTP y casos de uso.

### Services
Reglas de aplicación y coordinación de operaciones.

### Repositories
Acceso a datos mediante Prisma.

## Flujo de una solicitud

Route → Controller → Service → Repository → Prisma → PostgreSQL

## Dependencias externas

- Supabase/PostgreSQL
- Prisma
- bcrypt
- JWT
```

Para tu MVP bastaría con:

* Un diagrama C4 de contexto.
* Un diagrama C4 de contenedores.
* Un diagrama Mermaid del flujo de una solicitud.

No necesitas diagramar cada clase.

---

## `docs/architecture/data-model.md`

Explica semánticamente el modelo de datos:

* Entidades.
* Relaciones.
* Restricciones.
* Propiedad de registros.
* Eliminaciones y cascadas.
* Índices importantes.
* Decisiones sobre fechas y estados.

No copies todo `schema.prisma`. Ese archivo ya debe ser la fuente técnica de verdad.

Ejemplo:

```md
## User

Representa una persona registrada.

Restricciones:

- `email` es único.
- La contraseña se almacena como hash.
- Todos los recursos privados deben relacionarse con `User.id`.
```

---

## `docs/architecture/api-contract.yaml`

Recomiendo utilizar **OpenAPI** como fuente de verdad para los endpoints, en lugar de mantener una tabla Markdown que puede quedar desactualizada.

Debe incluir:

* Rutas.
* Métodos.
* Parámetros.
* Cuerpos.
* Cookies.
* Respuestas.
* Errores.
* Esquemas.
* Autenticación.

Una especificación de Kiro puede enlazar las operaciones relevantes:

```md
Esta funcionalidad implementará:

- `POST /auth/register`
- `POST /auth/login`

Consultar `docs/architecture/api-contract.yaml`.
```

---

## `docs/architecture/security.md`

Debe documentar el modelo de seguridad concreto:

```md
# Seguridad

## Autenticación

- JWT.
- Cookie HttpOnly.
- Configuración `secure` según el entorno.
- Configuración de `sameSite`.
- Expiración del token.

## Contraseñas

- Hash mediante bcrypt.
- Contraseñas excluidas de respuestas.
- Contraseñas excluidas de logs.

## Autorización

- Solamente existe el rol Usuario.
- Los recursos privados se filtran por el identificador del usuario autenticado.

## Validación

- Validación de parámetros, query strings y cuerpos.
- Rechazo de propiedades no permitidas.

## Errores

- No exponer stack traces en producción.
- No revelar si una cuenta existe cuando pueda representar un riesgo.

## Secretos

- Variables de entorno.
- `.env` excluido de Git.
- `.env.example` sin credenciales reales.
```

---

## `docs/architecture/decisions/`

Aquí deben vivir los ADR.

Ejemplo:

```md
# ADR-0001: Utilizar arquitectura por capas

## Estado

Aceptada

## Contexto

El backend requiere separar HTTP, lógica de aplicación y persistencia.

## Decisión

Se utilizarán las capas routes, controllers, services y repositories.

## Alternativas consideradas

- Controladores con acceso directo a Prisma.
- Arquitectura hexagonal completa.

## Consecuencias

### Positivas

- Separación de responsabilidades.
- Servicios fáciles de probar.
- Persistencia reemplazable.

### Negativas

- Mayor cantidad de archivos.
- Algunas operaciones simples requerirán atravesar varias capas.
```

Para tu MVP crearía inicialmente estos ADR:

```text
0001-use-layered-architecture.md
0002-use-prisma-with-supabase.md
0003-use-jwt-http-only-cookie.md
0004-use-bcrypt-for-passwords.md
0005-single-user-role.md
```

No necesitas un ADR para cada librería. Solo para decisiones que alguien podría cuestionar en el futuro.

---

## `docs/quality/test-strategy.md`

Define qué debe probarse y en qué nivel:

```md
# Estrategia de pruebas

## Pruebas unitarias

- Services.
- Validaciones.
- Funciones puras.

## Pruebas de integración

- Repositories con base de datos de prueba.
- Middleware de autenticación.
- Cookies y JWT.

## Pruebas de API

- Rutas principales.
- Casos exitosos.
- Entradas inválidas.
- Usuario no autenticado.
- Acceso a recursos ajenos.

## Criterios mínimos

Toda regla de negocio crítica deberá poseer al menos una prueba.
Todo error corregido deberá incluir una prueba de regresión.
```

---

## `docs/delivery/roadmap.md`

No debe ser una lista infinita de ideas. Recomiendo:

```md
# Roadmap

## MVP

- Funcionalidades necesarias para validar el producto.

## Posterior al MVP

- Mejoras aceptadas pero no necesarias para el lanzamiento.

## No planificado

- Ideas explícitamente descartadas o pendientes de validación.
```

---

## `docs/delivery/environments.md`

Documenta:

* Desarrollo.
* Pruebas.
* Producción.
* Variables requeridas.
* Base de datos utilizada por cada entorno.
* Configuración de cookies.
* Migraciones.

No debe incluir secretos.

---

## `docs/delivery/deployment.md`

Debe responder:

* Cómo compilar.
* Cómo ejecutar migraciones.
* Cómo desplegar.
* Cómo hacer rollback.
* Cómo verificar que el despliegue funciona.
* Qué endpoint se utiliza para health checks.

---

# Qué colocar en `.kiro/steering`

Los documentos de steering no deberían copiar toda la carpeta `/docs`. Deben contener reglas resumidas que Kiro necesita aplicar constantemente.

## `product.md`

```md
# Product

- El proyecto es un MVP.
- Solo existe el rol Usuario.
- No se implementarán funcionalidades administrativas.
- Debe respetarse estrictamente el alcance definido en `docs/product/scope.md`.
- No agregar funcionalidades no solicitadas.
```

## `tech.md`

```md
# Technology

- Lenguaje: TypeScript.
- Framework HTTP: Express.
- ORM: Prisma.
- Base de datos: PostgreSQL en Supabase.
- Autenticación: JWT mediante cookies HttpOnly.
- Contraseñas: bcrypt.
- Desarrollo: tsx.
- Administrador de paquetes: PNPM.
```

## `structure.md`

```md
# Project structure

La aplicación utiliza arquitectura por capas:

- `index.ts`: punto de entrada.
- `server.ts`: configuración de Express.
- `routes`: definición de rutas.
- `controllers`: adaptación HTTP.
- `services`: lógica de aplicación.
- `repositories`: acceso a Prisma.

Reglas:

- Los routes no contienen lógica de negocio.
- Los controllers no acceden a Prisma.
- Los services no dependen de objetos Request o Response de Express.
- Solo los repositories acceden directamente a Prisma.
```

## `api-standards.md`

```md
# API standards

- Utilizar recursos y verbos HTTP coherentes.
- Validar toda entrada.
- Mantener un formato uniforme de error.
- No devolver contraseñas, hashes ni tokens en JSON.
- Utilizar códigos HTTP adecuados.
- Los endpoints privados requieren autenticación.
```

## `security-standards.md`

```md
# Security standards

- Los JWT se transportan mediante cookies HttpOnly.
- Las contraseñas se protegen con bcrypt.
- No almacenar secretos en el repositorio.
- No registrar tokens, contraseñas ni hashes.
- Filtrar recursos privados por el usuario autenticado.
- No asumir que recibir un identificador válido implica autorización.
```

---

# Cómo combinar esta estructura con SPEC

Usaría esta regla:

### Documentación global

Describe decisiones y restricciones que afectan a todo el producto:

```text
docs/
.kiro/steering/
```

### Especificaciones por funcionalidad

Describe una entrega concreta:

```text
.kiro/specs/<nombre-funcionalidad>/
├── requirements.md
├── design.md
└── tasks.md
```

Ejemplo:

```text
.kiro/specs/user-registration/
```

Su `requirements.md` debería referenciar:

```md
Reglas relacionadas:

- RN-001
- RN-002
- RN-003

Requisitos relacionados:

- RF-001
- RNF-001
```

Su `design.md` debería indicar:

```md
Componentes afectados:

- `auth.routes.ts`
- `auth.controller.ts`
- `auth.service.ts`
- `user.repository.ts`
- `schema.prisma`

Contratos afectados:

- `POST /auth/register`
```

Y `tasks.md` debería contener tareas verificables:

```md
- [ ] Crear los esquemas de validación.
- [ ] Implementar `UserRepository.findByEmail`.
- [ ] Implementar el servicio de registro.
- [ ] Proteger la contraseña con bcrypt.
- [ ] Crear el controlador.
- [ ] Registrar la ruta.
- [ ] Agregar pruebas unitarias.
- [ ] Agregar pruebas de integración.
- [ ] Actualizar OpenAPI.
```

---

# Reglas para que la documentación no se convierta en deuda

1. **Una sola fuente de verdad.**
   `schema.prisma` gobierna la estructura técnica de la base de datos; OpenAPI gobierna el contrato HTTP; los documentos explican intención y restricciones.

2. **No duplicar información.**
   Un Spec debe enlazar una regla global, no copiarla entera.

3. **Actualizar documentación en el mismo cambio.**
   Una modificación funcional no está terminada mientras requisitos, contrato y pruebas estén desincronizados.

4. **Usar identificadores estables.**
   `RF-001`, `RNF-001`, `RN-001`, `FL-001` y `ADR-0001`.

5. **Escribir requisitos verificables.**
   Cada requisito debería poder convertirse en una prueba o revisión objetiva.

6. **Documentar decisiones, no conversaciones.**
   Un ADR debe conservar la conclusión, el contexto y las consecuencias, no todo el debate.

7. **Mantener el alcance explícito.**
   Toda funcionalidad nueva debe demostrar que pertenece al MVP antes de generar su Spec.

## Recomendación final

Para tu proyecto, adoptaría **Kiro SPEC sin tratarlo como un estándar**, sino como la capa operativa para desarrollar cada funcionalidad. La estructura completa quedaría resumida así:

```text
README.md                  → entrada al repositorio
docs/product/              → alcance, reglas y flujos
docs/requirements/         → requisitos globales
docs/architecture/         → diseño, datos, API y seguridad
docs/quality/              → estrategia de pruebas
docs/delivery/             → roadmap y despliegue
.kiro/steering/            → instrucciones permanentes para Kiro
.kiro/specs/<feature>/     → requisitos, diseño y tareas de cada cambio
```

Eso proporciona suficiente disciplina y trazabilidad sin convertir un MVP en un proyecto dominado por documentación.

[1]: https://kiro.dev/docs/specs/feature-specs/requirements-first/ "Requirements-First Workflow - IDE - Docs - Kiro"
[2]: https://alistairmavin.com/ears/?utm_source=chatgpt.com "Alistair Mavin EARS: Easy Approach to Requirements Syntax"
[3]: https://www.iso.org/standard/72089.html?utm_source=chatgpt.com "ISO/IEC/IEEE 29148:2018 - Systems and software ..."
[4]: https://www.iso.org/es/contents/data/standard/07/43/74393.html?utm_source=chatgpt.com "ISO/IEC/IEEE 42010:2022 - Software, systems and enterprise — Architecture description"
[5]: https://c4model.com/?utm_source=chatgpt.com "C4 model: Home"
[6]: https://adr.github.io/?utm_source=chatgpt.com "Architectural Decision Records (ADRs) | Architectural Decision Records"
[7]: https://kiro.dev/docs/steering/ "Steering - IDE - Docs - Kiro"
