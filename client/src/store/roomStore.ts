import { create } from "zustand";
import type { Room } from "../types/index";

interface RoomState {
  createdRooms: Room[];
  joinedRooms: Room[];
  currentRoom: Room | null;
  setRooms: (created: Room[], joined: Room[]) => void;
  setCurrentRoom: (room: Room | null) => void;
  addCreatedRoom: (room: Room) => void;
  removeRoom: (roomId: string) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  createdRooms: [],
  joinedRooms: [],
  currentRoom: null,

  setRooms: (createdRooms, joinedRooms) => set({ createdRooms, joinedRooms }),
  setCurrentRoom: (currentRoom) => set({ currentRoom }),
  addCreatedRoom: (room) =>
    set((state) => ({ createdRooms: [...state.createdRooms, room] })),
  removeRoom: (roomId) =>
    set((state) => ({
      createdRooms: state.createdRooms.filter((r) => r.id !== roomId),
      joinedRooms: state.joinedRooms.filter((r) => r.id !== roomId),
    })),
}));
