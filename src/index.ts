import 'dotenv/config';
import { Server } from "./server.js";
import { prisma } from './config/db.js';

async function main() {
    try {
        // Probar la conexión a Supabase  con una consulta ligera
        await prisma.$queryRaw`SELECT 1`;
        console.log("✅ Database connected.");
        // Si la DB responde, levantar el servidor Express
        const server = new Server()
        server.listen();
    } catch (error) {
        console.error('No se pudo conectar con la DB', error);
        process.exit(1); // Detiene todo el proceso.
    }
}

main();