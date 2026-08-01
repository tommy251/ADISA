"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, AlertCircle, Lock, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Login failed");
      }
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setStatus("error");
    }
  }

  return (
    <div className="min-h-[80vh] bg-[var(--adisa-bone)]">
      <section className="border-b-2 border-black bg-[var(--adisa-ink)] py-12 text-[var(--adisa-bone)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-[var(--adisa-bone)]/80 hover:text-[var(--adisa-gold)]">
            <ArrowLeft className="h-4 w-4" /> Back to store
          </Link>
          <h1 className="mt-4 font-head text-4xl font-extrabold sm:text-5xl">Admin login</h1>
          <p className="mt-2 text-sm text-[var(--adisa-bone)]/80">
            Shared-secret login. Set <code className="font-mono">ADMIN_USERNAME</code> /
            <code className="font-mono"> ADMIN_PASSWORD</code> in <code className="font-mono">.env.local</code>.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
        <form
          onSubmit={onSubmit}
          className="border-2 border-black bg-white p-6 shadow-[8px_8px_0_#000]"
        >
          <div className="mx-auto mb-5 inline-flex h-12 w-12 items-center justify-center border-2 border-black bg-[var(--adisa-ink)] text-[var(--adisa-gold)]">
            <Lock className="h-6 w-6" />
          </div>

          <label className="block text-sm">
            <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">
              Username
            </span>
            <input
              type="text"
              autoComplete="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 w-full border-2 border-black bg-white px-3 py-2 text-sm focus:outline-none focus:bg-[var(--adisa-bone)]"
            />
          </label>

          <label className="mt-4 block text-sm">
            <span className="font-head text-xs uppercase tracking-widest text-muted-foreground">
              Password
            </span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border-2 border-black bg-white px-3 py-2 text-sm focus:outline-none focus:bg-[var(--adisa-bone)]"
            />
          </label>

          {status === "error" && error && (
            <p className="mt-4 flex items-start gap-2 border-2 border-[var(--adisa-clay)] bg-[var(--adisa-clay)]/5 px-3 py-2 text-xs text-[var(--adisa-clay)]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="mt-5 flex w-full items-center justify-center gap-2 border-2 border-black bg-[var(--adisa-ink)] px-6 py-3 font-head font-bold text-white shadow-[5px_5px_0_#000] transition active:translate-x-[5px] active:translate-y-[5px] active:shadow-none disabled:cursor-wait disabled:opacity-70"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" /> Checking…
              </>
            ) : (
              <>
                Sign in <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            <Link href="/" className="hover:text-[var(--adisa-clay)] underline underline-offset-4">
              Back to storefront
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
