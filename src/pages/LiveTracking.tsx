import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LocationTrackingMap } from "@/components/tracking/LocationTrackingMap";
import {
  ArrowLeft,
  Clock,
  Calendar,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

// Mock data - in production this would come from Supabase realtime
const mockBooking = {
  id: "booking-123",
  service: "Deep Cleaning",
  date: "December 10, 2024",
  time: "10:00 AM",
  duration: "3 hours",
  status: "in_progress",
  address: "123 Main Street, Lagos, Nigeria",
};

const mockProvider = {
  id: "provider-1",
  name: "Sarah Johnson",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  phone: "+234 801 234 5678",
  role: "provider" as const,
  location: { lat: 6.5244, lng: 3.3792 }, // Lagos coordinates
  heading: 45,
};

const mockCustomer = {
  id: "customer-1",
  name: "John Smith",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
  phone: "+234 802 345 6789",
  role: "customer" as const,
  location: { lat: 6.5344, lng: 3.3892 },
};

export default function LiveTracking() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [userRole] = useState<"provider" | "customer">("customer"); // Would come from auth
  const [provider, setProvider] = useState(mockProvider);
  const [customer] = useState(mockCustomer);
  const [isSimulating, setIsSimulating] = useState(false);

  // Simulate provider movement for demo
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setProvider((prev) => ({
        ...prev,
        location: {
          lat: prev.location.lat + (Math.random() - 0.5) * 0.001,
          lng: prev.location.lng + (Math.random() - 0.5) * 0.001,
        },
        heading: prev.heading ? prev.heading + (Math.random() - 0.5) * 20 : 0,
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, [isSimulating]);

  const handleCall = () => {
    const phoneNumber = userRole === "customer" ? provider.phone : customer.phone;
    window.open(`tel:${phoneNumber}`);
  };

  const handleMessage = () => {
    // Would navigate to in-app chat
    toast.info("Opening chat...");
  };

  const toggleSimulation = () => {
    setIsSimulating(!isSimulating);
    toast.success(isSimulating ? "Simulation stopped" : "Simulating provider movement");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <div className="container max-w-4xl px-4 py-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">Live Tracking</h1>
                <p className="text-sm text-muted-foreground">
                  Booking #{bookingId || "123"}
                </p>
              </div>
            </div>
            <Badge variant="info" className="gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              In Progress
            </Badge>
          </div>

          {/* Booking Summary */}
          <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{mockBooking.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{mockBooking.time}</span>
            </div>
            <Badge variant="secondary">{mockBooking.service}</Badge>
          </div>

          {/* Map */}
          <LocationTrackingMap
            bookingId={bookingId || "123"}
            userRole={userRole}
            provider={provider}
            customer={customer}
            destination={customer.location}
            onCall={handleCall}
            onMessage={handleMessage}
          />

          {/* Demo Controls */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Button
              variant={isSimulating ? "destructive" : "outline"}
              onClick={toggleSimulation}
            >
              {isSimulating ? "Stop Simulation" : "Start Movement Simulation"}
            </Button>
            <Button
              variant="success"
              className="gap-2"
              onClick={() => toast.success("Service marked as complete")}
            >
              <CheckCircle className="h-4 w-4" />
              Mark as Arrived
            </Button>
          </div>

          {/* Instructions */}
          <div className="mt-8 rounded-lg border border-dashed border-border bg-muted/30 p-4 text-center">
            <p className="text-sm text-muted-foreground">
              {/* TODO: Replace MAPBOX_PUBLIC_TOKEN with your actual token */}
              <strong>Note:</strong> To enable the live map, add your Mapbox public token in{" "}
              <code className="rounded bg-muted px-1 py-0.5 text-xs">
                src/components/tracking/LocationTrackingMap.tsx
              </code>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Get your free token at{" "}
              <a
                href="https://account.mapbox.com/access-tokens/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
