# Version 2.6.0 - Enhanced Layout and Visual Improvements

Released: June 12, 2025

## New Features

### Enhanced Row Height
- **Increased Row Height**: Expanded Monday-Sunday rows from 70px to 75px for better space utilization
- **Improved Readability**: Additional vertical space enhances content visibility and user comfort

### Smart Data Hiding Logic
- **SafeFrom2 Column Enhancement**: Applied morning time hiding logic to SafeFrom2 column
- **Consistent Behavior**: SafeFrom2 now shows "—" when start time is before 12pm (indicating next-day times)
- **Unified Experience**: Both SafeFrom2 and UnsafeFrom2 columns now use identical logic for cleaner data presentation

### Tide Times Visual Enhancement
- **High Tide Column Highlighting**: Added light blue background (#eff6ff) to High1 and High2 columns
- **Visual Hierarchy**: Enhanced distinction between high tide and low tide data
- **Consistent Styling**: Background appears across all rows without interference from today's highlighting

## Improvements

### Visual Design
- **Eliminated Style Conflicts**: Removed row-level background interference for cleaner column styling
- **Direct Cell Styling**: Applied backgrounds directly to individual cells for reliable visual consistency
- **Enhanced Color Coordination**: Maintained crossing times green/red backgrounds and added tide column distinction

### Data Presentation
- **Reduced Visual Clutter**: Hidden confusing next-day crossing times in second period columns
- **Improved Navigation Experience**: Cleaner daily view without redundant morning time displays
- **Enhanced Maritime Data Clarity**: Better visual separation between different data types

## Technical Improvements

### Layout Architecture
- **Optimized Row Structure**: Streamlined row styling without conflicting background classes
- **Direct Style Application**: Used inline styles for reliable background color application
- **Responsive Design Maintained**: All enhancements preserve mobile-first responsive behavior

### Code Quality
- **Simplified Logic**: Reduced complexity in background color determination
- **Consistent Patterns**: Applied uniform data hiding logic across similar columns
- **Performance Optimized**: Direct styling approach eliminates CSS class conflicts

## Bug Fixes
- **Column Background Issues**: Fixed tide column backgrounds appearing only on today's row
- **Style Conflicts**: Resolved interference between row-level and cell-level styling
- **Cross-Screen Consistency**: Ensured background logic works properly across all screen types

---

This version focuses on layout optimization and visual enhancements, providing a more refined user experience for maritime navigation data with better space utilization and clearer data presentation.