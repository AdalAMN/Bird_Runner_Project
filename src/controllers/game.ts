import { type Request, type Response } from "express";
import * as gameSessionService from "../services/gameSession";

const saveScore = async (req: Request, res: Response) => {
  try {
    const { score } = req.body;
    const userId = req.session?.userId;

    if (!userId) {
      res.status(401).json({ error: "Usuário não autenticado" });
      return;
    }

    if (score === undefined || score === null) {
      res.status(400).json({ error: "Score é obrigatório" });
      return;
    }

    const gameSession = await gameSessionService.saveScore({ userId, score });

    res.status(201).json({
      message: "Score salvo com sucesso",
      gameSession,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar score" });
  }
};

export default { saveScore };
