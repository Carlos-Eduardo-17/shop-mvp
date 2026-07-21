import { JwtPayload } from 'jsonwebtoken';

declare global {
    namespace Express {
        interface Request {
            // Inyectamos el usuario con los datos que guardaste en el payload del token
            user?: {
                userId: string;
                role: string;
            };
        }
    }
}