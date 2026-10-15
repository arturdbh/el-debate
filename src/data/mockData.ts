import { Article, ClassifiedAd, CommunityEvent, LocalSponsor, PushAlert } from '../types/newspaper';

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    title: 'Comienza la histórica Expo Ganadera de San Lucas y Altamirano con récord de sementales cebú y suizo',
    subtitle: 'Ganaderos de toda la cuenca del Río Balsas se congregan en el recinto ferial para reactivar el intercambio genético y subastas pecuarias.',
    summary: 'Más de 350 cabezas de ganado de registro se exhiben desde este fin de semana en Ciudad Altamirano. El evento incluye juzgamiento de ganado y muestra de forrajes de temporal.',
    content: `Ciudad Altamirano, Gro.— Con una afluencia de más de cuatro mil productores pecuarios de los nueve municipios de Tierra Caliente y zonas limítrofes de Michoacán, dio inicio la quincuagésima edición de la Muestra Ganadera Regional en las instalaciones de la Unión Ganadera Local de Pungarabato.

El presidente de la asociación destacó que este año se han redoblado esfuerzos sanitarios para garantizar animales libres de brucelosis y tuberculosis, permitiendo una derrama económica directa en hoteles, fondas de comida tradicional y talleres de ensilaje.

"El calor de mayo no detiene al calentano que trabaja la tierra y cuida sus potreros. Hoy estamos demostrando que la ganadería de doble propósito en el Balsas tiene futuro, con cruzas resistentes al estiaje y una calidad cárnica inigualable", apuntó Don Valente Salgado, productor con más de cuatro décadas en el oficio.

Durante la inauguración se premiaron a los mejores ejemplares de la raza Brahman gris y Suizo Americano adaptado al trópico seco. Mañana domingo se llevará a cabo el tradicional tianguis de sementales subsidiados con apoyo de créditos comunitarios.`,
    author: 'J. Carmen Benítez',
    authorRole: 'Corresponsal en Pungarabato',
    municipality: 'Cd. Altamirano (Pungarabato)',
    category: 'Campo y Ganadería',
    imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Ganado cebú de alta genética presentado en el ruedo de la Unión Ganadera en Altamirano.',
    publishedAt: '2026-10-10 07:30',
    isBreaking: false,
    isFeatured: true,
    isPremiumExclusive: false,
    viewsCount: 1420,
    likesCount: 89,
    dislikesCount: 3,
    readingTimeMinutes: 4,
    tags: ['Ganadería', 'Expo Altamirano', 'Río Balsas', 'Economía Rural']
  },
  {
    id: 'art-2',
    title: 'Monitorean caudal del Río Balsas tras apertura programada de vertedores en presa El Caracol',
    subtitle: 'Protección Civil emite aviso preventivo para pescadores y ejidatarios ribereños desde Coyuca de Catalán hasta Zirándaro.',
    summary: 'La CONAGUA y cuerpos de rescate coordinan vigilancia ribereña ante el incremento controlado de 400 metros cúbicos por segundo.',
    content: `Coyuca de Catalán, Gro.— La dirección regional de Protección Civil en Tierra Caliente implementó un cerco de monitoreo permanente a lo largo de la ribera del Río Balsas y sus afluentes, derivado del desfogue preventivo anunciado por la gerencia hidroeléctrica.

Las autoridades hicieron un llamado enérgico a las cooperativas de pescadores de mojarra y bagre, así como a los transportistas de chalanes y lanchas que conectan comunidades apartadas, a abstenerse de navegar en horario vespertino.

En comunidades bajas como Las Querendas, Changata y El Cundancito, comisarios ejidales reportan que los comités de vigilancia vecinal se mantienen en alerta por medio de radios de frecuencia civil y bocinas comunitarias. Hasta el momento no se reportan afectaciones a parcelas sembradas de melón ni pérdidas de ganado.`,
    author: 'Rosaura Macedo',
    authorRole: 'Redactora en Cuenca del Balsas',
    municipality: 'Coyuca de Catalán',
    category: 'Última Hora',
    imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'El imponente Río Balsas a su paso por el puente que une Coyuca con Ciudad Altamirano.',
    publishedAt: '2026-10-10 09:15',
    isBreaking: true,
    isFeatured: true,
    isPremiumExclusive: false,
    viewsCount: 2890,
    likesCount: 164,
    dislikesCount: 5,
    readingTimeMinutes: 3,
    tags: ['Protección Civil', 'Río Balsas', 'Coyuca', 'Alerta']
  },
  {
    id: 'art-3',
    title: 'Artesanos de Tlapehuala baten récord en exportación del Sombrero Calentano de Palma Real',
    subtitle: 'El icónico accesorio de 10 a 50 vueltas conquista mercados en Estados Unidos y ferias culturales en Europa.',
    summary: 'El taller colectivo de tejedoras de San José Poli y Tlapehuala consolidó una cooperativa para vender directamente a paisanos migrantes en California, Texas e Illinois.',
    content: `Tlapehuala, Gro.— Considerado el símbolo de identidad más puro de la Tierra Caliente, el sombrero de cinta y de costura fina elaborado con palma del cerro ha registrado su mayor repunte de ventas en el último lustro.

Doña Hermelinda Albarrán, maestra artesana de 72 años, relata con orgullo cómo sus manos han trenzado desde los diez años: "Un buen sombrero calentano no se dobla ni con el sol bravo ni con la lluvia; te protege la frente y lleva el alma de nuestro pueblo. Hoy nuestros nietos en Chicago y Dallas lo lucen con la frente en alto en los bailes y jaripeos".

El presidente municipal anunció un nuevo fondo de apoyo municipal para adquirir hilo especial de algodón y máquinas de coser de pedal reforzadas, garantizando que el legado artesanal se enseñe en secundarias técnicas de la zona.`,
    author: 'Efraín Santamaría',
    authorRole: 'Cronista de Tradición y Cultura',
    municipality: 'Tlapehuala',
    category: 'Cultura y Tradición',
    imageUrl: 'https://images.unsplash.com/photo-1572307480813-ceb0e59d8325?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Manos artesanas trenzando la fina palma criolla en los portales de Tlapehuala.',
    publishedAt: '2026-10-09 16:40',
    isBreaking: false,
    isFeatured: false,
    isPremiumExclusive: true,
    viewsCount: 940,
    likesCount: 125,
    dislikesCount: 0,
    readingTimeMinutes: 5,
    tags: ['Tlapehuala', 'Sombrero Calentano', 'Artesanía', 'Tradición']
  },
  {
    id: 'art-4',
    title: 'Precios de garantía del maíz y frijol: Productores de Cutzamala exigen centros de acopio cercanos',
    subtitle: 'El grano blanco de temporal alcanza 6,850 pesos por tonelada en el mercado regional; urgen evitar el coyotaje.',
    summary: 'Campesinos de Cutzamala de Pinzón proponen que SEGALMEX instale un silo temporal para no tener que pagar fletes de más de tres horas.',
    content: `Cutzamala de Pinzón, Gro.— Ante la inminente cosecha de maíz criollo en las zonas de lomerío, productores agrícolas de más de veinte ejidos cutzamaltecos se reunieron en la Casa Ejidal para coordinar la defensa de precios justos.

Los líderes campesinos advirtieron que intermediarios foráneos ("coyotes") ya ofrecen comprar la cosecha a pie de milpa a precios muy inferiores, aprovechándose de la falta de bodegas secas en las comunidades más alejadas hacia el río Cutzamala.

"Si logramos consolidar el transporte comunitario de granos, cada familia campesina podrá retener hasta un 30% más de utilidad neta para comprar fertilizantes orgánicos y semillas para el siguiente ciclo", explicó el comisario ejidal Florencio Jaimes.`,
    author: 'J. Carmen Benítez',
    authorRole: 'Corresponsal en Pungarabato',
    municipality: 'Cutzamala de Pinzón',
    category: 'Campo y Ganadería',
    imageUrl: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Milpas de maíz en floración en la vega del río Cutzamala.',
    publishedAt: '2026-10-09 11:20',
    isBreaking: false,
    isFeatured: false,
    isPremiumExclusive: false,
    viewsCount: 1120,
    likesCount: 78,
    dislikesCount: 2,
    readingTimeMinutes: 4,
    tags: ['Cutzamala', 'Maíz', 'Precios de Garantía', 'Campo']
  },
  {
    id: 'art-5',
    title: 'Arcelia celebra el Encuentro de Tamboritas y Violines Calentanos con homenaje a Juan Reynoso',
    subtitle: 'Los sones y gustos de Tierra Caliente resonaron en la plaza principal ante familias de toda la región.',
    summary: 'Niñas y jóvenes violinistas interpretaron piezas clásicas como "El Gusto Calentano" y "La Tortolita", preservando el virtuosismo musical de la cuenca.',
    content: `Arcelia, Gro.— El Centro Cultural de Arcelia fue el escenario del vigésimo encuentro de música vernácula de Tierra Caliente, donde agrupaciones de violinistas, guitarreros y tamboriteros deleitaron a más de 1,500 asistentes.

El legado de Don Juan Reynoso Portillo, el 'Paganini de la Tierra Caliente', fue el eje central del festival. Maestros lauderos mostraron instrumentos tallados a mano con maderas finas de parota y cedro de la sierra calentana.

Los asistentes pudieron además disfrutar de la rica gastronomía local: uchepos con crema y queso cincho fresco, toqueres dorados al comal y el tradicional aporreado rojo con cecina salada en salsa de molcajete.`,
    author: 'Efraín Santamaría',
    authorRole: 'Cronista de Tradición y Cultura',
    municipality: 'Arcelia',
    category: 'Cultura y Tradición',
    imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Ensamble de son calentano en el quiosco central de Arcelia.',
    publishedAt: '2026-10-08 20:10',
    isBreaking: false,
    isFeatured: false,
    isPremiumExclusive: false,
    viewsCount: 880,
    likesCount: 142,
    dislikesCount: 1,
    readingTimeMinutes: 3,
    tags: ['Arcelia', 'Tamborita', 'Violín Calentano', 'Música Tradicional']
  },
  {
    id: 'art-6',
    title: 'Comercio de Ciudad Altamirano reporta reactivación del 25% gracias a tianguis dominical y envíos campesinos',
    subtitle: 'La Cámara de Comercio de Pungarabato destaca el flujo de circulante entre productores de queso, combas y melón.',
    summary: 'El primer cuadro de la ciudad y el mercado Salvador Santamaría reciben a compradores de municipios aledaños de Michoacán y Guerrero.',
    content: `Ciudad Altamirano, Gro.— La dinámica económica del centro comercial neurálgico de Tierra Caliente mostró números favorables este último trimestre, impulsada por las transacciones de contado de insumos veterinarios, refacciones automotrices y abarrotes al mayoreo.

Comerciantes del emblemático mercado central destacaron que el trueque y venta directa de semillas de combas, chile seco y carne seca sigue atrayendo a cientos de familias que viajan desde Zirándaro, Ajuchitlán y San Miguel Totolapan.`,
    author: 'Rosaura Macedo',
    authorRole: 'Redactora de Economía Local',
    municipality: 'Cd. Altamirano (Pungarabato)',
    category: 'Economía y Comercio',
    imageUrl: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'Actividad comercial matutina en el mercado central de Ciudad Altamirano.',
    publishedAt: '2026-10-08 14:00',
    isBreaking: false,
    isFeatured: false,
    isPremiumExclusive: false,
    viewsCount: 760,
    likesCount: 54,
    dislikesCount: 4,
    readingTimeMinutes: 3,
    tags: ['Comercio', 'Altamirano', 'Mercado Santamaría', 'Economía']
  }
];

