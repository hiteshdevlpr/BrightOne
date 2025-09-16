import { Pool } from 'pg';

// Database connection configuration
// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
// });

// Determine SSL configuration based on environment
const isProduction = process.env.NODE_ENV === 'production';
const isDocker = process.env.DATABASE_URL?.includes('@db:') || process.env.DATABASE_URL?.includes('@localhost:');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false, // Disable SSL for Docker development
    // Add connection timeout
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  });

// Test database connection
export async function testConnection() {
  try {
    console.log('Attempting to connect to database...');
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    console.log('Database connected successfully:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    console.error('Connection details:', {
      hasUrl: !!process.env.DATABASE_URL,
      nodeEnv: process.env.NODE_ENV,
      ssl: false
    });
    return false;
  }
}

// Generic query function
export async function query(text: string, params?: (string | number | boolean | null)[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Query error:', error);
    throw error;
  }
}

// Get a client from the pool
export async function getClient() {
  return await pool.connect();
}

// Close the pool
export async function closePool() {
  await pool.end();
}

// Database utility functions for common operations
export const db = {
  // Users
  async createUser(userData: { email: string; name: string; phone?: string | null }) {
    const { email, name, phone } = userData;
    const result = await query(
      'INSERT INTO users (email, name, phone) VALUES ($1, $2, $3) RETURNING *',
      [email, name, phone ?? null]
    );
    return result.rows[0];
  },

  async getUserByEmail(email: string) {
    const result = await query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
  },

  // Bookings
  async createBooking(bookingData: {
    name: string;
    email: string;
    phone?: string;
    serviceType: string;
    propertyAddress: string;
    propertyType?: string;
    propertySize?: string;
    budget?: string;
    timeline?: string;
    serviceTier?: string;
    message?: string;
  }) {
    const {
      name,
      email,
      phone,
      serviceType,
      propertyAddress,
      propertyType,
      propertySize,
      budget,
      timeline,
      serviceTier,
      message,
    } = bookingData;

    const result = await query(
      `INSERT INTO bookings (
        name, email, phone, service_type, property_address, 
        property_type, property_size, budget, timeline, 
        service_tier, message
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        name,
        email,
        phone ?? null,
        serviceType,
        propertyAddress,
        propertyType ?? null,
        propertySize ?? null,
        budget ?? null,
        timeline ?? null,
        serviceTier ?? null,
        message ?? null,
      ]
    );
    return result.rows[0];
  },

  async getBookings(limit = 50, offset = 0) {
    const result = await query(
      'SELECT * FROM bookings ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  },

  async getBookingById(id: string) {
    const result = await query('SELECT * FROM bookings WHERE id = $1', [id]);
    return result.rows[0];
  },

  async updateBookingStatus(id: string, status: string) {
    const result = await query(
      'UPDATE bookings SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  },

  // Contact Messages
  async createContactMessage(messageData: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) {
    const { name, email, phone, subject, message } = messageData;
    const result = await query(
      'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, phone ?? null, subject, message]
    );
    return result.rows[0];
  },

  async getContactMessages(limit = 50, offset = 0) {
    const result = await query(
      'SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  },

  async updateContactMessageStatus(id: string, status: string) {
    const result = await query(
      'UPDATE contact_messages SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  },

  // Portfolio Items
  async getPortfolioItems(featured?: boolean) {
    let queryText = 'SELECT * FROM portfolio_items';
    const params: (string | number | boolean | null)[] = [];

    if (featured !== undefined) {
      queryText += ' WHERE featured = $1';
      params.push(featured);
    }

    queryText += ' ORDER BY sort_order ASC, created_at DESC';

    const result = await query(queryText, params);
    return result.rows;
  },

  async createPortfolioItem(itemData: {
    title: string;
    description?: string;
    imageUrl: string;
    category: string;
    featured?: boolean;
    sortOrder?: number;
  }) {
    const { title, description, imageUrl, category, featured = false, sortOrder = 0 } = itemData;
    const result = await query(
      'INSERT INTO portfolio_items (title, description, image_url, category, featured, sort_order) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description ?? null, imageUrl, category, featured ?? false, sortOrder ?? 0]
    );
    return result.rows[0];
  },
};

export default pool;
