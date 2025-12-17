import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, User, Info, Zap } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-display text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your workspace preferences</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        {/* Account Info */}
        <Card className="glass border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/20">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-foreground">Account</CardTitle>
                <CardDescription>Your account information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="text-foreground">{user?.email}</p>
          </CardContent>
        </Card>

        {/* AI Features */}
        <Card className="glass border-secondary/30">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/20">
                <Sparkles className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <CardTitle className="text-foreground">AI Features</CardTitle>
                <CardDescription>Powered by our AI infrastructure - no API key needed!</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" />Smart task enhancement</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" />Auto-prioritization</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" />Execution plan generation</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary" />AI Tutor chat</li>
            </ul>
          </CardContent>
        </Card>

        {/* About */}
        <Card className="glass border-border/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Info className="w-5 h-5 text-foreground" />
              </div>
              <CardTitle className="text-foreground">About U-DO</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            <p>U-DO transforms vague intentions into actionable plans with AI assistance. Your tasks sync across devices.</p>
            <div className="mt-4 flex items-center gap-2 text-primary">
              <Zap className="w-4 h-4" />
              <span className="font-medium">v2.0.0</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
