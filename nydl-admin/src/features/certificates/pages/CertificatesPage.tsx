import { z } from 'zod';
import { useCertificates, useCertificateMutations } from '@/hooks/useCertificates';
import { DataTable } from '@/components/common/DataTable';
import { EntityFormDialog } from '@/components/common/EntityFormDialog';
import { ColumnDef } from '@tanstack/react-table';
import { Certificate } from '@/types';
import { toast } from 'sonner';

const issueCertificateSchema = z.object({
  studentId: z.string().min(1, 'Student ID is required'),
  courseId: z.string().min(1, 'Course ID is required'),
});

export function CertificatesPage() {
  const { data, isLoading, isError } = useCertificates();
  const { issueCertificate } = useCertificateMutations();

  const handleIssue = async (values: z.infer<typeof issueCertificateSchema>) => {
    try {
      await issueCertificate(values);
      toast.success('Certificate issued successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to issue certificate');
      throw err;
    }
  };

  const columns: ColumnDef<Certificate>[] = [
    { accessorKey: 'certificateNumber', header: 'Certificate Number', cell: (info) => <span className="font-mono text-white text-xs">{info.getValue() as string}</span> },
    { accessorKey: 'student.user.name', header: 'Graduate', cell: (info) => <span className="font-semibold text-slate-200">{info.row.original.student?.user?.name || 'N/A'}</span> },
    { accessorKey: 'course.title', header: 'Course', cell: (info) => <span>{info.row.original.course?.title || 'N/A'}</span> },
    {
      accessorKey: 'issuedAt',
      header: 'Issued Date',
      cell: (info) => <span>{new Date(info.getValue() as string).toLocaleDateString()}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Certificates Registry</h1>
          <p className="text-sm text-slate-400 font-medium">Log verified course graduate credentials, search certificate numbers, and issue records.</p>
        </div>
        <EntityFormDialog
          triggerLabel="Issue Certificate"
          title="Issue Certificate"
          schema={issueCertificateSchema}
          fields={[
            { name: 'studentId', label: 'Student ID', placeholder: 'Mongo Student ID' },
            { name: 'courseId', label: 'Course ID', placeholder: 'Mongo Course ID' },
          ]}
          onSubmit={handleIssue}
          submitLabel="Issue"
        />
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading certificates...</div>
      ) : isError ? (
        <div className="text-rose-400">Failed to load certificates. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default CertificatesPage;
