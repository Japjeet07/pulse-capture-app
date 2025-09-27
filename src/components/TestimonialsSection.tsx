import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "VP of Growth",
    company: "TechFlow Inc",
    content: "LeadCapture Pro transformed our entire sales process. We've seen a 340% increase in qualified leads and our team loves the intuitive interface.",
    rating: 5,
    initials: "SC",
  },
  {
    name: "Marcus Rodriguez",
    role: "Sales Director",
    company: "GrowthLabs",
    content: "The AI insights are incredibly accurate. It's like having a data scientist on our team. Setup was literally 2 minutes - I couldn't believe it.",
    rating: 5,
    initials: "MR",
  },
  {
    name: "Emily Watson",
    role: "Marketing Manager",
    company: "StartupBoost",
    content: "Beautiful design meets powerful functionality. Our conversion rates doubled in the first month, and the analytics dashboards are stunning.",
    rating: 5,
    initials: "EW",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-muted/20 to-background">
      <div className="container mx-auto px-6">
        <div className="text-center space-y-6 mb-16 animate-fade-in">
          <div className="flex items-center justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-primary text-primary" />
            ))}
            <span className="ml-2 text-lg font-semibold">4.9/5 from 2,847 reviews</span>
          </div>
          
          <h2 className="text-display">
            Loved by Revenue Teams Worldwide
          </h2>
          <p className="text-body text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it. Here's what industry leaders are saying 
            about their experience with LeadCapture Pro.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.name}
              className="card-float p-8 space-y-6 relative animate-scale-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-lg">
                <Quote className="w-6 h-6 text-primary-foreground" />
              </div>

              {/* Rating */}
              <div className="flex items-center gap-1 pt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Content */}
              <blockquote className="text-body leading-relaxed">
                "{testimonial.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                <Avatar className="w-12 h-12 border-2 border-primary/20">
                  <AvatarFallback className="bg-gradient-primary text-primary-foreground font-semibold">
                    {testimonial.initials}
                  </AvatarFallback>
                </Avatar>
                
                <div>
                  <div className="font-semibold text-foreground">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 space-y-6 animate-fade-in">
          <div className="space-y-4">
            <h3 className="text-2xl font-semibold">Join 10,000+ Growing Companies</h3>
            <p className="text-muted-foreground">
              Start converting more leads today with our premium dashboard
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Free 14-day trial
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              No credit card required
            </span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Cancel anytime
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;