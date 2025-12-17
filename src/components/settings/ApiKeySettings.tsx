import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { toast } from '@/hooks/use-toast';

export function ApiKeySettings() {
  const { apiKey, setApiKey } = useStore();
  const [localKey, setLocalKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    setLocalKey(apiKey);
  }, [apiKey]);

  const handleSave = () => {
    setApiKey(localKey);
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved securely",
    });
  };

  const maskedKey = localKey ? `${localKey.slice(0, 8)}${'•'.repeat(20)}${localKey.slice(-4)}` : '';

  return (
    <div className="glass rounded-xl p-6 max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-primary/20">
          <Key className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Google Gemini API Key</h3>
          <p className="text-sm text-muted-foreground">Required for AI features</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <Input
            type={showKey ? 'text' : 'password'}
            value={showKey ? localKey : maskedKey}
            onChange={(e) => setLocalKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            className="pr-10 bg-muted/50 border-border/50"
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} className="gap-2">
            <Check className="w-4 h-4" />
            Save Key
          </Button>
          
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Get API Key
            </Button>
          </a>
        </div>

        <p className="text-xs text-muted-foreground">
          Your API key is stored locally in your browser and never sent to our servers.
          Get your free API key from Google AI Studio.
        </p>

        {apiKey && (
          <div className="flex items-center gap-2 text-sm text-primary">
            <Check className="w-4 h-4" />
            API key configured
          </div>
        )}
      </div>
    </div>
  );
}
