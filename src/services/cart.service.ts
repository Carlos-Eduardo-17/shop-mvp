import { Cart, CartItem } from "@prisma/client";
import { CartRepository, CartItemRepository, CartWithProducts } from '../repositories/cart.repository.js';
import { ProductRepository, ProductWithCategoryName } from "../repositories/product.repository.js";

import { AppError } from "../utils/appError.util.js";
import { AddItemInputDTO, AddItemOutputDTO, RemoveItemInputDTO, GetCarOutputDTO } from "../dtos/cart.dto.js";

export class CartService {

    constructor(private cartRepository: CartRepository, private cartItemRepository: CartItemRepository, private productRepository: ProductRepository) { }

    // (Crear automáticamente el carrito si no existe y) Agregar un producto al carrito o actualizar su cantidad
    async addItem(data: AddItemInputDTO): Promise<AddItemOutputDTO> {
        if (data.quantity <= 0) { throw new AppError("La cantidad debe ser mayor a cero.", 400); }
        if (data.quantity > 5) { throw new AppError("No se puede agregar más de 5 unidades de un mismo producto", 400); }

        let cart: Cart | null = await this.cartRepository.findByUserId(data.userId);

        // Si no existe el carrito, crearlo
        if (!cart) { cart = await this.cartRepository.create(data.userId); }

        // Validar existencia y stock del producto
        const product: ProductWithCategoryName | null = await this.productRepository.find(data.productId);
        if (!product) { throw new AppError("El producto no existe", 404); }
        if (product.unitsInStock < data.quantity) { throw new AppError("Stock insuficiente de este producto.", 400); }

        // Validar existencia del item en el carrito usando el @@inque estructural
        const existingItem: CartItem | null = await this.cartItemRepository.findByCartIdAndProductId(cart.id, product.id);

        if (existingItem) {
            const newQuantity: number = existingItem.quantity + data.quantity;
            // Validar máximo 5 unidades de cada producto
            if (newQuantity > 5) { throw new AppError("Has alcanzado el límite de 5 unidades para este producto", 400); }
            // Validar stock contra la cantidad total general
            if (product.unitsInStock < newQuantity) { throw new AppError("Stock insuficiente del producto", 400); }
            // Actualizar la cantidad            
            return await this.cartItemRepository.updateQuantity(existingItem.id, newQuantity);
        }
        // Si no existía, crear el registro
        let cartId: number = cart.id;
        let quantity: number = data.quantity;
        let productId: number = data.productId;

        return await this.cartItemRepository.create({ quantity, cartId, productId });
    }

    // Obtener el carrito activo del usuario y calcular el total
    async getCart(userId: string) {
        let cart: CartWithProducts | null = await this.cartRepository.findwithProductByUserId(userId);
        if (!cart) return { id: null, userId: userId, item: [], total: 0 };

        // Calcular precios en TS
        const total: number = cart.items.reduce((acumulado, item) => {
            // Nota: Asumimos que el modelo Product tiene un campo 'price' (usualmente de tipo Decimal o Float)
            return acumulado + (Number(item.product.unitPrice) * item.quantity);
        }, 0);

        return { id: cart.id, userId: cart.userId, item: cart.items, total: total }
    }

    // Eliminar item especifico del carrito
    async removeItem(data: RemoveItemInputDTO): Promise<void> {
        // Validar que el item pertenece al carrito del usuario
        const cart: Cart | null = await this.cartRepository.findByUserId(data.userId);
        if (!cart) { throw new AppError("Carrito no encontrado", 404); }
        // Validar que el item exite dentro del carrito
        if (!await this.cartItemRepository.findByCartItemIdAndCartId(data.cartItemId, cart.id)) { throw new AppError("El ítem no existe en el carrito", 404); }

        // Eliminarlo, no retorna nada si tuvo éxito, sino Prisma lanzará excepción
        await this.cartItemRepository.delete(data.cartItemId);
    }
}