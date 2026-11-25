import { eq } from 'drizzle-orm';
import { getDb } from '../db';
import { users } from '../db/schema';

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
}

export class EmailAlreadyExistsError extends Error {
  constructor() {
    super('Email sudah terdaftar!');
    this.name = 'EmailAlreadyExistsError';
  }
}

/**
 * Registers a new user after checking email uniqueness and hashing the password with bcrypt.
 */
export async function registerUser(input: RegisterUserInput): Promise<void> {
  const db = getDb();

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (existing.length > 0) {
    throw new EmailAlreadyExistsError();
  }

  const hashedPassword = await Bun.password.hash(input.password, {
    algorithm: 'bcrypt',
    cost: 10,
  });

  await db.insert(users).values({
    name: input.name,
    email: input.email,
    password: hashedPassword,
  });
}

