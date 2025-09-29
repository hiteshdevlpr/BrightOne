# Analytics Implementation for Booking Flow

## Overview
This document outlines the comprehensive analytics implementation for the BrightOne booking flow. The analytics track user interactions, form progress, conversion events, and abandonment patterns to provide insights into user behavior and optimize the booking experience.

## Analytics Events Implemented

### 1. Booking Flow Events

#### `booking_start`
- **Trigger**: When user first loads the booking page
- **Purpose**: Track initial engagement
- **Data**: User initiated booking process

#### `booking_step_change`
- **Trigger**: When user navigates between form steps
- **Purpose**: Track user progression through the multi-step form
- **Data**: 
  - `step`: Current step number (1, 2, 3)
  - `direction`: 'next' or 'previous'

#### `booking_complete`
- **Trigger**: When booking is successfully submitted
- **Purpose**: Track successful conversions
- **Data**:
  - `totalPrice`: Final booking amount
  - `selectedPackage`: Package type selected
  - `addOnsCount`: Number of add-ons selected
  - `formCompletionTime`: Time taken to complete form

#### `booking_abandon`
- **Trigger**: When user leaves the page without completing booking
- **Purpose**: Track abandonment patterns
- **Data**:
  - `step`: Step where user abandoned
  - `formData`: Current form state

#### `booking_reset`
- **Trigger**: When user resets the form
- **Purpose**: Track form resets
- **Data**: Step from which form was reset

### 2. Form Interaction Events

#### `form_field_focus`
- **Trigger**: When user focuses on any form field
- **Purpose**: Track field engagement
- **Data**: Field name and form type

#### `form_field_blur`
- **Trigger**: When user leaves a form field
- **Purpose**: Track field completion
- **Data**: Field name and form type

#### `form_field_change`
- **Trigger**: When user types in any form field
- **Purpose**: Track user input activity
- **Data**: Field name, value length, form type

#### `form_submit`
- **Trigger**: When form submission is attempted
- **Purpose**: Track submission attempts
- **Data**: Success/failure status

#### `form_validation_error`
- **Trigger**: When form validation fails
- **Purpose**: Track validation issues
- **Data**: Field name, error type, step number

### 3. Package and Service Selection Events

#### `package_select`
- **Trigger**: When user selects a photography package
- **Purpose**: Track package preferences
- **Data**:
  - `packageId`: Package identifier
  - `packageName`: Package display name
  - `packagePrice`: Package price

#### `addon_toggle`
- **Trigger**: When user selects/deselects add-on services
- **Purpose**: Track add-on preferences
- **Data**:
  - `addOnId`: Add-on identifier
  - `addOnName`: Add-on display name
  - `isSelected`: Selection status
  - `addOnPrice`: Add-on price

#### `virtual_staging_photos_change`
- **Trigger**: When user adjusts virtual staging photo count
- **Purpose**: Track virtual staging customization
- **Data**:
  - `photoCount`: New photo count
  - `direction`: 'increase' or 'decrease'

#### `property_size_select`
- **Trigger**: When user enters property size
- **Purpose**: Track property size preferences
- **Data**:
  - `propertySize`: Size value entered
  - `sizeCategory`: Size category (small, medium, large, luxury)

### 4. Address and Location Events

#### `address_autocomplete`
- **Trigger**: When Google Places API returns address suggestions
- **Purpose**: Track address search behavior
- **Data**:
  - `query`: Search query length
  - `suggestionCount`: Number of suggestions returned

#### `address_select`
- **Trigger**: When user selects an address
- **Purpose**: Track address selection method
- **Data**:
  - `address`: Selected address
  - `source`: 'autocomplete' or 'manual'

#### `address_autosuggest_select`
- **Trigger**: When user selects an address from Google Maps autosuggest
- **Purpose**: Track specific address selections for geographic analysis
- **Data**:
  - `address`: Full address text (truncated to 100 chars for label)
  - `value`: Address length for analysis

### 5. E-commerce Events

#### `purchase`
- **Trigger**: When booking is completed successfully
- **Purpose**: Track revenue and conversion value
- **Data**:
  - `value`: Total booking amount
  - `currency`: CAD (default)
  - `items`: Package and add-ons selected

## Implementation Details

### Analytics Library (`src/lib/analytics.ts`)
- Centralized analytics functions (13 booking-specific functions)
- Google Analytics 4 integration
- Consistent event naming and data structure
- Type-safe event parameters

### Booking Form Handler (`src/app/booking/booking-form-handler.ts`)
- Tracks form submission success/failure
- Measures form completion time
- Records conversion data

### Booking Page Client (`src/app/booking/BookingPageClient.tsx`)
- Comprehensive event tracking throughout user journey
- Real-time interaction tracking
- Form abandonment detection
- Step-by-step progression tracking

## Data Structure

### Event Categories
- `booking_flow`: Core booking process events
- `form_interaction`: Form field interactions
- `booking_interaction`: Service and package selections
- `conversion`: Successful booking completions
- `ecommerce`: Revenue tracking

### Event Labels
- Descriptive labels for easy identification
- Include relevant context (step, field, selection)
- Consistent naming convention

### Event Values
- Numeric values for quantitative analysis
- Prices, counts, completion times
- Progress percentages

## Google Analytics 4 Integration

### Custom Events
All events are sent to Google Analytics 4 using the `gtag` function:
```javascript
window.gtag('event', action, {
  event_category: category,
  event_label: label,
  value: value,
});
```

### Enhanced E-commerce
Purchase events include:
- Transaction ID
- Revenue value
- Item details
- Customer information

## Analytics Dashboard Setup

### Recommended GA4 Reports
1. **Booking Funnel Analysis**
   - Step-by-step conversion rates
   - Drop-off points identification
   - Time-to-completion analysis

2. **Package Selection Analysis**
   - Most popular packages
   - Add-on selection patterns
   - Price sensitivity analysis

3. **Form Interaction Analysis**
   - Field completion rates
   - Validation error patterns
   - User engagement metrics

4. **Revenue Analysis**
   - Average booking value
   - Revenue by package type
   - Seasonal trends

### Custom Dimensions (Optional)
Consider setting up custom dimensions for:
- Property size category
- Package type
- Add-on combinations
- Geographic location

## Privacy and Compliance

### Data Collection
- No personally identifiable information in analytics
- Aggregated and anonymized data only
- Respects user privacy preferences

### GDPR Compliance
- Analytics can be disabled based on user consent
- No tracking of sensitive personal data
- Transparent data usage

## Testing and Validation

### Testing Checklist
- [ ] All events fire correctly
- [ ] Event data is accurate
- [ ] No duplicate events
- [ ] Proper error handling
- [ ] Performance impact minimal

### Validation Tools
- Google Analytics Real-time reports
- Browser developer tools
- Google Tag Assistant
- Custom analytics dashboard

## Future Enhancements

### Potential Additions
1. **A/B Testing Integration**
   - Package presentation variations
   - Form layout testing
   - Pricing strategy testing

2. **Advanced Segmentation**
   - User behavior patterns
   - Geographic analysis
   - Device/browser insights

3. **Predictive Analytics**
   - Conversion probability scoring
   - Optimal package recommendations
   - Churn prediction

4. **Real-time Monitoring**
   - Live booking dashboard
   - Alert system for anomalies
   - Performance monitoring

## Maintenance

### Regular Tasks
- Monitor event firing accuracy
- Review conversion funnel performance
- Update event definitions as needed
- Clean up unused events

### Documentation Updates
- Keep this document current
- Document any new events added
- Update testing procedures
- Maintain privacy compliance notes
