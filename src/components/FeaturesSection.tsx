import { Brain, Shield, Zap, BarChart3, MessageSquare, Users } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Advanced machine learning algorithms analyze lead behavior and predict conversion probability with 95% accuracy.",
  },
  {
    icon: Zap,
    title: "Lightning Fast Setup",
    description: "Get your dashboard running in under 2 minutes. No complex configurations or technical knowledge required.",
  },
  {
    icon: BarChart3,
    title: "Beautiful Analytics",
    description: "Stunning visualizations and real-time metrics that help you understand your funnel at a glance.",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade encryption and GDPR compliance ensure your lead data is always secure and private.",
  },
  {
    icon: MessageSquare,
    title: "Smart Automation",
    description: "Automated follow-ups, lead scoring, and nurture sequences that work while you sleep.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share insights, assign leads, and collaborate seamlessly with your entire revenue team.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-6 mb-16 animate-fade-in">
          <h2 className="text-display">
            Everything You Need to Convert More Leads
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Our comprehensive platform combines cutting-edge AI with beautiful design 
            to give you the ultimate lead management experience.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="card-float p-8 space-y-4 text-center group animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-heading">{feature.title}</h3>
                <p className="text-body text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-accent/30 backdrop-blur-sm rounded-full px-6 py-3 border border-border/50">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-sm font-medium">Trusted by 10,000+ Revenue Teams</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;