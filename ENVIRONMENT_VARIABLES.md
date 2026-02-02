# Environment Variables Configuration

This document outlines all the environment variables needed for the BrightOne application.

## Required Environment Variables

### Database Configuration
```bash
DB_PASSWORD=your_secure_database_password
DATABASE_URL=postgresql://brightone:${DB_PASSWORD}@db:5432/brightone_db
```

### Google Maps API
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

### Google reCAPTCHA v3
```bash
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_v3_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_v3_secret_key
```

### NextAuth Configuration
```bash
NEXTAUTH_SECRET=your_nextauth_secret_key
NEXTAUTH_URL=https://brightone.ca
```

### AWS SES Configuration
```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key_id
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key
```

### Email Configuration
```bash
FROM_EMAIL=noreply@brightone.ca
ADMIN_EMAIL=admin@brightone.ca
```

### Redis Configuration (for Docker)
```bash
REDIS_URL=redis://redis:6379
```

## Setting Up AWS SES

### 1. Create AWS Account and SES Service
1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Navigate to Amazon SES service
3. Choose your preferred region (e.g., us-east-1)

### 2. Verify Email Addresses
1. In SES console, go to "Verified identities"
2. Click "Create identity"
3. Choose "Email address"
4. Add your FROM_EMAIL (e.g., noreply@brightone.ca)
5. Add your ADMIN_EMAIL (e.g., admin@brightone.ca)
6. Check your email and click the verification link

### 3. Create IAM User for SES
1. Go to IAM console
2. Create a new user (e.g., "brightone-ses-user")
3. Attach the "AmazonSESFullAccess" policy
4. Create access keys and save them securely

### 4. Request Production Access (Optional)
- By default, SES is in sandbox mode (can only send to verified emails)
- To send to any email address, request production access in SES console

## GitHub Secrets Configuration

Add these secrets to your GitHub repository:

1. Go to your repository settings
2. Navigate to "Secrets and variables" > "Actions"
3. Add the following secrets:

```
DB_PASSWORD
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
NEXTAUTH_SECRET
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
FROM_EMAIL
ADMIN_EMAIL
```

## Local Development

Create a `.env.local` file in your project root:

```bash
# Copy the environment variables above
# Replace the values with your actual credentials
```

## Production Deployment

The GitHub Actions workflow will automatically create the `.env` file on the server with the secrets from GitHub.

## Security Notes

- Never commit actual credentials to version control
- Use strong, unique passwords
- Rotate AWS access keys regularly
- Monitor SES usage and costs
- Set up CloudWatch alarms for SES metrics
