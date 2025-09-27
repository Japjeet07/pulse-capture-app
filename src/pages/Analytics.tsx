import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  Mail, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Filter
} from "lucide-react";
import { Link } from "react-router-dom";

const Analytics = () => {
  // Mock data for charts and metrics
  const metrics = {
    totalLeads: 1247,
    conversionRate: 24.5,
    outreachSent: 892,
    outreachPending: 355,
    hotLeads: 38,
    warmLeads: 42,
    coldLeads: 20
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-display">Analytics Dashboard</h1>
              <p className="text-muted-foreground">Insights and performance metrics for your lead pipeline</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="outline" className="hover-lift">
                <Calendar className="w-4 h-4 mr-2" />
                Last 30 Days
              </Button>
              
              <Button variant="outline" className="hover-lift">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>
              
              <Button asChild className="btn-primary">
                <Link to="/dashboard">
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8 space-y-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-float p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                <Users className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                +12.5%
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.totalLeads.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Leads</div>
            </div>
          </Card>

          <Card className="card-float p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center">
                <Target className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                +3.2%
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.conversionRate}%</div>
              <div className="text-sm text-muted-foreground">Conversion Rate</div>
            </div>
          </Card>

          <Card className="card-float p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-gradient-accent flex items-center justify-center">
                <Mail className="w-6 h-6 text-accent-foreground" />
              </div>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <ArrowUpRight className="w-4 h-4" />
                +18.7%
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.outreachSent}</div>
              <div className="text-sm text-muted-foreground">Outreach Sent</div>
            </div>
          </Card>

          <Card className="card-float p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="flex items-center gap-1 text-red-600 text-sm">
                <ArrowDownRight className="w-4 h-4" />
                -5.1%
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{metrics.outreachPending}</div>
              <div className="text-sm text-muted-foreground">Pending Outreach</div>
            </div>
          </Card>
        </div>

        {/* Lead Quality Distribution */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="card-premium p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-heading">Lead Quality Distribution</h3>
              <Button variant="ghost" size="sm">View Details</Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full" />
                  <span className="font-medium">Hot Leads</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{metrics.hotLeads}%</div>
                  <div className="text-sm text-muted-foreground">High Priority</div>
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${metrics.hotLeads}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full" />
                  <span className="font-medium">Warm Leads</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{metrics.warmLeads}%</div>
                  <div className="text-sm text-muted-foreground">Medium Priority</div>
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-1000 delay-300"
                  style={{ width: `${metrics.warmLeads}%` }}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full" />
                  <span className="font-medium">Cold Leads</span>
                </div>
                <div className="text-right">
                  <div className="font-bold">{metrics.coldLeads}%</div>
                  <div className="text-sm text-muted-foreground">Low Priority</div>
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000 delay-600"
                  style={{ width: `${metrics.coldLeads}%` }}
                />
              </div>
            </div>
          </Card>

          {/* Performance Trends */}
          <Card className="card-premium p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-heading">Performance Trends</h3>
              <Button variant="ghost" size="sm">Export Data</Button>
            </div>
            
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="text-4xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                  +247%
                </div>
                <div className="text-muted-foreground">Lead Growth This Quarter</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/20 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">89%</div>
                  <div className="text-sm text-muted-foreground">Email Open Rate</div>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">34%</div>
                  <div className="text-sm text-muted-foreground">Response Rate</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Conversion Funnel</span>
                  <span className="text-muted-foreground">1,247 → 306</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div className="h-full bg-gradient-primary rounded-full transition-all duration-1000 delay-1000" style={{ width: '24.5%' }} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Detailed Insights */}
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="card-premium p-6 space-y-4">
            <h3 className="text-heading">Top Sources</h3>
            <div className="space-y-3">
              {[
                { source: "Website", count: 487, percentage: 39 },
                { source: "LinkedIn", count: 325, percentage: 26 },
                { source: "Referrals", count: 241, percentage: 19 },
                { source: "Google Ads", count: 194, percentage: 16 }
              ].map((item) => (
                <div key={item.source} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="text-sm">{item.source}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{item.count}</div>
                    <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="card-premium p-6 space-y-4">
            <h3 className="text-heading">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: "Lead captured", time: "2 min ago", color: "bg-green-500" },
                { action: "Outreach sent", time: "15 min ago", color: "bg-blue-500" },
                { action: "Lead qualified", time: "1 hour ago", color: "bg-yellow-500" },
                { action: "Meeting scheduled", time: "2 hours ago", color: "bg-purple-500" }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-2 h-2 ${item.color} rounded-full`} />
                  <div className="flex-1 text-sm">{item.action}</div>
                  <div className="text-xs text-muted-foreground">{item.time}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="card-premium p-6 space-y-4">
            <h3 className="text-heading">Goals Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Monthly Target</span>
                  <span>847 / 1,000</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full transition-all duration-1000" style={{ width: '84.7%' }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Conversion Goal</span>
                  <span>24.5% / 25%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-secondary h-2 rounded-full transition-all duration-1000 delay-300" style={{ width: '98%' }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analytics;