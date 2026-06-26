import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import { useRoomStore } from "../store/roomStore";
import type { Room } from "../types/index";
import useAuth from "../hooks/useAuth";
import RoomCard from "../components/dashboard/RoomCard";
import EmptyState from "../components/dashboard/EmptyState";
import Modal from "../components/dashboard/Modal";
import FormField from "../components/dashboard/FormField";
import DashboardBackdrop from "../components/ui/DashboardBackdrop";
import LogoMark from "../components/icon/LogoMark";
import PlusIcon from "../components/dashboard/ui/PlusIcon";
import SubmitButton from "../components/dashboard/SubmitButton";
import SkeletonCard from "../components/dashboard/ui/SkeletonCard";
import SectionLabel from "../components/dashboard/SectionLabel";
import ErrorBanner from "../components/ui/ErrorBanner";

export default function Dashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const { createdRooms, joinedRooms, setRooms, addCreatedRoom, removeRoom } =
    useRoomStore();

  const [loading, setLoading] = useState(true);
  const [createModal, setCreateModal] = useState(false);
  const [joinModal, setJoinModal] = useState(false);
  const [renameModal, setRenameModal] = useState<Room | null>(null);
  const [roomName, setRoomName] = useState("");
  const [newRoomName, setNewRoomName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  const fetchRooms = async () => {
    try {
      const res = await api.get("/room/my-rooms");
      setRooms(res.data.createdRooms, res.data.joinedRooms);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to join room");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRooms();
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/room/create", { roomName });
      addCreatedRoom(res.data.room);
      setCreateModal(false);
      setRoomName("");
      navigate(`/room/${res.data.roomId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create room");
    }
  };

  const handleJoinRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/room/join", { inviteCode });
      setJoinModal(false);
      setInviteCode("");
      navigate(`/room/${res.data.roomId}`);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to join room");
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm("Delete this room? This cannot be undone.")) return;
    try {
      await api.post("/room/delete", { roomId });
      removeRoom(roomId);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to join room");
    }
  };

  const handleLeaveRoom = async (roomId: string) => {
    if (!confirm("Leave this room?")) return;
    try {
      await api.post("/room/leave", { roomId });
      removeRoom(roomId);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to join room");
    }
  };

  const handleRenameRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameModal) return;
    setError("");
    try {
      await api.post("/room/rename", {
        roomId: renameModal.id,
        newName: newRoomName,
      });
      setRooms(
        createdRooms.map((r) =>
          r.id === renameModal.id ? { ...r, name: newRoomName } : r,
        ),
        joinedRooms,
      );
      setRenameModal(null);
      setNewRoomName("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to rename room");
    }
  };

  const copyInviteCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    try {
      const res = await api.post("/auth/delete-account", {
        withCredentials: true,
      });
      ErrorBanner(res.data.message);
      navigate("/");
    } catch (err) {
      console.error("Failed to delete account:", err);
    }
  };

  const totalRooms = createdRooms.length + joinedRooms.length;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <DashboardBackdrop />

      {/* Header — matches Landing nav */}
      <header className="relative z-20 mx-auto mt-4 flex h-14 w-[min(1180px,calc(100%-32px))] items-center justify-between rounded-2xl border border-white/15 bg-[#060b16]/40 px-4 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <Link to="/" className="flex items-center gap-3">
          <LogoMark />
          <span className="text-sm font-semibold tracking-wide">
            CollabCode
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 sm:flex">
            <div className="grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-white/[0.06] text-xs font-black text-slate-300">
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <span className="text-xs font-medium text-slate-400">
              {user?.name}
            </span>
          </div>
          {/* Settings dropdown */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-xl p-2 text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              {/* Settings gear icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="2 1 24 24"
                stroke="currentColor"
                strokeWidth={0.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM19.4 15a1.65 1.65 0 01.33 1.82l-1.1 1.9a1.65 1.65 0 01-2.13.67 7.01 7.01 0 01-2.03-.83 7.01 7.01 0 01-2.03.83 1.65 1.65 0 01-2.13-.67l-1.1-1.9a1.65 1.65 0 01.33-1.82 7.01 7.01 0 010-2.03 1.65 1.65 0 01-.33-1.82l1.1-1.9a1.65 1.65 0 012.13-.67 7.01 7.01 0 012.03.83 7.01 7.01 0 012.03-.83 1.65 1.65 0 012.13.67l1.1 1.9a1.65 1.65 0 01-.33 1.82 7.01 7.01 0 010 2.03z"
                />
              </svg>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-32 rounded-xl border border-white/10 bg-[#060b16]/90 shadow-lg backdrop-blur-xl overflow-hidden">
                <button
                  onClick={handleLogout}
                  className="w-full px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white "
                >
                  Sign out
                </button>
                <button
                  onClick={handleDeleteAccount}
                  className="w-full px-3 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-white/10   hover:text-white "
                >
                  Delete Account
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-[min(1180px,calc(100%-32px))] py-12">
        {/* Title + actions */}
        <div className="mb-9 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-300">
              Your rooms
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-white sm:text-4xl">
              {totalRooms === 0
                ? "Start your first room"
                : `${totalRooms} room${totalRooms === 1 ? "" : "s"} in motion`}
            </h1>
          </div>
          <div className="flex gap-2.5">
            <button
              onClick={() => {
                setJoinModal(true);
                setError("");
              }}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-5 text-sm font-bold text-slate-200 backdrop-blur transition-colors hover:bg-white/[0.08]"
            >
              Join with code
            </button>
            <button
              onClick={() => {
                setCreateModal(true);
                setError("");
              }}
              className="landing-glow-button inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-sky-300 px-5 text-sm font-black text-[#03111f] shadow-[0_0_40px_rgba(56,189,248,0.3)] transition-transform hover:-translate-y-0.5"
            >
              <PlusIcon />
              New room
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : totalRooms === 0 ? (
          <EmptyState
            onCreate={() => setCreateModal(true)}
            onJoin={() => setJoinModal(true)}
          />
        ) : (
          <div className="space-y-10">
            {createdRooms.length > 0 && (
              <section>
                <SectionLabel label="Created by you" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {createdRooms.filter(Boolean).map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      isOwner
                      copied={copied}
                      onEnter={() => navigate(`/room/${room.id}`)}
                      onCopy={() => copyInviteCode(room.inviteCode)}
                      onDelete={() => handleDeleteRoom(room.id)}
                      onRename={() => {
                        setRenameModal(room);
                        setNewRoomName(room.name);
                        setError("");
                      }}
                      onLeave={() => {}}
                    />
                  ))}
                </div>
              </section>
            )}

            {joinedRooms.length > 0 && (
              <section>
                <SectionLabel label="Joined" />
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {joinedRooms.map((room) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      isOwner={false}
                      copied={copied}
                      onEnter={() => navigate(`/room/${room.id}`)}
                      onCopy={() => copyInviteCode(room.inviteCode)}
                      onDelete={() => {}}
                      onRename={() => {}}
                      onLeave={() => handleLeaveRoom(room.id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {createModal && (
        <Modal title="Create a new room" onClose={() => setCreateModal(false)}>
          <form onSubmit={handleCreateRoom} className="space-y-3.5">
            {error && <ErrorBanner message={error} />}
            <FormField
              label="Room name"
              value={roomName}
              onChange={setRoomName}
              placeholder="e.g. DSA Mock Interview"
              autoFocus
            />
            <SubmitButton label="Create room" />
          </form>
        </Modal>
      )}

      {joinModal && (
        <Modal title="Join a room" onClose={() => setJoinModal(false)}>
          <form onSubmit={handleJoinRoom} className="space-y-3.5">
            {error && <ErrorBanner message={error} />}
            <FormField
              label="Invite code"
              value={inviteCode}
              onChange={setInviteCode}
              placeholder="Paste the invite code"
              autoFocus
              mono
            />
            <SubmitButton label="Join room" />
          </form>
        </Modal>
      )}

      {renameModal && (
        <Modal title="Rename room" onClose={() => setRenameModal(null)}>
          <form onSubmit={handleRenameRoom} className="space-y-3.5">
            {error && <ErrorBanner message={error} />}
            <FormField
              label="New name"
              value={newRoomName}
              onChange={setNewRoomName}
              autoFocus
            />
            <SubmitButton label="Save" />
          </form>
        </Modal>
      )}
    </div>
  );
}
