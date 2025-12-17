import { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Loader2, 
  Send, 
  BookOpen, 
  MessageSquare,
  CheckCircle2,
  Clock,
  Circle,
  Flame
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Task, useStore } from '@/store/useStore';
import { generateExecutionPlan, askTutor } from '@/lib/gemini';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface TaskModalProps {
  task: Task | null;
  onClose: () => void;
}

const statusConfig = {
  todo: { icon: Circle, label: 'To Do', color: 'bg-muted text-muted-foreground' },
  in_progress: { icon: Clock, label: 'In Progress', color: 'bg-neon-cyan/20 text-neon-cyan' },
  done: { icon: CheckCircle2, label: 'Done', color: 'bg-primary/20 text-primary' },
};

export function TaskModal({ task, onClose }: TaskModalProps) {
  const { apiKey, updateTask, addChatMessage } = useStore();
  const [notes, setNotes] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (task) {
      setNotes(task.notes);
    }
  }, [task]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [task?.chatHistory]);

  if (!task) return null;

  const StatusIcon = statusConfig[task.status].icon;

  const handleSaveNotes = () => {
    updateTask(task.id, { notes });
    toast({ title: "Notes saved" });
  };

  const handleGeneratePlan = async () => {
    if (!apiKey) {
      toast({
        title: "API Key Required",
        description: "Please add your Gemini API key in Settings",
        variant: "destructive",
      });
      return;
    }

    setIsGeneratingPlan(true);
    try {
      const plan = await generateExecutionPlan(task.title, apiKey);
      updateTask(task.id, { executionPlan: plan });
      toast({ title: "Execution plan generated!" });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
    setIsGeneratingPlan(false);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !apiKey) return;

    const userMessage = chatInput.trim();
    setChatInput('');
    addChatMessage(task.id, { role: 'user', content: userMessage });

    setIsSendingMessage(true);
    try {
      const response = await askTutor(
        task.title,
        userMessage,
        task.chatHistory,
        apiKey
      );
      addChatMessage(task.id, { role: 'assistant', content: response });
    } catch (error) {
      toast({
        title: "Message Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    }
    setIsSendingMessage(false);
  };

  return (
    <Dialog open={!!task} onOpenChange={() => onClose()}>
      <DialogContent className="glass-strong max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="border-b border-border/50 pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 pr-8">
              <DialogTitle className="text-xl font-semibold text-foreground leading-tight">
                {task.title}
              </DialogTitle>
              {task.originalTitle !== task.title && (
                <p className="text-sm text-muted-foreground mt-1">
                  Originally: {task.originalTitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Badge className={cn("gap-1", statusConfig[task.status].color)}>
              <StatusIcon className="w-3 h-3" />
              {statusConfig[task.status].label}
            </Badge>
            
            {task.priority > 70 && (
              <Badge variant="destructive" className="gap-1 bg-destructive/20 text-destructive">
                <Flame className="w-3 h-3" />
                High Priority
              </Badge>
            )}

            <Badge variant="outline" className="font-mono">
              Score: {task.priority}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="notes" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="glass w-full justify-start gap-2 p-1">
            <TabsTrigger value="notes" className="gap-2 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
              <BookOpen className="w-4 h-4" />
              Notes
            </TabsTrigger>
            <TabsTrigger value="plan" className="gap-2 data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary">
              <Sparkles className="w-4 h-4" />
              Execution Plan
            </TabsTrigger>
            <TabsTrigger value="tutor" className="gap-2 data-[state=active]:bg-neon-cyan/20 data-[state=active]:text-neon-cyan">
              <MessageSquare className="w-4 h-4" />
              AI Tutor
            </TabsTrigger>
          </TabsList>

          {/* Notes Tab */}
          <TabsContent value="notes" className="flex-1 flex flex-col overflow-hidden mt-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your notes, thoughts, and progress here..."
              className="flex-1 min-h-[200px] bg-muted/30 border-border/50 resize-none"
            />
            <Button onClick={handleSaveNotes} className="mt-3 self-end">
              Save Notes
            </Button>
          </TabsContent>

          {/* Execution Plan Tab */}
          <TabsContent value="plan" className="flex-1 flex flex-col overflow-hidden mt-4">
            {task.executionPlan ? (
              <ScrollArea className="flex-1">
                <div 
                  className="prose prose-invert prose-sm max-w-none p-4 bg-muted/30 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: task.executionPlan }}
                />
              </ScrollArea>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-secondary" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No execution plan yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Let AI break down this task into actionable steps
                  </p>
                  <Button 
                    onClick={handleGeneratePlan}
                    disabled={isGeneratingPlan || !apiKey}
                    className="gap-2 bg-gradient-to-r from-secondary to-secondary/80"
                  >
                    {isGeneratingPlan ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    Generate Step-by-Step Plan
                  </Button>
                </div>
              </div>
            )}
            
            {task.executionPlan && (
              <Button 
                onClick={handleGeneratePlan}
                disabled={isGeneratingPlan || !apiKey}
                variant="outline"
                className="mt-3 gap-2 border-secondary/50 text-secondary"
              >
                {isGeneratingPlan ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Regenerate Plan
              </Button>
            )}
          </TabsContent>

          {/* AI Tutor Tab */}
          <TabsContent value="tutor" className="flex-1 flex flex-col overflow-hidden mt-4">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {task.chatHistory.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Ask the AI Tutor anything about this task!</p>
                    <p className="text-sm mt-1">Try: "How do I start?" or "Explain this concept"</p>
                  </div>
                ) : (
                  task.chatHistory.map((msg) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "p-3 rounded-lg max-w-[85%]",
                        msg.role === 'user' 
                          ? "ml-auto bg-primary/20 text-foreground" 
                          : "bg-muted/50 text-foreground"
                      )}
                    >
                      <p className="text-xs font-medium mb-1 text-muted-foreground">
                        {msg.role === 'user' ? 'You' : 'AI Tutor'}
                      </p>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>
            </ScrollArea>

            <div className="flex gap-2 mt-4 pt-4 border-t border-border/50">
              <Textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask the AI Tutor..."
                className="min-h-[60px] max-h-[120px] bg-muted/30 border-border/50 resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isSendingMessage || !apiKey}
                className="self-end h-[60px] px-4 bg-gradient-to-r from-neon-cyan to-neon-cyan/80"
              >
                {isSendingMessage ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
