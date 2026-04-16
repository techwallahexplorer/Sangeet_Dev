# Sangeet

Sangeet is a premium music streaming platform engineered for seamless audio playback and comprehensive media management. Built with modern web technologies, it features an immersive, hardware-accelerated user interface designed to scale effortlessly across desktop and mobile devices.

## Application Architecture

The application relies on a strictly typed, component-driven framework designed to optimize rendering strategies and state flow throughout the user journey:

* Frontend Framework: React and Vite for rapid development iteration and high-performance production builds.
* State Containerization: Modular store implementations handle the Global Player State, User Authentication sessions, and Mood preferences independently.
* Backend Infrastructure: Deep integration with Supabase provides secure data synchronization, authentication pipelines, and low-latency storage access.
* Visual Layer: Custom styled components with dedicated Audio Visualizers that interface directly with the Web Audio API.

## Core Capabilities

* Persistent Audio Playback: A globally available Player Bar guarantees uninterrupted music playback while navigating between different segments of the application.
* Media Organization: Dedicated workspaces for Playlists, Libraries, and Mood-based audio discovery.
* Social and Engagement Features: Share cards, interactive elements, and a dedicated Social module keep users engaged.
* Performance Centric: Lazy-loaded components and optimized SVG assets ensure an optimal First Contentful Paint.

## Getting Started

Standard Node.js development environment prerequisites apply.

1. Clone the repository and navigate into the project root.
2. Resolve local dependencies by running `npm install`.
3. Provision the environment variables. Provide your Supabase URL and Anon Key within the appropriate `.env` file to establish database connectivity.
4. Start the Vite development task via `npm run dev`.

## Project Structure

* `src/components/` - Granular, reusable UI elements.
* `src/layouts/` - Higher-order functional layouts maintaining application structure.
* `src/pages/` - Top-level route components handling business logic.
* `src/store/` - Centralized store controllers handling shared context.
* `src/services/` - External API and database resolution logic.
