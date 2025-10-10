import { createClient } from '@supabase/supabase-js';

export const config = {
    runtime: 'edge',
};

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async (req: Request) => {
    if (req.method !== 'POST') {
        return new Response(
            JSON.stringify({ message: 'Method Not Allowed' }), 
            { status: 405, headers: { 'Content-Type': 'application/json' } }
        );
    }

    try {
        const formData = await req.formData();
        const receiptFile = formData.get('receipt') as File;
        const trackingNumber = formData.get('trackingNumber') as string;
        const email = formData.get('email') as string;

        if (!receiptFile || !trackingNumber || !email) {
            return new Response(
                JSON.stringify({ message: 'Missing required fields.' }), 
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        if (receiptFile.size > 5 * 1024 * 1024) {
            return new Response(
                JSON.stringify({ message: 'Receipt file size exceeds 5MB.' }), 
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { data: order, error: findError } = await supabase
            .from('orders')
            .select('id')
            .eq('tracking_number', trackingNumber)
            .eq('customer_email', email)
            .eq('status', 'pending_payment')
            .single();

        if (findError || !order) {
            return new Response(
                JSON.stringify({ message: 'Order not found or payment already submitted.' }), 
                { status: 404, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const filePath = `${trackingNumber}-${receiptFile.name}`;
        const { error: uploadError } = await supabase.storage
            .from('receipts')
            .upload(filePath, receiptFile, { upsert: true });

        if (uploadError) {
            console.error('Storage Error:', uploadError);
            return new Response(
                JSON.stringify({ message: `Storage Error: ${uploadError.message}` }), 
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { data: { publicUrl: receiptFileUrl } } = supabase.storage
            .from('receipts')
            .getPublicUrl(filePath);

        const { error: dbError } = await supabase
            .from('orders')
            .update({
                receipt_file_url: receiptFileUrl,
                status: 'pending',
            })
            .eq('id', order.id);

        if (dbError) {
            console.error('Database Error:', dbError);
            return new Response(
                JSON.stringify({ message: `Database Error: ${dbError.message}` }), 
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Receipt uploaded successfully.' }), 
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        );

    } catch (error: any) {
        console.error('Receipt Upload Error:', error);
        return new Response(
            JSON.stringify({ message: error.message || 'An internal server error occurred.' }), 
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
};
