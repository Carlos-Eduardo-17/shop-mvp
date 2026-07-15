/*
Servicios de user
- Lógica de negocio y validaciones de negocio
- throw new Error (...) para violaciones de reglas de negocio
- Sin try/catch, los errores suben al Controller
- Decide qué información será retornada para el Cliente
Tipos de return
- 
*/
import { RegisterUserInputDTO, RegisterUserOutputDTO } from '../dtos/user.dto.js'
import { User } from '@prisma/client'; // Importa los tipos del cliente de Prisma
import { UserRepository } from '../repositories/user.repository.js';
import { hashWord } from '../utils/hash.util.js';

export class UserService {

    // TypeScript moderno: al usar 'private', se declara y asigna automáticamente
    constructor(private userRepository: UserRepository) { }

    async register(data: RegisterUserInputDTO): Promise<RegisterUserOutputDTO> {

        if (await this.userRepository.findByEmail(data.email)) { throw new Error("ServiceError\nuser.service.ts\nEmail usado por otra cuenta."); }

        const { password, ...userData } = data;
        const passwordHashed: string = await hashWord(password);

        const user: User = await this.userRepository.create({ ...userData, passwordHashed });
        return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
    }
}