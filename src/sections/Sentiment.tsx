import { useEffect, useRef, useState } from 'react';
import { Brain, MessageSquare, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { SentimentData } from '@/types/movie';

interface SentimentProps {
  sentiment: SentimentData;
}

const sentimentConfig = {
  positive: {
    icon: TrendingUp,
    bgColor: 'bg-emerald-500/20',
    borderColor: 'border-emerald-500/50',
    textColor: 'text-emerald-400',
    glowColor: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]',
    label: 'POSITIVE',
  },
  mixed: {
    icon: Minus,
    bgColor: 'bg-imdb-yellow/20',
    borderColor: 'border-imdb-yellow/50',
    textColor: 'text-imdb-yellow',
    glowColor: 'shadow-[0_0_20px_rgba(245,197,24,0.3)]',
    label: 'MIXED',
  },
  negative: {
    icon: TrendingDown,
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/50',
    textColor: 'text-red-400',
    glowColor: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]',
    label: 'NEGATIVE',
  },
};

export default function SentimentSection({ sentiment }: SentimentProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const config = sentimentConfig[sentiment.sentiment];
  const Icon = config.icon;

  return (
    <section 
      ref={sectionRef}
      className="relative px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* AI Sentiment Card */}
          <div 
            className={`lg:col-span-3 relative transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
            }`}
            style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
          >
            {/* Gold accent border */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-imdb-yellow/50 via-imdb-gold/30 to-imdb-yellow/50 opacity-50" />

            {/* Card Content */}
            <div className="relative bg-imdb-gray border border-imdb-lightgray/50 rounded-2xl p-6 card-hover">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-imdb-yellow/20 flex items-center justify-center">
                    <Brain className="w-5 h-5 text-imdb-yellow" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    AI Audience Sentiment
                  </h3>
                </div>

                {/* Sentiment Badge */}
                <div 
                  className={`relative transition-all duration-500 ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                  }`}
                  style={{ transitionDelay: '500ms' }}
                >
                  <div className={`absolute inset-0 ${config.bgColor} rounded-full blur-lg animate-pulse`} />
                  <div 
                    className={`relative flex items-center gap-1.5 ${config.bgColor} backdrop-blur-sm 
                      ${config.borderColor} border rounded-full px-3 py-1.5 ${config.glowColor}`}
                  >
                    <Icon className={`w-4 h-4 ${config.textColor}`} />
                    <span className={`${config.textColor} font-bold text-sm`}>
                      {config.label}
                    </span>
                  </div>
                </div>
              </div>

              {/* AI Summary — from API JSON response, displayed in clean format */}
              <div
                className={`text-gray-300 text-base leading-relaxed transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: '600ms' }}
              >
                <p className="whitespace-pre-line text-balance">
                  {sentiment.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Review Data Card */}
          <div 
            className={`lg:col-span-2 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'
            }`}
            style={{ 
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: '150ms',
            }}
          >
            <div className="h-full bg-imdb-gray border border-imdb-lightgray/50 rounded-2xl p-6 card-hover">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-imdb-yellow/20 flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-imdb-yellow" />
                </div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                  Review Data
                </h3>
              </div>

              {/* Review Count - number of reviews the AI used for the summary above */}
              <div 
                className={`mb-3 transition-all duration-500 ${
                  isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                }`}
                style={{ transitionDelay: '550ms' }}
              >
                <span className="text-3xl font-bold text-white">{sentiment.reviewCount}</span>
                <span className="text-gray-400 ml-2">
                  {sentiment.reviewCount === 1 ? 'review' : 'reviews'} used for this AI summary
                </span>
              </div>

              {/* Description */}
              <p 
                className={`text-gray-500 text-sm leading-relaxed transition-all duration-700 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transitionDelay: '700ms' }}
              >
                Based on audience reviews from OMDb, summarized by AI to highlight overall sentiment and key opinions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
