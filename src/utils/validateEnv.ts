import { cleanEnv, port, str } from "envalid";
import dotenv from "dotenv";

dotenv.config({ quiet: true });

function validateEnv() {
  return cleanEnv(process.env, {
    PORT: port({ default: 3467 }),
    NODE_ENV: str({ choices: ["development", "production"] }),
    DATABASE_URL: str(),
    LOGS_PATH: str({ default: "./access.log" }),
  });
}

export default validateEnv;