export const INITIAL_CLASSIFIEDS: ClassifiedAd[] = [
  {
    id: 'clf-1',
    title: 'Toro semental Suizo Americano con registro y pruebas de fertilidad',
    category: 'Ganado y Animales',
    description: 'Edad: 30 meses. Excelente masa muscular, dócil, adaptado 100% al calor de Tierra Caliente. Vacunado con triple bovina y desparasitado. Ideal para mejorar producción lechera en potrero.',
    price: '$45,000 MXN',
    municipality: 'Cd. Altamirano (Pungarabato)',
    sellerName: 'Don Aurelio Pineda',
    sellerPhone: '767-102-3489',
    whatsapp: '527671023489',
    imageUrl: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-09',
    isFeatured: true,
    condition: 'Criollo de registro'
  },
  {
    id: 'clf-2',
    title: 'Tractor John Deere 5415 con rastra de 20 discos y arado',
    category: 'Maquinaria y Aperos',
    description: 'Motor diésel 4 cilindros, 75 HP, doble tracción (4x4). Horómetro con 3,200 horas reales. Llantas traseras con 80% de vida. Listo para barbechar y rastrear milpas.',
    price: '$385,000 MXN',
    municipality: 'Coyuca de Catalán',
    sellerName: 'Ing. Gilberto Duarte',
    sellerPhone: '767-115-8820',
    whatsapp: '527671158820',
    imageUrl: 'https://images.unsplash.com/photo-1530267981375-f0de937f5f13?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-08',
    isFeatured: true,
    condition: 'Usado en buen estado'
  },
  {
    id: 'clf-3',
    title: 'Semilla certificada de Maíz Blanco H-515 (bultos de 20 kg)',
    category: 'Semillas y Cosechas',
    description: 'Rendimiento probado en el trópico seco de 7 a 9 toneladas por hectárea con riego por goteo o temporal regular. Germinación superior al 95%. Entrega en bodega Cutzamala o flete acordado.',
    price: '$2,400 MXN / bulto',
    municipality: 'Cutzamala de Pinzón',
    sellerName: 'Agrícola Los Naranjos',
    sellerPhone: '767-108-9943',
    whatsapp: '527671089943',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-07',
    isFeatured: false,
    condition: 'Nuevo'
  },
  {
    id: 'clf-4',
    title: 'Camioneta Ford F-250 Super Duty para carga de ganado y forraje',
    category: 'Vehículos y Fletes',
    description: 'Modelo 2012, redilas ganaderas altas de fierro reforzado y piso antiderrapante. Transmisión manual, 8 cilindros. Papeles en regla, placas de Guerrero al corriente.',
    price: '$210,000 MXN',
    municipality: 'Arcelia',
    sellerName: 'Mateo Ocampo',
    sellerPhone: '732-104-5511',
    whatsapp: '527321045511',
    imageUrl: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-07',
    isFeatured: false,
    condition: 'Usado en buen estado'
  },
  {
    id: 'clf-5',
    title: 'Servicio de Inseminación Artificial Bovina y Ecografía Reproductiva',
    category: 'Servicios Rurales',
    description: 'Médico Veterinario Zootecnista disponible para visitas a ranchos y corrales en Pungarabato, Tlapehuala y Coyuca. Catálogo de toros Angus, Charolais, Simmental y Guzerat.',
    price: 'A convenir por lote',
    municipality: 'Tlapehuala',
    sellerName: 'MVZ. Cuauhtémoc Beltrán',
    sellerPhone: '767-120-7733',
    whatsapp: '527671207733',
    imageUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-06',
    isFeatured: true,
    condition: 'Nuevo'
  },
  {
    id: 'clf-6',
    title: 'Parcela de 4 hectáreas con derecho de pozo y concesión de agua del Balsas',
    category: 'Terrenos y Parcelas',
    description: 'Tierra negra de aluvión de primera calidad para cultivo de melón, sandía, mango o forraje verde hidropónico. Acceso pavimentado a 10 minutos de Altamirano. Certificado parcelario limpio.',
    price: '$780,000 MXN',
    municipality: 'Cd. Altamirano (Pungarabato)',
    sellerName: 'Familia Jaimes Bermúdez',
    sellerPhone: '767-111-4450',
    whatsapp: '527671114450',
    imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80',
    createdAt: '2026-10-05',
    isFeatured: false,
    condition: 'Usado en buen estado'
  }
];

