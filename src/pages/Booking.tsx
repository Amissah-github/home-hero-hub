import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, MapPin, Shield, Clock, ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

// Mock provider data (would come from API in real app)
const mockProviders: Record<string, {
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
  bio: string;
}> = {
  "1": {
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
    bio: "Professional cleaner with 5+ years of experience. Specializing in deep cleaning and organization.",
  },
  "2": {
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
    bio: "Master barber with expertise in modern and classic styles. Making clients look their best.",
  },
  "3": {
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
    bio: "Culinary artist specializing in Asian fusion and healthy meal prep.",
  },
  "4": {
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
    bio: "All-around handyman for plumbing, electrical, and home repairs.",
  },
  "5": {
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
    bio: "Digital marketing expert helping businesses grow their online presence.",
  },
  "6": {
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
    bio: "Expert laundry services including wash, fold, dry cleaning, and ironing.",
  },
};

const timeSlots = [
  "08:00", "09:00", "10:00", "11:00", "12:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

export default function Booking() {
  const { providerId } = useParams();
  const navigate = useNavigate();
  const provider = providerId ? mockProviders[providerId] : null;

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("1");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (!provider) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold">Provider not found</h1>
            <Button asChild className="mt-4">
              <Link to="/services">Browse Services</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const totalAmount = provider.price * parseInt(duration);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !address) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    // Simulate booking submission
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Booking request sent! The provider will confirm shortly.");
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 py-8">
        <div className="container px-4">
          <Button
            variant="ghost"
            className="mb-6 gap-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Provider Info */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <img
                      src={provider.avatar}
                      alt={provider.name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                    <div>
                      <h2 className="font-semibold text-foreground">{provider.name}</h2>
                      <p className="text-sm text-muted-foreground">{provider.service}</p>
                      {provider.verified && (
                        <Badge variant="verified" className="mt-1 gap-1">
                          <Shield className="h-3 w-3" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" />
                      <span className="font-medium">{provider.rating}</span>
                      <span className="text-muted-foreground">({provider.reviews} reviews)</span>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {provider.distance} away
                  </div>

                  <Separator className="my-4" />

                  <p className="text-sm text-muted-foreground">{provider.bio}</p>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Rate</span>
                    <span className="text-lg font-bold text-foreground">
                      ${provider.price}
                      <span className="text-sm font-normal text-muted-foreground">
                        /{provider.priceUnit}
                      </span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Book {provider.name}</CardTitle>
                  <CardDescription>
                    Select your preferred date, time, and provide service details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Date Selection */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Select Date *
                      </Label>
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) => date < new Date()}
                        className="rounded-md border"
                      />
                    </div>

                    {/* Time Selection */}
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Select Time *
                      </Label>
                      <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                        {timeSlots.map((slot) => (
                          <Button
                            key={slot}
                            type="button"
                            variant={time === slot ? "default" : "outline"}
                            size="sm"
                            onClick={() => setTime(slot)}
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Duration */}
                    <div className="space-y-2">
                      <Label htmlFor="duration">Duration (hours)</Label>
                      <Select value={duration} onValueChange={setDuration}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((h) => (
                            <SelectItem key={h} value={h.toString()}>
                              {h} hour{h > 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Address */}
                    <div className="space-y-2">
                      <Label htmlFor="address">Service Address *</Label>
                      <Input
                        id="address"
                        placeholder="Enter your full address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special instructions or requirements..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <Separator />

                    {/* Order Summary */}
                    <div className="rounded-lg bg-muted/50 p-4">
                      <h3 className="font-semibold">Order Summary</h3>
                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Service</span>
                          <span>{provider.service}</span>
                        </div>
                        {date && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Date</span>
                            <span>{format(date, "PPP")}</span>
                          </div>
                        )}
                        {time && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Time</span>
                            <span>{time}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Duration</span>
                          <span>{duration} hour{parseInt(duration) > 1 ? "s" : ""}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Rate (${provider.price}/{provider.priceUnit})
                          </span>
                          <span>× {duration}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between font-semibold text-base">
                          <span>Total</span>
                          <span>${totalAmount}</span>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      size="lg"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : `Confirm Booking - $${totalAmount}`}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
