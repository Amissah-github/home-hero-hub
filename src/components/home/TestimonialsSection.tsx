import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Busy Professional",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    content: "HomeHelp has been a game-changer for my busy schedule. I can book a cleaner within minutes, and they always do an amazing job. The verification process gives me peace of mind.",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Small Business Owner",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    content: "Found an excellent digital marketer through the platform. The ability to see their portfolio and previous reviews helped me make the right choice. Highly recommended!",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Working Mom",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    content: "The personal chef service is fantastic! Fresh, healthy meals prepared in my kitchen. My kids love the food, and I get to spend more quality time with them instead of cooking.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Join thousands of satisfied customers who trust HomeHelp
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card
              key={testimonial.id}
              className="relative overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <Quote className="absolute -right-2 -top-2 h-16 w-16 text-primary/5" />
                
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>

                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-warning text-warning"
                    />
                  ))}
                </div>

                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  "{testimonial.content}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
