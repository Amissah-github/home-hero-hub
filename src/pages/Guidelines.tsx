import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Users, Heart, MessageCircle, Star } from "lucide-react";

export default function Guidelines() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-6">Community Guidelines</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Our guidelines help create a respectful, safe, and positive experience for everyone in the HomeHelp community.
          </p>

          <div className="space-y-8">
            <section className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Respect & Kindness</h2>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Treat all members of our community with respect and dignity</li>
                <li>• Be patient and understanding in all interactions</li>
                <li>• Avoid discriminatory behavior of any kind</li>
                <li>• Communicate professionally and courteously</li>
              </ul>
            </section>

            <section className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">For Customers</h2>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Provide accurate booking information</li>
                <li>• Be available at the scheduled time</li>
                <li>• Communicate any changes or cancellations promptly</li>
                <li>• Leave honest and constructive reviews</li>
              </ul>
            </section>

            <section className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <Star className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">For Providers</h2>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Maintain accurate availability schedules</li>
                <li>• Arrive on time for all appointments</li>
                <li>• Deliver services as described</li>
                <li>• Maintain professional conduct at all times</li>
              </ul>
            </section>

            <section className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Communication</h2>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Keep all communications on the HomeHelp platform</li>
                <li>• Do not share personal contact information until necessary</li>
                <li>• Report any inappropriate messages immediately</li>
                <li>• Be responsive to messages and updates</li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
