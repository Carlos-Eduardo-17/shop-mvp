import { param, checkExact } from 'express-validator';

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