export interface User {
  id: string;
  name: string;
  email: string;
  verified: boolean;
}

export interface Room {
  id: string;
  name: string;
  inviteCode: string;
  creatorId: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface FileNode {
  id: string;
  name: string;
  type: "file" | "folder";
  content?: string;
  language: string;
  parentId: string | null;
  roomId: string;
  children: FileNode[];
}

export interface Tab {
  id: string;
  name: string;
  language: string;
}

export interface Room {
  id: string; // unique identifier
  name: string; // room name
  inviteCode: string; // code used to join the room
  creatorId: string; // user who created the room
  createdAt: string; // timestamp of creation
}
