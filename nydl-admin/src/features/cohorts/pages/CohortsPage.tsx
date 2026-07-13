import { z } from 'zod';
import { useCohorts, useCohortMutations } from '@/hooks/useCohorts';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EntityFormDialog } from '@/components/common/EntityFormDialog';
import { ColumnDef } from '@tanstack/react-table';
import { Cohort } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

const createCohortSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  name: z.string().min(3, 'Cohort name must be at least 3 characters'),
  code: z.string().min(3, 'Cohort code must be at least 3 characters'),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Start date is required'),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'End date is required'),
  maxCapacity: z.coerce.number().int().positive('Max capacity must be a positive number'),
  instructorId: z.string().min(1, 'Instructor ID is required'),
  schedule: z.string().min(3, 'Schedule description is required'),
});

export function CohortsPage() {
  const { data, isLoading, isError } = useCohorts();
  const { createCohort, deleteCohort } = useCohortMutations();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cohort?')) return;
    try {
      await deleteCohort(id);
      toast.success('Cohort deleted successfully');
    } catch {
      toast.error('Failed to delete cohort');
    }
  };

  const handleCreate = async (values: z.infer<typeof createCohortSchema>) => {
    try {
      const { instructorId, ...rest } = values;
      await createCohort({ ...rest, instructors: [instructorId] });
      toast.success('Cohort created successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create cohort');
      throw err;
    }
  };

  const columns: ColumnDef<Cohort>[] = [
    { accessorKey: 'name', header: 'Cohort Name', cell: (info) => <span className="font-bold text-white">{info.getValue() as string}</span> },
    { accessorKey: 'course.title', header: 'Course', cell: (info) => <span>{info.row.original.course?.title || 'N/A'}</span> },
    { accessorKey: 'startDate', header: 'Start Date', cell: (info) => <span>{new Date(info.getValue() as string).toLocaleDateString()}</span> },
    { accessorKey: 'endDate', header: 'End Date', cell: (info) => <span>{new Date(info.getValue() as string).toLocaleDateString()}</span> },
    { accessorKey: 'enrolledCount', header: 'Students', cell: (info) => <span>{info.getValue() as number} / {info.row.original.capacity}</span> },
    { accessorKey: 'status', header: 'Status', cell: (info) => <StatusBadge status={info.getValue() as string} /> },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(info.row.original.id)}
            className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Cohort Management</h1>
          <p className="text-sm text-slate-400 font-medium">Create and oversee study groups, start/end timelines, capacities, and syllabus enrollment states.</p>
        </div>
        <EntityFormDialog
          triggerLabel="Create Cohort"
          title="Create New Cohort"
          schema={createCohortSchema}
          fields={[
            { name: 'courseId', label: 'Course ID', placeholder: 'Mongo Course ID' },
            { name: 'name', label: 'Cohort Name', placeholder: 'Fall 2026 - Batch A' },
            { name: 'code', label: 'Cohort Code', placeholder: 'NYDL-2026-FS-A' },
            { name: 'startDate', label: 'Start Date', type: 'date' },
            { name: 'endDate', label: 'End Date', type: 'date' },
            { name: 'maxCapacity', label: 'Max Capacity', type: 'number', placeholder: '30' },
            { name: 'instructorId', label: 'Instructor User ID', placeholder: 'Mongo User ID' },
            { name: 'schedule', label: 'Schedule', placeholder: 'Mon, Wed 7:00 PM - 9:00 PM EST' },
          ]}
          onSubmit={handleCreate}
        />
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading cohorts...</div>
      ) : isError ? (
        <div className="text-rose-400">Failed to load cohorts. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default CohortsPage;
