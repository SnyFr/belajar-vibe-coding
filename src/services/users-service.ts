import { eq } from 'drizzle-orm';
import { getDb } from '../db';
import { sessions, users } from '../db/schema';

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

export interface LoginUserInput {
  email: string;
  password: string;
}

export class InvalidCredentialsError extends Error {
  constructor() {
    super('Email atau password salah!');
    this.name = 'InvalidCredentialsError';
  }
}

/**
 * Authenticates a user by email and password, creates a UUID session token, and returns it.
 */
export async function loginUser(input: LoginUserInput): Promise<string> {
  const db = getDb();

  const [user] = await db
    .select({ id: users.id, password: users.password })
    .from(users)
    .where(eq(users.email, input.email))
    .limit(1);

  if (!user) {
    throw new InvalidCredentialsError();
  }

  const isValid = await Bun.password.verify(input.password, user.password);
  if (!isValid) {
    throw new InvalidCredentialsError();
  }

  const token = crypto.randomUUID();
  await db.insert(sessions).values({
    token,
    userId: user.id,
  });

  return token;
}

