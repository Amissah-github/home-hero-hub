import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  MessageSquare,
  Phone,
  AlertTriangle,
  CheckCircle,
  Search,
  User,
  Settings,
  CreditCard,
  Loader2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { usePaystack } from "@/hooks/usePaystack";
import { toast } from "sonner";

// Mock bookings data (will be replaced with real data when auth is connected)
const mockBookings = [
  {
    id: "1",
    provider: {
      name: "Maria Santos",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop",
      service: "Home Cleaning",
      phone: "+1 555-0123",
    },
    date: "2024-12-10",
    time: "10:00 AM",
    duration: "3 hours",
    status: "upcoming",
    payment_status: "paid",
    address: "123 Main St, Apt 4B",
    price: 105,
    customer_completed: false,
    provider_completed: false,
  },
  {
    id: "2",
    provider: {
      name: "James Wilson",
      avatar: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop",
      service: "Barber Service",
      phone: "+1 555-0124",
    },
    date: "2024-12-08",
    time: "2:00 PM",
    duration: "1 hour",
    status: "in-progress",
    payment_status: "paid",
    address: "456 Oak Ave",
    price: 45,
    customer_completed: false,
    provider_completed: true,
  },
  {
    id: "3",
    provider: {
      name: "Lisa Chen",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop",
      service: "Personal Chef",
      phone: "+1 555-0125",
    },
    date: "2024-12-05",
    time: "6:00 PM",
    duration: "2 hours",
    status: "completed",
    payment_status: "released",
    address: "789 Pine Rd",
    price: 170,
    rating: 5,
    customer_completed: true,
    provider_completed: true,
  },
];

const statusColors = {
  upcoming: "info",
  "in-progress": "warning",
  completed: "success",
  cancelled: "destructive",
} as const;

