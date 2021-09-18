import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../models/User';

interface Request {
  email: string;
  password: string;
}
interface Response {
  user: User;
  token: string;
}

class AutenticateUserService {
  public async execute({ email, password }: Request): Promise<Response> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('email/password incorrect');
    }

    // compara um senha criptografada com uma senha nao cripotografada
    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error('email/password incorrect');
    }

    const token = sign({}, '310ef3cd02145aa4a63eda99be84a9ef', {
      subject: user.id,
      expiresIn: '1d',
    });

    return {
      user,
      token,
    };
  }
}

export default AutenticateUserService;
