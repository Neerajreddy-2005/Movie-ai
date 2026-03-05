'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import Hero from '@/sections/Hero';

export default function HomePage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(
    (movieId: string) => {
      const trimmed = movieId.trim();
      setError(null);
      if (!/^tt\d{7,}$/.test(trimmed)) {
        setError('Please enter a valid IMDb ID like tt1234567.');
        return;
      }
      router.push(`/movie/${encodeURIComponent(trimmed)}`);
    },
    [router]
  );

  return (
    <div className="min-h-screen bg-imdb-darker">
      <Hero onAnalyze={handleAnalyze} isLoading={false} />
      {error && (
        <div className="px-4 pb-4 sm:px-6 lg:px-8">
          <div
            role="alert"
            className="mx-auto max-w-2xl rounded-xl border border-rose-500/40 bg-rose-950/60 px-4 py-3 text-sm text-rose-100"
          >
            {error}
          </div>
        </div>
      )}
      <footer className="border-t border-imdb-lightgray/30 py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-gray-500 text-sm">Data from IMDb</p>
        </div>
      </footer>
    </div>
  );
}
