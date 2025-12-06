import { Star, MapPin, Shield, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ProviderCardProps {
  provider: {
    id: string;
    name: string;
    avatar: string;
    service: string;
    rating: number;
    reviews: number;
    price: number;
    priceUnit: string;
    distance: string;
    verified: boolean;
    available: boolean;
    skills: string[];
  };
  onBook?: (id: string) => void;
}

export function ProviderCard({ provider, onBook }: ProviderCardProps) {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={provider.avatar}
            alt={provider.name}
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {provider.verified && (
            <div className="absolute left-3 top-3">
              <Badge variant="verified" className="gap-1">
                <Shield className="h-3 w-3" />
                Verified
              </Badge>
            </div>
          )}
          {provider.available ? (
            <div className="absolute right-3 top-3">
              <Badge variant="success" className="gap-1">
                <Clock className="h-3 w-3" />
                Available
              </Badge>
            </div>
          ) : (
            <div className="absolute right-3 top-3">
              <Badge variant="secondary" className="gap-1">
                Unavailable
              </Badge>
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{provider.name}</h3>
              <p className="text-sm text-muted-foreground">{provider.service}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-foreground">
                ${provider.price}
                <span className="text-xs font-normal text-muted-foreground">
                  /{provider.priceUnit}
                </span>
              </p>
            </div>
          </div>

          <div className="mt-3 flex items-center gap-3 text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-warning text-warning" />
              <span className="font-medium">{provider.rating}</span>
              <span className="text-muted-foreground">({provider.reviews})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              {provider.distance}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {provider.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>

          <Button
            variant="default"
            className="mt-4 w-full"
            onClick={() => onBook?.(provider.id)}
            disabled={!provider.available}
          >
            {provider.available ? "Book Now" : "Check Availability"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
