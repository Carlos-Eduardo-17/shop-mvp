import { Router } from "express";

import { OrderController } from '../controllers/order.controller.js';
import { OrderService } from "../services/order.service.js";
import { OrderRepository } from "../repositories/order.repository.js";
import { CartRepository } from "../repositories/cart.repository.js";

import { limitRequests } from "../middlewares/rateLimit.middleware.js";
import { validateRequest } from '../middlewares/validator.middleware.js';
import { requireAuth } from "../middlewares/requireAuth.middleware.js";

import { createOrderRules } from '../validators/order.validator.js';
import { cleaningRules } from '../validators/generic.validator.js';

const orderController = new OrderController(new OrderService(new OrderRepository(), new CartRepository()));
const router = Router();

// 1ro revisará el límite de request, 2do revisará autenticación, 3ro revisará las reglas de validación, 4to revisará si pasaron correctamente las reglas
router.post("/", limitRequests(300, 100), requireAuth, createOrderRules, validateRequest, orderController.createOrder);
router.get("/", limitRequests(300, 100), requireAuth, cleaningRules, validateRequest, orderController.getOrders);

export default router;