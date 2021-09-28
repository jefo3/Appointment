import { Router } from 'express';
import multer from 'multer';

import CreateUserService from '../services/CreateUserService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '../config/upload';
import UpdateAvatarUserService from '../services/UpdateAvatarUserService';

const usersRouter = Router();
const upload = multer(uploadConfig);

interface User {
  name: string;
  email: string;
  password?: string;
}

usersRouter.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;
    const createUser = new CreateUserService();

    const user: User = await createUser.execute({
      name,
      email,
      password,
    });

    delete user.password;

    return response.json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    try {
      const updateAvatarUser = new UpdateAvatarUserService();

      const user = await updateAvatarUser.execute({
        user_id: request.user.id,
        avatarFilename: request.file.filename,
      });

      delete user.password;

      return response.json(user);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
);

export default usersRouter;
