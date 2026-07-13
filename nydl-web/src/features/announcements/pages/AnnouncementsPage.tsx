import { useAnnouncements } from '@/hooks/useAnnouncements';
import type { Announcement } from '@/types';

export default function AnnouncementsPage() {
  const { data: announcementsRes, isLoading, error } = useAnnouncements();

  const announcementsList: Announcement[] = announcementsRes?.data?.docs || [];

  // Sort by publishDate or createdAt descending
  const sortedAnnouncements = [...announcementsList].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'NORMAL':
        return 'bg-blue-50 text-blue-750 border-blue-150';
      default:
        return 'bg-slate-50 text-slate-650 border-slate-200';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-10">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Announcements</h2>
        <p className="text-sm text-slate-550 mt-1">Stay updated with the latest program news, updates, and deadlines.</p>
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
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
          No announcements published yet.
        </div>
      ) : (
        <div className="space-y-6">
          {sortedAnnouncements.map((announcement) => {
            const pubDate = new Date(announcement.createdAt);
            
            return (
              <div
                key={announcement.id}
                className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col md:flex-row gap-6 hover:border-slate-300 transition-colors"
              >
                {/* Meta details */}
                <div className="shrink-0 flex md:flex-col md:items-start items-center justify-between md:justify-start gap-3 md:w-44 border-b md:border-b-0 md:border-r border-slate-100 pb-4 md:pb-0 md:pr-4">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-widest uppercase border ${getPriorityStyle(announcement.priority)}`}>
                    {announcement.priority} PRIORITY
                  </span>
                  
                  <div className="text-xs text-slate-400">
                    <span className="block font-semibold text-slate-500">Published</span>
                    {pubDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 leading-snug">
                    {announcement.title}
                  </h3>
                  
                  <div className="text-sm text-slate-600 leading-relaxed space-y-2 whitespace-pre-wrap">
                    {announcement.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
