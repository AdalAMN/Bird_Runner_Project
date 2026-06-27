import { type Request, type Response } from "express";
import { LoremIpsum } from "lorem-ipsum";

const lorem = new LoremIpsum({
  sentencesPerParagraph: {
    max: 8,
    min: 4,
  },
  wordsPerSentence: {
    max: 16,
    min: 4,
  },
});

type Prof = {
  nome: string;
  sala: number;
};

const index = (_req: Request, res: Response) => {
  res.render("game/play", {
    title: "Flappy Bird",
    headerTitle: "Jogo",
  });
};

const about = (_req: Request, res: Response) => {
  res.render("about", {
    title: "Sobre",
    headerTitle: "Sobre o Jogo",
  });
};

const bemVindo = (req: Request, res: Response) => {
  const { nome, sobrenome } = req.params;
  res.send(`<h1>Bem-vindo, ${nome} ${sobrenome}!</h1>`);
};

const loremIpsum = (req: Request, res: Response) => {
  const paragraphs = Number(req.params.paragraphs);

  if (!Number.isInteger(paragraphs) || paragraphs <= 0) {
    res
      .status(400)
      .send(
        "<p>O parametro paragraphs deve ser um número inteiro positivo.</p>",
      );
    return;
  }

  const text = Array.from({ length: paragraphs }, () =>
    lorem.generateParagraphs(1),
  );

  const html = text.map((p) => `<p>${p}</p>`).join("\n");

  res.send(`<section>\n${html}\n</section>`);
};

const hb1 = (_req: Request, res: Response) => {
  res.render("main/hb1", {
    title: "HB1",
    headerTitle: "Página HB1",
    message: "Universidade Federal do Amazonas",
  });
};

const hb2 = (_req: Request, res: Response) => {
  res.render("main/hb2", {
    title: "HB2",
    headerTitle: "Página HB2",
    message: "Bem-vindo à página HB2",
    ehBemVindo: true,
  });
};

const hb3 = (_req: Request, res: Response) => {
  const profs: Prof[] = [
    { nome: "Edleno Moura", sala: 123 },
    { nome: "Eduardo Feitosa", sala: 456 },
    { nome: "Elaine Harada", sala: 789 },
  ];

  res.render("main/hb3", {
    title: "HB3",
    headerTitle: "Lista de professores",
    profs,
  });
};

const technologies = [
  { name: "Express", type: "Framework", poweredByNodejs: true },
  { name: "Laravel", type: "Framework", poweredByNodejs: false },
  { name: "React", type: "Library", poweredByNodejs: true },
  { name: "Handlebars", type: "Engine View", poweredByNodejs: true },
  { name: "Django", type: "Framework", poweredByNodejs: false },
  { name: "Docker", type: "Virtualization", poweredByNodejs: false },
  { name: "Sequelize", type: "ORM tool", poweredByNodejs: true },
];

const hb4 = (_req: Request, res: Response) => {
  res.render("main/hb4", {
    title: "HB4",
    headerTitle: "Tecnologias powered by Node.js",
    technologies,
  });
};

export default {
  index,
  about,
  bemVindo,
  loremIpsum,
  hb1,
  hb2,
  hb3,
  hb4,
};