export const INITIAL_EVENTS: CommunityEvent[] = [
  {
    id: 'evt-1',
    title: 'Gran Jaripeo Ranchero de las Fiestas de San Juan Bautista',
    sponsor: 'Ferretería y Aceros El Calentano',
    sponsorLogo: '🔨',
    description: 'Con la participación de las mejores 12 ganaderías de la región y la cuadrilla de jinetes Águilas de Tierra Caliente. Sonorizado por Banda La Tamborita de Oro. Habrá rifa de motosierra y motobomba para los asistentes.',
    date: 'Sábado 24 de Octubre, 2026',
    time: '18:00 hrs',
    location: 'Lienzo Charro de Ciudad Altamirano, Calzada Lázaro Cárdenas',
    municipality: 'Cd. Altamirano (Pungarabato)',
    category: 'Jaripeo y Baile',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    ticketInfo: 'Entrada General: $150 MXN (Niños entran gratis con sombrero)',
    highlight: 'Patrocinador oficial ofrece 10% de descuento en bombas de riego con boleto de entrada.'
  },
  {
    id: 'evt-2',
    title: 'Feria Tradicional del Sombrero Calentano y Gastronomía del Balsas',
    sponsor: 'Quesería y Forrajes Don Valente',
    sponsorLogo: '🧀',
    description: 'Exposición de sombreros de 50 vueltas, concurso del mejor queso cincho oreado, degustación de uchepos calentanos y concurso de violín tradicional. Evento 100% familiar para rescatar nuestras raíces.',
    date: '14 y 15 de Noviembre, 2026',
    time: '10:00 - 22:00 hrs',
    location: 'Zócalo Municipal de Tlapehuala',
    municipality: 'Tlapehuala',
    category: 'Cultura y Música',
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
    ticketInfo: 'Entrada Libre / Acceso Gratuito',
    highlight: 'Degustación patrocinada de más de 20 variedades de quesos y dulces de leche regionales.'
  },
  {
    id: 'evt-3',
    title: 'Torneo Regional de Fútbol Llanero "Copa Cuenca del Balsas"',
    sponsor: 'Taller Mecánico y Refaccionaria Pungarabato',
    sponsorLogo: '⚙️',
    description: 'Cuadrangular intermunicipal con escuadras de Altamirano, Coyuca, Arcelia y Cutzamala. Gran final transmitida y comentada en vivo a través de El Debate de los Calentanos.',
    date: 'Domingo 1 de Noviembre, 2026',
    time: '15:30 hrs',
    location: 'Unidad Deportiva de Coyuca de Catalán',
    municipality: 'Coyuca de Catalán',
    category: 'Torneo Deportivo',
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    ticketInfo: 'Boleto de cooperación: $30 MXN pro-fondo canchas comunitarias',
    highlight: 'Premio de $25,000 MXN en efectivo donado por el comité de comerciantes patrocinadores.'
  },
  {
    id: 'evt-4',
    title: 'Tianguis Agroecológico del Campo Calentano: Semillas Libres y Cosechas',
    sponsor: 'Veterinaria del Balsas y Fertilizantes Orgánicos',
    sponsorLogo: '🌱',
    description: 'Intercambio directo de semillas nativas de maíz jala y pozolero, ajonjolí criollo, miel pura de abeja de la sierra y talleres prácticos de composta con esquilmos de maíz.',
    date: 'Viernes 6 de Noviembre, 2026',
    time: '08:00 - 16:00 hrs',
    location: 'Plaza del Minero, Arcelia, Gro.',
    municipality: 'Arcelia',
    category: 'Tianguis Campesino',
    imageUrl: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=800&q=80',
    ticketInfo: 'Entrada Gratuita para productores y público en general',
    highlight: 'Asesoría técnica y análisis gratuito de suelo patrocinado por el Laboratorio Agrícola de Guerrero.'
  }
];

