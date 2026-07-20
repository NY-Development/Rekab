import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Session } from '@/types';

interface HubSessionCardProps {
  session: Session;
  isNext?: boolean;
}

function useCountdown(targetDate: string) {
  const [timeLeft, setTimeLeft] = useState('');
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft('Live Now');
        setIsLive(true);
        return;
      }

      setIsLive(false);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${mins}m`);
      } else {
        setTimeLeft(`${mins}m`);
      }
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return { timeLeft, isLive };
}

const statusColors: Record<string, string> = {
  UPCOMING: 'text-blue-500',
  ACTIVE: 'text-emerald-500',
  COMPLETED: 'text-muted-foreground',
  CANCELLED: 'text-red-500',
};

export default function HubSessionCard({ session, isNext }: HubSessionCardProps) {
  const { timeLeft, isLive } = useCountdown(session.sessionDate);
  const sessionDate = new Date(session.sessionDate);
  const isPast = session.status === 'COMPLETED' || sessionDate < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`relative bg-card/60 backdrop-blur-sm border rounded-xl p-4 transition-all duration-300 ${
        isNext
          ? 'border-primary/40 shadow-lg shadow-primary/5 ring-1 ring-primary/10'
          : 'border-border/60 hover:border-primary/20'
      }`}
    >
      {/* Live indicator */}
      {isLive && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
          </span>
          <span className="text-[10px] font-bold uppercase text-red-500 tracking-wider">Live</span>
        </div>
      )}

      {isNext && !isLive && (
        <div className="absolute top-3 right-3">
          <span className="text-[10px] font-bold uppercase text-primary tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">
            Next Up
          </span>
        </div>
      )}

      <div className="flex items-start gap-3">
        {/* Date block */}
        <div className="shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex flex-col items-center justify-center">
          <span className="text-[10px] font-bold uppercase text-primary leading-none">
            {sessionDate.toLocaleDateString(undefined, { month: 'short' })}
          </span>
          <span className="text-lg font-bold text-primary leading-none">
            {sessionDate.getDate()}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground line-clamp-1 mb-0.5">{session.title}</h4>
          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
            <span>{sessionDate.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</span>
            <span>·</span>
            <span>{session.duration} min</span>
            {!isPast && (
              <>
                <span>·</span>
                <span className={isLive ? 'text-red-500 font-semibold' : 'text-primary font-semibold'}>
                  {timeLeft}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-3 flex items-center gap-2">
        {session.meetLink && !isPast && (
          <a
            href={session.meetLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              isLive
                ? 'bg-red-500 text-white hover:bg-red-600 shadow-sm'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            <span className="material-symbols-outlined text-[14px]">videocam</span>
            {isLive ? 'Join Now' : 'Google Meet'}
          </a>
        )}
        {session.recordingLink && isPast && (
          <a
            href={session.recordingLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">play_circle</span>
            Recording
          </a>
        )}
        <span className={`text-[10px] font-semibold uppercase tracking-wider ml-auto ${statusColors[session.status] || 'text-muted-foreground'}`}>
          {session.status}
        </span>
      </div>
    </motion.div>
  );
}
