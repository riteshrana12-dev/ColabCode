<div align="center">

<img src="https://capsule-render.vercel.app/api?type=venom&color=0:0ea5e9,50:6366f1,100:8b5cf6&height=250&section=header&text=ColabCode&fontSize=90&fontColor=ffffff&fontAlignY=40&desc=⚡%20Real-time%20Collaborative%20IDE%20in%20the%20Browser&descAlignY=62&descSize=18&descColor=cbd5e1&animation=fadeIn&stroke=0ea5e9&strokeWidth=2" width="100%"/>

</div>

<div align="center">

<a href="https://colab-code-rho.vercel.app">
<img src="https://img.shields.io/badge/🚀%20Live%20Demo-colab--code--rho.vercel.app-0ea5e9?style=for-the-badge&labelColor=0f172a" />
</a>
&nbsp;
<a href="https://www.loom.com/share/e409676968064b2e8f8d2c2f965901ea">
<img src="https://img.shields.io/badge/🎬%20Demo%20Video-Watch%20on%20Loom-6366f1?style=for-the-badge&labelColor=0f172a" />
</a>
&nbsp;
<a href="https://github.com/riteshrana12-dev/ColabCode">
<img src="https://img.shields.io/badge/⭐%20Star%20this%20repo-GitHub-8b5cf6?style=for-the-badge&labelColor=0f172a" />
</a>

<br/><br/>

<img src="https://img.shields.io/github/stars/riteshrana12-dev/ColabCode?style=flat-square&color=0ea5e9&labelColor=0f172a&logo=github" />
<img src="https://img.shields.io/github/forks/riteshrana12-dev/ColabCode?style=flat-square&color=6366f1&labelColor=0f172a&logo=github" />
<img src="https://img.shields.io/github/last-commit/riteshrana12-dev/ColabCode?style=flat-square&color=8b5cf6&labelColor=0f172a&logo=github" />
<img src="https://img.shields.io/badge/license-MIT-22c55e?style=flat-square&labelColor=0f172a" />

</div>

<br/>

---

## ⚡ What is ColabCode?

> **ColabCode** is a production-grade real-time collaborative coding platform built for **technical interviews**, **DSA practice**, and **pair programming**. Two or more developers share a live Monaco editor, structured file system, real PTY terminal, sandboxed code execution, and peer-to-peer video call — all in the browser, with zero setup.

<br/>

<div align="center">

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│   Browser A            WebSocket + Redis           Browser B        │
│   ─────────            ────────────────            ─────────        │
│   Monaco+Yjs  ───────► Relay + CRDT sync ◄───────  Monaco+Yjs      │
│   WebRTC      ───────►   SDP / ICE relay ◄───────  WebRTC          │
│   Terminal    ───────►  PTY bash session  ────────► xterm.js        │
│   Run button  ───────►  Docker container  ────────► Output panel    │
│                          (isolated)                                  │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

</div>

<br/>

---

## 🎬 Demo

<div align="center">

