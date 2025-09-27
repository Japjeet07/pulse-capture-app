import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  LogOut, 
  User,
  TrendingUp, 
  Settings as SettingsIcon,
  Plus
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return {
          title: 'Lead Dashboard',
          description: 'Manage and convert your leads with AI-powered insights'
        };
      case '/analytics':
        return {
          title: 'Analytics',
          description: 'Track performance and conversion metrics'
        };
      case '/settings':
        return {
          title: 'Settings',
          description: 'Configure your lead management preferences'
        };
      default:
        return {
          title: 'Admin Dashboard',
          description: 'Lead management system'
        };
    }
  };

  const { title, description } = getPageTitle();

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-display">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Navigation Buttons */}
            {location.pathname !== '/analytics' && (
              <Button asChild variant="outline" className="hover-lift">
                <Link to="/analytics">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analytics
                </Link>
              </Button>
            )}
            
            {location.pathname !== '/settings' && (
              <Button asChild variant="outline" className="hover-lift">
                <Link to="/settings">
                  <SettingsIcon className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </Button>
            )}

            {location.pathname !== '/dashboard' && (
              <Button asChild variant="outline" className="hover-lift">
                <Link to="/dashboard">
                  Dashboard
                </Link>
              </Button>
            )}
            
            <Button asChild className="btn-primary">
              <Link to="/">
                <Plus className="w-4 h-4 mr-2" />
                Add Lead
              </Link>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="hover-lift">
                  <User className="w-4 h-4 mr-2" />
                  {user?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;