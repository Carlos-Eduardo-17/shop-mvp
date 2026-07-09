## Reglas generales del sistema
- El **email** debe tener **dominio válido** → alguien@dominio.com
- Las **contraseñas** deben estar **encriptadas** → Usar bcrypt
- Las **cookies con HTTPOnly** serán usadas solo para **información sensible** → tokens de acceso, tokens de refresco, etc.
- Las **cookies sin HTTPOnly** serán usadas solo para **información no sensible** → preferencias de usuario, idioma, temas, etc.
- **LocalStorage** será usado solo para **almacenar carritos de compras** de **usuarios no registrados o no logueados**. 
- **La base de datos** será usada para **almacenar carritos de compras** de **usuarios registrados** que se sincronizarán con el cliente cada vez que inicia sesión.
- Tiempo de vida de tokens:
    - **Access token:** 15 minutos
    - **Refresh token:** 7 días

## Reglas puntuales del negocio
**Registro de usuario**
- El email es el identificador único de un usuario en el sistema
- No se puede crear una nueva cuenta con un email que ya esté en uso.
- La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra mayúscula, una letra minúscula, un número y un carácter especial (@, $, #, % ó &).

**Límites de intentos antes de bloqueo temporal**
- **Registro fallido:** 5 intentos dentro de los primeros 15 minutos, luego bloqueo de 60 minutos.
- **Logins fallidos:** 3 intentos dentro de los primeros 15 minutos, luego bloqueo de 60 minutos.
        
