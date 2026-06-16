import * as pty from "node-pty";
import * as os from "os";

interface PtySession {
  pty: pty.IPty;
  userId: string;
  roomId: string;
  terminalId: string;
}

const sessions = new Map<string, PtySession>();

const sessionKey = (userId: string, terminalId: string) =>
  `${userId}:${terminalId}`;

export const createPty = (
  userId: string,
  roomId: string,
  terminalId: string,
  cwd: string,
  onData: (data: string) => void,
): pty.IPty => {
  killPty(userId, terminalId);

  const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

  const ptyProcess = pty.spawn(shell, [], {
    name: "xterm-color",
    cols: 80,
    rows: 24,
    cwd,
    env: process.env as Record<string, string>,
  });

  ptyProcess.onData(onData);

  sessions.set(sessionKey(userId, terminalId), {
    pty: ptyProcess,
    userId,
    roomId,
    terminalId,
  });

  return ptyProcess;
};

export const writeToPty = (userId: string, terminalId: string, data: string) => {
  const session = sessions.get(sessionKey(userId, terminalId));
  if (session) session.pty.write(data);
};

export const resizePty = (
  userId: string,
  terminalId: string,
  cols: number,
  rows: number,
) => {
  const session = sessions.get(sessionKey(userId, terminalId));
  if (session) session.pty.resize(cols, rows);
};

export const killPty = (userId: string, terminalId: string) => {
  const key = sessionKey(userId, terminalId);
  const session = sessions.get(key);
  if (session) {
    session.pty.kill();
    sessions.delete(key);
  }
};

export const killUserPtys = (userId: string) => {
  for (const session of sessions.values()) {
    if (session.userId) killPty(userId, session.terminalId);
  }
};
