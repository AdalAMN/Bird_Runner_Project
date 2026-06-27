import morgan from "morgan";
import fs from "fs";
import path from "path";
import validateEnv from "../utils/validateEnv";

type LogType = "simple" | "complete";

function logger(type: LogType) {
  const env = validateEnv();
  const logsPath = env.LOGS_PATH;

  if (type === "simple") {
    return morgan(":date[iso] :url :method");
  }

  const logStream = fs.createWriteStream(path.resolve(logsPath), {
    flags: "a",
  });

  return morgan(":date[iso] :url :method :http-version :user-agent", {
    stream: logStream,
  });
}

export default logger;
