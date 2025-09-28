/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Building, 
  Calendar, 
  TrendingUp, 
  MessageSquare,
  ExternalLink,
  Send,
  Star,
  Clock
} from "lucide-react";
import { useOutreach } from "@/hooks/useApi";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";
import { Lead } from "@/config/api";

interface LeadDetailDrawerProps {
  lead: Lead | null;
  open: boolean;
  onClose: () => void;
  onOutreachSent?: () => void; // Callback to refresh data
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "hot": return "bg-red-500/10 text-red-500 border-red-500/20";
    case "warm": return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "cold": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
    default: return "bg-muted text-muted-foreground";
  }
};

const timeline = [
  { action: "Lead captured", time: "2 hours ago", icon: User },
  { action: "Email opened", time: "1 hour ago", icon: Mail },
  { action: "Profile enriched", time: "45 minutes ago", icon: TrendingUp },
  { action: "AI score calculated", time: "30 minutes ago", icon: Star },
];

const LeadDetailDrawer = ({ lead, open, onClose, onOutreachSent }: LeadDetailDrawerProps) => {
  const { sendOutreach, loading: outreachLoading, error: outreachError } = useOutreach();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [outreachData, setOutreachData] = useState<any>(null);
  const [loadingOutreach, setLoadingOutreach] = useState(false);

  const handleSendOutreach = async () => {
    if (!lead) return;
    
    console.log('Sending outreach for lead:', lead.id);
    console.log('User authenticated:', isAuthenticated, 'User:', user?.email);
    
    const result = await sendOutreach(lead.id);
    if (result) {
      toast({
        title: "Outreach Sent Successfully!",
        description: "The outreach email has been sent to the lead.",
      });
      
      // Refresh the leads data to show updated status
      if (onOutreachSent) {
        onOutreachSent();
      }
      
      onClose();
    } else {
      toast({
        title: "Failed to Send Outreach",
        description: outreachError || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const fetchOutreachData = async () => {
    if (!lead || lead.status !== 'outreach_sent') return;
    
    setLoadingOutreach(true);
    try {
      const response = await apiService.getOutreachData(lead.id);
      if (response.success && response.data) {
        setOutreachData(response.data);
      } else {
        console.error('Failed to fetch outreach data:', response.error);
      }
    } catch (error) {
      console.error('Error fetching outreach data:', error);
    } finally {
      setLoadingOutreach(false);
    }
  };

  // Fetch outreach data when drawer opens and lead has outreach_sent status
  React.useEffect(() => {
    if (open && lead?.status === 'outreach_sent') {
      fetchOutreachData();
    }
  }, [open, lead?.status]);


  if (!lead) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl p-0 overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <SheetHeader className="p-6 bg-gradient-to-r from-muted/50 to-accent/30 border-b">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <SheetTitle className="text-2xl font-semibold">{lead.name}</SheetTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {lead.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {lead.company}
                  </span>
                </div>
              </div>
              <Badge className={getStatusColor(lead.status)}>
                {lead.status.toUpperCase()}
              </Badge>
            </div>
          </SheetHeader>

          {/* Content */}
          <div className="flex-1 p-6 space-y-6">
            {/* AI Score & Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 text-center hover-lift">
                <div className="text-2xl font-bold text-primary">{lead.fit_score || 0}/100</div>
                <div className="text-sm text-muted-foreground">AI Score</div>
              </Card>
              <Card className="p-4 text-center hover-lift">
                <div className="text-2xl font-bold text-accent-foreground">{lead.source}</div>
                <div className="text-sm text-muted-foreground">Source</div>
              </Card>
            </div>

            {/* Original Message */}
            <div className="space-y-3">
              <h3 className="text-heading flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Original Message
              </h3>
              <Card className="p-4 bg-muted/30">
                <p className="text-body leading-relaxed">{lead.problem_text}</p>
              </Card>
            </div>

            <Separator />

            {/* Enrichment Data */}
            <div className="space-y-3">
              <h3 className="text-heading">Lead Intelligence</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Company Size</div>
                  <div className="text-body">50-200 employees</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Industry</div>
                  <div className="text-body">SaaS Technology</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Location</div>
                  <div className="text-body">San Francisco, CA</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Revenue</div>
                  <div className="text-body">$10M - $50M</div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Sent Email Content */}
            {lead.status === 'outreach_sent' && (
              <div className="space-y-3">
                <h3 className="text-heading flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Sent Outreach Email
                </h3>
                <Card className="p-4 bg-muted/30">
                  {loadingOutreach ? (
                    <div className="text-center py-4">
                      <div className="text-muted-foreground">Loading email content...</div>
                    </div>
                  ) : outreachData ? (
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Subject:</h4>
                        <p className="text-sm bg-muted/50 p-2 rounded">
                          {outreachData.email_subject || `Re: ${lead.company} inquiry`}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-muted-foreground mb-1">Email Content:</h4>
                        <div className="bg-muted/50 p-3 rounded max-h-64 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                            {outreachData.email_body || 'No email content available'}
                          </pre>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Mail className="w-3 h-3" />
                        Sent on {outreachData.sent_at ? new Date(outreachData.sent_at).toLocaleString() : 'Unknown date'}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <div className="text-muted-foreground">No email content available</div>
                    </div>
                  )}
                </Card>
              </div>
            )}

            <Separator />

            {/* Timeline */}
            <div className="space-y-3">
              <h3 className="text-heading flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Activity Timeline
              </h3>
              <div className="space-y-3">
                {timeline.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.action}</div>
                      <div className="text-xs text-muted-foreground">{item.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t bg-muted/20 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              {lead.status !== 'outreach_sent' && (
                <Button 
                  onClick={handleSendOutreach}
                  disabled={outreachLoading}
                  className="btn-primary flex-1 group"
                >
                  {outreachLoading ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform" />
                      Send Outreach
                    </>
                  )}
                </Button>
              )}
              
              <Button variant="outline" className="hover-lift">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Profile
              </Button>
            </div>
            
            <div className="text-xs text-center text-muted-foreground">
              Last activity: {new Date(lead.last_activity_at).toLocaleDateString()}
            </div>
          </div>
        </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default LeadDetailDrawer;