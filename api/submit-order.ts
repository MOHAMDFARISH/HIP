import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { nanoid } from 'nanoid';

// --- HTML Email Templates ---

const generateCustomerEmail = (data: {
  customerName: string;
  trackingNumber: string;
  copies: number;
  shippingAddress: string;
  eventDetails: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F4E9D8; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F4E9D8; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: white; border-radius: 10px; border: 2px solid #FF7F50; padding: 40px;">
          <!-- Header with Logo -->
          <tr>
            <td align="center" style="padding-bottom: 30px;">
              <img src="https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto/v1759086831/android-chrome-192x192_t34m0h.png" alt="Heal in Paradise" width="80" height="80" style="display: block;">
              <h1 style="color: #2F4F4F; font-size: 28px; margin: 20px 0 0 0;">Thank You For Your Order!</h1>
            </td>
          </tr>
          
          <!-- Greeting -->
          <tr>
            <td style="color: #2F4F4F; font-size: 16px; line-height: 24px; padding: 0 0 20px 0;">
              Dear ${data.customerName},
            </td>
          </tr>
          
          <!-- Message -->
          <tr>
            <td style="color: #2F4F4F; font-size: 16px; line-height: 24px; padding: 0 0 30px 0;">
              We are overjoyed to confirm your pre-order for 'Heal in Paradise'! You've secured your copy of the first Maldivian literary souvenir, and we can't wait for you to experience this journey of hope and healing.
            </td>
          </tr>
          
          <!-- Tracking Number Box -->
          <tr>
            <td style="background-color: #FFF5F0; border-left: 4px solid #FF7F50; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #2F4F4F; font-weight: bold;">Your Tracking Number:</p>
              <p style="margin: 0; color: #FF7F50; font-size: 24px; font-weight: bold; font-family: monospace;">${data.trackingNumber}</p>
            </td>
          </tr>
          
          <!-- Order Details -->
          <tr>
            <td style="padding: 30px 0 0 0;">
              <h2 style="color: #2F4F4F; font-size: 20px; margin: 0 0 15px 0;">Your Order Summary</h2>
              <p style="margin: 10px 0; color: #2F4F4F;"><strong>Copies:</strong> ${data.copies}</p>
              <p style="margin: 10px 0; color: #2F4F4F;"><strong>Shipping Address:</strong><br>${data.shippingAddress.replace(/\n/g, '<br>')}</p>
              <p style="margin: 10px 0; color: #2F4F4F;"><strong>Book Signing Event (Oct 28):</strong> ${data.eventDetails}</p>
            </td>
          </tr>
          
          <!-- Next Steps -->
          <tr>
            <td style="color: #2F4F4F; font-size: 16px; line-height: 24px; padding: 30px 0 0 0;">
              You can use your tracking number on our website to check the status of your order at any time. Please note that deliveries will commence after the official book launch on October 28th, 2025.
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #FF7F50; padding-top: 30px; margin-top: 30px;">
              <p style="text-align: center; color: #666; font-size: 12px; margin: 5px 0;">© ${new Date().getFullYear()} Hawla Riza | Heal in Paradise</p>
              <p style="text-align: center; color: #666; font-size: 12px; margin: 5px 0;">Contact: info@healinparadise.com</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

const generateAdminEmail = (data: {
  customerName: string;
  trackingNumber: string;
  copies: number;
  shippingAddress: string;
  eventDetails: string;
  receiptUrl: string;
  email: string;
  phone: string;
}) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>New Pre-Order</title>
</head>
<body style="margin: 0; padding: 20px; background-color: #f5f5f5; font-family: Arial, sans-serif;">
  <table width="600" cellpadding="0" cellspacing="0" style="margin: 0 auto; background-color: white; border: 1px solid #ddd; padding: 30px;">
    <tr>
      <td>
        <h1 style="color: #333; font-size: 24px; margin: 0 0 20px 0;">New Pre-Order Received</h1>
        <p style="color: #666; margin: 0 0 20px 0;">A new pre-order has been placed for 'Heal in Paradise'.</p>
        
        <h2 style="color: #FF7F50; font-size: 18px; margin: 20px 0 10px 0;">Order Details</h2>
        <table width="100%" cellpadding="8" cellspacing="0" style="border: 1px solid #ddd;">
          <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd;"><strong>Tracking Number:</strong></td>
            <td style="border: 1px solid #ddd; font-family: monospace; color: #FF7F50;">${data.trackingNumber}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd;"><strong>Customer Name:</strong></td>
            <td style="border: 1px solid #ddd;">${data.customerName}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="border: 1px solid #ddd;">${data.email}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd;"><strong>Phone:</strong></td>
            <td style="border: 1px solid #ddd;">${data.phone}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd;"><strong>Copies:</strong></td>
            <td style="border: 1px solid #ddd;">${data.copies}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd;"><strong>Shipping Address:</strong></td>
            <td style="border: 1px solid #ddd;">${data.shippingAddress.replace(/\n/g, '<br>')}</td>
          </tr>
          <tr style="background-color: #f9f9f9;">
            <td style="border: 1px solid #ddd;"><strong>Book Signing Event:</strong></td>
            <td style="border: 1px solid #ddd;">${data.eventDetails}</td>
          </tr>
        </table>
        
        <p style="margin: 30px 0 20px 0; text-align: center;">
          <a href="${data.receiptUrl}" style="background-color: #FF7F50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">View Payment Receipt</a>
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
`;


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
        const customerEmailHtml = generateCustomerEmail({
            customerName: orderData.fullName,
            trackingNumber,
            copies: orderData.copies,
            shippingAddress: orderData.shippingAddress,
            eventDetails: orderData.joinEvent ? `Registered ${orderData.bringGuest ? '(+1 Guest)' : ''}` : 'Not Registered'
        });

        const adminEmailHtml = generateAdminEmail({
            customerName: orderData.fullName,
            trackingNumber,
            copies: orderData.copies,
            shippingAddress: orderData.shippingAddress,
            eventDetails: orderData.joinEvent ? `Registered ${orderData.bringGuest ? '(+1 Guest)' : ''}` : 'Not Registered',
            receiptUrl: receiptFileUrl,
            email: orderData.email,
            phone: orderData.phone
        });
        
        // To Customer
        await resend.emails.send({
            from: `Heal in Paradise <orders@healinparadise.com>`,
            to: orderData.email,
            subject: `Your 'Heal in Paradise' Pre-Order is Confirmed! #${trackingNumber}`,
            html: customerEmailHtml,
        });

        // To Admin
        await resend.emails.send({
            from: `New Pre-Order <system@healinparadise.com>`,
            to: adminEmail,
            subject: `New Pre-Order Received: ${orderData.fullName} (#${trackingNumber})`,
            html: adminEmailHtml,
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