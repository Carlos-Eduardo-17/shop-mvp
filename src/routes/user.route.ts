import { Router } from "express";

import { UserController } from '../controllers/user.controller.js'
import { UserService } from "../services/user.service.js";
import { UserRepository } from "../repositories/user.repository.js";

import { limitRequests } from "../middlewares/rateLimit.middleware.js";
import { validateRequest } from '../middlewares/validator.middleware.js';

import { cleaningRules } from '../validators/user.validator.js'
import { requireAuth } from "../middlewares/requireAuth.middleware.js";


const userController = new UserController(new UserService(new UserRepository()));
const router = Router();

// 1ro revisará el límite de request, 2do revisará que los campos cumplan con las reglas de validación, 3ro revisará si pasaron correctamente las reglas de validación
router.get("/me", limitRequests(300, 50), cleaningRules, validateRequest, requireAuth, userController.me);

export default router;