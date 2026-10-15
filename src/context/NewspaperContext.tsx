import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Article, 
  ClassifiedAd, 
  CommunityEvent, 
  LocalSponsor, 
  PushAlert, 
  Comment, 
  ReadingStats, 
  RegionMunicipality, 
  ArticleCategory,
  DailyEdition,
  ParsedWordArticle,
  SiteTexts
} from '../types/newspaper';
import { 
  INITIAL_ARTICLES, 
  INITIAL_CLASSIFIEDS, 
  INITIAL_EVENTS, 
  LOCAL_SPONSORS, 
  INITIAL_ALERTS, 
  INITIAL_COMMENTS 
} from '../data/mockData';

interface NewspaperContextType {
  articles: Article[];
  classifieds: ClassifiedAd[];
  events: CommunityEvent[];
  sponsors: LocalSponsor[];
  alerts: PushAlert[];
  comments: Comment[];
  
  // Offline & Data Saver
  offlineArticles: string[]; // IDs
  isOfflineArticle: (id: string) => boolean;
  toggleSaveOffline: (id: string) => void;
  dataSaverMode: boolean;
  setDataSaverMode: (val: boolean) => void;
  isOnline: boolean;

  // Preferences & Accessibility
  themeMode: 'light' | 'dark';
  setThemeMode: (mode: 'light' | 'dark') => void;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  setFontSize: (size: 'sm' | 'md' | 'lg' | 'xl') => void;

  // Navigation & Filtering
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedMunicipality: RegionMunicipality;
  setSelectedMunicipality: (muni: RegionMunicipality) => void;
  selectedCategory: ArticleCategory;
  setSelectedCategory: (cat: ArticleCategory) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Active Article Reading Modal
  selectedArticle: Article | null;
  openArticle: (article: Article) => void;
  closeArticle: () => void;

  // Reactions & Views
  userReactions: Record<string, 'like' | 'dislike'>;
  reactToArticle: (articleId: string, reaction: 'like' | 'dislike') => void;
  
  // Comments
  addComment: (articleId: string, authorName: string, authorLocation: string, content: string) => void;
  getArticleComments: (articleId: string) => Comment[];
  
  // Editorial publishing & management
  publishArticle: (newArticle: Omit<Article, 'id' | 'viewsCount' | 'likesCount' | 'dislikesCount' | 'publishedAt'>) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
  toggleFeatureArticle: (id: string) => void;
  toggleArticleBreaking: (id: string) => void;
  deleteComment: (id: string) => void;
  publishClassified: (newAd: Omit<ClassifiedAd, 'id' | 'createdAt'>) => void;

  // Sponsors & Advertising Manager
  addSponsor: (newSponsor: Omit<LocalSponsor, 'id'>) => void;
  updateSponsor: (sponsor: LocalSponsor) => void;
  deleteSponsor: (id: string) => void;
  toggleSponsorActive: (id: string) => void;

  // Live Site Texts Editor
  siteTexts: SiteTexts;
  updateSiteTexts: (partial: Partial<SiteTexts>) => void;
  resetSiteTexts: () => void;

  // Stats & Recommendations
  readingStats: ReadingStats;
  recommendedArticles: Article[];
  
  // Monetization & Premium
  isPremium: boolean;
  setIsPremium: (val: boolean) => void;
  subscriptionPlan: 'free' | 'lector_comunitario' | 'patrocinador';
  setSubscriptionPlan: (plan: 'free' | 'lector_comunitario' | 'patrocinador') => void;

  // Push Notifications
  pushEnabled: boolean;
  togglePushNotifications: () => void;
  unreadAlertsCount: number;
  markAlertsAsRead: () => void;
  triggerBreakingNewsAlert: (title: string, body: string, articleId?: string) => void;

  // Admin Authentication
  isAdminAuthenticated: boolean;
  verifyAdminPassword: (password: string) => boolean;
  logoutAdmin: () => void;
  adminModalOpen: boolean;
  setAdminModalOpen: (val: boolean) => void;

  // Daily Editions Database & Editorial Bot Batch Import
  dailyEditions: DailyEdition[];
  publishBatchArticles: (parsedList: ParsedWordArticle[], sourceDocName?: string) => { publishedCount: number; headlineTitle: string };
  loadEdition: (editionId: string) => void;
  createDailyEditionBackup: (sourceDocName?: string) => DailyEdition;
}

