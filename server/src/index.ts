import { httpServer } from "./http";
import { initWebSocket } from "./websocket/server";
import dotenv from "dotenv";
import { buildRunnerImage } from "./execution/exec.service";

dotenv.config();

// create one httpServer from express app

const start = async () => {
  // init Socket.io (attaches to httpServer internally)
  await buildRunnerImage();
  await initWebSocket();

  const PORT = process.env.PORT || 3000;

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
