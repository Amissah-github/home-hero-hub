import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Briefcase, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const openPositions = [
  { title: "Senior Software Engineer", department: "Engineering", location: "Remote", type: "Full-time" },
  { title: "Product Designer", department: "Design", location: "Remote", type: "Full-time" },
  { title: "Customer Success Manager", department: "Operations", location: "Lagos, Nigeria", type: "Full-time" },
  { title: "Marketing Manager", department: "Marketing", location: "Remote", type: "Full-time" },
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold text-foreground mb-6">Careers at HomeHelp</h1>
          <p className="text-lg text-muted-foreground mb-12">
            Join our team and help us transform the home services industry. 
            We're always looking for talented individuals who share our passion.
          </p>

          <div className="rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 p-8 mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Why Work With Us?</h2>
            <ul className="grid gap-4 md:grid-cols-2 text-muted-foreground">
              <li className="flex items-center gap-2">✓ Competitive salary & benefits</li>
              <li className="flex items-center gap-2">✓ Remote-first culture</li>
              <li className="flex items-center gap-2">✓ Learning & development budget</li>
              <li className="flex items-center gap-2">✓ Flexible working hours</li>
            </ul>
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-6">Open Positions</h2>
          <div className="space-y-4">
            {openPositions.map((job, index) => (
              <div key={index} className="rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Briefcase className="h-4 w-4" /> {job.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {job.type}
                      </span>
                    </div>
                  </div>
                  <Button>Apply Now</Button>
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
