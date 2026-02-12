// Database access layer for services inventory
import { query } from './database';
import type {
    ServiceCategory,
    Package,
    Addon,
    PackageIncludedAddon,
    PartnerCode,
    PropertySizeConfig,
    PriceHistory,
    CreatePackageRequest,
    UpdatePackageRequest,
    CreateAddonRequest,
    UpdateAddonRequest,
    CreatePartnerCodeRequest,
    UpdatePartnerCodeRequest,
    CreatePropertySizeConfigRequest,
    UpdatePropertySizeConfigRequest,
} from '@/types/services';

// Service Categories
export async function getServiceCategories(activeOnly: boolean = true): Promise<ServiceCategory[]> {
    const sql = activeOnly
        ? 'SELECT * FROM service_categories WHERE active = true ORDER BY sort_order ASC'
        : 'SELECT * FROM service_categories ORDER BY sort_order ASC';
    const result = await query(sql);
    return result.rows;
}

export async function getServiceCategoryByCode(code: string): Promise<ServiceCategory | null> {
    const result = await query('SELECT * FROM service_categories WHERE code = $1', [code]);
    return result.rows[0] || null;
}

// Packages
export async function getPackages(
    categoryCode?: string,
    activeOnly: boolean = true
): Promise<Package[]> {
    let sql = `
        SELECT p.*, sc.code as category_code
        FROM packages p
        JOIN service_categories sc ON p.category_id = sc.id
    `;
    const params: (string | boolean)[] = [];
    
    if (categoryCode) {
        sql += ' WHERE sc.code = $1';
        params.push(categoryCode);
        if (activeOnly) {
            sql += ' AND p.active = $2';
            params.push(activeOnly);
        }
    } else if (activeOnly) {
        sql += ' WHERE p.active = $1';
        params.push(activeOnly);
    }
    
    sql += ' ORDER BY p.sort_order ASC, p.name ASC';
    
    const result = await query(sql, params);
    return result.rows;
}

export async function getPackageById(id: string): Promise<Package | null> {
    const result = await query(
        `SELECT p.*, sc.code as category_code
         FROM packages p
         JOIN service_categories sc ON p.category_id = sc.id
         WHERE p.id = $1`,
        [id]
    );
    return result.rows[0] || null;
}

export async function getPackageByCode(
    categoryCode: string,
    packageCode: string
): Promise<Package | null> {
    const result = await query(
        `SELECT p.*, sc.code as category_code
         FROM packages p
         JOIN service_categories sc ON p.category_id = sc.id
         WHERE sc.code = $1 AND p.code = $2`,
        [categoryCode, packageCode]
    );
    return result.rows[0] || null;
}

export async function createPackage(data: CreatePackageRequest): Promise<Package> {
    const result = await query(
        `INSERT INTO packages (
            category_id, code, name, description, base_price, photo_count,
            popular, active, sort_order, images, services
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *`,
        [
            data.category_id,
            data.code,
            data.name,
            data.description || null,
            data.base_price,
            data.photo_count || null,
            data.popular || false,
            data.active !== undefined ? data.active : true,
            data.sort_order || 0,
            data.images || [],
            data.services || [],
        ]
    );
    return result.rows[0];
}

