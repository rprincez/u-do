import { useState } from 'react';
import { Sparkles, ArrowUpDown, Loader2 } from 'lucide-react';
import { useTaskStore, Task } from '@/hooks/useTaskStore';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { Button } from '@/components/ui/button';
import { prioritizeTasks } from '@/lib/ai';
import { toast } from 'sonner';

export function TaskList() {
  const { tasks, updateTask, loading } = useTaskStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPrioritizing, setIsPrioritizing] = useState(false);

  const pendingTasks = tasks.filter(t => t.status !== 'done');
  const completedTasks = tasks.filter(t => t.status === 'done');

  const handleAutoPrioritize = async () => {
    if (pendingTasks.length === 0) {
      toast.info('Add some tasks first to prioritize them');
      return;
    }

    setIsPrioritizing(true);
    try {
      const scores = await prioritizeTasks(
        pendingTasks.map(t => ({ id: t.id, title: t.title }))
      );

      // Update each task with its new priority
      for (const { id, priority } of scores) {
        await updateTask(id, { priority });
      }

      toast.success('Tasks prioritized by AI');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to prioritize');
    }
    setIsPrioritizing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Sort by priority
  const sortedPending = [...pendingTasks].sort((a, b) => b.priority - a.priority);

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            {pendingTasks.length} pending task{pendingTasks.length !== 1 ? 's' : ''}
          </h2>
        </div>

        <Button
          onClick={handleAutoPrioritize}
          disabled={isPrioritizing}
          variant="outline"
          className="gap-2 border-secondary/50 text-secondary hover:bg-secondary/10"
        >
          {isPrioritizing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Auto-Prioritize
          <ArrowUpDown className="w-4 h-4" />
        </Button>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {sortedPending.length === 0 ? (
          <div className="glass rounded-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted/50 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">No tasks yet</h3>
            <p className="text-muted-foreground">
              Add your first task above. AI will enhance vague tasks automatically!
            </p>
          </div>
        ) : (
          sortedPending.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onOpen={() => setSelectedTask(task)}
            />
          ))
        )}
      </div>

      {/* Completed Tasks */}
      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Completed ({completedTasks.length})
          </h3>
          {completedTasks.slice(0, 5).map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onOpen={() => setSelectedTask(task)}
            />
          ))}
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
}
