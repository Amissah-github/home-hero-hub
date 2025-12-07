import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Shield, UserCheck, Eye, AlertTriangle, Phone } from "lucide-react";

export default function Safety() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-foreground mb-6">Your Safety Matters</h1>
            <p className="text-lg text-muted-foreground">
              Learn about the measures we take to ensure a safe experience for everyone.
            </p>
          </div>

          <div className="space-y-8">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <UserCheck className="h-8 w-8 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Provider Verification</h3>
                  <p className="text-muted-foreground">
                    Every provider on HomeHelp undergoes a thorough verification process including ID verification, 
                    selfie check, and background screening before they can offer services on our platform.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <Eye className="h-8 w-8 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Real-Time Tracking</h3>
                  <p className="text-muted-foreground">
                    Track your service provider in real-time during bookings. Know when they're arriving 
                    and stay connected throughout the service.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="h-8 w-8 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">Report Suspicious Activity</h3>
                  <p className="text-muted-foreground">
                    If something doesn't feel right, report it immediately. Our trust and safety team 
                    reviews all reports and takes swift action to protect our community.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start gap-4">
                <Phone className="h-8 w-8 text-primary mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">24/7 Support</h3>
                  <p className="text-muted-foreground">
                    Our support team is available around the clock to help with any safety concerns 
                    or emergencies that may arise during a service.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
