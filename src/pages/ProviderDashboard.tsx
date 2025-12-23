import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  DollarSign,
  CheckCircle,
  XCircle,
  Navigation,
  User,
  TrendingUp,
  Bell,
  Loader2,
  Wallet,
} from "lucide-react";
import { usePaystack } from "@/hooks/usePaystack";
import { ProviderEarnings } from "@/components/dashboard/ProviderEarnings";
import { PayoutSettings } from "@/components/dashboard/PayoutSettings";

// Mock jobs data
const mockJobs = [
  {
    id: "1",
    customer: {
      name: "John Smith",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      phone: "+1 555-0126",
    },
    service: "Deep Cleaning",
    date: "2024-12-10",
    time: "10:00 AM",
    duration: "3 hours",
    status: "pending",
    payment_status: "paid",
    address: "123 Main St, Apt 4B",
    price: 105,
    distance: "2.3 km",
    customer_completed: false,
    provider_completed: false,
  },
  {
    id: "2",
    customer: {
      name: "Emily Brown",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      phone: "+1 555-0127",
    },
    service: "Regular Cleaning",
    date: "2024-12-10",
    time: "2:00 PM",
    duration: "2 hours",
    status: "in-progress",
    payment_status: "paid",
    address: "456 Oak Ave",
    price: 70,
    distance: "1.5 km",
    customer_completed: true,
    provider_completed: false,
  },
  {
    id: "3",
    customer: {
      name: "Michael Davis",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      phone: "+1 555-0128",
    },
    service: "Move-out Cleaning",
    date: "2024-12-08",
    time: "9:00 AM",
    duration: "4 hours",
    status: "completed",
    payment_status: "released",
    address: "789 Pine Rd",
    price: 140,
    distance: "3.1 km",
    rating: 5,
    customer_completed: true,
    provider_completed: true,
  },
];

const weeklySchedule = [
  { day: "Monday", available: true, hours: "9:00 AM - 6:00 PM" },
  { day: "Tuesday", available: true, hours: "9:00 AM - 6:00 PM" },
  { day: "Wednesday", available: true, hours: "9:00 AM - 6:00 PM" },
  { day: "Thursday", available: true, hours: "9:00 AM - 6:00 PM" },
  { day: "Friday", available: true, hours: "9:00 AM - 4:00 PM" },
  { day: "Saturday", available: false, hours: "Off" },
  { day: "Sunday", available: false, hours: "Off" },
];

