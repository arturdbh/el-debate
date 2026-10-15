import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Flame, 
  Clock, 
  BookOpen, 
  Bookmark, 
  CheckCircle2, 
  Trash2, 
  Bell, 
  ShieldCheck, 
  FileText,
  SlidersHorizontal
} from 'lucide-react';
import { useNewspaper } from '../context/NewspaperContext';
import { exportUserStatsReportPDF } from '../utils/pdfExport';

interface UserProfileModalProps {
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ onClose }) => {
  const { 
    readingStats, 
    articles, 
    offlineArticles, 
    toggleSaveOffline, 
    openArticle,
    isPremium,
    dataSaverMode,
    setDataSaverMode,
    pushEnabled,
    togglePushNotifications
  } = useNewspaper();

  const [userName, setUserName] = useState('Don Salvador Calentano');
  const [dailyReminder, setDailyReminder] = useState(true);

  const savedArticlesList = articles.filter(a => offlineArticles.includes(a.id));

  const handleExportStats = () => {
    exportUserStatsReportPDF(readingStats, articles, userName);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
      <div className="bg-[#fcfaf7] dark:bg-stone-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-300 dark:border-stone-800 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-stone-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-lg font-masthead">
              {userName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-stone-100">{userName}</h3>
                {isPremium && (
                  <span className="bg-amber-500 text-stone-950 font-black text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Socio Premium
                  </span>
                )}
              </div>
              <div className="text-xs text-stone-400">
                Lector de El Debate de los Calentanos • Tierra Caliente
              </div>
            </div>
          </div>

          <button onClick={onClose} className="p-1 rounded hover:bg-stone-800 text-stone-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl p-3.5 text-center">
              <div className="text-amber-700 dark:text-amber-400 font-bold flex items-center justify-center gap-1 text-xs mb-1">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Leídos</span>
              </div>
              <div className="text-2xl font-black text-amber-900 dark:text-amber-200">
                {readingStats.articlesRead.length}
              </div>
              <div className="text-[10px] text-stone-500">Noticias completadas</div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl p-3.5 text-center">
              <div className="text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center gap-1 text-xs mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Tiempo</span>
              </div>
              <div className="text-2xl font-black text-emerald-900 dark:text-emerald-200">
                {readingStats.totalMinutesRead} <span className="text-xs font-normal">min</span>
              </div>
              <div className="text-[10px] text-stone-500">Dedicados a informarse</div>
            </div>

            <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl p-3.5 text-center">
              <div className="text-red-700 dark:text-red-400 font-bold flex items-center justify-center gap-1 text-xs mb-1">
                <Flame className="w-3.5 h-3.5" />
                <span>Racha</span>
              </div>
              <div className="text-2xl font-black text-red-900 dark:text-red-200">
                {readingStats.readingStreakDays} <span className="text-xs font-normal">días</span>
              </div>
              <div className="text-[10px] text-stone-500">Lectura consecutiva</div>
            </div>
          </div>

          {/* Interests by Category */}
          <div className="bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center justify-between text-xs">
              <span>Tus Temas y Categorías de Mayor Interés</span>
              <span className="text-[11px] text-stone-400">Calculado inteligentemente</span>
            </h4>
            
            {Object.keys(readingStats.favoriteCategories).length === 0 ? (
              <p className="text-[11px] text-stone-500 italic py-1">
                Aún no has leído suficientes notas para identificar tus categorías principales.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {Object.entries(readingStats.favoriteCategories).map(([cat, count]) => (
                  <span
                    key={cat}
                    className="bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5"
                  >
                    <span>{cat}</span>
                    <span className="bg-amber-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                      {count}
                    </span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Offline Saved Articles */}
          <div className="bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5 text-xs">
                <Bookmark className="w-4 h-4 text-amber-600" />
                <span>Artículos Guardados para Leer Sin Conexión ({savedArticlesList.length})</span>
              </h4>
              <span className="text-[10px] text-stone-400">Disponibles sin internet</span>
            </div>

            {savedArticlesList.length === 0 ? (
              <div className="text-[11px] text-stone-500 italic py-2">
                No tienes artículos guardados. Pulsa el ícono de marcapáginas en cualquier nota para guardarla en tu dispositivo rural.
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {savedArticlesList.map(art => (
                  <div
                    key={art.id}
                    className="p-2.5 bg-stone-50 dark:bg-stone-800 rounded-lg flex items-center justify-between gap-2 border border-stone-200 dark:border-stone-700"
                  >
                    <div 
                      onClick={() => {
                        onClose();
                        openArticle(art);
                      }}
                      className="cursor-pointer truncate flex-1 hover:underline"
                    >
                      <div className="font-bold text-stone-900 dark:text-stone-100 truncate text-xs">
                        {art.title}
                      </div>
                      <div className="text-[10px] text-stone-500">
                        {art.municipality} • {art.readingTimeMinutes} min
                      </div>
                    </div>

                    <button
                      onClick={() => toggleSaveOffline(art.id)}
                      className="text-stone-400 hover:text-red-600 p-1 cursor-pointer shrink-0"
                      title="Eliminar de guardados"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Preferences */}
          <div className="bg-white dark:bg-stone-850 border border-stone-200 dark:border-stone-800 rounded-xl p-4 space-y-3">
            <h4 className="font-bold text-stone-900 dark:text-stone-100 text-xs">
              Ajustes de Lectura y Conectividad
            </h4>

            <div className="space-y-2">
              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-stone-700 dark:text-stone-300">Modo Ahorro de Datos (Redes 2G/3G de brecha)</span>
                <input
                  type="checkbox"
                  checked={dataSaverMode}
                  onChange={(e) => setDataSaverMode(e.target.checked)}
                  className="rounded text-amber-600 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-stone-700 dark:text-stone-300">Notificaciones push de última hora</span>
                <input
                  type="checkbox"
                  checked={pushEnabled}
                  onChange={togglePushNotifications}
                  className="rounded text-amber-600 w-4 h-4 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-stone-700 dark:text-stone-300">Recordatorio de lectura diario (Edición matutina)</span>
                <input
                  type="checkbox"
                  checked={dailyReminder}
                  onChange={(e) => setDailyReminder(e.target.checked)}
                  className="rounded text-amber-600 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Footer with PDF export */}
        <div className="p-4 bg-stone-100 dark:bg-stone-950 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <button
            onClick={handleExportStats}
            className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition cursor-pointer shadow-xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar Reporte de Lectura en PDF</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 font-bold rounded-lg text-xs cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
