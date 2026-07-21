import { useState, useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useInstructors, useInstructorMutations } from '@/hooks/useInstructors';
import { useUsers } from '@/hooks/useUsers';
import { useCourses } from '@/hooks/useCourses';
import { DataTable } from '@/components/common/DataTable';
import { EntityFormDialog } from '@/components/common/EntityFormDialog';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { ColumnDef } from '@tanstack/react-table';
import { Instructor, User, Course } from '@/types';
import { Button } from '@/components/ui/button';
import { getPopulated } from '@/utils/registration';
import { Trash, Edit, Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { StatusBadge } from '@/components/common/StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const createInstructorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  specialization: z.string().optional(),
  yearsExperience: z.coerce.number().int().min(0).optional(),
  bio: z.string().optional(),
  assignedCourses: z.array(z.string()).optional().default([]),
});

const editInstructorSchema = z.object({
  specialization: z.string().optional(),
  yearsExperience: z.coerce.number().int().min(0).optional(),
  bio: z.string().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED']).default('ACTIVE'),
  phone: z.string().optional(),
  availability: z.string().optional(),
  certifications: z.string().optional(),
  linkedin: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  github: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  portfolio: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  website: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  assignedCourses: z.array(z.string()).default([]),
});

interface InstructorEditDialogProps {
  instructor: Instructor | null;
  onClose: () => void;
  onSave: (id: string, data: any) => Promise<void>;
  courses: Course[];
}

