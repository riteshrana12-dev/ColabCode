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

    // Build preview HTML only when this panel needs it.
  useEffect(() => {
    requestPreviewContent();

    const onEditorContentChanged = (event: Event) => {
      const detail = (event as CustomEvent).detail as {
        fileId: string;
        content: string;
      };
      if (tab === "preview" && detail.fileId === activeFileId) {
        setPreviewHtml(buildInlinedHtml(detail.content, activeFileId, tree));
      }
    };

    window.addEventListener("editor:content-changed", onEditorContentChanged);
    return () => {
      window.removeEventListener(
        "editor:content-changed",
        onEditorContentChanged,
      );
    };
  }, [activeFileId, activeFileName, isHtml, tab, tree]);

   // ── Language detection ─────────────────────────────
  const getLanguage = (name: string) => {
    const ext = name.split(".").pop()?.toLowerCase();
    const map: Record<string, string> = {
      js: "javascript",
      ts: "typescript",
      py: "python",
      cpp: "cpp",
      c: "c",
      sh: "bash",
      html: "html",
      css: "css",
      java: "java",
    };
    return map[ext || ""] || null;
  };

  const language = getLanguage(activeFileName);
  const canRun = !!language;

  const handleRun = () => {
    if (!socket || !canRun || running) return;
    window.dispatchEvent(
      new CustomEvent("exec:get-content", {
        detail: { fileName: activeFileName },
      }),
    );
  };

   // ── Render ─────────────────────────────────────────
  return (
    <div className="flex h-full flex-col bg-[#0d1117]">
      {/* Tabs + Controls */}
      <div className="flex h-8 shrink-0 items-center justify-between border-b border-white/[0.06] px-2">
        <div className="flex gap-0.5">
          <TabBtn
            active={tab === "output"}
            onClick={() => setTab("output")}
            label="Output"
          />
          {isHtml && (
            <TabBtn
              active={tab === "preview"}
              onClick={() => {
                setTab("preview");
                requestPreviewContent();
              }}
              label="Preview"
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          {output.length > 0 && (
            <button
              onClick={() => setOutput([])}
              className="text-[11px] text-slate-600 hover:text-slate-400 transition-colors"
            >
              Clear
            </button>
          )}
          {canRun && (
            <button
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-1.5 rounded-md bg-emerald-500/90 hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed px-2.5 py-1 text-[11px] font-semibold text-white transition-colors"
            >
              {running ? (
                <>
                  <span className="h-2.5 w-2.5 animate-spin rounded-full border border-white/30 border-t-white" />
                  Running
                </>
              ) : (
                <>
                  <span>▶</span>Run
                </>
              )}
            </button>
          )}
        </div>
      </div>