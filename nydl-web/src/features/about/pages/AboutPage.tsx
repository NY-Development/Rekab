export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-16 px-4 py-12 md:px-8 md:py-20">
      {/* Hero */}
      <section className="mx-auto flex max-w-3xl flex-col items-center space-y-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-primary">
          <span className="material-symbols-outlined text-[16px]">flag</span>
          Our Mission
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
          Empowering engineers through cohort-based accountability.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
          We believe great software engineers aren't built in isolation. NYDEV Learning provides the structure, peer
          network, and mentorship needed to transform passive learners into active builders.
        </p>
      </section>

      {/* Philosophy */}
      <section className="space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-foreground">Learning Philosophy</h2>
          <p className="text-muted-foreground">Moving beyond passive video watching.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex min-h-[240px] flex-col justify-between rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md md:col-span-2 md:p-8">
            <div className="mb-6 flex size-12 items-center justify-center rounded-lg border border-border bg-muted">
              <span className="material-symbols-outlined text-[28px] text-primary">construction</span>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">Active, Team-Based Building</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Tutorial hell ends here. Our curriculum is built around real-world projects in small,
                cross-functional teams. You learn by doing — reviewing PRs and resolving merge conflicts together.
              </p>
            </div>
          </div>
          <div className="flex min-h-[240px] flex-col justify-between rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md md:p-8">
            <div className="mb-6 flex size-12 items-center justify-center rounded-lg border border-border bg-muted">
              <span className="material-symbols-outlined text-[28px] text-primary">speed</span>
            </div>
            <div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">High Velocity</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Focused, intense sprints designed to mirror the pace of high-performing engineering teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cohort system */}
      <section className="space-y-8">
        <div className="flex flex-col gap-2 border-b border-border pb-4">
          <h2 className="text-2xl font-semibold text-foreground">The Cohort System</h2>
          <p className="text-muted-foreground">Structure designed for completion and mastery.</p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              n: 1,
              title: 'Cohorts & Teams',
              body: 'You join a cohort — everyone taking your course this batch — and get placed in a small team of 3–6 so you always have peers to pair with, unblock issues, and stay accountable to weekly goals.',
            },
            {
              n: 2,
              title: 'Mentorship',
              body: 'Live sessions, code reviews, and guidance from experienced instructors. Real feedback on your work, not just automated test results.',
            },
            {
              n: 3,
              title: 'Deadlines',
              body: 'Clear weekly milestones. Real deadlines replicate engineering sprint cycles, curing procrastination and keeping momentum.',
            },
          ].map((step) => (
            <div key={step.n} className="flex flex-col gap-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-bold text-primary">
                {step.n}
              </div>
              <div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
