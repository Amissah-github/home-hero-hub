import { Search, UserCheck, Calendar, ThumbsUp } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search & Browse",
    description: "Find the service you need and browse verified providers in your area",
  },
  {
    icon: UserCheck,
    title: "Choose Provider",
    description: "Compare ratings, reviews, prices, and availability to pick the best match",
  },
  {
    icon: Calendar,
    title: "Book Instantly",
    description: "Schedule your service at a convenient time with instant confirmation",
  },
  {
    icon: ThumbsUp,
    title: "Enjoy & Review",
    description: "Get quality service, pay securely, and leave a review to help others",
  },
];

export function HowItWorksSection() {
  return (
    <section className="bg-muted/30 py-16 md:py-24">
      <div className="container px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Getting help at home has never been easier
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-[50%] top-8 hidden h-0.5 w-full bg-border lg:block" />
              )}

              <div className="relative flex flex-col items-center text-center">
                <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full gradient-primary shadow-lg">
                  <step.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <div className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground">
                  {index + 1}
                </div>
                <h3 className="mt-6 text-lg font-semibold text-foreground">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
