import { useState } from 'react';
import { useSessions } from '@/hooks/useSessions';
import type { Session } from '@/types';

export default function SessionsPage() {
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const { data: sessionsRes, isLoading, error } = useSessions();

  const sessionsList: Session[] = sessionsRes?.data?.docs || [];

  // Group or sorting
  const sortedSessions = [...sessionsList].sort((a, b) => {
    return new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime();
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Live Sessions</h2>
          <p className="text-sm text-slate-550 mt-1">Access and manage your upcoming classes for the week.</p>
        </div>
        
        {/* View Toggles */}
        <div className="flex bg-slate-100 border border-slate-200 rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
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
            className={`px-4 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
              viewMode === 'calendar'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-blue-600'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">calendar_month</span>
            Calendar
          </button>
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
        /* Calendar Placeholder for complex interactive grid */
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
              const scheduledDate = new Date(session.scheduledAt);
              const isToday = scheduledDate.toDateString() === new Date().toDateString();
              const isLive = session.status === 'LIVE';

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
                      <span className="flex items-center text-slate-400 text-xs">
                        <span className="material-symbols-outlined text-[16px] mr-1">schedule</span>
                        {session.duration} min
                      </span>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1">{session.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed mb-2">
                      {session.description}
                    </p>
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
    </div>
  );
}
