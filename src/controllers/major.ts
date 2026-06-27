import { type Request, type Response } from "express";
import * as majorService from "../services/major";

const getAll = async (_req: Request, res: Response) => {
  try {
    const majors = await majorService.getAll();
    res.json(majors);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar majors" });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const major = await majorService.getById(id);
    if (!major) {
      res.status(404).json({ error: "Major não encontrado" });
      return;
    }
    res.json(major);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar major" });
  }
};

const create = async (req: Request, res: Response) => {
  try {
    const { code, name, description } = req.body;
    const major = await majorService.create({ code, name, description });
    res.status(201).json(major);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar major" });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { code, name, description } = req.body;
    const major = await majorService.update(id, { code, name, description });
    res.json(major);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar major" });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await majorService.remove(id);
    res.json({ message: "Major deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar major" });
  }
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