const paymentStatusColors = {
  pending: "secondary",
  paid: "info",
  released: "success",
  refunded: "destructive",
} as const;

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState(mockBookings);
  const [searchParams] = useSearchParams();
  const { markComplete, verifyPayment, isLoading } = usePaystack();

  // Check for payment callback
  useEffect(() => {
    const paymentStatus = searchParams.get("payment");
    const reference = searchParams.get("reference");

    if (paymentStatus === "success" && reference) {
      verifyPayment(reference).then((result) => {
        if (result.success) {
          toast.success("Payment confirmed! Your booking is now confirmed.");
        }
      });
    }
  }, [searchParams]);

  const upcomingBookings = bookings.filter((b) => b.status === "upcoming");
  const inProgressBookings = bookings.filter((b) => b.status === "in-progress");
  const pastBookings = bookings.filter((b) => b.status === "completed");

  const handleMarkComplete = async (bookingId: string) => {
    const result = await markComplete(bookingId, "customer");
    if (result.success) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === bookingId ? { ...b, customer_completed: true } : b
        )
      );
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <div className="container px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Welcome back, John!</h1>
              <p className="text-muted-foreground">Manage your bookings and profile</p>
            </div>
            <Button asChild variant="hero">
              <Link to="/services" className="gap-2">
                <Search className="h-4 w-4" />
                Book a Service
              </Link>
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-info/10">
                  <Calendar className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{upcomingBookings.length}</p>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inProgressBookings.length}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pastBookings.length}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">4.9</p>
                  <p className="text-sm text-muted-foreground">Avg Rating Given</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="bookings" className="gap-2">
                <Calendar className="h-4 w-4" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="payments" className="gap-2">
                <CreditCard className="h-4 w-4" />
                Payments
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bookings" className="space-y-6">
              {/* In Progress */}
              {inProgressBookings.length > 0 && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold">In Progress</h2>
                  <div className="space-y-4">
                    {inProgressBookings.map((booking) => (
                      <Card key={booking.id} className="border-warning/50 bg-warning/5">
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                              <img
                                src={booking.provider.avatar}
                                alt={booking.provider.name}
                                className="h-14 w-14 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-semibold">{booking.provider.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {booking.provider.service}
                                </p>
                                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                                  <MapPin className="h-3 w-3" />
                                  {booking.address}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              <Badge variant="warning">Live Tracking</Badge>
                              {booking.provider_completed && !booking.customer_completed && (
                                <Badge variant="info">Provider marked complete</Badge>
                              )}
                              <Button variant="outline" size="sm" className="gap-1">
                                <Phone className="h-3 w-3" />
                                Call
                              </Button>
                              <Button variant="outline" size="sm" className="gap-1">
                                <MessageSquare className="h-3 w-3" />
                                Chat
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="gap-1"
                              >
                                <AlertTriangle className="h-3 w-3" />
                                Report Issue
                              </Button>
                            </div>
                          </div>
                          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">
                                Started at {booking.time}
                              </span>
                              <Badge variant={paymentStatusColors[booking.payment_status as keyof typeof paymentStatusColors] || "secondary"}>
                                Payment: {booking.payment_status}
                              </Badge>
                            </div>
                            {booking.customer_completed ? (
                              <Badge variant="success" className="gap-1">
                                <CheckCircle className="h-3 w-3" />
                                You marked complete
                              </Badge>
                            ) : (
                              <Button 
                                variant="success" 
                                size="sm"
                                onClick={() => handleMarkComplete(booking.id)}
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                )}
                                Mark as Completed
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Upcoming */}
              <div>
                <h2 className="mb-4 text-lg font-semibold">Upcoming Bookings</h2>
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <Card key={booking.id}>
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                              <img
                                src={booking.provider.avatar}
                                alt={booking.provider.name}
                                className="h-14 w-14 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-semibold">{booking.provider.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {booking.provider.service}
                                </p>
                                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {booking.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {booking.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="info">Upcoming</Badge>
                              <Badge variant={paymentStatusColors[booking.payment_status as keyof typeof paymentStatusColors] || "secondary"}>
                                {booking.payment_status === "paid" ? "Paid" : "Pending"}
                              </Badge>
                              <p className="font-semibold">${booking.price}</p>
                              <Button variant="outline" size="sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-4 font-semibold">No upcoming bookings</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Browse our services to book your next appointment
                      </p>
                      <Button asChild className="mt-4">
                        <Link to="/services">Browse Services</Link>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Past Bookings */}
              <div>
                <h2 className="mb-4 text-lg font-semibold">Past Bookings</h2>
                <div className="space-y-4">
                  {pastBookings.map((booking) => (
                    <Card key={booking.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={booking.provider.avatar}
                              alt={booking.provider.name}
                              className="h-14 w-14 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold">{booking.provider.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {booking.provider.service}
                              </p>
                              <div className="mt-1 flex items-center gap-1 text-xs">
                                {booking.rating && (
                                  <div className="flex items-center gap-0.5">
                                    {Array.from({ length: booking.rating }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className="h-3 w-3 fill-warning text-warning"
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="success">Completed</Badge>
                            <Badge variant={paymentStatusColors[booking.payment_status as keyof typeof paymentStatusColors] || "secondary"}>
                              {booking.payment_status}
                            </Badge>
                            <p className="font-semibold">${booking.price}</p>
                            <Button variant="outline" size="sm">
                              Book Again
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your personal information and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Profile settings would go here. Connect to a backend to enable profile management.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>
                    View your payment history and transaction details
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {bookings.filter(b => b.payment_status !== "pending").map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between border-b border-border pb-4">
                        <div>
                          <p className="font-medium">{booking.provider.service}</p>
                          <p className="text-sm text-muted-foreground">{booking.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">${booking.price}</p>
                          <Badge variant={paymentStatusColors[booking.payment_status as keyof typeof paymentStatusColors] || "secondary"}>
                            {booking.payment_status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage notifications, privacy, and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Account settings would go here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
