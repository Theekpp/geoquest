# Geo-Quest Platform - Telegram Mini App

## Overview
The Geo-Quest Platform is a scalable, geo-location based quest platform implemented as a Telegram Mini App. Its primary purpose is to gamify urban exploration by allowing users to discover locations through themed quests, referred to as "Motifs". The initial Motif, "Old Man Hottabych," guides users through a literary route based on locations from the famous Russian novel. The platform aims to provide an engaging and interactive way for users to explore their surroundings, offering a unique blend of gaming and cultural discovery.

## User Preferences
- None specified yet

## System Architecture

### Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL (Railway) with node-postgres driver and Drizzle ORM
- **Routing**: Wouter (client-side)
- **UI Framework**: Tailwind CSS + Radix UI
- **Map Integration**: 2GIS Map API
- **Runtime**: Node.js 20

### Project Structure
- `/client/`: Frontend React application (components, pages, hooks, utilities)
- `/server/`: Backend Express server (entry point, routes, database, storage)
- `/shared/`: Shared types and database schema
- `/attached_assets/`: Project documentation and design files

### Core Features
-   **Motif-Driven Architecture**: Supports multiple quest themes, each with custom visuals, unique routes with Points of Interest (POIs), themed content, and independent leaderboards and achievements.
-   **Dynamic Theming**: The initial "Old Man Hottabych" theme features a primary color of enchanted sapphire blue (#215 85% 55%), accent color of Eastern gold (#45 95% 60%), Playfair Display for headers, and Inter for body text.
-   **Main Pages**:
    -   **Map Page** (`/`): Displays a 2GIS map with POIs and user location.
    -   **Locations Page** (`/locations`): Allows browsing of available locations and motifs.
    -   **Achievements Page** (`/achievements`): Shows earned badges and rewards.
    -   **Rating Page** (`/rating`): Features a leaderboard with user rankings.
    -   **Profile Page** (`/profile`): Displays user profile and statistics.
-   **Database Schema**: Utilizes PostgreSQL with Drizzle ORM, including tables for `users`, `motifs`, `points_of_interest`, `achievements`, `user_motif_progress`, `user_poi_visits`, and `user_achievements`.
-   **Development Workflow**: Runs a development server on port 5000 with Vite HMR for frontend updates and an Express backend with automatic TypeScript compilation, integrating both frontend and backend on the same port.
-   **Deployment**: Configured for Autoscale deployment on Replit, using `npm run build` for build and `npm start` for running the production server on port 5000.
-   **Code Conventions**: Adheres to TypeScript strict mode, uses React functional components with hooks, Tailwind CSS for styling, and Radix UI for accessible components.

## External Dependencies

-   **2GIS Map API**: Used for map rendering, displaying POI markers, and route calculation for user guidance. The API key is managed via the `VITE_2GIS_API_KEY` environment variable.
-   **Telegram Mini App API**: Integrates with the Telegram WebApp API for user authentication (using Telegram user ID), supports Telegram theme colors, and posts events for UI customization within the Telegram environment.
-   **Railway (PostgreSQL)**: Provides external managed PostgreSQL database service for data storage. Connection established via `DATABASE_URL` environment variable using node-postgres (pg) driver.
-   **Drizzle ORM**: Used for type-safe interaction with the PostgreSQL database.