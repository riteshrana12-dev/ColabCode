import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import authRouter from "./routes/auth.route";

const app = express();

// Security middleware
app.use(helmet());
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL,
// Credential: true;
//   }),
// );

// Parsing middlware
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);

export default app;
