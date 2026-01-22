# HTTPS Setup for listings.brightone.ca

This guide will help you configure HTTPS for the `listings.brightone.ca` subdomain.

## Prerequisites

- Server with root/sudo access
- Domain `brightone.ca` already configured
- Existing SSL certificate for `brightone.ca`
- Nginx installed and configured
- Certbot installed

## Step 1: DNS Configuration

First, you need to add DNS records for the subdomain:

### A Record
```
Type: A
Name: listings
Value: [YOUR_SERVER_IP]
TTL: 300 (or default)
```

### AAAA Record (if you have IPv6)
```
Type: AAAA
Name: listings
Value: [YOUR_SERVER_IPv6]
TTL: 300 (or default)
```

## Step 2: Update SSL Certificate

### Option A: Using the automated script
```bash
./setup-subdomain-ssl.sh
```

### Option B: Manual setup
```bash
# Add subdomain to existing certificate
sudo certbot certonly --nginx -d brightone.ca -d www.brightone.ca -d listings.brightone.ca --expand

# Or create new certificate if none exists
sudo certbot certonly --nginx -d brightone.ca -d www.brightone.ca -d listings.brightone.ca
```

## Step 3: Verify Nginx Configuration

The nginx configuration has been updated to include the subdomain. Test it:

```bash
sudo nginx -t
```

If the test passes, reload nginx:

```bash
sudo systemctl reload nginx
```

## Step 4: Deploy with Docker (Optional)

If you're using Docker, you can use the nginx-enabled compose file:

```bash
# Stop existing containers
docker-compose down

# Start with nginx
docker-compose -f docker-compose.nginx.yml up -d
```

## Step 5: Test the Setup

1. **Test DNS resolution:**
   ```bash
   nslookup listings.brightone.ca
   ```

2. **Test HTTP redirect:**
   ```bash
   curl -I http://listings.brightone.ca
   # Should return 301 redirect to HTTPS
   ```

3. **Test HTTPS:**
   ```bash
   curl -I https://listings.brightone.ca
   # Should return 200 OK
   ```

4. **Test a sample listing:**
   ```bash
   curl -I https://listings.brightone.ca/123-main-street-toronto
   ```

## Step 6: Verify SSL Certificate

Check that the certificate includes the subdomain:

```bash
openssl s_client -connect listings.brightone.ca:443 -servername listings.brightone.ca < /dev/null 2>/dev/null | openssl x509 -noout -text | grep -A 1 "Subject Alternative Name"
```

You should see `DNS:listings.brightone.ca` in the output.

## Troubleshooting

### DNS Not Resolving
- Wait for DNS propagation (can take up to 48 hours)
- Check DNS records with: `dig listings.brightone.ca`
- Verify DNS configuration with your domain provider

### SSL Certificate Issues
- Ensure DNS is resolving before requesting certificate
- Check certificate with: `sudo certbot certificates`
- Renew certificate if needed: `sudo certbot renew`

### Nginx Issues
- Test configuration: `sudo nginx -t`
- Check error logs: `sudo tail -f /var/log/nginx/error.log`
- Restart nginx: `sudo systemctl restart nginx`

### Application Not Loading
- Ensure Next.js app is running on port 3000
- Check application logs
- Verify nginx is proxying correctly

## Security Considerations

1. **Firewall Rules:**
   ```bash
   # Allow HTTP and HTTPS
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

2. **Automatic Certificate Renewal:**
   ```bash
   # Add to crontab
   sudo crontab -e
   # Add this line:
   0 12 * * * /usr/bin/certbot renew --quiet
   ```

3. **Security Headers:**
   The nginx configuration includes security headers:
   - X-Frame-Options
   - X-XSS-Protection
   - X-Content-Type-Options
   - Referrer-Policy
   - Content-Security-Policy

## Monitoring

Set up monitoring for:
- SSL certificate expiration
- Subdomain availability
- Application performance
- Error rates

## Sample URLs

Once configured, these URLs should work:
- `https://listings.brightone.ca` (redirects to main site or shows listings index)
- `https://listings.brightone.ca/123-main-street-toronto`
- `https://listings.brightone.ca/456-oak-avenue-mississauga`

## Support

If you encounter issues:
1. Check the logs: `sudo journalctl -u nginx -f`
2. Verify DNS: `dig listings.brightone.ca`
3. Test SSL: `openssl s_client -connect listings.brightone.ca:443`
4. Check application: `curl -v https://listings.brightone.ca`
