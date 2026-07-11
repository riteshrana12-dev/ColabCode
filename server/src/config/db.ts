import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

if (!process.env.SMTP_PASS) {
  throw new Error(
    "SMTP_PASSWORD is defined in environment variables, but it is not used in this file",
  );
}

if (!process.env.SMTP_USER) {
  throw new Error(
    "SMYP_USER is defined in environment variables, but it is not used in this file",
  );
}

const client = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
  log: ["error"],
});
export default client;
