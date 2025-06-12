# Holy Crosser V2.4.0 Changelog

## Vertical Space Optimization & Visual Enhancement

### Data Display Improvements
- **Smart Data Hiding**: UnsafeFrom2 column now shows "—" when time is next-day (morning hours)
- **Eliminated Redundancy**: Removed duplicate next-day crossing data that appears in following day's first column
- **Cleaner Layout**: Reduced visual clutter in Safe Crossing Times screen

### Vertical Space Compression
- **Compact Header**: Reduced blue title bar padding (py-6 → py-4)
- **Streamlined Table Header**: Compressed from 60px to 45px height
- **Optimized Row Heights**: Data rows reduced from 90px → 75px → 70px for efficient space usage
- **Better Screen Utilization**: More maritime data visible without scrolling

### Visual Separation Enhancement
- **White Day Separators**: Added 1px white lines between all weekday rows
- **Weekend Separator**: Maintained 3px gray line after Friday for clear weekend distinction
- **Clean Visual Hierarchy**: Subtle but clear row divisions throughout table
- **Professional Appearance**: Enhanced readability with proper visual separation

### Layout Specifications
- **Table Width**: 405px total (65px Day + 4×85px data columns)
- **Row Heights**: Header 45px, Data rows 70px
- **Separators**: 1px white (weekdays), 3px gray (weekend)
- **Smart Logic**: Next-day times hidden to prevent redundancy

### User Experience Improvements
- **Reduced Scrolling**: More data fits on screen with compact layout
- **Clear Day Boundaries**: White separators make it easy to distinguish between days
- **Clean Data**: No duplicate or redundant crossing time information
- **Maintained Readability**: Optimized spacing without compromising clarity

---
**Version**: 2.4.0  
**Release Date**: June 12, 2025  
**Previous Version**: 2.3.0  
**Focus**: Vertical Space Optimization & Enhanced Visual Separation