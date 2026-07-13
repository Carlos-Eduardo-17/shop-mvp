import { Router } from "express";
import { UserController } from '../controllers/user.controller.js'
import { UserService } from "../services/user.service.js";
import { UserRepository } from "../repositories/user.repository.js";

const userController = new UserController(new UserService(new UserRepository()));
const router = Router();

router.post("/register", userController.register);

export default router;