import { useAttendance, useAttendanceMutations } from '@/hooks/useAttendance';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ColumnDef } from '@tanstack/react-table';
import { Attendance } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export function AttendancePage() {
  const { data, isLoading } = useAttendance();

  const columns: ColumnDef<Attendance>[] = [
    { accessorKey: 'student.user.name', header: 'Student', cell: (info) => <span className="font-semibold text-white">{info.row.original.student?.user?.name || 'N/A'}</span> },
    { accessorKey: 'session.title', header: 'Lecture / Session', cell: (info) => <span>{info.row.original.session?.title || 'N/A'}</span> },
    { accessorKey: 'status', header: 'Status', cell: (info) => <StatusBadge status={info.getValue() as string} /> },
    {
      accessorKey: 'joinedAt',
      header: 'Joined At',
      cell: (info) => <span>{info.getValue() ? new Date(info.getValue() as string).toLocaleTimeString() : '-'}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Attendance Register</h1>
          <p className="text-sm text-slate-400 font-medium">Log session attendance metrics, view tardiness analytics, and mark absences.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          <Plus className="mr-2 h-4 w-4" /> Bulk Mark Attendance
        </Button>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading attendance...</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default AttendancePage;
