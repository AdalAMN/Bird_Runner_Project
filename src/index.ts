import express from "express";
import session from "express-session";
import { engine } from "express-handlebars";

import validateEnv from "./utils/validateEnv";
import router from "./router/router";
import helpers from "./views/helpers/helpers";
import { attachUser } from "./middlewares/auth";

const env = validateEnv();
const PORT = env.PORT;
const app = express();

app.engine(
  "handlebars",
  engine({
    defaultLayout: "main",
    layoutsDir: `${process.cwd()}/src/views/layouts`,
    helpers,
  }),
);
app.set("view engine", "handlebars");
app.set("views", `${process.cwd()}/src/views`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(attachUser);
app.use(router);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
