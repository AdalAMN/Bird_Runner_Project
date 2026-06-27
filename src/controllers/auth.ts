import { type Request, type Response } from "express";
import * as userService from "../services/user";

const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, confirmPassword, majorId } = req.body;

    if (!name || !email || !password || !confirmPassword || !majorId) {
      res.status(400).json({ error: "Todos os campos são obrigatórios" });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({ error: "As senhas não coincidem" });
      return;
    }

    const existingUser = await userService.findByEmail(email);
    if (existingUser) {
      res.status(400).json({ error: "Email já cadastrado" });
      return;
    }

    const user = await userService.createUser({
      name,
      email,
      password,
      majorId,
    });

    res.status(201).json({
      message: "Usuário cadastrado com sucesso",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar usuário" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email e senha são obrigatórios" });
      return;
    }

    const user = await userService.findByEmail(email);
    if (!user) {
      res.status(401).json({ error: "Email ou senha inválidos" });
      return;
    }

    const passwordMatch = await userService.comparePassword(
      password,
      user.password,
    );
    if (!passwordMatch) {
      res.status(401).json({ error: "Email ou senha inválidos" });
      return;
    }

    req.session.userId = user.id;
    req.session.userName = user.name;
    req.session.userEmail = user.email;

    res.json({
      message: "Login realizado com sucesso",
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao realizar login" });
  }
};

const logout = (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: "Erro ao fazer logout" });
      return;
    }
    res.redirect("/login");
  });
};

const showLogin = (_req: Request, res: Response) => {
  res.render("auth/login", {
    title: "Login",
    headerTitle: "Entrar",
  });
};

const showRegister = (_req: Request, res: Response) => {
  res.render("auth/register", {
    title: "Cadastro",
    headerTitle: "Criar Conta",
  });
};

export default { register, login, logout, showLogin, showRegister };
