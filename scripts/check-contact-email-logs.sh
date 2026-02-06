#!/bin/bash
# Check app container logs for contact form and email sending (to investigate missing emails).
# Run on server: bash /home/brightone/website/scripts/check-contact-email-logs.sh
# Or via SSH: ssh root@DROPLET_IP 'bash -s' < scripts/check-contact-email-logs.sh
#
# Optional: LOG_LINES=5000 (default 2000) to scan more history.

set -e
LOG_LINES="${LOG_LINES:-2000}"

# Find app container (image website-app:latest or name contains app)
APP_CONTAINER=$(docker ps --filter "ancestor=website-app:latest" --format '{{.Names}}' 2>/dev/null | head -1)
if [ -z "$APP_CONTAINER" ]; then
  APP_CONTAINER=$(docker ps -a --filter "name=app" --format '{{.Names}}' 2>/dev/null | head -1)
fi
if [ -z "$APP_CONTAINER" ]; then
  echo "No app container found. Is the stack running?"
  exit 1
fi

echo "=============================================="
echo " Contact / email log investigation"
echo " Container: $APP_CONTAINER"
echo " Last $LOG_LINES lines of app log"
echo "=============================================="

echo ""
echo "--- All APP_LOG lines (contact, email, SES) ---"
docker logs "$APP_CONTAINER" --tail="$LOG_LINES" 2>&1 | grep -E "APP_LOG|contact|Contact|email|Email|SES|sendEmail|Error sending" || echo "(none found)"

echo ""
echo "--- Errors (Error sending, Email sending failed, Contact.*error) ---"
docker logs "$APP_CONTAINER" --tail="$LOG_LINES" 2>&1 | grep -iE "Error sending|Email sending failed|Contact message creation error|Contact submission error" || echo "(none found)"

echo ""
echo "--- Recent /api/contact and email outcomes ---"
docker logs "$APP_CONTAINER" --tail="$LOG_LINES" 2>&1 | grep -E "contact form submission|Contact message submitted|Sending email|Email notifications:|Email sent successfully|customerEmailSent|adminEmailSent" || echo "(none found)"

echo ""
echo "--- Last 80 lines of app log (context) ---"
docker logs "$APP_CONTAINER" --tail=80 2>&1

echo ""
echo "=============================================="
echo " Done. If emails failed, look for:"
echo " - APP_LOG:: Error sending email: (SES errors: code, message, statusCode)"
echo " - APP_LOG:: Email sending failed:"
echo " - Missing AWS/SES env (AWS_REGION, AWS_ACCESS_KEY_ID, FROM_EMAIL, ADMIN_EMAIL)"
echo "=============================================="
