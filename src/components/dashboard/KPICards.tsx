import { useTaskStore } from '@/hooks/useTaskStore';
import { CheckCircle2, Clock, Flame, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function KPICards() {
  const { tasks } = useTaskStore();

  const pending = tasks.filter(t => t.status !== 'done').length;
  const completed = tasks.filter(t => t.status === 'done').length;
  const total = tasks.length;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const highPriority = tasks.filter(t => t.priority > 70 && t.status !== 'done').length;

  const kpis = [
    {
      label: 'Pending Tasks',
      value: pending,
      icon: Clock,
      color: 'text-neon-cyan',
      bgColor: 'bg-neon-cyan/10',
      borderColor: 'border-neon-cyan/30',
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
    },
    {
      label: 'High Priority',
      value: highPriority,
      icon: Flame,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
      borderColor: 'border-destructive/30',
    },
    {
      label: 'Completed',
      value: completed,
      icon: CheckCircle2,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi) => (
        <div
          key={kpi.label}
          className={cn(
            "glass rounded-xl p-4 border",
            kpi.borderColor
          )}
        >
          <div className="flex items-center justify-between mb-3">
            <div className={cn("p-2 rounded-lg", kpi.bgColor)}>
              <kpi.icon className={cn("w-5 h-5", kpi.color)} />
            </div>
          </div>
          <p className="text-2xl font-bold text-foreground font-display">
            {kpi.value}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{kpi.label}</p>
        </div>
      ))}
    </div>
  );
}
