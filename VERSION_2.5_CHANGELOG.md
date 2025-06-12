# Version 2.5.0 - Enhanced Separator Coordination

Released: June 12, 2025

## New Features

### Visual Separator Coordination
- **Today's Row Framing**: Blue separators now appear both above and below today's row for complete visual coordination
- **Intelligent Separator Logic**: Separator colors automatically detect when next day is today to ensure proper framing
- **Enhanced Color Scheme**: Refined blue separator color (#93c5fd) to perfectly complement today's background highlighting

## Improvements

### Visual Consistency
- **Weekend Separator Fix**: Restored proper gray color (#9ca3af) for weekend separator after Friday
- **Complete Today Highlighting**: Today's row now has cohesive visual theme with matching background and separators
- **Eliminated Border Conflicts**: Removed conflicting inline border styles for cleaner separator rendering

## Technical Details

### Separator Color Logic
- White separators: Between regular weekdays
- Blue separators: Above and below today's row (#93c5fd)
- Gray separator: 3px thick separator after Friday for weekend visual break (#9ca3af)

### Code Architecture
- Enhanced separator detection logic with `isNextDayToday` check
- Streamlined row styling without conflicting border properties
- Maintained responsive design compatibility

## Bug Fixes
- Fixed weekend separator appearing black instead of gray
- Resolved today's upper separator remaining white
- Eliminated CSS conflicts between row borders and separator elements

---

This version completes the visual coordination system for today's row highlighting, providing a polished and intuitive user experience for maritime navigation data.