import { TaskInput } from '@/components/tasks/TaskInput';
import { TaskList } from '@/components/tasks/TaskList';

export default function Tasks() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground font-display tracking-wide">
          My Tasks
        </h1>
        <p className="text-muted-foreground mt-1">
          AI-enhanced task management
        </p>
      </div>

      {/* Task Input */}
      <TaskInput />

      {/* Task List */}
      <TaskList />
    </div>
  );
}
