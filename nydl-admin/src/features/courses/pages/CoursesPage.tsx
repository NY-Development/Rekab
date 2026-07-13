import { z } from 'zod';
import { useCourses, useCourseMutations } from '@/hooks/useCourses';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { EntityFormDialog } from '@/components/common/EntityFormDialog';
import { ColumnDef } from '@tanstack/react-table';
import { Course } from '@/types';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { toast } from 'sonner';

const createCourseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.enum(['Frontend', 'Backend', 'DevOps', 'Full-Stack']),
  difficulty: z.enum(['Beginner', 'Intermediate', 'Advanced']),
  durationWeeks: z.coerce.number().int().positive('Duration must be a positive number'),
  image: z.string().url('Please provide a valid image URL'),
  syllabusSummary: z.string().min(10, 'Syllabus summary must be at least 10 characters'),
});

export function CoursesPage() {
  const { data, isLoading, isError } = useCourses();
  const { createCourse, deleteCourse } = useCourseMutations();

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      await deleteCourse(id);
      toast.success('Course deleted successfully');
    } catch {
      toast.error('Failed to delete course');
    }
  };

  const handleCreate = async (values: z.infer<typeof createCourseSchema>) => {
    try {
      await createCourse(values);
      toast.success('Course created successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create course');
      throw err;
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
        <EntityFormDialog
          triggerLabel="Add Course"
          title="Add New Course"
          schema={createCourseSchema}
          fields={[
            { name: 'title', label: 'Title', placeholder: 'Full Stack Web Development' },
            { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Course overview...' },
            {
              name: 'category',
              label: 'Category',
              type: 'select',
              placeholder: 'Select a category',
              options: [
                { value: 'Frontend', label: 'Frontend' },
                { value: 'Backend', label: 'Backend' },
                { value: 'DevOps', label: 'DevOps' },
                { value: 'Full-Stack', label: 'Full-Stack' },
              ],
            },
            {
              name: 'difficulty',
              label: 'Difficulty',
              type: 'select',
              placeholder: 'Select difficulty',
              options: [
                { value: 'Beginner', label: 'Beginner' },
                { value: 'Intermediate', label: 'Intermediate' },
                { value: 'Advanced', label: 'Advanced' },
              ],
            },
            { name: 'durationWeeks', label: 'Duration (weeks)', type: 'number', placeholder: '12' },
            { name: 'image', label: 'Cover Image URL', type: 'url', placeholder: 'https://...' },
            { name: 'syllabusSummary', label: 'Syllabus Summary', type: 'textarea', placeholder: 'What students will learn...' },
          ]}
          onSubmit={handleCreate}
        />
      </div>

      {isLoading ? (
        <div className="text-slate-400">Loading courses catalog...</div>
      ) : isError ? (
        <div className="text-rose-400">Failed to load courses. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}
    </div>
  );
}

export default CoursesPage;
