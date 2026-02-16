import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});
// Do not log secret env values (AWS keys, etc.) — log presence only for debugging
if (process.env.NODE_ENV !== 'production') {
  console.log('APP_LOG:: SES Client initialized', {
    hasAwsRegion: !!process.env.AWS_REGION,
    hasAwsCredentials: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY),
    hasFromEmail: !!process.env.FROM_EMAIL,
    hasAdminEmail: !!process.env.ADMIN_EMAIL,
  });
}

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
  selectedAddOns?: string[];
  priceBreakdown?: {
    packagePrice: number;
    addonsPrice: number;
    subtotal: number;
    taxRate: number;
    taxAmount: number;
    finalTotal: number;
    breakdown: {
      package: {
        name: string;
        price: number;
      };
      addons: Array<{
        name: string;
        price: number;
      }>;
    };
  };
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
   * Get addon names from IDs
   */
  private static getAddonNames(addonIds: string[]): string[] {
    if (!addonIds || addonIds.length === 0) {
      return [];
    }

    const addonNameMap: Record<string, string> = {
      'drone_photos': 'Drone Photos (Exterior Aerials)',
      'twilight_photos': 'Twilight Photos',
      'cinematic_video': 'Cinematic Video Tour',
      'agent_walkthrough': 'Agent Walkthrough Video',
      'social_reel': 'Social Media Reel',
      'virtual_tour': '3D Virtual Tour (iGUIDE)',
      'floor_plan': '2D Floor Plan',
      'listing_website': 'Listing Website',
      'virtual_staging': 'Virtual Staging'
    };

    return addonIds.map(id => {
      // Handle virtual staging with photo count
      if (id.startsWith('virtual_staging_')) {
        const photoCount = id.split('_')[2];
        return `Virtual Staging (${photoCount} photos)`;
      }
      // Handle regular add-ons
      return addonNameMap[id] || id;
    });
  }

  /**
   * Format addon names for HTML emails
   */
  private static formatAddonNamesHTML(addonIds: string[]): string {
    const addonNames = this.getAddonNames(addonIds);
    
    if (addonNames.length === 0) {
      return 'None';
    }

    return `<ul style="margin: 5px 0; padding-left: 20px;">${addonNames.map(name => `<li>${name}</li>`).join('')}</ul>`;
  }

  /**
   * Format addon names for text emails
   */
  private static formatAddonNamesText(addonIds: string[]): string {
    const addonNames = this.getAddonNames(addonIds);
    
    if (addonNames.length === 0) {
      return 'None';
    }

    return addonNames.map((name, index) => `${index + 1}. ${name}`).join('\n');
  }

  /**
   * Generate price breakdown table for HTML emails
   */
  private static generatePriceBreakdownHTML(priceBreakdown: BookingEmailData['priceBreakdown']): string {
    if (!priceBreakdown) {
      return '<p><strong>Total Price:</strong> To be determined</p>';
    }

    return `
      <div style="background: white; padding: 20px; margin: 20px 0; border-radius: 5px; border: 1px solid #ddd;">
        <h3 style="margin-top: 0; color: #333;">Price Breakdown</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px 0; font-weight: bold;">${priceBreakdown.breakdown.package.name}</td>
            <td style="padding: 8px 0; text-align: right; font-weight: bold;">$${priceBreakdown.packagePrice.toFixed(2)}</td>
          </tr>
          ${priceBreakdown.breakdown.addons.map(addon => `
            <tr style="border-bottom: 1px solid #eee;">
              <td style="padding: 8px 0; padding-left: 20px; color: #666;">+ ${addon.name}</td>
              <td style="padding: 8px 0; text-align: right; color: #666;">$${addon.price.toFixed(2)}</td>
            </tr>
          `).join('')}
          <tr style="border-top: 2px solid #333; border-bottom: 1px solid #eee;">
            <td style="padding: 12px 0; font-weight: bold;">Subtotal</td>
            <td style="padding: 12px 0; text-align: right; font-weight: bold;">$${priceBreakdown.subtotal.toFixed(2)}</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 8px 0;">Tax (${priceBreakdown.taxRate}%)</td>
            <td style="padding: 8px 0; text-align: right;">$${priceBreakdown.taxAmount.toFixed(2)}</td>
          </tr>
          <tr style="border-top: 2px solid #d4af37; background: #f9f9f9;">
            <td style="padding: 12px 0; font-weight: bold; font-size: 16px;">Total</td>
            <td style="padding: 12px 0; text-align: right; font-weight: bold; font-size: 16px; color: #d4af37;">$${priceBreakdown.finalTotal.toFixed(2)}</td>
          </tr>
        </table>
      </div>
    `;
  }

  /**
   * Generate price breakdown for text emails
   */
  private static generatePriceBreakdownText(priceBreakdown: BookingEmailData['priceBreakdown']): string {
    if (!priceBreakdown) {
      return 'Total Price: To be determined';
    }

    let text = 'Price Breakdown:\n';
    text += `${priceBreakdown.breakdown.package.name}: $${priceBreakdown.packagePrice.toFixed(2)}\n`;
    
    priceBreakdown.breakdown.addons.forEach(addon => {
      text += `  + ${addon.name}: $${addon.price.toFixed(2)}\n`;
    });
    
    text += `\nSubtotal: $${priceBreakdown.subtotal.toFixed(2)}\n`;
    text += `Tax (${priceBreakdown.taxRate}%): $${priceBreakdown.taxAmount.toFixed(2)}\n`;
    text += `Total: $${priceBreakdown.finalTotal.toFixed(2)}\n`;

    return text;
  }

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
      console.log('APP_LOG:: Email sent successfully:', result.MessageId);
      return true;
    } catch (error) {
      const err = error as { name?: string; message?: string; code?: string; $metadata?: { httpStatusCode?: number } };
      console.error('APP_LOG:: Error sending email:', {
        name: err?.name,
        message: err?.message,
        code: err?.code,
        statusCode: err?.$metadata?.httpStatusCode,
      });
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
    const subject = `New Booking Confirmation - ${data.serviceType} | ${data.customerName}`;
    
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
            
            <p>Your booking is confirmed. We have received your payment and booking details.</p>
            
            <div class="details">
              <h3>Booking Details:</h3>
              <p><strong>Service:</strong> ${data.serviceType}</p>
              <p><strong>Package:</strong> ${data.packageType}</p>
              <p><strong>Property Address:</strong> ${data.propertyAddress}</p>
              <p><strong>Preferred Date:</strong> ${data.preferredDate}</p>
              <p><strong>Preferred Time:</strong> ${data.preferredTime}</p>
              ${data.message ? `<p><strong>Additional Notes:</strong> ${data.message}</p>` : ''}
            </div>
            
            ${this.generatePriceBreakdownHTML(data.priceBreakdown)}
            
            <p>We will be in touch with any final details before your shoot. If you have any questions in the meantime, please don't hesitate to contact us.</p>
            
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

Your booking is confirmed. We have received your payment and booking details.

Booking Details:
- Service: ${data.serviceType}
- Package: ${data.packageType}
- Property Address: ${data.propertyAddress}
- Preferred Date: ${data.preferredDate}
- Preferred Time: ${data.preferredTime}
${data.message ? `- Additional Notes: ${data.message}` : ''}

${this.generatePriceBreakdownText(data.priceBreakdown)}

We will be in touch with any final details before your shoot. If you have any questions in the meantime, please don't hesitate to contact us.

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
        <title>New Booking Confirmation</title>
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
            <h1>New Booking Confirmation</h1>
            <p>Payment received – customer booking confirmed</p>
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
              ${data.message ? `<p><strong>Additional Notes:</strong> ${data.message}</p>` : ''}
            </div>
            
            ${this.generatePriceBreakdownHTML(data.priceBreakdown)}
            
            <p><strong>Next Steps:</strong></p>
            <ul>
              <li>Contact the customer to confirm availability for the selected date/time</li>
              <li>Send any final service details if needed</li>
              <li>Schedule and confirm the shoot</li>
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
New Booking Confirmation - Payment received

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
${data.message ? `- Additional Notes: ${data.message}` : ''}

${this.generatePriceBreakdownText(data.priceBreakdown)}

Next Steps:
1. Contact the customer to confirm availability for the selected date/time
2. Send any final service details if needed
3. Schedule and confirm the shoot
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
