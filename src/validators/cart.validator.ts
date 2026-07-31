import { body, checkExact } from 'express-validator';

export const addItemRules = [checkExact([

    body('productId')
        .notEmpty().withMessage('CAMPO REQUERIDO: El productId es obligatorio').trim()
        .isInt({ min: 1 }).withMessage('El productId debe ser un número entero positivo')
        .toInt(),

    body('quantity')
        .notEmpty().withMessage('CAMPO REQUERIDO: La cantidad es obligatoria').trim()
        .isInt({ min: 1, max: 5 }).withMessage('La cantidad debe ser un número entero entre 1 y 5')
        .toInt(),

], { message: 'Solo se permite ingresar: productId y quantity.' })];
/*
export const removeItemRules = [checkExact([

    body('cartItemId')
        .notEmpty().withMessage('CAMPO REQUERIDO: El cartItemId es obligatorio').trim()
        .isInt({ min: 1 }).withMessage('El cartItemId debe ser un número entero positivo')
        .toInt(),

], { message: 'Solo se permite ingresar: cartItemId.' })];*/