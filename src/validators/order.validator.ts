import { body, checkExact } from 'express-validator';

export const createOrderRules = [checkExact([

    body('shippingAddress')
        .notEmpty().withMessage('CAMPO REQUERIDO: La dirección de envío es obligatoria').trim()
        .isString().withMessage('La dirección de envío debe ser un texto.')
        .isLength({ min: 8, max: 128 }).withMessage('La dirección de envío debe tener entre 8 y 128 caracteres.'),

], { message: 'Solo se permite ingresar: shippingAddress.' })];