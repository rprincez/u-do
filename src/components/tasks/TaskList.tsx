import { useState } from 'react';
import { Sparkles, ArrowUpDown, Loader2 } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { TaskCard } from './TaskCard';
import { TaskModal } from './TaskModal';
import { Button } from '@/components/ui/button';
import { prioritizeTasks } from '@/lib/gemini';
import { toast } from '@/hooks/use-toast';
import { Task } from '@/store/useStore';

export function TaskList() {
  const { tasks, apiKey, updateTask, reorderTasks } = useStore();
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isPrioritizing, setIsPrioritizing] = useState(false);

  const pendingTasks = tasks.filter(t => t.status !== 'done');
  const completedTasks = tasks.filter(t => t.status === 'done');

  const handleAutoPrioritize = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your Gemini API key in Settings",
        variant: "destructive",
      });
      return;
    }

    if (pendingTasks.length === 0) {
      toast({
        title: "No Tasks",
        description: "Add some tasks first to prioritize them",
      });
      return;
    }

    setIsPrioritizing(true);
    try {
      const scores = await prioritizeTasks(
        pendingTasks.map(t => ({ id: t.id, title: t.title })),
        apiKey
      );

      // Update each task with its new priority
      scores.forEach(({ id, score }) => {
        updateTask(id, { priority: score });
      });

      // Reorder tasks by priority
      const updatedTasks = [...tasks];
      const pending = updatedTasks.filter(t => t.status !== 'done');
      const done = updatedTasks.filter(t => t.status === 'done');
      
      // Apply new scores and sort
      pending.forEach(task => {
        const scoreData = scores.find(s => s.id === task.id);
        if (scoreData) {
          task.priority = scoreData.score;
        }
      });
      
      pending.sort((a, b) => b.priority - a.priority);
      reorderTasks([...pending, ...done]);

      toast({
        title: "Tasks Prioritized",
        description: "AI has reordered your tasks by importance",
      });
    } catch (error) {
      toast({
        title: "Prioritization Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
    setIsPrioritizing(false);
  };

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
          disabled={isPrioritizing || !apiKey}
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
        {pendingTasks.length === 0 ? (
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
          pendingTasks.map((task) => (
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
