import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, DollarSign, Calendar } from "lucide-react";

const benefits = [
  { icon: Shield, text: "Verified & background-checked" },
  { icon: DollarSign, text: "Competitive & transparent pricing" },
  { icon: Calendar, text: "Flexible scheduling options" },
];

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="absolute inset-0 gradient-hero opacity-95" />
      
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      </div>

      <div className="container relative px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl lg:text-5xl">
            Ready to Get Started?
          </h2>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Join thousands of happy customers and find your perfect service provider today.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
            {benefits.map((benefit) => (
              <div
                key={benefit.text}
                className="flex items-center gap-2 text-primary-foreground/90"
              >
                <benefit.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{benefit.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="xl"
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
            >
              <Link to="/services" className="gap-2">
                Book a Service
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="xl"
              className="border-2 border-white/30 bg-transparent text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
            >
              <Link to="/become-provider">Become a Provider</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
