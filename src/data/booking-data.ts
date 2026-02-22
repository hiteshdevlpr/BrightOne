export interface Package {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    services: string[];
    photoCount: number;
    popular?: boolean;
    images: string[];
}

export interface AddOn {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    comments?: string;
}

export const ADD_ONS: AddOn[] = [
    { id: 'drone_photos', name: 'Drone Photos (Exterior Aerials)', description: 'Aerial property shots from unique perspectives', price: 199, category: 'photography', image: 'https://picsum.photos/seed/addon-drone/400/300', comments: 'This price is for properties 1 acre or less, contact us for larger properties' },
    { id: 'drone_video', name: 'Drone Video', description: 'Aerial property video from unique perspectives', price: 199, category: 'videography', image: 'https://picsum.photos/seed/addon-dronevid/400/300', comments: 'This price is for properties 1 acre or less, contact us for larger properties' },
    { id: 'twilight_photos', name: 'Twilight Photos', description: 'Dramatic evening shots with ambient lighting', price: 149, category: 'photography', image: 'https://picsum.photos/seed/addon-twilight/400/300' },
    { id: 'standard_video', name: 'Standard Video Tour', description: 'Standard property video tour', price: 189, category: 'videography', image: 'https://picsum.photos/seed/addon-standard-video/400/300' },
    { id: 'cinematic_video', name: 'Cinematic Video Tour', description: 'Professional property video tour (1-2 min)', price: 249, category: 'videography', image: 'https://picsum.photos/seed/addon-cinematic/400/300' },
    { id: 'cinematic_video_extended', name: 'Cinematic Video Tour (Extended)', description: 'Professional property video tour (2-3 min)', price: 349, category: 'videography', image: 'https://picsum.photos/seed/addon-cinext/400/300' },
    { id: 'agent_walkthrough', name: 'Agent Walkthrough Video', description: 'Personalized agent introduction video', price: 319, category: 'videography', image: 'https://picsum.photos/seed/addon-agent/400/300' },
    { id: 'social_reel', name: 'Social Media Reel', description: 'Short form vertical cut for social platforms', price: 250, category: 'videography', image: 'https://picsum.photos/seed/addon-reel/400/300' },
    { id: 'virtual_tour', name: '3D Virtual Tour (iGUIDE) & 2D Floor Plan', description: 'Interactive 3D property tour & accurate 2D floor plan', price: 249, category: 'virtual_tour', image: 'https://picsum.photos/seed/addon-3dtour/400/300' },
    { id: 'floor_plan', name: '2D Floor Plan', description: 'Standard', price: 99, category: 'floor_plans', image: 'https://picsum.photos/seed/addon-floor/400/300' },
    { id: 'listing_website', name: 'Listing Website', description: 'Custom property showcase website', price: 149, category: 'listing_website', image: 'https://picsum.photos/seed/addon-website/400/300' },
    { id: 'virtual_staging', name: 'Virtual Staging', description: 'Digitally furnished and decorated spaces ($12 per photo)', price: 12, category: 'virtual_staging', image: 'https://picsum.photos/seed/addon-staging/400/300' }
];

export type PropertySize = 'small' | 'medium' | 'large' | 'xlarge';

export interface PropertySizeConfig {
    id: PropertySize;
    label: string;
    multiplier: number;
    minSqft: number;
    maxSqft: number | null; // null means no upper limit
}

export const PROPERTY_SIZE_CONFIGS: PropertySizeConfig[] = [
    { id: 'small', label: 'Up to 1999', multiplier: 1.0, minSqft: 0, maxSqft: 1999 },
    { id: 'medium', label: '2000 - 3499', multiplier: 1.2, minSqft: 2000, maxSqft: 3499 },
    { id: 'large', label: '3500 - 4999', multiplier: 1.3, minSqft: 3500, maxSqft: 4999 },
    { id: 'xlarge', label: 'Above 5000', multiplier: 1.3, minSqft: 5000, maxSqft: null },
];

/**
 * Calculate adjusted package price based on property size
 * @param basePrice - Base price of the package
 * @param propertySize - Property size category or square footage number
 * @returns Adjusted price
 */
