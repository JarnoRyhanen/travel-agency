# Tourvisto - Travel Agency Platform

A modern, full-stack travel agency management application built with React Router, TypeScript, and Appwrite. Tourvisto
provides a comprehensive platform for managing trips, users, and travel analytics.

## Features

- 🌍 Interactive world map with Syncfusion Maps
- 👥 User management and authentication with Appwrite
- 📊 Advanced dashboard with real-time analytics and charts
- 🧳 Trip management and browsing
- 📱 Responsive design with Tailwind CSS
- 🔒 TypeScript for type safety
- 🚀 Server-side rendering with React Router 7
- ⚡️ Hot Module Replacement (HMR) for development
- 🔍 Admin panel with user management
- 📈 Data visualization with Syncfusion Charts

## Project Structure

```
travel-agency/
├── app/
│   ├── routes/
│   │   ├── admin/          # Admin dashboard and management pages
│   │   └── root/           # Authentication and root routes
│   ├── components/         # Reusable React components
│   ├── appwrite/           # Appwrite client and auth configuration
│   ├── lib/                # Utility functions
│   ├── constants/          # App constants and world map data
│   └── root.tsx            # Root layout component
├── components/             # Shared UI components (Header, NavItems, etc.)
├── public/                 # Static assets
└── Dockerfile              # Docker configuration for deployment
```

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Configuration

Create a `.env.local` file with your Appwrite credentials:

```env
VITE_APPWRITE_ENDPOINT=your_appwrite_endpoint
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_SYNCFUSION_LICENSE_KEY=your_syncfusion_key
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

### Available Scripts

- `npm run build` - Create a production build
- `npm run start` - Start the production server
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint to check code quality
- `npm run lint:fix` - Automatically fix linting issues
- `npm run format` - Format code with Prettier

## Tech Stack

### Frontend

- **React 19** - UI library
- **React Router 7** - Full-stack routing framework
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Syncfusion EJ2** - Enterprise UI components (Maps, Charts, Grids, Dropdowns)

### Backend & Services

- **React Router Node** - Full-stack server
- **Appwrite** - Backend-as-a-service for authentication and data management
- **Sentry** - Error tracking and performance monitoring

### Development Tools

- **Vite** - Lightning-fast build tool
- **ESLint** - Code linting
- **Prettier** - Code formatting

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t tourvisto .

# Run the container
docker run -p 3000:3000 tourvisto
```

The containerized application can be deployed to any platform that supports Docker:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### Environment Variables

Ensure the following environment variables are set in production:

```env
VITE_APPWRITE_ENDPOINT
VITE_APPWRITE_PROJECT_ID
VITE_SYNCFUSION_LICENSE_KEY
```

## Key Features

### Admin Dashboard

- User management and analytics
- Trip overview and statistics
- Real-time data visualization
- System monitoring

### Trip Management

- Browse and manage travel packages
- Interactive world map for destinations
- Trip details and booking information

### Authentication

- Secure user authentication via Appwrite
- Session management
- Protected routes and admin access

## License

This project is private and not licensed for distribution.

---

Built with ❤️ using React Router, TypeScript, and Appwrite.
