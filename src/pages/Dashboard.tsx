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

const filters = ["All", "Hot", "Warm", "Cold"];

const getStatusColor = (status: string) => {
  switch (status) {
    case "hot": return "bg-red-500/10 text-red-500 border-red-500/20";
    case "warm": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "cold": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    default: return "bg-muted text-muted-foreground";
  }
};

const Dashboard = () => {
  const [selectedLead, setSelectedLead] = useState<typeof mockLeads[0] | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLeads = mockLeads.filter(lead => {
    const matchesFilter = activeFilter === "All" || lead.status.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: mockLeads.length,
    hot: mockLeads.filter(l => l.status === "hot").length,
    warm: mockLeads.filter(l => l.status === "warm").length,
    cold: mockLeads.filter(l => l.status === "cold").length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <AdminHeader />

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-float p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{stats.total}</div>
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground">Total Leads</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              +12% this week
            </div>
          </Card>

          <Card className="card-float p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-red-500">{stats.hot}</div>
              <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Hot Leads</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              +8% this week
            </div>
          </Card>

          <Card className="card-float p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-yellow-600">{stats.warm}</div>
              <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Warm Leads</div>
            <div className="flex items-center gap-1 text-xs text-green-600">
              <ArrowUpRight className="w-3 h-3" />
              +15% this week
            </div>
          </Card>

          <Card className="card-float p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-blue-500">{stats.cold}</div>
              <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
              </div>
            </div>
            <div className="text-sm text-muted-foreground">Cold Leads</div>
            <div className="flex items-center gap-1 text-xs text-red-600">
              <ArrowUpRight className="w-3 h-3 rotate-180" />
              -3% this week
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
            <h2 className="text-heading">Leads ({filteredLeads.length})</h2>
          </div>
          
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
                {filteredLeads.map((lead) => (
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
                      <div className="font-medium">{lead.company}</div>
                    </td>
                    <td className="p-4">
                      <Badge className={getStatusColor(lead.status)}>
                        {lead.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{lead.score}</div>
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-primary rounded-full transition-all duration-500"
                            style={{ width: `${lead.score}%` }}
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
                        {lead.lastActivity}
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
        </Card>
      </div>

      {/* Lead Detail Drawer */}
      <LeadDetailDrawer
        lead={selectedLead}
        open={!!selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  );
};

export default Dashboard;