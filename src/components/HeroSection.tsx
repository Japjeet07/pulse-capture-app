import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Users, TrendingUp, Zap } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import { useLeadSubmission } from "@/hooks/useApi";

const HeroSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { submitLead, loading, error, success } = useLeadSubmission();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Please fill in all required fields",
        description: "Name, email, and message are required.",
        variant: "destructive",
      });
      return;
    }

    if (formData.message.length < 10) {
      toast({
        title: "Message too short",
        description: "Please provide at least 10 characters describing your problem.",
        variant: "destructive",
      });
      return;
    }

    const leadId = await submitLead({
      name: formData.name,
      email: formData.email,
      company: formData.company || undefined,
      problem_text: formData.message,
    });

    if (leadId) {
      toast({
        title: "Lead Captured Successfully!",
        description: "Redirecting to your personalized dashboard...",
      });
      
      setTimeout(() => {
        navigate("/thank-you", { state: { leadId } });
      }, 1500);
    } else {
      toast({
        title: "Failed to submit lead",
        description: error || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Hero Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Premium dashboard background" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 via-background/70 to-background/90" />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-accent/20 rounded-full blur-2xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/4 w-20 h-20 bg-secondary/30 rounded-full blur-lg animate-bounce" />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column - Hero Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-accent/50 backdrop-blur-sm rounded-full px-4 py-2 border border-border/50">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">AI-Powered Lead Intelligence</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-hero bg-gradient-to-br from-foreground via-primary to-accent bg-clip-text text-transparent">
                Transform Leads Into Revenue
              </h1>
              <p className="text-body text-muted-foreground max-w-lg">
                Capture, analyze, and convert leads with our premium AI-powered dashboard. 
                Get intelligent insights, automated workflows, and beautiful analytics that drive results.
              </p>
            </div>

            {/* Stats */}
            <div className="flex gap-8">
              <div className="text-center">
                <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                  <TrendingUp className="w-6 h-6" />
                  +340%
                </div>
                <p className="text-caption">Conversion Rate</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                  <Users className="w-6 h-6" />
                  50K+
                </div>
                <p className="text-caption">Leads Processed</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-2xl font-bold text-primary">
                  <Zap className="w-6 h-6" />
                  &lt;2min
                </div>
                <p className="text-caption">Setup Time</p>
              </div>
            </div>
          </div>

          {/* Right Column - Lead Capture Form */}
          <div className="animate-slide-up delay-300">
            <Card className="card-premium p-8 space-y-6 backdrop-blur-sm">
              <div className="text-center space-y-2">
                <p className="text-body text-muted-foreground">
                  Convert Lead as per AI based scoring
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    name="name"
                    placeholder="Lead Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="glass border-border/50 focus:border-primary"
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Lead Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="glass border-border/50 focus:border-primary"
                  />
                </div>
                
                <Input
                  name="company"
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="glass border-border/50 focus:border-primary"
                />
                
                <Textarea
                  name="message"
                  placeholder="Problem Statement"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="glass border-border/50 focus:border-primary resize-none"
                />
                
                <Button 
                  type="submit" 
                  className="btn-primary w-full text-lg py-6 group"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Submit"}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>

             
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;