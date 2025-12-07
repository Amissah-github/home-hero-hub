import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 py-16">
        <div className="mx-auto max-w-3xl prose prose-neutral dark:prose-invert">
          <h1 className="text-4xl font-bold text-foreground mb-6">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 1, 2024</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using HomeHelp, you accept and agree to be bound by the terms and 
              provisions of this agreement. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
            <p className="text-muted-foreground">
              HomeHelp provides a platform connecting users with home service providers. We facilitate 
              the booking and payment process but are not responsible for the actual services provided.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Responsibilities</h2>
            <p className="text-muted-foreground">
              Users must provide accurate information, maintain account security, and use the platform 
              in compliance with all applicable laws and our community guidelines.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Provider Responsibilities</h2>
            <p className="text-muted-foreground">
              Service providers must maintain appropriate qualifications, deliver services as described, 
              and comply with all verification requirements and platform policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Payment Terms</h2>
            <p className="text-muted-foreground">
              Payments are processed securely through our platform. Fees, cancellation policies, and 
              refund terms are detailed in our payment policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              HomeHelp is not liable for any indirect, incidental, or consequential damages arising 
              from the use of our platform or services booked through it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact</h2>
            <p className="text-muted-foreground">
              For questions about these terms, please contact us at legal@homehelp.com.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