export function getAdjustedPackagePrice(basePrice: number, propertySize?: PropertySize | number | string | null): number {
    if (!propertySize) {
        return basePrice;
    }

    let multiplier = 1.0;

    // If propertySize is a string category (small, medium, large, xlarge)
    if (typeof propertySize === 'string' && ['small', 'medium', 'large', 'xlarge'].includes(propertySize)) {
        const config = PROPERTY_SIZE_CONFIGS.find(c => c.id === propertySize);
        multiplier = config?.multiplier || 1.0;
    } 
    // If propertySize is a number (square footage)
    else if (typeof propertySize === 'number' || (typeof propertySize === 'string' && !isNaN(Number(propertySize)))) {
        const sqft = typeof propertySize === 'string' ? parseInt(propertySize) : propertySize;
        
        if (sqft < 2000) {
            multiplier = 1.0;
        } else if (sqft >= 2000 && sqft < 3500) {
            multiplier = 1.2;
        } else if (sqft >= 3500 && sqft < 5000) {
            multiplier = 1.30;
        } else if (sqft >= 5000) {
            multiplier = 1.3;
        }
    }

    return Math.round(basePrice * multiplier);
}

/** Preferred partner codes (case-insensitive match). */
export const PREFERRED_PARTNER_CODES: string[] = ['RLPFRANK2026', 'WELCOME2026'];

/** Discount % by code: package and addon. Used when API partner code data is not available. */
export const PREFERRED_PARTNER_DISCOUNTS_BY_CODE: Record<string, { packagePercent: number; addonPercent: number }> = {
    RLPFRANK2026: { packagePercent: 7.5, addonPercent: 10 },
    WELCOME2026: { packagePercent: 20, addonPercent: 20 },
};

/** @deprecated Use PREFERRED_PARTNER_DISCOUNTS_BY_CODE for code-specific package discount. */
export const PREFERRED_PARTNER_DISCOUNTS: Record<string, number> = {
    essential: 7.5,
    premium: 7.5,
    luxury: 7.5,
    growth: 7.5,
    accelerator: 7.5,
};

export function isValidPreferredPartnerCode(code: string | undefined): boolean {
    if (!code || typeof code !== 'string') return false;
    const normalized = code.trim().toUpperCase();
    return PREFERRED_PARTNER_CODES.some(c => c.toUpperCase() === normalized);
}

/**
 * Get package price after property size adjustment and optional preferred partner discount.
 * When a valid partner code is used, returns the discounted price only (no strike-through).
 */
export function getPackagePriceWithPartner(
    basePrice: number,
    propertySize?: PropertySize | number | string | null,
    packageId?: string,
    preferredPartnerCode?: string | null
): { price: number; isPartnerDiscount: boolean } {
    const sizeAdjusted = getAdjustedPackagePrice(basePrice, propertySize);
    const code = typeof preferredPartnerCode === 'string' ? preferredPartnerCode.trim().toUpperCase() : '';
    const codeConfig = code ? PREFERRED_PARTNER_DISCOUNTS_BY_CODE[code] : undefined;
    const discountPercent = codeConfig?.packagePercent ?? 0;
    if (discountPercent <= 0) {
        return { price: sizeAdjusted, isPartnerDiscount: false };
    }
    const price = Math.round(sizeAdjusted * (1 - discountPercent / 100));
    return { price, isPartnerDiscount: true };
}

/** Add-on discount % when a valid preferred partner code is used (fallback if code not in PREFERRED_PARTNER_DISCOUNTS_BY_CODE). */
const PREFERRED_PARTNER_ADDON_DISCOUNT_PERCENT = 10;

/**
 * Get add-on base price based on whether a package is selected.
 * Returns different prices for addons when a package is selected vs when no package is selected.
 */
export function getAddonBasePrice(
    addonId: string,
    hasPackageSelected: boolean
): number {
    // Price mapping: [withPackage, withoutPackage]
    const priceMap: Record<string, [number, number]> = {
        'drone_photos': [59, 119],
        'drone_video': [59, 149],
        'twilight_photos': [29, 49],
        'standard_video': [149, 189],
        'cinematic_video': [249, 299],
        'agent_walkthrough': [199, 249],
        'social_reel': [199, 249], // Agent Social Media Reel
        'floor_plan': [79, 119],
        // Keep same price for these
        'virtual_tour': [249, 249], // 3D tour iGuide & 2D floor Plan - Same as now
        'cinematic_video_extended': [349, 349], // Keep same if exists
        'virtual_staging': [12, 12], // Keep same
        'listing_website': [149, 149], // Will be filtered out when package selected
    };

    const prices = priceMap[addonId];
    if (prices) {
        return hasPackageSelected ? prices[0] : prices[1];
    }

    // Fallback to original price from ADD_ONS if not in map
    const addon = ADD_ONS.find(a => a.id === addonId);
    return addon?.price || 0;
}

