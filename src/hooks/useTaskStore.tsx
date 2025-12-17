import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface Task {
  id: string;
  title: string;
  originalTitle: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: number;
  url?: string;
  notes: string;
  chatHistory: ChatMessage[];
  executionPlan: string;
  createdAt: number;
  completedAt?: number;
  category?: string;
}

interface TaskContextType {
  tasks: Task[];
  loading: boolean;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'chatHistory' | 'executionPlan' | 'notes'>) => Promise<void>;
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  addChatMessage: (taskId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => Promise<void>;
}

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  loading: true,
  addTask: async () => {},
  updateTask: async () => {},
  deleteTask: async () => {},
  addChatMessage: async () => {},
});

function mapDbToTask(row: any): Task {
  return {
    id: row.id,
    title: row.title,
    originalTitle: row.original_title,
    description: row.description || '',
    status: row.status as 'todo' | 'in_progress' | 'done',
    priority: row.priority || 50,
    url: row.url || undefined,
    notes: row.notes || '',
    chatHistory: (row.chat_history || []) as ChatMessage[],
    executionPlan: row.execution_plan || '',
    createdAt: new Date(row.created_at).getTime(),
    completedAt: row.completed_at ? new Date(row.completed_at).getTime() : undefined,
    category: row.category || undefined,
  };
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
    } else {
      setTasks((data || []).map(mapDbToTask));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = async (task: Omit<Task, 'id' | 'createdAt' | 'chatHistory' | 'executionPlan' | 'notes'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title: task.title,
        original_title: task.originalTitle,
        description: task.description,
        status: task.status,
        priority: task.priority,
        url: task.url,
        category: task.category,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding task:', error);
      throw error;
    }

    setTasks(prev => [mapDbToTask(data), ...prev]);
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const dbUpdates: any = {};
    
    if (updates.title !== undefined) dbUpdates.title = updates.title;
    if (updates.originalTitle !== undefined) dbUpdates.original_title = updates.originalTitle;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.status !== undefined) {
      dbUpdates.status = updates.status;
      if (updates.status === 'done') {
        dbUpdates.completed_at = new Date().toISOString();
      }
    }
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;
    if (updates.url !== undefined) dbUpdates.url = updates.url;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;
    if (updates.chatHistory !== undefined) dbUpdates.chat_history = updates.chatHistory;
    if (updates.executionPlan !== undefined) dbUpdates.execution_plan = updates.executionPlan;
    if (updates.category !== undefined) dbUpdates.category = updates.category;

    const { error } = await supabase
      .from('tasks')
      .update(dbUpdates)
      .eq('id', id);

    if (error) {
      console.error('Error updating task:', error);
      throw error;
    }

    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting task:', error);
      throw error;
    }

    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const addChatMessage = async (taskId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newMessage: ChatMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    const updatedHistory = [...task.chatHistory, newMessage];
    
    const { error } = await supabase
      .from('tasks')
      .update({ chat_history: updatedHistory as any })
      .eq('id', taskId);

    if (error) {
      console.error('Error adding chat message:', error);
      throw error;
    }

    setTasks(prev => prev.map(t => 
      t.id === taskId 
        ? { ...t, chatHistory: updatedHistory }
        : t
    ));
  };

  return (
    <TaskContext.Provider value={{ tasks, loading, addTask, updateTask, deleteTask, addChatMessage }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTaskStore = () => useContext(TaskContext);
