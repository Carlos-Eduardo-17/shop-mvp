/*
Repositorio de User
- Solo llamadas a Prisma, sin try/catch ni throws.
- Los errores(Excepciones) suben solos al Controller.

Tipos de return

- create → Siempre devuelve el registro creado (o lanza excepción si Prisma falla)
✅ Promise<User> | ❌ Excepción

- find → Puede no existir, por eso el null. lanza excepción si Prisma falla
✅ Promise<User | null> | ❌ ???

- findMany → Siempre devuelve un array (vacío si no hay resultados, nunca null). lanza excepción si Prisma falla
✅ Promise<User[]> | ❌ ???

- update → Devuelve el registro actualizado. Si el registro no existe, Prisma lanza una excepción
✅ Promise<User> | ❌ Excepción

- delete → Casi nunca se requiere ver el objeto eliminado. Si el registro no existe, Prisma lanza excepción (P2025 - Record to delete does not exist). Si el registro está referenciado por FK restrict o sin onDelete: Cascade, Prisma lanza excepción: P2003. Error interno de PRisma lanza excepción: P1001, P1002, etc
✅ Promise<void> | ❌ Excepción
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
    async delete(id: string): Promise<void> {
        await prisma.user.delete({ where: { id } });
    }
    async findByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({ where: { email } });
    }
    async saveRefreshToken(userId: string, refreshToken: string): Promise<User> {
        return await prisma.user.update({ where: { id: userId }, data: { refreshToken } });
    }
    async findByRefreshToken(refreshToken: string): Promise<User | null> {
        return await prisma.user.findUnique({ where: { refreshToken } });
    }
    async updateRefreshToken(userId: string, refreshToken: string): Promise<User> {
        return await prisma.user.update({ where: { id: userId }, data: { refreshToken } });
    }
    async clearRefreshToken(userId: string): Promise<User> {
        return await prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
    }
}
