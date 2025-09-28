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
import AdminHeader from "@/components/AdminHeader";
import { useStats } from "@/hooks/useApi";

const Analytics = () => {
  const { data: statsData, loading: statsLoading, error: statsError } = useStats();
  
  const stats = statsData?.stats || {
    total_leads: 0,
    new_leads: 0,
    scored_leads: 0,
    high_priority: 0,
    medium_priority: 0,
    low_priority: 0,
    outreach_sent: 0,
    responded: 0,
    converted: 0,
    avg_score: 0
  };

  const recentActivity = statsData?.recent_activity || [];
  const sourceStats = statsData?.source_stats || [];

  // Calculate metrics from real data
  const totalLeads = Number(stats.total_leads) || 0;
  const converted = Number(stats.converted) || 0;
  const outreachSent = Number(stats.outreach_sent) || 0;
  const responded = Number(stats.responded) || 0;
  const avgScore = Number(stats.avg_score) || 0;
  
  const conversionRate = totalLeads > 0 ? Math.round((converted / totalLeads) * 100 * 10) / 10 : 0;
  const outreachPending = totalLeads - outreachSent;
  const hotLeads = totalLeads > 0 ? Math.round((Number(stats.high_priority) / totalLeads) * 100) : 0;
  const warmLeads = totalLeads > 0 ? Math.round((Number(stats.medium_priority) / totalLeads) * 100) : 0;
  const coldLeads = totalLeads > 0 ? Math.round((Number(stats.low_priority) / totalLeads) * 100) : 0;

  if (statsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
        <AdminHeader />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-muted-foreground">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
        <AdminHeader />
        <div className="container mx-auto px-6 py-8">
          <div className="text-center text-red-500">Error loading analytics: {statsError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/10 to-background">
      <AdminHeader />

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
                {stats.new_leads || 0} new
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{totalLeads.toLocaleString()}</div>
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
                {stats.converted || 0} converted
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{conversionRate}%</div>
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
                {stats.responded || 0} responses
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{outreachSent}</div>
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
                {outreachPending} pending
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold">{outreachPending}</div>
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
                  <div className="font-bold">{hotLeads}%</div>
                  <div className="text-sm text-muted-foreground">High Priority</div>
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${hotLeads}%` }}
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
                  <div className="font-bold">{warmLeads}%</div>
                  <div className="text-sm text-muted-foreground">Medium Priority</div>
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-1000 delay-300"
                  style={{ width: `${warmLeads}%` }}
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
                  <div className="font-bold">{coldLeads}%</div>
                  <div className="text-sm text-muted-foreground">Low Priority</div>
                </div>
              </div>
              
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000 delay-600"
                  style={{ width: `${coldLeads}%` }}
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
                  {conversionRate}%
                </div>
                <div className="text-muted-foreground">Conversion Rate</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted/20 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{avgScore}</div>
                  <div className="text-sm text-muted-foreground">Average Score</div>
                </div>
                <div className="text-center p-4 bg-muted/20 rounded-xl">
                  <div className="text-2xl font-bold text-blue-600">{responded}</div>
                  <div className="text-sm text-muted-foreground">Responses</div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Conversion Funnel</span>
                  <span className="text-muted-foreground">{totalLeads} → {stats.converted || 0}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                  <div className="h-full bg-gradient-primary rounded-full transition-all duration-1000 delay-1000" style={{ width: `${conversionRate}%` }} />
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
              {sourceStats.length > 0 ? (
                sourceStats.map((item: { source: string; count: number; percentage: number; websites?: string }) => (
                  <div key={item.source} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{item.source}</span>
                        {item.websites && (
                          <span className="text-xs text-muted-foreground">{item.websites}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{item.count}</div>
                      <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground">No source data available</div>
              )}
            </div>
          </Card>

          <Card className="card-premium p-6 space-y-4">
            <h3 className="text-heading">Recent Activity</h3>
            <div className="space-y-3">
              {statsLoading ? (
                <div className="text-center text-muted-foreground">Loading activity...</div>
              ) : recentActivity.length > 0 ? (
                recentActivity.map((activity: { 
                  event_type: string; 
                  created_at: string; 
                  lead_name?: string; 
                  lead_email?: string; 
                }, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className={`w-2 h-2 ${
                      activity.event_type === 'lead_captured' ? 'bg-green-500' :
                      activity.event_type === 'outreach_sent' ? 'bg-blue-500' :
                      activity.event_type === 'lead_scored' ? 'bg-yellow-500' :
                      'bg-purple-500'
                    } rounded-full`} />
                    <div className="flex-1">
                      <div className="text-sm">
                        {activity.event_type === 'lead_captured' ? 'Lead captured' :
                         activity.event_type === 'outreach_sent' ? 'Outreach sent' :
                         activity.event_type === 'lead_scored' ? 'Lead qualified' :
                         activity.event_type}
                      </div>
                      {activity.lead_name && (
                        <div className="text-xs text-muted-foreground">
                          {activity.lead_name} ({activity.lead_email})
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(activity.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground">No recent activity</div>
              )}
            </div>
          </Card>

          <Card className="card-premium p-6 space-y-4">
            <h3 className="text-heading">Goals Progress</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Leads Target</span>
                  <span>{totalLeads} / {Math.max(totalLeads, 100)}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full transition-all duration-1000" style={{ width: `${Math.min((totalLeads / Math.max(totalLeads, 100)) * 100, 100)}%` }} />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Conversion Goal</span>
                  <span>{conversionRate}% / 25%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-secondary h-2 rounded-full transition-all duration-1000 delay-300" style={{ width: `${Math.min((conversionRate / 25) * 100, 100)}%` }} />
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