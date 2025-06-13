# Holy Crosser V2 - Maritime Navigation PWA

A progressive web app providing real-time maritime navigation data for safe harbor crossings with enhanced mobile experience.

## Version 2.6.0

Latest release featuring enhanced visual design, improved data presentation, and optimized layout for maritime navigation.

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

## Technical Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom maritime themes
- **Data Fetching**: TanStack Query for optimal caching
- **Database**: PostgreSQL with Neon serverless
- **Backend**: Express.js with TypeScript
- **Build Tool**: Vite for fast development and builds

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