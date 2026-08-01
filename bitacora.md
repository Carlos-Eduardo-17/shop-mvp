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

## 19. Creación de módulo de Carrito de Compras
- En estos servicios se aplicará:
    - Validación de existencia y stock
    - Límite de 5 unidades de cada producto en el Carrito.
    - Cálculo de precios directamente en TS.

  .
  .
  .

## Preparación para subirlo a Render
- Crear env.example para mostrar solo los nombres de variables de entorno con data de ejemplo.
- En user.controller, agregar al inicio del archivo:

        // Backend (Render) y frontend (Vercel) viven en dominios distintos, así que las
        // cookies deben viajar cross-site. Eso exige sameSite: 'none' + secure: true en
        // producción. En local (mismo host:puerto distinto de Vite) usamos 'lax'.
        const getCookieOptions = (): CookieOptions => ({
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // HTTPS obligatorio en producción (requisito de sameSite: 'none')
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
- En package.json, establecer el script "build": "prisma generate && rimraf dist && tsc"
- Generar migraciones de Prisma localmente

        npx prisma migrate dev --name init