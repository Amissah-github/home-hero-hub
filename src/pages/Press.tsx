import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Newspaper, Download, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const pressReleases = [
  { title: "HomeHelp Launches in 5 New Cities", date: "December 1, 2024", excerpt: "Expanding our trusted home services marketplace..." },
  { title: "HomeHelp Reaches 10,000 Verified Providers", date: "November 15, 2024", excerpt: "A milestone in building our community of trusted professionals..." },
  { title: "New Safety Features Announced", date: "October 20, 2024", excerpt: "Enhanced verification and real-time tracking for all bookings..." },
];

export default function Press() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-6">Press & Media</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Get the latest news about HomeHelp, our growth, and our mission to transform home services.
          </p>

          <div className="grid gap-6 md:grid-cols-2 mb-12">
            <div className="rounded-xl border border-border bg-card p-6">
              <Download className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Press Kit</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Download our logos, brand guidelines, and company information.
              </p>
              <Button variant="outline">Download Press Kit</Button>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <Mail className="h-8 w-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Media Inquiries</h3>
              <p className="text-muted-foreground text-sm mb-4">
                For press inquiries, please reach out to our media team.
              </p>
              <Button variant="outline">Contact Press Team</Button>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-6">Recent Press Releases</h2>
          <div className="space-y-4">
            {pressReleases.map((release, index) => (
              <div key={index} className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors cursor-pointer">
                <div className="flex items-start gap-4">
                  <Newspaper className="h-6 w-6 text-primary mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{release.date}</p>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{release.title}</h3>
                    <p className="text-muted-foreground">{release.excerpt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