const paymentStatusColors = {
  pending: "secondary",
  paid: "info",
  released: "success",
  refunded: "destructive",
} as const;

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState("jobs");
  const [isAvailable, setIsAvailable] = useState(true);
  const [schedule, setSchedule] = useState(weeklySchedule);
  const [jobs, setJobs] = useState(mockJobs);
  const { markComplete, isLoading } = usePaystack();

  const pendingJobs = jobs.filter((j) => j.status === "pending");
  const inProgressJobs = jobs.filter((j) => j.status === "in-progress" || j.status === "accepted");
  const completedJobs = jobs.filter((j) => j.status === "completed");

  const toggleDayAvailability = (dayIndex: number) => {
    setSchedule((prev) =>
      prev.map((day, i) =>
        i === dayIndex ? { ...day, available: !day.available } : day
      )
    );
  };

  const handleMarkComplete = async (jobId: string) => {
    const result = await markComplete(jobId, "provider");
    if (result.success) {
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, provider_completed: true } : j
        )
      );
    }
  };

  // Mock earnings
  const weeklyEarnings = 420;
  const monthlyEarnings = 1680;
  const totalJobs = 24;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <div className="container px-4 py-8">
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Provider Dashboard</h1>
              <p className="text-muted-foreground">Manage your jobs and earnings</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="availability"
                  checked={isAvailable}
                  onCheckedChange={setIsAvailable}
                />
                <Label htmlFor="availability" className="font-medium">
                  {isAvailable ? (
                    <span className="text-success">Available for Jobs</span>
                  ) : (
                    <span className="text-muted-foreground">Unavailable</span>
                  )}
                </Label>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                  <Bell className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingJobs.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Requests</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-info/10">
                  <Calendar className="h-6 w-6 text-info" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inProgressJobs.length}</p>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                  <DollarSign className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">${weeklyEarnings}</p>
                  <p className="text-sm text-muted-foreground">This Week</p>
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
                  <p className="text-sm text-muted-foreground">Rating (156 reviews)</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="jobs" className="gap-2">
                <Calendar className="h-4 w-4" />
                Jobs
              </TabsTrigger>
              <TabsTrigger value="schedule" className="gap-2">
                <Clock className="h-4 w-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="earnings" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Earnings
              </TabsTrigger>
              <TabsTrigger value="payouts" className="gap-2">
                <Wallet className="h-4 w-4" />
                Payouts
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
            </TabsList>

            <TabsContent value="jobs" className="space-y-6">
              {/* Pending Job Requests */}
              {pendingJobs.length > 0 && (
                <div>
                  <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
                    <Bell className="h-5 w-5 text-warning" />
                    New Job Requests
                  </h2>
                  <div className="space-y-4">
                    {pendingJobs.map((job) => (
                      <Card key={job.id} className="border-warning/50 bg-warning/5">
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-4">
                              <img
                                src={job.customer.avatar}
                                alt={job.customer.name}
                                className="h-14 w-14 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-semibold">{job.customer.name}</p>
                                <p className="text-sm font-medium text-primary">
                                  {job.service}
                                </p>
                                <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {job.date}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {job.time} ({job.duration})
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {job.distance}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant={paymentStatusColors[job.payment_status as keyof typeof paymentStatusColors] || "secondary"}>
                                {job.payment_status === "paid" ? "Payment Held" : job.payment_status}
                              </Badge>
                              <p className="text-xl font-bold text-foreground">${job.price}</p>
                              <Button variant="outline" size="sm" className="gap-1">
                                <XCircle className="h-4 w-4" />
                                Decline
                              </Button>
                              <Button variant="success" size="sm" className="gap-1">
                                <CheckCircle className="h-4 w-4" />
                                Accept
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Active Jobs */}
              <div>
                <h2 className="mb-4 text-lg font-semibold">Active Jobs</h2>
                {inProgressJobs.length > 0 ? (
                  <div className="space-y-4">
                    {inProgressJobs.map((job) => (
                      <Card key={job.id} className="border-info/50 bg-info/5">
                        <CardContent className="p-4">
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex items-center gap-4">
                              <img
                                src={job.customer.avatar}
                                alt={job.customer.name}
                                className="h-14 w-14 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-semibold">{job.customer.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {job.service}
                                </p>
                                <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {job.time}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {job.address}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                              <Badge variant={paymentStatusColors[job.payment_status as keyof typeof paymentStatusColors] || "secondary"}>
                                {job.payment_status === "paid" ? "Payment Held" : job.payment_status}
                              </Badge>
                              {job.customer_completed && !job.provider_completed && (
                                <Badge variant="info">Customer marked complete</Badge>
                              )}
                              <p className="font-semibold">${job.price}</p>
                              <Button variant="outline" size="sm" className="gap-1">
                                <Navigation className="h-4 w-4" />
                                Navigate
                              </Button>
                              {job.provider_completed ? (
                                <Badge variant="success" className="gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  You marked complete
                                </Badge>
                              ) : (
                                <Button 
                                  variant="success" 
                                  size="sm"
                                  onClick={() => handleMarkComplete(job.id)}
                                  disabled={isLoading}
                                  className="gap-1"
                                >
                                  {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                  ) : (
                                    <CheckCircle className="h-4 w-4" />
                                  )}
                                  Mark Complete
                                </Button>
                              )}
                            </div>
                          </div>
                          {job.customer_completed && job.provider_completed && (
                            <div className="mt-4 pt-4 border-t border-border">
                              <Badge variant="success" className="gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Both parties confirmed - Payment will be released
                              </Badge>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                      <Calendar className="h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-4 font-semibold">No active jobs</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Check back for new job requests
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Completed Jobs */}
              <div>
                <h2 className="mb-4 text-lg font-semibold">Recent Completed</h2>
                <div className="space-y-4">
                  {completedJobs.map((job) => (
                    <Card key={job.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex items-center gap-4">
                            <img
                              src={job.customer.avatar}
                              alt={job.customer.name}
                              className="h-14 w-14 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-semibold">{job.customer.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {job.service}
                              </p>
                              <div className="mt-1 flex items-center gap-1 text-xs">
                                {job.rating && (
                                  <div className="flex items-center gap-0.5">
                                    {Array.from({ length: job.rating }).map((_, i) => (
                                      <Star
                                        key={i}
                                        className="h-3 w-3 fill-warning text-warning"
                                      />
                                    ))}
                                    <span className="ml-1 text-muted-foreground">
                                      Customer rating
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge variant="success">Completed</Badge>
                            <Badge variant={paymentStatusColors[job.payment_status as keyof typeof paymentStatusColors] || "secondary"}>
                              {job.payment_status}
                            </Badge>
                            <p className="font-semibold text-success">
                              +${Math.floor(job.price * 0.9)} <span className="text-xs text-muted-foreground">(90%)</span>
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Availability</CardTitle>
                  <CardDescription>
                    Set your working hours for each day of the week
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {schedule.map((day, index) => (
                      <div
                        key={day.day}
                        className="flex items-center justify-between rounded-lg border border-border p-4"
                      >
                        <div className="flex items-center gap-4">
                          <Switch
                            checked={day.available}
                            onCheckedChange={() => toggleDayAvailability(index)}
                          />
                          <span className="font-medium">{day.day}</span>
                        </div>
                        <span
                          className={
                            day.available
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }
                        >
                          {day.hours}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Button className="mt-6 w-full">Save Schedule</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings">
              <ProviderEarnings />
            </TabsContent>

            <TabsContent value="payouts">
              <PayoutSettings />
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Provider Profile</CardTitle>
                  <CardDescription>
                    Manage your public profile, skills, and certifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Profile management would go here. Update your bio, skills, photos,
                    and certifications to attract more customers.
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
