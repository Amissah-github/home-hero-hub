import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function Contact() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-6">Contact Us</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-xl border border-border bg-card p-6">
                <Mail className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                <p className="text-muted-foreground">support@homehelp.com</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <Phone className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                <p className="text-muted-foreground">+234 800 000 0000</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <MapPin className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-1">Address</h3>
                <p className="text-muted-foreground">Lagos, Nigeria</p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6">
                <Clock className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-1">Hours</h3>
                <p className="text-muted-foreground">24/7 Support Available</p>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-6">Send a Message</h2>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Your name" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="your@email.com" />
                </div>
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Tell us more..." rows={4} />
                </div>
                <Button className="w-full">Send Message</Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
