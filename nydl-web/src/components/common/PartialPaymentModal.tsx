import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useSubmitPayment } from '@/hooks/usePayments';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Enrollment } from '@/types';

type PaymentMethod = 'CBE' | 'TELEBIRR' | 'BOA' | 'CBEBIRR' | 'MPESA' | 'DASHEN' | 'AWASH' | 'SIINQEE' | 'KAAFI_EBIRR' | 'CHAPA' | 'BANK_TRANSFER' | 'CASH';

interface PartialPaymentModalProps {
  enrollment: Enrollment;
  onClose: () => void;
  /** Called after a successful payment submission */
  onSuccess?: () => void;
  /** If true, user cannot close/cancel out of this modal */
  mandatory?: boolean;
}

/**
 * Reusable modal for submitting remaining payment on a partially-paid enrollment.
 * Used by DashboardPage, EnrollmentPage, and EnrollmentGate.
 */
export function PartialPaymentModal({ enrollment, onClose, onSuccess, mandatory = false }: PartialPaymentModalProps) {
  const queryClient = useQueryClient();
  const submitPaymentMutation = useSubmitPayment();
  const [method, setMethod] = useState<PaymentMethod>('CBE');
  const [txRef, setTxRef] = useState('');

  const course = enrollment.courseId;
  const courseName = course?.title || 'your course';
  const coursePrice = course?.price;
  const currency = course?.currency || 'ETB';

  const handleSubmit = async () => {
    try {
      const res = await submitPaymentMutation.mutateAsync({
        enrollmentId: enrollment.id,
        paymentMethod: method,
        transactionReference: txRef,
      });

      toast.success(
        res.data?.payment?.status === 'VERIFIED'
          ? 'Verification successful! Full tuition paid off.'
          : 'Partial payment verification was successful!'
      );

      setTxRef('');
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      onSuccess?.();
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Payment submission failed.';
      toast.error(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-lg relative space-y-4 text-left">
        {!mandatory && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        )}

        <div className="space-y-1">
          <h3 className="text-lg font-bold text-foreground">Submit Remaining Payment</h3>
          <p className="text-xs text-muted-foreground">
            Course: <span className="font-semibold text-foreground">{courseName}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Remaining due: <span className="font-semibold text-primary">{(course?.price ?? 0) - (enrollment.amountPaid ?? 0)} {currency}</span>
          </p>
          {coursePrice && enrollment.amountPaid !== undefined && (
            <p className="text-[10px] text-muted-foreground mt-1">
              Total fee: {coursePrice} {currency} · Paid so far: {enrollment.amountPaid} {currency}
            </p>
          )}
          <p className="text-[10px] text-muted-foreground mt-1">
            Transfer the due amount to CBE 1000403196928 (YAMLAK NEGASH DUGO).
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
              Payment Method *
            </label>
            <Select value={method} onValueChange={(v) => setMethod(v as PaymentMethod)}>
              <SelectTrigger className="w-full bg-background text-foreground border-border font-sans text-sm">
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent className="bg-card text-foreground border-border z-120">
                <SelectItem value="CBE">Commercial Bank of Ethiopia (CBE)</SelectItem>
                <SelectItem value="TELEBIRR">Telebirr</SelectItem>
                <SelectItem value="BOA">Bank of Abyssinia (BOA)</SelectItem>
                <SelectItem value="CBEBIRR">CBE Birr</SelectItem>
                <SelectItem value="MPESA">M-Pesa</SelectItem>
                <SelectItem value="DASHEN">Dashen Bank</SelectItem>
                <SelectItem value="AWASH">Awash Bank</SelectItem>
                <SelectItem value="SIINQEE">Siinqee Bank</SelectItem>
                <SelectItem value="KAAFI_EBIRR">Kaafi eBirr</SelectItem>
                <SelectItem value="CHAPA">Chapa</SelectItem>
                <SelectItem value="BANK_TRANSFER">Bank Transfer (Other)</SelectItem>
                <SelectItem value="CASH">Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-1.5">
              Transaction Reference ID *
            </label>
            <input
              placeholder="e.g. FT26071..."
              value={txRef}
              onChange={(e) => setTxRef(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded focus:ring-1 focus:ring-primary text-sm text-foreground"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          {!mandatory && (
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          )}
          <Button
            type="button"
            className={mandatory ? 'w-full' : ''}
            disabled={!txRef.trim() || submitPaymentMutation.isPending}
            onClick={handleSubmit}
          >
            {submitPaymentMutation.isPending ? 'Verifying...' : 'Submit Payment'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default PartialPaymentModal;
