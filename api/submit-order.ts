import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { nanoid } from 'nanoid';
import * as React from 'react';
// FIX: Removed redundant inlined email components.
// Importing from dedicated .tsx files resolves parsing errors and removes code duplication.
import { CustomerConfirmationEmail } from '../emails/CustomerConfirmationEmail';
import { AdminNotificationEmail } from '../emails/AdminNotificationEmail';


// --- Main Serverless Function Handler ---

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
        const receiptFile = formData.get('receipt') as File;

        // --- Server-side Validation ---
        if (!orderData.fullName || !orderData.email || !orderData.phone || !orderData.shippingAddress || !receiptFile) {
            return new Response(JSON.stringify({ message: 'Missing required fields.' }), { status: 400 });
        }
        if (receiptFile.size > 5 * 1024 * 1024) { // 5MB limit
            return new Response(JSON.stringify({ message: 'Receipt file size exceeds 5MB.' }), { status: 400 });
        }

        // --- Generate Tracking Number ---
        const trackingNumber = `HIP-2025-${nanoid(5).toUpperCase()}`;

        // --- Upload Receipt to Supabase Storage ---
        const filePath = `${trackingNumber}-${receiptFile.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from('receipts')
            .upload(filePath, receiptFile);

        if (uploadError) {
            throw new Error(`Storage Error: ${uploadError.message}`);
        }
        
        const { data: { publicUrl: receiptFileUrl } } = supabase.storage
            .from('receipts')
            .getPublicUrl(filePath);

        // --- Save Order to Supabase Database ---
        const { error: dbError } = await supabase.from('orders').insert({
            tracking_number: trackingNumber,
            customer_name: orderData.fullName,
            customer_email: orderData.email,
            customer_phone: orderData.phone,
            shipping_address: orderData.shippingAddress,
            number_of_copies: orderData.copies,
            receipt_file_url: receiptFileUrl,
            join_event: orderData.joinEvent,
            bring_guest: orderData.bringGuest,
            status: 'pending',
        });

        if (dbError) {
            throw new Error(`Database Error: ${dbError.message}`);
        }

        // --- Send Confirmation Emails ---
        const commonEmailProps = {
            trackingNumber,
            customerName: orderData.fullName,
            copies: orderData.copies,
            shippingAddress: orderData.shippingAddress,
            eventDetails: orderData.joinEvent ? `Registered ${orderData.bringGuest ? '(+1 Guest)' : ''}` : 'Not Registered',
        };
        
        // To Customer
        await resend.emails.send({
            from: `Heal in Paradise <orders@healinparadise.com>`, // Use a verified domain
            to: orderData.email,
            subject: `Submission Received for 'Heal in Paradise' Pre-Order #${trackingNumber}`,
            // FIX: Use React.createElement to construct the email component without using JSX syntax in a .ts file.
            react: React.createElement(CustomerConfirmationEmail, commonEmailProps),
        });

        // To Admin
        await resend.emails.send({
            from: `New Pre-Order <system@healinparadise.com>`,
            to: adminEmail,
            subject: `New Pre-Order Received: ${orderData.fullName} (#${trackingNumber})`,
            // FIX: Use React.createElement to construct the email component without using JSX syntax in a .ts file.
            react: React.createElement(AdminNotificationEmail, { ...commonEmailProps, receiptUrl: receiptFileUrl, email: orderData.email, phone: orderData.phone }),
        });

        return new Response(JSON.stringify({ success: true, trackingNumber }), { status: 200 });

    } catch (error: any) {
        console.error('Submission Error:', error);
        return new Response(JSON.stringify({ message: error.message || 'An internal server error occurred.' }), { status: 500 });
    }
};

// Vercel config to increase body size limit for file uploads
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
