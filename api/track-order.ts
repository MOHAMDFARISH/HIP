import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { trackingNumber, email } = req.body;

        if (!trackingNumber || !email) {
            return res.status(400).json({ message: 'Tracking number and email are required.' });
        }

        const { data, error } = await supabase
            .from('orders')
            .select('created_at, tracking_number, customer_name, shipping_address, number_of_copies, status, join_event, bring_guest')
            .eq('tracking_number', trackingNumber)
            .eq('customer_email', email)
            .single();

        if (error || !data) {
            console.warn(`Failed lookup for track# ${trackingNumber}:`, error?.message);
            return res.status(404).json({ message: 'Order not found. Please verify your details and try again.' });
        }

        return res.status(200).json({ order: data });

    } catch (error: any) {
        console.error('Tracking Error:', error);
        return res.status(500).json({ message: 'An internal server error occurred.' });
    }
};