export const LOCAL_SPONSORS: LocalSponsor[] = [
  {
    id: 'sp-1',
    businessName: 'Ferretería y Aceros El Calentano',
    tagline: 'Láminas, varilla, malla ciclónica y bombas de riego sumergibles para el Balsas',
    description: 'Más de 35 años equipando los ranchos y construcciones de Pungarabato y toda la región. Entregas a domicilio en caminos de terracería sin costo extra.',
    category: 'Ferretería & Campo',
    municipality: 'Cd. Altamirano',
    phone: '767-102-4500',
    badge: 'Patrocinador Platino',
    bannerType: 'leaderboard',
    discountOffer: '15% de descuento mencionando que lo viste en El Debate de los Calentanos'
  },
  {
    id: 'sp-2',
    businessName: 'Sombrería Tradición Tlapehualense',
    tagline: 'El auténtico sombrero calentano cosido a mano desde 1948',
    description: 'Envíos a todo México y Estados Unidos por paquetería express. Calidad garantizada en palma real fina de 10 a 60 vueltas.',
    category: 'Cultura & Artesanías',
    municipality: 'Tlapehuala',
    phone: '767-113-9000',
    badge: 'Patrocinador de Identidad Regional',
    bannerType: 'sidebar',
    discountOffer: 'Horma y toquilla grabada personalizada gratis en compras superiores a $800'
  },
  {
    id: 'sp-3',
    businessName: 'Veterinaria y Forrajes La Cuenca',
    tagline: 'Medicamentos pecuarios, sales mineralizadas y alimentos balanceados',
    description: 'Atención médica veterinaria 24 horas para urgencias de partos en ganado y caballos. Sucursales en Altamirano y Arcelia.',
    category: 'Salud Pecuaria',
    municipality: 'Cd. Altamirano',
    phone: '767-105-2211',
    badge: 'Socio Comercial del Periódico',
    bannerType: 'in-feed',
    discountOffer: 'Bulto de sal mineralizada al 2x1 en la compra de 5 costales de forraje'
  }
];

