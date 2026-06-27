import { type Request, type Response, type NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    userId?: string;
    userName?: string;
    userEmail?: string;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.userId) {
    res
      .status(401)
      .json({ error: "Acesso não autorizado. Faça login para continuar." });
    return;
  }
  next();
}

export function attachUser(req: Request, res: Response, next: NextFunction) {
  if (req.session?.userId) {
    res.locals.user = {
      id: req.session.userId,
      name: req.session.userName,
      email: req.session.userEmail,
      isLoggedIn: true,
    };
  } else {
    res.locals.user = { isLoggedIn: false };
  }
  next();
}
