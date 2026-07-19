import { z } from 'zod';
import { useState } from 'react';
import { useStudents, useStudentMutations } from '@/hooks/useStudents';
import { useUsers } from '@/hooks/useUsers';
import { DataTable } from '@/components/common/DataTable';
import { EntityFormDialog } from '@/components/common/EntityFormDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { RowDetailDialog } from '@/components/common/RowDetailDialog';
import { ColumnDef } from '@tanstack/react-table';
import { StudentProfile, User } from '@/types';
import { Button } from '@/components/ui/button';
import { getPopulated } from '@/utils/registration';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

const createStudentSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  studentCode: z.string().min(3, 'Student code must be at least 3 characters'),
  currentLevel: z.string().optional(),
});

export function StudentsPage() {
  const { data, isLoading, isError } = useStudents();
  const { createStudent, deleteStudent } = useStudentMutations();
  const [detail, setDetail] = useState<StudentProfile | null>(null);
  const { data: studentUsersData } = useUsers({ role: 'STUDENT', limit: 100 });
  const userOptions = (studentUsersData?.docs || []).map((u) => ({ value: u.id, label: `${u.name} (${u.email})` }));

  const handleDelete = async (id: string) => {
    try {
      await deleteStudent(id);
      toast.success('Student deleted successfully');
    } catch {
      toast.error('Failed to delete student');
    }
  };

  const handleCreate = async (values: z.infer<typeof createStudentSchema>) => {
    try {
      await createStudent(values);
      toast.success('Student profile created successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create student profile');
      throw err;
    }
  };

  const columns: ColumnDef<StudentProfile>[] = [
    { accessorKey: 'studentCode', header: 'Student Code', cell: (info) => <span className="font-mono text-xs text-white">{info.getValue() as string}</span> },
    { id: 'name', header: 'Name', cell: (info) => <span className="font-semibold text-white">{getPopulated<User>(info.row.original.userId)?.name || 'N/A'}</span> },
    { id: 'email', header: 'Email', cell: (info) => <span>{getPopulated<User>(info.row.original.userId)?.email || 'N/A'}</span> },
    { accessorKey: 'currentLevel', header: 'Current Level' },
    {
      accessorKey: 'healthScore',
      header: 'Health Score',
      cell: (info) => {
        const val = info.getValue() as number;
        let color = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        if (val < 50) color = 'text-rose-400 bg-rose-500/10 border-rose-500/20';
        else if (val < 75) color = 'text-amber-400 bg-amber-500/10 border-amber-500/20';
        return (
          <span className={`px-2 py-0.5 border text-xs font-bold rounded-lg ${color}`}>
            {val}%
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <ConfirmDialog
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8"
              />
            }
            title="Delete Student Profile?"
            description="This action cannot be undone. The student profile and all associated records will be permanently removed."
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
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Student Registry</h1>
          <p className="text-sm text-slate-400 font-medium">Track student registration codes, performance indices, and risk assessment indicators.</p>
        </div>
        <EntityFormDialog
          triggerLabel="Add Student"
          title="Create Student Profile"
          schema={createStudentSchema}
          fields={[
            { name: 'userId', label: 'User', type: 'select', placeholder: 'Select a student account', options: userOptions },
            { name: 'studentCode', label: 'Student Code', placeholder: 'STU-123456' },
            { name: 'currentLevel', label: 'Current Level', placeholder: 'Beginner' },
          ]}
          onSubmit={handleCreate}
        />
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading student registry...</div>
      ) : isError ? (
        <div className="text-rose-400">Failed to load students. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} onRowClick={(r) => setDetail(r)} />
      )}

      <RowDetailDialog
        open={!!detail}
        onClose={() => setDetail(null)}
        title={getPopulated<User>(detail?.userId)?.name || 'Student Detail'}
        subtitle={getPopulated<User>(detail?.userId)?.email}
        data={detail as any}
        hide={['id', 'userId']}
      />
    </div>
  );
}

export default StudentsPage;
