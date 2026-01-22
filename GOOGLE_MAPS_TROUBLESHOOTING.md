# Google Maps API Key Troubleshooting

## Issue
Google Maps is not loading on listing pages (e.g., https://brightone.ca/listings/345-park-road-s-oshawa)

## Root Cause
The `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` environment variable is not set or not being passed correctly during the Docker build process.

## Why This Happens
In Next.js, environment variables prefixed with `NEXT_PUBLIC_` are embedded into the JavaScript bundle at **build time**, not runtime. This means:
- The variable must be available when `npm run build` is executed
- Setting it only at runtime (in the container) won't work
- It must be passed as a build argument to Docker

## Solution Steps

### 1. Verify GitHub Secret is Set
1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Verify that `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` exists and has a valid value
4. If missing, add it with your Google Maps API key

### 2. Get a Google Maps API Key (if needed)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Maps Embed API**
4. Go to **Credentials** → **Create Credentials** → **API Key**
5. Restrict the API key to:
   - **Application restrictions**: HTTP referrers
   - **Website restrictions**: Add `brightone.ca/*` and `listings.brightone.ca/*`
   - **API restrictions**: Restrict to "Maps Embed API"

### 3. Update GitHub Secret
1. Copy your Google Maps API key
2. Go to GitHub repository → **Settings** → **Secrets and variables** → **Actions**
3. Update or create `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` with your API key

### 4. Rebuild and Redeploy
After updating the secret, trigger a new deployment:
```bash
# Option 1: Push a commit to main branch
git commit --allow-empty -m "Trigger rebuild for Google Maps API key"
git push origin main

# Option 2: Manually trigger the GitHub Actions workflow
```

### 5. Verify on Server
SSH into your server and check:
```bash
cd /home/brightone/website

# Check if .env file has the key
cat .env | grep NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

# Check if it's being passed to Docker build
sudo docker-compose -f docker-compose.prod.yml config | grep GOOGLE_MAPS

# Rebuild if needed
sudo docker-compose -f docker-compose.prod.yml down
sudo docker-compose -f docker-compose.prod.yml build --no-cache
sudo docker-compose -f docker-compose.prod.yml up -d
```

## Verification
After deployment, check:
1. Visit https://brightone.ca/listings/345-park-road-s-oshawa
2. Scroll to the "Location" section
3. The Google Maps embed should load (not show the error message)

## Debug Endpoint
You can also check if the API key is available at runtime:
- Visit: https://brightone.ca/api/debug-env
- This will show if the API key is detected (though it may still not work if not set at build time)

## Important Notes
- **Never commit API keys to the repository**
- Always use GitHub Secrets for sensitive values
- The API key must be set before building the Docker image
- After updating the secret, you must rebuild the container (not just restart)

## Alternative: Runtime Configuration (Not Recommended)
If you absolutely cannot set it at build time, you would need to:
1. Use a different approach (not `NEXT_PUBLIC_` prefix)
2. Load the API key via an API route
3. This is more complex and less secure

## Current Status
The application will show a helpful error message with a link to Google Maps if the API key is not configured. Users can still view the location by clicking the "View on Google Maps" button.

