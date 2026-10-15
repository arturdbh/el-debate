import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  ThumbsUp, 
  ThumbsDown, 
  Volume2, 
  VolumeX, 
  Send, 
  MapPin, 
  Clock, 
  Eye, 
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { useNewspaper } from '../context/NewspaperContext';
import { exportArticleToPDF } from '../utils/pdfExport';
import { Article } from '../types/newspaper';

export const ArticleModal: React.FC = () => {
  const { 
    selectedArticle, 
    closeArticle, 
    toggleSaveOffline, 
    isOfflineArticle, 
    userReactions, 
    reactToArticle,
    getArticleComments,
    addComment,
    articles,
    openArticle,
    isPremium,
    dataSaverMode,
    fontSize
  } = useNewspaper();

  const [commentName, setCommentName] = useState('');
  const [commentLocation, setCommentLocation] = useState('');
  const [commentContent, setCommentContent] = useState('');
  const [commentSubmittedNotice, setCommentSubmittedNotice] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [localFontSize, setLocalFontSize] = useState<'md' | 'lg' | 'xl'>(
    fontSize === 'sm' ? 'md' : fontSize === 'xl' ? 'xl' : 'lg'
  );

  if (!selectedArticle) return null;

  const isSaved = isOfflineArticle(selectedArticle.id);
  const currentReaction = userReactions[selectedArticle.id];
  const articleComments = getArticleComments(selectedArticle.id);

  // Recommendations: articles in same category or municipality, excluding this one
  const relatedArticles = articles
    .filter(a => a.id !== selectedArticle.id && (a.category === selectedArticle.category || a.municipality === selectedArticle.municipality))
    .slice(0, 3);

  const handleDownloadPDF = () => {
    exportArticleToPDF(selectedArticle);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*${selectedArticle.title}*\n\n${selectedArticle.subtitle}\n\nLeído en El Debate de los Calentanos (Cd. Altamirano, Gro.):\n${window.location.href}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    addComment(
      selectedArticle.id,
      commentName || 'Lector de Tierra Caliente',
      commentLocation || 'Ciudad Altamirano',
      commentContent
    );

    setCommentContent('');
    setCommentSubmittedNotice(true);
    setTimeout(() => setCommentSubmittedNotice(false), 4000);
  };

  const toggleSpeech = () => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const textToRead = `${selectedArticle.title}. ${selectedArticle.subtitle}. ${selectedArticle.content}`;
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'es-MX';
        utterance.rate = 0.95;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
      }
    }
  };

  const fontClasses = {
    md: 'text-base sm:text-lg leading-relaxed',
    lg: 'text-lg sm:text-xl leading-relaxed',
    xl: 'text-xl sm:text-2xl leading-loose',
  }[localFontSize];

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-center overflow-y-auto p-2 sm:p-4">
      <div className="relative bg-[#fcfaf7] dark:bg-stone-900 text-stone-900 dark:text-stone-100 w-full max-w-4xl rounded-xl shadow-2xl my-auto border border-stone-300 dark:border-stone-800 flex flex-col max-h-[92vh] overflow-hidden">
        
        {/* Top Sticky Toolbar */}
        <div className="border-b border-stone-300 dark:border-stone-800 bg-[#f4f0e6] dark:bg-stone-950 px-4 py-2.5 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-masthead font-bold text-xs sm:text-sm tracking-wide text-amber-900 dark:text-amber-400">
              EL DEBATE DE LOS CALENTANOS
            </span>
            <span className="text-stone-400">•</span>
            <span className="text-xs text-stone-600 dark:text-stone-400 font-medium">
              {selectedArticle.municipality}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Audio Reader */}
            <button
              onClick={toggleSpeech}
              className={`p-1.5 rounded cursor-pointer text-xs font-medium flex items-center gap-1 ${
                isSpeaking ? 'bg-amber-600 text-white' : 'hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
              title="Escuchar narración del artículo"
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSpeaking ? 'Pausar' : 'Escuchar'}</span>
            </button>

            {/* Font Adjuster inside Reader */}
            <div className="hidden sm:flex items-center bg-stone-200 dark:bg-stone-800 rounded px-1">
              <button
                onClick={() => setLocalFontSize('md')}
                className={`px-1.5 py-0.5 text-xs font-bold ${localFontSize === 'md' ? 'text-amber-700 dark:text-amber-400' : 'text-stone-500'}`}
              >
                A
              </button>
              <button
                onClick={() => setLocalFontSize('lg')}
                className={`px-1.5 py-0.5 text-sm font-bold ${localFontSize === 'lg' ? 'text-amber-700 dark:text-amber-400' : 'text-stone-500'}`}
              >
                A+
              </button>
              <button
                onClick={() => setLocalFontSize('xl')}
                className={`px-1.5 py-0.5 text-base font-bold ${localFontSize === 'xl' ? 'text-amber-700 dark:text-amber-400' : 'text-stone-500'}`}
              >
                A++
              </button>
            </div>

            {/* Export PDF */}
            <button
              onClick={handleDownloadPDF}
              className="p-1.5 rounded hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 cursor-pointer flex items-center gap-1 text-xs font-medium"
              title="Descargar versión impresa en PDF"
            >
              <Download className="w-4 h-4 text-amber-700 dark:text-amber-400" />
              <span className="hidden sm:inline">PDF</span>
            </button>

            {/* WhatsApp Share */}
            <button
              onClick={handleShareWhatsApp}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded cursor-pointer text-xs flex items-center gap-1 font-medium transition"
              title="Compartir por WhatsApp"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>

            {/* Save Offline */}
            <button
              onClick={() => toggleSaveOffline(selectedArticle.id)}
              className={`p-1.5 rounded cursor-pointer ${
                isSaved ? 'text-amber-700 dark:text-amber-400 bg-amber-100 dark:bg-amber-950/60' : 'hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300'
              }`}
              title="Guardar para leer sin conexión"
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={closeArticle}
              className="p-1.5 rounded hover:bg-red-100 hover:text-red-700 dark:hover:bg-stone-800 text-stone-600 dark:text-stone-300 cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Reader Body */}
        <div className="overflow-y-auto p-4 sm:p-8 space-y-6">
          {/* Article Header */}
          <div className="border-b border-stone-300 dark:border-stone-800 pb-5">
            <div className="flex items-center gap-2 text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider mb-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>{selectedArticle.municipality}</span>
              <span>•</span>
              <span className="text-stone-600 dark:text-stone-400">{selectedArticle.category}</span>
            </div>

            <h1 className="font-headline text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 dark:text-stone-100 leading-tight">
              {selectedArticle.title}
            </h1>

            <p className="mt-3 font-serif text-stone-700 dark:text-stone-300 text-base sm:text-lg italic leading-relaxed">
              {selectedArticle.subtitle}
            </p>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400 border-t border-stone-200 dark:border-stone-800 pt-3">
              <div>
                Por <strong className="text-stone-900 dark:text-stone-100">{selectedArticle.author}</strong> ({selectedArticle.authorRole})
              </div>
              <div className="flex items-center gap-4">
                <span>{selectedArticle.publishedAt}</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" />
                  {selectedArticle.viewsCount} lecturas
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedArticle.readingTimeMinutes} min
                </span>
              </div>
            </div>
          </div>

          {/* Featured Image (or lightweight indicator in Data Saver) */}
          {!dataSaverMode ? (
            <div className="rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-800">
              <img
                src={selectedArticle.imageUrl}
                alt={selectedArticle.title}
                className="w-full max-h-[460px] object-cover"
              />
              {selectedArticle.imageCaption && (
                <div className="p-2.5 bg-stone-100 dark:bg-stone-850 text-xs italic text-stone-600 dark:text-stone-400 border-t border-stone-200 dark:border-stone-800">
                  📷 {selectedArticle.imageCaption}
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded text-xs text-amber-900 dark:text-amber-300 flex items-center justify-between">
              <span>🖼️ Imagen omitida para ahorrar datos móviles (Modo Ahorro 2G/3G activo).</span>
            </div>
          )}

          {/* Quick Summary Pill Box & Smart AI Breakdown */}
          <div className="p-4 bg-amber-50 dark:bg-stone-850 border-2 border-amber-300 dark:border-amber-700/60 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-900 dark:text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                <span>Síntesis Inteligente para el Campo y la Comunidad</span>
              </div>
              <span className="text-[11px] font-bold bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-full">
                Análisis Inteligente
              </span>
            </div>

            <p className="text-sm font-serif text-stone-900 dark:text-stone-100 leading-relaxed font-medium">
              {selectedArticle.summary}
            </p>

            {/* Smart 3-Point Breakdown */}
            <div className="pt-2 border-t border-amber-200 dark:border-stone-700 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="bg-white dark:bg-stone-800 p-2.5 rounded-lg border border-amber-100 dark:border-stone-700">
                <div className="font-black text-amber-900 dark:text-amber-400 text-[11px] mb-0.5">
                  📌 ¿Qué Ocurrió?
                </div>
                <div className="text-stone-800 dark:text-stone-200 font-serif leading-snug">
                  Hecho registrado en {selectedArticle.municipality} sobre {selectedArticle.category.toLowerCase()}.
                </div>
              </div>

              <div className="bg-white dark:bg-stone-800 p-2.5 rounded-lg border border-amber-100 dark:border-stone-700">
                <div className="font-black text-emerald-900 dark:text-emerald-400 text-[11px] mb-0.5">
                  👥 ¿A Quién Impacta?
                </div>
                <div className="text-stone-800 dark:text-stone-200 font-serif leading-snug">
                  Familias, productores y comerciantes de la cuenca de Tierra Caliente.
                </div>
              </div>

              <div className="bg-white dark:bg-stone-800 p-2.5 rounded-lg border border-amber-100 dark:border-stone-700">
                <div className="font-black text-blue-900 dark:text-blue-400 text-[11px] mb-0.5">
                  💡 Acción Recomendada
                </div>
                <div className="text-stone-800 dark:text-stone-200 font-serif leading-snug">
                  Mantenerse informado por los canales comunitarios de El Debate.
                </div>
              </div>
            </div>
          </div>

          {/* Full Article Body */}
          <div className={`font-serif-body text-stone-900 dark:text-stone-100 space-y-4 font-normal ${fontClasses}`}>
            {selectedArticle.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Reactions and Community Feedback */}
          <div className="border-t border-b border-stone-300 dark:border-stone-800 py-4 my-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-stone-600 dark:text-stone-400">¿Qué opinas de esta noticia?</span>
              <button
                onClick={() => reactToArticle(selectedArticle.id, 'like')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                  currentReaction === 'like'
                    ? 'bg-amber-700 text-white border-amber-700'
                    : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Me gusta ({selectedArticle.likesCount})</span>
              </button>

              <button
                onClick={() => reactToArticle(selectedArticle.id, 'dislike')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                  currentReaction === 'dislike'
                    ? 'bg-red-700 text-white border-red-700'
                    : 'border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>No me gusta ({selectedArticle.dislikesCount})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-1.5 text-xs font-semibold bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 px-3 py-1.5 rounded cursor-pointer text-stone-800 dark:text-stone-200"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Exportar a PDF</span>
              </button>
            </div>
          </div>

          {/* Moderated Community Debate & Comments */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-headline text-lg sm:text-xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                <span>Debate Comunitario ({articleComments.length})</span>
              </h3>
              <span className="text-xs text-stone-500">Moderación vecinal activa</span>
            </div>

            {/* Comment Submission Form */}
            <form onSubmit={handleCommentSubmit} className="bg-stone-100 dark:bg-stone-800/60 p-4 rounded-lg border border-stone-200 dark:border-stone-700 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Tu nombre (ej. Don Heriberto Salgado)"
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs px-3 py-2 rounded border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
                <input
                  type="text"
                  placeholder="Comunidad o Municipio (ej. Altamirano / Coyuca)"
                  value={commentLocation}
                  onChange={(e) => setCommentLocation(e.target.value)}
                  className="bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs px-3 py-2 rounded border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-600"
                />
              </div>

              <textarea
                rows={3}
                placeholder="Escribe tu opinión respetuosa para enriquecer el debate regional..."
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                required
                className="w-full bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 text-xs p-3 rounded border border-stone-300 dark:border-stone-700 focus:outline-none focus:ring-1 focus:ring-amber-600"
              />

              <div className="flex items-center justify-between">
                <div className="text-[11px] text-stone-500">
                  {isPremium && (
                    <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Tu comentario lucirá con insignia de Socio de Honor
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold px-4 py-2 rounded flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar Comentario</span>
                </button>
              </div>

              {commentSubmittedNotice && (
                <div className="text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2 rounded flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Comentario enviado correctamente y publicado en el debate.</span>
                </div>
              )}
            </form>

            {/* Comments List */}
            <div className="space-y-3 pt-2">
              {articleComments.length === 0 ? (
                <p className="text-xs text-stone-500 italic text-center py-4">
                  Sé el primero en iniciar el debate sobre este tema regional.
                </p>
              ) : (
                articleComments.map(c => (
                  <div key={c.id} className="p-3.5 bg-white dark:bg-stone-850 rounded-lg border border-stone-200 dark:border-stone-800">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 dark:text-stone-100">{c.authorName}</span>
                        {c.isPremiumSubscriber && (
                          <span className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3 text-amber-600" />
                            Socio de Honor
                          </span>
                        )}
                        <span className="text-stone-400">•</span>
                        <span className="text-stone-500 text-[11px]">{c.authorLocation}</span>
                      </div>
                      <span className="text-[11px] text-stone-400">{c.timestamp}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                      {c.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Personalized Recommendations Section */}
          {relatedArticles.length > 0 && (
            <div className="pt-6 border-t border-stone-300 dark:border-stone-800">
              <h3 className="font-headline text-lg font-bold text-stone-900 dark:text-stone-100 mb-3">
                Otras noticias de interés en Tierra Caliente
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {relatedArticles.map(rel => (
                  <div
                    key={rel.id}
                    onClick={() => openArticle(rel)}
                    className="p-3 bg-stone-100 dark:bg-stone-800/60 rounded-lg border border-stone-200 dark:border-stone-700 hover:border-amber-600 transition cursor-pointer"
                  >
                    <div className="text-[11px] text-red-700 dark:text-red-400 font-bold mb-1">
                      {rel.municipality}
                    </div>
                    <h5 className="font-bold text-xs text-stone-900 dark:text-stone-100 line-clamp-2">
                      {rel.title}
                    </h5>
                    <div className="mt-2 text-[10px] text-stone-400 flex items-center justify-between">
                      <span>{rel.readingTimeMinutes} min de lectura</span>
                      <span className="text-amber-700 dark:text-amber-400 font-medium">Leer →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
