import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Demo Paystack key - replace with live key later
const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY") || "sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

interface ReleasePaymentRequest {
  booking_id: string;
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

    const { booking_id } = await req.json() as ReleasePaymentRequest;

    console.log("Releasing payment for booking:", booking_id);

    // Get booking details
    const { data: booking, error: bookingError } = await supabaseClient
      .from("bookings")
      .select(`
        *,
        provider:providers(
          user_id,
          profile:profiles(email)
        )
      `)
      .eq("id", booking_id)
      .single();

    if (bookingError || !booking) {
      throw new Error("Booking not found");
    }

    // Check if both parties have marked complete
    if (!booking.customer_completed || !booking.provider_completed) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Both customer and provider must mark job as complete",
          customer_completed: booking.customer_completed,
          provider_completed: booking.provider_completed,
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Calculate payment split: 90% to provider, 10% platform fee
    const totalAmount = Number(booking.total_amount);
    const providerAmount = Math.floor(totalAmount * 0.9 * 100); // In kobo
    const platformFee = totalAmount - (providerAmount / 100);

    console.log("Payment split - Provider:", providerAmount / 100, "Platform:", platformFee);

    // In production, you would:
    // 1. Create a transfer recipient for the provider
    // 2. Initiate a transfer to the provider's account
    // For demo, we'll simulate this
    
    // Simulating transfer (in production, use Paystack Transfer API)
    // const transferResponse = await fetch("https://api.paystack.co/transfer", {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`,
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     source: "balance",
    //     amount: providerAmount,
    //     recipient: provider_recipient_code,
    //     reason: `Payment for booking ${booking_id}`,
    //   }),
    // });

    // Update booking with payment release details
    const { error: updateError } = await supabaseClient
      .from("bookings")
      .update({
        payment_status: "released",
        status: "completed",
        provider_payout_amount: providerAmount / 100,
        platform_fee_amount: platformFee,
        completed_at: new Date().toISOString(),
      })
      .eq("id", booking_id);

    if (updateError) {
      console.error("Error updating booking:", updateError);
      throw updateError;
    }

    // Fetch details for email
    const { data: providerProfile } = await supabaseClient
      .from("profiles")
      .select("email, full_name")
      .eq("id", booking.provider?.user_id)
      .single();

    const { data: customerProfile } = await supabaseClient
      .from("profiles")
      .select("full_name")
      .eq("id", booking.customer_id)
      .single();

    const { data: category } = await supabaseClient
      .from("service_categories")
      .select("name")
      .eq("id", booking.category_id)
      .single();

    // Send payment released email to provider
    if (providerProfile?.email) {
      const emailPayload = {
        to: providerProfile.email,
        type: "payment_released",
        data: {
          providerName: providerProfile.full_name,
          customerName: customerProfile?.full_name,
          serviceName: category?.name,
          amount: providerAmount / 100,
        },
      };

      fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-payment-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
        },
        body: JSON.stringify(emailPayload),
      }).catch(console.error);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment released successfully",
        provider_payout: providerAmount / 100,
        platform_fee: platformFee,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error releasing payment:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
