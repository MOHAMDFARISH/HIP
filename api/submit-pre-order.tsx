import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { nanoid } from 'nanoid';
import * as React from 'react';
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Link,
  Tailwind,
} from '@react-email/components';

// --- INLINED EMAIL COMPONENT: CustomerConfirmationEmail ---

interface CustomerEmailProps {
  customerName: string;
  trackingNumber: string;
  copies: number;
  shippingAddress: string;
  eventDetails: string;
}

const CustomerConfirmationEmail = ({
  customerName,
  trackingNumber,
  copies,
  shippingAddress,
  eventDetails
}: CustomerEmailProps) => (
  <Html>
    <Head />
    <Preview>Your 'Heal in Paradise' pre-order submission has been received.</Preview>
    <Tailwind>
      <Body className="bg-sand my-auto mx-auto font-sans">
        <Container className="border border-solid border-coral/30 rounded my-[40px] mx-auto p-[20px] max-w-[600px] bg-white">
          <Section className="mt-[32px] text-center">
            <Img
              src="https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_auto/v1759086831/android-chrome-192x192_t34m0h.png"
              width="80"
              height="80"
              alt="Heal in Paradise Logo"
              className="my-0 mx-auto"
            />
            <Heading className="text-dark-slate text-[28px] font-bold font-heading p-0 my-[30px] mx-0">
              Your Pre-Order Submission is Received
            </Heading>
          </Section>
          <Text className="text-dark-slate text-[16px] leading-[24px]">
            Dear {customerName},
          </Text>
          <Text className="text-dark-slate text-[16px] leading-[24px]">
            Thank you for submitting your pre-order for 'Heal in Paradise'. This email is to confirm we have successfully received your submission.
          </Text>
           <Text className="text-dark-slate text-[16px] leading-[24px]">
            <strong>Please note: This is not your final order confirmation.</strong> Our team is now verifying your payment details. Once your payment is confirmed, you will receive a separate email officially confirming your order and its details.
          </Text>

          <Section className="bg-sand/50 border border-solid border-coral/20 rounded-lg p-5 my-5">
            <Heading as="h2" className="text-dark-slate text-[20px] font-semibold font-heading m-0 mb-4">
              Your Submission Summary
            </Heading>
            <Text className="text-[14px] leading-[22px] m-0"><strong>Tracking Number:</strong> <span className="font-mono text-coral">{trackingNumber}</span></Text>
            <Text className="text-[14px] leading-[22px] m-0"><strong>Copies:</strong> {copies}</Text>
            <Text className="text-[14px] leading-[22px] m-0 mt-2"><strong>Shipping Address:</strong><br/>{shippingAddress.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</Text>
             <Text className="text-[14px] leading-[22px] m-0 mt-2"><strong>Book Signing Event (Oct 28):</strong> {eventDetails}</Text>
          </Section>
          
          <Text className="text-dark-slate text-[16px] leading-[24px]">
            You can use your tracking number on our website to check the status of your submission. Please note that deliveries will commence after the official book launch on October 28th, 2025.
          </Text>
          
          <Hr className="border border-solid border-coral/20 my-[26px] mx-0 w-full" />

          <Text className="text-dark-slate/70 text-[12px] leading-[24px]">
            © {new Date().getFullYear()} Hawla Riza | Heal in Paradise
          </Text>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);


// --- INLINED EMAIL COMPONENT: AdminNotificationEmail ---

interface AdminEmailProps {
  customerName: string;
  trackingNumber: string;
  copies: number;
  shippingAddress: string;
  eventDetails: string;
  receiptUrl: string;
  email: string;
  phone: string;
}

const AdminNotificationEmail = ({
  customerName,
  trackingNumber,
  copies,
  shippingAddress,
  eventDetails,
  receiptUrl,
  email,
  phone,
}: AdminEmailProps) => (
  <Html>
    <Head />
    <Preview>New Pre-Order Received: {customerName}</Preview>
    <Tailwind>
      <Body className="bg-gray-100 my-auto mx-auto font-sans">
        <Container className="border border-solid border-gray-300 rounded my-[40px] mx-auto p-[20px] max-w-[600px] bg-white">
          <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
            New Pre-Order Notification
          </Heading>
          <Text className="text-black text-[14px] leading-[24px]">
            A new pre-order has been placed for 'Heal in Paradise'.
          </Text>
          <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />
          <Section>
            <Text className="text-[16px] font-medium text-black">Order Details:</Text>
            <Text className="text-[14px] leading-[22px] m-0"><strong>Tracking Number:</strong> {trackingNumber}</Text>
            <Text className="text-[14px] leading-[22px] m-0"><strong>Customer Name:</strong> {customerName}</Text>
            <Text className="text-[14px] leading-[22px] m-0"><strong>Email:</strong> {email}</Text>
            <Text className="text-[14px] leading-[22px] m-0"><strong>Phone:</strong> {phone}</Text>
            <Text className="text-[14px] leading-[22px] m-0"><strong>Copies:</strong> {copies}</Text>
            <Text className="text-[14px] leading-[22px] m-0 mt-2"><strong>Shipping Address:</strong><br/>{shippingAddress.split('\n').map((line, i) => <span key={i}>{line}<br/></span>)}</Text>
            <Text className="text-[14px] leading-[22px] m-0 mt-2"><strong>Book Signing Event:</strong> {eventDetails}</Text>
          </Section>

          <Section className="text-center mt-[32px] mb-[32px]">
            <Link
              className="bg-coral text-white font-semibold rounded-md text-[14px] py-3 px-5 no-underline text-center"
              href={receiptUrl}
              target="_blank"
            >
              View Payment Receipt
            </Link>
          </Section>

        </Container>
      </Body>
    </Tailwind>
  </Html>
);


// --- Main Serverless Function Handler ---

// Environment variables are securely accessed on the server
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

        if (!orderData.fullName || !orderData.email || !orderData.phone || !orderData.shippingAddress || !receiptFile) {
            return new Response(JSON.stringify({ message: 'Missing required fields.' }), { status: 400 });
        }
        if (receiptFile.size > 5 * 1024 * 1024) {
            return new Response(JSON.stringify({ message: 'Receipt file size exceeds 5MB.' }), { status: 400 });
        }

        const trackingNumber = `HIP-2025-${nanoid(5).toUpperCase()}`;

        const filePath = `${trackingNumber}-${receiptFile.name}`;
        const { error: uploadError } = await supabase.storage
            .from('receipts')
            .upload(filePath, receiptFile);

        if (uploadError) throw new Error(`Storage Error: ${uploadError.message}`);
        
        const { data: { publicUrl: receiptFileUrl } } = supabase.storage
            .from('receipts')
            .getPublicUrl(filePath);

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

        if (dbError) throw new Error(`Database Error: ${dbError.message}`);

        const commonEmailProps = {
            trackingNumber,
            customerName: orderData.fullName,
            copies: orderData.copies,
            shippingAddress: orderData.shippingAddress,
            eventDetails: orderData.joinEvent ? `Registered ${orderData.bringGuest ? '(+1 Guest)' : ''}` : 'Not Registered',
        };
        
        await resend.emails.send({
            from: `Heal in Paradise <orders@healinparadise.com>`,
            to: orderData.email,
            subject: `Submission Received for 'Heal in Paradise' Pre-Order #${trackingNumber}`,
            react: <CustomerConfirmationEmail {...commonEmailProps} />,
        });

        await resend.emails.send({
            from: `New Pre-Order <system@healinparadise.com>`,
            to: adminEmail,
            subject: `New Pre-Order Received: ${orderData.fullName} (#${trackingNumber})`,
            react: <AdminNotificationEmail {...commonEmailProps} receiptUrl={receiptFileUrl} email={orderData.email} phone={orderData.phone} />,
        });

        return new Response(JSON.stringify({ success: true, trackingNumber }), { status: 200 });

    } catch (error: any) {
        console.error('Submission Error:', error);
        return new Response(JSON.stringify({ message: error.message || 'An internal server error occurred.' }), { status: 500 });
    }
};

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
