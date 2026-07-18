import { body, checkExact } from 'express-validator';

export const registerRules = [checkExact([

    body('email')
        .notEmpty().withMessage('CAMPO REQUERIDO: El correo electrónico es obligatorio').trim()
        .isEmail().withMessage('El correo electrónico debe contener @ y dominio').normalizeEmail({ gmail_remove_dots: false })
        .isLength({ max: 64 }).withMessage('El correo electrónico debe tener menos de 64 caracteres.'),

    body('password')
        .notEmpty().withMessage('CAMPO REQUERIDO: La contraseña es obligatoria').trim()
        .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial')
        .isString().withMessage('La contraseña debe ser un texto.')
        .isLength({ max: 32 }).withMessage('La contraseña debe tener menos de 32 caracteres.'),

    body('firstName')
        .notEmpty().withMessage('CAMPO REQUERIDO: El nombre es obligatorio').trim()
        .isString().withMessage('El nombre debe ser un texto.')
        .isLength({ max: 32 }).withMessage('El nombre debe tener menos de 32 caracteres.')
        .custom((value) => {
            const regex = /^[A-Za-zÀ-ÿ' -]+$/;
            if (!regex.test(value)) { throw new Error('El nombre no puede contener caracteres especiales ni espacios.'); }
            return true;
        }),

    body('lastName')
        .notEmpty().withMessage('CAMPO REQUERIDO: El apellido es obligatorio').trim()
        .isString().withMessage('El apellido debe ser un texto.')
        .isLength({ max: 32 }).withMessage('El apellido debe tener menos de 32 caracteres.')
        .custom((value) => {
            const regex = /^[A-Za-zÀ-ÿ' -]+$/;
            if (!regex.test(value)) { throw new Error('El apellido no puede contener caracteres especiales ni espacios.'); }
            return true;
        }),

], { message: 'Solo se permite ingresar: Correo electrónico, Contraseña, Nombre y Apellido.' })];

export const loginRules = [checkExact([

    body('email')
        .notEmpty().withMessage('CAMPO REQUERIDO: El correo electrónico es obligatorio').trim()
        .isEmail().withMessage('El correo electrónico debe contener @ y dominio').normalizeEmail({ gmail_remove_dots: false })
        .isLength({ max: 64 }).withMessage('El correo electrónico debe tener menos de 64 caracteres.'),

    body('password')
        .notEmpty().withMessage('CAMPO REQUERIDO: La contraseña es obligatoria').trim()
        .isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial')
        .isString().withMessage('La contraseña debe ser un texto.')
        .isLength({ max: 32 }).withMessage('La contraseña debe tener menos de 32 caracteres.')

], { message: 'Solo se permite ingresar: Correo electrónico y Contraseña.' })];