import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import { useFileStore } from "../../store/fileStore";
import { TabBtn } from "./TabBtn";
import type { FileNode } from "../../types";

interface Props {
  socket: Socket | null;
  activeFileName: string;
  activeFileId: string;
}

export default function OutputPanel({
  socket,
  activeFileName,
  activeFileId,
}: Props) {
  const [tab, setTab] = useState<"output" | "preview">("output");
  const [output, setOutput] = useState<
    { type: "stdout" | "stderr" | "info"; text: string }[]
  >([]);
  const [running, setRunning] = useState(false);
  const [previewHtml, setPreviewHtml] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);
  const isHtml = activeFileName.endsWith(".html");
  const { tree } = useFileStore();

    // ── Socket listeners ───────────────────────────────
  useEffect(() => {
    if (!socket) return;

    socket.on("exec:start", () => {
      setRunning(true);
      setOutput([]);
    });

    // Stream chunks instead of replacing
    socket.on("exec:stdout", (chunk: string) => {
      setOutput((prev) => [...prev, { type: "stdout", text: chunk }]);
    });

    socket.on("exec:stderr", (chunk: string) => {
      setOutput((prev) => [...prev, { type: "stderr", text: chunk }]);
    });

    socket.on("exec:exit", (exitCode: number) => {
      setRunning(false);
      setOutput((prev) => [
        ...prev,
        { type: "info", text: `Process exited with code ${exitCode}` },
      ]);
    });

    return () => {
      socket.off("exec:start");
      socket.off("exec:stdout");
      socket.off("exec:stderr");
      socket.off("exec:exit");
    };
  }, [socket]);

   // Auto-scroll output
  useEffect(() => {
    if (outputRef.current)
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [output]);

  const requestPreviewContent = () => {
    if (!isHtml || !activeFileId) {
      setPreviewHtml("");
      return;
    }

    window.dispatchEvent(
      new CustomEvent("editor:get-content", {
        detail: {
          fileId: activeFileId,
          fileName: activeFileName,
          onContent: (content: string) => {
            setPreviewHtml(buildInlinedHtml(content, activeFileId, tree));
          },
        },
      }),
    );
  };