/**
 * Get add-on price with optional preferred partner discount (e.g. RLPFRANK2026: 10% off add-ons).
 * Now also considers package selection for base price.
 */
export function getAddonPriceWithPartner(
    addonId: string,
    hasPackageSelected: boolean,
    preferredPartnerCode?: string | null
): number {
    const basePrice = getAddonBasePrice(addonId, hasPackageSelected);
    const code = typeof preferredPartnerCode === 'string' ? preferredPartnerCode.trim().toUpperCase() : '';
    const codeConfig = code ? PREFERRED_PARTNER_DISCOUNTS_BY_CODE[code] : undefined;
    const discount = codeConfig?.addonPercent ?? (isValidPreferredPartnerCode(preferredPartnerCode ?? undefined) ? PREFERRED_PARTNER_ADDON_DISCOUNT_PERCENT : 0);
    if (discount <= 0) return basePrice;
    return Math.round(basePrice * (1 - discount / 100));
}

/**
 * Add-on IDs that are already included in each real estate package (from package.services).
 * Used to filter add-ons so we only show options not already in the selected package.
 */
export const PACKAGE_INCLUDED_ADDON_IDS: Record<string, string[]> = {
    essential: [
        'listing_website', // "Listing Website"
    ],
    premium: [
        'drone_photos',    // "Drone Photography & Video"
        'drone_video',
        'twilight_photos', // "Twilight Photography"
        'floor_plan',      // "2D Floor Plan - Standard"
        'listing_website', // "Listing Website"
        'cinematic_video', // "Cinematic Property Video or Social Media Reel" (one included)
        'social_reel',
    ],
    luxury: [
        'drone_photos',
        'drone_video',
        'twilight_photos',
        'virtual_tour',    // "3D Virtual Tour (iGUIDE)"
        'floor_plan',      // "2D Floor Plan - Accurate"
        'cinematic_video', // "Cinematic Property Video"
        'agent_walkthrough', // "Premium Agent Walkthrough Video or Social Media Reel"
        'social_reel',
        'listing_website',
    ],
};

export const getPackages = (): Package[] => {
    return [
        {
            id: 'essential',
            name: 'Essential',
            description: 'Perfect for regular listings and rental properties.',
            basePrice: 449,
            photoCount: 30,
            services: [
                '30-40 Professional HDR Photos',
                'Standard Property Video or Social Media Reel(60 - 90 seconds)',
                'Interior & Exterior Coverage',
                'Listing Website'
            ],
            images: [
                'https://picsum.photos/seed/essential1/800/400',
                'https://picsum.photos/seed/essential2/800/400',
                'https://picsum.photos/seed/essential3/800/400',
                'https://picsum.photos/seed/essential4/800/400',
            ]
        },
        {
            id: 'premium',
            name: 'Premium',
            description: 'Ideal for high-end listings that need full coverage.',
            basePrice: 649,
            photoCount: 40,
            popular: true,
            services: [
                '40-50 Professional HDR Photos',
                'Drone Photography & Video',
                'Twilight Photography',
                '2D Floor Plan - Standard',
                'Cinematic Property Video or Social Media Reel (60 - 90 seconds)',
                'Listing Website'
            ],
            images: [
                'https://picsum.photos/seed/premium1/800/400',
                'https://picsum.photos/seed/premium2/800/400',
                'https://picsum.photos/seed/premium3/800/400',
                'https://picsum.photos/seed/premium4/800/400',
            ]
        },
        {
            id: 'luxury',
            name: 'Luxury',
            description: 'The ultimate marketing suite for luxury real estate.',
            basePrice: 999,
            photoCount: 50,
            services: [
                '50 Professional HDR Photos',
                'Drone Photography & Video',
                'Twilight Photography',
                '3D Virtual Tour (iGUIDE)',
                '2D Floor Plan - Accurate',
                'Cinematic Property Video (90 - 150 seconds)',
                'Premium Agent Walkthrough Video or Social Media Reel (60 - 90 seconds)',
                'Listing Website'
            ],
            images: [
                'https://picsum.photos/seed/luxury1/800/400',
                'https://picsum.photos/seed/luxury2/800/400',
                'https://picsum.photos/seed/luxury3/800/400',
                'https://picsum.photos/seed/luxury4/800/400',
            ]
        }
    ];
};
