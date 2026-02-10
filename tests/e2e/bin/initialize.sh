#!/usr/bin/env bash

echo "Initializing E2E"

# Enable pretty permalinks.
wp-env run tests-wordpress chmod -c ugo+w /var/www/html
wp-env run tests-cli wp rewrite structure '/%postname%/' --hard
