# Version 2.8.4 Changelog

## Changes
- **Custom PWA Icon**: Added user-provided custom maritime-themed PNG icon featuring cross, waves, and sun
- **PWA Manifest**: Updated manifest.json to reference new holy-crosser-icon.png
- **Browser Integration**: Updated HTML favicon and Apple touch icon references
- **Icon Optimization**: Configured icon for both 192x192 and 512x512 sizes with maskable purpose
- **Version Display**: Updated app interface to show Version 2.8.4 in top-right corner
- **Cache Busting**: Added version parameters to icon URLs to force deployment refresh

## Technical Details
- Replaced default SVG icons with custom PNG icon
- Updated client/public/manifest.json icon configurations
- Modified client/index.html favicon and apple-touch-icon references
- Added holy-crosser-icon.png to public assets
- Updated version number in client/src/pages/home.tsx
- Added ?v=2.8.4 parameters to all icon references for cache invalidation
- Created backup icon copies (icon-192.png, icon-512.png) for deployment redundancy

## Files Modified
- `VERSION` (2.8.3 → 2.8.4)
- `client/public/manifest.json` (name and icon references)
- `client/index.html` (favicon and Apple touch icon)
- `client/src/pages/home.tsx` (version display)
- Added: `client/public/holy-crosser-icon.png`
- Added: `client/public/icon-192.png` (backup)
- Added: `client/public/icon-512.png` (backup)

## Impact
- Enhanced app branding with professional maritime theme
- Improved PWA installation experience with custom icon
- Better visual identity for home screen and app store listings
- Consistent icon display across all platforms and browsers
- Accurate version tracking in app interface

## Deployment Notes
- Cache-busting parameters ensure new icon loads on production
- Backup icon files provide deployment redundancy
- Ready for Git commit and production deployment

**Status: FROZEN - Version 2.8.4 ready for Git commit and deployment**