[![Demo Video](https://img.shields.io/badge/▶%20Watch%20Full%20Demo%20(60s)-Loom-6366f1?style=for-the-badge&logo=loom&logoColor=white&labelColor=0f172a)](https://www.loom.com/share/e409676968064b2e8f8d2c2f965901ea)

*Two users · One room · Real-time sync · Live video · Shared files · Sandboxed execution*

</div>

<br/>

---

## ✨ Features

<div align="center">

| | Feature | Details |
|:---:|---|---|
| ⚡ | **Real-time collaborative editing** | Monaco editor synced via Yjs CRDT — per-file document isolation, zero merge conflicts |
| 👁️ | **Live cursors and presence** | Every user's cursor, name, and color broadcast in real time via Socket.io awareness |
| 📁 | **Shared file system** | Recursive folder tree (adjacency list in Postgres) — create/rename/delete synced instantly to all room members |
| 🖥️ | **Real PTY terminal** | node-pty spawns genuine bash sessions per user, relayed over WebSocket to xterm.js |
| ▶️ | **Sandboxed code execution** | Docker containers — network disabled, 128MB RAM cap, 0.5 CPU, 10s hard kill — JS · Python · C++ · Bash |
| 🎥 | **Peer-to-peer video/audio** | WebRTC with Socket.io signaling — SDP offer/answer and ICE candidate relay |
| 🔐 | **Auth with OTP verification** | JWT access + refresh token rotation, bcrypt hashing, email OTP via SMTP |
| 🏠 | **Room management** | Create rooms, share invite codes, manage members with owner vs member permissions |
| 💾 | **Persistent document state** | Yjs snapshots debounced to Postgres — late joiners and reconnects restore full document state |
| 📡 | **Horizontally scalable WS** | Socket.io Redis pub/sub adapter — multi-instance deployment without in-process state coupling |
| 🌐 | **HTML/CSS/JS live preview** | CSS and JS assets inlined from file tree into iframe — linked files just work |

</div>

<br/>

---

## 🏗️ Architecture

<div align="center">

```
┌───────────────────────────────────────────────────────────────────────┐
│                          CLIENT  (Vercel)                             │
│   React 18 · TypeScript · Tailwind · Vite · Zustand · React Router   │
│                                                                       │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ Monaco + Yjs │  │FileExplorer │  │ xterm.js │  │  VideoPanel │  │
│  │  y-monaco    │  │  Zustand    │  │  PTY ws  │  │  WebRTC P2P │  │
│  └──────┬───────┘  └──────┬──────┘  └────┬─────┘  └──────┬──────┘  │
└─────────┼─────────────────┼──────────────┼────────────────┼──────────┘
          │   HTTPS + WSS   │              │                │
┌─────────┼─────────────────┼──────────────┼────────────────┼──────────┐
│              NGINX  (SSL · Port 80/443 → 3000 · WS upgrade)          │
├─────────┼─────────────────┼──────────────┼────────────────┼──────────┤
│                      SERVER  (AWS EC2 · PM2)                         │
│            Express · Socket.io · node-pty · Prisma · Zod             │
│                                                                       │
│  ┌──────────┐  ┌─────────┐  ┌──────────┐  ┌────────┐  ┌─────────┐  │
│  │ Yjs sync │  │  Files  │  │ Terminal │  │  RTC   │  │  Exec   │  │
│  │ CRDT+DB  │  │  CRUD   │  │   PTY    │  │ Signal │  │ Docker  │  │
│  └──────────┘  └─────────┘  └──────────┘  └────────┘  └─────────┘  │
├───────────────────────────────────────────────────────────────────────┤
│                           DATA LAYER                                  │
│  PostgreSQL (users · rooms · files · sessions)                       │
│  Redis      (Socket.io pub/sub · presence hashes · sessions)         │
│  Docker     (network:none · mem:128MB · cpu:0.5 · ttl:10s)          │
└───────────────────────────────────────────────────────────────────────┘
```

</div>

The client connects over WSS to a Node.js/Socket.io server behind Nginx on EC2. Collaborative editing uses **Yjs CRDT** — each file has its own document that accumulates updates in memory and debounces saves to Postgres every 2 seconds, so late joiners always receive full document state. **Redis** serves three roles: Socket.io pub/sub adapter for horizontal scaling, session storage, and room presence via hash sets. Code execution spawns **throwaway Docker containers** with all network access disabled and memory/CPU hard-capped. **WebRTC** video uses Socket.io as the signaling channel, establishing direct peer-to-peer media streams after SDP/ICE exchange.

<br/>

---

## 🛠️ Tech Stack

<div align="center">

### 🎨 Client
![React](https://img.shields.io/badge/React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Monaco Editor](https://img.shields.io/badge/Monaco%20Editor-0078D4?style=for-the-badge&logo=visualstudiocode&logoColor=white)
![Yjs](https://img.shields.io/badge/Yjs%20CRDT-FF6B35?style=for-the-badge&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-433E38?style=for-the-badge&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io%20Client-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![xterm.js](https://img.shields.io/badge/xterm.js-000000?style=for-the-badge&logoColor=white)
![React Router](https://img.shields.io/badge/React%20Router%20v6-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### ⚙️ Server
![Node.js](https://img.shields.io/badge/Node.js%2020-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma%20ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![node-pty](https://img.shields.io/badge/node--pty-4EAA25?style=for-the-badge&logo=gnubash&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-3E67B1?style=for-the-badge&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-FF6B6B?style=for-the-badge&logoColor=white)
![Nodemailer](https://img.shields.io/badge/Nodemailer-22B573?style=for-the-badge&logoColor=white)

### 🗄️ Database and Infrastructure
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![AWS EC2](https://img.shields.io/badge/AWS%20EC2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white)
![PM2](https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white)
![Let's Encrypt](https://img.shields.io/badge/Let's%20Encrypt-003A70?style=for-the-badge&logo=letsencrypt&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

### 📡 Real-time and Protocols
![WebRTC](https://img.shields.io/badge/WebRTC-333333?style=for-the-badge&logo=webrtc&logoColor=white)
![WebSocket](https://img.shields.io/badge/WebSocket-010101?style=for-the-badge&logo=socketdotio&logoColor=white)
![Yjs](https://img.shields.io/badge/Yjs%20+%20y--monaco-FF6B35?style=for-the-badge&logoColor=white)

</div>

<br/>

---

## 🚀 Local Setup

### Prerequisites

```
Node.js 20+    PostgreSQL    Redis    Docker Desktop
```

### 1. Clone

```bash
git clone https://github.com/riteshrana12-dev/ColabCode.git
cd ColabCode
```

### 2. Server

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/colabcode
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_minimum_32_chars
CLIENT_URL=http://localhost:5173

# Email OTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your_gmail_app_password
```

```bash
npx prisma migrate dev
npm run dev
```

### 3. Client

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

Open **[http://localhost:5173](http://localhost:5173)** 🎉

<br/>

---

## 📁 Project Structure

```
ColabCode/
├── client/                          # React + Vite frontend
│   └── src/
│       ├── components/
│       │   ├── editor/              # Monaco + Yjs + cursors + tabs
│       │   ├── explorer/            # File tree + context menu
│       │   ├── terminal/            # xterm.js + output panel
│       │   └── video/               # WebRTC video grid (Google Meet style)
│       ├── hooks/                   # useCollabEditor · useWebRTC
│       ├── pages/                   # Landing · Login · Dashboard · Room
│       ├── services/                # axios instance + Socket.io client
│       └── store/                   # Zustand — editor · file · room · auth
│
└── server/                          # Node.js + Express backend
    └── src/
        ├── websocket/               # Socket.io modular handlers
        │   ├── init.ts              # Redis adapter + JWT middleware
        │   ├── presence.ts          # Room join/leave + Redis hashes
        │   ├── yjs.ts               # CRDT sync + debounced DB persistence
        │   ├── files.ts             # File tree broadcast
        │   ├── terminal.ts          # PTY lifecycle management
        │   ├── rtc.ts               # WebRTC SDP/ICE signaling
        │   └── exec.ts              # Docker sandbox execution
        ├── execution/               # Docker runner + image builder
        ├── terminal/                # node-pty session manager
        ├── services/                # workspace sync · access control
        └── prisma/                  # Schema + migrations
```

<br/>

---

## ⚠️ Known Limitations and Production Roadmap

| Current | Production path |
|---|---|
| Docker execution on EC2 — not available on standard PaaS | Firecracker microVMs or gVisor for true multi-tenant isolation |
| WebRTC STUN only — may fail on restricted NAT networks | Self-host coturn TURN server or Metered.ca managed TURN |
| Terminal is per-user PTY — not shared between room members | tmux-style PTY broadcast for shared terminal sessions |
| File content stored as text in Postgres | S3/MinIO object storage for large binary files |
| No version control integration | git clone/push/pull inside workspace terminal |
| Single EC2 instance | Horizontal scaling already wired via Redis adapter — add load balancer |

<br/>

---

## 🤝 Connect

<div align="center">

[![GitHub](https://img.shields.io/badge/GitHub-riteshrana12--dev-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/riteshrana12-dev)
&nbsp;&nbsp;
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Ritesh%20Rana-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/ritesh-rana12/)

<br/>

*If this project helped you or you found it interesting — drop a ⭐ Star, it means a lot!*

</div>

<br/>

<div align="center">
<img src="https://capsule-render.vercel.app/api?type=waving&color=0:8b5cf6,50:6366f1,100:0ea5e9&height=120&section=footer&animation=fadeIn" width="100%"/>
</div>
