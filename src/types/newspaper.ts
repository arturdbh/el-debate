export type RegionMunicipality = 
  | 'Todas'
  | 'Cd. Altamirano (Pungarabato)'
  | 'Coyuca de Catalán'
  | 'Cutzamala de Pinzón'
  | 'Tlapehuala'
  | 'Arcelia'
  | 'Ajuchitlán del Progreso'
  | 'San Miguel Totolapan'
  | 'Zirándaro de los Chávez';

export type ArticleCategory = 
  | 'Todas'
  | 'Última Hora'
  | 'Región y Municipios'
  | 'Campo y Ganadería'
  | 'Cultura y Tradición'
  | 'Economía y Comercio'
  | 'Opinión y Debate'
  | 'Deportes Calentanos';

export interface Comment {
  id: string;
  articleId: string;
  authorName: string;
  authorLocation: string;
  isPremiumSubscriber?: boolean;
  content: string;
  timestamp: string;
  status: 'approved' | 'pending';
  likes: number;
}

export interface Article {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  summary: string;
  author: string;
  authorRole: string;
  municipality: RegionMunicipality;
  category: ArticleCategory;
  imageUrl: string;
  imageCaption: string;
  publishedAt: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
  isPremiumExclusive?: boolean;
  viewsCount: number;
  likesCount: number;
  dislikesCount: number;
  readingTimeMinutes: number;
  tags: string[];
}

export interface ClassifiedAd {
  id: string;
  title: string;
  category: 'Ganado y Animales' | 'Maquinaria y Aperos' | 'Semillas y Cosechas' | 'Vehículos y Fletes' | 'Servicios Rurales' | 'Terrenos y Parcelas';
  description: string;
  price: string;
  municipality: RegionMunicipality;
  sellerName: string;
  sellerPhone: string;
  whatsapp: string;
  imageUrl: string;
  createdAt: string;
  isFeatured: boolean;
  condition?: 'Nuevo' | 'Usado en buen estado' | 'Criollo de registro';
}

export interface CommunityEvent {
  id: string;
  title: string;
  sponsor: string;
  sponsorLogo?: string;
  description: string;
  date: string;
  time: string;
  location: string;
  municipality: RegionMunicipality;
  category: 'Feria Patronal' | 'Expo Ganadera' | 'Jaripeo y Baile' | 'Cultura y Música' | 'Torneo Deportivo' | 'Tianguis Campesino';
  imageUrl: string;
  ticketInfo: string;
  highlight: string;
}

export interface LocalSponsor {
  id: string;
  businessName: string;
  tagline: string;
  description: string;
  category: string;
  municipality: string;
  phone: string;
  badge: string;
  bannerType: 'leaderboard' | 'sidebar' | 'in-feed';
  discountOffer?: string;
  imageUrl?: string;
  targetUrl?: string;
  active?: boolean;
}

export interface SiteTexts {
  mastheadTitle: string;
  mastheadSubtitle: string;
  memorialText: string;
  topMotto: string;
  epochText: string;
  indicatorsLabel: string;
  locationLabel: string;
  weatherLabel: string;
  balsasRiverLabel: string;
  footerDescription: string;
  footerCredit: string;
  footerCreditUrl: string;
}

export interface ReadingStats {
  articlesRead: string[]; // article IDs
  favoriteCategories: Record<string, number>;
  totalMinutesRead: number;
  readingStreakDays: number;
  lastReadDate: string;
}

export interface PushAlert {
  id: string;
  title: string;
  body: string;
  category: string;
  timestamp: string;
  urgent: boolean;
  articleId?: string;
}

export interface DailyEdition {
  id: string;
  dateStr: string;
  editionNumber: number;
  headlineArticleTitle: string;
  articlesCount: number;
  articles: Article[];
  createdAt: string;
  sourceDocName?: string;
}

export interface ParsedWordArticle {
  tempId: string;
  title: string;
  subtitle: string;
  content: string;
  summary: string;
  author: string;
  authorRole: string;
  municipality: RegionMunicipality;
  category: ArticleCategory;
  imageUrl?: string;
  imageCaption?: string;
  isFeatured: boolean; // Nota principal del día
  isBreaking?: boolean;
  readingTimeMinutes: number;
  detectedClues: string[];
}

