// Since this is a serverless function, we use the server-side client
import { supabase } from '../lib/supabaseClient';

/**
 * Generates a unique tracking number for a new order.
 * Format: HIP-2025-XXXXX
 */
const generateTrackingNumber = (): string => {
    const prefix = 'HIP-2025-';
    // Generates a 5-character random alphanumeric string
    const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `${prefix}${randomPart}`;
};

/**
 * Vercel Serverless Function to handle pre-order submissions.
 * This function processes form data, uploads a file to Supabase Storage,
 * and inserts a new order record into the Supabase database.
 */
export default async (req: Request) => {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Method Not Allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json', 'Allow': 'POST' },
        });
    }

    try {
        const formData = await req.formData();
        
        const fullName = formData.get('fullName') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const shippingAddress = formData.get('shippingAddress') as string;
        const copiesStr = formData.get('copies') as string;
        const joinEvent = formData.get('joinEvent') === 'true';
        const bringGuest = formData.get('bringGuest') === 'true';
        const receiptFile = formData.get('receipt') as File | null;

        // --- Basic Server-Side Validation ---
        if (!fullName || !email || !phone || !shippingAddress || !copiesStr || !receiptFile) {
             return new Response(JSON.stringify({ message: 'Missing required form fields.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        
        const copies = parseInt(copiesStr, 10);
        if (isNaN(copies) || copies < 1) {
             return new Response(JSON.stringify({ message: 'Invalid number of copies.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        // --- Step 1: Generate a unique tracking number ---
        const trackingNumber = generateTrackingNumber();

        // --- Step 2: Upload receipt to Supabase Storage ---
        // We use the tracking number in the file path to ensure uniqueness.
        const filePath = `receipts/${trackingNumber}-${receiptFile.name}`;
        const { error: uploadError } = await supabase.storage
            .from('order-receipts') // ASSUMPTION: A bucket named 'order-receipts' exists and is public.
            .upload(filePath, receiptFile);

        if (uploadError) {
            console.error('Supabase Storage Error:', uploadError);
            throw new Error('Failed to upload payment receipt.');
        }

        // Retrieve the public URL for the uploaded file.
        const { data: { publicUrl: receiptUrl } } = supabase.storage
            .from('order-receipts')
            .getPublicUrl(filePath);
        
        if (!receiptUrl) {
            throw new Error('Could not get public URL for the uploaded receipt.');
        }

        // --- Step 3: Insert order into Supabase database ---
        const { error: insertError } = await supabase
            .from('orders')
            .insert({
                tracking_number: trackingNumber,
                customer_name: fullName,
                customer_email: email,
                phone_number: phone,
                shipping_address: shippingAddress,
                number_of_copies: copies,
                join_event: joinEvent,
                bring_guest: bringGuest,
                receipt_url: receiptUrl,
                status: 'pending', // Set initial status for new orders
            });
        
        if (insertError) {
            console.error('Supabase Insert Error:', insertError);
            // Clean up by removing the uploaded file if the database insert fails, to prevent orphaned files.
            await supabase.storage.from('order-receipts').remove([filePath]);
            throw new Error('Failed to save your order. Please try again.');
        }

        // --- Step 4: Return success response with tracking number ---
        return new Response(JSON.stringify({ trackingNumber: trackingNumber }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error: any) {
        console.error('Submit Order Error:', error);
        return new Response(JSON.stringify({ message: error.message || 'An internal server error occurred.' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
