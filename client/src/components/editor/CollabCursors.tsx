import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

interface CursorUser {
  userId: string;
  name: string;
  color: string;
  lineNumber?: number;
  column?: number;
}

interface Props {
  socket: Socket | null;
  currentUserId: string;
}

export default function CollabCursors({ socket, currentUserId }: Props) {
  const [cursors, setCursors] = useState<Record<string, CursorUser>>({});

  useEffect(() => {
    if (!socket) return;

    socket.on("cursor:update", ({ userId, cursor }) => {
      if (userId === currentUserId) return;
      setCursors((prev) => ({
        ...prev,
        [userId]: { ...cursor?.user, ...cursor?.cursor },
      }));
    });

    socket.on("presence:left", ({ userId }) => {
      setCursors((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    });

    return () => {
      socket.off("cursor:update");
      socket.off("presence:left");
    };
  }, [socket, currentUserId]);

  // render avatar row — actual cursor decorations are handled by MonacoBinding
  return (
    <div className="flex items-center gap-1">
      {Object.values(cursors).map((cursor) => (
        <div
          key={cursor.userId}
          className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium text-white"
          style={{ backgroundColor: cursor.color }}
          title={cursor.name}
        >
          {cursor.name?.[0]?.toUpperCase()}
        </div>
      ))}
    </div>
  );
}
