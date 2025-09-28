/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Slack, 
  Key, 
  Bell,
  Shield,
  Save,
  TestTube,
  Loader2,
  CheckCircle,
  XCircle,
  UserPlus,
  Users,
  Trash2,
  Edit,
  Eye,
  EyeOff
} from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { User } from "@/config/api";

interface SettingsData {
  slack_webhook: string;
  openai_api_key: string;
  email_notifications: boolean;
  instant_alerts: boolean;
}

interface NewAdminData {
  name: string;
  email: string;
  password: string;
}

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SettingsData>({
    slack_webhook: "",
    openai_api_key: "",
    email_notifications: true,
    instant_alerts: true
  });

  const [adminUsers, setAdminUsers] = useState<User[]>([]);
  const [newAdmin, setNewAdmin] = useState<NewAdminData>({
    name: "",
    email: "",
    password: ""
  });
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [showSecrets, setShowSecrets] = useState({
    slack: false,
    openai: false
  });

  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState({
    slack: false,
    openai: false
  });

  // Load settings and admin users on component mount
  useEffect(() => {
    loadSettings();
    loadAdminUsers();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await apiService.getSettings();
      if (response.success && response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAdminUsers = async () => {
    try {
      const response = await apiService.getAdminUsers();
      
      if (response.success && response.data) {
        setAdminUsers(response.data.users);
      } else {
        setAdminUsers([]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load admin users",
        variant: "destructive"
      });
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const response = await apiService.updateSettings(settings);
      if (response.success) {
        toast({
          title: "Settings Saved",
          description: "Your configuration has been updated successfully.",
        });
      } else {
        throw new Error(response.error || 'Failed to save settings');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTestSlack = async () => {
    if (!settings.slack_webhook) {
      toast({
        title: "Error",
        description: "Please enter a Slack webhook URL first",
        variant: "destructive"
      });
      return;
    }

    try {
      setTesting(prev => ({ ...prev, slack: true }));
      const response = await apiService.testSlackIntegration(settings.slack_webhook);
      if (response.success) {
        toast({
          title: "Slack Test Successful",
          description: "Test message sent to your Slack channel!",
        });
      } else {
        throw new Error(response.error || 'Slack test failed');
      }
    } catch (error) {
      toast({
        title: "Slack Test Failed",
        description: "Please check your webhook URL and try again",
        variant: "destructive"
      });
    } finally {
      setTesting(prev => ({ ...prev, slack: false }));
    }
  };

  const handleTestOpenAI = async () => {
    if (!settings.openai_api_key) {
      toast({
        title: "Error",
        description: "Please enter an OpenAI API key first",
        variant: "destructive"
      });
      return;
    }

    try {
      setTesting(prev => ({ ...prev, openai: true }));
      const response = await apiService.testOpenAIIntegration(settings.openai_api_key);
      if (response.success) {
        toast({
          title: "OpenAI Test Successful",
          description: "API key is valid and working!",
        });
      } else {
        throw new Error(response.error || 'OpenAI test failed');
      }
    } catch (error) {
      toast({
        title: "OpenAI Test Failed",
        description: "Please check your API key and try again",
        variant: "destructive"
      });
    } finally {
      setTesting(prev => ({ ...prev, openai: false }));
    }
  };

  const handleAddAdmin = async () => {
    if (!newAdmin.name || !newAdmin.email || !newAdmin.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.createAdminUser(newAdmin);
      
      if (response.success) {
        toast({
          title: "Admin Added",
          description: "New admin user created successfully!",
        });
        setNewAdmin({ name: "", email: "", password: "" });
        setShowAddAdmin(false);
        loadAdminUsers();
      } else {
        throw new Error(response.error || 'Failed to create admin user');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create admin user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this admin user?")) {
      return;
    }

    try {
      setLoading(true);
      const response = await apiService.deleteAdminUser(userId);
      if (response.success) {
        toast({
          title: "Admin Deleted",
          description: "Admin user deleted successfully!",
        });
        loadAdminUsers();
      } else {
        throw new Error(response.error || 'Failed to delete admin user');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete admin user",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
        <AdminHeader />
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="ml-2">Loading settings...</span>
          </div>
        </div>
      </div>
    );
  }

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
                <div className="relative flex-1">
                  <Input
                    id="slack-webhook"
                    type={showSecrets.slack ? "text" : "password"}
                    placeholder="https://hooks.slack.com/services/..."
                    value={settings.slack_webhook}
                    onChange={(e) => setSettings(prev => ({ ...prev, slack_webhook: e.target.value }))}
                    className="glass border-border/50 focus:border-primary pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    onClick={() => setShowSecrets(prev => ({ ...prev, slack: !prev.slack }))}
                  >
                    {showSecrets.slack ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleTestSlack}
                  disabled={testing.slack}
                  className="hover-lift"
                >
                  {testing.slack ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <TestTube className="w-4 h-4 mr-2" />
                  )}
                  Test
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* OpenAI Configuration */}
        <Card className="card-premium p-6 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-secondary flex items-center justify-center">
              <Key className="w-5 h-5 text-secondary-foreground" />
            </div>
            <div>
              <h2 className="text-heading">OpenAI API Key</h2>
              <p className="text-sm text-muted-foreground">Required for AI lead scoring and analysis</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key">API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    id="openai-key"
                    type={showSecrets.openai ? "text" : "password"}
                    placeholder="sk-..."
                    value={settings.openai_api_key}
                    onChange={(e) => setSettings(prev => ({ ...prev, openai_api_key: e.target.value }))}
                    className="glass border-border/50 focus:border-primary pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    onClick={() => setShowSecrets(prev => ({ ...prev, openai: !prev.openai }))}
                  >
                    {showSecrets.openai ? (
                      <EyeOff className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleTestOpenAI}
                  disabled={testing.openai}
                  className="hover-lift"
                >
                  {testing.openai ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <TestTube className="w-4 h-4 mr-2" />
                  )}
                  Test
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Your API key is encrypted and stored securely
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
                checked={settings.email_notifications}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, email_notifications: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-medium">Instant Alerts</div>
                <div className="text-sm text-muted-foreground">Get notified immediately for hot leads</div>
              </div>
              <Switch
                checked={settings.instant_alerts}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, instant_alerts: checked }))}
              />
            </div>

          </div>
        </Card>

        {/* Admin Management */}
        <Card className="card-premium p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-heading">Admin Management</h2>
                <p className="text-sm text-muted-foreground">Manage admin users and permissions</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowAddAdmin(true)}
              className="btn-primary"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add Admin
            </Button>
          </div>

          {/* Add Admin Form */}
          {showAddAdmin && (
            <Card className="p-4 bg-muted/20 border-border/50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Add New Admin</h3>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowAddAdmin(false)}
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-name">Full Name</Label>
                    <Input
                      id="admin-name"
                      placeholder="John Doe"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin(prev => ({ ...prev, name: e.target.value }))}
                      className="glass border-border/50 focus:border-primary"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email Address</Label>
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@company.com"
                      value={newAdmin.email}
                      onChange={(e) => setNewAdmin(prev => ({ ...prev, email: e.target.value }))}
                      className="glass border-border/50 focus:border-primary"
                    />
                  </div>
                  
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="Enter secure password"
                      value={newAdmin.password}
                      onChange={(e) => setNewAdmin(prev => ({ ...prev, password: e.target.value }))}
                      className="glass border-border/50 focus:border-primary"
                    />
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddAdmin}
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <UserPlus className="w-4 h-4 mr-2" />
                    )}
                    Create Admin
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowAddAdmin(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Admin Users List */}
          <div className="space-y-3">
            <h3 className="font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Current Admins ({adminUsers.length})
            </h3>
            
            {adminUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-muted/10 rounded-lg border border-border/30">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-sm font-medium text-primary-foreground">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {user.role}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteAdmin(user.id)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-center pt-6">
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="btn-primary px-8 group"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
            )}
            {loading ? 'Saving...' : 'Save All Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;