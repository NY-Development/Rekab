import { useNavigate } from 'react-router-dom';
import { LogIn, UserPlus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface AuthRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  courseTitle?: string;
}

export function AuthRequiredDialog({ open, onOpenChange, courseTitle }: AuthRequiredDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign in to enroll</DialogTitle>
          <DialogDescription>
            You need an account to enroll{courseTitle ? ` in ${courseTitle}` : ''} and track your
            registration. Create a free account or sign in to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="outline" onClick={() => navigate('/login')}>
            <LogIn className="mr-1.5 h-4 w-4" /> Login
          </Button>
          <Button onClick={() => navigate('/register')}>
            <UserPlus className="mr-1.5 h-4 w-4" /> Register
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AuthRequiredDialog;
