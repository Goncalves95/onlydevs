"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Props {
  hasPassword: boolean;
}

function isStrongPassword(pass: string) {
  return pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);
}

export default function PasswordSection({ hasPassword }: Props) {
  const t = useTranslations("account.profile");
  const { update } = useSession();
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (newPassword !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }
    if (!isStrongPassword(newPassword)) {
      setError(t("passwordWeak"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: hasPassword ? "change" : "set",
          currentPassword: hasPassword ? currentPassword : undefined,
          newPassword,
          confirmPassword,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (data.error === "WRONG_PASSWORD") setError(t("wrongPassword"));
        else if (data.error === "PASSWORD_MISMATCH") setError(t("passwordMismatch"));
        else if (data.error === "WEAK_PASSWORD") setError(t("passwordWeak"));
        else setError(t("passwordSaveError"));
        return;
      }

      setSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Refresh the JWT — clears needsPassword flag if it was set
      await update();
      // Refresh the server component (updates hasPassword prop)
      router.refresh();
      // Remove ?setup=password from the URL without triggering a navigation
      const params = new URLSearchParams(window.location.search);
      if (params.has("setup")) {
        params.delete("setup");
        const newSearch = params.toString();
        router.replace(
          window.location.pathname + (newSearch ? `?${newSearch}` : "")
        );
      }
    } catch {
      setError(t("passwordSaveError"));
    } finally {
      setLoading(false);
    }
  }

  const inputCls =
    "w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-colors";
  const labelCls = "block text-xs font-medium text-zinc-400 uppercase tracking-wider mb-1.5";

  return (
    <div className="border-t border-zinc-800 pt-8 space-y-5">
      <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
        {t("securityTitle")}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-sm">
        <p className="text-sm text-zinc-400">
          {hasPassword ? t("changePasswordTitle") : t("setPasswordTitle")}
        </p>

        {hasPassword && (
          <div>
            <label className={labelCls}>{t("currentPassword")}</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
              className={inputCls}
            />
          </div>
        )}

        <div>
          <label className={labelCls}>{t("newPassword")}</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
            className={inputCls}
          />
          <p className="text-xs text-zinc-600 mt-1">{t("passwordWeak")}</p>
        </div>

        <div>
          <label className={labelCls}>{t("confirmPassword")}</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
            className={inputCls}
          />
        </div>

        {error && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-4 py-2">
            {error}
          </p>
        )}
        {saved && (
          <p className="text-sm text-green-400">{t("passwordSaved")}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-semibold px-5 py-2.5 rounded-md text-sm transition-colors"
        >
          {loading ? "…" : t("savePassword")}
        </button>
      </form>
    </div>
  );
}
