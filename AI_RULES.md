# AI Rules for Groupe Premium Application

This document outlines the core technologies and specific library usage guidelines for developing the Groupe Premium web application. Adhering to these rules ensures consistency, maintainability, and optimal performance.

## Tech Stack Overview

*   **Frontend Framework**: React with TypeScript for building dynamic user interfaces.
*   **Build Tool**: Vite for a fast development experience and optimized builds.
*   **Styling**: Tailwind CSS for utility-first styling, ensuring responsive and consistent designs.
*   **UI Components**: shadcn/ui, built on Radix UI primitives, for accessible and customizable UI components.
*   **Routing**: React Router DOM for declarative navigation within the application.
*   **State Management & Data Fetching**: React Query for efficient server state management and data synchronization.
*   **Authentication & Database**: Supabase for backend services, including user authentication and database interactions.
*   **Form Management**: React Hook Form for robust form handling, integrated with Zod for schema validation.
*   **Animations**: Framer Motion for creating fluid and engaging UI animations.
*   **Icons**: Lucide React for a comprehensive set of customizable SVG icons.
*   **Document Head Management**: React Helmet Async for managing document metadata (e.g., title, meta tags) for SEO.

## Library Usage Rules

To maintain a consistent and efficient codebase, please adhere to the following guidelines when using libraries:

*   **UI Components**: Always prioritize `shadcn/ui` components for all user interface elements. If a specific component is not available in `shadcn/ui`, create a new component following `shadcn/ui`'s styling and structure principles.
*   **Styling**: Use Tailwind CSS classes exclusively for all styling. Avoid inline styles or custom CSS files unless absolutely necessary for global styles (e.g., `src/index.css`).
*   **Routing**: Use `react-router-dom` for all navigation and route management. Keep route definitions centralized in `src/App.tsx`.
*   **Data Fetching**: For fetching, caching, and synchronizing server data, use `@tanstack/react-query`.
*   **Forms**: Implement all forms using `react-hook-form` for state management and validation. Use `zod` with `@hookform/resolvers` for schema-based form validation.
*   **Icons**: Integrate icons using `lucide-react`.
*   **Animations**: For any UI animations, leverage `framer-motion`.
*   **Authentication & Database**: All authentication flows and database interactions must be handled via the `@supabase/supabase-js` client and `@supabase/auth-ui-react` for UI components.
*   **Toasts/Notifications**: Use `sonner` for displaying user notifications and feedback. The `useToast` hook from `src/hooks/use-toast.ts` should be used for triggering these.
*   **Document Head**: Manage `<head>` elements (like `<title>` and `<meta>` tags) using `react-helmet-async`.
*   **Utility Functions**: For combining CSS classes, use `clsx` and `tailwind-merge` via the `cn` utility function from `src/lib/utils.ts`.
*   **Date Handling**: For any date manipulation or formatting, use `date-fns`.