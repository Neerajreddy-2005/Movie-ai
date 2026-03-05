import type { AnalysisResult, MovieData, SentimentData } from '@/types/movie';

/** API response shape from POST /api/movie */
export interface MovieApiResponse {
  movie: {
    title: string;
    year: string;
    rating: string | null;
    posterUrl: string | null;
    cast: string[];
    plot: string | null;
    genres: string[];
  };
  sentiment: {
    summary: string;
    classification: 'positive' | 'mixed' | 'negative';
  } | null;
  meta: {
    imdbId: string;
    reviewCount: number;
    reviewSource: string;
  };
}

export function mapApiToAnalysisResult(data: MovieApiResponse): AnalysisResult {
  const movie: MovieData = {
    title: data.movie.title,
    year: data.movie.year,
    rating: data.movie.rating ?? 'N/A',
    genres: data.movie.genres,
    description: data.movie.plot ?? '',
    cast: data.movie.cast,
    poster: data.movie.posterUrl ?? '',
  };

  const sentiment: SentimentData = data.sentiment
    ? {
        summary: data.sentiment.summary,
        sentiment: data.sentiment.classification,
        reviewCount: data.meta.reviewCount,
        source: data.meta.reviewSource,
      }
    : {
        summary: 'No AI summary available. Set OPENROUTER_API_KEY on the server for sentiment analysis.',
        sentiment: 'mixed',
        reviewCount: data.meta.reviewCount,
        source: data.meta.reviewSource,
      };

  return { movie, sentiment };
}

export async function fetchMovieAnalysis(imdbId: string): Promise<AnalysisResult> {
  let res: Response;
  try {
    res = await fetch('/api/movie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imdbId }),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const isNetwork = /failed|refused|network|ECONNREFUSED/i.test(msg);
    throw new Error(
      isNetwork
        ? 'API server is not running. Run "npm run dev" (starts both frontend and API) or run "npm run dev:server" in another terminal.'
        : msg
    );
  }
  const json = await res.json();
  if (!res.ok) {
    throw new Error((json as { error?: string }).error ?? 'Something went wrong.');
  }
  return mapApiToAnalysisResult(json as MovieApiResponse);
}
