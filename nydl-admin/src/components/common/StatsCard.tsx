import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
}

export function StatsCard({ title, value, description, icon: Icon, trend }: StatsCardProps) {
  return (
    <Card className="bg-slate-950 border-slate-800 text-white shadow-sm hover:border-slate-700 transition-all">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
          </div>
          <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-blue-500">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        {(description || trend) && (
          <div className="mt-4 flex items-center gap-1.5 text-xs">
            {trend && (
              <span className={trend.isPositive ? 'text-emerald-500 font-semibold' : 'text-rose-500 font-semibold'}>
                {trend.value}
              </span>
            )}
            {description && <span className="text-slate-400">{description}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default StatsCard;
