import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlbaButton } from "@/components/site/AlbaButton";
import { Logo } from "@/components/site/Logo";
import { supabase } from "@/integrations/supabase/client";
import { LanguageProvider } from "@/lib/i18n";
import { ThemeProvider } from "@/lib/theme";

const title = "Admin sign in — Albastini";
const description = "Sign in to manage Albastini tournaments, winners and card sign-ups.";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) void navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (signUpError) throw signUpError;
        setMessage("Account created. Check your inbox to confirm, then sign in.");
        setMode("signin");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
        await navigate({ to: "/admin", replace: true });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <ThemeProvider>
      <LanguageProvider>
        <main className="relative grid min-h-screen place-items-center bg-background px-5 py-16">
          <div aria-hidden className="alba-dots pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-lift sm:p-9">
            <Logo />
            <h1 className="display-xl mt-7 text-3xl leading-[0.95]">
              {mode === "signin" ? "Admin sign in" : "Create admin account"}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Only approved Albastini admins can manage tournaments, winners and card sign-ups.
            </p>

            <form className="mt-7 grid gap-4" onSubmit={onSubmit}>
              <div className="grid gap-2">
                <label htmlFor="admin-email" className="eyebrow text-muted-foreground">
                  Email address
                </label>
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-full border border-input bg-background px-5 text-sm outline-none focus:border-ring"
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="admin-password" className="eyebrow text-muted-foreground">
                  Password
                </label>
                <input
                  id="admin-password"
                  type="password"
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-full border border-input bg-background px-5 text-sm outline-none focus:border-ring"
                />
              </div>

              {error ? <p className="text-xs text-destructive">{error}</p> : null}
              {message ? <p className="text-xs text-alba-gold">{message}</p> : null}

              <AlbaButton type="submit" size="lg" disabled={busy}>
                {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
              </AlbaButton>
            </form>

            <button
              type="button"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError(null);
                setMessage(null);
              }}
              className="mt-6 text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              {mode === "signin"
                ? "First time here? Create the admin account"
                : "Already have an account? Sign in"}
            </button>

            <div className="mt-8 border-t border-border pt-5">
              <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
                ← Back to the website
              </Link>
            </div>
          </div>
        </main>
      </LanguageProvider>
    </ThemeProvider>
  );
}
