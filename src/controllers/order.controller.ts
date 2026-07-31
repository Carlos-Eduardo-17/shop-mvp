import { Request, Response, NextFunction } from "express";
import { OrderService } from "../services/order.service.js";
import { CreateOrderOutputDTO, GetOrdersOutputDTO } from "../dtos/order.dto.js";

export class OrderController {

    constructor(private orderService: OrderService) { }

    createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId: string = req.user!.userId;
            const { shippingAddress }: { shippingAddress: string } = req.body;

            const order: CreateOrderOutputDTO = await this.orderService.createOrder({ userId, shippingAddress });

            res.status(201).json({
                message: "Se generó la orden correctamente. Queda pendiente de pago.",
                data: order
            });
        } catch (error) {
            next(error);
        }
    }

    getOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId: string = req.user!.userId;

            const orders: GetOrdersOutputDTO[] = await this.orderService.getOrders(userId);

            res.status(200).json({
                message: "Órdenes",
                data: orders
            });
        } catch (error) {
            next(error);
        }
    }
}