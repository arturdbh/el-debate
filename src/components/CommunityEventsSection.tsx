import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  Ticket, 
  Award, 
  Share2, 
  Check, 
  PlusCircle,
  X
} from 'lucide-react';
import { useNewspaper } from '../context/NewspaperContext';
import { CommunityEvent, RegionMunicipality } from '../types/newspaper';

export const CommunityEventsSection: React.FC = () => {
  const { events, dataSaverMode, setCurrentTab } = useNewspaper();
  const [selectedFilter, setSelectedFilter] = useState<string>('Todos');
  const [savedEventIds, setSavedEventIds] = useState<string[]>([]);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [submittedEventToast, setSubmittedEventToast] = useState(false);

  const categories = ['Todos', 'Jaripeo y Baile', 'Feria Patronal', 'Cultura y Música', 'Torneo Deportivo', 'Tianguis Campesino'];

  const filteredEvents = events.filter(e => {
    if (selectedFilter === 'Todos') return true;
    return e.category === selectedFilter;
  });

  const toggleSaveEvent = (id: string) => {
    setSavedEventIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleShareEvent = (event: CommunityEvent) => {
    const text = encodeURIComponent(
      `🎉 ¡No te pierdas este evento en Tierra Caliente!\n\n*${event.title}*\n📅 Fecha: ${event.date}\n📍 Lugar: ${event.location}\nPatrocinador Oficial: ${event.sponsor}\n\nMás información en El Debate de los Calentanos`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <div className="py-6 space-y-6">
      {/* Hero Header */}
      <div className="bg-linear-to-r from-purple-900 via-indigo-950 to-stone-900 text-white rounded-xl p-6 sm:p-8 shadow-md">
        <div className="max-w-2xl space-y-2">
          <div className="flex items-center gap-2 text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Cartelera Regional Patrocinada</span>
          </div>
          <h2 className="font-headline text-2xl sm:text-3xl font-black">
            Eventos, Ferias y Jaripeos de la Comunidad
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm font-serif leading-relaxed">
            Las fiestas patronales, torneos de la cuenca y espectáculos que dan vida y alegría a Tierra Caliente. Patrocinados por el comercio local comprometido con nuestras familias.
          </p>
        </div>

        <div className="mt-5 flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowAddEventModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Proponer Evento o Patrocinio</span>
          </button>
          <button
            onClick={() => setCurrentTab('suscripciones')}
            className="text-purple-200 hover:text-white underline text-xs cursor-pointer font-medium"
          >
            ¿Quieres ser patrocinador oficial de un evento? Consulta tarifas
          </button>
        </div>
      </div>

      {submittedEventToast && (
        <div className="p-3 bg-purple-50 dark:bg-purple-950/40 border border-purple-300 dark:border-purple-800 rounded-lg text-xs text-purple-900 dark:text-purple-200">
          ✨ Gracias por registrar tu propuesta. La redacción se comunicará para validar el cartel y patrocinador.
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
              selectedFilter === cat
                ? 'bg-purple-800 text-white shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Events Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map(evt => {
          const isSaved = savedEventIds.includes(evt.id);

          return (
            <div
              key={evt.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                {!dataSaverMode && (
                  <div className="relative aspect-16/9 bg-stone-100 dark:bg-stone-800 overflow-hidden">
                    <img
                      src={evt.imageUrl}
                      alt={evt.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-bold px-2 py-0.5 rounded">
                      {evt.category}
                    </div>
                    <div className="absolute top-3 right-3 bg-purple-700 text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {evt.municipality}
                    </div>
                  </div>
                )}

                <div className="p-5 space-y-3">
                  {/* Sponsor highlight badge */}
                  <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-lg p-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{evt.sponsorLogo || '⭐'}</span>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-400">
                          Presentado por:
                        </div>
                        <div className="font-bold text-stone-900 dark:text-stone-100">
                          {evt.sponsor}
                        </div>
                      </div>
                    </div>
                    <Award className="w-4 h-4 text-amber-600" />
                  </div>

                  <h3 className="font-headline text-lg sm:text-xl font-black text-stone-950 dark:text-stone-50 leading-snug">
                    {evt.title}
                  </h3>

                  {/* Date & Time info */}
                  <div className="space-y-1.5 text-xs text-stone-800 dark:text-stone-200">
                    <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-stone-100">
                      <Calendar className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
                      <span>{evt.date} • {evt.time}</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-red-600" />
                      <span>{evt.location}</span>
                    </div>
                    <div className="flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-300">
                      <Ticket className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{evt.ticketInfo}</span>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-serif leading-relaxed line-clamp-3">
                    {evt.description}
                  </p>

                  {/* Benefit */}
                  <div className="text-[11px] text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded border border-emerald-200 dark:border-emerald-800 font-medium">
                    🎯 {evt.highlight}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between mt-3">
                <button
                  onClick={() => toggleSaveEvent(evt.id)}
                  className={`text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition cursor-pointer ${
                    isSaved
                      ? 'bg-purple-100 text-purple-900 dark:bg-purple-950 dark:text-purple-300'
                      : 'bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  <Check className={`w-3.5 h-3.5 ${isSaved ? 'text-purple-600' : 'text-stone-400'}`} />
                  <span>{isSaved ? 'Asistiré / Agendado' : 'Me Interesa Asistir'}</span>
                </button>

                <button
                  onClick={() => handleShareEvent(evt)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Difundir por WhatsApp</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add event modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-stone-900 rounded-xl shadow-2xl w-full max-w-md border border-stone-300 dark:border-stone-800 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
                Registrar Evento Comunitario
              </h3>
              <button onClick={() => setShowAddEventModal(false)} className="cursor-pointer">
                <X className="w-5 h-5 text-stone-400" />
              </button>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-400 font-serif">
              Los eventos comunitarios en El Debate de los Calentanos tienen difusión garantizada a más de 30,000 lectores en los 9 municipios de la región.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Nombre del Evento o Feria</label>
                <input
                  type="text"
                  placeholder="ej. Torneo de Tamboritas / Baile Tradicional"
                  className="w-full bg-stone-50 dark:bg-stone-800 border rounded p-2 text-xs outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Marca Patrocinadora o Negocio Local</label>
                <input
                  type="text"
                  placeholder="ej. Forrajes del Balsas / Quesería San Lucas"
                  className="w-full bg-stone-50 dark:bg-stone-800 border rounded p-2 text-xs outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Fecha</label>
                  <input
                    type="date"
                    className="w-full bg-stone-50 dark:bg-stone-800 border rounded p-2 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Municipio</label>
                  <select className="w-full bg-stone-50 dark:bg-stone-800 border rounded p-2 text-xs outline-none">
                    <option>Cd. Altamirano</option>
                    <option>Coyuca de Catalán</option>
                    <option>Tlapehuala</option>
                    <option>Cutzamala</option>
                    <option>Arcelia</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t">
              <button
                onClick={() => setShowAddEventModal(false)}
                className="px-3 py-1.5 text-stone-500 text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  setShowAddEventModal(false);
                  setSubmittedEventToast(true);
                  setTimeout(() => setSubmittedEventToast(false), 5000);
                }}
                className="bg-purple-700 hover:bg-purple-800 text-white font-bold px-4 py-1.5 rounded text-xs cursor-pointer"
              >
                Enviar a Coordinación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
