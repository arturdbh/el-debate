import React from 'react';
import { 
  Eye, 
  ThumbsUp, 
  ThumbsDown, 
  Clock, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  MapPin, 
  Sparkles,
  Zap
} from 'lucide-react';
import { useNewspaper } from '../context/NewspaperContext';
import { Article } from '../types/newspaper';

interface ArticleCardProps {
  article: Article;
  featured?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, featured = false }) => {
  const { 
    openArticle, 
    toggleSaveOffline, 
    isOfflineArticle, 
    dataSaverMode, 
    userReactions, 
    reactToArticle 
  } = useNewspaper();

  const isSaved = isOfflineArticle(article.id);
  const currentReaction = userReactions[article.id];

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.subtitle,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${article.title}\n\nLeído en El Debate de los Calentanos`);
    }
  };

  const handleReaction = (e: React.MouseEvent, type: 'like' | 'dislike') => {
    e.stopPropagation();
    reactToArticle(article.id, type);
  };

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSaveOffline(article.id);
  };

  if (featured && !dataSaverMode) {
    return (
      <article 
        onClick={() => openArticle(article)}
        className="group bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-lg overflow-hidden shadow-xs hover:shadow-md transition cursor-pointer mb-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Main Visual */}
          <div className="lg:col-span-7 relative aspect-16/10 sm:aspect-16/9 overflow-hidden bg-stone-100 dark:bg-stone-800">
            <img
              src={article.imageUrl}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
            />
            <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
              {article.isBreaking && (
                <span className="bg-red-700 text-white font-black text-[10px] tracking-wider uppercase px-2 py-0.5 rounded shadow-xs flex items-center gap-1 animate-pulse">
                  <Zap className="w-3 h-3 text-yellow-300" />
                  ÚLTIMA HORA
                </span>
              )}
              {article.isPremiumExclusive && (
                <span className="bg-amber-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-yellow-200" />
                  EXCLUSIVO SOCIOS
                </span>
              )}
              <span className="bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded">
                {article.category}
              </span>
            </div>
            {article.imageCaption && (
              <div className="absolute bottom-0 inset-x-0 bg-linear-to-t from-black/80 via-black/40 to-transparent p-2 text-white/90 text-[11px] italic">
                {article.imageCaption}
              </div>
            )}
          </div>

          {/* Editorial Content */}
          <div className="lg:col-span-5 p-4 sm:p-6 flex flex-col justify-between">
            <div>
              {/* Municipality Tag */}
              <div className="flex items-center gap-1.5 text-xs text-red-800 dark:text-red-400 font-extrabold mb-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>{article.municipality.toUpperCase()}</span>
                <span className="text-stone-400 dark:text-stone-600">•</span>
                <span className="text-stone-700 dark:text-stone-300 font-semibold">{article.publishedAt}</span>
              </div>

              {/* Title */}
              <h2 className="font-headline text-xl sm:text-2xl lg:text-3xl font-black text-stone-950 dark:text-stone-50 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition leading-tight">
                {article.title}
              </h2>

              {/* Subtitle / Bajada */}
              <p className="mt-2.5 text-xs sm:text-sm text-stone-900 dark:text-stone-100 font-serif leading-relaxed line-clamp-3 font-medium">
                {article.subtitle}
              </p>

              {/* Author */}
              <div className="mt-3 text-xs text-stone-800 dark:text-stone-200 font-semibold">
                Por <strong className="text-stone-950 dark:text-stone-50 font-bold">{article.author}</strong> — {article.authorRole}
              </div>
            </div>

            {/* Metrics & Action Bar */}
            <div className="mt-4 pt-3 border-t border-stone-300 dark:border-stone-800 flex items-center justify-between text-xs text-stone-900 dark:text-stone-200 font-semibold">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 font-bold text-stone-950 dark:text-stone-100" title="Vistas registradas">
                  <Eye className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
                  <span>{article.viewsCount.toLocaleString()}</span>
                </span>
                <span className="flex items-center gap-1 font-bold text-stone-950 dark:text-stone-100">
                  <Clock className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
                  <span>{article.readingTimeMinutes} min</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Reactions */}
                <button
                  onClick={(e) => handleReaction(e, 'like')}
                  className={`flex items-center gap-1 px-1.5 py-1 rounded transition cursor-pointer font-bold ${
                    currentReaction === 'like' ? 'text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40' : 'text-stone-700 dark:text-stone-300 hover:text-stone-950'
                  }`}
                  title="Me gusta"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{article.likesCount}</span>
                </button>
                <button
                  onClick={(e) => handleReaction(e, 'dislike')}
                  className={`flex items-center gap-1 px-1.5 py-1 rounded transition cursor-pointer font-bold ${
                    currentReaction === 'dislike' ? 'text-red-800 dark:text-red-400 bg-red-50 dark:bg-red-950/40' : 'text-stone-700 dark:text-stone-300 hover:text-stone-950'
                  }`}
                  title="No me gusta"
                >
                  <ThumbsDown className="w-3.5 h-3.5" />
                  <span>{article.dislikesCount}</span>
                </button>

                {/* Save offline */}
                <button
                  onClick={handleSaveToggle}
                  className={`p-1.5 rounded transition cursor-pointer font-bold ${
                    isSaved ? 'text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-950' : 'text-stone-700 dark:text-stone-300 hover:text-stone-950'
                  }`}
                  title={isSaved ? 'Guardado para leer sin conexión' : 'Guardar para leer sin conexión'}
                >
                  {isSaved ? <BookmarkCheck className="w-4 h-4 text-amber-700" /> : <Bookmark className="w-4 h-4" />}
                </button>

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white transition cursor-pointer"
                  title="Compartir nota"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>
    );
  }

  // Standard card or Data-Saver card
  return (
    <article
      onClick={() => openArticle(article)}
      className="group bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-xl p-4 shadow-xs hover:shadow-md hover:border-amber-700 dark:hover:border-amber-600 transition cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* If NOT in dataSaverMode, display compact image */}
        {!dataSaverMode && (
          <div className="relative aspect-16/9 rounded-lg overflow-hidden mb-3 bg-stone-100 dark:bg-stone-800">
            <img
              src={article.imageUrl}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
            />
            {article.isBreaking && (
              <span className="absolute top-2 left-2 bg-red-700 text-white font-black text-[9px] uppercase px-1.5 py-0.5 rounded shadow-xs">
                ÚLTIMA HORA
              </span>
            )}
          </div>
        )}

        {/* Municipality & Category */}
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-red-800 dark:text-red-400 font-extrabold flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {article.municipality}
          </span>
          <span className="text-stone-700 dark:text-stone-300 text-[11px] font-bold bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded">
            {article.category}
          </span>
        </div>

        {/* Headline */}
        <h3 className="font-headline text-base sm:text-lg font-black text-stone-950 dark:text-stone-50 group-hover:text-amber-800 dark:group-hover:text-amber-400 transition leading-snug line-clamp-2">
          {article.title}
        </h3>

        {/* Subtitle */}
        <p className="mt-2 text-xs sm:text-sm text-stone-900 dark:text-stone-100 font-serif line-clamp-2 leading-relaxed font-medium">
          {article.subtitle}
        </p>

        {/* Author Byline */}
        <div className="mt-2.5 text-xs text-stone-800 dark:text-stone-200 font-semibold">
          Por <strong className="text-stone-950 dark:text-stone-50 font-bold">{article.author}</strong> • {article.publishedAt.split(' ')[0]}
        </div>
      </div>

      {/* Footer bar */}
      <div className="mt-3.5 pt-2.5 border-t border-stone-300 dark:border-stone-800 flex items-center justify-between text-xs text-stone-900 dark:text-stone-200 font-semibold">
        <div className="flex items-center gap-2 font-bold">
          <span className="flex items-center gap-1 text-stone-950 dark:text-stone-100">
            <Eye className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
            <span>{article.viewsCount}</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 text-stone-950 dark:text-stone-100">
            <Clock className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
            <span>{article.readingTimeMinutes}m</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => handleReaction(e, 'like')}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded cursor-pointer font-bold ${
              currentReaction === 'like' ? 'text-amber-800 dark:text-amber-400 bg-amber-50' : 'text-stone-700 dark:text-stone-300 hover:text-stone-950'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="text-xs">{article.likesCount}</span>
          </button>

          <button
            onClick={handleSaveToggle}
            className={`p-1 rounded cursor-pointer ${
              isSaved ? 'text-amber-800 dark:text-amber-400' : 'text-stone-600 dark:text-stone-300 hover:text-stone-950'
            }`}
            title="Guardar sin conexión"
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4 text-amber-700" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </article>
  );
};
