import { KPICards } from '@/components/dashboard/KPICards';
import { StatusPieChart } from '@/components/dashboard/StatusPieChart';
import { ProductivityChart } from '@/components/dashboard/ProductivityChart';
import { DailyBrain } from '@/components/dashboard/DailyBrain';
import { useStore } from '@/store/useStore';
import { Settings, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { apiKey } = useStore();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground font-display tracking-wide">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Your productivity command center
        </p>
      </div>

      {/* API Key Warning */}
      {!apiKey && (
        <div className="glass rounded-xl p-4 border border-secondary/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-secondary" />
            <div>
              <p className="font-medium text-foreground">Enable AI Features</p>
              <p className="text-sm text-muted-foreground">Add your Gemini API key to unlock intelligent task management</p>
            </div>
          </div>
          <Link to="/settings">
            <Button variant="outline" className="gap-2 border-secondary/50 text-secondary">
              <Settings className="w-4 h-4" />
              Configure
            </Button>
          </Link>
        </div>
      )}

      {/* KPI Cards */}
      <KPICards />

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <StatusPieChart />
        <ProductivityChart />
      </div>

      {/* Daily Brain */}
      <DailyBrain />
    </div>
  );
}
