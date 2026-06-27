<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0ea5e9&height=200&section=header&text=ColabCode&fontSize=80&fontColor=ffffff&fontAlignY=35&desc=Real-time%20collaborative%20coding%20rooms&descAlignY=55&descSize=20&descColor=94a3b8&animation=fadeIn" width="100%"/>

<br/>

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)

<br/>

<a href="https://github.com/riteshrana12-dev/ColabCode/stargazers">
  <img src="https://img.shields.io/github/stars/riteshrana12-dev/ColabCode?style=social" />
</a>
&nbsp;
<a href="https://github.com/riteshrana12-dev/ColabCode/network/members">
  <img src="https://img.shields.io/github/forks/riteshrana12-dev/ColabCode?style=social" />
</a>

</div>

---

## What is ColabCode?

ColabCode is a real-time collaborative coding platform built for technical interviews, DSA practice, and pair programming. Two or more users share a live editor, file system, terminal, and video call — all in the browser, with zero setup.

---

## Demo

> 📽️ **[Watch the full demo →](https://youtu.be/PLACEHOLDER)**
>
> Two users. One room. Real-time sync, live video, shared file system, sandboxed code execution.

---

## Features

- ⚡ **Real-time collaborative editing** — Monaco editor synced via Yjs CRDT, isolated per file
- 👁️ **Live cursors** — see every collaborator's cursor position and color in real time
- 📁 **Shared file system** — create files and folders, visible instantly to everyone in the room
- 🖥️ **Room terminal** — real PTY shell via node-pty, synced workspace per user
- ▶️ **Sandboxed code execution** — JS, Python, C++, Bash run in isolated Docker containers (network disabled, memory/CPU capped)
- 🎥 **WebRTC video/audio** — peer-to-peer video call living beside the editor
- 🔐 **Auth with OTP verification** — email-based signup with JWT access/refresh token rotation
- 🏠 **Room management** — create rooms, share invite codes, manage members
- 💾 **Persistent state** — file content survives disconnects via Yjs snapshots in Postgres
- 📡 **Horizontally scalable WebSocket layer** — Socket.io with Redis pub/sub adapter

---

## Tech stack

| Layer | Technologies |
|---|---|
| **Client** | React 18, TypeScript, Tailwind CSS, Vite, Monaco Editor, Yjs + y-monaco, xterm.js, Zustand |
| **Server** | Node.js, Express, Socket.io, node-pty, Prisma ORM, Zod |
| **Database** | PostgreSQL, Redis (sessions + pub/sub + presence) |
| **Real-time** | Yjs CRDT, Socket.io Redis adapter, WebRTC (SDP/ICE signaling) |
| **Execution** | Docker (network-isolated, 128MB RAM cap, 0.5 CPU cap) |
| **Auth** | JWT access + refresh tokens, bcrypt, OTP email verification |

---

## Architecture

The client connects to a single Express + Socket.io server over WebSocket, authenticated at the handshake via JWT. Collaborative editing is handled by Yjs — each file has its own CRDT document that accumulates updates in memory and debounces saves to Postgres every 2 seconds, so late joiners always receive the full document state. Redis serves three roles: session storage, Socket.io pub/sub adapter (enabling horizontal scaling across multiple server instances), and room presence tracking via hash sets. Code execution spawns throwaway Docker containers with network access disabled and memory/CPU hard-capped, so user code is fully isolated from the host process. WebRTC video uses Socket.io as the signaling channel for SDP offer/answer and ICE candidate exchange, establishing direct peer-to-peer media streams.

```
Browser A                    Server                      Browser B
─────────────────────────────────────────────────────────────────
Monaco + Yjs  ──yjs:update──► relay ──yjs:update──►  Monaco + Yjs
              ◄──yjs:update──        ◄──yjs:update──
              
WebRTC        ──rtc:offer───► relay ──rtc:offer───►   WebRTC
              ◄──rtc:answer──        ◄──rtc:answer──
              (direct P2P media stream after handshake)

Terminal      ──terminal:input► PTY ──terminal:output►  xterm.js

Run button    ──exec:run──────► Docker container ──exec:stdout►  Output panel
                                (isolated, ephemeral)
```

---

## Local setup

### Prerequisites

- Node.js 20+
- PostgreSQL running locally
- Redis running locally (`redis-server`)
- Docker Desktop running (for code execution)
- pnpm or npm

### Clone and install

```bash
git clone https://github.com/riteshrana12-dev/ColabCode.git
cd ColabCode
```

### Server setup

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/colabcode
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_here
CLIENT_URL=http://localhost:5173

# Email (for OTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_gmail_app_password
```

```bash
npx prisma migrate dev
npm run dev
```

### Client setup

```bash
cd client
npm install
```

Create `client/.env`:

```env
VITE_API_URL=http://localhost:3000/api/v1
VITE_WS_URL=http://localhost:3000
VITE_ENABLE_EXECUTION=true
```

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Known limitations and what's next

| Limitation | Production path |
|---|---|
| Code execution requires Docker daemon — not available on standard PaaS hosting | Replace with Firecracker microVMs or a sandboxing API (Judge0) for production |
| WebRTC works on same network without TURN — NAT traversal needs coturn | Self-host coturn on a VPS or use Metered.ca managed TURN |
| Terminal is per-user, not shared — each user has their own PTY session | Shared terminal multiplexing (tmux-style) would require PTY broadcast |
| File content stored as text in Postgres — fine at demo scale | Object storage (S3/MinIO) for large files in production |
| No git integration | git clone/push/pull inside the terminal workspace |

---

## Connect

<a href="https://github.com/riteshrana12-dev">
  <img src="https://img.shields.io/badge/GitHub-riteshrana12--dev-181717?style=for-the-badge&logo=github&logoColor=white"/>
</a>
&nbsp;
<a href="https://www.linkedin.com/in/ritesh-rana12/">
  <img src="https://img.shields.io/badge/LinkedIn-Ritesh%20Rana-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white"/>
</a>

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0ea5e9&height=100&section=footer&animation=fadeIn" width="100%"/>

</div>
