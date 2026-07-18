/*
Servicios de user
- Lógica de negocio y validaciones de negocio
- throw new Error (...) para violaciones de reglas de negocio
- Sin try/catch, los errores suben al Controller
- Decide qué información será retornada para el Cliente
Tipos de return
- 
*/
import { RegisterUserInputDTO, RegisterUserOutputDTO, LoginUserInputDTO, LoginUserOutputDTO } from '../dtos/user.dto.js'
import { User } from '@prisma/client'; // Importa los tipos del cliente de Prisma
import { UserRepository } from '../repositories/user.repository.js';
import { hashWord, compareWords } from '../utils/hash.util.js';
import { AppError } from '../utils/appError.util.js';
import jwt from 'jsonwebtoken';

export class UserService {

    // TypeScript moderno: al usar 'private', se declara y asigna automáticamente
    constructor(private userRepository: UserRepository) { }

    async register(data: RegisterUserInputDTO): Promise<RegisterUserOutputDTO> {

        if (await this.userRepository.findByEmail(data.email)) { throw new AppError("Email usado por otra cuenta", 409); }

        const { password, ...userData } = data;
        const passwordHashed: string = await hashWord(password);

        const user: User = await this.userRepository.create({ ...userData, passwordHashed });
        return { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName }
    }

    async loginUser(data: LoginUserInputDTO): Promise<LoginUserOutputDTO> {

        const user = await this.userRepository.findByEmail(data.email);

        if (!user) { throw new AppError("Cuenta no registrada", 500); }
        if (!await compareWords(data.password, user.passwordHashed)) { throw new AppError("Credenciales inválidas", 500); }

        //Generando tokens
        const accessToken = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: '15m' }
        );
        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: '7d' }
        );

        // Persistir RefreshToken en la DB para futuras renovaciones
        await this.userRepository.saveRefreshToken(user.id, refreshToken);

        // Retornar valores que se almacenarán en
        return { accessToken, refreshToken, user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName } }

    }
}

