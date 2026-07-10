import 'dotenv/config';
import app from "./server.js";
import { prisma } from './config/db.js';

const PORT = process.env.PORT || 3000;

async function main() {
    try {
        // Probar la conexión a Supabase  con una consulta ligera
        await prisma.$queryRaw`SELECT 1`;
        console.log("✅ Conexión a la DB en Supabase establecida con éxito.");

        // Si la DB responde, levantar el servidor Express
        app.listen(PORT, () => {
            console.log(`✅ Servidor escuchando en: http://localhost:${PORT}/health`);
        });
    } catch (error) {
        console.error('No se pudo conectar con la DB', error);
        process.exit(1); // Detiene todo el proceso.
    }
}

main();