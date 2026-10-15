import React, { useState, useEffect } from 'react';
import { 
  PenTool, 
  Send, 
  Image as ImageIcon, 
  Zap, 
  MapPin, 
  CheckCircle2, 
  FileText, 
  Sparkles,
  Layers,
  Settings,
  ListFilter,
  Trash2,
  Edit3,
  Star,
  Eye,
  ThumbsUp,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  PlusCircle,
  X,
  Bot,
  Megaphone,
  PhoneCall,
  ExternalLink,
  Globe,
  RotateCcw,
  Radio,
  Tag,
  Save,
  Sliders,
  Type
} from 'lucide-react';
import { useNewspaper } from '../context/NewspaperContext';
import { RegionMunicipality, ArticleCategory, Article, LocalSponsor, SiteTexts } from '../types/newspaper';
import { EditorialBotSection } from './EditorialBotSection';

export const RedactorPanel: React.FC = () => {
  const { 
    articles, 
    publishArticle, 
    updateArticle, 
    deleteArticle, 
    toggleFeatureArticle,
    toggleArticleBreaking,
    sponsors,
    addSponsor,
    updateSponsor,
    deleteSponsor,
    toggleSponsorActive,
    siteTexts,
    updateSiteTexts,
    resetSiteTexts,
    triggerBreakingNewsAlert,
    alerts,
    comments,
    deleteComment,
    setCurrentTab,
    openArticle,
    isAdminAuthenticated,
    logoutAdmin,
    setAdminModalOpen
  } = useNewspaper();

  // If not authenticated, require adba2026 password
  if (!isAdminAuthenticated) {
    return (
      <div className="py-16 max-w-lg mx-auto text-center space-y-5 px-4">
        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-950/60 rounded-2xl flex items-center justify-center mx-auto text-amber-700 shadow-sm border border-amber-300 dark:border-amber-800">
          <Settings className="w-8 h-8 animate-spin-slow" />
        </div>
        <div className="space-y-2">
          <h2 className="font-headline text-2xl font-black text-stone-900 dark:text-stone-100">
            Panel de Administración Protegido
          </h2>
          <p className="text-xs text-stone-700 dark:text-stone-300 font-serif leading-relaxed">
            Esta sección está reservada para editores y corresponsales de <em>El Debate de los Calentanos</em>. Para acceder ingrese la clave de administración.
          </p>
        </div>
        <button
          onClick={() => setAdminModalOpen(true)}
          className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-6 py-3 rounded-xl text-xs flex items-center gap-2 mx-auto cursor-pointer transition shadow-md"
        >
          <span>Ingresar Contraseña de Administrador (adba2026)</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  // Admin sub-tabs
  const [adminTab, setAdminTab] = useState<'bot' | 'create' | 'manage' | 'ads' | 'texts' | 'breaking' | 'comments'>('bot');
  
  // Editing state
  const [editingArticleId, setEditingArticleId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [author, setAuthor] = useState('Corresponsal en Pungarabato');
  const [authorRole, setAuthorRole] = useState('Redacción Regional');
  const [municipality, setMunicipality] = useState<RegionMunicipality>('Cd. Altamirano (Pungarabato)');
  const [category, setCategory] = useState<ArticleCategory>('Región y Municipios');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1200&q=80');
  const [imageCaption, setImageCaption] = useState('');
  const [isBreaking, setIsBreaking] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPremiumExclusive, setIsPremiumExclusive] = useState(false);
  const [readingTimeMinutes, setReadingTimeMinutes] = useState(3);
  const [publishedSuccess, setPublishedSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Ads & Sponsors Manager State
  const [adFormOpen, setAdFormOpen] = useState(false);
  const [editingSponsorId, setEditingSponsorId] = useState<string | null>(null);
  const [adBusinessName, setAdBusinessName] = useState('');
  const [adTagline, setAdTagline] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [adCategory, setAdCategory] = useState('Comercio Local');
  const [adMunicipality, setAdMunicipality] = useState('Cd. Altamirano');
  const [adPhone, setAdPhone] = useState('767-102-4500');
  const [adBadge, setAdBadge] = useState('Patrocinador Regional');
  const [adBannerType, setAdBannerType] = useState<'leaderboard' | 'sidebar' | 'in-feed'>('leaderboard');
  const [adDiscountOffer, setAdDiscountOffer] = useState('');
  const [adImageUrl, setAdImageUrl] = useState('');
  const [adTargetUrl, setAdTargetUrl] = useState('');
  const [adActive, setAdActive] = useState(true);

  // Live Site Texts Editor State
  const [liveTexts, setLiveTexts] = useState<SiteTexts>(siteTexts);

  useEffect(() => {
    setLiveTexts(siteTexts);
  }, [siteTexts]);

  // Flash Breaking News Alert State
  const [flashTitle, setFlashTitle] = useState('');
  const [flashBody, setFlashBody] = useState('');
  const [flashArticleId, setFlashArticleId] = useState('');

  // Search/filter in manage tab
  const [manageSearch, setManageSearch] = useState('');

  const municipalities: RegionMunicipality[] = [
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
    'Última Hora',
    'Región y Municipios',
    'Campo y Ganadería',
    'Cultura y Tradición',
    'Economía y Comercio',
    'Opinión y Debate',
    'Deportes Calentanos'
  ];

  const presetImages = [
    { label: 'Ganado & Campo', url: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Río Balsas', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Tradición & Sombrero', url: 'https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Milpa de Maíz', url: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Música & Sones', url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80' },
    { label: 'Comercio Urbano', url: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80' }
  ];

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setContent('');
    setSummary('');
    setImageCaption('');
    setIsBreaking(false);
    setIsFeatured(false);
    setIsPremiumExclusive(false);
    setEditingArticleId(null);
  };

  const handleStartEdit = (art: Article) => {
    setEditingArticleId(art.id);
    setTitle(art.title);
    setSubtitle(art.subtitle || '');
    setContent(art.content);
    setSummary(art.summary || '');
    setAuthor(art.author);
    setAuthorRole(art.authorRole);
    setMunicipality(art.municipality);
    setCategory(art.category);
    setImageUrl(art.imageUrl);
    setImageCaption(art.imageCaption || '');
    setIsBreaking(!!art.isBreaking);
    setIsFeatured(!!art.isFeatured);
    setIsPremiumExclusive(!!art.isPremiumExclusive);
    setReadingTimeMinutes(art.readingTimeMinutes || 3);
    setAdminTab('create');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingArticleId) {
      // Updating existing article
      const existing = articles.find(a => a.id === editingArticleId);
      if (existing) {
        updateArticle({
          ...existing,
          title,
          subtitle: subtitle || title,
          summary: summary || subtitle || title.slice(0, 100),
          content,
          author: author || 'Redacción de El Debate',
          authorRole: authorRole || 'Corresponsal Regional',
          municipality,
          category,
          imageUrl,
          imageCaption: imageCaption || `Cobertura periodística en ${municipality}`,
          isBreaking,
          isFeatured,
          isPremiumExclusive,
          readingTimeMinutes
        });
        setStatusMessage('¡Artículo actualizado correctamente!');
      }
    } else {
      // Publishing new article
      publishArticle({
        title,
        subtitle: subtitle || title,
        summary: summary || subtitle || title.slice(0, 100),
        content,
        author: author || 'Redacción de El Debate',
        authorRole: authorRole || 'Corresponsal Regional',
        municipality,
        category,
        imageUrl,
        imageCaption: imageCaption || `Cobertura periodística en ${municipality}`,
        isBreaking,
        isFeatured,
        isPremiumExclusive,
        readingTimeMinutes,
        tags: [municipality, category, 'Tierra Caliente']
      });
      setStatusMessage('¡Noticia publicada exitosamente en el periódico digital!');
    }

    setPublishedSuccess(true);
    resetForm();

    setTimeout(() => {
      setPublishedSuccess(false);
      setStatusMessage(null);
    }, 3500);
  };

  const handleSmartAutoAssist = () => {
    if (!content.trim() && !title.trim()) {
      setStatusMessage('⚠️ Escribe primero algunas líneas en el cuerpo o título de la nota para que el asistente pueda analizarla.');
      setTimeout(() => setStatusMessage(null), 3500);
      return;
    }

    const textLower = (title + ' ' + content).toLowerCase();

    // 1. Auto-detect municipality
    if (textLower.includes('coyuca')) setMunicipality('Coyuca de Catalán');
    else if (textLower.includes('tlapehuala') || textLower.includes('poli')) setMunicipality('Tlapehuala');
    else if (textLower.includes('cutzamala')) setMunicipality('Cutzamala de Pinzón');
    else if (textLower.includes('arcelia')) setMunicipality('Arcelia');
    else if (textLower.includes('ajuchitlan') || textLower.includes('ajuchitlán')) setMunicipality('Ajuchitlán del Progreso');
    else if (textLower.includes('totolapan') || textLower.includes('san miguel')) setMunicipality('San Miguel Totolapan');
    else if (textLower.includes('zirandaro') || textLower.includes('zirándaro')) setMunicipality('Zirándaro de los Chávez');
    else if (textLower.includes('altamirano') || textLower.includes('pungarabato')) setMunicipality('Cd. Altamirano (Pungarabato)');

    // 2. Auto-detect category
    if (textLower.includes('ganad') || textLower.includes('vaca') || textLower.includes('toro') || textLower.includes('maíz') || textLower.includes('siembra') || textLower.includes('forraje') || textLower.includes('cebu') || textLower.includes('cebú')) {
      setCategory('Campo y Ganadería');
    } else if (textLower.includes('sombrero') || textLower.includes('son ') || textLower.includes('sones') || textLower.includes('violín') || textLower.includes('tamborita') || textLower.includes('tradición') || textLower.includes('uchepo') || textLower.includes('feria')) {
      setCategory('Cultura y Tradición');
    } else if (textLower.includes('comercio') || textLower.includes('mercado') || textLower.includes('precio') || textLower.includes('pesos') || textLower.includes('dólar') || textLower.includes('remesas')) {
      setCategory('Economía y Comercio');
    } else if (textLower.includes('fútbol') || textLower.includes('torneo') || textLower.includes('deporte') || textLower.includes('cancha')) {
      setCategory('Deportes Calentanos');
    } else if (textLower.includes('urgente') || textLower.includes('alerta') || textLower.includes('crecida') || textLower.includes('desfogue') || textLower.includes('precaución')) {
      setCategory('Última Hora');
      setIsBreaking(true);
    }

    // 3. Auto calculate reading time
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    const calcMin = Math.max(1, Math.ceil(wordCount / 140));
    setReadingTimeMinutes(calcMin);

    // 4. Auto subtitle if empty
    if (!subtitle.trim() && content.trim()) {
      const firstSentence = content.split(/[.\n]/)[0];
      if (firstSentence && firstSentence.length > 20) {
        setSubtitle(firstSentence.trim() + '.');
      }
    }

    // 5. Auto summary if empty
    if (!summary.trim() && content.trim()) {
      const sentences = content.split(/[.\n]/).filter(s => s.trim().length > 15);
      const combined = sentences.slice(0, 2).join('. ') + '.';
      setSummary(combined);
    }

    setStatusMessage('✨ Asistente Inteligente aplicado: Municipio, categoría temática, síntesis y tiempo de lectura optimizados.');
    setTimeout(() => {
      setStatusMessage(null);
    }, 4500);
  };

  const handleDeleteArticle = (id: string, titleStr: string) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la nota "${titleStr}"?`)) {
      deleteArticle(id);
      setStatusMessage('Nota eliminada del periódico.');
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  // Advertising Manager Helpers
  const resetAdForm = () => {
    setEditingSponsorId(null);
    setAdBusinessName('');
    setAdTagline('');
    setAdDescription('');
    setAdCategory('Comercio Local');
    setAdMunicipality('Cd. Altamirano');
    setAdPhone('767-102-4500');
    setAdBadge('Patrocinador Regional');
    setAdBannerType('leaderboard');
    setAdDiscountOffer('');
    setAdImageUrl('');
    setAdTargetUrl('');
    setAdActive(true);
  };

  const handleStartEditAd = (sp: LocalSponsor) => {
    setEditingSponsorId(sp.id);
    setAdBusinessName(sp.businessName);
    setAdTagline(sp.tagline);
    setAdDescription(sp.description);
    setAdCategory(sp.category);
    setAdMunicipality(sp.municipality);
    setAdPhone(sp.phone);
    setAdBadge(sp.badge);
    setAdBannerType(sp.bannerType);
    setAdDiscountOffer(sp.discountOffer || '');
    setAdImageUrl(sp.imageUrl || '');
    setAdTargetUrl(sp.targetUrl || '');
    setAdActive(sp.active !== false);
    setAdFormOpen(true);
  };

  const handleSaveAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adBusinessName.trim() || !adTagline.trim()) {
      setStatusMessage('⚠️ Por favor ingresa al menos el Nombre del Negocio y el Slogan del anuncio.');
      setTimeout(() => setStatusMessage(null), 3500);
      return;
    }

    if (editingSponsorId) {
      updateSponsor({
        id: editingSponsorId,
        businessName: adBusinessName.trim(),
        tagline: adTagline.trim(),
        description: adDescription.trim() || adTagline.trim(),
        category: adCategory,
        municipality: adMunicipality,
        phone: adPhone.trim(),
        badge: adBadge.trim() || 'Patrocinador Oficial',
        bannerType: adBannerType,
        discountOffer: adDiscountOffer.trim() || undefined,
        imageUrl: adImageUrl.trim() || undefined,
        targetUrl: adTargetUrl.trim() || undefined,
        active: adActive
      });
      setStatusMessage(`✅ Anuncio de "${adBusinessName}" actualizado correctamente.`);
    } else {
      addSponsor({
        businessName: adBusinessName.trim(),
        tagline: adTagline.trim(),
        description: adDescription.trim() || adTagline.trim(),
        category: adCategory,
        municipality: adMunicipality,
        phone: adPhone.trim(),
        badge: adBadge.trim() || 'Patrocinador Oficial',
        bannerType: adBannerType,
        discountOffer: adDiscountOffer.trim() || undefined,
        imageUrl: adImageUrl.trim() || undefined,
        targetUrl: adTargetUrl.trim() || undefined,
        active: adActive
      });
      setStatusMessage(`🎉 ¡Nuevo anuncio de "${adBusinessName}" publicado exitosamente!`);
    }

    resetAdForm();
    setAdFormOpen(false);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleApplyAdPreset = (type: string) => {
    if (type === 'ferreteria') {
      setAdBusinessName('Ferretería y Aceros El Balsas');
      setAdTagline('Láminas galvanizadas, alambre, varilla y bombas de riego');
      setAdDescription('Envíos a ejidos y ranchos de los 9 municipios de Tierra Caliente sin costo extra.');
      setAdCategory('Ferretería & Campo');
      setAdMunicipality('Cd. Altamirano');
      setAdBadge('Patrocinador Platino');
      setAdDiscountOffer('15% de descuento en tubería y manguera de riego');
      setAdImageUrl('https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&w=800&q=80');
      setAdPhone('767-102-4500');
    } else if (type === 'ganaderia') {
      setAdBusinessName('Veterinaria y Forrajes Don Valente');
      setAdTagline('Sales mineralizadas, vacunas pecuarias y alimentos balanceados');
      setAdDescription('Asesoría técnica y atención de urgencias pecuarias para ganado suizo y cebú.');
      setAdCategory('Salud Pecuaria');
      setAdMunicipality('Coyuca de Catalán');
      setAdBadge('Socio Agropecuario');
      setAdDiscountOffer('Bulto de sal mineralizada al 2x1 en la compra de 5 costales de forraje');
      setAdImageUrl('https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=800&q=80');
      setAdPhone('767-105-2211');
    } else if (type === 'sombreros') {
      setAdBusinessName('Sombrería Tradicional Tlapehualense');
      setAdTagline('El auténtico sombrero calentano fino de 50 vueltas');
      setAdDescription('Artesanía regional cosida a mano. Envíos nacionales e internacionales por paquetería express.');
      setAdCategory('Tradición y Cultura');
      setAdMunicipality('Tlapehuala');
      setAdBadge('Identidad Calentana');
      setAdDiscountOffer('Toquilla personalizada con tu nombre gratis');
      setAdImageUrl('https://images.unsplash.com/photo-1514813482577-478573db7364?auto=format&fit=crop&w=800&q=80');
      setAdPhone('767-113-9000');
    }
  };

  // Live Site Texts Helpers
  const handleSaveLiveTexts = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteTexts(liveTexts);
    setStatusMessage('💾 ¡Textos en vivo de la página actualizados! Los cambios ya están reflejados en todo el periódico.');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const handleResetLiveTexts = () => {
    if (window.confirm('¿Deseas restablecer todos los textos de la página a los valores iniciales predeterminados?')) {
      resetSiteTexts();
      setStatusMessage('↺ Textos de la página restablecidos a sus valores predeterminados.');
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // Flash Breaking Alert Broadcast Helper
  const handleBroadcastFlashAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!flashTitle.trim() || !flashBody.trim()) {
      setStatusMessage('⚠️ Ingresa un título y una síntesis para la alerta de última hora.');
      setTimeout(() => setStatusMessage(null), 3500);
      return;
    }

    triggerBreakingNewsAlert(flashTitle.trim(), flashBody.trim(), flashArticleId || undefined);
    setStatusMessage('🚨 ¡Alerta emitida inmediatamente al Cintillo Rojo de Última Hora!');
    setFlashTitle('');
    setFlashBody('');
    setFlashArticleId('');
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const filteredManageArticles = articles.filter(a => {
    if (!manageSearch) return true;
    const q = manageSearch.toLowerCase();
    return a.title.toLowerCase().includes(q) || a.municipality.toLowerCase().includes(q) || a.category.toLowerCase().includes(q);
  });

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-linear-to-r from-stone-900 via-stone-850 to-amber-950 text-white rounded-xl p-5 sm:p-7 shadow-md border border-stone-800">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Settings className="w-4 h-4" />
              <span>Panel de Administración Editorial & Periodístico</span>
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl font-black text-white">
              Mesa de Redacción y Gestión de Contenido
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 font-serif max-w-2xl">
              Publica notas periodísticas de inmediato, administra el catálogo existente, destaca noticias en la portada y modera los comentarios de los lectores.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <button
              onClick={() => {
                resetForm();
                setAdminTab('create');
              }}
              className="bg-amber-600 hover:bg-amber-500 text-white font-bold px-3.5 py-2 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Redactar Nueva Nota</span>
            </button>

            <button
              onClick={logoutAdmin}
              className="bg-stone-800 hover:bg-red-900/60 text-stone-300 hover:text-white border border-stone-700 px-3 py-2 rounded-lg text-xs font-semibold transition cursor-pointer"
              title="Cerrar sesión y proteger el panel"
            >
              🔒 Bloquear Panel
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="mt-6 pt-3 border-t border-stone-800 flex items-center gap-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setAdminTab('bot')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              adminTab === 'bot'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-yellow-300" />
            <span>Bot de Word (.docx) & Base de Datos</span>
            <span className="bg-amber-400 text-stone-950 text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase">Inteligente</span>
          </button>

          <button
            onClick={() => setAdminTab('ads')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              adminTab === 'ads'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5 text-orange-400" />
            <span>Gestor de Anuncios ({sponsors.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('texts')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              adminTab === 'texts'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Type className="w-3.5 h-3.5 text-blue-300" />
            <span>Textos en Vivo</span>
          </button>

          <button
            onClick={() => setAdminTab('breaking')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              adminTab === 'breaking'
                ? 'bg-red-700 text-white shadow-xs'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-yellow-300" />
            <span>Cintillo de Última Hora</span>
          </button>

          <button
            onClick={() => setAdminTab('create')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              adminTab === 'create'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>{editingArticleId ? 'Modificar Nota' : 'Redactar Nota'}</span>
          </button>

          <button
            onClick={() => setAdminTab('manage')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              adminTab === 'manage'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>Notas ({articles.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('comments')}
            className={`px-3 sm:px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
              adminTab === 'comments'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-300 hover:bg-stone-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Comentarios ({comments.length})</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-400 text-emerald-800 dark:text-emerald-200 p-4 rounded-xl flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="text-xs font-semibold">{statusMessage}</div>
        </div>
      )}

      {/* TAB BOT: EDITORIAL WORD BOT & BASE DE DATOS */}
      {adminTab === 'bot' && (
        <EditorialBotSection />
      )}

      {/* TAB 1: REDACTAR Y PUBLICAR */}
      {adminTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Form Column (8 cols) */}
          <div className="lg:col-span-8">
            <form onSubmit={handleSubmit} className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl p-5 sm:p-7 space-y-5 shadow-xs text-xs">
              <div className="flex items-center justify-between border-b pb-3 border-stone-200 dark:border-stone-800 flex-wrap gap-2">
                <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <PenTool className="w-4 h-4 text-amber-700" />
                  <span>{editingArticleId ? 'Editar Contenido de Nota Existente' : 'Formulario de Redacción Ágil'}</span>
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleSmartAutoAssist}
                    className="bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/60 dark:hover:bg-amber-900 text-amber-900 dark:text-amber-300 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 border border-amber-300 dark:border-amber-800 transition cursor-pointer"
                    title="Analiza el texto y autocompleta municipio, categoría, síntesis y tiempo de lectura"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                    <span>✨ Asistente Inteligente</span>
                  </button>

                  {editingArticleId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="text-stone-500 hover:text-red-600 underline text-xs cursor-pointer"
                    >
                      Cancelar edición
                    </button>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                  Titular Principal (Encabezado) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Arranca la rehabilitación de la red hidráulica en Ciudad Altamirano..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3.5 py-2.5 text-sm font-semibold focus:ring-2 focus:ring-amber-600 outline-none text-stone-900 dark:text-stone-100"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                  Bajada o Subtítulo explicativo
                </label>
                <input
                  type="text"
                  placeholder="ej. Vecinos de las colonias Morelos y Linda Vista contarán con servicio continuo de bombeo del Río Balsas."
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-amber-600 outline-none text-stone-900 dark:text-stone-100"
                />
              </div>

              {/* Geographic and Categorization Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Municipio *
                  </label>
                  <select
                    value={municipality}
                    onChange={(e) => setMunicipality(e.target.value as RegionMunicipality)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-2 text-xs outline-none"
                  >
                    {municipalities.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Sección Temática *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-2 text-xs outline-none"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Tiempo de lectura (min)
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={15}
                    value={readingTimeMinutes}
                    onChange={(e) => setReadingTimeMinutes(Number(e.target.value))}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-2.5 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Author Byline */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Nombre del Periodista / Redactor *
                  </label>
                  <input
                    type="text"
                    required
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-xs outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Cargo o Corresponsalía
                  </label>
                  <input
                    type="text"
                    value={authorRole}
                    onChange={(e) => setAuthorRole(e.target.value)}
                    className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Photographic Presets */}
              <div className="space-y-2">
                <label className="block font-bold text-stone-800 dark:text-stone-200">
                  Fotografía de la Nota (Presets regionales o URL personalizada)
                </label>
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  {presetImages.map(p => (
                    <button
                      type="button"
                      key={p.label}
                      onClick={() => setImageUrl(p.url)}
                      className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold whitespace-nowrap cursor-pointer transition ${
                        imageUrl === p.url 
                          ? 'border-amber-600 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 font-bold'
                          : 'border-stone-200 dark:border-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://..."
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-xs outline-none"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={imageCaption}
                      onChange={(e) => setImageCaption(e.target.value)}
                      placeholder="Pie de foto descriptivo..."
                      className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-2 text-xs outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Short Summary for low-data mode */}
              <div>
                <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                  Síntesis Comunitaria (Resumen rápido para modo ahorro de datos)
                </label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Resumen concreto de los hechos para lectores con baja conectividad..."
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-2.5 text-xs outline-none"
                />
              </div>

              {/* Full Article Content */}
              <div>
                <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                  Cuerpo Completo de la Nota / Reportaje *
                </label>
                <textarea
                  rows={9}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escribe la crónica, declaraciones, testimonios de los habitantes y contexto del acontecimiento..."
                  className="w-full bg-stone-50 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg p-3 text-xs font-serif outline-none leading-relaxed"
                />
              </div>

              {/* Flags */}
              <div className="bg-amber-50 dark:bg-stone-800/80 p-4 rounded-xl border border-amber-200 dark:border-stone-700 space-y-2.5">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-red-700 dark:text-red-400">
                  <input
                    type="checkbox"
                    checked={isBreaking}
                    onChange={(e) => setIsBreaking(e.target.checked)}
                    className="w-4 h-4 rounded text-red-600"
                  />
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    Noticia de ÚLTIMA HORA (Emite alerta push a todos los lectores)
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800 dark:text-stone-200">
                  <input
                    type="checkbox"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600"
                  />
                  <span>Fijar como Noticia Principal en la Cabecera de Portada</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-stone-800 dark:text-stone-200">
                  <input
                    type="checkbox"
                    checked={isPremiumExclusive}
                    onChange={(e) => setIsPremiumExclusive(e.target.checked)}
                    className="w-4 h-4 rounded text-purple-600"
                  />
                  <span>Reportaje Exclusivo para Socios Suscriptores</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-stone-800">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-xs cursor-pointer"
                >
                  Limpiar Formulario
                </button>

                <button
                  type="submit"
                  className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-6 py-2.5 rounded-lg text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>{editingArticleId ? 'Guardar Cambios en la Nota' : 'Publicar Inmediatamente en Portada'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Live Preview Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-stone-100 dark:bg-stone-850 p-3.5 rounded-xl border border-stone-300 dark:border-stone-700">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                Vista Previa en Vivo (Maqueta Portada)
              </span>

              <div className="bg-white dark:bg-stone-900 rounded-lg p-3.5 border border-stone-200 dark:border-stone-800 space-y-2.5">
                <div className="aspect-16/9 bg-stone-200 dark:bg-stone-800 rounded overflow-hidden">
                  <img src={imageUrl} alt="preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-stone-500">
                  <span className="font-bold text-red-700 dark:text-red-400">{municipality}</span>
                  <span>{category}</span>
                </div>
                <h4 className="font-headline font-bold text-sm text-stone-900 dark:text-stone-100 leading-snug">
                  {title || 'Título de la noticia en redacción...'}
                </h4>
                <p className="text-[11px] text-stone-600 dark:text-stone-400 font-serif line-clamp-2">
                  {subtitle || 'Aquí aparecerá la bajada o subtítulo del reportaje...'}
                </p>
                <div className="text-[10px] text-stone-400 pt-2 border-t">
                  Por {author} • {readingTimeMinutes} min de lectura
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 rounded-xl text-xs space-y-1 text-stone-700 dark:text-stone-300">
              <div className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Consejo Editorial Calentano:</span>
              </div>
              <p className="text-[11px] font-serif leading-relaxed">
                Para notas de campo y cosechas, incluye el precio del grano o las afectaciones del temporal para mantener informados a los ejidatarios de los 9 municipios ribereños.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: GESTIONAR NOTAS PUBLICADAS */}
      {adminTab === 'manage' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3 border-stone-200 dark:border-stone-800">
            <div>
              <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
                Catálogo de Noticias Publicadas en el Periódico
              </h3>
              <p className="text-xs text-stone-500">
                Total de {articles.length} artículos en archivo y circulación digital.
              </p>
            </div>

            <input
              type="text"
              placeholder="Buscar por título, municipio o sección..."
              value={manageSearch}
              onChange={(e) => setManageSearch(e.target.value)}
              className="bg-stone-100 dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg px-3 py-1.5 text-xs outline-none w-full sm:w-64"
            />
          </div>

          <div className="space-y-3">
            {filteredManageArticles.map(art => (
              <div
                key={art.id}
                className="p-3.5 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-stone-400 transition"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <img
                    src={art.imageUrl}
                    alt={art.title}
                    className="w-16 h-12 object-cover rounded shrink-0 hidden sm:block"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[10px] font-bold uppercase bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 px-1.5 py-0.2 rounded">
                        {art.municipality}
                      </span>
                      <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-400">
                        {art.category}
                      </span>
                      {art.isFeatured && (
                        <span className="text-[10px] font-bold bg-amber-500 text-stone-950 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-current" /> En Portada
                        </span>
                      )}
                      {art.isBreaking && (
                        <span className="text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.2 rounded">
                          Última Hora
                        </span>
                      )}
                    </div>

                    <h4 
                      onClick={() => openArticle(art)}
                      className="font-bold text-xs sm:text-sm text-stone-900 dark:text-stone-100 truncate hover:underline cursor-pointer"
                    >
                      {art.title}
                    </h4>

                    <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-1">
                      <span>Por: {art.author}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {art.viewsCount} lecturas</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {art.likesCount} me gusta</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-stone-200 dark:border-stone-800">
                  <button
                    onClick={() => toggleFeatureArticle(art.id)}
                    className={`p-1.5 rounded text-xs flex items-center gap-1 font-semibold cursor-pointer transition ${
                      art.isFeatured 
                        ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300' 
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
                    }`}
                    title={art.isFeatured ? 'Quitar de portada' : 'Fijar en cabecera de portada'}
                  >
                    <Star className={`w-3.5 h-3.5 ${art.isFeatured ? 'fill-amber-600 text-amber-600' : ''}`} />
                    <span className="hidden sm:inline">{art.isFeatured ? 'Destacada' : 'Destacar'}</span>
                  </button>

                  <button
                    onClick={() => toggleArticleBreaking(art.id)}
                    className={`p-1.5 rounded text-xs flex items-center gap-1 font-semibold cursor-pointer transition ${
                      art.isBreaking 
                        ? 'bg-red-700 text-white shadow-xs' 
                        : 'bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-300'
                    }`}
                    title={art.isBreaking ? 'Quitar del cintillo rojo de última hora' : 'Subir al cintillo rojo de última hora'}
                  >
                    <Zap className={`w-3.5 h-3.5 ${art.isBreaking ? 'fill-yellow-300 text-yellow-300' : ''}`} />
                    <span className="hidden sm:inline">{art.isBreaking ? 'En Cintillo' : 'Cintillo'}</span>
                  </button>

                  <button
                    onClick={() => handleStartEdit(art)}
                    className="p-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded text-xs flex items-center gap-1 font-semibold cursor-pointer transition"
                    title="Editar nota"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    onClick={() => handleDeleteArticle(art.id, art.title)}
                    className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 rounded text-xs flex items-center gap-1 font-semibold cursor-pointer transition"
                    title="Eliminar nota"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Eliminar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MODERACIÓN DE COMENTARIOS */}
      {adminTab === 'comments' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-xs">
          <div className="border-b pb-3 border-stone-200 dark:border-stone-800">
            <h3 className="font-bold text-sm text-stone-900 dark:text-stone-100">
              Moderación y Gestión de Comentarios Comunitarios
            </h3>
            <p className="text-xs text-stone-500">
              Supervisa las opiniones para asegurar un debate respetuoso entre las familias y comunidades de Tierra Caliente.
            </p>
          </div>

          <div className="space-y-3">
            {comments.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-xs">
                No hay comentarios pendientes de moderación en este momento.
              </div>
            ) : (
              comments.map(c => {
                const relatedArt = articles.find(a => a.id === c.articleId);

                return (
                  <div
                    key={c.id}
                    className="p-3.5 bg-stone-50 dark:bg-stone-850 rounded-xl border border-stone-200 dark:border-stone-800 flex items-start justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900 dark:text-stone-100">{c.authorName}</span>
                        <span className="text-stone-400">({c.authorLocation})</span>
                        <span className="text-[10px] text-stone-400">• {c.timestamp}</span>
                      </div>

                      {relatedArt && (
                        <div className="text-[11px] text-amber-800 dark:text-amber-400 font-semibold">
                          En nota: "{relatedArt.title}"
                        </div>
                      )}

                      <p className="text-stone-700 dark:text-stone-300 font-serif leading-relaxed">
                        "{c.content}"
                      </p>
                    </div>

                    <button
                      onClick={() => deleteComment(c.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded cursor-pointer transition shrink-0"
                      title="Eliminar comentario"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* TAB 4: GESTOR DE ANUNCIOS Y PUBLICIDAD */}
      {adminTab === 'ads' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl p-5 sm:p-6 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-4 border-stone-200 dark:border-stone-800">
            <div>
              <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
                <Megaphone className="w-4 h-4" />
                <span>Gestor Comercial de Pauta & Anuncios</span>
              </div>
              <h3 className="font-headline text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
                ¿Cómo colocar anuncios en la página?
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 max-w-2xl">
                Crea o modifica los anuncios de los comercios locales. Elige el formato: <strong>Banner Superior (Leaderboard)</strong>, <strong>Barra Lateral (Sidebar)</strong> o <strong>Entre Noticias (In-feed)</strong>, con enlaces directos a WhatsApp, teléfonos y fotos.
              </p>
            </div>

            <button
              onClick={() => {
                if (adFormOpen) {
                  resetAdForm();
                  setAdFormOpen(false);
                } else {
                  resetAdForm();
                  setAdFormOpen(true);
                }
              }}
              className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs shrink-0"
            >
              {adFormOpen ? <X className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
              <span>{adFormOpen ? 'Cerrar Formulario' : '+ Colocar Nuevo Anuncio'}</span>
            </button>
          </div>

          {/* Formulario de Alta / Edición de Anuncios */}
          {adFormOpen && (
            <form onSubmit={handleSaveAd} className="bg-stone-50 dark:bg-stone-850 border border-stone-300 dark:border-stone-700 rounded-xl p-4 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b pb-3 border-stone-200 dark:border-stone-700 flex-wrap gap-2">
                <h4 className="font-bold text-sm text-stone-900 dark:text-stone-100 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-amber-600" />
                  <span>{editingSponsorId ? 'Modificar Anuncio Existente' : 'Formulario de Nuevo Anuncio Publicitario'}</span>
                </h4>

                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                  <span className="font-medium">Plantillas rápidas:</span>
                  <button
                    type="button"
                    onClick={() => handleApplyAdPreset('ferreteria')}
                    className="bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-amber-200"
                  >
                    Ferretería
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyAdPreset('ganaderia')}
                    className="bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-emerald-200"
                  >
                    Ganadería
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyAdPreset('sombreros')}
                    className="bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-300 px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer hover:bg-orange-200"
                  >
                    Sombreros
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Nombre del Negocio / Anunciante *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Taller Mecánico Altamirano, Veterinaria El Balsas..."
                    value={adBusinessName}
                    onChange={(e) => setAdBusinessName(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Formato y Ubicación del Anuncio *
                  </label>
                  <select
                    value={adBannerType}
                    onChange={(e) => setAdBannerType(e.target.value as any)}
                    className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600 font-medium"
                  >
                    <option value="leaderboard">Banner Superior Horizontal (Leaderboard - Alta Visibilidad)</option>
                    <option value="sidebar">Columna Lateral (Sidebar - Destacado al lado de notas)</option>
                    <option value="in-feed">Entre Noticias (In-feed - Integrado en la Portada)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Slogan o Frase Principal del Anuncio *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Las mejores bombas de riego sumergibles y refacciones para el campo calentano"
                    value={adTagline}
                    onChange={(e) => setAdTagline(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Descripción o Detalles del Producto/Servicio
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Detalles de horarios, dirección, atención a ranchos y comunidades..."
                    value={adDescription}
                    onChange={(e) => setAdDescription(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Municipio de Ubicación
                  </label>
                  <select
                    value={adMunicipality}
                    onChange={(e) => setAdMunicipality(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600 font-medium"
                  >
                    <option value="Cd. Altamirano">Cd. Altamirano (Pungarabato)</option>
                    <option value="Coyuca de Catalán">Coyuca de Catalán</option>
                    <option value="Tlapehuala">Tlapehuala</option>
                    <option value="Cutzamala de Pinzón">Cutzamala de Pinzón</option>
                    <option value="Arcelia">Arcelia</option>
                    <option value="Ajuchitlán del Progreso">Ajuchitlán del Progreso</option>
                    <option value="San Miguel Totolapan">San Miguel Totolapan</option>
                    <option value="Zirándaro">Zirándaro</option>
                    <option value="Toda la Tierra Caliente">Toda la Tierra Caliente</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Teléfono o WhatsApp de Contacto
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 767-102-4500"
                    value={adPhone}
                    onChange={(e) => setAdPhone(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Oferta Especial o Descuento (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 10% de descuento mencionando que lo viste en El Debate"
                    value={adDiscountOffer}
                    onChange={(e) => setAdDiscountOffer(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Etiqueta / Distintivo del Anuncio
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Patrocinador Oficial, Oferta de Temporada, Comercio Local"
                    value={adBadge}
                    onChange={(e) => setAdBadge(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    URL de Foto o Logo del Anuncio (Opcional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={adImageUrl}
                    onChange={(e) => setAdImageUrl(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Enlace Web o Enlace de WhatsApp Directo (Opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. https://wa.me/527671024500 o https://minegocio.com"
                    value={adTargetUrl}
                    onChange={(e) => setAdTargetUrl(e.target.value)}
                    className="w-full bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="adActiveCheck"
                  checked={adActive}
                  onChange={(e) => setAdActive(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500 cursor-pointer w-4 h-4"
                />
                <label htmlFor="adActiveCheck" className="text-xs font-bold text-stone-800 dark:text-stone-200 cursor-pointer">
                  Anuncio Activo (Mostrar inmediatamente a los lectores)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200 dark:border-stone-700">
                <button
                  type="button"
                  onClick={() => { resetAdForm(); setAdFormOpen(false); }}
                  className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-lg text-xs font-semibold hover:bg-stone-200 dark:hover:bg-stone-800 cursor-pointer text-stone-700 dark:text-stone-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-5 py-2 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingSponsorId ? 'Guardar Cambios del Anuncio' : 'Publicar Anuncio en Vivo'}</span>
                </button>
              </div>
            </form>
          )}

          {/* Listado de Anuncios Existentes con Vista Previa */}
          <div className="space-y-4">
            <h4 className="font-bold text-xs uppercase text-stone-600 dark:text-stone-400 tracking-wider">
              Anuncios Registrados ({sponsors.length})
            </h4>

            <div className="grid grid-cols-1 gap-4">
              {sponsors.map(sp => {
                const isActive = sp.active !== false;

                return (
                  <div
                    key={sp.id}
                    className={`border rounded-xl p-4 transition ${
                      isActive 
                        ? 'border-stone-300 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-850' 
                        : 'border-dashed border-stone-300 dark:border-stone-800 bg-stone-100/40 dark:bg-stone-900/40 opacity-70'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3 border-stone-200 dark:border-stone-800">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-950 text-amber-900 dark:text-amber-300">
                          {sp.bannerType === 'leaderboard' ? 'Banner Superior (Leaderboard)' : sp.bannerType === 'sidebar' ? 'Barra Lateral (Sidebar)' : 'Entre Noticias (In-feed)'}
                        </span>
                        <span className="text-xs font-bold text-stone-500">
                          📍 {sp.municipality}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' 
                            : 'bg-stone-300 text-stone-700 dark:bg-stone-800 dark:text-stone-400'
                        }`}>
                          {isActive ? '● En Vivo' : '○ Pausado'}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleSponsorActive(sp.id)}
                          className="px-2.5 py-1 text-xs font-semibold rounded border border-stone-300 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer"
                        >
                          {isActive ? 'Pausar' : 'Reactivar'}
                        </button>
                        <button
                          onClick={() => handleStartEditAd(sp)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 rounded text-xs flex items-center gap-1 font-semibold cursor-pointer"
                          title="Editar anuncio"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Deseas eliminar el anuncio de "${sp.businessName}"?`)) {
                              deleteSponsor(sp.id);
                              setStatusMessage('Anuncio eliminado.');
                              setTimeout(() => setStatusMessage(null), 3000);
                            }
                          }}
                          className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 rounded text-xs flex items-center gap-1 font-semibold cursor-pointer"
                          title="Eliminar anuncio"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 pt-3">
                      {sp.imageUrl && (
                        <img 
                          src={sp.imageUrl} 
                          alt={sp.businessName} 
                          className="w-16 h-16 rounded-lg object-cover border border-stone-300 dark:border-stone-700 shrink-0" 
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-sm text-stone-950 dark:text-stone-50">
                          {sp.businessName}
                        </h4>
                        <p className="text-xs text-stone-700 dark:text-stone-300 mt-0.5">
                          {sp.tagline}
                        </p>
                        {sp.discountOffer && (
                          <div className="text-[11px] text-emerald-800 dark:text-emerald-400 font-semibold mt-1">
                            🎁 {sp.discountOffer}
                          </div>
                        )}
                        <div className="flex items-center gap-4 text-[11px] text-stone-500 mt-2">
                          {sp.phone && (
                            <span className="flex items-center gap-1">
                              <PhoneCall className="w-3 h-3 text-amber-600" />
                              {sp.phone}
                            </span>
                          )}
                          {sp.targetUrl && (
                            <span className="flex items-center gap-1 truncate max-w-xs">
                              <Globe className="w-3 h-3 text-blue-600" />
                              {sp.targetUrl}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: EDITOR DE TEXTOS EN VIVO */}
      {adminTab === 'texts' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl p-5 sm:p-6 space-y-6 shadow-xs">
          <div className="border-b pb-4 border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
                <Type className="w-4 h-4" />
                <span>Personalización Institucional</span>
              </div>
              <h3 className="font-headline text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
                Editor de Textos en Vivo de la Página
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 max-w-2xl">
                Cambia en vivo los títulos, lemas, dedicatorias y créditos del periódico. Cada ajuste se refleja de forma instantánea en la cabecera, indicadores y pie de página.
              </p>
            </div>

            <button
              onClick={handleResetLiveTexts}
              className="bg-stone-200 hover:bg-stone-300 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restablecer por Defecto</span>
            </button>
          </div>

          <form onSubmit={handleSaveLiveTexts} className="space-y-6 text-xs">
            {/* Cabecera Principal */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-amber-900 dark:text-amber-400 border-b border-amber-200 dark:border-amber-900/60 pb-1 flex items-center gap-1.5">
                <span>1. Cabecera y Nombre del Periódico</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Título Principal de Cabecera (Nombre del Periódico)
                  </label>
                  <input
                    type="text"
                    value={liveTexts.mastheadTitle}
                    onChange={(e) => setLiveTexts({ ...liveTexts, mastheadTitle: e.target.value })}
                    className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2.5 font-masthead text-stone-900 dark:text-stone-100 font-bold outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Subtítulo / Lema de Cabecera
                  </label>
                  <input
                    type="text"
                    value={liveTexts.mastheadSubtitle}
                    onChange={(e) => setLiveTexts({ ...liveTexts, mastheadSubtitle: e.target.value })}
                    className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2.5 font-serif text-stone-900 dark:text-stone-100 font-bold outline-none focus:border-amber-600"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Homenaje y Dedicatoria
                  </label>
                  <input
                    type="text"
                    value={liveTexts.memorialText}
                    onChange={(e) => setLiveTexts({ ...liveTexts, memorialText: e.target.value })}
                    className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2.5 font-memorial italic font-bold text-amber-900 dark:text-amber-300 outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Lema en Barra Superior
                  </label>
                  <input
                    type="text"
                    value={liveTexts.topMotto}
                    onChange={(e) => setLiveTexts({ ...liveTexts, topMotto: e.target.value })}
                    className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Época y Número de Edición
                  </label>
                  <input
                    type="text"
                    value={liveTexts.epochText}
                    onChange={(e) => setLiveTexts({ ...liveTexts, epochText: e.target.value })}
                    className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Datos Regionales */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-amber-900 dark:text-amber-400 border-b border-amber-200 dark:border-amber-900/60 pb-1 flex items-center gap-1.5">
                <span>2. Indicadores y Reportes Regionales</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Ubicación Regional
                  </label>
                  <input
                    type="text"
                    value={liveTexts.locationLabel}
                    onChange={(e) => setLiveTexts({ ...liveTexts, locationLabel: e.target.value })}
                    className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Reporte de Clima
                  </label>
                  <input
                    type="text"
                    value={liveTexts.weatherLabel}
                    onChange={(e) => setLiveTexts({ ...liveTexts, weatherLabel: e.target.value })}
                    className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Nivel del Río Balsas
                  </label>
                  <input
                    type="text"
                    value={liveTexts.balsasRiverLabel}
                    onChange={(e) => setLiveTexts({ ...liveTexts, balsasRiverLabel: e.target.value })}
                    className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600"
                  />
                </div>
              </div>
            </div>

            {/* Pie de Página y Créditos */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-amber-900 dark:text-amber-400 border-b border-amber-200 dark:border-amber-900/60 pb-1 flex items-center gap-1.5">
                <span>3. Pie de Página y Créditos de Diseño</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Descripción Institucional en el Pie
                  </label>
                  <textarea
                    rows={2}
                    value={liveTexts.footerDescription}
                    onChange={(e) => setLiveTexts({ ...liveTexts, footerDescription: e.target.value })}
                    className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Crédito de Diseño al Pie
                  </label>
                  <input
                    type="text"
                    value={liveTexts.footerCredit}
                    onChange={(e) => setLiveTexts({ ...liveTexts, footerCredit: e.target.value })}
                    className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-800 dark:text-stone-200 mb-1">
                    Enlace Web del Diseñador
                  </label>
                  <input
                    type="text"
                    value={liveTexts.footerCreditUrl}
                    onChange={(e) => setLiveTexts({ ...liveTexts, footerCreditUrl: e.target.value })}
                    className="w-full bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-lg p-2 text-stone-900 dark:text-stone-100 outline-none focus:border-amber-600 font-bold text-amber-800 dark:text-amber-400"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-end">
              <button
                type="submit"
                className="bg-amber-700 hover:bg-amber-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs flex items-center gap-2 transition cursor-pointer shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>💾 Guardar Textos en Vivo y Aplicar a Toda la Web</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 6: CINTILLO ROJO DE ÚLTIMA HORA INTELIGENTE */}
      {adminTab === 'breaking' && (
        <div className="bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-800 rounded-xl p-5 sm:p-6 space-y-6 shadow-xs">
          <div className="border-b pb-4 border-stone-200 dark:border-stone-800">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
              <Zap className="w-4 h-4 text-red-600 animate-pulse" />
              <span>Transmisión en Vivo</span>
            </div>
            <h3 className="font-headline text-xl sm:text-2xl font-black text-stone-900 dark:text-stone-100 mt-1">
              Cintillo Inteligente de Última Hora
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 max-w-2xl">
              El cintillo rojo superior informa a todos los lectores al instante. Puedes subir cualquier noticia con 1 solo clic o emitir un boletín urgente flash.
            </p>
          </div>

          {/* Formulario de Boletín Urgente Flash */}
          <form onSubmit={handleBroadcastFlashAlert} className="bg-red-50/70 dark:bg-red-950/30 border border-red-300 dark:border-red-900/60 rounded-xl p-4 sm:p-5 space-y-3">
            <h4 className="font-bold text-xs uppercase text-red-900 dark:text-red-300 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-ping text-red-600" />
              <span>Emitir Alerta Flash Inmediata al Cintillo</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  placeholder="Título Urgente (ej. ALERTA VIAL: Creciente preventiva en vado de Cutzamala)"
                  value={flashTitle}
                  onChange={(e) => setFlashTitle(e.target.value)}
                  className="w-full bg-white dark:bg-stone-900 border border-red-300 dark:border-red-800 rounded-lg p-2 font-bold text-stone-900 dark:text-stone-100 outline-none focus:border-red-600"
                />
              </div>

              <div className="sm:col-span-2">
                <textarea
                  rows={2}
                  required
                  placeholder="Síntesis de la alerta urgente para que se desplace por el cintillo rojo..."
                  value={flashBody}
                  onChange={(e) => setFlashBody(e.target.value)}
                  className="w-full bg-white dark:bg-stone-900 border border-red-300 dark:border-red-800 rounded-lg p-2 text-stone-900 dark:text-stone-100 outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 dark:text-stone-300 mb-1">
                  Vincular a noticia completa (opcional):
                </label>
                <select
                  value={flashArticleId}
                  onChange={(e) => setFlashArticleId(e.target.value)}
                  className="w-full bg-white dark:bg-stone-900 border border-red-300 dark:border-red-800 rounded-lg p-1.5 text-stone-900 dark:text-stone-100 outline-none text-xs"
                >
                  <option value="">-- Sin enlace a nota --</option>
                  {articles.map(a => (
                    <option key={a.id} value={a.id}>
                      {a.title.slice(0, 50)}...
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end justify-end">
                <button
                  type="submit"
                  className="bg-red-700 hover:bg-red-800 text-white font-bold px-4 py-2 rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow-md w-full sm:w-auto justify-center"
                >
                  <Zap className="w-3.5 h-3.5 text-yellow-300" />
                  <span>Subir Alerta al Cintillo Rojo</span>
                </button>
              </div>
            </div>
          </form>

          {/* Lista de Noticias y su estado en el cintillo */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase text-stone-600 dark:text-stone-400 tracking-wider">
              Control de Noticias en el Cintillo ({articles.filter(a => a.isBreaking).length} activas actualmente)
            </h4>

            <div className="space-y-2">
              {articles.map(art => {
                const isCurrentlyBreaking = !!art.isBreaking;

                return (
                  <div
                    key={art.id}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs transition ${
                      isCurrentlyBreaking
                        ? 'bg-red-50/90 dark:bg-red-950/40 border-red-400 dark:border-red-800'
                        : 'bg-stone-50 dark:bg-stone-850 border-stone-200 dark:border-stone-800'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold bg-stone-200 dark:bg-stone-700 px-1.5 py-0.2 rounded">
                          {art.municipality}
                        </span>
                        {isCurrentlyBreaking && (
                          <span className="text-[10px] font-black bg-red-700 text-white px-2 py-0.2 rounded flex items-center gap-1 animate-pulse">
                            <Radio className="w-2.5 h-2.5 text-yellow-300" />
                            <span>EN CINTILLO ROJO</span>
                          </span>
                        )}
                      </div>
                      <h5 className="font-bold text-stone-900 dark:text-stone-100 truncate">
                        {art.title}
                      </h5>
                    </div>

                    <button
                      onClick={() => toggleArticleBreaking(art.id)}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition shrink-0 flex items-center gap-1.5 ${
                        isCurrentlyBreaking
                          ? 'bg-stone-800 hover:bg-stone-900 text-stone-200'
                          : 'bg-red-700 hover:bg-red-800 text-white shadow-xs'
                      }`}
                    >
                      <Zap className={`w-3.5 h-3.5 ${isCurrentlyBreaking ? 'text-stone-400' : 'text-yellow-300'}`} />
                      <span>{isCurrentlyBreaking ? 'Quitar del Cintillo' : 'Subir al Cintillo Rojo'}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
