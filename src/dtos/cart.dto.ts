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

export interface GetCarOutputDTO {
    // TODO: DEFINIR CORRECTAMENTE
    id: number | null;
    userId: string;
    item: {
        product: {
            name: string;
            id: number;
            createdAt: Date;
            updatedAt: Date;
            description: string;
            unitPrice: number;
            unitsInStock: number;
            imageUrl: string | null;
            categoryId: number;
        }
        id: number;
        quantity: number;
        cartId: number;
        productId: number;
    }[];
    total: number;
}

export interface RemoveItemInputDTO {
    userId: string;
    cartItemId: number;
}