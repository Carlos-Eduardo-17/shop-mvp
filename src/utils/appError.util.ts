// Usado para manejar errores de validación en los servicios
export class AppError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = "ServiceError";

        // Mantiene el stack trace limpio
        Error.captureStackTrace(this, this.constructor);
    }
}

// Usado para errores de validación en los  validadores de express-validator
export class ValidationError extends Error {
    public readonly statusCode: number;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.name = "ValidationError";

        // Mantiene el stack trace limpio
        Error.captureStackTrace(this, this.constructor);
    }
}