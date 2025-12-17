import { Task } from '@/store/useStore';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  ExternalLink, 
  Flame, 
  MoreVertical,
  Trash2,
  Play
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { useStore } from '@/store/useStore';

interface TaskCardProps {
  task: Task;
  onOpen: () => void;
}

const statusConfig = {
  todo: { icon: Circle, label: 'To Do', color: 'text-muted-foreground' },
  in_progress: { icon: Clock, label: 'In Progress', color: 'text-neon-cyan' },
  done: { icon: CheckCircle2, label: 'Done', color: 'text-primary' },
};

export function TaskCard({ task, onOpen }: TaskCardProps) {
  const { updateTask, deleteTask } = useStore();
  const StatusIcon = statusConfig[task.status].icon;

  const cycleStatus = () => {
    const nextStatus: Record<Task['status'], Task['status']> = {
      todo: 'in_progress',
      in_progress: 'done',
      done: 'todo',
    };
    updateTask(task.id, { 
      status: nextStatus[task.status],
      completedAt: nextStatus[task.status] === 'done' ? Date.now() : undefined,
    });
  };

  return (
    <div
      className={cn(
        "glass rounded-xl p-4 transition-all duration-200 cursor-pointer group",
        "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        task.status === 'done' && "opacity-60"
      )}
      onClick={onOpen}
    >
      <div className="flex items-start gap-3">
        {/* Status Toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            cycleStatus();
          }}
          className={cn(
            "mt-0.5 transition-colors",
            statusConfig[task.status].color
          )}
        >
          <StatusIcon className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className={cn(
                "font-medium text-foreground line-clamp-2",
                task.status === 'done' && "line-through text-muted-foreground"
              )}>
                {task.title}
              </h3>
              
              {task.originalTitle !== task.title && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                  Originally: {task.originalTitle}
                </p>
              )}
            </div>

            {/* Badges & Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {task.priority > 70 && (
                <Badge variant="destructive" className="gap-1 bg-destructive/20 text-destructive border-destructive/30">
                  <Flame className="w-3 h-3" />
                  High
                </Badge>
              )}
              
              {task.url && (
                <a
                  href={task.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="glass-strong">
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onOpen(); }}>
                    <Play className="w-4 h-4 mr-2" />
                    Deep Work
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Priority Bar */}
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  task.priority > 70 ? "bg-destructive" :
                  task.priority > 40 ? "bg-neon-yellow" : "bg-primary"
                )}
                style={{ width: `${task.priority}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground font-mono">{task.priority}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
