## Control de autenticación y autorización
- **jsonwebtoken**
- **cookie-parser**

**Sustentación:**
Permite que el servidor genere y valide tokens **dentro de las cookies httpOnly** (con información mínima necesaria para autenticar al usuario), mientras el cliente no puede crear, modificar ni acceder a su contenido (inaccesible desde JS del frontend, protege contra XSS). El navegador envía automáticamente las cookies al servidor en cada solicitud, y el servidor las verifica para autenticar al usuario.

## Seguridad
- **bcrypt**<sup>1</sup>
- **express-validator**<sup>2</sup>
- **helmet**<sup>3</sup>
- **express-rate-limit**<sup>4</sup>
- **cors**<sup>5</sup>

**Sustentación:**
<sup>1</sup>Encriptación irreversible de contraseñas. <sup>2</sup>Validación y sanitización de inputs en todos los endpoints. <sup>3</sup>Headers de seguridad HTTP. <sup>4</sup>Rate limiting en intentos de login fallidos. <sup>5</sup>Configuración para permitir solo el origen del frontend (Vercel).

## Frameworks
- **express** 

**Sustentación:**
Framework web minimalista y flexible. Permite crear APIs REST de manera rápida y sencilla. Compatible con middlewares y librerías de terceros.

## Base de Datos
- **@prisma/client**<sup>1</sup>
- **@prisma/adapter-pg**<sup>2</sup>
- **pg**<sup>3</sup>

**Sustentación:**
<sup>1</sup>Cliente de Prisma para interactuar con la base de datos. <sup>2</sup>Adaptador de Prisma para PostgreSQL. <sup>3</sup>Driver oficial de PostgreSQL para Node.js.

## Variables de entorno .env
- **dotenv**

**Sustentación:**
Permite cargar variables de entorno desde un archivo `.env` en `process.env`, lo que facilita la configuración de la aplicación sin exponer información sensible en el código fuente.

---
---
## Solo para desarrollo
- **@types/bcrypt, @types/cookie-parser, @types/cors, @types/express, @types/jsonwebtoken, @types/pg**, **@types/node**

**Sustentación:**
Importa tipos de TypeScript para interactuar con las librerías de terceros.

- **prisma**

**Sustentación:**
Permite generar el cliente de Prisma y ejecutar migraciones de la base de datos.

- **tsx**<sup>1</sup>
- **typescript**<sup>2</sup>
- **rimraf**<sup>3</sup>


**Sustentación:**
<sup>1</sup>Permite ejecutar archivos TypeScript directamente sin necesidad de compilarlos previamente.
<sup>2</sup>Compilador de TypeScript para convertir código TS a JS.
<sup>3</sup>Elimina carpetas y archivos de manera recursiva, útil para limpiar la carpeta `dist` antes de compilar.


---
---

## Performant Node Package Manager (PNPM)
**Sustentación**
- Gestiona paquetes para JS/NodeJS mucho más rápido y eficiente que NPM.Y ahorra hasta un 90% de espacio en disco (almacena una sola copia global de cada paquete y usa enlaces simbólicos (symlinks), mientras que NPM descarga una copia independiente de cada dependencia en cada proyecto).

