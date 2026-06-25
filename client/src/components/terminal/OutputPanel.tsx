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
