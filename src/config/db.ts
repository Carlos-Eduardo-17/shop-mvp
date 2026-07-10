
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString }); // Crea el pool usando el driver nativo de pg
const adapter = new PrismaPg(pool); // Entrega el pool al adaptador de Prisma

export const prisma = new PrismaClient({ adapter }); // Exporta una única instancia de Prisma para toda la app