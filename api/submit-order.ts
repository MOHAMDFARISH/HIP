
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

// This is a serverless function, so we can safely use environment variables
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async (req: Request) => {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
    }

    try {
        const formData = await req.formData();
        
        const orderData = {
            fullName: formData.get('fullName') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            shippingAddress: formData.get('shippingAddress') as string,
            copies: parseInt(formData.get('copies') as string, 10),
            joinEvent: formData.get('joinEvent') === 'true',
            bringGuest: formData.get('bringGuest') === 'true',
        };

        // --- Server-side Validation ---
        if (!orderData.fullName || !orderData.email || !orderData.phone || !orderData.shippingAddress) {
            return new Response(JSON.stringify({ message: 'Missing required fields.' }), { status: 400 });
        }

        // --- Generate Tracking Number ---
        const trackingNumber = `HIP-2025-${nanoid(5).toUpperCase()}`;

        // --- Save Order to Supabase Database ---
        // This insert will trigger the Edge Function to send the "Action Required" email.
        const { error: dbError } = await supabase.from('orders').insert({
            tracking_number: trackingNumber,
            customer_name: orderData.fullName,
            customer_email: orderData.email,
            customer_phone: orderData.phone,
            shipping_address: orderData.shippingAddress,
            number_of_copies: orderData.copies,
            join_event: orderData.joinEvent,
            // FIX: Corrected typo from 'orderAta' to 'orderData'.
            bring_guest: orderData.bringGuest,
            status: 'pending_payment', // New status for orders awaiting payment
        });

        if (dbError) {
            throw new Error(`Database Error: ${dbError.message}`);
        }

        return new Response(JSON.stringify({ success: true, trackingNumber }), { status: 200 });

    // FIX: Renamed 'error' to 'e' in catch block to avoid potential naming conflicts.
    } catch (e: any) {
        console.error('Submission Error:', e);
        return new Response(JSON.stringify({ message: e.message || 'An internal server error occurred.' }), { status: 500 });
    }
};

// Vercel config for body parsing
export const config = {
  api: {
    bodyParser: false, // Let the function handle FormData parsing
  },
};