export function InstructorEditDialog({ instructor, onClose, onSave, courses }: InstructorEditDialogProps) {
  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(editInstructorSchema),
    defaultValues: {
      specialization: '',
      yearsExperience: 0,
      bio: '',
      status: 'ACTIVE' as const,
      phone: '',
      availability: '',
      certifications: '',
      linkedin: '',
      github: '',
      portfolio: '',
      website: '',
      assignedCourses: [] as string[],
    }
  });

  useEffect(() => {
    if (instructor) {
      reset({
        specialization: instructor.specialization || '',
        yearsExperience: instructor.yearsExperience || 0,
        bio: instructor.bio || '',
        status: instructor.status || 'ACTIVE',
        phone: instructor.phone || '',
        availability: instructor.availability || '',
        certifications: instructor.certifications ? instructor.certifications.join(', ') : '',
        linkedin: instructor.socialLinks?.linkedin || '',
        github: instructor.socialLinks?.github || '',
        portfolio: instructor.socialLinks?.portfolio || '',
        website: instructor.socialLinks?.website || '',
        assignedCourses: instructor.assignedCourses || [],
      });
    }
  }, [instructor, reset]);

  const assignedCourses = watch('assignedCourses') || [];

  const handleCourseToggle = (courseId: string) => {
    if (assignedCourses.includes(courseId)) {
      setValue('assignedCourses', assignedCourses.filter(id => id !== courseId), { shouldValidate: true });
    } else {
      setValue('assignedCourses', [...assignedCourses, courseId], { shouldValidate: true });
    }
  };

  const onSubmitForm = async (values: any) => {
    if (!instructor) return;
    const formattedData = {
      specialization: values.specialization,
      yearsExperience: values.yearsExperience,
      bio: values.bio,
      status: values.status,
      phone: values.phone,
      availability: values.availability,
      certifications: values.certifications ? values.certifications.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      socialLinks: {
        linkedin: values.linkedin || undefined,
        github: values.github || undefined,
        portfolio: values.portfolio || undefined,
        website: values.website || undefined,
      },
      assignedCourses: values.assignedCourses,
    };
    await onSave(instructor.id, formattedData);
  };

  return (
    <Dialog open={!!instructor} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-slate-950 border-slate-800 text-white sm:max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">Edit Instructor Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300">Specialization</Label>
              <Input className="bg-slate-900 border-slate-800 text-white" {...register('specialization')} />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Years of Experience</Label>
              <Input type="number" className="bg-slate-900 border-slate-800 text-white" {...register('yearsExperience')} />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Phone Number</Label>
              <Input className="bg-slate-900 border-slate-800 text-white" {...register('phone')} />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300">Availability Summary</Label>
              <Input placeholder="e.g. Mon-Fri, 2PM - 6PM" className="bg-slate-900 border-slate-800 text-white" {...register('availability')} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-300 mb-1.5 block">Status</Label>
              <Select
                value={watch('status') || 'ACTIVE'}
                onValueChange={(val) => setValue('status', val as any, { shouldValidate: true })}
              >
                <SelectTrigger className="bg-slate-900 border-slate-800 text-white w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-white">
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="SUSPENDED">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-300">Bio</Label>
              <Textarea className="bg-slate-900 border-slate-800 text-white h-24" {...register('bio')} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-300">Certifications (comma-separated)</Label>
              <Input placeholder="AWS Solution Architect, Scrum Master..." className="bg-slate-900 border-slate-800 text-white" {...register('certifications')} />
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4 space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Social Connections</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-slate-300">LinkedIn URL</Label>
                <Input type="url" className="bg-slate-900 border-slate-800 text-white" {...register('linkedin')} />
                {errors.linkedin && <p className="text-xs text-rose-400">{errors.linkedin.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">GitHub Profile URL</Label>
                <Input type="url" className="bg-slate-900 border-slate-800 text-white" {...register('github')} />
                {errors.github && <p className="text-xs text-rose-400">{errors.github.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Portfolio URL</Label>
                <Input type="url" className="bg-slate-900 border-slate-800 text-white" {...register('portfolio')} />
                {errors.portfolio && <p className="text-xs text-rose-400">{errors.portfolio.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Personal Website URL</Label>
                <Input type="url" className="bg-slate-900 border-slate-800 text-white" {...register('website')} />
                {errors.website && <p className="text-xs text-rose-400">{errors.website.message}</p>}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <Label className="text-slate-300 mb-2 block font-semibold">Assigned Courses</Label>
            <div className="border border-slate-800 rounded-lg p-3 bg-slate-900 max-h-40 overflow-y-auto space-y-2">
              {courses.length === 0 ? (
                <p className="text-xs text-slate-500">No courses available</p>
              ) : (
                courses.map((course) => {
                  const checked = assignedCourses.includes(course.id);
                  return (
                    <label key={course.id} className="flex items-center gap-3 p-2 hover:bg-slate-805 rounded cursor-pointer text-sm">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => handleCourseToggle(course.id)}
                      />
                      <div>
                        <p className="font-medium text-white">{course.title}</p>
                        <p className="text-xs text-slate-400">{course.category} {course.level}</p>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>
          <DialogFooter className="border-t border-slate-800 pt-4 flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="border-slate-800 hover:bg-slate-900 hover:text-white">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface InstructorCreateDialogProps {
  courses: Course[];
  onClose: () => void;
  onSave: (values: z.infer<typeof createInstructorSchema>) => Promise<void>;
}

export function InstructorCreateDialog({ courses, onClose, onSave }: InstructorCreateDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createInstructorSchema),
    defaultValues: {
      name: '',
      email: '',
      specialization: '',
      yearsExperience: 0,
      bio: '',
      assignedCourses: [] as string[],
    },
  });

  const assignedCourses = watch('assignedCourses') || [];

  const handleCourseToggle = (courseId: string) => {
    if (assignedCourses.includes(courseId)) {
      setValue(
        'assignedCourses',
        assignedCourses.filter((id) => id !== courseId),
        { shouldValidate: true }
      );
    } else {
      setValue('assignedCourses', [...assignedCourses, courseId], { shouldValidate: true });
    }
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-slate-950 border-slate-800 text-white sm:max-w-xl max-h-[90vh] overflow-y-auto font-sans">
        <DialogHeader>
          <DialogTitle className="text-white text-lg font-bold">Add New Instructor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-slate-300 font-semibold">Full Name</Label>
              <Input placeholder="e.g. John Doe" className="bg-slate-900 border-slate-800 text-white" {...register('name')} />
              {errors.name && <p className="text-xs text-rose-400">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 font-semibold">Email Address</Label>
              <Input placeholder="e.g. john@nydev.org" type="email" className="bg-slate-900 border-slate-800 text-white" {...register('email')} />
              {errors.email && <p className="text-xs text-rose-400">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 font-semibold">Specialization</Label>
              <Input placeholder="e.g. Frontend Engineering" className="bg-slate-900 border-slate-800 text-white" {...register('specialization')} />
            </div>

            <div className="space-y-2">
              <Label className="text-slate-300 font-semibold">Years of Experience</Label>
              <Input type="number" className="bg-slate-900 border-slate-800 text-white" {...register('yearsExperience')} />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="text-slate-300 font-semibold">Bio</Label>
              <Textarea placeholder="Short professional bio..." className="bg-slate-900 border-slate-800 text-white h-24" {...register('bio')} />
            </div>
          </div>

          <div className="border-t border-slate-800 pt-4">
            <Label className="text-slate-300 mb-2 block font-semibold">Assign Courses</Label>
            <div className="border border-slate-800 rounded-lg p-3 bg-slate-900 max-h-40 overflow-y-auto space-y-2">
              {courses.length === 0 ? (
                <p className="text-xs text-slate-500">No courses available</p>
              ) : (
                courses.map((course) => {
                  const checked = assignedCourses.includes(course.id);
                  return (
                    <label key={course.id} className="flex items-center gap-3 p-2 hover:bg-slate-850 rounded cursor-pointer text-sm">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => handleCourseToggle(course.id)}
                      />
                      <div>
                        <p className="font-medium text-white">{course.title}</p>
                        <p className="text-xs text-slate-400">{course.category} {course.level}</p>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>

          <DialogFooter className="border-t border-slate-800 pt-4 flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose} className="border-slate-800 hover:bg-slate-900 hover:text-white">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Instructor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function InstructorsPage() {
  const { data, isLoading, isError } = useInstructors();
  const { createInstructor, updateInstructor, deleteInstructor } = useInstructorMutations();
  const { data: instructorUsersData } = useUsers({ role: 'INSTRUCTOR', limit: 100 });
  const { data: coursesData } = useCourses({ limit: 100 });
  const allCourses = coursesData?.docs || [];
  const userOptions = (instructorUsersData?.docs || []).map((u) => ({ value: u.id, label: `${u.name} (${u.email})` }));
  const [editingInstructor, setEditingInstructor] = useState<Instructor | null>(null);
  const [isCreatingInstructor, setIsCreatingInstructor] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteInstructor(id);
      toast.success('Instructor deleted successfully');
    } catch {
      toast.error('Failed to delete instructor');
    }
  };

  const handleCreate = async (values: z.infer<typeof createInstructorSchema>) => {
    try {
      await createInstructor(values);
      toast.success('Instructor added successfully');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add instructor');
      throw err;
    }
  };

  const handleSaveEdit = async (id: string, updatedData: any) => {
    try {
      await updateInstructor({ id, data: updatedData });
      toast.success('Instructor profile updated successfully');
      setEditingInstructor(null);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update instructor');
    }
  };

  const columns: ColumnDef<Instructor>[] = [
    { id: 'name', header: 'Name', cell: (info) => <span className="font-semibold text-white">{getPopulated<User>(info.row.original.userId)?.name || 'N/A'}</span> },
    { id: 'email', header: 'Email', cell: (info) => <span>{getPopulated<User>(info.row.original.userId)?.email || 'N/A'}</span> },
    { accessorKey: 'specialization', header: 'Specialization' },
    {
      accessorKey: 'assignedCourses',
      header: 'Assigned Courses',
      cell: (info) => {
        const list = info.getValue() as string[];
        return <span className="text-slate-400 font-mono text-xs">{list?.length || 0} courses</span>;
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: (info) => <StatusBadge status={info.row.original.status || 'ACTIVE'} />,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (info) => (
        <div className="flex gap-2 font-sans">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditingInstructor(info.row.original)}
            className="text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 h-8 w-8"
            title="Edit Profile"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <ConfirmDialog
            trigger={
              <Button
                variant="ghost"
                size="icon"
                className="text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 h-8 w-8"
              />
            }
            title="Delete Instructor?"
            description="This action cannot be undone. The instructor profile and course assignments will be permanently removed."
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
          <h1 className="text-xl font-bold text-white uppercase tracking-wider">Instructor Roster</h1>
          <p className="text-sm text-slate-400 font-medium">Manage teacher accounts, course specializations, and professional bios.</p>
        </div>
        <Button 
          onClick={() => setIsCreatingInstructor(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" /> Add Instructor
        </Button>
      </div>

      {isLoading ? (
        <div className="text-slate-400 font-sans">Loading instructor roster...</div>
      ) : isError ? (
        <div className="text-rose-400 font-sans">Failed to load instructors. Please try again later.</div>
      ) : (
        <DataTable columns={columns} data={data?.docs || []} pageCount={data?.totalPages || 1} />
      )}

      {editingInstructor && (
        <InstructorEditDialog
          instructor={editingInstructor}
          courses={allCourses}
          onClose={() => setEditingInstructor(null)}
          onSave={handleSaveEdit}
        />
      )}

      {isCreatingInstructor && (
        <InstructorCreateDialog
          courses={allCourses}
          onClose={() => setIsCreatingInstructor(false)}
          onSave={handleCreate}
        />
      )}
    </div>
  );
}

export default InstructorsPage;
