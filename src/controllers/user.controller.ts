import { Request, Response, NextFunction, CookieOptions } from 'express';
import { UserService } from '../services/user.service.js';
import { RegisterUserInputDTO, RegisterUserOutputDTO, LoginUserInputDTO, LoginUserOutputDTO, refreshSessionOutputDTO, getProfileUserOutputDTO } from '../dtos/user.dto.js'

export class UserController {

    constructor(private userService: UserService) { }

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data: RegisterUserInputDTO = req.body;
            const user: RegisterUserOutputDTO = await this.userService.register(data);

            res.status(201).json({
                message: `Se registró exitosamente la cuenta (${user.id}) de ${user.firstName} ${user.lastName} usando ${user.email}.`
            })
        } catch (error: any) {
            next(error);
        }
    }

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data: LoginUserInputDTO = req.body;
            const tokenObtained: LoginUserOutputDTO = await this.userService.loginUser(data);

            // Configuración estricta de seguridad para las cookies
            const cookieOptions: CookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Solo permitirá HTTPS en producción
                sameSite: 'strict' as const
            };

            // Inyección de Access Token (15 minutos)
            res.cookie('accessToken', tokenObtained.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });

            // Inyección de RefreshToken (7 días)
            res.cookie('refreshToken', tokenObtained.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

            res.status(200).json({
                message: 'Login exitoso',
                user: tokenObtained.user
            });
        } catch (error) {
            next(error)
        }
    }

    refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const oldRefreshToken = req.cookies?.refreshToken;

            const { newAccessToken, newRefreshToken }: refreshSessionOutputDTO = await this.userService.refreshSession(oldRefreshToken)

            const cookieOptions: CookieOptions = {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Solo permitirá HTTPS en producción
                sameSite: 'strict' as const
            };

            // Inyección de Access Token (15 minutos)
            res.cookie('accessToken', newAccessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });

            // Inyección de RefreshToken (7 días)
            res.cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

            res.status(200).json({
                message: 'Sesión renovada exitosamente'
            });
        } catch (error) {
            next(error);
        }
    }

    me = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.user!.userId;

            const userProfile: getProfileUserOutputDTO = await this.userService.getProfile(userId);

            res.status(201).json({
                message: `Perfil recuperado con éxito`,
                data: userProfile
            })
        } catch (error) {
            next(error);
        }
    }
}