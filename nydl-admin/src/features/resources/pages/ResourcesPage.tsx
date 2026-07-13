import { z } from 'zod';
import { useResources, useResourceMutations } from '@/hooks/useResources';
import { DataTable } from '@/components/common/DataTable';
import { EntityFormDialog } from '@/components/common/EntityFormDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ColumnDef } from '@tanstack/react-table';
import { Resource } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

const createResourceSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  title: z.string().min(2, 'Title must be at least 2 characters'),
  description: z.string().optional(),
  resourceType: z.enum(['PDF', 'VIDEO', 'LINK', 'ZIP', 'GITHUB', 'SLIDES']),
  url: z.string().url('Invalid resource URL'),
});

export function ResourcesPage() {
  const { data, isLoading, isError } = useResources();
  const { createResource, deleteResource } = useResourceMutations();

  const handleDelete = async (id: string) => {
    try {
      await deleteResource(id);
      toast.success('Resource deleted successfully');
    } catch {
      toast.error('Failed to delete resource');
    }
  };

  const handleCreate = async (values: z.infer<typeof createResourceSchema>) => {
    try {
      await createResource(values);
      toast.success('Resource added successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add resource');
      throw err;
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
          <ConfirmDialog
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8"
              />
            }
            title="Delete Resource?"
            description="This action cannot be undone. The resource will be permanently removed from the course vault."
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
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Resource Vault</h1>
          <p className="text-sm text-slate-400 font-medium">Upload slides, code repositories, books, documentation, and external reference materials.</p>
        </div>
        <EntityFormDialog
          triggerLabel="Add Resource"
          title="Add New Resource"
          schema={createResourceSchema}
          fields={[
            { name: 'courseId', label: 'Course ID', placeholder: 'Mongo Course ID' },
            { name: 'title', label: 'Title', placeholder: 'Week 1 Slides' },
            { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Optional description...' },
            {
              name: 'resourceType',
              label: 'Type',
              type: 'select',
              placeholder: 'Select a type',
              options: [
                { value: 'PDF', label: 'PDF' },
                { value: 'VIDEO', label: 'Video' },
                { value: 'LINK', label: 'Link' },
                { value: 'ZIP', label: 'Zip' },
                { value: 'GITHUB', label: 'GitHub' },
                { value: 'SLIDES', label: 'Slides' },
              ],
            },
            { name: 'url', label: 'URL', type: 'url', placeholder: 'https://...' },
          ]}
          onSubmit={handleCreate}
        />
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading resources...</div>
      ) : isError ? (
        <div className="text-rose-400">Failed to load resources. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default ResourcesPage;
