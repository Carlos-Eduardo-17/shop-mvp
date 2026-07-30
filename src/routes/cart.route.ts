import { Router } from "express";

import { CartController } from '../controllers/cart.controller.js'
import { CartService } from "../services/cart.service.js";
import { CartRepository, CartItemRepository } from "../repositories/cart.repository.js";
import { ProductRepository } from "../repositories/product.repository.js";

import { limitRequests } from "../middlewares/rateLimit.middleware.js";
import { validateRequest } from '../middlewares/validator.middleware.js';
import { requireAuth } from "../middlewares/requireAuth.middleware.js";

import { addItemRules, removeItemRules } from '../validators/cart.validator.js';
import { cleaningRules } from "../validators/generic.validator.js";


const cartController = new CartController(new CartService(new CartRepository(), new CartItemRepository(), new ProductRepository()));
const router = Router();

// 1ro revisará el límite de request, 2do revisará autenticación, 3ro revisará las reglas de validación, 4to revisará si pasaron correctamente las reglas
router.post("/cart/items", limitRequests(300, 100), requireAuth, addItemRules, validateRequest, cartController.addItem);
router.get("/cart", limitRequests(300, 100), requireAuth, cleaningRules,validateRequest, cartController.getCart);
router.delete("/cart/items", limitRequests(300, 100), requireAuth, removeItemRules, validateRequest, cartController.removeItem);

export default router;