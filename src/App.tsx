/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NewspaperProvider, useNewspaper } from './context/NewspaperContext';
import { Header } from './components/Header';
import { BreakingTicker } from './components/BreakingTicker';
import { Navigation } from './components/Navigation';
import { ArticleCard } from './components/ArticleCard';
import { ArticleModal } from './components/ArticleModal';
import { AdBanner } from './components/AdBanner';
import { ClassifiedsSection } from './components/ClassifiedsSection';
import { CommunityEventsSection } from './components/CommunityEventsSection';
import { MonetizationSection } from './components/MonetizationSection';
import { RedactorPanel } from './components/RedactorPanel';
import { EditorialBotSection } from './components/EditorialBotSection';
import { UserProfileModal } from './components/UserProfileModal';
import { PushNotificationModal } from './components/PushNotificationModal';
import { WeatherWidget } from './components/WeatherWidget';
import { AdminPasswordModal } from './components/AdminPasswordModal';
import { 
  Sparkles, 
  MapPin, 
  Tractor, 
  TrendingUp, 
  Bookmark, 
  Share2, 
  HelpCircle, 
  ShieldCheck, 
  PhoneCall, 
  Calendar, 
  Layers, 
  ArrowRight,
  Settings
} from 'lucide-react';

const NewspaperContent: React.FC = () => {
  const { 
    articles, 
    currentTab, 
    setCurrentTab, 
    selectedMunicipality, 
    selectedCategory, 
    searchQuery, 
    recommendedArticles, 
    dataSaverMode, 
    isPremium, 
    offlineArticles, 
    openArticle,
    isAdminAuthenticated,
    setAdminModalOpen,
    siteTexts
  } = useNewspaper();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  // Filter articles for Portada
  const filteredArticles = articles.filter(art => {
    const matchMuni = selectedMunicipality === 'Todas' || art.municipality === selectedMunicipality;
    const matchCat = selectedCategory === 'Todas' || art.category === selectedCategory;
    const matchQuery = !searchQuery || (
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.author.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return matchMuni && matchCat && matchQuery;
  });

  const featuredArticle = filteredArticles.find(a => a.isFeatured) || filteredArticles[0];
  const regularArticles = filteredArticles.filter(a => a.id !== featuredArticle?.id);

  const savedOfflineList = articles.filter(a => offlineArticles.includes(a.id));

  return (
    <div className={`min-h-screen flex flex-col ${dataSaverMode ? 'data-saver' : ''}`}>
      {/* Header with masthead and rural indicators */}
      <Header
        onOpenProfile={() => setShowProfileModal(true)}
        onOpenNotifications={() => setShowNotificationsModal(true)}
      />

      {/* Real-time breaking ticker */}
      <BreakingTicker />

      {/* Main navigation */}
      <Navigation />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full">
        {/* Tab Routing */}
        {(currentTab === 'redactor' || currentTab === 'bot') && <RedactorPanel />}
        {currentTab === 'clasificados' && <ClassifiedsSection />}
        {currentTab === 'eventos' && <CommunityEventsSection />}

        {/* Offline Articles Tab */}
        {currentTab === 'offline' && (
          <div className="py-6 space-y-6">
            <div className="bg-amber-50 dark:bg-stone-900 border border-amber-300 dark:border-stone-800 rounded-xl p-6">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-bold text-xs uppercase mb-1">
                <Bookmark className="w-4 h-4" />
                <span>Edición Guardada Sin Conexión</span>
              </div>
              <h2 className="font-headline text-2xl font-bold text-stone-900 dark:text-stone-100">
                Tus Artículos Disponibles Offline ({savedOfflineList.length})
              </h2>
              <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                Estos artículos están almacenados en la memoria de tu dispositivo para que puedas leerlos cuando estés en el campo o en caminos sin cobertura celular.
              </p>
            </div>

            {savedOfflineList.length === 0 ? (
              <div className="text-center py-12 text-stone-500 text-sm">
                No tienes artículos guardados aún. Vuelve a la portada y toca el ícono de marcapáginas en cualquier nota.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedOfflineList.map(art => (
                  <ArticleCard key={art.id} article={art} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Frontpage / Portada */}
        {currentTab === 'portada' && (
          <div className="space-y-6">
            {/* Top Leaderboard Sponsor Banner */}
            <AdBanner type="leaderboard" />

            {/* Filter active notification if no results */}
            {filteredArticles.length === 0 ? (
              <div className="text-center py-16 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-8 space-y-3">
                <h3 className="font-headline text-xl font-bold text-stone-800 dark:text-stone-200">
                  No se encontraron noticias con los filtros seleccionados
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto">
                  Prueba seleccionando otro municipio o limpiando la barra de búsqueda.
                </p>
              </div>
            ) : (
              <>
                {/* Featured Headline Story */}
                {featuredArticle && (
                  <ArticleCard article={featuredArticle} featured={true} />
                )}

                {/* Personalized Recommendations Bar */}
                {recommendedArticles.length > 0 && (
                  <section className="bg-amber-50/70 dark:bg-stone-900/90 border border-amber-200 dark:border-stone-800 rounded-xl p-4 sm:p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <h3 className="font-headline text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                          Recomendado para ti según tus lecturas
                        </h3>
                      </div>
                      <span className="text-[11px] text-amber-800 dark:text-amber-400 font-semibold">
                        Interés Comunitario
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {recommendedArticles.map((art, idx) => {
                        const affinities = [98, 94, 91, 87];
                        const affinityScore = affinities[idx % affinities.length];

                        return (
                          <div
                            key={art.id}
                            onClick={() => openArticle(art)}
                            className="bg-white dark:bg-stone-850 p-3.5 rounded-xl border-2 border-stone-200 dark:border-stone-700 hover:border-amber-600 transition cursor-pointer flex flex-col justify-between shadow-xs"
                          >
                            <div>
                              <div className="flex items-center justify-between text-[10px] mb-1.5">
                                <span className="font-extrabold text-red-800 dark:text-red-400">
                                  {art.municipality}
                                </span>
                                <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 font-black px-1.5 py-0.2 rounded">
                                  {affinityScore}% afinidad
                                </span>
                              </div>
                              <h4 className="font-bold text-xs sm:text-sm text-stone-950 dark:text-stone-100 line-clamp-2 leading-snug">
                                {art.title}
                              </h4>
                            </div>
                            <div className="mt-2.5 pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-700 dark:text-stone-300 font-medium">
                              <span>{art.readingTimeMinutes} min lectura</span>
                              <span className="text-amber-800 dark:text-amber-400 font-bold flex items-center gap-0.5">
                                Leer <ArrowRight className="w-2.5 h-2.5" />
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </section>
                )}

                {/* News Grid + Sidebar Column */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
                  {/* Main Articles Stream (8 cols) */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="flex items-center justify-between border-b-2 border-stone-800 dark:border-stone-300 pb-1">
                      <h3 className="font-headline text-lg sm:text-xl font-black text-stone-900 dark:text-stone-100 uppercase tracking-tight">
                        Crónicas y Reportes de Tierra Caliente
                      </h3>
                      <span className="text-xs text-stone-500">
                        {filteredArticles.length} noticias disponibles
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {regularArticles.map((art, idx) => (
                        <React.Fragment key={art.id}>
                          <ArticleCard article={art} />
                          {/* Insert in-feed local ad after 2nd regular article */}
                          {idx === 1 && (
                            <div className="sm:col-span-2">
                              <AdBanner type="in-feed" />
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Sidebar (4 cols) */}
                  <div className="lg:col-span-4 space-y-6">
                    {/* Live Weather Widget for Altamirano and Tierra Caliente Farmers */}
                    <WeatherWidget />

                    {/* Sidebar Sponsor Card */}
                    <AdBanner type="sidebar" />

                    {/* Quick Classifieds Teaser */}
                    <div className="bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-400">
                          <Tractor className="w-4 h-4" />
                          <span>Mercado del Campo</span>
                        </div>
                        <button
                          onClick={() => setCurrentTab('clasificados')}
                          className="text-xs text-amber-700 hover:underline font-bold cursor-pointer"
                        >
                          Ver todos →
                        </button>
                      </div>

                      <p className="text-xs text-stone-600 dark:text-stone-400 font-serif">
                        Sementales, tractores, desgranadoras y camionetas ganaderas publicadas directamente por productores de la región.
                      </p>

                      <button
                        onClick={() => setCurrentTab('clasificados')}
                        className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded-lg text-xs cursor-pointer transition text-center"
                      >
                        Explorar Clasificados Rurales
                      </button>
                    </div>

                    {/* Community Events Teaser */}
                    <div className="bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-purple-900 dark:text-purple-300">
                          <Calendar className="w-4 h-4 text-purple-700" />
                          <span>Próximas Fiestas y Ferias</span>
                        </div>
                        <button
                          onClick={() => setCurrentTab('eventos')}
                          className="text-xs text-purple-700 hover:underline font-bold cursor-pointer"
                        >
                          Cartelera →
                        </button>
                      </div>

                      <div className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                        • Jaripeo Ranchero de las Fiestas de San Juan en Altamirano.
                      </div>
                      <div className="text-xs text-stone-700 dark:text-stone-300 font-medium">
                        • Feria Tradicional del Sombrero Calentano en Tlapehuala.
                      </div>

                      <button
                        onClick={() => setCurrentTab('eventos')}
                        className="w-full py-2 bg-purple-700 hover:bg-purple-800 text-white font-bold rounded-lg text-xs cursor-pointer transition"
                      >
                        Ver Eventos Patrocinados
                      </button>
                    </div>

                    {/* Regional Editorial Opinion Box */}
                    <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl p-4 space-y-2">
                      <h4 className="font-headline font-bold text-sm text-stone-900 dark:text-stone-100 border-b pb-1">
                        Voz y Tribuna de Tierra Caliente
                      </h4>
                      <p className="text-xs text-stone-600 dark:text-stone-400 font-serif italic leading-relaxed">
                        "El progreso de nuestros pueblos ribereños no vendrá de promesas lejanas, sino del trabajo honesto de quienes siembran las vegas del Balsas y defienden el honor de nuestra identidad calentana."
                      </p>
                      <div className="text-[11px] font-bold text-stone-500 text-right">
                        — Consejo Editorial Comunitario
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* Reader Modal */}
      <ArticleModal />

      {/* Admin Password Modal */}
      <AdminPasswordModal />

      {/* User Reading Profile Modal */}
      {showProfileModal && (
        <UserProfileModal onClose={() => setShowProfileModal(false)} />
      )}

      {/* Push Notifications Modal */}
      {showNotificationsModal && (
        <PushNotificationModal onClose={() => setShowNotificationsModal(false)} />
      )}

      {/* Historical Newspaper Footer */}
      <footer className="mt-16 border-t-4 border-stone-800 dark:border-stone-700 bg-[#f4f0e6] dark:bg-stone-950 text-stone-800 dark:text-stone-300 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Colophon & Masthead */}
            <div className="md:col-span-2 space-y-3">
              <h2 className="font-masthead text-2xl font-black tracking-tight text-stone-900 dark:text-stone-100">
                {siteTexts.mastheadTitle}
              </h2>
              <p className="text-xs font-serif text-stone-600 dark:text-stone-400 max-w-md leading-relaxed">
                {siteTexts.footerDescription}
              </p>
              <div className="text-xs text-stone-500 pt-1">
                Redacción central: Av. Lázaro Cárdenas, Centro, Cd. Altamirano, Pungarabato, Guerrero, C.P. 40660.
              </div>
            </div>

            {/* Quick Municipalities */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px]">
                Cobertura en la Región
              </h4>
              <ul className="space-y-1 text-stone-600 dark:text-stone-400">
                <li>• Pungarabato (Altamirano)</li>
                <li>• Coyuca de Catalán</li>
                <li>• Tlapehuala</li>
                <li>• Cutzamala de Pinzón</li>
                <li>• Arcelia y la Sierra</li>
                <li>• Ajuchitlán y Totolapan</li>
              </ul>
            </div>

            {/* Commercial & Contact */}
            <div className="space-y-2 text-xs">
              <h4 className="font-bold text-stone-900 dark:text-stone-100 uppercase tracking-wider text-[11px]">
                Publicidad & Redacción
              </h4>
              <p className="text-stone-600 dark:text-stone-400">
                Para avisos de ocasión, desplegados, eventos comunitarios o suscripción premium:
              </p>
              <div className="font-bold text-amber-800 dark:text-amber-400">
                Tel: 767-102-3489 / 767-105-2211
              </div>
              <div className="text-stone-500 text-[11px]">
                contacto@debatecalentano.com
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-stone-300 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-600 dark:text-stone-400 gap-3">
            <div>
              © 2026 El Debate de los Calentanos. Todos los derechos reservados.
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-[11px] flex-wrap">
              <button onClick={() => setShowProfileModal(true)} className="hover:underline cursor-pointer">
                Estadísticas de Lectura
              </button>
              <span>•</span>
              {/* Gear Icon button for Administrator with password adba2026 */}
              <button
                onClick={() => {
                  if (isAdminAuthenticated) {
                    setCurrentTab('redactor');
                  } else {
                    setAdminModalOpen(true);
                  }
                }}
                className="flex items-center gap-1 bg-stone-200 dark:bg-stone-850 hover:bg-amber-100 dark:hover:bg-amber-950/60 text-stone-800 dark:text-stone-200 hover:text-amber-900 dark:hover:text-amber-300 px-2 py-1 rounded-md border border-stone-300 dark:border-stone-700 transition cursor-pointer font-bold shadow-2xs"
                title="Administración Editorial (Clave: adba2026)"
              >
                <Settings className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400 hover:rotate-90 transition-transform duration-300" />
                <span>Administración</span>
              </button>
            </div>
          </div>

          {/* Designed by ADBA 2026 */}
          <div className="mt-4 pt-4 border-t border-stone-300 dark:border-stone-800 text-center text-xs font-semibold text-stone-800 dark:text-stone-200 tracking-wide">
            {siteTexts.footerCredit} &nbsp;&nbsp;&nbsp;&nbsp;{' '}
            <a
              href={siteTexts.footerCreditUrl.startsWith('http') ? siteTexts.footerCreditUrl : `https://${siteTexts.footerCreditUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-800 dark:text-amber-400 hover:underline font-bold"
            >
              {siteTexts.footerCreditUrl.replace(/^https?:\/\//, '')}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <NewspaperProvider>
      <NewspaperContent />
    </NewspaperProvider>
  );
}
