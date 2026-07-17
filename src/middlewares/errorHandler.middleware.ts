import type { NextFunction, Request, Response } from "express";
//throw new Error("ServiceError\nEmail usado por otra cuenta.\nuser.service.ts").stack;

export function errorHandler(error: any, req: Request, res: Response, next: NextFunction): void {

    console.log(`\n\n---------------------------`);
    console.log(`------| ERRROR PURO |------`);
    console.log(`---------------------------`);
    console.log((error));
    console.log(`---------------------------\n`);
    console.log("name: ", error.name);
    console.log("message: ", error.message);
    console.log("stack: ", error.stack);
    console.log("statusCode: ", error.statusCode);
    console.log("status: ", error.status);
    console.log("type: ", error.type);
    console.log("body: ", error.body);
    console.log("expose: ", error.expose);
    console.log("clientVersion: ", error.clientVersion);
    console.log(`---------------------------\n\n`);

    switch (error.name) {
        case "ServiceError":
            res.status(error.statusCode).json({
                status: `${process.env.ENVIRONMENT === 'development' ? 'Error de Servicio' : 'Error'}`,
                message: `${error.message}`,
                details: `${process.env.ENVIRONMENT === 'development' ? error.stack : '-'}`,
            });
            break;
        case "SyntaxError":
        case "PrismaClientValidationError":
            res.status(error.statusCode || 400).json({
                status: `${process.env.ENVIRONMENT === 'development' ? 'Error de Sintaxis o de Prisma' : 'Error'}`,
                message: `Asegúrese de enviar correctamente solo lo necesario.`,
                details: `${process.env.ENVIRONMENT === 'development' ? error.stack : '-'}`,
            });
            break;

        default:
            res.status(error.statusCode || 400).json({
                status: `${process.env.ENVIRONMENT === 'development' ? 'Error desconocido, leer stack y console().' : 'Error'}`,
                message: `Error inesperado.`,
                details: `${process.env.ENVIRONMENT === 'development' ? error.stack : '-'}`,
            });
            break;
    }
}