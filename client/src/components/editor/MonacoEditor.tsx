import { useRef, useEffect } from "react";
import type { OnMount } from "@monaco-editor/react";
import Editor from "@monaco-editor/react";
import { Socket } from "socket.io-client";
import { useCollabEditor } from "../../hooks/useCollabEditor";
import { useFileStore } from "../../store/fileStore";

interface Props {
  socket: Socket | null;
  roomId: string;
  fileId: string;
  fileName: string;
  language: string;
  userId: string;
  userName: string;
  userColor: string;
  onOpenLinkedFile?: (pathOrName: string) => boolean;
}

function getLanguage(fileName: string): string {
  const ext = fileName.split(".").pop();
  const map: Record<string, string> = {
    ts: "typescript",
    tsx: "typescript",
    js: "javascript",
    jsx: "javascript",
    py: "python",
    cpp: "cpp",
    c: "c",
    json: "json",
    md: "markdown",
    css: "css",
    html: "html",
  };
  return map[ext || ""] || "plaintext";
}

export default function MonacoEditor({
  socket,
  roomId,
  fileId,
  fileName,
  userId,
  userName,
  userColor,
  onOpenLinkedFile,
}: Props) {
  const { bindEditor, destroy } = useCollabEditor({
    socket,
    roomId,
    fileId,
    userId,
    userName,
    userColor,
  });

  const prevFileId = useRef<string | null>(null);
  const execHandlerRef = useRef<((e: Event) => void) | null>(null);
  const contentRequestHandlerRef = useRef<((e: Event) => void) | null>(null);
  const mouseHandlerRef = useRef<{ dispose: () => void } | null>(null);

  const handleMount: OnMount = (editor) => {
    if (prevFileId.current && prevFileId.current !== fileId) {
      destroy();
    }
    prevFileId.current = fileId;
    bindEditor(editor);
    editor.onDidChangeModelContent(() => {
      const content = editor.getValue();
      useFileStore.getState().updateNodeContent(fileId, content);
      window.dispatchEvent(
        new CustomEvent("editor:content-changed", {
          detail: { fileId, fileName, content },
        }),
      );
    });

    mouseHandlerRef.current = editor.onMouseDown((event) => {
      if (!event.event.ctrlKey && !event.event.metaKey) return;
      const lineNumber = event.target.position?.lineNumber;
      if (!lineNumber) return;

      const line = editor.getModel()?.getLineContent(lineNumber) ?? "";
      const linkPatterns = [
        /\b(?:href|src)=["']([^"']+)["']/gi,
        /\bimport\s+.*?\s+from\s+["']([^"']+)["']/gi,
        /\bimport\s+["']([^"']+)["']/gi,
      ];

      for (const pattern of linkPatterns) {
        let match: RegExpExecArray | null;
        while ((match = pattern.exec(line))) {
          const target = match[1];
          if (
            target &&
            !target.startsWith("http") &&
            !target.startsWith("#") &&
            onOpenLinkedFile?.(target)
          ) {
            event.event.preventDefault();
            return;
          }
        }
      }
    });

    // define handler once and store in ref
    execHandlerRef.current = (e: Event) => {
      const { fileName: reqFile } = (e as CustomEvent).detail;
      if (reqFile !== fileName) return;

      const code = editor.getValue();
      const language = getLanguage(fileName);

      socket?.emit("exec:run", { code, language, fileName });
    };

    window.addEventListener("exec:get-content", execHandlerRef.current);

    contentRequestHandlerRef.current = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        fileId?: string;
        fileName?: string;
        onContent?: (content: string) => void;
      };
      if (detail.fileId !== fileId && detail.fileName !== fileName) return;
      detail.onContent?.(editor.getValue());
    };

    window.addEventListener(
      "editor:get-content",
      contentRequestHandlerRef.current,
    );
  };

  useEffect(() => {
    return () => {
      destroy();
      mouseHandlerRef.current?.dispose();
      if (execHandlerRef.current) {
        window.removeEventListener("exec:get-content", execHandlerRef.current);
      }
      if (contentRequestHandlerRef.current) {
        window.removeEventListener(
          "editor:get-content",
          contentRequestHandlerRef.current,
        );
      }
    };
  }, [destroy]);

  return (
    <Editor
      key={fileId}
      path={`room-${roomId}/${fileId}/${fileName}`}
      height="100%"
      theme="vs-dark"
      language={getLanguage(fileName)}
      onMount={handleMount}
      options={{
        fontSize: 14,
        fontFamily: "JetBrains Mono, Fira Code, monospace",
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        renderLineHighlight: "all",
        cursorBlinking: "smooth",
        smoothScrolling: true,
        padding: { top: 16 },
      }}
    />
  );
}
