import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { usePaystack } from "@/hooks/usePaystack";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { RefreshCw, DollarSign, AlertCircle } from "lucide-react";

export function RefundManager() {
  const { processRefund, isLoading: isProcessingRefund } = usePaystack();
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [refundPercentage, setRefundPercentage] = useState(100);
  const [refundReason, setRefundReason] = useState("");
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);

  // Fetch bookings that are eligible for refund (paid status)
  const { data: bookings, isLoading, refetch } = useQuery({
    queryKey: ["admin-refundable-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          provider:providers(
            id,
            user_id,
            profile:profiles!providers_user_id_fkey(full_name, email, phone)
          ),
          category:service_categories(name),
          customer:profiles!bookings_customer_id_fkey(full_name, email, phone)
        `)
        .in("payment_status", ["paid", "released", "refunded"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleOpenRefundDialog = (booking: any) => {
    setSelectedBooking(booking);
    setRefundPercentage(100);
    setRefundReason("");
    setIsRefundDialogOpen(true);
  };

  const handleProcessRefund = async () => {
    if (!selectedBooking || !refundReason.trim()) return;

    const success = await processRefund(
      selectedBooking.id,
      refundPercentage,
      refundReason
    );

    if (success) {
      setIsRefundDialogOpen(false);
      setSelectedBooking(null);
      refetch();
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Paid</Badge>;
      case "released":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Released</Badge>;
      case "refunded":
        return <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20">Refunded</Badge>;
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const calculateRefundAmount = () => {
    if (!selectedBooking) return 0;
    return (Number(selectedBooking.total_amount) * refundPercentage) / 100;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Manage refunds for bookings with payment issues or unsatisfactory service
        </p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {bookings && bookings.length > 0 ? (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.map((booking: any) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.category?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.id.slice(0, 8)}...
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.customer?.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.customer?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.provider?.profile?.full_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.provider?.profile?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">₦{Number(booking.total_amount).toLocaleString()}</p>
                      {booking.refund_amount && (
                        <p className="text-xs text-orange-600">
                          Refunded: ₦{Number(booking.refund_amount).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{getPaymentStatusBadge(booking.payment_status)}</TableCell>
                  <TableCell>
                    {format(new Date(booking.scheduled_date), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    {booking.payment_status === "paid" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-orange-600 border-orange-500/20 hover:bg-orange-500/10"
                        onClick={() => handleOpenRefundDialog(booking)}
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Refund
                      </Button>
                    )}
                    {booking.payment_status === "refunded" && (
                      <span className="text-xs text-muted-foreground">
                        {booking.refund_reason?.slice(0, 30)}...
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No bookings with payments found</p>
        </div>
      )}

      {/* Refund Dialog */}
      <Dialog open={isRefundDialogOpen} onOpenChange={setIsRefundDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>
              Issue a partial or full refund to the customer
            </DialogDescription>
          </DialogHeader>

          {selectedBooking && (
            <div className="space-y-6 py-4">
              {/* Booking Summary */}
              <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium">{selectedBooking.category?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Customer:</span>
                  <span className="font-medium">{selectedBooking.customer?.full_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Provider:</span>
                  <span className="font-medium">{selectedBooking.provider?.profile?.full_name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total Paid:</span>
                  <span className="font-medium">₦{Number(selectedBooking.total_amount).toLocaleString()}</span>
                </div>
              </div>

              {/* Refund Percentage Slider */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Refund Percentage</Label>
                  <span className="text-lg font-bold text-primary">{refundPercentage}%</span>
                </div>
                <Slider
                  value={[refundPercentage]}
                  onValueChange={(value) => setRefundPercentage(value[0])}
                  max={100}
                  min={10}
                  step={10}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>10%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Refund Amount Preview */}
              <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">Refund Amount</p>
                <p className="text-2xl font-bold text-primary">
                  ₦{calculateRefundAmount().toLocaleString()}
                </p>
              </div>

              {/* Refund Reason */}
              <div className="space-y-2">
                <Label htmlFor="refund-reason">Reason for Refund *</Label>
                <Textarea
                  id="refund-reason"
                  placeholder="Explain why this refund is being issued..."
                  value={refundReason}
                  onChange={(e) => setRefundReason(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsRefundDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleProcessRefund}
              disabled={isProcessingRefund || !refundReason.trim()}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isProcessingRefund ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Process Refund
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
