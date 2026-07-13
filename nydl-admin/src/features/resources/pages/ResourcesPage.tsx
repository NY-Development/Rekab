import { useResources, useResourceMutations } from '@/hooks/useResources';
import { DataTable } from '@/components/common/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { Resource } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Trash, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export function ResourcesPage() {
  const { data, isLoading } = useResources();
  const { deleteResource } = useResourceMutations();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    try {
      await deleteResource(id);
      toast.success('Resource deleted successfully');
    } catch {
      toast.error('Failed to delete resource');
    }
  };

  const columns: ColumnDef<Resource>[] = [
    { accessorKey: 'title', header: 'Title', cell: (info) => <span className="font-bold text-white">{info.getValue() as string}</span> },
    { accessorKey: 'type', header: 'Type' },
    {
      accessorKey: 'url',
      header: 'Link',
      cell: (info) => (
        <a
          href={info.getValue() as string}
          target="_blank"
          rel="noreferrer"
          className="text-blue-400 hover:underline flex items-center gap-1 text-xs"
        >
          Open <ExternalLink className="h-3 w-3" />
        </a>
      ),
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
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Resource Vault</h1>
          <p className="text-sm text-slate-400 font-medium">Upload slides, code repositories, books, documentation, and external reference materials.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          <Plus className="mr-2 h-4 w-4" /> Add Resource
        </Button>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading resources...</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default ResourcesPage;
