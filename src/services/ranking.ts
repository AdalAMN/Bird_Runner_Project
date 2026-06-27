import prisma from "../lib/prisma";

export async function getTop10() {
  const topScores = await prisma.gameSession.groupBy({
    by: ["userId"],
    _max: { score: true },
    orderBy: { _max: { score: "desc" } },
    take: 10,
  });

  const rankings = await Promise.all(
    topScores.map(async (entry) => {
      const user = await prisma.user.findUnique({
        where: { id: entry.userId },
        select: { name: true, email: true },
      });

      return {
        userId: entry.userId,
        userName: user?.name || "Desconhecido",
        email: user?.email || "",
        highestScore: entry._max.score || 0,
      };
    }),
  );

  return rankings;
}
