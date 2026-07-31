import { prisma } from '../config/db.js';
import { Prisma } from '@prisma/client';

export type OrderWithDetails = Prisma.OrderGetPayload<{
    include: { details: true };
}>;

export interface CreateOrderItemInput {
    productId: number;
    quantity: number;
    unitPrice: number; // Snapshot del precio del producto al momento de la compra
}

export class OrderRepository {
    // Crea la orden junto a sus detalles, descuenta el stock de cada producto comprado
    // y vacía el carrito de origen. Todo dentro de una única transacción atómica.
    async createFromCart(userId: string, cartId: number, shippingAddress: string, items: CreateOrderItemInput[], total: number): Promise<OrderWithDetails> {
        return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const order = await tx.order.create({
                data: {
                    userId,
                    shippingAddress,
                    total,
                    details: {
                        create: items.map((item) => ({
                            productId: item.productId,
                            quantity: item.quantity,
                            unitPrice: item.unitPrice,
                        })),
                    },
                },
                include: { details: true },
            });

            // Descontar el stock de cada producto comprado
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.productId },
                    data: { unitsInStock: { decrement: item.quantity } },
                });
            }

            // Vaciar el carrito ya convertido en orden
            await tx.cartItem.deleteMany({ where: { cartId } });

            return order;
        });
    }

    async findManyByUserId(userId: string): Promise<OrderWithDetails[]> {
        return await prisma.order.findMany({ where: { userId }, include: { details: true }, orderBy: { createdAt: 'desc' } });
    }
}