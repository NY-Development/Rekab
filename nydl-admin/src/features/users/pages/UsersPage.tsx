import { z } from 'zod';
import { useUsers, useUserMutations } from '@/hooks/useUsers';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EntityFormDialog } from '@/components/common/EntityFormDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ColumnDef } from '@tanstack/react-table';
import { User } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'INSTRUCTOR', 'MENTOR', 'STUDENT']),
});

export function UsersPage() {
  const { data, isLoading, isError } = useUsers();
  const { createUser, deleteUser } = useUserMutations();

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
    } catch {
      toast.error('Failed to delete user');
    }
  };

  const handleCreate = async (values: z.infer<typeof createUserSchema>) => {
    try {
      await createUser(values);
      toast.success('User created successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create user');
      throw err;
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
          <ConfirmDialog
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8"
              />
            }
            title="Delete User?"
            description="This action cannot be undone. The user account and all associated access will be permanently removed."
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
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">User Directory</h1>
          <p className="text-sm text-slate-400 font-medium">Manage institutional user accounts, logins, and access control list roles.</p>
        </div>
        <EntityFormDialog
          triggerLabel="Add User"
          title="Add New User"
          schema={createUserSchema}
          fields={[
            { name: 'name', label: 'Full Name', placeholder: 'Jane Doe' },
            { name: 'email', label: 'Email Address', placeholder: 'jane@nydev.org' },
            { name: 'password', label: 'Password', type: 'password', placeholder: 'At least 6 characters' },
            {
              name: 'role',
              label: 'Role',
              type: 'select',
              placeholder: 'Select a role',
              options: [
                { value: 'STUDENT', label: 'Student' },
                { value: 'INSTRUCTOR', label: 'Instructor' },
                { value: 'MENTOR', label: 'Mentor' },
                { value: 'ADMIN', label: 'Admin' },
                { value: 'SUPER_ADMIN', label: 'Super Admin' },
              ],
            },
          ]}
          onSubmit={handleCreate}
        />
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading users...</div>
      ) : isError ? (
        <div className="text-rose-400">Failed to load users. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default UsersPage;
