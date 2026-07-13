import { z } from 'zod';
import { useAttendance, useAttendanceMutations } from '@/hooks/useAttendance';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EntityFormDialog } from '@/components/common/EntityFormDialog';
import { ColumnDef } from '@tanstack/react-table';
import { Attendance } from '@/types';
import { toast } from 'sonner';

const markAttendanceSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  sessionId: z.string().min(1, 'Session ID is required'),
  enrollmentId: z.string().min(1, 'Enrollment ID is required'),
  status: z.enum(['PRESENT', 'LATE', 'ABSENT']),
});

export function AttendancePage() {
  const { data, isLoading, isError } = useAttendance();
  const { markAttendance } = useAttendanceMutations();

  const handleMark = async (values: z.infer<typeof markAttendanceSchema>) => {
    try {
      await markAttendance(values);
      toast.success('Attendance recorded successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to record attendance');
      throw err;
    }
  };

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
        <EntityFormDialog
          triggerLabel="Mark Attendance"
          title="Record Attendance"
          schema={markAttendanceSchema}
          fields={[
            { name: 'studentId', label: 'Student User ID', placeholder: 'Mongo User ID' },
            { name: 'sessionId', label: 'Session ID', placeholder: 'Mongo Session ID' },
            { name: 'enrollmentId', label: 'Enrollment ID', placeholder: 'Mongo Enrollment ID' },
            {
              name: 'status',
              label: 'Status',
              type: 'select',
              placeholder: 'Select status',
              options: [
                { value: 'PRESENT', label: 'Present' },
                { value: 'LATE', label: 'Late' },
                { value: 'ABSENT', label: 'Absent' },
              ],
            },
          ]}
          onSubmit={handleMark}
          submitLabel="Record"
        />
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading attendance...</div>
      ) : isError ? (
        <div className="text-rose-400">Failed to load attendance records. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default AttendancePage;
