// Manually declare Deno namespace as it's not available in the global scope during type checking.
declare namespace Deno {
  const env: {
    get: (key: string) => string | undefined;
  };
}

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Resend } from 'https://esm.sh/resend@3.2.0';
import CustomerConfirmationEmail from './CustomerConfirmationEmail.tsx';
import AdminNotificationEmail from './AdminNotificationEmail.tsx';
import OrderConfirmedEmail from './OrderConfirmedEmail.tsx';


const resendApiKey = Deno.env.get('RESEND_API_KEY')!;
const adminEmail = Deno.env.get('ADMIN_EMAIL')!;

serve(async (req: Request) => {
  if (req.method === 'HEAD') {
    return new Response(null, { status: 204 });
  }

  if (!resendApiKey || !adminEmail) {
    console.error("Missing environment variables: RESEND_API_KEY or ADMIN_EMAIL");
    return new Response(JSON.stringify({ message: 'Server configuration error.' }), { status: 500 });
  }

  try {
    const payload = await req.json();
    
    // --- ROUTE 1: New order created, needs payment ---
    if (payload.type === 'INSERT' && payload.record?.status === 'pending_payment') {
        const order = payload.record;
        const resend = new Resend(resendApiKey);

        await resend.emails.send({
          from: 'Heal in Paradise <orders@healinparadise.com>',
          to: order.customer_email,
          subject: `Action Required: Complete Your 'Heal in Paradise' Pre-Order #${order.tracking_number}`,
          react: OrderConfirmedEmail({
              customerName: order.customer_name,
              trackingNumber: order.tracking_number
          }),
        });

    // --- ROUTE 2: Receipt uploaded, order is pending verification ---
    } else if (payload.type === 'UPDATE' && payload.old_record?.status === 'pending_payment' && payload.record?.status === 'pending') {
        const order = payload.record;
        const resend = new Resend(resendApiKey);

        const commonEmailProps = {
            trackingNumber: order.tracking_number,
            customerName: order.customer_name,
            copies: order.number_of_copies,
            shippingAddress: order.shipping_address,
            eventDetails: order.join_event ? `Registered ${order.bring_guest ? '(+1 Guest)' : ''}` : 'Not Registered',
        };

        await Promise.all([
          // 1. Send "receipt received" email to the customer
          resend.emails.send({
              from: 'Heal in Paradise <orders@healinparadise.com>',
              to: order.customer_email,
              subject: `Submission Received for 'Heal in Paradise' Pre-Order #${order.tracking_number}`,
              react: CustomerConfirmationEmail(commonEmailProps),
          }),
          // 2. Send notification email to the admin
          resend.emails.send({
              from: `New Pre-Order <system@healinparadise.com>`,
              to: adminEmail,
              subject: `Receipt Uploaded: ${order.customer_name} (#${order.tracking_number})`,
              react: AdminNotificationEmail({
                  ...commonEmailProps,
                  receiptUrl: order.receipt_file_url,
                  email: order.customer_email,
                  phone: order.customer_phone
              }),
          })
        ]);
    } else {
        console.log('Webhook received, but not a relevant INSERT or UPDATE event. Ignoring.');
        return new Response(JSON.stringify({ message: 'Irrelevant event type.' }), { status: 200 });
    }
    
    return new Response(JSON.stringify({ success: true, message: 'Emails processed.' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error('Function Error:', error);
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return new Response(JSON.stringify({ message }), { status: 500 });
  }
});
