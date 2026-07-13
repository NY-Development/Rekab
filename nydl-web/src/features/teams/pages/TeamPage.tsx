import { useMyTeam } from '@/hooks/useTeams';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users2, Award, ShieldAlert } from 'lucide-react';

export default function TeamPage() {
  const { data: teamRes, isLoading, error } = useMyTeam();

  const team = teamRes?.data;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-10">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">My Team</h2>
        <p className="text-sm text-slate-550 mt-1">Collaborate, view resources, and coordinate assignments with your squad.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-4 rounded-md text-sm">
          Failed to load team details. You may not be assigned to a team yet.
        </div>
      ) : !team ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500 max-w-md mx-auto">
          <span className="material-symbols-outlined text-4xl text-slate-400 mb-2">groups</span>
          <p className="text-sm font-semibold text-slate-800">You are not in a team yet</p>
          <p className="text-xs text-slate-500 mt-2">Teams are assigned by instructors at the start of a cohort. Please check back later or contact support if you believe this is an error.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-6">
            <Card>
              <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-slate-905">{team.name}</CardTitle>
                  <CardDescription className="text-xs mt-1">Cohort group channel</CardDescription>
                </div>
                <Users2 className="h-6 w-6 text-blue-650" />
              </CardHeader>
              <CardContent className="pt-6 space-y-6">
                
                {/* Members list */}
                <div>
                  <h4 className="text-xs font-semibold text-slate-550 uppercase tracking-widest mb-3">Team Members</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {team.memberIds ? (
                      team.memberIds.map((memberId: string) => {
                        const isLeader = team.leaderId === memberId;
                        return (
                          <div key={memberId} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-md">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-750 flex items-center justify-center font-bold text-xs uppercase">
                              {memberId.substring(0, 2)}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-slate-800 truncate">{memberId}</p>
                              {isLeader && (
                                <span className="inline-flex items-center text-[10px] text-blue-600 font-semibold gap-1">
                                  <Award className="h-3 w-3" /> Team Leader
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 italic">No members assigned.</p>
                    )}
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar context */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-blue-600">
                <ShieldAlert className="h-5 w-5" />
                <h4 className="text-sm font-semibold">Team Collaboration Rules</h4>
              </div>
              <ul className="text-xs text-slate-500 list-disc pl-4 space-y-2">
                <li>Respect all members and hold constructive debates.</li>
                <li>Coordinate team assignments under your designated Team Leader.</li>
                <li>Report collaboration issues to mentors on standby.</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
