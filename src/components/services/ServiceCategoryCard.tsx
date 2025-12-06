import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCategoryCardProps {
  category: {
    id: string;
    name: string;
    description: string;
    icon: LucideIcon;
    color: string;
    providers: number;
  };
}

export function ServiceCategoryCard({ category }: ServiceCategoryCardProps) {
  return (
    <Link to={`/services?category=${category.id}`}>
      <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
        <CardContent className="p-6">
          <div
            className={cn(
              "mb-4 flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
              category.color
            )}
          >
            <category.icon className="h-7 w-7 text-primary-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{category.description}</p>
          <p className="mt-3 text-xs font-medium text-primary">
            {category.providers}+ providers available
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
