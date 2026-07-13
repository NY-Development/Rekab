import { useHealthScores, useHealthScoreMutations } from '@/hooks/useHealthScores';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ColumnDef } from '@tanstack/react-table';
import { HealthScore } from '@/types';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export function RiskStudentsPage() {
  const { data, isLoading, isError } = useHealthScores();
  const { recalculateHealthScore } = useHealthScoreMutations();

  const handleRecalculate = async (studentId: string) => {
    try {
      await recalculateHealthScore(studentId);
      toast.success('Health index recalculated');
    } catch {
      toast.error('Failed to recalculate index');
    }
  };

  const columns: ColumnDef<HealthScore>[] = [
    { accessorKey: 'student.studentCode', header: 'Student Code', cell: (info) => <span className="font-mono text-xs text-white">{info.row.original.student?.studentCode}</span> },
    { accessorKey: 'student.user.name', header: 'Name', cell: (info) => <span className="font-semibold text-slate-200">{info.row.original.student?.user?.name || 'N/A'}</span> },
    {
      accessorKey: 'score',
      header: 'Health Score',
      cell: (info) => {
        const val = info.getValue() as number;
        let color = 'text-emerald-400 font-bold';
        if (val < 50) color = 'text-rose-400 font-bold';
        else if (val < 75) color = 'text-amber-400 font-bold';
        return <span className={color}>{val}%</span>;
      },
    },
    { accessorKey: 'riskLevel', header: 'Risk Status', cell: (info) => <StatusBadge status={info.getValue() as string} /> },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleRecalculate(info.row.original.studentId)}
            className="text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 h-8 w-8"
            title="Recalculate score"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-rose-500" />
          Risk Assessment Board
        </h1>
        <p className="text-sm text-slate-400 font-medium">Verify student academic risks, attendance failures, low score alerts, and triggers.</p>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading risk dashboard...</div>
      ) : isError ? (
        <div className="text-rose-400">Failed to load risk data. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default RiskStudentsPage;
