import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Briefcase,
  DollarSign,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Shield,
  AlertTriangle,
  Calendar,
  BarChart3,
} from "lucide-react";

// Mock data
const pendingProviders = [
  {
    id: "1",
    name: "Alex Martinez",
    email: "alex@example.com",
    service: "Home Cleaning",
    submittedAt: "2024-12-05",
    documents: ["ID", "Certification", "Background Check"],
    status: "pending",
  },
  {
    id: "2",
    name: "Sarah Lee",
    email: "sarah@example.com",
    service: "Personal Chef",
    submittedAt: "2024-12-04",
    documents: ["ID", "Food Safety Cert"],
    status: "pending",
  },
];

const recentBookings = [
  {
    id: "1",
    customer: "John Smith",
    provider: "Maria Santos",
    service: "Home Cleaning",
    date: "2024-12-10",
    amount: 105,
    status: "confirmed",
  },
  {
    id: "2",
    customer: "Emily Brown",
    provider: "James Wilson",
    service: "Barber Service",
    date: "2024-12-10",
    amount: 45,
    status: "in-progress",
  },
  {
    id: "3",
    customer: "Michael Davis",
    provider: "Lisa Chen",
    service: "Personal Chef",
    date: "2024-12-08",
    amount: 170,
    status: "completed",
  },
];

const reportedIssues = [
  {
    id: "1",
    reporter: "John Smith",
    against: "Provider X",
    type: "Suspicious Behavior",
    date: "2024-12-08",
    status: "open",
  },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");

  // Mock stats
  const stats = {
    totalUsers: 2450,
    totalProviders: 892,
    activeBookings: 156,
    revenue: 45600,
    pendingApprovals: pendingProviders.length,
    openIssues: reportedIssues.length,
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 bg-muted/30">
        <div className="container px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage providers, users, and platform operations
            </p>
          </div>

          {/* Quick Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total Users</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-info/10">
                  <Briefcase className="h-5 w-5 text-info" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stats.totalProviders}</p>
                  <p className="text-xs text-muted-foreground">Providers</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                  <Calendar className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stats.activeBookings}</p>
                  <p className="text-xs text-muted-foreground">Active Bookings</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-xl font-bold">${stats.revenue.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Revenue (MTD)</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
                  <Shield className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stats.pendingApprovals}</p>
                  <p className="text-xs text-muted-foreground">Pending Approvals</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-3 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-xl font-bold">{stats.openIssues}</p>
                  <p className="text-xs text-muted-foreground">Open Issues</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="approvals" className="gap-2">
                <Shield className="h-4 w-4" />
                Provider Approvals
                {stats.pendingApprovals > 0 && (
                  <Badge variant="warning" className="ml-1">
                    {stats.pendingApprovals}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="bookings" className="gap-2">
                <Calendar className="h-4 w-4" />
                Bookings
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="issues" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Issues
                {stats.openIssues > 0 && (
                  <Badge variant="destructive" className="ml-1">
                    {stats.openIssues}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Overview</CardTitle>
                    <CardDescription>Monthly revenue trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-64 items-center justify-center rounded-lg bg-muted/50">
                      <p className="text-muted-foreground">
                        Chart would go here (connect to analytics)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Booking Trends</CardTitle>
                    <CardDescription>Daily booking volume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex h-64 items-center justify-center rounded-lg bg-muted/50">
                      <p className="text-muted-foreground">
                        Chart would go here (connect to analytics)
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Customer</TableHead>
                          <TableHead>Provider</TableHead>
                          <TableHead>Service</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentBookings.map((booking) => (
                          <TableRow key={booking.id}>
                            <TableCell className="font-medium">
                              {booking.customer}
                            </TableCell>
                            <TableCell>{booking.provider}</TableCell>
                            <TableCell>{booking.service}</TableCell>
                            <TableCell>{booking.date}</TableCell>
                            <TableCell>${booking.amount}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  booking.status === "completed"
                                    ? "success"
                                    : booking.status === "in-progress"
                                    ? "warning"
                                    : "info"
                                }
                              >
                                {booking.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="approvals">
              <Card>
                <CardHeader>
                  <CardTitle>Provider Approval Queue</CardTitle>
                  <CardDescription>
                    Review and approve new provider applications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {pendingProviders.length > 0 ? (
                    <div className="space-y-4">
                      {pendingProviders.map((provider) => (
                        <div
                          key={provider.id}
                          className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-semibold">{provider.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {provider.email}
                            </p>
                            <p className="mt-1 text-sm">
                              <span className="font-medium">Service:</span>{" "}
                              {provider.service}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {provider.documents.map((doc) => (
                                <Badge key={doc} variant="secondary">
                                  {doc}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="gap-1">
                              <Eye className="h-4 w-4" />
                              Review
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1 text-destructive"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                            <Button variant="success" size="sm" className="gap-1">
                              <CheckCircle className="h-4 w-4" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <CheckCircle className="h-12 w-12 text-success" />
                      <h3 className="mt-4 font-semibold">All caught up!</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        No pending provider applications
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bookings">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Booking Management</CardTitle>
                    <CardDescription>
                      Monitor and manage all platform bookings
                    </CardDescription>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search bookings..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Provider</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {recentBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-mono text-xs">
                            #{booking.id}
                          </TableCell>
                          <TableCell>{booking.customer}</TableCell>
                          <TableCell>{booking.provider}</TableCell>
                          <TableCell>{booking.service}</TableCell>
                          <TableCell>{booking.date}</TableCell>
                          <TableCell>${booking.amount}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                booking.status === "completed"
                                  ? "success"
                                  : booking.status === "in-progress"
                                  ? "warning"
                                  : "info"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage all platform users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    User management interface would go here. Connect to a backend
                    to enable full user management capabilities.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="issues">
              <Card>
                <CardHeader>
                  <CardTitle>Reported Issues</CardTitle>
                  <CardDescription>
                    Handle customer complaints and safety reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {reportedIssues.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Reporter</TableHead>
                          <TableHead>Against</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reportedIssues.map((issue) => (
                          <TableRow key={issue.id}>
                            <TableCell>{issue.reporter}</TableCell>
                            <TableCell>{issue.against}</TableCell>
                            <TableCell>{issue.type}</TableCell>
                            <TableCell>{issue.date}</TableCell>
                            <TableCell>
                              <Badge variant="warning">{issue.status}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm">
                                  Investigate
                                </Button>
                                <Button variant="ghost" size="sm">
                                  Dismiss
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <CheckCircle className="h-12 w-12 text-success" />
                      <h3 className="mt-4 font-semibold">No open issues</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        All reported issues have been resolved
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
