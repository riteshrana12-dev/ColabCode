export interface RoomJoinPayload {
  roomId: string;
  userName: string;
  color: string;
}

export interface YjsUpdatePayload {
  roomId: string;
  fileId: string;
  update: Uint8Array;
}

export interface CursorUpdatePayload {
  roomId: string;
  fileId: string;
  cursor: { line: number; column: number };
}

export interface FileCreatedPayload {
  roomId: string;
  file: { id: string; name: string; roomId: string };
}

export interface FileDeletedPayload {
  roomId: string;
  fileId: string;
}

export interface FileRenamedPayload {
  roomId: string;
  fileId: string;
  name: string;
}

export interface RtcOfferPayload {
  roomId: string;
  targetSocketId: string;
  offer: any;
}

export interface RtcAnswerPayload {
  targetSocketId: string;
  answer: any;
}

export interface RtcCandidatePayload {
  targetSocketId: string;
  candidate: any;
}

export interface TerminalStartPayload {
  roomId: string;
  terminalId: string;
}

export interface TerminalInputPayload {
  terminalId: string;
  data: string;
}

export interface TerminalResizePayload {
  terminalId: string;
  cols: number;
  rows: number;
}

export interface ExecRunPayload {
  code: string;
  language: string;
  fileName: string;
}
