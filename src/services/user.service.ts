/*
Servicios de user
- Lógica de negocio y validaciones de negocio
- throw new Error (...) para violaciones de reglas de negocio
- Sin try/catch, los errores suben al Controller
- Decide qué información será retornada para el Cliente
Tipos de return
- 
*/
import { RegisterUserInputDTO, RegisterUserOutputDTO, LoginUserInputDTO, LoginUserOutputDTO, refreshSessionOutputDTO, getProfileUserOutputDTO } from '../dtos/user.dto.js'
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

        if (!user) { throw new AppError("Cuenta no registrada", 401); }
        if (!await compareWords(data.password, user.passwordHashed)) { throw new AppError("Credenciales inválidas", 401); }

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

    async refreshSession(oldRefreshToken: string): Promise<refreshSessionOutputDTO> {

        // Verificar criptográficamente el token actual, si falla lanzará error
        jwt.verify(oldRefreshToken, process.env.JWT_REFRESH_SECRET as string);

        // Buscar al user por el token, si no retorna user es porque el token es inventado, viejo o ya fue revocado
        const existingUser: User | null = await this.userRepository.findByRefreshToken(oldRefreshToken);
        if (!existingUser) { throw new AppError("Sesión inválida o token revocado. Inicie sesión nuevamente.", 401) }

        const newAccessToken = jwt.sign(
            { userId: existingUser.id, role: existingUser.role },
            process.env.JWT_ACCESS_SECRET as string,
            { expiresIn: '15m' }
        );
        const newRefreshToken = jwt.sign(
            { userId: existingUser.id },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: '7d' }
        );

        // Si falla, Prisma lanzará su excepción
        await this.userRepository.updateRefreshToken(existingUser.id, newRefreshToken);

        return { newAccessToken, newRefreshToken }
    }

    async logOut(userId: string): Promise<boolean> {
        if (!await this.userRepository.clearRefreshToken(userId)) { throw new AppError("Usuario no encontrado, actualice la página", 404) }
        return true;
    };

    async getProfile(id: string): Promise<getProfileUserOutputDTO> {

        let data = await this.userRepository.find(id);
        if (!data) { throw new AppError("Perfil de usuario no encontrado", 404) };

        return { email: data.email, firstName: data.firstName, lastName: data.lastName };
    }
}

