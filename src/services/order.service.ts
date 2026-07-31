import { CartRepository, CartWithProducts } from "../repositories/cart.repository.js";
import { OrderRepository, OrderWithDetails, CreateOrderItemInput } from "../repositories/order.repository.js";

import { AppError } from "../utils/appError.util.js";
import { CreateOrderInputDTO, CreateOrderOutputDTO, GetOrdersOutputDTO } from "../dtos/order.dto.js";

export class OrderService {

    constructor(private orderRepository: OrderRepository, private cartRepository: CartRepository) { }

    // Convertir el carrito activo del usuario en una orden PENDING
    async createOrder(data: CreateOrderInputDTO): Promise<CreateOrderOutputDTO> {
        const cart: CartWithProducts | null = await this.cartRepository.findwithProductByUserId(data.userId);
        if (!cart || cart.items.length === 0) { throw new AppError("El carrito está vacío", 400); }

        // Revalidar stock al momento del checkout, ya que pudo cambiar desde que se agregó al carrito
        for (const item of cart.items) {
            if (item.product.unitsInStock < item.quantity) {
                throw new AppError(`Stock insuficiente de "${item.product.name}". Disponible: ${item.product.unitsInStock}.`, 400);
            }
        }

        // Congelar el precio actual de cada producto para el detalle de la orden
        const items: CreateOrderItemInput[] = cart.items.map((item: CartWithProducts['items'][number]) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: Number(item.product.unitPrice),
        }));

        const total: number = items.reduce((acumulado: number, item: CreateOrderItemInput) => acumulado + item.unitPrice * item.quantity, 0);

        const order: OrderWithDetails = await this.orderRepository.createFromCart(data.userId, cart.id, data.shippingAddress, items, total);

        return {
            id: order.id,
            status: order.status,
            total: Number(order.total),
            shippingAddress: order.shippingAddress,
            createdAt: order.createdAt,
            details: this.mapDetails(order.details),
        };
    }

    // Listar las órdenes del usuario autenticado, con el detalle de productos de cada una
    async getOrders(userId: string): Promise<GetOrdersOutputDTO[]> {
        const orders: OrderWithDetails[] = await this.orderRepository.findManyByUserId(userId);

        return orders.map((order: OrderWithDetails) => ({
            id: order.id,
            status: order.status,
            total: Number(order.total),
            shippingAddress: order.shippingAddress,
            createdAt: order.createdAt,
            details: this.mapDetails(order.details),
        }));
    }

    // Mapear los detalles de una orden (entidad de Prisma) al DTO de salida, calculando el subtotal de cada línea
    private mapDetails(details: OrderWithDetails['details']): CreateOrderOutputDTO['details'] {
        return details.map((detail: OrderWithDetails['details'][number]) => ({
            id: detail.id,
            productId: detail.productId,
            quantity: detail.quantity,
            unitPrice: Number(detail.unitPrice),
            subtotal: Number(detail.unitPrice) * detail.quantity,
        }));
    }
}