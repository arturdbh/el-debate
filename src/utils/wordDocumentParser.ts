import mammoth from 'mammoth';
import { ParsedWordArticle, RegionMunicipality, ArticleCategory } from '../types/newspaper';

// Authentic regional fallback photos for Tierra Caliente
const REGIONAL_PHOTO_PRESETS = [
  {
    theme: 'ganado',
    url: 'https://images.unsplash.com/photo-1546445317-29f4545e9d53?auto=format&fit=crop&w=1200&q=80',
    caption: 'Ganado cebú y suizo en corrales de exposición regional.'
  },
  {
    theme: 'rio',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    caption: 'Vista del caudal del Río Balsas en su paso por Ciudad Altamirano y Coyuca.'
  },
  {
    theme: 'cultura',
    url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    caption: 'Celebración y música tradicional calentana con violín y guitarra panzona.'
  },
  {
    theme: 'campo',
    url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    caption: 'Labores de cultivo de maíz y ajonjolí en vegas de riego.'
  },
  {
    theme: 'comercio',
    url: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80',
    caption: 'Actividad comercial matutina en el centro de Altamirano.'
  }
];

export interface DocxParseResult {
  articles: ParsedWordArticle[];
  extractedImagesCount: number;
  featuredArticleIndex: number;
  rawText: string;
}

/**
 * Extracts raw text and base64 images from a Word (.docx) file
 */
export async function parseWordFile(file: File): Promise<DocxParseResult> {
  const arrayBuffer = await file.arrayBuffer();
  const extractedImages: string[] = [];

  // Convert to HTML and capture inline images
  let htmlResult: mammoth.MammothResult;
  try {
    htmlResult = await mammoth.convertToHtml(
      { arrayBuffer },
      {
        convertImage: mammoth.images.inline((element: any) => {
          return element.read('base64').then((imageBuffer: string) => {
            const contentType = element.contentType || 'image/jpeg';
            const dataUrl = `data:${contentType};base64,${imageBuffer}`;
            extractedImages.push(dataUrl);
            return { src: dataUrl };
          });
        })
      }
    );
  } catch (err) {
    console.warn('HTML extraction warning, falling back to raw text', err);
    htmlResult = { value: '', messages: [] };
  }

  // Also extract plain text to analyze sections reliably
  const textResult = await mammoth.extractRawText({ arrayBuffer });
  const rawText = textResult.value || '';

  return segmentArticlesFromText(rawText, extractedImages, file.name);
}

/**
 * Parses raw text (e.g. pasted directly or extracted from Word) into structured articles
 */
