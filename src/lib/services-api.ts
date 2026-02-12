// API client for fetching services data from the database
import type {
    Package,
    Addon,
    ServiceCategory,
    PartnerCode,
    PropertySizeConfig,
    PackageClient,
    AddOnClient,
} from '@/types/services';

// Simple in-memory cache with TTL
interface CacheEntry<T> {
    data: T;
    timestamp: number;
    ttl: number; // Time to live in milliseconds
}

class SimpleCache {
    private cache = new Map<string, CacheEntry<any>>();
    private defaultTTL = 5 * 60 * 1000; // 5 minutes

    get<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() - entry.timestamp > entry.ttl) {
            this.cache.delete(key);
            return null;
        }

        return entry.data as T;
    }

    set<T>(key: string, data: T, ttl?: number): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            ttl: ttl || this.defaultTTL,
        });
    }

    clear(): void {
        this.cache.clear();
    }
}

const cache = new SimpleCache();

// API Response types
interface ApiResponse<T> {
    success: boolean;
    error?: string;
    [key: string]: any;
}

// Fetch with error handling
async function fetchApi<T>(
    endpoint: string,
    options?: RequestInit
): Promise<T> {
    try {
        const response = await fetch(endpoint, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options?.headers,
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({
                error: `HTTP ${response.status}: ${response.statusText}`,
            }));
            throw new Error(error.error || 'API request failed');
        }

        const data: ApiResponse<T> = await response.json();
        if (!data.success) {
            throw new Error(data.error || 'API request failed');
        }

        return data as T;
    } catch (error) {
        console.error(`API error (${endpoint}):`, error);
        throw error;
    }
}

// Transform database Package to client PackageClient
function transformPackage(pkg: Package): PackageClient {
    return {
        id: pkg.code,
        name: pkg.name,
        description: pkg.description || '',
        basePrice: Number(pkg.base_price),
        services: pkg.services || [],
        photoCount: pkg.photo_count || undefined,
        popular: pkg.popular,
        images: pkg.images || [],
    };
}

// Transform database Addon to client AddOnClient
function transformAddon(addon: Addon): AddOnClient {
    return {
        id: addon.code,
        name: addon.name,
        description: addon.description || '',
        price: Number(addon.base_price),
        category: addon.category || '',
        image: addon.image_url || '',
        comments: addon.comments || undefined,
    };
}

// Service Categories
export async function getServiceCategories(
    activeOnly: boolean = true
): Promise<ServiceCategory[]> {
    const cacheKey = `categories_${activeOnly}`;
    const cached = cache.get<ServiceCategory[]>(cacheKey);
    if (cached) return cached;

    const data = await fetchApi<{ categories: ServiceCategory[] }>(
        `/api/services/categories?active=${activeOnly}`
    );
    cache.set(cacheKey, data.categories);
    return data.categories;
}

// Packages
export async function getPackages(
    category?: 'listing' | 'personal',
    activeOnly: boolean = true
): Promise<PackageClient[]> {
    const cacheKey = `packages_${category || 'all'}_${activeOnly}`;
    const cached = cache.get<PackageClient[]>(cacheKey);
    if (cached) return cached;

    const url = category
        ? `/api/services/packages?category=${category}&active=${activeOnly}`
        : `/api/services/packages?active=${activeOnly}`;
    const data = await fetchApi<{ packages: Package[] }>(url);
    const transformed = data.packages.map(transformPackage);
    cache.set(cacheKey, transformed);
    return transformed;
}

// Addons
export async function getAddons(
    category?: 'listing' | 'personal',
    activeOnly: boolean = true
): Promise<AddOnClient[]> {
    const cacheKey = `addons_${category || 'all'}_${activeOnly}`;
    const cached = cache.get<AddOnClient[]>(cacheKey);
    if (cached) return cached;

    const url = category
        ? `/api/services/addons?category=${category}&active=${activeOnly}`
        : `/api/services/addons?active=${activeOnly}`;
    const data = await fetchApi<{ addons: Addon[] }>(url);
    const transformed = data.addons.map(transformAddon);
    cache.set(cacheKey, transformed);
    return transformed;
}

// Partner Codes
export async function validatePartnerCode(
    code: string
): Promise<{ valid: boolean; partnerCode?: PartnerCode }> {
    const cacheKey = `partner_${code}`;
    const cached = cache.get<{ valid: boolean; partnerCode?: PartnerCode }>(cacheKey);
    if (cached) return cached;

    try {
        const data = await fetchApi<{
            valid: boolean;
            partnerCode?: PartnerCode;
        }>(`/api/services/partner-codes/${encodeURIComponent(code)}`);
        cache.set(cacheKey, data, 10 * 60 * 1000); // Cache for 10 minutes
        return data;
    } catch (error) {
        return { valid: false };
    }
}

// Property Size Configs
export async function getPropertySizeConfigs(
    activeOnly: boolean = true
): Promise<PropertySizeConfig[]> {
    const cacheKey = `property_sizes_${activeOnly}`;
    const cached = cache.get<PropertySizeConfig[]>(cacheKey);
    if (cached) return cached;

    const data = await fetchApi<{ configs: PropertySizeConfig[] }>(
        `/api/services/property-sizes?active=${activeOnly}`
    );
    cache.set(cacheKey, data.configs, 30 * 60 * 1000); // Cache for 30 minutes
    return data.configs;
}

// Clear cache (useful after updates)
export function clearServicesCache(): void {
    cache.clear();
}

// Get package included addon IDs (requires fetching from database)
// This will be handled by the hook/component that has access to package data
export function getPackageIncludedAddonIds(
    packageCode: string,
    allAddons: AddOnClient[]
): string[] {
    // This is a simplified version - in reality, this should come from the database
    // For now, we'll use the hardcoded mapping as fallback
    const packageInclusions: Record<string, string[]> = {
        essential: ['listing_website'],
        premium: [
            'drone_photos',
            'drone_video',
            'twilight_photos',
            'floor_plan',
            'listing_website',
            'cinematic_video',
            'social_reel',
        ],
        luxury: [
            'drone_photos',
            'drone_video',
            'twilight_photos',
            'virtual_tour',
            'floor_plan',
            'cinematic_video',
            'agent_walkthrough',
            'social_reel',
            'listing_website',
        ],
    };

    return packageInclusions[packageCode] || [];
}
