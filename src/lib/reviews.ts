import { fetchJson } from "./http";

/**
 * Minimal review shape used by the AI summarization layer.
 */
export interface Review {
  id: string;
  author: string;
  content: string;
  source: "omdb";
}

interface OmdbResponse {
  Title?: string;
  Year?: string;
  Plot?: string;
  imdbRating?: string;
  imdbVotes?: string;
  Response?: string;
  Error?: string;
}

function buildReviewsFromOmdb(imdbId: string, data: OmdbResponse): Review[] {
  const reviews: Review[] = [];

  const title = data.Title && data.Title !== "N/A" ? data.Title : "This movie";
  const year = data.Year && data.Year !== "N/A" ? data.Year : null;

  if (data.Plot && data.Plot !== "N/A") {
    reviews.push({
      id: `${imdbId}-plot`,
      author: "Synopsis-style overview",
      content: year
        ? `${title} (${year}) is described in its official synopsis as: ${data.Plot}`
        : `${title} is described in its official synopsis as: ${data.Plot}`,
      source: "omdb"
    });
  }

  if (data.imdbRating && data.imdbRating !== "N/A") {
    const numericRating = Number.parseFloat(data.imdbRating);
    const votesText =
      data.imdbVotes && data.imdbVotes !== "N/A" ? data.imdbVotes : "an unspecified number of";

    let tone: string;
    if (Number.isNaN(numericRating)) {
      tone = "unclear overall audience reception";
    } else if (numericRating >= 7.5) {
      tone = "strongly positive audience reception";
    } else if (numericRating >= 6) {
      tone = "generally positive audience reception";
    } else if (numericRating >= 5) {
      tone = "mixed audience reception";
    } else {
      tone = "mostly negative audience reception";
    }

    reviews.push({
      id: `${imdbId}-rating`,
      author: "Aggregated IMDb rating",
      content: `On IMDb, ${title} currently holds an average rating of ${data.imdbRating}/10 from ${votesText} user votes, suggesting ${tone}.`,
      source: "omdb"
    });
  } else if (!data.Plot || data.Plot === "N/A") {
    reviews.push({
      id: `${imdbId}-sparse`,
      author: "Metadata-only context",
      content: `${title}${year ? ` (${year})` : ""} has very limited public information available on OMDb, so sentiment analysis may be approximate.`,
      source: "omdb"
    });
  }

  return reviews;
}

/**
 * Derives pseudo-reviews for a given IMDb id using OMDb data
 * (plot and rating) as a stand-in when real review text is not available.
 */
export async function fetchMovieReviews(imdbId: string): Promise<{
  reviews: Review[];
  source: string;
}> {
  const apiKey = process.env.OMDB_API_KEY;
  if (!apiKey) {
    return { reviews: [], source: "omdb (not configured)" };
  }

  const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${encodeURIComponent(
    imdbId
  )}&plot=full`;
  const data = await fetchJson<OmdbResponse>(url);

  if (data.Response === "False") {
    return { reviews: [], source: `omdb (error: ${data.Error || "Movie not found"})` };
  }

  const reviews = buildReviewsFromOmdb(imdbId, data);
  return { reviews, source: "omdb" };
}

//