export function segmentArticlesFromText(
  rawText: string,
  images: string[] = [],
  sourceFileName?: string
): DocxParseResult {
  // Normalize text lines
  const cleanText = rawText.replace(/\r\n/g, '\n').trim();

  // Try splitting by known delimiters (e.g. "NOTA PRINCIPAL", "NOTA 1:", "---", "###", "TITULAR:")
  let rawBlocks: string[] = [];

  const explicitDelimiters = /(?=(?:^|\n)(?:\[(?:NOTA|ARTÍCULO)[^\]]*\]|NOTA(?:\s+PRINCIPAL|\s+\d+)?(?:\s*:|\s*-)|\*{2,}|\-{3,}|#{2,}|TITULAR(?:\s+DEL\s+DÍA|\s*:)))/i;
  
  if (explicitDelimiters.test(cleanText)) {
    rawBlocks = cleanText.split(explicitDelimiters).map(b => b.trim()).filter(b => b.length > 30);
  } else {
    // Split by double line breaks if blocks are long enough
    const doubleBreakBlocks = cleanText.split(/\n\s*\n\s*\n/).map(b => b.trim()).filter(b => b.length > 50);
    if (doubleBreakBlocks.length > 1) {
      rawBlocks = doubleBreakBlocks;
    } else {
      // Single article or fallback
      rawBlocks = [cleanText];
    }
  }

  const parsedArticles: ParsedWordArticle[] = [];
  let featuredIndex = -1;

  rawBlocks.forEach((block, index) => {
    const lines = block.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    if (lines.length === 0) return;

    const clues: string[] = [];

    // Check if marked as Principal
    const isExplicitlyPrincipal = /(?:NOTA\s*PRINCIPAL|PORTADA|TITULAR\s*DEL\s*DÍA|DESTACADA|PRIMERA\s*PLANA|NOTA\s*1\b)/i.test(block);
    if (isExplicitlyPrincipal) {
      clues.push('Marcada como Nota Principal en el documento');
    }

    // Clean first line to extract Title
    let titleLine = lines[0];
    // Remove tags like "[NOTA PRINCIPAL]" or "NOTA 1:"
    titleLine = titleLine.replace(/^\[[^\]]+\]\s*/, '')
      .replace(/^NOTA(?:\s*PRINCIPAL|\s*\d+)?\s*[:\-]\s*/i, '')
      .replace(/^TITULAR(?:\s*DEL\s*DÍA)?\s*[:\-]\s*/i, '')
      .replace(/^#+\s*/, '')
      .trim();

    // If first line was just a label, take the next line
    let contentStartIndex = 1;
    if (titleLine.length < 10 && lines.length > 1) {
      titleLine = lines[1];
      contentStartIndex = 2;
    }

    if (!titleLine || titleLine.length < 5) {
      titleLine = `Crónica Calentana #${index + 1}`;
    }

    // Extract Subtitle / Bajada
    let subtitle = '';
    if (lines.length > contentStartIndex && lines[contentStartIndex].length > 15 && lines[contentStartIndex].length < 280) {
      subtitle = lines[contentStartIndex].replace(/^[–\-—]\s*/, '');
      contentStartIndex++;
    } else {
      subtitle = `Reporte especial de la edición de hoy en la cuenca del Río Balsas.`;
    }

    // Extract remaining content
    const contentLines = lines.slice(contentStartIndex);
    const content = contentLines.join('\n\n') || block;

    // Detect Municipality
    let detectedMunicipality: RegionMunicipality = 'Cd. Altamirano (Pungarabato)';
    const blockLower = block.toLowerCase();
    if (blockLower.includes('coyuca')) {
      detectedMunicipality = 'Coyuca de Catalán';
      clues.push('Municipio: Coyuca de Catalán');
    } else if (blockLower.includes('tlapehuala')) {
      detectedMunicipality = 'Tlapehuala';
      clues.push('Municipio: Tlapehuala');
    } else if (blockLower.includes('cutzamala')) {
      detectedMunicipality = 'Cutzamala de Pinzón';
      clues.push('Municipio: Cutzamala de Pinzón');
    } else if (blockLower.includes('arcelia')) {
      detectedMunicipality = 'Arcelia';
      clues.push('Municipio: Arcelia');
    } else if (blockLower.includes('ajuchitl')) {
      detectedMunicipality = 'Ajuchitlán del Progreso';
      clues.push('Municipio: Ajuchitlán del Progreso');
    } else if (blockLower.includes('totolapan')) {
      detectedMunicipality = 'San Miguel Totolapan';
      clues.push('Municipio: San Miguel Totolapan');
    } else if (blockLower.includes('zirandaro') || blockLower.includes('zirándaro')) {
      detectedMunicipality = 'Zirándaro de los Chávez';
      clues.push('Municipio: Zirándaro de los Chávez');
    } else {
      clues.push('Municipio: Cd. Altamirano (Pungarabato)');
    }

    // Detect Category
    let detectedCategory: ArticleCategory = 'Región y Municipios';
    if (/(?:vaca|ganad|toro|cebú|suizo|semill|maíz|siembr|cosech|agro|campes|pastoreo|balsas|riego|fertilizante)/i.test(blockLower)) {
      detectedCategory = 'Campo y Ganadería';
      clues.push('Categoría: Campo y Ganadería');
    } else if (/(?:sombrero|fiesta|patronal|jaripeo|tradici|cultur|violín|música|gusto|baile|gastronom)/i.test(blockLower)) {
      detectedCategory = 'Cultura y Tradición';
      clues.push('Categoría: Cultura y Tradición');
    } else if (/(?:comercio|negocio|tianguis|remesas|dólar|precio|mercado|econom)/i.test(blockLower)) {
      detectedCategory = 'Economía y Comercio';
      clues.push('Categoría: Economía y Comercio');
    } else if (/(?:fútbol|liga|béisbol|torneo|deport|cancha|partido)/i.test(blockLower)) {
      detectedCategory = 'Deportes Calentanos';
      clues.push('Categoría: Deportes Calentanos');
    } else if (/(?:urgente|alerta|última hora|accidente|río crece|precaución)/i.test(blockLower)) {
      detectedCategory = 'Última Hora';
      clues.push('Categoría: Última Hora');
    }

    // Detect Author
    let author = 'Redacción de El Debate';
    let authorRole = 'Mesa de Redacción';
    const authorMatch = block.match(/(?:Por|Autor|Corresponsal|Redacción)[:\s]+([^\n,]+)/i);
    if (authorMatch && authorMatch[1].trim().length > 3) {
      author = authorMatch[1].trim();
      authorRole = 'Corresponsal Regional';
      clues.push(`Autor: ${author}`);
    }

    // Assign photo: use extracted image if available, else choose preset
    let assignedImage = '';
    let imageCaption = '';
    if (images[index]) {
      assignedImage = images[index];
      imageCaption = `Fotografía adjunta en el documento Word para: ${titleLine}`;
      clues.push('Foto extraída directamente del archivo Word');
    } else {
      const preset = REGIONAL_PHOTO_PRESETS[index % REGIONAL_PHOTO_PRESETS.length];
      assignedImage = preset.url;
      imageCaption = preset.caption;
      clues.push('Foto regional asignada automáticamente');
    }

    // Summary calculation
    const words = content.split(/\s+/).filter(w => w.length > 0);
    const summary = words.slice(0, 35).join(' ') + (words.length > 35 ? '...' : '');
    const readingTimeMinutes = Math.max(1, Math.ceil(words.length / 160));

    const isFeatured = isExplicitlyPrincipal || (featuredIndex === -1 && index === 0);
    if (isFeatured && featuredIndex === -1) {
      featuredIndex = index;
    }

    parsedArticles.push({
      tempId: `parsed-${Date.now()}-${index}`,
      title: titleLine,
      subtitle,
      content,
      summary,
      author,
      authorRole,
      municipality: detectedMunicipality,
      category: detectedCategory,
      imageUrl: assignedImage,
      imageCaption,
      isFeatured,
      isBreaking: isFeatured || detectedCategory === 'Última Hora',
      readingTimeMinutes,
      detectedClues: clues
    });
  });

  // Ensure at least one is featured
  if (featuredIndex === -1 && parsedArticles.length > 0) {
    parsedArticles[0].isFeatured = true;
    featuredIndex = 0;
  }

  return {
    articles: parsedArticles,
    extractedImagesCount: images.length,
    featuredArticleIndex: featuredIndex,
    rawText
  };
}
