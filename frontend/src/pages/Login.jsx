import {useState} from "react";
import {Eye, EyeOff, Flower} from "lucide-react";

export default function Login(){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({email, password})
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-eco)]">
            <Flower size={18} color="#FFFFFF" />
          </div>
          <span className="text-lg font-semiBold text-[var(--color-primary)]">EcoTrack</span>
        </div>
      </header>

      <main className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm rounded-2xl bg-[var(--color-surface)] p-8 shadow-[0_10px_25px_-5px_var(--color-primary)]">
          <h1 className="text-xl font-bold text-[var(--color-primary)]">
            Welcome Back
          </h1>
          <p className="mt-1 font-regular text-sm text-[var(--color-slate)]">
            Sign in to track your carbon footprint
          </p>
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-[var(--color-text-dark)]">
                Email address
              </label>
              <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-lg border border-[var(--color-slate)] px-3 py-2 text-sm outline-none"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1 block text-sm font-medium text-[var(--color-muted)]">
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
              <a href="/forgot-password" className="text-sm font-medium text-[var(--color-secondary)]">
                Forgot password?
              </a>
            </div>

            <button
            type="submit"
            className="cursor-pointer mt-1 w-full rounded-lg bg-[var(--color-primary)] py-2.5 text-sm font-semibold text-white transition-transform duration-150 hover:bg-[#1E293B] active:scale-95"
            >
              Log in
            </button> 

            <p className="mt-2 text-center text-sm text-[var(--color-text-muted)]">
              Don't have an account?{" "}
              <a href="/register" className="font-medium text-[var(--color-secondary)]">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </main>
    </div>
  )
}