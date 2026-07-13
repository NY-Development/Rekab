import { z } from 'zod';
import { useMentors, useMentorMutations } from '@/hooks/useMentors';
import { DataTable } from '@/components/common/DataTable';
import { EntityFormDialog } from '@/components/common/EntityFormDialog';
import { ColumnDef } from '@tanstack/react-table';
import { Mentor } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

const createMentorSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  specialization: z.string().optional(),
  availability: z.string().optional(),
  bio: z.string().optional(),
});

export function MentorsPage() {
  const { data, isLoading, isError } = useMentors();
  const { createMentor, deleteMentor } = useMentorMutations();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this mentor?')) return;
    try {
      await deleteMentor(id);
      toast.success('Mentor deleted successfully');
    } catch {
      toast.error('Failed to delete mentor');
    }
  };

  const handleCreate = async (values: z.infer<typeof createMentorSchema>) => {
    try {
      await createMentor(values);
      toast.success('Mentor added successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add mentor');
      throw err;
    }
  };

  const columns: ColumnDef<Mentor>[] = [
    { accessorKey: 'user.name', header: 'Name', cell: (info) => <span className="font-semibold text-white">{info.row.original.user?.name || 'N/A'}</span> },
    { accessorKey: 'user.email', header: 'Email', cell: (info) => <span>{info.row.original.user?.email || 'N/A'}</span> },
    { accessorKey: 'expertise', header: 'Expertise' },
    {
      accessorKey: 'assignedTeams',
      header: 'Assigned Teams',
      cell: (info) => {
        const list = info.getValue() as string[];
        return <span className="text-slate-400 font-mono text-xs">{list?.length || 0} teams</span>;
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
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Mentor Registry</h1>
          <p className="text-sm text-slate-400 font-medium">Manage support mentors, student success advisors, and assigned project teams.</p>
        </div>
        <EntityFormDialog
          triggerLabel="Add Mentor"
          title="Add New Mentor"
          schema={createMentorSchema}
          fields={[
            { name: 'userId', label: 'User ID', placeholder: 'Mongo User ID of the mentor account' },
            { name: 'specialization', label: 'Specialization', placeholder: 'Career Coaching' },
            { name: 'availability', label: 'Availability', placeholder: 'Weekday evenings' },
            { name: 'bio', label: 'Bio', type: 'textarea', placeholder: 'Short professional bio...' },
          ]}
          onSubmit={handleCreate}
        />
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading mentor registry...</div>
      ) : isError ? (
        <div className="text-rose-400">Failed to load mentors. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default MentorsPage;
