import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface RowDetailDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  data: Record<string, any> | null;
  /** Keys to hide (ids, internal fields). */
  hide?: string[];
}

const DEFAULT_HIDE = ['__v', 'password', 'passwordHash', 'refreshToken'];

function humanizeKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/\bId\b/g, 'ID')
    .trim();
}

function renderValue(value: any): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) {
    if (value.length === 0) return '—';
    return value.map((v) => renderValue(v)).join(', ');
  }
  if (typeof value === 'object') {
    // Populated ref — show the most human-friendly field available.
    return value.name || value.title || value.email || value.code || value.id || '[object]';
  }
  if (typeof value === 'string') {
    // Format ISO dates.
    if (/^\d{4}-\d{2}-\d{2}T/.test(value)) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d.toLocaleString();
    }
    return value;
  }
  return String(value);
}

/**
 * Generic "full detail of this row" dialog. Renders every meaningful field of a
 * record as a key/value grid, so any admin table can show rich detail on
 * row-click without a bespoke dialog per entity.
 */
export function RowDetailDialog({ open, onClose, title, subtitle, data, hide = [] }: RowDetailDialogProps) {
  const hideKeys = new Set([...DEFAULT_HIDE, ...hide]);
  const entries = data
    ? Object.entries(data).filter(([k, v]) => !hideKeys.has(k) && typeof v !== 'function')
    : [];

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto border-slate-800 bg-slate-950 text-white sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
          {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
        </DialogHeader>
        {data && (
          <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
            {entries.map(([key, value]) => (
              <div key={key} className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{humanizeKey(key)}</p>
                <p className="break-words text-sm text-slate-200">{renderValue(value)}</p>
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default RowDetailDialog;
