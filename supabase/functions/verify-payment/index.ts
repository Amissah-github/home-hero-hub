import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Demo Paystack key - replace with live key later
const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY") || "sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

interface VerifyPaymentRequest {
  reference: string;
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

    const { reference } = await req.json() as VerifyPaymentRequest;

    console.log("Verifying payment for reference:", reference);

    // Verify payment with Paystack
    const paystackResponse = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    const paystackData = await paystackResponse.json();
    console.log("Paystack verification response:", paystackData);

    if (!paystackData.status) {
      throw new Error(paystackData.message || "Failed to verify payment");
    }

    const paymentStatus = paystackData.data.status;
    const bookingId = paystackData.data.metadata?.booking_id;

    if (paymentStatus === "success" && bookingId) {
      // Update booking payment status to paid (held in escrow)
      const { error: updateError } = await supabaseClient
        .from("bookings")
        .update({
          payment_status: "paid",
          status: "confirmed",
        })
        .eq("id", bookingId);

      if (updateError) {
        console.error("Error updating booking:", updateError);
        throw updateError;
      }

      // Fetch booking details for email
      const { data: booking } = await supabaseClient
        .from("bookings")
        .select(`
          total_amount,
          scheduled_date,
          scheduled_time,
          customer_id,
          provider_id
        `)
        .eq("id", bookingId)
        .single();

      if (booking) {
        // Fetch provider info
        const { data: provider } = await supabaseClient
          .from("providers")
          .select("user_id")
          .eq("id", booking.provider_id)
          .single();

        const { data: providerProfile } = await supabaseClient
          .from("profiles")
          .select("full_name")
          .eq("id", provider?.user_id)
          .single();

        // Fetch service category
        const { data: bookingWithCategory } = await supabaseClient
          .from("bookings")
          .select("category_id")
          .eq("id", bookingId)
          .single();

        const { data: category } = await supabaseClient
          .from("service_categories")
          .select("name")
          .eq("id", bookingWithCategory?.category_id)
          .single();

        // Fetch customer email
        const { data: customerProfile } = await supabaseClient
          .from("profiles")
          .select("email, full_name")
          .eq("id", booking.customer_id)
          .single();

        // Send payment confirmation email
        if (customerProfile?.email) {
          const emailPayload = {
            to: customerProfile.email,
            type: "payment_confirmed",
            data: {
              customerName: customerProfile.full_name,
              providerName: providerProfile?.full_name,
              serviceName: category?.name,
              amount: booking.total_amount,
              bookingDate: booking.scheduled_date,
              bookingTime: booking.scheduled_time,
            },
          };

          // Fire and forget - don't block payment verification
          fetch(`${Deno.env.get("SUPABASE_URL")}/functions/v1/send-payment-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Deno.env.get("SUPABASE_ANON_KEY")}`,
            },
            body: JSON.stringify(emailPayload),
          }).catch(console.error);
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          payment_status: "paid",
          message: "Payment verified and held in escrow",
          booking_id: bookingId,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        payment_status: paymentStatus,
        message: `Payment status: ${paymentStatus}`,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error verifying payment:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
