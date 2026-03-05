/**
 * API server for the IMDb Movie Insight app.
 * Serves POST /api/movie. Load .env.local for OMDB_API_KEY and OPENROUTER_API_KEY.
 */
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import express from "express";
import { fetchMovieDetails, validateImdbId } from "../src/lib/imdb";
import { fetchMovieReviews } from "../src/lib/reviews";
import { analyzeSentimentAndSummarize, type SentimentResult } from "../src/lib/ai";

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(express.json());

app.post("/api/movie", async (req, res) => {
  try {
    const body = req.body ?? {};
    const rawId = typeof body.imdbId === "string" ? body.imdbId : "";

    if (!rawId) {
      res.status(400).json({ error: "IMDb ID is required." });
      return;
    }

    let imdbId: string;
    try {
      imdbId = validateImdbId(rawId);
    } catch (err) {
      res.status(400).json({ error: (err as Error).message });
      return;
    }

    const [movie, reviewsResult] = await Promise.all([
      fetchMovieDetails(imdbId),
      fetchMovieReviews(imdbId),
    ]);

    // Use 2 or more reviews for the summary (never just 1)
    const allReviews = reviewsResult.reviews;
    const countToUse =
      allReviews.length <= 1
        ? allReviews.length
        : 2 + Math.floor(Math.random() * (allReviews.length - 1));
    const reviewsForAi = allReviews.slice(0, countToUse);
    const reviewCount = reviewsForAi.length;

    let sentiment: SentimentResult | null = null;
    try {
      sentiment = await analyzeSentimentAndSummarize(movie, reviewsForAi);
    } catch {
      sentiment = null;
    }

    res.json({
      movie,
      sentiment,
      meta: {
        imdbId,
        reviewCount,
        reviewSource: reviewsResult.source,
      },
    });
  } catch {
    res.status(500).json({ error: "Unexpected server error." });
  }
});

app.listen(PORT, () => {
  console.log(`API server at http://localhost:${PORT}`);
  if (!process.env.OMDB_API_KEY) console.warn("OMDB_API_KEY not set.");
  if (!process.env.OPENROUTER_API_KEY) console.warn("OPENROUTER_API_KEY not set.");
});
