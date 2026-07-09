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

## ORM
- **prisma**

## Variables de entorno .env
- **dotenv**

---
---
## Performant Node Package Manager (PNPM)
**Sustentación**
- Gestiona paquetes para JS/NodeJS mucho más rápido y eficiente que NPM.Y ahorra hasta un 90% de espacio en disco (almacena una sola copia global de cada paquete y usa enlaces simbólicos (symlinks), mientras que NPM descarga una copia independiente de cada dependencia en cada proyecto).
