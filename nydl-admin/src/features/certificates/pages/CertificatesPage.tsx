import { useCertificates, useCertificateMutations } from '@/hooks/useCertificates';
import { DataTable } from '@/components/common/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Certificate } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Award } from 'lucide-react';
import { toast } from 'sonner';

export function CertificatesPage() {
  const { data, isLoading, isError } = useCertificates();
  const { issueCertificate } = useCertificateMutations();

  const handleIssue = async () => {
    const studentId = prompt('Enter Student ID:');
    const courseId = prompt('Enter Course ID:');
    if (!studentId || !courseId) return;

    try {
      await issueCertificate({ studentId, courseId });
      toast.success('Certificate issued successfully');
    } catch {
      toast.error('Failed to issue certificate');
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
        <Button onClick={handleIssue} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          <Plus className="mr-2 h-4 w-4" /> Issue Certificate
        </Button>
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
