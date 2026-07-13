
export default function HelpPage() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
      {/* FAQ Header & search box */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">How can we help?</h1>
        <p className="text-slate-600 mb-6">Search for articles, tutorials, and common issues.</p>
        <div className="relative w-full max-w-xl mx-auto">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input
            className="w-full bg-white border border-slate-200 rounded-lg py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
            placeholder="Search for support articles..."
            type="text"
          />
        </div>
      </div>

      {/* Category Grid */}
      <div className="mb-16">
        <h2 className="text-xl font-semibold mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-start">
            <div className="bg-blue-50 p-2 rounded-md mb-4">
              <span className="material-symbols-outlined text-blue-700">how_to_reg</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Enrollment</h3>
            <p className="text-xs text-slate-500">Application process, requirements, and onboarding details.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-start">
            <div className="bg-blue-50 p-2 rounded-md mb-4">
              <span className="material-symbols-outlined text-blue-700">payments</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Payments</h3>
            <p className="text-xs text-slate-500">Invoices, payment methods, ISA agreements, and refunds.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-start">
            <div className="bg-blue-50 p-2 rounded-md mb-4">
              <span className="material-symbols-outlined text-blue-700">desktop_windows</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Technical Support</h3>
            <p className="text-xs text-slate-500">Platform access, software requirements, and bug reporting.</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-start">
            <div className="bg-blue-50 p-2 rounded-md mb-4">
              <span className="material-symbols-outlined text-blue-700">gavel</span>
            </div>
            <h3 className="font-semibold text-slate-900 mb-1">Cohort Rules</h3>
            <p className="text-xs text-slate-500">Attendance policies, code of conduct, and academic integrity.</p>
          </div>
        </div>
      </div>

      {/* FAQ accordions */}
      <div className="mb-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">Top FAQs</h2>
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden divide-y divide-slate-200">
          <details className="group cursor-pointer">
            <summary className="flex justify-between items-center text-sm font-medium p-4 hover:bg-slate-50 transition-colors list-none">
              How do I reset my portal password?
              <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
            </summary>
            <div className="px-4 pb-4 text-xs text-slate-500 bg-slate-50">
              You can reset your password by clicking 'Forgot Password' on the login screen. A reset link will be sent to your registered email address. If you do not receive it within 5 minutes, please check your spam folder.
            </div>
          </details>
          <details className="group cursor-pointer">
            <summary className="flex justify-between items-center text-sm font-medium p-4 hover:bg-slate-50 transition-colors list-none">
              What happens if I miss a live session?
              <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
            </summary>
            <div className="px-4 pb-4 text-xs text-slate-500 bg-slate-50">
              All live sessions are recorded and posted to your cohort's dashboard within 24 hours. However, attending live is highly recommended. Missing more than 3 consecutive sessions may trigger a risk alert with your instructor.
            </div>
          </details>
          <details className="group cursor-pointer">
            <summary className="flex justify-between items-center text-sm font-medium p-4 hover:bg-slate-50 transition-colors list-none">
              How do I update my payment method?
              <span className="material-symbols-outlined text-slate-400 group-open:rotate-180 transition-transform">expand_more</span>
            </summary>
            <div className="px-4 pb-4 text-xs text-slate-500 bg-slate-50">
              Navigate to your student profile settings and select 'Billing'. From there, you can securely add a new credit card or update your ACH details for upcoming invoice cycles.
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
