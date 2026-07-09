## Carpetas iniciales
**src/**
- ✅ Contiene todo el código fuente de la aplicación.

**src/config**
- ✅ Contiene configuración técnica y estática del proyecto.

**src/dtos**
- ✅ Define y valida la estructura de los datos de entrada y salida entre capas.
- ✅ Evita exponer datos irrelevantes y sensibles (password, tokens, etc.).
- ❌ No contiene lógica de negocio.

**src/middlewares**
- ✅ Funciones reutilizables que interceptan, validan y/o modifican las solicitudes antes de llegar al controller y las respuestas antes de ser enviadas al cliente. Dependen de Express.
- ❌ No contienen lógica de negocio, pero sí pueden leer datos del dominio (como comprobar si un usuario está autenticado).

**src/utils**
- ✅ Funciones genéricas reutilizables (como hashearClave, generarUUID's, parsearFecha, generarToken y validaciones genéricas).
- ✅ No dependen del dominio, ni de la DB, ni de Express.

**src/seed**
- ✅ Contiene registros precargados para la base de datos.

**src/routes**
- ✅ Definen los endpoints de la API agrupándolos por recurso.
- ✅ Asocian endpoints con controllers.
- ✅ Usan middlewares.
- ✅ Importan solo controllers y middlewares.

**src/controllers**
- ✅ Reciben peticiones y envían respuestas HTTP.
- ✅ Validan datos de entrada a nivel superficial (comprobación de existencia, tipología y formato básico de data).
- ✅ Llama a los services para ejecutar la lógica de negocio y obtener resultados.
- ✅ Usan dtos.
- ✅ Importan solo dtos y services.

**src/services**
- ✅ Contienen la lógica de negocio.
- ✅ Aplican reglas, validaciones y flujos del dominio.
- ✅ Importan solo repositories, utils y otros services (para flujos complejos).
- ❌ No tienen conocimiento de la capa de persistencia (DB) ni de la capa de presentación (HTTP).

**src/repositories**
- ✅ Definen todas las operaciones CRUD de la DB.
- ✅ Solo importan models y el ORM.


## Archivos iniciales
**.env**
- ✅ Contiene variables de entorno (credenciales y de configuración simple).
- ❌ No debe subirse al repositorio, en su lugar subir uno de ejemplo llamado **.env.example** con valores ficticios.

**.gitignore**
- ✅ Define qué archivos y/o carpetas no se subirán a GitHub.

**src/index.ts**
- ✅ Sirve de punto de entrada (entry point) de la aplicación.
- ✅ Orquesta el arranque del sistema (conecta la aplicación a la DB y levanta el servidor HTTP).

**src/server.ts**
- ✅ Define, crea y configura la aplicación Express (preparación).
- ✅ Registra las rutas.
- ✅ Exporta la instancia de la aplicación.
- ✅ Solo importa routes y middlewares globales
- ❌ No levanta el servidor.
- ❌ No conecta a la BD.

**src/config/db.ts**
- ✅ Define únicamente la conexión a la DB.
- ✅ Exporta una función de conexión reutilizable.
- ✅ Solo importa routes y el ORM.