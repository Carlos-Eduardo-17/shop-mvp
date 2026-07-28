import { ProductRepository, CategoryRepository, ProductWithCategoryName } from '../repositories/product.repository.js';
import { AppError } from '../utils/appError.util.js';
import { GetCategoriesOutPutDTO, GetProductOutPutDTO } from '../dtos/product.dto.js';

export class CategoryService {

    constructor(private categoryRepository: CategoryRepository) { }

    async getCategories(): Promise<GetCategoriesOutPutDTO[]> {
        // Usado en menú desplegable        
        // retorna: categories = [(id: 1, name: "hello kitty"),(id: 2, name: "genéricos"),(id: 3, name: "harry potter"),...]        
        return await this.categoryRepository.findManyOnlyIdsAndNAmes();
    }
}

export class ProductService {

    constructor(private productRepository: ProductRepository) { }

    async getProduct(id: number): Promise<GetProductOutPutDTO> {
        const product: ProductWithCategoryName | null = await this.productRepository.find(id);
        if (!product) { throw new AppError("Producto no encontrado", 404); }

        return { id: product.id, name: product.name, description: product.description, unitPrice: product.unitPrice.toNumber(), unitsInStock: product.unitsInStock, imageUrl: product.imageUrl, categoryId: product.categoryId, categoryName: product.category.name };
    }

    async getProducts(categoryId?: number | undefined): Promise<GetProductOutPutDTO[]> {
        let products: ProductWithCategoryName[]

        if (categoryId != undefined && categoryId > 0) {
            products = await this.productRepository.findManyByCategory(categoryId);
        }
        else {
            products = await this.productRepository.findMany();
        }

        return products.map((product): GetProductOutPutDTO => ({
            id: product.id,
            name: product.name,
            description: product.description,
            unitPrice: product.unitPrice.toNumber(),
            unitsInStock: product.unitsInStock,
            imageUrl: product.imageUrl,
            categoryId: product.categoryId,
            categoryName: product.category.name
        }));
    }

}
