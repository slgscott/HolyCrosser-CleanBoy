# Holy Crosser V2 - Version 2.8.3 Changelog

## Released: June 16, 2025

### 🎯 **Major Enhancement: Database Timestamp Integration**

This version integrates authentic database timestamps from the Harbor Data Manager production system, providing users with real-time data freshness information.

---

## ✨ **New Features**

### **Database Timestamp Display**
- **Weather Data Title**: Now displays actual database update timestamp (e.g., "Updated: 16 Jun, 10:54")
- **Universal Footer**: Added timestamp footer under all three data tables
- **Authentic Sources**: Real-time timestamps from Harbor Data Manager `updated_at` columns

### **Enhanced Source Attribution**
- **Crossings Data**: "Source: Northumberland County Council"
- **Tides Data**: "Source: UK Hydrographic Office"  
- **Weather Data**: "Source: Open-Meteo"
- **Footer Positioning**: Clean placement outside table boundaries

---

## 🔧 **Technical Improvements**

### **API Enhancements**
- All endpoints now return `{data, lastUpdated}` structure
- Added `getCrossingTimesLastUpdated()`, `getTideTimesLastUpdated()`, `getWeatherDataLastUpdated()` methods
- Database queries use `MAX(updated_at)` for most recent timestamps
- British Summer Time (BST) formatting with `en-GB` locale

### **Frontend Updates**
- Updated data extraction to handle new API response structure
- Conditional rendering for timestamp display
- Responsive footer layout with left/right text alignment
- TypeScript improvements for timestamp handling

---

## 🗃️ **Database Schema Compatibility**

### **Production Database Updates**
- Compatible with new `created_at` and `updated_at` columns
- Supports `timestamp without time zone` data type
- Handles Harbor Data Manager production schema changes

---

## 📱 **User Experience**

### **Data Freshness Transparency**
- Users can see exactly when data was last updated in production
- Weather timestamp in title matches footer timestamp
- Clear attribution to original data sources
- Professional grey styling for footer information

---

## 🚀 **Deployment Ready**

This version represents a **stable, production-ready** state with:
- ✅ Authentic Harbor database connections
- ✅ Real timestamp functionality
- ✅ Proper source attributions
- ✅ Clean UI/UX implementation
- ✅ Comprehensive error handling
- ✅ No breaking changes to existing functionality

---

## 📋 **Version Summary**

**Version 2.8.3** successfully implements authentic database timestamp functionality while maintaining all existing features from Version 2.8.2. The application continues to provide reliable harbor crossing data with enhanced transparency about data freshness and sources.

**Recommended for production deployment.**