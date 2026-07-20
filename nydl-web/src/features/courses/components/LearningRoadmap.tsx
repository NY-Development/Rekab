import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RoadmapModule {
  id: string;
  title: string;
  description?: string;
  order?: number;
  lessons?: { id: string; title: string; content?: string }[];
}

interface LearningRoadmapProps {
  modules: RoadmapModule[];
  /** Index of the module the student is currently on (0-based). -1 means none started. */
  currentModuleIndex: number;
}

type NodeStatus = 'completed' | 'current' | 'available' | 'locked';

function getNodeStatus(index: number, currentIndex: number): NodeStatus {
  if (index < currentIndex) return 'completed';
  if (index === currentIndex) return 'current';
  if (index === currentIndex + 1) return 'available';
  return 'locked';
}

const statusStyles: Record<NodeStatus, { ring: string; bg: string; icon: string; text: string; line: string }> = {
  completed: {
    ring: 'ring-emerald-500/30',
    bg: 'bg-emerald-500',
    icon: 'check_circle',
    text: 'text-emerald-600 dark:text-emerald-400',
    line: 'from-emerald-500 to-emerald-500',
  },
  current: {
    ring: 'ring-primary/40',
    bg: 'bg-primary',
    icon: 'play_circle',
    text: 'text-primary',
    line: 'from-primary to-primary/30',
  },
  available: {
    ring: 'ring-blue-500/20',
    bg: 'bg-blue-500/60',
    icon: 'lock_open',
    text: 'text-blue-500 dark:text-blue-400',
    line: 'from-blue-500/30 to-muted-foreground/20',
  },
  locked: {
    ring: 'ring-border',
    bg: 'bg-muted-foreground/30',
    icon: 'lock',
    text: 'text-muted-foreground/60',
    line: 'from-muted-foreground/20 to-muted-foreground/10',
  },
};

export default function LearningRoadmap({ modules, currentModuleIndex }: LearningRoadmapProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="relative">
      {modules.map((mod, idx) => {
        const status = getNodeStatus(idx, currentModuleIndex);
        const styles = statusStyles[status];
        const isLast = idx === modules.length - 1;
        const isExpanded = expandedId === mod.id;
        const canExpand = status !== 'locked' && mod.lessons && mod.lessons.length > 0;

        return (
          <div key={mod.id} className="relative flex gap-4 md:gap-6">
            {/* Vertical line + Node */}
            <div className="flex flex-col items-center shrink-0">
              {/* Node */}
              <motion.button
                whileHover={canExpand ? { scale: 1.1 } : {}}
                whileTap={canExpand ? { scale: 0.95 } : {}}
                onClick={() => canExpand && setExpandedId(isExpanded ? null : mod.id)}
                className={`relative z-10 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center ring-4 ${styles.ring} ${styles.bg} text-white shadow-lg transition-all duration-300 ${
                  canExpand ? 'cursor-pointer' : 'cursor-default'
                } ${status === 'current' ? 'animate-pulse' : ''}`}
                aria-label={`Module ${idx + 1}: ${mod.title} — ${status}`}
              >
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">{styles.icon}</span>

                {/* Active glow */}
                {status === 'current' && (
                  <span className="absolute inset-0 rounded-full ring-2 ring-primary/50 animate-ping" />
                )}
              </motion.button>

              {/* Connecting line */}
              {!isLast && (
                <div className={`w-0.5 flex-1 min-h-10 bg-linear-to-b ${styles.line}`} />
              )}
            </div>

            {/* Content */}
            <div className={`flex-1 pb-8 ${isLast ? 'pb-0' : ''}`}>
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.08, duration: 0.3 }}
                className={`bg-card/60 backdrop-blur-sm border rounded-xl p-4 transition-all duration-300 ${
                  status === 'current'
                    ? 'border-primary/30 shadow-lg shadow-primary/5'
                    : status === 'completed'
                    ? 'border-emerald-500/20'
                    : 'border-border/60'
                } ${status === 'locked' ? 'opacity-50' : ''}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${styles.text}`}>
                      Phase {idx + 1} · {status === 'completed' ? 'Completed' : status === 'current' ? 'In Progress' : status === 'available' ? 'Unlocked' : 'Locked'}
                    </span>
                    <h4 className="text-sm font-semibold text-foreground mt-0.5">{mod.title}</h4>
                    {mod.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{mod.description}</p>
                    )}
                  </div>
                  {canExpand && (
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      className="material-symbols-outlined text-muted-foreground text-[18px] mt-1 shrink-0"
                    >
                      expand_more
                    </motion.span>
                  )}
                </div>

                {/* Lesson sub-nodes */}
                <AnimatePresence>
                  {isExpanded && mod.lessons && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-border/40 space-y-2">
                        {mod.lessons.map((lesson, lIdx) => {
                          const lessonCompleted = status === 'completed';
                          const lessonCurrent = status === 'current' && lIdx === 0;

                          return (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-2.5 pl-1"
                            >
                              <span className={`material-symbols-outlined text-[14px] ${
                                lessonCompleted
                                  ? 'text-emerald-500'
                                  : lessonCurrent
                                  ? 'text-primary'
                                  : 'text-muted-foreground/40'
                              }`}>
                                {lessonCompleted ? 'check_circle' : lessonCurrent ? 'play_arrow' : 'radio_button_unchecked'}
                              </span>
                              <span className={`text-xs ${
                                lessonCompleted || lessonCurrent ? 'text-foreground' : 'text-muted-foreground/60'
                              }`}>
                                {lesson.title}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
