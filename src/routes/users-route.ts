import { Elysia, t } from 'elysia';
import {
  EmailAlreadyExistsError,
  getCurrentUser,
  InvalidCredentialsError,
  loginUser,
  registerUser,
  UnauthorizedError,
} from '../services/users-service';

export const usersRoute = new Elysia({ prefix: '/api/users' })
  .post(
    '/',
    async ({ body, set }) => {
      try {
        await registerUser(body);
        set.status = 201;
        return { data: 'OK' };
      } catch (error) {
        if (error instanceof EmailAlreadyExistsError) {
          set.status = 409;
          return { error: error.message };
        }
        throw error;
      }
    },
    {
      body: t.Object({
        name: t.String({ minLength: 1 }),
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 6 }),
      }),
    },
  )
  .post(
    '/login',
    async ({ body, set }) => {
      try {
        const token = await loginUser(body);
        set.status = 200;
        return { data: token };
      } catch (error) {
        if (error instanceof InvalidCredentialsError) {
          set.status = 401;
          return { Error: error.message };
        }
        throw error;
      }
    },
    {
      body: t.Object({
        email: t.String({ format: 'email' }),
        password: t.String({ minLength: 1 }),
      }),
    },
  )
  .get('/current', async ({ headers, set }) => {
    const authHeader = headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401;
      return { Error: 'Unauthorized' };
    }

    const token = authHeader.slice('Bearer '.length).trim();
    if (!token) {
      set.status = 401;
      return { Error: 'Unauthorized' };
    }

    try {
      const user = await getCurrentUser(token);
      set.status = 200;
      return { data: user };
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        set.status = 401;
        return { Error: error.message };
      }
      throw error;
    }
  });

