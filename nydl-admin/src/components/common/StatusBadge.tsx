import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getBadgeStyle = (val: string) => {
    switch (val.toUpperCase()) {
      case 'ACTIVE':
      case 'PUBLISHED':
      case 'VERIFIED':
      case 'PRESENT':
      case 'LOW':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'PENDING':
      case 'UPCOMING':
      case 'MEDIUM':
      case 'LATE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'DROPPED':
      case 'CANCELLED':
      case 'REJECTED':
      case 'ABSENT':
      case 'HIGH':
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      case 'COMPLETED':
      case 'GRADED':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <Badge
      variant="outline"
      className={`font-semibold capitalize tracking-wide text-[10px] px-2.5 py-0.5 rounded-full ${getBadgeStyle(
        status
      )}`}
    >
      {status.toLowerCase()}
    </Badge>
  );
}

export default StatusBadge;
