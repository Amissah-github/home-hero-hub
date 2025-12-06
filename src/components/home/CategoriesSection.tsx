import { Sparkles, Scissors, ChefHat, Shirt, Megaphone, Wrench, Paintbrush, Car } from "lucide-react";
import { ServiceCategoryCard } from "@/components/services/ServiceCategoryCard";

const categories = [
  {
    id: "cleaning",
    name: "Home Cleaning",
    description: "Professional deep cleaning, regular maintenance, and more",
    icon: Sparkles,
    color: "gradient-primary",
    providers: 1200,
  },
  {
    id: "barber",
    name: "Barber & Salon",
    description: "Haircuts, styling, grooming at your doorstep",
    icon: Scissors,
    color: "bg-accent",
    providers: 850,
  },
  {
    id: "cooking",
    name: "Personal Chef",
    description: "Home-cooked meals by professional chefs",
    icon: ChefHat,
    color: "bg-warning",
    providers: 420,
  },
  {
    id: "laundry",
    name: "Laundry & Ironing",
    description: "Wash, dry, fold, and ironing services",
    icon: Shirt,
    color: "bg-info",
    providers: 680,
  },
  {
    id: "marketing",
    name: "Digital Marketing",
    description: "Social media, SEO, and content creation",
    icon: Megaphone,
    color: "bg-destructive",
    providers: 320,
  },
  {
    id: "handyman",
    name: "Handyman",
    description: "Repairs, installations, and maintenance",
    icon: Wrench,
    color: "bg-success",
    providers: 950,
  },
  {
    id: "painting",
    name: "Painting",
    description: "Interior and exterior painting services",
    icon: Paintbrush,
    color: "gradient-accent",
    providers: 280,
  },
  {
    id: "carwash",
    name: "Car Wash",
    description: "Professional car cleaning at your location",
    icon: Car,
    color: "bg-primary",
    providers: 390,
  },
];

export function CategoriesSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Browse Services
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Find the perfect professional for any home service need
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ServiceCategoryCard category={category} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
