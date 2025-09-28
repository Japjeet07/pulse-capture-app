import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Users, 
  Mail,
  MoreHorizontal,
  ArrowUpRight,
  Calendar
} from "lucide-react";
import AdminHeader from "@/components/AdminHeader";
import LeadDetailDrawer from "@/components/LeadDetailDrawer";
import { useLeads, useStats } from "@/hooks/useApi";
import { Lead } from "@/config/api";

// Mock data for leads
const mockLeads = [
  {
    id: "1",
    name: "Sarah Mitchell",
    email: "sarah.mitchell@techflow.com",
    company: "TechFlow Inc",
    message: "Interested in your lead management solution for our growing team of 50+ sales reps.",
    status: "hot" as const,
    score: 92,
    source: "Website",
    createdAt: "2024-01-15",
    lastActivity: "2 hours ago"
  },
  {
    id: "2", 
    name: "David Chen",
    email: "david@growthstartup.io",
    company: "Growth Startup",
    message: "Looking for an AI-powered solution to help scale our lead qualification process.",
    status: "warm" as const,
    score: 78,
    source: "LinkedIn",
    createdAt: "2024-01-14",
    lastActivity: "1 day ago"
  },
  {
    id: "3",
    name: "Jennifer Rodriguez",
    email: "j.rodriguez@marketingpro.com",
    company: "Marketing Pro",
    message: "Would like to schedule a demo to see how your platform can improve our ROI.",
    status: "hot" as const,
    score: 85,
    source: "Referral",
    createdAt: "2024-01-14",
    lastActivity: "4 hours ago"
  },
  {
    id: "4",
    name: "Michael Thompson",
    email: "mike.t@salesforce.dev",
    company: "SalesForce Dev",
    message: "Currently evaluating lead management tools. Your AI features look promising.",
    status: "warm" as const,
    score: 71,
    source: "Google Ads",
    createdAt: "2024-01-13",
    lastActivity: "2 days ago"
  },
  {
    id: "5",
    name: "Lisa Wang",
    email: "lisa.wang@enterprise.co",
    company: "Enterprise Co",
    message: "Enterprise client interested in bulk lead processing capabilities.",
    status: "cold" as const,
    score: 58,
    source: "Website",
    createdAt: "2024-01-12",
    lastActivity: "3 days ago"
  }
];

const filters = ["All", "New", "Scored", "Outreach Sent", "Responded", "Converted", "Lost"];

const getStatusColor = (status: string) => {
  switch (status) {
    case "new": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    case "scored": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "outreach_sent": return "bg-orange-500/10 text-orange-500 border-orange-500/20";
    case "responded": return "bg-green-500/10 text-green-500 border-green-500/20";
    case "converted": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
    case "lost": return "bg-red-500/10 text-red-500 border-red-500/20";
    default: return "bg-muted text-muted-foreground";
  }
};

const Dashboard = () => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Map filter names to status values
  const getStatusFromFilter = (filter: string) => {
    switch (filter) {
      case "New": return "new";
      case "Scored": return "scored";
      case "Outreach Sent": return "outreach_sent";
      case "Responded": return "responded";
      case "Converted": return "converted";
      case "Lost": return "lost";
      default: return undefined;
    }
  };

  // API hooks
  const { data: leadsData, loading: leadsLoading, error: leadsError, refetch: refetchLeads } = useLeads({
    page: currentPage,
    limit: 50,
    status: activeFilter === "All" ? undefined : getStatusFromFilter(activeFilter),
    search: searchQuery || undefined,
    sort_by: 'created_at',
    sort_order: 'desc'
  });

  const { data: statsData, loading: statsLoading } = useStats();

  const leads = leadsData?.leads || [];
  const stats = statsData?.stats || {
    total_leads: 0,
    high_priority: 0,
    medium_priority: 0,
    low_priority: 0,
    new_leads: 0
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <AdminHeader />

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-float p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.total_leads}</div>
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground">Total Leads</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              {stats.new_leads || 0} new
            </div>
          </Card>

          <Card className="card-float p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-red-500">{stats.high_priority}</div>
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">High Priority</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              {Math.round((stats.high_priority / Math.max(stats.total_leads, 1)) * 100)}%
            </div>
          </Card>

          <Card className="card-float p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-yellow-600">{stats.medium_priority}</div>
              <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Medium Priority</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              {Math.round((stats.medium_priority / Math.max(stats.total_leads, 1)) * 100)}%
            </div>
          </Card>

          <Card className="card-float p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-blue-500">{stats.low_priority}</div>
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Low Priority</div>
            <div className="flex items-center gap-1 text-xs text-red-600">
              <ArrowUpRight className="w-3 h-3 rotate-180" />
              {Math.round((stats.low_priority / Math.max(stats.total_leads, 1)) * 100)}%
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="card-premium p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`filter-chip ${activeFilter === filter ? 'filter-chip-active' : ''}`}
                >
                  {filter}
                </button>
              ))}
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-80">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search leads..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 glass border-border/50 focus:border-primary"
                />
              </div>
              <Button variant="outline" size="icon" className="hover-lift">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Leads Table */}
        <Card className="card-premium overflow-hidden">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-heading">Leads ({leads.length})</h2>
          </div>
          
          {leadsLoading ? (
            <div className="p-8 text-center">
              <div className="text-muted-foreground">Loading leads...</div>
            </div>
          ) : leadsError ? (
            <div className="p-8 text-center">
              <div className="text-red-500">Error loading leads: {leadsError}</div>
              <Button onClick={() => refetchLeads()} className="mt-4">
                Retry
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/20">
                  <tr>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Lead</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Company</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Score</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Source</th>
                    <th className="text-left p-4 text-sm font-medium text-muted-foreground">Activity</th>
                    <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      className="border-b border-border/30 hover:bg-muted/20 transition-colors cursor-pointer"
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="font-medium">{lead.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {lead.email}
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium">{lead.company || 'N/A'}</div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(lead.status || 'new')}>
                          {lead.status || 'NEW'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">{lead.fit_score || 0}</div>
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                              style={{ width: `${lead.fit_score || 0}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-sm bg-accent/30 text-accent-foreground px-2 py-1 rounded-md">
                          {lead.source}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="icon" className="hover-lift">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Lead Detail Drawer */}
      <LeadDetailDrawer
        lead={selectedLead}
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
        onOutreachSent={() => {
          // Refresh leads data after outreach is sent
          refetchLeads();
        }}
      />
    </div>
  );
};

export default Dashboard;