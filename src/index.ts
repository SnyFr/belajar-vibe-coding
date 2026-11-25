import { Elysia } from 'elysia';
import { healthRoutes } from './routes/health';
import { usersRoute } from './routes/users-route';

const port = Number(process.env.PORT ?? 3000);

export const app = new Elysia()
  .get('/', () => ({
    message: 'ElysiaJS + Drizzle + PostgreSQL API is running',
  }))
  .use(healthRoutes)
  .use(usersRoute)
  .listen(port);

console.log(`Server running at http://localhost:${app.server?.port}`);
