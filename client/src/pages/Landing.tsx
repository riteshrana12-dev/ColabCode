import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const stats = [
  { value: "45 ms", label: "presence updates" },
  { value: "0 setup", label: "browser workspace" },
  { value: "4 tools", label: "editor, call, files, terminal" },
];

const bento = [
  {
    title: "Multiplayer editor",
    body: "Every file has its own isolated document, cursor state, and sync stream.",
    className: "md:col-span-2",
  },
  {
    title: "Room call",
    body: "Voice and video stay beside the code, built for pairing without context switching.",
    className: "",
  },
  {
    title: "Live workspace",
    body: "Create files, open linked HTML assets, run code, and keep everyone in the same project rhythm.",
    className: "",
  },
  {
    title: "Shared terminal flow",
    body: "Spin up room-aware terminals and sync files into the workspace before running project commands.",
    className: "md:col-span-2",
  },
];

const footerLinks = [
  {
    title: "Contact",
    links: [], // we'll render this differently — see below
  },
  {
    title: "Use cases",
    links: ["Pair programming", "Code review", "Teaching", "Hackathons"],
  },
  {
    title: "Platform",
    links: ["Realtime", "Security", "Docs", "Status"],
  },
];

export default function Landing() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const navigate = useNavigate();

  const handleStart = () => {
    if (isAuthenticated) {
      navigate("/dashboard"); // already signed in
    } else {
      navigate("/register"); // new user
    }
  };
  return (
    <div className="min-h-screen overflow-hidden bg-[#030712] text-white">
      <HeroBackdrop />

      <header className="landing-nav fixed top-10 left-0 right-0 z-20 mx-auto flex h-14 w-[min(1180px,calc(100%-32px))] items-center justify-between rounded-2xl border border-white/15 bg-[#060b16]/40 px-4 shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <Link to="/" className="flex items-center gap-3">
          <LogoMark />
          <span className="text-sm font-semibold tracking-wide">
            CollabCode
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-xs font-medium text-slate-400 md:flex">
          <a href="#studio" className="hover:text-white">
            Studio
          </a>
          <a href="#features" className="hover:text-white">
            Features
          </a>
          <a href="#workflow" className="hover:text-white">
            Workflow
          </a>
          <a href="#footer" className="hover:text-white">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {!isAuthenticated && (
            <button
              onClick={() => navigate("/login")}
              className="rounded-xl px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
            >
              Sign in
            </button>
          )}
          <button
            onClick={handleStart}
            className="landing-glow-button rounded-xl bg-white px-4 py-2 text-xs font-black text-[#030712] transition-transform hover:-translate-y-0.5"
          >
            Start building
          </button>
        </div>
      </header>

      <main className="relative top-15 z-10">
        <section className="mx-auto grid min-h-[calc(100vh-88px)] w-[min(1180px,calc(100%-32px))] grid-cols-1 items-center gap-10 pb-24 pt-16 lg:grid-cols-[0.84fr_1.16fr]">
          <div className="relative">
            <div className="landing-pill mb-6 inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/10 px-3 py-1.5 text-xs font-semibold text-sky-100">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_16px_rgba(125,211,252,0.8)]" />
              Live coding rooms for fast-moving teams
            </div>

            <h1 className="max-w-4xl text-6xl font-black leading-[0.9] tracking-[-0.07em] text-white sm:text-7xl lg:text-8xl">
              Code together inside one electric workspace.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              CollabCode turns pair programming into a full browser studio:
              shared files, isolated editors, room terminals, video, and output
              panels built around one live project.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/register"
                className="landing-primary-cta group inline-flex h-12 items-center justify-center rounded-xl bg-sky-300 px-6 text-sm font-black text-[#03111f] shadow-[0_0_50px_rgba(56,189,248,0.35)] transition-transform hover:-translate-y-1"
              >
                Create a live room
                <span className="ml-2 transition-transform group-hover:translate-x-1">
                  -&gt;
                </span>
              </Link>
              <a
                href="#studio"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] px-6 text-sm font-bold text-slate-200 backdrop-blur transition-colors hover:bg-white/[0.08]"
              >
                See the workspace
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="landing-stat rounded-2xl border border-white/10 bg-white/[0.045] p-4 backdrop-blur-xl"
                >
                  <p className="text-lg font-black text-white">{item.value}</p>
                  <p className="mt-1 text-[11px] leading-4 text-slate-500">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div id="studio" className="relative min-h-[620px]">
            <StudioScene />
          </div>
        </section>

        <MarqueeBand />

        <section
          id="features"
          className="mx-auto w-[min(1180px,calc(100%-32px))] py-24"
        >
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-sky-300">
                Built to feel alive
              </p>
              <h2 className="mt-4 max-w-xl text-4xl font-black tracking-[-0.05em] text-white md:text-6xl">
                A product page that shows the product working.
              </h2>
              <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400">
                The first visit should make users imagine their next session:
                invite a teammate, open a file, talk through the bug, run the
                fix, and keep moving.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {bento.map((card) => (
                <article
                  key={card.title}
                  className={`landing-bento group relative min-h-[220px] overflow-hidden rounded-3xl border border-white/10 bg-white/[0.045] p-6 backdrop-blur-xl ${card.className}`}
                >
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="absolute -right-20 -top-20 h-44 w-44 rounded-full bg-sky-300/20 blur-3xl" />
                    <div className="absolute -bottom-24 left-10 h-48 w-48 rounded-full bg-violet-400/20 blur-3xl" />
                  </div>
                  <MiniGlyph />
                  <h3 className="relative mt-10 text-xl font-black text-white">
                    {card.title}
                  </h3>
                  <p className="relative mt-3 text-sm leading-6 text-slate-400">
                    {card.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="workflow"
          className="mx-auto w-[min(1180px,calc(100%-32px))] pb-24"
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[#06101f] p-6 shadow-2xl shadow-black/40 md:p-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.2),transparent_28%),radial-gradient(circle_at_90%_70%,rgba(52,211,153,0.16),transparent_25%)]" />
            <div className="relative grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="self-center">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-emerald-300">
                  Workflow
                </p>
                <h2 className="mt-4 text-4xl font-black tracking-[-0.05em] md:text-6xl">
                  From invite to running code in minutes.
                </h2>
                <p className="mt-5 text-sm leading-7 text-slate-400">
                  A visitor should instantly understand the promise: open a
                  room, bring people in, and collaborate with enough tooling to
                  actually finish the task.
                </p>
                <Link
                  to="/register"
                  className="mt-8 inline-flex h-11 items-center rounded-xl bg-white px-5 text-sm font-black text-[#06101f] transition-transform hover:-translate-y-0.5"
                >
                  Start your first room
                </Link>
              </div>
              <WorkflowDiagram />
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </div>
  );
}

function LogoMark() {
  return (
    <div className="relative grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.06]">
      <div className="absolute inset-0 rounded-xl bg-sky-300/20 blur-lg" />
      <svg viewBox="0 0 36 36" className="relative h-6 w-6">
        <path
          d="M9 18C9 11.8 12.7 8 18.6 8C22 8 24.8 9.3 26.8 11.7L23.7 14.6C22.4 13.1 20.8 12.3 18.8 12.3C15.4 12.3 13.3 14.6 13.3 18C13.3 21.4 15.4 23.7 18.8 23.7C20.8 23.7 22.4 22.9 23.7 21.4L26.8 24.3C24.8 26.7 22 28 18.6 28C12.7 28 9 24.2 9 18Z"
          fill="#E0F2FE"
        />
      </svg>
    </div>
  );
}

function HeroBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_12%,rgba(56,189,248,0.28),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(168,85,247,0.18),transparent_26%),radial-gradient(circle_at_50%_80%,rgba(52,211,153,0.12),transparent_30%),linear-gradient(180deg,#030712_0%,#06101f_52%,#030712_100%)]" />
      <svg
        className="landing-grid absolute inset-0 h-full w-full opacity-35"
        viewBox="0 0 1200 900"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern
            id="landing-grid-pattern"
            width="52"
            height="52"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M52 0H0V52"
              fill="none"
              stroke="rgba(148,163,184,0.16)"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="1200" height="900" fill="url(#landing-grid-pattern)" />
      </svg>
      <div className="landing-aurora absolute left-1/2 top-1/2 h-[740px] w-[740px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-300/10" />
    </div>
  );
}

function StudioScene() {
  return (
    <div className="absolute inset-0">
      <div className="landing-orbit absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      <div className="landing-orbit landing-orbit-reverse absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-sky-300/15" />

      <div className="landing-studio-card absolute left-0 top-12 w-[94%] overflow-hidden rounded-[1.6rem] border border-white/12 bg-[#07101f]/95 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <div className="flex h-12 items-center justify-between border-b border-white/10 bg-white/[0.04] px-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          </div>
          <div className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-[11px] font-bold text-emerald-200">
            Live room
          </div>
        </div>

        <div className="grid h-[470px] grid-cols-[160px_1fr_170px]">
          <div className="border-r border-white/10 bg-[#0a1426] p-3">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.22em] text-slate-600">
              Explorer
            </p>
            {["index.html", "style.css", "script.ts"].map((file, index) => (
              <div
                key={file}
                className={`landing-file-row mb-2 rounded-lg px-2.5 py-2 text-[11px] ${
                  index === 0
                    ? "border border-sky-300/20 bg-sky-300/12 text-sky-100"
                    : "text-slate-500"
                }`}
                style={{ animationDelay: `${index * 0.12}s` }}
              >
                {file}
              </div>
            ))}
          </div>

          <div className="relative overflow-hidden bg-[#060b14] p-5 font-mono text-[12px] leading-6 text-slate-400">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-300/70 to-transparent" />
            <CodeLine line="12" delay="0s" text="<Room title='Launch'>" />
            <CodeLine line="13" delay="0.16s" text="  <Editor live />" />
            <CodeLine
              line="14"
              delay="0.32s"
              text="  <Call participants={3} />"
            />
            <CodeLine line="15" delay="0.48s" text="  <Terminal synced />" />
            <CodeLine line="16" delay="0.64s" text="</Room>" />

            <div className="landing-terminal mt-8 rounded-2xl border border-emerald-300/20 bg-[#030712] p-4">
              <p className="text-[11px] font-bold text-emerald-200">
                terminal / room workspace
              </p>
              <p className="mt-3 text-[11px] text-slate-500">
                npm run dev -- --host
              </p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="landing-progress h-full rounded-full bg-gradient-to-r from-sky-300 to-emerald-300" />
              </div>
            </div>

            <svg
              className="landing-cursor absolute left-[48%] top-[42%] h-9 w-9 text-sky-300"
              viewBox="0 0 40 40"
              fill="none"
            >
              <path d="M10 6L29 22L20 24.5L15.5 34L10 6Z" fill="currentColor" />
            </svg>
          </div>

          <div className="border-l border-white/10 bg-[#0a1426] p-3">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-600">
                Call
              </p>
              <span className="text-[10px] text-emerald-300">voice on</span>
            </div>
            {["AR", "RR", "MK"].map((name, index) => (
              <div
                key={name}
                className="landing-video-tile mb-2 grid aspect-video place-items-center rounded-xl border border-white/10 bg-white/[0.045]"
                style={{ animationDelay: `${index * 0.18}s` }}
              >
                <span
                  className={`grid h-10 w-10 place-items-center rounded-full text-xs font-black ${
                    index === 0
                      ? "bg-sky-300 text-[#06111f]"
                      : index === 1
                        ? "bg-violet-300 text-[#10091f]"
                        : "bg-emerald-300 text-[#06140f]"
                  }`}
                >
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="landing-presence absolute bottom-10 right-2 w-[58%] rounded-[1.4rem] border border-white/12 bg-[#0a1426]/95 p-4 shadow-[0_30px_90px_rgba(0,0,0,0.4)] backdrop-blur-2xl">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-black text-white">Realtime pulse</span>
          <span className="text-[11px] font-bold text-emerald-300">
            synced now
          </span>
        </div>
        <svg viewBox="0 0 420 130" className="h-32 w-full">
          <path
            className="landing-path"
            d="M28 98C92 22 151 22 205 68C258 113 311 106 390 30"
            fill="none"
            stroke="rgba(56,189,248,0.9)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <circle className="landing-node node-one" cx="28" cy="98" r="6" />
          <circle className="landing-node node-two" cx="205" cy="68" r="6" />
          <circle className="landing-node node-three" cx="390" cy="30" r="6" />
        </svg>
      </div>
    </div>
  );
}

function CodeLine({
  text,
  delay,
  line,
}: {
  text: string;
  delay: string;
  line: string;
}) {
  return (
    <div className="landing-code-line" style={{ animationDelay: delay }}>
      <span className="mr-4 text-slate-700">{line}</span>
      <span>{text}</span>
    </div>
  );
}

function MiniGlyph() {
  return (
    <svg viewBox="0 0 80 80" className="relative h-14 w-14 text-sky-200">
      <circle
        cx="40"
        cy="40"
        r="32"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.22"
      />
      <path
        className="landing-mini-path"
        d="M18 46C29 20 52 18 62 36C69 49 55 62 40 55C30 50 32 36 44 34"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MarqueeBand() {
  const items = [
    "Shared cursors",
    "Room terminals",
    "Video beside code",
    "File tree sync",
    "HTML asset navigation",
    "Execution output",
  ];

  return (
    <section className="border-y border-white/10 bg-white/[0.025] py-4">
      <div className="landing-marquee flex gap-4 whitespace-nowrap text-xs font-black uppercase tracking-[0.18em] text-slate-500">
        {[...items, ...items, ...items].map((item, index) => (
          <span key={`${item}-${index}`} className="mx-4">
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}

function WorkflowDiagram() {
  const steps = [
    ["01", "Create room", 110, 120],
    ["02", "Invite team", 360, 210],
    ["03", "Run project", 610, 130],
  ] as const;

  return (
    <div className="relative min-h-[380px] overflow-hidden rounded-[1.4rem] border border-white/10 bg-[#030712]/70">
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 720 420"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="workflow-line" x1="0" x2="1" y1="0" y2="0">
            <stop stopColor="#38bdf8" />
            <stop offset="0.55" stopColor="#a78bfa" />
            <stop offset="1" stopColor="#34d399" />
          </linearGradient>
        </defs>
        <path
          className="flow-line"
          d="M110 120C220 30 260 300 360 210C465 115 505 240 610 130"
          fill="none"
          stroke="url(#workflow-line)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        {steps.map(([number, label, x, y], index) => (
          <g key={label} className="workflow-node">
            <circle
              cx={x}
              cy={y}
              r="54"
              fill="#06101f"
              stroke="rgba(255,255,255,0.16)"
            />
            <circle
              className="flow-pulse"
              cx={x}
              cy={y}
              r="54"
              fill="none"
              stroke="rgba(56,189,248,0.35)"
              style={{ animationDelay: `${index * 0.35}s` }}
            />
            <text
              x={x}
              y={y - 5}
              textAnchor="middle"
              fill="#7dd3fc"
              fontSize="12"
              fontWeight="900"
            >
              {number}
            </text>
            <text
              x={x}
              y={y + 17}
              textAnchor="middle"
              fill="white"
              fontSize="14"
              fontWeight="900"
            >
              {label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function Footer() {
  return (
    <footer
      id="footer"
      className="border-t border-white/10 bg-[#02050c] px-4 py-12"
    >
      <div className="mx-auto grid w-[min(1180px,100%)] gap-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="text-sm font-black">CollabCode</span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
            A realtime coding studio for teams who want collaboration to feel
            instant, visual, and worth coming back to.
          </p>
          <div className="mt-7 flex gap-3">
            <Link
              to="/register"
              className="rounded-xl bg-white px-4 py-2 text-xs font-black text-[#030712]"
            >
              Get started
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-white/10 px-4 py-2 text-xs font-bold text-slate-300"
            >
              Sign in
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5">
          {footerLinks.map((group) =>
            group.title === "Contact" ? (
              <div key="contact">
                <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
                  Contact
                </p>
                <div className="space-y-2.5">
                  <a
                    href="https://github.com/riteshrana12-dev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-slate-600 transition-colors hover:text-slate-300"
                  >
                    <GithubIcon /> GitHub
                  </a>
                  <a
                    href="https://linkedin.com/in/ritesh-rana12"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs text-slate-600 transition-colors hover:text-slate-300"
                  >
                    <LinkedinIcon /> LinkedIn
                  </a>
                </div>
              </div>
            ) : (
              // existing group rendering
              <div key={group.title}>
                <p className="mb-3 text-xs font-black uppercase tracking-[0.16em] text-slate-300">
                  {group.title}
                </p>
                <div className="space-y-2">
                  {group.links.map((link) => (
                    <a
                      key={link}
                      href="#studio"
                      className="block text-xs text-slate-600 transition-colors hover:text-slate-300"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ),
          )}
        </div>
      </div>

      <div className="mx-auto mt-10 flex w-[min(1180px,100%)] flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-slate-600 md:flex-row">
        <p>CollabCode. Built for live project rooms.</p>
        <p>
          Realtime editor, video, terminal, and files in one browser studio.
        </p>
      </div>
    </footer>
  );
}

function GithubIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
