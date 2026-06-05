import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in environment variables");
}

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error(
    "GOOGLE_CLIENT_ID is defined in environment variables, but it is not used in this file",
  );
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error(
    "GOOGLE_CLIENT_SECRET is defined in environment variables, but it is not used in this file",
  );
}

if (!process.env.REFRESH_TOKEN_G) {
  throw new Error(
    "REFRESH_TOKEN_SECRET is defined in environment variables, but it is not used in this file",
  );
}

if (!process.env.GOOGLE_USER) {
  throw new Error(
    "GOOGLE_USER is defined in environment variables, but it is not used in this file",
  );
}

const client = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
  log: ["error"],
});
export default client;
