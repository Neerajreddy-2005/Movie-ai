import { NextRequest } from "next";
import {
  fetchMovieDetails,
  validateImdbId,
} from "../../../lib/imdb";
import { fetchMovieReviews } from "../../../lib/reviews";
import {
  analyzeSentimentAndSummarize,
  type SentimentResult,
} from "../../../lib/ai";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const rawId = typeof body.imdbId === "string" ? body.imdbId : "";

  if (!rawId) {
    return Response.json({ error: "IMDb ID is required." }, { status: 400 });
  }

  let imdbId: string;
  try {
    imdbId = validateImdbId(rawId);
  } catch (err) {
    return Response.json(
      { error: (err as Error).message },
      { status: 400 }
    );
  }

  try {
    const [movie, reviewsResult] = await Promise.all([
      fetchMovieDetails(imdbId),
      fetchMovieReviews(imdbId),
    ]);

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

    return Response.json({
      movie,
      sentiment,
      meta: {
        imdbId,
        reviewCount,
        reviewSource: reviewsResult.source,
      },
    });
  } catch {
    return Response.json(
      { error: "Unexpected server error." },
      { status: 500 }
    );
  }
}
