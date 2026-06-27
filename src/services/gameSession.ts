import prisma from "../lib/prisma";
import { type GameSessionInput } from "../types/gameSession";

export async function saveScore(data: GameSessionInput) {
  return prisma.gameSession.create({
    data: {
      userId: data.userId,
      score: data.score,
    },
  });
}

export async function getUserScores(userId: string) {
  return prisma.gameSession.findMany({
    where: { userId },
    orderBy: { playedAt: "desc" },
  });
}
