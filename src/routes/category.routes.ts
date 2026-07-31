import { Router } from "express";
import { CategoryController } from "../controllers/product.controller.js";
import { CategoryService } from "../services/product.service.js";
import { CategoryRepository } from "../repositories/product.repository.js";
import { limitRequests } from "../middlewares/rateLimit.middleware.js";

const categoryController = new CategoryController(new CategoryService(new CategoryRepository()));
const router = Router();

router.get("/", limitRequests(300, 100), categoryController.getCategories);

export default router;