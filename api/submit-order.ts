import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { nanoid } from 'nanoid';
import CustomerConfirmationEmail from '../emails/CustomerConfirmationEmail';
import AdminNotificationEmail from '../emails/AdminNotificationEmail';

// This is a serverless function, so we can safely use environment variables
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const resendApiKey = process.env.RESEND_API_KEY!;
const adminEmail = process.env.ADMIN_EMAIL!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

export default async (req: Request) => {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
    }

    try {
        const {
            fullName,
            email,
            phone,
            shippingAddress,
            copies,
            joinEvent,
            bringGuest,
            receiptFileUrl,
        } = await req.json();

        // --- Server-side Validation ---
        if (!fullName || !email || !phone || !shippingAddress || !receiptFileUrl) {
            return new Response(JSON.stringify({ message: 'Missing required fields.' }), { status: 400 });
        }
        if (typeof receiptFileUrl !== 'string' || !receiptFileUrl.startsWith('http')) {
             return new Response(JSON.stringify({ message: 'Invalid receipt file URL.' }), { status: 400 });
        }

        // --- Generate Tracking Number ---
        const trackingNumber = `HIP-2025-${nanoid(5).toUpperCase()}`;

        // --- Save Order to Supabase Database ---
        const { error: dbError } = await supabase.from('orders').insert({
            tracking_number: trackingNumber,
            customer_name: fullName,
            customer_email: email,
            customer_phone: phone,
            shipping_address: shippingAddress,
            number_of_copies: parseInt(copies, 10),
            receipt_file_url: receiptFileUrl,
            join_event: joinEvent,
            bring_guest: bringGuest,
            status: 'pending',
        });

        if (dbError) {
            throw new Error(`Database Error: ${dbError.message}`);
        }

        // --- Send Confirmation Emails ---
        const commonEmailProps = {
            trackingNumber,
            customerName: fullName,
            copies: parseInt(copies, 10),
            shippingAddress: shippingAddress,
            eventDetails: joinEvent ? `Registered ${bringGuest ? '(+1 Guest)' : ''}` : 'Not Registered',
        };
        
        // To Customer
        await resend.emails.send({
            from: `Heal in Paradise <orders@healinparadise.com>`, // Use a verified domain
            to: email,
            subject: `Your 'Heal in Paradise' Pre-Order is Confirmed! #${trackingNumber}`,
            react: CustomerConfirmationEmail(commonEmailProps),
        });

        // To Admin
        await resend.emails.send({
            from: `New Pre-Order <system@healinparadise.com>`,
            to: adminEmail,
            subject: `New Pre-Order Received: ${fullName} (#${trackingNumber})`,
            react: AdminNotificationEmail({ ...commonEmailProps, receiptUrl: receiptFileUrl, email: email, phone: phone }),
        });

        return new Response(JSON.stringify({ success: true, trackingNumber }), { status: 200 });

    } catch (error: any) {
        console.error('Submission Error:', error);
        return new Response(JSON.stringify({ message: error.message || 'An internal server error occurred.' }), { status: 500 });
    }
};