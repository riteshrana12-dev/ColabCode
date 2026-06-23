import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import ErrorBanner from "../components/ui/ErrorBanner";
import LogoMark from "../components/icon/LogoMark";
import AuthBackdrop from "../components/ui/AuthBackdrop";

const Login = () => {
  const { signIn, loading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
      <AuthBackdrop />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="rounded-[1.6rem] border border-white/12 bg-[#07101f]/90 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
            <div className="mb-8 text-center">
              <Link to="/" className="inline-flex">
                <LogoMark />
              </Link>
              <h1 className="mt-5 text-2xl font-black tracking-[-0.03em] text-white">
                Welcome back
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Sign in to continue to CollabCode
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                signIn(formData.email, formData.password);
              }}
              className="space-y-3.5"
            >
              {error && <ErrorBanner message={error} />}

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-sky-300/50 focus:bg-white/[0.06]"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-sky-300/50 focus:bg-white/[0.06]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="landing-glow-button mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-sky-300 text-sm font-black text-[#03111f] shadow-[0_0_40px_rgba(56,189,248,0.3)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-bold text-sky-300 hover:text-sky-200 transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
