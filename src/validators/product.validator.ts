import { param, query, checkExact } from 'express-validator';

// NOTA: 
// - Usar isUUID() si Prisma generó ID como String/UUID
// - Usar isInt() si ID es numérico autoincremental.

/*
No se necesita crear una regla compleja para rechazar explícitamente el body; 
con validar firmemente el param('id') es más que suficiente para mantener la API segura
*/
export const getByIdRules = [checkExact([

    param('id')
        .notEmpty().withMessage('CAMPO REQUERIDO: El ID en la URL es obligatorio').trim()
        .isInt().withMessage('El ID debe ser numérico')

], { message: 'Solo se permite enviar el ID a través de la URL.' })];

/*
categoryId es opcional: sin él se listan todos los productos, con él se filtran por categoría.
*/
export const getProductsRules = [checkExact([

    query('categoryId')
        .optional().trim()
        .isInt({ min: 1 }).withMessage('El categoryId debe ser numérico')

], { message: 'Solo se permite enviar categoryId como query param.' })];