## Dependencias de Producción
**express**
- Framework web minimalista para node
- Es el motor de la API. Se encarga de levantar el servidor, recibir peticiones HTTP y enrutarlas a los controladores.

**cors**
- Middleware para intercambio de recursos de origen cruzado.
- Permite que el Frontend pueda hacer peticiones al Backend sin ser bloqueado por las políticas de seguridad del navegador.

**dotenv**
- Cargador de variables de entorno.
- Lee el archivo .env e inyecta sus secretos en process.env para que el código fuente los use de forma segura.

**helmet**
- Colección de middlewares de seguridad.
- Protege a la aplicación configurando únicamente cabeceras HTTP de seguridad para evitar ataques comunes como XSS y clickjacking.

**jsonwebtoken**
- Implementación del estándar JSON Web Tokens.
- Genera y verifica los Access_Token y Refresh_Token para mantener a los usuarios autenticados de forma segura (stateless).

**bcrypt**
- Librería de criptografía.
- Encripta las contraseñas de ususario antes de ser guardas en la DB. También compara contraseñas para verificación.

**pg**
- Cliente nativo de PostgreSQL para Node.js.
- Driver que permite al servidor de Node.js comunicarse y ejecutar comandos en una DB de PostgreSQL.

**express-rate-limit**
- Middleware limitador de peticiones.
- Previene ataques de fuerza bruta ode denegación de servicio (DDoS) bloqueando IPs que hagan demasiadas peticiones en poco tiempo.

**cookie-parser**
- Middleware para analizar (parsear) cookies.
- Lee las cookies que vienen en las peticiones del cliente. Permite que los tokens JWT viajen seguros en cookies HttpOnly.

**@prisma/client**
- Query builder autogenerado por Prisma.
- Código usado en Repositories para hacer consultas a la DB de forma tipada.

**@prisma/adapter-pg**
- Adaptador de Prisma para el driver pg.
- Optimiza la forma en que Prisma se conecta a PostgreSQL usando el driver nativo pg en lugar de su motor Rust estándar (útil para serverless).

## Dependencias de Desarrollo
**rimraf**
- Herramienta multiplataforma para eliminar carpetas (equivalente a rm -rf de Unix).
- Usado en scripts de package.json para limpiar/borrar la carpeta dist/ antes de generar un nuevo build, garantizando que no queden archivos basura o cacheados de compilaciones anteriores en producción.

**tsx**
- Ejecutor de TypeScript ultrarápido (basado en esbuild) usado exclusivamente en la etapa de desarrollo.
- Permite correr el servidor en tiempo real y ejecutar scripts para poblar la DB, sin tener que compilar el código a JS previamente.

**typescript**
- Lenguaje y compilador oficial de TypeScript.
- Brinda tipado estricto. Busca errores en el código en tiempo de desarrollo. Posee el comando `tsc` para traducir todo el código TS a JS puro para que el motor de Node.js pueda entender.

**@types/(bcrypt, cookie-parser, cors, express, jsonwebtoken, node, pg)**
- Archivos de declaración de tipos para TypeScript
- Brindan autocompletado y aseguran que el compilador no tenga tipos faltantes.
- Debido a que las librerías originales fueron escritas en JS puro, estos paquetes le enseñan a TS cómo funcionan.

**prisma**
- Interfaz de Línea de Comandos de Prisma.
- Permite usar comandos como: `npx prisma format`, `npx prisma db push` y `npx prisma generate`

## Estrategias
### Tokens seguros y legibles solo por el servidor**
- **jsonwebtoken**
- **cookie-parser**

**Sustentación:**
Permite que el servidor genere y valide tokens **dentro de las cookies httpOnly** (con información mínima necesaria para autenticar al usuario), mientras el cliente no puede crear, modificar ni acceder a su contenido (inaccesible desde JS del frontend, protege contra XSS). El navegador envía automáticamente las cookies al servidor en cada solicitud, y el servidor las verifica para autenticar al usuario.

### Seguridad
- **bcrypt**<sup>1</sup>
- **express-validator**<sup>2</sup>
- **helmet**<sup>3</sup>
- **express-rate-limit**<sup>4</sup>
- **cors**<sup>5</sup>

**Sustentación:**
<sup>1</sup>Encriptación irreversible de contraseñas. <sup>2</sup>Validación y sanitización de inputs en todos los endpoints. <sup>3</sup>Headers de seguridad HTTP. <sup>4</sup>Rate limiting en intentos de login fallidos. <sup>5</sup>Configuración para permitir solo el origen del frontend (Vercel).

### Base de Datos
- **@prisma/client**<sup>1</sup>
- **@prisma/adapter-pg**<sup>2</sup>
- **pg**<sup>3</sup>
- **prisma**<sup>4</sup>

**Sustentación:**
<sup>1</sup>Cliente de Prisma para interactuar con la base de datos. <sup>2</sup>Adaptador de Prisma para PostgreSQL. <sup>3</sup>Driver oficial de PostgreSQL para Node.js.<sup>4</sup>Permite generar el cliente de Prisma y ejecutar migraciones de la base de datos. Usado exclusivamente solo en desarrollo.

**Explicación de integración**
- Tradicionalmente Prisma usaba un motor interno escrito en lenguaje Rust para conectarse a la DB. Pero eso hacía más pesado y lento al servidor y consumía más memoria RAM.
- Sin embargo, actualmente se usa una característica más nueva y optimizada llamada **Driver Adaptes**.
- **prisma** es la herramienta de terminal usada para ejecutar comandos como `npx prisma format`, `npx prisma db push`, y `npx prisma generate`. Básicamente lee el archivo `schema.prisma` y prepara todo el terreno, pero no anticipa cuando el servidor estará corriendo.
- **@prisma/client** es el código usado en los `repositories` para hacer las consultas a la DB de forma tipada (como `prisma.user.findUnique(...)`). El código en TypeScript le da la orden a este cliente.
- **@prisma/adapter-pg** adaptador usado por **@prisma/client** para traducir la orden en formato de Prisma a un formato que el driver nativo de Node.js pueda entender. Tradicionalmente **@prisma/client** usaba su motor pesado de Rust para ejecutar la orden.
- **pg** es el **driver** que permite que el servidor de Node.js se comunique y ejecute comandos en la DB de PostgreSQL. Es la librería de más bajo nivel. Recibe la orden traducidapor el adaptador, viaja por la red hasta la DB real en Supabase, ejecuta el SQL puro y devuelve los datos por el mismo camino de regreso.

### Scripts para package.json
- **tsx**<sup>1</sup>
- **typescript**<sup>2</sup>
- **rimraf**<sup>3</sup>

**Sustentación:**
<sup>1</sup>Permite ejecutar archivos TypeScript directamente sin necesidad de compilarlos previamente.
<sup>2</sup>Compilador de TypeScript para convertir código TS a JS.
<sup>3</sup>Elimina carpetas y archivos de manera recursiva, útil para limpiar la carpeta `dist` antes de compilar.

### Performant Node Package Manager (PNPM)
**Sustentación**
- Gestiona paquetes para JS/NodeJS mucho más rápido y eficiente que NPM.Y ahorra hasta un 90% de espacio en disco (almacena una sola copia global de cada paquete y usa enlaces simbólicos (symlinks), mientras que NPM descarga una copia independiente de cada dependencia en cada proyecto).