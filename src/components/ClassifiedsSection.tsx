import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Phone, 
  MessageCircle, 
  PlusCircle, 
  MapPin, 
  Filter, 
  Tag, 
  CheckCircle2, 
  Tractor, 
  Sparkles,
  X
} from 'lucide-react';
import { useNewspaper } from '../context/NewspaperContext';
import { ClassifiedAd, RegionMunicipality } from '../types/newspaper';

export const ClassifiedsSection: React.FC = () => {
  const { 
    classifieds, 
    publishClassified, 
    dataSaverMode, 
    selectedMunicipality 
  } = useNewspaper();

  const [categoryFilter, setCategoryFilter] = useState<string>('Todas');
  const [localMuniFilter, setLocalMuniFilter] = useState<RegionMunicipality>(selectedMunicipality);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ClassifiedAd['category']>('Ganado y Animales');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [municipality, setMunicipality] = useState<RegionMunicipality>('Cd. Altamirano (Pungarabato)');
  const [sellerName, setSellerName] = useState('');
  const [sellerPhone, setSellerPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [condition, setCondition] = useState<'Nuevo' | 'Usado en buen estado' | 'Criollo de registro'>('Usado en buen estado');

  const categories = [
    'Todas',
    'Ganado y Animales',
    'Maquinaria y Aperos',
    'Semillas y Cosechas',
    'Vehículos y Fletes',
    'Servicios Rurales',
    'Terrenos y Parcelas'
  ];

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

  const filteredClassifieds = classifieds.filter(item => {
    const matchCategory = categoryFilter === 'Todas' || item.category === categoryFilter;
    const matchMuni = localMuniFilter === 'Todas' || item.municipality === localMuniFilter;
    return matchCategory && matchMuni;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !sellerPhone) return;

    publishClassified({
      title,
      category,
      description,
      price: price || 'A convenir',
      municipality,
      sellerName: sellerName || 'Productor Calentano',
      sellerPhone,
      whatsapp: whatsapp || sellerPhone.replace(/[^0-9]/g, ''),
      imageUrl: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=80',
      isFeatured: false,
      condition
    });

    setShowPublishModal(false);
    setSuccessMessage(true);
    setTimeout(() => setSuccessMessage(false), 5000);

    // Reset
    setTitle('');
    setDescription('');
    setPrice('');
    setSellerPhone('');
    setSellerName('');
  };

  const handleWhatsAppClick = (ad: ClassifiedAd) => {
    const cleanPhone = ad.whatsapp.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(
      `Hola ${ad.sellerName}, vi su anuncio de "${ad.title}" en El Debate de los Calentanos. ¿Sigue disponible? Me interesa información.`
    );
    window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank');
  };

  return (
    <div className="py-6 space-y-6">
      {/* Classifieds Hero Banner */}
      <div className="bg-linear-to-r from-amber-800 to-stone-900 text-white rounded-xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
              <ShoppingBag className="w-4 h-4" />
              <span>Mercado Agropecuario & Servicios Rurales</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl font-black">
              Clasificados del Balsas y Tierra Caliente
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm font-serif leading-relaxed">
              Conectamos de forma directa a ganaderos, agricultores, talleres mecánicos y comerciantes de nuestros 9 municipios. Sin comisiones abusivas ni intermediarios.
            </p>
          </div>

          <button
            onClick={() => setShowPublishModal(true)}
            className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black px-5 py-3 rounded-lg text-sm flex items-center gap-2 shadow-lg transition cursor-pointer shrink-0"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Publicar Anuncio Gratis</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 text-emerald-800 dark:text-emerald-200 p-4 rounded-lg flex items-center gap-2 text-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>¡Tu anuncio clasificado ha sido publicado exitosamente en la plataforma de Tierra Caliente!</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-4 rounded-lg shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap cursor-pointer transition ${
                categoryFilter === cat
                  ? 'bg-amber-700 text-white'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Municipality Selector */}
        <div className="flex items-center gap-2 text-xs">
          <MapPin className="w-4 h-4 text-stone-400" />
          <span className="font-semibold text-stone-600 dark:text-stone-300">Municipio:</span>
          <select
            value={localMuniFilter}
            onChange={(e) => setLocalMuniFilter(e.target.value as RegionMunicipality)}
            className="bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 rounded px-2 py-1 border border-stone-300 dark:border-stone-700 text-xs focus:outline-none"
          >
            {municipalities.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Classifieds Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClassifieds.map(ad => (
          <div
            key={ad.id}
            className={`bg-white dark:bg-stone-900 border rounded-xl overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between ${
              ad.isFeatured 
                ? 'border-amber-400 dark:border-amber-700 ring-1 ring-amber-400/40' 
                : 'border-stone-200 dark:border-stone-800'
            }`}
          >
            <div>
              {/* Image banner */}
              {!dataSaverMode && (
                <div className="relative aspect-16/10 bg-stone-100 dark:bg-stone-800 overflow-hidden">
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {ad.category}
                  </div>
                  {ad.condition && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-stone-950 text-[10px] font-black px-2 py-0.5 rounded shadow-xs">
                      {ad.condition}
                    </div>
                  )}
                </div>
              )}

              <div className="p-4 space-y-2">
                {/* Location & Date */}
                <div className="flex items-center justify-between text-xs text-stone-700 dark:text-stone-300 font-semibold">
                  <span className="flex items-center gap-1 font-bold text-amber-900 dark:text-amber-400">
                    <MapPin className="w-3.5 h-3.5" />
                    {ad.municipality}
                  </span>
                  <span>{ad.createdAt}</span>
                </div>

                {/* Price */}
                <div className="text-xl font-black text-emerald-800 dark:text-emerald-300">
                  {ad.price}
                </div>

                {/* Title */}
                <h3 className="font-bold text-stone-950 dark:text-stone-50 text-base leading-snug line-clamp-2">
                  {ad.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 font-serif line-clamp-3 leading-relaxed">
                  {ad.description}
                </p>

                {/* Seller info */}
                <div className="pt-2 text-xs text-stone-700 dark:text-stone-300 border-t border-stone-200 dark:border-stone-800 font-medium">
                  Vendedor: <strong className="text-stone-950 dark:text-stone-100 font-bold">{ad.sellerName}</strong>
                </div>
              </div>
            </div>

            {/* Direct Contact Buttons */}
            <div className="p-4 pt-0 grid grid-cols-2 gap-2">
              <a
                href={`tel:${ad.sellerPhone.replace(/[^0-9]/g, '')}`}
                className="bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition"
              >
                <Phone className="w-3.5 h-3.5 text-stone-600 dark:text-stone-400" />
                <span>Llamar</span>
              </a>

              <button
                onClick={() => handleWhatsAppClick(ad)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Publish Ad */}
      {showPublishModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
          <div className="bg-white dark:bg-stone-900 rounded-xl shadow-2xl w-full max-w-lg border border-stone-300 dark:border-stone-800 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-stone-900 text-white px-5 py-3 flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-400" />
                Publicar Anuncio Clasificado Rural
              </h3>
              <button onClick={() => setShowPublishModal(false)} className="cursor-pointer hover:text-red-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Título del producto, ganado o servicio *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Toro semental Suizo de 2 años / Rastra de 18 discos"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-3 py-2 text-xs focus:ring-1 focus:ring-amber-600 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                    Rubro *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ClassifiedAd['category'])}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2 py-2 text-xs outline-none"
                  >
                    <option value="Ganado y Animales">Ganado y Animales</option>
                    <option value="Maquinaria y Aperos">Maquinaria y Aperos</option>
                    <option value="Semillas y Cosechas">Semillas y Cosechas</option>
                    <option value="Vehículos y Fletes">Vehículos y Fletes</option>
                    <option value="Servicios Rurales">Servicios Rurales</option>
                    <option value="Terrenos y Parcelas">Terrenos y Parcelas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                    Condición
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as any)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2 py-2 text-xs outline-none"
                  >
                    <option value="Usado en buen estado">Usado en buen estado</option>
                    <option value="Nuevo">Nuevo</option>
                    <option value="Criollo de registro">Criollo de registro</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                    Precio estimado (MXN)
                  </label>
                  <input
                    type="text"
                    placeholder="ej. $35,000 MXN o A tratar"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-3 py-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                    Municipio *
                  </label>
                  <select
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value as RegionMunicipality)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-2 py-2 text-xs outline-none"
                  >
                    {municipalities.filter(m => m !== 'Todas').map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                  Descripción completa *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detalles de salud, horas de trabajo, rendimiento, entrega en corral o parcela..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded p-2 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                    Nombre del vendedor *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Don Valente Salgado"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-3 py-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-stone-700 dark:text-stone-300">
                    Teléfono celular *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="ej. 767-123-4567"
                    value={sellerPhone}
                    onChange={(e) => setSellerPhone(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="px-3 py-2 text-stone-600 dark:text-stone-400 hover:bg-stone-100 rounded text-xs cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded text-xs transition cursor-pointer"
                >
                  Publicar en Clasificados
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
