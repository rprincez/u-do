import { useTaskStore } from '@/hooks/useTaskStore';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell } from 'recharts';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';

export function ProductivityChart() {
  const { tasks } = useTaskStore();

  // Get last 7 days of completion data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dayStart = startOfDay(date).getTime();
    const dayEnd = endOfDay(date).getTime();
    
    const completed = tasks.filter(
      t => t.completedAt && t.completedAt >= dayStart && t.completedAt <= dayEnd
    ).length;

    return {
      day: format(date, 'EEE'),
      completed,
    };
  });

  const maxValue = Math.max(...last7Days.map(d => d.completed), 1);

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Productivity Velocity</h3>
      <p className="text-sm text-muted-foreground mb-4">Tasks completed over the last 7 days</p>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={last7Days} barCategoryGap="20%">
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'hsl(215, 20%, 65%)', fontSize: 12 }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 8%)',
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '8px',
                color: 'hsl(210, 40%, 98%)',
              }}
              formatter={(value: number) => [`${value} tasks`, 'Completed']}
            />
            <Bar dataKey="completed" radius={[4, 4, 0, 0]}>
              {last7Days.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.completed > 0 ? 'hsl(142, 76%, 45%)' : 'hsl(222, 30%, 25%)'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
