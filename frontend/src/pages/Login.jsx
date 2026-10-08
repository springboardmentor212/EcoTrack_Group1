import { useState } from "react";
import { Eye, EyeOff, Flower, Loader, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanEmail = email.trim().toLowerCase();

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email: cleanEmail, password },
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success(res.data.message || "Logged in successfully!");
      navigate("/user-dashboard");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Login failed. Please try again.",
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
        Track your carbon footprint,<br />one step at a time.
      </h2>
      <p className="mt-4 text-white/70 text-base max-w-sm">
        Join thousands of people building smarter, greener habits every day.
      </p>
    </div>

    {/* RIGHT: Login card */}
    <div className="flex w-full lg:w-3/5 items-center justify-center px-4 py-16">
      <div className="w-full max-w-sm rounded-2xl bg-[var(--color-surface)] p-8 shadow-[0_10px_25px_-5px_var(--color-primary)]">

        {/* mobile-only logo, since left panel is hidden on small screens */}
        <div className="flex lg:hidden items-center gap-2 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-eco)]">
            <Flower size={18} color="#FFFFFF" />
          </div>
          <span className="text-lg font-semibold text-[var(--color-primary)]">EcoTrack</span>
        </div>

        <h1 className="text-xl font-bold text-[var(--color-primary)]">Welcome Back</h1>
        <p className="mt-1 font-regular text-sm text-[var(--color-slate)]">
          Sign in to track your carbon footprint
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="mb-1 block text-sm font-medium text-[var(--color-text-dark)]"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
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
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full rounded-lg border border-[var(--color-slate)] px-3 py-2 pr-10 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff size={16} className="text-[var(--color-muted)]" />
                  ) : (
                    <EyeOff size={16} className="text-[var(--color-muted)]" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-[var(--color-secondary)]"
              >
                Forgot password?
              </Link>
            </div>

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
                "Log in"
              )}
            </button>

            <p className="mt-2 text-center text-sm text-[var(--color-text-muted)]">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-[var(--color-secondary)]"
              >
                Sign up
              </Link>
            </p>
          </form>

      </div>
    </div>
  </div>
);
}
