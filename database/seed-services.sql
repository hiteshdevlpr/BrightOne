-- Seed script: Migrate services data from TypeScript files to database
-- Run this after migrate-services.sql

-- Insert service categories
INSERT INTO service_categories (code, name, description, active, sort_order) VALUES
('listing', 'Real Estate Listing Media', 'HDR photography, video tours, drone aerials, and virtual staging', true, 1),
('personal', 'Personal Branding Media', 'Professional headshots, lifestyle portraits, and social media content', true, 2)
ON CONFLICT (code) DO NOTHING;

-- Get category IDs (using CTE for clarity)
WITH categories AS (
    SELECT id, code FROM service_categories WHERE code IN ('listing', 'personal')
)
-- Insert Real Estate packages
INSERT INTO packages (category_id, code, name, description, base_price, photo_count, popular, active, sort_order, images, services)
SELECT 
    (SELECT id FROM categories WHERE code = 'listing'),
    'essential',
    'Essential',
    'Perfect for regular listings and rental properties.',
    449.00,
    30,
    false,
    true,
    1,
    ARRAY[
        'https://picsum.photos/seed/essential1/800/400',
        'https://picsum.photos/seed/essential2/800/400',
        'https://picsum.photos/seed/essential3/800/400',
        'https://picsum.photos/seed/essential4/800/400'
    ],
    ARRAY[
        '30-40 Professional HDR Photos',
        'Standard Property Video or Social Media Reel(60 - 90 seconds)',
        'Interior & Exterior Coverage',
        'Listing Website'
    ]
ON CONFLICT (category_id, code) DO NOTHING;

WITH categories AS (
    SELECT id, code FROM service_categories WHERE code IN ('listing', 'personal')
)
INSERT INTO packages (category_id, code, name, description, base_price, photo_count, popular, active, sort_order, images, services)
SELECT 
    (SELECT id FROM categories WHERE code = 'listing'),
    'premium',
    'Premium',
    'Ideal for high-end listings that need full coverage.',
    649.00,
    40,
    true,
    true,
    2,
    ARRAY[
        'https://picsum.photos/seed/premium1/800/400',
        'https://picsum.photos/seed/premium2/800/400',
        'https://picsum.photos/seed/premium3/800/400',
        'https://picsum.photos/seed/premium4/800/400'
    ],
    ARRAY[
        '40-50 Professional HDR Photos',
        'Drone Photography & Video',
        'Twilight Photography',
        '2D Floor Plan - Standard',
        'Cinematic Property Video or Social Media Reel (60 - 90 seconds)',
        'Listing Website'
    ]
ON CONFLICT (category_id, code) DO NOTHING;

WITH categories AS (
    SELECT id, code FROM service_categories WHERE code IN ('listing', 'personal')
)
INSERT INTO packages (category_id, code, name, description, base_price, photo_count, popular, active, sort_order, images, services)
SELECT 
    (SELECT id FROM categories WHERE code = 'listing'),
    'luxury',
    'Luxury',
    'The ultimate marketing suite for luxury real estate.',
    999.00,
    50,
    false,
    true,
    3,
    ARRAY[
        'https://picsum.photos/seed/luxury1/800/400',
        'https://picsum.photos/seed/luxury2/800/400',
        'https://picsum.photos/seed/luxury3/800/400',
        'https://picsum.photos/seed/luxury4/800/400'
    ],
    ARRAY[
        '50 Professional HDR Photos',
        'Drone Photography & Video',
        'Twilight Photography',
        '3D Virtual Tour (iGUIDE)',
        '2D Floor Plan - Accurate',
        'Cinematic Property Video (90 - 150 seconds)',
        'Premium Agent Walkthrough Video or Social Media Reel (60 - 90 seconds)',
        'Listing Website'
    ]
ON CONFLICT (category_id, code) DO NOTHING;

