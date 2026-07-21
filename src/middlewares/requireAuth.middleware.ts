import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.util.js";
import jwt from 'jsonwebtoken';

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {

    const accessToken = req.cookies?.accessToken;
    if (!accessToken) { throw new AppError("No está autenticado, inicie sesión", 401); }

    let payloadDecode = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET as string) as { userId: string, role: string };
    if (!payloadDecode) { throw new AppError("Acceso no autorizado", 401); }

    req.user = payloadDecode;

    next();
}