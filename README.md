# Tourvisto

Tourvisto is a travel agency management platform built with React Router, TypeScript, Appwrite, and Syncfusion UI
components. It combines AI trip generation, trip browsing, user management, and admin analytics in one application.

## Overview

The app supports two main experiences:

- **Admin flow** for creating trips, reviewing trip data, and managing users

Trip content is generated through Google Gemini, stored in Appwrite, and parsed back into structured trip data for the
dashboard and trip detail pages.

## Features

- Google sign-in via Appwrite
- AI-powered trip generation with Gemini
- Trip persistence in Appwrite documents
- Trip detail view with itinerary, weather, and pricing
- Trips list with pagination
- Admin dashboard with charts and summary cards
- User management grid with status badges and avatars
- Responsive layout with Tailwind CSS
- Syncfusion maps, charts, grids, dropdowns, and paging

## Screenshots

| Page            | Images                                                     | Notes                            |
| --------------- | ---------------------------------------------------------- | -------------------------------- |
| Sign in         | ![Sign in](docs/screenshots/sign-in.png)                 | Google authentication screen     |
| Admin dashboard | ![Admin dashboard](/docs/screenshots/admin-dashboard.png) | KPIs, charts, and summaries      |
| Trips list      | ![Trips list](/docs/screenshots/trips-list.png)           | Paginated trip catalog           |
| Trip details    | ![Trip details](/docs/screenshots/trip-details.png)       | Full itinerary and trip metadata |
| Create trip     | ![Create trip](/docs/screenshots/create-trip.png)         | AI trip generation form          |
| All users       | ![All users](/docs/screenshots/all-users.png)             | User table and status view       |

## Routes

| Route            | Purpose                        |
| ---------------- | ------------------------------ |
| `/`              | Public travel page             |
| `/sign-in`       | Google sign-in                 |
| `/dashboard`     | Admin analytics dashboard      |
| `/all-users`     | User management table          |
| `/trips`         | Generated trips list           |
| `/trips/create`  | Create a new AI-generated trip |
| `/trips/:tripId` | Trip detail view               |

## How it works

### Authentication

Users sign in with Google through Appwrite. Protected admin routes redirect unauthenticated users back to `/sign-in`.

### Trip generation

Submitting the create-trip form sends the request payload to `/api/create-trip`. The server:

1. Sends a prompt to Gemini
2. Parses the response into JSON
3. Fetches related trip images from Unsplash
4. Stores the trip document in Appwrite
5. Increments the creator's `tripsCreated` counter

### Trip display

Trip details are stored as JSON strings and parsed back into typed trip objects when rendering the dashboard, list, and
detail pages.

### Analytics

The dashboard aggregates user and trip data from Appwrite to show totals, growth, and travel-style breakdowns.

## Tech stack

- React 19
- React Router 7
- TypeScript 5
- Appwrite
- Tailwind CSS 4
- Syncfusion EJ2
- Vite
- Gemini API
- Unsplash API

## Project structure

```text
travel-agency/
├── app/
│   ├── appwrite/           # Appwrite client, auth, dashboard, and trip helpers
│   ├── components/         # Shared application components
│   ├── constants/          # Static content, map data, and UI config
│   ├── lib/                # Utility helpers and parsers
│   └── routes/             # React Router route modules
├── components/             # Shared layout/navigation components
├── public/                 # Static assets
├── build/                  # Production output
└── Dockerfile              # Container image definition
```

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env.local` file:

```env
VITE_APPWRITE_ENDPOINT=your_appwrite_endpoint
VITE_APPWRITE_PROJECT_ID=your_appwrite_project_id
VITE_SYNCFUSION_LICENSE_KEY=your_syncfusion_license_key
GEMINI_API_KEY=your_gemini_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

### 3. Start the app

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

## Scripts

- `npm run dev` - start the development server
- `npm run build` - create a production build
- `npm run start` - run the production server
- `npm run typecheck` - generate router types and run TypeScript checks
- `npm run lint` - run ESLint
- `npm run lint:fix` - auto-fix lint issues
- `npm run format` - format the codebase with Prettier

## Data flow

### User records

User profile documents are stored in Appwrite with fields such as:

- `accountId`
- `name`
- `email`
- `imageUrl`
- `joinedAt`
- `tripsCreated`

### Trip records

Trip documents store:

- `tripDetail`
- `createdAt`
- `imageUrls`
- `userId`

`tripDetail` is the JSON-serialized trip payload generated by the AI service.

## Deployment

### Docker

```bash
docker build -t tourvisto .
docker run -p 3000:3000 tourvisto
```
