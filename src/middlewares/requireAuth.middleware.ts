import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.util.js";
import jwt from 'jsonwebtoken';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {

    const accessToken = req.cookies?.accessToken;
    if (!accessToken) { throw new AppError("No está autenticado, inicie sesión", 401); }

    let payloadDecode: { userId: string };
    try {
        payloadDecode = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string) as { userId: string };
    } catch {
        // Token corrupto, con firma inválida o expirado: siempre es un problema de autenticación (401), no un "Bad Request" genérico.
        throw new AppError("Sesión inválida o expirada. Inicie sesión nuevamente.", 401);
    }

    req.user = payloadDecode;

    next();
}