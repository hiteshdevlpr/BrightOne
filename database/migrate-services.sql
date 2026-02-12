-- Migration: Services Inventory Tables
-- This script creates all tables needed for managing services, packages, addons, and pricing.
-- Idempotent: safe to run on every deploy (CREATE TABLE IF NOT EXISTS, etc.).
-- Requires: run against brightone_db with superuser or role that can create extension.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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

-- Create triggers for updated_at (idempotent: drop if exists then create)
DROP TRIGGER IF EXISTS update_service_categories_updated_at ON service_categories;
CREATE TRIGGER update_service_categories_updated_at BEFORE UPDATE ON service_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_packages_updated_at ON packages;
CREATE TRIGGER update_packages_updated_at BEFORE UPDATE ON packages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_addons_updated_at ON addons;
CREATE TRIGGER update_addons_updated_at BEFORE UPDATE ON addons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_partner_codes_updated_at ON partner_codes;
CREATE TRIGGER update_partner_codes_updated_at BEFORE UPDATE ON partner_codes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_property_size_configs_updated_at ON property_size_configs;
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

-- Create triggers for price history (idempotent)
DROP TRIGGER IF EXISTS log_package_price_changes ON packages;
CREATE TRIGGER log_package_price_changes AFTER UPDATE ON packages
    FOR EACH ROW WHEN (OLD.base_price IS DISTINCT FROM NEW.base_price)
    EXECUTE FUNCTION log_price_changes();

DROP TRIGGER IF EXISTS log_addon_price_changes ON addons;
CREATE TRIGGER log_addon_price_changes AFTER UPDATE ON addons
    FOR EACH ROW WHEN (
        OLD.base_price IS DISTINCT FROM NEW.base_price OR
        OLD.price_with_package IS DISTINCT FROM NEW.price_with_package OR
        OLD.price_without_package IS DISTINCT FROM NEW.price_without_package
    )
    EXECUTE FUNCTION log_price_changes();
