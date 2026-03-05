# AI Movie Insight Builder

A web app that lets you enter an **IMDb movie ID** (e.g. `tt1234567`) and displays movie details plus an **AI-powered summary of audience sentiment** (positive / mixed / negative).

## Features

- **Input**: IMDb movie ID (e.g. `tt1234567`)
- **Movie details**: Title, poster, cast, release year, rating, short plot summary
- **Audience sentiment**: AI summary of how audiences feel about the movie
- **Sentiment classification**: Positive, Mixed, or Negative
- **Responsive design**: Works seamlessly on desktop, tablet, and mobile devices
- **Beautiful UI**: Modern, animated, premium user experience with Tailwind CSS

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React (via **Next.js** 15), TypeScript, Tailwind CSS |
| Backend  | Node.js (Next.js API route) — serverless function for movie + sentiment |
| Data     | OMDb API (movie metadata); OpenRouter (AI summarization) |

### Why this stack?

- **Next.js 15**: Fulfills the React + Next.js requirement, supports App Router, SSR-ready for production.
- **Serverless API Route** (`src/app/api/movie/route.ts`): Runs as a serverless function on Netlify/Vercel; no separate backend server needed.
- **TypeScript**: Type-safe, maintainable code across frontend and backend logic.
- **Tailwind CSS + shadcn**: Modern responsive design with minimal setup; includes animations and accessibility features.
- **OMDb API**: Reliable, legal movie metadata source (no scraping required).
- **OpenRouter**: Unified AI API supporting multiple models (GPT-4, Gemini, Claude) for flexible sentiment summarization.

## Setup

### Prerequisites

