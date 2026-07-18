import { useState } from 'react';
import { LifeBuoy, Mail, Phone, X, Copy, Check } from 'lucide-react';

export const SUPPORT_EMAIL = 'nydevofficial@gmail.com';
export const SUPPORT_PHONE = '0902142767';

/**
 * A small "Need help?" affordance for the registration / payment flow. Opens a
 * modal with the support email and phone so a confused applicant can reach out.
 */
export function SupportContactButton({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline ${className}`}
      >
        <LifeBuoy className="size-4" />
        Need help?
      </button>
      {open && <SupportContactDialog onClose={() => setOpen(false)} />}
    </>
  );
}

function CopyRow({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 px-4 py-3">
      <a href={href} className="flex min-w-0 items-center gap-3 text-foreground hover:text-primary">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">{icon}</span>
        <span className="min-w-0">
          <span className="block text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
          <span className="block truncate text-sm font-semibold">{value}</span>
        </span>
      </a>
      <button
        type="button"
        onClick={copy}
        className="shrink-0 rounded-md p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title="Copy"
      >
        {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
}

export function SupportContactDialog({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div className="flex items-center gap-2">
            <LifeBuoy className="size-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">Need a hand?</h3>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>
        <div className="space-y-4 p-5">
          <p className="text-sm leading-relaxed text-muted-foreground">
            Stuck on registration or payment? Reach the NYDev Learning team directly — we're happy to help you
            complete your enrollment.
          </p>
          <div className="space-y-2.5">
            <CopyRow icon={<Mail className="size-4" />} label="Email" value={SUPPORT_EMAIL} href={`mailto:${SUPPORT_EMAIL}`} />
            <CopyRow icon={<Phone className="size-4" />} label="Call or text" value={SUPPORT_PHONE} href={`tel:${SUPPORT_PHONE}`} />
          </div>
          <p className="text-[11px] leading-relaxed text-muted-foreground">
            When you contact us, mention the course you're registering for and your transaction reference (if you've
            already paid) so we can find you quickly.
          </p>
        </div>
      </div>
    </div>
  );
}

export default SupportContactButton;
