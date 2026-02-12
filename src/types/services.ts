// Type definitions for services inventory and booking

export interface ServiceCategory {
    id: string;
    code: string; // 'listing' or 'personal'
    name: string;
    description?: string;
    active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface Package {
    id: string;
    category_id: string;
    code: string; // 'essential', 'premium', 'luxury', 'growth', 'accelerator', 'tailored'
    name: string;
    description?: string;
    base_price: number;
    photo_count?: number;
    popular: boolean;
    active: boolean;
    sort_order: number;
    images: string[];
    services: string[];
    created_at: string;
    updated_at: string;
}

export interface Addon {
    id: string;
    category_id?: string; // NULL = available for all categories
    code: string; // 'drone_photos', 'virtual_staging', etc.
    name: string;
    description?: string;
    base_price: number;
    price_with_package?: number; // Price when package is selected
    price_without_package?: number; // Price when no package
    category?: string; // 'photography', 'videography', etc.
    image_url?: string;
    comments?: string;
    active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface PackageIncludedAddon {
    id: string;
    package_id: string;
    addon_id: string;
    created_at: string;
}

export interface PartnerCode {
    id: string;
    code: string; // 'RLPFRANK2026'
    name?: string;
    description?: string;
    package_discount_percent: number;
    addon_discount_percent: number;
    active: boolean;
    valid_from?: string;
    valid_until?: string;
    created_at: string;
    updated_at: string;
}

export interface PropertySizeConfig {
    id: string;
    code: string; // 'small', 'medium', 'large', 'xlarge'
    label: string;
    multiplier: number;
    min_sqft: number;
    max_sqft?: number; // NULL = no upper limit
    active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface PriceHistory {
    id: string;
    entity_type: 'package' | 'addon';
    entity_id: string;
    field_name: string;
    old_value?: number;
    new_value: number;
    changed_by?: string;
    change_reason?: string;
    created_at: string;
}

// API Request/Response types
export interface CreatePackageRequest {
    category_id: string;
    code: string;
    name: string;
    description?: string;
    base_price: number;
    photo_count?: number;
    popular?: boolean;
    active?: boolean;
    sort_order?: number;
    images?: string[];
    services?: string[];
}

export interface UpdatePackageRequest extends Partial<CreatePackageRequest> {
    id: string;
}

export interface CreateAddonRequest {
    category_id?: string;
    code: string;
    name: string;
    description?: string;
    base_price: number;
    price_with_package?: number;
    price_without_package?: number;
    category?: string;
    image_url?: string;
    comments?: string;
    active?: boolean;
    sort_order?: number;
}

export interface UpdateAddonRequest extends Partial<CreateAddonRequest> {
    id: string;
}

export interface CreatePartnerCodeRequest {
    code: string;
    name?: string;
    description?: string;
    package_discount_percent: number;
    addon_discount_percent: number;
    active?: boolean;
    valid_from?: string;
    valid_until?: string;
}

export interface UpdatePartnerCodeRequest extends Partial<CreatePartnerCodeRequest> {
    id: string;
}

export interface CreatePropertySizeConfigRequest {
    code: string;
    label: string;
    multiplier: number;
    min_sqft: number;
    max_sqft?: number;
    active?: boolean;
    sort_order?: number;
}

export interface UpdatePropertySizeConfigRequest extends Partial<CreatePropertySizeConfigRequest> {
    id: string;
}

// Client-side convenience types (matching existing interfaces)
export interface PackageClient {
    id: string;
    name: string;
    description: string;
    basePrice: number;
    services: string[];
    photoCount?: number;
    popular?: boolean;
    images: string[];
}

export interface AddOnClient {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
    comments?: string;
}

export interface PropertySizeConfigClient {
    id: string;
    label: string;
    multiplier: number;
    minSqft: number;
    maxSqft: number | null;
}
