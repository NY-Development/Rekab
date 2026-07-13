import { useEnrollments } from '@/hooks/useEnrollments';
import { useStudentProfile } from '@/hooks/useProfile';
import { Card, CardContent } from '@/components/ui/card';
import { Award, BookOpen, Clock, Activity } from 'lucide-react';

export default function ProgressPage() {
  const { data: profileRes, isLoading: isProfileLoading } = useStudentProfile();
  const { data: enrollmentsRes, isLoading: isEnrollmentsLoading } = useEnrollments();

  const profile = profileRes?.data;
  const enrollments = enrollmentsRes?.data || [];

  const completedCount = enrollments.filter((e) => e.status === 'COMPLETED').length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-10">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Academic Progress</h2>
        <p className="text-sm text-slate-550 mt-1">Track your course completions, grades, and academy learning stats.</p>
      </div>

      {isProfileLoading || isEnrollmentsLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="border border-slate-150">
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enrolled Courses</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{enrollments.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-600 opacity-80" />
              </CardContent>
            </Card>

            <Card className="border border-slate-150">
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Completed</p>
                  <p className="text-2xl font-bold text-emerald-600 mt-1">{completedCount}</p>
                </div>
                <Award className="h-8 w-8 text-emerald-600 opacity-80" />
              </CardContent>
            </Card>

            <Card className="border border-slate-150">
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Performance Score</p>
                  <p className="text-2xl font-bold text-blue-605 mt-1">{profile?.participationScore || 'N/A'}</p>
                </div>
                <Activity className="h-8 w-8 text-blue-605 opacity-80" />
              </CardContent>
            </Card>

            <Card className="border border-slate-150">
              <CardContent className="pt-6 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assignment Avg</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">
                    {profile?.assignmentAverage ? `${profile.assignmentAverage}%` : 'N/A'}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-slate-400 opacity-85" />
              </CardContent>
            </Card>
          </div>

          {/* Detailed Course Progress List */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">Course Breakdown</h3>
            {enrollments.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-slate-400">
                You have not registered for any courses yet.
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map((enr: any) => (
                  <div key={enr.id} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider">
                        {enr.status}
                      </span>
                      <h4 className="text-base font-bold text-slate-900">{enr.courseId}</h4>
                      <p className="text-xs text-slate-450">Application Date: {new Date(enr.enrolledAt).toLocaleDateString()}</p>
                    </div>
                    {enr.status === 'ACTIVE' && (
                      <div className="w-full sm:w-60 space-y-1">
                        <div className="flex justify-between text-xs text-slate-500 font-semibold">
                          <span>Completion progress</span>
                          <span>{enr.progressPercentage || 0}%</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full transition-all" style={{ width: `${enr.progressPercentage || 0}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
