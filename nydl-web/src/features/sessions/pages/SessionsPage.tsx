import { useState, useEffect } from 'react';
import { useSessions, useCreateSession, useUpdateSession, useDeleteSession } from '@/hooks/useSessions';
import { useCourses } from '@/hooks/useCourses';
import { useCohorts } from '@/hooks/useCohorts';
import { useAuthStore } from '@/store/auth.store';
import type { Session } from '@/types';

export default function SessionsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  
  // Auth and query hooks
  const { user } = useAuthStore();
  const isStaff = user && ['ADMIN', 'SUPER_ADMIN', 'INSTRUCTOR'].includes(user.role);

  const { data: sessionsRes, isLoading, error } = useSessions();
  const { data: coursesRes } = useCourses();
  
  const createSession = useCreateSession();
  const updateSession = useUpdateSession();
  const deleteSession = useDeleteSession();

  const sessionsList: Session[] = sessionsRes?.data?.docs || [];
  const coursesList = coursesRes?.data?.docs || [];

  // Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [cohortId, setCohortId] = useState('');
  const [type, setType] = useState('LECTURE');
  const [scheduledAt, setScheduledAt] = useState('');
  const [duration, setDuration] = useState(120);
  const [meetLink, setMeetLink] = useState('');
  const [status, setStatus] = useState('UPCOMING');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load cohorts for selected course
  const { data: cohortsRes } = useCohorts({ courseId });
  const cohortsList = cohortsRes?.data?.docs || [];

  // Sync edit session data
  useEffect(() => {
    if (dialogMode === 'edit' && selectedSession) {
      setTitle(selectedSession.title || '');
      setDescription(selectedSession.description || '');
      setCourseId(selectedSession.courseId || '');
      setCohortId(selectedSession.cohortId || '');
      setType(selectedSession.type || 'LECTURE');
      
      // format to datetime-local input string (YYYY-MM-DDTHH:MM)
      if (selectedSession.sessionDate) {
        const d = new Date(selectedSession.sessionDate);
        const pad = (n: number) => n.toString().padStart(2, '0');
        const formatted = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
        setScheduledAt(formatted);
      } else {
        setScheduledAt('');
      }

      setDuration(selectedSession.duration || 120);
      setMeetLink(selectedSession.meetLink || '');
      setStatus(selectedSession.status || 'UPCOMING');
    } else {
      setTitle('');
      setDescription('');
      setCourseId('');
      setCohortId('');
      setType('LECTURE');
      setScheduledAt('');
      setDuration(120);
      setMeetLink('');
      setStatus('UPCOMING');
    }
  }, [dialogMode, selectedSession, isDialogOpen]);

  // Group or sorting
  const sortedSessions = [...sessionsList].sort((a, b) => {
    return new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime();
  });

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this live session?')) {
      try {
        await deleteSession.mutateAsync(id);
      } catch (err) {
        alert('Failed to delete live session');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !courseId || !cohortId || !scheduledAt) {
      alert('Title, Course, Cohort, and Date are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title,
        description,
        courseId,
        cohortId,
        instructorId: user?.id,
        type,
        sessionDate: new Date(scheduledAt).toISOString(), // backend CreateSessionSchema requires sessionDate
        duration: Number(duration),
        meetLink: meetLink || undefined,
        status,
      };

      if (dialogMode === 'create') {
        await createSession.mutateAsync(payload);
      } else if (selectedSession) {
        await updateSession.mutateAsync({ id: selectedSession.id, data: payload });
      }

      setIsDialogOpen(false);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10 relative">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Live Sessions</h2>
          <p className="text-sm text-slate-550 mt-1">Access and manage your upcoming classes for the week.</p>
        </div>
        
        {/* View Toggles & Add Button */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-1 w-full sm:w-auto">
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">list</span>
              List View
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-500 hover:text-blue-600'
              }`}
            >
              <span className="material-symbols-outlined text-[18px]">calendar_month</span>
              Calendar
            </button>
          </div>

          {isStaff && (
            <button
              onClick={() => {
                setDialogMode('create');
                setIsDialogOpen(true);
              }}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-md shadow-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Schedule Session
            </button>
          )}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-md text-sm">
          Failed to load live sessions.
        </div>
      ) : viewMode === 'calendar' ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
          <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">calendar_today</span>
          <p className="text-sm">Interactive calendar grid showing scheduled times. Please refer to List View for join links.</p>
        </div>
      ) : sortedSessions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
          No live sessions scheduled.
        </div>
      ) : (
        /* Sessions List */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">This Week</h3>
            {sortedSessions.map((session) => {
              const scheduledDate = new Date(session.sessionDate);
              const isToday = scheduledDate.toDateString() === new Date().toDateString();
              const isLive = session.status === 'ACTIVE';

              const timeStr = scheduledDate.toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={session.id}
                  className="bg-white border border-slate-205 rounded-lg p-6 hover:shadow-sm transition-all flex flex-col md:flex-row gap-6 relative overflow-hidden group"
                >
                  {(isToday || isLive) && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600"></div>
                  )}
                  
                  {/* Left date/time circle */}
                  <div className="flex-shrink-0 flex flex-col items-center justify-center bg-slate-50 rounded-md w-24 h-24 border border-slate-200">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {isToday ? 'Today' : scheduledDate.toLocaleDateString(undefined, { weekday: 'short' })}
                    </span>
                    <span className="text-lg font-bold text-blue-650 mt-1">
                      {timeStr.split(' ')[0]}
                    </span>
                    <span className="text-xs text-slate-500">
                      {timeStr.split(' ')[1]}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-blue-50 text-blue-700 border border-blue-100 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                        {session.type || 'Lecture'}
                      </span>
                      <span className="bg-slate-100 text-slate-655 border border-slate-200 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                        {session.status}
                      </span>
                      <span className="flex items-center text-slate-400 text-xs">
                        <span className="material-symbols-outlined text-[16px] mr-1">schedule</span>
                        {session.duration} min
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">{session.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed mb-4">
                      {session.description}
                    </p>

                    {isStaff && (
                      <div className="flex gap-2 border-t border-slate-100 pt-3">
                        <button
                          onClick={() => {
                            setSelectedSession(session);
                            setDialogMode('edit');
                            setIsDialogOpen(true);
                          }}
                          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold text-xs px-3 py-1.5 rounded transition-colors"
                        >
                          Edit Details
                        </button>
                        <button
                          onClick={() => handleDelete(session.id)}
                          className="bg-red-50 hover:bg-red-600 hover:text-white border border-red-100 text-red-650 font-semibold text-xs px-3 py-1.5 rounded transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                          Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end md:border-l border-slate-100 md:pl-6 mt-4 md:mt-0">
                    {session.meetLink ? (
                      <a
                        href={session.meetLink}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-3 rounded-md transition-colors flex items-center justify-center gap-2 font-medium shadow-sm"
                      >
                        <span className="material-symbols-outlined text-sm">videocam</span>
                        Join Meet
                      </a>
                    ) : (
                      <button
                        className="w-full md:w-auto bg-slate-100 text-slate-400 cursor-not-allowed text-xs font-semibold px-5 py-3 rounded-md flex items-center justify-center gap-2 font-medium"
                        disabled
                      >
                        <span className="material-symbols-outlined text-sm opacity-50">videocam</span>
                        Link Pending
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Panel Widget */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-205 rounded-lg p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900 mb-4">Live Session Guidelines</h3>
              <ul className="space-y-3 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-4">
                <li className="flex gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-base leading-none">arrow_forward</span>
                  Please join live classes 5 minutes before scheduled start time.
                </li>
                <li className="flex gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-base leading-none">arrow_forward</span>
                  Ensure your webcam is enabled and screen name matches your registration code.
                </li>
                <li className="flex gap-2">
                  <span className="material-symbols-outlined text-blue-600 text-base leading-none">arrow_forward</span>
                  All classes are recorded and will viewable on the dashboard.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* --- CRUD Dialog Modal --- */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-slate-150 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">
                {dialogMode === 'create' ? 'Schedule Live Session' : 'Edit Live Session'}
              </h3>
              <button
                type="button"
                onClick={() => setIsDialogOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Session Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Node.js Middleware Deep Dive"
                  className="w-full bg-white border border-slate-205 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Course */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Course *</label>
                <select
                  required
                  value={courseId}
                  onChange={(e) => {
                    setCourseId(e.target.value);
                    setCohortId(''); // reset cohort
                  }}
                  className="w-full bg-white border border-slate-205 rounded px-3 py-2 text-sm text-slate-707 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">Select a Course</option>
                  {coursesList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Cohort */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Target Cohort *</label>
                <select
                  required
                  disabled={!courseId}
                  value={cohortId}
                  onChange={(e) => setCohortId(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded px-3 py-2 text-sm text-slate-707 disabled:bg-slate-50 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">Select a Cohort</option>
                  {cohortsList.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail the agenda, prerequisites or materials for the class..."
                  className="w-full bg-white border border-slate-205 rounded px-3 py-2 text-sm text-slate-900 h-20 resize-none focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Session Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Session Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded px-3 py-2 text-sm text-slate-707 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="LECTURE">Video Lecture</option>
                  <option value="LAB">Practical Lab Session</option>
                  <option value="WORKSHOP">Workshop / Live Coding</option>
                  <option value="STANDUP">Daily Standup</option>
                  <option value="REVIEW">Q&A / Assignment Review</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              {/* Date & Time */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Scheduled Date & Time *</label>
                <input
                  type="datetime-local"
                  required
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full bg-white border border-slate-205 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Duration & Google Meet Link */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    min="5"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full bg-white border border-slate-205 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-white border border-slate-205 rounded px-3 py-2 text-sm text-slate-707 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="UPCOMING">Upcoming</option>
                    <option value="ACTIVE">Active / Live Now</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Google Meet Link */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Google Meet URL</label>
                <input
                  type="url"
                  value={meetLink}
                  onChange={(e) => setMeetLink(e.target.value)}
                  placeholder="https://meet.google.com/abc-defg-hij"
                  className="w-full bg-white border border-slate-205 rounded px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              {/* Submit Buttons */}
              <div className="border-t border-slate-150 pt-4 flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="px-4 py-2 border border-slate-205 hover:bg-slate-100 text-slate-700 text-sm font-semibold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded flex items-center justify-center gap-1.5"
                >
                  {isSubmitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : null}
                  {dialogMode === 'create' ? 'Create' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
