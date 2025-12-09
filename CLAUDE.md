# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BulCHomepage is a fire simulation company website with three main product sections:
- **Meteor Simulation**: AI-Physical Simulation Solutions
- **BUL:C**: Fire-Evac Simulator
- **VR**: Real Fire Evac Education

## Tech Stack

- **Frontend**: React 19 + TypeScript (Create React App)
- **Backend**: Spring Boot with Gradle
- **Database**: PostgreSQL 16
- **Containerization**: Docker Compose

## Development Commands

### Frontend (React)
```bash
cd frontend
npm install          # Install dependencies
npm start            # Run dev server at http://localhost:3000
npm run build        # Production build
npm test             # Run tests
```

### Backend (Spring Boot)
```bash
cd backend
./gradlew bootRun    # Run dev server at http://localhost:8080
./gradlew build      # Build JAR
```

### Docker (Full Stack)
```bash
docker-compose up -d              # Start all services (dev)
docker-compose -f docker-compose.prod.yml up -d  # Production
```

## Architecture

### Frontend Structure
```
frontend/src/
├── index.tsx              # App entry point with routing (/, /meteor, /bulc, /vr)
├── CategoryPages/         # Main page components
│   ├── Meteor.tsx         # Meteor product page (orchestrates sub-components)
│   ├── BulC.tsx           # BulC product page (orchestrates sub-components)
│   ├── VR.tsx             # VR product page
│   ├── *Hero.tsx          # Hero sections for each product
│   ├── *Solutions.tsx     # Solutions/features sections
│   ├── MeteorPages.css    # Shared styles for Meteor/BulC pages
│   └── CategoryPages.css  # General category page styles
├── components/            # Reusable components (Header, Footer, Modals)
└── context/               # React Context (AuthContext)
```

### Page Pattern
Each main page (Meteor, BulC) follows a pattern:
1. Uses `Header` with sub-navigation
2. Sections are refs for scroll-based navigation
3. Section components are imported and composed
4. Uses `useEffect` for scroll position tracking

### Styling
- CSS variables defined in `MeteorPages.css` (--accent: #C4320A, --light-gray: #F5F5F5, etc.)
- Mobile responsive with breakpoints at 1024px, 768px, 480px
- Component-specific styles use BEM-like naming

### Static Assets
Images go in `frontend/public/img/` and are referenced as `/img/filename.png`

## Environment Variables

Copy `.env.example` to `.env` for local development. Key variables:
- `DB_NAME`, `DB_USER`, `DB_PASSWORD` - PostgreSQL credentials
- `JWT_SECRET` - JWT authentication secret
- `FRONTEND_PORT` (default: 3000), `BACKEND_PORT` (default: 8080)
