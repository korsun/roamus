# Roamus

An outdoors maps and routing app.

## Development

This project uses Vite for both frontend and backend development.

### Prerequisites

- Node.js >= 16.0.0
- pnpm >= 8.0.0

### Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development servers:
   - For frontend development:
     ```bash
     pnpm client:dev
     ```
     Runs the Vite dev server on http://localhost:3000

   - For backend development:
     ```bash
     pnpm server:dev
     ```
     Runs the backend server with hot reload

   - Or run both simultaneously:
     ```bash
     pnpm dev
     ```

### Building for Production

1. Build both client and server:
   ```bash
   pnpm build
   ```

2. Start the production server:
   ```bash
   pnpm server:start
   ```

### Project Structure

- `client/` - Frontend React application
- `server/` - Backend Express server
- `common/` - Shared code between client and server

### TypeScript Configuration

The project uses a base TypeScript configuration with specific overrides for client and server environments.

- `tsconfig.base.json` - Base configuration
- `client/tsconfig.json` - Client-side TypeScript config
- `server/tsconfig.json` - Server-side TypeScript config