-- Insert Personal Branding packages
WITH categories AS (
    SELECT id, code FROM service_categories WHERE code IN ('listing', 'personal')
)
INSERT INTO packages (category_id, code, name, description, base_price, photo_count, popular, active, sort_order, images, services)
SELECT 
    (SELECT id FROM categories WHERE code = 'personal'),
    'growth',
    'Growth',
    'Monthly video content subscription for consistent social media presence.',
    700.00,
    NULL,
    false,
    true,
    1,
    ARRAY[
        'https://picsum.photos/seed/pb-growth1/800/400',
        'https://picsum.photos/seed/pb-growth2/800/400',
        'https://picsum.photos/seed/pb-growth3/800/400',
        'https://picsum.photos/seed/pb-growth4/800/400'
    ],
    ARRAY[
        '5 Videos per Month',
        'Vertical Short Form Videos for Instagram, Facebook, TikTok, etc.',
        'Horizontal videos for YouTube, Facebook, etc.',
        'Highly Engaging Content with Fast Paced Edits and Trending Audio',
        '2-3 Hour Shoot per month',
        'No Contract to Start',
        'Add On: Outdoor shoots for open house, neighbourhood, lifestyle'
    ]
ON CONFLICT (category_id, code) DO NOTHING;

WITH categories AS (
    SELECT id, code FROM service_categories WHERE code IN ('listing', 'personal')
)
INSERT INTO packages (category_id, code, name, description, base_price, photo_count, popular, active, sort_order, images, services)
SELECT 
    (SELECT id FROM categories WHERE code = 'personal'),
    'accelerator',
    'Accelerator',
    'Premium monthly video content subscription for maximum social media impact.',
    1300.00,
    NULL,
    true,
    true,
    2,
    ARRAY[
        'https://picsum.photos/seed/pb-accelerator1/800/400',
        'https://picsum.photos/seed/pb-accelerator2/800/400',
        'https://picsum.photos/seed/pb-accelerator3/800/400',
        'https://picsum.photos/seed/pb-accelerator4/800/400'
    ],
    ARRAY[
        '10 Videos per Month',
        'Vertical Short Form Videos for Instagram, Facebook, TikTok, etc.',
        'Horizontal videos for YouTube, Facebook, etc.',
        'Video Duration 45 - 90 Seconds',
        'Highly Engaging Content with Fast Paced Edits and Trending Audio',
        'Up to 1 Outdoor Shoot (Listing, Neighbourhood, Lifestyle)',
        '3 - 4 Hours per Month',
        'Add On: Outdoor shoots for open house, neighbourhood, lifestyle',
        'No Contract to Start'
    ]
ON CONFLICT (category_id, code) DO NOTHING;

WITH categories AS (
    SELECT id, code FROM service_categories WHERE code IN ('listing', 'personal')
)
INSERT INTO packages (category_id, code, name, description, base_price, photo_count, popular, active, sort_order, images, services)
SELECT 
    (SELECT id FROM categories WHERE code = 'personal'),
    'tailored',
    'Tailored',
    'Get in touch and we''ll modify the package as per your needs and targets.',
    0.00,
    NULL,
    false,
    true,
    3,
    ARRAY[
        'https://picsum.photos/seed/pb-tailored1/800/400',
        'https://picsum.photos/seed/pb-tailored2/800/400'
    ],
    ARRAY[
        'Custom package built for you',
        'Flexible deliverables and timeline',
        'Consultation to align with your goals'
    ]
ON CONFLICT (category_id, code) DO NOTHING;

