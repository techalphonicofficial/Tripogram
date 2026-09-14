#!/bin/bash

# Fix OLS vhost.conf - add nextjs proxy context properly
VHOST_CONF="/usr/local/lsws/conf/vhosts/tripogram.com/vhost.conf"

# Backup
cp "$VHOST_CONF" "$VHOST_CONF.bak2"

# Remove previously appended broken extprocessor nextjs block if any
sed -i '/^extprocessor nextjs/,/^}/d' "$VHOST_CONF"

# Now add proper context at the top after docRoot line - insert proxy context block
# First check if context / already exists for proxy
if grep -q "context / {" "$VHOST_CONF"; then
    echo "Context / already exists"
else
    # Append a proxy context for / to vhost.conf
    cat >> "$VHOST_CONF" << 'VHOSTEOF'

extprocessor nextjs {
  type                    proxy
  address                 127.0.0.1:3000
  maxConns                100
  pcKeepAliveTimeout      60
  initTimeout             60
  retryTimeout            0
  respBuffer              0
}

context / {
  type                    proxy
  handler                 nextjs
  addDefaultCharset       off
}
VHOSTEOF
    echo "Added nextjs proxy context"
fi

echo "=== vhost.conf tail ==="
tail -30 "$VHOST_CONF"

# Restart OLS gracefully  
/usr/local/lsws/bin/lswsctrl restart
echo "=== OLS Restarted ==="

sleep 2
STATUS=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:3000/)
echo "Next.js direct status: $STATUS"
