import { fetchJson } from "./http";

const IMDB_ID_REGEX = /^tt\d{7,}$/;

/**
 * Canonical shape the rest of the app uses for movie details,
 * independent of the underlying data provider.
 */
export interface NormalizedMovie {
  title: string;
  year: string;
  rating: string | null;
  posterUrl: string | null;
  cast: string[];
  plot: string | null;
  genres: string[];
}

/**
 * Basic guard to ensure the string looks like an IMDb movie id, e.g. tt1234567.
 */
export function validateImdbId(id: string): string {
  const trimmed = id.trim();
  if (!IMDB_ID_REGEX.test(trimmed)) {
    throw new Error("Invalid IMDb ID. It should look like tt1234567.");
  }
  return trimmed;
}

interface OmdbResponse {
  Title?: string;
  Year?: string;
  imdbRating?: string;
  Poster?: string;
  Plot?: string;
  Genre?: string;
  Actors?: string;
  Response?: string;
  Error?: string;
}

/**
 * Fetches movie details from OMDb and normalizes them into a `NormalizedMovie`.
 */
export async function fetchMovieDetails(imdbId: string): Promise<NormalizedMovie> {
  const validId = validateImdbId(imdbId);
  const apiKey = process.env.OMDB_API_KEY;

  if (!apiKey) {
    throw new Error("OMDB_API_KEY is not configured on the server.");
  }

  const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${encodeURIComponent(
    validId
  )}&plot=short`;

  const data = await fetchJson<OmdbResponse>(url);

  if (data.Response === "False") {
    throw new Error(data.Error || "Movie not found.");
  }

  const cast =
    data.Actors?.split(",")
      .map((a) => a.trim())
      .filter(Boolean) ?? [];

  const genres =
    data.Genre?.split(",")
      .map((g) => g.trim())
      .filter(Boolean) ?? [];

  return {
    title: data.Title ?? "Unknown title",
    year: data.Year ?? "N/A",
    rating: data.imdbRating && data.imdbRating !== "N/A" ? data.imdbRating : null,
    posterUrl: data.Poster && data.Poster !== "N/A" ? data.Poster : null,
    cast,
    plot: data.Plot && data.Plot !== "N/A" ? data.Plot : null,
    genres
  };
}

