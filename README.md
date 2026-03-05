# AI Movie Insight Builder

A web app that lets you enter an **IMDb movie ID** (e.g. `tt0133093`) and displays movie details plus an **AI-powered summary of audience sentiment** (positive / mixed / negative).

## Features

- **Input**: IMDb movie ID (e.g. `tt1234567`)
- **Movie details**: Title, poster, cast, release year, rating, short plot summary
- **Audience sentiment**: AI summary of how audiences feel about the movie
- **Sentiment classification**: Positive, Mixed, or Negative

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React (via **Next.js** 15), TypeScript, Tailwind CSS |
| Backend  | Node.js (Next.js API route) — serverless function for movie + sentiment |
| Data     | OMDb API (movie metadata); OpenRouter (AI summarization) |

### Why this stack?

- **Next.js**: Aligns with the requirement for "React via Next.js", supports app router, SSR-ready, and fits scalable web apps.
- **Next.js API route**: The API logic lives in `src/app/api/movie/route.ts` and runs as a serverless
  function on hosting platforms (Netlify, Vercel, etc.).
- **TypeScript**: Type safety and better maintainability across frontend and shared logic.
- **OMDb**: Reliable movie metadata by IMDb ID; no scraping needed for basic details.
- **OpenRouter**: Single API for multiple AI models for sentiment summarization.

## Setup

### Prerequisites

- **Node.js** 18+ and npm (or yarn/pnpm)

### 1. Clone and install

```bash
git clone <repo-url>
cd Imdb
npm install
```

### 2. Environment variables

Create a `.env.local` file in the project root (or use `.env`):

```env
# Required for movie data
OMDB_API_KEY=your_omdb_api_key

# Required for AI sentiment summary
OPENROUTER_API_KEY=your_openrouter_api_key
```

- **OMDb API key**: Get a free key at [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx).
- **OpenRouter API key**: Sign up at [https://openrouter.ai](https://openrouter.ai) and create an API key.

Optional:

```env
# Optional: default is openai/gpt-4o-mini
OPENROUTER_MODEL=openai/gpt-4o-mini

# Optional: API server port (default 3001)
PORT=3001
```

### 3. Run development

Start the Next.js development server (the API route is served automatically):

```bash
npm run dev
```

- Frontend: [http://localhost:3000](http://localhost:3000)
- API server: [http://localhost:3001](http://localhost:3001) (proxied from the app via `/api`)

To run only the frontend (e.g. if the API is already running elsewhere):

```bash
npm run dev:frontend
```

To run only the API server:

```bash
npm run dev:server
```

### 4. Build and start (production)

```bash
npm run build
npm run start
```

Ensure the API server is also running (e.g. `npm run dev:server` or deploy it separately). The Next.js app proxies `/api` to `http://localhost:3001` in development; in production you must configure the same proxy or set the API base URL appropriately.

### 5. Tests

E2E tests (Playwright):

```bash
npm run test
```

This starts the app (via `npm run dev`) and runs tests in `tests/e2e/`.

## Audience reviews / sentiment data

The requirement asks to *"scrape or retrieve audience reviews/comments"* and use AI to summarize them. In this project:

- **We do not scrape IMDb** (or any site) for review text. Scraping IMDb is against their terms of use and would require heavy handling of structure and rate limits.
- **Instead, we use OMDb-derived signals** as the input for the AI:
  - **Plot** (short/full) from OMDb
  - **IMDb rating and vote count** from OMDb, turned into short text descriptions (e.g. “strongly positive audience reception”)
- The **AI (OpenRouter)** then summarizes these OMDb-based “audience” signals and returns:
  - A short **summary** of audience sentiment
  - A **classification**: **positive**, **mixed**, or **negative**

So “reviews” here are **OMDb-backed, synthetic audience signals**, not real scraped comments. This keeps the app legal, simple, and maintainable while still delivering the requested behaviour (AI summary + sentiment classification).

## Assumptions

- **IMDb ID format**: Valid IDs match `tt` followed by at least 7 digits (e.g. `tt0133093`).
- **OMDb**: Single source of truth for movie metadata (title, poster, cast, year, rating, plot). Movies must exist on OMDb.
-- **API route**: The POST `/api/movie` endpoint is handled by Next.js; no separate server is required.
- **Env vars**: `OMDB_API_KEY` and `OPENROUTER_API_KEY` are required for full functionality; without them, movie fetch or AI summary will fail or be disabled.
- **Sentiment**: Classification is **positive**, **mixed**, or **negative** as per the requirement; the UI shows “MIXED” (not “neutral”) for mixed sentiment.
- **No poster**: If OMDb does not return a poster, the app shows a “No poster available” placeholder.

## Project structure (high level)

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx         # Home (IMDb ID input)
│   │   ├── globals.css
│   │   └── movie/[imdbId]/page.tsx  # Movie result + sentiment
│   ├── sections/           # UI sections (Hero, MovieInfo, Sentiment, etc.)
│   ├── components/         # Reusable UI components
│   ├── lib/                # API client, shared utilities
│   └── types/              # TypeScript types
├── server/
│   └── index.ts            # deprecated Express API (migrated to app/api/movie/route.ts)
├── tests/
│   └── e2e/               # Playwright E2E tests
├── next.config.ts
├── playwright.config.ts
└── package.json
```

## License

Private / educational use as per your project terms.
