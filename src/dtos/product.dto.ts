export interface GetCategoriesOutPutDTO {
    id: number;
    name: string;
}
export interface GetProductOutPutDTO {
    id: number;
    name: string;
    description: string;
    unitPrice: number;
    unitsInStock: number;
    imageUrl: string | null;
    categoryId: number;
    categoryName: string;
}