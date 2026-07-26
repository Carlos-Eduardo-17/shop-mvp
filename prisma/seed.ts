import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';
import process from 'process';
import dotenv from 'dotenv';

// Cargar las variables de entorno para asegurar que lea DATABASE_URL
dotenv.config();

const { Pool } = pkg;

// Configurar el pool con la URL de la base de datos
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

// Pasar el adaptador al constructor de PrismaClient
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('🌱 Iniciando el seeding de la base de datos...');

    // 1. Limpiar datos anteriores (opcional, útil para evitar duplicados en pruebas)
    await prisma.product.deleteMany();
    await prisma.category.deleteMany();

    // 2. Crear Categorías Principales
    const catAmigurumis = await prisma.category.create({
        data: {
            name: 'Amigurumis'
        },
    });

    const catMateriales = await prisma.category.create({
        data: {
            name: 'Materiales'
        },
    });

    // 3. Crear los 12 Productos (asociados a sus categorías)
    const products = [
        {
            name: 'Osito Dormilón',
            description: 'Amigurumi tejido a mano con hilo de algodón hipoalergénico. Ideal para bebés.',
            unitPrice: 45.00,
            unitsInStock: 5,
            imageUrl: 'https://placehold.co/400x400/FFB6C1/31343C?text=Osito',
            categoryId: catAmigurumis.id,
        },
        {
            name: 'Conejita Primavera',
            description: 'Tierna conejita con vestido floral. 25cm de alto.',
            unitPrice: 55.00,
            unitsInStock: 3,
            imageUrl: 'https://placehold.co/400x400/FFD700/31343C?text=Conejita',
            categoryId: catAmigurumis.id,
        },
        {
            name: 'Pulpito Reversible',
            description: 'Pulpito emocional tejido. Dos caras, dos colores.',
            unitPrice: 30.00,
            unitsInStock: 10,
            imageUrl: 'https://placehold.co/400x400/87CEFA/31343C?text=Pulpito',
            categoryId: catAmigurumis.id,
        },
        {
            name: 'Kit de Hilos de Algodón Pastel',
            description: 'Pack de 6 hilos colores pastel (50g c/u).',
            unitPrice: 25.00,
            unitsInStock: 15,
            imageUrl: 'https://placehold.co/400x400/E6E6FA/31343C?text=Hilos',
            categoryId: catMateriales.id,
        }
    ];

    for (const product of products) {
        await prisma.product.create({
            data: product,
        });
    }

    console.log('✅ Seeding completado con éxito. Se insertaron categorías y productos.');
}

main()
    .catch((e) => {
        console.error('❌ Error durante el seeding:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });