import React, { useState } from 'react';
import { 
  Newspaper, 
  MapPin, 
  Tractor, 
  ShoppingBag, 
  Calendar, 
  Music2, 
  PenTool, 
  CreditCard, 
  Search, 
  X,
  BookmarkCheck,
  ChevronDown,
  Bot
} from 'lucide-react';
import { useNewspaper } from '../context/NewspaperContext';
import { RegionMunicipality, ArticleCategory } from '../types/newspaper';

export const Navigation: React.FC = () => {
  const { 
    currentTab, 
    setCurrentTab, 
    selectedMunicipality, 
    setSelectedMunicipality,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery
  } = useNewspaper();

  const [showMuniDropdown, setShowMuniDropdown] = useState(false);

  const municipalities: RegionMunicipality[] = [
    'Todas',
    'Cd. Altamirano (Pungarabato)',
    'Coyuca de Catalán',
    'Cutzamala de Pinzón',
    'Tlapehuala',
    'Arcelia',
    'Ajuchitlán del Progreso',
    'San Miguel Totolapan',
    'Zirándaro de los Chávez'
  ];

  const categories: ArticleCategory[] = [
    'Todas',
    'Última Hora',
    'Región y Municipios',
    'Campo y Ganadería',
    'Cultura y Tradición',
    'Economía y Comercio',
    'Opinión y Debate',
    'Deportes Calentanos'
  ];

  const handleTabClick = (tabKey: string, catFilter?: ArticleCategory) => {
    setCurrentTab(tabKey);
    if (catFilter) {
      setSelectedCategory(catFilter);
    } else if (tabKey === 'portada') {
      setSelectedCategory('Todas');
    }
  };

  return (
    <nav className="border-b border-stone-300 dark:border-stone-800 bg-[#f4f1ea] dark:bg-stone-900 sticky top-0 z-30 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main Tabs Navigation */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            <button
              onClick={() => handleTabClick('portada')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t text-xs sm:text-sm font-bold tracking-tight border-b-2 transition cursor-pointer ${
                currentTab === 'portada' && selectedCategory === 'Todas'
                  ? 'border-amber-700 text-amber-900 dark:text-amber-400 bg-white/60 dark:bg-stone-800'
                  : 'border-transparent text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              <Newspaper className="w-4 h-4 text-amber-700" />
              <span>Portada</span>
            </button>

            {/* Municipios Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowMuniDropdown(!showMuniDropdown)}
                className={`flex items-center gap-1 px-3 py-2 rounded-t text-xs sm:text-sm font-bold tracking-tight border-b-2 transition cursor-pointer ${
                  selectedMunicipality !== 'Todas'
                    ? 'border-amber-700 text-amber-900 dark:text-amber-400 bg-white/60 dark:bg-stone-800'
                    : 'border-transparent text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
                }`}
              >
                <MapPin className="w-4 h-4 text-red-700" />
                <span>{selectedMunicipality === 'Todas' ? 'Municipios' : selectedMunicipality}</span>
                <ChevronDown className="w-3.5 h-3.5 ml-0.5" />
              </button>

              {showMuniDropdown && (
                <div className="absolute left-0 top-full mt-1 w-64 bg-white dark:bg-stone-800 rounded-lg shadow-xl border border-stone-200 dark:border-stone-700 py-2 z-50">
                  <div className="px-3 py-1 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                    Filtrar por Municipio Calentano
                  </div>
                  {municipalities.map(muni => (
                    <button
                      key={muni}
                      onClick={() => {
                        setSelectedMunicipality(muni);
                        setShowMuniDropdown(false);
                        setCurrentTab('portada');
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs transition flex items-center justify-between cursor-pointer ${
                        selectedMunicipality === muni 
                          ? 'bg-amber-100 dark:bg-amber-950/60 font-bold text-amber-900 dark:text-amber-300' 
                          : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700'
                      }`}
                    >
                      <span>{muni}</span>
                      {selectedMunicipality === muni && <span className="text-amber-700 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleTabClick('portada', 'Campo y Ganadería')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t text-xs sm:text-sm font-bold tracking-tight border-b-2 transition cursor-pointer ${
                selectedCategory === 'Campo y Ganadería'
                  ? 'border-amber-700 text-amber-900 dark:text-amber-400 bg-white/60 dark:bg-stone-800'
                  : 'border-transparent text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              <Tractor className="w-4 h-4 text-emerald-700" />
              <span>Campo & Ganadería</span>
            </button>

            <button
              onClick={() => handleTabClick('clasificados')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t text-xs sm:text-sm font-bold tracking-tight border-b-2 transition cursor-pointer ${
                currentTab === 'clasificados'
                  ? 'border-amber-700 text-amber-900 dark:text-amber-400 bg-white/60 dark:bg-stone-800'
                  : 'border-transparent text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4 text-amber-600" />
              <span>Clasificados Rurales</span>
            </button>

            <button
              onClick={() => handleTabClick('eventos')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t text-xs sm:text-sm font-bold tracking-tight border-b-2 transition cursor-pointer ${
                currentTab === 'eventos'
                  ? 'border-amber-700 text-amber-900 dark:text-amber-400 bg-white/60 dark:bg-stone-800'
                  : 'border-transparent text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4 text-purple-700" />
              <span>Eventos & Ferias</span>
            </button>

            <button
              onClick={() => handleTabClick('portada', 'Cultura y Tradición')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t text-xs sm:text-sm font-bold tracking-tight border-b-2 transition cursor-pointer ${
                selectedCategory === 'Cultura y Tradición'
                  ? 'border-amber-700 text-amber-900 dark:text-amber-400 bg-white/60 dark:bg-stone-800'
                  : 'border-transparent text-stone-700 dark:text-stone-300 hover:text-stone-950 dark:hover:text-white'
              }`}
            >
              <Music2 className="w-4 h-4 text-orange-700" />
              <span>Cultura & Sones</span>
            </button>
          </div>

          {/* Quick Search Bar */}
          <div className="relative shrink-0 w-40 sm:w-56 my-1">
            <Search className="w-3.5 h-3.5 text-stone-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar noticias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white dark:bg-stone-800 text-stone-950 dark:text-stone-50 font-medium text-xs pl-8 pr-7 py-1.5 rounded-full border-2 border-stone-300 dark:border-stone-700 focus:outline-none focus:border-amber-600 shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Sub-bar showing active filters */}
        {(selectedMunicipality !== 'Todas' || selectedCategory !== 'Todas' || searchQuery) && (
          <div className="py-1 px-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs text-stone-600 dark:text-stone-400">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-stone-800 dark:text-stone-200">Filtros activos:</span>
              {selectedMunicipality !== 'Todas' && (
                <span className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1">
                  Municipio: {selectedMunicipality}
                  <button onClick={() => setSelectedMunicipality('Todas')} className="hover:text-red-600 cursor-pointer font-bold">×</button>
                </span>
              )}
              {selectedCategory !== 'Todas' && (
                <span className="bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1">
                  Sección: {selectedCategory}
                  <button onClick={() => setSelectedCategory('Todas')} className="hover:text-red-600 cursor-pointer font-bold">×</button>
                </span>
              )}
              {searchQuery && (
                <span className="bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full text-[11px] font-medium flex items-center gap-1">
                  Búsqueda: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-red-600 cursor-pointer font-bold">×</button>
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setSelectedMunicipality('Todas');
                setSelectedCategory('Todas');
                setSearchQuery('');
              }}
              className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline text-[11px] cursor-pointer"
            >
              Restablecer todos
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
