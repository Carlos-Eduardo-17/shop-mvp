import { Request, Response, NextFunction } from "express";
import { GetCategoriesOutPutDTO, GetProductOutPutDTO } from "../dtos/product.dto.js";
import { CategoryService, ProductService } from "../services/product.service.js";

export class CategoryController {

    constructor(private categoryService: CategoryService) { }

    getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const categories: GetCategoriesOutPutDTO[] = await this.categoryService.getCategories();

            res.status(200).json({
                message: `Categorías`,
                data: categories
            })
        } catch (error: any) {
            next(error);
        }
    }
}

export class ProductController {

    constructor(private productService: ProductService) { }

    getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {


            

            const categoryId: number = Number(req.query["categoryId"]);

            const products: GetProductOutPutDTO[] = await this.productService.getProducts(categoryId);

            res.status(201).json({
                message: `Productos`,
                data: products
            })
        } catch (error: any) {
            next(error);
        }
    }

    getProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id: number = Number(req.params["id"]);
            const product: GetProductOutPutDTO = await this.productService.getProduct(id);

            res.status(201).json({
                message: `Producto`,
                data: product
            })
        } catch (error: any) {
            next(error);
        }
    }
}