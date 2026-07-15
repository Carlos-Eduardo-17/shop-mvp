import type { Request, Response, NextFunction } from "express";

export function errorHandler(error: any, _req: Request, res: Response, next: NextFunction): void {

    const strError = String(error)
    const lineas = strError.split('\n');
    const titulo = lineas[0];

    let linea1: string | undefined;
    let linea2: string | undefined;
    let linea3: string | undefined;

    switch (titulo) {
        case "PrismaClientValidationError: ":
            linea1 = lineas[1];
            linea2 = lineas[2];
            linea3 = lineas[lineas.length - 1];
            if (process.env.ENVIRONMENT === "development") {
                res.status(500).json({
                    error: `${titulo}`,
                    ubicacion: `${linea1} ${linea2}`,
                    detalle_solucion: `${linea3}`
                });
            } else {
                res.status(500).json({
                    status: "error",
                    message: `${linea3}`
                })
            }
            break;

        case "Error: ServiceError":
            linea1 = lineas[1];
            linea2 = lineas[lineas.length - 1];
            if (process.env.ENVIRONMENT === "development") {
                res.status(500).json({
                    error: `ServiceError`,
                    ubicacion: `${linea1}`,
                    detalle_solucion: `${linea2}`
                });
            } else {
                res.status(500).json({
                    status: "error",
                    message: `${linea2}`
                })
            }
            break;

        default:
            if (titulo != undefined) {
                let titulo2: string = titulo.slice(0, 11)

                switch (titulo2) {
                    case "SyntaxError":
                        if (process.env.ENVIRONMENT === "development") {
                            linea1 = lineas[1];
                            res.status(500).json({
                                error: `SyntaxError`,
                                ubicacion: `Data Entry (Request body)`,
                                detalle_solucion: `${titulo} ${linea1}`,
                            });
                        } else {
                            res.status(500).json({
                                status: "error",
                                message: `Error de sintaxis.`
                            })
                        }
                        break;
                }

            }

            console.log("No identificado → ", titulo)
            console.log(error)
    }
}