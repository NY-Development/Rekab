import { z } from 'zod';
import { useAssignments, useAssignmentMutations } from '@/hooks/useAssignments';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EntityFormDialog } from '@/components/common/EntityFormDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ColumnDef } from '@tanstack/react-table';
import { Assignment } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

const createAssignmentSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  cohortId: z.string().min(1, 'Cohort ID is required'),
  moduleId: z.string().min(1, 'Module ID is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  maxPoints: z.coerce.number().int().min(1, 'Max points must be at least 1'),
  dueDate: z.string().min(1, 'Due date is required'),
});

export function AssignmentsPage() {
  const { data, isLoading, isError } = useAssignments();
  const { createAssignment, deleteAssignment } = useAssignmentMutations();

  const handleDelete = async (id: string) => {
    try {
      await deleteAssignment(id);
      toast.success('Assignment deleted successfully');
    } catch {
      toast.error('Failed to delete assignment');
    }
  };

  const handleCreate = async (values: z.infer<typeof createAssignmentSchema>) => {
    try {
      await createAssignment({
        ...values,
        dueDate: new Date(values.dueDate).toISOString(),
      });
      toast.success('Assignment created successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create assignment');
      throw err;
    }
  };

  const columns: ColumnDef<Assignment>[] = [
    { accessorKey: 'title', header: 'Title', cell: (info) => <span className="font-bold text-white">{info.getValue() as string}</span> },
    { accessorKey: 'course.title', header: 'Course', cell: (info) => <span>{info.row.original.course?.title || 'N/A'}</span> },
    { accessorKey: 'maxScore', header: 'Max Score', cell: (info) => <span className="font-mono text-slate-350">{info.getValue() as number} pts</span> },
    { accessorKey: 'dueDate', header: 'Due Date', cell: (info) => <span>{new Date(info.getValue() as string).toLocaleDateString()}</span> },
    { accessorKey: 'status', header: 'Status', cell: (info) => <StatusBadge status={info.getValue() as string} /> },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          <ConfirmDialog
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8"
              />
            }
            title="Delete Assignment?"
            description="This action cannot be undone. The assignment and any associated submissions will be permanently removed."
            onConfirm={() => handleDelete(info.row.original.id)}
          >
            <Trash className="h-4 w-4" />
          </ConfirmDialog>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Assignments Manager</h1>
          <p className="text-sm text-slate-400 font-medium">Issue assignments, specify grading rubrics, set deadlines, and manage publish states.</p>
        </div>
        <EntityFormDialog
          triggerLabel="Create Assignment"
          title="Create New Assignment"
          schema={createAssignmentSchema}
          fields={[
            { name: 'courseId', label: 'Course ID', placeholder: 'Mongo Course ID' },
            { name: 'cohortId', label: 'Cohort ID', placeholder: 'Mongo Cohort ID' },
            { name: 'moduleId', label: 'Module ID', placeholder: 'Module identifier' },
            { name: 'title', label: 'Title', placeholder: 'Build a REST API' },
            { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Assignment instructions...' },
            { name: 'maxPoints', label: 'Max Points', type: 'number', placeholder: '100' },
            { name: 'dueDate', label: 'Due Date', type: 'datetime' },
          ]}
          onSubmit={handleCreate}
        />
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading assignments...</div>
      ) : isError ? (
        <div className="text-rose-400">Failed to load assignments. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default AssignmentsPage;
