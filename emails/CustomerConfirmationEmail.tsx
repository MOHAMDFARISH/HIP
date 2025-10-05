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
  Tailwind,
} from '@react-email/components';

export interface CustomerEmailProps {
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
    <Preview>Your 'Heal in Paradise' Pre-Order is Confirmed!</Preview>
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
              Thank You For Your Order!
            </Heading>
          </Section>
          <Text className="text-dark-slate text-[16px] leading-[24px]">
            Dear {customerName},
          </Text>
          <Text className="text-dark-slate text-[16px] leading-[24px]">
            We are overjoyed to confirm your pre-order for 'Heal in Paradise'! You've secured your copy of the first Maldivian literary souvenir, and we can't wait for you to experience this journey of hope and healing.
          </Text>

          <Section className="bg-sand/50 border border-solid border-coral/20 rounded-lg p-5 my-5">
            <Heading as="h2" className="text-dark-slate text-[20px] font-semibold font-heading m-0 mb-4">
              Your Order Summary
            </Heading>
            <Text className="text-[14px] leading-[22px] m-0"><strong>Tracking Number:</strong> <span className="font-mono text-coral">{trackingNumber}</span></Text>
            <Text className="text-[14px] leading-[22px] m-0"><strong>Copies:</strong> {copies}</Text>
            <Text className="text-[14px] leading-[22px] m-0 mt-2"><strong>Shipping Address:</strong><br/>{shippingAddress.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}</Text>
             <Text className="text-[14px] leading-[22px] m-0 mt-2"><strong>Book Signing Event (Oct 28):</strong> {eventDetails}</Text>
          </Section>
          
          <Text className="text-dark-slate text-[16px] leading-[24px]">
            You can use your tracking number on our website to check the status of your order at any time. Please note that deliveries will commence after the official book launch on October 28th, 2025.
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