export const DEFAULT_SITE_TEXTS: SiteTexts = {
  mastheadTitle: 'EL DEBATE DE LOS CALENTANOS',
  mastheadSubtitle: 'El Diario de Tierra Caliente',
  memorialText: 'En memoria de Juan Cuevas Román',
  topMotto: '"Por la voz y la dignidad de los pueblos de Tierra Caliente"',
  epochText: 'Época II • Año XXVIII • Núm. 10,482',
  indicatorsLabel: 'INDICADORES RURALES:',
  locationLabel: 'Cd. Altamirano, Tierra Caliente, Gro.',
  weatherLabel: '38°C Caluroso',
  balsasRiverLabel: 'Río Balsas: Nivel Estable',
  footerDescription: 'El Debate de los Calentanos es el medio informativo con más tradición en la cuenca del Río Balsas, cubriendo los 9 municipios de Guerrero y Michoacán con periodismo veraz y cercano a la gente.',
  footerCredit: 'Diseñado por: ADBA 2026',
  footerCreditUrl: 'https://www.adbadiseno.com'
};

const NewspaperContext = createContext<NewspaperContextType | undefined>(undefined);

export const NewspaperProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Articles state with localStorage fallback
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem('debate_calentano_articles');
      return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
    } catch {
      return INITIAL_ARTICLES;
    }
  });

  // Daily editions persistent database
  const [dailyEditions, setDailyEditions] = useState<DailyEdition[]>(() => {
    try {
      const saved = localStorage.getItem('debate_daily_editions_db');
      if (saved) return JSON.parse(saved);
      // Seed default initial edition
      return [{
        id: 'edicion-2026-10-10',
        dateStr: '10 de Octubre de 2026',
        editionNumber: 10482,
        headlineArticleTitle: 'Comienza la histórica Expo Ganadera de San Lucas y Altamirano con récord de expositores',
        articlesCount: INITIAL_ARTICLES.length,
        articles: INITIAL_ARTICLES,
        createdAt: new Date().toISOString(),
        sourceDocName: 'Edición Fundacional Digital'
      }];
    } catch {
      return [];
    }
  });

  const [classifieds, setClassifieds] = useState<ClassifiedAd[]>(() => {
    try {
      const saved = localStorage.getItem('debate_calentano_classifieds');
      return saved ? JSON.parse(saved) : INITIAL_CLASSIFIEDS;
    } catch {
      return INITIAL_CLASSIFIEDS;
    }
  });

  const [events] = useState<CommunityEvent[]>(INITIAL_EVENTS);
  const [sponsors, setSponsors] = useState<LocalSponsor[]>(() => {
    try {
      const saved = localStorage.getItem('debate_calentano_sponsors');
      return saved ? JSON.parse(saved) : LOCAL_SPONSORS;
    } catch {
      return LOCAL_SPONSORS;
    }
  });

  const [siteTexts, setSiteTexts] = useState<SiteTexts>(() => {
    try {
      const saved = localStorage.getItem('debate_site_texts');
      return saved ? { ...DEFAULT_SITE_TEXTS, ...JSON.parse(saved) } : DEFAULT_SITE_TEXTS;
    } catch {
      return DEFAULT_SITE_TEXTS;
    }
  });
  const [alerts, setAlerts] = useState<PushAlert[]>(INITIAL_ALERTS);
  const [comments, setComments] = useState<Comment[]>(() => {
    try {
      const saved = localStorage.getItem('debate_calentano_comments');
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  // Offline Articles
  const [offlineArticles, setOfflineArticles] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('debate_calentano_offline_articles');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Data saver mode
  const [dataSaverMode, setDataSaverMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('debate_calentano_datasaver');
      return saved ? JSON.parse(saved) : false;
    } catch {
      return false;
    }
  });

  // Network status detection
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Theme & Accessibility
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('debate_calentano_theme');
      return (saved as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');

  // Navigation & Filtering
  const [currentTab, setCurrentTab] = useState<string>('portada');
  const [selectedMunicipality, setSelectedMunicipality] = useState<RegionMunicipality>('Todas');
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory>('Todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active Reading Modal
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // User Reactions
  const [userReactions, setUserReactions] = useState<Record<string, 'like' | 'dislike'>>(() => {
    try {
      const saved = localStorage.getItem('debate_calentano_reactions');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Reading Stats
  const [readingStats, setReadingStats] = useState<ReadingStats>(() => {
    try {
      const saved = localStorage.getItem('debate_calentano_stats');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn(e);
    }
    return {
      articlesRead: [],
      favoriteCategories: {},
      totalMinutesRead: 0,
      readingStreakDays: 3,
      lastReadDate: new Date().toISOString().split('T')[0]
    };
  });

  // Monetization / Premium status
  const [isPremium, setIsPremium] = useState<boolean>(() => {
    try {
      return localStorage.getItem('debate_calentano_is_premium') === 'true';
    } catch {
      return false;
    }
  });

  const [subscriptionPlan, setSubscriptionPlan] = useState<'free' | 'lector_comunitario' | 'patrocinador'>('free');

  // Admin Authentication with password adba2026
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('debate_admin_auth') === 'true';
    } catch {
      return false;
    }
  });
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);

  const verifyAdminPassword = (password: string) => {
    if (password.trim() === 'adba2026') {
      setIsAdminAuthenticated(true);
      try {
        sessionStorage.setItem('debate_admin_auth', 'true');
      } catch (e) {
        console.warn(e);
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    try {
      sessionStorage.removeItem('debate_admin_auth');
    } catch (e) {
      console.warn(e);
    }
    if (currentTab === 'redactor') {
      setCurrentTab('portada');
    }
  };

  // Push notifications
  const [pushEnabled, setPushEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('debate_calentano_push_enabled') === 'true';
    } catch {
      return true;
    }
  });
  const [unreadAlertsCount, setUnreadAlertsCount] = useState<number>(2);

  // Persist articles
  useEffect(() => {
    try {
      localStorage.setItem('debate_calentano_articles', JSON.stringify(articles));
    } catch (e) {
      console.warn(e);
    }
  }, [articles]);

  // Persist classifieds
  useEffect(() => {
    try {
      localStorage.setItem('debate_calentano_classifieds', JSON.stringify(classifieds));
    } catch (e) {
      console.warn(e);
    }
  }, [classifieds]);

  // Persist daily editions database
  useEffect(() => {
    try {
      localStorage.setItem('debate_daily_editions_db', JSON.stringify(dailyEditions));
    } catch (e) {
      console.warn(e);
    }
  }, [dailyEditions]);

  // Persist sponsors
  useEffect(() => {
    try {
      localStorage.setItem('debate_calentano_sponsors', JSON.stringify(sponsors));
    } catch (e) {
      console.warn(e);
    }
  }, [sponsors]);

  // Persist siteTexts
  useEffect(() => {
    try {
      localStorage.setItem('debate_site_texts', JSON.stringify(siteTexts));
    } catch (e) {
      console.warn(e);
    }
  }, [siteTexts]);

  // Persist offline articles
  useEffect(() => {
    try {
      localStorage.setItem('debate_calentano_offline_articles', JSON.stringify(offlineArticles));
    } catch (e) {
      console.warn(e);
    }
  }, [offlineArticles]);

  // Persist datasaver
  useEffect(() => {
    try {
      localStorage.setItem('debate_calentano_datasaver', JSON.stringify(dataSaverMode));
    } catch (e) {
      console.warn(e);
    }
  }, [dataSaverMode]);

  // Persist reactions
  useEffect(() => {
    try {
      localStorage.setItem('debate_calentano_reactions', JSON.stringify(userReactions));
    } catch (e) {
      console.warn(e);
    }
  }, [userReactions]);

  // Persist comments
  useEffect(() => {
    try {
      localStorage.setItem('debate_calentano_comments', JSON.stringify(comments));
    } catch (e) {
      console.warn(e);
    }
  }, [comments]);

  // Persist stats
  useEffect(() => {
    try {
      localStorage.setItem('debate_calentano_stats', JSON.stringify(readingStats));
    } catch (e) {
      console.warn(e);
    }
  }, [readingStats]);

  // Persist premium
  useEffect(() => {
    try {
      localStorage.setItem('debate_calentano_is_premium', String(isPremium));
    } catch (e) {
      console.warn(e);
    }
  }, [isPremium]);

  // Dark Mode effect
  useEffect(() => {
    try {
      localStorage.setItem('debate_calentano_theme', themeMode);
    } catch (e) {
      console.warn(e);
    }

    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [themeMode]);

  const isOfflineArticle = (id: string) => offlineArticles.includes(id);

  const toggleSaveOffline = (id: string) => {
    setOfflineArticles(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const openArticle = (article: Article) => {
    setSelectedArticle(article);

    // Increment intelligent view counter
    setArticles(prev => prev.map(a => {
      if (a.id === article.id) {
        return { ...a, viewsCount: a.viewsCount + 1 };
      }
      return a;
    }));

    // Update reading stats
    setReadingStats(prev => {
      const alreadyRead = prev.articlesRead.includes(article.id);
      const newArticlesRead = alreadyRead ? prev.articlesRead : [...prev.articlesRead, article.id];
      const currentCatCount = prev.favoriteCategories[article.category] || 0;
      const today = new Date().toISOString().split('T')[0];

      return {
        ...prev,
        articlesRead: newArticlesRead,
        totalMinutesRead: prev.totalMinutesRead + (alreadyRead ? 1 : article.readingTimeMinutes),
        favoriteCategories: {
          ...prev.favoriteCategories,
          [article.category]: currentCatCount + 1
        },
        lastReadDate: today
      };
    });
  };

  const closeArticle = () => {
    setSelectedArticle(null);
  };

  const reactToArticle = (articleId: string, reaction: 'like' | 'dislike') => {
    const prevReaction = userReactions[articleId];

    setUserReactions(prev => {
      if (prev[articleId] === reaction) {
        const next = { ...prev };
        delete next[articleId];
        return next;
      }
      return { ...prev, [articleId]: reaction };
    });

    setArticles(prev => prev.map(a => {
      if (a.id !== articleId) return a;
      let newLikes = a.likesCount;
      let newDislikes = a.dislikesCount;

      if (prevReaction === reaction) {
        // Toggle off
        if (reaction === 'like') newLikes = Math.max(0, newLikes - 1);
        if (reaction === 'dislike') newDislikes = Math.max(0, newDislikes - 1);
      } else if (prevReaction) {
        // Switching reaction
        if (reaction === 'like') {
          newLikes += 1;
          newDislikes = Math.max(0, newDislikes - 1);
        } else {
          newDislikes += 1;
          newLikes = Math.max(0, newLikes - 1);
        }
      } else {
        // Fresh reaction
        if (reaction === 'like') newLikes += 1;
        if (reaction === 'dislike') newDislikes += 1;
      }

      return { ...a, likesCount: newLikes, dislikesCount: newDislikes };
    }));
  };

  const addComment = (articleId: string, authorName: string, authorLocation: string, content: string) => {
    const newComment: Comment = {
      id: `c-${Date.now()}`,
      articleId,
      authorName: authorName.trim() || 'Lector Comunitario',
      authorLocation: authorLocation.trim() || 'Tierra Caliente',
      isPremiumSubscriber: isPremium,
      content: content.trim(),
      timestamp: 'Justo ahora',
      status: 'approved', // Moderation filter
      likes: 0
    };

    setComments(prev => [newComment, ...prev]);
  };

  const getArticleComments = (articleId: string) => {
    return comments.filter(c => c.articleId === articleId);
  };

  const publishArticle = (newArtData: Omit<Article, 'id' | 'viewsCount' | 'likesCount' | 'dislikesCount' | 'publishedAt'>) => {
    const newArt: Article = {
      ...newArtData,
      id: `art-${Date.now()}`,
      viewsCount: 1,
      likesCount: 0,
      dislikesCount: 0,
      publishedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setArticles(prev => [newArt, ...prev]);

    // If marked as breaking, trigger push alert automatically
    if (newArt.isBreaking) {
      triggerBreakingNewsAlert(
        `🚨 ÚLTIMA HORA: ${newArt.title}`,
        newArt.summary || newArt.subtitle,
        newArt.id
      );
    }
  };

  const updateArticle = (updatedArt: Article) => {
    setArticles(prev => prev.map(a => a.id === updatedArt.id ? updatedArt : a));
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const toggleFeatureArticle = (id: string) => {
    setArticles(prev => prev.map(a => a.id === id ? { ...a, isFeatured: !a.isFeatured } : a));
  };

  const toggleArticleBreaking = (id: string) => {
    setArticles(prev => {
      return prev.map(a => {
        if (a.id === id) {
          const nextBreaking = !a.isBreaking;
          if (nextBreaking) {
            triggerBreakingNewsAlert(
              `🚨 ÚLTIMA HORA: ${a.title}`,
              a.summary || a.subtitle,
              a.id
            );
          }
          return { ...a, isBreaking: nextBreaking };
        }
        return a;
      });
    });
  };

  // Sponsors & Advertising Manager
  const addSponsor = (newSpData: Omit<LocalSponsor, 'id'>) => {
    const newSp: LocalSponsor = {
      ...newSpData,
      id: `sp-${Date.now()}`,
      active: newSpData.active !== undefined ? newSpData.active : true
    };
    setSponsors(prev => [newSp, ...prev]);
  };

  const updateSponsor = (updatedSp: LocalSponsor) => {
    setSponsors(prev => prev.map(s => s.id === updatedSp.id ? updatedSp : s));
  };

  const deleteSponsor = (id: string) => {
    setSponsors(prev => prev.filter(s => s.id !== id));
  };

  const toggleSponsorActive = (id: string) => {
    setSponsors(prev => prev.map(s => s.id === id ? { ...s, active: s.active === false ? true : false } : s));
  };

  // Live Site Texts Editor
  const updateSiteTexts = (partial: Partial<SiteTexts>) => {
    setSiteTexts(prev => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem('debate_site_texts', JSON.stringify(updated));
      } catch (e) {
        console.warn(e);
      }
      return updated;
    });
  };

  const resetSiteTexts = () => {
    setSiteTexts(DEFAULT_SITE_TEXTS);
    try {
      localStorage.removeItem('debate_site_texts');
    } catch (e) {
      console.warn(e);
    }
  };

  const deleteComment = (id: string) => {
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const publishClassified = (newAdData: Omit<ClassifiedAd, 'id' | 'createdAt'>) => {
    const newAd: ClassifiedAd = {
      ...newAdData,
      id: `clf-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setClassifieds(prev => [newAd, ...prev]);
  };

  const togglePushNotifications = () => {
    setPushEnabled(prev => {
      const next = !prev;
      localStorage.setItem('debate_calentano_push_enabled', String(next));
      return next;
    });
  };

  const markAlertsAsRead = () => {
    setUnreadAlertsCount(0);
  };

  const triggerBreakingNewsAlert = (title: string, body: string, articleId?: string) => {
    const newAlert: PushAlert = {
      id: `alt-${Date.now()}`,
      title,
      body,
      category: 'Alerta Comunitaria',
      timestamp: 'Justo ahora',
      urgent: true,
      articleId
    };
    setAlerts(prev => [newAlert, ...prev]);
    setUnreadAlertsCount(prev => prev + 1);
  };

  // Batch publishing from Word document Bot
  const publishBatchArticles = (parsedList: ParsedWordArticle[], sourceDocName?: string) => {
    if (parsedList.length === 0) return { publishedCount: 0, headlineTitle: '' };

    const hasFeatured = parsedList.some(p => p.isFeatured);
    let headlineTitle = '';

    const newArticles: Article[] = parsedList.map((parsed, idx) => {
      const isThisFeatured = parsed.isFeatured || (!hasFeatured && idx === 0);
      if (isThisFeatured) {
        headlineTitle = parsed.title;
      }
      return {
        id: `art-doc-${Date.now()}-${idx}`,
        title: parsed.title,
        subtitle: parsed.subtitle,
        content: parsed.content,
        summary: parsed.summary,
        author: parsed.author,
        authorRole: parsed.authorRole,
        municipality: parsed.municipality,
        category: parsed.category,
        imageUrl: parsed.imageUrl || 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1200&q=80',
        imageCaption: parsed.imageCaption || '',
        publishedAt: 'Hoy • ' + new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        isBreaking: parsed.isBreaking || isThisFeatured,
        isFeatured: isThisFeatured,
        isPremiumExclusive: false,
        viewsCount: 1,
        likesCount: 0,
        dislikesCount: 0,
        readingTimeMinutes: parsed.readingTimeMinutes,
        tags: [parsed.municipality, parsed.category]
      };
    });

    // If there's a new featured article, unfeature older ones
    setArticles(prev => {
      const updatedPrev = headlineTitle ? prev.map(a => ({ ...a, isFeatured: false })) : prev;
      return [...newArticles, ...updatedPrev];
    });

    // Save Daily Edition to persistent database
    const newEdition: DailyEdition = {
      id: `edicion-${Date.now()}`,
      dateStr: new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
      editionNumber: 10482 + dailyEditions.length,
      headlineArticleTitle: headlineTitle || newArticles[0].title,
      articlesCount: newArticles.length,
      articles: newArticles,
      createdAt: new Date().toISOString(),
      sourceDocName: sourceDocName || 'Documento Word Procesado'
    };

    setDailyEditions(prev => [newEdition, ...prev]);

    // Push alert for frontpage
    if (headlineTitle) {
      triggerBreakingNewsAlert(
        `📰 NOTA PRINCIPAL: ${headlineTitle}`,
        'Nueva nota de portada publicada por el Bot de Redacción en El Debate de los Calentanos.'
      );
    }

    return {
      publishedCount: newArticles.length,
      headlineTitle: headlineTitle || newArticles[0].title
    };
  };

  const loadEdition = (editionId: string) => {
    const targetEdition = dailyEditions.find(e => e.id === editionId);
    if (targetEdition && targetEdition.articles.length > 0) {
      setArticles(targetEdition.articles);
    }
  };

  const createDailyEditionBackup = (sourceDocName?: string): DailyEdition => {
    const featured = articles.find(a => a.isFeatured) || articles[0];
    const newEdition: DailyEdition = {
      id: `edicion-${Date.now()}`,
      dateStr: new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()),
      editionNumber: 10482 + dailyEditions.length,
      headlineArticleTitle: featured ? featured.title : 'Edición General',
      articlesCount: articles.length,
      articles: [...articles],
      createdAt: new Date().toISOString(),
      sourceDocName: sourceDocName || 'Archivo Manual de Edición'
    };
    setDailyEditions(prev => [newEdition, ...prev]);
    return newEdition;
  };

  // Personalized Recommendation Engine:
  // Recommends articles based on the user's top categories and municipalities read
  const recommendedArticles = React.useMemo(() => {
    const topCategories = Object.entries(readingStats.favoriteCategories)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    if (topCategories.length === 0) {
      // Return featured or top viewed articles
      return articles.slice(0, 4);
    }

    const unreadOrFavorite = articles.filter(art => {
      // Prioritize articles belonging to favorite categories
      return topCategories.includes(art.category);
    });

    if (unreadOrFavorite.length < 3) {
      return articles.slice(0, 4);
    }

    return unreadOrFavorite.slice(0, 4);
  }, [articles, readingStats.favoriteCategories]);

  return (
    <NewspaperContext.Provider
      value={{
        articles,
        classifieds,
        events,
        sponsors,
        alerts,
        comments,
        offlineArticles,
        isOfflineArticle,
        toggleSaveOffline,
        dataSaverMode,
        setDataSaverMode,
        isOnline,
        themeMode,
        setThemeMode,
        fontSize,
        setFontSize,
        currentTab,
        setCurrentTab,
        selectedMunicipality,
        setSelectedMunicipality,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedArticle,
        openArticle,
        closeArticle,
        userReactions,
        reactToArticle,
        addComment,
        getArticleComments,
        publishArticle,
        updateArticle,
        deleteArticle,
        toggleFeatureArticle,
        toggleArticleBreaking,
        deleteComment,
        publishClassified,
        addSponsor,
        updateSponsor,
        deleteSponsor,
        toggleSponsorActive,
        siteTexts,
        updateSiteTexts,
        resetSiteTexts,
        readingStats,
        recommendedArticles,
        isPremium,
        setIsPremium,
        subscriptionPlan,
        setSubscriptionPlan,
        pushEnabled,
        togglePushNotifications,
        unreadAlertsCount,
        markAlertsAsRead,
        triggerBreakingNewsAlert,
        isAdminAuthenticated,
        verifyAdminPassword,
        logoutAdmin,
        adminModalOpen,
        setAdminModalOpen,
        dailyEditions,
        publishBatchArticles,
        loadEdition,
        createDailyEditionBackup
      }}
    >
      {children}
    </NewspaperContext.Provider>
  );
};

export const useNewspaper = () => {
  const context = useContext(NewspaperContext);
  if (!context) {
    throw new Error('useNewspaper must be used within a NewspaperProvider');
  }
  return context;
};
