#!/bin/bash

# Backup original
cp /usr/local/lsws/conf/vhosts/tripogram.com/vhost.conf /usr/local/lsws/conf/vhosts/tripogram.com/vhost.conf.bak

# Remove old extprocessor if exists
sed -i '/^extprocessor nextjs/,/^}/d' /usr/local/lsws/conf/vhosts/tripogram.com/vhost.conf

# Write the correct .htaccess with proxy rewrite
cat > /home/tripogram.com/public_html/.htaccess << 'EOF'
RewriteEngine On
RewriteCond %{HTTP_HOST} ^tripogram.com$ [NC,OR]
RewriteCond %{HTTP_HOST} ^www.tripogram.com$ [NC]
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
EOF

echo "=== .htaccess content ==="
cat /home/tripogram.com/public_html/.htaccess

# Restart OLS
systemctl restart lshttpd
echo "=== OLS Restarted ==="

# Check PM2 status
pm2 status
