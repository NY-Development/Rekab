import { useState, type ReactElement, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface ConfirmDialogProps {
  trigger: ReactElement;
  children?: ReactNode;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loadingLabel?: string;
  variant?: 'destructive' | 'default';
  onConfirm: () => Promise<unknown> | unknown;
}

export function ConfirmDialog({
  trigger,
  children,
  title,
  description,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  loadingLabel = 'Deleting...',
  variant = 'destructive',
  onConfirm,
}: ConfirmDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      setOpen(false);
    } catch {
      // caller surfaces the error via toast
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={(next) => !isLoading && setOpen(next)}>
      <AlertDialogTrigger render={trigger}>{children}</AlertDialogTrigger>
      <AlertDialogContent className="bg-slate-950 border-slate-800 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-slate-400">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="bg-slate-900/50 border-slate-800">
          <AlertDialogCancel
            disabled={isLoading}
            className="bg-slate-800 text-white hover:bg-slate-700 border-slate-700"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className={
              variant === 'destructive'
                ? 'bg-rose-600 hover:bg-rose-700 text-white font-semibold'
                : 'bg-blue-600 hover:bg-blue-700 text-white font-semibold'
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> {loadingLabel}
              </>
            ) : (
              confirmLabel
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ConfirmDialog;
