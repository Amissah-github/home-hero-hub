import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Navigation,
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  Loader2,
  AlertCircle,
  Car,
  User,
} from "lucide-react";

// TODO: Add your Mapbox public token here
// Get it from: https://account.mapbox.com/access-tokens/
// Then add MAPBOX_PUBLIC_TOKEN to your backend secrets for production use
const MAPBOX_TOKEN = "YOUR_MAPBOX_PUBLIC_TOKEN_HERE"; // Replace with your token

interface Location {
  lat: number;
  lng: number;
}

interface TrackingParty {
  id: string;
  name: string;
  avatar?: string;
  phone?: string;
  role: "provider" | "customer";
  location: Location;
  heading?: number;
}

interface LocationTrackingMapProps {
  bookingId: string;
  userRole: "provider" | "customer";
  provider: TrackingParty;
  customer: TrackingParty;
  destination?: Location;
  onCall?: () => void;
  onMessage?: () => void;
}

export function LocationTrackingMap({
  bookingId,
  userRole,
  provider,
  customer,
  destination,
  onCall,
  onMessage,
}: LocationTrackingMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const providerMarker = useRef<any>(null);
  const customerMarker = useRef<any>(null);
  const destinationMarker = useRef<any>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [eta, setEta] = useState<string>("Calculating...");
  const [distance, setDistance] = useState<string>("...");

  const otherParty = userRole === "provider" ? customer : provider;
  const currentUser = userRole === "provider" ? provider : customer;

  useEffect(() => {
    if (!mapContainer.current) return;
    
    // Check if token is set
    if (MAPBOX_TOKEN === "YOUR_MAPBOX_PUBLIC_TOKEN_HERE") {
      setError("Mapbox token not configured. Add your token to enable the map.");
      setIsLoading(false);
      return;
    }

    const initMap = async () => {
      try {
        const mapboxgl = await import("mapbox-gl");
        await import("mapbox-gl/dist/mapbox-gl.css");
        
        mapboxgl.default.accessToken = MAPBOX_TOKEN;

        // Center on midpoint between provider and customer
        const centerLat = (provider.location.lat + customer.location.lat) / 2;
        const centerLng = (provider.location.lng + customer.location.lng) / 2;

        map.current = new mapboxgl.default.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/dark-v11", // Bolt-like dark theme
          center: [centerLng, centerLat],
          zoom: 14,
          pitch: 45,
        });

        map.current.addControl(
          new mapboxgl.default.NavigationControl(),
          "bottom-right"
        );

        map.current.on("load", () => {
          // Add provider marker (car icon for provider)
          const providerEl = createMarkerElement("provider", provider.heading);
          providerMarker.current = new mapboxgl.default.Marker({
            element: providerEl,
            anchor: "center",
          })
            .setLngLat([provider.location.lng, provider.location.lat])
            .addTo(map.current);

          // Add customer marker
          const customerEl = createMarkerElement("customer");
          customerMarker.current = new mapboxgl.default.Marker({
            element: customerEl,
            anchor: "center",
          })
            .setLngLat([customer.location.lng, customer.location.lat])
            .addTo(map.current);

          // Add destination marker if provided
          if (destination) {
            const destEl = createDestinationMarker();
            destinationMarker.current = new mapboxgl.default.Marker({
              element: destEl,
              anchor: "bottom",
            })
              .setLngLat([destination.lng, destination.lat])
              .addTo(map.current);
          }

          // Fit bounds to show all markers
          const bounds = new mapboxgl.default.LngLatBounds();
          bounds.extend([provider.location.lng, provider.location.lat]);
          bounds.extend([customer.location.lng, customer.location.lat]);
          if (destination) {
            bounds.extend([destination.lng, destination.lat]);
          }
          
          map.current.fitBounds(bounds, {
            padding: { top: 100, bottom: 200, left: 50, right: 50 },
            maxZoom: 16,
          });

          // Draw route line
          drawRoute(provider.location, destination || customer.location);
          
          setIsLoading(false);
        });

        // Calculate ETA
        calculateETA(provider.location, destination || customer.location);

      } catch (err) {
        console.error("Error initializing map:", err);
        setError("Failed to load map. Please check your connection.");
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (providerMarker.current) {
      providerMarker.current.setLngLat([provider.location.lng, provider.location.lat]);
    }
    if (customerMarker.current) {
      customerMarker.current.setLngLat([customer.location.lng, customer.location.lat]);
    }
  }, [provider.location, customer.location]);

  const createMarkerElement = (role: "provider" | "customer", heading?: number) => {
    const el = document.createElement("div");
    el.className = "relative";
    
    if (role === "provider") {
      el.innerHTML = `
        <div class="relative">
          <div class="absolute -inset-4 rounded-full bg-primary/20 animate-ping"></div>
          <div class="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary shadow-lg shadow-primary/30 border-2 border-primary-foreground" style="transform: rotate(${heading || 0}deg)">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L17 10l-2-4H9L7 10l-3.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/>
              <circle cx="7" cy="17" r="2"/>
              <circle cx="17" cy="17" r="2"/>
            </svg>
          </div>
        </div>
      `;
    } else {
      el.innerHTML = `
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-accent shadow-lg shadow-accent/30 border-2 border-accent-foreground">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
      `;
    }
    return el;
  };

  const createDestinationMarker = () => {
    const el = document.createElement("div");
    el.innerHTML = `
      <div class="flex flex-col items-center">
        <div class="flex h-8 w-8 items-center justify-center rounded-full bg-success shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        <div class="h-4 w-0.5 bg-success"></div>
      </div>
    `;
    return el;
  };

  const drawRoute = async (start: Location, end: Location) => {
    if (!map.current) return;

    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();

      if (data.routes && data.routes[0]) {
        const route = data.routes[0];
        
        // Update distance
        const distanceKm = (route.distance / 1000).toFixed(1);
        setDistance(`${distanceKm} km`);

        // Add route to map
        if (map.current.getSource("route")) {
          (map.current.getSource("route") as any).setData({
            type: "Feature",
            properties: {},
            geometry: route.geometry,
          });
        } else {
          map.current.addLayer({
            id: "route",
            type: "line",
            source: {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: route.geometry,
              },
            },
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "hsl(168, 76%, 45%)",
              "line-width": 5,
              "line-opacity": 0.8,
            },
          });
        }
      }
    } catch (err) {
      console.error("Error fetching route:", err);
    }
  };

  const calculateETA = async (start: Location, end: Location) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${start.lng},${start.lat};${end.lng},${end.lat}?access_token=${MAPBOX_TOKEN}`
      );
      const data = await response.json();

      if (data.routes && data.routes[0]) {
        const durationMinutes = Math.ceil(data.routes[0].duration / 60);
        setEta(`${durationMinutes} min`);
      }
    } catch (err) {
      console.error("Error calculating ETA:", err);
      setEta("N/A");
    }
  };

  if (error) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="h-12 w-12 text-warning mb-4" />
          <h3 className="font-semibold text-lg mb-2">Map Unavailable</h3>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <p className="text-xs text-muted-foreground">
            {/* TODO: Add MAPBOX_PUBLIC_TOKEN to your secrets to enable live tracking */}
            To enable live location tracking, add your Mapbox public token.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      {/* Map Container */}
      <div className="relative h-[400px] w-full">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <div ref={mapContainer} className="h-full w-full" />

        {/* ETA Overlay - Bolt Style */}
        <div className="absolute left-4 top-4 z-10">
          <div className="rounded-xl bg-background/95 backdrop-blur-sm p-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary">
                <Clock className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{eta}</p>
                <p className="text-xs text-muted-foreground">{distance} away</p>
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute right-4 top-4 z-10 space-y-2">
          <div className="flex items-center gap-2 rounded-lg bg-background/95 backdrop-blur-sm px-3 py-2 shadow-lg">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
              <Car className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-xs font-medium">Provider</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-background/95 backdrop-blur-sm px-3 py-2 shadow-lg">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent">
              <User className="h-3 w-3 text-accent-foreground" />
            </div>
            <span className="text-xs font-medium">Customer</span>
          </div>
        </div>
      </div>

      {/* Bottom Panel - Bolt Style */}
      <CardContent className="p-0">
        <div className="border-t border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary">
                <AvatarImage src={otherParty.avatar} alt={otherParty.name} />
                <AvatarFallback>
                  {otherParty.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{otherParty.name}</p>
                  <Badge variant="secondary" className="text-xs">
                    {otherParty.role === "provider" ? "Provider" : "Customer"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {userRole === "customer" ? "On the way to you" : "Waiting at location"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-12 w-12"
                onClick={onMessage}
              >
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button
                variant="default"
                size="icon"
                className="rounded-full h-12 w-12 bg-success hover:bg-success/90"
                onClick={onCall}
              >
                <Phone className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Address */}
          <div className="mt-4 flex items-start gap-3 rounded-lg bg-muted/50 p-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <p className="text-sm font-medium">Service Location</p>
              <p className="text-sm text-muted-foreground">
                123 Main Street, Lagos, Nigeria
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
