import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

interface AppState {
  tasks: Task[];
  apiKey: string;
  dailyPlan: string;
  
  // Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'chatHistory' | 'executionPlan' | 'notes'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setApiKey: (key: string) => void;
  setDailyPlan: (plan: string) => void;
  reorderTasks: (tasks: Task[]) => void;
  addChatMessage: (taskId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      tasks: [],
      apiKey: '',
      dailyPlan: '',
      
      addTask: (task) => {
        const newTask: Task = {
          ...task,
          id: crypto.randomUUID(),
          createdAt: Date.now(),
          chatHistory: [],
          executionPlan: '',
          notes: '',
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
      
      setApiKey: (key) => set({ apiKey: key }),
      
      setDailyPlan: (plan) => set({ dailyPlan: plan }),
      
      reorderTasks: (tasks) => set({ tasks }),
      
      addChatMessage: (taskId, message) => {
        const newMessage: ChatMessage = {
          ...message,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
        };
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? { ...task, chatHistory: [...task.chatHistory, newMessage] }
              : task
          ),
        }));
      },
    }),
    {
      name: 'u-do-storage',
    }
  )
);
