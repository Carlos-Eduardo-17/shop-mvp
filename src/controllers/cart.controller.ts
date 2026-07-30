import { Request, Response, NextFunction } from "express";
import { CartService } from "../services/cart.service.js";
import { GetCartOutputDTO, AddItemOutputDTO } from "../dtos/cart.dto.js";

export class CartController {

    constructor(private cartService: CartService) { }

    addItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { productId, quantity }: { productId: number; quantity: number } = req.body;
            const userId: string = req.user!.userId;

            const cartItem: AddItemOutputDTO = await this.cartService.addItem({ userId, productId, quantity });

            res.status(200).json({
                message: `Se agregó/actualizó correctamente la cantidad del producto.`,
                data: { id: cartItem.id, quantity: cartItem.quantity, cartId: cartItem.cartId, productId: cartItem.productId }
            })
        } catch (error: any) {
            next(error);
        }
    }
    getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId: string = req.user!.userId;
            const cart: GetCartOutputDTO = await this.cartService.getCart(userId);

            res.status(200).json({
                message: `Se obtuvo el carrito y su total correctamente.`,
                data: cart
            });
        } catch (error) {
            next(error);
        }
    }
    removeItem = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.user!.userId;
            const cartItemId: number = req.body.cartItemId;

            await this.cartService.removeItem({ userId, cartItemId });

            res.status(200).json({
                message: `Se removió correctamente el item del carrito`
            })
        } catch (error) {
            next(error);
        }
    }
}
