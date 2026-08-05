import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            // Inyecta el usuario con los datos que guardados en el payload del token
            user?: {
                userId: string;
            };
        }
    }
}