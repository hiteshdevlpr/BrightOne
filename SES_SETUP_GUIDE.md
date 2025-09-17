# Amazon SES Setup Guide for BrightOne

This guide will help you set up Amazon SES (Simple Email Service) for sending emails from your BrightOne application.

## Prerequisites

- AWS Account
- Domain name (brightone.ca)
- Access to DNS settings for your domain

## Step 1: Set Up AWS SES

### 1.1 Create AWS Account
1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Sign up or sign in to your AWS account
3. Navigate to Amazon SES service

### 1.2 Choose AWS Region
- Select a region (recommended: `us-east-1` for better deliverability)
- Note: SES is region-specific, so choose carefully

## Step 2: Verify Email Addresses

### 2.1 Verify Individual Email Addresses (Sandbox Mode)
1. In SES console, go to "Verified identities"
2. Click "Create identity"
3. Choose "Email address"
4. Add your email addresses:
   - `noreply@brightone.ca` (FROM_EMAIL)
   - `admin@brightone.ca` (ADMIN_EMAIL)
5. Check your email and click verification links

### 2.2 Verify Domain (Recommended for Production)
1. In SES console, go to "Verified identities"
2. Click "Create identity"
3. Choose "Domain"
4. Enter your domain: `brightone.ca`
5. Follow DNS verification steps:
   - Add TXT record to your domain's DNS
   - Add DKIM records (3 CNAME records)
   - Add SPF record (TXT record)

## Step 3: Create IAM User for SES

### 3.1 Create IAM User
1. Go to IAM console
2. Click "Users" > "Create user"
3. Username: `brightone-ses-user`
4. Select "Programmatic access"

### 3.2 Attach SES Policy
1. Click "Attach policies directly"
2. Search for and select "AmazonSESFullAccess"
3. Click "Next" and create user

### 3.3 Save Access Keys
1. Click "Create access key"
2. Choose "Application running outside AWS"
3. Save the Access Key ID and Secret Access Key securely
4. These will be your `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`

## Step 4: Request Production Access

### 4.1 Submit Production Access Request
1. In SES console, go to "Account dashboard"
2. Click "Request production access"
3. Fill out the form:
   - **Mail type**: Transactional
   - **Website URL**: https://brightone.ca
   - **Use case description**: 
     ```
     We are a real estate photography business that needs to send:
     - Booking confirmation emails to customers
     - Booking notification emails to our admin team
     - Contact form confirmation emails to customers
     - Contact form notification emails to our admin team
     
     We expect to send approximately 100-500 emails per month.
     ```
   - **Bounce and complaint handling**: We will handle bounces and complaints appropriately
   - **Processing**: We will not process emails for third parties

### 4.2 Wait for Approval
- Production access typically takes 24-48 hours
- You'll receive an email notification when approved

## Step 5: Configure Environment Variables

### 5.1 Local Development
Create `.env.local` file:
```bash
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
FROM_EMAIL=noreply@brightone.ca
ADMIN_EMAIL=admin@brightone.ca
```

### 5.2 GitHub Secrets
Add these secrets to your GitHub repository:
1. Go to repository settings
2. Navigate to "Secrets and variables" > "Actions"
3. Add the following secrets:
   - `AWS_REGION`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `FROM_EMAIL`
   - `ADMIN_EMAIL`

## Step 6: Test Email Functionality

### 6.1 Test in Development
```bash
# Start your development server
npm run dev

# Test email endpoint (only works in development)
curl http://localhost:3000/api/test-emails
```

### 6.2 Test with Real Forms
1. Fill out the booking form on your website
2. Fill out the contact form on your website
3. Check your email for notifications

## Step 7: Monitor and Maintain

### 7.1 Monitor SES Metrics
1. In SES console, go to "Account dashboard"
2. Monitor:
   - Sending quota
   - Bounce rate
   - Complaint rate
   - Reputation

### 7.2 Set Up CloudWatch Alarms
1. Go to CloudWatch console
2. Create alarms for:
   - High bounce rate (>5%)
   - High complaint rate (>0.1%)
   - Low sending quota

### 7.3 Handle Bounces and Complaints
1. Set up SNS notifications for bounces and complaints
2. Implement bounce handling in your application
3. Remove bounced email addresses from your lists

## Troubleshooting

### Common Issues

#### 1. "Email address not verified" Error
- **Cause**: Trying to send from unverified email
- **Solution**: Verify the email address in SES console

#### 2. "Daily sending quota exceeded" Error
- **Cause**: Exceeded daily sending limit
- **Solution**: Request quota increase in SES console

#### 3. "Message rejected" Error
- **Cause**: Content filtering or reputation issues
- **Solution**: Review email content and improve reputation

#### 4. Emails going to spam
- **Cause**: Poor reputation or missing authentication
- **Solution**: 
  - Set up SPF, DKIM, and DMARC records
  - Improve email content
  - Warm up your sending reputation

### Testing Commands

```bash
# Test email service directly
curl -X POST http://localhost:3000/api/test-emails \
  -H "Content-Type: application/json" \
  -d '{"testType": "booking"}'

# Test contact emails
curl -X POST http://localhost:3000/api/test-emails \
  -H "Content-Type: application/json" \
  -d '{"testType": "contact"}'
```

## Security Best Practices

1. **Never commit AWS credentials to version control**
2. **Use IAM roles with minimal permissions**
3. **Rotate access keys regularly**
4. **Monitor SES usage and costs**
5. **Implement rate limiting in your application**
6. **Validate email addresses before sending**

## Cost Optimization

1. **Monitor your sending volume**
2. **Use appropriate instance types**
3. **Set up billing alerts**
4. **Optimize email content to reduce size**

## Support Resources

- [AWS SES Documentation](https://docs.aws.amazon.com/ses/)
- [SES Best Practices](https://docs.aws.amazon.com/ses/latest/dg/best-practices.html)
- [AWS Support](https://console.aws.amazon.com/support/)
