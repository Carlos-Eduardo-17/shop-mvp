## Funcionalidades principales
- Registro con email y contraseña.
- Login con email y contraseña
- Logout (invalidación de cookies/tokens)
- Refresh token rotation (access token de corta duración + refresh token de larga duración)
- Edición y eliminación de cuenta de usuario (autenticado)

## Funcionalidades secundarias
- Rate limiting en intentos de login fallidos (express-rate-limit)
- Validación de inputs en todos los endpoints (express-validator)
- Headers de seguridad HTTP (helmet)
- Frontend básico HTML/CSS para demostrar el flujo visualmente (para portfolio)
- Validación de 5 minutos solo cuando el usuario intente pagar (en tiempo de ejecución), no con un proceso en segundo plano.
- Flujo de vida de orden debe ser simplemente: PENDING -> PAID (usando tu endpoint manual)

## Funcionalidades para futuras versiones
- Colocación de temporizador de 5 minutos en el frontend para que el usuario vea cuánto tiempo le queda para pagar.

## Funcionalidades fuera del alcance
- Gestión de usuarios (CRUD) por parte del administrador
- Roles y permisos (RBAC/ABAC)
- Panel de administración
- Autenticación multifactor (MFA)
- Single Sign-On (SSO)
- Otros proveedores OAuth (GitHub, Facebook, etc.)
- Aplicación móvil
- Envío de emails (verificación de email, recuperación de contraseña, notificaciones, etc.)
- Recuperación de contraseña (código corto enviado al email del usuario)
- Datos con regulación legal (GDPR, HIPAA, etc.)
- Soft deletes para usuarios, productos y categorías.
- Liberación del stock del carrito cada 15 minutos con un job.
- Flujo de "SHIPPED" y "RETURNED
- Administrador del sistema.