export const INITIAL_ALERTS: PushAlert[] = [
  {
    id: 'alt-1',
    title: '⚠️ Alerta Hidrológica Río Balsas',
    body: 'Incremento moderado de caudal por desfogue preventivo en presa El Caracol. Se pide a pescadores extremar precauciones.',
    category: 'Seguridad y Protección Civil',
    timestamp: 'Hace 25 min',
    urgent: true,
    articleId: 'art-2'
  },
  {
    id: 'alt-2',
    title: '📢 Abren ventanilla de subsidio a sementales',
    body: 'Inicia el registro para el apoyo de adquisición de toros cebú y suizo en la Expo Altamirano.',
    category: 'Campo y Ganadería',
    timestamp: 'Hace 2 horas',
    urgent: false,
    articleId: 'art-1'
  },
  {
    id: 'alt-3',
    title: '⛅ Pronóstico del Clima: Ola de calor 39°C',
    body: 'Se pronostica tarde calurosa en la región calentana. Manténgase hidratado y proteja el ganado en sombras.',
    category: 'Clima Regional',
    timestamp: 'Hace 4 horas',
    urgent: false
  }
];

export const INITIAL_COMMENTS = [
  {
    id: 'c-1',
    articleId: 'art-1',
    authorName: 'Don Heriberto Salgado',
    authorLocation: 'Ranchería El Pinzán, Coyuca',
    isPremiumSubscriber: true,
    content: '¡Qué gran orgullo ver que la ganadería calentana sigue en pie! Nosotros llevamos dos toretes suizos a la subasta. Excelente cobertura de El Debate.',
    timestamp: 'Hoy, 08:45 am',
    status: 'approved' as const,
    likes: 12
  },
  {
    id: 'c-2',
    articleId: 'art-1',
    authorName: 'Maestra Guillermina',
    authorLocation: 'Cd. Altamirano',
    isPremiumSubscriber: false,
    content: 'Felicidades a los organizadores. Ojalá que también se apoye a los pequeños productores de traspatio con chivas y aves de postura.',
    timestamp: 'Hoy, 09:12 am',
    status: 'approved' as const,
    likes: 8
  },
  {
    id: 'c-3',
    articleId: 'art-2',
    authorName: 'Capitán pescador Beto',
    authorLocation: 'Las Querendas',
    isPremiumSubscriber: true,
    content: 'Gracias por avisar a tiempo por el periódico digital. Ya guardamos las redes y sacamos las pangas a la orilla alta. Muy útil este medio.',
    timestamp: 'Hoy, 09:40 am',
    status: 'approved' as const,
    likes: 19
  }
];
