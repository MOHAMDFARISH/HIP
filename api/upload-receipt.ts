
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async (req: Request) => {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ message: 'Method Not Allowed' }), { status: 405 });
    }

    try {
        const formData = await req.formData();
        const receiptFile = formData.get('receipt') as File;
        const trackingNumber = formData.get('trackingNumber') as string;
        const email = formData.get('email') as string;

        // --- Server-side Validation ---
        if (!receiptFile || !trackingNumber || !email) {
            return new Response(JSON.stringify({ message: 'Missing required fields.' }), { status: 400 });
        }
        if (receiptFile.size > 5 * 1024 * 1024) { // 5MB limit
            return new Response(JSON.stringify({ message: 'Receipt file size exceeds 5MB.' }), { status: 400 });
        }

        // --- Verify Order Exists and is Awaiting Payment ---
        const { data: order, error: findError } = await supabase
            .from('orders')
            .select('id')
            .eq('tracking_number', trackingNumber)
            .eq('customer_email', email)
            .eq('status', 'pending_payment')
            .single();

        if (findError || !order) {
            return new Response(JSON.stringify({ message: 'Order not found or payment already submitted.' }), { status: 404 });
        }

        // --- Upload Receipt to Supabase Storage ---
        const filePath = `${trackingNumber}-${receiptFile.name}`;
        const { error: uploadError } = await supabase.storage
            .from('receipts')
            .upload(filePath, receiptFile, { upsert: true }); // Use upsert to allow re-uploads

        if (uploadError) {
            throw new Error(`Storage Error: ${uploadError.message}`);
        }
        
        const { data: { publicUrl: receiptFileUrl } } = supabase.storage
            .from('receipts')
            .getPublicUrl(filePath);

        // --- Update Order in Database ---
        // This update will trigger the Edge Function to send confirmation emails.
        const { error: dbError } = await supabase
            .from('orders')
            .update({
                receipt_file_url: receiptFileUrl,
                status: 'pending', // Update status to pending verification
            })
            .eq('id', order.id);

        if (dbError) {
            throw new Error(`Database Error: ${dbError.message}`);
        }

        return new Response(JSON.stringify({ success: true, message: 'Receipt uploaded successfully.' }), { status: 200 });

    } catch (error: any) {
        console.error('Receipt Upload Error:', error);
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