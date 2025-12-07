import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Calendar, ArrowRight } from "lucide-react";

const blogPosts = [
  { 
    title: "5 Tips for Finding the Right Home Cleaner", 
    date: "December 5, 2024", 
    category: "Tips",
    excerpt: "Finding a reliable home cleaner doesn't have to be stressful. Here's what to look for..." 
  },
  { 
    title: "Why Verified Providers Matter", 
    date: "November 28, 2024", 
    category: "Safety",
    excerpt: "Learn about our rigorous verification process and how it protects you..." 
  },
  { 
    title: "Home Maintenance Checklist for the New Year", 
    date: "November 20, 2024", 
    category: "Guides",
    excerpt: "Start the new year right with this comprehensive home maintenance guide..." 
  },
  { 
    title: "Meet Our Top-Rated Providers", 
    date: "November 15, 2024", 
    category: "Community",
    excerpt: "Spotlight on the service providers who go above and beyond for customers..." 
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-6">Blog</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Tips, guides, and stories from the HomeHelp community.
          </p>

          <div className="grid gap-6">
            {blogPosts.map((post, index) => (
              <article key={index} className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors cursor-pointer group">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" /> {post.date}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground">{post.excerpt}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
