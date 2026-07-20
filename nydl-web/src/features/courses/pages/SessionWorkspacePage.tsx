import { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCourse } from '@/hooks/useCourses';
import { useCurriculumDetail } from '@/hooks/useCurriculum';
import { useAssignments, useSubmissions } from '@/hooks/useAssignments';
import { useLessonProgress } from '@/hooks/useLessonProgress';
import { toast } from 'sonner';

export default function SessionWorkspacePage() {
  const { courseId, sessionId } = useParams<{ courseId: string; sessionId: string }>();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'content' | 'practice' | 'assignments' | 'resources'>('content');

  // Queries
  const { data: courseRes, isLoading: courseLoading } = useCourse(courseId || '');
  const { data: curriculumRes, isLoading: curriculumLoading } = useCurriculumDetail(courseId || '');
  const { data: assignmentsRes } = useAssignments({ courseId });
  const { data: submissionsRes } = useSubmissions();

  // Progress logic
  const { completedLessonIds, toggleLesson, isCompleted } = useLessonProgress(courseId || '');

  // Parse queries
  const course = courseRes?.data;
  const curriculum = curriculumRes?.data?.[0] || (curriculumRes as any)?.[0];
  const modules = curriculum?.modules || [];
  const assignments = assignmentsRes?.data?.docs || [];
  const submissions = submissionsRes?.data?.submissions || [];

  // Find active Lesson, Module, list of all lessons
  const { activeLesson, activeModule, allLessons } = useMemo(() => {
    let activeLesson = null;
    let activeModule = null;
    const allLessons: any[] = [];

    for (const mod of modules) {
      if (mod.lessons) {
        for (const les of mod.lessons) {
          allLessons.push({ ...les, moduleTitle: mod.title });
          if (les.id === sessionId) {
            activeLesson = les;
            activeModule = mod;
          }
        }
      }
    }

    return { activeLesson, activeModule, allLessons };
  }, [modules, sessionId]);

  const activeLessonCompleted = isCompleted(sessionId || '');

  // Submissions mapping
  const submissionMap = useMemo(() => {
    const map: Record<string, any> = {};
    for (const s of submissions) {
      map[s.assignmentId] = s;
    }
    return map;
  }, [submissions]);

  // Assignments linked to THIS session
  const sessionAssignments = useMemo(() => {
    return assignments.filter((a) => a.sessionId === sessionId || (a as any).moduleId === activeModule?.id && !a.sessionId);
  }, [assignments, sessionId, activeModule]);

  // Next / Prev Lessons
  const { prevLesson, nextLesson } = useMemo(() => {
    const idx = allLessons.findIndex((l) => l.id === sessionId);
    return {
      prevLesson: idx > 0 ? allLessons[idx - 1] : null,
      nextLesson: idx !== -1 && idx < allLessons.length - 1 ? allLessons[idx + 1] : null,
    };
  }, [allLessons, sessionId]);

  if (courseLoading || curriculumLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background space-y-4">
        <span className="material-symbols-outlined text-[48px] text-primary animate-spin">sync</span>
        <span className="text-sm text-muted-foreground font-medium">Preparing Workspace...</span>
      </div>
    );
  }

  if (!course || !activeLesson) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background space-y-4">
        <span className="material-symbols-outlined text-[48px] text-destructive">error</span>
        <h3 className="text-lg font-bold text-foreground">Session Not Found</h3>
        <p className="text-sm text-muted-foreground">The requested learning session outline could not be loaded.</p>
        <button
          onClick={() => navigate(`/courses/${courseId}`)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/95 transition-colors"
        >
          Back to Course Detail
        </button>
      </div>
    );
  }

  const handleMarkComplete = () => {
    toggleLesson(activeLesson.id);
    if (!activeLessonCompleted) {
      toast.success('Nice job! Session marked as completed.');
    }
  };

  const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return '';
    try {
      const parsed = new URL(url);
      if (parsed.hostname.includes('youtube.com') || parsed.hostname.includes('youtu.be')) {
        let videoId = '';
        if (parsed.hostname.includes('youtu.be')) {
          videoId = parsed.pathname.substring(1);
        } else {
          videoId = parsed.searchParams.get('v') || '';
        }
        return `https://www.youtube.com/embed/${videoId}`;
      }
    } catch {
      // fallback
    }
    return url;
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar with syllabus list */}
      <aside className="w-80 border-r border-border/40 bg-card/65 flex flex-col shrink-0 hidden lg:flex">
        <div className="p-4 border-b border-border/40 space-y-2">
          <Link
            to={`/courses/${courseId}`}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors font-semibold"
          >
            <span className="material-symbols-outlined text-[14px]">arrow_back</span>
            Back to Course Hub
          </Link>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-foreground uppercase tracking-wider line-clamp-1">{course.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-muted h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300"
                style={{ width: `${allLessons.length ? (completedLessonIds.length / allLessons.length) * 100 : 0}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-muted-foreground font-mono shrink-0">
              {completedLessonIds.length}/{allLessons.length}
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {modules.map((mod: any) => (
            <div key={mod.id} className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-2 block">
                {mod.title}
              </span>
              <div className="space-y-0.5">
                {mod.lessons?.map((les: any) => {
                  const isCurrent = les.id === sessionId;
                  const isDone = isCompleted(les.id);
                  return (
                    <button
                      key={les.id}
                      onClick={() => navigate(`/courses/${courseId}/sessions/${les.id}`)}
                      className={`w-full text-left flex items-start gap-2.5 px-3 py-2 rounded-lg text-xs leading-relaxed transition-all ${
                        isCurrent
                          ? 'bg-primary/10 border border-primary/25 text-foreground font-semibold shadow-xs'
                          : 'hover:bg-primary/5 text-muted-foreground hover:text-foreground border border-transparent'
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[16px] shrink-0 mt-0.5 transition-colors ${
                          isDone ? 'text-emerald-500 font-bold' : isCurrent ? 'text-primary' : 'text-neutral-500'
                        }`}
                      >
                        {isDone ? 'check_circle' : les.lessonType === 'VIDEO' ? 'play_circle' : 'description'}
                      </span>
                      <span className="flex-1 truncate">{les.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main learning workspace */}
      <main className="flex-1 flex flex-col overflow-hidden bg-background">
        {/* Top Header navbar */}
        <header className="h-14 border-b border-border/40 bg-card/40 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3">
            <Link to={`/courses/${courseId}`} className="lg:hidden text-muted-foreground hover:text-foreground">
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
            </Link>
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-primary font-mono block">
                {activeModule?.title} · Day {activeLesson.order}
              </span>
              <h1 className="text-sm font-bold text-foreground truncate max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
                {activeLesson.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-350 pr-2 pl-1.5 py-0.5 rounded-full font-mono flex items-center gap-1">
              <span className="material-symbols-outlined text-[10px] text-zinc-500">schedule</span>
              {activeLesson.estimatedMinutes || activeLesson.duration || 30} mins
            </span>
            <button
              onClick={handleMarkComplete}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeLessonCompleted
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
                {activeLessonCompleted ? 'check_circle' : 'check'}
              </span>
              {activeLessonCompleted ? 'Completed' : 'Mark Completed'}
            </button>
          </div>
        </header>

        {/* Learning layout scroll container */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          {/* Video / Embed Panel (Premium Dark Framed box) */}
          {activeLesson.videoUrl && (
            <div className="w-full bg-zinc-950 border-b border-border/30 flex items-center justify-center p-4 sm:p-8 shrink-0">
              <div className="w-full max-w-4xl aspect-video rounded-xl overflow-hidden border border-zinc-800 shadow-2xl relative bg-black group">
                <iframe
                  src={getYoutubeEmbedUrl(activeLesson.videoUrl)}
                  title={activeLesson.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Navigation / Content split tabs */}
          <div className="border-b border-border/40 bg-card/20 px-6 shrink-0 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('content')}
                className={`py-3.5 px-4 font-semibold text-xs transition-colors border-b-2 flex items-center gap-1.5 select-none ${
                  activeTab === 'content'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
                Lesson Notes
              </button>
              {(activeLesson.practiceActivities && activeLesson.practiceActivities.length > 0) && (
                <button
                  onClick={() => setActiveTab('practice')}
                  className={`py-3.5 px-4 font-semibold text-xs transition-colors border-b-2 flex items-center gap-1.5 select-none ${
                    activeTab === 'practice'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">terminal</span>
                  Ungraded Practice
                </button>
              )}
              {sessionAssignments.length > 0 && (
                <button
                  onClick={() => setActiveTab('assignments')}
                  className={`py-3.5 px-4 font-semibold text-xs transition-colors border-b-2 flex items-center gap-1.5 select-none ${
                    activeTab === 'assignments'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">assignment</span>
                  Assignments ({sessionAssignments.length})
                </button>
              )}
              {(activeLesson.resources && activeLesson.resources.length > 0) && (
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`py-3.5 px-4 font-semibold text-xs transition-colors border-b-2 flex items-center gap-1.5 select-none ${
                    activeTab === 'resources'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">folder_open</span>
                  Resources
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={!prevLesson}
                onClick={() => navigate(`/courses/${courseId}/sessions/${prevLesson.id}`)}
                className="p-1 px-2 border border-border/40 hover:bg-muted text-muted-foreground disabled:opacity-30 disabled:pointer-events-none rounded text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors"
                title={prevLesson?.title}
              >
                <span className="material-symbols-outlined text-[12px]">chevron_left</span> Prev
              </button>
              <button
                disabled={!nextLesson}
                onClick={() => navigate(`/courses/${courseId}/sessions/${nextLesson.id}`)}
                className="p-1 px-2 border border-border/40 hover:bg-muted text-foreground disabled:opacity-30 disabled:pointer-events-none rounded text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors"
                title={nextLesson?.title}
              >
                Next <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              </button>
            </div>
          </div>

          {/* Dynamic Tab Body content */}
          <div className="flex-1 p-6 md:p-8 max-w-4xl mx-auto w-full">
            <AnimatePresence mode="wait">
              {activeTab === 'content' && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {/* Learning Objectives box */}
                  {activeLesson.learningObjectives && activeLesson.learningObjectives.length > 0 && (
                    <div className="p-4 bg-muted/40 border border-border/40 rounded-xl space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">track_changes</span>
                        Learning Objectives
                      </span>
                      <ul className="text-xs text-muted-foreground space-y-1.5 list-disc pl-4">
                        {activeLesson.learningObjectives.map((obj: string, i: number) => (
                          <li key={i}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Notes Markdown Renderer */}
                  <div className="prose dark:prose-invert max-w-none space-y-4">
                    <h3 className="text-base font-bold text-foreground uppercase tracking-wider border-b border-border/40 pb-2">Session Notes</h3>
                    <p className="text-sm font-light text-muted-foreground leading-relaxed whitespace-pre-line">
                      {activeLesson.notesMarkdown || activeLesson.content}
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === 'practice' && (
                <motion.div
                  key="practice"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-foreground uppercase tracking-wider">Practice Activities</h3>
                    <p className="text-xs text-muted-foreground">Complete these ungraded lab exercises to consolidate your knowledge.</p>
                  </div>

                  <div className="space-y-3">
                    {activeLesson.practiceActivities?.map((task: any, i: number) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-4 bg-card/40 border border-border/40 rounded-xl hover:border-primary/20 transition-all group"
                      >
                        <span className="material-symbols-outlined text-[20px] text-primary mt-0.5 shrink-0">
                          code_blocks
                        </span>
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                            {task.title}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{task.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'assignments' && (
                <motion.div
                  key="assignments"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground uppercase tracking-wider">Required Coursework</h3>
                    <p className="text-xs text-muted-foreground">Mandatory assignments belonging to this syllabus node.</p>
                  </div>

                  <div className="space-y-3">
                    {sessionAssignments.map((a) => {
                      const sub = submissionMap[a.id];
                      return (
                        <div
                          key={a.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-card border border-border/40 rounded-xl hover:border-primary/20 transition-all"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-primary/10 border border-primary/20 text-primary px-1.5 py-0.5 rounded font-mono">
                                {a.category || 'GRADED'}
                              </span>
                              <span className="text-[10px] text-muted-foreground font-mono">
                                Max Points: {a.maxPoints || a.maxScore || 100}
                              </span>
                            </div>
                            <h4 className="text-sm font-semibold text-foreground">{a.title}</h4>
                            <p className="text-xs text-muted-foreground leading-relaxed max-w-xl">{a.description}</p>
                          </div>

                          <div className="flex flex-col items-end gap-1.5 self-start sm:self-center shrink-0">
                            {sub ? (
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                sub.status === 'graded' 
                                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                                  : 'bg-amber-500/10 text-amber-600'
                              }`}>
                                {sub.status === 'graded' ? `Graded: ${sub.points || sub.score}/${a.maxPoints || a.maxScore}` : 'Submitted'}
                              </span>
                            ) : (
                              <span className="text-[10px] text-zinc-500 font-mono">
                                Due: {new Date(a.dueDate).toLocaleDateString()}
                              </span>
                            )}
                            <Link
                              to={`/assignments?id=${a.id}`}
                              className="px-3 py-1 bg-zinc-150 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 text-[10px] font-bold rounded-lg transition-colors border border-border/20"
                            >
                              Open Workspace
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {activeTab === 'resources' && (
                <motion.div
                  key="resources"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-foreground uppercase tracking-wider">Lesson Attachments</h3>
                    <p className="text-xs text-muted-foreground">Download slides, reference guides, or github repositories.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeLesson.resources?.map((res: any, i: number) => (
                      <a
                        key={i}
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-card/60 border border-border/40 hover:border-primary/30 hover:bg-primary/5 rounded-xl transition-all group"
                      >
                        <span className="material-symbols-outlined text-[20px] text-primary shrink-0">
                          link
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors truncate">
                            {res.title}
                          </h4>
                          <span className="text-[10px] text-muted-foreground font-mono truncate block">
                            {res.url}
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
