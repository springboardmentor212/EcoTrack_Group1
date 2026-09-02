import { useState } from "react";
import { Flower, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    setLoading(true);

    try{
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log({ fullName, email: cleanEmail, password, confirmPassword, agreed });
      toast.success(res.data.message || "Account created successfully!");

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAgreed(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] mb-0">
      <header className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-eco)]">
            <Flower size={18} color="#FFFFFF" />
          </div>
          <span className="text-lg font-semiBold text-[var(--color-primary)]">
            EcoTrack
          </span>
        </div>
      </header>

      <main className="flex items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-2xl bg-[var(--color-surface)] p-8 shadow-[0_10px_25px_-5px_var(--color-primary)]">
          <h1 className="text-xl font-bold text-[var(--color-primary)]">
            Create Your EcoTrack Account
          </h1>
          <p className="mt-1 font-regular text-sm text-[var(--color-slate)]">
            Join the community reducing carbon emissions
          </p>

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label
                htmlFor="fullName"
                className="mb-1 block text-sm font-medium text-[var(--color-muted)]"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-slate)] px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-[var(--color-muted)]"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-slate)] px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-[var(--color-muted)]"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-slate)] px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-1 block text-sm font-medium text-[var(--color-muted)]"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border border-[var(--color-slate)] px-3 py-2 text-sm outline-none"
              />
            </div>

            <label className="flex items-start gap-2 text-sm text-[var(--color-muted)]">
              <input
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-[var(--color-slate)]"
              />
              <span>
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="font-medium text-[var(--color-secondary)]"
                >
                  Terms of Service
                </Link>{" "}
                &{" "}
                <Link
                  to="/privacy"
                  className="font-medium text-[var(--color-secondary)]"
                >
                  Privacy Policy
                </Link>
              </span>
            </label>

            <button
            type="submit"
            disabled={loading}
            className="cursor-pointer mt-1 w-full rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white transition-transform duration-150 hover:bg-[#1E293B] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Please wait
                </span>) : ( "Create Account" )}
            </button>

            <p className="mt-2 text-center text-sm text-[var(--color-text-muted)]">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-[var(--color-secondary)]"
              >
                Log In
              </Link>
            </p>
          </form>
        </div>
      </main>
    </div>
  );
}
