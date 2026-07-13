import { useSettings, useSettingsMutations } from '@/hooks/useSettings';
import { DataTable } from '@/components/common/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { SystemSetting } from '@/types';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';

export function SettingsPage() {
  const { data, isLoading } = useSettings();
  const { updateSetting } = useSettingsMutations();

  const handleEdit = async (key: string, category: string, currentVal: string) => {
    const newVal = prompt(`Update value for "${key}":`, currentVal);
    if (newVal === null || newVal === currentVal) return;

    try {
      await updateSetting({ key, value: newVal, category });
      toast.success('Setting updated successfully');
    } catch {
      toast.error('Failed to update setting');
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
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(info.row.original.key, info.row.original.category, info.row.original.value)}
            className="text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 h-8 w-8"
          >
            <Edit className="h-4 w-4" />
          </Button>
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
