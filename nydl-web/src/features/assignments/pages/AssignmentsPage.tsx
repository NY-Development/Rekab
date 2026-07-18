import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useAssignments,
  useSubmissions,
  useCreateAssignment,
  useUpdateAssignment,
  useDeleteAssignment,
  useAssignmentSubmissions,
  useGradeSubmission,
} from '@/hooks/useAssignments';
import { useCourses } from '@/hooks/useCourses';
import { useCohorts } from '@/hooks/useCohorts';
import { useAuthStore } from '@/store/auth.store';
import { isStaffRole } from '@/lib/permissions';
import type { Assignment } from '@/types';

export default function AssignmentsPage() {
  const navigate = useNavigate();
  const [typeFilter, setTypeFilter] = useState('All Types');
  const [sortOrder, setSortOrder] = useState('Due Date (Soonest)');

  const { user } = useAuthStore();
  const isStaff = isStaffRole(user?.role);

  const { data: assignmentsRes, isLoading: isAssignmentsLoading, error: assignmentsError } = useAssignments();
  const { data: submissionsRes, isLoading: isSubmissionsLoading } = useSubmissions();
  const { data: coursesRes } = useCourses();

  const createAssignment = useCreateAssignment();
  const updateAssignment = useUpdateAssignment();
  const deleteAssignment = useDeleteAssignment();

  const assignmentsList: Assignment[] = assignmentsRes?.data?.docs || [];
  const submissionsList = submissionsRes?.data?.submissions || [];
  const coursesList = coursesRes?.data?.docs || [];

  // Map submissions by assignmentId
  const submissionMap = React.useMemo(() => {
    const map = new Map<string, any>();
    if (Array.isArray(submissionsList)) {
      submissionsList.forEach((sub: any) => {
        if (sub && sub.assignmentId) {
          map.set(sub.assignmentId, sub);
        }
      });
    }
    return map;
  }, [submissionsList]);

  // Filter list
  const filteredAssignments = assignmentsList.filter((item) => {
    if (typeFilter === 'Individual') return item.assignmentType === 'INDIVIDUAL';
    if (typeFilter === 'Team') return item.assignmentType === 'TEAM';
    return true;
  });

  // Sort list
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    const dateA = new Date(a.dueDate).getTime();
    const dateB = new Date(b.dueDate).getTime();
    if (sortOrder === 'Due Date (Soonest)') {
      return dateA - dateB;
    } else if (sortOrder === 'Due Date (Latest)') {
      return dateB - dateA;
    }
    return 0;
  });

  // Compute stats
  const totalCount = assignmentsList.length;
  const completedCount = sortedAssignments.filter(item => {
    const sub = submissionMap.get(item.id);
    return sub && (sub.status === 'submitted' || sub.status === 'graded' || sub.status === 'late');
  }).length;

  // ── Instructor: create/edit dialog state ──
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [courseId, setCourseId] = useState('');
  const [cohortId, setCohortId] = useState('');
  const [moduleId, setModuleId] = useState('');
  const [assignmentType, setAssignmentType] = useState<'INDIVIDUAL' | 'TEAM'>('INDIVIDUAL');
  const [submissionType, setSubmissionType] = useState<'github' | 'text' | 'file'>('github');
  const [maxScore, setMaxScore] = useState(100);
  const [dueDate, setDueDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: cohortsRes } = useCohorts({ courseId });
  const cohortsList = cohortsRes?.data?.docs || [];
  const selectedCourse = coursesList.find((c) => c.id === courseId);
  const modulesList = selectedCourse?.modules || [];

  useEffect(() => {
    if (dialogMode === 'edit' && selectedAssignment) {
      setTitle(selectedAssignment.title || '');
      setDescription(selectedAssignment.description || '');
      setCourseId(selectedAssignment.courseId || '');
      setCohortId(selectedAssignment.cohortId || '');
      setModuleId(selectedAssignment.moduleId || '');
      setAssignmentType(selectedAssignment.assignmentType || 'INDIVIDUAL');
      setSubmissionType(selectedAssignment.submissionType || 'github');
      setMaxScore(selectedAssignment.maxScore || 100);
      setDueDate(selectedAssignment.dueDate ? selectedAssignment.dueDate.slice(0, 16) : '');
    } else {
      setTitle('');
      setDescription('');
      setCourseId('');
      setCohortId('');
      setModuleId('');
      setAssignmentType('INDIVIDUAL');
      setSubmissionType('github');
      setMaxScore(100);
      setDueDate('');
    }
  }, [dialogMode, selectedAssignment, isDialogOpen]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      try {
        await deleteAssignment.mutateAsync(id);
      } catch (err) {
        alert('Failed to delete assignment');
      }
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !courseId || !cohortId || !moduleId || !dueDate) {
      alert('Title, description, course, cohort, module, and due date are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<Assignment> = {
        title,
        description,
        courseId,
        cohortId,
        moduleId,
        assignmentType,
        submissionType,
        maxScore,
        maxPoints: maxScore,
        dueDate: new Date(dueDate).toISOString(),
      };

      if (dialogMode === 'create') {
        await createAssignment.mutateAsync(payload);
      } else if (selectedAssignment) {
        await updateAssignment.mutateAsync({ id: selectedAssignment.id, data: payload });
      }

      setIsDialogOpen(false);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save assignment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Instructor: monitor submissions modal ──
  const [monitorAssignment, setMonitorAssignment] = useState<Assignment | null>(null);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Page Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Assignments</h2>
          <p className="text-sm text-muted-foreground">Manage and track your active coursework.</p>
        </div>
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-card border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 text-foreground"
          >
            <option>All Types</option>
            <option>Individual</option>
            <option>Team</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="bg-card border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-600 text-foreground"
          >
            <option>Due Date (Soonest)</option>
            <option>Due Date (Latest)</option>
          </select>
          {isStaff && (
            <button
              onClick={() => {
                setDialogMode('create');
                setSelectedAssignment(null);
                setIsDialogOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-md shadow-sm transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              New Assignment
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Assignments List */}
        <div className="lg:col-span-8 space-y-4">
          {isAssignmentsLoading || isSubmissionsLoading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : assignmentsError ? (
            <div className="bg-red-50 text-red-800 p-4 rounded-md text-sm">
              Failed to load assignments.
            </div>
          ) : sortedAssignments.length === 0 ? (
            <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">
              No assignments found matching the criteria.
            </div>
          ) : (
            sortedAssignments.map((assignment) => {
              const submission = submissionMap.get(assignment.id);
              const isOverdue = new Date(assignment.dueDate).getTime() < Date.now();

              let statusLabel = 'In Progress';
              let statusClass = 'bg-yellow-50 text-yellow-700 border-yellow-200';

              if (submission) {
                if (submission.status === 'graded') {
                  statusLabel = 'Graded';
                  statusClass = 'bg-green-50 text-green-700 border-green-200';
                } else {
                  statusLabel = 'Submitted';
                  statusClass = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                }
              } else if (isOverdue) {
                statusLabel = 'Late';
                statusClass = 'bg-red-50 text-red-700 border-red-200';
              }

              return (
                <div
                  key={assignment.id}
                  onClick={() => !isStaff && navigate(`/assignments/${assignment.id}/submit`)}
                  className={`bg-card rounded-lg border border-border p-6 flex flex-col gap-4 shadow-sm hover:shadow-md hover:border-border transition-all relative overflow-hidden group ${!isStaff ? 'cursor-pointer' : ''}`}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${statusClass}`}>
                          {isStaff ? assignment.assignmentType : statusLabel}
                        </span>
                        {!isStaff && (
                          <span className="bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-widest">
                            {assignment.assignmentType}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-foreground mt-2 group-hover:text-blue-600 transition-colors">
                        {assignment.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">Max Score: {assignment.maxScore} points</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-semibold block ${isOverdue && !submission ? 'text-red-600' : 'text-muted-foreground'}`}>
                        Due {new Date(assignment.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {assignment.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-border pt-4 mt-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="material-symbols-outlined text-[16px]">info</span>
                      <span>Requires {assignment.submissionType || 'github'} submission</span>
                    </div>
                    {!isStaff && submission && submission.points !== undefined && (
                      <span className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md">
                        Score: {submission.points} / {assignment.maxScore}
                      </span>
                    )}
                    {!isStaff && !submission && (
                      <button className="text-xs font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                        Submit Now <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </button>
                    )}
                    {isStaff && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setMonitorAssignment(assignment)}
                          className="bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                        >
                          Monitor Submissions
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setDialogMode('edit');
                            setIsDialogOpen(true);
                          }}
                          className="bg-muted/40 hover:bg-muted border border-border text-foreground text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(assignment.id)}
                          className="bg-red-50 hover:bg-red-600 hover:text-white border border-red-100 text-red-650 text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Column 4: Stats Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-transparent pointer-events-none"></div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Total Progress</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-muted/40 border border-border rounded-md p-3 text-center">
                <span className="block text-2xl font-bold text-blue-600">{totalCount}</span>
                <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Assigned</span>
              </div>
              <div className="bg-muted/40 border border-border rounded-md p-3 text-center">
                <span className="block text-2xl font-bold text-emerald-600">{completedCount}</span>
                <span className="block text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Completed</span>
              </div>
            </div>
            {totalCount > 0 && (
              <div className="mt-6 space-y-1">
                <div className="flex justify-between text-xs text-muted-foreground font-medium">
                  <span>Completion Rate</span>
                  <span>{Math.round((completedCount / totalCount) * 100)}%</span>
                </div>
                <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-300" style={{ width: `${(completedCount / totalCount) * 100}%` }}></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- Create/Edit Dialog --- */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">
                {dialogMode === 'create' ? 'New Assignment' : 'Edit Assignment'}
              </h3>
              <button type="button" onClick={() => setIsDialogOpen(false)} className="text-muted-foreground hover:text-muted-foreground">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-5 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-foreground uppercase mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Build a responsive landing page"
                  className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase mb-1">Description *</label>
                <textarea
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the requirements..."
                  className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground h-24 resize-none focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase mb-1">Course *</label>
                <select
                  required
                  value={courseId}
                  onChange={(e) => {
                    setCourseId(e.target.value);
                    setCohortId('');
                    setModuleId('');
                  }}
                  className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">Select a Course</option>
                  {coursesList.map((c) => (
                    <option key={c.id} value={c.id}>{c.title} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase mb-1">Cohort *</label>
                <select
                  required
                  disabled={!courseId}
                  value={cohortId}
                  onChange={(e) => setCohortId(e.target.value)}
                  className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground disabled:bg-muted/40 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                >
                  <option value="">Select a Cohort</option>
                  {cohortsList.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground uppercase mb-1">Module *</label>
                {modulesList.length > 0 ? (
                  <select
                    required
                    disabled={!courseId}
                    value={moduleId}
                    onChange={(e) => setModuleId(e.target.value)}
                    className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground disabled:bg-muted/40 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="">Select a Module</option>
                    {modulesList.map((m) => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    required
                    disabled={!courseId}
                    value={moduleId}
                    onChange={(e) => setModuleId(e.target.value)}
                    placeholder="This course has no modules yet — enter a module reference"
                    className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground disabled:bg-muted/40 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase mb-1">Type</label>
                  <select
                    value={assignmentType}
                    onChange={(e) => setAssignmentType(e.target.value as 'INDIVIDUAL' | 'TEAM')}
                    className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="INDIVIDUAL">Individual</option>
                    <option value="TEAM">Team</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase mb-1">Submission Type</label>
                  <select
                    value={submissionType}
                    onChange={(e) => setSubmissionType(e.target.value as 'github' | 'text' | 'file')}
                    className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="github">GitHub Repo</option>
                    <option value="text">Text</option>
                    <option value="file">File</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase mb-1">Max Score</label>
                  <input
                    type="number"
                    min="1"
                    value={maxScore}
                    onChange={(e) => setMaxScore(Number(e.target.value))}
                    className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground uppercase mb-1">Due Date *</label>
                  <input
                    type="datetime-local"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-card border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div className="border-t border-border pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsDialogOpen(false)} className="px-4 py-2 border border-border hover:bg-muted text-foreground text-sm font-semibold rounded">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-semibold rounded flex items-center gap-1.5"
                >
                  {isSubmitting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> : null}
                  {dialogMode === 'create' ? 'Create' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- Monitor Submissions Modal --- */}
      {monitorAssignment && (
        <MonitorSubmissionsModal assignment={monitorAssignment} onClose={() => setMonitorAssignment(null)} />
      )}
    </div>
  );
}

function MonitorSubmissionsModal({ assignment, onClose }: { assignment: Assignment; onClose: () => void }) {
  const { data: submissionsRes, isLoading } = useAssignmentSubmissions(assignment.id);
  const gradeSubmission = useGradeSubmission();
  const submissions = submissionsRes?.data?.submissions || [];

  const [gradingId, setGradingId] = useState<string | null>(null);
  const [points, setPoints] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const startGrading = (sub: any) => {
    setGradingId(sub.id);
    setPoints(sub.points ?? assignment.maxScore);
    setFeedback(sub.feedback || '');
  };

  const handleGrade = async (id: string) => {
    if (!feedback.trim()) {
      alert('Feedback is required (at least 3 characters).');
      return;
    }
    setIsSaving(true);
    try {
      await gradeSubmission.mutateAsync({ id, data: { points, feedback } });
      setGradingId(null);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save grade.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-foreground">Submissions — {assignment.title}</h3>
            <p className="text-xs text-muted-foreground">{submissions.length} submission{submissions.length === 1 ? '' : 's'}</p>
          </div>
          <button type="button" onClick={onClose} className="text-muted-foreground hover:text-muted-foreground">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-3">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : submissions.length === 0 ? (
            <div className="text-center text-muted-foreground py-10">No students have submitted yet.</div>
          ) : (
            submissions.map((sub: any) => (
              <div key={sub.id} className="border border-border rounded-lg p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-foreground">{sub.studentName || 'Unknown Student'}</p>
                    <p className="text-xs text-muted-foreground">
                      {sub.status === 'graded' ? `Graded — ${sub.points}/${assignment.maxScore}` : sub.status === 'late' ? 'Submitted Late' : 'Submitted'}
                      {' · '}{new Date(sub.submittedAt).toLocaleString()}
                    </p>
                  </div>
                  {gradingId !== sub.id && (
                    <button
                      onClick={() => startGrading(sub)}
                      className="bg-blue-50 hover:bg-blue-100 border border-blue-100 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded transition-colors"
                    >
                      {sub.status === 'graded' ? 'Edit Grade' : 'Grade'}
                    </button>
                  )}
                </div>

                {sub.repoUrl && (
                  <a href={sub.repoUrl} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">link</span>{sub.repoUrl}
                  </a>
                )}
                {sub.content && <p className="text-xs text-muted-foreground whitespace-pre-wrap bg-muted/40 rounded p-2">{sub.content}</p>}
                {sub.feedback && gradingId !== sub.id && (
                  <p className="text-xs text-muted-foreground italic">Feedback: {sub.feedback}</p>
                )}

                {gradingId === sub.id && (
                  <div className="border-t border-border pt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-foreground uppercase">Points</label>
                      <input
                        type="number"
                        min="0"
                        max={assignment.maxScore}
                        value={points}
                        onChange={(e) => setPoints(Number(e.target.value))}
                        className="w-24 bg-card border border-border rounded px-2 py-1 text-sm"
                      />
                      <span className="text-xs text-muted-foreground">/ {assignment.maxScore}</span>
                    </div>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Feedback for the student..."
                      className="w-full bg-card border border-border rounded px-3 py-2 text-sm h-20 resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setGradingId(null)} className="px-3 py-1.5 border border-border text-foreground text-xs font-semibold rounded">
                        Cancel
                      </button>
                      <button
                        onClick={() => handleGrade(sub.id)}
                        disabled={isSaving}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-semibold rounded"
                      >
                        {isSaving ? 'Saving...' : 'Save Grade'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
