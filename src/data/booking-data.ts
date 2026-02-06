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
    { id: 'extra_photos', name: 'Extra Photos (per 10 images)', description: 'Additional photos beyond package limit', price: 75, category: 'photography', image: 'https://picsum.photos/seed/addon-extra/400/300' },
    { id: 'cinematic_video', name: 'Cinematic Video Tour', description: 'Professional property video tour (1-2 min)', price: 249, category: 'videography', image: 'https://picsum.photos/seed/addon-cinematic/400/300' },
    { id: 'cinematic_video_extended', name: 'Cinematic Video Tour (Extended)', description: 'Professional property video tour (2-3 min)', price: 349, category: 'videography', image: 'https://picsum.photos/seed/addon-cinext/400/300' },
    { id: 'agent_walkthrough', name: 'Agent Walkthrough Video', description: 'Personalized agent introduction video', price: 319, category: 'videography', image: 'https://picsum.photos/seed/addon-agent/400/300' },
    { id: 'social_reel', name: 'Social Media Reel', description: 'Short form vertical cut for social platforms', price: 250, category: 'videography', image: 'https://picsum.photos/seed/addon-reel/400/300' },
    { id: 'virtual_tour', name: '3D Virtual Tour (iGUIDE)', description: 'Interactive 3D property tour', price: 249, category: 'virtual_tour', image: 'https://picsum.photos/seed/addon-3dtour/400/300' },
    { id: 'floor_plan', name: '2D Floor Plan', description: 'Accurate layout for MLS compliance', price: 99, category: 'floor_plans', image: 'https://picsum.photos/seed/addon-floor/400/300' },
    { id: 'listing_website', name: 'Listing Website', description: 'Custom property showcase website', price: 149, category: 'listing_website', image: 'https://picsum.photos/seed/addon-website/400/300' },
    { id: 'virtual_staging', name: 'Virtual Staging', description: 'Digitally furnished and decorated photos (per photo)', price: 12, category: 'virtual_staging', image: 'https://picsum.photos/seed/addon-staging/400/300' }
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
    { id: 'small', label: '0-1500 sqft', multiplier: 1.0, minSqft: 0, maxSqft: 1500 },
    { id: 'medium', label: '1500-2500 sqft', multiplier: 1.15, minSqft: 1501, maxSqft: 2500 },
    { id: 'large', label: '2500-5000 sqft', multiplier: 1.30, minSqft: 2501, maxSqft: 5000 },
    { id: 'xlarge', label: '5000+ sqft', multiplier: 1.50, minSqft: 5001, maxSqft: null },
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
        
        if (sqft <= 1500) {
            multiplier = 1.0;
        } else if (sqft >= 1501 && sqft <= 2500) {
            multiplier = 1.15;
        } else if (sqft >= 2501 && sqft <= 5000) {
            multiplier = 1.30;
        } else if (sqft >= 5001) {
            multiplier = 1.50;
        }
    }

    return Math.round(basePrice * multiplier);
}

export const getPackages = (): Package[] => {
    return [
        {
            id: 'essential',
            name: 'Essential',
            description: 'Perfect for regular listings and rental properties.',
            basePrice: 499,
            photoCount: 30,
            services: [
                '30-40 Professional HDR Photos',
                'Drone Photos',
                '2D Floor Plan',
                'Property Video (60 - 90 seconds) or Social Media Reel(48 hour turnaround)',
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
                'Drone Photography',
                'Twilight Photography',
                '2D Floor Plan',
                'Cinematic Property Video (90 - 150 seconds) or Social Media Reel(48 hour turnaround)',
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
                '3D Virtual Tour (iGUIDE)',
                '2D Floor Plan with Dimensions',
                'Cinematic Property Video (90 - 150 seconds)',
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
