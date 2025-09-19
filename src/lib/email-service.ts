import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export interface EmailData {
  to: string;
  subject: string;
  htmlBody: string;
  textBody?: string;
}

export interface BookingEmailData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  propertyAddress: string;
  preferredDate: string;
  preferredTime: string;
  message: string;
  packageType: string;
  totalPrice: string;
}

export interface ContactEmailData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export class EmailService {
  private static readonly FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@brightone.ca';
  private static readonly ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'hitesh@brightone.ca';

  /**
   * Send email using Amazon SES
   */
  static async sendEmail(emailData: EmailData): Promise<boolean> {
    try {
      const command = new SendEmailCommand({
        Source: this.FROM_EMAIL,
        Destination: {
          ToAddresses: [emailData.to],
        },
        Message: {
          Subject: {
            Data: emailData.subject,
            Charset: 'UTF-8',
          },
          Body: {
            Html: {
              Data: emailData.htmlBody,
              Charset: 'UTF-8',
            },
            Text: emailData.textBody ? {
              Data: emailData.textBody,
              Charset: 'UTF-8',
            } : undefined,
          },
        },
      });

      const result = await sesClient.send(command);
      console.log('Email sent successfully:', result.MessageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      return false;
    }
  }

  /**
   * Send booking confirmation email to customer
   */
  static async sendBookingConfirmationToCustomer(data: BookingEmailData): Promise<boolean> {
    const subject = `Booking Confirmation - ${data.serviceType} | BrightOne`;
    
    const htmlBody = this.generateBookingConfirmationHTML(data);
    const textBody = this.generateBookingConfirmationText(data);

    return this.sendEmail({
      to: data.customerEmail,
      subject,
      htmlBody,
      textBody,
    });
  }

  /**
   * Send booking notification email to admin
   */
  static async sendBookingNotificationToAdmin(data: BookingEmailData): Promise<boolean> {
    const subject = `New Booking Request - ${data.serviceType} | ${data.customerName}`;
    
    const htmlBody = this.generateBookingAdminHTML(data);
    const textBody = this.generateBookingAdminText(data);

    return this.sendEmail({
      to: this.ADMIN_EMAIL,
      subject,
      htmlBody,
      textBody,
    });
  }

  /**
   * Send contact confirmation email to customer
   */
  static async sendContactConfirmationToCustomer(data: ContactEmailData): Promise<boolean> {
    const subject = `Thank you for contacting BrightOne`;
    
    const htmlBody = this.generateContactConfirmationHTML(data);
    const textBody = this.generateContactConfirmationText(data);

    return this.sendEmail({
      to: data.email,
      subject,
      htmlBody,
      textBody,
    });
  }

  /**
   * Send contact notification email to admin
   */
  static async sendContactNotificationToAdmin(data: ContactEmailData): Promise<boolean> {
    const subject = `New Contact Form Submission - ${data.subject}`;
    
    const htmlBody = this.generateContactAdminHTML(data);
    const textBody = this.generateContactAdminText(data);

    return this.sendEmail({
      to: this.ADMIN_EMAIL,
      subject,
      htmlBody,
      textBody,
    });
  }

  /**
   * Generate HTML for booking confirmation email
   */
  private static generateBookingConfirmationHTML(data: BookingEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Booking Confirmation</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          .highlight { color: #d4af37; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Confirmation</h1>
            <p>Thank you for choosing BrightOne!</p>
          </div>
          
          <div class="content">
            <p>Dear ${data.customerName},</p>
            
            <p>We have received your booking request and will contact you shortly to confirm the details.</p>
            
            <div class="details">
              <h3>Booking Details:</h3>
              <p><strong>Service:</strong> ${data.serviceType}</p>
              <p><strong>Package:</strong> ${data.packageType}</p>
              <p><strong>Property Address:</strong> ${data.propertyAddress}</p>
              <p><strong>Preferred Date:</strong> ${data.preferredDate}</p>
              <p><strong>Preferred Time:</strong> ${data.preferredTime}</p>
              <p><strong>Total Price:</strong> <span class="highlight">${data.totalPrice}</span></p>
              ${data.message ? `<p><strong>Additional Notes:</strong> ${data.message}</p>` : ''}
            </div>
            
            <p>We will contact you within 24 hours to confirm your booking and discuss the next steps.</p>
            
            <p>If you have any questions, please don't hesitate to contact us.</p>
            
            <p>Best regards,<br>The BrightOne Team</p>
          </div>
          
          <div class="footer">
            <p>BrightOne - Professional Real Estate Photography & Virtual Staging</p>
            <p>Email: ${this.ADMIN_EMAIL} | Website: brightone.ca</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate text version for booking confirmation email
   */
  private static generateBookingConfirmationText(data: BookingEmailData): string {
    return `
Booking Confirmation - BrightOne

Dear ${data.customerName},

We have received your booking request and will contact you shortly to confirm the details.

Booking Details:
- Service: ${data.serviceType}
- Package: ${data.packageType}
- Property Address: ${data.propertyAddress}
- Preferred Date: ${data.preferredDate}
- Preferred Time: ${data.preferredTime}
- Total Price: ${data.totalPrice}
${data.message ? `- Additional Notes: ${data.message}` : ''}

We will contact you within 24 hours to confirm your booking and discuss the next steps.

If you have any questions, please don't hesitate to contact us.

Best regards,
The BrightOne Team

BrightOne - Professional Real Estate Photography & Virtual Staging
Email: ${this.ADMIN_EMAIL} | Website: brightone.ca
    `;
  }

  /**
   * Generate HTML for booking admin notification email
   */
  private static generateBookingAdminHTML(data: BookingEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Booking Request</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #d4af37; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #d4af37; }
          .contact-info { background: #e8f4f8; padding: 15px; border-radius: 5px; }
          .urgent { color: #d4af37; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Booking Request</h1>
            <p>Action Required</p>
          </div>
          
          <div class="content">
            <div class="contact-info">
              <h3>Customer Information:</h3>
              <p><strong>Name:</strong> ${data.customerName}</p>
              <p><strong>Email:</strong> ${data.customerEmail}</p>
              <p><strong>Phone:</strong> ${data.customerPhone}</p>
            </div>
            
            <div class="details">
              <h3>Booking Details:</h3>
              <p><strong>Service:</strong> ${data.serviceType}</p>
              <p><strong>Package:</strong> ${data.packageType}</p>
              <p><strong>Property Address:</strong> ${data.propertyAddress}</p>
              <p><strong>Preferred Date:</strong> <span class="urgent">${data.preferredDate}</span></p>
              <p><strong>Preferred Time:</strong> <span class="urgent">${data.preferredTime}</span></p>
              <p><strong>Total Price:</strong> ${data.totalPrice}</p>
              ${data.message ? `<p><strong>Additional Notes:</strong> ${data.message}</p>` : ''}
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Contact the customer within 24 hours</li>
              <li>Confirm availability for the requested date/time</li>
              <li>Send detailed service information</li>
              <li>Schedule the appointment</li>
            </ul>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate text version for booking admin notification email
   */
  private static generateBookingAdminText(data: BookingEmailData): string {
    return `
New Booking Request - Action Required

Customer Information:
- Name: ${data.customerName}
- Email: ${data.customerEmail}
- Phone: ${data.customerPhone}

Booking Details:
- Service: ${data.serviceType}
- Package: ${data.packageType}
- Property Address: ${data.propertyAddress}
- Preferred Date: ${data.preferredDate}
- Preferred Time: ${data.preferredTime}
- Total Price: ${data.totalPrice}
${data.message ? `- Additional Notes: ${data.message}` : ''}

Next Steps:
1. Contact the customer within 24 hours
2. Confirm availability for the requested date/time
3. Send detailed service information
4. Schedule the appointment
    `;
  }

  /**
   * Generate HTML for contact confirmation email
   */
  private static generateContactConfirmationHTML(data: ContactEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You for Contacting Us</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a1a; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank You for Contacting Us</h1>
            <p>We'll get back to you soon!</p>
          </div>
          
          <div class="content">
            <p>Dear ${data.name},</p>
            
            <p>Thank you for reaching out to BrightOne. We have received your message and will respond within 24 hours.</p>
            
            <div class="details">
              <h3>Your Message:</h3>
              <p><strong>Subject:</strong> ${data.subject}</p>
              <p><strong>Message:</strong></p>
              <p>${data.message}</p>
            </div>
            
            <p>In the meantime, feel free to explore our services on our website or contact us directly if you have any urgent questions.</p>
            
            <p>Best regards,<br>The BrightOne Team</p>
          </div>
          
          <div class="footer">
            <p>BrightOne - Professional Real Estate Photography & Virtual Staging</p>
            <p>Email: ${this.ADMIN_EMAIL} | Website: brightone.ca</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate text version for contact confirmation email
   */
  private static generateContactConfirmationText(data: ContactEmailData): string {
    return `
Thank You for Contacting BrightOne

Dear ${data.name},

Thank you for reaching out to BrightOne. We have received your message and will respond within 24 hours.

Your Message:
- Subject: ${data.subject}
- Message: ${data.message}

In the meantime, feel free to explore our services on our website or contact us directly if you have any urgent questions.

Best regards,
The BrightOne Team

BrightOne - Professional Real Estate Photography & Virtual Staging
Email: ${this.ADMIN_EMAIL} | Website: brightone.ca
    `;
  }

  /**
   * Generate HTML for contact admin notification email
   */
  private static generateContactAdminHTML(data: ContactEmailData): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #d4af37; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .details { background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 4px solid #d4af37; }
          .contact-info { background: #e8f4f8; padding: 15px; border-radius: 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Contact Form Submission</h1>
            <p>Response Required</p>
          </div>
          
          <div class="content">
            <div class="contact-info">
              <h3>Contact Information:</h3>
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Phone:</strong> ${data.phone}</p>
            </div>
            
            <div class="details">
              <h3>Message Details:</h3>
              <p><strong>Subject:</strong> ${data.subject}</p>
              <p><strong>Message:</strong></p>
              <p>${data.message}</p>
            </div>
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Respond to the customer within 24 hours</li>
              <li>Address their specific questions or concerns</li>
              <li>Provide relevant service information if needed</li>
            </ul>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Generate text version for contact admin notification email
   */
  private static generateContactAdminText(data: ContactEmailData): string {
    return `
New Contact Form Submission - Response Required

Contact Information:
- Name: ${data.name}
- Email: ${data.email}
- Phone: ${data.phone}

Message Details:
- Subject: ${data.subject}
- Message: ${data.message}

Next Steps:
1. Respond to the customer within 24 hours
2. Address their specific questions or concerns
3. Provide relevant service information if needed
    `;
  }
}
