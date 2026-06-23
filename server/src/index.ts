import { httpServer } from "./http";
import { initWebSocket } from "./websocket/init";
import dotenv from "dotenv";
import { buildRunnerImage } from "./execution/exec.service";
import { setupSocketHandlers } from "./websocket/server";

dotenv.config();

const start = async () => {
  await buildRunnerImage();
  const io = await initWebSocket();
  setupSocketHandlers(io);

  const PORT = process.env.PORT || 3000;

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
