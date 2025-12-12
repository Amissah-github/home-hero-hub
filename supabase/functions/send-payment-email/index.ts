import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

interface EmailRequest {
  to: string;
  type: "payment_confirmed" | "payment_released" | "refund_processed" | "booking_confirmed";
  data: {
    customerName?: string;
    providerName?: string;
    serviceName?: string;
    amount?: number;
    refundAmount?: number;
    bookingDate?: string;
    bookingTime?: string;
  };
}

const getEmailContent = (type: EmailRequest["type"], data: EmailRequest["data"]) => {
  switch (type) {
    case "payment_confirmed":
      return {
        subject: "Payment Confirmed - GetServed",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #14b8a6, #0d9488); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">GetServed</h1>
            </div>
            <div style="padding: 30px; background: #f8fafc;">
              <h2 style="color: #0f172a;">Payment Confirmed!</h2>
              <p style="color: #475569;">Hi ${data.customerName || "there"},</p>
              <p style="color: #475569;">Your payment of <strong>₦${data.amount?.toLocaleString()}</strong> has been confirmed and is being held securely until your service is completed.</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Service:</strong> ${data.serviceName}</p>
                <p style="margin: 5px 0;"><strong>Provider:</strong> ${data.providerName}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${data.bookingDate}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${data.bookingTime}</p>
              </div>
              <p style="color: #475569;">Your provider will be notified and will arrive at the scheduled time.</p>
            </div>
            <div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
              <p>© ${new Date().getFullYear()} GetServed. All rights reserved.</p>
            </div>
          </div>
        `,
      };

    case "payment_released":
      return {
        subject: "Payment Released - GetServed",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #14b8a6, #0d9488); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">GetServed</h1>
            </div>
            <div style="padding: 30px; background: #f8fafc;">
              <h2 style="color: #0f172a;">Payment Released!</h2>
              <p style="color: #475569;">Hi ${data.providerName || "there"},</p>
              <p style="color: #475569;">Great news! Your payment of <strong>₦${data.amount?.toLocaleString()}</strong> has been released to your account.</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Service:</strong> ${data.serviceName}</p>
                <p style="margin: 5px 0;"><strong>Customer:</strong> ${data.customerName}</p>
                <p style="margin: 5px 0;"><strong>Amount (after 10% platform fee):</strong> ₦${data.amount?.toLocaleString()}</p>
              </div>
              <p style="color: #475569;">Thank you for providing excellent service!</p>
            </div>
            <div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
              <p>© ${new Date().getFullYear()} GetServed. All rights reserved.</p>
            </div>
          </div>
        `,
      };

    case "refund_processed":
      return {
        subject: "Refund Processed - GetServed",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #14b8a6, #0d9488); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">GetServed</h1>
            </div>
            <div style="padding: 30px; background: #f8fafc;">
              <h2 style="color: #0f172a;">Refund Processed</h2>
              <p style="color: #475569;">Hi ${data.customerName || "there"},</p>
              <p style="color: #475569;">Your refund of <strong>₦${data.refundAmount?.toLocaleString()}</strong> has been processed.</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Original Amount:</strong> ₦${data.amount?.toLocaleString()}</p>
                <p style="margin: 5px 0;"><strong>Refund Amount:</strong> ₦${data.refundAmount?.toLocaleString()}</p>
                <p style="margin: 5px 0;"><strong>Service:</strong> ${data.serviceName}</p>
              </div>
              <p style="color: #475569;">The refund will be credited to your original payment method within 5-10 business days.</p>
            </div>
            <div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
              <p>© ${new Date().getFullYear()} GetServed. All rights reserved.</p>
            </div>
          </div>
        `,
      };

    case "booking_confirmed":
      return {
        subject: "Booking Confirmed - GetServed",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #14b8a6, #0d9488); padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">GetServed</h1>
            </div>
            <div style="padding: 30px; background: #f8fafc;">
              <h2 style="color: #0f172a;">Booking Confirmed!</h2>
              <p style="color: #475569;">Hi ${data.customerName || "there"},</p>
              <p style="color: #475569;">Your booking has been confirmed. Here are the details:</p>
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 5px 0;"><strong>Service:</strong> ${data.serviceName}</p>
                <p style="margin: 5px 0;"><strong>Provider:</strong> ${data.providerName}</p>
                <p style="margin: 5px 0;"><strong>Date:</strong> ${data.bookingDate}</p>
                <p style="margin: 5px 0;"><strong>Time:</strong> ${data.bookingTime}</p>
                <p style="margin: 5px 0;"><strong>Amount:</strong> ₦${data.amount?.toLocaleString()}</p>
              </div>
              <p style="color: #475569;">We'll send you a reminder before your appointment.</p>
            </div>
            <div style="padding: 20px; text-align: center; color: #94a3b8; font-size: 12px;">
              <p>© ${new Date().getFullYear()} GetServed. All rights reserved.</p>
            </div>
          </div>
        `,
      };

    default:
      return { subject: "Notification - GetServed", html: "<p>You have a new notification.</p>" };
  }
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured");
      throw new Error("Email service not configured");
    }

    const { to, type, data } = await req.json() as EmailRequest;

    console.log(`Sending ${type} email to ${to}`);

    const emailContent = getEmailContent(type, data);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "GetServed <onboarding@resend.dev>",
        to: [to],
        subject: emailContent.subject,
        html: emailContent.html,
      }),
    });

    const responseData = await res.json();
    console.log("Resend API response:", responseData);

    if (!res.ok) {
      throw new Error(responseData.message || "Failed to send email");
    }

    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
