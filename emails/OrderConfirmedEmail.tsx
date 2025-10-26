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
} from 'https://esm.sh/@react-email/components@0.0.15';
import React from 'https://esm.sh/react@18.2.0';

interface EmailProps {
  customerName: string;
  trackingNumber: string;
}

const baseUrl = 'https://www.healinparadise.com'; 

export const OrderConfirmedEmail = ({
  customerName,
  trackingNumber,
}: EmailProps) => (
  <Html>
    <Head />
    <Preview>Action Required: Complete your 'Heal in Paradise' Pre-Order</Preview>
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
              Your Order Details are Saved!
            </Heading>
          </Section>
          <Text className="text-dark-slate text-[16px] leading-[24px]">
            Dear {customerName},
          </Text>
          <Text className="text-dark-slate text-[16px] leading-[24px]">
            Thank you for your pre-order for 'Heal in Paradise'! Your order details have been successfully saved.
          </Text>
           <Text className="text-dark-slate text-[16px] font-bold leading-[24px]">
            Your tracking number is: <span className="font-mono text-coral">{trackingNumber}</span>
          </Text>

          <Section className="bg-sand/50 border border-solid border-coral/20 rounded-lg p-5 my-5 text-center">
            <Heading as="h2" className="text-dark-slate text-[20px] font-semibold font-heading m-0 mb-4">
              Next Step: Payment
            </Heading>
            <Text className="text-[14px] leading-[22px] m-0">
              To finalize your order, please click the link below to make your payment and upload the receipt.
            </Text>
             <Link
              className="bg-coral text-white font-semibold rounded-md text-[14px] py-3 px-5 no-underline text-center inline-block mt-4"
              href={`${baseUrl}/order/${trackingNumber}`}
              target="_blank"
            >
              Complete Your Order Now
            </Link>
          </Section>
          
          <Text className="text-dark-slate text-[16px] leading-[24px]">
            You can also visit the 'Track Your Order' page on our website at any time and enter your tracking number and email to check your status. Please note that deliveries will commence after the official book launch on November 4th, 2025.
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

export default OrderConfirmedEmail;