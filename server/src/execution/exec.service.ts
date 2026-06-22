import { execFile } from "child_process";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { promisify } from "util";

const execFileAsync = promisify(execFile);

interface RunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

// Docker image — node + python + g++ + bash all in one
const DOCKER_IMAGE = "colab-runner";

// build the runner image once on startup
export const buildRunnerImage = async () => {
  const dockerfile = `
FROM ubuntu:22.04
RUN apt-get update && apt-get install -y \\
    nodejs npm python3 python3-pip g++ bash \\
    --no-install-recommends && rm -rf /var/lib/apt/lists/*
RUN npm install -g typescript ts-node
WORKDIR /code
`;
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "colab-docker-"));
  fs.writeFileSync(path.join(tmpDir, "Dockerfile"), dockerfile);

  try {
    console.log("Building Docker runner image...");
    await execFileAsync("docker", ["build", "-t", DOCKER_IMAGE, tmpDir]);
    console.log("Docker runner image ready");
  } catch (err) {
    console.error("Failed to build Docker image:", err);
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
};

export const runCode = async (
  code: string,
  language: string,
  fileName: string,
): Promise<RunResult> => {
  // write code to temp file
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "colab-run-"));
  const safeFileName = sanitizeFileName(fileName);
  const filePath = path.join(tmpDir, safeFileName);
  fs.writeFileSync(filePath, code);

  const cmd = getRunCommand(language, safeFileName);
  if (!cmd) {
    fs.rmSync(tmpDir, { recursive: true });
    return {
      stdout: "",
      stderr: `Unsupported language: ${language}`,
      exitCode: 1,
    };
  }

  try {
    const { stdout, stderr } = await execFileAsync(
      "docker",
      [
        "run",
        "--rm",
        "--network",
        "none",
        "--memory",
        "128m",
        "--cpus",
        "0.5",
        "--volume",
        `${tmpDir}:/code`,
        "--workdir",
        "/code",
        DOCKER_IMAGE,
        "bash",
        "-c",
        cmd,
      ],
      { timeout: 10000 },
    );
    return { stdout, stderr, exitCode: 0 };
  } catch (err: any) {
    return {
      stdout: err.stdout || "",
      stderr: err.stderr || err.message || "Execution failed",
      exitCode: err.code || 1,
    };
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
};

function sanitizeFileName(fileName: string): string {
  const baseName = path.basename(fileName || "main.txt");
  const safeName = baseName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return safeName || "main.txt";
}

function getRunCommand(language: string, fileName: string): string | null {
  switch (language) {
    case "javascript":
      return `node ${fileName}`;
    case "typescript":
      return `npx ts-node ${fileName}`;
    case "python":
      return `python3 ${fileName}`;
    case "cpp":
      return `g++ -o out ${fileName} && ./out`;
    case "c":
      return `gcc -o out ${fileName} && ./out`;
    case "bash":
      return `bash ${fileName}`;
    default:
      return null;
  }
}
