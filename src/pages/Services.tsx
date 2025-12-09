import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ProviderCard } from "@/components/providers/ProviderCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Search, SlidersHorizontal, MapPin, X } from "lucide-react";

// Mock providers data
const mockProviders = [
  {
    id: "1",
    name: "Maria Santos",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
    service: "Professional Cleaner",
    rating: 4.9,
    reviews: 156,
    price: 35,
    priceUnit: "hr",
    distance: "1.2 km",
    verified: true,
    available: true,
    skills: ["Deep Cleaning", "Organization", "Laundry"],
  },
  {
    id: "2",
    name: "James Wilson",
    avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=400&h=400&fit=crop",
    service: "Barber & Stylist",
    rating: 4.8,
    reviews: 203,
    price: 45,
    priceUnit: "session",
    distance: "2.5 km",
    verified: true,
    available: true,
    skills: ["Haircuts", "Beard Trim", "Hair Coloring"],
  },
  {
    id: "3",
    name: "Lisa Chen",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    service: "Personal Chef",
    rating: 5.0,
    reviews: 89,
    price: 85,
    priceUnit: "meal",
    distance: "3.1 km",
    verified: true,
    available: false,
    skills: ["Asian Cuisine", "Vegan", "Meal Prep"],
  },
  {
    id: "4",
    name: "Marcus Thompson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    service: "Handyman",
    rating: 4.7,
    reviews: 312,
    price: 50,
    priceUnit: "hr",
    distance: "0.8 km",
    verified: true,
    available: true,
    skills: ["Plumbing", "Electrical", "Assembly"],
  },
  {
    id: "5",
    name: "Sofia Rodriguez",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    service: "Digital Marketer",
    rating: 4.9,
    reviews: 67,
    price: 75,
    priceUnit: "hr",
    distance: "5.2 km",
    verified: true,
    available: true,
    skills: ["Social Media", "SEO", "Content"],
  },
  {
    id: "6",
    name: "David Kim",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    service: "Laundry Specialist",
    rating: 4.6,
    reviews: 145,
    price: 25,
    priceUnit: "load",
    distance: "1.9 km",
    verified: true,
    available: true,
    skills: ["Wash & Fold", "Dry Cleaning", "Ironing"],
  },
];

const categories = [
  { value: "all", label: "All Services" },
  { value: "cleaning", label: "Cleaning" },
  { value: "barber", label: "Barber" },
  { value: "cooking", label: "Cooking" },
  { value: "laundry", label: "Laundry" },
  { value: "marketing", label: "Marketing" },
  { value: "handyman", label: "Handyman" },
];

export default function Services() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "all");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState("rating");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableOnly, setAvailableOnly] = useState(false);

  const filteredProviders = mockProviders.filter((provider) => {
    if (verifiedOnly && !provider.verified) return false;
    if (availableOnly && !provider.available) return false;
    if (provider.price < priceRange[0] || provider.price > priceRange[1]) return false;
    if (search && !provider.name.toLowerCase().includes(search.toLowerCase()) && 
        !provider.service.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const sortedProviders = [...filteredProviders].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "reviews") return b.reviews - a.reviews;
    return 0;
  });

  const handleBook = (id: string) => {
    navigate(`/booking/${id}`);
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("all");
    setPriceRange([0, 200]);
    setVerifiedOnly(false);
    setAvailableOnly(false);
  };

  const activeFiltersCount = [
    category !== "all",
    priceRange[0] > 0 || priceRange[1] < 200,
    verifiedOnly,
    availableOnly,
  ].filter(Boolean).length;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Header */}
        <section className="border-b border-border bg-muted/30 py-8">
          <div className="container px-4">
            <h1 className="text-3xl font-bold text-foreground">Find Service Providers</h1>
            <p className="mt-2 text-muted-foreground">
              Browse our verified professionals and book instantly
            </p>

            {/* Search & Filters */}
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name or service..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="gap-2 sm:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge variant="default" className="ml-1">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[80vh]">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>
                      Narrow down your search results
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <Label>Price Range (${priceRange[0]} - ${priceRange[1]})</Label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        max={200}
                        step={10}
                        className="mt-3"
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={verifiedOnly}
                          onChange={(e) => setVerifiedOnly(e.target.checked)}
                          className="h-4 w-4 rounded border-border"
                        />
                        <span className="text-sm">Verified providers only</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={availableOnly}
                          onChange={(e) => setAvailableOnly(e.target.checked)}
                          className="h-4 w-4 rounded border-border"
                        />
                        <span className="text-sm">Available now</span>
                      </label>
                    </div>
                    <Button onClick={clearFilters} variant="outline" className="w-full">
                      Clear All Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {category !== "all" && (
                  <Badge variant="secondary" className="gap-1">
                    {categories.find((c) => c.value === category)?.label}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setCategory("all")}
                    />
                  </Badge>
                )}
                {verifiedOnly && (
                  <Badge variant="secondary" className="gap-1">
                    Verified Only
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setVerifiedOnly(false)}
                    />
                  </Badge>
                )}
                {availableOnly && (
                  <Badge variant="secondary" className="gap-1">
                    Available Now
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => setAvailableOnly(false)}
                    />
                  </Badge>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="text-muted-foreground"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Results */}
        <section className="py-8">
          <div className="container px-4">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {sortedProviders.length} providers found
              </p>
              <div className="hidden items-center gap-3 sm:flex">
                <Label className="text-sm">Price Range:</Label>
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={200}
                  step={10}
                  className="w-48"
                />
                <span className="text-sm text-muted-foreground">
                  ${priceRange[0]} - ${priceRange[1]}
                </span>
              </div>
            </div>

            {sortedProviders.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {sortedProviders.map((provider, index) => (
                  <div
                    key={provider.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProviderCard provider={provider} onBook={handleBook} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <MapPin className="h-12 w-12 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">
                  No providers found
                </h3>
                <p className="mt-2 text-muted-foreground">
                  Try adjusting your filters or search terms
                </p>
                <Button onClick={clearFilters} variant="outline" className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
