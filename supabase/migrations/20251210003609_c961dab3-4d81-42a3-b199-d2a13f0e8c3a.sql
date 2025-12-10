
-- Add payment tracking fields to bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS paystack_reference text,
ADD COLUMN IF NOT EXISTS paystack_access_code text,
ADD COLUMN IF NOT EXISTS payment_status text DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS customer_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS provider_completed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS provider_payout_amount numeric,
ADD COLUMN IF NOT EXISTS platform_fee_amount numeric,
ADD COLUMN IF NOT EXISTS refund_amount numeric,
ADD COLUMN IF NOT EXISTS refund_reason text,
ADD COLUMN IF NOT EXISTS refunded_at timestamp with time zone;

-- Create index for payment lookups
CREATE INDEX IF NOT EXISTS idx_bookings_paystack_reference ON public.bookings(paystack_reference);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON public.bookings(payment_status);
