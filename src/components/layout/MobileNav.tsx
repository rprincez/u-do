import { useState } from 'react';
import { Menu, X, LayoutDashboard, ListTodo, Settings, Zap } from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', to: '/' },
  { icon: ListTodo, label: 'My Tasks', to: '/tasks' },
  { icon: Settings, label: 'Settings', to: '/settings' },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      {/* Mobile Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-display text-lg font-bold tracking-wider">U-DO</span>
          </div>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="w-6 h-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 glass-strong border-border/50 p-0">
              <div className="p-6 border-b border-border/50">
                <div className="flex items-center justify-between">
                  <span className="font-display text-lg font-bold">Menu</span>
                  <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <nav className="p-4 space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                      "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                    activeClassName="bg-primary/10 text-primary border border-primary/30"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16" />
    </div>
  );
}
