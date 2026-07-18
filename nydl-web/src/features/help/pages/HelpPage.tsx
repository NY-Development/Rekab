import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, UserPlus, CreditCard, MonitorSmartphone, Users, GraduationCap, ChevronDown, Mail, Phone } from 'lucide-react';
import { SUPPORT_EMAIL, SUPPORT_PHONE } from '@/components/common/SupportContactModal';

type Category = 'Enrollment' | 'Payments' | 'Sessions & Cohorts' | 'Assignments & Certificates' | 'Technical';

interface Faq {
  q: string;
  a: string;
  category: Category;
}

const CATEGORIES: { key: Category; label: string; icon: typeof UserPlus; blurb: string }[] = [
  { key: 'Enrollment', label: 'Enrollment', icon: UserPlus, blurb: 'Registering, requirements, and getting started.' },
  { key: 'Payments', label: 'Payments', icon: CreditCard, blurb: 'Paying course fees and verifying your transfer.' },
  { key: 'Sessions & Cohorts', label: 'Sessions & Cohorts', icon: Users, blurb: 'Live sessions, cohorts, teams, and attendance.' },
  { key: 'Assignments & Certificates', label: 'Assignments & Certificates', icon: GraduationCap, blurb: 'Submitting work and earning certificates.' },
  { key: 'Technical', label: 'Technical', icon: MonitorSmartphone, blurb: 'Account, login, and platform issues.' },
];

const FAQS: Faq[] = [
  {
    category: 'Enrollment',
    q: 'How do I register for a course?',
    a: 'Browse the course catalog, open a course, and click Register. Complete the registration steps (or fast-track with your NYDev Form registration ID), then pay the course fee and submit your transaction reference. Once your payment is verified, you get immediate access to the course and your cohort.',
  },
  {
    category: 'Enrollment',
    q: 'What is a cohort, and how is it different from a team?',
    a: 'A cohort is the whole group of students taking a course together in the current batch (currently Summer 2026). A team is a small group of 3–6 students within your cohort that your instructor forms for group projects. You are placed into your cohort automatically when you register; teams are assigned by your instructor.',
  },
  {
    category: 'Enrollment',
    q: 'Do I need my own computer?',
    a: 'A personal computer is strongly recommended for all programs, since you will write and submit code and join live sessions. During registration we ask about your setup so instructors can support you.',
  },
  {
    category: 'Payments',
    q: 'How do I pay the course fee?',
    a: 'Transfer the exact course fee to the merchant account shown on the payment step using your preferred bank or wallet (CBE, Telebirr, BOA, CBE Birr, M-Pesa, and more). Then enter the transaction reference from your receipt and submit — the platform verifies it automatically.',
  },
  {
    category: 'Payments',
    q: 'My payment says "verification failed". What should I do?',
    a: 'This usually means the transaction reference was mistyped, the transfer has not settled yet, or the bank is temporarily unreachable. Double-check the reference from your receipt and try again in a few minutes. If it keeps failing, contact us with your reference and we will confirm it manually.',
  },
  {
    category: 'Payments',
    q: 'How soon do I get access after paying?',
    a: 'Access is granted immediately once your payment is verified. You will see your assigned cohort and be taken to your dashboard. If your bank uses a manual method (e.g. cash or a generic bank transfer), an administrator verifies it and access follows shortly after.',
  },
  {
    category: 'Sessions & Cohorts',
    q: 'What happens if I miss a live session?',
    a: 'Live sessions may be recorded and shared on your dashboard when available. Attending live is strongly encouraged, since attendance is tracked and repeated absences can affect your standing in the program.',
  },
  {
    category: 'Sessions & Cohorts',
    q: 'How is attendance tracked?',
    a: 'Attendance is recorded when you join a session through the platform, and your instructor may also confirm attendance from the session. Aim to join on time and stay for the full session.',
  },
  {
    category: 'Sessions & Cohorts',
    q: 'How do I find my team?',
    a: 'Open the Teams page from your dashboard. Once your instructor assigns you to a project team, your teammates, team leader, and instructor will appear there.',
  },
  {
    category: 'Assignments & Certificates',
    q: 'How do I submit an assignment?',
    a: 'Open the Assignments page, choose the assignment, and submit the required deliverable — usually a GitHub repository link, text, or a file, depending on the assignment. You can see your submission status and any feedback there.',
  },
  {
    category: 'Assignments & Certificates',
    q: 'How do I earn a certificate?',
    a: 'Certificates are awarded when you complete your program requirements, including attendance and assignments. When issued, your certificate appears in your student portal.',
  },
  {
    category: 'Technical',
    q: 'How do I reset my password?',
    a: 'On the login screen, choose "Forgot Password" and follow the link sent to your registered email. If it does not arrive within a few minutes, check your spam folder before trying again.',
  },
  {
    category: 'Technical',
    q: 'My session is about to expire while I am working. What do I do?',
    a: 'When your session is close to expiring, a banner appears with a "Refresh session" button. Click it to stay signed in without losing your place.',
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState<Category | 'All'>('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((f) => {
      const matchesCat = active === 'All' || f.category === active;
      const matchesQuery = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [query, active]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-8 md:py-16">
      {/* Header + search */}
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <h1 className="mb-2 text-3xl font-bold text-foreground md:text-4xl">How can we help?</h1>
        <p className="mb-6 text-muted-foreground">Search our guides, or browse the topics below.</p>
        <div className="relative mx-auto w-full max-w-xl">
          <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
          <input
            className="w-full rounded-lg border border-border bg-card py-2.5 pl-10 pr-4 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Search for help…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Category filter chips */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setActive('All')}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
            active === 'All'
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border text-muted-foreground hover:text-foreground'
          }`}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setActive(c.key)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              active === c.key
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Category cards (only when not searching) */}
      {active === 'All' && !query && (
        <div className="mb-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setActive(c.key)}
              className="flex flex-col items-start rounded-lg border border-border bg-card p-6 text-left transition-shadow hover:shadow-md"
            >
              <div className="mb-4 rounded-md bg-primary/10 p-2">
                <c.icon className="size-5 text-primary" />
              </div>
              <h3 className="mb-1 font-semibold text-foreground">{c.label}</h3>
              <p className="text-xs text-muted-foreground">{c.blurb}</p>
            </button>
          ))}
        </div>
      )}

      {/* FAQ list */}
      <div className="mx-auto max-w-3xl">
        <h2 className="mb-6 text-center text-2xl font-semibold text-foreground">
          {active === 'All' ? 'Frequently Asked Questions' : active}
        </h2>
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-border bg-card p-10 text-center text-sm text-muted-foreground">
            No results for "{query}". Try a different search, or contact us below.
          </div>
        ) : (
          <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
            {filtered.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/50">
                  {f.q}
                  <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <div className="bg-muted/30 px-4 pb-4 text-sm leading-relaxed text-muted-foreground">{f.a}</div>
              </details>
            ))}
          </div>
        )}
      </div>

      {/* Contact CTA */}
      <div className="mx-auto mt-14 max-w-3xl rounded-xl border border-border bg-muted/30 p-8 text-center">
        <h3 className="text-lg font-bold text-foreground">Still need help?</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Our team is happy to assist with registration, payment, or anything else.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary"
          >
            <Mail className="size-4 text-primary" /> {SUPPORT_EMAIL}
          </a>
          <a
            href={`tel:${SUPPORT_PHONE}`}
            className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary"
          >
            <Phone className="size-4 text-primary" /> {SUPPORT_PHONE}
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
