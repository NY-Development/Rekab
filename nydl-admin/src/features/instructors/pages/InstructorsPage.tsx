import { z } from 'zod';
import { useInstructors, useInstructorMutations } from '@/hooks/useInstructors';
import { DataTable } from '@/components/common/DataTable';
import { EntityFormDialog } from '@/components/common/EntityFormDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ColumnDef } from '@tanstack/react-table';
import { Instructor } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

const createInstructorSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  specialization: z.string().optional(),
  yearsExperience: z.coerce.number().int().min(0).optional(),
  bio: z.string().optional(),
});

export function InstructorsPage() {
  const { data, isLoading, isError } = useInstructors();
  const { createInstructor, deleteInstructor } = useInstructorMutations();

  const handleDelete = async (id: string) => {
    try {
      await deleteInstructor(id);
      toast.success('Instructor deleted successfully');
    } catch {
      toast.error('Failed to delete instructor');
    }
  };

  const handleCreate = async (values: z.infer<typeof createInstructorSchema>) => {
    try {
      await createInstructor(values);
      toast.success('Instructor added successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add instructor');
      throw err;
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
          <ConfirmDialog
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8"
              />
            }
            title="Delete Instructor?"
            description="This action cannot be undone. The instructor profile and course assignments will be permanently removed."
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
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Instructor Roster</h1>
          <p className="text-sm text-slate-400 font-medium">Manage teacher accounts, course specializations, and professional bios.</p>
        </div>
        <EntityFormDialog
          triggerLabel="Add Instructor"
          title="Add New Instructor"
          schema={createInstructorSchema}
          fields={[
            { name: 'userId', label: 'User ID', placeholder: 'Mongo User ID of the instructor account' },
            { name: 'specialization', label: 'Specialization', placeholder: 'Frontend Engineering' },
            { name: 'yearsExperience', label: 'Years of Experience', type: 'number', placeholder: '5' },
            { name: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Short professional bio...' },
          ]}
          onSubmit={handleCreate}
        />
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading instructor roster...</div>
      ) : isError ? (
        <div className="text-rose-400">Failed to load instructors. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default InstructorsPage;
