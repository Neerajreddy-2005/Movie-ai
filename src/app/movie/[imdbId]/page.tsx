'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import MovieInfo from '@/sections/MovieInfo';
import SentimentSection from '@/sections/Sentiment';
import LoadingSkeleton from '@/sections/LoadingSkeleton';
import { fetchMovieAnalysis } from '@/lib/movie-api';
import type { AnalysisResult } from '@/types/movie';

export default function MovieResultPage() {
  const params = useParams();
  const imdbId = (params && typeof params.imdbId === 'string') ? params.imdbId : '';
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!imdbId || !/^tt\d{7,}$/.test(imdbId)) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchMovieAnalysis(imdbId);
        if (!cancelled) setResult(data);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Something went wrong.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [imdbId]);

  if (!imdbId || !/^tt\d{7,}$/.test(imdbId)) {
    return (
      <div className="min-h-screen bg-imdb-darker flex flex-col items-center justify-center px-4">
        <p className="text-gray-400">Invalid movie ID.</p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center gap-2 text-imdb-yellow hover:underline text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to search
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-imdb-darker">
        <div className="px-4 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-imdb-yellow transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Search again
          </Link>
        </div>
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-imdb-darker flex flex-col">
        <div className="px-4 pt-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-imdb-yellow transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Search again
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="max-w-md w-full rounded-xl border border-rose-500/40 bg-rose-950/60 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-imdb-darker">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-imdb-lightgray/50 to-transparent" />
        <div className="px-4 pt-6 pb-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-imdb-yellow transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Search again
          </Link>
        </div>
        <div className="space-y-8 pb-20">
          <MovieInfo movie={result.movie} />
          <SentimentSection sentiment={result.sentiment} />
        </div>
      </div>
      <footer className="border-t border-imdb-lightgray/30 py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-500 text-sm">Data from IMDb</p>
        </div>
      </footer>
    </div>
  );
}
