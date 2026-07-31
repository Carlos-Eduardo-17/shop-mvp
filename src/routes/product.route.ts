import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";
import { ProductService } from "../services/product.service.js";
import { ProductRepository } from "../repositories/product.repository.js";
import { limitRequests } from "../middlewares/rateLimit.middleware.js";
import { getByIdRules } from "../validators/product.validator.js";
import { validateRequest } from "../middlewares/validator.middleware.js";

const productController = new ProductController(new ProductService(new ProductRepository()));
const router = Router();

router.get("/", limitRequests(300, 100), productController.getProducts); // ?categoryId=
router.get("/:id", limitRequests(300, 100), getByIdRules, validateRequest, productController.getProduct);

export default router;