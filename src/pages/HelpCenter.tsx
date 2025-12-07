import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Search, BookOpen, MessageCircle, CreditCard, Shield, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

const helpCategories = [
  { icon: BookOpen, title: "Getting Started", description: "Learn how to use HomeHelp", articles: 12 },
  { icon: Calendar, title: "Bookings", description: "Manage your appointments", articles: 8 },
  { icon: CreditCard, title: "Payments", description: "Billing and payment questions", articles: 6 },
  { icon: Shield, title: "Safety", description: "Your security is our priority", articles: 10 },
  { icon: MessageCircle, title: "Communication", description: "Messaging providers", articles: 5 },
];

const popularArticles = [
  "How do I book a service?",
  "How are providers verified?",
  "Can I cancel my booking?",
  "How do payments work?",
  "What if I'm not satisfied with the service?",
];

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-6">Help Center</h1>
            <p className="text-lg text-muted-foreground mb-8">
              How can we help you today?
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search for help..." className="pl-10" />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-12">
            {helpCategories.map((category, index) => (
              <div key={index} className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors cursor-pointer">
                <category.icon className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-1">{category.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{category.description}</p>
                <p className="text-xs text-primary">{category.articles} articles</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Popular Articles</h2>
            <ul className="space-y-3">
              {popularArticles.map((article, index) => (
                <li key={index}>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    {article}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
