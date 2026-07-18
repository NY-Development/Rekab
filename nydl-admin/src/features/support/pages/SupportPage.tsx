import { useState } from 'react';
import { useContacts, useContactMutations } from '@/hooks/useContacts';
import { Button } from '@/components/ui/button';
import { Mail, Check, Clock, Inbox } from 'lucide-react';
import { toast } from 'sonner';

export function SupportPage() {
  const [filter, setFilter] = useState<'NEW' | 'HANDLED' | 'ALL'>('NEW');
  const { data, isLoading, isError } = useContacts(filter === 'ALL' ? {} : { status: filter });
  const { markHandled, isMarking } = useContactMutations();

  const contacts = data?.docs || [];

  const handleResolve = async (id: string) => {
    try {
      await markHandled(id);
      toast.success('Marked as handled');
    } catch {
      toast.error('Failed to update message');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wider text-white">Support Inbox</h1>
          <p className="text-sm font-medium text-slate-400">
            Messages sent from the Contact and Help pages by students and visitors.
          </p>
        </div>
        <div className="flex rounded-lg border border-slate-800 bg-slate-950 p-1">
          {(['NEW', 'HANDLED', 'ALL'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                filter === f ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {f === 'NEW' ? 'Unhandled' : f === 'HANDLED' ? 'Handled' : 'All'}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading messages…</div>
      ) : isError ? (
        <div className="text-rose-400">Failed to load messages. Please try again later.</div>
      ) : contacts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950 py-16 text-center">
          <Inbox className="mb-3 h-10 w-10 text-slate-600" />
          <p className="text-sm font-semibold text-slate-300">No {filter === 'NEW' ? 'unhandled ' : ''}messages</p>
          <p className="text-xs text-slate-500">You're all caught up.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <div key={c.id} className="rounded-xl border border-slate-800 bg-slate-950 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white">{c.name}</span>
                    <a
                      href={`mailto:${c.email}`}
                      className="inline-flex items-center gap-1 text-xs text-blue-400 hover:underline"
                    >
                      <Mail className="h-3 w-3" /> {c.email}
                    </a>
                    {c.topic && (
                      <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-slate-300">
                        {c.topic}
                      </span>
                    )}
                    {c.status === 'NEW' ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-amber-400">
                        <Clock className="h-3 w-3" /> New
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-emerald-400">
                        <Check className="h-3 w-3" /> Handled
                      </span>
                    )}
                  </div>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">{c.message}</p>
                  <p className="mt-2 text-[11px] text-slate-500">
                    {new Date(c.createdAt).toLocaleString()}
                    {c.userId ? ' · from a registered user' : ' · from the public form'}
                  </p>
                </div>
                {c.status === 'NEW' && (
                  <Button
                    onClick={() => handleResolve(c.id)}
                    disabled={isMarking}
                    className="shrink-0 bg-blue-600 text-white hover:bg-blue-700"
                    size="sm"
                  >
                    <Check className="mr-1.5 h-4 w-4" /> Mark handled
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SupportPage;
