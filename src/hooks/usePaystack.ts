import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PaymentResult {
  success: boolean;
  authorization_url?: string;
  access_code?: string;
  reference?: string;
  error?: string;
}

export function usePaystack() {
  const [isLoading, setIsLoading] = useState(false);

  const initiatePayment = async (
    bookingId: string,
    email: string,
    amount: number,
    callbackUrl?: string
  ): Promise<PaymentResult> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("initiate-payment", {
        body: {
          booking_id: bookingId,
          email,
          amount,
          currency: "NGN",
          callback_url: callbackUrl,
        },
      });

      if (error) throw error;

      if (data.success && data.authorization_url) {
        // Redirect to Paystack checkout
        window.location.href = data.authorization_url;
      }

      return data;
    } catch (error: any) {
      console.error("Payment initiation failed:", error);
      toast.error("Failed to initiate payment");
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPayment = async (reference: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-payment", {
        body: { reference },
      });

      if (error) throw error;

      return data;
    } catch (error: any) {
      console.error("Payment verification failed:", error);
      toast.error("Failed to verify payment");
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const markComplete = async (bookingId: string, role: "customer" | "provider") => {
    setIsLoading(true);
    try {
      const updateField = role === "customer" ? "customer_completed" : "provider_completed";
      
      const { error } = await supabase
        .from("bookings")
        .update({ [updateField]: true })
        .eq("id", bookingId);

      if (error) throw error;

      // Check if both parties have completed
      const { data: booking } = await supabase
        .from("bookings")
        .select("customer_completed, provider_completed")
        .eq("id", bookingId)
        .single();

      if (booking?.customer_completed && booking?.provider_completed) {
        // Trigger payment release
        const releaseResult = await supabase.functions.invoke("release-payment", {
          body: { booking_id: bookingId },
        });

        if (releaseResult.data?.success) {
          toast.success("Job completed! Payment has been released.");
        }
      } else {
        toast.success("Marked as complete. Waiting for the other party to confirm.");
      }

      return { success: true };
    } catch (error: any) {
      console.error("Failed to mark complete:", error);
      toast.error("Failed to mark as complete");
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const processRefund = async (
    bookingId: string,
    refundPercentage: number,
    reason: string
  ) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("process-refund", {
        body: {
          booking_id: bookingId,
          refund_percentage: refundPercentage,
          reason,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast.success(`Refund of ${refundPercentage}% processed successfully`);
      }

      return data;
    } catch (error: any) {
      console.error("Refund processing failed:", error);
      toast.error("Failed to process refund");
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    initiatePayment,
    verifyPayment,
    markComplete,
    processRefund,
  };
}
