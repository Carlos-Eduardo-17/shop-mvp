import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';
import { RegisterUserInputDTO, RegisterUserOutputDTO } from '../dtos/user.dto.js'

export class UserController {
    constructor(private userService: UserService) { }

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data: RegisterUserInputDTO = req.body;
            const user: RegisterUserOutputDTO = await this.userService.register(data);
            res.status(201).json({
                message: `Se creó exitosamente la cuenta (${user.id}) de ${user.firstName} ${user.lastName} usando ${user.email}.`
            })
        } catch (error) {
            next(error);
        }
    }

}