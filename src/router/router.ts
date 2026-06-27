import { Router } from "express";

import mainController from "../controllers/main";
import majorController from "../controllers/major";
import authController from "../controllers/auth";
import gameController from "../controllers/game";
import rankingController from "../controllers/ranking";
import logger from "../middlewares/logger";
import { requireAuth } from "../middlewares/auth";

const router = Router();

router.use(logger("complete"));

router.get("/", requireAuth, mainController.index);
router.get("/about", mainController.about);
router.get("/bem-vindo/:nome/:sobrenome", mainController.bemVindo);
router.get("/lorem/:paragraphs", mainController.loremIpsum);
router.get("/hb1", mainController.hb1);
router.get("/hb2", mainController.hb2);
router.get("/hb3", mainController.hb3);
router.get("/hb4", mainController.hb4);

router.get("/majors", majorController.getAll);
router.get("/majors/:id", majorController.getById);
router.post("/majors", majorController.create);
router.put("/majors/:id", majorController.update);
router.delete("/majors/:id", majorController.remove);

router.get("/login", authController.showLogin);
router.post("/login", authController.login);
router.get("/register", authController.showRegister);
router.post("/register", authController.register);
router.get("/logout", authController.logout);
router.post("/game/score", requireAuth, gameController.saveScore);
router.get("/ranking", requireAuth, rankingController.getRanking);

export default router;
