export interface MovieData {
  title: string;
  year: string;
  rating: string;
  genres: string[];
  description: string;
  cast: string[];
  poster: string;
}

export interface SentimentData {
  sentiment: 'positive' | 'mixed' | 'negative';
  summary: string;
  reviewCount: number;
  source: string;
}

export interface AnalysisResult {
  movie: MovieData;
  sentiment: SentimentData;
}
