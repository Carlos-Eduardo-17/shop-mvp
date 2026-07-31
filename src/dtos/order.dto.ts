export interface CreateOrderInputDTO {
    userId: string;
    shippingAddress: string;
}

export interface OrderDetailOutputDTO {
    id: number;
    productId: number;
    quantity: number;
    unitPrice: number;
    subtotal: number;
}

export interface CreateOrderOutputDTO {
    id: number;
    status: string;
    total: number;
    shippingAddress: string;
    createdAt: Date;
    details: OrderDetailOutputDTO[];
}

export interface GetOrdersOutputDTO {
    id: number;
    status: string;
    total: number;
    shippingAddress: string;
    createdAt: Date;
}