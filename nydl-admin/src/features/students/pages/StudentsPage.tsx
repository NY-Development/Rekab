import { useStudents, useStudentMutations } from '@/hooks/useStudents';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ColumnDef } from '@tanstack/react-table';
import { StudentProfile } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash, Shield } from 'lucide-react';
import { toast } from 'sonner';

export function StudentsPage() {
  const { data, isLoading } = useStudents();
  const { deleteStudent } = useStudentMutations();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student profile?')) return;
    try {
      await deleteStudent(id);
      toast.success('Student deleted successfully');
    } catch {
      toast.error('Failed to delete student');
    }
  };

  const columns: ColumnDef<StudentProfile>[] = [
    { accessorKey: 'studentCode', header: 'Student Code', cell: (info) => <span className="font-mono text-xs text-white">{info.getValue() as string}</span> },
    { accessorKey: 'user.name', header: 'Name', cell: (info) => <span className="font-semibold text-white">{info.row.original.user?.name || 'N/A'}</span> },
    { accessorKey: 'user.email', header: 'Email', cell: (info) => <span>{info.row.original.user?.email || 'N/A'}</span> },
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
      <div>
        <h1 className="text-xl font-bold text-white uppercase tracking-wider">Student Registry</h1>
        <p className="text-sm text-slate-400 font-medium">Track student registration codes, performance indices, and risk assessment indicators.</p>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading student registry...</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default StudentsPage;
