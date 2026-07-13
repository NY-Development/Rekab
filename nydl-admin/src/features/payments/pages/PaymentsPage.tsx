import { usePayments, usePaymentMutations } from '@/hooks/usePayments';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ColumnDef } from '@tanstack/react-table';
import { Payment } from '@/types';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

export function PaymentsPage() {
  const { data, isLoading, isError } = usePayments();
  const { verifyPayment } = usePaymentMutations();

  const handleVerify = async (id: string, status: 'VERIFIED' | 'REJECTED') => {
    try {
      await verifyPayment({ id, data: { status, notes: `Verified by admin` } });
      toast.success(`Payment marked as ${status.toLowerCase()}`);
    } catch {
      toast.error('Failed to update payment status');
    }
  };

  const columns: ColumnDef<Payment>[] = [
    { accessorKey: 'transactionRef', header: 'Reference', cell: (info) => <span className="font-mono text-white text-xs">{info.getValue() as string}</span> },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: (info) => <span className="font-semibold text-slate-200">${info.getValue() as number} {info.row.original.currency}</span>,
    },
    { accessorKey: 'method', header: 'Method' },
    { accessorKey: 'status', header: 'Status', cell: (info) => <StatusBadge status={info.getValue() as string} /> },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: (info) => <span>{new Date(info.getValue() as string).toLocaleDateString()}</span>,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          {info.row.original.status === 'PENDING' && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleVerify(info.row.original.id, 'VERIFIED')}
                className="text-emerald-500 hover:bg-emerald-500/10 h-8 w-8"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleVerify(info.row.original.id, 'REJECTED')}
                className="text-rose-500 hover:bg-rose-500/10 h-8 w-8"
              >
                <XCircle className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white uppercase tracking-wider">Payment Verification</h1>
        <p className="text-sm text-slate-400 font-medium">Approve bank transaction receipts, verify manual reference numbers, and review tuition records.</p>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading payment ledger...</div>
      ) : isError ? (
        <div className="text-rose-400">Failed to load payments. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default PaymentsPage;
