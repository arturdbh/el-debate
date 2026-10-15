import React from 'react';
import { 
  Flame, 
  Wifi, 
  WifiOff, 
  Bell, 
  Sun, 
  Moon, 
  Bookmark, 
  ShieldCheck, 
  SlidersHorizontal,
  CloudSun,
  UserCheck,
  TrendingUp,
  MapPin,
  PenTool
} from 'lucide-react';
import { useNewspaper } from '../context/NewspaperContext';

interface HeaderProps {
  onOpenProfile: () => void;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProfile, onOpenNotifications }) => {
  const { 
    dataSaverMode, 
    setDataSaverMode, 
    isOnline, 
    themeMode, 
    setThemeMode, 
    fontSize, 
    setFontSize,
    offlineArticles,
    isPremium,
    unreadAlertsCount,
    setCurrentTab,
    siteTexts
  } = useNewspaper();

  const toggleTheme = () => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  };

  const cycleFontSize = () => {
    const sizes: ('sm' | 'md' | 'lg' | 'xl')[] = ['sm', 'md', 'lg', 'xl'];
    const nextIdx = (sizes.indexOf(fontSize) + 1) % sizes.length;
    setFontSize(sizes[nextIdx]);
  };

  const todayStr = new Intl.DateTimeFormat('es-MX', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  return (
    <header className="border-b border-stone-300 dark:border-stone-800 bg-[#fbf9f5] dark:bg-stone-950 transition-colors">
      {/* Top Utility Bar */}
      <div className="bg-stone-900 text-stone-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Weather & Location */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1 font-semibold text-amber-400">
              <MapPin className="w-3.5 h-3.5" />
              {siteTexts.locationLabel}
            </span>
            <span className="flex items-center gap-1.5 text-stone-300">
              <CloudSun className="w-3.5 h-3.5 text-amber-300" />
              <span>{siteTexts.weatherLabel}</span>
              <span className="text-stone-500">|</span>
              <span>{siteTexts.balsasRiverLabel}</span>
            </span>
            <span className="hidden lg:inline text-stone-400">
              {todayStr.charAt(0).toUpperCase() + todayStr.slice(1)}
            </span>
          </div>

          {/* Accessibility & Low-Connectivity Controls */}
          <div className="flex items-center gap-3">
            {/* Online / Offline indicator */}
            <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
              isOnline ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300 border border-red-800'
            }`}>
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              <span>{isOnline ? 'En línea' : 'Sin conexión'}</span>
            </div>

            {/* Data Saver Mode Toggle */}
            <button
              onClick={() => setDataSaverMode(!dataSaverMode)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer ${
                dataSaverMode 
                  ? 'bg-amber-600 text-white font-bold' 
                  : 'bg-stone-800 hover:bg-stone-700 text-stone-300'
              }`}
              title="Reduce el consumo de megas omitiendo elementos pesados para conexiones 2G/3G de campo"
            >
              <SlidersHorizontal className="w-3 h-3" />
              <span>{dataSaverMode ? 'Ahorro Datos: ACTIVO' : 'Ahorro Datos'}</span>
            </button>

            {/* Font Size Adjuster */}
            <button
              onClick={cycleFontSize}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer"
              title="Cambiar tamaño de letra para lectura cómoda"
            >
              Fuente: {fontSize.toUpperCase()}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="bg-stone-800 hover:bg-stone-700 text-stone-200 p-1 rounded cursor-pointer"
              title={themeMode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {themeMode === 'dark' ? <Moon className="w-3.5 h-3.5 text-blue-400" /> : <Sun className="w-3.5 h-3.5 text-amber-400" />}
            </button>

            {/* Push Notifications Bell */}
            <button
              onClick={onOpenNotifications}
              className="relative bg-stone-800 hover:bg-stone-700 text-stone-200 p-1 rounded cursor-pointer"
              title="Alertas y Notificaciones de última hora"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center font-bold">
                  {unreadAlertsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Historical Newspaper Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center">
        {/* Top Masthead metadata */}
        <div className="flex items-center justify-between text-xs text-stone-600 dark:text-stone-400 border-b border-stone-300 dark:border-stone-800 pb-2 mb-3">
          <span className="font-semibold tracking-wider uppercase">{siteTexts.epochText}</span>
          <span className="hidden md:inline italic font-serif">{siteTexts.topMotto}</span>
          <div className="flex items-center gap-2">
            <span className="font-serif italic text-xs text-stone-600 dark:text-stone-400">
              Edición Digital Regional
            </span>
          </div>
        </div>

        {/* Title with Eye-Catching Regional Effect */}
        <div 
          className="relative py-4 px-4 sm:px-8 my-2 rounded-2xl cursor-pointer select-none transition-all duration-300 group overflow-hidden border border-amber-500/20 dark:border-amber-400/20 bg-linear-to-b from-amber-500/10 via-amber-50/40 to-transparent dark:from-amber-950/40 dark:via-stone-900/60 dark:to-stone-950/80 shadow-xs hover:shadow-md hover:border-amber-500/40"
          onClick={() => setCurrentTab('portada')}
        >
          {/* Subtle animated glowing aura in background */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.16)_0%,rgba(217,119,6,0.06)_45%,transparent_75%)] animate-pulse" />
          
          {/* Decorative Filigrees */}
          <div className="absolute top-2 left-3 text-amber-700/40 dark:text-amber-400/40 text-xs select-none">✦ ✦ ✦</div>
          <div className="absolute top-2 right-3 text-amber-700/40 dark:text-amber-400/40 text-xs select-none">✦ ✦ ✦</div>

          <div className="relative z-10">
            <h1 className="font-masthead text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-stone-950 dark:text-stone-50 leading-none drop-shadow-sm transition-transform duration-300 group-hover:scale-[1.008]">
              <span className="bg-linear-to-r from-stone-950 via-stone-900 to-amber-950 dark:from-stone-50 dark:via-amber-100 dark:to-white bg-clip-text">
                {siteTexts.mastheadTitle}
              </span>
            </h1>
            <p className="mt-2 text-base sm:text-lg font-serif font-black text-stone-900 dark:text-stone-100 tracking-wider uppercase">
              {siteTexts.mastheadSubtitle}
            </p>
            <div className="flex justify-end max-w-4xl mx-auto mt-1 pr-1">
              <span className="font-memorial text-xs sm:text-sm md:text-base text-amber-950 dark:text-amber-300 font-bold italic tracking-wide border-b border-amber-900/40 dark:border-amber-400/40 pb-0.5">
                {siteTexts.memorialText}
              </span>
            </div>
          </div>
        </div>

        {/* Triple Border Newspaper Line */}
        <div className="pt-2">
          <div className="border-t-2 border-stone-800 dark:border-stone-300"></div>
          <div className="border-t border-stone-400 dark:border-stone-700 my-0.5"></div>
        </div>

        {/* Agro-Ticker: Precios de Campo y Tipo de Cambio */}
        <div className="py-1.5 flex items-center justify-between text-xs overflow-x-auto text-stone-700 dark:text-stone-300 no-scrollbar gap-4 whitespace-nowrap">
          <div className="flex items-center gap-1 font-bold text-amber-800 dark:text-amber-400 shrink-0">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{siteTexts.indicatorsLabel}</span>
          </div>
          <div className="flex items-center gap-6 shrink-0 font-medium">
            <span>🌽 Maíz Blanco de temporal: <strong className="text-stone-900 dark:text-white">$6,850/ton</strong></span>
            <span>🥩 Ganado en pie (Suizo/Cebú): <strong className="text-stone-900 dark:text-white">$56.00/kg</strong></span>
            <span>🥜 Ajonjolí criollo: <strong className="text-stone-900 dark:text-white">$24,200/ton</strong></span>
            <span>🧀 Queso cincho oreado: <strong className="text-stone-900 dark:text-white">$140/kg</strong></span>
            <span>💵 Dólar en frontera / remesas: <strong className="text-stone-900 dark:text-white">$18.45 MXN</strong></span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-1 text-xs bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 px-2 py-0.5 rounded cursor-pointer font-medium"
            >
              <UserCheck className="w-3 h-3 text-stone-600 dark:text-stone-300" />
              <span>Mi Perfil & Estadísticas</span>
            </button>
            <button
              onClick={() => setCurrentTab('offline')}
              className="flex items-center gap-1 text-xs bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 px-2 py-0.5 rounded cursor-pointer font-medium"
            >
              <Bookmark className="w-3 h-3" />
              <span>Guardados ({offlineArticles.length})</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
