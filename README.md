# Holy Crosser ⚓

A Progressive Web App for maritime navigation providing real-time harbor crossing times, tide data, and weather information.

## Features

- **Safe Crossing Times**: Real-time harbor crossing safety windows
- **Tide Information**: High/low tide times and heights  
- **Weather Data**: Temperature, precipitation, wind, and conditions
- **Progressive Web App**: Install on mobile devices
- **Offline Support**: Service worker for offline functionality
- **Week Navigation**: Browse data for multiple weeks

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (Neon)
- **Deployment**: Vercel
- **UI Components**: shadcn/ui, Radix UI

## Local Development

1. **Clone & Install**:
   ```bash
   git clone https://github.com/yourusername/holy-crosser.git
   cd holy-crosser
   npm install
   ```

2. **Environment Setup**:
   Create `.env` file:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   NODE_ENV=development
   ```

3. **Start Development**:
   ```bash
   npm run dev
   ```
   App will be available at `http://localhost:5000`

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `DATABASE_URL`: PostgreSQL connection string
   - `NODE_ENV`: production
4. Deploy automatically on push

## Project Structure

```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── lib/         # Utilities
│   │   └── pages/       # Page components
│   └── public/      # Static assets
├── server/          # Express backend
│   ├── routes.ts    # API routes
│   ├── storage.ts   # Database layer
│   └── index.ts     # Server entry
├── shared/          # Shared types/schemas
└── api/            # Vercel serverless functions
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:push` - Push database schema changes

## Data Sources

- **Harbor Data**: Northumberland County Council
- **Database**: Real-time crossing, tide, and weather data
- **Updates**: Automatic data refresh from external sources

## License

This project is licensed under the MIT License.

---

**Version**: 2.9.3  
**Status**: Production Ready