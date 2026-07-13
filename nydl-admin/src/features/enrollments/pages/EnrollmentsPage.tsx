import { useEnrollments, useEnrollmentMutations } from '@/hooks/useEnrollments';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ColumnDef } from '@tanstack/react-table';
import { Enrollment } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash, ClipboardCheck } from 'lucide-react';
import { toast } from 'sonner';

export function EnrollmentsPage() {
  const { data, isLoading, isError } = useEnrollments();
  const { deleteEnrollment, updateEnrollment } = useEnrollmentMutations();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to drop this enrollment?')) return;
    try {
      await deleteEnrollment(id);
      toast.success('Enrollment dropped successfully');
    } catch {
      toast.error('Failed to drop enrollment');
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await updateEnrollment({ id, data: { status: 'ACTIVE' } });
      toast.success('Enrollment activated successfully');
    } catch {
      toast.error('Failed to activate enrollment');
    }
  };

  const columns: ColumnDef<Enrollment>[] = [
    { accessorKey: 'student.user.name', header: 'Student', cell: (info) => <span className="font-semibold text-white">{info.row.original.student?.user?.name || 'N/A'}</span> },
    { accessorKey: 'course.title', header: 'Course', cell: (info) => <span>{info.row.original.course?.title || 'N/A'}</span> },
    { accessorKey: 'cohort.name', header: 'Cohort', cell: (info) => <span>{info.row.original.cohort?.name || 'N/A'}</span> },
    {
      accessorKey: 'progress',
      header: 'Progress',
      cell: (info) => <span className="font-mono">{info.getValue() as number}%</span>,
    },
    { accessorKey: 'status', header: 'Status', cell: (info) => <StatusBadge status={info.getValue() as string} /> },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          {info.row.original.status === 'PENDING' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleApprove(info.row.original.id)}
              className="border-blue-600 text-blue-500 hover:bg-blue-600/10 text-xs px-2 h-7"
            >
              Approve
            </Button>
          )}
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
        <h1 className="text-xl font-bold text-white uppercase tracking-wider">Enrollment Ledger</h1>
        <p className="text-sm text-slate-400 font-medium">Verify pending course requests, student course progression trackers, and dropouts.</p>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading enrollment logs...</div>
      ) : isError ? (
        <div className="text-rose-400">Failed to load enrollments. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default EnrollmentsPage;
