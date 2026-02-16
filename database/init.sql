-- Initialize BrightOne database
-- This file is executed when the PostgreSQL container starts for the first time

-- Create database if it doesn't exist (handled by POSTGRES_DB env var)
-- CREATE DATABASE IF NOT EXISTS brightone_db;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    service_type VARCHAR(100) NOT NULL,
    property_address TEXT NOT NULL,
    property_type VARCHAR(50),
    property_size VARCHAR(50),
    budget VARCHAR(50),
    timeline VARCHAR(50),
    service_tier VARCHAR(50),
    selected_addons TEXT[],
    preferred_partner_code VARCHAR(50),
    preferred_date VARCHAR(50),
    preferred_time VARCHAR(50),
    total_price VARCHAR(50),
    message TEXT,
    package_price DECIMAL(10,2),
    addons_price DECIMAL(10,2),
    subtotal DECIMAL(10,2),
    tax_rate DECIMAL(5,2) DEFAULT 13.00,
    tax_amount DECIMAL(10,2),
    final_total DECIMAL(10,2),
    price_breakdown JSONB,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create portfolio_items table
CREATE TABLE IF NOT EXISTS portfolio_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    category VARCHAR(100),
    featured BOOLEAN DEFAULT FALSE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_category ON portfolio_items(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_featured ON portfolio_items(featured);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at BEFORE UPDATE ON contact_messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_items_updated_at BEFORE UPDATE ON portfolio_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample portfolio data
INSERT INTO portfolio_items (title, description, image_url, category, featured, sort_order) VALUES
('Modern Living Room', 'Beautifully staged living room with contemporary furniture and lighting', '/images/portfolio-1.jpg', 'interior', true, 1),
('Kitchen Renovation', 'Stunning kitchen with modern appliances and elegant design', '/images/portfolio-2.jpg', 'interior', true, 2),
('Exterior View', 'Professional exterior photography showcasing the property', '/images/portfolio-3.jpg', 'exterior', true, 3),
('Master Bedroom', 'Elegant master bedroom with premium staging', '/images/portfolio-4.jpg', 'interior', false, 4),
('Dining Area', 'Sophisticated dining space with perfect lighting', '/images/portfolio-5.jpg', 'interior', false, 5)
ON CONFLICT DO NOTHING;
-- Migration: Services Inventory Tables
-- This script creates all tables needed for managing services, packages, addons, and pricing

-- Create service categories table
CREATE TABLE IF NOT EXISTS service_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL, -- 'listing' or 'personal'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL, -- 'essential', 'premium', 'luxury', 'growth', 'accelerator', 'tailored'
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    photo_count INTEGER,
    popular BOOLEAN DEFAULT FALSE,
    active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    images TEXT[], -- Array of image URLs
    services TEXT[], -- Array of service descriptions
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, code)
);

-- Create addons table
CREATE TABLE IF NOT EXISTS addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES service_categories(id) ON DELETE SET NULL, -- NULL = available for all categories
    code VARCHAR(50) UNIQUE NOT NULL, -- 'drone_photos', 'virtual_staging', etc.
    name VARCHAR(100) NOT NULL,
    description TEXT,
    base_price DECIMAL(10,2) NOT NULL,
    price_with_package DECIMAL(10,2), -- Price when package is selected (NULL = same as base_price)
    price_without_package DECIMAL(10,2), -- Price when no package (NULL = same as base_price)
    category VARCHAR(50), -- 'photography', 'videography', 'virtual_tour', etc.
    image_url VARCHAR(500),
    comments TEXT, -- Additional notes (e.g., "This price is for properties 1 acre or less")
    active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create package included addons table
CREATE TABLE IF NOT EXISTS package_included_addons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    package_id UUID NOT NULL REFERENCES packages(id) ON DELETE CASCADE,
    addon_id UUID NOT NULL REFERENCES addons(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(package_id, addon_id)
);

-- Create partner codes table
CREATE TABLE IF NOT EXISTS partner_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL, -- 'RLPFRANK2026'
    name VARCHAR(100),
    description TEXT,
    package_discount_percent DECIMAL(5,2) DEFAULT 0, -- e.g., 7.5
    addon_discount_percent DECIMAL(5,2) DEFAULT 0, -- e.g., 10
    active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP WITH TIME ZONE,
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create property size configurations table
CREATE TABLE IF NOT EXISTS property_size_configs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL, -- 'small', 'medium', 'large', 'xlarge'
    label VARCHAR(100) NOT NULL, -- 'Up to 1499', '1500 - 2999', etc.
    multiplier DECIMAL(5,2) NOT NULL, -- 1.0, 1.15, 1.30, 1.50
    min_sqft INTEGER NOT NULL,
    max_sqft INTEGER, -- NULL = no upper limit
    active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create price history table (audit trail)
CREATE TABLE IF NOT EXISTS price_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type VARCHAR(20) NOT NULL, -- 'package' or 'addon'
    entity_id UUID NOT NULL,
    field_name VARCHAR(50) NOT NULL, -- 'base_price', 'price_with_package', etc.
    old_value DECIMAL(10,2),
    new_value DECIMAL(10,2) NOT NULL,
    changed_by VARCHAR(255), -- Admin user identifier
    change_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_packages_category ON packages(category_id);