-- Insert Real Estate addons (category_id = NULL means available for all)
INSERT INTO addons (category_id, code, name, description, base_price, price_with_package, price_without_package, category, image_url, comments, active, sort_order) VALUES
(NULL, 'drone_photos', 'Drone Photos (Exterior Aerials)', 'Aerial property shots from unique perspectives', 199.00, 59.00, 119.00, 'photography', 'https://picsum.photos/seed/addon-drone/400/300', 'This price is for properties 1 acre or less, contact us for larger properties', true, 1),
(NULL, 'drone_video', 'Drone Video', 'Aerial property video from unique perspectives', 199.00, 59.00, 149.00, 'videography', 'https://picsum.photos/seed/addon-dronevid/400/300', 'This price is for properties 1 acre or less, contact us for larger properties', true, 2),
(NULL, 'twilight_photos', 'Twilight Photos', 'Dramatic evening shots with ambient lighting', 149.00, 29.00, 49.00, 'photography', 'https://picsum.photos/seed/addon-twilight/400/300', NULL, true, 3),
(NULL, 'standard_video', 'Standard Video Tour', 'Standard property video tour', 189.00, 149.00, 189.00, 'videography', 'https://picsum.photos/seed/addon-standard-video/400/300', NULL, true, 4),
(NULL, 'cinematic_video', 'Cinematic Video Tour', 'Professional property video tour (1-2 min)', 249.00, 249.00, 299.00, 'videography', 'https://picsum.photos/seed/addon-cinematic/400/300', NULL, true, 5),
(NULL, 'cinematic_video_extended', 'Cinematic Video Tour (Extended)', 'Professional property video tour (2-3 min)', 349.00, 349.00, 349.00, 'videography', 'https://picsum.photos/seed/addon-cinext/400/300', NULL, true, 6),
(NULL, 'agent_walkthrough', 'Agent Walkthrough Video', 'Personalized agent introduction video', 319.00, 199.00, 249.00, 'videography', 'https://picsum.photos/seed/addon-agent/400/300', NULL, true, 7),
(NULL, 'social_reel', 'Social Media Reel', 'Short form vertical cut for social platforms', 250.00, 199.00, 249.00, 'videography', 'https://picsum.photos/seed/addon-reel/400/300', NULL, true, 8),
(NULL, 'virtual_tour', '3D Virtual Tour (iGUIDE) & 2D Floor Plan', 'Interactive 3D property tour & accurate 2D floor plan', 249.00, 249.00, 249.00, 'virtual_tour', 'https://picsum.photos/seed/addon-3dtour/400/300', NULL, true, 9),
(NULL, 'floor_plan', '2D Floor Plan', 'Standard', 99.00, 79.00, 119.00, 'floor_plans', 'https://picsum.photos/seed/addon-floor/400/300', NULL, true, 10),
(NULL, 'listing_website', 'Listing Website', 'Custom property showcase website', 149.00, 149.00, 149.00, 'listing_website', 'https://picsum.photos/seed/addon-website/400/300', NULL, true, 11),
(NULL, 'virtual_staging', 'Virtual Staging', 'Digitally furnished and decorated spaces ($12 per photo)', 12.00, 12.00, 12.00, 'virtual_staging', 'https://picsum.photos/seed/addon-staging/400/300', NULL, true, 12)
ON CONFLICT (code) DO NOTHING;

-- Insert Personal Branding addons
WITH personal_category AS (
    SELECT id FROM service_categories WHERE code = 'personal'
)
INSERT INTO addons (category_id, code, name, description, base_price, price_with_package, price_without_package, category, image_url, comments, active, sort_order)
SELECT 
    (SELECT id FROM personal_category),
    'extra_looks',
    'Extra Outfit / Look',
    'Additional outfit or style change during session',
    75.00,
    75.00,
    75.00,
    'styling',
    'https://picsum.photos/seed/pb-outfit/400/300',
    NULL,
    true,
    1
ON CONFLICT (code) DO NOTHING;

WITH personal_category AS (
    SELECT id FROM service_categories WHERE code = 'personal'
)
INSERT INTO addons (category_id, code, name, description, base_price, price_with_package, price_without_package, category, image_url, comments, active, sort_order)
SELECT 
    (SELECT id FROM personal_category),
    'hair_makeup',
    'Hair & Makeup Styling',
    'Professional hair and makeup artist on set',
    199.00,
    199.00,
    199.00,
    'styling',
    'https://picsum.photos/seed/pb-makeup/400/300',
    NULL,
    true,
    2
ON CONFLICT (code) DO NOTHING;

WITH personal_category AS (
    SELECT id FROM service_categories WHERE code = 'personal'
)
INSERT INTO addons (category_id, code, name, description, base_price, price_with_package, price_without_package, category, image_url, comments, active, sort_order)
SELECT 
    (SELECT id FROM personal_category),
    'linkedin_set',
    'LinkedIn Headshot Set',
    'Corporate-ready headshots optimised for LinkedIn',
    99.00,
    99.00,
    99.00,
    'photography',
    'https://picsum.photos/seed/pb-linkedin/400/300',
    NULL,
    true,
    3
