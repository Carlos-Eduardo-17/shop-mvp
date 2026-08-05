import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.util.js";
import jwt from 'jsonwebtoken';

export const requireAuth = (req: Request, _res: Response, next: NextFunction): void => {

    const accessToken = req.cookies?.accessToken;
    if (!accessToken) { throw new AppError("No está autenticado, inicie sesión", 401); }

    // Crea un objeto para almacenar la información decodificada del token JWT. Se espera que contenga al menos el userId.
    let payloadDecode: { userId: string };
    try {
        // Verifica y decodifica el token JWT usando la clave secreta definida en las variables de entorno.
        payloadDecode = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string) as { userId: string };
    } catch {
        // Token corrupto, con firma inválida o expirado: siempre es un problema de autenticación (401), no un "Bad Request" genérico.
        throw new AppError("Sesión inválida o expirada. Inicie sesión nuevamente.", 401);
    }

    // Agrega la información del usuario decodificada al objeto de solicitud para que esté disponible en los controladores posteriores.
    req.user = payloadDecode;

    next();
}