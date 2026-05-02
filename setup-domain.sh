#!/bin/bash
# Run this script ONLY after:
#   1. You have purchased your domain (e.g. thesmartmom.ca)
#   2. You have added the DNS A records and CNAME at your registrar
#   3. You have enabled "Custom domain" in GitHub repo Settings → Pages
#
# Usage:  bash setup-domain.sh thesmartmom.ca

DOMAIN=${1:-thesmartmom.ca}

echo "Setting up custom domain: $DOMAIN"

# 1. Write CNAME file
echo "$DOMAIN" > public/CNAME
echo "✓ Created public/CNAME → $DOMAIN"

# 2. Switch Vite base from '/smart-mom-canada/' to '/'
sed -i '' "s|base: '/smart-mom-canada/'|base: '/'|" vite.config.js
echo "✓ Updated vite.config.js base to '/'"

# 3. Update canonical URL in index.html
sed -i '' "s|https://ahmedwasef.github.io/smart-mom-canada/|https://$DOMAIN/|g" index.html
echo "✓ Updated canonical URL in index.html to https://$DOMAIN/"

echo ""
echo "All set. Now run:  npm run deploy"
echo ""
echo "DNS records to add at your registrar:"
echo "  A  @  185.199.108.153"
echo "  A  @  185.199.109.153"
echo "  A  @  185.199.110.153"
echo "  A  @  185.199.111.153"
echo "  CNAME  www  ahmedwasef.github.io"
