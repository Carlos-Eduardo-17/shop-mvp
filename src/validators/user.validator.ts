import { body } from 'express-validator';

export const registerRules = [
    body('email').notEmpty().withMessage('CAMPO REQUERIDO: El correo electrónico es obligatorio').trim()
        .isEmail().withMessage('El correo electrónico debe contener @ y dominio').normalizeEmail(),

    body('password').notEmpty().withMessage('CAMPO REQUERIDO: La contraseña es obligatoria').trim()
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })
        .withMessage('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial'),

    body('firstName').notEmpty().withMessage('CAMPO REQUERIDO: El nombre es obligatorio').trim(),

    body('lastName').notEmpty().withMessage('CAMPO REQUERIDO: El apellido es obligatorio').trim()
];