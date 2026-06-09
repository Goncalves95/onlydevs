"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { signIn } from "next-auth/react";
import { Link } from "@/lib/i18n/navigation";

type Tab = "signin" | "register";

interface Props {
  locale: string;
  callbackUrl: string;
  initialError?: string;
}

function isStrongPassword(pass: string) {
  return pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);
}

export default function LoginForm({ locale, callbackUrl, initialError }: Props) {
  const t = useTranslations("auth");

  const [tab, setTab] = useState<Tab>("signin");
  const [showMagicLink, setShowMagicLink] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);

  // Sign-in fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register fields
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");

  // Magic-link field (pre-fill from sign-in email when user clicks "Forgot password")
  const [magicEmail, setMagicEmail] = useState("");

  function switchTab(next: Tab) {
    setTab(next);
    setError(null);
    setShowMagicLink(false);
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });
      if (result?.error) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((result as any).code === "no_password") {
          setError(t("noPasswordError"));
          setMagicEmail(email);
          setShowMagicLink(true);
        } else {
          setError(t("invalidCredentials"));
        }
      } else {
        window.location.href = result?.url ?? callbackUrl;
      }
    } catch {
      setError(t("invalidCredentials"));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    await signIn("google", { callbackUrl });
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await signIn("resend", { email: magicEmail, redirect: false });
      if (result?.error) {
        setError(t("error"));
      } else {
        setMagicLinkSent(true);
      }
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (regPassword !== regConfirm) {
      setError(t("passwordMismatch"));
      return;
    }
    if (!isStrongPassword(regPassword)) {
      setError(t("passwordWeak"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: regEmail, password: regPassword, locale }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error === "EMAIL_TAKEN" ? t("emailTaken") : t("registrationError"));
        return;
      }

      const redirectTo: string = data.redirectTo ?? `/${locale}`;
      const signInResult = await signIn("credentials", {
        email: regEmail,
        password: regPassword,
        redirect: false,
        callbackUrl: redirectTo,
      });
      if (signInResult?.error) {
        setError(t("registrationError"));
      } else {
        window.location.href = redirectTo;
      }
    } catch {
      setError(t("registrationError"));
    } finally {
      setLoading(false);
    }
  }

  // ── Magic link sent ────────────────────────────────────────────────────────
  if (magicLinkSent) {
    return (
      <div className="text-center space-y-5">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/10 border border-green-500 mx-auto">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400" aria-hidden="true">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-white">{t("checkEmail")}</p>
          <p className="text-sm text-zinc-400 mt-1">{magicEmail}</p>
        </div>
        <button
          onClick={() => { setMagicLinkSent(false); setShowMagicLink(false); setError(null); }}
          className="text-sm text-zinc-400 hover:text-white transition-colors underline underline-offset-4"
        >
          {t("backToSignIn")}
        </button>
      </div>
    );
  }

  // ── Input style ────────────────────────────────────────────────────────────
  const inputCls =
    "w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-colors";
  const primaryBtn =
    "w-full bg-green-500 hover:bg-green-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-semibold py-2.5 rounded-md text-sm transition-colors";
  const secondaryBtn =
    "w-full border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-semibold py-2.5 rounded-md text-sm transition-colors disabled:opacity-50";

  return (
    <div className="space-y-6">
      {/* Tab switcher */}
      <div className="flex rounded-lg bg-zinc-900 border border-zinc-800 p-1 gap-1">
        {(["signin", "register"] as Tab[]).map((t2) => (
          <button
            key={t2}
            onClick={() => switchTab(t2)}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === t2
                ? "bg-zinc-700 text-white"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {t2 === "signin" ? t("signIn") : t("createAccount")}
          </button>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-md px-4 py-2.5">
          {error}
        </p>
      )}

      {/* ── Sign in — password ─────────────────────────────────────────────── */}
      {tab === "signin" && !showMagicLink && (
        <>
          <form onSubmit={handleSignIn} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              required
              autoComplete="email"
              className={inputCls}
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passwordPlaceholder")}
              required
              autoComplete="current-password"
              className={inputCls}
            />
            <button type="submit" disabled={loading} className={primaryBtn}>
              {loading ? "…" : t("signInButton")}
            </button>
          </form>

          <Divider label={t("or")} />

          <button onClick={handleGoogle} disabled={loading} className={secondaryBtn}>
            {t("continueWithGoogle")}
          </button>

          <button
            type="button"
            onClick={() => { setMagicEmail(email); setShowMagicLink(true); setError(null); }}
            className="block w-full text-center text-xs text-zinc-500 hover:text-green-400 transition-colors mt-2"
          >
            {t("forgotPassword")} →
          </button>
        </>
      )}

      {/* ── Sign in — magic link ───────────────────────────────────────────── */}
      {tab === "signin" && showMagicLink && (
        <>
          <button
            type="button"
            onClick={() => { setShowMagicLink(false); setError(null); }}
            className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
          >
            ← {t("backToSignIn")}
          </button>
          <form onSubmit={handleMagicLink} className="space-y-3">
            <input
              type="email"
              value={magicEmail}
              onChange={(e) => setMagicEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              required
              autoComplete="email"
              className={inputCls}
            />
            <button type="submit" disabled={loading} className={primaryBtn}>
              {loading ? "…" : t("sendMagicLink")}
            </button>
          </form>
        </>
      )}

      {/* ── Register ──────────────────────────────────────────────────────── */}
      {tab === "register" && (
        <>
          <form onSubmit={handleRegister} className="space-y-3">
            <input
              type="email"
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder={t("emailPlaceholder")}
              required
              autoComplete="email"
              className={inputCls}
            />
            <div className="space-y-1">
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder={t("passwordPlaceholder")}
                required
                autoComplete="new-password"
                className={inputCls}
              />
              <p className="text-xs text-zinc-600">{t("passwordRequirements")}</p>
            </div>
            <input
              type="password"
              value={regConfirm}
              onChange={(e) => setRegConfirm(e.target.value)}
              placeholder={t("confirmPasswordPlaceholder")}
              required
              autoComplete="new-password"
              className={inputCls}
            />
            <button type="submit" disabled={loading} className={primaryBtn}>
              {loading ? "…" : t("createAccountButton")}
            </button>
          </form>

          <Divider label={t("or")} />

          <button onClick={handleGoogle} disabled={loading} className={secondaryBtn}>
            {t("continueWithGoogle")}
          </button>

          <p className="text-xs text-zinc-600 text-center leading-relaxed">
            {t("termsNotePre")}{" "}
            <Link href="/terms" className="underline underline-offset-2 hover:text-zinc-400 transition-colors">
              {t("termsLink")}
            </Link>{" "}
            {t("termsAnd")}{" "}
            <Link href="/privacy" className="underline underline-offset-2 hover:text-zinc-400 transition-colors">
              {t("privacyLink")}
            </Link>
            .
          </p>
        </>
      )}
    </div>
  );
}

function Divider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3">
      <hr className="flex-1 border-zinc-800" />
      <span className="text-zinc-600 text-xs">{label}</span>
      <hr className="flex-1 border-zinc-800" />
    </div>
  );
}
