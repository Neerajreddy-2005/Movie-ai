import { useEffect, useRef, useState } from 'react';
import { Star, Calendar, Users, Film } from 'lucide-react';
import type { MovieData } from '@/types/movie';

interface MovieInfoProps {
  movie: MovieData;
}

export default function MovieInfo({ movie }: MovieInfoProps) {
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

  return (
    <section 
      ref={sectionRef}
      className="relative px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10">
          {/* Poster */}
          <div className="md:col-span-4 lg:col-span-4">
            <div 
              className={`relative transition-all duration-800 ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'
              }`}
              style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
              <div 
                className="relative group cursor-pointer"
                style={{
                  transform: isVisible ? 'rotateY(-3deg)' : 'rotateY(-20deg)',
                  transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {/* Poster Glow */}
                <div 
                  className="absolute -inset-4 bg-imdb-yellow/10 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                
                {/* Poster Image or placeholder when missing */}
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-poster group-hover:shadow-card transition-all duration-500 group-hover:scale-[1.02] bg-imdb-gray border border-imdb-lightgray/50">
                  {movie.poster ? (
                    <img
                      src={movie.poster}
                      alt={movie.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 p-4">
                      <Film className="w-16 h-16 mb-2 opacity-50" />
                      <span className="text-sm text-center">No poster available</span>
                    </div>
                  )}
                  
                  {/* Overlay Gradient - only when poster exists */}
                  {movie.poster && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                </div>

                {/* Floating Rating Badge */}
                <div 
                  className={`absolute -top-3 -right-3 transition-all duration-500 ${
                    isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                  }`}
                  style={{ transitionDelay: '500ms' }}
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-imdb-yellow/40 rounded-full blur-lg animate-pulse" />
                    <div className="relative flex items-center gap-1.5 bg-imdb-yellow/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-glow">
                      <Star className="w-4 h-4 text-imdb-darker fill-imdb-darker" />
                      <span className="text-imdb-darker font-bold text-sm">{movie.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-8 lg:col-span-8">
            <div className="h-full flex flex-col justify-center">
              {/* Title */}
              <h2 
                className={`text-3xl sm:text-4xl font-bold text-white mb-4 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: '200ms' }}
              >
                {movie.title}
              </h2>

              {/* Meta Info */}
              <div 
                className={`flex flex-wrap items-center gap-3 mb-5 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
                }`}
                style={{ transitionDelay: '400ms' }}
              >
                {/* Year */}
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{movie.year}</span>
                </div>

                <span className="text-gray-600">•</span>

                {/* IMDb Rating */}
                <div className="flex items-center gap-1.5">
                  <span className="text-imdb-yellow font-semibold text-sm">IMDb</span>
                  <span className="text-white font-bold text-sm">{movie.rating}</span>
                </div>

                <span className="text-gray-600">•</span>

                {/* Genres */}
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((genre, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-medium text-gray-300 border border-imdb-lightgray/70 
                        rounded-full hover:border-imdb-yellow hover:bg-imdb-yellow/10 transition-all duration-300 cursor-default"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div 
                className={`relative overflow-hidden transition-all duration-700 ${
                  isVisible ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ transitionDelay: '600ms' }}
              >
                <p className="text-gray-300 text-base leading-relaxed">
                  {movie.description}
                </p>
              </div>

              {/* Cast */}
              <div 
                className={`mt-6 transition-all duration-700 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
                }`}
                style={{ transitionDelay: '800ms' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-imdb-yellow" />
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Main Cast
                  </span>
                </div>
                <p className="text-white font-medium">
                  {movie.cast.join(', ')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
