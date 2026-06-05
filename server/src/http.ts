import { createServer } from "http";
import app from "./app";

export const httpServer = createServer(app);
