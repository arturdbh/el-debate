import React from 'react';
import { Megaphone, ExternalLink, Tag, Sparkles, PhoneCall, Image as ImageIcon } from 'lucide-react';
import { useNewspaper } from '../context/NewspaperContext';
import { LocalSponsor } from '../types/newspaper';

interface AdBannerProps {
  type: 'leaderboard' | 'sidebar' | 'in-feed';
  sponsorId?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ type, sponsorId }) => {
  const { sponsors, isPremium, dataSaverMode } = useNewspaper();

  if (isPremium) {
    return (
      <div className="my-3 py-1.5 px-3 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 rounded text-center text-xs text-amber-800 dark:text-amber-400 flex items-center justify-center gap-1.5">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Navegas sin publicidad gracias a tu membresía <strong>Socio Lector Premium</strong>.</span>
      </div>
    );
  }

  const activeSponsors = sponsors.filter(s => s.active !== false);
  if (activeSponsors.length === 0) return null;

  const sponsor: LocalSponsor = 
    (sponsorId ? activeSponsors.find(s => s.id === sponsorId) : null) || 
    activeSponsors.find(s => s.bannerType === type) ||
    activeSponsors[type === 'leaderboard' ? 0 : type === 'sidebar' ? 1 % activeSponsors.length : 2 % activeSponsors.length] || 
    activeSponsors[0];

  if (!sponsor) return null;

  if (type === 'leaderboard') {
    return (
      <div className="my-4 border border-stone-300 dark:border-stone-700 bg-linear-to-r from-amber-50 to-orange-50 dark:from-stone-900 dark:to-stone-900 rounded-lg p-3 sm:p-4 shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            {sponsor.imageUrl && !dataSaverMode ? (
              <img 
                src={sponsor.imageUrl} 
                alt={sponsor.businessName} 
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border border-amber-300 dark:border-stone-700 shrink-0" 
              />
            ) : (
              <div className="bg-amber-700 text-white p-2.5 rounded-lg shrink-0">
                <Megaphone className="w-5 h-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-300 px-1.5 py-0.5 rounded">
                  {sponsor.badge || 'Patrocinador Oficial'}
                </span>
                <span className="text-xs font-semibold text-stone-600 dark:text-stone-300">
                  {sponsor.municipality}
                </span>
              </div>
              <h4 className="text-sm sm:text-base font-bold text-stone-950 dark:text-stone-50 mt-0.5">
                {sponsor.businessName}
              </h4>
              <p className="text-xs text-stone-700 dark:text-stone-300 line-clamp-1">
                {sponsor.tagline}
              </p>
              {sponsor.discountOffer && !dataSaverMode && (
                <div className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-emerald-800 dark:text-emerald-400">
                  <Tag className="w-3 h-3" />
                  <span>{sponsor.discountOffer}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-1 sm:pt-0 border-t sm:border-t-0 border-stone-200 dark:border-stone-800">
            {sponsor.targetUrl && (
              <a
                href={sponsor.targetUrl.startsWith('http') ? sponsor.targetUrl : `https://${sponsor.targetUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 bg-amber-600 hover:bg-amber-700 text-white text-xs px-3 py-1.5 rounded font-medium transition cursor-pointer"
              >
                <span>Ver anuncio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {sponsor.phone && (
              <a
                href={`tel:${sponsor.phone.replace(/[^0-9]/g, '')}`}
                className="flex items-center gap-1 bg-stone-900 hover:bg-stone-800 text-white text-xs px-3 py-1.5 rounded font-medium transition cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                <span>{sponsor.phone}</span>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'sidebar') {
    return (
      <div className="border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 rounded-lg p-4 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between text-[11px] font-bold uppercase text-stone-600 dark:text-stone-400 border-b border-stone-200 dark:border-stone-800 pb-1 mb-2">
          <span>Espacio Patrocinado</span>
          <span className="text-amber-700 dark:text-amber-400 font-black">{sponsor.badge || 'Anuncio'}</span>
        </div>

        {sponsor.imageUrl && !dataSaverMode && (
          <img 
            src={sponsor.imageUrl} 
            alt={sponsor.businessName} 
            className="w-full h-28 rounded-md object-cover mb-2 border border-stone-200 dark:border-stone-800" 
          />
        )}

        <h4 className="font-black text-sm text-stone-950 dark:text-stone-50">{sponsor.businessName}</h4>
        <p className="text-xs text-stone-800 dark:text-stone-200 mt-1 line-clamp-2 font-medium">{sponsor.description || sponsor.tagline}</p>
        
        {sponsor.discountOffer && (
          <div className="mt-2 p-1.5 bg-amber-50 dark:bg-amber-950/40 border border-dashed border-amber-300 dark:border-amber-800 rounded text-[11px] text-amber-900 dark:text-amber-300 font-medium">
            🎁 {sponsor.discountOffer}
          </div>
        )}

        <div className="mt-3 pt-2 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          {sponsor.phone ? (
            <a
              href={`tel:${sponsor.phone.replace(/[^0-9]/g, '')}`}
              className="text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
            >
              <PhoneCall className="w-3 h-3" />
              Llamar: {sponsor.phone}
            </a>
          ) : (
            <span className="text-xs text-stone-500">{sponsor.municipality}</span>
          )}
          {sponsor.targetUrl && (
            <a
              href={sponsor.targetUrl.startsWith('http') ? sponsor.targetUrl : `https://${sponsor.targetUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline font-bold"
            >
              Visitar web
            </a>
          )}
        </div>
      </div>
    );
  }

  // in-feed native style
  return (
    <div className="border border-amber-300 dark:border-amber-900/60 bg-amber-50/70 dark:bg-stone-900 rounded-lg p-3 my-3">
      <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400 mb-1">
        <span className="font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider text-[10px]">
          {sponsor.badge || 'Comercio Local Recomendado'}
        </span>
        <span className="font-medium text-stone-600 dark:text-stone-400">{sponsor.municipality}</span>
      </div>
      <div className="flex items-start gap-3">
        {sponsor.imageUrl && !dataSaverMode && (
          <img 
            src={sponsor.imageUrl} 
            alt={sponsor.businessName} 
            className="w-12 h-12 rounded object-cover border border-amber-200 dark:border-stone-700 shrink-0" 
          />
        )}
        <div className="flex-1">
          <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">{sponsor.businessName}</h4>
          <p className="text-xs text-stone-700 dark:text-stone-300 mt-0.5">{sponsor.tagline}</p>
        </div>
      </div>
      <div className="mt-2 pt-2 border-t border-amber-200/60 dark:border-stone-800 flex items-center justify-between text-xs">
        <span className="text-emerald-700 dark:text-emerald-400 font-semibold">{sponsor.discountOffer}</span>
        {sponsor.phone && (
          <a
            href={`tel:${sponsor.phone.replace(/[^0-9]/g, '')}`}
            className="bg-amber-700 hover:bg-amber-800 text-white px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer"
          >
            Contactar
          </a>
        )}
      </div>
    </div>
  );
};
