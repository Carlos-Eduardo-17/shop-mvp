## Testabilidad:
Fácil testing con mocks e inyección de dependencias usando **jest**.

## Formato de fecha y hora
Mejor visualización del tiempo para el usuario final usando **moment**.

## Envío automático de emails
Obtención de códigos de seguridad para activación de cuenta y otras operaciones usando **nodemailer**.

## Testabilidad:
Testing con mocks e inyección de dependencias usando **jest**.Y pruebas de endpoints HTTP que permite realizar solicitudes HTTP a la API y verificar las respuestas, facilitando la prueba de los endpoints y su comportamiento esperado usando **superjest**.
Librería usada como 
## Formato de fecha y hora
Mejor visualización de formato de tiempo para el usuario final usando **moment**.

## Google OAuth
Login usando credenciales de Google y vinculación automática de cuentas para el mismo email usando **passport** y **passport-google-oauth20**.

## Edición del perfil
El usuario podrá modificar sus datos personales y cambiar su contraseña (requiere tener implementado Envío automático de código al email).

## Linter y prettier para desarrollo
Estandarizar un estilo de código y detectar errores comunes en el proyecto usando **ESLint** y **prettier**.
Uso:

        pnpm add -D eslint
        pnpm dlx eslint --init
	
    Se generan preguntas para precisar la configuración. Se creará automáticamente eslint.config.js
- Instalar la extensión ESLint de Microsoft. Mostrará errores (malas prácticas y bugs) en tiempo real (mientras se escribe).
- Instalar la extensión Prettier -Code formatter de Prettier. Se formateará visualmente el código según la configuración elegida (como cambiar " por ') al guardar el archivo.

## Manejos de Logs
Mejor manejo de logs usando **morgan**

## Documentación de endpoints
Documentacion automática usando **swagger-ui-express**

## Integración de Docker para DB
- Configurar .dockerignore

        .git
        docs
        node_modules
        .env
        .gitignore
        DockerFile
        tsconfig
        readme.md
        *.log    
        ._*
- Configurar Dockerfile

        FROM node:22-alpine → Nombre de la imagen que descargará y usará
        WORKDIR /out/app    → Carpeta de trabajo dentro del contenedor
        COPY package.json package-lock.json ./  → Copia referencias de los paquetes y sus dependencias
        RUN npm install     → Instala los paquetes y sus dependencias
        COPY dist/ ./src     → Copia los archivos dentro de /dist a ./src.
        EXPOSE 3000         → Expone el servidor en el puerto 3000
        CMD ["npm", "start"]    → Inicializa el servidor

## Fuera de alcance
- **MFA / 2FA Avanzado:**
No se implementará autenticación por SMS ni apps autenticadoras (TOTP/Google Authenticator). La verificación se limitará a códigos de seguridad vía email (*Nodemailer*).
- **Compresión de respuestas**
No se usará **compression**  porque la respuesta JSON pesa menos de 1 KB, el peso añadido por los encabezados HTTP de compresión hará que la respuesta pese más. Además para archivos servidos desde buckets, el propio bucket o el CDN manejen la compresión y el almacenamiento en caché.
- **Rutas de archivos locales**
No se usará **path** para trabajar con rutas de archivos y directorios ya que los archivos están alojados en buckets de supabase.
- **Identificadores únicos**
No se usará **uuid** porque no se requieren identificadores únicos. El id único de user lo genera postgresql automáticamente.
- **Comunicación en tiempo real**
No se usará **socket.io** porque no necesitamos transporte/comunicación en tiempo real que permita establecer una conexión bidireccional entre el cliente y el servidor(chats, notificaciones en tiempo real, actualizaciones en vivo, etc.)
- **Sesiones almacenadas en cookies**
No se usará **cookie-session** ya que no se requiere manejar sesiones usando cookies como almacenamiento.
- **Sesiones almacenadas en express con almacenamiento en el servidor**
No se usará **express-session** como middleware para manejar sesiones en Express con almacenamiento en servidor.
- **Solicitudes HTTP con archivos adjuntos**
No se usará **multer** como middleware que permita manejar solicitudes HTTP con archivos adjuntos (multipart/form-data), recibir y procesar archivos enviados por el cliente, como imágenes o documentos, facilitando su almacenamiento y uso en la aplicación.
- **Comunicación con APIs externas**
No se usará **axios** en el lado del servidor porque no se requiere conectarse a otras APIs.
- **Pasarela de Pago**
No se usará **stripe** porque no se requiere demasiada complejidad en este MVP.
