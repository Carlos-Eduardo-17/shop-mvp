## Reglas de negocio críticas
- El email es el identificador único de un User en el sistema
- No se puede crear una cuenta  con un email que ya esté en uso
- Las contraseñas se almacenan hasheadas con bcrypt (nunca en texto plano)
- Las cookies sin HTTPOnly serán usadas solo para información no sensible como preferencias de usuario, idioma, temas, etc.
- LocalStorage será usado solo para almacenar carritos de compras de usuarios no registrados o logueados. Mientras que para usuarios registrados, el carrito se almacena en la base de datos y se sincroniza con el cliente cada vez que inicia sesión.
- Tiempo de vida de tokens:
    - **Access token:** 15 minutos
    - **Refresh token:** 7 días
- Límites de intentos antes de bloqueo temporal:
    - **Registro fallido:** 5 intentos dentro de los 15 minutos, luego bloqueo de 60 minutos.
    - **Logins fallidos:** 3 intentos dentro de los 15 minutos, luego bloqueo de 60 minutos.

        
