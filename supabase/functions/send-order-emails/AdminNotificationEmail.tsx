import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
  Link,
  Tailwind,
} from 'https://esm.sh/@react-email/components@0.0.15';
import React from 'https://esm.sh/react@18.2.0';

interface EmailProps {
  customerName: string;
  trackingNumber: string;
  copies: number;
  shippingAddress: string;
  eventDetails: string;
  receiptUrl: string;
  email: string;
  phone: string;
}

export const AdminNotificationEmail = ({
  customerName,
  trackingNumber,
  copies,
  shippingAddress,
  eventDetails,
  receiptUrl,
  email,
  phone,
}: EmailProps) => (
  <Html>
    <Head />
    <Preview>New Order Received: {customerName}</Preview>
    <Tailwind>
      <Body className="bg-gray-100 my-auto mx-auto font-sans">
        <Container className="border border-solid border-gray-300 rounded my-[40px] mx-auto p-[20px] max-w-[600px] bg-white">
          <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
            New Order Notification
          </Heading>
          <Text className="text-black text-[14px] leading-[24px]">
            A new order has been placed for 'Heal in Paradise'.
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

export default AdminNotificationEmail;