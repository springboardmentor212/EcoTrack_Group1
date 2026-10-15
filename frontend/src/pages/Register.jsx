import { useState } from "react";
import { Flower, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        { name: fullName, email: cleanEmail, password },
      );

      toast.success(res.data.message || "Account created successfully!");

      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAgreed(false);

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[var(--color-background)]">
      {/* LEFT: Branding panel */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-center px-16 bg-[var(--color-primary)]">
        <div className="flex items-center gap-2 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--color-eco)]">
            <Flower size={22} color="#FFFFFF" />
          </div>
          <span className="text-2xl font-bold text-white">EcoTrack</span>
        </div>
        <h2 className="text-3xl font-semibold text-white leading-snug">
          Start your sustainability
          <br />
          journey today.
        </h2>
        <p className="mt-4 text-white/70 text-base max-w-sm">
          Set goals, track progress, and see your impact grow.
        </p>
      </div>

      {/* RIGHT: Login card */}
      <div className="flex w-full lg:w-3/5 items-start justify-center px-4 pt-8">
        <div className="w-full max-w-sm rounded-2xl bg-[var(--color-surface)] p-8 shadow-[0_10px_25px_-5px_var(--color-primary)]">
          {/* mobile-only logo, since left panel is hidden on small screens */}
          <div className="flex lg:hidden items-center gap-2 mb-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-eco)]">
              <Flower size={18} color="#FFFFFF" />
            </div>
            <span className="text-lg font-semibold text-[var(--color-primary)]">
              EcoTrack
            </span>
          </div>

          <h1 className="text-xl font-bold text-[var(--color-primary)]">
            Create Your Account
          </h1>
          <p className="mt-1 font-regular text-sm text-[var(--color-slate)]">
            Sign up to start tracking your carbon footprint
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
                  Terms & Conditions
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
                </span>
              ) : (
                "Create Account"
              )}
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
      </div>
    </div>
  );
}
