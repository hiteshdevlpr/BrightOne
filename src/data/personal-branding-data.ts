export interface PersonalPackage {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    services: string[];
    images: string[];
    popular?: boolean;
}

export interface PersonalAddOn {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
}

export const PERSONAL_ADD_ONS: PersonalAddOn[] = [
    { id: 'extra_looks', name: 'Extra Outfit / Look', description: 'Additional outfit or style change during session', price: 75, image: 'https://picsum.photos/seed/pb-outfit/400/300' },
    { id: 'hair_makeup', name: 'Hair & Makeup Styling', description: 'Professional hair and makeup artist on set', price: 199, image: 'https://picsum.photos/seed/pb-makeup/400/300' },
    { id: 'linkedin_set', name: 'LinkedIn Headshot Set', description: 'Corporate-ready headshots optimised for LinkedIn', price: 99, image: 'https://picsum.photos/seed/pb-linkedin/400/300' },
    { id: 'social_content', name: 'Social Media Content Pack', description: 'Cropped and formatted for Instagram, TikTok, and more', price: 149, image: 'https://picsum.photos/seed/pb-social/400/300' },
    { id: 'broll_video', name: 'B-Roll Video Clips', description: 'Short lifestyle video clips for reels and website', price: 199, image: 'https://picsum.photos/seed/pb-broll/400/300' },
    { id: 'retouching', name: 'Advanced Retouching (per photo)', description: 'Skin smoothing, background cleanup, and colour grading', price: 15, image: 'https://picsum.photos/seed/pb-retouch/400/300' },
];

export const getPersonalPackages = (): PersonalPackage[] => {
    return [
        {
            id: 'growth',
            name: 'Growth',
            description: 'Monthly video content subscription for consistent social media presence.',
            basePrice: 700,
            services: [
                '5 Videos per Month',
                'Vertical Short Form Videos for Instagram, Facebook, TikTok, etc.',
                'Highly Engaging Content with Fast Paced Edits and Trending Audio',
                '2-3 Hour Shoot',
                'Up to 1 Outdoor Shoot (Listing, Neighbourhood, Lifestyle)',
                'No Contract to Start',
            ],
            images: [
                'https://picsum.photos/seed/pb-growth1/800/400',
                'https://picsum.photos/seed/pb-growth2/800/400',
                'https://picsum.photos/seed/pb-growth3/800/400',
                'https://picsum.photos/seed/pb-growth4/800/400',
            ],
        },
        {
            id: 'accelerator',
            name: 'Accelerator',
            description: 'Premium monthly video content subscription for maximum social media impact.',
            basePrice: 1300,
            popular: true,
            services: [
                '10 Videos per Month',
                'Vertical Short Form Videos for Instagram, Facebook, TikTok, etc.',
                'Video Duration 45 - 90 Seconds',
                'Highly Engaging Content with Fast Paced Edits and Trending Audio',
                'Up to 1 Outdoor Shoot (Listing, Neighbourhood, Lifestyle)',
                '3 - 4 Hours per Month',
                'No Contract to Start',
            ],
            images: [
                'https://picsum.photos/seed/pb-accelerator1/800/400',
                'https://picsum.photos/seed/pb-accelerator2/800/400',
                'https://picsum.photos/seed/pb-accelerator3/800/400',
                'https://picsum.photos/seed/pb-accelerator4/800/400',
            ],
        },
    ];
};
