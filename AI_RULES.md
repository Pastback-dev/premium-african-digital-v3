# AI Rules for Groupe Premium Application

This document outlines the core technologies and specific library usage guidelines for developing the Groupe Premium web application. Adhering to these rules ensures consistency, maintainability, and leverages the strengths of our chosen tech stack.

## Tech Stack Overview

*   **Frontend Framework:** React (v18)
*   **Language:** TypeScript
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **UI Component Library:** shadcn/ui (built on Radix UI)
*   **Routing:** React Router DOM
*   **Data Fetching/State Management:** React Query
*   **Animations:** Framer Motion
*   **Icons:** Lucide React
*   **Form Management:** React Hook Form with Zod for validation
*   **Head Management:** React Helmet Async
*   **Toast Notifications:** Sonner and Radix UI Toast

## Library Usage Rules

To maintain a consistent and efficient codebase, please follow these guidelines for library usage:

*   **UI Components:**
    *   **Always** prioritize using components from `shadcn/ui`. These are located in `src/components/ui/`.
    *   **Do not** modify `shadcn/ui` component files directly. If a component needs significant customization or a new component is required, create a new file in `src/components/` and style it using Tailwind CSS.
*   **Styling:**
    *   **Exclusively** use Tailwind CSS for all styling. Avoid writing custom CSS files or using inline styles unless absolutely necessary for dynamic, calculated values.
    *   Utilize the custom colors and gradients defined in `tailwind.config.ts` and `src/index.css`.
*   **Routing:**
    *   Use `react-router-dom` for all client-side navigation.
    *   All main application routes should be defined within `src/App.tsx`.
*   **State Management & Data Fetching:**
    *   For local component state, use React's built-in `useState` and `useReducer` hooks.
    *   For global state management and server-side data fetching, use `@tanstack/react-query`.
*   **Animations:**
    *   Use `framer-motion` for all complex animations, transitions, and scroll-triggered effects.
*   **Icons:**
    *   Use icons from the `lucide-react` library.
*   **Notifications:**
    *   For simple, non-interactive toast notifications, use `sonner`.
    *   For more complex or interactive toasts, use the `useToast` hook provided by `src/hooks/use-toast.ts`, which leverages `@radix-ui/react-toast`.
*   **Forms:**
    *   Use `react-hook-form` for managing form state, validation, and submission.
    *   For schema-based form validation, use `zod` in conjunction with `@hookform/resolvers`.
*   **Head Management:**
    *   Use `react-helmet-async` to manage document `head` elements such as page titles, meta descriptions, and canonical URLs.
*   **Date Pickers:**
    *   Use `react-day-picker` for any date selection functionalities.