import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction): void => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) { // Si hay errores de formato
    res.status(400).json({
      error: 'Error de validación',
      messages: errors.array().map(err => err.msg)
    });
    return;
  }

  next(); // Si todo está bien, pasar al Controlador
};