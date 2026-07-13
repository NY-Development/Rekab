import { z } from 'zod';
import { useSessions, useSessionMutations } from '@/hooks/useSessions';
import { useCourses } from '@/hooks/useCourses';
import { useCohorts } from '@/hooks/useCohorts';
import { useUsers } from '@/hooks/useUsers';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EntityFormDialog } from '@/components/common/EntityFormDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ColumnDef } from '@tanstack/react-table';
import { Session } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const createSessionSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  cohortId: z.string().min(1, 'Cohort ID is required'),
  instructorId: z.string().min(1, 'Instructor ID is required'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  sessionDate: z.string().min(1, 'Session date is required'),
  duration: z.coerce.number().int().min(1, 'Duration must be at least 1 minute'),
  meetLink: z.string().url('Invalid Google Meet URL').optional().or(z.literal('')),
});

export function SessionsPage() {
  const { data, isLoading, isError } = useSessions();
  const { createSession, deleteSession } = useSessionMutations();
  const { data: coursesData } = useCourses({ limit: 100 });
  const { data: cohortsData } = useCohorts({ limit: 100 });
  const { data: instructorsData } = useUsers({ role: 'INSTRUCTOR', limit: 100 });

  const courseOptions = (coursesData?.docs || []).map((c) => ({ value: c.id, label: c.title }));
  const cohortOptions = (cohortsData?.docs || []).map((co) => ({ value: co.id, label: `${co.name}${co.course?.title ? ` (${co.course.title})` : ''}` }));
  const instructorOptions = (instructorsData?.docs || []).map((u) => ({ value: u.id, label: `${u.name} (${u.email})` }));

  const handleDelete = async (id: string) => {
    try {
      await deleteSession(id);
      toast.success('Session deleted successfully');
    } catch {
      toast.error('Failed to delete session');
    }
  };

  const handleCreate = async (values: z.infer<typeof createSessionSchema>) => {
    try {
      await createSession({
        ...values,
        sessionDate: new Date(values.sessionDate).toISOString(),
      });
      toast.success('Session scheduled successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to schedule session');
      throw err;
    }
  };

  const columns: ColumnDef<Session>[] = [
    { accessorKey: 'title', header: 'Session Title', cell: (info) => <span className="font-bold text-white">{info.getValue() as string}</span> },
    { accessorKey: 'cohort.name', header: 'Cohort', cell: (info) => <span>{info.row.original.cohort?.name || 'N/A'}</span> },
    { accessorKey: 'type', header: 'Type' },
    {
      accessorKey: 'scheduledAt',
      header: 'Scheduled At',
      cell: (info) => <span>{new Date(info.getValue() as string).toLocaleString()}</span>,
    },
    { accessorKey: 'status', header: 'Status', cell: (info) => <StatusBadge status={info.getValue() as string} /> },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          {info.row.original.meetLink && (
            <a
              href={info.row.original.meetLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 h-8 w-8 transition-colors"
              title="Open Live Meet"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <ConfirmDialog
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8"
              />
            }
            title="Delete Session?"
            description="This action cannot be undone. The scheduled session and its meet link will be permanently removed."
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
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Live Sessions</h1>
          <p className="text-sm text-slate-400 font-medium">Schedule online classroom video lectures, distribute meet links, and control streaming records.</p>
        </div>
        <EntityFormDialog
          triggerLabel="Schedule Session"
          title="Schedule New Session"
          schema={createSessionSchema}
          fields={[
            { name: 'courseId', label: 'Course', type: 'select', placeholder: 'Select a course', options: courseOptions },
            { name: 'cohortId', label: 'Cohort', type: 'select', placeholder: 'Select a cohort', options: cohortOptions },
            { name: 'instructorId', label: 'Instructor', type: 'select', placeholder: 'Select an instructor', options: instructorOptions },
            { name: 'title', label: 'Session Title', placeholder: 'Intro to React Hooks' },
            { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Optional session notes...' },
            { name: 'sessionDate', label: 'Date & Time', type: 'datetime' },
            { name: 'duration', label: 'Duration (minutes)', type: 'number', placeholder: '120' },
            { name: 'meetLink', label: 'Meet Link', type: 'url', placeholder: 'https://meet.google.com/...' },
          ]}
          onSubmit={handleCreate}
          submitLabel="Schedule"
        />
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading session timelines...</div>
      ) : isError ? (
        <div className="text-rose-400">Failed to load sessions. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default SessionsPage;
