import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { attendanceApi, type AttendanceRecord } from '@/api/attendance.api';
import { UploadCloud, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import type { Session } from '@/types';

const STATUS_STYLE: Record<string, string> = {
  PRESENT: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  PARTIAL: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  LATE: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  ABSENT: 'bg-destructive/10 text-destructive',
};

function studentName(r: AttendanceRecord): string {
  if (r.studentId && typeof r.studentId === 'object') return r.studentId.name || r.studentId.email || 'Student';
  return 'Student';
}

function fmtDuration(sec?: number): string {
  if (!sec) return '—';
  const m = Math.round(sec / 60);
  return m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`;
}

/** Instructor/admin: upload a Meet attendance report for a session and view results. */
export function AttendanceModal({ session, onClose }: { session: Session; onClose: () => void }) {
  const queryClient = useQueryClient();
  const [uploading, setUploading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['attendance', session.id],
    queryFn: async () => (await attendanceApi.getForSession(session.id)).data.data,
  });
  const records = data || [];

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await attendanceApi.importForSession(session.id, file);
      const { imported, unmatched } = res.data.data;
      toast.success(`Imported ${imported} record${imported === 1 ? '' : 's'}${unmatched.length ? `, ${unmatched.length} unmatched` : ''}`);
      queryClient.invalidateQueries({ queryKey: ['attendance', session.id] });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to import attendance');
    } finally {
      setUploading(false);
    }
  };

  const present = records.filter((r) => r.status === 'PRESENT').length;
  const partial = records.filter((r) => r.status === 'PARTIAL' || r.status === 'LATE').length;
  const absent = records.filter((r) => r.status === 'ABSENT').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h3 className="text-lg font-bold text-foreground">Attendance — {session.title}</h3>
            <p className="text-xs text-muted-foreground">{session.duration} min session · {records.length} record{records.length === 1 ? '' : 's'}</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="size-5" /></button>
        </div>

        <div className="space-y-4 overflow-y-auto p-5">
          {/* Upload */}
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-muted/30 p-5 text-center hover:border-primary/40">
            {uploading ? <Loader2 className="size-6 animate-spin text-muted-foreground" /> : <UploadCloud className="size-6 text-muted-foreground" />}
            <span className="text-xs text-muted-foreground">Upload Google Meet attendance report (CSV or XLSX)</span>
            <input
              type="file"
              accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
            />
          </label>
          <p className="text-[11px] text-muted-foreground">
            Duration is matched against the {session.duration}-minute session: ≥80% = Present, &gt;20% = Partial, otherwise Absent.
            Students who clicked the join link are marked Present automatically.
          </p>

          {/* Summary */}
          {records.length > 0 && (
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg border border-border bg-muted/30 p-2"><p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{present}</p><p className="text-[10px] uppercase text-muted-foreground">Present</p></div>
              <div className="rounded-lg border border-border bg-muted/30 p-2"><p className="text-lg font-bold text-amber-600 dark:text-amber-400">{partial}</p><p className="text-[10px] uppercase text-muted-foreground">Partial</p></div>
              <div className="rounded-lg border border-border bg-muted/30 p-2"><p className="text-lg font-bold text-destructive">{absent}</p><p className="text-[10px] uppercase text-muted-foreground">Absent</p></div>
            </div>
          )}

          {/* List */}
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
          ) : records.length === 0 ? (
            <p className="py-8 text-center text-xs text-muted-foreground">No attendance yet. Upload a report or wait for students to join.</p>
          ) : (
            <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
              {records.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 p-3">
                  <span className="truncate text-sm font-medium text-foreground">{studentName(r)}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-muted-foreground">{fmtDuration(r.durationSeconds)}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${STATUS_STYLE[r.status] || 'bg-muted text-muted-foreground'}`}>
                      {r.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AttendanceModal;
