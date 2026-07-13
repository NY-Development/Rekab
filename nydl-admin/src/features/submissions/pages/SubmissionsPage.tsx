import { z } from 'zod';
import { useSubmissions, useSubmissionMutations } from '@/hooks/useSubmissions';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EntityFormDialog } from '@/components/common/EntityFormDialog';
import { ColumnDef } from '@tanstack/react-table';
import { Submission } from '@/types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const gradeSubmissionSchema = z.object({
  points: z.coerce.number().min(0, 'Score must be zero or greater'),
  feedback: z.string().optional(),
});

export function SubmissionsPage() {
  const { data, isLoading, isError } = useSubmissions();
  const { gradeSubmission } = useSubmissionMutations();
  const submissions = data?.submissions || [];

  const handleGrade = async (id: string, values: z.infer<typeof gradeSubmissionSchema>) => {
    try {
      await gradeSubmission({ id, data: { points: values.points, feedback: values.feedback || '' } });
      toast.success('Graded successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to submit grade');
      throw err;
    }
  };

  const columns: ColumnDef<Submission>[] = [
    { accessorKey: 'studentName', header: 'Student', cell: (info) => <span className="font-semibold text-white">{info.getValue() as string || 'N/A'}</span> },
    { accessorKey: 'assignmentTitle', header: 'Assignment', cell: (info) => <span>{info.getValue() as string || 'N/A'}</span> },
    { accessorKey: 'submittedAt', header: 'Submitted At', cell: (info) => <span>{new Date(info.getValue() as string).toLocaleString()}</span> },
    {
      accessorKey: 'points',
      header: 'Score',
      cell: (info) => (
        <span className="font-semibold text-slate-200">
          {info.getValue() !== undefined ? `${info.getValue()}/${info.row.original.assignmentMaxScore ?? 100}` : 'Not graded'}
        </span>
      ),
    },
    { accessorKey: 'status', header: 'Status', cell: (info) => <StatusBadge status={info.getValue() as string} /> },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          {info.row.original.status !== 'graded' && (
            <EntityFormDialog
              triggerLabel="Grade"
              title="Grade Submission"
              schema={gradeSubmissionSchema}
              fields={[
                { name: 'points', label: 'Score', type: 'number', placeholder: `Out of ${info.row.original.assignmentMaxScore ?? 100}` },
                { name: 'feedback', label: 'Feedback', type: 'textarea', placeholder: 'Optional feedback for the student...' },
              ]}
              onSubmit={(values) => handleGrade(info.row.original.id, values)}
              submitLabel="Submit Grade"
              trigger={
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-600 text-blue-500 hover:bg-blue-600/10 text-xs px-2 h-7"
                />
              }
              triggerContent="Grade"
            />
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
      ) : isError ? (
        <div className="text-rose-400">Failed to load submissions. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={submissions} pageCount={1} />
      )}
    </div>
  );
}

export default SubmissionsPage;
