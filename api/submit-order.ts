import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

// No runtime export, defaults to Vercel's Node.js runtime.

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface OrderPayload {
    fullName: string;
    email: string;
    phone: string;
    shippingAddress: string;
    copies: string; // From client form, it's a string, needs to be parsed
    joinEvent: boolean;
    bringGuest: boolean;
}

export default async (req: Request) => {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
    }

    try {
        const orderData: OrderPayload = await req.json();
        
        // --- Server-side Validation ---
        if (!orderData.fullName || !orderData.email || !orderData.phone || !orderData.shippingAddress) {
            return new Response(JSON.stringify({ message: 'Missing required fields.' }), { status: 400 });
        }
        
        const numberOfCopies = parseInt(orderData.copies, 10);
        if (isNaN(numberOfCopies) || numberOfCopies < 1) {
             return new Response(JSON.stringify({ message: 'Invalid number of copies.' }), { status: 400 });
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
            number_of_copies: numberOfCopies,
            join_event: orderData.joinEvent,
            bring_guest: orderData.bringGuest,
            status: 'pending_payment', // New status for orders awaiting payment
        });

        if (dbError) {
            throw new Error(`Database Error: ${dbError.message}`);
        }

        return new Response(JSON.stringify({ success: true, trackingNumber }), { status: 200 });

    } catch (e: any) {
        console.error('Submission Error:', e);
        return new Response(JSON.stringify({ message: e.message || 'An internal server error occurred.' }), { status: 500 });
    }
};