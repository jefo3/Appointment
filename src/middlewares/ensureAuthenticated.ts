import { Response, Request, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';
import AppError from '../errors/AppError';

interface TokenPayload {
  iat: number;
  exp: number;
  sub: string;
}

export default function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  // validação do token JWT
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token JWT is missing', 401);
  }

  const [bearer, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, authConfig.jwt.secret);

    // as tokenPayload força o decoded a ser do tipo tokenPaload
    const { sub } = decoded as TokenPayload;

    request.user = {
      id: sub,
    };

    return next();
  } catch (err) {
    throw new AppError('token JWT invalid ', 401);
  }
}
