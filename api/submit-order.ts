
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { nanoid } from 'nanoid';

// This is a serverless function, so we can safely use environment variables
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;
const resendApiKey = process.env.RESEND_API_KEY!;
const adminEmail = process.env.ADMIN_EMAIL!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);
const resend = new Resend(resendApiKey);

// --- Email Template Generators ---

const generateCustomerEmailHtml = (props: {
  customerName: string;
  trackingNumber: string;
  copies: number;
  shippingAddress: string;
  eventDetails: string;
}) => {
  const { customerName, trackingNumber, copies, shippingAddress, eventDetails } = props;
  const formattedAddress = shippingAddress.replace(/\n/g, '<br>');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: 'Lato', Arial, sans-serif; margin: 0; padding: 0; background-color: #F4E9D8; }
  .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #FF7F5033; border-radius: 8px; padding: 20px; }
  .header { text-align: center; margin-top: 32px; }
  .heading { font-family: 'Cormorant Garamond', Georgia, serif; color: #2F4F4F; font-size: 28px; font-weight: bold; margin: 30px 0; }
  .text { color: #2F4F4F; font-size: 16px; line-height: 24px; }
  .summary-section { background-color: #fcf8f2; border: 1px solid #FF7F5033; border-radius: 8px; padding: 20px; margin: 20px 0; }
  .summary-heading { font-family: 'Cormorant Garamond', Georgia, serif; color: #2F4F4F; font-size: 20px; font-weight: 600; margin: 0 0 16px 0; }
  .summary-text { font-size: 14px; line-height: 22px; margin: 0; }
  .tracking-number { font-family: monospace; color: #FF7F50; }
  .hr { border: 0; border-top: 1px solid #FF7F5033; margin: 26px 0; }
  .footer { color: #2F4F4F99; font-size: 12px; line-height: 24px; }
</style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_auto/v1759086831/android-chrome-192x192_t34m0h.png" width="80" height="80" alt="Heal in Paradise Logo">
      <h1 class="heading">Thank You For Your Order!</h1>
    </div>
    <p class="text">Dear ${customerName},</p>
    <p class="text">We are overjoyed to confirm your pre-order for 'Heal in Paradise'! You've secured your copy of the first Maldivian literary souvenir, and we can't wait for you to experience this journey of hope and healing.</p>
    <div class="summary-section">
      <h2 class="summary-heading">Your Order Summary</h2>
      <p class="summary-text"><strong>Tracking Number:</strong> <span class="tracking-number">${trackingNumber}</span></p>
      <p class="summary-text"><strong>Copies:</strong> ${copies}</p>
      <p class="summary-text" style="margin-top: 8px;"><strong>Shipping Address:</strong><br>${formattedAddress}</p>
      <p class="summary-text" style="margin-top: 8px;"><strong>Book Signing Event (Oct 28):</strong> ${eventDetails}</p>
    </div>
    <p class="text">You can use your tracking number on our website to check the status of your order at any time. Please note that deliveries will commence after the official book launch on October 28th, 2025.</p>
    <hr class="hr">
    <p class="footer">&copy; ${new Date().getFullYear()} Hawla Riza | Heal in Paradise</p>
  </div>
</body>
</html>`;
};

const generateAdminEmailHtml = (props: {
  customerName: string;
  trackingNumber: string;
  copies: number;
  shippingAddress: string;
  eventDetails: string;
  receiptUrl: string;
  email: string;
  phone: string;
}) => {
  const { customerName, trackingNumber, copies, shippingAddress, eventDetails, receiptUrl, email, phone } = props;
  const formattedAddress = shippingAddress.replace(/\n/g, '<br>');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
  .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 8px; padding: 20px; }
  .heading { font-size: 24px; font-weight: normal; text-align: center; margin: 30px 0; }
  .text { font-size: 14px; line-height: 24px; color: #333333; }
  .details-heading { font-size: 16px; font-weight: 600; color: #333333;}
  .hr { border: 0; border-top: 1px solid #eaeaea; margin: 26px 0; }
  .button-container { text-align: center; margin: 32px 0; }
  .button { background-color: #FF7F50; color: #ffffff; font-weight: 600; border-radius: 6px; font-size: 14px; padding: 12px 20px; text-decoration: none; display: inline-block; }
</style>
</head>
<body>
  <div class="container">
    <h1 class="heading">New Pre-Order Notification</h1>
    <p class="text">A new pre-order has been placed for 'Heal in Paradise'.</p>
    <hr class="hr">
    <div>
      <p class="details-heading">Order Details:</p>
      <p class="text" style="margin: 0;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
      <p class="text" style="margin: 0;"><strong>Customer Name:</strong> ${customerName}</p>
      <p class="text" style="margin: 0;"><strong>Email:</strong> ${email}</p>
      <p class="text" style="margin: 0;"><strong>Phone:</strong> ${phone}</p>
      <p class="text" style="margin: 0;"><strong>Copies:</strong> ${copies}</p>
      <p class="text" style="margin-top: 8px;"><strong>Shipping Address:</strong><br>${formattedAddress}</p>
      <p class="text" style="margin-top: 8px;"><strong>Book Signing Event:</strong> ${eventDetails}</p>
    </div>
    <div class="button-container">
      <a href="${receiptUrl}" target="_blank" class="button">View Payment Receipt</a>
    </div>
  </div>
</body>
</html>`;
};


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
            from: `Heal in Paradise <orders@healinparadise.com>`,
            to: orderData.email,
            subject: `Your 'Heal in Paradise' Pre-Order is Confirmed! #${trackingNumber}`,
            html: generateCustomerEmailHtml(commonEmailProps),
        });

        // To Admin
        await resend.emails.send({
            from: `New Pre-Order <system@healinparadise.com>`,
            to: adminEmail,
            subject: `New Pre-Order Received: ${orderData.fullName} (#${trackingNumber})`,
            html: generateAdminEmailHtml({ ...commonEmailProps, receiptUrl: receiptFileUrl, email: orderData.email, phone: orderData.phone }),
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
