import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { useAssignments, useSubmissions } from '@/hooks/useAssignments';
import { useSessions } from '@/hooks/useSessions';
import { useResources } from '@/hooks/useResources';
import { useAnnouncements } from '@/hooks/useAnnouncements';
import { useCurriculumDetail } from '@/hooks/useCurriculum';
import { useContinueLearning } from '@/hooks/useContinueLearning';
import LearningRoadmap from './LearningRoadmap';
import HubAssignmentCard from './HubAssignmentCard';
import HubSessionCard from './HubSessionCard';
import HubProgressChart from './HubProgressChart';
import type { Course, Enrollment, Cohort, Assignment, Session, Resource, Announcement, Submission } from '@/types';

interface StudentLearningHubProps {
  course: Course;
  enrollment: Enrollment;
}

/* ── helpers ── */
const sectionAnim: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
};

const resourceIcons: Record<string, string> = {
  PDF: 'picture_as_pdf',
  VIDEO: 'videocam',
  LINK: 'link',
  ZIP: 'folder_zip',
  GITHUB: 'code',
  SLIDES: 'slideshow',
};

export default function StudentLearningHub({ course, enrollment }: StudentLearningHubProps) {
  const courseId = course.id;

  /* ── Data queries ── */
  const { data: curriculumRes } = useCurriculumDetail(courseId);
  const { continueUrl } = useContinueLearning(courseId);
  const { data: assignmentsRes } = useAssignments({ courseId });
  const { data: submissionsRes } = useSubmissions();
  const { data: sessionsRes } = useSessions({ courseId });
  const { data: resourcesRes } = useResources({ courseId });
  const { data: announcementsRes } = useAnnouncements({ courseId });

  const curriculum = curriculumRes?.data?.[0] || (curriculumRes as any)?.[0];
  const modules = curriculum?.modules || [];
  const assignments: Assignment[] = assignmentsRes?.data?.docs || [];
  const submissions: Submission[] = submissionsRes?.data?.submissions || [];
  const sessions: Session[] = sessionsRes?.data?.docs || [];
  const resources: Resource[] = resourcesRes?.data?.docs || [];
  const announcements: Announcement[] = announcementsRes?.data?.docs || [];

  /* ── Derived data ── */
  const progress = enrollment.progressPercentage || 0;
  const currentModuleIndex = useMemo(() => {
    if (modules.length === 0) return -1;
    const done = Math.floor((progress / 100) * modules.length);
    return Math.min(done, modules.length - 1);
  }, [modules, progress]);

  const currentModule = modules[currentModuleIndex] || modules[0];

  const submissionMap = useMemo(() => {
    const map: Record<string, Submission> = {};
    for (const s of submissions) {
      map[s.assignmentId] = s;
    }
    return map;
  }, [submissions]);

  const pendingAssignments = assignments.filter((a) => {
    const sub = submissionMap[a.id];
    return !sub || (sub.status !== 'graded');
  });

  const upcomingSessions = sessions
    .filter((s) => s.status === 'UPCOMING' || s.status === 'ACTIVE' || new Date(s.sessionDate) >= new Date())
    .sort((a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime());

  const pastSessions = sessions
    .filter((s) => s.status === 'COMPLETED' && s.recordingLink)
    .sort((a, b) => new Date(b.sessionDate).getTime() - new Date(a.sessionDate).getTime())
    .slice(0, 3);

  const assignmentStats = assignments
    .filter((a) => submissionMap[a.id]?.status === 'graded')
    .map((a) => ({
      title: a.title,
      score: submissionMap[a.id]?.points || submissionMap[a.id]?.score || 0,
      max: a.maxPoints || a.maxScore || 100,
    }));

  const urgentAnnouncements = announcements
    .filter((a) => a.priority === 'HIGH' || a.priority === 'URGENT')
    .slice(0, 3);

  const groupedResources = useMemo(() => {
    const groups: Record<string, Resource[]> = {};
    for (const r of resources) {
      const type = r.resourceType || 'LINK';
      if (!groups[type]) groups[type] = [];
      groups[type].push(r);
    }
    return groups;
  }, [resources]);

  // Enrollment cohort
  const cohort = enrollment.cohortId as Partial<Cohort> | undefined;
  const cohortName = cohort?.name || cohort?.code || 'N/A';

  return (
    <div className="space-y-8 pb-12 p-8">
      {/* ═══════ COURSE HEADER ═══════ */}
      <motion.section
        custom={0}
        initial="hidden"
        animate="visible"
        variants={sectionAnim}
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-linear-to-br from-card via-card to-primary/5 p-6 md:p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

        <div className="relative flex flex-col md:flex-row gap-6">
          {/* Thumbnail */}
          {(course.thumbnail || course.image) && (
            <div
              className="shrink-0 w-full md:w-48 h-32 md:h-auto rounded-xl bg-muted bg-cover bg-center border border-border/40"
              style={{ backgroundImage: `url(${course.thumbnail || course.image})` }}
            />
          )}

          <div className="flex-1 min-w-0 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                {course.category} · {course.level || 'Beginner'}
              </span>
              <h1 className="text-xl md:text-2xl font-bold text-foreground mt-1">{course.title}</h1>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetaItem icon="school" label="Cohort" value={cohortName} />
              <MetaItem icon="calendar_today" label="Enrolled" value={
                enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'
              } />
              <MetaItem icon="schedule" label="Duration" value={`${course.durationWeeks} wks`} />
              <MetaItem icon="workspace_premium" label="Certificate" value={enrollment.certificateIssued ? 'Earned ✓' : 'Pending'} />
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="text-primary">{progress}%</span>
              </div>
              <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-linear-to-r from-primary to-primary/70 rounded-full"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* ═══════ QUICK ACTIONS ═══════ */}
      <motion.section custom={1} initial="hidden" animate="visible" variants={sectionAnim}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <QuickAction icon="play_circle" label="Continue Learning" href={continueUrl} primary />
          <QuickAction icon="assignment" label="Assignments" href="/assignments" badge={pendingAssignments.length || undefined} />
          <QuickAction icon="folder_open" label="Resources" href="/resources" />
          <QuickAction icon="videocam" label="Live Sessions" href="/sessions" />
        </div>
      </motion.section>

      {/* ═══════ URGENT ANNOUNCEMENTS ═══════ */}
      {urgentAnnouncements.length > 0 && (
        <motion.section custom={2} initial="hidden" animate="visible" variants={sectionAnim}>
          <div className="space-y-2">
            {urgentAnnouncements.map((a) => (
              <div
                key={a.id}
                className={`flex items-start gap-3 p-3 rounded-xl border text-sm ${
                  a.priority === 'URGENT'
                    ? 'bg-red-500/5 border-red-500/20 text-red-700 dark:text-red-300'
                    : 'bg-amber-500/5 border-amber-500/20 text-amber-700 dark:text-amber-300'
                }`}
              >
                <span className="material-symbols-outlined text-[18px] mt-0.5 shrink-0">
                  {a.priority === 'URGENT' ? 'error' : 'warning'}
                </span>
                <div>
                  <span className="font-semibold">{a.title}</span>
                  <p className="text-xs opacity-80 line-clamp-1 mt-0.5">{a.content}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ═══════ LEFT COLUMN: Roadmap + Assignments ═══════ */}
        <div className="lg:col-span-2 space-y-8">
          {/* Current Phase Card */}
          {currentModule && (
            <motion.section custom={3} initial="hidden" animate="visible" variants={sectionAnim}>
              <SectionHeader icon="flag" title="Current Phase" />
              <div className="bg-linear-to-r from-primary/5 via-card to-card border border-primary/20 rounded-xl p-5 mt-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Phase {currentModuleIndex + 1}</span>
                    <h3 className="text-base font-semibold text-foreground mt-0.5">{currentModule.title}</h3>
                    {currentModule.lessons && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {currentModule.lessons.length} lesson{currentModule.lessons.length !== 1 ? 's' : ''} remaining
                      </p>
                    )}
                  </div>
                  <Link
                    to={continueUrl}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                    Continue
                  </Link>
                </div>
              </div>
            </motion.section>
          )}

          {/* Learning Roadmap */}
          <motion.section custom={4} initial="hidden" animate="visible" variants={sectionAnim}>
            <SectionHeader icon="route" title="Learning Roadmap" />
            <div className="mt-4">
              {modules.length > 0 ? (
                <LearningRoadmap modules={modules} currentModuleIndex={currentModuleIndex} />
              ) : (
                <EmptyState icon="map" text="Curriculum roadmap coming soon" />
              )}
            </div>
          </motion.section>

          {/* Assignment Center */}
          <motion.section custom={5} initial="hidden" animate="visible" variants={sectionAnim}>
            <SectionHeader icon="assignment" title="Assignments" badge={pendingAssignments.length || undefined} />
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              {assignments.length > 0 ? (
                assignments.slice(0, 6).map((a) => (
                  <HubAssignmentCard key={a.id} assignment={a} submission={submissionMap[a.id] || null} />
                ))
              ) : (
                <EmptyState icon="assignment" text="No assignments yet" className="md:col-span-2" />
              )}
            </div>
            {assignments.length > 6 && (
              <div className="mt-3 text-center">
                <Link to="/assignments" className="text-xs font-semibold text-primary hover:underline">
                  View all {assignments.length} assignments →
                </Link>
              </div>
            )}
          </motion.section>

          {/* Progress Analytics */}
          <motion.section custom={6} initial="hidden" animate="visible" variants={sectionAnim}>
            <SectionHeader icon="analytics" title="Progress Analytics" />
            <div className="mt-3">
              <HubProgressChart completionPercent={progress} assignmentStats={assignmentStats} />
            </div>
          </motion.section>
        </div>

        {/* ═══════ RIGHT COLUMN: Sessions + Resources + Announcements ═══════ */}
        <div className="space-y-8">
          {/* Live Sessions */}
          <motion.section custom={3} initial="hidden" animate="visible" variants={sectionAnim}>
            <SectionHeader icon="videocam" title="Live Sessions" />
            <div className="mt-3 space-y-3">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.slice(0, 3).map((s, i) => (
                  <HubSessionCard key={s.id} session={s} isNext={i === 0} />
                ))
              ) : (
                <EmptyState icon="videocam_off" text="No upcoming sessions" />
              )}
              {pastSessions.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                    Recent Recordings
                  </span>
                  {pastSessions.map((s) => (
                    <HubSessionCard key={s.id} session={s} />
                  ))}
                </div>
              )}
              <Link to="/sessions" className="block text-center text-xs font-semibold text-primary hover:underline pt-1">
                View all sessions →
              </Link>
            </div>
          </motion.section>

          {/* Resources */}
          <motion.section custom={4} initial="hidden" animate="visible" variants={sectionAnim}>
            <SectionHeader icon="folder_open" title="Resources" />
            <div className="mt-3 space-y-2">
              {Object.keys(groupedResources).length > 0 ? (
                Object.entries(groupedResources).map(([type, items]) => (
                  <div key={type} className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">{resourceIcons[type] || 'description'}</span>
                      {type} ({items.length})
                    </span>
                    {items.slice(0, 3).map((r) => (
                      <a
                        key={r.id}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2.5 bg-card/60 border border-border/40 rounded-lg hover:border-primary/30 hover:bg-primary/5 transition-all group text-xs"
                      >
                        <span className="material-symbols-outlined text-[16px] text-muted-foreground group-hover:text-primary transition-colors">
                          {resourceIcons[type] || 'description'}
                        </span>
                        <span className="text-foreground font-medium truncate flex-1">{r.title}</span>
                        <span className="material-symbols-outlined text-[14px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                          open_in_new
                        </span>
                      </a>
                    ))}
                  </div>
                ))
              ) : (
                <EmptyState icon="folder_off" text="No resources uploaded yet" />
              )}
              <Link to="/resources" className="block text-center text-xs font-semibold text-primary hover:underline pt-1">
                View all resources →
              </Link>
            </div>
          </motion.section>

          {/* Announcements */}
          <motion.section custom={5} initial="hidden" animate="visible" variants={sectionAnim}>
            <SectionHeader icon="campaign" title="Announcements" />
            <div className="mt-3 space-y-2">
              {announcements.length > 0 ? (
                announcements.slice(0, 4).map((a) => (
                  <div
                    key={a.id}
                    className="p-3 bg-card/60 border border-border/40 rounded-xl hover:border-primary/20 transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {(a.priority === 'HIGH' || a.priority === 'URGENT') && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                      )}
                      <h5 className="text-xs font-semibold text-foreground truncate">{a.title}</h5>
                    </div>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">{a.content}</p>
                    <span className="text-[10px] text-muted-foreground/60 mt-1 block">
                      {new Date(a.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))
              ) : (
                <EmptyState icon="notifications_off" text="No announcements yet" />
              )}
              <Link to="/announcements" className="block text-center text-xs font-semibold text-primary hover:underline pt-1">
                View all →
              </Link>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

/* ── Small helper components ── */

function MetaItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="bg-background/60 border border-border/40 rounded-lg p-2.5">
      <div className="flex items-center gap-1.5 mb-0.5">
        <span className="material-symbols-outlined text-[14px] text-muted-foreground">{icon}</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-xs font-semibold text-foreground">{value}</span>
    </div>
  );
}

function SectionHeader({ icon, title, badge }: { icon: string; title: string; badge?: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="material-symbols-outlined text-[20px] text-primary">{icon}</span>
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">{title}</h3>
      {badge !== undefined && badge > 0 && (
        <span className="ml-auto inline-flex items-center justify-center w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full">
          {badge}
        </span>
      )}
    </div>
  );
}

function EmptyState({ icon, text, className }: { icon: string; text: string; className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center py-8 text-muted-foreground/60 ${className || ''}`}>
      <span className="material-symbols-outlined text-[32px] mb-2">{icon}</span>
      <span className="text-xs">{text}</span>
    </div>
  );
}

function QuickAction({ icon, label, href, primary, badge }: { icon: string; label: string; href: string; primary?: boolean; badge?: number }) {
  return (
    <Link
      to={href}
      className={`relative flex flex-col items-center gap-1.5 p-3 rounded-xl border text-center transition-all duration-200 group ${
        primary
          ? 'bg-primary/10 border-primary/20 hover:bg-primary/15 hover:border-primary/30'
          : 'bg-card/60 border-border/40 hover:border-primary/20 hover:bg-primary/5'
      }`}
    >
      <span className={`material-symbols-outlined text-[22px] ${primary ? 'text-primary' : 'text-muted-foreground group-hover:text-primary'} transition-colors`}>
        {icon}
      </span>
      <span className={`text-[10px] font-semibold uppercase tracking-wider ${primary ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'} transition-colors`}>
        {label}
      </span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute top-1.5 right-1.5 inline-flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[8px] font-bold rounded-full">
          {badge}
        </span>
      )}
    </Link>
  );
}
