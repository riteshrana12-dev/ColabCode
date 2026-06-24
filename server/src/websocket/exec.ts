import { runCode } from "../execution/exec.service";
import { Socket } from "socket.io";
import { ExecRunPayload } from "./types/type";

export async function handleExecRun(socket: Socket, payload: ExecRunPayload) {
  socket.emit("exec:start");
  const result = await runCode(
    payload.code,
    payload.language,
    payload.fileName,
  );
  if (result.stdout) socket.emit("exec:stdout", result.stdout);
  if (result.stderr) socket.emit("exec:stderr", result.stderr);
  socket.emit("exec:exit", result.exitCode);
}
