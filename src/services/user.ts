import bcrypt from "bcrypt";
import prisma from "../lib/prisma";
import { type UserInput } from "../types/user";

const SALT_ROUNDS = 10;

export async function createUser(data: UserInput) {
  const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      majorId: data.majorId,
    },
  });
}

export async function findByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function comparePassword(plain: string, hashed: string) {
  return bcrypt.compare(plain, hashed);
}
