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
  Tailwind,
} from 'https://esm.sh/@react-email/components@0.0.15';
import React from 'https://esm.sh/react@18.2.0';

interface EmailProps {
  customerName: string;
  trackingNumber: string;
  copies: number;
  shippingAddress: string;
  eventDetails: string;
}

const baseUrl = 'https://www.healinparadise.com'; // Replace with your live URL

export const CustomerConfirmationEmail = ({
  customerName,
  trackingNumber,
  copies,
  shippingAddress,
  eventDetails
}: EmailProps) => (
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
             <Text className="text-[14px] leading-[22px] m-0 mt-2"><strong>Book Signing Event (Nov 4):</strong> {eventDetails}</Text>
          </Section>
          
          <Text className="text-dark-slate text-[16px] leading-[24px]">
            You can use your tracking number on our website to check the status of your submission. Please note that deliveries will commence after the official book launch on November 4th, 2025.
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

export default CustomerConfirmationEmail;