import { z } from 'zod';
import { useAttendance, useAttendanceMutations } from '@/hooks/useAttendance';
import { useUsers } from '@/hooks/useUsers';
import { useSessions } from '@/hooks/useSessions';
import { useEnrollments } from '@/hooks/useEnrollments';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EntityFormDialog } from '@/components/common/EntityFormDialog';
import { ColumnDef } from '@tanstack/react-table';
import { Attendance } from '@/types';
import { getPopulated } from '@/utils/registration';
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
  const { data: studentsData } = useUsers({ role: 'STUDENT', limit: 100 });
  const { data: sessionsData } = useSessions({ limit: 100 });
  const { data: enrollmentsData } = useEnrollments({ limit: 100 });

  const studentOptions = (studentsData?.docs || []).map((u) => ({ value: u.id, label: `${u.name} (${u.email})` }));
  const sessionOptions = (sessionsData?.docs || []).map((s) => ({ value: s.id, label: s.title }));
  const enrollmentOptions = (enrollmentsData?.docs || []).map((e) => {
    const student = getPopulated<any>(e.studentId);
    const course = getPopulated<any>(e.courseId);
    return { value: e.id, label: `${student?.name || 'Unknown'} — ${course?.title || 'Unknown Course'}` };
  });

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
    { id: 'student', header: 'Student', cell: (info) => <span className="font-semibold text-white">{getPopulated(info.row.original.studentId)?.name || 'N/A'}</span> },
    { id: 'session', header: 'Lecture / Session', cell: (info) => <span>{getPopulated(info.row.original.sessionId)?.title || 'N/A'}</span> },
    { accessorKey: 'status', header: 'Status', cell: (info) => <StatusBadge status={info.getValue() as string} /> },
    {
      id: 'duration',
      header: 'Duration',
      cell: (info) => {
        const sec = (info.row.original as any).durationSeconds as number | undefined;
        if (!sec) return <span className="text-slate-500">—</span>;
        const m = Math.round(sec / 60);
        return <span>{m >= 60 ? `${Math.floor(m / 60)}h ${m % 60}m` : `${m}m`}</span>;
      },
    },
    {
      id: 'source',
      header: 'Source',
      cell: (info) => {
        const src = ((info.row.original as any).source as string) || 'MANUAL';
        return <span className="rounded-full border border-slate-700 bg-slate-900 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-300">{src}</span>;
      },
    },
    {
      accessorKey: 'checkInTime',
      header: 'Checked In At',
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
            { name: 'studentId', label: 'Student', type: 'select', placeholder: 'Select a student', options: studentOptions },
            { name: 'sessionId', label: 'Session', type: 'select', placeholder: 'Select a session', options: sessionOptions },
            { name: 'enrollmentId', label: 'Enrollment', type: 'select', placeholder: 'Select an enrollment', options: enrollmentOptions },
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
