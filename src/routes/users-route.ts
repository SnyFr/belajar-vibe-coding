import { Elysia, t } from 'elysia';
import { EmailAlreadyExistsError, registerUser } from '../services/users-service';

export const usersRoute = new Elysia({ prefix: '/api/users' }).post(
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
);

