import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Flower,
  Menu,
  X,
  ArrowRight,
  Check,
  TrendingDown,
  Car,
  Zap,
  Utensils,
  Trash2,
  Droplets,
  Target,
  Sparkles,
  Trophy,
  Award,
  LayoutDashboard,
} from "lucide-react";

const categories = [
  { name: "Transportation", value: 42, icon: Car },
  { name: "Energy", value: 28, icon: Zap },
  { name: "Food", value: 18, icon: Utensils },
  { name: "Waste", value: 8, icon: Trash2 },
  { name: "Water", value: 4, icon: Droplets },
];

const highlights = [
  "5 emission categories",
  "AI-powered tips",
  "Goals and challenges",
];

const features = [
  {
    icon: Car,
    title: "Carbon footprint tracking",
    text: "Log transportation, energy, food, waste and water. Every entry becomes kilograms of CO₂.",
    tone: "secondary",
  },
  {
    icon: Target,
    title: "Sustainability goals",
    text: "Set a limit for each category and see how close you are as you log your day.",
    tone: "secondary",
  },
  {
    icon: Sparkles,
    title: "AI recommendations",
    text: "Get personal tips for the category where you are closest to your limit.",
    tone: "accent",
  },
  {
    icon: Trophy,
    title: "Eco challenges",
    text: "Join community challenges and compete on the leaderboard.",
    tone: "secondary",
  },
  {
    icon: Award,
    title: "Eco score and badges",
    text: "Stay under your goals to raise your eco score and earn badges.",
    tone: "eco",
  },
  {
    icon: LayoutDashboard,
    title: "Your dashboard",
    text: "See your score, total emissions and biggest categories in one clear view.",
    tone: "secondary",
  },
];

const toneStyles = {
  secondary: "bg-[var(--color-secondary)]/10 text-[var(--color-secondary)]",
  accent: "bg-[var(--color-accent)]/10 text-[var(--color-accent)]",
  eco: "bg-[var(--color-eco)]/10 text-[var(--color-eco)]",
};

function Logo({ dark = false, small = false }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span
        className={`flex items-center justify-center bg-[var(--color-eco)] ${
          small ? "h-8 w-8 rounded-lg" : "h-10 w-10 rounded-xl"
        }`}
      >
        <Flower className={`text-white ${small ? "h-5 w-5" : "h-6 w-6"}`} />
      </span>
      <span
        className={`font-bold ${small ? "text-xl" : "text-2xl"} ${
          dark ? "text-[var(--color-primary)]" : "text-white"
        }`}
      >
        EcoTrack
      </span>
    </Link>
  );
}

const navLinkClass =
  "text-sm font-medium text-white/80 transition hover:text-white focus:outline-none focus-visible:text-white";

