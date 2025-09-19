# Email Authentication Setup Guide

This guide will help you set up proper email authentication for `brightone.ca` to prevent emails from being flagged as "Unverified" in Outlook and other email clients.

## 🔍 **Current Issue**

Emails from `noreply@brightone.ca` are being flagged as "Unverified" because:
- Missing SPF record
- Missing DKIM authentication
- Missing DMARC policy

## 🛠️ **Solution: Set Up Email Authentication**

### Step 1: Configure DKIM in AWS SES

1. **Go to AWS SES Console**
   - Navigate to [AWS SES Console](https://console.aws.amazon.com/ses/)
   - Make sure you're in the `ca-central-1` region

2. **Set up DKIM for your domain**
   - Go to "Verified identities"
   - Find `brightone.ca` (or add it if not verified)
   - Click on the domain
   - Go to "DKIM" tab
   - Click "Generate DKIM tokens"
   - Copy the 3 DKIM tokens (they look like: `abc123._domainkey.brightone.ca`)

### Step 2: Add DNS Records

You need to add these DNS records to your `brightone.ca` domain:

#### A. SPF Record
Add this TXT record to your domain's DNS:
```
Name: @ (or leave blank)
Type: TXT
Value: v=spf1 include:amazonses.com ~all
TTL: 3600
```

#### B. DKIM Records
Add these 3 CNAME records (replace with your actual DKIM tokens from AWS SES):
```
Name: abc123._domainkey
Type: CNAME
Value: abc123.dkim.amazonses.com
TTL: 3600

Name: def456._domainkey
Type: CNAME
Value: def456.dkim.amazonses.com
TTL: 3600

Name: ghi789._domainkey
Type: CNAME
Value: ghi789.dkim.amazonses.com
TTL: 3600
```

#### C. DMARC Record
Add this TXT record:
```
Name: _dmarc
Type: TXT
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@brightone.ca; ruf=mailto:dmarc@brightone.ca; fo=1
TTL: 3600
```

### Step 3: Verify Domain in AWS SES

1. **Add Domain Verification**
   - In AWS SES Console, go to "Verified identities"
   - Click "Create identity"
   - Choose "Domain"
   - Enter: `brightone.ca`
   - Click "Create identity"

2. **Add DNS Verification Record**
   - AWS will provide a TXT record to verify domain ownership
   - Add this TXT record to your DNS:
   ```
   Name: _amazonses
   Type: TXT
   Value: [AWS provided verification token]
   TTL: 3600
   ```

3. **Wait for Verification**
   - Click "Verify" in AWS SES
   - Wait for status to change to "Verified"

### Step 4: Enable DKIM Signing

1. **In AWS SES Console**
   - Go to your verified domain `brightone.ca`
   - Go to "DKIM" tab
   - Click "Edit"
   - Enable "DKIM signing"
   - Save changes

### Step 5: Test Email Authentication

After setting up all DNS records, test your email authentication:

1. **Send a test email**
2. **Check email headers** for authentication results
3. **Use online tools** to verify your setup:
   - [MXToolbox SPF Checker](https://mxtoolbox.com/spf.aspx)
   - [DKIM Validator](https://dkimvalidator.com/)
   - [DMARC Analyzer](https://dmarc.postmarkapp.com/)

## 📋 **Complete DNS Records Summary**

Here's what you need to add to your `brightone.ca` DNS:

```
# SPF Record
@ TXT "v=spf1 include:amazonses.com ~all"

# Domain Verification (from AWS SES)
_amazonses TXT "[AWS verification token]"

# DKIM Records (replace with your actual tokens)
abc123._domainkey CNAME abc123.dkim.amazonses.com
def456._domainkey CNAME def456.dkim.amazonses.com
ghi789._domainkey CNAME ghi789.dkim.amazonses.com

# DMARC Record
_dmarc TXT "v=DMARC1; p=quarantine; rua=mailto:dmarc@brightone.ca; ruf=mailto:dmarc@brightone.ca; fo=1"
```

## ⏱️ **Timeline**

- **DNS propagation**: 15 minutes to 24 hours
- **AWS SES verification**: Usually within minutes
- **Email authentication**: Takes effect immediately after DNS propagation

## 🧪 **Testing**

After setup, test by:
1. Sending an email from your contact form
2. Checking if it's still flagged as "Unverified"
3. Looking at email headers for authentication results

## 🚨 **Important Notes**

1. **Replace DKIM tokens**: The example tokens above are placeholders. Use your actual DKIM tokens from AWS SES.

2. **Email address**: Make sure `dmarc@brightone.ca` exists or change it to an existing email address in the DMARC record.

3. **DMARC Policy**: Start with `p=quarantine` (soft fail) and monitor reports before moving to `p=reject` (hard fail).

4. **Monitoring**: Set up DMARC reporting to monitor authentication results.

## 🔧 **Troubleshooting**

If emails are still flagged as "Unverified":

1. **Check DNS propagation**: Use `dig` or online DNS checkers
2. **Verify AWS SES status**: Ensure domain is verified and DKIM is enabled
3. **Check email headers**: Look for SPF, DKIM, and DMARC results
4. **Wait for propagation**: DNS changes can take up to 24 hours

## 📞 **Need Help?**

If you need assistance with DNS setup, contact your domain registrar or DNS provider. Most providers have guides for adding these records.
