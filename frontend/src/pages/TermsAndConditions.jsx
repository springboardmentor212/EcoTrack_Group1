import { Link } from "react-router-dom";
import { Flower } from "lucide-react";

const LAST_UPDATED = "October 15, 2026";

const sections = [
  {
    id: "acceptance",
    title: "Accepting these terms",
    body: [
      "By creating an account or using EcoTrack, you agree to these Terms and Conditions. If you do not agree, please do not use the platform.",
    ],
  },
  {
    id: "account",
    title: "Your account",
    body: [
      "You must give accurate details when you register and keep your password private. You are responsible for everything that happens under your account.",
      "Every new account starts as a User. The Administrator role is given only by an existing administrator and is used to manage users, challenges and platform reports.",
    ],
  },
  {
    id: "carbon-data",
    title: "Carbon tracking and goals",
    body: [
      "EcoTrack lets you log activities in five categories: transportation, energy, food, waste and water. We turn these entries into estimated carbon emissions.",
      "These numbers are estimates based on standard emission factors. They are meant to help you understand your habits, not to serve as certified or official carbon accounting.",
      "Goals are limits you set for yourself. Staying under a goal is your own commitment and does not come with any guarantee or legal result.",
    ],
  },
  {
    id: "recommendations",
    title: "Recommendations",
    body: [
      "EcoTrack suggests ways to reduce your footprint based on the entries you log. Suggestions are general guidance. Please use your own judgement before acting on them.",
    ],
  },
  {
    id: "challenges",
    title: "Challenges, points and leaderboards",
    body: [
      "Challenges are created by administrators. Your progress is calculated from the entries you log, so please log honestly.",
      "Eco Score, points, badges and leaderboard rankings are for motivation only and have no cash value. We may remove or correct points that come from false or manipulated entries.",
      "Your name and score may be visible to other users on leaderboards.",
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable use",
    body: [
      "Please do not enter false data on purpose, use another person's account, try to break or overload the platform, or attempt to access data that is not yours.",
    ],
  },
  {
    id: "privacy",
    title: "Your data and privacy",
    body: [
      "We store the information you give us, such as your profile details, entries, goals and challenge activity, to run the platform. We do not sell your personal data.",
      "You can update your profile at any time. You can delete your account from the Profile page, which removes your personal data from EcoTrack.",
    ],
  },
  {
    id: "suspension",
    title: "Suspension and removal",
    body: [
      "Administrators may suspend or remove accounts that break these terms. You can stop using EcoTrack and delete your account whenever you like.",
    ],
  },
  {
    id: "availability",
    title: "Availability and liability",
    body: [
      "We work to keep EcoTrack running smoothly, but we cannot promise it will always be available or free of errors. EcoTrack is provided as is, and we are not responsible for decisions made using its estimates or suggestions.",
    ],
  },
  {
    id: "changes",
    title: "Changes to these terms",
    body: [
      "We may update these terms from time to time. The date at the top of this page shows when they were last changed. Continuing to use EcoTrack means you accept the updated terms.",
    ],
  },
  {
    id: "contact",
    title: "Contact us",
    body: [
      "Questions about these terms? Reach out to the EcoTrack team at support@ecotrack.com.",
    ],
  },
];

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-slate)]">
      <header className="sticky top-0 z-50 bg-[var(--color-primary)] shadow-md">
        <div className="flex w-full items-center justify-between px-4 py-4 sm:px-8 lg:px-12">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-eco)]">
              <Flower className="h-6 w-6 text-white" />
            </span>
            <span className="text-2xl font-bold text-white">EcoTrack</span>
          </Link>
          <Link
            to="/login"
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-white/80 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
          >
            Back to login
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[var(--color-primary)] sm:text-4xl">
            Terms and Conditions
          </h1>
          <p className="mt-2 text-sm text-[var(--color--muted)]">
            Last updated: {LAST_UPDATED}
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
          <nav aria-label="Sections" className="hidden lg:block">
            <ul className="sticky top-6 space-y-1 border-l-2 border-slate-200">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="-ml-0.5 block border-l-2 border-transparent py-1.5 pl-4 text-sm text-[var(--color--muted)] transition hover:border-[var(--color-secondary)] hover:text-[var(--color-secondary)] focus:outline-none focus-visible:text-[var(--color-secondary)]"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <article className="rounded-2xl border border-slate-200 bg-[var(--color-surface)] p-6 sm:p-10">
            <div className="space-y-8">
              {sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-6">
                  <h2 className="mb-2 text-lg font-semibold text-[var(--color-primary)]">
                    {s.title}
                  </h2>
                  <div className="space-y-3 leading-relaxed">
                    {s.body.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[var(--color--muted)]">
                By using EcoTrack, you agree to these terms.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-lg bg-[var(--color-secondary)] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--color-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] focus-visible:ring-offset-2"
              >
                Create account
              </Link>
            </div>
          </article>
        </div>
      </main>
    </div>
  );
}
