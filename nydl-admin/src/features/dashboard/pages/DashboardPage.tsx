import { useAnalyticsSummary } from '@/hooks/useAnalytics';
import { StatsCard } from '@/components/common/StatsCard';
import {
  Users,
  GraduationCap,
  BookOpen,
  CalendarDays,
  CreditCard,
  TrendingUp,
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
  const { data: summary, isLoading } = useAnalyticsSummary();

  const kpis = [
    { title: 'Total Students', value: summary?.totalStudents ?? 0, icon: GraduationCap, description: 'Enrolled profiles' },
    { title: 'Total Instructors', value: summary?.totalInstructors ?? 0, icon: Users, description: 'Active faculty' },
    { title: 'Total Revenue', value: `$${summary?.totalRevenue ?? 0}`, icon: CreditCard, description: 'Net earnings' },
    { title: 'Enrollments', value: summary?.activeEnrollments ?? 0, icon: BookOpen, description: 'Active courses' },
  ];

  const trendData = [
    { name: 'Jan', enrollments: 12, revenue: 1200 },
    { name: 'Feb', enrollments: 19, revenue: 1900 },
    { name: 'Mar', enrollments: 32, revenue: 3200 },
    { name: 'Apr', enrollments: 45, revenue: 4500 },
    { name: 'May', enrollments: 48, revenue: 4800 },
    { name: 'Jun', enrollments: 60, revenue: 6000 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-400">Loading dashboard...</div>
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
              <AreaChart data={trendData}>
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
              <BarChart data={trendData}>
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
