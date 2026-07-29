export interface AddItemInputDTO {
    userId: string;
    productId: number;
    quantity: number;
}
export interface AddItemOutputDTO {
    id: number;
    quantity: number;
    cartId: number;
    productId: number;
}

export interface CartItemProductOutputDTO {
    id: number;
    name: string;
    unitPrice: number;
    imageUrl: string | null;
}
export interface CartItemOutputDTO {
    id: number;
    quantity: number;
    productId: number;
    product: CartItemProductOutputDTO;
    subtotal: number;
}
export interface GetCartOutputDTO {
    id: number | null;
    userId: string;
    items: CartItemOutputDTO[];
    total: number;
}

export interface RemoveItemInputDTO {
    userId: string;
    cartItemId: number;
}