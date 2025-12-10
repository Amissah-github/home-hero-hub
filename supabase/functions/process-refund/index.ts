import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Demo Paystack key - replace with live key later
const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY") || "sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

interface ProcessRefundRequest {
  booking_id: string;
  refund_percentage: number; // 0-100
  reason: string;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { booking_id, refund_percentage, reason } = await req.json() as ProcessRefundRequest;

    console.log("Processing refund for booking:", booking_id, "Percentage:", refund_percentage);

    if (refund_percentage < 0 || refund_percentage > 100) {
      throw new Error("Refund percentage must be between 0 and 100");
    }

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseClient
      .from("bookings")
      .select("*")
      .eq("id", booking_id)
      .single();

    if (bookingError || !booking) {
      throw new Error("Booking not found");
    }

    if (booking.payment_status !== "paid") {
      throw new Error("Payment must be in 'paid' status to refund");
    }

    const totalAmount = Number(booking.total_amount);
    const refundAmount = (totalAmount * refund_percentage) / 100;

    console.log("Refund amount:", refundAmount);

    // In production, use Paystack Refund API
    // const refundResponse = await fetch("https://api.paystack.co/refund", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     transaction: booking.paystack_reference,
    //     amount: refundAmount * 100, // In kobo
    //   }),
    // });

    // Update booking with refund details
    const { error: updateError } = await supabaseClient
      .from("bookings")
      .update({
        payment_status: "refunded",
        status: "cancelled",
        refund_amount: refundAmount,
        refund_reason: reason,
        refunded_at: new Date().toISOString(),
        cancelled_at: new Date().toISOString(),
        cancellation_reason: reason,
      })
      .eq("id", booking_id);

    if (updateError) {
      console.error("Error updating booking:", updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Refund of ${refund_percentage}% processed successfully`,
        refund_amount: refundAmount,
        original_amount: totalAmount,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error processing refund:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
