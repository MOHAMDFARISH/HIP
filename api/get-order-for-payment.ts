import { createClient } from '@supabase/supabase-js';

export const config = {
    runtime: 'edge',
};

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async (req: Request) => {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' },
        });
    }

    try {
        const { trackingNumber } = await req.json();

        if (!trackingNumber) {
            return new Response(JSON.stringify({ message: 'Tracking number is required.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const { data, error } = await supabase
            .from('orders')
            .select('tracking_number, customer_name, customer_email, number_of_copies, status')
            .eq('tracking_number', trackingNumber)
            .single();

        if (error || !data) {
            return new Response(JSON.stringify({ message: 'Order not found.' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        // This endpoint is only for orders awaiting payment.
        // For other statuses, the user should use the main tracking page.
        if (data.status !== 'pending_payment') {
            return new Response(JSON.stringify({ message: 'This order is not awaiting payment.', status: data.status }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify({ order: data }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Get Order Error:', error);
        return new Response(JSON.stringify({ message: error.message || 'An internal server error occurred.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};