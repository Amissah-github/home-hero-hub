import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Users, Target, Heart, Award } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-6">About GetServed</h1>
          <p className="text-lg text-muted-foreground mb-12">
            We're on a mission to connect homeowners with trusted, verified service providers, 
            making home maintenance and care accessible to everyone.
          </p>

          <div className="grid gap-8 md:grid-cols-2 mb-16">
            <div className="rounded-xl border border-border bg-card p-6">
              <Target className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Our Mission</h3>
              <p className="text-muted-foreground">
                To revolutionize home services by creating a trusted marketplace that empowers 
                both service providers and homeowners.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <Heart className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Our Values</h3>
              <p className="text-muted-foreground">
                Trust, quality, and community are at the heart of everything we do. 
                We verify every provider to ensure your safety.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <Users className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Our Team</h3>
              <p className="text-muted-foreground">
                A diverse team of professionals passionate about making home services 
                better for everyone in our community.
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <Award className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Our Promise</h3>
              <p className="text-muted-foreground">
                Every provider is background-checked and verified. Your satisfaction 
                and safety are our top priorities.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-muted/50 p-8 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Join Our Community</h2>
            <p className="text-muted-foreground mb-6">
              Whether you're looking for reliable home services or want to grow your service business, 
              GetServed is here for you.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
