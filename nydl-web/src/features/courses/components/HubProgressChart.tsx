import { motion } from 'framer-motion';
import {
  RadialBarChart, RadialBar, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts';

interface HubProgressChartProps {
  completionPercent: number;
  assignmentStats: { title: string; score: number; max: number }[];
}

export default function HubProgressChart({ completionPercent, assignmentStats }: HubProgressChartProps) {
  const radialData = [
    { name: 'progress', value: completionPercent, fill: 'hsl(var(--primary))' },
  ];

  const barData = assignmentStats.slice(0, 6).map((a) => ({
    name: a.title.length > 12 ? a.title.slice(0, 12) + '…' : a.title,
    score: a.score,
    max: a.max,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/* Overall Completion */}
      <div className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-xl p-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Overall Completion</h4>
        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="70%"
                outerRadius="100%"
                startAngle={90}
                endAngle={-270}
                data={radialData}
                barSize={12}
              >
                <RadialBar
                  dataKey="value"
                  cornerRadius={6}
                  background={{ fill: 'hsl(var(--muted))' }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">{completionPercent}%</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Complete</span>
            </div>
          </div>
        </div>
      </div>

      {/* Assignment Scores */}
      <div className="bg-card/60 backdrop-blur-sm border border-border/60 rounded-xl p-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Assignment Scores</h4>
        {barData.length > 0 ? (
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="max" fill="hsl(var(--muted))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
            No graded assignments yet
          </div>
        )}
      </div>
    </motion.div>
  );
}
