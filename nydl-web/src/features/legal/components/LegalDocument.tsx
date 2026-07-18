import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';

export interface LegalSection {
  id: string;
  heading: string;
  body: ReactNode;
}

interface LegalDocumentProps {
  title: string;
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
}

/**
 * Shared shell for the Privacy Policy and Terms pages: sticky table of
 * contents, consistent prose styling, all token-based so it reads correctly in
 * light and dark themes.
 */
export function LegalDocument({ title, updated, intro, sections }: LegalDocumentProps) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-16">
      <div className="mb-10 border-b border-border pb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">NYDEV Learning</p>
        <h1 className="mt-2 text-3xl font-bold text-foreground md:text-4xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {updated}</p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Table of contents */}
        <aside className="lg:col-span-3">
          <nav className="lg:sticky lg:top-24">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Contents</p>
            <ul className="space-y-2 text-sm">
              {sections.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="text-muted-foreground transition-colors hover:text-foreground">
                    {i + 1}. {s.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Body */}
        <div className="lg:col-span-9">
          <div className="mb-8 rounded-lg border border-border bg-muted/30 p-5 text-sm leading-relaxed text-muted-foreground">
            {intro}
          </div>

          <div className="space-y-10">
            {sections.map((s, i) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="mb-3 text-xl font-bold text-foreground">
                  {i + 1}. {s.heading}
                </h2>
                <div className="space-y-3 text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_li]:ml-1 [&_strong]:text-foreground">
                  {s.body}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 border-t border-border pt-6 text-sm text-muted-foreground">
            Questions? Visit our{' '}
            <Link to="/help" className="text-primary underline">
              Help Center
            </Link>{' '}
            or{' '}
            <Link to="/contact" className="text-primary underline">
              contact us
            </Link>
            .
          </div>
        </div>
      </div>
    </div>
  );
}

/** Consistent bulleted list for legal bodies. */
export function LegalList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5">
      {items.map((it, i) => (
        <li key={i}>{it}</li>
      ))}
    </ul>
  );
}

export default LegalDocument;
