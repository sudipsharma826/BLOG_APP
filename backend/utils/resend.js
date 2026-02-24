import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async ({ email = null, subject, message, html = null, bcc, attachmentUrl }) => {
  try {
    // Prepare email data
    const emailData = {
      from: `Sudip Sharma <info@sudipsharma.com.np>`,
      to: email || process.env.FALLBACK_EMAIL || 'info@sudipsharma.com.np',
      subject: subject,
      html: html || message || '',
    };

    // Add BCC if provided
    if (bcc) {
      emailData.bcc = Array.isArray(bcc) ? bcc : [bcc];
    }

    // Add plain text version if only message is provided
    if (message && !html) {
      emailData.text = message;
    }

    // Note: Resend doesn't support direct attachments via URL
    // If you need attachments, you'll need to download them first and attach as buffer
    if (attachmentUrl) {
      console.warn('Attachment URLs require pre-downloading. Feature not implemented in this version.');
      // Future implementation: fetch the URL, convert to buffer, and attach
    }

    // Send email via Resend
    const data = await resend.emails.send(emailData);
    
    console.log('Email sent successfully via Resend:', data.id);
    return data;
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export default sendMail;
