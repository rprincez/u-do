import { LayoutDashboard, ListTodo, Settings, Sparkles, Zap } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: ListTodo, label: 'My Tasks', to: '/tasks' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 glass-strong border-r border-border/50 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center neon-glow-green">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <Sparkles className="w-3 h-3 text-secondary absolute -top-1 -right-1" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold tracking-wider">U-DO</h1>
            <p className="text-[10px] text-muted-foreground tracking-widest uppercase">AI Workspace</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-muted/50"
            )}
            activeClassName="bg-primary/10 text-primary border border-primary/30 neon-glow-green"
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
            "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
          activeClassName="bg-secondary/10 text-secondary border border-secondary/30"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium">Settings</span>
        </NavLink>
        
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20">
          <p className="text-xs text-muted-foreground">
            Powered by <span className="text-primary font-semibold">Gemini AI</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