ON CONFLICT (code) DO NOTHING;

WITH personal_category AS (
    SELECT id FROM service_categories WHERE code = 'personal'
)
INSERT INTO addons (category_id, code, name, description, base_price, price_with_package, price_without_package, category, image_url, comments, active, sort_order)
SELECT 
    (SELECT id FROM personal_category),
    'social_content',
    'Social Media Content Pack',
    'Cropped and formatted for Instagram, TikTok, and more',
    149.00,
    149.00,
    149.00,
    'content',
    'https://picsum.photos/seed/pb-social/400/300',
    NULL,
    true,
    4
ON CONFLICT (code) DO NOTHING;

WITH personal_category AS (
    SELECT id FROM service_categories WHERE code = 'personal'
)
INSERT INTO addons (category_id, code, name, description, base_price, price_with_package, price_without_package, category, image_url, comments, active, sort_order)
SELECT 
    (SELECT id FROM personal_category),
    'broll_video',
    'B-Roll Video Clips',
    'Short lifestyle video clips for reels and website',
    199.00,
    199.00,
    199.00,
    'videography',
    'https://picsum.photos/seed/pb-broll/400/300',
    NULL,
    true,
    5
ON CONFLICT (code) DO NOTHING;

WITH personal_category AS (
    SELECT id FROM service_categories WHERE code = 'personal'
)
INSERT INTO addons (category_id, code, name, description, base_price, price_with_package, price_without_package, category, image_url, comments, active, sort_order)
SELECT 
    (SELECT id FROM personal_category),
    'retouching',
    'Advanced Retouching (per photo)',
    'Skin smoothing, background cleanup, and colour grading',
    15.00,
    15.00,
    15.00,
    'editing',
    'https://picsum.photos/seed/pb-retouch/400/300',
    NULL,
    true,
    6
ON CONFLICT (code) DO NOTHING;

-- Insert package included addons relationships
WITH package_addons AS (
    SELECT p.id as package_id, a.id as addon_id
    FROM packages p
    CROSS JOIN addons a
    WHERE (p.code = 'essential' AND a.code = 'listing_website')
       OR (p.code = 'premium' AND a.code IN ('drone_photos', 'drone_video', 'twilight_photos', 'floor_plan', 'listing_website', 'cinematic_video', 'social_reel'))
       OR (p.code = 'luxury' AND a.code IN ('drone_photos', 'drone_video', 'twilight_photos', 'virtual_tour', 'floor_plan', 'cinematic_video', 'agent_walkthrough', 'social_reel', 'listing_website'))
)
INSERT INTO package_included_addons (package_id, addon_id)
SELECT package_id, addon_id FROM package_addons
ON CONFLICT (package_id, addon_id) DO NOTHING;

-- Insert or update partner codes
INSERT INTO partner_codes (code, name, description, package_discount_percent, addon_discount_percent, active, valid_from)
VALUES
('RLPFRANK2026', 'RLP Frank 2026', 'Preferred partner discount code', 7.5, 10.0, true, CURRENT_TIMESTAMP),
('WELCOME2026', 'Welcome 2026', 'Welcome discount code', 20.0, 20.0, true, CURRENT_TIMESTAMP)
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, package_discount_percent = EXCLUDED.package_discount_percent, addon_discount_percent = EXCLUDED.addon_discount_percent;

-- Insert or update property size configurations
INSERT INTO property_size_configs (code, label, multiplier, min_sqft, max_sqft, active, sort_order) VALUES
('small', 'Up to 1999', 1.00, 0, 1999, true, 1),
('medium', '2000 - 3499', 1.20, 2000, 3499, true, 2),
('large', '3500 - 4999', 1.30, 3500, 4999, true, 3),
('xlarge', 'Above 5000', 1.30, 5000, NULL, true, 4)
ON CONFLICT (code) DO UPDATE SET label = EXCLUDED.label, multiplier = EXCLUDED.multiplier, min_sqft = EXCLUDED.min_sqft, max_sqft = EXCLUDED.max_sqft, sort_order = EXCLUDED.sort_order;
