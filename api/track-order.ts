
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async (req: Request) => {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
    }

    try {
        const { trackingNumber, email } = await req.json();

        if (!trackingNumber || !email) {
            return new Response(JSON.stringify({ message: 'Tracking number and email are required.' }), { status: 400 });
        }

        const { data, error } = await supabase
            .from('orders')
            .select('created_at, tracking_number, customer_name, shipping_address, number_of_copies, status, join_event, bring_guest')
            .eq('tracking_number', trackingNumber)
            .eq('customer_email', email)
            .single();

        if (error || !data) {
            console.warn(`Failed lookup for track# ${trackingNumber}:`, error?.message);
            return new Response(JSON.stringify({ message: 'Order not found. Please verify your details and try again.' }), { status: 404 });
        }

        return new Response(JSON.stringify({ order: data }), { status: 200 });

    } catch (error: any) {
        console.error('Tracking Error:', error);
        return new Response(JSON.stringify({ message: 'An internal server error occurred.' }), { status: 500 });
    }
};