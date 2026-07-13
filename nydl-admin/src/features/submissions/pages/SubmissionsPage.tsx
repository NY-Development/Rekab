import { useSubmissions, useSubmissionMutations } from '@/hooks/useSubmissions';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ColumnDef } from '@tanstack/react-table';
import { Submission } from '@/types';
import { Button } from '@/components/ui/button';
import { Check, ClipboardList } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function SubmissionsPage() {
  const { data, isLoading } = useSubmissions();
  const { gradeSubmission } = useSubmissionMutations();

  const handleGrade = async (id: string) => {
    const scoreStr = prompt('Enter score:');
    if (scoreStr === null) return;
    const score = parseFloat(scoreStr);
    const feedback = prompt('Enter feedback:') || '';

    if (isNaN(score)) {
      toast.error('Invalid score entered');
      return;
    }

    try {
      await gradeSubmission({ id, data: { score, feedback } });
      toast.success('Graded successfully');
    } catch {
      toast.error('Failed to submit grade');
    }
  };

  const columns: ColumnDef<Submission>[] = [
    { accessorKey: 'student.user.name', header: 'Student', cell: (info) => <span className="font-semibold text-white">{info.row.original.student?.user?.name || 'N/A'}</span> },
    { accessorKey: 'assignment.title', header: 'Assignment', cell: (info) => <span>{info.row.original.assignment?.title || 'N/A'}</span> },
    { accessorKey: 'submittedAt', header: 'Submitted At', cell: (info) => <span>{new Date(info.getValue() as string).toLocaleString()}</span> },
    {
      accessorKey: 'score',
      header: 'Score',
      cell: (info) => (
        <span className="font-semibold text-slate-200">
          {info.getValue() !== undefined ? `${info.getValue()}/${info.row.original.assignment?.maxScore ?? 100}` : 'Not graded'}
        </span>
      ),
    },
    { accessorKey: 'status', header: 'Status', cell: (info) => <StatusBadge status={info.getValue() as string} /> },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          {info.row.original.status !== 'GRADED' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleGrade(info.row.original.id)}
              className="border-blue-600 text-blue-500 hover:bg-blue-600/10 text-xs px-2 h-7"
            >
              Grade
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white uppercase tracking-wider">Submissions Grading</h1>
        <p className="text-sm text-slate-400 font-medium">Evaluate student homework submissions, record scores, and send feedback remarks.</p>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading submissions...</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default SubmissionsPage;
