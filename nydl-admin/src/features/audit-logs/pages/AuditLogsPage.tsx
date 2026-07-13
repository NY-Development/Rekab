import { useAuditLogs } from '@/hooks/useAuditLogs';
import { DataTable } from '@/components/common/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { AuditLog } from '@/types';

export function AuditLogsPage() {
  const { data, isLoading, isError } = useAuditLogs();

  const columns: ColumnDef<AuditLog>[] = [
    { accessorKey: 'action', header: 'Action', cell: (info) => <span className="font-bold text-slate-200">{info.getValue() as string}</span> },
    { accessorKey: 'user.name', header: 'Performed By', cell: (info) => <span>{info.row.original.user?.name || 'System / Guest'}</span> },
    { accessorKey: 'entity', header: 'Target Domain' },
    { accessorKey: 'ipAddress', header: 'Client IP', cell: (info) => <span className="font-mono text-xs">{info.getValue() as string}</span> },
    {
      accessorKey: 'createdAt',
      header: 'Timestamp',
      cell: (info) => <span>{new Date(info.getValue() as string).toLocaleString()}</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white uppercase tracking-wider">Audit Security Trails</h1>
        <p className="text-sm text-slate-400 font-medium">Verify system activity logs, admin updates audit history, and security trails.</p>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading audit history...</div>
      ) : isError ? (
        <div className="text-rose-400">Failed to load audit logs. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default AuditLogsPage;
