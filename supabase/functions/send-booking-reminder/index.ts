import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// TODO: Add RESEND_API_KEY to your backend secrets to enable email sending
// Get your API key from: https://resend.com/api-keys
// Also validate your email domain at: https://resend.com/domains
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ReminderRequest {
  booking_id?: string;
  send_all_upcoming?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check if Resend is configured
    if (!resend) {
      console.log("RESEND_API_KEY not configured - skipping email sending");
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "Email service not configured. Add RESEND_API_KEY to secrets." 
        }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { booking_id, send_all_upcoming }: ReminderRequest = await req.json();
    const emailsSent: string[] = [];

    if (send_all_upcoming) {
      // Get all confirmed bookings for tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = tomorrow.toISOString().split('T')[0];

      const { data: upcomingBookings, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          id,
          scheduled_date,
          scheduled_time,
          address,
          total_amount,
          customer_id,
          provider_id,
          service_categories!inner(name),
          providers!inner(
            user_id,
            profiles:user_id(full_name, email)
          )
        `)
        .eq('scheduled_date', tomorrowStr)
        .in('status', ['confirmed', 'pending_payment']);

      if (bookingsError) {
        console.error("Error fetching upcoming bookings:", bookingsError);
        throw new Error("Failed to fetch upcoming bookings");
      }

      console.log(`Found ${upcomingBookings?.length || 0} bookings for tomorrow`);

      for (const booking of upcomingBookings || []) {
        // Get customer profile
        const { data: customerProfile } = await supabase
          .from('profiles')
          .select('email, full_name')
          .eq('id', booking.customer_id)
          .single();

        if (customerProfile?.email) {
          // Send reminder to customer
          await resend.emails.send({
            from: "GetServed <onboarding@resend.dev>",
            to: [customerProfile.email],
            subject: "Reminder: Your booking is tomorrow!",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #0d9488; text-align: center;">Booking Reminder</h1>
                <p>Hi ${customerProfile.full_name || 'there'},</p>
                <p>This is a friendly reminder that your <strong>${(booking.service_categories as any)?.name || 'service'}</strong> booking is scheduled for tomorrow!</p>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">Booking Details</h3>
                  <p><strong>Date:</strong> ${booking.scheduled_date}</p>
                  <p><strong>Time:</strong> ${booking.scheduled_time}</p>
                  <p><strong>Address:</strong> ${booking.address}</p>
                  <p><strong>Amount:</strong> ₦${(booking.total_amount || 0).toLocaleString()}</p>
                </div>
                
                <p>Please ensure you're available at the scheduled time. The service provider will arrive at the specified address.</p>
                
                <p style="margin-top: 30px;">Best regards,<br>The GetServed Team</p>
              </div>
            `,
          });
          emailsSent.push(`Customer: ${customerProfile.email}`);
        }

        // Send reminder to provider
        const providerData = booking.providers as any;
        const providerProfile = providerData?.profiles;
        if (providerProfile?.email) {
          await resend.emails.send({
            from: "GetServed <onboarding@resend.dev>",
            to: [providerProfile.email],
            subject: "Reminder: You have a job tomorrow!",
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h1 style="color: #0d9488; text-align: center;">Job Reminder</h1>
                <p>Hi ${providerProfile.full_name || 'there'},</p>
                <p>This is a reminder that you have a <strong>${(booking.service_categories as any)?.name || 'service'}</strong> job scheduled for tomorrow!</p>
                
                <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">Job Details</h3>
                  <p><strong>Customer:</strong> ${customerProfile?.full_name || 'Customer'}</p>
                  <p><strong>Date:</strong> ${booking.scheduled_date}</p>
                  <p><strong>Time:</strong> ${booking.scheduled_time}</p>
                  <p><strong>Address:</strong> ${booking.address}</p>
                  <p><strong>Your Earnings:</strong> ₦${((booking.total_amount || 0) * 0.9).toLocaleString()}</p>
                </div>
                
                <p>Please arrive on time and provide excellent service!</p>
                
                <p style="margin-top: 30px;">Best regards,<br>The GetServed Team</p>
              </div>
            `,
          });
          emailsSent.push(`Provider: ${providerProfile.email}`);
        }
      }
    } else if (booking_id) {
      // Send reminder for a specific booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .select(`
          id,
          scheduled_date,
          scheduled_time,
          address,
          total_amount,
          customer_id,
          provider_id,
          service_categories!inner(name),
          providers!inner(
            user_id,
            profiles:user_id(full_name, email)
          )
        `)
        .eq('id', booking_id)
        .single();

      if (bookingError || !booking) {
        throw new Error("Booking not found");
      }

      // Get customer profile
      const { data: customerProfile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', booking.customer_id)
        .single();

      if (customerProfile?.email) {
        await resend.emails.send({
          from: "GetServed <onboarding@resend.dev>",
          to: [customerProfile.email],
          subject: "Reminder: Your upcoming booking",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h1 style="color: #0d9488; text-align: center;">Booking Reminder</h1>
              <p>Hi ${customerProfile.full_name || 'there'},</p>
              <p>This is a friendly reminder about your upcoming <strong>${(booking.service_categories as any)?.name || 'service'}</strong> booking.</p>
              
              <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Booking Details</h3>
                <p><strong>Date:</strong> ${booking.scheduled_date}</p>
                <p><strong>Time:</strong> ${booking.scheduled_time}</p>
                <p><strong>Address:</strong> ${booking.address}</p>
                <p><strong>Amount:</strong> ₦${(booking.total_amount || 0).toLocaleString()}</p>
              </div>
              
              <p style="margin-top: 30px;">Best regards,<br>The GetServed Team</p>
            </div>
          `,
        });
        emailsSent.push(`Customer: ${customerProfile.email}`);
      }
    }

    console.log("Reminder emails sent:", emailsSent);

    return new Response(
      JSON.stringify({ 
        success: true, 
        emails_sent: emailsSent.length,
        details: emailsSent 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in send-booking-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
