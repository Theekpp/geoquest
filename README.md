# 🗺️ Geo-Quest Platform

> A gamified urban exploration platform powered by Telegram Mini Apps

[![Telegram](https://img.shields.io/badge/Telegram-Mini%20App-blue?logo=telegram)](https://telegram.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61dafb?logo=react)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Railway-336791?logo=postgresql)](https://railway.app/)

## 📖 Overview

Geo-Quest Platform is a scalable, location-based quest platform implemented as a Telegram Mini App. It gamifies urban exploration by guiding users through themed quests called **"Motifs"**. Each Motif transforms the visual identity and provides unique routes with Points of Interest (POIs), cultural content, leaderboards, and achievements.

### ✨ Key Features

- 🎭 **Motif-Driven Architecture** - Multiple quest themes with custom visuals and independent progression systems
- 📍 **Real-time Geolocation** - Track user position and unlock POIs within proximity
- 🗺️ **Interactive Maps** - 2GIS integration with custom markers and route visualization
- 🏆 **Achievements & Leaderboards** - Gamified progression with badges and competitive rankings
- 🎨 **Dynamic Theming** - Each Motif applies unique colors, fonts, and visual identity
- 📱 **Telegram Native** - Deep integration with Telegram WebApp API for seamless UX

### 🎯 Current Motif

**"Old Man Hottabych"** - A literary route based on locations from the famous Russian novel, featuring Eastern fairy tale aesthetics with sapphire blue and golden accents.

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework with functional components and hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool with HMR
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **Wouter** - Client-side routing
- **TanStack Query** - Data fetching and caching

### Backend
- **Express.js** - Node.js web framework
- **TypeScript** - Type-safe server code
- **Drizzle ORM** - Type-safe database queries
- **node-postgres (pg)** - PostgreSQL driver

### Infrastructure
- **PostgreSQL (Railway)** - Managed database service
- **2GIS Maps API** - Map rendering and POI markers
- **Telegram Mini App** - Platform integration

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (Railway or local)
- 2GIS API key
- Telegram Bot (for Mini App deployment)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd geo-quest-platform
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create a `.env` file or use Replit Secrets:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# 2GIS Maps
VITE_2GIS_API_KEY=your_2gis_api_key

# Optional
NODE_ENV=development
PORT=5000
```

4. **Initialize database**
```bash
npm run db:push
```

5. **Start development server**
```bash
npm run dev
```

The app will be available at `http://localhost:5000`

## 📁 Project Structure

```
.
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components (Map, Locations, etc.)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── contexts/      # React context providers
│   │   ├── lib/           # Utility functions
│   │   └── types/         # TypeScript type definitions
│   └── index.html
│
├── server/                # Backend Express server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API route definitions
│   ├── db.ts             # Database connection
│   ├── storage.ts        # Data access layer
│   └── vite.ts           # Vite middleware setup
│
├── shared/               # Shared code between client/server
│   └── schema.ts         # Drizzle database schema
│
└── attached_assets/      # Static assets and documentation
```

## 🗄️ Database Schema

The application uses PostgreSQL with the following core tables:

- **users** - Telegram user profiles and progression
- **motifs** - Quest themes with dynamic theming data
- **points_of_interest** - Location data and content
- **achievements** - Badge definitions
- **user_motif_progress** - User progression per Motif
- **user_poi_visits** - Visit history
- **user_achievements** - Unlocked badges

### Database Migrations

```bash
# Push schema changes to database
npm run db:push

# Force push (use when schema conflicts occur)
npm run db:push -- --force
```

## 🎨 Theming System

Each Motif dynamically applies:
- **Color Palette** - Primary, accent, surface colors
- **Typography** - Custom font families (e.g., Playfair Display for Hottabych)
- **Visual Assets** - Icons, badges, and markers
- **Content** - Localized text and cultural context

Theme data is stored in the database and applied at runtime via CSS custom properties.

## 📱 Telegram Integration

### Setup Telegram Bot

1. Create a bot via [@BotFather](https://t.me/botfather)
2. Set Mini App URL in bot settings
3. Configure Web App button

See [TELEGRAM_BOT_SETUP.md](./TELEGRAM_BOT_SETUP.md) for detailed instructions.

### Telegram WebApp API

The app uses:
- User authentication via Telegram ID
- Theme color synchronization
- Location sharing
- Haptic feedback
- Native UI elements

## 🔧 Development Scripts

```bash
# Start development server (port 5000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run check

# Database operations
npm run db:push
```

## 🚀 Deployment

The app is configured for **Autoscale deployment** on Replit:

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Port**: 5000 (only non-firewalled port)

### Production Considerations

- SSL is automatically enabled for external databases
- Environment variables managed via Replit Secrets
- Frontend served from `dist/public` after build
- API routes prefixed with `/api`

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |
| `VITE_2GIS_API_KEY` | 2GIS Maps API key | ✅ Yes |
| `NODE_ENV` | Environment (`development`/`production`) | ❌ Auto-detected |
| `PORT` | Server port (default: 5000) | ❌ Optional |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- **TypeScript strict mode** enabled
- **Functional components** with React hooks
- **Tailwind CSS** for styling
- **Radix UI** for accessible components

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **2GIS** for map services
- **Telegram** for Mini App platform
- **Railway** for PostgreSQL hosting
- **Replit** for development and deployment

---

Built with ❤️ for urban explorers