CREATE INDEX IF NOT EXISTS idx_packages_active ON packages(active);
CREATE INDEX IF NOT EXISTS idx_packages_code ON packages(code);
CREATE INDEX IF NOT EXISTS idx_addons_category ON addons(category_id);
CREATE INDEX IF NOT EXISTS idx_addons_active ON addons(active);
CREATE INDEX IF NOT EXISTS idx_addons_code ON addons(code);
CREATE INDEX IF NOT EXISTS idx_package_addons_package ON package_included_addons(package_id);
CREATE INDEX IF NOT EXISTS idx_package_addons_addon ON package_included_addons(addon_id);
CREATE INDEX IF NOT EXISTS idx_partner_codes_active ON partner_codes(active);
CREATE INDEX IF NOT EXISTS idx_partner_codes_code ON partner_codes(code);
CREATE INDEX IF NOT EXISTS idx_size_configs_active ON property_size_configs(active);
CREATE INDEX IF NOT EXISTS idx_price_history_entity ON price_history(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_price_history_created ON price_history(created_at);

-- Create triggers for updated_at
CREATE TRIGGER update_service_categories_updated_at BEFORE UPDATE ON service_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addons_updated_at BEFORE UPDATE ON addons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partner_codes_updated_at BEFORE UPDATE ON partner_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_property_size_configs_updated_at BEFORE UPDATE ON property_size_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create price history trigger function
CREATE OR REPLACE FUNCTION log_price_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'packages' AND (OLD.base_price IS DISTINCT FROM NEW.base_price) THEN
        INSERT INTO price_history (entity_type, entity_id, field_name, old_value, new_value)
        VALUES ('package', NEW.id, 'base_price', OLD.base_price, NEW.base_price);
    END IF;
    
    IF TG_TABLE_NAME = 'addons' THEN
        IF OLD.base_price IS DISTINCT FROM NEW.base_price THEN
            INSERT INTO price_history (entity_type, entity_id, field_name, old_value, new_value)
            VALUES ('addon', NEW.id, 'base_price', OLD.base_price, NEW.base_price);
        END IF;
        IF OLD.price_with_package IS DISTINCT FROM NEW.price_with_package THEN
            INSERT INTO price_history (entity_type, entity_id, field_name, old_value, new_value)
            VALUES ('addon', NEW.id, 'price_with_package', OLD.price_with_package, NEW.price_with_package);
        END IF;
        IF OLD.price_without_package IS DISTINCT FROM NEW.price_without_package THEN
            INSERT INTO price_history (entity_type, entity_id, field_name, old_value, new_value)
            VALUES ('addon', NEW.id, 'price_without_package', OLD.price_without_package, NEW.price_without_package);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for price history
CREATE TRIGGER log_package_price_changes AFTER UPDATE ON packages
    FOR EACH ROW WHEN (OLD.base_price IS DISTINCT FROM NEW.base_price)
    EXECUTE FUNCTION log_price_changes();

CREATE TRIGGER log_addon_price_changes AFTER UPDATE ON addons
    FOR EACH ROW WHEN (
        OLD.base_price IS DISTINCT FROM NEW.base_price OR
        OLD.price_with_package IS DISTINCT FROM NEW.price_with_package OR
        OLD.price_without_package IS DISTINCT FROM NEW.price_without_package
    )
    EXECUTE FUNCTION log_price_changes();
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
        '/assets/img/booking/essential-1.jpg',
        '/assets/img/booking/essential-2.jpg',
        '/assets/img/booking/essential-3.jpg'
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
        '/assets/img/booking/premium-1.jpg',
        '/assets/img/booking/premium-2.jpg',
        '/assets/img/booking/premium-3.jpg'
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
        '/assets/img/booking/luxury-1.jpg',
        '/assets/img/booking/luxury-2.jpg',
        '/assets/img/booking/luxury-3.jpg'
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
ON CONFLICT (category_id, code) DO NOTHING;-- Insert Personal Branding packages
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
        '/assets/img/booking/growth-1.jpg',
        '/assets/img/booking/growth-2.jpg',
        '/assets/img/booking/growth-3.jpg'
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
        '/assets/img/booking/accelerator-1.jpg',
        '/assets/img/booking/accelerator-2.jpg',
        '/assets/img/booking/accelerator-3.jpg'
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
        '/assets/img/booking/tailored-1.jpg',
        '/assets/img/booking/tailored-2.jpg'
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

-- Insert partner codes
INSERT INTO partner_codes (code, name, description, package_discount_percent, addon_discount_percent, active, valid_from)
VALUES
('RLPFRANK2026', 'RLP Frank 2026', 'Preferred partner discount code', 7.5, 10.0, true, CURRENT_TIMESTAMP)
ON CONFLICT (code) DO NOTHING;

-- Insert property size configurations
INSERT INTO property_size_configs (code, label, multiplier, min_sqft, max_sqft, active, sort_order) VALUES
('small', 'Up to 1499', 1.00, 0, 1499, true, 1),
('medium', '1500 - 2999', 1.15, 1500, 2999, true, 2),
('large', '3000 - 4999', 1.30, 3000, 4999, true, 3),
('xlarge', 'Above 5000', 1.50, 5000, NULL, true, 4)
ON CONFLICT (code) DO NOTHING;
