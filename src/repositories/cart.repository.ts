import { prisma } from '../config/db.js';
import { Cart, CartItem, Prisma } from '@prisma/client'; // Importa las entidades y tipos del cliente de Prisma

export type CartWithProducts = Prisma.CartGetPayload<{
    include: {
        items: {
            include: {
                product: true;
            };
        };
    };
}>;

export class CartRepository {
    async findByUserId(userId: string): Promise<Cart | null> {
        return await prisma.cart.findUnique({ where: { userId } });
    }
    async findwithProductByUserId(userId: string): Promise<CartWithProducts | null> {
        return await prisma.cart.findUnique({ where: { userId }, include: { items: { include: { product: true } } } });
    }
    async create(userId: string): Promise<Cart> {
        return await prisma.cart.create({ data: { userId } })
    }

}

export class CartItemRepository {
    async findByCartIdAndProductId(cartId: number, productId: number): Promise<CartItem | null> {
        return await prisma.cartItem.findUnique({ where: { cartId_productId: { cartId: cartId, productId: productId } } });
    }
    async updateQuantity(id: number, newQuantity: number): Promise<CartItem> {
        return await prisma.cartItem.update({ where: { id }, data: { quantity: newQuantity } });
    }
    async create(data: Prisma.CartItemUncheckedCreateInput): Promise<CartItem> {
        return await prisma.cartItem.create({ data });
    }
    async findByCartItemIdAndCartId(id: number, cartId: number): Promise<CartItem | null> {
        return await prisma.cartItem.findFirst({ where: { id, cartId } });
    }
    async delete(id: number): Promise<void> {
        await prisma.cartItem.delete({ where: { id } });
    }
}

/*
 
 */