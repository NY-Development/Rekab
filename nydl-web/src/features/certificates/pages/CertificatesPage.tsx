import { useMyCertificates } from '@/hooks/useCertificates';
import { Award, Download, ExternalLink, ShieldCheck } from 'lucide-react';
import type { Certificate } from '@/api/certificates.api';

function courseTitle(c: Certificate): string {
  if (c.metadata?.courseTitle) return c.metadata.courseTitle;
  if (c.courseId && typeof c.courseId === 'object') return c.courseId.title || 'Course';
  return 'Course';
}

export default function CertificatesPage() {
  const { data: res, isLoading, error } = useMyCertificates();
  const certificates = (res?.data || []) as Certificate[];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 md:px-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground md:text-3xl">My Certificates</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Download and share the certificates you've earned for completing NYDL programs.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">Failed to load your certificates.</div>
      ) : certificates.length === 0 ? (
        <div className="mx-auto max-w-md rounded-lg border border-border bg-card p-12 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-muted">
            <Award className="size-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-semibold text-foreground">No certificates yet</p>
          <p className="mt-2 text-xs text-muted-foreground">
            When you complete a program, your certificate will appear here for download.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {certificates.map((c) => (
            <div key={c.id} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center gap-3 border-b border-border bg-gradient-to-br from-primary/10 to-transparent p-5">
                <div className="flex size-11 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Award className="size-6" />
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold text-foreground">{courseTitle(c)}</h3>
                  {c.metadata?.batch && <p className="text-xs text-muted-foreground">{c.metadata.batch}</p>}
                </div>
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="size-4 text-emerald-500" />
                  <span className="font-mono">{c.certificateNumber}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Issued {new Date(c.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  {c.pdfUrl ? (
                    <>
                      <a
                        href={c.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                      >
                        <Download className="size-4" /> Download
                      </a>
                      <a
                        href={c.pdfUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-semibold text-foreground hover:border-primary"
                      >
                        <ExternalLink className="size-4" /> View
                      </a>
                    </>
                  ) : (
                    <span className="text-xs italic text-muted-foreground">Certificate document is being prepared.</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
