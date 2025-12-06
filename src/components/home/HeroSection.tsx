import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, ArrowRight, Shield, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const stats = [
  { icon: Shield, value: "5,000+", label: "Verified Providers" },
  { icon: Star, value: "4.8", label: "Average Rating" },
  { icon: Clock, value: "30 min", label: "Avg. Response Time" },
];

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/services?q=${searchQuery}&location=${location}`);
  };

  return (
    <section className="relative overflow-hidden gradient-subtle">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <div className="container relative px-4 py-16 md:py-24 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              <Shield className="h-4 w-4" />
              Trusted by 100,000+ customers
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl animate-fade-in" style={{ animationDelay: "100ms" }}>
            Home Services Made{" "}
            <span className="text-gradient">Simple & Safe</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground sm:text-xl animate-fade-in" style={{ animationDelay: "200ms" }}>
            Book verified cleaners, barbers, cooks, and more. Get matched with
            qualified professionals in your area instantly.
          </p>

          {/* Search Form */}
          <form
            onSubmit={handleSearch}
            className="mt-10 animate-fade-in"
            style={{ animationDelay: "300ms" }}
          >
            <div className="flex flex-col gap-3 rounded-2xl bg-card p-3 shadow-lg sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="What service do you need?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-12 border-0 bg-transparent pl-12 text-base focus-visible:ring-0"
                />
              </div>
              <div className="h-px bg-border sm:h-8 sm:w-px" />
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Your location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-12 border-0 bg-transparent pl-12 text-base focus-visible:ring-0"
                />
              </div>
              <Button type="submit" variant="hero" size="lg" className="gap-2">
                Search
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </form>

          {/* Stats */}
          <div
            className="mt-12 grid grid-cols-3 gap-6 animate-fade-in"
            style={{ animationDelay: "400ms" }}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-2xl font-bold text-foreground sm:text-3xl">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
