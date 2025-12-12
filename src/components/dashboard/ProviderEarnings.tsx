import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import {
  DollarSign,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Briefcase,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface EarningsData {
  totalEarnings: number;
  thisWeekEarnings: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
  totalJobs: number;
  completedJobs: number;
  pendingPayouts: number;
  weeklyData: { day: string; earnings: number; jobs: number }[];
  monthlyData: { month: string; earnings: number; jobs: number }[];
  recentTransactions: {
    id: string;
    date: string;
    service: string;
    customer: string;
    amount: number;
    status: string;
  }[];
}

export function ProviderEarnings() {
  const [isLoading, setIsLoading] = useState(true);
  const [earningsData, setEarningsData] = useState<EarningsData>({
    totalEarnings: 0,
    thisWeekEarnings: 0,
    thisMonthEarnings: 0,
    lastMonthEarnings: 0,
    totalJobs: 0,
    completedJobs: 0,
    pendingPayouts: 0,
    weeklyData: [],
    monthlyData: [],
    recentTransactions: [],
  });

  useEffect(() => {
    fetchEarningsData();
  }, []);

  const fetchEarningsData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get provider ID
      const { data: provider } = await supabase
        .from("providers")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!provider) {
        setIsLoading(false);
        return;
      }

      // Get all completed bookings for this provider
      const { data: bookings, error } = await supabase
        .from("bookings")
        .select(`
          id,
          scheduled_date,
          total_amount,
          provider_payout_amount,
          payment_status,
          status,
          customer_id,
          service_categories(name)
        `)
        .eq("provider_id", provider.id)
        .order("scheduled_date", { ascending: false });

      if (error) {
        console.error("Error fetching bookings:", error);
        setIsLoading(false);
        return;
      }

      // Calculate earnings metrics
      const now = new Date();
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

      let totalEarnings = 0;
      let thisWeekEarnings = 0;
      let thisMonthEarnings = 0;
      let lastMonthEarnings = 0;
      let pendingPayouts = 0;
      let completedJobs = 0;

      const weeklyMap = new Map<string, { earnings: number; jobs: number }>();
      const monthlyMap = new Map<string, { earnings: number; jobs: number }>();

      // Initialize weekly data for last 7 days
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(now.getDate() - i);
        const dayName = days[date.getDay()];
        weeklyMap.set(dayName, { earnings: 0, jobs: 0 });
      }

      // Initialize monthly data for last 6 months
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const monthName = months[date.getMonth()];
        monthlyMap.set(monthName, { earnings: 0, jobs: 0 });
      }

      // Get customer profiles for transactions
      const customerIds = [...new Set(bookings?.map(b => b.customer_id) || [])];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", customerIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p.full_name]) || []);

      const recentTransactions: EarningsData["recentTransactions"] = [];

      bookings?.forEach((booking) => {
        const bookingDate = new Date(booking.scheduled_date);
        const payout = booking.provider_payout_amount || (booking.total_amount * 0.9);
        
        if (booking.status === "completed" && booking.payment_status === "released") {
          totalEarnings += payout;
          completedJobs++;

          // Weekly earnings
          if (bookingDate >= startOfWeek) {
            thisWeekEarnings += payout;
          }

          // This month earnings
          if (bookingDate >= startOfMonth) {
            thisMonthEarnings += payout;
          }

          // Last month earnings
          if (bookingDate >= startOfLastMonth && bookingDate <= endOfLastMonth) {
            lastMonthEarnings += payout;
          }

          // Update weekly data
          const last7Days = new Date(now);
          last7Days.setDate(now.getDate() - 6);
          if (bookingDate >= last7Days) {
            const dayName = days[bookingDate.getDay()];
            const existing = weeklyMap.get(dayName) || { earnings: 0, jobs: 0 };
            weeklyMap.set(dayName, {
              earnings: existing.earnings + payout,
              jobs: existing.jobs + 1,
            });
          }

          // Update monthly data
          const monthName = months[bookingDate.getMonth()];
          const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
          if (bookingDate >= sixMonthsAgo) {
            const existing = monthlyMap.get(monthName) || { earnings: 0, jobs: 0 };
            monthlyMap.set(monthName, {
              earnings: existing.earnings + payout,
              jobs: existing.jobs + 1,
            });
          }
        }

        // Pending payouts (confirmed but not released)
        if (booking.status === "completed" && booking.payment_status === "paid") {
          pendingPayouts += payout;
        }

        // Add to recent transactions (first 10)
        if (recentTransactions.length < 10) {
          recentTransactions.push({
            id: booking.id,
            date: booking.scheduled_date,
            service: (booking.service_categories as any)?.name || "Service",
            customer: profileMap.get(booking.customer_id) || "Customer",
            amount: payout,
            status: booking.payment_status || "pending",
          });
        }
      });

      // Convert maps to arrays
      const weeklyData = Array.from(weeklyMap.entries()).map(([day, data]) => ({
        day,
        earnings: data.earnings,
        jobs: data.jobs,
      }));

      const monthlyData = Array.from(monthlyMap.entries()).map(([month, data]) => ({
        month,
        earnings: data.earnings,
        jobs: data.jobs,
      }));

      setEarningsData({
        totalEarnings,
        thisWeekEarnings,
        thisMonthEarnings,
        lastMonthEarnings,
        totalJobs: bookings?.length || 0,
        completedJobs,
        pendingPayouts,
        weeklyData,
        monthlyData,
        recentTransactions,
      });
    } catch (error) {
      console.error("Error fetching earnings data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const monthlyChange = earningsData.lastMonthEarnings > 0
    ? ((earningsData.thisMonthEarnings - earningsData.lastMonthEarnings) / earningsData.lastMonthEarnings) * 100
    : 0;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "released":
        return <Badge variant="success">Paid</Badge>;
      case "paid":
        return <Badge variant="info">Pending</Badge>;
      case "refunded":
        return <Badge variant="destructive">Refunded</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Earnings Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-bold">₦{earningsData.totalEarnings.toLocaleString()}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">₦{earningsData.thisMonthEarnings.toLocaleString()}</p>
                {monthlyChange !== 0 && (
                  <p className={`text-xs flex items-center gap-1 ${monthlyChange > 0 ? 'text-success' : 'text-destructive'}`}>
                    {monthlyChange > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {Math.abs(monthlyChange).toFixed(1)}% vs last month
                  </p>
                )}
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">₦{earningsData.thisWeekEarnings.toLocaleString()}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-info/10">
                <Calendar className="h-6 w-6 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Payout</p>
                <p className="text-2xl font-bold">₦{earningsData.pendingPayouts.toLocaleString()}</p>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-warning/10">
                <Briefcase className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Weekly Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={earningsData.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`₦${value.toLocaleString()}`, 'Earnings']}
                  />
                  <Area
                    type="monotone"
                    dataKey="earnings"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary) / 0.2)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={earningsData.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number, name: string) => [
                      name === 'earnings' ? `₦${value.toLocaleString()}` : value,
                      name === 'earnings' ? 'Earnings' : 'Jobs'
                    ]}
                  />
                  <Bar dataKey="earnings" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {earningsData.recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {earningsData.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <DollarSign className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{transaction.service}</p>
                      <p className="text-sm text-muted-foreground">
                        {transaction.customer} • {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(transaction.status)}
                    <p className="font-semibold">₦{transaction.amount.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <DollarSign className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-semibold">No transactions yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Complete jobs to start earning
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
