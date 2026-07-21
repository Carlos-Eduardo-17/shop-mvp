import { Router } from "express";

import { UserController } from '../controllers/user.controller.js'
import { UserService } from "../services/user.service.js";
import { UserRepository } from "../repositories/user.repository.js";

import { limitRequests } from "../middlewares/rateLimit.middleware.js";
import { validateRequest } from '../middlewares/validator.middleware.js';

import { loginRules, cleaningRules, registerRules } from '../validators/user.validator.js'
import { requireAuth } from "../middlewares/requireAuth.middleware.js";


const userController = new UserController(new UserService(new UserRepository()));
const router = Router();

// 1ro revisará el límite de request, 2do revisará que los campos cumplan con las reglas de validación, 3ro revisará si pasaron correctamente las reglas de validación
router.post("/register", limitRequests(300, 100), registerRules, validateRequest, userController.register); //300,3
router.post("/login", limitRequests(300, 100), loginRules, validateRequest, userController.login);
router.post("/refresh", limitRequests(300, 100), cleaningRules, validateRequest, userController.refresh);
router.get("/me", limitRequests(300, 100), cleaningRules, validateRequest, requireAuth, userController.me);
router.post("/logout", limitRequests(300, 100), cleaningRules, validateRequest, requireAuth, userController.logout);

export default router;