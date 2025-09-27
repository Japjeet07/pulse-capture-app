import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const ThankYou = () => {
  useEffect(() => {
    // Add smooth scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-6">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/20 rounded-full blur-2xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <Card className="card-premium p-12 space-y-8 animate-scale-in">
          {/* Success Icon */}
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-bounce">
              <CheckCircle className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center animate-spin">
              <Sparkles className="w-4 h-4 text-accent-foreground" />
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <h1 className="text-display bg-gradient-to-br from-foreground via-primary to-accent bg-clip-text text-transparent">
              Welcome to LeadCapture Pro! 🎉
            </h1>
            
            <p className="text-body text-muted-foreground leading-relaxed">
              Your account is being set up with premium AI insights. We're preparing your 
              personalized dashboard with advanced analytics and automation tools.
            </p>
          </div>

          {/* Next Steps */}
          <div className="space-y-6 pt-4">
            <div className="text-left space-y-4 bg-muted/30 rounded-xl p-6">
              <h3 className="text-heading text-center mb-4">What's Next?</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">1</div>
                  <span className="text-sm">Check your email for setup instructions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">2</div>
                  <span className="text-sm">Explore your premium dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-medium">3</div>
                  <span className="text-sm">Start capturing and converting leads</span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="btn-primary group">
                <Link to="/dashboard">
                  Access Dashboard
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" className="hover-lift">
                <Link to="/">
                  Back to Home
                </Link>
              </Button>
            </div>
          </div>

          {/* Support Info */}
          <div className="pt-6 border-t border-border/50">
            <p className="text-caption">
              Need help getting started? 
              <a href="mailto:support@leadcapturepro.com" className="text-primary hover:underline ml-1">
                Contact our support team
              </a>
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
};

export default ThankYou;