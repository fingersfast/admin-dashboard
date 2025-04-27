# Admin Dashboard Template

A modern admin dashboard built with Next.js, Tailwind CSS, and client-side data storage.

## Features

- **Authentication**: Login, register, and protected routes
- **Dashboard Layout**: Responsive sidebar and navbar with dark/light mode
- **Users Page**: List, create, edit, and delete users
- **Products Page**: List, create, edit, and delete products with image preview
- **Reports Page**: Interactive charts for analytics
- **Settings Page**: Profile update and password change options

## Quick Start

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Mock Credentials

This project uses a mock authentication system with client-side data storage. Use these pre-configured users:

- **Admin User**

  - Email: admin@example.com
  - Password: any password will work (mock auth)

- **Regular User**
  - Email: user@example.com
  - Password: any password will work (mock auth)

You can also register new users through the registration page.

## Technical Details

- **Built with**: Next.js 15, React, TypeScript, Tailwind CSS
- **State Management**: React Hooks and Context
- **Data Storage**: Client-side localStorage
- **UI Components**: Custom components with Tailwind
- **Authentication**: Cookie-based session management
- **Charting**: Recharts for data visualization

## Moving to Production

To use this dashboard in production with real data:

1. Set up a Firebase account and create a project
2. Replace the mock implementations in `/lib/auth.ts` and `/lib/db.ts` with actual Firebase code
3. Update `.env.local` with your Firebase credentials
4. Deploy to Vercel or your preferred hosting service

## License

MIT
