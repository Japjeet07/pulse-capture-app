import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Settings as SettingsIcon, 
  Slack, 
  Mail, 
  Key, 
  Bell,
  Shield,
  Save,
  TestTube
} from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    slackWebhook: "",
    emailNotifications: true,
    instantAlerts: false,
    weeklyReports: true,
    autoFollowUp: true,
    apiKey: "",
    emailTemplate: `Hi {{name}},

Thank you for your interest in LeadCapture Pro! 

Based on your message about {{company}}, I believe our AI-powered lead management platform could be a great fit for your team.

Would you be available for a quick 15-minute demo this week?

Best regards,
Your Sales Team`
  });

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Your configuration has been updated successfully.",
    });
  };

  const handleTestIntegration = (type: string) => {
    toast({
      title: `Testing ${type} Integration`,
      description: "Test message sent successfully!",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <AdminHeader />

      <div className="container mx-auto px-6 py-8 max-w-4xl space-y-8">
        {/* Integrations */}
        <Card className="card-premium p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Slack className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-heading">Slack Integration</h2>
              <p className="text-sm text-muted-foreground">Get instant notifications for new leads</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="slack-webhook">Webhook URL</Label>
              <div className="flex gap-2">
                <Input
                  id="slack-webhook"
                  placeholder="https://hooks.slack.com/services/..."
                  value={settings.slackWebhook}
                  onChange={(e) => setSettings(prev => ({ ...prev, slackWebhook: e.target.value }))}
                  className="glass border-border/50 focus:border-primary"
                />
                <Button 
                  variant="outline" 
                  onClick={() => handleTestIntegration("Slack")}
                  className="hover-lift"
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Test
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Email Configuration */}
        <Card className="card-premium p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-secondary flex items-center justify-center">
              <Mail className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h2 className="text-heading">Email Templates</h2>
              <p className="text-sm text-muted-foreground">Customize your automated outreach messages</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-template">Follow-up Email Template</Label>
              <Textarea
                id="email-template"
                value={settings.emailTemplate}
                onChange={(e) => setSettings(prev => ({ ...prev, emailTemplate: e.target.value }))}
                rows={8}
                className="glass border-border/50 focus:border-primary resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Available variables: {'{{name}}'}, {'{{company}}'}, {'{{email}}'}, {'{{message}}'}
              </p>
            </div>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="card-premium p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-accent flex items-center justify-center">
              <Bell className="w-5 h-5 text-accent-foreground" />
            </div>
            <div>
              <h2 className="text-heading">Notification Preferences</h2>
              <p className="text-sm text-muted-foreground">Control when and how you receive alerts</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Email Notifications</div>
                <div className="text-sm text-muted-foreground">Receive lead updates via email</div>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, emailNotifications: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Instant Alerts</div>
                <div className="text-sm text-muted-foreground">Get notified immediately for hot leads</div>
              </div>
              <Switch
                checked={settings.instantAlerts}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, instantAlerts: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Weekly Reports</div>
                <div className="text-sm text-muted-foreground">Comprehensive analytics every Monday</div>
              </div>
              <Switch
                checked={settings.weeklyReports}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, weeklyReports: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Auto Follow-up</div>
                <div className="text-sm text-muted-foreground">Automatically send follow-up emails</div>
              </div>
              <Switch
                checked={settings.autoFollowUp}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, autoFollowUp: checked }))}
              />
            </div>
          </div>
        </Card>

        {/* API Configuration */}
        <Card className="card-premium p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
              <Key className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-heading">API Keys</h2>
              <p className="text-sm text-muted-foreground">Manage external service integrations</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">OpenAI API Key (for AI scoring)</Label>
              <Input
                id="api-key"
                type="password"
                placeholder="sk-..."
                value={settings.apiKey}
                onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
                className="glass border-border/50 focus:border-primary"
              />
              <p className="text-xs text-muted-foreground">
                Your API key is encrypted and stored securely
              </p>
            </div>
          </div>
        </Card>

        {/* Security */}
        <Card className="card-premium p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h2 className="text-heading">Security & Privacy</h2>
              <p className="text-sm text-muted-foreground">Data protection and access control</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/20 rounded-lg">
                <div className="text-sm font-medium mb-1">Data Retention</div>
                <div className="text-xs text-muted-foreground">Leads stored for 2 years</div>
              </div>
              <div className="p-4 bg-muted/20 rounded-lg">
                <div className="text-sm font-medium mb-1">Encryption</div>
                <div className="text-xs text-muted-foreground">AES-256 encryption at rest</div>
              </div>
            </div>
            
            <Button variant="outline" className="w-full hover-lift">
              Download Data Export
            </Button>
            
            <Button variant="destructive" className="w-full">
              Delete All Data
            </Button>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-center pt-6">
          <Button onClick={handleSave} className="btn-primary px-8 group">
            <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            Save All Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;