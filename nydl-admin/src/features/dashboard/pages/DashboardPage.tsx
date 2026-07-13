import { Link } from 'react-router-dom';
import { useAnalyticsSummary, useEnrollmentTrends, useRevenueTrends } from '@/hooks/useAnalytics';
import { useEnrollments } from '@/hooks/useEnrollments';
import { StatsCard } from '@/components/common/StatsCard';
import { StatusBadge } from '@/components/common/StatusBadge';
import { getPopulated, getRegistrationStatusMeta } from '@/utils/registration';
import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  CreditCard,
  TrendingUp,
  ClipboardCheck,
  Hourglass,
  BadgeCheck,
  ArrowRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

export function DashboardPage() {
  const { data: summary, isLoading, isError } = useAnalyticsSummary();
  const { data: enrollmentTrends } = useEnrollmentTrends({ months: 6 });
  const { data: revenueTrends } = useRevenueTrends({ months: 6 });
  const { data: recentRegistrationsData } = useEnrollments({ limit: 6 });
  const { data: pendingApprovalData } = useEnrollments({ status: 'PENDING_APPROVAL', limit: 1 });
  const { data: approvedData } = useEnrollments({ status: 'APPROVED', limit: 1 });

  const recentRegistrations = recentRegistrationsData?.docs || [];
  const pendingApprovalCount = pendingApprovalData?.total ?? 0;
  const awaitingAccessCount = approvedData?.total ?? 0;

  const kpis = [
    { title: 'Total Students', value: summary?.totalStudents ?? 0, icon: GraduationCap, description: 'Enrolled profiles' },
    { title: 'Total Instructors', value: summary?.totalInstructors ?? 0, icon: Users, description: 'Active faculty' },
    { title: 'Total Revenue', value: `$${summary?.totalRevenue ?? 0}`, icon: CreditCard, description: 'Net earnings' },
    { title: 'Active Enrollments', value: summary?.activeEnrollments ?? 0, icon: BookOpen, description: 'Course access granted' },
    { title: 'Registrations', value: recentRegistrationsData?.total ?? 0, icon: ClipboardCheck, description: 'All-time applications' },
    { title: 'Pending Approval', value: pendingApprovalCount, icon: Hourglass, description: 'Payment verified, awaiting review' },
    { title: 'Awaiting Access', value: awaitingAccessCount, icon: BadgeCheck, description: 'Approved, access not granted yet' },
    { title: 'Total Courses', value: summary?.totalCourses ?? 0, icon: CalendarDays, description: 'In catalog' },
  ];

  const revenueData = (revenueTrends || []).map((t: { month: string; amount: number }) => ({
    name: t.month,
    revenue: t.amount,
  }));
  const enrollmentData = (enrollmentTrends || []).map((t: { month: string; count: number }) => ({
    name: t.month,
    enrollments: t.count,
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Loading dashboard...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-rose-400">Failed to load dashboard data. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <StatsCard
            key={idx}
            title={kpi.title}
            value={kpi.value}
            icon={kpi.icon}
            description={kpi.description}
          />
        ))}
      </div>

      {/* Recent Registrations */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center gap-2">
            <ClipboardCheck className="h-4 w-4 text-blue-500" />
            Recent Registrations
          </h3>
          <Link
            to="/enrollments"
            className="text-xs font-semibold text-blue-500 hover:text-blue-400 flex items-center gap-1"
          >
            View All <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
        {recentRegistrations.length === 0 ? (
          <p className="text-sm text-slate-500 py-6 text-center border border-dashed border-slate-800 rounded-lg">
            No registrations yet. New student applications will appear here.
          </p>
        ) : (
          <div className="divide-y divide-slate-800">
            {recentRegistrations.map((reg) => {
              const student = getPopulated(reg.studentId);
              const course = getPopulated(reg.courseId);
              const meta = getRegistrationStatusMeta(reg);
              return (
                <div key={reg.id} className="flex items-center justify-between py-3 gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{student?.name || 'Unknown Student'}</p>
                    <p className="text-xs text-slate-500 truncate">
                      {student?.email || ''}{course?.title ? ` — ${course.title}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <StatusBadge status={meta.key} />
                    <span className="text-xs text-slate-500 hidden sm:block">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Grid for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Trend Area Chart */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
          <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            Revenue Growth
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRev)" name="Revenue ($)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enrollments Bar Chart */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
          <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-emerald-500" />
            Active Enrollments
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                <Legend />
                <Bar dataKey="enrollments" fill="#10b981" radius={[4, 4, 0, 0]} name="Enrollments" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
