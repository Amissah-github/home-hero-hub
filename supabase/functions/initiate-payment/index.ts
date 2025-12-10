import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Demo Paystack key - replace with live key later
const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY") || "sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

interface InitiatePaymentRequest {
  booking_id: string;
  email: string;
  amount: number; // Amount in the smallest currency unit (kobo for NGN, cents for others)
  currency?: string;
  callback_url?: string;
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

    const { booking_id, email, amount, currency = "NGN", callback_url } = await req.json() as InitiatePaymentRequest;

    console.log("Initiating payment for booking:", booking_id, "Amount:", amount);

    // Generate unique reference
    const reference = `BK_${booking_id}_${Date.now()}`;

    // Initialize payment with Paystack
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amount * 100, // Paystack expects amount in kobo (smallest unit)
        currency,
        reference,
        callback_url: callback_url || `${req.headers.get("origin")}/dashboard?payment=success`,
        metadata: {
          booking_id,
          custom_fields: [
            {
              display_name: "Booking ID",
              variable_name: "booking_id",
              value: booking_id,
            },
          ],
        },
      }),
    });

    const paystackData = await paystackResponse.json();
    console.log("Paystack response:", paystackData);

    if (!paystackData.status) {
      throw new Error(paystackData.message || "Failed to initialize payment");
    }

    // Update booking with payment reference
    const { error: updateError } = await supabaseClient
      .from("bookings")
      .update({
        paystack_reference: reference,
        paystack_access_code: paystackData.data.access_code,
        payment_status: "pending",
      })
      .eq("id", booking_id);

    if (updateError) {
      console.error("Error updating booking:", updateError);
      throw updateError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        authorization_url: paystackData.data.authorization_url,
        access_code: paystackData.data.access_code,
        reference,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error initiating payment:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
