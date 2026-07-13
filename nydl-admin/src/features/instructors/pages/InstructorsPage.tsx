import { useInstructors, useInstructorMutations } from '@/hooks/useInstructors';
import { DataTable } from '@/components/common/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Instructor } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Trash, BookUser } from 'lucide-react';
import { toast } from 'sonner';

export function InstructorsPage() {
  const { data, isLoading } = useInstructors();
  const { deleteInstructor } = useInstructorMutations();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this instructor?')) return;
    try {
      await deleteInstructor(id);
      toast.success('Instructor deleted successfully');
    } catch {
      toast.error('Failed to delete instructor');
    }
  };

  const columns: ColumnDef<Instructor>[] = [
    { accessorKey: 'user.name', header: 'Name', cell: (info) => <span className="font-semibold text-white">{info.row.original.user?.name || 'N/A'}</span> },
    { accessorKey: 'user.email', header: 'Email', cell: (info) => <span>{info.row.original.user?.email || 'N/A'}</span> },
    { accessorKey: 'specialization', header: 'Specialization' },
    {
      accessorKey: 'assignedCourses',
      header: 'Assigned Courses',
      cell: (info) => {
        const list = info.getValue() as string[];
        return <span className="text-slate-400 font-mono text-xs">{list?.length || 0} courses</span>;
      },
    },
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
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Instructor Roster</h1>
          <p className="text-sm text-slate-400 font-medium">Manage teacher accounts, course specializations, and professional bios.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          <Plus className="mr-2 h-4 w-4" /> Add Instructor
        </Button>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading instructor roster...</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default InstructorsPage;
