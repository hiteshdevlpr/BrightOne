# BrightOne.ca API Documentation

Complete API endpoints for handling booking form submissions and contact messages.

## 📋 API Endpoints

### **Bookings API**

#### **POST /api/bookings**
Create a new booking request.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "(555) 123-4567",
  "serviceType": "Real Estate Photography",
  "propertyAddress": "123 Main St, Toronto, ON",
  "propertyType": "House",
  "propertySize": "2000-3000 sq ft",
  "budget": "$500-1000",
  "timeline": "1-2 weeks",
  "serviceTier": "premium",
  "message": "Looking for professional photography for my listing"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking request submitted successfully",
  "booking": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "serviceType": "Real Estate Photography",
    "status": "pending",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### **GET /api/bookings**
Get all bookings (admin only).

**Query Parameters:**
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Number to skip (default: 0)
- `status` (optional): Filter by status

#### **GET /api/bookings/[id]**
Get a specific booking by ID.

#### **PUT /api/bookings/[id]**
Update booking status.

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Valid Statuses:** `pending`, `confirmed`, `in_progress`, `completed`, `cancelled`

#### **DELETE /api/bookings/[id]**
Delete a booking.

### **Contact API**

#### **POST /api/contact**
Create a new contact message.

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "(555) 987-6543",
  "subject": "General Inquiry",
  "message": "I have questions about your services"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact message submitted successfully",
  "contact": {
    "id": "uuid",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "subject": "General Inquiry",
    "status": "unread",
    "createdAt": "2024-01-01T00:00:00Z"
  }
}
```

#### **GET /api/contact**
Get all contact messages (admin only).

#### **GET /api/contact/[id]**
Get a specific contact message.

#### **PUT /api/contact/[id]**
Update contact message status.

**Valid Statuses:** `unread`, `read`, `replied`, `archived`

#### **DELETE /api/contact/[id]**
Delete a contact message.

### **Admin Dashboard API**

#### **GET /api/admin/dashboard**
Get dashboard statistics and recent activity.

**Response:**
```json
{
  "success": true,
  "dashboard": {
    "bookings": {
      "total": 150,
      "pending": 25,
      "confirmed": 80,
      "completed": 45,
      "recent": 12
    },
    "messages": {
      "total": 75,
      "unread": 15,
      "read": 50,
      "recent": 8
    },
    "recentBookings": [...],
    "recentMessages": [...],
    "serviceBreakdown": [...]
  }
}
```

## 🔧 Form Integration

### **Booking Form Integration**

```typescript
import { handleBookingSubmission } from './booking-form-handler';

const [errors, setErrors] = useState<string[]>([]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  await handleBookingSubmission(
    formData,
    setIsSubmitting,
    setIsSubmitted,
    setErrors
  );
};
```

### **Contact Form Integration**

```typescript
import { handleContactSubmission } from './contact-form-handler';

const [errors, setErrors] = useState<string[]>([]);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  await handleContactSubmission(
    formData,
    setIsSubmitting,
    setIsSubmitted,
    setErrors
  );
};
```

## ✅ Validation

### **Booking Form Validation**
- **Required fields:** name, email, serviceType, propertyAddress, serviceTier
- **Email format:** Valid email address
- **Phone format:** Valid phone number (optional)
- **Service tier:** Must be selected

### **Contact Form Validation**
- **Required fields:** name, email, subject, message
- **Email format:** Valid email address
- **Phone format:** Valid phone number (optional)
- **Message length:** Maximum 2000 characters

## 🚨 Error Handling

### **Common Error Responses**

**400 Bad Request:**
```json
{
  "error": "Missing required fields: name, email"
}
```

**404 Not Found:**
```json
{
  "error": "Booking not found"
}
```

**409 Conflict:**
```json
{
  "error": "A booking with this email already exists"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error. Please try again later."
}
```

**503 Service Unavailable:**
```json
{
  "error": "Database connection error. Please try again later."
}
```

## 🗄️ Database Schema

### **Bookings Table**
```sql
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### **Contact Messages Table**
```sql
CREATE TABLE contact_messages (
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
```

## 🔒 Security Considerations

1. **Input Validation:** All inputs are validated on both client and server
2. **SQL Injection:** Using parameterized queries
3. **Rate Limiting:** Consider implementing rate limiting for production
4. **Authentication:** Admin endpoints should be protected
5. **CORS:** Configure CORS for production deployment

## 🚀 Usage Examples

### **Submit Booking via JavaScript**

```javascript
const response = await fetch('/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    serviceType: 'Real Estate Photography',
    propertyAddress: '123 Main St, Toronto, ON',
    serviceTier: 'premium'
  }),
});

const data = await response.json();
console.log(data);
```

### **Get Dashboard Data**

```javascript
const response = await fetch('/api/admin/dashboard');
const dashboard = await response.json();
console.log(dashboard.dashboard.bookings.total);
```

## 📝 Testing

Test the APIs using curl:

```bash
# Submit a booking
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "serviceType": "Real Estate Photography",
    "propertyAddress": "123 Test St",
    "serviceTier": "basic"
  }'

# Get all bookings
curl http://localhost:3000/api/bookings

# Get dashboard data
curl http://localhost:3000/api/admin/dashboard
```

The API is now ready for production use with comprehensive error handling, validation, and database integration!
