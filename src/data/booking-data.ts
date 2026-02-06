export interface Package {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    services: string[];
    photoCount: number;
    popular?: boolean;
}

export interface AddOn {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    comments?: string;
}

export const ADD_ONS: AddOn[] = [
    { id: 'drone_photos', name: 'Drone Photos (Exterior Aerials)', description: 'Aerial property shots from unique perspectives', price: 199, category: 'photography', comments: 'This price is for properties 1 acre or less, contact us for larger properties' },
    { id: 'drone_video', name: 'Drone Video', description: 'Aerial property video from unique perspectives', price: 199, category: 'videography', comments: 'This price is for properties 1 acre or less, contact us for larger properties' },
    { id: 'twilight_photos', name: 'Twilight Photos', description: 'Dramatic evening shots with ambient lighting', price: 149, category: 'photography' },
    { id: 'extra_photos', name: 'Extra Photos (per 10 images)', description: 'Additional photos beyond package limit', price: 75, category: 'photography' },
    { id: 'cinematic_video', name: 'Cinematic Video Tour', description: 'Professional property video tour (1-2 min)', price: 249, category: 'videography' },
    { id: 'cinematic_video_extended', name: 'Cinematic Video Tour (Extended)', description: 'Professional property video tour (2-3 min)', price: 349, category: 'videography' },
    { id: 'agent_walkthrough', name: 'Agent Walkthrough Video', description: 'Personalized agent introduction video', price: 319, category: 'videography' },
    { id: 'social_reel', name: 'Social Media Reel', description: 'Short form vertical cut for social platforms', price: 250, category: 'videography' },
    { id: 'virtual_tour', name: '3D Virtual Tour (iGUIDE)', description: 'Interactive 3D property tour', price: 249, category: 'virtual_tour' },
    { id: 'floor_plan', name: '2D Floor Plan', description: 'Accurate layout for MLS compliance', price: 99, category: 'floor_plans' },
    { id: 'listing_website', name: 'Listing Website', description: 'Custom property showcase website', price: 149, category: 'listing_website' },
    { id: 'virtual_staging', name: 'Virtual Staging', description: 'Digitally furnished and decorated photos (per photo)', price: 12, category: 'virtual_staging' }
];

export const getPackages = (): Package[] => {
    return [
        {
            id: 'essential',
            name: 'Essential',
            description: 'Perfect for regular listings and rental properties.',
            basePrice: 399,
            photoCount: 30,
            services: [
                '30 Professional HDR Photos',
                'Drone Photography (5-8 shots)',
                '2D Floor Plan with Dimensions',
                'Cinematic Property Reel or Social Media Reel',
                'Interior & Exterior Coverage',
                '24 Hour Turnaround',
                'Cloud Storage (6 Months)',
            ]
        },
        {
            id: 'premium',
            name: 'Premium',
            description: 'Ideal for high-end listings that need full coverage.',
            basePrice: 449,
            photoCount: 40,
            popular: true,
            services: [
                '40 Professional HDR Photos',
                'Drone Photography (5-8 shots)',
                '2D Floor Plan with Dimensions',
                'Cinematic Property Reel',
                'Next Day Delivery'
            ]
        },
        {
            id: 'luxury',
            name: 'Luxury',
            description: 'The ultimate marketing suite for luxury real estate.',
            basePrice: 799,
            photoCount: 60,
            services: [
                '60 Professional HDR Photos',
                'Drone Photography & Video',
                '3D Virtual Tour (iGUIDE)',
                'Cinematic Video Tour (2-3 min)',
                'Custom Property Website',
                'Twilight Photography'
            ]
        }
    ];
};
