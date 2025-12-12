import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  CreditCard, 
  ArrowDownLeft, 
  ArrowUpRight, 
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PaymentRecord {
  id: string;
  type: "payment" | "refund" | "payout";
  amount: number;
  status: string;
  description: string;
  date: string;
  reference?: string;
}

const statusConfig = {
  paid: { label: "Paid", variant: "success" as const, icon: CheckCircle },
  pending: { label: "Pending", variant: "warning" as const, icon: Clock },
  released: { label: "Released", variant: "info" as const, icon: ArrowUpRight },
  refunded: { label: "Refunded", variant: "destructive" as const, icon: RefreshCw },
  failed: { label: "Failed", variant: "destructive" as const, icon: XCircle },
};

const typeConfig = {
  payment: { label: "Payment", icon: CreditCard, color: "text-info" },
  refund: { label: "Refund", icon: ArrowDownLeft, color: "text-success" },
  payout: { label: "Payout", icon: ArrowUpRight, color: "text-primary" },
};

export function PaymentHistory() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Use mock data for demo
        setPayments([
          {
            id: "1",
            type: "payment",
            amount: 15000,
            status: "paid",
            description: "Home Cleaning - Maria Santos",
            date: "2024-12-10",
            reference: "BK_abc123_1702234567890",
          },
          {
            id: "2",
            type: "payment",
            amount: 5000,
            status: "released",
            description: "Barber Service - James Wilson",
            date: "2024-12-08",
            reference: "BK_def456_1702148167890",
          },
          {
            id: "3",
            type: "refund",
            amount: 7500,
            status: "refunded",
            description: "Partial refund - Personal Chef",
            date: "2024-12-05",
            reference: "RF_ghi789_1701889767890",
          },
          {
            id: "4",
            type: "payment",
            amount: 20000,
            status: "pending",
            description: "Laundry Service - Pending",
            date: "2024-12-12",
            reference: "BK_jkl012_1702407367890",
          },
        ]);
        setIsLoading(false);
        return;
      }

      // Fetch real bookings with payment info
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select(`
          id,
          total_amount,
          payment_status,
          refund_amount,
          paystack_reference,
          scheduled_date,
          created_at,
          providers (
            profiles:user_id (
              full_name
            )
          ),
          service_categories (
            name
          )
        `)
        .eq("customer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const paymentRecords: PaymentRecord[] = (bookings || []).flatMap((booking: any) => {
        const records: PaymentRecord[] = [];
        
        // Main payment record
        if (booking.payment_status && booking.payment_status !== "pending") {
          records.push({
            id: booking.id,
            type: "payment",
            amount: booking.total_amount,
            status: booking.payment_status,
            description: `${booking.service_categories?.name || "Service"} - ${booking.providers?.profiles?.full_name || "Provider"}`,
            date: booking.scheduled_date,
            reference: booking.paystack_reference,
          });
        }

        // Refund record if applicable
        if (booking.refund_amount && booking.refund_amount > 0) {
          records.push({
            id: `${booking.id}-refund`,
            type: "refund",
            amount: booking.refund_amount,
            status: "refunded",
            description: `Refund - ${booking.service_categories?.name || "Service"}`,
            date: booking.scheduled_date,
            reference: `RF_${booking.paystack_reference}`,
          });
        }

        return records;
      });

      setPayments(paymentRecords);
    } catch (error) {
      console.error("Error fetching payment history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPaid = payments
    .filter((p) => p.type === "payment" && p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRefunded = payments
    .filter((p) => p.type === "refund")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-info/10">
              <CreditCard className="h-6 w-6 text-info" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Paid</p>
              <p className="text-2xl font-bold">₦{totalPaid.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
              <ArrowDownLeft className="h-6 w-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Refunded</p>
              <p className="text-2xl font-bold">₦{totalRefunded.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-2xl font-bold">{payments.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : payments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <CreditCard className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-semibold">No transactions yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Your payment history will appear here
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => {
                  const typeInfo = typeConfig[payment.type];
                  const statusInfo = statusConfig[payment.status as keyof typeof statusConfig] || {
                    label: payment.status,
                    variant: "secondary" as const,
                    icon: Clock,
                  };

                  return (
                    <TableRow key={payment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <typeInfo.icon className={`h-4 w-4 ${typeInfo.color}`} />
                          <span className="font-medium">{typeInfo.label}</span>
                        </div>
                      </TableCell>
                      <TableCell>{payment.description}</TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <code className="text-xs text-muted-foreground">
                          {payment.reference?.slice(0, 15)}...
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusInfo.variant}>
                          {statusInfo.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        <span className={payment.type === "refund" ? "text-success" : ""}>
                          {payment.type === "refund" ? "+" : ""}₦{payment.amount.toLocaleString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
