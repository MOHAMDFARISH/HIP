import React from 'react';

interface CustomerEmailProps {
  customerName: string;
  trackingNumber: string;
  copies: number;
  shippingAddress: string;
  eventDetails: string;
}

const CustomerConfirmationEmail: React.FC<CustomerEmailProps> = ({
  customerName,
  trackingNumber,
  copies,
  shippingAddress,
  eventDetails,
}) => {

  // Inline styles for maximum email client compatibility
  const bodyStyle: React.CSSProperties = { fontFamily: "'Lato', Arial, sans-serif", margin: 0, padding: 0, backgroundColor: '#F4E9D8' };
  const containerStyle: React.CSSProperties = { maxWidth: '600px', margin: '40px auto', backgroundColor: '#ffffff', border: '1px solid #FF7F5033', borderRadius: '8px', padding: '20px' };
  const headerStyle: React.CSSProperties = { textAlign: 'center', marginTop: '32px' };
  const headingStyle: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#2F4F4F', fontSize: '28px', fontWeight: 'bold', margin: '30px 0' };
  const textStyle: React.CSSProperties = { color: '#2F4F4F', fontSize: '16px', lineHeight: '24px' };
  const summarySectionStyle: React.CSSProperties = { backgroundColor: '#fcf8f2', border: '1px solid #FF7F5033', borderRadius: '8px', padding: '20px', margin: '20px 0' };
  const summaryHeadingStyle: React.CSSProperties = { fontFamily: "'Cormorant Garamond', Georgia, serif", color: '#2F4F4F', fontSize: '20px', fontWeight: 600, margin: '0 0 16px 0' };
  const summaryTextStyle: React.CSSProperties = { fontSize: '14px', lineHeight: '22px', margin: 0 };
  const trackingNumberStyle: React.CSSProperties = { fontFamily: 'monospace', color: '#FF7F50' };
  const hrStyle: React.CSSProperties = { border: 0, borderTop: '1px solid #FF7F5033', margin: '26px 0' };
  const footerStyle: React.CSSProperties = { color: '#2F4F4F99', fontSize: '12px', lineHeight: '24px' };

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body style={bodyStyle}>
        <div style={containerStyle}>
          <div style={headerStyle}>
            <img src="https://res.cloudinary.com/dmtolfhsv/image/upload/f_auto,q_auto,w_auto/v1759086831/android-chrome-192x192_t34m0h.png" width="80" height="80" alt="Heal in Paradise Logo" />
            <h1 style={headingStyle}>Thank You For Your Order!</h1>
          </div>
          <p style={textStyle}>Dear {customerName},</p>
          <p style={textStyle}>We are overjoyed to confirm your pre-order for 'Heal in Paradise'! You've secured your copy of the first Maldivian literary souvenir, and we can't wait for you to experience this journey of hope and healing.</p>
          <div style={summarySectionStyle}>
            <h2 style={summaryHeadingStyle}>Your Order Summary</h2>
            <p style={summaryTextStyle}><strong>Tracking Number:</strong> <span style={trackingNumberStyle}>{trackingNumber}</span></p>
            <p style={summaryTextStyle}><strong>Copies:</strong> {copies}</p>
            <p style={{...summaryTextStyle, marginTop: '8px'}}><strong>Shipping Address:</strong><br />{shippingAddress.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}</p>
            <p style={{...summaryTextStyle, marginTop: '8px'}}><strong>Book Signing Event (Oct 28):</strong> {eventDetails}</p>
          </div>
          <p style={textStyle}>You can use your tracking number on our website to check the status of your order at any time. Please note that deliveries will commence after the official book launch on October 28th, 2025.</p>
          <hr style={hrStyle} />
          <p style={footerStyle}>&copy; {new Date().getFullYear()} Hawla Riza | Heal in Paradise</p>
        </div>
      </body>
    </html>
  );
};

export default CustomerConfirmationEmail;
