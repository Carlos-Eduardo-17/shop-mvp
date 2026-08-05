import { Request, Response, NextFunction, CookieOptions } from 'express';
import { UserService } from '../services/user.service.js';
import { RegisterUserInputDTO, RegisterUserOutputDTO, LoginUserInputDTO, LoginUserOutputDTO, refreshSessionOutputDTO, getProfileUserOutputDTO } from '../dtos/user.dto.js'

// Backend (Render) y frontend (Vercel) viven en dominios distintos, así que las
// cookies deben viajar cross-site. Eso exige sameSite: 'none' + secure: true en
// producción. En local (mismo host:puerto distinto de Vite) usamos 'lax'.
const getCookieOptions = (): CookieOptions => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
});

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
            const tokenObtained: LoginUserOutputDTO = await this.userService.login(data);

            // Configuración de seguridad para las cookies (ver getCookieOptions arriba)
            const cookieOptions: CookieOptions = getCookieOptions();

            // Inyección de Access Token (15 minutos)
            res.cookie('accessToken', tokenObtained.accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });

            // Inyección de RefreshToken (7 días)
            res.cookie('refreshToken', tokenObtained.refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

            res.status(200).json({
                message: 'Login exitoso',
                data: tokenObtained.user
            });
        } catch (error) {
            next(error)
        }
    }

    refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const oldRefreshToken = req.cookies?.refreshToken;

            const { newAccessToken, newRefreshToken }: refreshSessionOutputDTO = await this.userService.refreshSession(oldRefreshToken)

            const cookieOptions: CookieOptions = getCookieOptions();

            // Inyección de Access Token (15 minutos)
            res.cookie('accessToken', newAccessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });

            // Inyección de RefreshToken (7 días)
            res.cookie('refreshToken', newRefreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

            res.status(200).json({
                message: 'Sesión renovada exitosamente'
            });
        } catch (error) {
            // El refresh falló (refreshToken inválido, revocado o expirado):
            // no tiene sentido dejar esa cookie en el navegador esperando a
            // que expire sola a los 7 días. Se limpia igual que en logout,
            // con las mismas opciones con las que fue creada.
            const cookieOptions: CookieOptions = getCookieOptions();
            res.clearCookie('accessToken', cookieOptions);
            res.clearCookie('refreshToken', cookieOptions);

            next(error);
        }
    }

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.user!.userId;

            // Limpiar la DB del servidor
            await this.userService.logout(userId);

            // Deben tener las mismas opciones con las que fueron creadas
            const cookieOptions: CookieOptions = getCookieOptions();

            // Limpiar las cookies del navegador
            res.clearCookie('accessToken', cookieOptions);
            res.clearCookie('refreshToken', cookieOptions);

            res.status(200).json({
                message: "Sesión finalizada correctamente."
            });
        } catch (error) {
            next(error);
        }
    }

    me = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId: string = req.user!.userId;

            const userProfile: getProfileUserOutputDTO = await this.userService.getProfile(userId);

            res.status(200).json({
                message: `Perfil recuperado con éxito`,
                data: userProfile
            })
        } catch (error) {
            next(error);
        }
    }
}