import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DollarSign,
  Clock,
  Calendar,
  Shield,
  Star,
  Users,
  ArrowRight,
  CheckCircle,
  Briefcase,
  MapPin,
} from "lucide-react";

const benefits = [
  {
    icon: DollarSign,
    title: "Competitive Earnings",
    description: "Set your own rates and earn up to $50+/hour. Get paid weekly with no hidden fees.",
  },
  {
    icon: Clock,
    title: "Flexible Schedule",
    description: "Work when you want. Accept jobs that fit your schedule and lifestyle.",
  },
  {
    icon: Calendar,
    title: "Steady Work",
    description: "Access a constant stream of job requests from customers in your area.",
  },
  {
    icon: Shield,
    title: "Insurance Coverage",
    description: "Work with peace of mind. All jobs are covered by our liability insurance.",
  },
  {
    icon: Star,
    title: "Build Your Reputation",
    description: "Earn reviews and ratings to attract more customers and grow your business.",
  },
  {
    icon: Users,
    title: "Supportive Community",
    description: "Join thousands of providers and access training, support, and resources.",
  },
];

const requirements = [
  "Be at least 18 years old",
  "Have relevant experience or certifications",
  "Pass background verification",
  "Own necessary equipment/supplies",
  "Have a smartphone with data",
  "Provide excellent customer service",
];

const steps = [
  {
    number: "1",
    title: "Sign Up",
    description: "Create your provider account in minutes",
  },
  {
    number: "2",
    title: "Get Verified",
    description: "Upload ID, certifications, and complete background check",
  },
  {
    number: "3",
    title: "Set Your Profile",
    description: "Add your skills, rates, and availability",
  },
  {
    number: "4",
    title: "Start Earning",
    description: "Accept jobs and grow your business",
  },
];

export default function BecomeProvider() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden gradient-hero py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="container relative px-4">
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium text-primary-foreground">
                <Briefcase className="h-4 w-4" />
                Join 5,000+ providers earning with HomeHelp
              </span>

              <h1 className="mt-6 text-4xl font-bold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
                Turn Your Skills Into Income
              </h1>

              <p className="mt-6 text-lg text-primary-foreground/80 sm:text-xl">
                Set your own schedule, choose your jobs, and earn money doing what you love. Join the HomeHelp provider network today.
              </p>

              <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button
                  asChild
                  size="xl"
                  className="bg-white text-primary hover:bg-white/90 shadow-lg"
                >
                  <Link to="/signup" className="gap-2">
                    Apply Now
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              </div>

              <div className="mt-12 grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-foreground">$50+</p>
                  <p className="text-sm text-primary-foreground/70">Avg. hourly rate</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-foreground">1M+</p>
                  <p className="text-sm text-primary-foreground/70">Jobs completed</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary-foreground">4.8</p>
                  <p className="text-sm text-primary-foreground/70">Provider rating</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20">
          <div className="container px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Why Providers Love HomeHelp
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to grow your service business
              </p>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, index) => (
                <Card
                  key={benefit.title}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg gradient-primary">
                      <benefit.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {benefit.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-muted/30 py-20">
          <div className="container px-4">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Getting Started is Easy
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Four simple steps to start earning
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative text-center animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {index < steps.length - 1 && (
                    <div className="absolute left-[60%] top-8 hidden h-0.5 w-[80%] bg-border lg:block" />
                  )}
                  <div className="relative z-10 mx-auto flex h-16 w-16 items-center justify-center rounded-full gradient-primary text-2xl font-bold text-primary-foreground shadow-lg">
                    {step.number}
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-20">
          <div className="container px-4">
            <div className="mx-auto max-w-4xl">
              <div className="grid gap-12 lg:grid-cols-2">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight text-foreground">
                    What You'll Need
                  </h2>
                  <p className="mt-4 text-muted-foreground">
                    We want to ensure quality service for our customers. Here's what we look for in providers.
                  </p>
                  <ul className="mt-8 space-y-4">
                    {requirements.map((req) => (
                      <li key={req} className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-success" />
                        <span className="text-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Card className="bg-muted/50">
                  <CardContent className="p-8">
                    <h3 className="text-xl font-semibold text-foreground">
                      Ready to Apply?
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Join our network of trusted providers and start earning today. The application takes less than 10 minutes.
                    </p>

                    <div className="mt-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span className="text-sm">Available in 50+ cities</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-primary" />
                        <span className="text-sm">Quick approval process</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Shield className="h-5 w-5 text-primary" />
                        <span className="text-sm">Free background check</span>
                      </div>
                    </div>

                    <Button asChild variant="hero" className="mt-8 w-full gap-2">
                      <Link to="/signup">
                        Start Your Application
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
