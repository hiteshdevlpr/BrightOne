// Server-side form handlers that call the database directly
import { db } from './database';
import { validateContactForm, validateBookingForm } from './validation';
import { EmailService, ContactEmailData, BookingEmailData } from './email-service';

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone?: string;
  serviceType: string;
  propertyAddress: string;
  propertyType?: string;
  propertySize?: string;
  budget?: string;
  timeline?: string;
  serviceTier?: string;
  selectedAddOns?: string[];
  preferredPartnerCode?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  packageType?: string;
  totalPrice?: string;
}

export interface PriceBreakdown {
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
}

export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

/**
 * Calculate price breakdown for booking
 */
function calculatePriceBreakdown(formData: BookingFormData): PriceBreakdown {
  const TAX_RATE = 13.00; // 13% tax rate for Ontario
  
  // Package pricing based on service tier (original prices before discount)
  const packagePrices: Record<string, number> = {
    'essentials': 199,
    'enhanced': 319,
    'showcase': 429,
    'premium': 549,
    'ultimate': 699,
    'airbnb': 149,
  };

  // Discount configuration
  const PACKAGE_DISCOUNTS = {
    'essentials': 15,
    'enhanced': 15,
    'showcase': 15,
    'premium': 10,
    'ultimate': 10,
    'airbnb': 15
  };

  // Add-on pricing
  const addonPrices: Record<string, number> = {
    'drone_photos': 149,
    'twilight_photos': 49,
    'extra_photos': 49,
    'cinematic_video': 199,
    'agent_walkthrough': 149,
    'social_reel': 99,
    'virtual_tour': 199,
    'floor_plan': 99,
    'listing_website': 99,
    'virtual_staging': 99,
  };

  // Add-on names
  const addonNames: Record<string, string> = {
    'drone_photos': 'Drone Photos (Exterior Aerials)',
    'twilight_photos': 'Twilight Photos',
    'extra_photos': 'Extra Photos (per 10 images)',
    'cinematic_video': 'Cinematic Video Tour',
    'agent_walkthrough': 'Agent Walkthrough Video',
    'social_reel': 'Social Media Reel',
    'virtual_tour': '3D Virtual Tour (iGUIDE)',
    'floor_plan': '2D Floor Plan',
    'listing_website': 'Listing Website',
    'virtual_staging': 'Virtual Staging',
  };

  // Package names
  const packageNames: Record<string, string> = {
    'essentials': 'Essentials Package',
    'enhanced': 'Enhanced Package',
    'showcase': 'Showcase Package',
    'premium': 'Premium Marketing Package',
    'ultimate': 'Ultimate Property Experience',
    'airbnb': 'Airbnb / Short-Term Rental Package',
  };

  // Calculate package price with discount
  const serviceTier = (formData.serviceTier || 'essentials') as keyof typeof packagePrices;
  const originalPackagePrice = packagePrices[serviceTier] || 0;
  const discountPercent = (PACKAGE_DISCOUNTS as Record<string, number>)[serviceTier] || 0;
  const packagePrice = Math.round(originalPackagePrice * (1 - discountPercent / 100));
  const packageName = packageNames[serviceTier] || 'Standard Package';

  // Calculate add-ons price
  let addonsPrice = 0;
  const addonsBreakdown: Array<{ name: string; price: number }> = [];

  if (formData.selectedAddOns && formData.selectedAddOns.length > 0) {
    formData.selectedAddOns.forEach(addonId => {
      if (addonId.startsWith('virtual_staging_')) {
        // Handle virtual staging with photo count
        const photoCount = parseInt(addonId.split('_')[2]) || 3;
        const basePrice = 99;
        const additionalPhotos = Math.max(0, photoCount - 3);
        const additionalPrice = additionalPhotos * 20;
        const totalPrice = basePrice + additionalPrice;
        
        addonsPrice += totalPrice;
        addonsBreakdown.push({
          name: `Virtual Staging (${photoCount} photos)`,
          price: totalPrice
        });
      } else {
        // Handle regular add-ons
        const price = addonPrices[addonId] || 0;
        if (price > 0) {
          addonsPrice += price;
          addonsBreakdown.push({
            name: addonNames[addonId] || addonId,
            price: price
          });
        }
      }
    });
  }

  // Calculate totals
  const subtotal = packagePrice + addonsPrice;
  const taxAmount = subtotal * (TAX_RATE / 100);
  const finalTotal = subtotal + taxAmount;

  return {
    packagePrice,
    addonsPrice,
    subtotal,
    taxRate: TAX_RATE,
    taxAmount,
    finalTotal,
    breakdown: {
      package: {
        name: packageName,
        price: packagePrice
      },
      addons: addonsBreakdown
    }
  };
}

