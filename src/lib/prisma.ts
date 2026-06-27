import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const mysqlUrl = new URL(process.env.DATABASE_URL!);

const adapter = new PrismaMariaDb({
  host: mysqlUrl.hostname,
  user: mysqlUrl.username,
  password: mysqlUrl.password,
  database: mysqlUrl.pathname.slice(1),
  port: Number(mysqlUrl.port),
});

const prisma = new PrismaClient({ adapter });

export default prisma;
