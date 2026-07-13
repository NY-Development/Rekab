import { z } from 'zod';
import { useSettings, useSettingsMutations } from '@/hooks/useSettings';
import { DataTable } from '@/components/common/DataTable';
import { EntityFormDialog } from '@/components/common/EntityFormDialog';
import { ColumnDef } from '@tanstack/react-table';
import { SystemSetting } from '@/types';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';

const updateSettingSchema = z.object({
  value: z.string().min(1, 'Value is required'),
});

export function SettingsPage() {
  const { data, isLoading } = useSettings();
  const { updateSetting } = useSettingsMutations();

  const handleEdit = async (key: string, category: string, values: z.infer<typeof updateSettingSchema>) => {
    try {
      await updateSetting({ key, value: values.value, category });
      toast.success('Setting updated successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update setting');
      throw err;
    }
  };

  const columns: ColumnDef<SystemSetting>[] = [
    { accessorKey: 'key', header: 'Configuration Key', cell: (info) => <span className="font-mono text-white text-xs font-bold">{info.getValue() as string}</span> },
    { accessorKey: 'value', header: 'Value', cell: (info) => <span className="text-slate-350">{info.getValue() as string}</span> },
    { accessorKey: 'description', header: 'Description' },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2">
          <EntityFormDialog
            triggerLabel="Edit"
            title={`Update "${info.row.original.key}"`}
            schema={updateSettingSchema}
            defaultValues={{ value: info.row.original.value }}
            fields={[{ name: 'value', label: 'Value', placeholder: 'New value' }]}
            onSubmit={(values) => handleEdit(info.row.original.key, info.row.original.category, values)}
            submitLabel="Save Changes"
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 h-8 w-8"
              />
            }
            triggerContent={<Edit className="h-4 w-4" />}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-white uppercase tracking-wider">System Settings</h1>
        <p className="text-sm text-slate-400 font-medium">Verify platform environmental parameters, threshold parameters, and registration options.</p>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading configurations...</div>
      ) : (
        <DataTable columns={columns} data={data || []} pageCount={1} />
      )}
    </div>
  );
}

export default SettingsPage;
