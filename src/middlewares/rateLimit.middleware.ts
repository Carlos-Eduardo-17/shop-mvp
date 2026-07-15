import rateLimit, { RateLimitRequestHandler } from "express-rate-limit";
import { getPeruTime } from "../utils/time.util.js";

/*
Límite de peticiones por periodo de tiempo (predeterminado: 60sec, 20req)

- Flujo:
  1. Cliente manda una solicitud a las 3:00:00pm y falla. Entonces desde las 3:00:00 comienzan a contar los 60 segundos restantes.
  2. Cliente puede mandar 19 solicitudes restantes hasta las 3:01:00pm.
  3. Si Cliente manda más de 20 solicitudes antes de las 3:01:00pm, el sistema le indicará "Has excedido el límite de 20 peticiones. Espera hasta las 3:01:00pm para intentar nuevamente". (aunque en la práctica sería hasta las 3:01:01pm)
*/

export function limitRequests(seconds: number = 60, requests: number = 20): RateLimitRequestHandler {
    return rateLimit({
        windowMs: seconds * 1000,
        max: requests,
        handler: (_req, res) => {
            res.status(429).json({
                error: `Has excedido el límite de ${requests.toString()} peticiones. Espera hasta el ${getPeruTime(seconds)} para intentar nuevamente.`
            });
        }
    });
}