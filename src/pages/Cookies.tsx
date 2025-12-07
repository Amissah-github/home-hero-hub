import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Cookies() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 py-16">
        <div className="mx-auto max-w-3xl prose prose-neutral dark:prose-invert">
          <h1 className="text-4xl font-bold text-foreground mb-6">Cookie Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: December 1, 2024</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">What Are Cookies</h2>
            <p className="text-muted-foreground">
              Cookies are small text files stored on your device when you visit our website. 
              They help us provide a better user experience and understand how you use our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Types of Cookies We Use</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-foreground">Essential Cookies</h3>
                <p className="text-muted-foreground">
                  Required for the website to function properly. These cannot be disabled.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">Analytics Cookies</h3>
                <p className="text-muted-foreground">
                  Help us understand how visitors interact with our website.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">Functionality Cookies</h3>
                <p className="text-muted-foreground">
                  Remember your preferences and settings for a personalized experience.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-foreground">Marketing Cookies</h3>
                <p className="text-muted-foreground">
                  Used to deliver relevant advertisements and track campaign performance.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Managing Cookies</h2>
            <p className="text-muted-foreground">
              You can control and delete cookies through your browser settings. Note that 
              disabling certain cookies may affect your experience on our website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Third-Party Cookies</h2>
            <p className="text-muted-foreground">
              We may use third-party services that set their own cookies. We do not control 
              these cookies and recommend reviewing their privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about our use of cookies, please contact us at privacy@homehelp.com.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
