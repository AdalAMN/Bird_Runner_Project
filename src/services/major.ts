import prisma from "../lib/prisma";
import { type MajorInput, type MajorUpdate } from "../types/major";

export async function getAll() {
  return prisma.major.findMany();
}

export async function getById(id: string) {
  return prisma.major.findUnique({ where: { id } });
}

export async function create(data: MajorInput) {
  return prisma.major.create({ data });
}

export async function update(id: string, data: MajorUpdate) {
  return prisma.major.update({ where: { id }, data });
}

export async function remove(id: string) {
  return prisma.major.delete({ where: { id } });
}
