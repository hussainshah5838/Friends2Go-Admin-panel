import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  loginWithEmail,
  loginWithOAuth,
  requestPasswordReset,
} from "./api/auth.service";
import AuthBackground from "./components/AuthBackground";
import { MdVisibility, MdVisibilityOff, MdMail, MdLock } from "react-icons/md";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { Logo } from "../../assets";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");
    setInfo("");
    if (!email || !password) {
      setErr("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      if (!remember) {
        // move token to session if you prefer ephemeral sessions
        const t = localStorage.getItem("ballie_token");
        const u = localStorage.getItem("ballie_user");
        sessionStorage.setItem("ballie_token", t || "");
        sessionStorage.setItem("ballie_user", u || "{}");
      }
      navigate("/");
    } catch (e2) {
      setErr(e2?.message || "Unable to sign in");
    } finally {
      setLoading(false);
    }
  }

  async function onForgot() {
    setErr("");
    setInfo("");
    if (!email) {
      setErr("Enter your email first to receive a reset link.");
      return;
    }
    setLoading(true);
    try {
      await requestPasswordReset(email);
      setInfo("If an account exists, a reset link has been sent.");
    } catch {
      setErr("Could not send reset link right now.");
    } finally {
      setLoading(false);
    }
  }

  async function oauth(provider) {
    setErr("");
    setInfo("");
    setLoading(true);
    try {
      await loginWithOAuth(provider);
      navigate("/");
    } catch {
      setErr("OAuth sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[radial-gradient(80%_60%_at_50%_-10%,#0b0f14,transparent),linear-gradient(#06080b,#06080b)] text-slate-100">
      <AuthBackground />

      {/* center container with subtle tilt and glow */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-6">
        <div
          className="w-full max-w-md"
          style={{
            transform:
              "rotateX(var(--rx,0)) rotateY(var(--ry,0)) translateX(var(--tx,0)) translateY(var(--ty,0))",
            transition: "transform 120ms ease-out",
          }}
        >
          {/* halo glow */}
          <div
            className="absolute inset-0 -z-10 blur-3xl opacity-40"
            style={{
              background:
                "radial-gradient(60% 80% at 50% -10%, rgba(168,255,26,0.45), transparent 60%)",
              filter: "drop-shadow(0 0 40px rgba(168,255,26,.3))",
            }}
          />
          <div className="glass rounded-3xl border border-border/60 shadow-2xl backdrop-blur-xl">
            <div className="p-7 sm:p-8">
              {/* Brand */}
              <div className="flex items-center gap-3 mb-6">
                <img
                  src={Logo}
                  alt="Ballie"
                  className="h-8 w-8 rounded-md bg-white"
                />
                <div>
                  <div className="text-lg font-semibold leading-none">
                    Ballie Admin
                  </div>
                  <div className="text-[11px] text-muted">
                    Sign in to continue
                  </div>
                </div>
              </div>

              {/* OAuth */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <button
                  type="button"
                  className="btn-ghost h-11 flex items-center justify-center gap-2"
                  onClick={() => oauth("google")}
                  disabled={loading}
                >
                  <FcGoogle size={18} />
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="btn-ghost h-11 flex items-center justify-center gap-2"
                  onClick={() => oauth("apple")}
                  disabled={loading}
                >
                  <FaApple size={18} />
                  <span>Apple</span>
                </button>
              </div>

              <div className="flex items-center gap-3 my-4">
                <div className="h-px flex-1 bg-border/60" />
                <span className="text-[11px] text-muted">or use email</span>
                <div className="h-px flex-1 bg-border/60" />
              </div>

              {/* Form */}
              <form onSubmit={onSubmit} className="space-y-4">
                <label className="block">
                  <span className="text-sm text-muted">Email</span>
                  <div className="mt-1 input flex items-center gap-2">
                    <MdMail className="text-muted" />
                    <input
                      className="bg-transparent flex-1 outline-none"
                      placeholder="you@ballie.app"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </label>

                <label className="block">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted">Password</span>
                    <button
                      type="button"
                      className="text-[11px] text-primary hover:underline"
                      onClick={onForgot}
                      disabled={loading}
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="mt-1 input flex items-center gap-2">
                    <MdLock className="text-muted" />
                    <input
                      className="bg-transparent flex-1 outline-none"
                      placeholder="••••••••"
                      type={showPass ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="text-muted hover:text-text"
                      onClick={() => setShowPass((v) => !v)}
                      aria-label={showPass ? "Hide password" : "Show password"}
                    >
                      {showPass ? <MdVisibilityOff /> : <MdVisibility />}
                    </button>
                  </div>
                </label>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 select-none">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                    />
                    <span className="text-sm">Remember me</span>
                  </label>
                  <span className="text-[11px] text-muted">
                    By continuing you agree to our{" "}
                    <a
                      className="text-primary hover:underline"
                      href="#"
                      onClick={(e) => e.preventDefault()}
                    >
                      Terms
                    </a>
                  </span>
                </div>

                {err && (
                  <div className="text-danger text-xs bg-danger/10 border border-danger/30 rounded-xl px-3 py-2">
                    {err}
                  </div>
                )}
                {info && (
                  <div className="text-success text-xs bg-success/10 border border-success/30 rounded-xl px-3 py-2">
                    {info}
                  </div>
                )}

                <button
                  className="btn w-full h-11 mt-2 relative overflow-hidden"
                  disabled={loading}
                >
                  <span className={loading ? "opacity-0" : ""}>Sign in</span>
                  {loading && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    </span>
                  )}
                </button>
              </form>

              {/* Footer */}
              <div className="mt-5 text-xs text-muted text-center">
                Don’t have access?{" "}
                <Link
                  to="#"
                  onClick={(e) => e.preventDefault()}
                  className="text-primary hover:underline"
                >
                  Request an admin invite
                </Link>
              </div>
            </div>
          </div>

          {/* subtle bottom caption */}
          <div className="text-center mt-6 text-[11px] text-muted">
            © {new Date().getFullYear()} Ballie — All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
