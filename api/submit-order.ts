import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const { fullName, email, phone, shippingAddress, copies, joinEvent, bringGuest } = req.body;

        if (!fullName || !email || !phone || !shippingAddress) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        const numberOfCopies = parseInt(copies, 10);
        if (isNaN(numberOfCopies) || numberOfCopies < 1) {
            return res.status(400).json({ message: 'Invalid number of copies.' });
        }

        const trackingNumber = `HIP-2025-${nanoid(5).toUpperCase()}`;

        const { error: dbError } = await supabase.from('orders').insert({
            tracking_number: trackingNumber,
            customer_name: fullName,
            customer_email: email,
            customer_phone: phone,
            shipping_address: shippingAddress,
            number_of_copies: numberOfCopies,
            join_event: joinEvent,
            bring_guest: bringGuest,
            status: 'pending_payment',
        });

        if (dbError) {
            console.error('Database Error:', dbError);
            return res.status(500).json({ message: `Database Error: ${dbError.message}` });
        }

        return res.status(200).json({ success: true, trackingNumber });

    } catch (e: any) {
        console.error('Submission Error:', e);
        return res.status(500).json({ 
            message: e.message || 'An internal server error occurred.' 
        });
    }
}
