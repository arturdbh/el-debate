import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Megaphone, 
  DollarSign, 
  TrendingUp, 
  Check, 
  Calculator, 
  PhoneCall, 
  FileText, 
  Zap,
  Star
} from 'lucide-react';
import { useNewspaper } from '../context/NewspaperContext';

export const MonetizationSection: React.FC = () => {
  const { isPremium, setIsPremium, setSubscriptionPlan } = useNewspaper();

  // Calculator State for Local Advertisers
  const [selectedReach, setSelectedReach] = useState<'local' | 'regional' | 'toda_la_cuenca'>('regional');
  const [campaignDurationMonths, setCampaignDurationMonths] = useState<number>(3);
  const [includeClassifiedsPack, setIncludeClassifiedsPack] = useState<boolean>(true);
  const [quoteRequested, setQuoteRequested] = useState<boolean>(false);

  // Pricing formula for local advertisers
  const baseMonthly = {
    local: 1200, // 1 municipio (ej. solo Altamirano)
    regional: 2400, // 3 municipios (Pungarabato, Coyuca, Tlapehuala)
    toda_la_cuenca: 4500 // Todos los 9 municipios de Tierra Caliente
  }[selectedReach];

  const totalEstimate = (baseMonthly * campaignDurationMonths) + (includeClassifiedsPack ? 400 * campaignDurationMonths : 0);
  const estimatedImpressions = {
    local: 15000,
    regional: 45000,
    toda_la_cuenca: 110000
  }[selectedReach] * campaignDurationMonths;

  const handleActivatePremium = (planName: 'lector_comunitario' | 'patrocinador') => {
    setIsPremium(true);
    setSubscriptionPlan(planName);
  };

  return (
    <div className="py-6 space-y-10">
      {/* Strategy Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
          Estrategia Comercial Triple Pilar
        </span>
        <h2 className="font-headline text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100">
          Monetización Sustentable para el Periodismo Rural
        </h2>
        <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 font-serif leading-relaxed">
          Un medio independiente en Tierra Caliente debe ser financieramente sólido y cercano a su gente. Combinamos suscripciones comunitarias de lectores fieles, publicidad programática y alianzas con los negocios del campo.
        </p>
      </div>

      {/* 3 Pillars Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-amber-700">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
            1. Suscripciones Premium
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 font-serif leading-relaxed">
            Membresías accesibles ($49 MXN/mes) para familias y migrantes calentanos en EE.UU. que desean apoyar la investigación sin censura y recibir la edición impresa PDF semanal.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-blue-700">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
            2. Publicidad Programática
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 font-serif leading-relaxed">
            Integración de espacios estándar IAB (Leaderboard 728x90, robapáginas y native ads) conectados a redes programáticas que monetizan el alto tráfico de lectores no suscritos.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700">
            <Megaphone className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-base text-stone-900 dark:text-stone-100">
            3. Patrocinios de Marcas Locales
          </h3>
          <p className="text-xs text-stone-600 dark:text-stone-400 font-serif leading-relaxed">
            Paquetes directos para ferreterías, forrajeras, sombrererías y médicos de la región con presencia en portada, clasificados y cobertura de eventos comunitarios patrocinados.
          </p>
        </div>
      </div>

      {/* Interactive Pillar 1: Subscription Plans */}
      <div className="bg-stone-100 dark:bg-stone-850 p-6 sm:p-8 rounded-2xl border border-stone-300 dark:border-stone-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-headline text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span>Planes de Suscripción "Socio Lector Calentano"</span>
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
              Prueba la experiencia interactiva activando tu suscripción:
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">Estado actual:</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              isPremium 
                ? 'bg-amber-600 text-white' 
                : 'bg-stone-300 dark:bg-stone-700 text-stone-800 dark:text-stone-200'
            }`}>
              {isPremium ? 'Membresía Premium ACTIVA' : 'Lector Estándar (Con anuncios)'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Plan 1: Libre */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-xs font-bold text-stone-500 uppercase">Acceso Libre</div>
              <div className="text-2xl font-black text-stone-900 dark:text-stone-100">$0 <span className="text-xs font-normal text-stone-500">/ mes</span></div>
              <p className="text-xs text-stone-600 dark:text-stone-400 font-serif">Ideal para lectura ocasional con soporte de anuncios publicitarios.</p>
              
              <ul className="text-xs space-y-2 text-stone-700 dark:text-stone-300 pt-2 border-t border-stone-100 dark:border-stone-800">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-stone-400" /> Acceso a todas las notas diarias</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-stone-400" /> Anuncios clasificados gratuitos</li>
                <li className="flex items-center gap-1.5 text-stone-400"><Check className="w-3.5 h-3.5" /> Incluye publicidad comercial</li>
              </ul>
            </div>

            <button
              onClick={() => setIsPremium(false)}
              className="mt-5 w-full py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 text-stone-800 dark:text-stone-200 font-bold rounded text-xs transition cursor-pointer"
            >
              Usar Versión Gratuita
            </button>
          </div>

          {/* Plan 2: Socio Comunitario */}
          <div className="bg-linear-to-b from-amber-50 to-white dark:from-stone-900 dark:to-stone-900 p-5 rounded-xl border-2 border-amber-600 shadow-md flex flex-col justify-between relative">
            <div className="absolute -top-3 right-4 bg-amber-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded-full">
              Más Popular
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-amber-700 uppercase">Socio Lector Calentano</div>
              <div className="text-2xl font-black text-amber-900 dark:text-amber-400">$49 <span className="text-xs font-normal text-stone-500">MXN / mes</span></div>
              <p className="text-xs text-stone-600 dark:text-stone-300 font-serif">La mejor experiencia de lectura limpia y apoyo al periodismo local.</p>
              
              <ul className="text-xs space-y-2 text-stone-800 dark:text-stone-200 pt-2 border-t border-amber-100 dark:border-stone-800">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-600" /> <strong>Navegación 100% sin anuncios</strong></li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-600" /> Descarga ilimitada de edición PDF</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-600" /> Insignia "Socio de Honor" en comentarios</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-amber-600" /> Alertas tempranas de clima y campo</li>
              </ul>
            </div>

            <button
              onClick={() => handleActivatePremium('lector_comunitario')}
              className="mt-5 w-full py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded text-xs transition cursor-pointer shadow-xs"
            >
              {isPremium ? 'Plan Activo (Probar)' : 'Activar Membresía ($49/mes)'}
            </button>
          </div>

          {/* Plan 3: Patrocinador Paisano / Anual */}
          <div className="bg-white dark:bg-stone-900 p-5 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="text-xs font-bold text-stone-500 uppercase">Paisano en el Extranjero</div>
              <div className="text-2xl font-black text-stone-900 dark:text-stone-100">$450 <span className="text-xs font-normal text-stone-500">MXN / año</span></div>
              <p className="text-xs text-stone-600 dark:text-stone-400 font-serif">Pensado para nuestros paisanos en EE.UU. que mantienen sus raíces vivas.</p>
              
              <ul className="text-xs space-y-2 text-stone-700 dark:text-stone-300 pt-2 border-t border-stone-100 dark:border-stone-800">
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Todo lo de Socio Lector</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> 1 Anuncio clasificado destacado al mes</li>
                <li className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Mención honorífica anual en edición impresa</li>
              </ul>
            </div>

            <button
              onClick={() => handleActivatePremium('patrocinador')}
              className="mt-5 w-full py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold rounded text-xs transition cursor-pointer"
            >
              Activar Plan Anual Paisano
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Pillar 3: Cotizador para Marcas Locales */}
      <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-2xl border border-stone-200 dark:border-stone-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="font-headline text-2xl font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <span>Cotizador Rápido de Pauta para Negocios Rurales</span>
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
              Calcula en tiempo real la inversión para tu ferretería, forrajera, taller o despacho en Tierra Caliente.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls */}
          <div className="lg:col-span-7 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                Alcance Geográfico Deseado:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedReach('local')}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition ${
                    selectedReach === 'local'
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold'
                      : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-bold">Local</div>
                  <div className="text-[10px] text-stone-500">1 Municipio (ej. Altamirano)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReach('regional')}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition ${
                    selectedReach === 'regional'
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold'
                      : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-bold">Regional</div>
                  <div className="text-[10px] text-stone-500">3 Municipios clave</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReach('toda_la_cuenca')}
                  className={`p-2.5 rounded-lg border text-left cursor-pointer transition ${
                    selectedReach === 'toda_la_cuenca'
                      ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold'
                      : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-bold">Toda la Cuenca</div>
                  <div className="text-[10px] text-stone-500">9 Municipios completos</div>
                </button>
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1.5">
                Duración de Campaña ({campaignDurationMonths} meses):
              </label>
              <input
                type="range"
                min={1}
                max={12}
                value={campaignDurationMonths}
                onChange={(e) => setCampaignDurationMonths(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                <span>1 mes</span>
                <span>3 meses (Recomendado)</span>
                <span>6 meses</span>
                <span>1 año</span>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-medium text-stone-800 dark:text-stone-200">
                <input
                  type="checkbox"
                  checked={includeClassifiedsPack}
                  onChange={(e) => setIncludeClassifiedsPack(e.target.checked)}
                  className="rounded text-amber-600 w-4 h-4"
                />
                <span>Incluir paquete de Anuncios Clasificados Destacados con botón directo a WhatsApp</span>
              </label>
            </div>
          </div>

          {/* Result Card */}
          <div className="lg:col-span-5 bg-stone-900 text-white rounded-xl p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                Propuesta de Inversión Estimada
              </span>
              <div className="text-3xl font-black text-white">
                ${totalEstimate.toLocaleString()} <span className="text-xs font-normal text-stone-400">MXN total</span>
              </div>
              <div className="text-xs text-stone-300 space-y-1">
                <div>• Alcance proyectado: <strong>~{estimatedImpressions.toLocaleString()} impactos</strong> de lectura.</div>
                <div>• Formatos: Banner Leaderboard en portada + mención en nota quincenal.</div>
                <div>• Duración: <strong>{campaignDurationMonths} {campaignDurationMonths === 1 ? 'mes' : 'meses'}</strong>.</div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-800">
              {quoteRequested ? (
                <div className="text-xs bg-emerald-950 border border-emerald-800 text-emerald-300 p-2.5 rounded text-center font-medium">
                  ✓ Solicitud de pauta registrada. Nos comunicaremos hoy mismo al teléfono del negocio.
                </div>
              ) : (
                <button
                  onClick={() => setQuoteRequested(true)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Contactar a Publicidad de El Debate</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
