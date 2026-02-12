// Booking utilities: Pricing calculations and business logic
import type {
    PropertySizeConfig,
    PartnerCode,
    AddOnClient,
    PackageClient,
} from '@/types/services';

/**
 * Calculate adjusted package price based on property size
 * Uses property size configs from database
 */
export function getAdjustedPackagePrice(
    basePrice: number,
    propertySize: string | number | null | undefined,
    sizeConfigs: PropertySizeConfig[]
): number {
    if (!propertySize) {
        return basePrice;
    }

    let multiplier = 1.0;

    // If propertySize is a string category (small, medium, large, xlarge)
    if (typeof propertySize === 'string' && ['small', 'medium', 'large', 'xlarge'].includes(propertySize)) {
        const config = sizeConfigs.find((c) => c.code === propertySize);
        multiplier = config?.multiplier || 1.0;
    }
    // If propertySize is a number (square footage)
    else if (typeof propertySize === 'number' || (typeof propertySize === 'string' && !isNaN(Number(propertySize)))) {
        const sqft = typeof propertySize === 'string' ? parseInt(propertySize, 10) : propertySize;

        // Find matching config based on sqft
        const config = sizeConfigs.find((c) => {
            if (sqft < c.min_sqft) return false;
            if (c.max_sqft != null && sqft > c.max_sqft) return false;
            return true;
        });

        multiplier = config?.multiplier || 1.0;
    }

    return Math.round(basePrice * multiplier);
}

/**
 * Check if partner code is valid
 */
export function isValidPreferredPartnerCode(
    code: string | undefined | null,
    partnerCode?: PartnerCode | null
): boolean {
    if (!code || typeof code !== 'string') return false;
    if (!partnerCode) return false;
    // If API didn't send active (e.g. partial response), treat as valid when code matches
    const isActive = partnerCode.active !== false;
    return isActive && partnerCode.code.toUpperCase() === code.trim().toUpperCase();
}

/**
 * Get package price after property size adjustment and optional preferred partner discount
 */
export function getPackagePriceWithPartner(
    basePrice: number,
    propertySize: string | number | null | undefined,
    packageId: string | undefined,
    preferredPartnerCode: string | null | undefined,
    partnerCodeData: PartnerCode | null | undefined,
    sizeConfigs: PropertySizeConfig[]
): { price: number; isPartnerDiscount: boolean } {
    const sizeAdjusted = getAdjustedPackagePrice(basePrice, propertySize, sizeConfigs);
    const hasValidCode = isValidPreferredPartnerCode(preferredPartnerCode, partnerCodeData);

    if (!hasValidCode || !packageId) {
        return { price: sizeAdjusted, isPartnerDiscount: false };
    }

    const discountPercent = partnerCodeData?.package_discount_percent || 0;
    if (discountPercent <= 0) {
        return { price: sizeAdjusted, isPartnerDiscount: false };
    }

    const price = Math.round(sizeAdjusted * (1 - discountPercent / 100));
    return { price, isPartnerDiscount: true };
}

/**
 * Get add-on base price based on whether a package is selected
 * Uses price_with_package and price_without_package from database
 */
export function getAddonBasePrice(
    addon: AddOnClient,
    hasPackageSelected: boolean
): number {
    // If addon has explicit pricing for with/without package, use that
    // This will be populated from database addon.price_with_package and price_without_package
    // For now, fallback to base price
    return addon.price;
}

/**
 * Get add-on price with optional preferred partner discount
 */
export function getAddonPriceWithPartner(
    addon: AddOnClient,
    hasPackageSelected: boolean,
    preferredPartnerCode: string | null | undefined,
    partnerCodeData: PartnerCode | null | undefined
): number {
    const basePrice = getAddonBasePrice(addon, hasPackageSelected);
    const hasValidCode = isValidPreferredPartnerCode(preferredPartnerCode, partnerCodeData);

    if (!hasValidCode) {
        return basePrice;
    }

    const discountPercent = partnerCodeData?.addon_discount_percent || 0;
    if (discountPercent <= 0) {
        return basePrice;
    }

    return Math.round(basePrice * (1 - discountPercent / 100));
}

/**
 * Calculate total booking price (subtotal + tax)
 */
export function calculateBookingTotal(
    packagePrice: number | null,
    addonPrices: number[],
    taxRate: number = 13.0
): number {
    const subtotal = (packagePrice || 0) + addonPrices.reduce((sum, price) => sum + price, 0);
    const total = subtotal * (1 + taxRate / 100);
    return Math.round(total * 100) / 100; // Round to 2 decimal places
}

/**
 * Resolve virtual staging addons (convert virtual_staging to virtual_staging_N)
 */
export function resolveVirtualStagingAddons(
    selectedAddOns: string[],
    virtualStagingPhotoCount: number
): string[] {
    return selectedAddOns.map((id) =>
        id === 'virtual_staging' ? `virtual_staging_${virtualStagingPhotoCount}` : id
    );
}

/**
 * Get available addons (filter out those included in selected package)
 */
export function getAvailableAddons(
    allAddons: AddOnClient[],
    includedAddonIds: string[]
): AddOnClient[] {
    return allAddons.filter((addon) => !includedAddonIds.includes(addon.id));
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = 'CAD'): string {
    return new Intl.NumberFormat('en-CA', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
    }).format(price);
}

/**
 * Format phone number
 */
export function formatPhoneNumber(value: string): string {
    const digits = value.replace(/\D/g, '');
    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    const ten = digits.length >= 10 ? digits.slice(-10) : digits.slice(0, 10);
    return `(${ten.slice(0, 3)}) ${ten.slice(3, 6)}-${ten.slice(6, 10)}`;
}

/**
 * Check if property size requires "Contact for Price"
 */
export function shouldShowContactPrice(
    propertySize: string | number | null | undefined,
    threshold: number = 5000
): boolean {
    if (!propertySize) return false;
    const sqft = typeof propertySize === 'string' ? parseInt(propertySize, 10) : propertySize;
    return !isNaN(sqft) && sqft >= threshold;
}