function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[var(--color-primary)]">
      <div className="flex w-full items-center justify-between px-4 py-4 sm:px-8 lg:px-12">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          <a href="#features" className={navLinkClass}>
            Features
          </a>
          <Link to="/terms" className={navLinkClass}>
            Terms
          </Link>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/90 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            Log in
          </Link>
          <Link
            to="/register"
            className="rounded-lg bg-[var(--color-secondary)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            Sign up
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="rounded-lg p-2 text-white md:hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="px-4 pb-4 md:hidden">
          <nav className="flex flex-col" aria-label="Mobile">
            <a
              href="#features"
              onClick={() => setOpen(false)}
              className="py-3 text-base font-medium text-white/80 hover:text-white"
            >
              Features
            </a>
            <Link
              to="/terms"
              className="py-3 text-base font-medium text-white/80 hover:text-white"
            >
              Terms
            </Link>
          </nav>
          <div className="mt-2 flex gap-3">
            <Link
              to="/login"
              className="flex-1 rounded-lg border border-white/20 py-2.5 text-center text-sm font-medium text-white"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="flex-1 rounded-lg bg-[var(--color-secondary)] py-2.5 text-center text-sm font-semibold text-white"
            >
              Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function HeroCard() {
  return (
    <div className="w-full max-w-sm rounded-2xl border border-slate-200 bg-[var(--color-surface)] p-5 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--color--muted)]">
            CO₂ emissions this month
          </p>
          <p className="mt-1 text-3xl font-bold text-[var(--color-primary)]">
            128 <span className="text-base font-medium">kg</span>
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-eco)]/10 px-2.5 py-1 text-sm font-semibold text-[var(--color-eco)]">
          <TrendingDown className="h-4 w-4" />
          12%
        </span>
      </div>

      <ul className="mt-5 space-y-3">
        {categories.map(({ name, value, icon: Icon }) => (
          <li key={name}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="flex items-center gap-2 text-[var(--color-slate)]">
                <Icon className="h-4 w-4 text-[var(--color-secondary)]" />
                {name}
              </span>
              <span className="font-medium text-[var(--color-primary)]">
                {value}%
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-[var(--color-background)]">
              <div
                className="h-1.5 rounded-full bg-[var(--color-secondary)]"
                style={{ width: `${value}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-5 flex items-center gap-2 rounded-xl bg-[var(--color-background)] px-3 py-2.5 text-sm text-[var(--color-slate)]">
        <Check className="h-4 w-4 text-[var(--color-eco)]" />
        You are under your monthly goal
      </div>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-slate)]">
      <Navbar />

      {/* Hero */}
      <section className="flex min-h-[calc(100dvh-4.5rem)] items-center bg-[var(--color-background)]">
  <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:py-16">
          <div>
            <h1 className="text-3xl font-bold leading-tight text-[var(--color-primary)] sm:text-4xl lg:text-[2.75rem]">
              Track your carbon footprint and live more sustainably
            </h1>
            <p className="mt-4 max-w-lg text-base text-[var(--color-slate)] sm:text-lg">
              EcoTrack calculates your emissions, tracks your sustainability
              goals and gives you AI recommendations to reduce your impact.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-secondary)] px-5 py-2.5 font-semibold text-white transition hover:bg-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#features"
                className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-[var(--color-primary)] transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                Explore features
              </a>
            </div>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {highlights.map((h) => (
                <li
                  key={h}
                  className="flex items-center gap-2 text-sm text-[var(--color--muted)]"
                >
                  <Check className="h-4 w-4 text-[var(--color-eco)]" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-center lg:justify-end">
            <HeroCard />
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="scroll-mt-16 border-t border-slate-200 bg-[var(--color-surface)] px-4 py-12 sm:px-6"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-[var(--color-primary)] sm:text-3xl">
              Everything you need in one place
            </h2>
            <p className="mt-2 text-[var(--color--muted)]">
              Simple tools that turn good intentions into measurable progress.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, text, tone }) => (
              <div
                key={title}
                className="rounded-xl border border-slate-200 bg-[var(--color-background)] p-5"
              >
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${toneStyles[tone]}`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-3 text-base font-semibold text-[var(--color-primary)]">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-[var(--color-primary)] px-6 py-8 text-center sm:px-10">
          <h2 className="text-xl font-bold text-white sm:text-2xl">
            Start your sustainability journey today
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/70 sm:text-base">
            Create your account and log your first activity in under a minute.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="rounded-lg bg-[var(--color-eco)] px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Sign up
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-white/25 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-[var(--color-surface)] px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 md:flex-row">
          <Logo dark small />
          <nav
            aria-label="Footer"
            className="flex gap-5 text-sm text-[var(--color--muted)]"
          >
            <a href="#features" className="hover:text-[var(--color-secondary)]">
              Features
            </a>
            <Link to="/terms" className="hover:text-[var(--color-secondary)]">
              Terms &amp; Conditions
            </Link>
          </nav>
          <p className="text-sm text-[var(--color--muted)]">
            © 2026 EcoTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
