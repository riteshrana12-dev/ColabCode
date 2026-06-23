import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";
import AuthBackdrop from "../components/ui/AuthBackdrop";
import LogoMark from "../components/icon/LogoMark";
import ErrorBanner from "../components/ui/ErrorBanner";

const Register = () => {
  const { signUp, verifyEmail, step, loading, error } = useAuth();
  const [otp, setOtp] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (step === "verify") {
    return (
      <div className="relative min-h-screen overflow-hidden bg-[#030712] text-white">
        <AuthBackdrop />

        <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-sm">
            <div className="rounded-[1.6rem] border border-white/12 bg-[#07101f]/90 p-8 shadow-[0_40px_120px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
              <div className="mb-8 text-center">
                <LogoMark />
                <h1 className="mt-5 text-2xl font-black tracking-[-0.03em] text-white">
                  Check your inbox
                </h1>
                <p className="mt-1.5 text-sm text-slate-500">
                  We sent a code to{" "}
                  <span className="text-slate-300">{formData.email}</span>
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  verifyEmail(formData.email, otp);
                }}
                className="space-y-3.5"
              >
                {error && <ErrorBanner message={error} />}

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    name="otp"
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                    placeholder="000000"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-center text-2xl font-black tracking-[0.5em] text-white outline-none transition-colors placeholder:text-slate-700 focus:border-sky-300/50 focus:bg-white/[0.06]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="landing-glow-button mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-sky-300 text-sm font-black text-[#03111f] shadow-[0_0_40px_rgba(56,189,248,0.3)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {loading ? "Verifying..." : "Verify email"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                It is Important to use the services
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                Create your account
              </h1>
              <p className="mt-1.5 text-sm text-slate-500">
                Start collaborating in seconds
              </p>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                signUp(formData.name, formData.email, formData.password);
              }}
              className="space-y-3.5"
            >
              {error && <ErrorBanner message={error} />}

              <div>
                <label className="mb-1.5 block text-xs font-bold uppercase tracking-[0.1em] text-slate-500">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-sky-300/50 focus:bg-white/[0.06]"
                />
              </div>

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
                  placeholder="At least 8 characters"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-sky-300/50 focus:bg-white/[0.06]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="landing-glow-button mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-sky-300 text-sm font-black text-[#03111f] shadow-[0_0_40px_rgba(56,189,248,0.3)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-bold text-sky-300 hover:text-sky-200 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
