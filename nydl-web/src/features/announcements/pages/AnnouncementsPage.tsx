import { useState, useEffect } from 'react';
import { useAnnouncements, useCreateAnnouncement, useUpdateAnnouncement, useDeleteAnnouncement } from '@/hooks/useAnnouncements';
import { useCourses } from '@/hooks/useCourses';
import { useCohorts } from '@/hooks/useCohorts';
import { useAuthStore } from '@/store/auth.store';
import { isAdminRole, isStaffRole } from '@/lib/permissions';
import type { Announcement } from '@/types';

export default function AnnouncementsPage() {
  const { user } = useAuthStore();
  const isStaff = isStaffRole(user?.role);
  const isAdmin = isAdminRole(user?.role);

  const { data: announcementsRes, isLoading, error } = useAnnouncements();
  const { data: coursesRes } = useCourses();

  const createAnnouncement = useCreateAnnouncement();
  const updateAnnouncement = useUpdateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();

  const announcementsList: Announcement[] = announcementsRes?.data?.docs || [];
  const coursesList = coursesRes?.data?.docs || [];

  // Sort by publishDate or createdAt descending
  const sortedAnnouncements = [...announcementsList].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  // Dialog state
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('NORMAL');
  const [courseId, setCourseId] = useState('');
  const [cohortId, setCohortId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: cohortsRes } = useCohorts({ courseId });
  const cohortsList = cohortsRes?.data?.docs || [];

  useEffect(() => {
    if (dialogMode === 'edit' && selectedAnnouncement) {
      setTitle(selectedAnnouncement.title || '');
      setContent(selectedAnnouncement.content || '');
      setPriority(selectedAnnouncement.priority || 'NORMAL');
      setCourseId(selectedAnnouncement.courseId || '');
      setCohortId(selectedAnnouncement.cohortId || '');
    } else {
      setTitle('');
      setContent('');
      setPriority('NORMAL');
      setCourseId('');
      setCohortId('');
    }
  }, [dialogMode, selectedAnnouncement, isDialogOpen]);

  const getPriorityStyle = (p: string) => {
    switch (p) {
      case 'URGENT':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'NORMAL':
        return 'bg-blue-50 text-blue-750 border-blue-150';
      default:
        return 'bg-muted/40 text-muted-foreground border-border';
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      try {
        await deleteAnnouncement.mutateAsync(id);
      } catch (err) {
        alert('Failed to delete announcement');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert('Title and content are required.');
      return;
    }
    if (!isAdmin && !courseId) {
      alert('Instructors must target a course for their announcements.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<Announcement> = {
        title,
        content,
        priority: priority as Announcement['priority'],
        courseId: courseId || undefined,
        cohortId: cohortId || undefined,
      };

      if (dialogMode === 'create') {
        await createAnnouncement.mutateAsync(payload);
      } else if (selectedAnnouncement) {
        await updateAnnouncement.mutateAsync({ id: selectedAnnouncement.id, data: payload });
      }

      setIsDialogOpen(false);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save announcement.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-10">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Announcements</h2>
          <p className="text-sm text-muted-foreground mt-1">Stay updated with the latest program news, updates, and deadlines.</p>
        </div>
        {isStaff && (
          <button
            onClick={() => {
              setDialogMode('create');
              setSelectedAnnouncement(null);
              setIsDialogOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-md shadow-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Announcement
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-md text-sm">
          Failed to load announcements.
        </div>
      ) : sortedAnnouncements.length === 0 ? (
        <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">
          No announcements published yet.
        </div>
      ) : (
        <div className="space-y-6">
          {sortedAnnouncements.map((announcement) => {
            const pubDate = new Date(announcement.createdAt);

            return (
              <div
                key={announcement.id}
                className="bg-card border border-border rounded-lg p-6 shadow-sm flex flex-col md:flex-row gap-6 hover:border-slate-300 transition-colors"
              >
                {/* Meta details */}
                <div className="shrink-0 flex md:flex-col md:items-start items-center justify-between md:justify-start gap-3 md:w-44 border-b md:border-b-0 md:border-r border-border pb-4 md:pb-0 md:pr-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase border ${getPriorityStyle(announcement.priority)}`}>
                    {announcement.priority} PRIORITY
                  </span>

                  <div className="text-xs text-muted-foreground">
                    <span className="block font-semibold text-muted-foreground">Published</span>
                    {pubDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-bold text-foreground leading-snug">
                    {announcement.title}
                  </h3>

                  <div className="text-sm text-muted-foreground leading-relaxed space-y-2 whitespace-pre-wrap">
                    {announcement.content}
                  </div>

                  {isStaff && (
                    <div className="flex gap-2 border-t border-border pt-3">
                      <button
                        onClick={() => {
                          setSelectedAnnouncement(announcement);
                          setDialogMode('edit');
                          setIsDialogOpen(true);
                        }}
                        className="bg-muted/40 hover:bg-muted border border-border text-foreground font-semibold text-xs px-3 py-1.5 rounded transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(announcement.id)}
                        className="bg-red-50 hover:bg-red-600 hover:text-white border border-red-100 text-red-650 font-semibold text-xs px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* --- CRUD Dialog Modal --- */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">
                {dialogMode === 'create' ? 'New Announcement' : 'Edit Announcement'}
              </h3>
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="text-muted-foreground hover:text-muted-foreground"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Assignment deadline extended"
                  className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase mb-1">Content *</label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the announcement details..."
                  className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground h-28 resize-none focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="LOW">Low</option>
                  <option value="NORMAL">Normal</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>

              {/* Course */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase mb-1">
                  Course {isAdmin ? '(Optional — leave blank for platform-wide)' : '*'}
                </label>
                <select
                  required={!isAdmin}
                  value={courseId}
                  onChange={(e) => {
                    setCourseId(e.target.value);
                    setCohortId('');
                  }}
                  className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">{isAdmin ? 'Platform-wide' : 'Select a Course'}</option>
                  {coursesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Cohort */}
              <div>
                <label className="block text-xs font-bold text-foreground uppercase mb-1">Cohort (Optional — narrows to one cohort)</label>
                <select
                  disabled={!courseId}
                  value={cohortId}
                  onChange={(e) => setCohortId(e.target.value)}
                  className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground disabled:bg-muted/40 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">All cohorts in course</option>
                  {cohortsList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit Buttons */}
              <div className="border-t border-border pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 border border-border hover:bg-muted text-foreground text-sm font-semibold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded flex items-center gap-1.5"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : null}
                  {dialogMode === 'create' ? 'Publish' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
