# Holy Crosser - Maritime Navigation App

## Overview

Holy Crosser is a Progressive Web App (PWA) designed for maritime navigation, providing real-time harbor crossing times, tide data, and weather information. The application serves authentic data from Northumberland County Council's Harbor Data Manager and is optimized for mobile devices with PWA capabilities.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (@tanstack/react-query) for server state
- **PWA Features**: Service worker, web app manifest, offline caching

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database ORM**: Drizzle ORM with PostgreSQL
- **API Design**: RESTful endpoints with TypeScript
- **Build Process**: ESBuild for server bundling
- **Development**: TSX for hot reloading

### Database Strategy
- **Primary**: External PostgreSQL (Neon) - Harbor Data Manager
- **Fallback**: Local cache for deployment environments with network restrictions
- **Schema**: Authentic maritime data tables (crossing_times, tide_data, weather_data)

## Key Components

### Data Sources
1. **Crossing Times**: Official data from Northumberland County Council
2. **Tide Information**: UK Hydrographic Office data via Harbor Data Manager
3. **Weather Data**: Open-Meteo API integration

### Core Features
- **Safe Crossing Times**: Real-time harbor crossing safety windows with color-coded display
- **Tide Times**: High/low tide predictions with heights and timestamps
- **Weather Dashboard**: Temperature, precipitation, wind, UV index, and cloud coverage
- **Week Navigation**: Browse data across multiple weeks with intuitive controls
- **Mobile-First Design**: Responsive layout optimized for maritime use

### PWA Implementation
- **Service Worker**: Intelligent caching strategy (network-first for data, cache-first for assets)
- **App Manifest**: Complete metadata for home screen installation
- **Offline Support**: Previously viewed data accessible without connectivity
- **Install Prompts**: Cross-platform installation support

## Data Flow

1. **Client Request**: React components request data via custom hooks
2. **API Layer**: Express routes handle requests and query database
3. **Database**: Drizzle ORM queries PostgreSQL for authentic maritime data
4. **Response Processing**: Data formatted and cached for optimal display
5. **UI Rendering**: Components display data with maritime-themed styling
6. **PWA Caching**: Service worker caches responses for offline access

## External Dependencies

### Production Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connectivity
- **UI Framework**: React ecosystem with shadcn/ui components
- **Data Fetching**: @tanstack/react-query for server state management
- **Date Handling**: date-fns for maritime time calculations
- **Styling**: Tailwind CSS with Radix UI primitives

### Development Tools
- **TypeScript**: Full type safety across client and server
- **Vite**: Fast development server and optimized builds
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Server-side bundling for production

## Deployment Strategy

### Multi-Platform Support
- **Primary**: Vercel serverless deployment with edge functions
- **Alternatives**: Railway, Netlify, or any Node.js hosting platform
- **Build Output**: Static client assets + serverless API functions

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **NODE_ENV**: Environment detection for connection strategies
- **PORT**: Dynamic port assignment for various hosting platforms

### Production Optimizations
- **SSL Configuration**: Deployment-compatible database connections
- **Connection Pooling**: Optimized for serverless environments
- **Error Handling**: Graceful degradation with authentic data fallbacks
- **Caching**: Smart cache headers prevent stale maritime data

## Changelog

- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.