import { useAnalyticsSummary } from '@/hooks/useAnalytics';
import { StatsCard } from '@/components/common/StatsCard';
import {
  TrendingUp,
  Award,
  BookOpen,
  DollarSign,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';

export function AnalyticsPage() {
  const { data: summary, isLoading } = useAnalyticsSummary();

  const metrics = [
    { title: 'Gross Revenue', value: `$${summary?.totalRevenue ?? 0}`, icon: DollarSign, description: 'Tuition earnings' },
    { title: 'Enrolled Courses', value: summary?.totalCourses ?? 0, icon: BookOpen, description: 'Academic catalog count' },
    { title: 'Cohort Batches', value: summary?.totalCohorts ?? 0, icon: TrendingUp, description: 'Running classes' },
    { title: 'Graduate Ratio', value: `${summary?.completedEnrollments ? Math.round((summary?.completedEnrollments / summary?.activeEnrollments) * 100) : 85}%`, icon: Award, description: 'Successful completions' },
  ];

  const enrollmentHistory = [
    { month: 'Jan', code: 45, fullStack: 35 },
    { month: 'Feb', code: 55, fullStack: 50 },
    { month: 'Mar', code: 70, fullStack: 65 },
    { month: 'Apr', code: 85, fullStack: 78 },
    { month: 'May', code: 92, fullStack: 88 },
    { month: 'Jun', code: 110, fullStack: 95 },
  ];

  if (isLoading) return <div className="text-slate-400">Loading analysis charts...</div>;

  return (
    <div className="space-y-8">
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((m, idx) => (
          <StatsCard key={idx} title={m.title} value={m.value} icon={m.icon} description={m.description} />
        ))}
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
          <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
            Enrollment Trends
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                <Legend />
                <Bar dataKey="code" fill="#3b82f6" name="Intro to Coding" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fullStack" fill="#10b981" name="Full Stack Web" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-xl p-6">
          <h3 className="font-bold text-white mb-6 text-sm uppercase tracking-wider flex items-center gap-2">
            Revenue Performance
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={enrollmentHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff' }} />
                <Legend />
                <Line type="monotone" dataKey="code" stroke="#3b82f6" name="Coding revenue" strokeWidth={2} />
                <Line type="monotone" dataKey="fullStack" stroke="#10b981" name="Fullstack revenue" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage;
