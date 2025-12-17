import { useState } from 'react';
import { Brain, Sparkles, Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTaskStore } from '@/hooks/useTaskStore';
import { generateDailyPlan } from '@/lib/ai';
import { toast } from 'sonner';

export function DailyBrain() {
  const { tasks } = useTaskStore();
  const [dailyPlan, setDailyPlan] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const pendingTasks = tasks.filter(t => t.status !== 'done');

  const handleGeneratePlan = async () => {
    if (pendingTasks.length === 0) {
      toast.info('Add some tasks first to generate a daily plan');
      return;
    }

    setIsGenerating(true);
    try {
      const plan = await generateDailyPlan(pendingTasks.map(t => ({ title: t.title })));
      setDailyPlan(plan);
      toast.success('Daily plan generated!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate plan');
    }
    setIsGenerating(false);
  };

  return (
    <div className="glass rounded-xl p-6 border border-secondary/30">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary/20">
            <Brain className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Today&apos;s Learning Journey</h3>
            <p className="text-sm text-muted-foreground">AI-powered daily planning</p>
          </div>
        </div>

        <Button
          onClick={handleGeneratePlan}
          disabled={isGenerating}
          variant="outline"
          size="sm"
          className="gap-2 border-secondary/50 text-secondary hover:bg-secondary/10"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : dailyPlan ? (
            <RefreshCw className="w-4 h-4" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {dailyPlan ? 'Regenerate' : 'Generate Plan'}
        </Button>
      </div>

      {dailyPlan ? (
        <ScrollArea className="h-[300px]">
          <div 
            className="prose prose-invert prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: dailyPlan }}
          />
        </ScrollArea>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-center">
          <div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/10 flex items-center justify-center neon-glow-purple">
              <Sparkles className="w-8 h-8 text-secondary" />
            </div>
            <h4 className="font-medium text-foreground mb-2">Ready to optimize your day?</h4>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Click "Generate Plan" to get a personalized daily roadmap based on your pending tasks
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
