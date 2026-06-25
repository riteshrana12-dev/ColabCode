import { useEffect, useRef, useCallback } from "react";
import * as Y from "yjs";
import { MonacoBinding } from "y-monaco";
import { Awareness } from "y-protocols/awareness";
import * as monaco from "monaco-editor";
import { Socket } from "socket.io-client";

interface UseCollabEditorProps {
  socket: Socket | null;
  roomId: string;
  fileId: string; // one Yjs doc per file
  userId: string;
  userName: string;
  userColor: string;
}

interface UseCollabEditorReturn {
  bindEditor: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  destroy: () => void;
}

export function useCollabEditor({
  socket,
  roomId,
  fileId,
  userId,
  userName,
  userColor,
}: UseCollabEditorProps): UseCollabEditorReturn {
  // one Yjs doc per file — keyed by fileId
  const ydocRef = useRef<Y.Doc | null>(null);
  const awarenessRef = useRef<Awareness | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  // bind a Monaco editor instance to the Yjs doc
  const bindEditor = useCallback(
    (editor: monaco.editor.IStandaloneCodeEditor) => {
      if (!socket) return;

      editorRef.current = editor;

      // create a fresh Yjs doc for this file
      const ydoc = new Y.Doc();
      ydocRef.current = ydoc;

      // the shared text type — think of this as the collaborative string
      const ytext = ydoc.getText("content");

      // awareness tracks cursors, user colors, names
      const awareness = new Awareness(ydoc);
      awarenessRef.current = awareness;

      // set this user's awareness state (their cursor color + name)
      awareness.setLocalStateField("user", {
        userId,
        name: userName,
        color: userColor,
      });

      // ── SEND updates to server ──────────────────────────
      ydoc.on("update", (update: Uint8Array, origin: unknown) => {
        // origin === "remote" means this update came FROM the server
        // don't send it back — that causes infinite loops
        if (origin === "remote") return;

        socket.emit("yjs:update", {
          roomId,
          fileId,
          update: Array.from(update), // Uint8Array → plain array for JSON
        });
      });

      // awareness changes (cursor moves) → send to server
      awareness.on("update", () => {
        const state = awareness.getLocalState();
        socket.emit("cursor:update", { roomId, fileId, cursor: state });
      });

      // right before the socket.on("yjs:update") line
      socket.off("yjs:update");
      socket.off("yjs:sync-request");
      socket.off("yjs:sync-response");
      // ── RECEIVE updates from server ─────────────────────
      socket.on("yjs:update", ({ fileId: fid, update }) => {
        if (fid !== fileId) return; // ignore updates for other files
        Y.applyUpdate(ydoc, new Uint8Array(update), "remote");
      });

      // ── LATE JOIN: request full doc state ──────────────
      // ask existing clients for the current doc state
      socket.emit("yjs:sync-request", { roomId, fileId });

      socket.on("yjs:sync-request", ({ socketId, fileId: fid }) => {
        if (fid !== fileId) return;
        // someone joined late — send them our full doc state
        const state = Array.from(Y.encodeStateAsUpdate(ydoc));
        socket.emit("yjs:sync-response", {
          targetSocketId: socketId,
          fileId,
          state,
        });
      });

      socket.on("yjs:sync-response", ({ fileId: fid, state }) => {
        if (fid !== fileId) return;
        // apply the full state we received
        Y.applyUpdate(ydoc, new Uint8Array(state), "remote");
      });

      // ── BIND Yjs text to Monaco model ──────────────────
      const model = editor.getModel();
      if (!model) return;

      // MonacoBinding keeps the Monaco model and Yjs text in sync
      const binding = new MonacoBinding(
        ytext,
        model,
        new Set([editor]),
        awareness,
      );
      bindingRef.current = binding;
    },
    [socket, roomId, fileId, userId, userName, userColor],
  );

  // cleanup when switching files or unmounting
  const destroy = useCallback(() => {
    bindingRef.current?.destroy();
    awarenessRef.current?.destroy();
    ydocRef.current?.destroy();

    if (socket) {
      socket.off("yjs:update");
      socket.off("yjs:sync-request");
      socket.off("yjs:sync-response");
    }

    bindingRef.current = null;
    awarenessRef.current = null;
    ydocRef.current = null;
  }, [socket]);

  // destroy on unmount
  useEffect(() => {
    return () => destroy();
  }, [destroy]);

  return { bindEditor, destroy };
}
