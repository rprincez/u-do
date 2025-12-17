import { useStore } from '@/store/useStore';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = {
  todo: 'hsl(215, 20%, 65%)',
  in_progress: 'hsl(199, 89%, 48%)',
  done: 'hsl(142, 76%, 45%)',
};

export function StatusPieChart() {
  const { tasks } = useStore();

  const data = [
    { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length, color: COLORS.todo },
    { name: 'In Progress', value: tasks.filter(t => t.status === 'in_progress').length, color: COLORS.in_progress },
    { name: 'Done', value: tasks.filter(t => t.status === 'done').length, color: COLORS.done },
  ].filter(d => d.value > 0);

  if (data.length === 0) {
    return (
      <div className="glass rounded-xl p-6 h-[300px] flex items-center justify-center">
        <p className="text-muted-foreground">No tasks to display</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Status Distribution</h3>
      <div className="h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 8%)',
                border: '1px solid hsl(222, 30%, 18%)',
                borderRadius: '8px',
                color: 'hsl(210, 40%, 98%)',
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value) => <span className="text-foreground text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
