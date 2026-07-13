import { useUsers, useUserMutations } from '@/hooks/useUsers';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Trash, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';

export function UsersPage() {
  const { data, isLoading } = useUsers();
  const { deleteUser } = useUserMutations();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const columns: ColumnDef<User>[] = [
    { accessorKey: 'name', header: 'Name', cell: (info) => <span className="font-semibold text-white">{info.getValue() as string}</span> },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'role', header: 'Role', cell: (info) => <StatusBadge status={info.getValue() as string} /> },
    {
      accessorKey: 'isActive',
      header: 'Status',
      cell: (info) => (info.getValue() ? <StatusBadge status="ACTIVE" /> : <StatusBadge status="BLOCKED" />),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(info.row.original.id)}
            className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">User Directory</h1>
          <p className="text-sm text-slate-400 font-medium">Manage institutional user accounts, logins, and access control list roles.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          <Plus className="mr-2 h-4 w-4" /> Add User
        </Button>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading users...</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default UsersPage;
