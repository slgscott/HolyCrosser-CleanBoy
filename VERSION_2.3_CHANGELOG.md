# Holy Crosser V2.3.0 Changelog

## PWA Display Optimization

### Enhanced Mobile Layout
- **Optimized Row Heights**: Increased from 60px to 80px for better PWA vertical space utilization
- **Enhanced Typography**: Larger, more readable fonts throughout the interface
- **Improved Day Column**: Restructured layout with "(Today)" indicator on separate line
- **Balanced Table Width**: Final 405px width (65px Day + 4×85px data columns) for optimal mobile display

### Typography Improvements
- **Day Column**: Enhanced to text-sm font-semibold for better prominence
- **Crossing Times**: Upgraded to text-sm with font-medium for improved readability
- **Tide Times**: Times displayed in text-base, heights in text-sm with font-medium
- **Weather Data**: All text upgraded to text-sm with font-medium, larger 3×3px icons

### Layout Refinements
- **Compact Day Column**: Reduced width from 80px to 65px while maintaining readability
- **Centered Alignment**: Day column content centered for better visual hierarchy
- **Responsive Width**: Iteratively optimized from 465px → 345px → 365px → 405px based on mobile testing
- **Consistent Spacing**: Balanced padding (px-2) throughout for comfortable mobile interaction

### PWA-Specific Enhancements
- **Standalone Display**: Optimized layout specifically for PWA standalone mode
- **Touch Targets**: Improved cell sizes and spacing for better mobile interaction
- **Vertical Space**: Better utilization of available screen real estate in PWA mode
- **Visual Hierarchy**: Enhanced contrast and font weights for mobile readability

### Technical Improvements
- **Flexbox Layout**: Rebuilt table structure using CSS Flexbox for perfect alignment
- **Consistent Row Heights**: All rows uniform 90px height eliminating visual inconsistencies
- **Weekend Separator**: Dedicated 3px gray line clearly marking weekend start after Friday
- **Fixed Column Alignment**: Day column perfectly aligned with maritime data columns
- **Performance**: Optimized for smooth scrolling and interaction in PWA mode

### Final Layout Specifications
- **Table Width**: 405px total (65px Day + 4×85px data columns)
- **Row Heights**: Header 60px, Data rows 90px
- **Weekend Separator**: 3px gray line after Friday row
- **Typography**: Enhanced font sizing for PWA readability

---
**Version**: 2.3.0  
**Release Date**: June 12, 2025  
**Previous Version**: 2.2.0  
**Focus**: PWA Display Optimization & Row Alignment