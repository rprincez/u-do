import { supabase } from '@/integrations/supabase/client';

interface AIResponse {
  content?: string;
  error?: string;
}

async function callAI(body: Record<string, any>): Promise<string> {
  const { data, error } = await supabase.functions.invoke<AIResponse>('ai', { body });
  
  if (error) {
    console.error('AI function error:', error);
    throw new Error(error.message || 'AI request failed');
  }
  
  if (data?.error) {
    throw new Error(data.error);
  }
  
  return data?.content || '';
}

export async function sanitizeTask(taskTitle: string): Promise<string> {
  return callAI({ type: 'sanitize', prompt: taskTitle });
}

export async function prioritizeTasks(tasks: { id: string; title: string }[]): Promise<{ id: string; priority: number }[]> {
  const content = await callAI({ type: 'prioritize', tasks });
  
  try {
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse priorities:', e);
  }
  
  return tasks.map(t => ({ id: t.id, priority: 50 }));
}

export async function generateExecutionPlan(taskTitle: string): Promise<string> {
  return callAI({ type: 'execution-plan', taskTitle });
}

export async function generateDailyPlan(tasks: { title: string }[]): Promise<string> {
  return callAI({ type: 'daily-plan', tasks });
}

export async function askTutor(
  taskTitle: string,
  question: string,
  chatHistory: { role: string; content: string }[]
): Promise<string> {
  return callAI({
    type: 'tutor',
    taskTitle,
    prompt: question,
    chatHistory: chatHistory.map(m => ({ role: m.role, content: m.content })),
  });
}
