import { type Request, type Response } from "express";
import * as rankingService from "../services/ranking";

const getRanking = async (_req: Request, res: Response) => {
  try {
    const rankings = await rankingService.getTop10();

    res.render("ranking", {
      title: "Ranking",
      headerTitle: "Ranking dos Jogadores",
      rankings,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar ranking" });
  }
};

export default { getRanking };
