import { Loader2 } from 'lucide-react';

export default function LoadingSkeleton() {
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Movie Info Skeleton */}
        <div className="relative bg-imdb-gray/50 border border-imdb-lightgray/30 rounded-2xl p-6 overflow-hidden">
          {/* Shimmer Effect */}
          <div className="absolute inset-0 animate-shimmer" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Poster Skeleton */}
            <div className="md:col-span-4">
              <div className="aspect-[2/3] bg-imdb-lightgray/30 rounded-xl animate-pulse" />
            </div>

            {/* Content Skeleton */}
            <div className="md:col-span-8 space-y-4">
              {/* Title */}
              <div className="h-10 bg-imdb-lightgray/30 rounded-lg w-3/4 animate-pulse" />
              
              {/* Meta */}
              <div className="flex gap-3">
                <div className="h-6 bg-imdb-lightgray/30 rounded-full w-20 animate-pulse" />
                <div className="h-6 bg-imdb-lightgray/30 rounded-full w-24 animate-pulse" />
                <div className="h-6 bg-imdb-lightgray/30 rounded-full w-28 animate-pulse" />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="h-4 bg-imdb-lightgray/30 rounded w-full animate-pulse" />
                <div className="h-4 bg-imdb-lightgray/30 rounded w-full animate-pulse" />
                <div className="h-4 bg-imdb-lightgray/30 rounded w-2/3 animate-pulse" />
              </div>

              {/* Cast */}
              <div className="h-5 bg-imdb-lightgray/30 rounded w-1/2 animate-pulse mt-6" />
            </div>
          </div>
        </div>

        {/* Sentiment Skeleton */}
        <div className="relative bg-imdb-gray/50 border border-imdb-lightgray/30 rounded-2xl p-6 overflow-hidden">
          {/* Shimmer Effect */}
          <div className="absolute inset-0 animate-shimmer" />
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <div className="h-6 bg-imdb-lightgray/30 rounded w-48 animate-pulse" />
                <div className="h-8 bg-imdb-lightgray/30 rounded-full w-28 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-imdb-lightgray/30 rounded w-full animate-pulse" />
                <div className="h-4 bg-imdb-lightgray/30 rounded w-full animate-pulse" />
                <div className="h-4 bg-imdb-lightgray/30 rounded w-3/4 animate-pulse" />
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="h-6 bg-imdb-lightgray/30 rounded w-32 animate-pulse" />
              <div className="h-8 bg-imdb-lightgray/30 rounded w-20 animate-pulse" />
              <div className="h-4 bg-imdb-lightgray/30 rounded w-full animate-pulse" />
            </div>
          </div>
        </div>

        {/* Loading Indicator */}
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-3 text-imdb-yellow">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-sm font-medium">Analyzing movie data...</span>
          </div>
        </div>
      </div>
    </section>
  );
}
