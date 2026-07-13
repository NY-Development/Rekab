import { useCohorts, useCohortMutations } from '@/hooks/useCohorts';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ColumnDef } from '@tanstack/react-table';
import { Cohort } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Trash, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export function CohortsPage() {
  const { data, isLoading } = useCohorts();
  const { deleteCohort } = useCohortMutations();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this cohort?')) return;
    try {
      await deleteCohort(id);
      toast.success('Cohort deleted successfully');
    } catch {
      toast.error('Failed to delete cohort');
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
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          <Plus className="mr-2 h-4 w-4" /> Create Cohort
        </Button>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading cohorts...</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default CohortsPage;
