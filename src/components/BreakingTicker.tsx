import React, { useState, useEffect } from 'react';
import { AlertCircle, ChevronRight, ChevronLeft, Zap, Flame, Radio } from 'lucide-react';
import { useNewspaper } from '../context/NewspaperContext';
import { Article } from '../types/newspaper';

interface BreakingItem {
  id: string;
  badge: string;
  title: string;
  snippet: string;
  timestamp: string;
  municipality?: string;
  article?: Article;
}

export const BreakingTicker: React.FC = () => {
  const { alerts, articles, openArticle } = useNewspaper();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Intelligently compute all breaking / urgent items from articles & alerts
  const breakingItems: BreakingItem[] = React.useMemo(() => {
    const items: BreakingItem[] = [];

    // 1. Articles marked explicitly as breaking
    articles
      .filter(a => a.isBreaking)
      .forEach(a => {
        items.push({
          id: `art-breaking-${a.id}`,
          badge: 'ÚLTIMA HORA',
          title: a.title,
          snippet: a.summary || a.subtitle,
          timestamp: a.publishedAt ? a.publishedAt.slice(11, 16) || 'Reciente' : 'Reciente',
          municipality: a.municipality,
          article: a
        });
      });

    // 2. Urgent push alerts
    alerts
      .filter(al => al.urgent)
      .forEach(al => {
        const linkedArticle = al.articleId ? articles.find(a => a.id === al.articleId) : undefined;
        // Avoid duplicate if article was already added
        if (!items.some(i => i.article?.id === al.articleId)) {
          items.push({
            id: `alert-${al.id}`,
            badge: 'ALERTA REGIONAL',
            title: al.title,
            snippet: al.body,
            timestamp: al.timestamp,
            article: linkedArticle
          });
        }
      });

    // 3. Articles under "Última Hora" category not yet added
    articles
      .filter(a => a.category === 'Última Hora' && !items.some(i => i.article?.id === a.id))
      .slice(0, 3)
      .forEach(a => {
        items.push({
          id: `art-cat-${a.id}`,
          badge: 'DESARROLLO',
          title: a.title,
          snippet: a.summary || a.subtitle,
          timestamp: 'Reciente',
          municipality: a.municipality,
          article: a
        });
      });

    return items;
  }, [articles, alerts]);

  // Auto-cycle through breaking items every 7 seconds
  useEffect(() => {
    if (breakingItems.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % breakingItems.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [breakingItems.length]);

  if (breakingItems.length === 0) return null;

  const currentItem = breakingItems[currentIndex % breakingItems.length];

  const handleClick = () => {
    if (currentItem.article) {
      openArticle(currentItem.article);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev + 1) % breakingItems.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex(prev => (prev - 1 + breakingItems.length) % breakingItems.length);
  };

  return (
    <div className="bg-red-700 text-white text-xs px-3 sm:px-4 py-2 border-b border-red-800 shadow-inner">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
        {/* Animated Badge */}
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="flex items-center gap-1 bg-red-950 text-red-100 uppercase tracking-widest font-black text-[10px] px-2 py-0.5 rounded shadow-xs border border-red-800/80">
            <Radio className="w-3 h-3 text-yellow-300 animate-ping" />
            <span className="text-yellow-300 font-black">{currentItem.badge}</span>
          </span>
          {breakingItems.length > 1 && (
            <span className="hidden sm:inline bg-red-800 text-red-200 text-[10px] font-bold px-1.5 py-0.2 rounded">
              {currentIndex + 1}/{breakingItems.length}
            </span>
          )}
          <span className="hidden sm:inline font-bold text-red-300">|</span>
        </div>

        {/* Content */}
        <div 
          onClick={handleClick}
          className="flex-1 truncate font-medium text-red-50 hover:text-white cursor-pointer flex items-center gap-2 group transition"
          title="Haz clic para leer la nota completa al instante"
        >
          {currentItem.municipality && currentItem.municipality !== 'Todas' && (
            <span className="hidden md:inline text-[10px] bg-red-800/90 text-red-100 font-bold px-1.5 py-0.5 rounded shrink-0">
              📍 {currentItem.municipality}
            </span>
          )}
          <span className="font-extrabold group-hover:underline text-yellow-200 shrink-0">
            {currentItem.title}:
          </span>
          <span className="truncate text-red-100 font-normal">
            {currentItem.snippet}
          </span>
          <span className="text-[10px] text-red-300 shrink-0 hidden lg:inline">
            ({currentItem.timestamp})
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 shrink-0">
          {breakingItems.length > 1 && (
            <div className="flex items-center bg-red-850 rounded p-0.5">
              <button 
                onClick={handlePrev}
                className="p-0.5 hover:bg-red-800 text-red-200 hover:text-white rounded cursor-pointer"
                title="Nota anterior"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={handleNext}
                className="p-0.5 hover:bg-red-800 text-red-200 hover:text-white rounded cursor-pointer"
                title="Siguiente nota"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {currentItem.article && (
            <button
              onClick={handleClick}
              className="flex items-center gap-1 text-[11px] font-bold bg-white text-red-900 hover:bg-red-100 px-2 py-0.5 rounded cursor-pointer transition shadow-2xs shrink-0"
            >
              <span>Leer nota</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
