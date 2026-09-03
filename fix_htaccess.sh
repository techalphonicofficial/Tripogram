#!/bin/bash
cat > /home/tripogram.com/public_html/.htaccess << 'EOF'
RewriteEngine On

# 301 Redirection for Old Enquiry page
RewriteRule ^enquiry\.php$ /contact [R=301,L]

RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
EOF
echo "Done!"
cat /home/tripogram.com/public_html/.htaccess
