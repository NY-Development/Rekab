import { useCourses, useCourseMutations } from '@/hooks/useCourses';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { ColumnDef } from '@tanstack/react-table';
import { Course } from '@/types';
import { Button } from '@/components/ui/button';
import { Plus, Trash, Edit } from 'lucide-react';
import { toast } from 'sonner';

export function CoursesPage() {
  const { data, isLoading } = useCourses();
  const { deleteCourse } = useCourseMutations();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await deleteCourse(id);
      toast.success('Course deleted successfully');
    } catch {
      toast.error('Failed to delete course');
    }
  };

  const columns: ColumnDef<Course>[] = [
    { accessorKey: 'title', header: 'Title', cell: (info) => <span className="font-semibold text-white">{info.getValue() as string}</span> },
    { accessorKey: 'category', header: 'Category' },
    { accessorKey: 'level', header: 'Level' },
    {
      accessorKey: 'price',
      header: 'Price',
      cell: (info) => <span className="font-mono text-slate-300">${info.getValue() as number}</span>,
    },
    { accessorKey: 'status', header: 'Status', cell: (info) => <StatusBadge status={info.getValue() as string} /> },
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
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Course Catalog</h1>
          <p className="text-sm text-slate-400 font-medium">Manage academic courses, pricing tiers, curriculum outlines, and catalog states.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
          <Plus className="mr-2 h-4 w-4" /> Add Course
        </Button>
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading courses catalog...</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default CoursesPage;
