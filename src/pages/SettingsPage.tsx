import { ApiKeySettings } from '@/components/settings/ApiKeySettings';
import { Zap, Github, Info } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground font-display tracking-wide">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure your AI workspace
        </p>
      </div>

      {/* API Key Settings */}
      <ApiKeySettings />

      {/* About Section */}
      <div className="glass rounded-xl p-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-muted">
            <Info className="w-5 h-5 text-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">About U-DO</h3>
        </div>
        
        <div className="space-y-4 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">U-DO: The AI Workspace</strong> is designed to eliminate 
            "Blank Page Paralysis" by transforming vague intentions into actionable, structured plans.
          </p>
          
          <div className="space-y-2">
            <p className="text-foreground font-medium">Key Features:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-primary">The Sanitizer:</strong> AI automatically rewrites vague tasks into SMART goals</li>
              <li><strong className="text-secondary">The Architect:</strong> Generates step-by-step execution plans</li>
              <li><strong className="text-neon-cyan">The Judge:</strong> Auto-prioritizes tasks based on importance</li>
              <li><strong className="text-foreground">AI Tutor:</strong> Context-aware assistant for each task</li>
            </ul>
          </div>

          <p>
            Built with React, Tailwind CSS, and powered by Google Gemini AI.
            All data is stored locally in your browser.
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-border/50 flex items-center gap-4">
          <div className="flex items-center gap-2 text-primary">
            <Zap className="w-4 h-4" />
            <span className="text-sm font-medium">v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
