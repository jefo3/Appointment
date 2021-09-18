import { Router } from 'express';
import AutenticateUserService from '../services/AutenticateUserService';

const sessionsRouter = Router();

sessionsRouter.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;

    const autenticateUser = new AutenticateUserService();

    const { user, token } = await autenticateUser.execute({
      email,
      password,
    });

    delete user.password;

    return response.json({ user, token });
  } catch (err: any) {
    return response.status(400).json({ error: err.message });
  }
});

export default sessionsRouter;
