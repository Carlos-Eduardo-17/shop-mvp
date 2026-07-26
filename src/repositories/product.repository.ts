import { prisma } from '../config/db.js';
import { Prisma } from '@prisma/client';

export type CategorySummary = Prisma.CategoryGetPayload<{
    // Creado para tipar el retorno del método de Category donde solo retornará Id y Nombre.
    select: { id: true; name: true }
}>;

export class CategoryRepository {
    async findManyOnlyIdsAndNAmes(): Promise<CategorySummary[]> {
        return await prisma.category.findMany({ select: { id: true, name: true } });
    }
}


export type ProductWithCategoryName = Prisma.ProductGetPayload<{
    // Creado para tipar el retorno de los métodos de Product donde incluyen el nombre de categoría
    include: { category: { select: { name: true } } }
}>;

export class ProductRepository {
    async find(id: number): Promise<ProductWithCategoryName | null> {
        return await prisma.product.findUnique({ where: { id }, include: { category: { select: { name: true } } } });
    }
    async findMany(): Promise<ProductWithCategoryName[]> {
        return await prisma.product.findMany({ include: { category: { select: { name: true } } } });
    }
    async findManyByCategory(categoryId: number): Promise<ProductWithCategoryName[]> {
        return await prisma.product.findMany({ where: { categoryId }, include: { category: { select: { name: true } } } });
    }
}

