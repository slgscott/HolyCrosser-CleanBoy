# Holy Crosser - Maritime Navigation App

## Overview

Holy Crosser is a Progressive Web Application (PWA) designed for maritime navigation, providing safe harbor crossing times, tide data, and weather information. The application integrates authentic harbor data from Northumberland County Council and is built as a mobile-first web application with offline capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with shadcn/ui component library
- **UI Components**: Radix UI primitives for accessibility and consistency
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **PWA Features**: Service worker registration for offline functionality

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (Neon serverless database)
- **API Design**: RESTful endpoints with JSON responses
- **Session Management**: Express sessions for user state

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Package Manager**: npm
- **Database**: PostgreSQL 16 module in Replit
- **Hot Reload**: Vite HMR with Express middleware integration

## Key Components

### Data Models
- **Crossing Times**: Safe/unsafe harbor crossing periods with timestamps
- **Tide Data**: High/low tide times and heights for multiple periods per day
- **Weather Data**: Temperature, wind, precipitation, and UV index information
- **User Preferences**: Customizable display settings and data field selections
- **App Settings**: Global application configuration

### API Endpoints
- `/api/health` - Application health check and version information
- `/api/crossing-times/:weekOffset` - Weekly crossing time data
- `/api/tide-times/:weekOffset` - Weekly tide information
- `/api/weather-data/:weekOffset` - Weekly weather forecasts
- `/api/preferences` - User preference management
- `/api/settings` - Application settings

### User Interface Components
- **Week Navigation**: Calendar-based week selection with arrow controls
- **Data Table**: Responsive grid displaying maritime data by day
- **Bottom Navigation**: Tab-based navigation between data types
- **PWA Install Prompt**: Native app installation prompts

## Data Flow

1. **Client Request**: User navigates between weeks or data types
2. **API Call**: TanStack Query manages HTTP requests with caching
3. **Database Query**: Drizzle ORM executes type-safe PostgreSQL queries
4. **Data Transformation**: Server formats raw database data for client consumption
5. **Cache Management**: Client-side caching prevents unnecessary API calls
6. **UI Update**: React components re-render with fresh data

### Week-Based Data Architecture
The application operates on a week-based data model where:
- Week 0 represents the current week (Monday to Sunday)
- Negative offsets represent past weeks
- Positive offsets represent future weeks
- All data is grouped and cached by week for optimal performance

## External Dependencies

### Database Integration
- **Neon Database**: Serverless PostgreSQL with WebSocket connections
- **Connection Pooling**: Optimized pool settings for serverless deployment
- **Migration System**: Drizzle Kit for schema migrations

### Third-Party Services
- **Harbor Data Source**: Northumberland County Council maritime data
- **Weather API**: Integration for real-time weather information
- **PWA Manifest**: Web app manifest for native-like installation

### UI Libraries
- **shadcn/ui**: Pre-built accessible components
- **Radix UI**: Headless UI primitives
- **Lucide React**: Icon library for consistent iconography
- **date-fns**: Date manipulation and formatting utilities

## Deployment Strategy

### Development Deployment
- **Platform**: Replit with automatic deployments
- **URL Structure**: Dynamic Replit URLs with SSL
- **Environment**: Development mode with hot module replacement

### Production Deployment Options
- **Vercel**: Recommended platform with serverless functions
- **Railway**: Alternative with full-stack deployment support
- **Netlify**: Static site hosting with serverless function support

### Build Process
1. **Client Build**: Vite compiles React application to static assets
2. **Server Build**: esbuild bundles Express server for production
3. **Asset Optimization**: Automatic compression and optimization
4. **Environment Variables**: DATABASE_URL and platform-specific configuration

### Environment Configuration
- **Development**: Local database connection with debug logging
- **Production**: Neon serverless database with connection pooling
- **Health Monitoring**: Built-in health checks for deployment verification

## Changelog
- June 24, 2025: v2.9.4.1 - Stable release with Neon database integration and tide display fixes
- June 24, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.