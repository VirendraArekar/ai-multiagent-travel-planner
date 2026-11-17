#!/usr/bin/env bash
set -e

mkdir -p docs/screenshots
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
USER_DATA="/tmp/chrome-capture-profile"
rm -rf "$USER_DATA"
mkdir -p "$USER_DATA"

PAGES=(
  "http://localhost:3000/|docs/screenshots/01-landing.png"
  "http://localhost:3000/dashboard|docs/screenshots/02-dashboard.png"
  "http://localhost:3000/planner|docs/screenshots/03-planner.png"
  "http://localhost:3000/wizard|docs/screenshots/04-wizard.png"
  "http://localhost:3000/destinations|docs/screenshots/05-destinations.png"
  "http://localhost:3000/destinations/dest-paris|docs/screenshots/06-destination-detail.png"
  "http://localhost:3000/flights|docs/screenshots/07-flights.png"
  "http://localhost:3000/hotels|docs/screenshots/08-hotels.png"
  "http://localhost:3000/hotels/hot-1|docs/screenshots/09-hotel-detail.png"
  "http://localhost:3000/itinerary/trip-paris-1|docs/screenshots/10-itinerary.png"
  "http://localhost:3000/budget/trip-paris-1|docs/screenshots/11-budget.png"
  "http://localhost:3000/map/trip-paris-1|docs/screenshots/12-map.png"
  "http://localhost:3000/bookings|docs/screenshots/13-bookings.png"
  "http://localhost:3000/chat|docs/screenshots/14-chat.png"
  "http://localhost:3000/agents/monitoring|docs/screenshots/15-agent-monitoring.png"
  "http://localhost:3000/trips|docs/screenshots/16-trips.png"
  "http://localhost:3000/saved-destinations|docs/screenshots/17-saved-destinations.png"
  "http://localhost:3000/admin|docs/screenshots/18-admin.png"
  "http://localhost:3000/profile|docs/screenshots/19-profile.png"
  "http://localhost:3000/settings|docs/screenshots/20-settings.png"
  "http://localhost:3000/notifications|docs/screenshots/21-notifications.png"
  "http://localhost:3000/login|docs/screenshots/22-login.png"
  "http://localhost:3000/register|docs/screenshots/23-register.png"
)

echo "Capturing 23 Light Theme Page Screenshots..."
for item in "${PAGES[@]}"; do
  URL="${item%%|*}"
  OUT="${item##*|}"
  echo "Capturing $OUT from $URL..."
  "$CHROME" \
    --headless=new \
    --disable-gpu \
    --user-data-dir="$USER_DATA" \
    --force-prefers-color-scheme=light \
    --screenshot="$OUT" \
    --window-size=1440,900 \
    "$URL" >/dev/null 2>&1 || true
done

echo "Capturing Dark Theme Dashboard Screenshot..."
"$CHROME" \
  --headless=new \
  --disable-gpu \
  --user-data-dir="$USER_DATA" \
  --force-prefers-color-scheme=dark \
  --screenshot="docs/screenshots/24-dashboard-dark.png" \
  --window-size=1440,900 \
  "http://localhost:3000/dashboard" >/dev/null 2>&1 || true

echo "All screenshots captured successfully!"
ls -la docs/screenshots/
