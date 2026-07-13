
export default function AboutPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 flex flex-col gap-16">
      {/* Zero configuration hero section matching Design specs */}
      <section className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-100 font-medium text-xs uppercase tracking-wider">
          <span className="material-symbols-outlined text-[16px]">flag</span>
          Our Mission
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
          Empowering engineers through cohort-based accountability.
        </h1>
        <p className="text-base md:text-lg text-slate-600 max-w-2xl">
          We believe that great software engineers aren't built in isolation. NYDEV Learning provides the structure, peer network, and mentorship necessary to transform passive learners into active builders.
        </p>
      </section>

      {/* Philosophy Section */}
      <section className="space-y-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold text-slate-900">Learning Philosophy</h2>
          <p className="text-slate-600">Moving beyond passive video watching.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 flex flex-col justify-between min-h-[240px] md:col-span-2 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-blue-600 text-[28px]">construction</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-955 mb-2">Active, Team-Based Building</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Tutorial hell ends here. Our curriculum is designed around building real-world projects in small, cross-functional teams. You learn by doing, reviewing PRs, and resolving merge conflicts together.
              </p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-6 md:p-8 flex flex-col justify-between min-h-[240px] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-blue-600 text-[28px]">speed</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">High Velocity</h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                Intense, focused sprints designed to mimic the pace of high-performing engineering teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Cohort Steps */}
      <section className="space-y-8">
        <div className="flex flex-col gap-2 border-b border-slate-200 pb-4">
          <h2 className="text-2xl font-semibold text-slate-900">The Cohort System</h2>
          <p className="text-slate-600">Structure designed for completion and mastery.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center">1</div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Teams</h3>
              <p className="text-sm text-slate-500">
                Placed in pods of 4-6 engineers, ensuring you always have peers to pair-program with, unblock issues, and hold you accountable to weekly goals.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center">2</div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Mentorship</h3>
              <p className="text-sm text-slate-500">
                Weekly 1:1s and code reviews from Senior Engineers working at top tech companies. Real feedback, not just automated test results.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-700 font-bold flex items-center justify-center">3</div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Deadlines</h3>
              <p className="text-sm text-slate-500">
                Strict weekly milestones. Hard deadlines replicate real engineering sprint cycles, curing procrastination and ensuring continuous progress.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
