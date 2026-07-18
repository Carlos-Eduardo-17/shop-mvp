/*
Repositorio de User
- Solo llamadas a Prisma, sin try/catch ni throws.
- Los errores(Excepciones) suben solos al Controller.
Tipos de return
- create → ✅ Promise<User> | ❌ Excepción
- find → ✅ Promise<User> | ❌ Promise<User>
- findMany → ✅ Promise<User>[] | ❌ Promise<User>[] (vacío)
- update → ✅ Promise<User> | ❌ Excepción
- delete → ✅ Promise<User> | ❌ Excepción
*/

import { prisma } from '../config/db.js';
import { User, Prisma } from '@prisma/client'; // Importa las entidades y tipos del cliente de Prisma

export class UserRepository {
    async create(data: Prisma.UserCreateInput): Promise<User> {
        return await prisma.user.create({ data });
    }
    async find(id: string): Promise<User | null> {
        return await prisma.user.findUnique({ where: { id } });
    }
    async findMany(): Promise<User[]> {
        return await prisma.user.findMany();
    }
    async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
        return await prisma.user.update({ where: { id }, data });
    }
    async delete(id: string): Promise<User> {
        return await prisma.user.delete({ where: { id } });
    }
    async findByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({ where: { email } });
    }
    async saveRefreshToken(userId: string, refreshToken: string): Promise<User> {
        return await prisma.user.update({ where: { id: userId }, data: { refreshToken } });
    }
}