- **Node.js** 18+ and npm (or yarn/pnpm)
- **OMDb API key**: Get a free key at [https://www.omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)
- **OpenRouter API key**: Sign up at [https://openrouter.ai](https://openrouter.ai) and create an API key

### 1. Clone and install

```bash
git clone https://github.com/Neerajreddy-2005/Movie-ai.git
cd Movie-ai
npm install
```

### 2. Environment variables

Create a `.env` file in the project root:

```env
# Required for movie data
OMDB_API_KEY=your_omdb_api_key

# Required for AI sentiment summary
OPENROUTER_API_KEY=your_openrouter_api_key

# Optional: default is google/gemini-2.5-flash-lite-preview-09-2025
OPENROUTER_MODEL=google/gemini-2.5-flash-lite-preview-09-2025
```

**Note**: `.env` is in `.gitignore` for security. Never commit API keys to Git.

### 3. Run development

```bash
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- The API route is served automatically

### 4. Build and start (production)

```bash
npm run build
npm run start
```

### 5. Run tests

```bash
npm run test  # E2E tests with Playwright
npm run lint  # Linting and type checks
```

## How It Works

### User Flow

1. User enters an **IMDb ID** (e.g., `tt2771200`)
2. Clicks **"Analyze Movie"**
3. Frontend calls `POST /api/movie` with the ID
4. API (`src/app/api/movie/route.ts`):
   - Validates the ID
   - Fetches movie details from **OMDb**
   - Retrieves audience reviews/ratings
   - Calls **OpenRouter AI** to summarize sentiment
   - Returns JSON: `{ movie, sentiment, meta }`
5. Frontend displays:
   - Movie title, poster, cast, year, rating, plot
   - AI-generated sentiment summary
   - Sentiment classification badge (Positive/Mixed/Negative)

### Audience Sentiment Logic

The app gathers audience signals from **OMDb** (plot, rating, vote count) and feeds them to an **AI model** which returns:
- **Summary**: 1-2 sentence summary of audience reception
- **Classification**: `positive`, `mixed`, or `negative`

This approach is **legal, scalable, and maintainable**—no web scraping needed.

## Assumptions

- **IMDb ID format**: Valid IDs match `tt` followed by at least 7 digits (e.g., `tt0133093`)
- **OMDb coverage**: All movies exist and are accessible via OMDb API
- **API keys required**: Both `OMDB_API_KEY` and `OPENROUTER_API_KEY` must be set for full functionality
- **Sentiment values**: Classification returns `positive`, `mixed`, or `negative`; UI displays these in user-friendly format
- **Fallback**: If AI summarization fails, a default message is shown instead of blocking the UI
- **No poster**: If OMDb doesn't return a poster URL, a placeholder is displayed

## Project Structure

```
Movie-ai/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home (IMDb ID input form)
│   │   ├── globals.css               # Global styles
│   │   ├── movie/[imdbId]/
│   │   │   └── page.tsx              # Movie result & sentiment display
│   │   └── api/movie/
│   │       └── route.ts              # POST /api/movie endpoint
│   ├── sections/                     # UI sections
│   │   ├── Hero.tsx                  # Landing hero with input form
│   │   ├── MovieInfo.tsx             # Movie details display
│   │   ├── Sentiment.tsx             # Sentiment section
│   │   └── LoadingSkeleton.tsx       # Loading state
│   ├── components/ui/                # Reusable UI components (shadcn)
│   │   ├── button.tsx, input.tsx, card.tsx, etc.
│   ├── lib/                          # Shared utilities
│   │   ├── imdb.ts                   # IMDb validation & OMDb fetch
│   │   ├── reviews.ts                # Review fetch logic
│   │   ├── ai.ts                     # OpenRouter AI summarization
│   │   ├── movie-api.ts              # Frontend API client
│   │   ├── http.ts                   # HTTP utilities
│   │   └── utils.ts                  # Misc helpers
│   ├── types/
│   │   └── movie.ts                  # TypeScript types
│   └── hooks/
│       └── use-mobile.ts             # Responsive hook
├── tests/
│   ├── e2e/
│   │   └── basic.spec.ts             # Playwright E2E tests
│   ├── api-movie.test.ts
│   └── imdb.test.ts
├── netlify.toml                      # Netlify deployment config
├── next.config.ts                    # Next.js configuration
├── tailwind.config.js                # Tailwind CSS config
├── tsconfig.json                     # TypeScript config
├── package.json
└── README.md                         # This file
```

## Deployment

### Deploy to Netlify (Recommended)

Netlify seamlessly handles Next.js apps and serverless API routes.

#### Prerequisites

- GitHub repo pushed to `main` branch
- Netlify account (free tier: [netlify.com](https://netlify.com))
- API keys: `OMDB_API_KEY`, `OPENROUTER_API_KEY`

#### Step-by-Step

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for Netlify deployment"
   git push origin main
   ```

2. **Connect Netlify to GitHub**:
   - Go to [app.netlify.com](https://app.netlify.com)
   - Click **"Add new site"** → **"Import an existing project"**
   - Select **"Deploy with GitHub"**
   - Authorize Netlify to access your GitHub account
   - Select your `Movie-ai` repository
   - Netlify auto-detects Next.js; click **"Deploy site"**

3. **Configure Environment Variables**:
   - Go to **Site Settings** → **Environment** → **Add Environment Variables**
   - Add each variable:
     - Key: `OMDB_API_KEY`, Value: `your_omdb_key`
     - Key: `OPENROUTER_API_KEY`, Value: `your_openrouter_key`
     - Key: `OPENROUTER_MODEL`, Value: `google/gemini-2.5-flash-lite-preview-09-2025`

4. **Monitor the Build**:
   - Netlify will automatically build and deploy
   - Watch the build log in the Netlify dashboard
   - Once complete, you'll get a live URL (e.g., `https://movie-ai-app.netlify.app`)

5. **Test the Live Site**:
   - Visit your Netlify URL
   - Enter movie ID `tt2771200` (Spirited Away)
   - Verify:
     - ✅ Movie details load correctly
     - ✅ Sentiment summary appears
     - ✅ No console errors (check DevTools)

#### Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails: "Cannot find module" | Commit `package-lock.json` to Git; ensure local `npm install` succeeded |
| API returns 500 | Verify environment variables are set in Netlify dashboard |
| Movie not found | Check IMDb ID is valid and exists on OMDb (e.g., `tt2771200`) |
| Empty sentiment | Ensure `OPENROUTER_API_KEY` is correct and has API credits |

### Alternative: Deploy to Vercel

Vercel also supports Next.js out-of-the-box:

1. Go to [vercel.com](https://vercel.com)
2. Click **"Add New"** → **"Project"** → Import your GitHub repo
3. Add the same environment variables
4. Deploy

Both Netlify and Vercel are equally suitable; choose based on preference.

## Code Quality & Testing

### Linting & Type Check

```bash
npm run lint
```

Runs ESLint and TypeScript checks.

### E2E Tests

```bash
npm run test
```

Runs Playwright tests in `tests/e2e/`. Tests validate:
- Input validation (valid/invalid IMDb IDs)
- Form submission and error handling
- Movie data display

### Local Production Test

Before deploying:

```bash
npm run lint
npm run build
npm run start
```

Visit [http://localhost:3000](http://localhost:3000) and verify the full flow locally.

## Architecture Highlights

### Separation of Concerns

- **Frontend** (`src/app/`, `src/sections/`, `src/components/`): React UI, form handling, display logic
- **Backend** (`src/app/api/movie/route.ts`): API request handling, OMDb fetch, AI summarization
- **Shared** (`src/lib/`, `src/types/`): Validation, types, utilities used by both

### Scalability

- **Serverless**: API runs on-demand; no server uptime cost
- **Modular components**: Easy to add new sections (e.g., user ratings, movie comparison)
- **Type safety**: TypeScript catches errors at compile time
- **Environment config**: API keys and settings are configurable via `.env` / environment variables

### Security

- **.env in .gitignore**: API keys never exposed in Git
- **Input validation**: IMDb IDs validated before API calls
- **Error handling**: User-friendly error messages; sensitive errors logged server-side only

## Performance

- **Next.js optimization**: Static pages pre-rendered; API routes cached when appropriate
- **Image optimization**: Movie posters use `<img>` with lazy loading
- **CSS**: Tailwind for minimal bundle size; animations via CSS + Lucide icons
- **Network**: Single API call per movie lookup; results displayed immediately

## Future Enhancements

- **Caching**: Cache OMDb responses to reduce API calls
- **Search**: Search for movies by title (not just IMDb ID)
- **Watchlist**: Save movies to local storage
- **Reviews**: Display actual IMDb review snippets (with legal compliance)
- **Comparison**: Compare sentiment across multiple movies

## Support

For questions or issues:
- Check the GitHub Issues: [github.com/Neerajreddy-2005/Movie-ai/issues](https://github.com/Neerajreddy-2005/Movie-ai/issues)
- Review the code comments for complex logic

## License

Private / educational use as per your project terms.

