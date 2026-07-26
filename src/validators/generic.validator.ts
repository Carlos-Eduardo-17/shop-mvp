import { checkExact } from 'express-validator';

export const cleaningRules = [checkExact([

], { message: 'No se requieren campos' })];