import React from 'react';

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

const AdminNotificationEmail: React.FC<AdminEmailProps> = ({
  customerName,
  trackingNumber,
  copies,
  shippingAddress,
  eventDetails,
  receiptUrl,
  email,
  phone,
}) => {
  // Inline styles for maximum email client compatibility
  const bodyStyle: React.CSSProperties = { fontFamily: 'Arial, sans-serif', margin: 0, padding: 0, backgroundColor: '#f4f4f4' };
  const containerStyle: React.CSSProperties = { maxWidth: '600px', margin: '40px auto', backgroundColor: '#ffffff', border: '1px solid #dddddd', borderRadius: '8px', padding: '20px' };
  const headingStyle: React.CSSProperties = { fontSize: '24px', fontWeight: 'normal', textAlign: 'center', margin: '30px 0' };
  const textStyle: React.CSSProperties = { fontSize: '14px', lineHeight: '24px', color: '#333333' };
  const detailsHeadingStyle: React.CSSProperties = { fontSize: '16px', fontWeight: 600, color: '#333333' };
  const hrStyle: React.CSSProperties = { border: 0, borderTop: '1px solid #eaeaea', margin: '26px 0' };
  const buttonContainerStyle: React.CSSProperties = { textAlign: 'center', margin: '32px 0' };
  const buttonStyle: React.CSSProperties = { backgroundColor: '#FF7F50', color: '#ffffff', fontWeight: 600, borderRadius: '6px', fontSize: '14px', padding: '12px 20px', textDecoration: 'none', display: 'inline-block' };

  return (
    <html>
      <head>
        <meta charSet="UTF-8" />
      </head>
      <body style={bodyStyle}>
        <div style={containerStyle}>
          <h1 style={headingStyle}>New Pre-Order Notification</h1>
          <p style={textStyle}>A new pre-order has been placed for 'Heal in Paradise'.</p>
          <hr style={hrStyle} />
          <div>
            <p style={detailsHeadingStyle}>Order Details:</p>
            <p style={{...textStyle, margin: 0}}><strong>Tracking Number:</strong> {trackingNumber}</p>
            <p style={{...textStyle, margin: 0}}><strong>Customer Name:</strong> {customerName}</p>
            <p style={{...textStyle, margin: 0}}><strong>Email:</strong> {email}</p>
            <p style={{...textStyle, margin: 0}}><strong>Phone:</strong> {phone}</p>
            <p style={{...textStyle, margin: 0}}><strong>Copies:</strong> {copies}</p>
            <p style={{...textStyle, marginTop: '8px'}}><strong>Shipping Address:</strong><br />{shippingAddress.split('\n').map((line, i) => <React.Fragment key={i}>{line}<br/></React.Fragment>)}</p>
            <p style={{...textStyle, marginTop: '8px'}}><strong>Book Signing Event:</strong> {eventDetails}</p>
          </div>
          <div style={buttonContainerStyle}>
            <a href={receiptUrl} target="_blank" rel="noopener noreferrer" style={buttonStyle}>View Payment Receipt</a>
          </div>
        </div>
      </body>
    </html>
  );
};

export default AdminNotificationEmail;
