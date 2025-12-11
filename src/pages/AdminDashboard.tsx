import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Briefcase,
  DollarSign,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Shield,
  AlertTriangle,
  Calendar,
  BarChart3,
  Loader2,
  ScanFace,
  RefreshCw,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { RefundManager } from "@/components/admin/RefundManager";

interface PendingProvider {
  id: string;
  user_id: string;
  bio: string | null;
  hourly_rate: number;
  years_experience: number | null;
  id_document_url: string | null;
  selfie_url: string | null;
  verification_status: string | null;
  created_at: string;
  category_id: string;
  profile: {
    full_name: string | null;
    email: string;
    phone: string | null;
    city: string | null;
  } | null;
  category: {
    name: string;
  } | null;
}

interface VerificationResult {
  match: boolean;
  confidence: string;
  reason: string;
  idFaceDetected: boolean;
  selfieFaceDetected: boolean;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [pendingProviders, setPendingProviders] = useState<PendingProvider[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<PendingProvider | null>(null);
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Stats
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    activeBookings: 0,
    revenue: 0,
    pendingApprovals: 0,
    openIssues: 0,
  });

  useEffect(() => {
    fetchPendingProviders();
    fetchStats();
  }, []);

  const fetchPendingProviders = async () => {
    try {
      // First get pending providers
      const { data: providersData, error: providersError } = await supabase
        .from("providers")
        .select(`
          *,
          category:service_categories(name)
        `)
        .in("verification_status", ["pending", "under_review"])
        .order("created_at", { ascending: false });

      if (providersError) throw providersError;

      // Then fetch profiles for each provider
      if (providersData && providersData.length > 0) {
        const userIds = providersData.map(p => p.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone, city")
          .in("id", userIds);

        if (profilesError) throw profilesError;

        // Map profiles to providers
        const providersWithProfiles = providersData.map(provider => ({
          ...provider,
          profile: profilesData?.find(p => p.id === provider.user_id) || null
        }));

        setPendingProviders(providersWithProfiles as PendingProvider[]);
      } else {
        setPendingProviders([]);
      }
    } catch (error) {
      console.error("Error fetching pending providers:", error);
      toast.error("Failed to load pending providers");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch counts
      const [profilesResult, providersResult, bookingsResult] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("providers").select("id", { count: "exact", head: true }).eq("verification_status", "approved"),
        supabase.from("bookings").select("id, total_amount", { count: "exact" }).in("status", ["confirmed", "in_progress"]),
      ]);

      const pendingCount = pendingProviders.length;

      setStats({
        totalUsers: profilesResult.count || 0,
        totalProviders: providersResult.count || 0,
        activeBookings: bookingsResult.count || 0,
        revenue: bookingsResult.data?.reduce((sum, b) => sum + (b.total_amount || 0), 0) || 0,
        pendingApprovals: pendingCount,
        openIssues: 0, // Placeholder for now
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const openReviewDialog = (provider: PendingProvider) => {
    setSelectedProvider(provider);
    setVerificationResult(null);
    setRejectionReason("");
    setIsReviewDialogOpen(true);
  };

  const verifyFaces = async () => {
    if (!selectedProvider?.id_document_url || !selectedProvider?.selfie_url) {
      toast.error("Provider is missing verification documents");
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // Get public URLs for the images
      const { data: idDocData } = supabase.storage
        .from("verification-documents")
        .getPublicUrl(selectedProvider.id_document_url);

      const { data: selfieData } = supabase.storage
        .from("verification-documents")
        .getPublicUrl(selectedProvider.selfie_url);

      const { data, error } = await supabase.functions.invoke("verify-face", {
        body: {
          providerId: selectedProvider.id,
          idDocumentUrl: idDocData.publicUrl,
          selfieUrl: selfieData.publicUrl,
        },
      });

      if (error) throw error;

      if (data.verification) {
        setVerificationResult(data.verification);
        if (data.verification.match) {
          toast.success("Face verification passed!");
        } else {
          toast.warning("Face verification failed - faces do not match");
        }
      }
    } catch (error) {
      console.error("Face verification error:", error);
      toast.error("Failed to verify faces. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const approveProvider = async () => {
    if (!selectedProvider) return;

    // Check if face verification passed
    if (!verificationResult?.match) {
      toast.error("Please complete face verification before approving");
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await supabase
        .from("providers")
        .update({
          verification_status: "approved",
          verification_notes: `Approved. Face verification: ${verificationResult.confidence} confidence - ${verificationResult.reason}`,
        })
        .eq("id", selectedProvider.id);

      if (error) throw error;

      // Add provider role
      const { error: roleError } = await supabase.from("user_roles").insert({
        user_id: selectedProvider.user_id,
        role: "provider",
      });

      if (roleError && !roleError.message.includes("duplicate")) {
        console.error("Role assignment error:", roleError);
      }

      toast.success("Provider approved successfully!");
      setIsReviewDialogOpen(false);
      fetchPendingProviders();
      fetchStats();
    } catch (error) {
      console.error("Approval error:", error);
      toast.error("Failed to approve provider");
    } finally {
      setIsProcessing(false);
    }
  };

  const rejectProvider = async () => {
    if (!selectedProvider) return;

    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await supabase
        .from("providers")
        .update({
          verification_status: "rejected",
          verification_notes: rejectionReason,
        })
        .eq("id", selectedProvider.id);

      if (error) throw error;

      toast.success("Provider rejected");
      setIsReviewDialogOpen(false);
      fetchPendingProviders();
      fetchStats();
    } catch (error) {
      console.error("Rejection error:", error);
      toast.error("Failed to reject provider");
    } finally {
      setIsProcessing(false);
    }
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
                  <p className="text-xl font-bold">{pendingProviders.length}</p>
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
                {pendingProviders.length > 0 && (
                  <Badge variant="warning" className="ml-1">
                    {pendingProviders.length}
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
              </div>
            </TabsContent>

            <TabsContent value="approvals">
              <Card>
                <CardHeader>
                  <CardTitle>Provider Approval Queue</CardTitle>
                  <CardDescription>
                    Review and approve new provider applications with AI-powered face verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : pendingProviders.length > 0 ? (
                    <div className="space-y-4">
                      {pendingProviders.map((provider) => (
                        <div
                          key={provider.id}
                          className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <p className="font-semibold">
                              {provider.profile?.full_name || "Unknown"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {provider.profile?.email}
                            </p>
                            <p className="mt-1 text-sm">
                              <span className="font-medium">Service:</span>{" "}
                              {provider.category?.name || "Unknown"}
                            </p>
                            <p className="text-sm">
                              <span className="font-medium">Rate:</span> ${provider.hourly_rate}/hr
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              <Badge variant={provider.id_document_url ? "success" : "destructive"}>
                                {provider.id_document_url ? "ID Uploaded" : "No ID"}
                              </Badge>
                              <Badge variant={provider.selfie_url ? "success" : "destructive"}>
                                {provider.selfie_url ? "Selfie Uploaded" : "No Selfie"}
                              </Badge>
                              <Badge variant="secondary">
                                {provider.verification_status}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              onClick={() => openReviewDialog(provider)}
                            >
                              <Eye className="h-4 w-4" />
                              Review
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
                    <CardTitle>Booking Management & Refunds</CardTitle>
                    <CardDescription>
                      Monitor bookings and process refunds for disputed services
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
                  <RefundManager />
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
                    User management interface would go here.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="issues">
              <Card>
                <CardHeader>
                  <CardTitle>Reported Issues</CardTitle>
                  <CardDescription>
                    Handle user reports and platform issues
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    No reported issues at this time.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Review Dialog */}
      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Provider Application</DialogTitle>
            <DialogDescription>
              Verify the provider's identity by comparing their ID document with their selfie
            </DialogDescription>
          </DialogHeader>

          {selectedProvider && (
            <div className="space-y-6">
              {/* Provider Info */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="font-semibold mb-2">Provider Details</h4>
                  <div className="space-y-1 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> {selectedProvider.profile?.full_name}</p>
                    <p><span className="text-muted-foreground">Email:</span> {selectedProvider.profile?.email}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {selectedProvider.profile?.phone || "N/A"}</p>
                    <p><span className="text-muted-foreground">City:</span> {selectedProvider.profile?.city || "N/A"}</p>
                    <p><span className="text-muted-foreground">Service:</span> {selectedProvider.category?.name}</p>
                    <p><span className="text-muted-foreground">Rate:</span> ${selectedProvider.hourly_rate}/hr</p>
                    <p><span className="text-muted-foreground">Experience:</span> {selectedProvider.years_experience || 0} years</p>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Bio</h4>
                  <p className="text-sm text-muted-foreground">
                    {selectedProvider.bio || "No bio provided"}
                  </p>
                </div>
              </div>

              {/* Verification Images */}
              <div>
                <h4 className="font-semibold mb-3">Verification Documents</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">ID Document</p>
                    {selectedProvider.id_document_url ? (
                      <div className="relative aspect-video rounded-lg border overflow-hidden bg-muted">
                        <img
                          src={supabase.storage.from("verification-documents").getPublicUrl(selectedProvider.id_document_url).data.publicUrl}
                          alt="ID Document"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center aspect-video rounded-lg border bg-muted">
                        <p className="text-sm text-muted-foreground">No ID uploaded</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Selfie</p>
                    {selectedProvider.selfie_url ? (
                      <div className="relative aspect-video rounded-lg border overflow-hidden bg-muted">
                        <img
                          src={supabase.storage.from("verification-documents").getPublicUrl(selectedProvider.selfie_url).data.publicUrl}
                          alt="Selfie"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center aspect-video rounded-lg border bg-muted">
                        <p className="text-sm text-muted-foreground">No selfie uploaded</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Face Verification */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">AI Face Verification</h4>
                  <Button
                    onClick={verifyFaces}
                    disabled={isVerifying || !selectedProvider.id_document_url || !selectedProvider.selfie_url}
                    className="gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <ScanFace className="h-4 w-4" />
                        Verify Faces
                      </>
                    )}
                  </Button>
                </div>

                {verificationResult && (
                  <div className={`rounded-lg p-4 ${verificationResult.match ? "bg-success/10 border border-success/20" : "bg-destructive/10 border border-destructive/20"}`}>
                    <div className="flex items-start gap-3">
                      {verificationResult.match ? (
                        <CheckCircle className="h-5 w-5 text-success mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive mt-0.5" />
                      )}
                      <div>
                        <p className="font-medium">
                          {verificationResult.match ? "Faces Match" : "Faces Do Not Match"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Confidence: <Badge variant={verificationResult.confidence === "high" ? "success" : verificationResult.confidence === "medium" ? "warning" : "destructive"}>{verificationResult.confidence}</Badge>
                        </p>
                        <p className="text-sm mt-2">{verificationResult.reason}</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={verificationResult.idFaceDetected ? "success" : "destructive"}>
                            ID Face: {verificationResult.idFaceDetected ? "Detected" : "Not Detected"}
                          </Badge>
                          <Badge variant={verificationResult.selfieFaceDetected ? "success" : "destructive"}>
                            Selfie Face: {verificationResult.selfieFaceDetected ? "Detected" : "Not Detected"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Rejection Reason */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Rejection Reason (if rejecting)</label>
                <Textarea
                  placeholder="Enter reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={rejectProvider}
              disabled={isProcessing || !rejectionReason.trim()}
              className="gap-1"
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
              Reject
            </Button>
            <Button
              variant="success"
              onClick={approveProvider}
              disabled={isProcessing || !verificationResult?.match}
              className="gap-1"
            >
              {isProcessing ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
