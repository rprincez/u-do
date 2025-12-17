import { useState } from 'react';
import { Plus, Link2, Sparkles, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTaskStore } from '@/hooks/useTaskStore';
import { sanitizeTask } from '@/lib/ai';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function TaskInput() {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [showUrl, setShowUrl] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { addTask } = useTaskStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const originalTitle = title.trim();
    let finalTitle = originalTitle;

    // If short task, sanitize with AI
    if (originalTitle.split(' ').length < 5) {
      setIsProcessing(true);
      try {
        finalTitle = await sanitizeTask(originalTitle);
        toast.success('AI enhanced your task into a SMART goal');
      } catch (error) {
        console.error('Failed to sanitize task:', error);
        finalTitle = originalTitle;
      }
      setIsProcessing(false);
    }

    await addTask({
      title: finalTitle,
      originalTitle,
      description: '',
      status: 'todo',
      priority: 50,
      url: url.trim() || undefined,
    });

    setTitle('');
    setUrl('');
    setShowUrl(false);
  };

  return (
    <form onSubmit={handleSubmit} className="glass rounded-xl p-4 space-y-3">
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done? (AI enhances short tasks)"
            className={cn(
              "h-12 bg-muted/50 border-border/50 text-foreground placeholder:text-muted-foreground",
              "focus:border-primary/50 focus:ring-primary/20",
              "pr-10"
            )}
            disabled={isProcessing}
          />
          {isProcessing && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            </div>
          )}
        </div>
        
        <Button
          type="button"
          variant="outline"
          size="icon"
          className={cn(
            "h-12 w-12 border-border/50",
            showUrl && "bg-secondary/20 border-secondary/50 text-secondary"
          )}
          onClick={() => setShowUrl(!showUrl)}
        >
          <Link2 className="w-5 h-5" />
        </Button>

        <Button
          type="submit"
          className="h-12 px-6 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary/70 neon-glow-green"
          disabled={!title.trim() || isProcessing}
        >
          {isProcessing ? (
            <Sparkles className="w-5 h-5 animate-pulse" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </Button>
      </div>

      {showUrl && (
        <div className="flex items-center gap-2">
          <Link2 className="w-4 h-4 text-muted-foreground" />
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Add a reference URL (optional)"
            className="h-10 bg-muted/30 border-border/50 text-sm"
          />
        </div>
      )}
    </form>
  );
}