export interface BookingRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service_type: string;
  property_address: string;
  property_type?: string;
  property_size?: string;
  budget?: string;
  timeline?: string;
  service_tier?: string;
  selected_addons?: string[];
  preferred_date?: string;
  preferred_time?: string;
  total_price?: string;
  message?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export async function handleContactSubmissionServer(formData: ContactFormData): Promise<{ success: boolean; error?: string; contact?: ContactRecord }> {
  try {
    console.log('APP_LOG:: Server-side contact form submission started');
    
    // Validate form data
    const validationErrors = validateContactForm(formData);
    
    if (validationErrors.length > 0) {
      console.log('APP_LOG:: Validation errors:', validationErrors);
      return {
        success: false,
        error: validationErrors.map(error => error.message).join(', ')
      };
    }

    console.log('APP_LOG:: Submitting contact message to database');
    
    // Submit contact message to database directly
    const contact = await db.createContactMessage({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone?.trim() || undefined,
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    });

    console.log('APP_LOG:: Contact message submitted to database:', contact.id);

    // Send email notifications
    console.log('APP_LOG:: Sending email notifications');
    const emailData: ContactEmailData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || 'Not provided',
      subject: formData.subject,
      message: formData.message,
    };

    console.log('APP_LOG:: Email data:', emailData);

    // Send emails in parallel (don't wait for them to complete)
    Promise.all([
      EmailService.sendContactConfirmationToCustomer(emailData),
      EmailService.sendContactNotificationToAdmin(emailData)
    ]).then(([customerEmailSent, adminEmailSent]) => {
      console.log('APP_LOG:: Email notifications:', {
        customerEmailSent,
        adminEmailSent
      });
    }).catch((emailError) => {
      console.error('APP_LOG:: Email sending failed:', emailError);
      // Don't fail the contact submission if emails fail
    });

    return {
      success: true,
      contact: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        subject: contact.subject,
        message: contact.message,
        status: contact.status,
        created_at: contact.created_at,
        updated_at: contact.updated_at,
      }
    };

  } catch (error) {
    console.error('APP_LOG:: Contact submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit contact message. Please try again.'
    };
  }
}

export async function handleBookingSubmissionServer(formData: BookingFormData): Promise<{ success: boolean; error?: string; booking?: BookingRecord }> {
  try {
    console.log('APP_LOG:: Server-side booking form submission started');
    
    // Validate form data
    const validationErrors = validateBookingForm(formData);
    
    if (validationErrors.length > 0) {
      console.log('APP_LOG:: Validation errors:', validationErrors);
      return {
        success: false,
        error: validationErrors.map(error => error.message).join(', ')
      };
    }

    console.log('APP_LOG:: Submitting booking to database');
    
    // Calculate price breakdown
    const priceBreakdown = calculatePriceBreakdown(formData);
    console.log('APP_LOG:: Price breakdown calculated:', priceBreakdown);
    
    // Submit booking to database directly
    const booking = await db.createBooking({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone?.trim() || undefined,
      serviceType: formData.serviceType,
      propertyAddress: formData.propertyAddress.trim(),
      propertyType: formData.propertyType || undefined,
      propertySize: formData.propertySize || undefined,
      budget: formData.budget || undefined,
      timeline: formData.timeline || undefined,
      serviceTier: formData.serviceTier || undefined,
      selectedAddOns: formData.selectedAddOns || [],
      preferredPartnerCode: formData.preferredPartnerCode?.trim() || undefined,
      preferredDate: formData.preferredDate || undefined,
      preferredTime: formData.preferredTime || undefined,
      totalPrice: formData.totalPrice || undefined,
      message: formData.message?.trim() || undefined,
      packagePrice: priceBreakdown.packagePrice,
      addonsPrice: priceBreakdown.addonsPrice,
      subtotal: priceBreakdown.subtotal,
      taxRate: priceBreakdown.taxRate,
      taxAmount: priceBreakdown.taxAmount,
      finalTotal: priceBreakdown.finalTotal,
      priceBreakdown: JSON.stringify(priceBreakdown.breakdown),
    });

    console.log('APP_LOG:: Booking submitted to database:', booking.id);

    // Send email notifications
    console.log('APP_LOG:: Sending email notifications');
    const emailData: BookingEmailData = {
      customerName: formData.name,
      customerEmail: formData.email,
      customerPhone: formData.phone || 'Not provided',
      serviceType: formData.serviceType,
      propertyAddress: formData.propertyAddress,
      preferredDate: formData.preferredDate || 'Not specified',
      preferredTime: formData.preferredTime || 'Not specified',
      message: formData.message || '',
      packageType: formData.packageType || formData.serviceTier || 'Standard',
      totalPrice: formData.totalPrice || 'To be determined',
      // Pass original add-on IDs - email service will handle formatting
      selectedAddOns: formData.selectedAddOns || [],
      priceBreakdown: priceBreakdown,
    };

    console.log('APP_LOG:: Email data:', emailData);

    // Send emails in parallel (don't wait for them to complete)
    Promise.all([
      EmailService.sendBookingConfirmationToCustomer(emailData),
      EmailService.sendBookingNotificationToAdmin(emailData)
    ]).then(([customerEmailSent, adminEmailSent]) => {
      console.log('APP_LOG:: Email notifications:', {
        customerEmailSent,
        adminEmailSent
      });
    }).catch((emailError) => {
      console.error('APP_LOG:: Email sending failed:', emailError);
      // Don't fail the booking submission if emails fail
    });

    return {
      success: true,
      booking: {
        id: booking.id,
        name: booking.name,
        email: booking.email,
        phone: booking.phone,
        service_type: booking.service_type,
        property_address: booking.property_address,
        property_type: booking.property_type,
        property_size: booking.property_size,
        budget: booking.budget,
        timeline: booking.timeline,
        service_tier: booking.service_tier,
        selected_addons: booking.selected_addons,
        preferred_date: booking.preferred_date,
        preferred_time: booking.preferred_time,
        total_price: booking.total_price,
        message: booking.message,
        status: booking.status,
        created_at: booking.created_at,
        updated_at: booking.updated_at,
      }
    };

  } catch (error) {
    console.error('APP_LOG:: Booking submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit booking. Please try again.'
    };
  }
}
