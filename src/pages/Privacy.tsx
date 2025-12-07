import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 py-16">
        <div className="mx-auto max-w-3xl prose prose-neutral dark:prose-invert">
          <h1 className="text-4xl font-bold text-foreground mb-6">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 1, 2024</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">1. Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect information you provide directly, including name, email, phone number, 
              address, and payment information. We also collect usage data and device information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">2. How We Use Your Information</h2>
            <p className="text-muted-foreground">
              We use your information to provide and improve our services, process payments, 
              communicate with you, ensure safety, and comply with legal requirements.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">3. Information Sharing</h2>
            <p className="text-muted-foreground">
              We share information with service providers to facilitate bookings, payment processors, 
              and as required by law. We do not sell your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">4. Data Security</h2>
            <p className="text-muted-foreground">
              We implement industry-standard security measures to protect your data. However, 
              no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">5. Your Rights</h2>
            <p className="text-muted-foreground">
              You have the right to access, correct, or delete your personal information. 
              Contact us to exercise these rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">6. Cookies</h2>
            <p className="text-muted-foreground">
              We use cookies and similar technologies to improve your experience. 
              See our Cookie Policy for more details.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">7. Contact Us</h2>
            <p className="text-muted-foreground">
              For privacy-related questions, contact our Data Protection Officer at privacy@homehelp.com.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