export async function updatePackage(data: UpdatePackageRequest): Promise<Package> {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (data.category_id !== undefined) {
        updates.push(`category_id = $${paramIndex++}`);
        params.push(data.category_id);
    }
    if (data.code !== undefined) {
        updates.push(`code = $${paramIndex++}`);
        params.push(data.code);
    }
    if (data.name !== undefined) {
        updates.push(`name = $${paramIndex++}`);
        params.push(data.name);
    }
    if (data.description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        params.push(data.description);
    }
    if (data.base_price !== undefined) {
        updates.push(`base_price = $${paramIndex++}`);
        params.push(data.base_price);
    }
    if (data.photo_count !== undefined) {
        updates.push(`photo_count = $${paramIndex++}`);
        params.push(data.photo_count);
    }
    if (data.popular !== undefined) {
        updates.push(`popular = $${paramIndex++}`);
        params.push(data.popular);
    }
    if (data.active !== undefined) {
        updates.push(`active = $${paramIndex++}`);
        params.push(data.active);
    }
    if (data.sort_order !== undefined) {
        updates.push(`sort_order = $${paramIndex++}`);
        params.push(data.sort_order);
    }
    if (data.images !== undefined) {
        updates.push(`images = $${paramIndex++}`);
        params.push(data.images);
    }
    if (data.services !== undefined) {
        updates.push(`services = $${paramIndex++}`);
        params.push(data.services);
    }

    if (updates.length === 0) {
        return getPackageById(data.id) as Promise<Package>;
    }

    params.push(data.id);
    const result = await query(
        `UPDATE packages SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        params
    );
    return result.rows[0];
}

export async function deletePackage(id: string): Promise<void> {
    // Soft delete
    await query('UPDATE packages SET active = false WHERE id = $1', [id]);
}

// Addons
export async function getAddons(
    categoryCode?: string,
    activeOnly: boolean = true
): Promise<Addon[]> {
    let sql = `
        SELECT a.*, sc.code as category_code
        FROM addons a
        LEFT JOIN service_categories sc ON a.category_id = sc.id
    `;
    const params: (string | boolean)[] = [];
    const conditions: string[] = [];

    if (categoryCode) {
        conditions.push('(sc.code = $1 OR a.category_id IS NULL)');
        params.push(categoryCode);
    }
    if (activeOnly) {
        conditions.push('a.active = $' + (params.length + 1));
        params.push(activeOnly);
    }

    if (conditions.length > 0) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY a.sort_order ASC, a.name ASC';

    const result = await query(sql, params);
    return result.rows;
}

export async function getAddonById(id: string): Promise<Addon | null> {
    const result = await query('SELECT * FROM addons WHERE id = $1', [id]);
    return result.rows[0] || null;
}

export async function getAddonByCode(code: string): Promise<Addon | null> {
    const result = await query('SELECT * FROM addons WHERE code = $1', [code]);
    return result.rows[0] || null;
}

export async function createAddon(data: CreateAddonRequest): Promise<Addon> {
    const result = await query(
        `INSERT INTO addons (
            category_id, code, name, description, base_price,
            price_with_package, price_without_package, category,
            image_url, comments, active, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *`,
        [
            data.category_id || null,
            data.code,
            data.name,
            data.description || null,
            data.base_price,
            data.price_with_package || null,
            data.price_without_package || null,
            data.category || null,
            data.image_url || null,
            data.comments || null,
            data.active !== undefined ? data.active : true,
            data.sort_order || 0,
        ]
    );
    return result.rows[0];
}

export async function updateAddon(data: UpdateAddonRequest): Promise<Addon> {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    const fields: Array<keyof UpdateAddonRequest> = [
        'category_id',
        'code',
        'name',
        'description',
        'base_price',
        'price_with_package',
        'price_without_package',
        'category',
        'image_url',
        'comments',
        'active',
        'sort_order',
    ];

    fields.forEach((field) => {
        if (data[field] !== undefined) {
            updates.push(`${field} = $${paramIndex++}`);
            params.push(data[field]);
        }
    });

    if (updates.length === 0) {
        return getAddonById(data.id) as Promise<Addon>;
    }

    params.push(data.id);
    const result = await query(
        `UPDATE addons SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        params
    );
    return result.rows[0];
}

export async function deleteAddon(id: string): Promise<void> {
    // Soft delete
    await query('UPDATE addons SET active = false WHERE id = $1', [id]);
}

// Package Included Addons
export async function getPackageIncludedAddons(packageId: string): Promise<PackageIncludedAddon[]> {
    const result = await query(
        'SELECT * FROM package_included_addons WHERE package_id = $1',
        [packageId]
    );
    return result.rows;
}

export async function getIncludedAddonIds(packageId: string): Promise<string[]> {
    const result = await query(
        `SELECT a.code
         FROM package_included_addons pia
         JOIN addons a ON pia.addon_id = a.id
         WHERE pia.package_id = $1`,
        [packageId]
    );
    return result.rows.map((row) => row.code);
}

export async function addPackageIncludedAddon(
    packageId: string,
    addonId: string
): Promise<PackageIncludedAddon> {
    const result = await query(
        `INSERT INTO package_included_addons (package_id, addon_id)
         VALUES ($1, $2)
         ON CONFLICT (package_id, addon_id) DO NOTHING
         RETURNING *`,
        [packageId, addonId]
    );
    return result.rows[0];
}

export async function removePackageIncludedAddon(
    packageId: string,
    addonId: string
): Promise<void> {
    await query(
        'DELETE FROM package_included_addons WHERE package_id = $1 AND addon_id = $2',
        [packageId, addonId]
    );
}

// Partner Codes
export async function getPartnerCodes(activeOnly: boolean = true): Promise<PartnerCode[]> {
    const sql = activeOnly
        ? `SELECT * FROM partner_codes 
           WHERE active = true 
           AND (valid_until IS NULL OR valid_until > CURRENT_TIMESTAMP)
           ORDER BY created_at DESC`
        : 'SELECT * FROM partner_codes ORDER BY created_at DESC';
    const result = await query(sql);
    return result.rows;
}

export async function getPartnerCodeByCode(code: string): Promise<PartnerCode | null> {
    const result = await query(
        `SELECT * FROM partner_codes 
         WHERE UPPER(code) = UPPER($1) 
         AND active = true
         AND (valid_until IS NULL OR valid_until > CURRENT_TIMESTAMP)`,
        [code]
    );
    return result.rows[0] || null;
}

export async function isValidPartnerCode(code: string): Promise<boolean> {
    const partnerCode = await getPartnerCodeByCode(code);
    return partnerCode !== null;
}

export async function createPartnerCode(data: CreatePartnerCodeRequest): Promise<PartnerCode> {
    const result = await query(
        `INSERT INTO partner_codes (
            code, name, description, package_discount_percent,
            addon_discount_percent, active, valid_from, valid_until
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
            data.code,
            data.name || null,
            data.description || null,
            data.package_discount_percent,
            data.addon_discount_percent,
            data.active !== undefined ? data.active : true,
            data.valid_from || null,
            data.valid_until || null,
        ]
    );
    return result.rows[0];
}

export async function updatePartnerCode(data: UpdatePartnerCodeRequest): Promise<PartnerCode> {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    const fields: Array<keyof UpdatePartnerCodeRequest> = [
        'code',
        'name',
        'description',
        'package_discount_percent',
        'addon_discount_percent',
        'active',
        'valid_from',
        'valid_until',
    ];

    fields.forEach((field) => {
        if (data[field] !== undefined) {
            updates.push(`${field} = $${paramIndex++}`);
            params.push(data[field]);
        }
    });

    if (updates.length === 0) {
        const result = await query('SELECT * FROM partner_codes WHERE id = $1', [data.id]);
        return result.rows[0];
    }

    params.push(data.id);
    const result = await query(
        `UPDATE partner_codes SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        params
    );
    return result.rows[0];
}

export async function deletePartnerCode(id: string): Promise<void> {
    // Soft delete
    await query('UPDATE partner_codes SET active = false WHERE id = $1', [id]);
}

// Property Size Configs
export async function getPropertySizeConfigs(
    activeOnly: boolean = true
): Promise<PropertySizeConfig[]> {
    const sql = activeOnly
        ? 'SELECT * FROM property_size_configs WHERE active = true ORDER BY sort_order ASC'
        : 'SELECT * FROM property_size_configs ORDER BY sort_order ASC';
    const result = await query(sql);
    return result.rows;
}

export async function getPropertySizeConfigByCode(
    code: string
): Promise<PropertySizeConfig | null> {
    const result = await query(
        'SELECT * FROM property_size_configs WHERE code = $1 AND active = true',
        [code]
    );
    return result.rows[0] || null;
}

export async function createPropertySizeConfig(
    data: CreatePropertySizeConfigRequest
): Promise<PropertySizeConfig> {
    const result = await query(
        `INSERT INTO property_size_configs (
            code, label, multiplier, min_sqft, max_sqft, active, sort_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
            data.code,
            data.label,
            data.multiplier,
            data.min_sqft,
            data.max_sqft || null,
            data.active !== undefined ? data.active : true,
            data.sort_order || 0,
        ]
    );
    return result.rows[0];
}

export async function updatePropertySizeConfig(
    data: UpdatePropertySizeConfigRequest
): Promise<PropertySizeConfig> {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    const fields: Array<keyof UpdatePropertySizeConfigRequest> = [
        'code',
        'label',
        'multiplier',
        'min_sqft',
        'max_sqft',
        'active',
        'sort_order',
    ];

    fields.forEach((field) => {
        if (data[field] !== undefined) {
            updates.push(`${field} = $${paramIndex++}`);
            params.push(data[field]);
        }
    });

    if (updates.length === 0) {
        const result = await query('SELECT * FROM property_size_configs WHERE id = $1', [data.id]);
        return result.rows[0];
    }

    params.push(data.id);
    const result = await query(
        `UPDATE property_size_configs SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
        params
    );
    return result.rows[0];
}

export async function deletePropertySizeConfig(id: string): Promise<void> {
    await query('DELETE FROM property_size_configs WHERE id = $1', [id]);
}

// Price History
export async function getPriceHistory(
    entityType?: 'package' | 'addon',
    entityId?: string,
    limit: number = 50,
    offset: number = 0
): Promise<PriceHistory[]> {
    let sql = 'SELECT * FROM price_history WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;

    if (entityType) {
        sql += ` AND entity_type = $${paramIndex++}`;
        params.push(entityType);
    }
    if (entityId) {
        sql += ` AND entity_id = $${paramIndex++}`;
        params.push(entityId);
    }

    sql += ` ORDER BY created_at DESC LIMIT $${paramIndex++} OFFSET $${paramIndex++}`;
    params.push(limit, offset);

    const result = await query(sql, params);
    return result.rows;
}
