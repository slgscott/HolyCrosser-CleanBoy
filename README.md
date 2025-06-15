# Holy Crosser V2 - Maritime Navigation PWA

A progressive web app providing real-time maritime navigation data for safe harbor crossings with enhanced mobile experience.

## Version 2.8.0

Latest release featuring database analysis, data gap investigation, and confirmed authentic data integrity for maritime navigation.

## Features

### 🚢 Safe Crossing Times
- Real-time harbor crossing safety windows
- Morning time filtering for cleaner daily view
- Visual indicators for safe and unsafe periods
- Green/red color coding for quick reference

### 🌊 Tide Information
- High and low tide times with precise heights
- Visual distinction with light blue backgrounds for high tides
- Complete tidal cycle information for navigation planning

### 🌤️ Weather Data
- Temperature ranges and current conditions
- Precipitation forecasts with visual indicators
- Wind direction and speed information
- UV index and cloud coverage data

### 📱 Mobile-First Design
- Progressive Web App (PWA) capabilities
- Offline functionality with service worker
- Installable on mobile devices
- Responsive design optimized for maritime use

## Complete Tech Stack

### **Frontend Architecture**
- **React 18.3.1** with TypeScript 5.6.3
- **Wouter 3.3.5** for lightweight client-side routing
- **Vite 5.4.14** for build tooling and development server
- **TanStack React Query 5.60.5** for server state management and caching

### **UI Framework & Styling**
- **Tailwind CSS 3.4.17** for utility-first styling
- **Radix UI** component library (complete suite):
  - Dialog, Dropdown, Select, Toast, Tooltip, etc.
  - Ensures accessibility and consistent behavior
- **Lucide React 0.453.0** for iconography
- **Framer Motion 11.13.1** for animations
- **React Hook Form 7.55.0** with Zod validation

### **Backend Architecture**
- **Node.js** with **Express.js 4.21.2**
- **TypeScript** throughout the entire stack
- **TSX 4.19.1** for TypeScript execution in development
- **WebSocket support** via ws 8.18.0
- **Session management** with express-session and connect-pg-simple

### **Database Layer**
**Dual Database Architecture:**

1. **Harbor Data Manager Database (Read-Only)**
   - **Provider**: Neon PostgreSQL Serverless
   - **Location**: AWS US-East-1 (ep-green-brook-ade6jg4t)
   - **Purpose**: Authentic maritime data from Northumberland County Council
   - **Tables**: crossing_times, tide_data, weather_data
   - **Connection**: @neondatabase/serverless 0.10.4

2. **Local Application Database**
   - **Provider**: Replit PostgreSQL
   - **Purpose**: User preferences, app settings, authentication
   - **Tables**: users, user_preferences, app_settings

### **ORM & Database Tools**
- **Drizzle ORM 0.39.1** for type-safe database operations
- **Drizzle Kit 0.30.4** for schema management
- **Drizzle Zod 0.7.0** for schema validation
- **Connection pooling** via Neon's serverless pools

### **Progressive Web App Features**
- **Service Worker** for offline functionality
- **Web App Manifest** for installability
- **Responsive design** optimized for maritime use
- **Local storage** for user preferences

### **Development & Build Tools**
- **ESBuild 0.25.0** for production bundling
- **PostCSS 8.4.47** for CSS processing
- **Autoprefixer 10.4.20** for browser compatibility
- **Replit integration** with custom Vite plugins

### **Authentication & Security**
- **Passport.js 0.7.0** with local strategy
- **Session-based authentication**
- **HTTPS/TLS** handled by Replit deployment
- **Environment variable management**

### **Data Processing & Utilities**
- **Date-fns 3.6.0** for maritime time calculations
- **Zod 3.24.2** for runtime type validation
- **Class Variance Authority** for component styling
- **Recharts 2.15.2** for potential data visualization

### **Deployment Platform**
- **Replit** with automatic scaling
- **Zero-config deployment** with built-in TLS
- **Environment variable management**
- **Workflow automation** for development

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```bash
   DATABASE_URL=your_postgresql_connection_string
   ```
4. Start development server:
   ```bash
   npm run dev
   ```

## Database Configuration

The app connects to a PostgreSQL database containing authentic harbor data from Northumberland County Council. Required tables:

- `crossing_times` - Safe harbor crossing windows
- `tide_data` - Tidal information with heights and times
- `weather_data` - Maritime weather conditions
- `users` - User management (optional)
- `user_preferences` - Personal settings (optional)
- `app_settings` - Application configuration (optional)

## API Endpoints

- `GET /api/crossing-times/:weekOffset` - Harbor crossing data
- `GET /api/tide-times/:weekOffset` - Tidal information  
- `GET /api/weather-data/:weekOffset` - Weather conditions

## Features by Version

### V2.6.0 (Current)
- Enhanced row height (75px) for better readability
- Morning time hiding logic for SafeFrom2 column
- Light blue backgrounds for high tide columns
- Improved visual hierarchy

### V2.5.0
- Blue separator coordination around today's row
- Enhanced today highlighting with matching separators
- Fixed weekend separator colors

### V2.4.0
- Optimized table layout with flexbox structure
- Smart data hiding for cleaner presentation
- Enhanced visual separators and spacing

## Deployment

The application is designed for deployment on Replit with automatic scaling and TLS handling. For other platforms:

1. Build the application:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to your hosting platform
3. Ensure PostgreSQL database connectivity
4. Configure environment variables

## PWA Features

- **Offline Capability**: Service worker caches essential data
- **Install Prompt**: Native app-like installation experience
- **Responsive Design**: Optimized for all device sizes
- **Fast Loading**: Optimized assets and caching strategies

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with real maritime data
5. Submit a pull request

## License

Maritime navigation data provided by Northumberland County Council.
Application code available under standard licensing terms.

## Support

For technical support or maritime data inquiries, please contact the development team.

---

**Important**: This application provides maritime navigation assistance but should not be the sole source for navigation decisions. Always consult official maritime authorities and use proper navigation equipment for safe harbor crossings.