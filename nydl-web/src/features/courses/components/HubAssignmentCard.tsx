import { motion } from 'framer-motion';
import type { Assignment } from '@/types';

interface HubAssignmentCardProps {
  assignment: Assignment;
  submission?: { status: string; points?: number; gradedAt?: string } | null;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  upcoming: { label: 'Upcoming', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-500/10' },
  submitted: { label: 'Submitted', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-500/10' },
  graded: { label: 'Graded', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
  late: { label: 'Late', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10' },
  missing: { label: 'Missing', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-500/10' },
};

function getAssignmentStatus(assignment: Assignment, submission?: { status: string } | null): string {
  if (submission) return submission.status;
  const due = new Date(assignment.dueDate);
  if (due < new Date()) return 'missing';
  return 'upcoming';
}

export default function HubAssignmentCard({ assignment, submission }: HubAssignmentCardProps) {
  const status = getAssignmentStatus(assignment, submission);
  const config = statusConfig[status] || statusConfig.upcoming;
  const dueDate = new Date(assignment.dueDate);
  const isOverdue = dueDate < new Date() && status !== 'graded' && status !== 'submitted';

  const daysUntilDue = Math.ceil((dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <motion.a
      href={`/assignments/${assignment.id}/submit`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="block group"
    >
      <div className="relative bg-card/60 backdrop-blur-sm border border-border/60 rounded-xl p-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        {/* Status pill */}
        <div className="flex items-center justify-between mb-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.color} ${config.bg}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {config.label}
          </span>
          <span className="text-xs font-semibold text-primary">
            {assignment.maxPoints || assignment.maxScore || 0} pts
          </span>
        </div>

        {/* Title */}
        <h4 className="text-sm font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
          {assignment.title}
        </h4>

        {/* Meta */}
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            {dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
          {!isOverdue && daysUntilDue > 0 && daysUntilDue <= 7 && (
            <span className="text-amber-500 font-semibold">{daysUntilDue}d left</span>
          )}
          {isOverdue && (
            <span className="text-red-500 font-semibold">Overdue</span>
          )}
        </div>

        {/* Graded score */}
        {submission?.status === 'graded' && submission.points !== undefined && (
          <div className="mt-2 pt-2 border-t border-border/40 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Score</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">
              {submission.points}/{assignment.maxPoints || assignment.maxScore || 0}
            </span>
          </div>
        )}
      </div>
    </motion.a>
  );
}
