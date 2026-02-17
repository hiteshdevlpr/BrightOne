import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import {
    getPackages,
    getPackagePriceWithPartner,
    getAddonPriceWithPartner,
} from '@/data/booking-data';
import { getPersonalPackages, PERSONAL_ADD_ONS } from '@/data/personal-branding-data';

const PERSONAL_PACKAGE_IDS = ['growth', 'accelerator', 'tailored'];

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            selectedPackageId,
            selectedAddOns,
            propertySize,
            preferredPartnerCode
        } = body;

        // 1. Calculate Package Price (listing from booking-data, personal from personal-branding-data)
        let packagePrice = 0;
        const hasPackageSelected = !!selectedPackageId;
        const isPersonalBooking = selectedPackageId && PERSONAL_PACKAGE_IDS.includes(selectedPackageId);

        if (selectedPackageId) {
            if (isPersonalBooking) {
                const personalPackages = getPersonalPackages();
                const pkg = personalPackages.find(p => p.id === selectedPackageId);
                if (pkg) {
                    // Personal: no property size adjustment; partner discount still applies via booking-data
                    const { price } = getPackagePriceWithPartner(
                        pkg.basePrice,
                        null, // no property size for personal
                        pkg.id,
                        preferredPartnerCode
                    );
                    packagePrice = price;
                }
            } else {
                const packages = getPackages();
                const pkg = packages.find(p => p.id === selectedPackageId);
                if (pkg) {
                    const { price } = getPackagePriceWithPartner(
                        pkg.basePrice,
                        propertySize,
                        pkg.id,
                        preferredPartnerCode
                    );
                    packagePrice = price;
                }
            }
        }

        // 2. Calculate Add-ons Price (listing: booking-data; personal: personal-branding-data)
        const MAX_VIRTUAL_STAGING_PHOTOS = 100;
        const MAX_AMOUNT_CENTS = 99999999; // Stripe max for single payment in CAD cents
        let addonsPrice = 0;
        if (Array.isArray(selectedAddOns)) {
            if (isPersonalBooking) {
                addonsPrice = selectedAddOns.reduce((total: number, addonId: string) => {
                    const addon = PERSONAL_ADD_ONS.find(a => a.id === addonId);
                    const price = addon ? addon.price : 0;
                    return total + price;
                }, 0);
            } else {
                addonsPrice = selectedAddOns.reduce((total: number, addonId: string) => {
                    let actualAddonId = addonId;
                    let count = 1;

                    if (addonId.startsWith('virtual_staging_')) {
                        const parts = addonId.split('_');
                        const parsedCount = parseInt(parts[2], 10);
                        if (!isNaN(parsedCount) && parsedCount >= 1) {
                            actualAddonId = 'virtual_staging';
                            count = Math.min(parsedCount, MAX_VIRTUAL_STAGING_PHOTOS);
                        }
                    }

                    const price = getAddonPriceWithPartner(
                        actualAddonId,
                        hasPackageSelected,
                        preferredPartnerCode
                    );

                    return total + (price * count);
                }, 0);
            }
        }

        // 3. Total Calculation
        const subtotal = packagePrice + addonsPrice;
        const totalWithTax = subtotal * 1.13; // 13% HST
        let amountInCents = Math.round(totalWithTax * 100);

        if (amountInCents < 50) {
            return NextResponse.json(
                { error: 'Total amount is too low for payment.' },
                { status: 400 }
            );
        }
        if (amountInCents > MAX_AMOUNT_CENTS) {
            return NextResponse.json(
                { error: 'Total amount exceeds maximum allowed. Please contact us for large orders.' },
                { status: 400 }
            );
        }

        // 4. Create PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'cad',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                packageId: selectedPackageId || 'none',
                propertySize: String(propertySize || ''),
                partnerCode: preferredPartnerCode || 'none',
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            amount: amountInCents,
        });

    } catch (error) {
        console.error('Error creating payment intent:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
