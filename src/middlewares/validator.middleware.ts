import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ValidationError } from '../utils/appError.util.js';

export const validateRequest = (req: Request, _res: Response, next: NextFunction): void => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) { // Si hay errores de formato
    let arrErrores = errors.array().map(err => err.msg);
    throw new ValidationError(arrErrores[0], 400);
  }

  next(); // Si todo está bien, pasar al Controlador
};